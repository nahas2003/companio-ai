'use client'

import * as React from 'react'
import { useAuthStore } from '@/features/auth/store/authStore'
import { StatsGrid } from '@/features/dashboard/components/StatsGrid'
import { QuickActions } from '@/features/dashboard/components/QuickActions'
import { ActivityFeed } from '@/features/dashboard/components/ActivityFeed'
import { getDashboardDataAction } from '../../actions/dashboard'
import type { DashboardStats, ActivityItem } from '@/features/dashboard/types/dashboard.types'
import { Calendar } from 'lucide-react'

export default function DashboardPage() {
  const { user, session } = useAuthStore()
  const [loading, setLoading] = React.useState(true)
  const [stats, setStats] = React.useState<DashboardStats | null>(null)
  const [activities, setActivities] = React.useState<ActivityItem[]>([])

  React.useEffect(() => {
    async function loadDashboardData() {
      if (!session) return
      try {
        setLoading(true)
        const res = await getDashboardDataAction(session.access_token)
        if (res.success && res.stats && res.activities) {
          setStats(res.stats)
          setActivities(res.activities)
        }
      } catch (error) {
        console.error('Failed to load dashboard statistics:', error)
      } finally {
        setLoading(false)
      }
    }
    loadDashboardData()
  }, [session])

  const greeting = React.useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }, [])

  const formattedDate = React.useMemo(() => {
    return new Date().toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    })
  }, [])

  if (loading || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-slate-400">
        <div className="w-10 h-10 rounded-full border-2 border-slate-700 border-t-blue-500 animate-spin" />
        <p className="text-sm font-semibold tracking-wide animate-pulse">Loading study desk...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 text-white text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">
            {greeting},{' '}
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              {user?.user_metadata?.displayName || user?.email?.split('@')[0]}
            </span>
            !
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            Ready to continue your assessment preparations?
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-slate-400 text-xs font-semibold self-start md:self-auto">
          <Calendar className="w-4 h-4 text-slate-500" /> {formattedDate}
        </div>
      </div>

      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ActivityFeed activities={activities} />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
