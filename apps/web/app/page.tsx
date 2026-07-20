'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/features/auth/store/authStore'
import { Button, FeatureCard, StatisticsCard, Navbar, Footer, ThemeToggle } from '@companio/ui'
import { Award, ArrowRight, ChevronDown, Menu, X, RefreshCw, FileText, Users } from 'lucide-react'
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
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3 text-text-secondary">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <span className="text-sm font-semibold tracking-wide">Redirecting to portal...</span>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-background text-text-primary font-sans overflow-x-hidden selection:bg-primary/20 selection:text-text-primary">
      {/* NAVIGATION BAR */}
      <Navbar glass className="h-16 flex items-center justify-between px-6">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-8 h-8 rounded-medium bg-primary flex items-center justify-center font-bold text-lg text-white">
              C
            </div>
            <span className="font-bold text-lg tracking-tight text-text-primary">Companio</span>
          </div>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-text-primary transition"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('workflow')}
              className="hover:text-text-primary transition"
            >
              How it works
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="hover:text-text-primary transition"
            >
              FAQ
            </button>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-text-secondary hover:text-text-primary font-semibold text-xs"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="text-xs font-semibold px-4 py-2 rounded-medium transition duration-200">
                Register Free
              </Button>
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 rounded-medium hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 border-b border-border bg-surface p-6 space-y-4 shadow-soft">
            <nav className="flex flex-col gap-4 text-sm font-medium text-text-secondary text-left">
              <button
                onClick={() => scrollToSection('features')}
                className="hover:text-text-primary transition text-left"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('workflow')}
                className="hover:text-text-primary transition text-left"
              >
                How it works
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="hover:text-text-primary transition text-left"
              >
                FAQ
              </button>
            </nav>
            <div className="border-t border-border pt-4 flex flex-col gap-2.5">
              <Link href="/login" className="w-full">
                <Button
                  variant="ghost"
                  className="w-full text-text-secondary hover:text-text-primary text-xs font-bold py-2.5"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register" className="w-full">
                <Button className="w-full text-xs font-bold py-2.5 rounded-medium">
                  Register Free
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Navbar>

      {/* HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-20 flex flex-col items-center justify-center text-center z-10">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl leading-[1.15] mb-6 text-text-primary">
          Create, Share, and Evaluate{' '}
          <span className="text-text-secondary">Assessments in Minutes</span>
        </h1>

        <p className="text-text-secondary text-base sm:text-lg max-w-2xl mb-12 leading-relaxed">
          The simplest and fastest platform to build custom assessments, share instant access codes
          with participants, and track graded results.
        </p>

        {/* PRIMARY ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-20 w-full sm:w-auto">
          <Link href="/generate" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto shadow-sm transition duration-200 h-12 px-8 text-sm font-bold rounded-medium flex items-center justify-center gap-2 group">
              Create Assessment{' '}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/assessments/join" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto h-12 px-8 rounded-medium text-sm font-bold shadow-sm"
            >
              Join Assessment
            </Button>
          </Link>
        </div>

        {/* Dashboard Preview mock statistics layout */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatisticsCard
            title="Completed Assessments"
            value="128"
            description="Active participant attempts"
            icon={<FileText className="w-4 h-4" />}
          />
          <StatisticsCard
            title="Average Accuracy"
            value="86.4%"
            description="Aggregate score indicators"
            icon={<Award className="w-4 h-4" />}
          />
          <StatisticsCard
            title="Average Time Taken"
            value="14m 20s"
            description="Time-limit proctored logs"
            icon={<Users className="w-4 h-4" />}
          />
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section
        id="features"
        className="max-w-7xl mx-auto px-6 py-20 border-t border-border relative z-10 text-left"
      >
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-text-primary">Platform Features</h2>
          <p className="text-text-secondary text-sm mt-3">
            Simple tools built for educators, interviewers, and students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            title="Automated Creation"
            description="Create questions using key topics, brief descriptions, or uploaded study notes securely."
            icon={<FileText className="w-5 h-5" />}
          />
          <FeatureCard
            title="Instant Join Codes"
            description="Distribute a unique 6-character access code for participants to join and test instantly on any device."
            icon={<Users className="w-5 h-5" />}
          />
          <FeatureCard
            title="Detailed Results"
            description="Review completed student scores, response distributions, time taken, and accuracy analytics."
            icon={<Award className="w-5 h-5" />}
          />
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section
        id="workflow"
        className="max-w-7xl mx-auto px-6 py-20 border-t border-border relative z-10 text-left"
      >
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-text-primary">How Companio Works</h2>
          <p className="text-text-secondary text-sm mt-3">
            Run fully structured testing rooms in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="text-3xl font-extrabold text-border">01</div>
            <h4 className="font-bold text-base text-text-primary">Setup Parameters</h4>
            <p className="text-text-secondary text-xs leading-relaxed">
              Enter a subject name, input details, or select document files to generate a custom
              question pool.
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-3xl font-extrabold text-border">02</div>
            <h4 className="font-bold text-base text-text-primary">Share Invite Codes</h4>
            <p className="text-text-secondary text-xs leading-relaxed">
              Publish your assessment template to generate a unique 6-digit invitation access key.
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-3xl font-extrabold text-border">03</div>
            <h4 className="font-bold text-base text-text-primary">Grade & Rank</h4>
            <p className="text-text-secondary text-xs leading-relaxed">
              Evaluate participant scores and timing metrics through clean, interactive grading
              leaderboards.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section
        id="faq"
        className="max-w-4xl mx-auto px-6 py-20 border-t border-border relative z-10 text-left"
      >
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-text-primary">Frequently Asked Questions</h2>
          <p className="text-text-secondary text-sm mt-3">
            Find fast answers to common questions about Companio features.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqData.map((faq, idx) => {
            const isOpen = activeFaq === idx
            return (
              <div
                key={idx}
                className="rounded-medium border border-border bg-surface-secondary overflow-hidden transition-all duration-300 cursor-pointer"
                onClick={() => setActiveFaq(isOpen ? null : idx)}
              >
                <div className="p-4.5 flex items-center justify-between font-bold text-sm text-text-primary select-none">
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </div>
                {isOpen && (
                  <div className="px-4.5 pb-4.5 text-text-secondary text-xs leading-relaxed border-t border-border/60 pt-3.5 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* FOOTER */}
      <Footer className="py-12 text-xs relative z-10 text-left">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center font-bold text-xs text-white">
              C
            </div>
            <span className="font-bold text-text-primary">Companio © 2026</span>
          </div>

          <div className="flex gap-6 text-text-secondary font-semibold">
            <Link href="/login" className="hover:text-text-primary transition">
              Sign In
            </Link>
            <Link href="/register" className="hover:text-text-primary transition">
              Sign Up
            </Link>
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-text-primary transition"
            >
              Features
            </button>
          </div>
        </div>
      </Footer>
    </div>
  )
}
