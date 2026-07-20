'use server'

import { prisma } from '@companio/db'
import { getVerifiedUser } from './authUtils'
import { isRateLimited } from './rateLimiter'

export async function startPracticeSessionAction(
  accessToken: string,
  questionBankId: string,
  filters?: { difficulty?: string; type?: string },
  forceNew?: boolean,
) {
  try {
    const verifiedUser = await getVerifiedUser(accessToken)

    // Rate limiting: max 10 practice starts per minute
    if (isRateLimited(`start-practice:${verifiedUser.id}`, 10, 60000)) {
      throw new Error('Rate limit exceeded. Please wait before starting another practice session.')
    }

    // 1. Check for unfinished active session to resume
    const activeSession = !forceNew
      ? await prisma.practiceSession.findFirst({
          where: {
            userId: verifiedUser.id,
            questionBankId,
            status: 'IN_PROGRESS',
          },
          orderBy: { createdAt: 'desc' },
        })
      : null

    const questionBank = await prisma.questionBank.findUnique({
      where: { id: questionBankId, deleted: false },
      include: {
        questions: {
          where: {
            deleted: false,
            archived: false,
            ...(filters?.difficulty ? { difficulty: filters.difficulty as any } : {}),
            ...(filters?.type ? { type: filters.type as any } : {}),
          },
        },
      },
    })

    if (!questionBank || questionBank.userId !== verifiedUser.id) {
      throw new Error('Question Bank not found or unauthorized access.')
    }

    if (questionBank.questions.length === 0) {
      throw new Error('No matching questions found with the selected filters.')
    }

    // If there is an active session, return its ID so client can choose to resume it
    if (activeSession) {
      const safetyQuestions = questionBank.questions.map((q) => ({
        id: q.id,
        title: q.title,
        type: q.type,
        options: q.options,
      }))
      const existingAnswers = await prisma.practiceAnswer.findMany({
        where: { practiceSessionId: activeSession.id },
      })
      return {
        success: true,
        sessionId: activeSession.id,
        bankName: questionBank.name,
        questions: safetyQuestions,
        isResume: true,
        answers: existingAnswers.map((ans) => ({
          questionId: ans.questionId,
          selectedOption: ans.selectedOption ?? undefined,
          modelAnswer: ans.modelAnswer ?? undefined,
        })),
      }
    }

    // If forceNew is true, cancel previous in-progress sessions
    if (forceNew) {
      await prisma.practiceSession.updateMany({
        where: {
          userId: verifiedUser.id,
          questionBankId,
          status: 'IN_PROGRESS',
        },
        data: {
          status: 'ABANDONED',
        },
      })
    }

    // Create a new practice session
    const session = await prisma.practiceSession.create({
      data: {
        userId: verifiedUser.id,
        questionBankId: questionBank.id,
        status: 'IN_PROGRESS',
      },
    })

    // Map questions to omit answer keys during active gameplay
    const safetyQuestions = questionBank.questions.map((q) => ({
      id: q.id,
      title: q.title,
      type: q.type,
      options: q.options,
    }))

    return {
      success: true,
      sessionId: session.id,
      bankName: questionBank.name,
      questions: safetyQuestions,
    }
  } catch (error: any) {
    console.error('Error starting practice session:', error)
    return { success: false, error: error.message || 'Failed to start practice session.' }
  }
}

