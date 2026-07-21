'use client'

import * as React from 'react'
import { Award, Clock, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'

export interface ResultSummaryProps {
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
}

export function ResultSummary({
  title,
  description,
  score,
  passingScore,
  passed,
  totalQuestions,
  correctAnswers,
  incorrectAnswers,
  unansweredQuestions,
  timeTaken,
  guestName,
  averageTimePerQuestion,
}: ResultSummaryProps) {
  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60)
    const secs = sec % 60
    return `${mins}m ${secs}s`
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div
        className={`p-6 md:p-8 rounded-large border shadow-sm relative overflow-hidden transition-all duration-200 bg-surface ${
          passed ? 'border-teal-500/20 bg-teal-500/5' : 'border-red-500/20 bg-red-500/5'
        }`}
      >
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 text-left">
            <div
              className={`w-14 h-14 rounded-large flex items-center justify-center shadow-sm flex-shrink-0 ${
                passed ? 'bg-teal-500/10 text-teal-500' : 'bg-red-500/10 text-red-500'
              }`}
            >
              <Award className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-text-secondary">
                {guestName ? `${guestName} (Guest Candidate)` : 'Candidate Attempt'}
              </span>
              <h1 className="text-xl md:text-2xl font-extrabold text-text-primary mt-0.5 leading-snug">
                {title}
              </h1>
              {description && (
                <p className="text-xs text-text-secondary mt-1 font-semibold line-clamp-2">
                  {description}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <span
              className={`px-3.5 py-1.5 rounded-medium text-xs font-extrabold uppercase tracking-widest shadow-sm border ${
                passed
                  ? 'bg-teal-500/10 border-teal-500/20 text-teal-600 dark:text-teal-400'
                  : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
              }`}
            >
              {passed ? 'PASSED' : 'FAILED'}
            </span>
            <span className="text-[10px] text-text-secondary font-bold mt-2">
              Required: {passingScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Accuracy Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Score Card */}
        <div className="p-5 rounded-large bg-surface border border-border shadow-sm flex flex-col justify-between">
          <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">
            Overall Score
          </span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-text-primary">{Math.round(score)}%</span>
          </div>
          <div className="w-full h-1.5 bg-surface-secondary border border-border rounded-full overflow-hidden mt-3">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                passed ? 'bg-teal-500' : 'bg-red-500'
              }`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* Correct Answers */}
        <div className="p-5 rounded-large bg-surface border border-border shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">
              Correct Answers
            </span>
            <span className="text-2xl font-extrabold text-teal-600 dark:text-teal-400 block">
              {correctAnswers}{' '}
              <span className="text-xs text-text-secondary">/ {totalQuestions}</span>
            </span>
          </div>
          <CheckCircle2 className="w-8 h-8 text-teal-500/20 flex-shrink-0" />
        </div>

        {/* Incorrect/Unanswered */}
        <div className="p-5 rounded-large bg-surface border border-border shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">
              Errors / Skipped
            </span>
            <span className="text-2xl font-extrabold text-red-600 dark:text-red-400 block">
              {incorrectAnswers}{' '}
              <span className="text-[10px] text-text-secondary">
                ({unansweredQuestions} skipped)
              </span>
            </span>
          </div>
          <XCircle className="w-8 h-8 text-red-500/20 flex-shrink-0" />
        </div>

        {/* Time Stats */}
        <div className="p-5 rounded-large bg-surface border border-border shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">
              Duration / Average
            </span>
            <span className="text-base font-extrabold text-text-primary block">
              {formatDuration(timeTaken)}
            </span>
            {averageTimePerQuestion && (
              <span className="text-[9px] text-text-secondary font-bold block">
                ~{averageTimePerQuestion}s per question
              </span>
            )}
          </div>
          <Clock className="w-8 h-8 text-primary/20 flex-shrink-0" />
        </div>
      </div>
    </div>
  )
}
