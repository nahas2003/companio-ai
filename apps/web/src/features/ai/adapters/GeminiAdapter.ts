import { GoogleGenerativeAI } from '@google/generative-ai'
import { IAIProvider } from '../interfaces/IAIProvider'
import { AiResponse } from '../types/ai.types'

export class GeminiProviderAdapter implements IAIProvider {
  private genAI: GoogleGenerativeAI
  private modelName: string = 'gemini-2.0-flash'

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Gemini API key is required to initialize adapter.')
    }
    this.genAI = new GoogleGenerativeAI(apiKey)
  }

  async generateText(
    prompt: string,
    options?: { jsonMode?: boolean; temperature?: number },
  ): Promise<AiResponse> {
    const model = this.genAI.getGenerativeModel({ model: this.modelName })

    const generationConfig: any = {}
    if (options?.jsonMode) {
      generationConfig.responseMimeType = 'application/json'
    }
    if (options?.temperature !== undefined) {
      generationConfig.temperature = options.temperature
    }

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
    })

    const response = await result.response
    const text = response.text()

    return {
      text,
      inputTokens: response.usageMetadata?.promptTokenCount,
      outputTokens: response.usageMetadata?.candidatesTokenCount,
    }
  }

  getName(): string {
    return 'Gemini'
  }

  getModel(): string {
    return this.modelName
  }
}
