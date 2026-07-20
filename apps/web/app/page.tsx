'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/features/auth/store/authStore'
import { Button } from '@companio/ui'
import {
  Award,
  BookOpen,
  ArrowRight,
  Check,
  ChevronDown,
  Menu,
  X,
  Shield,
  HelpCircle,
  Clock,
  RefreshCw,
  FileText,
  Users,
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
      q: 'How do I create an assessment?',
      a: "Simply click 'Create Assessment' on the homepage, input a topic or description, or upload your study notes, and the platform will automatically build your assessment questions.",
    },
    {
      q: 'Can I share assessments with guest participants?',
      a: 'Yes! Every published assessment generates a unique 6-character access code. Anyone can join and take the assessment instantly using the code, with no registration required.',
    },
    {
      q: 'Is registration required to use the platform?',
      a: 'No. Anyone can create and take assessments as a guest. Registering for a free account unlocks advanced features, such as saved history, question library management, and personal progress analytics.',
    },
    {
      q: 'What types of documents can I use to generate assessments?',
      a: 'Companio supports standard text and document uploads, including PDF, DOCX (Microsoft Word), TXT, and Markdown files.',
    },
  ]

  // If already authenticated, show a loading spinner while redirecting
  if (session) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3 text-slate-500">
        <RefreshCw className="w-8 h-8 text-slate-400 animate-spin" />
        <span className="text-sm font-semibold tracking-wide">Redirecting to portal...</span>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-white text-slate-800 font-sans overflow-x-hidden selection:bg-slate-200 selection:text-slate-900">
      {/* NAVIGATION BAR */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center font-bold text-lg text-white">
              C
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">Companio</span>
          </div>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-slate-900 transition"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('workflow')}
              className="hover:text-slate-900 transition"
            >
              How it works
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="hover:text-slate-900 transition"
            >
              FAQ
            </button>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-slate-600 hover:text-slate-900 font-semibold text-xs"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition duration-200">
                Register Free
              </Button>
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white p-6 space-y-4 shadow-lg">
            <nav className="flex flex-col gap-4 text-sm font-medium text-slate-600 text-left">
              <button
                onClick={() => scrollToSection('features')}
                className="hover:text-slate-900 transition text-left"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('workflow')}
                className="hover:text-slate-900 transition text-left"
              >
                How it works
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="hover:text-slate-900 transition text-left"
              >
                FAQ
              </button>
            </nav>
            <div className="border-t border-slate-100 pt-4 flex flex-col gap-2.5">
              <Link href="/login" className="w-full">
                <Button
                  variant="ghost"
                  className="w-full text-slate-600 hover:text-slate-900 text-xs font-bold py-2.5"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register" className="w-full">
                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-lg">
                  Register Free
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-20 flex flex-col items-center justify-center text-center z-10">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl leading-[1.15] mb-6 text-slate-900">
          Create, Share, and Evaluate <span className="text-slate-600">Assessments in Minutes</span>
        </h1>

        <p className="text-slate-500 text-base sm:text-lg max-w-2xl mb-12 leading-relaxed">
          The simplest and fastest platform to build custom assessments, share instant access codes
          with participants, and track graded results.
        </p>

        {/* PRIMARY ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-20 w-full sm:w-auto">
          <Link href="/generate" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white shadow-md transition duration-200 h-12 px-8 text-sm font-bold rounded-xl flex items-center justify-center gap-2 group">
              Create Assessment{' '}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/assessments/join" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto h-12 px-8 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-sm font-bold transition shadow-sm">
              Join Assessment
            </button>
          </Link>
        </div>

        {/* Dashboard Preview mock card */}
        <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-md text-left">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-100" />
            <span className="text-[10px] text-slate-400 font-mono ml-2">Assessment Dashboard</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Completed Assessments
              </span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">128</div>
              <p className="text-[10px] text-slate-500 mt-2">Active participant attempts</p>
            </div>
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Average Accuracy
              </span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">86.4%</div>
              <p className="text-[10px] text-slate-500 mt-2">Aggregate score indicators</p>
            </div>
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Average Time Taken
              </span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">14m 20s</div>
              <p className="text-[10px] text-slate-500 mt-2">Time-limit proctored logs</p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section
        id="features"
        className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-100 relative z-10 text-left"
      >
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900">Platform Features</h2>
          <p className="text-slate-500 text-sm mt-3">
            Simple tools built for educators, interviewers, and students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition duration-200">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-6">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Automated Creation</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Create questions using key topics, brief descriptions, or uploaded study notes
              securely.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition duration-200">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-6">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Instant Join Codes</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Distribute a unique 6-character access code for participants to join and test
              instantly on any device.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition duration-200">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-6">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Detailed Results</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Review completed student scores, response distributions, time taken, and accuracy
              analytics.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section
        id="workflow"
        className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-100 relative z-10 text-left"
      >
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900">How Companio Works</h2>
          <p className="text-slate-500 text-sm mt-3">
            Run fully structured testing rooms in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="text-3xl font-extrabold text-slate-300">01</div>
            <h4 className="font-bold text-base text-slate-950">Setup Parameters</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              Enter a subject name, input details, or select document files to generate a custom
              question pool.
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-3xl font-extrabold text-slate-300">02</div>
            <h4 className="font-bold text-base text-slate-950">Share Invite Codes</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              Publish your assessment template to generate a unique 6-digit invitation access key.
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-3xl font-extrabold text-slate-300">03</div>
            <h4 className="font-bold text-base text-slate-950">Grade & Rank</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              Evaluate participant scores and timing metrics through clean, interactive grading
              leaderboards.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section
        id="faq"
        className="max-w-4xl mx-auto px-6 py-20 border-t border-slate-100 relative z-10 text-left"
      >
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
          <p className="text-slate-500 text-sm mt-3">
            Find fast answers to common questions about Companio features.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqData.map((faq, idx) => {
            const isOpen = activeFaq === idx
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden transition-all duration-300 cursor-pointer"
                onClick={() => setActiveFaq(isOpen ? null : idx)}
              >
                <div className="p-4.5 flex items-center justify-between font-bold text-sm text-slate-900 select-none">
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </div>
                {isOpen && (
                  <div className="px-4.5 pb-4.5 text-slate-500 text-xs leading-relaxed border-t border-slate-200/60 pt-3.5 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 py-12 text-xs text-slate-500 relative z-10 text-left bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center font-bold text-xs text-white">
              C
            </div>
            <span className="font-bold text-slate-700">Companio © 2026</span>
          </div>

          <div className="flex gap-6 text-slate-500 font-semibold">
            <Link href="/login" className="hover:text-slate-800 transition">
              Sign In
            </Link>
            <Link href="/register" className="hover:text-slate-800 transition">
              Sign Up
            </Link>
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-slate-800 transition"
            >
              Features
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
