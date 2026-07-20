'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/features/auth/store/authStore'
import {
  getAssessmentAttemptAction,
  submitAssessmentAttemptAction,
} from '../../../../actions/assessments'
import {
  RefreshCw,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  Award,
  BookOpen,
  ArrowRight,
} from 'lucide-react'

export default function AssessmentAttemptPage({ params }: { params: { attemptId: string } }) {
  const router = useRouter()
  const { session } = useAuthStore()

  // Data states
  const [loading, setLoading] = React.useState(true)
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)
  const [examState, setExamState] = React.useState<any | null>(null)

  // Gameplay
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [responses, setResponses] = React.useState<
    Record<string, { selectedOption?: number; modelResponse?: string }>
  >({})
  const [submitting, setSubmitting] = React.useState(false)

  // Clock
  const [timeRemaining, setTimeRemaining] = React.useState(0)
  const [timeElapsed, setTimeElapsed] = React.useState(0)
  const timerRef = React.useRef<NodeJS.Timeout | null>(null)

  const loadExamDetails = React.useCallback(async () => {
    try {
      setLoading(true)
      const res = await getAssessmentAttemptAction(params.attemptId)
      if (res.success) {
        setExamState(res)

        // Set up secure proctored timer bounds if active
        if (res.status === 'IN_PROGRESS' && res.timer) {
          const limitSeconds = res.timer * 60
          const startedMs = new Date(res.startedAt).getTime()
          const elapsed = Math.floor((Date.now() - startedMs) / 1000)
          const remaining = Math.max(limitSeconds - elapsed, 0)

          setTimeRemaining(remaining)
          setTimeElapsed(elapsed)
        }
      } else {
        setErrorMsg(res.error || 'Failed to load assessment details.')
      }
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'An error occurred during exam loading.')
    } finally {
      setLoading(false)
    }
  }, [params.attemptId])

  React.useEffect(() => {
    loadExamDetails()
  }, [loadExamDetails])

  // Timer countdown hook
  React.useEffect(() => {
    if (
      loading ||
      errorMsg ||
      submitting ||
      !examState ||
      examState.status !== 'IN_PROGRESS' ||
      !examState.timer
    )
      return

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          handleAutoSubmit()
          return 0
        }
        return prev - 1
      })
      setTimeElapsed((prev) => prev + 1)
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [loading, errorMsg, submitting, examState])

  const handleSelectOption = (questionId: string, idx: number) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: { selectedOption: idx },
    }))
  }

  const handleTextResponse = (questionId: string, text: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: { modelResponse: text },
    }))
  }

  const handleSubmit = async () => {
    if (submitting) return

    try {
      setSubmitting(true)
      const payloadResponses = examState.questions.map((q: any) => ({
        questionId: q.id,
        selectedOption: responses[q.id]?.selectedOption,
        modelResponse: responses[q.id]?.modelResponse,
      }))

      const res = await submitAssessmentAttemptAction(session?.access_token || null, {
        attemptId: params.attemptId,
        timeTaken: timeElapsed,
        responses: payloadResponses,
      })

      if (res.success && res.results) {
        // Refresh local view to show the result summary directly!
        loadExamDetails()
      } else {
        alert(res.error || 'Failed to submit exam attempt.')
      }
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'An error occurred during submission.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAutoSubmit = () => {
    alert('Timer limit expired! Submitting answers automatically.')
    handleSubmit()
  }

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60)
    const secs = sec % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[400px] gap-3 text-slate-400">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="text-sm font-semibold tracking-wide animate-pulse">
          Initializing exam portal...
        </span>
      </div>
    )
  }

  if (errorMsg || !examState) {
    return (
      <div className="max-w-md mx-auto p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex flex-col items-center gap-4 text-center mt-12">
        <AlertTriangle className="w-12 h-12 text-red-400" />
        <div className="text-sm text-red-200">{errorMsg || 'Exam record not found.'}</div>
        <button
          onClick={() => router.push('/assessments/join')}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold transition"
        >
          Return to Joins
        </button>
      </div>
    )
  }

  // COMPLETED STATE: Show report card immediately
  if (examState.status === 'COMPLETED') {
    const score = examState.score || 0
    const isPass = score >= examState.passingScore

    return (
      <div className="max-w-md mx-auto space-y-6 text-white text-left pb-12 pt-12 animate-fade-in">
        <div
          className={`p-8 rounded-3xl border text-center space-y-5 bg-white/5 shadow-2xl ${
            isPass ? 'border-teal-500/20 bg-teal-500/5' : 'border-red-500/20 bg-red-500/5'
          }`}
        >
          <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-teal-400 mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Exam Results
            </span>
            <h1 className="text-xl font-bold mt-1 line-clamp-1">{examState.title}</h1>
            <p className="text-xs text-slate-400 mt-0.5">Attempt graded</p>
          </div>

          <div className="py-4 border-y border-white/5 grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wide">
                Final score
              </span>
              <span className="text-3xl font-extrabold block mt-0.5">{Math.round(score)}%</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wide">
                Status
              </span>
              <span
                className={`text-lg font-bold block mt-1 uppercase tracking-wider ${
                  isPass ? 'text-teal-400' : 'text-red-400'
                }`}
              >
                {isPass ? 'PASSED' : 'FAILED'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Passing grade: {examState.passingScore}%</span>
            <span>Duration: {formatTimer(examState.timeTaken || 0)}</span>
          </div>

          <button
            onClick={() => router.push('/assessments/join')}
            className="w-full py-3 bg-violet-600 hover:bg-violet-500 rounded-xl text-white font-bold text-xs transition"
          >
            Leave Exam Hall
          </button>
        </div>
      </div>
    )
  }

  // ACTIVE PLAY STATE
  const currentQuestion = examState.questions[currentIndex]
  const totalQuestions = examState.questions.length
  const currentResponse = responses[currentQuestion.id]

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-white text-left pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Proctored Assessment
          </span>
          <h1 className="text-xl font-bold text-slate-100 line-clamp-1">{examState.title}</h1>
        </div>

        {examState.timer && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/15 border border-red-500/20 text-red-400 text-sm font-bold">
            <Clock className="w-4 h-4 animate-pulse" />
            <span>{formatTimer(timeRemaining)}</span>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400">
          <span>
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span>{Math.round(((currentIndex + 1) / totalQuestions) * 100)}% Complete</span>
        </div>
        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-violet-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md min-h-[300px] flex flex-col justify-between space-y-6">
        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
              {currentIndex + 1}
            </span>
            <h2 className="text-lg font-bold text-slate-100 leading-relaxed">
              {currentQuestion.title}
            </h2>
          </div>

          {currentQuestion.type === 'SHORT_ANSWER' ? (
            <div className="space-y-2 pl-9">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Write your response
              </label>
              <textarea
                rows={4}
                value={currentResponse?.modelResponse || ''}
                onChange={(e) => handleTextResponse(currentQuestion.id, e.target.value)}
                placeholder="Type your exam response here..."
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950 text-white text-sm outline-none focus:border-violet-500/50 resize-none"
              />
            </div>
          ) : (
            <div className="space-y-2.5 pl-9">
              {currentQuestion.options.map((opt: string, idx: number) => {
                const isSelected = currentResponse?.selectedOption === idx
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(currentQuestion.id, idx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                      isSelected
                        ? 'bg-violet-600/10 border-violet-500 text-white font-semibold'
                        : 'bg-slate-900 border-white/5 text-slate-300 hover:bg-white/5 hover:border-white/10'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full border text-[10px] font-bold flex items-center justify-center ${
                        isSelected
                          ? 'bg-violet-500 border-transparent text-white'
                          : 'border-slate-600 text-slate-400'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-white/5">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold transition"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          {currentIndex < totalQuestions - 1 ? (
            <button
              onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, totalQuestions - 1))}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-xs font-bold transition"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition shadow-lg shadow-teal-500/10"
            >
              {submitting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              {submitting ? 'Submitting Exam...' : 'Submit Examination'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
