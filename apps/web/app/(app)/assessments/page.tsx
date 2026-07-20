'use client'

import * as React from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/features/auth/store/authStore'
import {
  getAssessmentsDashboardAction,
  createAssessmentTemplateAction,
  publishAssessmentAction,
  getAssessmentCreatorReportAction,
} from '../../actions/assessments'
import {
  GraduationCap,
  Plus,
  RefreshCw,
  Clock,
  Award,
  BookOpen,
  Share2,
  Users,
  Eye,
  Check,
  Clipboard,
  X,
  AlertCircle,
} from 'lucide-react'

export default function CreatorAssessmentsPage() {
  const { session } = useAuthStore()

  // State data
  const [loading, setLoading] = React.useState(true)
  const [templates, setTemplates] = React.useState<any[]>([])
  const [questionBanks, setQuestionBanks] = React.useState<any[]>([])
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)

  // Create template modal states
  const [showCreateModal, setShowCreateModal] = React.useState(false)
  const [selectedBankId, setSelectedBankId] = React.useState('')
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [timer, setTimer] = React.useState<number>(30) // default 30 mins
  const [passingScore, setPassingScore] = React.useState<number>(60) // default 60%
  const [shuffleQuestions, setShuffleQuestions] = React.useState(false)
  const [savingTemplate, setSavingTemplate] = React.useState(false)

  // Report modal states
  const [viewingReport, setViewingReport] = React.useState<any | null>(null)
  const [reportLoading, setReportLoading] = React.useState(false)
  const [reportData, setReportData] = React.useState<any[]>([])

  // Copy state mapping
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null)

  const loadDashboard = React.useCallback(async () => {
    if (!session) return
    try {
      setLoading(true)
      const res = await getAssessmentsDashboardAction(session.access_token)
      if (res.success) {
        setTemplates(res.templates || [])
        setQuestionBanks(res.questionBanks || [])
        if (res.questionBanks && res.questionBanks.length > 0) {
          setSelectedBankId(res.questionBanks[0].id)
        }
      } else {
        setErrorMsg(res.error || 'Failed to load assessments dashboard.')
      }
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'An error occurred while loading dashboard.')
    } finally {
      setLoading(false)
    }
  }, [session])

  React.useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session || !selectedBankId || !title.trim()) return

    try {
      setSavingTemplate(true)
      const res = await createAssessmentTemplateAction(session.access_token, {
        questionBankId: selectedBankId,
        title: title.trim(),
        description: description.trim(),
        timer: timer > 0 ? timer : undefined,
        passingScore,
        shuffleQuestions,
      })

      if (res.success) {
        setShowCreateModal(false)
        setTitle('')
        setDescription('')
        loadDashboard()
      } else {
        alert(res.error || 'Failed to create assessment template.')
      }
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'An error occurred while saving template.')
    } finally {
      setSavingTemplate(false)
    }
  }

  const handlePublish = async (templateId: string) => {
    if (!session) return
    try {
      const res = await publishAssessmentAction(session.access_token, templateId)
      if (res.success && res.code) {
        alert(`Assessment published successfully! Code: ${res.code}`)
        loadDashboard()
      } else {
        alert(res.error || 'Failed to publish assessment.')
      }
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'An error occurred while publishing.')
    }
  }

  const handleOpenReport = async (template: any) => {
    if (!session) return
    try {
      setViewingReport(template)
      setReportLoading(true)
      const res = await getAssessmentCreatorReportAction(session.access_token, template.id)
      if (res.success) {
        setReportData(res.attempts || [])
      } else {
        alert(res.error || 'Failed to load participant reports.')
      }
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'An error occurred while loading reports.')
    } finally {
      setReportLoading(false)
    }
  }

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '0s'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[400px] gap-3 text-slate-400">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="text-sm font-semibold tracking-wide animate-pulse">
          Loading assessments room...
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-8 text-white text-left animate-fade-in max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
            <GraduationCap className="w-8 h-8 text-violet-400" /> Assessment Creator
          </h1>
          <p className="text-slate-400 text-sm font-medium mt-1">
            Build, publish, and track code-invitation exam sessions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/assessments/join"
            className="px-4 py-2.5 border border-white/10 hover:bg-white/5 rounded-xl text-xs font-semibold transition"
          >
            Enter Join Code
          </Link>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-semibold transition shadow-lg shadow-violet-500/10"
          >
            <Plus className="w-4 h-4" /> Create Template
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-200">{errorMsg}</div>
        </div>
      )}

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-violet-400" /> Active Assessment Configurations (
            {templates.length})
          </h2>

          {templates.length === 0 ? (
            <div className="p-12 border border-dashed border-white/10 rounded-3xl text-center space-y-3 bg-white/5">
              <p className="text-sm text-slate-400">No assessment configurations created yet.</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="text-xs text-blue-400 hover:text-white font-bold transition"
              >
                Create your first template
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {templates.map((t) => (
                <div
                  key={t.id}
                  className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-white/20 transition duration-200 flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 min-w-0">
                    <h3 className="font-bold text-slate-100 line-clamp-1">{t.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {t.description || 'No description provided.'}
                    </p>
                    <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> {t.questionBankName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />{' '}
                        {t.timer ? `${t.timer} mins` : 'Untimed'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-teal-400" /> Pass: {t.passingScore}%
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-shrink-0">
                    {/* Published codes */}
                    {t.publishedCodes.length > 0 ? (
                      <div className="flex flex-col gap-1.5">
                        {t.publishedCodes.map((p: any) => (
                          <div
                            key={p.id}
                            className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900 border border-white/5"
                          >
                            <span className="text-[10px] text-slate-400 uppercase font-bold">
                              Code:
                            </span>
                            <code className="text-xs font-bold text-violet-400 uppercase">
                              {p.code}
                            </code>
                            <button
                              onClick={() => copyToClipboard(p.code)}
                              className="text-slate-500 hover:text-white transition"
                            >
                              {copiedCode === p.code ? (
                                <Check className="w-3.5 h-3.5 text-teal-400" />
                              ) : (
                                <Clipboard className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <button
                        onClick={() => handlePublish(t.id)}
                        className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition flex items-center gap-1"
                      >
                        <Share2 className="w-3.5 h-3.5" /> Publish
                      </button>
                    )}

                    <button
                      onClick={() => handleOpenReport(t)}
                      className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 hover:text-white text-xs font-bold transition flex items-center gap-1"
                    >
                      <Users className="w-3.5 h-3.5" /> Reports
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Info Sidebar */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-violet-300">
              <Share2 className="w-5 h-5 text-violet-400" /> How to invite students
            </h2>
            <div className="space-y-3 text-xs text-slate-400 leading-relaxed">
              <p>
                1. Click **Create Template** to customize passing percentages, shuffle options, and
                durations.
              </p>
              <p>
                2. Click **Publish** on any template. This locks the configuration snapshot and
                creates a unique code.
              </p>
              <p>3. Share the 6-letter code with your students.</p>
              <p>
                4. Students join via **Join Assessment** (using names/guest status) and attempt the
                quiz. Results appear under **Reports** instantly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CREATE TEMPLATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                <Plus className="w-5 h-5 text-violet-400" /> Configure Assessment
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {questionBanks.length === 0 ? (
              <div className="text-center p-4 text-xs text-slate-400">
                You must have at least 1 Question Bank in your repository to build an assessment.
              </div>
            ) : (
              <form onSubmit={handleCreateTemplate} className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                    Question Bank Source
                  </label>
                  <select
                    value={selectedBankId}
                    onChange={(e) => setSelectedBankId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-950 text-white text-sm outline-none focus:border-violet-500/50"
                  >
                    {questionBanks.map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                    Assessment Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chapter 3 Calculus Exam"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-950 text-white text-sm outline-none focus:border-violet-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                    Description (Optional)
                  </label>
                  <textarea
                    placeholder="Provide exam rules or study notes..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-950 text-white text-sm outline-none focus:border-violet-500/50 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                      Timer limit (Minutes)
                    </label>
                    <input
                      type="number"
                      min={0}
                      placeholder="Untimed"
                      value={timer}
                      onChange={(e) => setTimer(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-950 text-white text-sm outline-none focus:border-violet-500/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                      Passing Score ({passingScore}%)
                    </label>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      step={5}
                      value={passingScore}
                      onChange={(e) => setPassingScore(parseInt(e.target.value))}
                      className="w-full h-10 accent-violet-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="shuffle"
                    checked={shuffleQuestions}
                    onChange={(e) => setShuffleQuestions(e.target.checked)}
                    className="rounded bg-slate-950 border-white/10 text-violet-500 focus:ring-0 cursor-pointer"
                  />
                  <label
                    htmlFor="shuffle"
                    className="text-xs font-bold text-slate-300 cursor-pointer select-none"
                  >
                    Shuffle Question delivery order
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    disabled={savingTemplate}
                    className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white font-semibold text-xs transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingTemplate}
                    className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-xl text-white font-semibold text-xs flex items-center justify-center gap-2 transition"
                  >
                    {savingTemplate ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    {savingTemplate ? 'Saving...' : 'Create Template'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* VIEW REPORT MODAL */}
      {viewingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-3xl w-full space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wide">
                  Template Report
                </span>
                <h3 className="text-lg font-bold text-white line-clamp-1">{viewingReport.title}</h3>
              </div>
              <button
                onClick={() => setViewingReport(null)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reportLoading ? (
              <div className="flex flex-col items-center justify-center p-8 gap-2 text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
                <span className="text-xs font-semibold animate-pulse">
                  Loading attempt statistics...
                </span>
              </div>
            ) : reportData.length === 0 ? (
              <div className="text-center p-8 text-slate-400 text-xs">
                No participant records found for this assessment yet.
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[50vh]">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 font-bold uppercase bg-white/5">
                      <th className="p-3">Participant</th>
                      <th className="p-3 w-24">Invitation Code</th>
                      <th className="p-3 w-20">Score</th>
                      <th className="p-3 w-20">Status</th>
                      <th className="p-3 w-28">Duration</th>
                      <th className="p-3 w-32">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {reportData.map((a) => {
                      const isPass = a.score >= viewingReport.passingScore
                      return (
                        <tr key={a.id} className="hover:bg-white/5">
                          <td className="p-3 font-semibold text-slate-200">{a.participantName}</td>
                          <td className="p-3 font-mono uppercase text-violet-400">{a.code}</td>
                          <td className="p-3">
                            <span
                              className={`font-bold ${isPass ? 'text-teal-400' : 'text-red-400'}`}
                            >
                              {a.score !== null ? `${Math.round(a.score)}%` : 'N/A'}
                            </span>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                a.status === 'COMPLETED'
                                  ? 'bg-teal-500/10 text-teal-400'
                                  : 'bg-amber-500/10 text-amber-400'
                              }`}
                            >
                              {a.status}
                            </span>
                          </td>
                          <td className="p-3 text-slate-400">{formatDuration(a.timeTaken)}</td>
                          <td className="p-3 text-slate-400">
                            {a.completedAt ? new Date(a.completedAt).toLocaleDateString() : '-'}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-white/5">
              <button
                onClick={() => setViewingReport(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold transition"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
