'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { getAssessmentResultDetailsAction } from '../../../../actions/grading'
import { ResultReport } from '@/features/assessments/components/ResultReport'
import { RefreshCw, AlertTriangle } from 'lucide-react'

export default function AssessmentResultPage({ params }: { params: { attemptId: string } }) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)
  const [resultData, setResultData] = React.useState<any | null>(null)

  const loadResultDetails = React.useCallback(async () => {
    try {
      setLoading(true)
      setErrorMsg(null)
      const res = await getAssessmentResultDetailsAction(params.attemptId)

      if (res.success) {
        setResultData(res)
      } else {
        // Validation Checks: If attempt is active (IN_PROGRESS), redirect back to the take page!
        if (res.code === 'IN_PROGRESS' && res.attemptId) {
          router.replace(`/assessments/take/${res.attemptId}`)
          return
        }
        setErrorMsg(res.error || 'Failed to load assessment results.')
      }
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'An error occurred while loading results.')
    } finally {
      setLoading(false)
    }
  }, [params.attemptId, router])

  React.useEffect(() => {
    loadResultDetails()
  }, [loadResultDetails])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[400px] gap-3 text-text-secondary w-full">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <span className="text-sm font-semibold tracking-wide animate-pulse">
          Retrieving graded metrics...
        </span>
      </div>
    )
  }

  if (errorMsg || !resultData) {
    return (
      <div className="max-w-md mx-auto p-6 bg-red-500/10 border border-red-500/20 rounded-large flex flex-col items-center gap-4 text-center mt-12 shadow-sm w-full">
        <AlertTriangle className="w-12 h-12 text-red-500" />
        <div className="text-sm font-semibold text-text-primary">
          {errorMsg || 'Results record not found.'}
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

  return <ResultReport attemptId={params.attemptId} resultsData={resultData} />
}
