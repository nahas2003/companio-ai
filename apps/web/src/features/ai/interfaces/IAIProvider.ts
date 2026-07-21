import { AiResponse } from '../types/ai.types'

export interface IAIProvider {
  generateText(
    prompt: string,
    options?: { jsonMode?: boolean; temperature?: number },
  ): Promise<AiResponse>
  getName(): string
  getModel(): string
}
