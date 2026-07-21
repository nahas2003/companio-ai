import { providerRegistry } from './providerRegistry'

// In-memory failure counts tracker
const consecutiveFailures: Record<string, number> = {}

// Cooldown period: 5 minutes
const COOLDOWN_MS = 5 * 60 * 1000

export const healthMonitor = {
  async recordSuccess(key: string): Promise<void> {
    consecutiveFailures[key] = 0
    await providerRegistry.updateProviderStatus(key, 'healthy', null)
  },

  async recordFailure(key: string): Promise<void> {
    const current = (consecutiveFailures[key] || 0) + 1
    consecutiveFailures[key] = current
    console.warn(`AI Provider [${key}] consecutive failure registered: ${current}/3`)

    if (current >= 3) {
      const retryAfter = new Date(Date.now() + COOLDOWN_MS)
      console.error(
        `AI Provider [${key}] circuit breaker tripped. Setting status to unhealthy until: ${retryAfter.toISOString()}`,
      )
      await providerRegistry.updateProviderStatus(key, 'unhealthy', retryAfter)
    }
  },

  isProviderHealthy(provider: { key: string; status: string; retryAfter: Date | null }): boolean {
    if (provider.status === 'healthy') return true

    if (provider.retryAfter && new Date(provider.retryAfter).getTime() < Date.now()) {
      console.log(
        `AI Provider [${provider.key}] cooldown elapsed. Auto-resetting state to healthy.`,
      )
      // Async update
      providerRegistry.updateProviderStatus(provider.key, 'healthy', null)
      consecutiveFailures[provider.key] = 0
      return true
    }

    return false
  },
}
