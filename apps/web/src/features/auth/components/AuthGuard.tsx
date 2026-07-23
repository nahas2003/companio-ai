'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../store/authStore'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, isLoading } = useAuthStore()

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-text-primary flex flex-col items-center justify-center transition-colors duration-200">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-border border-t-primary animate-spin" />
          <p className="text-text-secondary text-sm font-medium tracking-wide animate-pulse">
            Verifying secure session...
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
