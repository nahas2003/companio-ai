'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useProctoring } from '@/features/assessments/hooks/useProctoring'
import { AttemptStatus } from '@companio/db'
import {
  getAssessmentAttemptAction,
  submitAssessmentAttemptAction,
  saveAssessmentResponseAction,
} from '../../../../actions/assessments'
import {
  RefreshCw,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  Shield,
  HelpCircle,
  Menu,
  Bookmark,
  Check,
  Circle,
  List,
  Wifi,
  WifiOff,
  Eye,
  Lock,
} from 'lucide-react'

// Question status types
type QuestionStatus = 'ANSWERED' | 'REVIEW' | 'SKIPPED' | 'VISITED' | 'NOT_VISITED'

export default function AssessmentAttemptPage({ params }: { params: { attemptId: string } }) {
  const router = useRouter()
  const { session } = useAuthStore()

  // Data states
  const [loading, setLoading] = React.useState(true)
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)
  const [examState, setExamState] = React.useState<any | null>(null)

  // Navigation / Palette
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [questionStatuses, setQuestionStatuses] = React.useState<Record<string, QuestionStatus>>({})
  const [markedForReview, setMarkedForReview] = React.useState<Record<string, boolean>>({})

  // Responses state
  const [responses, setResponses] = React.useState<
    Record<string, { selectedOption?: number; modelResponse?: string }>
  >({})

  // Timer
  const [timeRemaining, setTimeRemaining] = React.useState(0)
  const [timeElapsed, setTimeElapsed] = React.useState(0)
  const timerRef = React.useRef<NodeJS.Timeout | null>(null)

  // Network & Save states
  const [saveStatus, setSaveStatus] = React.useState<'saved' | 'saving' | 'offline' | 'reconnecting'>('saved')
  const [isOnline, setIsOnline] = React.useState(true)

  // Submission Summary Modal
  const [showSubmitModal, setShowSubmitModal] = React.useState(false)
  const [confirmSubmit, setConfirmSubmit] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)

  // Monitor network connection
  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setSaveStatus('reconnecting')
      setTimeout(() => setSaveStatus('saved'), 1000)
    }
    const handleOffline = () => {
      setIsOnline(false)
      setSaveStatus('offline')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Auto-save logic implementation
  const triggerAutoSave = async (
    qId: string,
    opts?: { selectedOption?: number; modelResponse?: string; markedForReview?: boolean },
  ) => {
    if (!isOnline) {
      setSaveStatus('offline')
      return
    }

    try {
      setSaveStatus('saving')
      const res = await saveAssessmentResponseAction(session?.access_token || null, {
        attemptId: params.attemptId,
        questionId: qId,
        selectedOption: opts?.selectedOption,
        modelResponse: opts?.modelResponse,
        markedForReview: opts?.markedForReview,
        currentQuestionId: qId,
      })

      if (res.success) {
        setSaveStatus('saved')
      } else {
        console.error('Auto-save error:', res.error)
        setSaveStatus('reconnecting')
      }
    } catch (err) {
      console.error('Auto-save failed:', err)
      setSaveStatus('offline')
    }
  }

  // Load Attempt details
  const loadExamDetails = React.useCallback(async () => {
    try {
      setLoading(true)
      const res = await getAssessmentAttemptAction(params.attemptId)
      if (res.success && res.questions) {
        setExamState(res)

        // Redirect to results page if attempt status indicates completed
        if (res.status === AttemptStatus.SUBMITTED || res.status === AttemptStatus.EXPIRED) {
          router.replace(`/assessments/results/${params.attemptId}`)
          return
        }

        // Hydrate responses and marked states
        const savedAnswers: Record<string, { selectedOption?: number; modelResponse?: string }> = {}
        const savedReviewState: Record<string, boolean> = {}
        const savedStatuses: Record<string, QuestionStatus> = {}

        // Populate question palette status based on database state
        res.questions.forEach((q: any, idx: number) => {
          savedStatuses[q.id] = 'NOT_VISITED'
        })

        if (res.responses) {
          res.responses.forEach((r: any) => {
            savedAnswers[r.questionId] = {
              selectedOption: r.selectedOption !== null ? r.selectedOption : undefined,
              modelResponse: r.modelResponse !== null ? r.modelResponse : undefined,
            }
            savedReviewState[r.questionId] = r.markedForReview

            if (r.markedForReview) {
              savedStatuses[r.questionId] = 'REVIEW'
            } else if (r.selectedOption !== null || r.modelResponse !== null) {
              savedStatuses[r.questionId] = 'ANSWERED'
            } else {
              savedStatuses[r.questionId] = 'SKIPPED'
            }
          })
        }

        setResponses(savedAnswers)
        setMarkedForReview(savedReviewState)

        // Restore current question index if template creator was tracking it
        if (res.currentQuestionId) {
          const index = res.questions.findIndex((q: any) => q.id === res.currentQuestionId)
          if (index !== -1) {
            setCurrentIndex(index)
            savedStatuses[res.currentQuestionId] = savedReviewState[res.currentQuestionId]
              ? 'REVIEW'
              : savedAnswers[res.currentQuestionId]
                ? 'ANSWERED'
                : 'VISITED'
          }
        } else if (res.questions.length > 0) {
          const firstId = res.questions[0].id
          savedStatuses[firstId] = savedStatuses[firstId] === 'NOT_VISITED' ? 'VISITED' : savedStatuses[firstId]
        }

        setQuestionStatuses(savedStatuses)

        // Initialize Timer
        if (res.status === AttemptStatus.IN_PROGRESS && res.timer && res.expiresAt) {
          const limitSeconds = res.timer * 60
          const startedMs = new Date(res.startedAt).getTime()
          const elapsed = Math.floor((Date.now() - startedMs) / 1000)
          const remaining = Math.max(limitSeconds - elapsed, 0)

          if (remaining <= 0) {
            handleAutoSubmit()
            return
          }

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
  }, [params.attemptId, router])

  React.useEffect(() => {
    loadExamDetails()
  }, [loadExamDetails])

  // Proctoring warnings Hook
  const { blurCount, warningMessage, clearWarning, warningLevel } = useProctoring({
    enabled: !loading && !errorMsg && examState?.status === AttemptStatus.IN_PROGRESS,
    attemptId: params.attemptId,
  })

  // Timer countdown intervals
  React.useEffect(() => {
    if (
      loading ||
      errorMsg ||
      submitting ||
      !examState ||
      examState.status !== AttemptStatus.IN_PROGRESS ||
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

  // Warn on leave
  React.useEffect(() => {
    if (!loading && !errorMsg && examState?.status === AttemptStatus.IN_PROGRESS && !submitting) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault()
        e.returnValue = 'Warning: leaving the page will keep the timer running.'
        return e.returnValue
      }
      window.addEventListener('beforeunload', handleBeforeUnload)
      return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [loading, errorMsg, examState, submitting])

  // Throttled keyboard navigation listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        navigateIndex(currentIndex - 1)
      } else if (e.key === 'ArrowRight') {
        navigateIndex(currentIndex + 1)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, examState])

  const navigateIndex = (targetIdx: number) => {
    if (!examState || targetIdx < 0 || targetIdx >= examState.questions.length) return

    const currentQId = examState.questions[currentIndex].id
    const nextQId = examState.questions[targetIdx].id

    // Update state of current question
    setQuestionStatuses((prev) => {
      const next = { ...prev }
      const hasResponse = responses[currentQId]?.selectedOption !== undefined || responses[currentQId]?.modelResponse !== undefined
      if (markedForReview[currentQId]) {
        next[currentQId] = 'REVIEW'
      } else if (hasResponse) {
        next[currentQId] = 'ANSWERED'
      } else {
        next[currentQId] = 'SKIPPED'
      }

      // Mark the target question as visited
      if (next[nextQId] === 'NOT_VISITED') {
        next[nextQId] = 'VISITED'
      }
      return next
    })

    setCurrentIndex(targetIdx)
    // Send background auto-save status and currentQuestionId to database
    triggerAutoSave(currentQId, {
      selectedOption: responses[currentQId]?.selectedOption,
      modelResponse: responses[currentQId]?.modelResponse,
      markedForReview: markedForReview[currentQId],
    })
  }

  // Answer selection triggers auto-save
  const handleSelectOption = (questionId: string, idx: number) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: { selectedOption: idx },
    }))

    setQuestionStatuses((prev) => ({
      ...prev,
      [questionId]: markedForReview[questionId] ? 'REVIEW' : 'ANSWERED',
    }))

    triggerAutoSave(questionId, {
      selectedOption: idx,
      markedForReview: markedForReview[questionId],
    })
  }

  // Multiple Select Checkbox handling
  const handleSelectOptionMultiple = (questionId: string, idx: number) => {
    let currentSelected: number[] = []
    try {
      currentSelected = JSON.parse(responses[questionId]?.modelResponse || '[]')
    } catch {
      currentSelected = []
    }

    if (currentSelected.includes(idx)) {
      currentSelected = currentSelected.filter((i) => i !== idx)
    } else {
      currentSelected = [...currentSelected, idx]
    }

    const serialized = JSON.stringify(currentSelected.sort())
    setResponses((prev) => ({
      ...prev,
      [questionId]: { modelResponse: serialized },
    }))

    const hasSelection = currentSelected.length > 0
    setQuestionStatuses((prev) => ({
      ...prev,
      [questionId]: markedForReview[questionId] ? 'REVIEW' : hasSelection ? 'ANSWERED' : 'VISITED',
    }))

    triggerAutoSave(questionId, {
      modelResponse: serialized,
      markedForReview: markedForReview[questionId],
    })
  }

  // Short Answer Debounced save
  const handleTextResponse = (questionId: string, text: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: { modelResponse: text },
    }))

    setQuestionStatuses((prev) => ({
      ...prev,
      [questionId]: markedForReview[questionId] ? 'REVIEW' : text.trim() ? 'ANSWERED' : 'VISITED',
    }))

    // Directly trigger auto-save for immediate database durability
    triggerAutoSave(questionId, {
      modelResponse: text,
      markedForReview: markedForReview[questionId],
    })
  }

  // Mark for review toggle
  const toggleMarkedForReview = (questionId: string) => {
    const nextReview = !markedForReview[questionId]
    setMarkedForReview((prev) => ({
      ...prev,
      [questionId]: nextReview,
    }))

    setQuestionStatuses((prev) => ({
      ...prev,
      [questionId]: nextReview
        ? 'REVIEW'
        : responses[questionId]?.selectedOption !== undefined || responses[questionId]?.modelResponse !== undefined
          ? 'ANSWERED'
          : 'VISITED',
    }))

    triggerAutoSave(questionId, {
      selectedOption: responses[questionId]?.selectedOption,
      modelResponse: responses[questionId]?.modelResponse,
      markedForReview: nextReview,
    })
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

      if (res.success) {
        router.replace(`/assessments/results/${params.attemptId}`)
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
      <div className="flex flex-col items-center justify-center p-12 min-h-[400px] gap-3 text-text-secondary w-full">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <span className="text-sm font-semibold tracking-wide animate-pulse">
          Initializing exam portal...
        </span>
      </div>
    )
  }

  if (errorMsg || !examState) {
    return (
      <div className="max-w-md mx-auto p-6 bg-red-500/10 border border-red-500/20 rounded-large flex flex-col items-center gap-4 text-center mt-12 shadow-sm w-full">
        <AlertTriangle className="w-12 h-12 text-red-500" />
        <div className="text-sm font-semibold text-text-primary">
          {errorMsg || 'Exam record not found.'}
        </div>
        <button
          onClick={() => router.push('/assessments/join')}
          className="px-4 py-2 bg-surface hover:bg-surface-secondary border border-border rounded-medium text-xs font-bold transition duration-200 text-text-primary"
        >
          Return to Entry Hall
        </button>
      </div>
    )
  }

  const currentQuestion = examState.questions[currentIndex]
  const totalQuestions = examState.questions.length
  const currentResponse = responses[currentQuestion.id]

  // Counts statistics for palette
  const answeredCount = Object.values(questionStatuses).filter((s) => s === 'ANSWERED').length
  const markedCount = Object.values(questionStatuses).filter((s) => s === 'REVIEW').length
  const skippedCount = Object.values(questionStatuses).filter((s) => s === 'SKIPPED' || s === 'VISITED').length
  const notVisitedCount = Object.values(questionStatuses).filter((s) => s === 'NOT_VISITED').length

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between w-full select-none max-w-7xl mx-auto px-4 py-6 md:py-8 animate-fade-in">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between border-b border-border pb-4 w-full">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-text-secondary flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-primary" /> Active Proctored Exam
          </span>
          <h1 className="text-base md:text-lg font-bold text-text-primary line-clamp-1">
            {examState.title}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Connection status indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-medium bg-surface border border-border text-[10px] font-bold shadow-sm">
            {saveStatus === 'saved' ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-success" />
                <span className="text-success">Saved</span>
              </>
            ) : saveStatus === 'saving' ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-primary animate-spin" />
                <span className="text-primary">Saving...</span>
              </>
            ) : saveStatus === 'offline' ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-danger" />
                <span className="text-danger">Offline</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-warning animate-spin" />
                <span className="text-warning">Reconnecting</span>
              </>
            )}
          </div>

          {/* Time Limit count */}
          {examState.timer && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-medium bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-extrabold shadow-sm">
              <Clock className="w-4 h-4 animate-pulse" />
              <span>{formatTimer(timeRemaining)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Proctoring Warning Banner */}
      {warningMessage && (
        <div
          className={`p-4 rounded-medium border text-xs font-semibold flex items-center justify-between mt-4 shadow-sm animate-shake ${
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

      {/* MAIN CONTAINER PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start mt-6 w-full flex-1">
        {/* LEFT COLUMN: QUESTION CARD */}
        <div className="lg:col-span-3 space-y-5">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-text-secondary">
              <span>
                Question {currentIndex + 1} of {totalQuestions}
              </span>
              <span>{Math.round(((currentIndex + 1) / totalQuestions) * 100)}% Complete</span>
            </div>
            <div className="w-full h-1.5 bg-surface border border-border rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Core Question Card */}
          <div className="p-6 md:p-8 rounded-large bg-surface border border-border shadow-md min-h-[360px] flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              {/* Question title */}
              <div className="flex items-start gap-3 justify-between">
                <div className="flex items-start gap-3 text-left">
                  <span className="w-6 h-6 rounded-medium bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    {currentIndex + 1}
                  </span>
                  <h2 className="text-base md:text-lg font-bold text-text-primary leading-relaxed">
                    {currentQuestion.title}
                  </h2>
                </div>

                <button
                  onClick={() => toggleMarkedForReview(currentQuestion.id)}
                  aria-label="Mark this question for later review"
                  className={`p-2 rounded-medium border transition duration-200 outline-none ${
                    markedForReview[currentQuestion.id]
                      ? 'bg-purple-500/10 border-purple-500/30 text-purple-600'
                      : 'bg-surface border-border text-text-secondary hover:bg-surface-secondary'
                  }`}
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>
              </div>

              {/* Check question format type */}
              {currentQuestion.type === 'SHORT_ANSWER' ? (
                <div className="space-y-2 pl-9 text-left">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">
                    Write your response
                  </label>
                  <textarea
                    rows={6}
                    value={currentResponse?.modelResponse || ''}
                    onChange={(e) => handleTextResponse(currentQuestion.id, e.target.value)}
                    placeholder="Type your exam response here..."
                    className="w-full px-4 py-3 rounded-medium border border-border bg-surface-secondary text-text-primary text-sm outline-none focus:border-primary/50 resize-none transition duration-200 shadow-sm"
                  />
                </div>
              ) : currentQuestion.type === 'MULTIPLE_SELECT' ? (
                <div className="space-y-2.5 pl-9 text-left">
                  <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block mb-1">
                    Select all options that apply (Multiple Select)
                  </span>
                  {currentQuestion.options.map((opt: string, idx: number) => {
                    let isChecked = false
                    try {
                      isChecked = JSON.parse(currentResponse?.modelResponse || '[]').includes(idx)
                    } catch {}

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOptionMultiple(currentQuestion.id, idx)}
                        className={`w-full text-left p-4 rounded-medium border transition-all duration-200 flex items-center gap-3 shadow-sm ${
                          isChecked
                            ? 'bg-primary/10 border-primary/20 text-primary font-bold'
                            : 'bg-surface-secondary border-border text-text-secondary hover:bg-surface hover:text-text-primary'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-medium border text-[10px] font-extrabold flex items-center justify-center transition duration-200 ${
                            isChecked
                              ? 'bg-primary border-transparent text-white'
                              : 'border-border text-text-secondary bg-surface'
                          }`}
                        >
                          {isChecked ? <Check className="w-3 h-3" /> : String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-sm font-semibold">{opt}</span>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="space-y-2.5 pl-9 text-left">
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
                              : 'border-border text-text-secondary bg-surface'
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

            {/* Bottom Question Actions prev/next */}
            <div className="flex items-center justify-between pt-6 border-t border-border w-full">
              <button
                onClick={() => navigateIndex(currentIndex - 1)}
                disabled={currentIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-medium bg-surface-secondary border border-border hover:bg-surface disabled:opacity-30 disabled:pointer-events-none text-xs font-bold text-text-primary transition duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              {currentIndex < totalQuestions - 1 ? (
                <button
                  onClick={() => navigateIndex(currentIndex + 1)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-medium bg-surface-secondary border border-border hover:bg-surface text-xs font-bold text-text-primary transition duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-medium bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition duration-200 shadow-md shadow-teal-500/10 outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                >
                  <CheckCircle className="w-4 h-4" />
                  Review & Submit
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PALETTE PANEL */}
        <div className="bg-surface border border-border rounded-large p-5 shadow-sm space-y-6">
          <div className="space-y-1.5 text-left border-b border-border pb-3.5">
            <h3 className="font-extrabold text-sm text-text-primary flex items-center gap-2">
              <List className="w-4.5 h-4.5 text-primary" /> Question Palette
            </h3>
            <p className="text-text-secondary text-[10px] font-semibold leading-relaxed">
              Click any question number to jump directly to it.
            </p>
          </div>

          {/* Palette status indicators */}
          <div className="grid grid-cols-2 gap-2 text-[10px] font-extrabold text-text-secondary text-left">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-success block" />
              <span>Answered ({answeredCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-purple-500 block" />
              <span>Review ({markedCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-warning block" />
              <span>Skipped ({skippedCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded border border-border bg-surface block" />
              <span>Unvisited ({notVisitedCount})</span>
            </div>
          </div>

          {/* Grid list numbers */}
          <div className="grid grid-cols-5 gap-2.5 pt-3">
            {examState.questions.map((q: any, idx: number) => {
              const status = questionStatuses[q.id] || 'NOT_VISITED'
              const isActive = currentIndex === idx

              let bgClass = 'bg-surface border-border text-text-secondary hover:bg-surface-secondary'
              if (status === 'ANSWERED') bgClass = 'bg-success text-white border-transparent'
              if (status === 'REVIEW') bgClass = 'bg-purple-500 text-white border-transparent'
              if (status === 'SKIPPED' || status === 'VISITED') bgClass = 'bg-warning text-white border-transparent'

              return (
                <button
                  key={q.id}
                  onClick={() => navigateIndex(idx)}
                  className={`w-9 h-9 rounded-medium border text-xs font-bold flex items-center justify-center transition duration-200 outline-none ${bgClass} ${
                    isActive ? 'ring-2 ring-primary ring-offset-2' : ''
                  }`}
                >
                  {idx + 1}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* FINAL SUBMISSION PREVIEW MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border rounded-large p-6 max-w-md w-full text-center space-y-6 shadow-soft animate-scale-up">
            <div className="space-y-1.5 text-left border-b border-border pb-3.5">
              <h3 className="font-extrabold text-base text-text-primary flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-teal-500" /> Confirm Submission
              </h3>
              <p className="text-xs text-text-secondary font-medium">
                Please review your progress before completing the examination.
              </p>
            </div>

            {/* Metrics Overview Table */}
            <div className="divide-y divide-border text-xs text-left bg-surface-secondary/40 border border-border rounded-medium p-4 space-y-2">
              <div className="py-1.5 flex justify-between">
                <span className="text-text-secondary font-semibold">Answered Questions</span>
                <span className="font-bold text-success">{answeredCount} items</span>
              </div>
              <div className="py-1.5 flex justify-between">
                <span className="text-text-secondary font-semibold">Marked for Review</span>
                <span className="font-bold text-purple-600">{markedCount} items</span>
              </div>
              <div className="py-1.5 flex justify-between">
                <span className="text-text-secondary font-semibold">Skipped / Visited</span>
                <span className="font-bold text-warning">{skippedCount} items</span>
              </div>
              <div className="py-1.5 flex justify-between">
                <span className="text-text-secondary font-semibold">Unvisited Questions</span>
                <span className="font-bold text-text-secondary">{notVisitedCount} items</span>
              </div>
              {examState.timer && (
                <div className="py-1.5 flex justify-between border-t border-border mt-1">
                  <span className="text-text-secondary font-semibold">Remaining Duration</span>
                  <span className="font-bold text-red-500">{formatTimer(timeRemaining)}</span>
                </div>
              )}
            </div>

            {/* Confirmation checkbox input */}
            <label className="flex items-start gap-2.5 text-xs text-text-primary font-semibold text-left select-none cursor-pointer">
              <input
                type="checkbox"
                checked={confirmSubmit}
                onChange={(e) => setConfirmSubmit(e.target.checked)}
                className="mt-0.5 rounded bg-surface border-border text-primary focus:ring-0"
              />
              <span>
                I confirm that I want to submit my answers and complete this examination session. This action cannot be undone.
              </span>
            </label>

            {/* Modal actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setShowSubmitModal(false)
                  setConfirmSubmit(false)
                }}
                disabled={submitting}
                className="flex-1 py-2 bg-surface-secondary border border-border rounded-medium text-text-secondary hover:text-text-primary font-bold text-xs transition duration-200 outline-none"
              >
                Back to Exam
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !confirmSubmit}
                className="flex-1 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 rounded-medium text-white font-bold text-xs flex items-center justify-center gap-1.5 transition duration-200 outline-none"
              >
                {submitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-3.5 h-3.5" />
                )}
                {submitting ? 'Submitting...' : 'Submit Answers'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
