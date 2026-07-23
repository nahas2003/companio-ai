import * as React from 'react'

export default function Loading() {
  return (
    <div className="space-y-6 w-full animate-pulse text-left">
      <div className="h-4 w-32 bg-surface-secondary rounded-full" />

      <div className="bg-surface border border-border rounded-3xl p-8 space-y-6">
        <div className="h-8 w-48 bg-surface-secondary rounded-full" />
        <div className="h-4 w-64 bg-surface-secondary rounded-full" />

        <div className="space-y-4 pt-6">
          <div className="h-12 w-full bg-surface-secondary rounded-xl" />
          <div className="h-12 w-full bg-slate-200 dark:bg-zinc-800 w-5/6 rounded-xl" />
          <div className="h-12 w-full bg-surface-secondary rounded-xl" />
        </div>
      </div>
    </div>
  )
}
