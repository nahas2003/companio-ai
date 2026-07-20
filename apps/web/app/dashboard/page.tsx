'use client'

import * as React from 'react'
import { useAuthStore } from '@/features/auth/store/authStore'
import { authService } from '@/features/auth/services/authService'
import { AuthGuard } from '@/features/auth/components/AuthGuard'
import { Button } from '@companio/ui'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, LogOut, User, Mail, Calendar } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuthStore()

  const handleSignOut = async () => {
    const result = await authService.signOut()
    if (result.success) {
      router.push('/login')
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />

        <header className="border-b border-white/10 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center font-bold text-lg text-white">
                C
              </div>
              <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Companio Portal
              </span>
            </div>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="text-red-400 border-red-500/20 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-2 h-9"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-12 flex-1 w-full relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
              <LayoutDashboard className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-slate-400 text-sm">Manage your study materials and activities</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-xl mb-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-violet-400" /> Identity Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <span className="text-slate-400 text-sm flex items-center gap-2">
                  <User className="w-4 h-4" /> Display Name
                </span>
                <span className="font-semibold">{user?.user_metadata?.displayName || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <span className="text-slate-400 text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email Address
                </span>
                <span className="font-semibold text-slate-300">{user?.email || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Account ID
                </span>
                <span className="font-mono text-xs text-slate-400">{user?.id || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-violet-500/20 bg-violet-500/5 text-slate-300 text-sm leading-relaxed">
            Welcome to your student companion dashboard! In subsequent tasks, you will be able to
            upload learning materials (PDFs/notes) to generate practice banks, customize
            assessments, and track detailed grading reports.
          </div>
        </main>

        <footer className="border-t border-white/5 py-6 text-center text-xs text-slate-500 relative z-10">
          <p>© 2026 Companio. Secured via Supabase Auth & Prisma ORM.</p>
        </footer>
      </div>
    </AuthGuard>
  )
}
