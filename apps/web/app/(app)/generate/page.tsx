'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/features/auth/store/authStore'
import { getSources } from '../../actions/sources'
import { generateQuestionsAction } from '../../actions/generation'
import type { Source } from '@/features/sources/types/source.types'
import type {
  Difficulty,
  QuestionType,
  GeneratedQuestion,
} from '@/features/ai/types/questions.types'
import {
  Sparkles,
  RefreshCw,
  BookOpen,
  HelpCircle,
  Award,
  Layers,
  ChevronRight,
  Eye,
  EyeOff,
  AlertCircle,
  Play,
  RotateCcw,
} from 'lucide-react'
import { Button } from '@companio/ui'

export default function GenerateQuestionsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
          <span className="text-sm font-semibold tracking-wide animate-pulse">
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
    <div className="space-y-8 text-white text-left animate-fade-in max-w-5xl mx-auto pb-12">
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
          <Sparkles className="w-8 h-8 text-blue-400" /> AI Practice Generator
        </h1>
        <p className="text-slate-400 text-sm font-medium mt-1">
          Select any processed source document to create customized practice sheets instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Form Option Panel */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md space-y-6">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" /> Configuration
          </h2>

          <form onSubmit={handleGenerate} className="space-y-5">
            {/* Select Material */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-slate-400" /> 1. Select Material
              </label>
              {loadingSources ? (
                <div className="h-10 flex items-center px-3 bg-white/5 border border-white/10 rounded-xl">
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-500 mr-2" />
                  <span className="text-xs text-slate-500 font-medium">Loading catalog...</span>
                </div>
              ) : sources.length === 0 ? (
                <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl text-xs text-red-300">
                  No processed materials found. Upload files in Study Materials first.
                </div>
              ) : (
                <select
                  value={selectedSourceId}
                  onChange={(e) => setSelectedSourceId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900 text-white text-sm outline-none focus:border-blue-500/50"
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
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-slate-400" /> 2. Question Format
              </label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value as QuestionType)}
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900 text-white text-sm outline-none focus:border-blue-500/50"
              >
                <option value="MULTIPLE_CHOICE">Multiple Choice Quiz</option>
                <option value="TRUE_FALSE">True / False</option>
                <option value="SHORT_ANSWER">Short Answers</option>
              </select>
            </div>

            {/* Difficulty Cards */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                <Award className="w-4 h-4 text-slate-400" /> 3. Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['EASY', 'MEDIUM', 'HARD'] as const).map((level) => {
                  const isSelected = difficulty === level
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setDifficulty(level)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all duration-300 ${
                        isSelected
                          ? 'bg-blue-600/20 text-blue-400 border-blue-500/40 shadow-lg'
                          : 'bg-white/5 text-slate-400 border-white/5 hover:border-white/10'
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
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                  4. Questions Count
                </label>
                <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full">
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
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                <span>3</span>
                <span>9</span>
                <span>15</span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={generating || sources.length === 0}
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold flex items-center justify-center gap-2"
            >
              {generating ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {generating ? 'Generating...' : 'Generate Deck'}
            </Button>
          </form>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-2 space-y-6">
          {generating ? (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-12 backdrop-blur-md flex flex-col items-center justify-center gap-4 text-center min-h-[400px]">
              <RefreshCw className="w-10 h-10 text-blue-500 animate-spin" />
              <div className="space-y-1.5">
                <h3 className="font-bold text-lg text-white">AI Content Processing</h3>
                <p className="text-xs text-slate-400 font-medium animate-pulse">{generationStep}</p>
              </div>
            </div>
          ) : errorMsg ? (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md space-y-5 min-h-[300px] flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div className="space-y-2 max-w-md">
                <h3 className="font-bold text-lg text-white">Generation Failed</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Reason: {errorMsg}</p>
              </div>
              <Button
                onClick={() => handleGenerate()}
                className="bg-red-600 hover:bg-red-500 text-white font-semibold flex items-center gap-2 h-10 px-6 text-sm"
              >
                <RotateCcw className="w-4 h-4" /> Retry Generation
              </Button>
            </div>
          ) : generatedQuestions.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-12 backdrop-blur-md flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-500">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h3 className="font-bold text-lg text-white">Interactive Practice Deck</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Configure the panel on the left and generate a quiz deck from your document text
                  block.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  ✨ Generated Practice Deck ({generatedQuestions.length} items)
                </h2>
                <span className="text-xs font-bold text-slate-400 bg-white/5 border border-white/5 px-3 py-1 rounded-full uppercase tracking-wider">
                  {questionType.replace('_', ' ')}
                </span>
              </div>

              <div className="flex flex-col gap-4">
                {generatedQuestions.map((q, idx) => {
                  const revealed = !!revealedAnswers[idx]

                  return (
                    <div
                      key={idx}
                      className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4 text-left transition hover:border-white/10"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <h3 className="font-bold text-slate-200 leading-relaxed flex-1">
                          {q.title}
                        </h3>
                      </div>

                      {/* Render MCQ or True/False options list */}
                      {q.options && q.options.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pl-9">
                          {q.options.map((option, optIdx) => {
                            const isCorrect = q.correctAnswer === optIdx
                            return (
                              <div
                                key={optIdx}
                                className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition duration-200 ${
                                  revealed && isCorrect
                                    ? 'bg-teal-500/10 border-teal-500/30 text-teal-300'
                                    : revealed
                                      ? 'bg-slate-800/40 border-white/5 text-slate-400'
                                      : 'bg-slate-900 border-white/5 text-slate-300'
                                }`}
                              >
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mr-1.5">
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
                        <div className="ml-9 p-4 rounded-xl border border-teal-500/20 bg-teal-500/5 text-teal-300 text-xs leading-relaxed">
                          <span className="font-bold block text-[10px] uppercase tracking-wider text-teal-400 mb-1">
                            Model Answer:
                          </span>
                          {q.modelAnswer}
                        </div>
                      )}

                      <div className="pl-9 flex items-center justify-end">
                        <button
                          onClick={() => toggleAnswer(idx)}
                          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition"
                        >
                          {revealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
    </div>
  )
}
