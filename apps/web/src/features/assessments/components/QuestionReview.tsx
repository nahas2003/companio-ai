'use client'

import * as React from 'react'
import { Check, X, Shield, AlertCircle } from 'lucide-react'

export interface QuestionReviewItem {
  id: string
  title: string
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER'
  options: string[]
  correctAnswer?: number | null
  modelAnswer?: string | null
  selectedOption?: number | null
  modelResponse?: string | null
  isCorrect: boolean
}

export interface QuestionReviewProps {
  questions: QuestionReviewItem[]
}

export function QuestionReview({ questions }: QuestionReviewProps) {
  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-border pb-3">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-text-secondary flex items-center gap-2">
          <Shield className="w-4.5 h-4.5 text-primary" /> Evaluation Details & Responses Review
        </h2>
      </div>

      <div className="space-y-6">
        {questions.map((q, idx) => {
          return (
            <div
              key={q.id}
              className={`p-6 rounded-large bg-surface border shadow-sm transition-all duration-200 ${
                q.isCorrect ? 'border-teal-500/10' : 'border-red-500/10'
              }`}
            >
              {/* Question Title & Correct Status */}
              <div className="flex items-start gap-3 justify-between">
                <div className="flex items-start gap-2.5 text-left">
                  <span className="w-6 h-6 rounded-medium bg-surface-secondary border border-border text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <h3 className="text-sm md:text-base font-bold text-text-primary leading-relaxed">
                    {q.title}
                  </h3>
                </div>

                <span
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-medium text-[9px] font-extrabold uppercase tracking-widest ${
                    q.isCorrect
                      ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
                      : 'bg-red-500/10 text-red-600 dark:text-red-400'
                  }`}
                >
                  {q.isCorrect ? (
                    <>
                      <Check className="w-3 h-3" /> Correct
                    </>
                  ) : (
                    <>
                      <X className="w-3 h-3" /> Incorrect
                    </>
                  )}
                </span>
              </div>

              {/* Answers details */}
              <div className="mt-5 pl-8 space-y-4">
                {q.type === 'SHORT_ANSWER' ? (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">
                        Your submitted response:
                      </span>
                      <div
                        className={`p-3 rounded-medium text-xs font-semibold border ${
                          q.isCorrect
                            ? 'bg-teal-500/5 border-teal-500/10 text-text-primary'
                            : 'bg-red-500/5 border-red-500/10 text-text-primary'
                        }`}
                      >
                        {q.modelResponse ? (
                          q.modelResponse.trim()
                        ) : (
                          <span className="italic text-text-secondary">No response submitted</span>
                        )}
                      </div>
                    </div>

                    {!q.isCorrect && q.modelAnswer && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider block">
                          Accepted model answer:
                        </span>
                        <div className="p-3 bg-teal-500/5 border border-teal-500/10 rounded-medium text-xs font-semibold text-text-primary">
                          {q.modelAnswer}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = q.selectedOption === oIdx
                      const isCorrectAnswer = q.correctAnswer === oIdx

                      // Colored borders based on response accuracy
                      let optionBg = 'bg-surface-secondary border-border text-text-secondary'
                      let bulletBg = 'border-border text-text-secondary'

                      if (isSelected) {
                        if (q.isCorrect) {
                          optionBg =
                            'bg-teal-500/10 border-teal-500/20 text-teal-700 dark:text-teal-400 font-semibold'
                          bulletBg = 'bg-teal-500 border-transparent text-white'
                        } else {
                          optionBg =
                            'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400 font-semibold'
                          bulletBg = 'bg-red-500 border-transparent text-white'
                        }
                      } else if (isCorrectAnswer) {
                        optionBg =
                          'bg-teal-500/5 border-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold'
                        bulletBg = 'border-teal-500/20 text-teal-500'
                      }

                      return (
                        <div
                          key={oIdx}
                          className={`w-full p-3 rounded-medium border text-xs flex items-center gap-3 transition-colors ${optionBg}`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full border text-[9px] font-extrabold flex items-center justify-center ${bulletBg}`}
                          >
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="flex-1 text-left">{opt}</span>
                          {isSelected && q.isCorrect && (
                            <Check className="w-3.5 h-3.5 text-teal-500" />
                          )}
                          {isSelected && !q.isCorrect && <X className="w-3.5 h-3.5 text-red-500" />}
                          {!isSelected && isCorrectAnswer && (
                            <span className="text-[9px] font-extrabold uppercase tracking-wide text-teal-600 dark:text-teal-400">
                              Correct Key
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
