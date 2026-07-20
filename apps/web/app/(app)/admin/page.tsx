'use client'

import * as React from 'react'
import { useAuthStore } from '@/features/auth/store/authStore'
import { RoleGuard } from '@/features/auth/components/RoleGuard'
import { updateUserRole } from '../../actions/profile'
import { Button } from '@companio/ui'
import { Shield, Users, ArrowLeft, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { Role } from '@companio/db'

export default function AdminPage() {
  const { session } = useAuthStore()
  const [targetId, setTargetId] = React.useState('')
  const [selectedRole, setSelectedRole] = React.useState<Role>('STUDENT')
  const [status, setStatus] = React.useState<{ type: 'success' | 'error'; text: string } | null>(
    null,
  )
  const [loading, setLoading] = React.useState(false)

  const handleRoleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session || !targetId) return

    try {
      setLoading(true)
      setStatus(null)
      const result = await updateUserRole(session.access_token, targetId, selectedRole)
      if (result.success) {
        setStatus({
          type: 'success',
          text: `Successfully updated user role to ${selectedRole}!`,
        })
      } else if (result.error) {
        setStatus({ type: 'error', text: result.error })
      }
    } catch (err: any) {
      console.error('Role update failed:', err)
      setStatus({ type: 'error', text: err.message || 'An unexpected error occurred.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <RoleGuard requiredPermission="admin:users">
      <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />

        <header className="border-b border-white/10 bg-slate-900/60 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-400" />
              <span className="font-semibold text-lg">Companio Admin Portal</span>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition duration-300"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-12 flex-1 w-full relative z-10 space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">System Access Management</h1>
              <p className="text-slate-400 text-sm">
                Assign database user roles and authorization settings
              </p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-xl space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Shield className="w-5 h-5 text-violet-400" /> Update User Role
            </h2>

            {status && (
              <div
                className={`flex items-center gap-3 p-4 rounded-xl border text-sm ${
                  status.type === 'success'
                    ? 'border-teal-500/30 bg-teal-500/10 text-teal-200'
                    : 'border-red-500/30 bg-red-500/10 text-red-200'
                }`}
              >
                {status.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                )}
                <span>{status.text}</span>
              </div>
            )}

            <form onSubmit={handleRoleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-300">
                    Target User ID (UUID)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 focus:border-blue-500/50 outline-none text-white text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-300">Assign Role</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as Role)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-800 text-white text-sm outline-none focus:border-blue-500/50"
                  >
                    <option value="STUDENT">Student</option>
                    <option value="INSTRUCTOR">Instructor</option>
                    <option value="ADMIN">Admin</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Update Role'}
              </Button>
            </form>
          </div>
        </main>

        <footer className="border-t border-white/5 py-6 text-center text-xs text-slate-500 relative z-10">
          <p>© 2026 Companio. Secured Admin Terminal.</p>
        </footer>
      </div>
    </RoleGuard>
  )
}
