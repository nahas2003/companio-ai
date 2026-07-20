'use client'

import * as React from 'react'
import { Sparkles, GraduationCap, CheckCircle, HelpCircle } from 'lucide-react'
import type { DashboardStats } from '../types/dashboard.types'

interface StatsGridProps {
  stats: DashboardStats
}

export function StatsGrid({ stats }: StatsGridProps) {
  const cards = [
    {
      title: 'Practice Completed',
      value: stats.practiceCompleted,
      subtext: 'Sessions completed',
      icon: Sparkles,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
    {
      title: 'Assessments Completed',
      value: stats.assessmentsCompleted,
      subtext: 'Graded exams completed',
      icon: GraduationCap,
      color: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    },
    {
      title: 'Questions Answered',
      value: stats.questionsAnswered,
      subtext: 'Total practice attempts',
      icon: HelpCircle,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'Accuracy Rate',
      value: `${stats.accuracyRate}%`,
      subtext: 'Average accuracy across sessions',
      icon: CheckCircle,
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.title}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                {card.title}
              </span>
              <div className="text-2xl font-extrabold tracking-tight">{card.value}</div>
              <span className="text-slate-500 text-[11px] block">{card.subtext}</span>
            </div>
            <div className={`p-3 rounded-xl border flex-shrink-0 ${card.color}`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        )
      })}
    </div>
  )
}
