'use server'

import { prisma } from '@companio/db'

export async function getAssessmentResultDetailsAction(attemptId: string) {
  try {
    const attempt = await prisma.assessmentAttempt.findUnique({
      where: { id: attemptId },
      include: {
        publishedAssessment: {
          include: {
            template: {
              include: {
                questionBank: {
                  include: {
                    questions: {
                      where: { deleted: false, archived: false },
                    },
                  },
                },
              },
            },
          },
        },
        responses: true,
      },
    })

    if (!attempt) {
      return { success: false, error: 'Exam attempt record not found.', code: 'NOT_FOUND' }
    }

    if (attempt.status !== 'COMPLETED') {
      return {
        success: false,
        error: 'Assessment is still active in progress.',
        code: 'IN_PROGRESS',
        attemptId: attempt.id,
      }
    }

    const questions = attempt.publishedAssessment.template.questionBank.questions
    const responses = attempt.responses

    // Calculate metrics without recalculating grades (using persisted isCorrect)
    const correctCount = responses.filter((r) => r.isCorrect === true).length
    const incorrectCount = responses.filter((r) => r.isCorrect === false).length
    const unansweredCount = Math.max(0, questions.length - responses.length)

    const score = attempt.score ?? 0
    const passingScore = attempt.publishedAssessment.template.passingScore
    const passed = score >= passingScore
    const averageTimePerQuestion =
      attempt.timeTaken && questions.length > 0
        ? Math.round(attempt.timeTaken / questions.length)
        : null

    const questionsData = questions.map((q) => {
      const studentResponse = responses.find((r) => r.questionId === q.id)
      return {
        id: q.id,
        title: q.title,
        type: q.type,
        options: q.options,
        correctAnswer: q.correctAnswer, // In results, it is safe to display correct keys
        modelAnswer: q.modelAnswer,
        selectedOption: studentResponse?.selectedOption,
        modelResponse: studentResponse?.modelResponse,
        isCorrect: studentResponse?.isCorrect ?? false,
      }
    })

    return {
      success: true,
      title: attempt.publishedAssessment.template.title,
      description: attempt.publishedAssessment.template.description,
      score,
      passingScore,
      passed,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount,
      unansweredQuestions: unansweredCount,
      timeTaken: attempt.timeTaken || 0,
      completedAt: attempt.completedAt,
      startedAt: attempt.startedAt,
      guestName: attempt.guestName,
      averageTimePerQuestion,
      questions: questionsData,
    }
  } catch (error: any) {
    console.error('Error fetching assessment result details:', error)
    return {
      success: false,
      error: error.message || 'Failed to retrieve assessment results.',
      code: 'ERROR',
    }
  }
}

export async function getAssessmentLeaderboardAction(attemptId: string) {
  try {
    const attempt = await prisma.assessmentAttempt.findUnique({
      where: { id: attemptId },
      select: { publishedAssessmentId: true },
    })

    if (!attempt) {
      return { success: false, error: 'Exam attempt not found.' }
    }

    const pubId = attempt.publishedAssessmentId

    const pubInfo = await prisma.publishedAssessment.findUnique({
      where: { id: pubId },
      include: {
        template: {
          select: { title: true },
        },
      },
    })

    const attempts = await prisma.assessmentAttempt.findMany({
      where: {
        publishedAssessmentId: pubId,
        status: 'COMPLETED',
      },
      include: {
        user: {
          select: { displayName: true, email: true },
        },
      },
      orderBy: [{ score: 'desc' }, { timeTaken: 'asc' }],
    })

    return {
      success: true,
      title: pubInfo?.template.title || 'Assessment Leaderboard',
      entries: attempts.map((a) => ({
        id: a.id,
        participantName: a.userId
          ? a.user?.displayName || a.user?.email.split('@')[0] || 'Authenticated User'
          : a.guestName || 'Guest Candidate',
        score: a.score ?? 0,
        timeTaken: a.timeTaken ?? 0,
        completedAt: a.completedAt || new Date(),
        isCurrentUser: a.id === attemptId,
      })),
    }
  } catch (error: any) {
    console.error('Error fetching leaderboard:', error)
    return { success: false, error: error.message || 'Failed to retrieve standings.' }
  }
}
