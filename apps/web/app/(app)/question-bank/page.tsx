'use client'

import * as React from 'react'
import { useAuthStore } from '@/features/auth/store/authStore'
import {
  getQuestionsAction,
  updateQuestionAction,
  toggleArchiveQuestionAction,
  softDeleteQuestionAction,
  bulkActionQuestionsAction,
} from '../../actions/questionBank'
import {
  Search,
  BookOpen,
  HelpCircle,
  Award,
  Archive,
  Trash2,
  Edit2,
  FolderOpen,
  RefreshCw,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  Inbox,
  AlertTriangle,
} from 'lucide-react'

export default function QuestionBankPage() {
  const { session } = useAuthStore()

  // Data states
  const [questions, setQuestions] = React.useState<any[]>([])
  const [totalCount, setTotalCount] = React.useState(0)
  const [sources, setSources] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  // Filters & Pagination
  const [search, setSearch] = React.useState('')
  const [selectedSourceId, setSelectedSourceId] = React.useState('ALL')
  const [selectedType, setSelectedType] = React.useState('ALL')
  const [selectedDifficulty, setSelectedDifficulty] = React.useState('ALL')
  const [statusTab, setStatusTab] = React.useState<'active' | 'archived'>('active')
  const [page, setPage] = React.useState(1)
  const limit = 8

  // Bulk actions selection
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])

  // Modal editing States
  const [editingQuestion, setEditingQuestion] = React.useState<any | null>(null)
  const [editTitle, setEditTitle] = React.useState('')
  const [editOptions, setEditOptions] = React.useState<string[]>([])
  const [editCorrectAnswer, setEditCorrectAnswer] = React.useState(0)
  const [editModelAnswer, setEditModelAnswer] = React.useState('')
  const [savingEdit, setSavingEdit] = React.useState(false)

  const loadQuestions = React.useCallback(async () => {
    if (!session) return
    try {
      setLoading(true)
      const res = await getQuestionsAction(session.access_token, {
        search: search.trim() || undefined,
        type: selectedType,
        difficulty: selectedDifficulty,
        sourceId: selectedSourceId,
        status: statusTab,
        page,
        limit,
      })

      if (res.success && res.questions) {
        setQuestions(res.questions)
        setTotalCount(res.totalCount || 0)
        setSources(res.sources || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [session, search, selectedType, selectedDifficulty, selectedSourceId, statusTab, page])

  React.useEffect(() => {
    loadQuestions()
    setSelectedIds([])
  }, [loadQuestions])

  // Clear page count index offset when filters update
  React.useEffect(() => {
    setPage(1)
  }, [search, selectedType, selectedDifficulty, selectedSourceId, statusTab])

  // Select all checkbox handler
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(questions.map((q) => q.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id])
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id))
    }
  }

  // Question editing trigger
  const handleStartEdit = (question: any) => {
    setEditingQuestion(question)
    setEditTitle(question.title)
    setEditOptions(question.options || [])
    setEditCorrectAnswer(question.correctAnswer || 0)
    setEditModelAnswer(question.modelAnswer || '')
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session || !editingQuestion) return

    try {
      setSavingEdit(true)
      const res = await updateQuestionAction(session.access_token, editingQuestion.id, {
        title: editTitle.trim(),
        options: editOptions,
        correctAnswer: editCorrectAnswer,
        modelAnswer: editModelAnswer.trim(),
      })

      if (res.success) {
        setEditingQuestion(null)
        loadQuestions()
      } else {
        alert(res.error || 'Failed to update question.')
      }
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'An error occurred while updating.')
    } finally {
      setSavingEdit(false)
    }
  }

  // Single Action handlers
  const handleToggleArchive = async (id: string, currentArchived: boolean) => {
    if (!session) return
    try {
      const res = await toggleArchiveQuestionAction(session.access_token, id, !currentArchived)
      if (res.success) {
        loadQuestions()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteOne = async (id: string) => {
    if (!session || !confirm('Are you sure you want to delete this question?')) return
    try {
      const res = await softDeleteQuestionAction(session.access_token, id)
      if (res.success) {
        loadQuestions()
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Bulk actions handlers
  const handleBulkAction = async (action: 'archive' | 'restore' | 'delete') => {
    if (!session || selectedIds.length === 0) return

    const label = action === 'delete' ? 'delete' : action === 'archive' ? 'archive' : 'restore'

    if (!confirm(`Are you sure you want to ${label} ${selectedIds.length} questions?`)) return

    try {
      const res = await bulkActionQuestionsAction(session.access_token, selectedIds, action)
      if (res.success) {
        setSelectedIds([])
        loadQuestions()
      } else {
        alert(res.error || 'Bulk action failed.')
      }
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'An error occurred during bulk update.')
    }
  }

  const totalPages = Math.ceil(totalCount / limit)

  return (
    <div className="space-y-8 text-white text-left animate-fade-in max-w-7xl mx-auto pb-12">
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
          <FolderOpen className="w-8 h-8 text-violet-400" /> Question Repository Bank
        </h1>
        <p className="text-slate-400 text-sm font-medium mt-1">
          Search, filter, edit, archive, and manage all validated study questions.
        </p>
      </div>

      {/* Tabs for Active vs Archived */}
      <div className="flex border-b border-white/10 gap-6">
        <button
          onClick={() => setStatusTab('active')}
          className={`pb-3 text-sm font-bold tracking-wide uppercase transition ${
            statusTab === 'active'
              ? 'text-blue-400 border-b-2 border-blue-500'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Active Bank
        </button>
        <button
          onClick={() => setStatusTab('archived')}
          className={`pb-3 text-sm font-bold tracking-wide uppercase transition ${
            statusTab === 'archived'
              ? 'text-violet-400 border-b-2 border-violet-500'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Archived Shelf
        </button>
      </div>

      {/* Filter Options Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* Source Filter */}
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <select
            value={selectedSourceId}
            onChange={(e) => setSelectedSourceId(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-white/10 text-white outline-none focus:border-blue-500"
          >
            <option value="ALL">All Materials</option>
            {sources.map((s) => (
              <option key={s.id} value={s.id}>
                {s.fileName}
              </option>
            ))}
          </select>
        </div>

        {/* Format Type Filter */}
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-white/10 text-white outline-none focus:border-blue-500"
          >
            <option value="ALL">All Formats</option>
            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
            <option value="TRUE_FALSE">True / False</option>
            <option value="SHORT_ANSWER">Short Answers</option>
          </select>
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-white/10 text-white outline-none focus:border-blue-500"
          >
            <option value="ALL">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>
      </div>

      {/* Bulk action toolbar */}
      {selectedIds.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl gap-3 animate-in slide-in-from-top-4 duration-300">
          <div className="text-sm font-semibold text-blue-300">
            Selected <span className="text-white font-bold">{selectedIds.length}</span> questions
          </div>
          <div className="flex items-center gap-3">
            {statusTab === 'active' ? (
              <button
                onClick={() => handleBulkAction('archive')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-violet-600 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition"
              >
                <Archive className="w-3.5 h-3.5" /> Bulk Archive
              </button>
            ) : (
              <button
                onClick={() => handleBulkAction('restore')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-teal-600 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Bulk Restore
              </button>
            )}
            <button
              onClick={() => handleBulkAction('delete')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-950/30 hover:bg-red-600 border border-red-500/20 hover:border-transparent text-red-400 hover:text-white text-xs font-semibold transition"
            >
              <Trash2 className="w-3.5 h-3.5" /> Bulk Delete
            </button>
          </div>
        </div>
      )}

      {/* Table / List catalog */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md gap-3 min-h-[300px] text-slate-400">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="text-sm font-semibold tracking-wide animate-pulse">
            Loading question records...
          </span>
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-12 backdrop-blur-md flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-500">
            <Inbox className="w-8 h-8" />
          </div>
          <div className="space-y-1.5 max-w-sm">
            <h3 className="font-bold text-lg text-white">Repository is empty</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              No questions found matching your filter criteria. Go to Practice Generator to create
              some.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="p-4 w-12 text-center">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedIds.length === questions.length}
                      className="rounded bg-slate-900 border-white/10 text-blue-500 focus:ring-0 cursor-pointer"
                    />
                  </th>
                  <th className="p-4">Question detail</th>
                  <th className="p-4 w-28">Format</th>
                  <th className="p-4 w-24">Difficulty</th>
                  <th className="p-4 w-40">Source material</th>
                  <th className="p-4 w-28 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {questions.map((q) => {
                  const isChecked = selectedIds.includes(q.id)

                  return (
                    <tr
                      key={q.id}
                      className={`hover:bg-white/5 transition duration-150 ${
                        isChecked ? 'bg-blue-600/5' : ''
                      }`}
                    >
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handleSelectOne(q.id, e.target.checked)}
                          className="rounded bg-slate-900 border-white/10 text-blue-500 focus:ring-0 cursor-pointer"
                        />
                      </td>
                      <td className="p-4 font-semibold text-slate-200 max-w-md">
                        <div className="truncate">{q.title}</div>
                        {q.options && q.options.length > 0 && (
                          <div className="text-[10px] text-slate-500 mt-1 font-medium truncate">
                            Choices: {q.options.join(' | ')}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-slate-800 text-slate-400 border border-slate-700">
                          {q.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border ${
                            q.difficulty === 'HARD'
                              ? 'bg-red-500/10 text-red-400 border-red-500/20'
                              : q.difficulty === 'MEDIUM'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                : 'bg-teal-500/10 text-teal-400 border-teal-500/20'
                          }`}
                        >
                          {q.difficulty}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-slate-400 font-medium max-w-[150px] truncate">
                        {q.sourceName}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleStartEdit(q)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-blue-600 border border-white/5 text-slate-400 hover:text-white transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleArchive(q.id, q.archived)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-violet-600 border border-white/5 text-slate-400 hover:text-white transition"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteOne(q.id)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-red-600 border border-white/5 text-slate-400 hover:text-red-400 hover:border-transparent transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination bar */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 font-bold">
                Showing {questions.length} of {totalCount} questions
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-50 text-white transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-slate-300">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-50 text-white transition cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit modal popup */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-xl w-full space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                <Edit2 className="w-5 h-5 text-blue-400" /> Edit Question Details
              </h3>
              <button
                onClick={() => setEditingQuestion(null)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSaveEdit}
              className="space-y-4 text-left max-h-[75vh] overflow-y-auto pr-1"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                  Question text
                </label>
                <textarea
                  required
                  rows={2}
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-950 text-white text-sm outline-none focus:border-blue-500/50 resize-none"
                />
              </div>

              {/* Render option list editing fields if MCQ or TF */}
              {editOptions && editOptions.length > 0 && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block">
                    Answer options Choices
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {editOptions.map((opt, idx) => (
                      <div key={idx} className="space-y-1">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">
                          Choice {String.fromCharCode(65 + idx)}
                        </span>
                        <input
                          type="text"
                          required
                          value={opt}
                          onChange={(e) => {
                            const newOptions = [...editOptions]
                            newOptions[idx] = e.target.value
                            setEditOptions(newOptions)
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-white/5 bg-slate-950 text-white text-xs outline-none focus:border-blue-500/50"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block">
                      Correct Answer Selection
                    </label>
                    <select
                      value={editCorrectAnswer}
                      onChange={(e) => setEditCorrectAnswer(parseInt(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-950 text-white text-sm outline-none focus:border-blue-500/50"
                    >
                      {editOptions.map((_, idx) => (
                        <option key={idx} value={idx}>
                          Choice {String.fromCharCode(65 + idx)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Render model answer editing text block if short answer */}
              {editingQuestion.type === 'SHORT_ANSWER' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                    Model answer key
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={editModelAnswer}
                    onChange={(e) => setEditModelAnswer(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-950 text-white text-sm outline-none focus:border-blue-500/50 resize-none"
                  />
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingQuestion(null)}
                  disabled={savingEdit}
                  className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white font-semibold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-semibold text-xs flex items-center justify-center gap-2 transition"
                >
                  {savingEdit ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
