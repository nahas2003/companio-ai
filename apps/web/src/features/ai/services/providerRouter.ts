import { providerRegistry } from './providerRegistry'
import { providerFactory } from './providerFactory'
import { healthMonitor } from './healthMonitor'
import { metricsCollector } from './metricsCollector'
import { AiResponse } from '../types/ai.types'

export const providerRouter = {
  async routeRequest(
    prompt: string,
    options?: { jsonMode?: boolean; temperature?: number },
    promptName: string = 'unknown_prompt',
  ): Promise<{ response: AiResponse; providerName: string; modelName: string }> {
    // 1. Fetch configured providers
    const allProviders = await providerRegistry.getEnabledProviders()

    // 2. Filter out unhealthy nodes (circuit breaker checks)
    const healthyProviders = allProviders.filter((p) => healthMonitor.isProviderHealthy(p))

    // 3. Sort by priority descending (higher number = higher priority)
    const sortedProviders = healthyProviders.sort((a, b) => b.priority - a.priority)

    console.log(
      `AI Router routing request. Enabled: ${allProviders.length}, Healthy: ${healthyProviders.length}, Candidates: ${sortedProviders.map((p) => p.key).join(' -> ')}`,
    )

    let lastError: any = null

    for (const config of sortedProviders) {
      const startTime = Date.now()
      let providerName = 'Unknown'
      let modelName = 'Unknown'

      try {
        const providerInstance = providerFactory.createProvider(config.key)
        providerName = providerInstance.getName()
        modelName = providerInstance.getModel()

        console.log(`AI Router attempting [${config.key}] (${modelName})...`)

        // request execution with a 30s timeout guard
        const requestPromise = providerInstance.generateText(prompt, options)
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI Request timeout limit (30s)')), 30000),
        )

        const response = await Promise.race([requestPromise, timeoutPromise])
        const durationMs = Date.now() - startTime

        // Compute simulated cost
        const tokensCount = (response.inputTokens ?? 0) + (response.outputTokens ?? 0)
        const cost = config.costFactor * (tokensCount / 1000)

        // Log metrics and success status
        await metricsCollector.logRequest({
          provider: providerName,
          model: modelName,
          promptName,
          durationMs,
          inputTokens: response.inputTokens,
          outputTokens: response.outputTokens,
          cost,
          success: true,
        })

        await healthMonitor.recordSuccess(config.key)

        return {
          response,
          providerName,
          modelName,
        }
      } catch (err: any) {
        lastError = err
        const durationMs = Date.now() - startTime

        console.error(`AI Router: Attempt [${config.key}] failed: ${err.message || err}`)

        // Log failure metrics
        await metricsCollector.logRequest({
          provider: providerName,
          model: modelName,
          promptName,
          durationMs,
          success: false,
          errorMsg: err.message || 'Execution error',
        })

        await healthMonitor.recordFailure(config.key)
      }
    }

    // 4. Final safety fall-back to Mock if all configured endpoints fail!
    console.warn(
      'AI Router: All providers failed or unhealthy. Dropping to fallback Mock safety net.',
    )
    const fallbackStartTime = Date.now()
    const mockProvider = providerFactory.createProvider('mock')
    const response = await mockProvider.generateText(prompt, options)

    await metricsCollector.logRequest({
      provider: mockProvider.getName(),
      model: mockProvider.getModel(),
      promptName,
      durationMs: Date.now() - fallbackStartTime,
      success: true,
      cost: 0,
    })

    return {
      response,
      providerName: mockProvider.getName(),
      modelName: mockProvider.getModel(),
    }
  },
}
