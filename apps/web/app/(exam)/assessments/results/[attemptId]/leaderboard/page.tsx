'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { getAssessmentLeaderboardAction } from '../../../../../actions/grading'
import { RoomLeaderboard } from '@/components/RoomLeaderboard'
import { ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react'

export default function AssessmentLeaderboardPage({ params }: { params: { attemptId: string } }) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)
  const [leaderboardData, setLeaderboardData] = React.useState<any | null>(null)

  const loadLeaderboard = React.useCallback(async () => {
    try {
      setLoading(true)
      setErrorMsg(null)
      const res = await getAssessmentLeaderboardAction(params.attemptId)

      if (res.success) {
        setLeaderboardData(res)
      } else {
        setErrorMsg(res.error || 'Failed to retrieve leaderboard.')
      }
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'An error occurred.')
    } finally {
      setLoading(false)
    }
  }, [params.attemptId])

  React.useEffect(() => {
    loadLeaderboard()
  }, [loadLeaderboard])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[400px] gap-3 text-text-secondary w-full">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <span className="text-sm font-semibold tracking-wide animate-pulse">
          Fetching room standings...
        </span>
      </div>
    )
  }

  if (errorMsg || !leaderboardData) {
    return (
      <div className="max-w-md mx-auto p-6 bg-red-500/10 border border-red-500/20 rounded-large flex flex-col items-center gap-4 text-center mt-12 shadow-sm w-full">
        <AlertTriangle className="w-12 h-12 text-red-500" />
        <div className="text-sm font-semibold text-text-primary">
          {errorMsg || 'Leaderboard not found.'}
        </div>
        <button
          onClick={() => router.push(`/assessments/results/${params.attemptId}`)}
          className="px-4 py-2 bg-surface hover:bg-surface-secondary border border-border rounded-medium text-xs font-bold transition duration-200 text-text-primary"
        >
          Return to Results
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 w-full text-left">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push(`/assessments/results/${params.attemptId}`)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-text-primary transition duration-200"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Performance Report
        </button>
      </div>

      <RoomLeaderboard entries={leaderboardData.entries} title={leaderboardData.title} />
    </div>
  )
}
