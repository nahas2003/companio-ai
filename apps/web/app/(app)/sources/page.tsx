'use client'

import * as React from 'react'
import { useAuthStore } from '@/features/auth/store/authStore'
import { UploadZone } from '@/features/sources/components/UploadZone'
import { SourceList } from '@/features/sources/components/SourceList'
import { getSources } from '../../actions/sources'
import type { Source } from '@/features/sources/types/source.types'
import { RefreshCw } from 'lucide-react'

export default function SourcesPage() {
  const { session } = useAuthStore()
  const [sources, setSources] = React.useState<Source[]>([])
  const [loading, setLoading] = React.useState(true)

  const loadSourcesList = React.useCallback(async () => {
    if (!session) return
    try {
      setLoading(true)
      const res = await getSources(session.access_token)
      if (res.success && res.sources) {
        setSources(res.sources as unknown as Source[])
      } else {
        console.error('Failed to load sources:', res.error)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [session])

  React.useEffect(() => {
    loadSourcesList()
  }, [loadSourcesList])

  return (
    <div className="space-y-8 text-white text-left animate-fade-in">
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Study Material Ingestion</h1>
        <p className="text-slate-400 text-sm font-medium mt-1">
          Upload and manage lecture notes, textbook chapters, or slides. Once ingested, you can
          generate practice decks and assessments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div>
          <UploadZone onUploadSuccess={loadSourcesList} />
        </div>

        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md gap-3 min-h-[300px] text-slate-400">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
              <span className="text-sm font-semibold tracking-wide animate-pulse">
                Loading documents...
              </span>
            </div>
          ) : (
            <SourceList sources={sources} onRefresh={loadSourcesList} />
          )}
        </div>
      </div>
    </div>
  )
}
