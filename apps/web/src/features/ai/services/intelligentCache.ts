import { prisma } from '@companio/db'
import * as crypto from 'crypto'

export const intelligentCache = {
  generateHash(params: {
    topic: string
    difficulty: string
    count: number
    type: string
    language?: string
    method?: string
    bloomLevel?: string
    customInstructions?: string
  }): string {
    const inputStr = `${params.topic.toLowerCase().trim()}|${params.difficulty.toLowerCase().trim()}|${params.count}|${params.type.toLowerCase().trim()}|${(params.language || 'en').toLowerCase().trim()}|${(params.method || '').toLowerCase()}|${(params.bloomLevel || '').toLowerCase()}|${(params.customInstructions || '').toLowerCase()}`
    return crypto.createHash('sha256').update(inputStr).digest('hex')
  },

  async get(hash: string): Promise<any | null> {
    try {
      const entry = await prisma.aICache.findUnique({
        where: { hash },
      })

      if (!entry) return null

      // Check expiry
      if (new Date(entry.expiresAt).getTime() < Date.now()) {
        // Clean up expired cache asynchronously
        prisma.aICache.delete({ where: { hash } }).catch(console.error)
        return null
      }

      return JSON.parse(entry.response)
    } catch (err) {
      console.error('Failed to read from AI cache:', err)
      return null
    }
  },

  async set(hash: string, response: any, durationSeconds: number = 86400): Promise<void> {
    try {
      const expiresAt = new Date(Date.now() + durationSeconds * 1000)
      await prisma.aICache.upsert({
        where: { hash },
        create: {
          hash,
          response: JSON.stringify(response),
          expiresAt,
        },
        update: {
          response: JSON.stringify(response),
          expiresAt,
        },
      })
    } catch (err) {
      console.error('Failed to write to AI cache:', err)
    }
  },
}
