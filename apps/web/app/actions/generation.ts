'use server'

import { prisma } from '@companio/db'
import { aiOrchestrator } from '@/features/ai/services/aiOrchestrator'
import { intelligentCache } from '@/features/ai/services/intelligentCache'
import { poolManager } from '@/features/questions/services/poolManager'
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
    method: 'TOPIC' | 'DESCRIPTION' | 'DOCUMENT'
    count: number
    type: QuestionType
    difficulty: Difficulty
    sourceId?: string
    topic?: string
    description?: string
    bloomLevel?: string
    language?: string
    customInstructions?: string
  },
) {
  try {
    const verifiedUser = await getVerifiedUser(accessToken)
    const userId = verifiedUser.id

    // Rate Limit check (max 5 question sets per minute)
    if (isRateLimited(`gen-questions:${userId}`, 5, 60000)) {
      throw new Error('Rate limit exceeded. Please wait a minute before generating questions.')
    }

    let topicTag = ''
    let sourceContent = ''

    if (payload.method === 'DOCUMENT') {
      if (!payload.sourceId) {
        throw new Error('Source material ID is required for document generation.')
      }
      const source = await prisma.source.findUnique({
        where: { id: payload.sourceId },
        include: { content: true },
      })
      if (!source || source.userId !== userId) {
        throw new Error('Access denied. You do not own this source material.')
      }
      if (source.status !== 'COMPLETED' || !source.content) {
        throw new Error('The source material must be successfully processed before generating questions.')
      }
      topicTag = source.fileName.split('.')[0]
      sourceContent = source.content.content
    } else if (payload.method === 'TOPIC') {
      if (!payload.topic || !payload.topic.trim()) {
        throw new Error('Topic is required.')
      }
      topicTag = payload.topic.trim()
    } else if (payload.method === 'DESCRIPTION') {
      if (!payload.description || !payload.description.trim()) {
        throw new Error('Description prompt is required.')
      }
      topicTag = payload.description.trim().substring(0, 30)
    } else {
      throw new Error('Invalid generation method.')
    }

    const typeLabel =
      payload.type === 'MULTIPLE_CHOICE'
        ? 'MULTIPLE_CHOICE'
        : payload.type === 'TRUE_FALSE'
          ? 'TRUE_FALSE'
          : 'SHORT_ANSWER'

    // 1. Generate Intelligent Cache Hash
    const cacheHash = intelligentCache.generateHash({
      topic: topicTag,
      difficulty: payload.difficulty,
      count: payload.count,
      type: payload.type,
      method: payload.method,
      bloomLevel: payload.bloomLevel || '',
      language: payload.language || 'English',
      customInstructions: payload.customInstructions || '',
    })

    // 2. Try Cache lookup
    const cachedQuestions = await intelligentCache.get(cacheHash)
    if (cachedQuestions && cachedQuestions.length > 0) {
      console.log(`Cache HIT for hash ${cacheHash}. Bypassing AI generation entirely.`)
      return { success: true, questions: cachedQuestions, cached: true }
    }

    // 3. Try Pool lookup for reuse (Deduplication) - skip for general description prompts
    const pooledQuestions =
      payload.method !== 'DESCRIPTION'
        ? await poolManager.getMatchingQuestions({
            topic: topicTag,
            type: payload.type,
            difficulty: payload.difficulty,
            count: payload.count,
          })
        : []

    let finalQuestions: GeneratedQuestion[] = []

    if (pooledQuestions.length >= payload.count) {
      console.log(`Question Pool HIT with ${pooledQuestions.length} matches. Bypassing AI generation.`)
      finalQuestions = pooledQuestions as GeneratedQuestion[]
    } else {
      // 4. TOP-UP needed!
      const topUpCount = payload.count - pooledQuestions.length
      console.log(
        `Question Pool partial hit with ${pooledQuestions.length}/${payload.count} matches. Querying AI to top up remaining ${topUpCount} questions...`,
      )

      let responseSchema: z.ZodType<any>
      if (payload.type === 'MULTIPLE_CHOICE') {
        responseSchema = z.array(
          z.object({
            title: z.string().min(1, 'Question title is required'),
            options: z.array(z.string()).length(4, 'MCQ must have exactly 4 choices'),
            correctAnswer: z.number().int().min(0).max(3, 'Correct answer index must be between 0 and 3'),
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

      let result: any[] = []
      if (payload.method === 'DOCUMENT') {
        result = await aiOrchestrator.executePrompt(
          'QUESTION_GENERATION',
          {
            count: topUpCount.toString(),
            type: typeLabel,
            difficulty: payload.difficulty,
            documentText: sourceContent,
          },
          responseSchema,
          userId,
        )
      } else if (payload.method === 'TOPIC') {
        result = await aiOrchestrator.executePrompt(
          'TOPIC_QUESTION_GENERATION',
          {
            count: topUpCount.toString(),
            type: typeLabel,
            difficulty: payload.difficulty,
            topic: topicTag,
            bloomLevelPrompt: payload.bloomLevel ? `Focus on cognitive level: ${payload.bloomLevel}.\n` : '',
            languagePrompt: payload.language ? `Respond in language: ${payload.language}.\n` : '',
            customInstructionsPrompt: payload.customInstructions
              ? `Additional instructions: ${payload.customInstructions}.\n`
              : '',
          },
          responseSchema,
          userId,
        )
      } else if (payload.method === 'DESCRIPTION') {
        result = await aiOrchestrator.executePrompt(
          'DESCRIPTION_QUESTION_GENERATION',
          {
            count: topUpCount.toString(),
            type: typeLabel,
            difficulty: payload.difficulty,
            description: payload.description || '',
            languagePrompt: payload.language ? `Respond in language: ${payload.language}.\n` : '',
          },
          responseSchema,
          userId,
        )
      }

      const generatedList: GeneratedQuestion[] = result

      // Deduplicate generated questions against themselves and pool
      const seenTitles = new Set<string>()
      pooledQuestions.forEach((q) => seenTitles.add(q.title.trim().toLowerCase()))

      const deduplicatedNewQuestions: GeneratedQuestion[] = []
      for (const q of generatedList) {
        const normalizedTitle = q.title.trim().toLowerCase()
        if (!seenTitles.has(normalizedTitle)) {
          seenTitles.add(normalizedTitle)
          deduplicatedNewQuestions.push(q)
        }
      }

      // Save the new questions to the reusable pool asynchronously (only for topic/document)
      if (payload.method !== 'DESCRIPTION' && deduplicatedNewQuestions.length > 0) {
        poolManager
          .saveQuestionsToPool(
            deduplicatedNewQuestions.map((q) => ({
              title: q.title,
              options: q.options || [],
              correctAnswer: q.correctAnswer,
              modelAnswer: q.modelAnswer,
            })),
            topicTag,
            payload.type,
            payload.difficulty,
            userId,
          )
          .catch(console.error)
      }

      finalQuestions = [...(pooledQuestions as GeneratedQuestion[]), ...deduplicatedNewQuestions]
    }

    // 5. Populate cache for subsequent identical configurations
    await intelligentCache.set(cacheHash, finalQuestions)

    console.log(`Successfully resolved ${finalQuestions.length} questions for user: ${userId}`)
    return { success: true, questions: finalQuestions }
  } catch (error: any) {
    console.error('Failed to generate questions:', error)
    return { success: false, error: error.message || 'Failed to generate questions.' }
  }
}

export async function regenerateSingleQuestionAction(
  accessToken: string,
  payload: {
    method: 'TOPIC' | 'DESCRIPTION' | 'DOCUMENT'
    type: QuestionType
    difficulty: Difficulty
    sourceId?: string
    topic?: string
    description?: string
    existingTitles: string[]
  },
) {
  try {
    const verifiedUser = await getVerifiedUser(accessToken)
    const userId = verifiedUser.id

    if (isRateLimited(`regen-single:${userId}`, 10, 60000)) {
      throw new Error('Rate limit exceeded. Please wait a moment.')
    }

    let contextPrompt = ''
    if (payload.method === 'DOCUMENT') {
      if (!payload.sourceId) throw new Error('Source ID is required.')
      const source = await prisma.source.findUnique({
        where: { id: payload.sourceId },
        include: { content: true },
      })
      if (!source || !source.content) throw new Error('Source content not loaded.')
      contextPrompt = `Source Document text:\n${source.content.content}`
    } else if (payload.method === 'TOPIC') {
      contextPrompt = `Generate a question about the topic: "${payload.topic}"`
    } else {
      contextPrompt = `Generate a question based on this description:\n"${payload.description}"`
    }

    let responseSchema: z.ZodType<any>
    if (payload.type === 'MULTIPLE_CHOICE') {
      responseSchema = z.object({
        title: z.string().min(1),
        options: z.array(z.string()).length(4),
        correctAnswer: z.number().int().min(0).max(3),
      })
    } else if (payload.type === 'TRUE_FALSE') {
      responseSchema = z.object({
        title: z.string().min(1),
        options: z.array(z.string()).length(2),
        correctAnswer: z.number().int().min(0).max(1),
      })
    } else {
      responseSchema = z.object({
        title: z.string().min(1),
        modelAnswer: z.string().min(1),
      })
    }

    const typeLabel =
      payload.type === 'MULTIPLE_CHOICE'
        ? 'MULTIPLE_CHOICE'
        : payload.type === 'TRUE_FALSE'
          ? 'TRUE_FALSE'
          : 'SHORT_ANSWER'

    const result = await aiOrchestrator.executePrompt(
      'SINGLE_QUESTION_REGENERATION',
      {
        type: typeLabel,
        difficulty: payload.difficulty,
        contextPrompt,
        existingTitles: payload.existingTitles.map((t, i) => `${i + 1}. ${t}`).join('\n'),
      },
      responseSchema,
      userId,
    )

    return { success: true, question: result as GeneratedQuestion }
  } catch (error: any) {
    console.error('Failed to regenerate single question:', error)
    return { success: false, error: error.message || 'Failed to regenerate question.' }
  }
}
