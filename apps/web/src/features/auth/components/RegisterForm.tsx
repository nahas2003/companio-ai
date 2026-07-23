'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { authService } from '../services/authService'
import { useAuthStore } from '../store/authStore'
import { Button } from '@companio/ui'
import { Mail, Lock, User, AlertCircle } from 'lucide-react'

const registerSchema = z
  .object({
    displayName: z.string().min(2, 'Display name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type RegisterFields = z.infer<typeof registerSchema>

export function RegisterForm() {
  const router = useRouter()
  const { error, isLoading, setError } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
  })

  const [needsVerification, setNeedsVerification] = React.useState(false)

  const onSubmit = async (values: RegisterFields) => {
    setError(null)
    const result = await authService.signUp({
      email: values.email,
      password: values.password,
      displayName: values.displayName,
    })
    if (result.success) {
      if (result.session) {
        router.push('/dashboard')
      } else {
        setNeedsVerification(true)
      }
    }
  }

  if (needsVerification) {
    return (
      <div className="flex flex-col items-center gap-6 text-center py-6 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/25 text-primary flex items-center justify-center">
          <Mail className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-text-primary">Verify Your Email</h2>
          <p className="text-sm text-text-secondary leading-relaxed max-w-xs mx-auto">
            We have sent a verification link to your inbox. Please click the link to confirm your
            account and sign in.
          </p>
        </div>
        <button
          onClick={() => router.push('/login')}
          className="px-6 py-2.5 bg-surface-secondary hover:bg-surface border border-border rounded-xl text-xs font-semibold text-text-primary transition mt-4"
        >
          Proceed to Login
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md">
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-danger/30 bg-danger/10 text-danger text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-text-secondary flex items-center gap-1.5">
            <User className="w-4 h-4 text-text-secondary/70" /> Full Name
          </label>
          <input
            type="text"
            placeholder="John Doe"
            disabled={isLoading}
            {...register('displayName')}
            className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text-primary placeholder-text-secondary/40 outline-none focus:border-primary/50 transition duration-300 disabled:opacity-50"
          />
          {errors.displayName && (
            <p className="text-xs text-danger font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.displayName.message}
            </p>
          )}
        </div>

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

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-text-secondary flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-text-secondary/70" /> Confirm Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            disabled={isLoading}
            {...register('confirmPassword')}
            className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text-primary placeholder-text-secondary/40 outline-none focus:border-primary/50 transition duration-300 disabled:opacity-50"
          />
          {errors.confirmPassword && (
            <p className="text-xs text-danger font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.confirmPassword.message}
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
          'Sign Up'
        )}
      </Button>
    </form>
  )
}
