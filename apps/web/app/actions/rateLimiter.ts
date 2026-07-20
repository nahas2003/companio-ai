const rateLimitCache = new Map<string, number[]>()

export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const timestamps = rateLimitCache.get(key) || []

  const activeTimestamps = timestamps.filter((t) => now - t < windowMs)

  if (activeTimestamps.length >= limit) {
    return true
  }

  activeTimestamps.push(now)
  rateLimitCache.set(key, activeTimestamps)
  return false
}
