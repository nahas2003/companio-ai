import { z } from 'zod'
import { prisma } from '@companio/db'
import { compilePrompt } from '../prompts/promptRegistry'
import { GeminiProviderAdapter } from '../adapters/geminiAdapter'
import { MockProviderAdapter } from '../adapters/mockAdapter'
import type { AiProvider } from '../types/ai.types'

function getActiveProvider(): AiProvider {
  const geminiKey = process.env.GEMINI_API_KEY
  if (geminiKey && geminiKey.trim().length > 0) {
    return new GeminiProviderAdapter(geminiKey)
  }
  return new MockProviderAdapter()
}

export const aiOrchestrator = {
  async executePrompt<T>(
    promptName: string,
    variables: Record<string, string>,
    responseSchema: z.ZodType<T>,
    userId?: string,
  ): Promise<T> {
    const startTime = Date.now()
    const provider = getActiveProvider()

    const { prompt, version } = compilePrompt(promptName, variables)

    const maxRetries = 3
    let attempt = 0
    let lastError: any = null
    let responseText = ''
    let inputTokens: number | undefined
    let outputTokens: number | undefined

    const isJsonMode = responseSchema !== undefined

    while (attempt < maxRetries) {
      try {
        attempt++
        console.log(
          `AI execution attempt ${attempt}/${maxRetries} using ${provider.getName()} (${provider.getModel()})...`,
        )

        const requestPromise = provider.generateText(prompt, {
          jsonMode: isJsonMode,
          temperature: 0.2,
        })

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error('AI Provider request timeout after 30 seconds limit')),
            30000,
          ),
        )

        const response = await Promise.race([requestPromise, timeoutPromise])

        responseText = response.text
        inputTokens = response.inputTokens
        outputTokens = response.outputTokens
        break
      } catch (err: any) {
        lastError = err
        console.warn(`Attempt ${attempt} failed: ${err.message || err}`)

        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 500
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }
    }

    const durationMs = Date.now() - startTime

    if (!responseText) {
      await prisma.aiUsageLog.create({
        data: {
          userId,
          provider: provider.getName(),
          model: provider.getModel(),
          promptName,
          promptVersion: version,
          durationMs,
          success: false,
          errorMsg: lastError?.message || 'Execution failed or empty response',
        },
      })
      throw new Error(
        `AI generation failed after ${maxRetries} attempts. Last error: ${lastError?.message || 'Unknown error'}`,
      )
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
          provider: provider.getName(),
          model: provider.getModel(),
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
          provider: provider.getName(),
          model: provider.getModel(),
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
