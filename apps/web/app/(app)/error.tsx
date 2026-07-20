'use client'

import * as React from 'react'
import { AlertCircle, RotateCcw } from 'lucide-react'
import { Button } from '@companio/ui'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error('Layout route error intercepted:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-bold tracking-tight text-white">Something went wrong</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          An unexpected error occurred while loading this section of the portal. We apologize for
          the inconvenience.
        </p>
        {error.message && (
          <p className="text-xs font-mono text-slate-500 bg-slate-900 p-3 rounded-lg mt-2 overflow-x-auto text-left">
            {error.message}
          </p>
        )}
      </div>

      <Button
        onClick={() => reset()}
        className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold flex items-center gap-2 h-10 px-5 border border-slate-700"
      >
        <RotateCcw className="w-4 h-4" /> Try Again
      </Button>
    </div>
  )
}
