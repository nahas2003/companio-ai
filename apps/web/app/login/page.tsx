'use client'

import * as React from 'react'
import Link from 'next/link'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { GuestGuard } from '@/features/auth/components/GuestGuard'

export default function LoginPage() {
  return (
    <GuestGuard>
      <div className="relative min-h-screen bg-slate-950 flex items-center justify-center p-6 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/20 mx-auto mb-4 text-white">
              C
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Welcome Back</h1>
            <p className="text-slate-400 text-sm">Sign in to your learning portal</p>
          </div>

          <LoginForm />

          <p className="mt-8 text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="text-blue-400 font-semibold hover:underline hover:text-blue-300"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </GuestGuard>
  )
}
