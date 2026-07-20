'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/features/auth/store/authStore'
import {
  getPublishedAssessmentDetailsAction,
  joinAssessmentAction,
} from '../../../actions/assessments'
import {
  GraduationCap,
  Play,
  RefreshCw,
  Clock,
  Award,
  BookOpen,
  ArrowRight,
  User,
  AlertTriangle,
} from 'lucide-react'

export default function JoinAssessmentPage() {
  const router = useRouter()
  const { session, user } = useAuthStore()

  // Joining states
  const [code, setCode] = React.useState('')
  const [guestName, setGuestName] = React.useState('')
  const [resolving, setResolving] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)

  // Details confirmation states
  const [details, setDetails] = React.useState<any | null>(null)
  const [joining, setJoining] = React.useState(false)

  const handleResolveCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return

    try {
      setResolving(true)
      setErrorMsg(null)
      setDetails(null)

      const res = await getPublishedAssessmentDetailsAction(code)
      if (res.success) {
        setDetails(res)
      } else {
        setErrorMsg(res.error || 'Failed to resolve code. Please verify and try again.')
      }
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'An error occurred while resolving code.')
    } finally {
      setResolving(false)
    }
  }

  const handleJoin = async () => {
    if (!code.trim() || joining) return

    try {
      setJoining(true)
      setErrorMsg(null)

      const res = await joinAssessmentAction(session?.access_token || null, {
        code,
        guestName: user ? undefined : guestName.trim() || 'Guest Participant',
      })

      if (res.success && res.attemptId) {
        router.push(`/assessments/take/${res.attemptId}`)
      } else {
        setErrorMsg(res.error || 'Failed to start assessment attempt.')
      }
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'An error occurred while joining.')
    } finally {
      setJoining(false)
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-8 text-white text-left pb-12 animate-fade-in pt-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-3xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mx-auto">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">Assessment Examination Hall</h1>
        <p className="text-slate-400 text-xs font-medium">
          Enter an invitation code to start your proctored evaluation.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-200">{errorMsg}</div>
        </div>
      )}

      {!details ? (
        <form
          onSubmit={handleResolveCode}
          className="space-y-4 bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
              Invitation Access Code
            </label>
            <input
              type="text"
              required
              maxLength={6}
              placeholder="e.g. AB89EF"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950 text-white text-center text-lg font-mono font-bold outline-none focus:border-violet-500/50 uppercase tracking-widest placeholder:normal-case placeholder:font-sans placeholder:tracking-normal"
            />
          </div>

          <button
            type="submit"
            disabled={resolving}
            className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/50 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition"
          >
            {resolving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
            {resolving ? 'Resolving Invitation...' : 'Verify Code'}
          </button>
        </form>
      ) : (
        <div className="space-y-6 bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl">
          {/* Resolved Details Card */}
          <div className="space-y-4 border-b border-white/5 pb-5">
            <div>
              <span className="text-[9px] font-bold text-teal-400 uppercase bg-teal-500/10 px-2 py-0.5 rounded-full">
                Resolved
              </span>
              <h2 className="text-lg font-bold text-slate-100 mt-2 leading-tight">
                {details.title}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {details.description || 'No description provided.'}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-white/5 text-center">
                <Clock className="w-4 h-4 text-amber-400 mx-auto" />
                <span className="text-[10px] text-slate-500 block mt-1 font-bold">Limit</span>
                <span className="text-xs font-bold text-slate-200 mt-0.5 block">
                  {details.timer ? `${details.timer}m` : 'Untimed'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-white/5 text-center">
                <BookOpen className="w-4 h-4 text-indigo-400 mx-auto" />
                <span className="text-[10px] text-slate-500 block mt-1 font-bold">Questions</span>
                <span className="text-xs font-bold text-slate-200 mt-0.5 block">
                  {details.questionCount}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-white/5 text-center">
                <Award className="w-4 h-4 text-teal-400 mx-auto" />
                <span className="text-[10px] text-slate-500 block mt-1 font-bold">Passing</span>
                <span className="text-xs font-bold text-slate-200 mt-0.5 block">
                  {details.passingScore}%
                </span>
              </div>
            </div>
          </div>

          {/* Guest Name prompt if not authenticated */}
          {!user && (
            <div className="space-y-1.5 border-b border-white/5 pb-5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> Participant Display Name (Guest Mode)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sarah Connor"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-950 text-white text-sm outline-none focus:border-violet-500/50"
              />
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setDetails(null)}
              disabled={joining}
              className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white font-semibold text-xs transition"
            >
              Cancel
            </button>
            <button
              onClick={handleJoin}
              disabled={joining || (!user && !guestName.trim())}
              className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/50 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              {joining ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" />
              )}
              {joining ? 'Starting Exam...' : 'Begin Exam'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
