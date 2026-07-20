export interface AiResponse {
  text: string
  inputTokens?: number
  outputTokens?: number
}

export interface AiProvider {
  generateText(
    prompt: string,
    options?: { jsonMode?: boolean; temperature?: number },
  ): Promise<AiResponse>
  getName(): string
  getModel(): string
}

export interface PromptTemplate {
  name: string
  version: string
  template: string
  description?: string
}
