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
