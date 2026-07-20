'use client'

import * as React from 'react'
import { useAuthStore } from '@/features/auth/store/authStore'
import { hasPermission } from '@/features/auth/utils/rbac'
import { UploadCloud, HelpCircle, BookOpen, Award, Shield } from 'lucide-react'
import Link from 'next/link'

export function QuickActions() {
  const { role } = useAuthStore()

  const actions = React.useMemo(() => {
    return [
      {
        title: 'Upload Study Material',
        description: 'Import PDFs or study notes to generate practice resources.',
        icon: UploadCloud,
        href: '/sources',
        color: 'text-primary bg-primary/10 border-primary/20',
      },
      {
        title: 'Start Practice',
        description: 'Engage in flashcard reviews or customized practice quiz sets.',
        icon: HelpCircle,
        href: '/practice',
        color: 'text-teal-500 bg-teal-500/10 border-teal-500/20',
      },
      {
        title: 'Question Bank',
        description: 'Browse generated question decks and topic sets.',
        icon: BookOpen,
        href: '/question-bank',
        color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
      },
      {
        title: 'View Results',
        description: 'Inspect performance reports and study recommendations.',
        icon: Award,
        href: '/assessments',
        color: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
      },
      {
        title: 'Manage System Settings',
        description: 'Access system-wide configurations and manage user roles.',
        icon: Shield,
        href: '/admin',
        enabled: role && hasPermission(role, 'admin:users'),
        color: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
      },
    ]
  }, [role])

  return (
    <div className="bg-surface border border-border rounded-large p-5 shadow-sm space-y-4">
      <h2 className="text-base font-bold flex items-center gap-2 text-text-primary">
        ⚡ Quick Actions
      </h2>
      <div className="flex flex-col gap-3">
        {actions.map((action) => {
          if (action.enabled === false) return null

          const Icon = action.icon
          return (
            <Link
              key={action.title}
              href={action.href}
              className="flex items-center gap-4.5 p-3.5 rounded-medium bg-surface border border-border/40 hover:border-primary/20 hover:shadow-soft transition-all duration-300 group hover:bg-surface-secondary"
            >
              <div
                className={`p-2.5 rounded-medium border flex-shrink-0 transition-colors duration-300 ${action.color}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-left space-y-0.5 min-w-0 flex-1">
                <h3 className="font-bold text-xs text-text-primary group-hover:text-primary transition-colors truncate">
                  {action.title}
                </h3>
                <p className="text-text-secondary text-[10px] leading-relaxed truncate">
                  {action.description}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
