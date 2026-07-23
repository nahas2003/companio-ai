'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/features/auth/store/authStore'
import { Button, Navbar, Footer, ThemeToggle } from '@companio/ui'
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
  Play,
  Copy,
  BarChart3,
  Calendar,
  Sparkles,
  Github,
  Twitter,
  Linkedin,
  HelpCircle,
  Hash,
} from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

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
  const [copiedCode, setCopiedCode] = React.useState(false)

  // Mock states for interactive hero cards
  const [mockSubject, setMockSubject] = React.useState('Introduction to Database Management')
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [generationProgress, setGenerationProgress] = React.useState(0)

  const handleCopyCode = () => {
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

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
      {/* Subtle Background Glows (Minimal, No Flashy AI Elements) */}
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
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden absolute top-16 left-0 right-0 border-b border-border bg-surface p-6 space-y-4 shadow-soft z-50"
            >
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
            </motion.div>
          )}
        </AnimatePresence>
      </Navbar>

      {/* HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 lg:pt-28 pb-16 flex flex-col lg:flex-row items-center gap-16 lg:gap-12 z-10">
        {/* Left Column: Headings & Description */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-[48%] text-left space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            Modern Assessment Engine
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-text-primary">
            Build and Deliver <span className="text-text-secondary">Assessments Instantly</span>
          </h1>

          <p className="text-text-secondary text-base sm:text-lg leading-relaxed max-w-xl">
            Create custom question pools, share unique 6-character room codes with students, and
            track comprehensive grading logs in real time. Designed for modern teams and class
            environments.
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
        </motion.div>

        {/* Right Column: Floating Product Preview Mockup Grid */}
        <div className="w-full lg:w-[52%] relative min-h-[480px] sm:min-h-[540px] flex items-center justify-center select-none">
          {/* Card 1: Assessment Builder (Top Left) */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
            className="absolute top-0 left-0 w-full max-w-[280px] bg-surface border border-border p-5 rounded-large shadow-soft hover:-translate-y-1 hover:scale-[1.01] transition duration-300 z-30"
          >
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-primary" />
              <span className="font-bold text-[11px] text-text-primary">Configure Assessment</span>
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-text-secondary uppercase tracking-wider">
                  Subject Name
                </label>
                <div className="px-3 py-2 rounded-medium bg-surface-secondary border border-border text-[10px] font-semibold text-text-primary truncate">
                  {mockSubject}
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 space-y-1">
                  <label className="text-[9px] font-bold text-text-secondary uppercase tracking-wider">
                    Count
                  </label>
                  <div className="px-3 py-2 rounded-medium bg-surface-secondary border border-border text-[10px] font-semibold text-text-primary">
                    10 Questions
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-[9px] font-bold text-text-secondary uppercase tracking-wider">
                    Type
                  </label>
                  <div className="px-3 py-2 rounded-medium bg-surface-secondary border border-border text-[10px] font-semibold text-text-primary">
                    Multiple Choice
                  </div>
                </div>
              </div>
              <Button size="sm" className="w-full rounded-medium text-[10px] font-bold">
                Generate Template
              </Button>
            </div>
          </motion.div>

          {/* Card 2: Share Assessment Pin Card (Top Right) */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
            className="absolute top-10 right-0 w-full max-w-[240px] bg-surface border border-border p-5 rounded-large shadow-soft hover:-translate-y-1 hover:scale-[1.01] transition duration-300 z-20"
          >
            <div className="flex items-center gap-2 mb-3 border-b border-border pb-2.5">
              <Share2 className="w-4 h-4 text-primary" />
              <span className="font-bold text-[11px] text-text-primary">Invite Participants</span>
            </div>
            <div className="text-center py-2 bg-surface-secondary rounded-medium border border-border mb-3 relative group">
              <span className="font-mono font-bold text-lg text-text-primary tracking-widest uppercase">
                EF89A1
              </span>
              <button
                onClick={handleCopyCode}
                className="absolute right-2 top-2 p-1 rounded hover:bg-border text-text-secondary transition"
                title="Copy code"
              >
                {copiedCode ? (
                  <Check className="w-3 h-3 text-success" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
            <p className="text-[9px] text-text-secondary text-center leading-relaxed">
              Anyone can enter this access code to join the assessment lobby instantly.
            </p>
          </motion.div>

          {/* Card 3: Analytics Score Progress (Bottom Left / Center) */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut' }}
            className="absolute bottom-8 left-6 w-full max-w-[230px] bg-surface border border-border p-5 rounded-large shadow-soft hover:-translate-y-1 hover:scale-[1.01] transition duration-300 z-40"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-primary" />
                <span className="font-bold text-[11px] text-text-primary">
                  Submission Analytics
                </span>
              </div>
              <span className="text-[9px] font-bold text-success bg-success/15 px-1.5 py-0.5 rounded">
                Live
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-end gap-1.5 h-16 pt-2 border-b border-border">
                <div className="w-full bg-primary/20 rounded-t-small h-[40%]" />
                <div className="w-full bg-primary/45 rounded-t-small h-[65%]" />
                <div className="w-full bg-primary rounded-t-small h-[90%]" />
                <div className="w-full bg-primary/30 rounded-t-small h-[50%]" />
                <div className="w-full bg-primary/70 rounded-t-small h-[80%]" />
              </div>
              <div className="flex justify-between text-[9px] font-semibold text-text-secondary">
                <span>Avg. Score: 84%</span>
                <span>Attempts: 32</span>
              </div>
            </div>
          </motion.div>

          {/* Card 4: Leaderboard Score Mock (Bottom Right) */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 4.8, ease: 'easeInOut' }}
            className="absolute bottom-4 right-2 w-full max-w-[250px] bg-surface border border-border p-5 rounded-large shadow-soft hover:-translate-y-1 hover:scale-[1.01] transition duration-300 z-30"
          >
            <div className="flex items-center justify-between border-b border-border pb-2.5 mb-3">
              <span className="font-bold text-[11px] text-text-primary flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-warning" /> Live Leaderboard
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px] border-b border-border/40 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-text-secondary">#1</span>
                  <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[9px]">
                    J
                  </div>
                  <span className="font-semibold text-text-primary">John Doe</span>
                </div>
                <span className="font-bold text-success">92%</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-text-secondary">#2</span>
                  <div className="w-5 h-5 rounded-full bg-surface-secondary border border-border text-text-secondary flex items-center justify-center font-bold text-[9px]">
                    A
                  </div>
                  <span className="font-semibold text-text-primary">Alice Smith</span>
                </div>
                <span className="font-bold text-success">86%</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATISTICS SECTION (Production-Quality SaaS Metrics) */}
      <section className="max-w-7xl mx-auto px-6 py-12 z-10 relative">
        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-surface border border-border rounded-large shadow-sm hover:shadow-soft transition-shadow duration-300 flex flex-col justify-between">
            <span className="text-text-secondary text-[11px] font-bold uppercase tracking-wider">
              Assessments Created
            </span>
            <span className="text-3xl font-extrabold text-text-primary mt-2">84,912</span>
            <span className="text-[10px] text-text-secondary mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-success" /> +12.4% this month
            </span>
          </div>

          <div className="p-6 bg-surface border border-border rounded-large shadow-sm hover:shadow-soft transition-shadow duration-300 flex flex-col justify-between">
            <span className="text-text-secondary text-[11px] font-bold uppercase tracking-wider">
              Active Participants
            </span>
            <span className="text-3xl font-extrabold text-text-primary mt-2">1,328,095</span>
            <span className="text-[10px] text-text-secondary mt-1">Instant session logins</span>
          </div>

          <div className="p-6 bg-surface border border-border rounded-large shadow-sm hover:shadow-soft transition-shadow duration-300 flex flex-col justify-between">
            <span className="text-text-secondary text-[11px] font-bold uppercase tracking-wider">
              Completion Rate
            </span>
            <span className="text-3xl font-extrabold text-text-primary mt-2">94.2%</span>
            <span className="text-[10px] text-text-secondary mt-1">
              Excellent assessment retention
            </span>
          </div>

          <div className="p-6 bg-surface border border-border rounded-large shadow-sm hover:shadow-soft transition-shadow duration-300 flex flex-col justify-between">
            <span className="text-text-secondary text-[11px] font-bold uppercase tracking-wider">
              Average Duration
            </span>
            <span className="text-3xl font-extrabold text-text-primary mt-2">14.5m</span>
            <span className="text-[10px] text-text-secondary mt-1">Optimized time limits</span>
          </div>
        </div>
      </section>

      {/* CORE FEATURES SECTION (Rich Cards with Hover Effects & Consistent Heights) */}
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
          <motion.div
            whileHover={{ y: -6 }}
            className="flex flex-col h-full bg-surface border border-border p-8 rounded-large shadow-sm hover:border-primary/25 hover:shadow-soft transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-medium bg-primary/10 border border-primary/25 flex items-center justify-center text-primary mb-6">
              <Play className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-text-primary mb-3">Instant Creation</h3>
            <p className="text-text-secondary text-xs leading-relaxed flex-1">
              Configure customized question types, set timer thresholds, and generate templates
              immediately without administrative complexity.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="flex flex-col h-full bg-surface border border-border p-8 rounded-large shadow-sm hover:border-primary/25 hover:shadow-soft transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-medium bg-primary/10 border border-primary/25 flex items-center justify-center text-primary mb-6">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-text-primary mb-3">Seamless Joining</h3>
            <p className="text-text-secondary text-xs leading-relaxed flex-1">
              Give participants a unique 6-character room key. Candidates can take the assessment
              instantly on any mobile or desktop screen.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="flex flex-col h-full bg-surface border border-border p-8 rounded-large shadow-sm hover:border-primary/25 hover:shadow-soft transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-medium bg-primary/10 border border-primary/25 flex items-center justify-center text-primary mb-6">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-text-primary mb-3">Live Performance Metrics</h3>
            <p className="text-text-secondary text-xs leading-relaxed flex-1">
              Monitor candidate progression, overall group score distribution curves, and timing
              stats in real time directly from your supervisor cockpit.
            </p>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section
        id="workflow"
        className="max-w-7xl mx-auto px-6 py-24 border-t border-border relative z-10 text-left"
      >
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <h2 className="text-3xl font-extrabold text-text-primary">How Companio Works</h2>
          <p className="text-text-secondary text-sm">
            Create, publish, and evaluate testing rooms in three quick steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-3 relative group">
            <div className="text-5xl font-extrabold text-border group-hover:text-primary transition-colors duration-300">
              01
            </div>
            <h4 className="font-bold text-base text-text-primary">Set Up Blueprint</h4>
            <p className="text-text-secondary text-xs leading-relaxed">
              Enter target parameters, input your core questionnaire topic keywords, or specify
              documents to structure your templates.
            </p>
          </div>

          <div className="space-y-3 relative group">
            <div className="text-5xl font-extrabold text-border group-hover:text-primary transition-colors duration-300">
              02
            </div>
            <h4 className="font-bold text-base text-text-primary">Publish & Link</h4>
            <p className="text-text-secondary text-xs leading-relaxed">
              Submit the configuration to generate a unique 6-character room PIN. Distribute the PIN
              code to allow candidates instant access.
            </p>
          </div>

          <div className="space-y-3 relative group">
            <div className="text-5xl font-extrabold text-border group-hover:text-primary transition-colors duration-300">
              03
            </div>
            <h4 className="font-bold text-base text-text-primary">Analyze Score Logs</h4>
            <p className="text-text-secondary text-xs leading-relaxed">
              Assess individual answer accuracy, average attempt durations, and overall candidate
              curves inside the results center.
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

      {/* PREMIUM SaaS FOOTER */}
      <Footer className="py-16 relative z-10 text-left bg-surface-secondary border-t border-border">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Col 1: Branding */}
          <div className="space-y-4 col-span-2 md:col-span-1">
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

          {/* Col 2: Product */}
          <div className="space-y-3">
            <h5 className="font-bold text-xs text-text-primary uppercase tracking-wider">
              Product
            </h5>
            <ul className="space-y-2 text-[11px] font-semibold text-text-secondary">
              <li>
                <Link href="/generate" className="hover:text-text-primary transition">
                  Create Assessment
                </Link>
              </li>
              <li>
                <Link href="/assessments/join" className="hover:text-text-primary transition">
                  Join Testing Room
                </Link>
              </li>
              <li>
                <Link href="/practice" className="hover:text-text-primary transition">
                  Practice Zone
                </Link>
              </li>
              <li>
                <Link href="/question-bank" className="hover:text-text-primary transition">
                  Question Library
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div className="space-y-3">
            <h5 className="font-bold text-xs text-text-primary uppercase tracking-wider">
              Resources
            </h5>
            <ul className="space-y-2 text-[11px] font-semibold text-text-secondary">
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
              <li>
                <Link href="/sources" className="hover:text-text-primary transition">
                  Study Materials
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal */}
          <div className="space-y-3">
            <h5 className="font-bold text-xs text-text-primary uppercase tracking-wider">Legal</h5>
            <ul className="space-y-2 text-[11px] font-semibold text-text-secondary">
              <li>
                <Link href="/privacy" className="hover:text-text-primary transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-text-primary transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-text-primary transition">
                  Cookie Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Social / Company */}
          <div className="space-y-3">
            <h5 className="font-bold text-xs text-text-primary uppercase tracking-wider">
              Connect
            </h5>
            <div className="flex gap-4.5 pt-1.5 text-text-secondary">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-text-primary transition"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-text-primary transition"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-text-primary transition"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
            <div className="text-[10px] text-text-secondary/70 pt-2">
              Status: <span className="text-success font-bold">All Systems Normal</span>
            </div>
          </div>
        </div>
      </Footer>
    </div>
  )
}
