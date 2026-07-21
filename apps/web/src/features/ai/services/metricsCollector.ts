import { prisma } from '@companio/db'

export const metricsCollector = {
  async logRequest(payload: {
    provider: string
    model: string
    promptName: string
    durationMs: number
    inputTokens?: number
    outputTokens?: number
    cost?: number
    success: boolean
    errorMsg?: string
  }) {
    try {
      await prisma.providerLog.create({
        data: {
          provider: payload.provider,
          model: payload.model,
          promptName: payload.promptName,
          durationMs: payload.durationMs,
          inputTokens: payload.inputTokens ?? null,
          outputTokens: payload.outputTokens ?? null,
          cost: payload.cost ?? null,
          success: payload.success,
          errorMsg: payload.errorMsg ?? null,
        },
      })
    } catch (err) {
      console.error('Failed to log request metrics to database:', err)
    }
  },
}