export async function submitPracticeSessionAction(
  accessToken: string,
  payload: {
    sessionId: string
    timeTaken: number // in seconds
    answers: {
      questionId: string
      selectedOption?: number
      modelAnswer?: string
    }[]
  },
) {
  try {
    const verifiedUser = await getVerifiedUser(accessToken)

    const session = await prisma.practiceSession.findUnique({
      where: { id: payload.sessionId, userId: verifiedUser.id },
      include: {
        questionBank: {
          include: {
            questions: {
              where: { deleted: false },
            },
          },
        },
      },
    })

    if (!session || session.status === 'COMPLETED') {
      throw new Error('Session not found or already submitted.')
    }

    const questions = session.questionBank.questions
    let correctCount = 0

    // Begin scoring transaction
    const results = await prisma.$transaction(async (tx) => {
      const createdAnswers = []

      for (const userAns of payload.answers) {
        const question = questions.find((q) => q.id === userAns.questionId)
        if (!question) continue

        let isCorrect = false

        if (question.type === 'MULTIPLE_CHOICE' || question.type === 'TRUE_FALSE') {
          isCorrect = question.correctAnswer === userAns.selectedOption
        } else if (question.type === 'SHORT_ANSWER') {
          // Simple semantic check: normalize white spaces and compare case-insensitively
          const normalizedUser = (userAns.modelAnswer || '').trim().toLowerCase()
          const normalizedCorrect = (question.modelAnswer || '').trim().toLowerCase()
          isCorrect =
            normalizedUser === normalizedCorrect || normalizedCorrect.includes(normalizedUser)
        }

        if (isCorrect) correctCount++

        // Save answer details
        const savedAns = await tx.practiceAnswer.create({
          data: {
            practiceSessionId: session.id,
            questionId: question.id,
            selectedOption: userAns.selectedOption,
            modelAnswer: userAns.modelAnswer,
            isCorrect,
          },
        })
        createdAnswers.push({
          ...savedAns,
          correctAnswer: question.correctAnswer,
          correctModelAnswer: question.modelAnswer,
          title: question.title,
          type: question.type,
          options: question.options,
        })
      }

      const score = questions.length > 0 ? (correctCount / questions.length) * 100 : 0

      // Update session status
      const updatedSession = await tx.practiceSession.update({
        where: { id: session.id },
        data: {
          score,
          timeTaken: payload.timeTaken,
          status: 'COMPLETED',
        },
      })

      return {
        score,
        timeTaken: payload.timeTaken,
        status: updatedSession.status,
        answers: createdAnswers,
        totalQuestions: questions.length,
        correctCount,
      }
    })

    return { success: true, results }
  } catch (error: any) {
    console.error('Error submitting practice session:', error)
    return { success: false, error: error.message || 'Failed to submit practice session.' }
  }
}

export async function getPracticeSessionResultsAction(accessToken: string, sessionId: string) {
  try {
    const verifiedUser = await getVerifiedUser(accessToken)

    const session = await prisma.practiceSession.findUnique({
      where: { id: sessionId, userId: verifiedUser.id },
      include: {
        questionBank: true,
        answers: {
          include: {
            question: true,
          },
        },
      },
    })

    if (!session || session.status !== 'COMPLETED') {
      throw new Error('Practice session results not available.')
    }

    return {
      success: true,
      session: {
        id: session.id,
        score: session.score,
        timeTaken: session.timeTaken,
        bankName: session.questionBank.name,
        createdAt: session.createdAt,
      },
      answers: session.answers.map((ans) => ({
        id: ans.id,
        questionId: ans.questionId,
        title: ans.question.title,
        type: ans.question.type,
        options: ans.question.options,
        selectedOption: ans.selectedOption,
        modelAnswer: ans.modelAnswer,
        isCorrect: ans.isCorrect,
        correctAnswer: ans.question.correctAnswer,
        correctModelAnswer: ans.question.modelAnswer,
      })),
    }
  } catch (error: any) {
    console.error('Error fetching practice session results:', error)
    return { success: false, error: error.message || 'Failed to fetch practice session results.' }
  }
}

export async function getPracticeDashboardAction(accessToken: string) {
  try {
    const verifiedUser = await getVerifiedUser(accessToken)

    const questionBanks = await prisma.questionBank.findMany({
      where: { userId: verifiedUser.id, deleted: false },
      include: {
        questions: {
          where: { deleted: false, archived: false },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const sessions = await prisma.practiceSession.findMany({
      where: { userId: verifiedUser.id },
      include: {
        questionBank: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    return {
      success: true,
      questionBanks: questionBanks.map((qb) => ({
        id: qb.id,
        name: qb.name,
        description: qb.description,
        questionCount: qb.questions.length,
        createdAt: qb.createdAt,
      })),
      sessions: sessions.map((s) => ({
        id: s.id,
        bankName: s.questionBank.name,
        score: s.score,
        timeTaken: s.timeTaken,
        status: s.status,
        createdAt: s.createdAt,
      })),
    }
  } catch (error: any) {
    console.error('Error fetching practice dashboard:', error)
    return { success: false, error: error.message || 'Failed to retrieve practice dashboard.' }
  }
}
