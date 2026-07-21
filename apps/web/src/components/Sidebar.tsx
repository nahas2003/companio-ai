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
  FileText,
  GraduationCap,
  ChevronLeft,
  UploadCloud,
  Compass,
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
        href: '/question-bank',
        icon: BookOpen,
        enabled: true,
      },
      {
        name: 'Practice Builder',
        href: '/generate',
        icon: FileText, // Replaced Sparkles with FileText for invisible AI requirement
        enabled: true,
      },
      {
        name: 'Practice Zone',
        href: '/practice',
        icon: Compass,
        enabled: true,
      },
      {
        name: 'Assessments',
        href: '/assessments',
        icon: GraduationCap,
        enabled: true,
      },
    ]
    return items.filter((item) => item.enabled)
  }, [role])

  const sidebarContent = (
    <div className="flex flex-col h-full bg-surface border-r border-border text-text-primary transition-all duration-300">
      <div className="h-16 flex items-center justify-between px-6 border-b border-border">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 rounded-medium bg-primary flex items-center justify-center font-bold text-lg text-white flex-shrink-0">
            C
          </div>
          {!collapsed && (
            <span className="font-bold text-lg tracking-tight text-text-primary whitespace-nowrap">
              Companio
            </span>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex p-1.5 rounded-medium hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition duration-200"
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
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-medium transition duration-200 relative group border ${
                isActive
                  ? 'bg-primary/10 text-primary border-primary/20 font-bold'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary border-transparent'
              }`}
            >
              <Icon
                className={`w-4.5 h-4.5 flex-shrink-0 ${isActive ? 'text-primary' : 'text-text-secondary group-hover:text-text-primary transition-colors'}`}
              />
              {!collapsed && (
                <span className="text-[13px] font-semibold flex-1 tracking-wide">{item.name}</span>
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
        className={`hidden md:block h-screen sticky top-0 z-40 transition-all duration-300 flex-shrink-0 ${collapsed ? 'w-[72px]' : 'w-[230px]'}`}
      >
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity"
        />
      )}

      <aside
        className={`md:hidden fixed top-0 bottom-0 left-0 w-[230px] z-50 transition-transform duration-300 ease-in-out transform ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
