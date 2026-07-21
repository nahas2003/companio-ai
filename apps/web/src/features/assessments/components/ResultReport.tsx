'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ResultSummary } from './ResultSummary'
import { QuestionReview, QuestionReviewItem } from './QuestionReview'
import { ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react'

export interface ResultReportProps {
  attemptId: string
  resultsData: {
    title: string
    description?: string
    score: number
    passingScore: number
    passed: boolean
    totalQuestions: number
    correctAnswers: number
    incorrectAnswers: number
    unansweredQuestions: number
    timeTaken: number
    guestName?: string | null
    averageTimePerQuestion?: number | null
    completedAt?: Date | string | null
    questions: QuestionReviewItem[]
  }
}

export function ResultReport({ attemptId, resultsData }: ResultReportProps) {
  const router = useRouter()

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-fade-in w-full">
      {/* Return Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/assessments/join')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-text-primary transition duration-200"
        >
          <ArrowLeft className="w-4 h-4" /> Exit Results Workspace
        </button>
        <button
          onClick={() => router.push(`/assessments/results/${attemptId}/leaderboard`)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/85 transition duration-200"
        >
          View Room Leaderboard <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Summary Score section */}
      <ResultSummary
        title={resultsData.title}
        description={resultsData.description}
        score={resultsData.score}
        passingScore={resultsData.passingScore}
        passed={resultsData.passed}
        totalQuestions={resultsData.totalQuestions}
        correctAnswers={resultsData.correctAnswers}
        incorrectAnswers={resultsData.incorrectAnswers}
        unansweredQuestions={resultsData.unansweredQuestions}
        timeTaken={resultsData.timeTaken}
        guestName={resultsData.guestName}
        averageTimePerQuestion={resultsData.averageTimePerQuestion}
        completedAt={resultsData.completedAt}
      />

      {/* Question Responses review details list */}
      <QuestionReview questions={resultsData.questions} />
    </div>
  )
}
