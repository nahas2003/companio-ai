import { IAIProvider } from '../interfaces/IAIProvider'
import { AiResponse } from '../types/ai.types'

export class MockProviderAdapter implements IAIProvider {
  private modelName: string = 'mock-model-v1'

  async generateText(
    prompt: string,
    options?: { jsonMode?: boolean; temperature?: number },
  ): Promise<AiResponse> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    let text = ''

    if (prompt.includes('Hello AI! Please reply with a valid JSON')) {
      text = JSON.stringify({
        status: 'OK',
        provider: 'Mock',
        message: 'Hello from Companio AI! (Mock Mode)',
      })
    } else if (prompt.includes('Generate') || prompt.includes('question')) {
      text = JSON.stringify([
        {
          title: 'What is the primary goal of Organic Chemistry?',
          options: [
            'To study carbon-containing compounds',
            'To study inorganic metals',
            'To analyze nuclear fusion',
            'To extract oil resources',
          ],
          correctAnswer: 0,
        },
        {
          title: 'Which element is the foundation of all organic molecules?',
          options: ['Hydrogen', 'Carbon', 'Oxygen', 'Nitrogen'],
          correctAnswer: 1,
        },
      ])
    } else {
      text =
        '- Concept 1: The document highlights the fundamentals of the subject matter.\n- Concept 2: Key relationships between elements are analyzed systematically.\n- Concept 3: Practice problems are provided for conceptual reinforcement.'
    }

    return {
      text,
      inputTokens: 120,
      outputTokens: 85,
    }
  }

  getName(): string {
    return 'Mock'
  }

  getModel(): string {
    return this.modelName
  }
}
