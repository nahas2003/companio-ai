import { IAIProvider } from '../interfaces/IAIProvider'
import { AiResponse } from '../types/ai.types'

export class ClaudeProviderAdapter implements IAIProvider {
  private apiKey: string
  private modelName: string = 'claude-3-haiku-20240307'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async generateText(
    prompt: string,
    options?: { jsonMode?: boolean; temperature?: number },
  ): Promise<AiResponse> {
    if (!this.apiKey) {
      throw new Error('Anthropic API key is missing.')
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey,
      'anthropic-version': '2023-06-01',
    }

    const payload: any = {
      model: this.modelName,
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
      temperature: options?.temperature ?? 0.2,
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Anthropic API request failed: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    const text = data.content?.[0]?.text || ''

    return {
      text,
      inputTokens: data.usage?.input_tokens,
      outputTokens: data.usage?.output_tokens,
    }
  }

  getName(): string {
    return 'Claude'
  }

  getModel(): string {
    return this.modelName
  }
}
