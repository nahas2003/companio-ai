'use client'

import * as React from 'react'
import { useAuthStore } from '../features/auth/store/authStore'

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const initAuth = useAuthStore((state) => state.initAuth)

  React.useEffect(() => {
    initAuth()
  }, [initAuth])

  return <>{children}</>
}
