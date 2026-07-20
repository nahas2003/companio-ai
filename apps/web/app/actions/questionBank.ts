'use server'

import { prisma } from '@companio/db'
import { createClient } from '@supabase/supabase-js'
import type {
  Difficulty,
  QuestionType,
  GeneratedQuestion,
} from '@/features/ai/types/questions.types'

const getSupabaseServer = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Missing Supabase URL or Anon Key for server verification.')
  }
  return createClient(url, key)
}

async function getVerifiedUserId(accessToken: string) {
  if (!accessToken) {
    throw new Error('Missing access token for authorization.')
  }

  const supabase = getSupabaseServer()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(accessToken)

  if (error || !user) {
    throw new Error('Invalid or expired session token. Please sign in again.')
  }

  return user.id
}

export async function saveQuestionsToBankAction(
  accessToken: string,
  payload: {
    sourceId: string
    bankName: string
    description?: string
    difficulty: Difficulty
    type: QuestionType
    questions: GeneratedQuestion[]
  },
) {
  try {
    const userId = await getVerifiedUserId(accessToken)

    const source = await prisma.source.findUnique({
      where: { id: payload.sourceId },
    })

    if (!source || source.userId !== userId) {
      throw new Error('Access denied. Material owner mismatch.')
    }

    const result = await prisma.$transaction(async (tx) => {
      const bank = await tx.questionBank.create({
        data: {
          userId,
          sourceId: payload.sourceId,
          name: payload.bankName,
          description:
            payload.description || `Generated practice questions from ${source.fileName}`,
        },
      })

      const questionsData = payload.questions.map((q) => ({
        questionBankId: bank.id,
        title: q.title,
        type: payload.type,
        difficulty: payload.difficulty,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        modelAnswer: q.modelAnswer,
      }))

      await tx.question.createMany({
        data: questionsData,
      })

      return bank
    })

    return { success: true, questionBankId: result.id }
  } catch (error: any) {
    console.error('Failed to save questions to bank:', error)
    return { success: false, error: error.message || 'Failed to save questions.' }
  }
}

export async function getQuestionsAction(
  accessToken: string,
  filters: {
    search?: string
    type?: string
    difficulty?: string
    sourceId?: string
    status?: 'active' | 'archived'
    page?: number
    limit?: number
  },
) {
  try {
    const userId = await getVerifiedUserId(accessToken)

    const page = filters.page || 1
    const limit = filters.limit || 10
    const skip = (page - 1) * limit

    const whereClause: any = {
      deleted: false,
      questionBank: {
        userId,
        deleted: false,
      },
    }

    if (filters.search) {
      whereClause.title = {
        contains: filters.search,
        mode: 'insensitive',
      }
    }

    if (filters.type && filters.type !== 'ALL') {
      whereClause.type = filters.type
    }

    if (filters.difficulty && filters.difficulty !== 'ALL') {
      whereClause.difficulty = filters.difficulty
    }

    if (filters.sourceId && filters.sourceId !== 'ALL') {
      whereClause.questionBank.sourceId = filters.sourceId
    }

    if (filters.status) {
      whereClause.archived = filters.status === 'archived'
    } else {
      whereClause.archived = false
    }

    const [totalCount, questions] = await Promise.all([
      prisma.question.count({ where: whereClause }),
      prisma.question.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          questionBank: {
            select: {
              name: true,
              source: {
                select: {
                  fileName: true,
                },
              },
            },
          },
        },
      }),
    ])

    const activeSources = await prisma.source.findMany({
      where: { userId, status: 'COMPLETED' },
      select: { id: true, fileName: true },
    })

    return {
      success: true,
      questions: questions.map((q) => ({
        id: q.id,
        questionBankId: q.questionBankId,
        title: q.title,
        type: q.type,
        difficulty: q.difficulty,
        options: q.options,
        correctAnswer: q.correctAnswer,
        modelAnswer: q.modelAnswer,
        archived: q.archived,
        createdAt: q.createdAt.toISOString(),
        bankName: q.questionBank.name,
        sourceName: q.questionBank.source?.fileName || 'Manual Entry',
      })),
      totalCount,
      sources: activeSources,
    }
  } catch (error: any) {
    console.error('Failed to load questions catalog:', error)
    return { success: false, error: error.message || 'Failed to load questions.' }
  }
}

export async function updateQuestionAction(
  accessToken: string,
  questionId: string,
  payload: {
    title: string
    options?: string[]
    correctAnswer?: number
    modelAnswer?: string
  },
) {
  try {
    const userId = await getVerifiedUserId(accessToken)

    const question = await prisma.question.findFirst({
      where: {
        id: questionId,
        questionBank: {
          userId,
        },
      },
    })

    if (!question) {
      throw new Error('Question not found or unauthorized access.')
    }

    await prisma.question.update({
      where: { id: questionId },
      data: {
        title: payload.title,
        options: payload.options || [],
        correctAnswer: payload.correctAnswer,
        modelAnswer: payload.modelAnswer,
      },
    })

    return { success: true }
  } catch (error: any) {
    console.error('Failed to update question:', error)
    return { success: false, error: error.message || 'Failed to update question.' }
  }
}

export async function toggleArchiveQuestionAction(
  accessToken: string,
  questionId: string,
  archiveState: boolean,
) {
  try {
    const userId = await getVerifiedUserId(accessToken)

    const question = await prisma.question.findFirst({
      where: {
        id: questionId,
        questionBank: {
          userId,
        },
      },
    })

    if (!question) {
      throw new Error('Question not found or unauthorized access.')
    }

    await prisma.question.update({
      where: { id: questionId },
      data: { archived: archiveState },
    })

    return { success: true }
  } catch (error: any) {
    console.error('Failed to toggle archive question:', error)
    return { success: false, error: error.message || 'Failed to update status.' }
  }
}

export async function softDeleteQuestionAction(accessToken: string, questionId: string) {
  try {
    const userId = await getVerifiedUserId(accessToken)

    const question = await prisma.question.findFirst({
      where: {
        id: questionId,
        questionBank: {
          userId,
        },
      },
    })

    if (!question) {
      throw new Error('Question not found or unauthorized access.')
    }

    await prisma.question.update({
      where: { id: questionId },
      data: { deleted: true },
    })

    return { success: true }
  } catch (error: any) {
    console.error('Failed to delete question:', error)
    return { success: false, error: error.message || 'Failed to delete question.' }
  }
}

export async function bulkActionQuestionsAction(
  accessToken: string,
  questionIds: string[],
  action: 'archive' | 'restore' | 'delete',
) {
  try {
    const userId = await getVerifiedUserId(accessToken)

    const ownedQuestionsCount = await prisma.question.count({
      where: {
        id: { in: questionIds },
        questionBank: {
          userId,
        },
      },
    })

    if (ownedQuestionsCount !== questionIds.length) {
      throw new Error('Unauthorized. Some selected questions do not belong to you.')
    }

    if (action === 'archive') {
      await prisma.question.updateMany({
        where: { id: { in: questionIds } },
        data: { archived: true },
      })
    } else if (action === 'restore') {
      await prisma.question.updateMany({
        where: { id: { in: questionIds } },
        data: { archived: false },
      })
    } else if (action === 'delete') {
      await prisma.question.updateMany({
        where: { id: { in: questionIds } },
        data: { deleted: true },
      })
    }

    return { success: true }
  } catch (error: any) {
    console.error('Bulk action failed:', error)
    return { success: false, error: error.message || 'Bulk operation failed.' }
  }
}
