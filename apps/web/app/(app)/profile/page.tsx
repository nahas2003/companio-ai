'use client'

import * as React from 'react'
import { ProfileForm } from '@/features/profile/components/ProfileForm'
import { AuthGuard } from '@/features/auth/components/AuthGuard'

export default function ProfilePage() {
  return (
    <AuthGuard>
      <div className="max-w-xl mx-auto py-6">
        <ProfileForm />
      </div>
    </AuthGuard>
  )
}
