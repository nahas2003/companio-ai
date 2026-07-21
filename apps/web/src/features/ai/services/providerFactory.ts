import { IAIProvider } from '../interfaces/IAIProvider'
import { MockProviderAdapter } from '../adapters/MockAdapter'
import { GeminiProviderAdapter } from '../adapters/GeminiAdapter'
import { OpenAIProviderAdapter } from '../adapters/OpenAIAdapter'
import { ClaudeProviderAdapter } from '../adapters/ClaudeAdapter'
import { NvidiaProviderAdapter } from '../adapters/NvidiaAdapter'
import { OllamaProviderAdapter } from '../adapters/OllamaAdapter'

export const providerFactory = {
  createProvider(key: string): IAIProvider {
    switch (key.toLowerCase().trim()) {
      case 'gemini':
        return new GeminiProviderAdapter(process.env.GEMINI_API_KEY || '')
      case 'openai':
        return new OpenAIProviderAdapter(process.env.OPENAI_API_KEY || '')
      case 'claude':
        return new ClaudeProviderAdapter(process.env.ANTHROPIC_API_KEY || '')
      case 'nvidia':
        return new NvidiaProviderAdapter(process.env.NVIDIA_API_KEY || '')
      case 'ollama':
        return new OllamaProviderAdapter(process.env.OLLAMA_HOST || 'http://localhost:11434')
      case 'mock':
      default:
        return new MockProviderAdapter()
    }
  },
}
