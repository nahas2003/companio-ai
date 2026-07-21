'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useProctoring } from '@/features/assessments/hooks/useProctoring'
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
  Award,
  Shield,
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

  // Redirect to results immediately if attempt is already completed
  React.useEffect(() => {
    if (!loading && examState?.status === 'COMPLETED') {
      router.replace(`/assessments/results/${params.attemptId}`)
    }
  }, [loading, examState, params.attemptId, router])

  // Consume the reusable proctoring hook
  const { blurCount, warningMessage, clearWarning, warningLevel } = useProctoring({
    enabled: !loading && !errorMsg && examState?.status === 'IN_PROGRESS',
    attemptId: params.attemptId,
  })

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
          if (timerRef.current) clearInterval(timerRef.current)
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
      <div className="flex flex-col items-center justify-center p-12 min-h-[400px] gap-3 text-text-secondary">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <span className="text-sm font-semibold tracking-wide animate-pulse">
          Initializing exam portal...
        </span>
      </div>
    )
  }

  if (errorMsg || !examState) {
    return (
      <div className="max-w-md mx-auto p-6 bg-red-500/10 border border-red-500/20 rounded-large flex flex-col items-center gap-4 text-center mt-12 shadow-sm">
        <AlertTriangle className="w-12 h-12 text-red-500" />
        <div className="text-sm font-semibold text-text-primary">
          {errorMsg || 'Exam record not found.'}
        </div>
        <button
          onClick={() => router.push('/assessments/join')}
          className="px-4 py-2 bg-surface hover:bg-surface-secondary border border-border rounded-medium text-xs font-bold transition duration-200 text-text-primary"
        >
          Return to Joins
        </button>
      </div>
    )
  }

  // COMPLETED STATE: Render redirect loading state while transitioning
  if (examState.status === 'COMPLETED') {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[400px] gap-3 text-text-secondary w-full">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <span className="text-sm font-semibold tracking-wide animate-pulse">
          Exam submitted. Preparing performance reports...
        </span>
      </div>
    )
  }

  // ACTIVE PLAY STATE
  const currentQuestion = examState.questions[currentIndex]
  const totalQuestions = examState.questions.length
  const currentResponse = responses[currentQuestion.id]

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-text-primary text-left pb-12 animate-fade-in w-full">
      {/* Proctoring Warning Banner */}
      {warningMessage && (
        <div
          className={`p-4 rounded-medium border text-xs font-semibold flex items-center justify-between animate-fade-in shadow-sm ${
            warningLevel === 'critical'
              ? 'bg-red-500/10 border-red-500/20 text-red-500'
              : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Shield className="w-4.5 h-4.5 flex-shrink-0" />
            <span>{warningMessage}</span>
          </div>
          <button
            onClick={clearWarning}
            className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-medium transition duration-200 ${
              warningLevel === 'critical'
                ? 'bg-red-500/10 hover:bg-red-500/20'
                : 'bg-amber-500/10 hover:bg-amber-500/20'
            }`}
          >
            Acknowledge
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-primary" /> Proctored Assessment
          </span>
          <h1 className="text-xl font-bold text-text-primary line-clamp-1 mt-0.5">
            {examState.title}
          </h1>
        </div>

        {examState.timer && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-medium bg-red-500/15 border border-red-500/20 text-red-500 text-sm font-bold shadow-sm">
            <Clock className="w-4 h-4 animate-pulse" />
            <span>{formatTimer(timeRemaining)}</span>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-text-secondary">
          <span>
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span>{Math.round(((currentIndex + 1) / totalQuestions) * 100)}% Complete</span>
        </div>
        <div className="w-full h-2 bg-surface border border-border rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="p-6 md:p-8 rounded-large bg-surface border border-border shadow-md min-h-[300px] flex flex-col justify-between space-y-6">
        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-medium bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
              {currentIndex + 1}
            </span>
            <h2 className="text-base md:text-lg font-bold text-text-primary leading-relaxed">
              {currentQuestion.title}
            </h2>
          </div>

          {currentQuestion.type === 'SHORT_ANSWER' ? (
            <div className="space-y-2 pl-9">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">
                Write your response
              </label>
              <textarea
                rows={4}
                value={currentResponse?.modelResponse || ''}
                onChange={(e) => handleTextResponse(currentQuestion.id, e.target.value)}
                placeholder="Type your exam response here..."
                className="w-full px-4 py-3 rounded-medium border border-border bg-surface-secondary text-text-primary text-sm outline-none focus:border-primary/50 resize-none transition duration-200 shadow-sm"
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
                    className={`w-full text-left p-4 rounded-medium border transition-all duration-200 flex items-center gap-3 shadow-sm ${
                      isSelected
                        ? 'bg-primary/10 border-primary/20 text-primary font-bold'
                        : 'bg-surface-secondary border-border text-text-secondary hover:bg-surface hover:text-text-primary'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full border text-[10px] font-extrabold flex items-center justify-center transition duration-200 ${
                        isSelected
                          ? 'bg-primary border-transparent text-white'
                          : 'border-border text-text-secondary'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm font-semibold">{opt}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-border">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-medium bg-surface-secondary border border-border hover:bg-surface disabled:opacity-30 disabled:pointer-events-none text-xs font-bold text-text-primary transition duration-200"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          {currentIndex < totalQuestions - 1 ? (
            <button
              onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, totalQuestions - 1))}
              className="flex items-center gap-1.5 px-4 py-2 rounded-medium bg-surface-secondary border border-border hover:bg-surface text-xs font-bold text-text-primary transition duration-200"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-medium bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition duration-200 shadow-md shadow-teal-500/10"
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
