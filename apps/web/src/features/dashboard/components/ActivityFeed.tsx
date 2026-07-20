'use client'

import * as React from 'react'
import { UploadCloud, GraduationCap, Calendar, Inbox, Compass } from 'lucide-react'
import type { ActivityItem } from '../types/dashboard.types'

interface ActivityFeedProps {
  activities: ActivityItem[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'upload':
        return UploadCloud
      case 'practice':
        return Compass
      case 'assessment':
        return GraduationCap
    }
  }

  const getColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'upload':
        return 'text-primary bg-primary/10 border-primary/20'
      case 'practice':
        return 'text-teal-500 bg-teal-500/10 border-teal-500/20'
      case 'assessment':
        return 'text-violet-500 bg-violet-500/10 border-violet-500/20'
    }
  }

  if (activities.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-large p-8 shadow-sm flex flex-col items-center justify-center text-center space-y-4 min-h-[350px]">
        <div className="w-16 h-16 rounded-medium bg-surface-secondary border border-border flex items-center justify-center text-text-secondary">
          <Inbox className="w-8 h-8" />
        </div>
        <div className="space-y-1.5 max-w-sm">
          <h3 className="font-bold text-base text-text-primary">No activity yet</h3>
          <p className="text-text-secondary text-xs leading-relaxed">
            Get started by uploading your first study guide, lecture notes, or textbook chapters!
          </p>
        </div>
        <a
          href="/sources"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-medium bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-sm transition duration-200"
        >
          <UploadCloud className="w-4 h-4" /> Upload Material
        </a>
      </div>
    )
  }

  return (
    <div className="bg-surface border border-border rounded-large p-5 shadow-sm space-y-5">
      <h2 className="text-base font-bold flex items-center gap-2 text-text-primary">
        📅 Recent Activity
      </h2>

      <div className="relative border-l border-border pl-4 ml-3 space-y-6">
        {activities.map((item) => {
          const Icon = getIcon(item.type)
          const colorClass = getColor(item.type)
          const formattedDate = new Date(item.date).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })

          return (
            <div key={item.id} className="relative group text-left">
              <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-border group-hover:bg-primary transition-colors duration-300 border border-surface" />

              <div className="flex gap-4 min-w-0">
                <div className={`p-2 rounded-medium border flex-shrink-0 self-start ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-bold text-xs text-text-primary group-hover:text-primary transition-colors truncate">
                      {item.title}
                    </h3>
                    <span className="text-[9px] text-text-secondary font-semibold flex items-center gap-1 flex-shrink-0">
                      <Calendar className="w-3 h-3 text-text-secondary/50" /> {formattedDate}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-text-secondary truncate">{item.details}</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-surface-secondary text-text-secondary border border-border">
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
