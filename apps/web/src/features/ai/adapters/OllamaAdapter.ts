import { IAIProvider } from '../interfaces/IAIProvider'
import { AiResponse } from '../types/ai.types'

export class OllamaProviderAdapter implements IAIProvider {
  private host: string
  private modelName: string = 'llama3'

  constructor(host?: string) {
    this.host = host || 'http://localhost:11434'
  }

  async generateText(
    prompt: string,
    options?: { jsonMode?: boolean; temperature?: number },
  ): Promise<AiResponse> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    const payload: any = {
      model: this.modelName,
      messages: [{ role: 'user', content: prompt }],
      stream: false,
      options: {
        temperature: options?.temperature ?? 0.2,
      },
    }

    if (options?.jsonMode) {
      payload.format = 'json'
    }

    const response = await fetch(`${this.host}/api/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Ollama local request failed: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    const text = data.message?.content || ''

    return {
      text,
      inputTokens: data.prompt_eval_count,
      outputTokens: data.eval_count,
    }
  }

  getName(): string {
    return 'Ollama'
  }

  getModel(): string {
    return this.modelName
  }
}
