import * as React from 'react'

export default function Loading() {
  return (
    <div className="space-y-6 w-full animate-pulse">
      <div className="h-4 w-32 bg-slate-800 rounded-full" />

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
        <div className="h-8 w-48 bg-slate-800 rounded-full" />
        <div className="h-4 w-64 bg-slate-800 rounded-full" />

        <div className="space-y-4 pt-6">
          <div className="h-12 w-full bg-slate-800 rounded-xl" />
          <div className="h-12 w-full bg-slate-800 rounded-xl" />
          <div className="h-12 w-full bg-slate-800 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
