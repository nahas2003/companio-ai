'use client'

import * as React from 'react'
import { UploadCloud, Sparkles, GraduationCap, Calendar, Inbox } from 'lucide-react'
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
        return Sparkles
      case 'assessment':
        return GraduationCap
    }
  }

  const getColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'upload':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
      case 'practice':
        return 'text-teal-400 bg-teal-500/10 border-teal-500/20'
      case 'assessment':
        return 'text-violet-400 bg-violet-500/10 border-violet-500/20'
    }
  }

  if (activities.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md flex flex-col items-center justify-center text-center space-y-4 min-h-[350px]">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-500">
          <Inbox className="w-8 h-8" />
        </div>
        <div className="space-y-1.5 max-w-sm">
          <h3 className="font-bold text-lg text-white">No activity yet</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Get started by uploading your first study guide, lecture slides, or textbook chapter
            PDFs!
          </p>
        </div>
        <a
          href="#upload"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg hover:shadow-blue-500/25 transition duration-300"
        >
          <UploadCloud className="w-4 h-4" /> Upload Material
        </a>
      </div>
    )
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">📅 Recent Activity</h2>

      <div className="relative border-l border-white/5 pl-4 ml-3 space-y-6">
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
              <div className="absolute -left-[25px] top-1.5 w-2 h-2 rounded-full bg-slate-700 group-hover:bg-blue-500 transition-colors duration-300 border border-slate-950" />

              <div className="flex gap-4 min-w-0">
                <div className={`p-2 rounded-lg border flex-shrink-0 self-start ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-semibold text-sm text-slate-200 group-hover:text-white transition-colors truncate">
                      {item.title}
                    </h3>
                    <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1 flex-shrink-0">
                      <Calendar className="w-3 h-3" /> {formattedDate}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-400 truncate">{item.details}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-white/5 text-slate-400 border border-white/5">
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
