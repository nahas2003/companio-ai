'use client'

import * as React from 'react'
import { useAuthStore } from '@/features/auth/store/authStore'
import { getSupabaseClient } from '@/lib/supabase'
import { createSourceRecord } from '../../../../app/actions/sources'
import { UploadCloud, AlertCircle, RefreshCw } from 'lucide-react'

interface UploadZoneProps {
  onUploadSuccess: () => void
}

export function UploadZone({ onUploadSuccess }: UploadZoneProps) {
  const { session, user } = useAuthStore()
  const [dragActive, setDragActive] = React.useState(false)
  const [uploading, setUploading] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [error, setError] = React.useState<string | null>(null)

  const allowedExtensions = ['pdf', 'docx', 'txt', 'md']
  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/markdown',
  ]
  const maxFileSize = 10 * 1024 * 1024

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0])
    }
  }

  const handleFiles = async (file: File) => {
    if (!session || !user) return
    setError(null)

    if (file.size > maxFileSize) {
      setError('File exceeds the maximum size limit of 10MB.')
      return
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    if (!allowedExtensions.includes(ext) && !allowedMimeTypes.includes(file.type)) {
      setError('Unsupported file format. Please upload PDF, DOCX, TXT, or MD documents.')
      return
    }

    try {
      setUploading(true)
      setProgress(10)
      const supabase = getSupabaseClient()

      const fileId = crypto.randomUUID()
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
      const fileKey = `sources/${user.id}/${fileId}-${sanitizedName}`

      setProgress(30)

      const { error: uploadErr } = await supabase.storage.from('sources').upload(fileKey, file, {
        cacheControl: '3600',
        upsert: false,
      })

      if (uploadErr) {
        throw uploadErr
      }

      setProgress(70)

      const result = await createSourceRecord(session.access_token, {
        fileName: file.name,
        fileKey: fileKey,
        fileSize: file.size,
        fileType: ext,
      })

      if (!result.success) {
        await supabase.storage.from('sources').remove([fileKey])
        throw new Error(result.error || 'Failed to save file metadata.')
      }

      setProgress(100)
      setTimeout(() => {
        setUploading(false)
        setProgress(0)
        onUploadSuccess()
      }, 500)
    } catch (err: any) {
      console.error('Upload failed:', err)
      setError(err.message || 'An unexpected error occurred during upload.')
      setUploading(false)
      setProgress(0)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center transition duration-300 min-h-[220px] relative overflow-hidden ${
          dragActive
            ? 'border-blue-500 bg-blue-500/5'
            : uploading
              ? 'border-slate-800 bg-slate-900/20 cursor-not-allowed'
              : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
        }`}
      >
        <input
          type="file"
          id="file-upload"
          disabled={uploading}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        {uploading ? (
          <div className="space-y-4 w-full max-w-xs relative z-10 flex flex-col items-center">
            <RefreshCw className="w-10 h-10 text-blue-400 animate-spin" />
            <div className="space-y-1.5 w-full text-center">
              <span className="font-semibold text-sm text-slate-200">
                Uploading learning source...
              </span>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-600 to-violet-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 block font-semibold">
                {progress}% completed
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-3 relative z-10 flex flex-col items-center">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-slate-400 group-hover:text-white transition duration-300">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-slate-200">
                Drag & drop your files here, or click to browse
              </p>
              <p className="text-xs text-slate-500">Supports PDF, DOCX, TXT, or MD (Max 10MB)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
