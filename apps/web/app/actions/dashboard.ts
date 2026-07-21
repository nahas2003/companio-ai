'use server'

import { prisma, AttemptStatus } from '@companio/db'
import { getVerifiedUser } from './authUtils'

export async function getDashboardDataAction(accessToken: string) {
  try {
    const verifiedUser = await getVerifiedUser(accessToken)

    // 1. Fetch practice stats
    const completedPractices = await prisma.practiceSession.findMany({
      where: { userId: verifiedUser.id, status: 'COMPLETED' },
      include: {
        questionBank: {
          include: {
            questions: { where: { deleted: false } },
          },
        },
      },
    })

    // 2. Fetch assessment stats
    const completedAssessments = await prisma.assessmentAttempt.findMany({
      where: {
        userId: verifiedUser.id,
        status: { in: [AttemptStatus.SUBMITTED, AttemptStatus.EXPIRED] },
      },
      include: {
        publishedAssessment: {
          include: {
            template: {
              include: {
                questionBank: {
                  include: {
                    questions: { where: { deleted: false } },
                  },
                },
              },
            },
          },
        },
      },
    })

    // Calculate questions answered
    let totalQuestionsAnswered = 0
    let totalScoreSum = 0
    let scoreCount = 0

    completedPractices.forEach((p) => {
      const qCount = p.questionBank.questions.length
      totalQuestionsAnswered += qCount
      if (p.score !== null) {
        totalScoreSum += p.score
        scoreCount++
      }
    })

    completedAssessments.forEach((a) => {
      const qCount = a.publishedAssessment.template.questionBank.questions.length
      totalQuestionsAnswered += qCount
      if (a.score !== null) {
        totalScoreSum += a.score
        scoreCount++
      }
    })

    const accuracyRate = scoreCount > 0 ? totalScoreSum / scoreCount : 0

    // 3. Fetch recent uploads
    const recentUploads = await prisma.source.findMany({
      where: { userId: verifiedUser.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })

    // 4. Fetch recent practices
    const recentPractices = await prisma.practiceSession.findMany({
      where: { userId: verifiedUser.id },
      include: { questionBank: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })

    // 5. Fetch recent assessments
    const recentAttempts = await prisma.assessmentAttempt.findMany({
      where: { userId: verifiedUser.id },
      include: {
        publishedAssessment: {
          include: {
            template: true,
          },
        },
      },
      orderBy: { startedAt: 'desc' },
      take: 5,
    })

    // Compile into recent activities list
    const activities: any[] = []

    recentUploads.forEach((u) => {
      activities.push({
        id: `upload_${u.id}`,
        type: 'upload',
        title: u.fileName,
        date: u.createdAt,
        status:
          u.status === 'COMPLETED'
            ? 'Processed'
            : u.status === 'PROCESSING'
              ? 'Processing'
              : u.status === 'FAILED'
                ? 'Failed'
                : 'Pending',
        details: u.fileSize ? `${Math.round(u.fileSize / 1024)} KB` : '',
      })
    })

    recentPractices.forEach((p) => {
      activities.push({
        id: `practice_${p.id}`,
        type: 'practice',
        title: p.questionBank.name,
        date: p.createdAt,
        status: p.status === 'COMPLETED' ? 'Completed' : 'In Progress',
        details: p.score !== null ? `Score: ${Math.round(p.score)}%` : 'Not graded',
      })
    })

    recentAttempts.forEach((a) => {
      activities.push({
        id: `attempt_${a.id}`,
        type: 'assessment',
        title: a.publishedAssessment.template.title,
        date: a.startedAt,
        status:
          a.status === AttemptStatus.SUBMITTED || a.status === AttemptStatus.EXPIRED
            ? 'Completed'
            : 'In Progress',
        details: a.score !== null ? `Score: ${Math.round(a.score)}%` : 'Not graded',
      })
    })

    // Sort combined activities by date descending
    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // 6. Fetch AI Usage metrics
    const aiLogs = await prisma.aiUsageLog.findMany({
      where: { userId: verifiedUser.id },
      select: { inputTokens: true, outputTokens: true },
    })

    const aiRequests = aiLogs.length
    const aiTotalTokens = aiLogs.reduce(
      (sum, log) => sum + (log.inputTokens || 0) + (log.outputTokens || 0),
      0,
    )

    return {
      success: true,
      stats: {
        practiceCompleted: completedPractices.length,
        assessmentsCompleted: completedAssessments.length,
        questionsAnswered: totalQuestionsAnswered,
        accuracyRate: Math.round(accuracyRate),
        aiRequests,
        aiTotalTokens,
      },
      activities: activities.slice(0, 8),
    }
  } catch (error: any) {
    console.error('Error retrieving dashboard statistics:', error)
    return { success: false, error: error.message || 'Failed to load dashboard data.' }
  }
}
