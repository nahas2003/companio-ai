'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/features/auth/store/authStore'
import { getSupabaseClient } from '@/lib/supabase'
import {
  generateQuestionsAction,
  regenerateSingleQuestionAction,
} from '../../../actions/generation'
import {
  createAssessmentTemplateAction,
  createAndPublishAssessmentAction,
  getAssessmentsDashboardAction,
} from '../../../actions/assessments'
import { createSourceRecord, processDocument } from '../../../actions/sources'
import type { Difficulty, QuestionType, GeneratedQuestion } from '@/features/ai/types/questions.types'
import {
  BookOpen,
  Sparkles,
  Upload,
  RefreshCw,
  ArrowLeft,
  Settings,
  List,
  Eye,
  EyeOff,
  Trash2,
  CheckCircle,
  HelpCircle,
  Clock,
  Award,
  BookMarked,
  LayoutGrid,
  Lock,
  Globe,
  Share2,
} from 'lucide-react'
import { Button } from '@companio/ui'

type GenerationMethod = 'TOPIC' | 'DESCRIPTION' | 'DOCUMENT'

export default function CreateAssessmentPage() {
  const router = useRouter()
  const { session } = useAuthStore()

  // Stepper flow states
  // 0: Landing (Choose method)
  // 1: Configure form
  // 2: Preview & Edit questions
  // 3: Save Summary
  const [step, setStep] = React.useState<number>(0)
  const [method, setMethod] = React.useState<GenerationMethod>('TOPIC')

  // Configuration settings form states
  const [topic, setTopic] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [difficulty, setDifficulty] = React.useState<Difficulty>('MEDIUM')
  const [questionType, setQuestionType] = React.useState<QuestionType>('MULTIPLE_CHOICE')
  const [count, setCount] = React.useState<number>(5)
  const [language, setLanguage] = React.useState('English')
  const [bloomLevel, setBloomLevel] = React.useState('')
  const [customInstructions, setCustomInstructions] = React.useState('')

  // Document uploader states
  const [file, setFile] = React.useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const [docProgressState, setDocProgressState] = React.useState<
    'idle' | 'uploading' | 'extracting' | 'generating' | 'saving' | 'completed' | 'failed'
  >('idle')
  const [uploadedSourceId, setUploadedSourceId] = React.useState<string | null>(null)

  // AI Pipeline questions states
  const [questions, setQuestions] = React.useState<GeneratedQuestion[]>([])
  const [generating, setGenerating] = React.useState(false)
  const [generationStep, setGenerationStep] = React.useState('')
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)

  // Final Assessment Settings form states
  const [assessmentName, setAssessmentName] = React.useState('')
  const [assessmentDesc, setAssessmentDesc] = React.useState('')
  const [timer, setTimer] = React.useState<number>(30)
  const [passingScore, setPassingScore] = React.useState<number>(60)
  const [shuffleQuestions, setShuffleQuestions] = React.useState(false)
  const [shuffleOptions, setShuffleOptions] = React.useState(false)
  const [isPublished, setIsPublished] = React.useState(false)
  const [savingAssessment, setSavingAssessment] = React.useState(false)
  const [publishedCode, setPublishedCode] = React.useState<string | null>(null)

  // Recent generations list
  const [recentAssessments, setRecentAssessments] = React.useState<any[]>([])
  const [loadingHistory, setLoadingHistory] = React.useState(true)

  React.useEffect(() => {
    async function loadHistory() {
      if (!session) return
      try {
        setLoadingHistory(true)
        const res = await getAssessmentsDashboardAction(session.access_token)
        if (res.success && res.templates) {
          setRecentAssessments(res.templates.slice(0, 5))
        }
      } catch (err) {
        console.error('Failed to load assessment history:', err)
      } finally {
        setLoadingHistory(false)
      }
    }
    loadHistory()
  }, [session, step])

  // handle dynamic names on config parameters update
  React.useEffect(() => {
    if (method === 'TOPIC' && topic.trim()) {
      setAssessmentName(`${topic} Quiz`)
    } else if (method === 'DESCRIPTION' && description.trim()) {
      setAssessmentName(`${description.substring(0, 20)} Quiz`)
    } else if (method === 'DOCUMENT' && file) {
      setAssessmentName(`${file.name.split('.')[0]} Quiz`)
    }
  }, [topic, description, file, method])

  const handleDocumentUploadAndGenerate = async () => {
    if (!session || !file) return
    try {
      setGenerating(true)
      setErrorMsg(null)
      setDocProgressState('uploading')

      const supabase = getSupabaseClient()
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `sources/${fileName}`

      // Upload file directly to Supabase storage bucket
      const { error: uploadError } = await supabase.storage.from('sources').upload(filePath, file)
      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)

      setDocProgressState('saving')
      const recRes = await createSourceRecord(session.access_token, {
        fileName: file.name,
        fileKey: filePath,
        fileSize: file.size,
        fileType: file.type,
      })

      if (!recRes.success || !recRes.source) {
        throw new Error(recRes.error || 'Failed to save source record.')
      }
      const sourceId = recRes.source.id
      setUploadedSourceId(sourceId)

      setDocProgressState('extracting')
      const procRes = await processDocument(session.access_token, sourceId)
      if (!procRes.success) {
        throw new Error(procRes.error || 'Failed to extract text content.')
      }

      setDocProgressState('generating')
      setGenerationStep('Querying AI Orchestrator failover router...')
      const genRes = await generateQuestionsAction(session.access_token, {
        method: 'DOCUMENT',
        sourceId: sourceId,
        count,
        type: questionType,
        difficulty,
      })

      if (genRes.success && genRes.questions) {
        setQuestions(genRes.questions)
        setDocProgressState('completed')
        setStep(2)
      } else {
        throw new Error(genRes.error || 'Failed to generate questions.')
      }
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'An unexpected error occurred during processing.')
      setDocProgressState('failed')
    } finally {
      setGenerating(false)
    }
  }

  const handleGenerateQuestions = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return

    if (method === 'DOCUMENT') {
      await handleDocumentUploadAndGenerate()
      return
    }

    try {
      setGenerating(true)
      setErrorMsg(null)
      setQuestions([])
      setGenerationStep('Building structured prompts...')

      const res = await generateQuestionsAction(session.access_token, {
        method,
        count,
        type: questionType,
        difficulty,
        topic: method === 'TOPIC' ? topic : undefined,
        description: method === 'DESCRIPTION' ? description : undefined,
        bloomLevel: method === 'TOPIC' ? bloomLevel : undefined,
        language,
        customInstructions: method === 'TOPIC' ? customInstructions : undefined,
      })

      if (res.success && res.questions) {
        setQuestions(res.questions)
        setStep(2)
      } else {
        setErrorMsg(res.error || 'AI generation failed.')
      }
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'An unexpected error occurred.')
    } finally {
      setGenerating(false)
    }
  }

  // Handle single question regeneration
  const handleRegenerateQuestion = async (idx: number) => {
    if (!session) return
    try {
      // Temporary loading indicator for the question item
      const updated = [...questions]
      updated[idx] = { ...updated[idx], title: 'Regenerating question...' }
      setQuestions(updated)

      const existingTitles = questions.map((q) => q.title)

      const res = await regenerateSingleQuestionAction(session.access_token, {
        method,
        type: questionType,
        difficulty,
        topic: method === 'TOPIC' ? topic : undefined,
        description: method === 'DESCRIPTION' ? description : undefined,
        sourceId: method === 'DOCUMENT' ? uploadedSourceId || undefined : undefined,
        existingTitles,
      })

      if (res.success && res.question) {
        const nextQs = [...questions]
        nextQs[idx] = res.question
        setQuestions(nextQs)
      } else {
        alert(res.error || 'Failed to replace question.')
        // restore old text
        loadHistory()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteQuestion = (idx: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleEditQuestionTitle = (idx: number, nextTitle: string) => {
    setQuestions((prev) => {
      const next = [...prev]
      next[idx] = { ...next[idx], title: nextTitle }
      return next
    })
  }

  const handleEditMCQOption = (qIdx: number, optIdx: number, val: string) => {
    setQuestions((prev) => {
      const next = [...prev]
      const q = { ...next[qIdx] }
      if (q.options) {
        const nextOpts = [...q.options]
        nextOpts[optIdx] = val
        q.options = nextOpts
      }
      next[qIdx] = q
      return next
    })
  }

  const handleSaveAssessment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session || !assessmentName.trim() || questions.length === 0) return

    try {
      setSavingAssessment(true)
      const payload = {
        title: assessmentName.trim(),
        description: assessmentDesc.trim(),
        timer: timer > 0 ? timer : undefined,
        passingScore,
        shuffleQuestions,
        shuffleOptions,
        generationMethod: method,
        topic: method === 'TOPIC' ? topic : undefined,
        prompt: method === 'DESCRIPTION' ? description : undefined,
        documentReference: method === 'DOCUMENT' ? file?.name : undefined,
        questions,
      }

      if (isPublished) {
        const res = await createAndPublishAssessmentAction(session.access_token, payload)
        if (res.success && res.code) {
          setPublishedCode(res.code)
        } else {
          alert(res.error || 'Failed to publish assessment.')
        }
      } else {
        const res = await createAssessmentTemplateAction(session.access_token, payload)
        if (res.success) {
          router.push('/assessments')
        } else {
          alert(res.error || 'Failed to save draft assessment.')
        }
      }
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'An error occurred during save.')
    } finally {
      setSavingAssessment(false)
    }
  }

  // Reload history helper
  const loadHistory = async () => {
    if (!session) return
    const res = await getAssessmentsDashboardAction(session.access_token)
    if (res.success && res.templates) {
      setRecentAssessments(res.templates.slice(0, 5))
    }
  }

  return (
    <div className="space-y-6 text-text-primary text-left max-w-5xl mx-auto pb-12 animate-fade-in">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between border-b border-border pb-5">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" /> Create AI Assessment
          </h1>
          <p className="text-text-secondary text-xs font-semibold">
            {step === 0
              ? 'Choose how you want to generate your assessment.'
              : step === 1
                ? 'Configure parameters for the AI generation engine.'
                : step === 2
                  ? 'Refine and review the questions deck compiled by AI.'
                  : 'Specify assessment configurations and limits.'}
          </p>
        </div>
        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-medium bg-surface-secondary border border-border hover:bg-border text-text-secondary hover:text-text-primary text-xs font-bold transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
        )}
      </div>

      {/* ERROR MESSAGE CARD */}
      {errorMsg && (
        <div className="p-4 bg-danger/10 border border-danger/25 rounded-medium flex items-start gap-3">
          <Trash2 className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
          <div className="text-xs font-bold text-danger leading-relaxed">
            Generation Failed: {errorMsg}
          </div>
        </div>
      )}

      {/* STEP 0: LANDING PAGE (CHOOSE METHOD) */}
      {step === 0 && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* OPTION 1: TOPIC (RECOMMENDED) */}
            <div className="relative bg-surface border-2 border-primary/40 rounded-large p-6 shadow-soft hover:shadow-medium hover:border-primary transition-all duration-300 flex flex-col justify-between">
              <span className="absolute -top-3 left-4 bg-primary text-white text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wider shadow-sm">
                Recommended
              </span>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-medium bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mt-2">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-base text-text-primary">Generate from Topic</h3>
                  <p className="text-text-secondary text-xs leading-relaxed">
                    Fastest way to create a quiz. Supply a topic like "React Hooks" or "OS Semaphores".
                  </p>
                </div>
              </div>
              <Button
                onClick={() => {
                  setMethod('TOPIC')
                  setStep(1)
                }}
                className="w-full mt-6 h-9 font-bold text-xs"
              >
                Continue
              </Button>
            </div>

            {/* OPTION 2: DESCRIPTION */}
            <div className="bg-surface border border-border rounded-large p-6 shadow-sm hover:shadow-soft hover:border-border-hover transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-medium bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-500">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-base text-text-primary">Generate from Description</h3>
                  <p className="text-text-secondary text-xs leading-relaxed">
                    Use natural instructions to describe the target questions format, cover points, and quiz targets.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => {
                  setMethod('DESCRIPTION')
                  setStep(1)
                }}
                className="w-full mt-6 h-9 bg-surface-secondary border border-border text-text-primary hover:bg-border font-bold text-xs"
              >
                Continue
              </Button>
            </div>

            {/* OPTION 3: STUDY MATERIAL */}
            <div className="bg-surface border border-border rounded-large p-6 shadow-sm hover:shadow-soft hover:border-border-hover transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-medium bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-base text-text-primary">Generate from Document</h3>
                  <p className="text-text-secondary text-xs leading-relaxed">
                    Upload notes, PDFs, DOCX, TXT, or MD. AI will extract and compile assessments.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => {
                  setMethod('DOCUMENT')
                  setStep(1)
                }}
                className="w-full mt-6 h-9 bg-surface-secondary border border-border text-text-primary hover:bg-border font-bold text-xs"
              >
                Continue
              </Button>
            </div>
          </div>

          {/* RECENT GENERATIONS HISTORY */}
          <div className="space-y-4 pt-4">
            <h2 className="text-base font-bold flex items-center gap-2 text-text-primary">
              <BookMarked className="w-5 h-5 text-primary" /> Recent Assessments & Drafts
            </h2>
            {loadingHistory ? (
              <div className="h-20 flex items-center justify-center border border-border rounded-large bg-surface">
                <RefreshCw className="w-5 h-5 animate-spin text-text-secondary/40 mr-2" />
                <span className="text-xs text-text-secondary/50 font-semibold">Loading history...</span>
              </div>
            ) : recentAssessments.length === 0 ? (
              <div className="p-8 border border-dashed border-border rounded-large text-center bg-surface">
                <p className="text-xs text-text-secondary font-semibold">No recent assessments generated.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5">
                {recentAssessments.map((a) => (
                  <div
                    key={a.id}
                    className="p-4 bg-surface border border-border rounded-large flex items-center justify-between shadow-sm hover:border-primary/20 transition duration-200"
                  >
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-xs text-text-primary">{a.title}</h4>
                      <p className="text-[10px] text-text-secondary flex items-center gap-3 font-semibold">
                        <span>Format: {a.questionBank?.questions?.[0]?.type?.replace('_', ' ') || 'MCQ'}</span>
                        <span>•</span>
                        <span>Method: {a.generationMethod || 'DOCUMENT'}</span>
                      </p>
                    </div>
                    <Link
                      href={`/assessments`}
                      className="px-3 py-1.5 bg-surface-secondary hover:bg-border text-text-primary text-[10px] font-bold rounded-medium transition"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 1: CONFIGURE FORM */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 bg-surface border border-border rounded-large p-6 shadow-sm space-y-6">
            <h2 className="text-base font-bold flex items-center gap-2 text-text-primary">
              <Settings className="w-5 h-5 text-primary" /> Quiz Configuration
            </h2>

            <form onSubmit={handleGenerateQuestions} className="space-y-6">
              {/* TOPIC FIELDS */}
              {method === 'TOPIC' && (
                <div className="space-y-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">
                      Assessment Topic
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Database Indexing, JavaScript Event Loop"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full h-10 px-3 rounded-medium border border-border bg-surface text-text-primary text-xs outline-none focus:border-primary/50 shadow-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">
                        Bloom's Cognitive Level (Optional)
                      </label>
                      <select
                        value={bloomLevel}
                        onChange={(e) => setBloomLevel(e.target.value)}
                        className="w-full h-10 px-3 rounded-medium border border-border bg-surface text-text-primary text-xs outline-none focus:border-primary/50"
                      >
                        <option value="">No custom level (General Evaluation)</option>
                        <option value="Remember">Remember (Recall facts)</option>
                        <option value="Understand">Understand (Explain concepts)</option>
                        <option value="Apply">Apply (Use info in new situations)</option>
                        <option value="Analyze">Analyze (Draw connections)</option>
                        <option value="Evaluate">Evaluate (Justify decisions)</option>
                        <option value="Create">Create (Produce new work)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">
                        Language
                      </label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full h-10 px-3 rounded-medium border border-border bg-surface text-text-primary text-xs outline-none focus:border-primary/50"
                      >
                        <option value="English">English</option>
                        <option value="Malayalam">Malayalam</option>
                        <option value="Arabic">Arabic</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">
                      Custom Guidelines / Instructions (Optional)
                    </label>
                    <textarea
                      placeholder="e.g. Include scenario-based questions. Focus on PostgreSQL indexing methods specifically."
                      value={customInstructions}
                      onChange={(e) => setCustomInstructions(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 rounded-medium border border-border bg-surface text-text-primary text-xs outline-none focus:border-primary/50 resize-none shadow-sm"
                    />
                  </div>
                </div>
              )}

              {/* DESCRIPTION FIELDS */}
              {method === 'DESCRIPTION' && (
                <div className="space-y-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">
                      Describe what the AI should generate
                    </label>
                    <textarea
                      required
                      placeholder='e.g. "Create a beginner networking quiz covering TCP/IP, Routing, Switching and VLANs. Focus on routing tables and subnetting."'
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={5}
                      className="w-full px-3 py-2.5 rounded-medium border border-border bg-surface text-text-primary text-xs outline-none focus:border-primary/50 resize-none shadow-sm"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">
                      Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full h-10 px-3 rounded-medium border border-border bg-surface text-text-primary text-xs outline-none focus:border-primary/50"
                    >
                      <option value="English">English</option>
                      <option value="Malayalam">Malayalam</option>
                      <option value="Arabic">Arabic</option>
                    </select>
                  </div>
                </div>
              )}

              {/* DOCUMENT FIELDS */}
              {method === 'DOCUMENT' && (
                <div className="space-y-4 text-left">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wide block">
                    Upload Study Document (PDF, DOCX, TXT, MD)
                  </label>
                  <div className="border-2 border-dashed border-border rounded-large p-8 flex flex-col items-center justify-center text-center bg-surface-secondary/20 hover:border-primary/40 transition duration-200 cursor-pointer relative">
                    <input
                      type="file"
                      required
                      accept=".pdf,.docx,.txt,.md"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="w-8 h-8 text-text-secondary/50 mb-3" />
                    {file ? (
                      <div className="space-y-1.5">
                        <p className="text-xs font-bold text-text-primary">{file.name}</p>
                        <p className="text-[10px] text-text-secondary">
                          {Math.round(file.size / 1024)} KB
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-text-primary">
                          Click to upload file
                        </p>
                        <p className="text-[10px] text-text-secondary">
                          Supports PDF, DOCX, TXT, or MD up to 10MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* COMMON OPTIONS */}
              <div className="border-t border-border pt-5 space-y-4 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Format */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wide flex items-center gap-1.5">
                      Question Format
                    </label>
                    <select
                      value={questionType}
                      onChange={(e) => setQuestionType(e.target.value as QuestionType)}
                      className="w-full h-10 px-3 rounded-medium border border-border bg-surface text-text-primary text-xs outline-none focus:border-primary/50 shadow-sm"
                    >
                      <option value="MULTIPLE_CHOICE">Multiple Choice Quiz</option>
                      <option value="TRUE_FALSE">True / False</option>
                      <option value="SHORT_ANSWER">Short Answers</option>
                    </select>
                  </div>

                  {/* Difficulty */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wide flex items-center gap-1.5">
                      Difficulty Level
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['EASY', 'MEDIUM', 'HARD'] as const).map((level) => {
                        const isSelected = difficulty === level
                        return (
                          <button
                            key={level}
                            type="button"
                            onClick={() => setDifficulty(level)}
                            className={`h-10 rounded-medium text-[10px] font-bold border transition-all duration-200 ${
                              isSelected
                                ? 'bg-primary/10 text-primary border-primary/30 shadow-sm'
                                : 'bg-surface text-text-secondary border-border hover:bg-surface-secondary hover:text-text-primary'
                            }`}
                          >
                            {level}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Count range slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">
                      Questions Count
                    </label>
                    <span className="text-[10px] font-bold text-primary bg-primary/15 px-2.5 py-0.5 rounded-full">
                      {count} items
                    </span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="15"
                    step="1"
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value))}
                    className="w-full h-1 bg-border rounded-medium appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[9px] text-text-secondary font-bold">
                    <span>3</span>
                    <span>9</span>
                    <span>15</span>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={generating || (method === 'DOCUMENT' && !file)}
                className="w-full h-10 rounded-medium text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                {generating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                {generating ? 'Generating questions...' : 'Generate Questions'}
              </Button>
            </form>
          </div>

          {/* Right Info Box */}
          <div className="bg-surface border border-border rounded-large p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-text-primary">Unified AI Pipeline</h3>
            <p className="text-text-secondary text-xs leading-relaxed">
              Companio automatically parses your inputs and filters them through dynamic validation libraries to prevent prompt injections and duplicates.
            </p>
            <div className="border-t border-border pt-4">
              <div className="flex items-center gap-2 text-xs font-bold text-text-primary">
                <CheckCircle className="w-4 h-4 text-success" /> Cache reuse optimized
              </div>
              <p className="text-text-secondary text-[10px] mt-1 pl-6">
                Identical configurations are served instantly without extra API cost.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT LOADING STAGE OVERLAY */}
      {generating && method === 'DOCUMENT' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border rounded-large p-8 max-w-md w-full text-center space-y-4 shadow-soft animate-scale-up">
            <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto" />
            <h3 className="font-bold text-base text-text-primary">Processing Document</h3>
            <div className="w-full bg-border h-2 rounded-full overflow-hidden relative">
              <div
                className={`h-full bg-primary transition-all duration-300 ${
                  docProgressState === 'uploading'
                    ? 'w-1/4'
                    : docProgressState === 'saving'
                      ? 'w-2/4'
                      : docProgressState === 'extracting'
                        ? 'w-3/4'
                        : 'w-full animate-pulse'
                }`}
              />
            </div>
            <p className="text-xs text-text-secondary font-bold uppercase tracking-wider animate-pulse">
              {docProgressState === 'uploading'
                ? 'Uploading file payload...'
                : docProgressState === 'saving'
                  ? 'Saving ingestion source...'
                  : docProgressState === 'extracting'
                    ? 'Extracting raw contents...'
                    : 'Querying AI Provider failover router...'}
            </p>
          </div>
        </div>
      )}

      {/* STEP 2: PREVIEW & EDIT QUESTIONS */}
      {step === 2 && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-base font-bold text-text-primary">
              Preview & Edit Questions ({questions.length} items)
            </h2>
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-medium shadow-sm transition"
            >
              Continue to Details
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {questions.map((q, qIdx) => (
              <div
                key={qIdx}
                className="p-5 rounded-large bg-surface border border-border space-y-4 text-left transition hover:border-primary/25 hover:shadow-soft duration-300"
              >
                {/* Question title input */}
                <div className="flex items-start gap-3">
                  <span className="w-5.5 h-5.5 rounded-medium bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center justify-center mt-1 flex-shrink-0">
                    {qIdx + 1}
                  </span>
                  <input
                    type="text"
                    value={q.title}
                    onChange={(e) => handleEditQuestionTitle(qIdx, e.target.value)}
                    className="w-full font-bold text-xs bg-transparent border-b border-dashed border-border/80 focus:border-primary outline-none py-0.5 text-text-primary"
                  />
                </div>

                {/* Question options if MCQ */}
                {q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-8.5">
                    {q.options.map((option, optIdx) => {
                      const isCorrect = q.correctAnswer === optIdx
                      return (
                        <div
                          key={optIdx}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-medium border text-xs font-semibold ${
                            isCorrect ? 'border-success/30 bg-success/5' : 'border-border bg-surface'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`correct-${qIdx}`}
                            checked={isCorrect}
                            onChange={() => {
                              setQuestions((prev) => {
                                const next = [...prev]
                                next[qIdx] = { ...next[qIdx], correctAnswer: optIdx }
                                return next
                              })
                            }}
                            className="text-primary focus:ring-0 rounded-full"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handleEditMCQOption(qIdx, optIdx, e.target.value)}
                            className="bg-transparent outline-none flex-1 py-0.5 font-medium"
                          />
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Actions: delete and regenerate */}
                <div className="pl-8.5 flex items-center justify-end gap-4 border-t border-border/40 pt-3">
                  <button
                    onClick={() => handleRegenerateQuestion(qIdx)}
                    className="flex items-center gap-1 text-[10px] font-bold text-primary hover:text-primary-hover transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(qIdx)}
                    className="flex items-center gap-1 text-[10px] font-bold text-danger hover:text-danger-hover transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: SAVE & SUMMARY */}
      {step === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Summary Box */}
          <div className="bg-surface border border-border rounded-large p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-text-primary">Assessment Summary</h3>
            <div className="divide-y divide-border text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-text-secondary font-semibold">Total questions</span>
                <span className="font-bold text-text-primary">{questions.length} items</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-text-secondary font-semibold">Difficulty</span>
                <span className="font-bold text-text-primary uppercase">{difficulty}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-text-secondary font-semibold">Generation method</span>
                <span className="font-bold text-text-primary uppercase">{method}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-text-secondary font-semibold">Format</span>
                <span className="font-bold text-text-primary uppercase">
                  {questionType.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Configuration Form */}
          <div className="lg:col-span-2 bg-surface border border-border rounded-large p-6 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-text-primary">Assessment Configurations</h2>

            <form onSubmit={handleSaveAssessment} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">
                  Assessment Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Biology Midterm Quiz"
                  value={assessmentName}
                  onChange={(e) => setAssessmentName(e.target.value)}
                  className="w-full h-10 px-3 rounded-medium border border-border bg-surface text-text-primary text-xs outline-none focus:border-primary/50 shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">
                  Description (Optional)
                </label>
                <textarea
                  placeholder="e.g. Graded assessment covering chapter concepts"
                  value={assessmentDesc}
                  onChange={(e) => setAssessmentDesc(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-medium border border-border bg-surface text-text-primary text-xs outline-none focus:border-primary/50 resize-none shadow-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">
                    Time Limit (Minutes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Untimed"
                    value={timer}
                    onChange={(e) => setTimer(parseInt(e.target.value) || 0)}
                    className="w-full h-10 px-3 rounded-medium border border-border bg-surface text-text-primary text-xs outline-none focus:border-primary/50 shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">
                    Passing Score (%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={passingScore}
                    onChange={(e) => setPassingScore(parseInt(e.target.value) || 60)}
                    className="w-full h-10 px-3 rounded-medium border border-border bg-surface text-text-primary text-xs outline-none focus:border-primary/50 shadow-sm"
                  />
                </div>
              </div>

              {/* Shuffles config checkbox options */}
              <div className="py-2 space-y-2 border-b border-border pb-4">
                <label className="flex items-center gap-2 text-xs font-semibold text-text-primary cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={shuffleQuestions}
                    onChange={(e) => setShuffleQuestions(e.target.checked)}
                    className="rounded bg-surface border-border text-primary focus:ring-0"
                  />
                  Shuffle questions ordering
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-text-primary cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={shuffleOptions}
                    onChange={(e) => setShuffleOptions(e.target.checked)}
                    className="rounded bg-surface border-border text-primary focus:ring-0"
                  />
                  Shuffle options choices (for MCQ)
                </label>
              </div>

              {/* Visibility settings Draft / Publish */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wide block">
                  Visibility / Publish State
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setIsPublished(false)}
                    className={`py-3 px-4 border rounded-large flex items-center justify-between text-xs font-bold transition duration-200 ${
                      !isPublished
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border bg-surface text-text-secondary hover:bg-surface-secondary'
                    }`}
                  >
                    <div className="text-left space-y-0.5">
                      <p>Draft</p>
                      <p className="text-[10px] text-text-secondary/70 font-semibold">
                        Review and edit later
                      </p>
                    </div>
                    <Lock className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsPublished(true)}
                    className={`py-3 px-4 border rounded-large flex items-center justify-between text-xs font-bold transition duration-200 ${
                      isPublished
                        ? 'border-success bg-success/5 text-success'
                        : 'border-border bg-surface text-text-secondary hover:bg-surface-secondary'
                    }`}
                  >
                    <div className="text-left space-y-0.5">
                      <p>Published</p>
                      <p className="text-[10px] text-text-secondary/70 font-semibold">
                        Generate join code instantly
                      </p>
                    </div>
                    <Globe className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Save actions buttons */}
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2 bg-surface-secondary border border-border hover:bg-border text-text-secondary hover:text-text-primary text-xs font-bold rounded-medium transition"
                >
                  Edit Questions
                </button>
                <Button
                  type="submit"
                  disabled={savingAssessment}
                  className="px-6 py-2 text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                >
                  {savingAssessment && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  {isPublished ? 'Publish Assessment' : 'Save as Draft'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PUBLISHED SUCCESS MODAL */}
      {publishedCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border rounded-large p-6 max-w-sm w-full text-center space-y-5 shadow-soft animate-scale-up">
            <div className="w-14 h-14 rounded-full bg-success/15 border border-success/35 text-success flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-extrabold text-base text-text-primary">Assessment Published!</h3>
              <p className="text-xs text-text-secondary font-semibold leading-relaxed">
                Candidates can join your exam session instantly using the code below.
              </p>
            </div>
            <div className="py-3 px-4 bg-surface-secondary border border-border rounded-medium font-mono text-2xl font-bold tracking-widest text-primary flex items-center justify-center gap-2 select-all shadow-sm">
              {publishedCode}
            </div>
            <Button
              onClick={() => router.push('/assessments')}
              className="w-full h-10 font-bold text-xs flex items-center justify-center gap-2"
            >
              Continue to List
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
