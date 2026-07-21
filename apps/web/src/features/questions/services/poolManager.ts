import { prisma } from '@companio/db'

export const poolManager = {
  async getMatchingQuestions(payload: {
    topic: string
    type: string
    difficulty: string
    count: number
  }) {
    try {
      const questions = await prisma.question.findMany({
        where: {
          topic: {
            contains: payload.topic.trim(),
            mode: 'insensitive',
          },
          type: payload.type as any,
          difficulty: payload.difficulty as any,
          deleted: false,
          archived: false,
        },
        take: payload.count,
      })

      return questions.map((q) => ({
        title: q.title,
        options: q.options,
        correctAnswer: q.correctAnswer,
        modelAnswer: q.modelAnswer,
      }))
    } catch (err) {
      console.error('Failed to query questions from pool:', err)
      return []
    }
  },

  async saveQuestionsToPool(
    questions: Array<{
      title: string
      options: string[]
      correctAnswer?: number | null
      modelAnswer?: string | null
    }>,
    topic: string,
    type: string,
    difficulty: string,
    userId: string,
  ) {
    try {
      if (questions.length === 0 || !userId) return

      // Find or create Global Reusable Pool bank for this user
      let globalBank = await prisma.questionBank.findFirst({
        where: { userId, name: 'Global Reusable Pool' },
      })
      if (!globalBank) {
        globalBank = await prisma.questionBank.create({
          data: {
            userId,
            name: 'Global Reusable Pool',
            description: 'System cache for reusable question pools',
          },
        })
      }

      for (const q of questions) {
        // Avoid saving exact duplicate title for the same user
        const exists = await prisma.question.findFirst({
          where: {
            questionBank: { userId },
            title: {
              equals: q.title.trim(),
              mode: 'insensitive',
            },
            deleted: false,
          },
        })

        if (!exists) {
          await prisma.question.create({
            data: {
              questionBankId: globalBank.id,
              title: q.title.trim(),
              type: type as any,
              difficulty: difficulty as any,
              options: q.options,
              correctAnswer: q.correctAnswer ?? null,
              modelAnswer: q.modelAnswer ?? null,
              topic: topic.toLowerCase().trim(),
            },
          })
        }
      }
    } catch (err) {
      console.error('Failed to save generated questions to pool:', err)
    }
  },
}
