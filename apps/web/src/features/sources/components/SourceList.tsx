'use client'

import * as React from 'react'
import { useAuthStore } from '@/features/auth/store/authStore'
import { renameSource, deleteSource } from '../../../../app/actions/sources'
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
} from 'lucide-react'

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

  const filteredSources = React.useMemo(() => {
    return sources.filter((s) => s.fileName.toLowerCase().includes(search.toLowerCase()))
  }, [sources, search])

  const getStatusBadge = (status: Source['status']) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
            <CheckCircle className="w-3 h-3" /> Ready
          </span>
        )
      case 'PROCESSING':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
            <Clock className="w-3 h-3 animate-spin" /> Ingestion
          </span>
        )
      case 'FAILED':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
            <AlertCircle className="w-3 h-3" /> Failed
          </span>
        )
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-500/10 border border-slate-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
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

  if (sources.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-500">
          <HardDrive className="w-8 h-8" />
        </div>
        <div className="space-y-1.5 max-w-sm">
          <h3 className="font-bold text-lg text-white">No learning materials</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Your document catalog is empty. Upload your study resources in the drop zone above to
            start managing.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold flex items-center gap-2">📂 Learning Materials</h2>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition duration-300"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {filteredSources.length === 0 ? (
          <div className="text-center text-sm text-slate-500 py-8">
            No files match your search criteria.
          </div>
        ) : (
          filteredSources.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/15 transition-all duration-300 gap-4"
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex-shrink-0">
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
                        className="bg-slate-950 border border-blue-500 text-white text-sm rounded-lg px-2.5 py-1.5 focus:outline-none flex-1 min-w-0"
                      />
                      <button
                        onClick={() => handleSaveRename(item.id)}
                        disabled={processingAction}
                        className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white disabled:opacity-50 transition"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        disabled={processingAction}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-slate-200 truncate max-w-sm">
                        {item.fileName}
                      </h3>
                      <button
                        onClick={() => handleStartRename(item.id, item.fileName)}
                        className="text-slate-500 hover:text-white transition duration-300 flex-shrink-0"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-semibold">
                    <span>{item.fileType.toUpperCase()}</span>
                    <span>•</span>
                    <span>{formatSize(item.fileSize)}</span>
                    <span>•</span>
                    <span>Uploaded {new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 justify-between sm:justify-end flex-shrink-0">
                {getStatusBadge(item.status)}

                {deletingId === item.id ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={processingAction}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded-lg text-white font-semibold text-xs transition"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setDeletingId(null)}
                      disabled={processingAction}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white font-semibold text-xs transition"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeletingId(item.id)}
                    className="p-2 bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 text-slate-500 hover:text-red-400 rounded-xl transition duration-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
