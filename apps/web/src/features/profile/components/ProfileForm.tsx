'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/features/auth/store/authStore'
import { getUserProfile, updateUserProfile } from '../../../../app/actions/profile'
import { getSupabaseClient } from '@/lib/supabase'
import { Button } from '@companio/ui'
import { User, AlertCircle, CheckCircle2, ChevronLeft, ShieldAlert } from 'lucide-react'
import Link from 'next/link'

const profileSchema = z.object({
  displayName: z
    .string()
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name cannot exceed 50 characters'),
})

type ProfileFields = z.infer<typeof profileSchema>

export function ProfileForm() {
  const { session, user, setUser } = useAuthStore()
  const [fetching, setFetching] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(
    null,
  )

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProfileFields>({
    resolver: zodResolver(profileSchema),
  })

  React.useEffect(() => {
    async function loadProfile() {
      if (!session) return
      try {
        setFetching(true)
        const result = await getUserProfile(session.access_token)
        if (result.success && result.profile) {
          setValue('displayName', result.profile.displayName || '')
        } else if (result.error) {
          setMessage({ type: 'error', text: result.error })
        }
      } catch (err: any) {
        console.error('Error loading profile:', err)
        setMessage({ type: 'error', text: 'Failed to load profile data.' })
      } finally {
        setFetching(false)
      }
    }
    loadProfile()
  }, [session, setValue])

  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
        return e.returnValue
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  const onSubmit = async (values: ProfileFields) => {
    if (!session) return
    try {
      setSaving(true)
      setMessage(null)

      const result = await updateUserProfile(session.access_token, values.displayName)

      if (result.success) {
        const supabase = getSupabaseClient()
        const {
          data: { user: updatedUser },
          error: authError,
        } = await supabase.auth.updateUser({
          data: { displayName: values.displayName.trim() },
        })

        if (authError) throw authError

        setUser(updatedUser)
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
      } else if (result.error) {
        setMessage({ type: 'error', text: result.error })
      }
    } catch (err: any) {
      console.error('Error saving profile:', err)
      setMessage({
        type: 'error',
        text: err.message || 'An unexpected error occurred while saving.',
      })
    } finally {
      setSaving(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
        <div className="w-8 h-8 rounded-full border-2 border-slate-700 border-t-blue-500 animate-spin" />
        <p className="text-sm font-medium animate-pulse">Fetching profile details...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition duration-300 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Dashboard
        </Link>
        {isDirty && (
          <span className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-semibold px-2.5 py-0.5 rounded-full border border-amber-500/20 bg-amber-500/10">
            <ShieldAlert className="w-3.5 h-3.5" /> Unsaved Edits
          </span>
        )}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden text-left">
        <div className="text-center md:text-left mb-8 border-b border-white/5 pb-6">
          <h2 className="text-2xl font-bold mb-1 flex items-center justify-center md:justify-start gap-2">
            <User className="w-6 h-6 text-violet-400" /> Account Profiles
          </h2>
          <p className="text-sm text-slate-400">Modify display details and metadata settings</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {message && (
            <div
              className={`flex items-center gap-3 p-4 rounded-xl border text-sm ${
                message.type === 'success'
                  ? 'border-teal-500/30 bg-teal-500/10 text-teal-200'
                  : 'border-red-500/30 bg-red-500/10 text-red-200'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-400" /> Display Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                disabled={saving}
                {...register('displayName')}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 focus:border-blue-500/50 outline-none transition duration-300 text-white placeholder-slate-500 disabled:opacity-50"
              />
              {errors.displayName && (
                <p className="text-xs text-red-400 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.displayName.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-300">Registered Email</label>
              <input
                type="text"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-white/5 bg-white/5 text-slate-500 cursor-not-allowed outline-none"
              />
              <p className="text-[11px] text-slate-500">
                Email addresses are tied to Supabase Auth authentication login credentials.
              </p>
            </div>
          </div>

          <Button
            type="submit"
            disabled={saving || !isDirty}
            className={`w-full h-11 transition duration-300 font-semibold ${
              isDirty
                ? 'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-lg hover:shadow-blue-500/25'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
            }`}
          >
            {saving ? (
              <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              'Save Changes'
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
