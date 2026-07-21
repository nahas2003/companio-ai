'use server'

import { prisma, GenerationMethod, Difficulty, AttemptStatus } from '@companio/db'
import { getVerifiedUser } from './authUtils'
import { isRateLimited } from './rateLimiter'

// Helper to generate a unique 6-digit alphanumeric code
async function generateUniqueAssessmentCode(): Promise<string> {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  let isUnique = false

  while (!isUnique) {
    code = ''
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    const existing = await prisma.publishedAssessment.findUnique({
      where: { code },
    })

    if (!existing) {
      isUnique = true
    }
  }

  return code
}

export async function getAssessmentsDashboardAction(accessToken: string) {
  try {
    const verifiedUser = await getVerifiedUser(accessToken)

    const templates = await prisma.assessmentTemplate.findMany({
      where: { creatorId: verifiedUser.id, archived: false },
      include: {
        questionBank: true,
        published: {
          include: {
            attempts: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const questionBanks = await prisma.questionBank.findMany({
      where: { userId: verifiedUser.id, deleted: false },
      orderBy: { name: 'asc' },
    })

    return {
      success: true,
      templates: templates.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        timer: t.timer,
        passingScore: t.passingScore,
        createdAt: t.createdAt,
        questionBankName: t.questionBank.name,
        publishedCodes: t.published.map((p) => ({
          id: p.id,
          code: p.code,
          active: p.active,
          attemptsCount: p.attempts.length,
        })),
      })),
      questionBanks: questionBanks.map((q) => ({
        id: q.id,
        name: q.name,
      })),
    }
  } catch (error: any) {
    console.error('Error fetching assessments dashboard:', error)
    return { success: false, error: error.message || 'Failed to load dashboard.' }
  }
}

export async function createAssessmentTemplateAction(
  accessToken: string,
  payload: {
    questionBankId?: string
    title: string
    description?: string
    timer?: number // in minutes
    passingScore?: number // percentage e.g. 60
    shuffleQuestions?: boolean
    shuffleOptions?: boolean
    generationMethod?: GenerationMethod
    prompt?: string
    topic?: string
    documentReference?: string
    difficulty?: Difficulty
    questions?: {
      title: string
      options?: string[]
      correctAnswer?: number
      modelAnswer?: string
    }[]
  },
) {
  try {
    const verifiedUser = await getVerifiedUser(accessToken)

    if (!payload.title.trim()) {
      throw new Error('Assessment title is required.')
    }

    const template = await prisma.$transaction(async (tx) => {
      let finalBankId = payload.questionBankId

      // If custom questions array is provided, create an auto-generated QuestionBank first
      if (payload.questions && payload.questions.length > 0) {
        const bank = await tx.questionBank.create({
          data: {
            userId: verifiedUser.id,
            name: `Bank: ${payload.title.trim()}`,
            description: `Questions generated for ${payload.title.trim()}`,
          },
        })

        for (const q of payload.questions) {
          const qType =
            q.options && q.options.length > 0
              ? q.options.length === 2
                ? 'TRUE_FALSE'
                : 'MULTIPLE_CHOICE'
              : 'SHORT_ANSWER'

          await tx.question.create({
            data: {
              questionBankId: bank.id,
              title: q.title.trim(),
              options: q.options || [],
              correctAnswer: q.correctAnswer !== undefined ? q.correctAnswer : null,
              modelAnswer: q.modelAnswer || null,
              type: qType,
              difficulty: payload.difficulty || Difficulty.MEDIUM,
              topic: payload.topic || payload.title.trim(),
            },
          })
        }

        finalBankId = bank.id
      }

      if (!finalBankId) {
        throw new Error('Question bank context is missing.')
      }

      return await tx.assessmentTemplate.create({
        data: {
          creatorId: verifiedUser.id,
          questionBankId: finalBankId,
          title: payload.title.trim(),
          description: payload.description?.trim(),
          timer: payload.timer || null,
          passingScore: payload.passingScore ?? 60.0,
          shuffleQuestions: payload.shuffleQuestions ?? false,
          shuffleOptions: payload.shuffleOptions ?? false,
          generationMethod: payload.generationMethod || 'DOCUMENT',
          prompt: payload.prompt || null,
          topic: payload.topic || null,
          documentReference: payload.documentReference || null,
        },
      })
    })

    return { success: true, templateId: template.id }
  } catch (error: any) {
    console.error('Error creating assessment template:', error)
    return { success: false, error: error.message || 'Failed to create template.' }
  }
}

export async function createAndPublishAssessmentAction(
  accessToken: string,
  payload: Parameters<typeof createAssessmentTemplateAction>[1],
) {
  try {
    const res = await createAssessmentTemplateAction(accessToken, payload)
    if (!res.success || !res.templateId) {
      throw new Error(res.error || 'Failed to create assessment.')
    }
    const pubRes = await publishAssessmentAction(accessToken, res.templateId)
    if (!pubRes.success) {
      throw new Error(pubRes.error || 'Failed to publish assessment.')
    }
    return { success: true, code: pubRes.code, templateId: res.templateId }
  } catch (error: any) {
    console.error('Error creating and publishing assessment:', error)
    return { success: false, error: error.message }
  }
}

export async function publishAssessmentAction(accessToken: string, templateId: string) {
  try {
    const verifiedUser = await getVerifiedUser(accessToken)

    const template = await prisma.assessmentTemplate.findUnique({
      where: { id: templateId },
    })

    if (!template || template.creatorId !== verifiedUser.id) {
      throw new Error('Template not found or access denied.')
    }

    const code = await generateUniqueAssessmentCode()

    const published = await prisma.publishedAssessment.create({
      data: {
        templateId: template.id,
        code,
        active: true,
      },
    })

    try {
      const { triggerNotification } = await import('./notifications')
      await triggerNotification(verifiedUser.id, {
        title: 'Assessment Published Successfully',
        message: `Your assessment template "${template.title}" has been published with invitation code: ${code}. You can now share this code with participants.`,
        type: 'ASSESSMENT_PUBLISHED',
      })
    } catch (notifErr) {
      console.error('Failed to trigger assessment publish notification:', notifErr)
    }

    return { success: true, code: published.code }
  } catch (error: any) {
    console.error('Error publishing assessment:', error)
    return { success: false, error: error.message || 'Failed to publish assessment.' }
  }
}

export async function getPublishedAssessmentDetailsAction(code: string) {
  try {
    const published = await prisma.publishedAssessment.findUnique({
      where: { code: code.toUpperCase().trim() },
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
    })

    if (!published || !published.active) {
      throw new Error('Published assessment not found or inactive.')
    }

    const userOrg = await prisma.userOrganization.findFirst({
      where: { userId: published.template.creatorId },
      include: { organization: true },
    })
    const orgName = userOrg?.organization.name || 'Individual Creator'

    return {
      success: true,
      publishedId: published.id,
      title: published.template.title,
      description: published.template.description,
      timer: published.template.timer,
      passingScore: published.template.passingScore,
      questionCount: published.template.questionBank.questions.length,
      organizationName: orgName,
    }
  } catch (error: any) {
    console.error('Error fetching published assessment details:', error)
    return { success: false, error: error.message || 'Failed to resolve code.' }
  }
}

export async function joinAssessmentAction(
  accessToken: string | null,
  payload: {
    code: string
    guestName?: string
  },
) {
  try {
    const codeUpper = payload.code.toUpperCase().trim()

    // 1. Resolve published assessment
    const published = await prisma.publishedAssessment.findUnique({
      where: { code: codeUpper },
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
    })

    if (!published || !published.active) {
      throw new Error('Assessment code is invalid or expired.')
    }

    let userId: string | null = null
    let nameToUse = payload.guestName || 'Guest Participant'

    // 2. Optional auth session resolving
    if (accessToken) {
      try {
        const verifiedUser = await getVerifiedUser(accessToken)
        userId = verifiedUser.id
        nameToUse = verifiedUser.displayName || verifiedUser.email.split('@')[0]
      } catch (err) {
        console.warn('Soft authorization lookup bypassed:', err)
      }
    }

    // 3. Prevent duplicate active attempts
    if (userId) {
      const activeAttempt = await prisma.assessmentAttempt.findFirst({
        where: {
          publishedAssessmentId: published.id,
          userId,
          status: AttemptStatus.IN_PROGRESS,
        },
      })
      if (activeAttempt) {
        return {
          success: true,
          attemptId: activeAttempt.id,
          questions: published.template.questionBank.questions.map((q) => ({
            id: q.id,
            title: q.title,
            type: q.type,
            options: q.options,
          })),
          title: published.template.title,
          timer: published.template.timer,
        }
      }
    }

    // 4. Create new attempt
    const attempt = await prisma.assessmentAttempt.create({
      data: {
        publishedAssessmentId: published.id,
        userId,
        guestName: userId ? null : nameToUse,
        status: AttemptStatus.IN_PROGRESS,
        expiresAt: published.template.timer
          ? new Date(Date.now() + published.template.timer * 60 * 1000)
          : null,
      },
    })

    // Map questions to omit answer keys securely
    const safetyQuestions = published.template.questionBank.questions.map((q) => ({
      id: q.id,
      title: q.title,
      type: q.type,
      options: q.options,
    }))

    // Shuffle questions if configured
    if (published.template.shuffleQuestions) {
      safetyQuestions.sort(() => Math.random() - 0.5)
    }

    return {
      success: true,
      attemptId: attempt.id,
      questions: safetyQuestions,
      title: published.template.title,
      timer: published.template.timer,
    }
  } catch (error: any) {
    console.error('Error joining assessment:', error)
    return { success: false, error: error.message || 'Failed to join assessment.' }
  }
}

export async function submitAssessmentAttemptAction(
  accessToken: string | null,
  payload: {
    attemptId: string
    timeTaken: number // in seconds
    responses: {
      questionId: string
      selectedOption?: number
      modelResponse?: string
    }[]
  },
) {
  try {
    const attempt = await prisma.assessmentAttempt.findUnique({
      where: { id: payload.attemptId },
      include: {
        user: { select: { displayName: true } },
        publishedAssessment: {
          include: {
            template: {
              include: {
                questionBank: {
                  include: {
                    questions: {
                      where: { deleted: false },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })

    if (
      !attempt ||
      attempt.status === AttemptStatus.SUBMITTED ||
      attempt.status === AttemptStatus.EXPIRED
    ) {
      throw new Error('Attempt not found or already submitted.')
    }

    const questions = attempt.publishedAssessment.template.questionBank.questions
    const passingPercentage = attempt.publishedAssessment.template.passingScore
    let correctCount = 0

    const results = await prisma.$transaction(async (tx) => {
      // Clear auto-saved entries to avoid key collisions on final save
      await tx.assessmentResponse.deleteMany({
        where: { attemptId: attempt.id },
      })

      for (const res of payload.responses) {
        const question = questions.find((q) => q.id === res.questionId)
        if (!question) continue

        let isCorrect = false
        if (question.type === 'MULTIPLE_CHOICE' || question.type === 'TRUE_FALSE') {
          isCorrect = question.correctAnswer === res.selectedOption
        } else if (question.type === 'MULTIPLE_SELECT') {
          let correctIndices: number[] = []
          let userIndices: number[] = []
          try {
            correctIndices = JSON.parse(question.modelAnswer || '[]')
          } catch {}
          try {
            userIndices = JSON.parse(res.modelResponse || '[]')
          } catch {}
          isCorrect =
            correctIndices.length === userIndices.length &&
            correctIndices.every((val) => userIndices.includes(val))
        } else if (question.type === 'SHORT_ANSWER') {
          const normUser = (res.modelResponse || '').trim().toLowerCase()
          const normCorrect = (question.modelAnswer || '').trim().toLowerCase()
          isCorrect = normUser === normCorrect || normCorrect.includes(normUser)
        }

        if (isCorrect) correctCount++

        await tx.assessmentResponse.create({
          data: {
            attemptId: attempt.id,
            questionId: question.id,
            selectedOption: res.selectedOption !== undefined ? res.selectedOption : null,
            modelResponse: res.modelResponse || null,
            isCorrect,
            markedForReview: false,
          },
        })
      }

      const score = questions.length > 0 ? (correctCount / questions.length) * 100 : 0
      const passed = score >= passingPercentage

      await tx.assessmentAttempt.update({
        where: { id: attempt.id },
        data: {
          score,
          timeTaken: payload.timeTaken,
          status: AttemptStatus.SUBMITTED,
          completedAt: new Date(),
        },
      })

      return {
        score,
        timeTaken: payload.timeTaken,
        passed,
        correctCount,
        totalQuestions: questions.length,
      }
    })

    // Dispatch completion notification to the creator of the template asynchronously
    try {
      const { notificationDispatcher } =
        await import('@/features/notifications/services/dispatcher')
      const creatorId = attempt.publishedAssessment.template.questionBank.userId
      const candidateName = attempt.userId
        ? attempt.user?.displayName || 'Candidate'
        : attempt.guestName || 'Guest Candidate'

      notificationDispatcher
        .sendAssessmentCompleted(creatorId, {
          attemptId: attempt.id,
          title: `${candidateName}'s attempt on ${attempt.publishedAssessment.template.title}`,
          score: results.score,
        })
        .catch(console.error)
    } catch (notifErr) {
      console.error('Failed to trigger completion notification:', notifErr)
    }

    if (attempt.userId) {
      try {
        const { triggerNotification } = await import('./notifications')
        await triggerNotification(attempt.userId, {
          title: 'Assessment Attempt Graded',
          message: `Your attempt on "${attempt.publishedAssessment.template.title}" has been graded. Score: ${Math.round(results.score)}% (${results.passed ? 'PASSED' : 'FAILED'}).`,
          type: 'ASSESSMENT_COMPLETED',
        })
      } catch (notifErr) {
        console.error('Failed to trigger assessment completion notification:', notifErr)
      }
    }

    return { success: true, results }
  } catch (error: any) {
    console.error('Error submitting assessment:', error)
    return { success: false, error: error.message || 'Failed to submit assessment.' }
  }
}

export async function getAssessmentCreatorReportAction(accessToken: string, templateId: string) {
  try {
    const verifiedUser = await getVerifiedUser(accessToken)

    const template = await prisma.assessmentTemplate.findUnique({
      where: { id: templateId },
      include: {
        published: {
          include: {
            attempts: {
              include: {
                user: true,
              },
              orderBy: { completedAt: 'desc' },
            },
          },
        },
      },
    })

    if (!template || template.creatorId !== verifiedUser.id) {
      throw new Error('Template not found or access denied.')
    }

    const flatAttempts = template.published.flatMap((p) =>
      p.attempts.map((a) => ({
        id: a.id,
        code: p.code,
        participantName: a.userId
          ? a.user?.displayName || a.user?.email.split('@')[0]
          : a.guestName,
        score: a.score,
        timeTaken: a.timeTaken,
        status: a.status,
        completedAt: a.completedAt,
      })),
    )

    return {
      success: true,
      title: template.title,
      attempts: flatAttempts,
    }
  } catch (error: any) {
    console.error('Error fetching creator report:', error)
    return { success: false, error: error.message || 'Failed to retrieve report data.' }
  }
}

export async function getAssessmentAttemptAction(attemptId: string) {
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
      },
    })

    if (!attempt) {
      throw new Error('Assessment attempt record not found.')
    }

    const template = attempt.publishedAssessment.template

    // Server-side timer expiry check
    if (
      attempt.status === AttemptStatus.IN_PROGRESS &&
      attempt.expiresAt &&
      Date.now() > new Date(attempt.expiresAt).getTime()
    ) {
      const questions = template.questionBank.questions
      const responses = await prisma.assessmentResponse.findMany({
        where: { attemptId },
      })
      let correctCount = 0
      for (const res of responses) {
        const question = questions.find((q) => q.id === res.questionId)
        if (!question) continue
        if (res.isCorrect) correctCount++
      }
      const score = questions.length > 0 ? (correctCount / questions.length) * 100 : 0
      const limitSeconds = template.timer ? template.timer * 60 : 0

      await prisma.assessmentAttempt.update({
        where: { id: attempt.id },
        data: {
          status: AttemptStatus.EXPIRED,
          score,
          timeTaken: limitSeconds,
          completedAt: attempt.expiresAt,
        },
      })

      attempt.status = AttemptStatus.EXPIRED
      attempt.score = score
      attempt.timeTaken = limitSeconds
    }

    const safetyQuestions = template.questionBank.questions.map((q) => ({
      id: q.id,
      title: q.title,
      type: q.type,
      options: q.options,
    }))

    if (template.shuffleQuestions) {
      safetyQuestions.sort(() => Math.random() - 0.5)
    }

    const responses = await prisma.assessmentResponse.findMany({
      where: { attemptId },
      select: {
        questionId: true,
        selectedOption: true,
        modelResponse: true,
        markedForReview: true,
      },
    })

    return {
      success: true,
      status: attempt.status,
      score: attempt.score,
      timeTaken: attempt.timeTaken,
      title: template.title,
      description: template.description,
      timer: template.timer,
      passingScore: template.passingScore,
      questions: safetyQuestions,
      guestName: attempt.guestName,
      userId: attempt.userId,
      startedAt: attempt.startedAt,
      expiresAt: attempt.expiresAt,
      currentQuestionId: attempt.currentQuestionId,
      responses,
    }
  } catch (error: any) {
    console.error('Error fetching attempt details:', error)
    return { success: false, error: error.message || 'Failed to retrieve attempt details.' }
  }
}

export async function saveAssessmentResponseAction(
  accessToken: string | null,
  payload: {
    attemptId: string
    questionId: string
    selectedOption?: number
    modelResponse?: string
    markedForReview?: boolean
    currentQuestionId?: string
  },
) {
  try {
    const attempt = await prisma.assessmentAttempt.findUnique({
      where: { id: payload.attemptId },
    })

    if (!attempt || attempt.status !== AttemptStatus.IN_PROGRESS) {
      throw new Error('Attempt is not active.')
    }

    // Throttled database upsert
    const existing = await prisma.assessmentResponse.findFirst({
      where: {
        attemptId: attempt.id,
        questionId: payload.questionId,
      },
    })

    const isMarked = payload.markedForReview !== undefined ? payload.markedForReview : false

    if (existing) {
      await prisma.assessmentResponse.update({
        where: { id: existing.id },
        data: {
          selectedOption: payload.selectedOption !== undefined ? payload.selectedOption : null,
          modelResponse: payload.modelResponse || null,
          markedForReview: isMarked,
        },
      })
    } else {
      await prisma.assessmentResponse.create({
        data: {
          attemptId: attempt.id,
          questionId: payload.questionId,
          selectedOption: payload.selectedOption !== undefined ? payload.selectedOption : null,
          modelResponse: payload.modelResponse || null,
          markedForReview: isMarked,
        },
      })
    }

    if (payload.currentQuestionId) {
      await prisma.assessmentAttempt.update({
        where: { id: attempt.id },
        data: { currentQuestionId: payload.currentQuestionId },
      })
    }

    return { success: true }
  } catch (error: any) {
    console.error('Error auto-saving assessment response:', error)
    return { success: false, error: error.message }
  }
}
