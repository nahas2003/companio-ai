'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { RegisterForm } from '@/features/auth/components/RegisterForm'
import { GuestGuard } from '@/features/auth/components/GuestGuard'
import { ThemeToggle } from '@companio/ui'

export default function RegisterPage() {
  return (
    <GuestGuard>
      <div className="relative min-h-screen bg-background text-text-primary flex items-center justify-center p-6 overflow-hidden transition-colors duration-300">
        {/* Navigation actions */}
        <div className="absolute top-6 left-6 z-50">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-text-primary transition duration-200"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        <div className="absolute top-6 right-6 z-50">
          <ThemeToggle />
        </div>

        {/* Decorative background glows */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md bg-surface border border-border rounded-3xl p-8 shadow-soft relative z-10">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-primary-hover flex items-center justify-center font-bold text-xl shadow-md mx-auto mb-4 text-white">
              C
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary mb-2">
              Create Account
            </h1>
            <p className="text-text-secondary text-sm">Start your AI learning journey today</p>
          </div>

          <RegisterForm />

          <p className="mt-8 text-center text-sm text-text-secondary">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-primary font-semibold hover:underline hover:text-primary-hover"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </GuestGuard>
  )
}
