import { IAIProvider } from '../interfaces/IAIProvider'
import { AiResponse } from '../types/ai.types'

export class OpenAIProviderAdapter implements IAIProvider {
  private apiKey: string
  private modelName: string = 'gpt-4o-mini'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async generateText(
    prompt: string,
    options?: { jsonMode?: boolean; temperature?: number },
  ): Promise<AiResponse> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key is missing.')
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    }

    const payload: any = {
      model: this.modelName,
      messages: [{ role: 'user', content: prompt }],
      temperature: options?.temperature ?? 0.2,
    }

    if (options?.jsonMode) {
      payload.response_format = { type: 'json_object' }
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`OpenAI API request failed: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content || ''

    return {
      text,
      inputTokens: data.usage?.prompt_tokens,
      outputTokens: data.usage?.completion_tokens,
    }
  }

  getName(): string {
    return 'OpenAI'
  }

  getModel(): string {
    return this.modelName
  }
}
