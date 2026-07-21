import { z } from 'zod'
import { prisma } from '@companio/db'
import { compilePrompt } from '../prompts/promptRegistry'
import { providerRouter } from './providerRouter'

export const aiOrchestrator = {
  async executePrompt<T>(
    promptName: string,
    variables: Record<string, string>,
    responseSchema: z.ZodType<T>,
    userId?: string,
  ): Promise<T> {
    const startTime = Date.now()
    const { prompt, version } = compilePrompt(promptName, variables)

    const isJsonMode = responseSchema !== undefined
    let responseText = ''
    let inputTokens: number | undefined
    let outputTokens: number | undefined
    let providerName = 'Mock'
    let modelName = 'mock-model-v1'

    try {
      const routed = await providerRouter.routeRequest(
        prompt,
        {
          jsonMode: isJsonMode,
          temperature: 0.2,
        },
        promptName,
      )

      responseText = routed.response.text
      inputTokens = routed.response.inputTokens
      outputTokens = routed.response.outputTokens
      providerName = routed.providerName
      modelName = routed.modelName
    } catch (err: any) {
      const durationMs = Date.now() - startTime
      await prisma.aiUsageLog.create({
        data: {
          userId,
          provider: providerName,
          model: modelName,
          promptName,
          promptVersion: version,
          durationMs,
          success: false,
          errorMsg: err.message || 'Router execution failed',
        },
      })
      throw new Error(`AI generation failed through router: ${err.message || 'Unknown error'}`)
    }

    const durationMs = Date.now() - startTime

    if (!responseText) {
      await prisma.aiUsageLog.create({
        data: {
          userId,
          provider: providerName,
          model: modelName,
          promptName,
          promptVersion: version,
          durationMs,
          success: false,
          errorMsg: 'Empty response returned from router',
        },
      })
      throw new Error('AI generation returned an empty response.')
    }

    try {
      let parsedData: any = responseText

      if (isJsonMode) {
        const cleanJsonText = responseText
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .trim()
        parsedData = JSON.parse(cleanJsonText)
      }

      const validatedOutput = responseSchema.parse(parsedData)

      await prisma.aiUsageLog.create({
        data: {
          userId,
          provider: providerName,
          model: modelName,
          promptName,
          promptVersion: version,
          durationMs,
          inputTokens,
          outputTokens,
          success: true,
        },
      })

      return validatedOutput
    } catch (validationErr: any) {
      console.error('AI Response Schema Validation failed:', validationErr)

      await prisma.aiUsageLog.create({
        data: {
          userId,
          provider: providerName,
          model: modelName,
          promptName,
          promptVersion: version,
          durationMs,
          success: false,
          errorMsg: `Zod Validation Error: ${validationErr.message}`,
        },
      })

      throw new Error(`AI generated invalid output format: ${validationErr.message}`)
    }
  },
}
