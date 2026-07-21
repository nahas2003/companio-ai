'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { RegisterForm } from '@/features/auth/components/RegisterForm'
import { GuestGuard } from '@/features/auth/components/GuestGuard'

export default function RegisterPage() {
  return (
    <GuestGuard>
      <div className="relative min-h-screen bg-slate-950 flex items-center justify-center p-6 overflow-hidden">
        {/* Back button */}
        <Link
          href="/"
          className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition duration-200"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/20 mx-auto mb-4 text-white">
              C
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
              Create Account
            </h1>
            <p className="text-slate-400 text-sm">Start your AI learning journey today</p>
          </div>

          <RegisterForm />

          <p className="mt-8 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-blue-400 font-semibold hover:underline hover:text-blue-300"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </GuestGuard>
  )
}
