'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
  Building,
} from 'lucide-react'

function JoinAssessmentForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const codeParam = searchParams.get('code')
  const { session, user } = useAuthStore()

  // Joining states
  const [code, setCode] = React.useState('')
  const [guestName, setGuestName] = React.useState('')
  const [resolving, setResolving] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)

  // Details confirmation states
  const [details, setDetails] = React.useState<any | null>(null)
  const [joining, setJoining] = React.useState(false)

  // Auto-resolve code if provided in query string parameters
  React.useEffect(() => {
    if (codeParam && codeParam.trim()) {
      const sanitized = codeParam.toUpperCase().trim()
      setCode(sanitized)
      resolveCode(sanitized)
    }
  }, [codeParam])

  const resolveCode = async (codeStr: string) => {
    try {
      setResolving(true)
      setErrorMsg(null)
      setDetails(null)

      const res = await getPublishedAssessmentDetailsAction(codeStr)
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

  const handleResolveCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return
    await resolveCode(code.toUpperCase().trim())
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
    <div className="max-w-md mx-auto space-y-6 text-text-primary text-left pb-12 animate-fade-in pt-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-large bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-text-primary font-sans">
          Assessment Examination Hall
        </h1>
        <p className="text-text-secondary text-xs font-semibold">
          Enter an invitation code to start your proctored evaluation.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-danger/10 border border-danger/25 rounded-medium flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
          <div className="text-xs font-bold text-danger">{errorMsg}</div>
        </div>
      )}

      {!details ? (
        <form
          onSubmit={handleResolveCode}
          className="space-y-4 bg-surface border border-border rounded-large p-6 shadow-sm focus-within:border-primary/20 transition duration-200"
        >
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">
              Invitation Access Code
            </label>
            <input
              type="text"
              required
              maxLength={6}
              placeholder="e.g. AB89EF"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 rounded-medium border border-border bg-surface text-text-primary text-center text-lg font-mono font-bold outline-none focus:border-primary/50 uppercase tracking-widest placeholder:normal-case placeholder:font-sans placeholder:tracking-normal focus-visible:ring-2 focus-visible:ring-primary/20"
            />
          </div>

          <button
            type="submit"
            disabled={resolving}
            className="w-full py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 rounded-medium text-white font-bold text-xs flex items-center justify-center gap-1.5 transition duration-200 focus-visible:ring-2 focus-visible:ring-primary/20 outline-none"
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
        <div className="space-y-5 bg-surface border border-border rounded-large p-6 shadow-sm">
          {/* Resolved Details Card */}
          <div className="space-y-4 border-b border-border pb-5">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-success uppercase bg-success/10 border border-success/20 px-2 py-0.5 rounded-pill">
                Resolved
              </span>
              <h2 className="text-lg font-extrabold text-text-primary mt-2 leading-tight">
                {details.title}
              </h2>
              {details.organizationName && (
                <p className="text-[10px] text-text-secondary font-bold flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-text-secondary/60" /> {details.organizationName}
                </p>
              )}
              <p className="text-xs text-text-secondary mt-2">
                {details.description || 'No description provided.'}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-medium bg-surface-secondary border border-border/80 text-center">
                <Clock className="w-4 h-4 text-warning mx-auto" />
                <span className="text-[9px] text-text-secondary block mt-1 font-bold">Limit</span>
                <span className="text-xs font-bold text-text-primary mt-0.5 block">
                  {details.timer ? `${details.timer}m` : 'Untimed'}
                </span>
              </div>
              <div className="p-3 rounded-medium bg-surface-secondary border border-border/80 text-center">
                <BookOpen className="w-4 h-4 text-primary mx-auto" />
                <span className="text-[9px] text-text-secondary block mt-1 font-bold">
                  Questions
                </span>
                <span className="text-xs font-bold text-text-primary mt-0.5 block">
                  {details.questionCount}
                </span>
              </div>
              <div className="p-3 rounded-medium bg-surface-secondary border border-border/80 text-center">
                <Award className="w-4 h-4 text-success mx-auto" />
                <span className="text-[9px] text-text-secondary block mt-1 font-bold">Passing</span>
                <span className="text-xs font-bold text-text-primary mt-0.5 block">
                  {details.passingScore}%
                </span>
              </div>
            </div>
          </div>

          {/* Guest Name prompt if not authenticated */}
          {!user && (
            <div className="space-y-2 border-b border-border pb-5">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wide flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-text-secondary/80" /> Participant Display Name
                (Guest Mode)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sarah Connor"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-medium border border-border bg-surface text-text-primary text-xs outline-none focus:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20"
              />
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setDetails(null)}
              disabled={joining}
              className="flex-1 py-2 bg-surface-secondary border border-border rounded-medium text-text-secondary hover:text-text-primary font-bold text-xs transition duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            >
              Cancel
            </button>
            <button
              onClick={handleJoin}
              disabled={joining || (!user && !guestName.trim())}
              className="flex-1 py-2 bg-primary hover:bg-primary-hover disabled:opacity-50 rounded-medium text-white font-bold text-xs flex items-center justify-center gap-1.5 transition duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            >
              {joining ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-3 h-3 fill-current" />
              )}
              {joining ? 'Starting Exam...' : 'Begin Exam'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function JoinAssessmentPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex flex-col items-center justify-center p-12 min-h-[300px] gap-3 text-text-secondary w-full">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          <span className="text-sm font-semibold tracking-wide animate-pulse">
            Loading examination entry hall...
          </span>
        </div>
      }
    >
      <JoinAssessmentForm />
    </React.Suspense>
  )
}
