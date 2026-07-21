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
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-text-secondary">
        <div className="w-8 h-8 rounded-full border-2 border-border border-t-primary animate-spin" />
        <p className="text-xs font-semibold animate-pulse">Fetching profile details...</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-text-primary transition duration-200 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Dashboard
        </Link>
        {isDirty && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-pill border border-warning/20 bg-warning/10 text-[10px] font-bold text-warning">
            <ShieldAlert className="w-3.5 h-3.5" /> Unsaved Edits
          </span>
        )}
      </div>

      <div className="bg-surface border border-border rounded-large p-6 shadow-sm relative overflow-hidden text-left">
        <div className="text-center md:text-left mb-6 border-b border-border pb-5">
          <h2 className="text-lg font-bold mb-1 flex items-center justify-center md:justify-start gap-2 text-text-primary">
            <User className="w-5.5 h-5.5 text-primary" /> Account Profile
          </h2>
          <p className="text-xs text-text-secondary font-semibold">
            Modify display details and metadata settings
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {message && (
            <div
              className={`flex items-center gap-3 p-4 rounded-medium border text-xs font-bold ${
                message.type === 'success'
                  ? 'border-success/30 bg-success/10 text-success'
                  : 'border-danger/30 bg-danger/10 text-danger'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4.5 h-4.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary flex items-center gap-1.5">
                <User className="w-4 h-4 text-text-secondary/60" /> Display Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                disabled={saving}
                {...register('displayName')}
                className="w-full px-3 py-2 rounded-medium border border-border bg-surface focus:border-primary/50 outline-none transition duration-200 text-text-primary text-xs placeholder-text-secondary/50 disabled:opacity-50"
              />
              {errors.displayName && (
                <p className="text-xs text-danger font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.displayName.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary">Registered Email</label>
              <input
                type="text"
                value={user?.email || ''}
                disabled
                className="w-full px-3 py-2 rounded-medium border border-border bg-surface-secondary text-text-secondary/60 cursor-not-allowed outline-none text-xs"
              />
              <p className="text-[10px] text-text-secondary/70 font-semibold">
                Email addresses are tied to authentication login credentials.
              </p>
            </div>
          </div>

          <Button
            type="submit"
            disabled={saving || !isDirty}
            className="w-full h-10 rounded-medium text-xs font-bold transition duration-200"
          >
            {saving ? (
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              'Save Changes'
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
