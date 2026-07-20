'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/features/auth/store/authStore'
import { Button, FeatureCard, StatisticsCard, Navbar, Footer, ThemeToggle } from '@companio/ui'
import {
  Award,
  ArrowRight,
  ChevronDown,
  Menu,
  X,
  RefreshCw,
  FileText,
  Users,
  Trophy,
  Check,
  Clock,
  Share2,
  TrendingUp,
  ShieldAlert,
  HelpCircle,
  Play,
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
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3 text-text-secondary">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <span className="text-sm font-semibold tracking-wide">Redirecting to portal...</span>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-background text-text-primary font-sans overflow-x-hidden selection:bg-primary/20 selection:text-text-primary transition-colors duration-300">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 right-0 w-[45vw] h-[45vw] max-w-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[60vh] left-0 w-[35vw] h-[35vw] max-w-[450px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none z-0" />

      {/* NAVIGATION BAR */}
      <Navbar glass className="h-16 flex items-center justify-between px-6 z-50">
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
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 border-b border-border bg-surface p-6 space-y-4 shadow-soft animate-fade-in">
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
      <section className="relative max-w-7xl mx-auto px-6 pt-20 lg:pt-32 pb-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-8 z-10">
        {/* Left Column: Headings & Description */}
        <div className="w-full lg:w-1/2 text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Next-Gen Testing Infrastructure
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-text-primary">
            Create, Share, and Evaluate{' '}
            <span className="text-text-secondary">Assessments in Minutes</span>
          </h1>

          <p className="text-text-secondary text-base sm:text-lg max-w-xl leading-relaxed">
            The simplest and fastest platform to build custom assessments, share instant access
            codes with participants, and track graded results in real time. No complex installations
            or mandatory logins required.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
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
        </div>

        {/* Right Column: Floating Product Preview Cards */}
        <div className="w-full lg:w-1/2 relative min-h-[380px] sm:min-h-[440px] flex items-center justify-center select-none">
          {/* Card 1: Question Attempt Mock */}
          <div className="absolute top-4 left-4 sm:left-12 w-full max-w-[320px] bg-surface border border-border p-5 rounded-large shadow-soft hover:-translate-y-1 hover:scale-[1.02] transition duration-300 z-20">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <span className="text-[10px] text-primary font-bold uppercase tracking-wider">
                Question 4 of 10
              </span>
              <div className="flex items-center gap-1.5 text-text-secondary text-xs">
                <Clock className="w-3.5 h-3.5" />
                <span>12m 44s</span>
              </div>
            </div>
            <p className="text-sm font-bold text-text-primary leading-relaxed mb-4">
              Which data structure uses LIFO (Last In First Out) behavior for operations?
            </p>
            <div className="space-y-2">
              <div className="p-3 rounded-medium border border-border bg-surface-secondary text-xs font-semibold text-text-primary hover:bg-primary/10 hover:border-primary/20 transition cursor-pointer flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-surface border border-border flex items-center justify-center font-bold text-[10px]">
                  A
                </span>
                Queue
              </div>
              <div className="p-3 rounded-medium border border-primary bg-primary/5 text-xs font-bold text-primary transition cursor-pointer flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[10px]">
                    B
                  </span>
                  Stack
                </div>
                <Check className="w-4 h-4 text-primary" />
              </div>
            </div>
          </div>

          {/* Card 2: Leaderboard Score Mock */}
          <div className="absolute bottom-4 right-4 sm:right-12 w-full max-w-[280px] bg-surface border border-border p-5 rounded-large shadow-soft hover:-translate-y-1 hover:scale-[1.02] transition duration-300 z-30">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <span className="font-bold text-xs text-text-primary">Testing Room Leaderboard</span>
              <Trophy className="w-4 h-4 text-warning" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-border/40 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-text-secondary">#1</span>
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[10px]">
                    J
                  </div>
                  <span className="font-semibold text-text-primary">John Doe</span>
                </div>
                <span className="font-bold text-success">90% (14m)</span>
              </div>
              <div className="flex items-center justify-between text-xs border-b border-border/40 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-text-secondary">#2</span>
                  <div className="w-6 h-6 rounded-full bg-surface-secondary border border-border text-text-secondary flex items-center justify-center font-bold text-[10px]">
                    A
                  </div>
                  <span className="font-semibold text-text-primary">Alice Smith</span>
                </div>
                <span className="font-bold text-success">80% (12m)</span>
              </div>
            </div>
          </div>

          {/* Card 3: Backing Shadow Card */}
          <div className="absolute w-[80%] h-[80%] bg-surface-secondary/40 border border-border rounded-large shadow-sm -rotate-3 z-10 scale-[0.98] pointer-events-none" />
        </div>
      </section>

      {/* STATISTICS SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-12 z-10 relative">
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatisticsCard
            title="Attempts Completed"
            value="14,820"
            description="Graded assessments across subjects"
            icon={<FileText className="w-4.5 h-4.5" />}
          />
          <StatisticsCard
            title="Average System Accuracy"
            value="78.4%"
            description="Aggregated score index"
            icon={<Award className="w-4.5 h-4.5" />}
          />
          <StatisticsCard
            title="Active Testing Rooms"
            value="3,240"
            description="Instant join code rooms generated"
            icon={<Users className="w-4.5 h-4.5" />}
          />
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section
        id="features"
        className="max-w-7xl mx-auto px-6 py-24 border-t border-border relative z-10 text-left"
      >
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <h2 className="text-3xl font-extrabold text-text-primary">
            Designed for Seamless Evaluation
          </h2>
          <p className="text-text-secondary text-sm">
            Simple tools built for classrooms, technical interviews, and self-evaluation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            title="Instant Coding Rooms"
            description="Set up and customize assessment parameters, create question pools, and copy a 6-character room key in a few quick steps."
            icon={<Play className="w-5 h-5" />}
          />
          <FeatureCard
            title="Seamless Sharing"
            description="Participants enter the room key and take the test immediately without signing up. High scores, timers, and submissions are logged automatically."
            icon={<Share2 className="w-5 h-5" />}
          />
          <FeatureCard
            title="Real-Time Analytics"
            description="Track aggregate performance curves, accuracy scales, time charts, and question distribution metrics instantly."
            icon={<TrendingUp className="w-5 h-5" />}
          />
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section
        id="workflow"
        className="max-w-7xl mx-auto px-6 py-24 border-t border-border relative z-10 text-left"
      >
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <h2 className="text-3xl font-extrabold text-text-primary">Three Simple Steps</h2>
          <p className="text-text-secondary text-sm">
            Run fully structured testing rooms from parameters setup to dashboard grading.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-3 relative group">
            <div className="text-5xl font-extrabold text-border group-hover:text-primary transition-colors duration-300">
              01
            </div>
            <h4 className="font-bold text-base text-text-primary">Configure Target Subject</h4>
            <p className="text-text-secondary text-xs leading-relaxed">
              Enter a subject name, input target keywords, or select local files to configure your
              question database templates.
            </p>
          </div>

          <div className="space-y-3 relative group">
            <div className="text-5xl font-extrabold text-border group-hover:text-primary transition-colors duration-300">
              02
            </div>
            <h4 className="font-bold text-base text-text-primary">Distribute Invitation Code</h4>
            <p className="text-text-secondary text-xs leading-relaxed">
              Publish your assessment outline to generate a unique 6-digit access code for your
              participants.
            </p>
          </div>

          <div className="space-y-3 relative group">
            <div className="text-5xl font-extrabold text-border group-hover:text-primary transition-colors duration-300">
              03
            </div>
            <h4 className="font-bold text-base text-text-primary">Grade Performance</h4>
            <p className="text-text-secondary text-xs leading-relaxed">
              Review individual answers, average accuracy ratios, and time duration parameters in
              the tracking dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section
        id="faq"
        className="max-w-4xl mx-auto px-6 py-24 border-t border-border relative z-10 text-left"
      >
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <h2 className="text-3xl font-extrabold text-text-primary">Frequently Asked Questions</h2>
          <p className="text-text-secondary text-sm">
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

      {/* POLISHED FOOTER */}
      <Footer className="py-16 relative z-10 text-left bg-surface-secondary border-t border-border">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Col 1: Branding */}
          <div className="space-y-4 col-span-1 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-medium bg-primary flex items-center justify-center font-bold text-sm text-white">
                C
              </div>
              <span className="font-bold text-text-primary text-base">Companio</span>
            </div>
            <p className="text-text-secondary text-[11px] leading-relaxed">
              Modern assessment and practice infrastructure built for educators, students, and
              professionals. Fast, minimal, and fully themeable.
            </p>
            <div className="text-[10px] text-text-secondary/60">
              Companio © 2026. All rights reserved.
            </div>
          </div>

          {/* Col 2: Product links */}
          <div className="space-y-3">
            <h5 className="font-bold text-xs text-text-primary uppercase tracking-wider">
              Product
            </h5>
            <ul className="space-y-2 text-[11px] font-medium text-text-secondary">
              <li>
                <Link href="/generate" className="hover:text-text-primary transition">
                  Create Assessment
                </Link>
              </li>
              <li>
                <Link href="/assessments/join" className="hover:text-text-primary transition">
                  Join Room
                </Link>
              </li>
              <li>
                <Link href="/practice" className="hover:text-text-primary transition">
                  Practice Zone
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div className="space-y-3">
            <h5 className="font-bold text-xs text-text-primary uppercase tracking-wider">
              Resources
            </h5>
            <ul className="space-y-2 text-[11px] font-medium text-text-secondary">
              <li>
                <button
                  onClick={() => scrollToSection('features')}
                  className="hover:text-text-primary transition text-left"
                >
                  Key Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('workflow')}
                  className="hover:text-text-primary transition text-left"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('faq')}
                  className="hover:text-text-primary transition text-left"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Authentication Shortcut */}
          <div className="space-y-3">
            <h5 className="font-bold text-xs text-text-primary uppercase tracking-wider">
              Account
            </h5>
            <ul className="space-y-2 text-[11px] font-medium text-text-secondary">
              <li>
                <Link href="/login" className="hover:text-text-primary transition">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-text-primary transition">
                  Register Account
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </Footer>
    </div>
  )
}
