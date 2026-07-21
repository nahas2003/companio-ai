'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/features/auth/store/authStore'
import { getPracticeDashboardAction, startPracticeSessionAction } from '../../actions/practice'
import {
  BookOpen,
  Play,
  RotateCcw,
  HelpCircle,
  FileText,
  History,
  TrendingUp,
  ChevronRight,
  Clock,
  RefreshCw,
  AlertCircle,
  X,
  Sliders,
  Check,
  Compass,
} from 'lucide-react'

export default function PracticeDashboardPage() {
  const router = useRouter()
  const { session } = useAuthStore()
  const [loading, setLoading] = React.useState(true)
  const [banks, setBanks] = React.useState<any[]>([])
  const [attempts, setAttempts] = React.useState<any[]>([])
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)

  // Setup modal states
  const [activeBankSetup, setActiveBankSetup] = React.useState<any | null>(null)
  const [difficultyFilter, setDifficultyFilter] = React.useState<string>('')
  const [typeFilter, setTypeFilter] = React.useState<string>('')
  const [launching, setLaunching] = React.useState(false)

  // Resume prompt states
  const [resumePrompt, setResumePrompt] = React.useState<{
    sessionId: string
    bankId: string
  } | null>(null)

  const loadDashboard = React.useCallback(async () => {
    if (!session) return
    try {
      setLoading(true)
      const res = await getPracticeDashboardAction(session.access_token)
      if (res.success) {
        setBanks(res.questionBanks || [])
        setAttempts(res.sessions || [])
      } else {
        setErrorMsg(res.error || 'Failed to load practice dashboard.')
      }
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'An error occurred while loading dashboard.')
    } finally {
      setLoading(false)
    }
  }, [session])

  React.useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const handleStartSession = async (forceNew: boolean = false) => {
    if (!session || !activeBankSetup) return

    try {
      setLaunching(true)
      const filters = {
        difficulty: difficultyFilter || undefined,
        type: typeFilter || undefined,
      }

      const res = await startPracticeSessionAction(
        session.access_token,
        activeBankSetup.id,
        filters,
        forceNew,
      )

      if (res.success && res.sessionId) {
        if (res.isResume && !forceNew) {
          // Open resume prompt choice
          setResumePrompt({ sessionId: res.sessionId, bankId: activeBankSetup.id })
        } else {
          router.push(`/practice/${res.sessionId}`)
        }
      } else {
        alert(res.error || 'Failed to initialize practice session.')
      }
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'An error occurred during initialization.')
    } finally {
      setLaunching(false)
    }
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '0s'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
  }

  const formatScoreColor = (score: number | null) => {
    if (score === null) return 'text-text-secondary bg-surface-secondary border-border'
    if (score >= 80) return 'text-success bg-success/10 border-success/20'
    if (score >= 60) return 'text-warning bg-warning/10 border-warning/20'
    return 'text-danger bg-danger/10 border-danger/20'
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[400px] gap-3 text-text-secondary text-left">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <span className="text-xs font-semibold tracking-wide animate-pulse">
          Loading study panel...
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-6 text-text-primary text-left animate-fade-in max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-border pb-5">
        <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2.5">
          <TrendingUp className="w-7 h-7 text-primary" /> Practice Zone Playroom
        </h1>
        <p className="text-text-secondary text-xs font-semibold mt-1">
          Review, test your knowledge, and study with custom generated question banks.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-danger/10 border border-danger/25 rounded-medium flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
          <div className="text-xs font-bold text-danger">{errorMsg}</div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Play panel and bank selector */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Start Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/sources"
              className="group p-5 rounded-large border border-border bg-surface hover:bg-surface-secondary hover:shadow-soft hover:border-primary/20 transition duration-300 flex flex-col justify-between h-36"
            >
              <div className="w-9 h-9 rounded-medium bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition duration-300">
                <FileText className="w-4.5 h-4.5" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-xs text-text-primary group-hover:text-primary transition">
                  Study Materials Ingestion
                </h3>
                <p className="text-[10px] text-text-secondary mt-1">
                  Upload files to parse and generate interactive practice exams.
                </p>
              </div>
            </Link>

            <Link
              href="/generate"
              className="group p-5 rounded-large border border-border bg-surface hover:bg-surface-secondary hover:shadow-soft hover:border-primary/20 transition duration-300 flex flex-col justify-between h-36"
            >
              <div className="w-9 h-9 rounded-medium bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-500 group-hover:scale-105 transition duration-300">
                <Compass className="w-4.5 h-4.5" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-xs text-text-primary group-hover:text-primary transition">
                  Practice Builder
                </h3>
                <p className="text-[10px] text-text-secondary mt-1">
                  Select formats and difficulty levels to build customized study lists.
                </p>
              </div>
            </Link>
          </div>

          {/* Question Banks */}
          <div className="space-y-4">
            <h2 className="text-base font-bold flex items-center gap-2 text-text-primary">
              <BookOpen className="w-4.5 h-4.5 text-primary" /> Active Question Repositories (
              {banks.length})
            </h2>

            {banks.length === 0 ? (
              <div className="p-8 border border-dashed border-border rounded-large text-center space-y-3 bg-surface shadow-sm">
                <p className="text-xs text-text-secondary font-medium">
                  No question banks generated yet.
                </p>
                <Link
                  href="/generate"
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary-hover font-bold transition"
                >
                  Create one now <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {banks.map((b) => (
                  <div
                    key={b.id}
                    className="p-5 rounded-large border border-border bg-surface hover:border-primary/20 hover:shadow-soft transition duration-300 flex flex-col justify-between space-y-4 text-left"
                  >
                    <div>
                      <h3 className="font-bold text-xs text-text-primary line-clamp-1">{b.name}</h3>
                      <p className="text-[10px] text-text-secondary mt-1 line-clamp-2 h-7">
                        {b.description || 'No description provided.'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-border">
                      <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-pill">
                        {b.questionCount} Questions
                      </span>
                      <button
                        onClick={() => setActiveBankSetup(b)}
                        className="flex items-center gap-1 text-xs font-bold text-success hover:text-success-hover transition duration-200"
                      >
                        Start <Play className="w-3 h-3 fill-current" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Attempts Log */}
        <div className="space-y-6">
          <div className="p-5 rounded-large border border-border bg-surface space-y-4 shadow-sm text-left">
            <h2 className="text-base font-bold flex items-center gap-2 text-text-primary">
              <History className="w-4.5 h-4.5 text-primary" /> Recent Attempts History
            </h2>

            {attempts.length === 0 ? (
              <div className="text-center p-6 text-text-secondary text-xs font-semibold">
                No recent attempts logs. Complete a quiz to see stats here.
              </div>
            ) : (
              <div className="space-y-3">
                {attempts.map((s) => (
                  <div
                    key={s.id}
                    className="p-3 rounded-medium bg-surface border border-border/80 hover:border-primary/20 transition duration-200 flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="font-bold text-xs text-text-primary truncate">
                        {s.bankName}
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-text-secondary">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-text-secondary/50" />{' '}
                          {formatDuration(s.timeTaken)}
                        </span>
                        <span>{new Date(s.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded border ${formatScoreColor(
                          s.score,
                        )}`}
                      >
                        {s.score !== null ? `${Math.round(s.score)}%` : 'In Progress'}
                      </span>
                      {s.status === 'COMPLETED' ? (
                        <Link
                          href={`/practice/${s.id}/results`}
                          className="p-1 rounded-medium bg-surface border border-border hover:bg-primary hover:text-white transition duration-200"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <Link
                          href={`/practice/${s.id}`}
                          className="p-1 rounded-medium bg-surface border border-border hover:bg-warning hover:text-white transition duration-200"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PRACTICE SETUP CONFIGURATION MODAL */}
      {activeBankSetup && !resumePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface border border-border rounded-large p-5 max-w-md w-full space-y-4 shadow-soft animate-scale-up text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2 text-text-primary">
                <Sliders className="w-5 h-5 text-primary" /> Study Room Setup
              </h3>
              <button
                onClick={() => setActiveBankSetup(null)}
                className="text-text-secondary hover:text-text-primary transition duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="text-[9px] text-text-secondary font-bold uppercase tracking-wider">
                Repository
              </div>
              <h4 className="font-bold text-xs text-text-primary leading-tight">
                {activeBankSetup.name}
              </h4>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">
                  Filter by Difficulty
                </label>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-medium border border-border bg-surface text-text-primary text-xs outline-none focus:border-primary/50"
                >
                  <option value="">All Difficulties</option>
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">
                  Filter by Question Type
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-medium border border-border bg-surface text-text-primary text-xs outline-none focus:border-primary/50"
                >
                  <option value="">All Question Types</option>
                  <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                  <option value="TRUE_FALSE">True / False</option>
                  <option value="SHORT_ANSWER">Short Answer</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveBankSetup(null)}
                disabled={launching}
                className="flex-1 py-2 bg-surface-secondary border border-border rounded-medium text-text-secondary hover:text-text-primary font-bold text-xs transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStartSession(false)}
                disabled={launching}
                className="flex-1 py-2 bg-primary hover:bg-primary-hover rounded-medium text-white font-bold text-xs flex items-center justify-center gap-1.5 transition duration-200"
              >
                {launching ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
                {launching ? 'Loading...' : 'Launch Practice'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESUME SESSION PROMPT ALERT */}
      {resumePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface border border-border rounded-large p-5 max-w-sm w-full space-y-4 shadow-soft animate-scale-up text-center">
            <div className="w-12 h-12 rounded-full bg-warning/10 border border-warning/20 text-warning flex items-center justify-center mx-auto">
              <RotateCcw className="w-5 h-5 animate-pulse" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-text-primary text-sm">Unfinished Practice Found</h3>
              <p className="text-xs text-text-secondary leading-relaxed font-semibold">
                You have a study session in progress. Would you like to resume it, or start fresh?
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => router.push(`/practice/${resumePrompt.sessionId}`)}
                className="w-full py-2 bg-warning hover:bg-warning-hover rounded-medium text-white font-bold text-xs flex items-center justify-center gap-1.5 transition duration-200"
              >
                <Check className="w-4 h-4" /> Resume Study Session
              </button>
              <button
                onClick={() => {
                  setResumePrompt(null)
                  handleStartSession(true)
                }}
                className="w-full py-2 bg-surface-secondary hover:bg-border border border-border rounded-medium text-text-secondary hover:text-text-primary font-bold text-xs transition duration-200"
              >
                Start Fresh Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
