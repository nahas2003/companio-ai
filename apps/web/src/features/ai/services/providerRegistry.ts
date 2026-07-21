import { prisma } from '@companio/db'

export interface ProviderConfigData {
  key: string
  name: string
  enabled: boolean
  costFactor: number
  priority: number
  status: string
  retryAfter: Date | null
}

const DEFAULT_PROVIDERS = [
  { key: 'mock', name: 'Mock', enabled: true, costFactor: 0.0, priority: 0 },
  { key: 'gemini', name: 'Gemini', enabled: true, costFactor: 1.0, priority: 100 },
  { key: 'openai', name: 'OpenAI', enabled: true, costFactor: 2.0, priority: 90 },
  { key: 'claude', name: 'Claude', enabled: true, costFactor: 3.0, priority: 80 },
  { key: 'nvidia', name: 'NVIDIA', enabled: true, costFactor: 1.5, priority: 70 },
  { key: 'ollama', name: 'Ollama', enabled: false, costFactor: 0.0, priority: 60 },
]

export const providerRegistry = {
  async getEnabledProviders(): Promise<ProviderConfigData[]> {
    try {
      let configs = await prisma.providerConfig.findMany()

      // Self-healing seeding if empty
      if (configs.length === 0) {
        await prisma.providerConfig.createMany({
          data: DEFAULT_PROVIDERS,
        })
        configs = await prisma.providerConfig.findMany()
      }

      return configs
        .filter((c) => c.enabled)
        .map((c) => ({
          key: c.key,
          name: c.name,
          enabled: c.enabled,
          costFactor: c.costFactor,
          priority: c.priority,
          status: c.status,
          retryAfter: c.retryAfter,
        }))
    } catch (err) {
      console.error('Error fetching enabled providers from registry:', err)
      // Fallback if DB query fails completely
      return DEFAULT_PROVIDERS.filter((p) => p.enabled).map((p) => ({
        ...p,
        status: 'healthy',
        retryAfter: null,
      }))
    }
  },

  async updateProviderStatus(
    key: string,
    status: 'healthy' | 'unhealthy',
    retryAfter?: Date | null,
  ): Promise<void> {
    try {
      await prisma.providerConfig.update({
        where: { key },
        data: {
          status,
          retryAfter: retryAfter ?? null,
        },
      })
    } catch (err) {
      console.error(`Failed to update status for provider ${key}:`, err)
    }
  },
}
