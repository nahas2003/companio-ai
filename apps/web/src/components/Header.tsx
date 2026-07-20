'use client'

import * as React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/features/auth/store/authStore'
import { authService } from '@/features/auth/services/authService'
import { Menu, LogOut, ChevronRight, Settings } from 'lucide-react'
import Link from 'next/link'

interface HeaderProps {
  setMobileOpen: (open: boolean) => void
}

export function Header({ setMobileOpen }: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuthStore()
  const [dropdownOpen, setDropdownOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const handleSignOut = async () => {
    const result = await authService.signOut()
    if (result.success) {
      router.push('/login')
    }
  }

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const breadcrumbs = React.useMemo(() => {
    const segments = pathname.split('/').filter(Boolean)
    return segments.map((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/')
      const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
      const isLast = index === segments.length - 1
      return { label, href, isLast }
    })
  }, [pathname])

  return (
    <header className="h-16 border-b border-white/10 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6 text-white">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition duration-200"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-400">
          <Link href="/dashboard" className="hover:text-white transition duration-200">
            Portal
          </Link>
          {breadcrumbs.map((bc) => (
            <React.Fragment key={bc.href}>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              {bc.isLast ? (
                <span className="text-slate-200 font-semibold">{bc.label}</span>
              ) : (
                <Link href={bc.href} className="hover:text-white transition duration-200">
                  {bc.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2.5 p-1 rounded-full hover:bg-white/5 transition duration-200 text-left group"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center font-bold text-sm text-white shadow-md">
            {user?.user_metadata?.displayName?.charAt(0).toUpperCase() ||
              user?.email?.charAt(0).toUpperCase() ||
              'U'}
          </div>
          <span className="hidden md:inline text-sm font-semibold text-slate-300 group-hover:text-white transition duration-200 max-w-[120px] truncate">
            {user?.user_metadata?.displayName || user?.email?.split('@')[0]}
          </span>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-white/10 rounded-2xl p-1.5 shadow-2xl relative z-50">
            <div className="px-4 py-3 border-b border-white/5">
              <p className="text-xs font-medium text-slate-400">Signed in as</p>
              <p className="text-sm font-bold text-white truncate">{user?.email}</p>
            </div>

            <div className="py-1">
              <Link
                href="/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition duration-200"
              >
                <Settings className="w-4 h-4 text-slate-400" /> Profile Settings
              </Link>
              <button
                onClick={() => {
                  setDropdownOpen(false)
                  handleSignOut()
                }}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition duration-200 w-full text-left"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
