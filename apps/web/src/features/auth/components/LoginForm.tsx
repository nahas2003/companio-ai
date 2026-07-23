'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { authService } from '../services/authService'
import { useAuthStore } from '../store/authStore'
import { Button } from '@companio/ui'
import { Mail, Lock, AlertCircle } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFields = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const { error, isLoading, setError } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (values: LoginFields) => {
    setError(null)
    const result = await authService.signIn(values)
    if (result.success) {
      router.push('/dashboard')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md">
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-text-secondary flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-text-secondary/70" /> Email Address
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            disabled={isLoading}
            {...register('email')}
            className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text-primary placeholder-text-secondary/40 outline-none focus:border-primary/50 transition duration-300 disabled:opacity-50"
          />
          {errors.email && (
            <p className="text-xs text-danger font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-text-secondary flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-text-secondary/70" /> Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            disabled={isLoading}
            {...register('password')}
            className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text-primary placeholder-text-secondary/40 outline-none focus:border-primary/50 transition duration-300 disabled:opacity-50"
          />
          {errors.password && (
            <p className="text-xs text-danger font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.password.message}
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 bg-primary hover:bg-primary-hover text-white transition duration-300 font-semibold"
      >
        {isLoading ? (
          <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        ) : (
          'Sign In'
        )}
      </Button>
    </form>
  )
}
