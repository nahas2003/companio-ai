'use client'

import * as React from 'react'
import { GraduationCap, CheckCircle, HelpCircle, Trophy, Cpu } from 'lucide-react'
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
      icon: Trophy,
      color: 'text-primary bg-primary/10 border-primary/20',
    },
    {
      title: 'Assessments Completed',
      value: stats.assessmentsCompleted,
      subtext: 'Graded exams completed',
      icon: GraduationCap,
      color: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
    },
    {
      title: 'Questions Answered',
      value: stats.questionsAnswered,
      subtext: 'Total practice attempts',
      icon: HelpCircle,
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'Accuracy Rate',
      value: `${stats.accuracyRate}%`,
      subtext: 'Average accuracy rate',
      icon: CheckCircle,
      color: 'text-success bg-success/10 border-success/20',
    },
    {
      title: 'Engine Calculations',
      value: stats.aiRequests ?? 0,
      subtext: `${stats.aiTotalTokens ? Math.round(stats.aiTotalTokens / 1000) : 0}k operations`,
      icon: Cpu,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 w-full">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.title}
            className="bg-surface border border-border rounded-large p-5 shadow-sm hover:shadow-soft hover:border-primary/20 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-between"
          >
            <div className="space-y-1.5 text-left">
              <span className="text-text-secondary text-[10px] font-bold uppercase tracking-wider">
                {card.title}
              </span>
              <div className="text-2xl font-extrabold tracking-tight text-text-primary">
                {card.value}
              </div>
              <span className="text-text-secondary/70 text-[10px] font-medium block">
                {card.subtext}
              </span>
            </div>
            <div className={`p-2.5 rounded-medium border flex-shrink-0 ${card.color}`}>
              <Icon className="w-5.5 h-5.5" />
            </div>
          </div>
        )
      })}
    </div>
  )
}
