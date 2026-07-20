'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/features/auth/store/authStore'
import { getPracticeSessionResultsAction } from '../../../../actions/practice'
import {
  RefreshCw,
  AlertTriangle,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  HelpCircle,
  ArrowLeft,
  BookOpen,
} from 'lucide-react'

export default function PracticeResultsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { session } = useAuthStore()

  const [loading, setLoading] = React.useState(true)
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)
  const [data, setData] = React.useState<any | null>(null)

  const loadResults = React.useCallback(async () => {
    if (!session || !params.id) return
    try {
      setLoading(true)
      const res = await getPracticeSessionResultsAction(session.access_token, params.id)
      if (res.success) {
        setData(res)
      } else {
        setErrorMsg(res.error || 'Failed to load practice results.')
      }
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'An error occurred while loading results.')
    } finally {
      setLoading(false)
    }
  }, [session, params.id])

  React.useEffect(() => {
    loadResults()
  }, [loadResults])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[400px] gap-3 text-slate-400">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="text-sm font-semibold tracking-wide animate-pulse">
          Retrieving score statistics...
        </span>
      </div>
    )
  }

  if (errorMsg || !data) {
    return (
      <div className="max-w-md mx-auto p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex flex-col items-center gap-4 text-center mt-12">
        <AlertTriangle className="w-12 h-12 text-red-400" />
        <div className="text-sm text-red-200">{errorMsg || 'Results not found.'}</div>
        <button
          onClick={() => router.push('/practice')}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold transition"
        >
          Return to Practice
        </button>
      </div>
    )
  }

  const { session: practice, answers } = data
  const score = practice.score || 0
  const correctCount = answers.filter((a: any) => a.isCorrect).length
  const totalCount = answers.length

  const scoreColor =
    score >= 80
      ? 'text-teal-400 border-teal-500/20 bg-teal-500/5'
      : score >= 60
        ? 'text-amber-400 border-amber-500/20 bg-amber-500/5'
        : 'text-red-400 border-red-500/20 bg-red-500/5'

  return (
    <div className="max-w-3xl mx-auto space-y-8 text-white text-left pb-12 animate-fade-in">
      {/* Back link */}
      <div>
        <Link
          href="/practice"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Practice Dashboard
        </Link>
      </div>

      {/* Hero Stats */}
      <div
        className={`p-8 rounded-3xl border ${scoreColor} backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6`}
      >
        <div className="space-y-2 text-center md:text-left">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Quiz Graded
          </span>
          <h1 className="text-2xl font-bold text-slate-100">{practice.bankName}</h1>
          <p className="text-xs text-slate-400">
            Completed on {new Date(practice.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              Accuracy
            </div>
            <div className="text-4xl font-extrabold tracking-tight mt-1">{Math.round(score)}%</div>
          </div>
          <div className="h-10 w-px bg-white/10" />
          <div className="text-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              Grading
            </div>
            <div className="text-lg font-bold mt-1 text-slate-200">
              {correctCount} / {totalCount} Correct
            </div>
          </div>
          <div className="h-10 w-px bg-white/10" />
          <div className="text-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              Time Taken
            </div>
            <div className="text-lg font-bold mt-1 text-slate-200 flex items-center justify-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              {formatDuration(practice.timeTaken)}
            </div>
          </div>
        </div>
      </div>

      {/* Review details */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" /> Detailed Question Review
        </h2>

        <div className="space-y-4">
          {answers.map((ans: any, idx: number) => {
            return (
              <div
                key={ans.id}
                className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <h3 className="font-bold text-slate-200 leading-relaxed">{ans.title}</h3>
                  </div>

                  <span className="flex-shrink-0">
                    {ans.isCorrect ? (
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 border border-teal-500/20 text-teal-400 uppercase tracking-wider">
                        <CheckCircle className="w-3.5 h-3.5" /> Correct
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 border border-red-500/20 text-red-400 uppercase tracking-wider">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect
                      </span>
                    )}
                  </span>
                </div>

                {/* Choices or input check */}
                {ans.type === 'SHORT_ANSWER' ? (
                  <div className="space-y-2 pl-9 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-white/5">
                      <div className="text-slate-400 font-bold mb-1 uppercase tracking-wide text-[10px]">
                        Your Response:
                      </div>
                      <div className="text-slate-200">
                        {ans.modelAnswer || (
                          <em className="text-slate-600">No response provided</em>
                        )}
                      </div>
                    </div>
                    {!ans.isCorrect && (
                      <div className="p-3.5 rounded-xl bg-teal-950/20 border border-teal-500/15">
                        <div className="text-teal-400 font-bold mb-1 uppercase tracking-wide text-[10px]">
                          Model Answer Key:
                        </div>
                        <div className="text-slate-200">{ans.correctModelAnswer}</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2 pl-9 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {ans.options.map((opt: string, optIdx: number) => {
                        const isSelected = ans.selectedOption === optIdx
                        const isCorrect = ans.correctAnswer === optIdx

                        let optClass = 'border-white/5 bg-slate-900 text-slate-400'
                        if (isSelected && isCorrect) {
                          optClass = 'border-teal-500/50 bg-teal-500/10 text-teal-300 font-semibold'
                        } else if (isSelected && !isCorrect) {
                          optClass = 'border-red-500/50 bg-red-500/10 text-red-300 font-semibold'
                        } else if (isCorrect) {
                          optClass = 'border-teal-500/30 bg-teal-500/5 text-teal-400'
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-3 rounded-lg border flex items-center gap-2 ${optClass}`}
                          >
                            <span className="w-4 h-4 rounded-full border text-[9px] font-bold flex items-center justify-center border-current">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
