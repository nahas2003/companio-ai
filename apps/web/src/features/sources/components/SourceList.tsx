'use client'

import * as React from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/features/auth/store/authStore'
import { renameSource, deleteSource, processDocument } from '../../../../app/actions/sources'
import type { Source } from '../types/source.types'
import {
  FileText,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  HardDrive,
  Check,
  X,
  Play,
  RotateCcw,
} from 'lucide-react'
import { Button } from '@companio/ui'

interface SourceListProps {
  sources: Source[]
  onRefresh: () => void
}

export function SourceList({ sources, onRefresh }: SourceListProps) {
  const { session } = useAuthStore()
  const [search, setSearch] = React.useState('')
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editName, setEditName] = React.useState('')
  const [deletingId, setDeletingId] = React.useState<string | null>(null)
  const [processingAction, setProcessingAction] = React.useState(false)
  const [localProcessingId, setLocalProcessingId] = React.useState<string | null>(null)

  const filteredSources = React.useMemo(() => {
    return sources.filter((s) => s.fileName.toLowerCase().includes(search.toLowerCase()))
  }, [sources, search])

  const getStatusBadge = (status: Source['status'], itemId: string) => {
    const isProcessing = status === 'PROCESSING' || localProcessingId === itemId

    if (isProcessing) {
      return (
        <span className="flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold text-primary bg-primary/10 border border-primary/20 rounded-pill uppercase tracking-wider animate-pulse">
          <Clock className="w-3 h-3 animate-spin" /> Ingestion
        </span>
      )
    }

    switch (status) {
      case 'COMPLETED':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold text-success bg-success/10 border border-success/20 rounded-pill uppercase tracking-wider">
            <CheckCircle className="w-3 h-3" /> Ready
          </span>
        )
      case 'FAILED':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold text-danger bg-danger/10 border border-danger/20 rounded-pill uppercase tracking-wider">
            <AlertCircle className="w-3 h-3" /> Failed
          </span>
        )
      default:
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold text-text-secondary bg-surface-secondary border border-border rounded-pill uppercase tracking-wider">
            <Clock className="w-3 h-3" /> Idle
          </span>
        )
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    const kb = bytes / 1024
    if (kb < 1024) return `${kb.toFixed(1)} KB`
    const mb = kb / 1024
    return `${mb.toFixed(1)} MB`
  }

  const handleStartRename = (id: string, name: string) => {
    setEditingId(id)
    setEditName(name)
  }

  const handleSaveRename = async (id: string) => {
    if (!session || !editName.trim()) return
    try {
      setProcessingAction(true)
      const res = await renameSource(session.access_token, id, editName.trim())
      if (res.success) {
        setEditingId(null)
        onRefresh()
      } else {
        alert(res.error || 'Failed to rename file.')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setProcessingAction(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!session) return
    try {
      setProcessingAction(true)
      const res = await deleteSource(session.access_token, id)
      if (res.success) {
        setDeletingId(null)
        onRefresh()
      } else {
        alert(res.error || 'Failed to delete file.')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setProcessingAction(false)
    }
  }

  const handleProcess = async (id: string) => {
    if (!session) return
    try {
      setLocalProcessingId(id)
      const res = await processDocument(session.access_token, id)
      if (!res.success) {
        alert(res.error || 'Failed to process document.')
      }
      onRefresh()
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'An error occurred during extraction.')
    } finally {
      setLocalProcessingId(null)
    }
  }

  if (sources.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-large p-8 shadow-sm flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
        <div className="w-16 h-16 rounded-medium bg-surface-secondary border border-border flex items-center justify-center text-text-secondary">
          <HardDrive className="w-8 h-8" />
        </div>
        <div className="space-y-1.5 max-w-sm">
          <h3 className="font-bold text-base text-text-primary">No learning materials</h3>
          <p className="text-text-secondary text-xs leading-relaxed">
            Your document catalog is empty. Upload your study resources in the drop zone to start
            managing.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface border border-border rounded-large p-5 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-base font-bold flex items-center gap-2 text-text-primary">
          📂 Learning Materials
        </h2>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-secondary/60" />
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-medium bg-surface border border-border text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary/50 transition duration-300"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {filteredSources.length === 0 ? (
          <div className="text-center text-xs text-text-secondary py-8">
            No files match your search criteria.
          </div>
        ) : (
          filteredSources.map((item) => {
            const isProcessing = item.status === 'PROCESSING' || localProcessingId === item.id

            return (
              <div
                key={item.id}
                className="flex flex-col p-4 rounded-medium bg-surface border border-border/60 hover:border-primary/20 hover:shadow-soft transition-all duration-300 gap-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div className="p-2.5 rounded-medium bg-primary/10 border border-primary/20 text-primary flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>

                    <div className="min-w-0 flex-1 space-y-0.5 text-left">
                      {editingId === item.id ? (
                        <div className="flex items-center gap-2 max-w-md">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            disabled={processingAction}
                            className="bg-surface border border-primary text-text-primary text-xs rounded-medium px-2.5 py-1.5 focus:outline-none flex-1 min-w-0"
                          />
                          <button
                            onClick={() => handleSaveRename(item.id)}
                            disabled={processingAction}
                            className="p-1.5 bg-primary hover:bg-primary-hover rounded-medium text-white disabled:opacity-50 transition"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            disabled={processingAction}
                            className="p-1.5 bg-surface-secondary hover:bg-border rounded-medium text-text-secondary transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-xs text-text-primary truncate max-w-sm">
                            {item.fileName}
                          </h3>
                          {!isProcessing && (
                            <button
                              onClick={() => handleStartRename(item.id, item.fileName)}
                              className="text-text-secondary hover:text-text-primary transition duration-200 flex-shrink-0 p-1"
                              title="Rename file"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-2.5 text-[10px] text-text-secondary font-semibold flex-wrap">
                        <span>{item.fileType.toUpperCase()}</span>
                        <span>•</span>
                        <span>{formatSize(item.fileSize)}</span>
                        <span>•</span>
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        {item.status === 'COMPLETED' && (
                          <>
                            <span>•</span>
                            <span className="text-success font-bold">
                              {item.wordCount?.toLocaleString() || 0} words
                            </span>
                            {item.pageCount && (
                              <>
                                <span>•</span>
                                <span className="text-violet-500 font-bold">
                                  {item.pageCount} pages
                                </span>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 justify-between sm:justify-end flex-shrink-0">
                    {getStatusBadge(item.status, item.id)}

                    {!isProcessing && item.status === 'COMPLETED' && (
                      <Link
                        href={`/generate?sourceId=${item.id}`}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-medium bg-success/15 hover:bg-success text-success hover:text-white border border-success/20 hover:border-transparent text-[10px] font-bold transition duration-200"
                      >
                        <Play className="w-3 h-3" /> Generate Quiz
                      </Link>
                    )}

                    {!isProcessing && item.status === 'PENDING' && (
                      <button
                        onClick={() => handleProcess(item.id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-medium bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 hover:border-transparent text-[10px] font-bold transition duration-200"
                      >
                        <Play className="w-3 h-3" /> Process
                      </button>
                    )}

                    {!isProcessing && item.status === 'FAILED' && (
                      <button
                        onClick={() => handleProcess(item.id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-medium bg-danger/15 hover:bg-danger text-danger hover:text-white border border-danger/20 hover:border-transparent text-[10px] font-bold transition duration-200"
                      >
                        <RotateCcw className="w-3 h-3" /> Retry
                      </button>
                    )}

                    {!isProcessing && (
                      <>
                        {deletingId === item.id ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleDelete(item.id)}
                              disabled={processingAction}
                              className="px-2.5 py-1 bg-danger hover:bg-danger-hover rounded-medium text-white font-bold text-[10px] transition"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeletingId(null)}
                              disabled={processingAction}
                              className="px-2.5 py-1 bg-surface-secondary hover:bg-border rounded-medium text-text-secondary font-bold text-[10px] transition"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeletingId(item.id)}
                            className="p-1.5 bg-surface hover:bg-danger/10 border border-border hover:border-danger/20 text-text-secondary hover:text-danger rounded-medium transition duration-200"
                            title="Delete file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {item.status === 'FAILED' && item.errorMsg && (
                  <div className="flex items-start gap-2 p-3 rounded-medium border border-danger/20 bg-danger/5 text-danger text-[10px] text-left">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-danger" />
                    <span className="leading-relaxed">Error log: {item.errorMsg}</span>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
