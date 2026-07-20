'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/features/auth/store/authStore'
import { hasPermission } from '@/features/auth/utils/rbac'
import {
  LayoutDashboard,
  User,
  Shield,
  BookOpen,
  Sparkles,
  GraduationCap,
  ChevronLeft,
  UploadCloud,
} from 'lucide-react'

interface SidebarProps {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void
}

export function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: SidebarProps) {
  const pathname = usePathname()
  const { role } = useAuthStore()

  const navItems = React.useMemo(() => {
    const items = [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        enabled: true,
      },
      {
        name: 'Study Materials',
        href: '/sources',
        icon: UploadCloud,
        enabled: true,
      },
      {
        name: 'Profile Settings',
        href: '/profile',
        icon: User,
        enabled: true,
      },
      {
        name: 'Admin Portal',
        href: '/admin',
        icon: Shield,
        enabled: !!(role && hasPermission(role, 'admin:users')),
      },
      {
        name: 'Question Bank',
        href: '#question-bank',
        icon: BookOpen,
        enabled: true,
        isMock: true,
      },
      {
        name: 'Practice Mode',
        href: '#practice',
        icon: Sparkles,
        enabled: true,
        isMock: true,
      },
      {
        name: 'Assessments',
        href: '#assessments',
        icon: GraduationCap,
        enabled: true,
        isMock: true,
      },
    ]
    return items.filter((item) => item.enabled)
  }, [role])

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 border-r border-white/10 text-white">
      <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
            C
          </div>
          {!collapsed && (
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent whitespace-nowrap">
              Companio
            </span>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition duration-200"
        >
          <ChevronLeft
            className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition duration-300 relative group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600/20 to-violet-600/20 text-white border border-blue-500/30'
                  : item.isMock
                    ? 'text-slate-500 hover:text-slate-400 cursor-not-allowed pointer-events-none'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-white transition-colors'}`}
              />
              {!collapsed && (
                <span className="text-sm font-semibold flex-1 tracking-wide">
                  {item.name}
                  {item.isMock && (
                    <span className="ml-2 text-[9px] font-bold text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                      Soon
                    </span>
                  )}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )

  return (
    <>
      <aside
        className={`hidden md:block h-screen sticky top-0 z-40 transition-all duration-300 flex-shrink-0 ${collapsed ? 'w-20' : 'w-64'}`}
      >
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
        />
      )}

      <aside
        className={`md:hidden fixed top-0 bottom-0 left-0 w-64 z-50 transition-transform duration-300 ease-in-out transform ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
