'use client'

import * as React from 'react'

export default function ExamLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col justify-between">
      <main className="flex-1 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-7xl mx-auto w-full">{children}</div>
      </main>
    </div>
  )
}
