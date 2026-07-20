'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/features/auth/store/authStore'
import { Button } from '@companio/ui'
import {
  Sparkles,
  Brain,
  Award,
  BarChart3,
  Database,
  Upload,
  ArrowRight,
  Check,
  ChevronDown,
  Menu,
  X,
  Shield,
  HelpCircle,
  Clock,
  RefreshCw,
} from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()
  const { session } = useAuthStore()

  // Redirect authenticated users
  React.useEffect(() => {
    if (session) {
      router.push('/dashboard')
    }
  }, [session, router])

  // UI States
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [activeFaq, setActiveFaq] = React.useState<number | null>(null)

  // Scroll to section helper
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const faqData = [
    {
      q: 'How does Companio AI generate study questions?',
      a: 'Companio processes your notes or PDFs (up to 10MB) through our semantic parsing engine, extracts core concepts, and generates formatted Multiple Choice, True/False, or Short Answer cards using advanced Google Gemini models.',
    },
    {
      q: 'Can I share my assessment decks with other learners?',
      a: 'Yes! Instructors can create custom assessments, publish them to obtain a unique 6-digit alphanumerical invite key, and share it with students or guest participants to join and test in real-time.',
    },
    {
      q: 'Is my study material kept secure?',
      a: 'Absolutely. All uploaded documents are hosted in a secure, isolated Supabase private storage bucket. They are only readable by your authenticated profile.',
    },
    {
      q: 'What types of file formats are supported?',
      a: 'Companio supports standard document formats, including PDF, DOCX (Microsoft Word), TXT, and Markdown files.',
    },
  ]

  // If already authenticated, show a loading spinner while redirecting
  if (session) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3 text-slate-400">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="text-sm font-semibold tracking-wide animate-pulse">
          Redirecting to portal...
        </span>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden selection:bg-blue-500/30 selection:text-blue-200">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[60%] rounded-full bg-violet-600/10 blur-[130px] pointer-events-none" />

      {/* NAVIGATION BAR */}
      <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/20 text-white">
              C
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Companio <span className="text-xs font-semibold text-blue-400">AI</span>
            </span>
          </div>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-white transition"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('workflow')}
              className="hover:text-white transition"
            >
              How it works
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="hover:text-white transition"
            >
              Pricing
            </button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-white transition">
              FAQ
            </button>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-slate-300 hover:text-white font-semibold text-xs"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs font-semibold shadow-lg hover:shadow-blue-500/25 hover:from-blue-500 hover:to-violet-500 transition duration-300 px-5 rounded-xl">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-slate-950 p-6 space-y-4 animate-fade-in">
            <nav className="flex flex-col gap-4 text-sm font-semibold text-slate-300 text-left">
              <button
                onClick={() => scrollToSection('features')}
                className="hover:text-white transition text-left"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('workflow')}
                className="hover:text-white transition text-left"
              >
                How it works
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="hover:text-white transition text-left"
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="hover:text-white transition text-left"
              >
                FAQ
              </button>
            </nav>
            <div className="border-t border-white/5 pt-4 flex flex-col gap-2.5">
              <Link href="/login" className="w-full">
                <Button
                  variant="ghost"
                  className="w-full text-slate-300 hover:text-white text-xs font-bold py-2.5"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register" className="w-full">
                <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 rounded-xl">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-24 flex flex-col items-center justify-center text-center z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/25 bg-blue-500/10 text-blue-300 text-[10px] font-bold uppercase tracking-wider mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" /> Next-Gen AI Learning Platform
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.1] mb-6">
          Transform Study Notes Into{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Interactive Mastery
          </span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          Upload PDFs or notes, instantly generate study decks, play timed session review cards, and
          publish proctored exams with comprehensive diagnostics.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <Link href="/register">
            <Button className="bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-xl hover:shadow-blue-500/20 hover:from-blue-500 hover:to-violet-500 transition duration-300 h-12 px-8 text-sm font-bold rounded-2xl flex items-center gap-2 group">
              Start Free Trial{' '}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <button
            onClick={() => scrollToSection('features')}
            className="h-12 px-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white text-sm font-semibold transition"
          >
            Explore Features
          </button>
        </div>

        {/* Dashboard Preview mock card */}
        <div className="w-full max-w-5xl bg-slate-900/40 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden text-left animate-fade-in">
          <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-violet-600/10 rounded-full blur-[90px] pointer-events-none" />
          <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div className="w-3 h-3 rounded-full bg-teal-500" />
            <span className="text-[10px] text-slate-500 font-mono ml-2">
              localhost:3000/dashboard
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-950 border border-white/5">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                Average Accuracy
              </span>
              <div className="text-3xl font-extrabold text-blue-400 mt-1">94.8%</div>
              <p className="text-[10px] text-slate-400 mt-2">Calculated from 12 active decks</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-950 border border-white/5">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                Practice Sessions
              </span>
              <div className="text-3xl font-extrabold text-teal-400 mt-1">48 Completed</div>
              <p className="text-[10px] text-slate-400 mt-2">Active timed studies log</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-950 border border-white/5">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                AI Generation
              </span>
              <div className="text-3xl font-extrabold text-violet-400 mt-1">120 Questions</div>
              <p className="text-[10px] text-slate-400 mt-2">Custom Gemini generated</p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section
        id="features"
        className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5 relative z-10 text-left"
      >
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Everything You Need to Learn Smarter
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            Companio packages AI generation, active playrooms, and proctored metrics in one layout.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Private Study Ingestion</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Upload PDF or TXT notes to private storage folders. Extract structured semantic text
              content securely.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-violet-500/30 transition duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">AI-Driven Generator</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Generate custom Multiple Choice, True/False, or Short Answer decks tailored to your
              notes and selected difficulty.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-teal-500/30 transition duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Proctored assessments</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Publish timed exams with unique invitation codes. Monitor guest attempts grades with
              elapsed time protection.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS / WORKFLOW SECTION */}
      <section
        id="workflow"
        className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5 relative z-10 text-left"
      >
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold">How Companio Works</h2>
          <p className="text-slate-400 text-sm mt-3">
            From raw notes to interactive assessment in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="text-5xl font-black text-blue-500/15">01</div>
            <h4 className="font-bold text-base text-slate-100">Upload Decks</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Drop your notes, PDFs, or lecture slides into the catalog uploads zone to run
              structured extraction.
            </p>
          </div>

          <div className="space-y-4">
            <div className="text-5xl font-black text-violet-500/15">02</div>
            <h4 className="font-bold text-base text-slate-100">Generate & Study</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Configure parameters to generate questions. Play cards in our timed playground drawer
              with immediate scored results.
            </p>
          </div>

          <div className="space-y-4">
            <div className="text-5xl font-black text-teal-500/15">03</div>
            <h4 className="font-bold text-base text-slate-100">Analyze Progress</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Review stats dashboards tracking averages, time spent, skipped cards, and detailed
              grading reports.
            </p>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section
        id="pricing"
        className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5 relative z-10 text-center"
      >
        <div className="max-w-xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold">Simple, Value-Driven Pricing</h2>
          <p className="text-slate-400 text-sm mt-3">
            All premium core AI features are unlocked during our public launch trial.
          </p>
        </div>

        <div className="max-w-md mx-auto rounded-3xl bg-white/5 border border-white/10 p-8 text-left relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 bg-blue-600 text-white font-bold text-[9px] uppercase tracking-wider px-3.5 py-1 rounded-bl-xl">
            Public Launch
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-bold text-slate-200">Standard Tier</h4>
            <p className="text-xs text-slate-400 mt-1">
              Perfect for students and instructors looking to leverage AI.
            </p>
          </div>

          <div className="flex items-baseline gap-1.5 mb-6">
            <span className="text-4xl font-extrabold text-white">$0</span>
            <span className="text-xs text-slate-500 font-bold">/ Free Sandbox Trial</span>
          </div>

          <ul className="space-y-3.5 mb-8 text-xs text-slate-300">
            <li className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-teal-400 flex-shrink-0" />
              <span>Unlimited PDF upload catalogs</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-teal-400 flex-shrink-0" />
              <span>Gemini AI powered question generations</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-teal-400 flex-shrink-0" />
              <span>Proctored classroom exams portal</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-teal-400 flex-shrink-0" />
              <span>In-app notifications drawer alerts</span>
            </li>
          </ul>

          <Link href="/register" className="block w-full">
            <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-11 rounded-xl">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section
        id="faq"
        className="max-w-4xl mx-auto px-6 py-20 border-t border-white/5 relative z-10 text-left"
      >
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold">Frequently Asked Questions</h2>
          <p className="text-slate-400 text-sm mt-3">
            Find fast answers to common questions about Companio AI features.
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, idx) => {
            const isOpen = activeFaq === idx
            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/15 bg-white/5 overflow-hidden transition-all duration-300 cursor-pointer"
                onClick={() => setActiveFaq(isOpen ? null : idx)}
              >
                <div className="p-5 flex items-center justify-between font-bold text-sm text-slate-100 select-none">
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4.5 h-4.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </div>
                {isOpen && (
                  <div className="px-5 pb-5 text-slate-400 text-xs leading-relaxed border-t border-white/5 pt-3.5 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-12 text-xs text-slate-500 relative z-10 text-left bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center font-bold text-sm text-white">
              C
            </div>
            <span className="font-bold text-slate-300">Companio Platform © 2026</span>
          </div>

          <div className="flex gap-6 text-slate-400 font-semibold">
            <Link href="/login" className="hover:text-white transition">
              Sign In
            </Link>
            <Link href="/register" className="hover:text-white transition">
              Sign Up
            </Link>
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-white transition"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="hover:text-white transition"
            >
              Pricing
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
