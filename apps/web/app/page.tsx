'use client'

import * as React from 'react'
import { Button } from '@companio/ui'
import { Sparkles, Brain, Award, BarChart3, Database } from 'lucide-react'

export default function Home() {
  const [supabaseValid, setSupabaseValid] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder-project')) {
      setSupabaseValid(true)
    } else {
      setSupabaseValid(false)
    }
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900 text-white font-sans flex flex-col justify-between">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/20 blur-[120px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="border-b border-white/10 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/20">
              C
            </div>
            <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Companio
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-slate-300 hover:text-white">
              Sign In
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg hover:shadow-blue-500/20 hover:from-blue-500 hover:to-violet-500">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16 flex-1 flex flex-col items-center justify-center text-center relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Task 001: Foundation Operational
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mb-6">
          Transform Study Materials Into{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Interactive Learning
          </span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          The ultimate AI-native platform to generate quizzes, practice sessions, and assessments
          from notes or PDFs in seconds.
        </p>

        {/* Verification Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full mb-12">
          {/* Supabase connection validation card */}
          <div className="bg-slate-800/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm text-left flex items-start gap-4">
            <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Supabase Foundation</h3>
              <p className="text-sm text-slate-400 mb-3">
                Validates if the local project connects to Supabase authentication and database.
              </p>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${supabaseValid ? 'bg-teal-500' : 'bg-amber-500'}`}
                />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  {supabaseValid ? 'Initialized' : 'Placeholder / Local mode'}
                </span>
              </div>
            </div>
          </div>

          {/* Monorepo resolution validation card */}
          <div className="bg-slate-800/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm text-left flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Monorepo Resolution</h3>
              <p className="text-sm text-slate-400 mb-3">
                Verifies compilation and reference mapping from `@companio/ui` package.
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Workspace Connected
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Mockup */}
        <div className="w-full max-w-5xl bg-slate-800/20 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden text-left">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-violet-600/10 rounded-full blur-[80px]" />
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-violet-400" /> Platform Architecture Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-violet-500/30 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 flex items-center justify-center text-violet-400 mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-semibold mb-2">AI Ingestion Pipeline</h4>
              <p className="text-sm text-slate-400">
                Parses notes and PDFs using structured layouts and extracts semantic core.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                <Brain className="w-5 h-5" />
              </div>
              <h4 className="font-semibold mb-2">Question Generator</h4>
              <p className="text-sm text-slate-400">
                Orchestrates prompting across model gateways to deliver high-quality quizzes.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="font-semibold mb-2">Assessments & Analytics</h4>
              <p className="text-sm text-slate-400">
                Realtime leaderboards and student progress dashboards powered by Supabase.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 Companio Platform. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-slate-300">
              Terms of Service
            </a>
            <a href="#" className="hover:text-slate-300">
              Documentation
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
