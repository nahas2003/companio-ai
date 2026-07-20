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
        color: 'group-hover:text-blue-400 text-blue-500 bg-blue-500/10 border-blue-500/20',
      },
      {
        title: 'Start Practice',
        description: 'Engage in flashcard reviews or customized practice quiz sets.',
        icon: HelpCircle,
        href: '#practice',
        color: 'group-hover:text-teal-400 text-teal-500 bg-teal-500/10 border-teal-500/20',
      },
      {
        title: 'Question Bank',
        description: 'Browse generated question decks and topic sets.',
        icon: BookOpen,
        href: '#question-bank',
        color: 'group-hover:text-indigo-400 text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
      },
      {
        title: 'View Results',
        description: 'Inspect performance reports and study recommendations.',
        icon: Award,
        href: '#results',
        color: 'group-hover:text-orange-400 text-orange-500 bg-orange-500/10 border-orange-500/20',
      },
      {
        title: 'Manage System Settings',
        description: 'Access system-wide configurations and manage user roles.',
        icon: Shield,
        href: '/admin',
        enabled: role && hasPermission(role, 'admin:users'),
        color: 'group-hover:text-violet-400 text-violet-500 bg-violet-500/10 border-violet-500/20',
      },
    ]
  }, [role])

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2">⚡ Quick Actions</h2>
      <div className="flex flex-col gap-3">
        {actions.map((action) => {
          if (action.enabled === false) return null

          const Icon = action.icon
          return (
            <Link
              key={action.title}
              href={action.href}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/15 transition-all duration-300 group hover:bg-white/10"
            >
              <div
                className={`p-3 rounded-xl border transition-colors duration-300 ${action.color}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-left space-y-0.5 min-w-0 flex-1">
                <h3 className="font-semibold text-sm group-hover:text-white transition-colors truncate">
                  {action.title}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed truncate">
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
