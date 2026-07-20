'use client'

import * as React from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuthStore } from '@/features/auth/store/authStore'
import { getSources } from '../../actions/sources'
import { generateQuestionsAction } from '../../actions/generation'
import { saveQuestionsToBankAction } from '../../actions/questionBank'
import type { Source } from '@/features/sources/types/source.types'
import type {
  Difficulty,
  QuestionType,
  GeneratedQuestion,
} from '@/features/ai/types/questions.types'
import {
  RefreshCw,
  BookOpen,
  HelpCircle,
  Award,
  Layers,
  Eye,
  EyeOff,
  AlertCircle,
  Play,
  RotateCcw,
  FolderPlus,
  X,
  Plus,
} from 'lucide-react'
import { Button } from '@companio/ui'

export default function GenerateQuestionsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-background text-text-primary flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
          <span className="text-xs font-bold tracking-wide animate-pulse">
            Initializing Portal...
          </span>
        </div>
      }
    >
      <GenerateContent />
    </React.Suspense>
  )
}

function GenerateContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { session } = useAuthStore()

  const [sources, setSources] = React.useState<Source[]>([])
  const [loadingSources, setLoadingSources] = React.useState(true)

  // Form states
  const [selectedSourceId, setSelectedSourceId] = React.useState('')
  const [difficulty, setDifficulty] = React.useState<Difficulty>('MEDIUM')
  const [questionType, setQuestionType] = React.useState<QuestionType>('MULTIPLE_CHOICE')
  const [count, setCount] = React.useState(5)

  // Generation status
  const [generating, setGenerating] = React.useState(false)
  const [generationStep, setGenerationStep] = React.useState('')
  const [generatedQuestions, setGeneratedQuestions] = React.useState<GeneratedQuestion[]>([])
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)
  const [revealedAnswers, setRevealedAnswers] = React.useState<Record<number, boolean>>({})

  // Saving states
  const [saving, setSaving] = React.useState(false)
  const [showSaveModal, setShowSaveModal] = React.useState(false)
  const [bankName, setBankName] = React.useState('')
  const [bankDesc, setBankDesc] = React.useState('')

  const triggerSaveModal = () => {
    const selectedSource = sources.find((s) => s.id === selectedSourceId)
    const baseName = selectedSource ? selectedSource.fileName.split('.')[0] : 'Study Material'
    setBankName(`Quiz: ${baseName}`)
    setBankDesc(`Generated practice questions on ${baseName} (${questionType.replace('_', ' ')})`)
    setShowSaveModal(true)
  }

  const handleSaveToBank = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session || !selectedSourceId || generatedQuestions.length === 0 || !bankName.trim()) return

    try {
      setSaving(true)
      const res = await saveQuestionsToBankAction(session.access_token, {
        sourceId: selectedSourceId,
        bankName: bankName.trim(),
        description: bankDesc.trim(),
        difficulty,
        type: questionType,
        questions: generatedQuestions,
      })

      if (res.success) {
        setShowSaveModal(false)
        router.push('/question-bank')
      } else {
        alert(res.error || 'Failed to save questions to bank.')
      }
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'An error occurred while saving.')
    } finally {
      setSaving(false)
    }
  }

  // Load completed sources
  const loadSources = React.useCallback(async () => {
    if (!session) return
    try {
      setLoadingSources(true)
      const res = await getSources(session.access_token)
      if (res.success && res.sources) {
        const completedOnly = (res.sources as unknown as Source[]).filter(
          (s) => s.status === 'COMPLETED',
        )
        setSources(completedOnly)

        // Pre-select if sourceId in URL search queries
        const urlSourceId = searchParams.get('sourceId')
        if (urlSourceId && completedOnly.some((s) => s.id === urlSourceId)) {
          setSelectedSourceId(urlSourceId)
        } else if (completedOnly.length > 0) {
          setSelectedSourceId(completedOnly[0].id)
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingSources(false)
    }
  }, [session, searchParams])

  React.useEffect(() => {
    loadSources()
  }, [loadSources])

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!session || !selectedSourceId) return

    try {
      setGenerating(true)
      setErrorMsg(null)
      setGeneratedQuestions([])
      setRevealedAnswers({})

      setGenerationStep('Extracting plain text contents...')
      await new Promise((r) => setTimeout(r, 600))

      setGenerationStep('Querying AI Orchestrator with templates...')
      const res = await generateQuestionsAction(session.access_token, {
        sourceId: selectedSourceId,
        count,
        type: questionType,
        difficulty,
      })

      if (res.success && res.questions) {
        setGenerationStep('Validating schemas and cleaning duplicates...')
        await new Promise((r) => setTimeout(r, 600))
        setGeneratedQuestions(res.questions)
      } else {
        setErrorMsg(res.error || 'Generation request failed.')
      }
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'An unexpected error occurred during generation.')
    } finally {
      setGenerating(false)
      setGenerationStep('')
    }
  }

  const toggleAnswer = (index: number) => {
    setRevealedAnswers((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  return (
    <div className="space-y-6 text-text-primary text-left animate-fade-in max-w-5xl mx-auto pb-12">
      <div className="border-b border-border pb-5">
        <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2.5">
          <Layers className="w-7 h-7 text-primary" /> Practice Builder
        </h1>
        <p className="text-text-secondary text-xs font-semibold mt-1">
          Select any processed source document to generate custom practice assessments instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Form Option Panel */}
        <div className="bg-surface border border-border rounded-large p-5 shadow-sm space-y-5">
          <h2 className="text-base font-bold flex items-center gap-2 text-text-primary">
            <Layers className="w-4.5 h-4.5 text-primary" /> Configuration
          </h2>

          <form onSubmit={handleGenerate} className="space-y-5">
            {/* Select Material */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wide flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-text-secondary/60" /> 1. Select Material
              </label>
              {loadingSources ? (
                <div className="h-10 flex items-center px-3 bg-surface border border-border rounded-medium">
                  <RefreshCw className="w-4 h-4 animate-spin text-text-secondary/50 mr-2" />
                  <span className="text-xs text-text-secondary/60 font-semibold">
                    Loading catalog...
                  </span>
                </div>
              ) : sources.length === 0 ? (
                <div className="p-3 bg-danger/10 border border-danger/25 rounded-medium text-xs text-danger font-semibold leading-relaxed">
                  No processed materials found. Upload files in Study Materials first.
                </div>
              ) : (
                <select
                  value={selectedSourceId}
                  onChange={(e) => setSelectedSourceId(e.target.value)}
                  className="w-full px-3 py-2 rounded-medium border border-border bg-surface text-text-primary text-xs outline-none focus:border-primary/50"
                >
                  {sources.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fileName} ({s.fileType.toUpperCase()})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Question Type selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wide flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-text-secondary/60" /> 2. Question Format
              </label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value as QuestionType)}
                className="w-full px-3 py-2 rounded-medium border border-border bg-surface text-text-primary text-xs outline-none focus:border-primary/50"
              >
                <option value="MULTIPLE_CHOICE">Multiple Choice Quiz</option>
                <option value="TRUE_FALSE">True / False</option>
                <option value="SHORT_ANSWER">Short Answers</option>
              </select>
            </div>

            {/* Difficulty Cards */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wide flex items-center gap-1.5">
                <Award className="w-4 h-4 text-text-secondary/60" /> 3. Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['EASY', 'MEDIUM', 'HARD'] as const).map((level) => {
                  const isSelected = difficulty === level
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setDifficulty(level)}
                      className={`py-1.5 rounded-medium text-[10px] font-bold border transition-all duration-200 ${
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

            {/* Questions count */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">
                  4. Questions Count
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

            <Button
              type="submit"
              disabled={generating || sources.length === 0}
              className="w-full h-10 rounded-medium text-xs font-bold flex items-center justify-center gap-2 transition duration-200"
            >
              {generating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
              {generating ? 'Generating...' : 'Generate Deck'}
            </Button>
          </form>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-2 space-y-5">
          {generating ? (
            <div className="bg-surface border border-border rounded-large p-12 shadow-sm flex flex-col items-center justify-center gap-4 text-center min-h-[400px]">
              <RefreshCw className="w-8 h-8 text-primary animate-spin" />
              <div className="space-y-1.5">
                <h3 className="font-bold text-base text-text-primary">Content Processing</h3>
                <p className="text-xs text-text-secondary font-medium animate-pulse">
                  {generationStep}
                </p>
              </div>
            </div>
          ) : errorMsg ? (
            <div className="bg-surface border border-border rounded-large p-8 shadow-sm space-y-5 min-h-[300px] flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-medium bg-danger/10 border border-danger/20 flex items-center justify-center text-danger">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div className="space-y-2 max-w-md">
                <h3 className="font-bold text-base text-text-primary">Generation Failed</h3>
                <p className="text-text-secondary text-xs leading-relaxed">Reason: {errorMsg}</p>
              </div>
              <Button
                onClick={() => handleGenerate()}
                className="bg-danger hover:bg-danger-hover text-white font-bold flex items-center gap-2 h-9 px-5 text-xs rounded-medium transition"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retry Generation
              </Button>
            </div>
          ) : generatedQuestions.length === 0 ? (
            <div className="bg-surface border border-border rounded-large p-12 shadow-sm flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
              <div className="w-16 h-16 rounded-medium bg-surface-secondary border border-border flex items-center justify-center text-text-secondary">
                <Layers className="w-7 h-7" />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h3 className="font-bold text-base text-text-primary">Interactive Practice Deck</h3>
                <p className="text-text-secondary text-xs leading-relaxed">
                  Configure the panel on the left and generate a quiz deck from your document text
                  block.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-base font-bold flex items-center gap-2 text-text-primary">
                  Generated Practice Deck ({generatedQuestions.length} items)
                </h2>
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-bold text-text-secondary bg-surface-secondary border border-border px-3 py-1 rounded-pill uppercase tracking-wider">
                    {questionType.replace('_', ' ')}
                  </span>
                  <button
                    onClick={triggerSaveModal}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-medium bg-success text-white text-xs font-bold hover:bg-success-hover transition duration-200 shadow-sm"
                  >
                    <FolderPlus className="w-3.5 h-3.5" /> Save to Bank
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {generatedQuestions.map((q, idx) => {
                  const revealed = !!revealedAnswers[idx]

                  return (
                    <div
                      key={idx}
                      className="p-5 rounded-large bg-surface border border-border/80 space-y-4 text-left transition hover:border-primary/20 hover:shadow-soft duration-300"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-5.5 h-5.5 rounded-medium bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <h3 className="font-bold text-xs text-text-primary leading-relaxed flex-1">
                          {q.title}
                        </h3>
                      </div>

                      {/* Render MCQ or True/False options list */}
                      {q.options && q.options.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pl-8.5">
                          {q.options.map((option, optIdx) => {
                            const isCorrect = q.correctAnswer === optIdx
                            return (
                              <div
                                key={optIdx}
                                className={`px-3 py-2 rounded-medium border text-xs font-semibold transition duration-200 ${
                                  revealed && isCorrect
                                    ? 'bg-success/10 border-success/30 text-success'
                                    : revealed
                                      ? 'bg-surface-secondary border-border text-text-secondary/70'
                                      : 'bg-surface border-border text-text-primary'
                                }`}
                              >
                                <span className="text-[9px] text-text-secondary/60 font-bold uppercase tracking-wider mr-1.5">
                                  {String.fromCharCode(65 + optIdx)}.
                                </span>
                                {option}
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {/* Render short answer model answer block */}
                      {questionType === 'SHORT_ANSWER' && revealed && q.modelAnswer && (
                        <div className="ml-8.5 p-3.5 rounded-medium border border-success/20 bg-success/10 text-success text-[11px] leading-relaxed">
                          <span className="font-bold block text-[9px] uppercase tracking-wider text-success mb-1">
                            Model Answer:
                          </span>
                          {q.modelAnswer}
                        </div>
                      )}

                      <div className="pl-8.5 flex items-center justify-end">
                        <button
                          onClick={() => toggleAnswer(idx)}
                          className="flex items-center gap-1 text-[10px] font-bold text-text-secondary hover:text-text-primary transition duration-200"
                        >
                          {revealed ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                          {revealed ? 'Hide Answer' : 'Reveal Answer'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save to Question Bank Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface border border-border rounded-large p-5 max-w-md w-full space-y-4 shadow-soft animate-scale-up">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2 text-text-primary">
                <FolderPlus className="w-5 h-5 text-primary" /> Save Practice Deck
              </h3>
              <button
                onClick={() => setShowSaveModal(false)}
                className="text-text-secondary hover:text-text-primary transition duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveToBank} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">
                  Question Bank Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Biology midterm questions"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3 py-2 rounded-medium border border-border bg-surface text-text-primary text-xs outline-none focus:border-primary/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">
                  Description (Optional)
                </label>
                <textarea
                  placeholder="e.g. Chapter 4 quiz deck covering organelle functions"
                  value={bankDesc}
                  onChange={(e) => setBankDesc(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-medium border border-border bg-surface text-text-primary text-xs outline-none focus:border-primary/50 resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSaveModal(false)}
                  disabled={saving}
                  className="flex-1 py-2 bg-surface-secondary border border-border rounded-medium text-text-secondary hover:text-text-primary font-bold text-xs transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 bg-primary hover:bg-primary-hover rounded-medium text-white font-bold text-xs flex items-center justify-center gap-1.5 transition duration-200"
                >
                  {saving ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <FolderPlus className="w-3.5 h-3.5" />
                  )}
                  {saving ? 'Saving...' : 'Save Deck'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
