'use server'

import { prisma } from '@companio/db'
import { createClient } from '@supabase/supabase-js'
import { aiOrchestrator } from '@/features/ai/services/aiOrchestrator'
import { z } from 'zod'

const getSupabaseServer = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Missing Supabase URL or Anon Key for server verification.')
  }
  return createClient(url, key)
}

async function getVerifiedAdminRole(accessToken: string) {
  if (!accessToken) {
    throw new Error('Access token is required.')
  }

  const supabase = getSupabaseServer()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(accessToken)

  if (error || !user) {
    throw new Error('Invalid or expired session token.')
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  })

  if (!dbUser || (dbUser.role !== 'ADMIN' && dbUser.role !== 'SUPER_ADMIN')) {
    throw new Error('Unauthorized. Administrative privileges required.')
  }

  return dbUser
}

export async function getAiSystemStatus(accessToken: string) {
  try {
    const verifiedAdmin = await getVerifiedAdminRole(accessToken)

    const totalRequests = await prisma.aiUsageLog.count()
    const successfulRequests = await prisma.aiUsageLog.count({
      where: { success: true },
    })
    const failedRequests = await prisma.aiUsageLog.count({
      where: { success: false },
    })

    const avgDuration = await prisma.aiUsageLog.aggregate({
      _avg: { durationMs: true },
    })

    const recentLogs = await prisma.aiUsageLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    })

    const activeProvider = process.env.GEMINI_API_KEY ? 'Gemini' : 'MockProvider'
    const activeModel = process.env.GEMINI_API_KEY ? 'gemini-1.5-flash' : 'mock-model-v1'
    const hasKey = !!process.env.GEMINI_API_KEY

    return {
      success: true,
      activeProvider,
      activeModel,
      hasKey,
      totalRequests,
      successRate: totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 100,
      failedRequests,
      avgLatencyMs: avgDuration._avg.durationMs ? Math.round(avgDuration._avg.durationMs) : 0,
      recentLogs: recentLogs.map((log) => ({
        id: log.id,
        provider: log.provider,
        model: log.model,
        promptName: log.promptName,
        success: log.success,
        durationMs: log.durationMs,
        createdAt: log.createdAt.toISOString(),
        errorMsg: log.errorMsg,
      })),
    }
  } catch (error: any) {
    console.error('Error fetching AI status:', error)
    return { success: false, error: error.message || 'Failed to load system logs' }
  }
}

export async function testAiExecution(accessToken: string) {
  try {
    const verifiedAdmin = await getVerifiedAdminRole(accessToken)

    const schema = z.object({
      status: z.string(),
      provider: z.string(),
      message: z.string(),
    })

    const activeProvider = process.env.GEMINI_API_KEY ? 'Gemini' : 'MockProvider'

    const result = await aiOrchestrator.executePrompt(
      'DIAGNOSTIC_TEST',
      { provider: activeProvider },
      schema,
      verifiedAdmin.id,
    )

    return { success: true, result }
  } catch (error: any) {
    console.error('AI diagnostics failed:', error)
    return { success: false, error: error.message || 'Diagnostics failed to resolve' }
  }
}
