'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../store/authStore'
import { hasPermission } from '../utils/rbac'
import type { Permission } from '../types/rbac.types'
import { Role } from '@companio/db'

interface RoleGuardProps {
  children: React.ReactNode
  requiredPermission?: Permission
  allowedRoles?: Role[]
}

export function RoleGuard({ children, requiredPermission, allowedRoles }: RoleGuardProps) {
  const router = useRouter()
  const { role, isLoading } = useAuthStore()

  const hasAccess = React.useMemo(() => {
    if (isLoading) return true

    if (allowedRoles && role) {
      if (allowedRoles.includes(role)) return true
    }

    if (requiredPermission && role) {
      if (hasPermission(role, requiredPermission)) return true
    }

    return false
  }, [role, isLoading, requiredPermission, allowedRoles])

  React.useEffect(() => {
    if (!isLoading && !hasAccess) {
      router.push('/unauthorized')
    }
  }, [isLoading, hasAccess, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-blue-500 animate-spin" />
          <p className="text-slate-400 text-sm font-medium tracking-wide animate-pulse">
            Checking authorization level...
          </p>
        </div>
      </div>
    )
  }

  if (!hasAccess) {
    return null
  }

  return <>{children}</>
}
