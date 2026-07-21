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
    <div className="space-y-6 text-text-primary text-left animate-fade-in max-w-7xl mx-auto pb-12">
      <div className="border-b border-border pb-5">
        <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2.5">
          <FolderOpen className="w-7 h-7 text-primary" /> Question Repository Bank
        </h1>
        <p className="text-text-secondary text-xs font-semibold mt-1">
          Search, filter, edit, archive, and manage all validated study questions.
        </p>
      </div>

      {/* Tabs for Active vs Archived */}
      <div className="flex border-b border-border gap-6">
        <button
          onClick={() => setStatusTab('active')}
          className={`pb-2.5 text-xs font-bold tracking-wide uppercase transition duration-200 ${
            statusTab === 'active'
              ? 'text-primary border-b-2 border-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Active Bank
        </button>
        <button
          onClick={() => setStatusTab('archived')}
          className={`pb-2.5 text-xs font-bold tracking-wide uppercase transition duration-200 ${
            statusTab === 'archived'
              ? 'text-primary border-b-2 border-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Archived Shelf
        </button>
      </div>

      {/* Filter Options Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-surface border border-border rounded-large p-4 shadow-sm">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-secondary/60" />
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-medium bg-surface border border-border text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary/50 transition duration-200"
          />
        </div>

        {/* Source Filter */}
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-text-secondary/50 flex-shrink-0" />
          <select
            value={selectedSourceId}
            onChange={(e) => setSelectedSourceId(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-medium bg-surface border border-border text-text-primary outline-none focus:border-primary/50"
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
          <HelpCircle className="w-4 h-4 text-text-secondary/50 flex-shrink-0" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-medium bg-surface border border-border text-text-primary outline-none focus:border-primary/50"
          >
            <option value="ALL">All Formats</option>
            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
            <option value="TRUE_FALSE">True / False</option>
            <option value="SHORT_ANSWER">Short Answers</option>
          </select>
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-text-secondary/50 flex-shrink-0" />
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-medium bg-surface border border-border text-text-primary outline-none focus:border-primary/50"
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-primary/10 border border-primary/20 rounded-large gap-3 animate-fade-in">
          <div className="text-xs font-bold text-primary">
            Selected <span className="font-extrabold">{selectedIds.length}</span> questions
          </div>
          <div className="flex items-center gap-3">
            {statusTab === 'active' ? (
              <button
                onClick={() => handleBulkAction('archive')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-medium bg-surface border border-border text-text-secondary hover:text-text-primary text-[10px] font-bold transition duration-200"
              >
                <Archive className="w-3.5 h-3.5" /> Bulk Archive
              </button>
            ) : (
              <button
                onClick={() => handleBulkAction('restore')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-medium bg-surface border border-border text-text-secondary hover:text-text-primary text-[10px] font-bold transition duration-200"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Bulk Restore
              </button>
            )}
            <button
              onClick={() => handleBulkAction('delete')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-medium bg-danger/15 hover:bg-danger text-danger hover:text-white border border-danger/20 hover:border-transparent text-[10px] font-bold transition duration-200"
            >
              <Trash2 className="w-3.5 h-3.5" /> Bulk Delete
            </button>
          </div>
        </div>
      )}

      {/* Table / List catalog */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-surface border border-border rounded-large shadow-sm gap-3 min-h-[300px] text-text-secondary">
          <RefreshCw className="w-7 h-7 text-primary animate-spin" />
          <span className="text-xs font-semibold tracking-wide animate-pulse">
            Loading question records...
          </span>
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-surface border border-border rounded-large p-12 shadow-sm flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
          <div className="w-16 h-16 rounded-medium bg-surface-secondary border border-border flex items-center justify-center text-text-secondary">
            <Inbox className="w-8 h-8" />
          </div>
          <div className="space-y-1.5 max-w-sm">
            <h3 className="font-bold text-base text-text-primary">Repository is empty</h3>
            <p className="text-text-secondary text-xs leading-relaxed font-semibold">
              No questions found matching your filter criteria. Go to Practice Generator to create
              some.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="overflow-x-auto rounded-large border border-border bg-surface shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface-secondary text-[9px] uppercase font-bold text-text-secondary tracking-wider">
                  <th className="p-4 w-12 text-center">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedIds.length === questions.length}
                      className="rounded bg-surface border-border text-primary focus:ring-0 cursor-pointer"
                    />
                  </th>
                  <th className="p-4">Question detail</th>
                  <th className="p-4 w-28">Format</th>
                  <th className="p-4 w-24">Difficulty</th>
                  <th className="p-4 w-40">Source material</th>
                  <th className="p-4 w-28 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs text-text-primary">
                {questions.map((q) => {
                  const isChecked = selectedIds.includes(q.id)

                  return (
                    <tr
                      key={q.id}
                      className={`hover:bg-surface-secondary/40 transition duration-150 ${
                        isChecked ? 'bg-primary/5' : ''
                      }`}
                    >
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handleSelectOne(q.id, e.target.checked)}
                          className="rounded bg-surface border-border text-primary focus:ring-0 cursor-pointer"
                        />
                      </td>
                      <td className="p-4 font-bold text-text-primary max-w-md">
                        <div className="truncate">{q.title}</div>
                        {q.options && q.options.length > 0 && (
                          <div className="text-[10px] text-text-secondary mt-1 font-semibold truncate">
                            Choices: {q.options.join(' | ')}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-pill text-[9px] font-bold tracking-wide uppercase bg-surface-secondary text-text-secondary border border-border">
                          {q.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-pill text-[9px] font-bold tracking-wide uppercase border ${
                            q.difficulty === 'HARD'
                              ? 'bg-danger/10 text-danger border-danger/20'
                              : q.difficulty === 'MEDIUM'
                                ? 'bg-warning/10 text-warning border-warning/20'
                                : 'bg-success/10 text-success border-success/20'
                          }`}
                        >
                          {q.difficulty}
                        </span>
                      </td>
                      <td className="p-4 text-[10px] text-text-secondary font-semibold max-w-[150px] truncate">
                        {q.sourceName}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleStartEdit(q)}
                            className="p-1.5 rounded-medium bg-surface border border-border text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition duration-200"
                            title="Edit question"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleArchive(q.id, q.archived)}
                            className="p-1.5 rounded-medium bg-surface border border-border text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition duration-200"
                            title="Archive question"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteOne(q.id)}
                            className="p-1.5 rounded-medium bg-surface border border-border text-text-secondary hover:bg-danger/10 hover:text-danger hover:border-danger/20 transition duration-200"
                            title="Delete question"
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
              <span className="text-[10px] text-text-secondary font-bold">
                Showing {questions.length} of {totalCount} questions
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-medium bg-surface border border-border disabled:opacity-50 text-text-primary hover:bg-surface-secondary transition duration-200 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-text-secondary">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-medium bg-surface border border-border disabled:opacity-50 text-text-primary hover:bg-surface-secondary transition duration-200 cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface border border-border rounded-large p-5 max-w-xl w-full space-y-4 shadow-soft animate-scale-up text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2 text-text-primary">
                <Edit2 className="w-5 h-5 text-primary" /> Edit Question Details
              </h3>
              <button
                onClick={() => setEditingQuestion(null)}
                className="text-text-secondary hover:text-text-primary transition duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSaveEdit}
              className="space-y-4 text-left max-h-[70vh] overflow-y-auto pr-1"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">
                  Question text
                </label>
                <textarea
                  required
                  rows={2}
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-medium border border-border bg-surface text-text-primary text-xs outline-none focus:border-primary/50 resize-none"
                />
              </div>

              {/* Render option list editing fields if MCQ or TF */}
              {editOptions && editOptions.length > 0 && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wide block">
                    Answer options Choices
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {editOptions.map((opt, idx) => (
                      <div key={idx} className="space-y-1">
                        <span className="text-[9px] text-text-secondary font-bold uppercase">
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
                          className="w-full px-3 py-1.5 rounded-medium border border-border bg-surface text-text-primary text-xs outline-none focus:border-primary/50"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wide block">
                      Correct Answer Selection
                    </label>
                    <select
                      value={editCorrectAnswer}
                      onChange={(e) => setEditCorrectAnswer(parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-medium border border-border bg-surface text-text-primary text-xs outline-none focus:border-primary/50"
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
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">
                    Model answer key
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={editModelAnswer}
                    onChange={(e) => setEditModelAnswer(e.target.value)}
                    className="w-full px-3 py-2 rounded-medium border border-border bg-surface text-text-primary text-xs outline-none focus:border-primary/50 resize-none"
                  />
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingQuestion(null)}
                  disabled={savingEdit}
                  className="flex-1 py-2 bg-surface-secondary border border-border rounded-medium text-text-secondary hover:text-text-primary font-bold text-xs transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="flex-1 py-2 bg-primary hover:bg-primary-hover rounded-medium text-white font-bold text-xs flex items-center justify-center gap-1.5 transition duration-200"
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
