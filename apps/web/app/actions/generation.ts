'use server'

import { prisma } from '@companio/db'
import { createClient } from '@supabase/supabase-js'
import { aiOrchestrator } from '@/features/ai/services/aiOrchestrator'
import { z } from 'zod'
import type {
  Difficulty,
  QuestionType,
  GeneratedQuestion,
} from '@/features/ai/types/questions.types'

import { getVerifiedUser } from './authUtils'
import { isRateLimited } from './rateLimiter'

export async function generateQuestionsAction(
  accessToken: string,
  payload: {
    sourceId: string
    count: number
    type: QuestionType
    difficulty: Difficulty
  },
) {
  try {
    const verifiedUser = await getVerifiedUser(accessToken)

    // Rate Limit check (max 5 question sets per minute)
    if (isRateLimited(`gen-questions:${verifiedUser.id}`, 5, 60000)) {
      throw new Error('Rate limit exceeded. Please wait a minute before generating questions.')
    }

    const userId = verifiedUser.id

    const source = await prisma.source.findUnique({
      where: { id: payload.sourceId },
      include: { content: true },
    })

    if (!source || source.userId !== userId) {
      throw new Error('Access denied. You do not own this source material.')
    }

    if (source.status !== 'COMPLETED' || !source.content) {
      throw new Error(
        'The source material must be successfully processed before generating questions.',
      )
    }

    const typeLabel =
      payload.type === 'MULTIPLE_CHOICE'
        ? 'MULTIPLE_CHOICE'
        : payload.type === 'TRUE_FALSE'
          ? 'TRUE_FALSE'
          : 'SHORT_ANSWER'

    let responseSchema: z.ZodType<any>
    if (payload.type === 'MULTIPLE_CHOICE') {
      responseSchema = z.array(
        z.object({
          title: z.string().min(1, 'Question title is required'),
          options: z.array(z.string()).length(4, 'MCQ must have exactly 4 choices'),
          correctAnswer: z
            .number()
            .int()
            .min(0)
            .max(3, 'Correct answer index must be between 0 and 3'),
        }),
      )
    } else if (payload.type === 'TRUE_FALSE') {
      responseSchema = z.array(
        z.object({
          title: z.string().min(1, 'Question title is required'),
          options: z.array(z.string()).length(2, 'True/False must have exactly 2 choices'),
          correctAnswer: z.number().int().min(0).max(1, 'Correct answer index must be 0 or 1'),
        }),
      )
    } else {
      responseSchema = z.array(
        z.object({
          title: z.string().min(1, 'Question title is required'),
          modelAnswer: z.string().min(1, 'Model answer is required'),
        }),
      )
    }

    const result = await aiOrchestrator.executePrompt(
      'QUESTION_GENERATION',
      {
        count: payload.count.toString(),
        type: typeLabel,
        difficulty: payload.difficulty,
        documentText: source.content.content,
      },
      responseSchema,
      userId,
    )

    const seenTitles = new Set<string>()
    const deduplicatedQuestions: GeneratedQuestion[] = []

    for (const q of result) {
      const normalizedTitle = q.title.trim().toLowerCase()
      if (!seenTitles.has(normalizedTitle)) {
        seenTitles.add(normalizedTitle)
        deduplicatedQuestions.push(q)
      }
    }

    console.log(
      `Generated and validated ${deduplicatedQuestions.length} questions for user: ${userId}`,
    )
    return { success: true, questions: deduplicatedQuestions }
  } catch (error: any) {
    console.error('Failed to generate questions:', error)
    return { success: false, error: error.message || 'Failed to generate questions.' }
  }
}
