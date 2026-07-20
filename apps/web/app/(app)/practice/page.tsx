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
  Sparkles,
  HelpCircle,
  FileText,
  History,
  TrendingUp,
  Award,
  ChevronRight,
  Clock,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  X,
  Sliders,
  Check,
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
    if (score === null) return 'text-slate-400 bg-slate-400/10 border-slate-400/20'
    if (score >= 80) return 'text-teal-400 bg-teal-400/10 border-teal-400/20'
    if (score >= 60) return 'text-amber-400 bg-amber-400/10 border-amber-400/20'
    return 'text-red-400 bg-red-400/10 border-red-400/20'
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[400px] gap-3 text-slate-400 text-left">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="text-sm font-semibold tracking-wide animate-pulse">
          Loading study panel...
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-8 text-white text-left animate-fade-in max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
          <TrendingUp className="w-8 h-8 text-teal-400" /> Practice Zone Playroom
        </h1>
        <p className="text-slate-400 text-sm font-medium mt-1">
          Review, test your knowledge, and study with AI-generated question banks.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-200">{errorMsg}</div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Play panel and bank selector */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Start Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/sources"
              className="group p-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition duration-300 flex flex-col justify-between h-40"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition duration-300">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-200 group-hover:text-white transition">
                  PDF Study Ingestion
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Upload files to parse and generate interactive flashcards.
                </p>
              </div>
            </Link>

            <Link
              href="/generate"
              className="group p-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition duration-300 flex flex-col justify-between h-40"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:scale-110 transition duration-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-200 group-hover:text-white transition">
                  AI Topic Practice
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Select formats and difficulty levels to build customized study lists.
                </p>
              </div>
            </Link>
          </div>

          {/* Question Banks */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" /> Active Question Repositories (
              {banks.length})
            </h2>

            {banks.length === 0 ? (
              <div className="p-8 border border-dashed border-white/10 rounded-2xl text-center space-y-3 bg-white/5">
                <p className="text-sm text-slate-400">No question banks generated yet.</p>
                <Link
                  href="/generate"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-white font-bold transition"
                >
                  Create one now <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {banks.map((b) => (
                  <div
                    key={b.id}
                    className="p-5 rounded-2xl border border-white/10 bg-white/5 hover:border-white/20 transition duration-200 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <h3 className="font-bold text-slate-200 line-clamp-1">{b.name}</h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 h-8">
                        {b.description || 'No description provided.'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                        {b.questionCount} Questions
                      </span>
                      <button
                        onClick={() => setActiveBankSetup(b)}
                        className="flex items-center gap-1 text-xs font-bold text-teal-400 hover:text-teal-300 transition"
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
          <div className="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-5">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <History className="w-5 h-5 text-teal-400" /> Recent Attempts History
            </h2>

            {attempts.length === 0 ? (
              <div className="text-center p-6 text-slate-400 text-xs">
                No recent attempts logs. Complete a quiz to see stats here.
              </div>
            ) : (
              <div className="space-y-3">
                {attempts.map((s) => (
                  <div
                    key={s.id}
                    className="p-3.5 rounded-xl bg-slate-900 border border-white/5 hover:border-white/10 transition duration-150 flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="font-bold text-xs text-slate-200 truncate">{s.bankName}</div>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {formatDuration(s.timeTaken)}
                        </span>
                        <span>{new Date(s.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded border ${formatScoreColor(
                          s.score,
                        )}`}
                      >
                        {s.score !== null ? `${Math.round(s.score)}%` : 'In Progress'}
                      </span>
                      {s.status === 'COMPLETED' ? (
                        <Link
                          href={`/practice/${s.id}/results`}
                          className="p-1 rounded-lg bg-white/5 hover:bg-blue-600 text-slate-400 hover:text-white transition"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      ) : (
                        <Link
                          href={`/practice/${s.id}`}
                          className="p-1 rounded-lg bg-white/5 hover:bg-amber-600 text-slate-400 hover:text-white transition"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150 text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                <Sliders className="w-5 h-5 text-teal-400" /> Study Room Setup
              </h3>
              <button
                onClick={() => setActiveBankSetup(null)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Repository
              </div>
              <h4 className="font-bold text-slate-200 leading-tight">{activeBankSetup.name}</h4>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                  Filter by Difficulty
                </label>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-950 text-white text-sm outline-none focus:border-teal-500/50"
                >
                  <option value="">All Difficulties</option>
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                  Filter by Question Type
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-950 text-white text-sm outline-none focus:border-teal-500/50"
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
                className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white font-semibold text-xs transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStartSession(false)}
                disabled={launching}
                className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-500 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                {launching ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 fill-current" />
                )}
                {launching ? 'Loading...' : 'Launch Practice'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESUME SESSION PROMPT ALERT */}
      {resumePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6 animate-pulse" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-white text-base">Unfinished Practice Found</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                You have a study session in progress. Would you like to resume it, or start fresh?
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => router.push(`/practice/${resumePrompt.sessionId}`)}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Check className="w-4 h-4" /> Resume Study Session
              </button>
              <button
                onClick={() => {
                  setResumePrompt(null)
                  handleStartSession(true)
                }}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-400 hover:text-white font-semibold text-xs transition"
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
