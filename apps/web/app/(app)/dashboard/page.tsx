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
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-text-secondary">
        <div className="w-8 h-8 rounded-full border-2 border-border border-t-primary animate-spin" />
        <p className="text-xs font-semibold tracking-wide animate-pulse">Loading study desk...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 text-text-primary text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-text-primary">
            {greeting},{' '}
            <span className="text-primary">
              {user?.user_metadata?.displayName || user?.email?.split('@')[0]}
            </span>
            !
          </h1>
          <p className="text-text-secondary text-xs font-semibold">
            Ready to continue your assessment preparations?
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-medium bg-surface-secondary border border-border text-text-secondary text-xs font-bold self-start md:self-auto shadow-sm">
          <Calendar className="w-3.5 h-3.5 text-text-secondary/60" /> {formattedDate}
        </div>
      </div>

      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
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
