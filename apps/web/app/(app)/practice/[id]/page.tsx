'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/features/auth/store/authStore'
import { startPracticeSessionAction, submitPracticeSessionAction } from '../../../actions/practice'
import {
  RefreshCw,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  HelpCircle,
  Play,
  Bookmark,
  BookmarkCheck,
  CornerDownRight,
  List,
} from 'lucide-react'

export default function PracticePlayroomPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { session } = useAuthStore()

  // Session & Questions
  const [loading, setLoading] = React.useState(true)
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)
  const [questions, setQuestions] = React.useState<any[]>([])
  const [sessionId, setSessionId] = React.useState<string | null>(null)
  const [bankName, setBankName] = React.useState('')

  // Gameplay
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [answers, setAnswers] = React.useState<
    Record<string, { selectedOption?: number; modelAnswer?: string }>
  >({})
  const [markedQuestions, setMarkedQuestions] = React.useState<Record<string, boolean>>({})
  const [submitting, setSubmitting] = React.useState(false)

  // Timer: default 15 minutes (900 seconds)
  const [timeRemaining, setTimeRemaining] = React.useState(900)
  const [timeElapsed, setTimeElapsed] = React.useState(0)
  const timerRef = React.useRef<NodeJS.Timeout | null>(null)

  const initPractice = React.useCallback(async () => {
    if (!session || !params.id) return
    try {
      setLoading(true)
      const res = await startPracticeSessionAction(session.access_token, params.id)
      if (res.success && res.sessionId && res.questions) {
        setSessionId(res.sessionId)
        setQuestions(res.questions)
        setBankName(res.bankName || 'Practice Session')

        // Load any previously completed answers for this resume session
        if (res.isResume && res.answers) {
          const prefilledAnswers: Record<
            string,
            { selectedOption?: number; modelAnswer?: string }
          > = {}
          res.answers.forEach((ans: any) => {
            prefilledAnswers[ans.questionId] = {
              selectedOption: ans.selectedOption,
              modelAnswer: ans.modelAnswer,
            }
          })
          setAnswers(prefilledAnswers)
        }
      } else {
        setErrorMsg(res.error || 'Failed to initialize practice session.')
      }
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'An error occurred during session initialization.')
    } finally {
      setLoading(false)
    }
  }, [session, params.id])

  React.useEffect(() => {
    initPractice()
  }, [initPractice])

  // Timer countdown
  React.useEffect(() => {
    if (loading || errorMsg || submitting || !sessionId) return

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
  }, [loading, errorMsg, submitting, sessionId])

  const handleSelectOption = (questionId: string, idx: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { selectedOption: idx },
    }))
  }

  const handleTextAnswer = (questionId: string, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { modelAnswer: text },
    }))
  }

  const handleToggleMark = (questionId: string) => {
    setMarkedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }))
  }

  const handleSkip = () => {
    // Clear answer state for the current question
    setAnswers((prev) => {
      const copy = { ...prev }
      delete copy[currentQuestion.id]
      return copy
    })
    // Move to next question if possible
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const handleSubmit = async () => {
    if (!session || !sessionId || submitting) return

    try {
      setSubmitting(true)
      const answersPayload = questions.map((q) => ({
        questionId: q.id,
        selectedOption: answers[q.id]?.selectedOption,
        modelAnswer: answers[q.id]?.modelAnswer,
      }))

      const res = await submitPracticeSessionAction(session.access_token, {
        sessionId,
        timeTaken: timeElapsed,
        answers: answersPayload,
      })

      if (res.success) {
        router.push(`/practice/${sessionId}/results`)
      } else {
        alert(res.error || 'Failed to submit answers.')
      }
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'An error occurred during submission.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAutoSubmit = () => {
    alert('Time has expired! Submitting your answers automatically.')
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
          Building practice playroom...
        </span>
      </div>
    )
  }

  if (errorMsg) {
    return (
      <div className="max-w-md mx-auto p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex flex-col items-center gap-4 text-center mt-12">
        <AlertTriangle className="w-12 h-12 text-red-400" />
        <div className="text-sm text-red-200">{errorMsg}</div>
        <button
          onClick={() => router.push('/practice')}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold transition"
        >
          Return to Dashboard
        </button>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]
  const totalQuestions = questions.length
  const currentAnswer = answers[currentQuestion.id]
  const isMarked = !!markedQuestions[currentQuestion.id]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto pb-12 animate-fade-in text-white text-left">
      {/* LEFT 3 COLS: Play card area */}
      <div className="lg:col-span-3 space-y-6">
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Self-Practice Deck
            </span>
            <h1 className="text-xl font-bold text-slate-100 line-clamp-1">{bankName}</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Mark for review button */}
            <button
              onClick={() => handleToggleMark(currentQuestion.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                isMarked
                  ? 'bg-amber-500/15 border-amber-500/35 text-amber-400 font-bold'
                  : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {isMarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              <span>{isMarked ? 'Marked for Review' : 'Mark for Review'}</span>
            </button>

            {/* Timer Box */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/20 text-amber-400 text-sm font-bold">
              <Clock className="w-4 h-4 animate-pulse" />
              <span>{formatTimer(timeRemaining)}</span>
            </div>
          </div>
        </div>

        {/* Progress indicators */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <span>{Math.round(((currentIndex + 1) / totalQuestions) * 100)}% Complete</span>
          </div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Card sheet */}
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md min-h-[300px] flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {currentIndex + 1}
              </span>
              <h2 className="text-lg font-bold text-slate-100 leading-relaxed">
                {currentQuestion.title}
              </h2>
            </div>

            {/* Question fields */}
            {currentQuestion.type === 'SHORT_ANSWER' ? (
              <div className="space-y-2 pl-9">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Write your response
                </label>
                <textarea
                  rows={4}
                  value={currentAnswer?.modelAnswer || ''}
                  onChange={(e) => handleTextAnswer(currentQuestion.id, e.target.value)}
                  placeholder="Type your study response here..."
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950 text-white text-sm outline-none focus:border-blue-500/50 resize-none"
                />
              </div>
            ) : (
              <div className="space-y-2.5 pl-9">
                {currentQuestion.options.map((opt: string, idx: number) => {
                  const isSelected = currentAnswer?.selectedOption === idx
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(currentQuestion.id, idx)}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                        isSelected
                          ? 'bg-blue-600/10 border-blue-500 text-white font-semibold'
                          : 'bg-slate-900 border-white/5 text-slate-300 hover:bg-white/5 hover:border-white/10'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full border text-[10px] font-bold flex items-center justify-center ${
                          isSelected
                            ? 'bg-blue-500 border-transparent text-white'
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

          {/* Action triggers */}
          <div className="flex items-center justify-between pt-6 border-t border-white/5 gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
                disabled={currentIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold transition"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <button
                onClick={handleSkip}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white font-bold transition"
              >
                Skip <CornerDownRight className="w-3.5 h-3.5" />
              </button>
            </div>

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
                {submitting ? 'Submitting...' : 'Submit Attempt'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Question navigation sidebar list */}
      <div className="space-y-6">
        <div className="p-6 rounded-3xl border border-white/10 bg-white/5 space-y-4">
          <h3 className="font-bold text-sm flex items-center gap-2 text-indigo-300">
            <List className="w-4 h-4" /> Question List Map
          </h3>

          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, idx) => {
              const hasAnswered = answers[q.id] !== undefined
              const markedReview = !!markedQuestions[q.id]
              const isCurrent = idx === currentIndex

              let btnClass = 'border-white/5 bg-slate-900/50 text-slate-400'
              if (isCurrent) {
                btnClass = 'bg-blue-600 border-blue-500 text-white font-bold'
              } else if (markedReview) {
                btnClass = 'bg-amber-500/20 border-amber-500/40 text-amber-400 font-bold'
              } else if (hasAnswered) {
                btnClass = 'bg-teal-500/20 border-teal-500/40 text-teal-400 font-bold'
              }

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-9 w-full rounded-lg border text-xs flex items-center justify-center transition ${btnClass}`}
                  title={`Go to Question ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              )
            })}
          </div>

          <div className="pt-2 border-t border-white/5 space-y-2 text-[10px] text-slate-400 font-bold">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded border border-blue-500 bg-blue-600/10" />
              <span>Current Question</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded border border-teal-500/40 bg-teal-500/20" />
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded border border-amber-500/40 bg-amber-500/20" />
              <span>Marked for Review</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
