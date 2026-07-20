'use client'

import * as React from 'react'
import { ProfileForm } from '@/features/profile/components/ProfileForm'
import { AuthGuard } from '@/features/auth/components/AuthGuard'

export default function ProfilePage() {
  return (
    <AuthGuard>
      <div className="relative min-h-screen bg-slate-950 flex items-center justify-center p-6 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-xl relative z-10">
          <ProfileForm />
        </div>
      </div>
    </AuthGuard>
  )
}
