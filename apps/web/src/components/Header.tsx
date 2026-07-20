'use client'

import * as React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/features/auth/store/authStore'
import { authService } from '@/features/auth/services/authService'
import {
  getNotificationsAction,
  markNotificationReadAction,
  markAllNotificationsReadAction,
  deleteNotificationAction,
  getNotificationPreferencesAction,
  updateNotificationPreferencesAction,
} from '../../app/actions/notifications'
import {
  Menu,
  LogOut,
  ChevronRight,
  Settings,
  Bell,
  Trash2,
  Check,
  X,
  Sliders,
  Inbox,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import Link from 'next/link'

interface HeaderProps {
  setMobileOpen: (open: boolean) => void
}

export function Header({ setMobileOpen }: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, session } = useAuthStore()

  // Dropdown states
  const [dropdownOpen, setDropdownOpen] = React.useState(false)
  const [notifOpen, setNotifOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const notifRef = React.useRef<HTMLDivElement>(null)

  // Notification states
  const [notifications, setNotifications] = React.useState<any[]>([])
  const [unreadCount, setUnreadCount] = React.useState(0)
  const [showPrefs, setShowPrefs] = React.useState(false)

  // Preference states
  const [emailEnabled, setEmailEnabled] = React.useState(true)
  const [inAppEnabled, setInAppEnabled] = React.useState(true)
  const [reminderPref, setReminderPref] = React.useState('daily')
  const [savingPrefs, setSavingPrefs] = React.useState(false)

  const handleSignOut = async () => {
    const result = await authService.signOut()
    if (result.success) {
      router.push('/login')
    }
  }

  // Load notifications and preferences
  const fetchNotifData = React.useCallback(async () => {
    if (!session) return
    try {
      const res = await getNotificationsAction(session.access_token)
      if (res.success) {
        setNotifications(res.notifications || [])
        setUnreadCount(res.unreadCount || 0)
      }

      const prefRes = await getNotificationPreferencesAction(session.access_token)
      if (prefRes.success && prefRes.preferences) {
        setEmailEnabled(prefRes.preferences.emailEnabled)
        setInAppEnabled(prefRes.preferences.inAppEnabled)
        setReminderPref(prefRes.preferences.reminderPreferences)
      }
    } catch (err) {
      console.error('Failed to load notifications payload:', err)
    }
  }, [session])

  React.useEffect(() => {
    fetchNotifData()
    // Poll notifications every 30 seconds for active updates
    const interval = setInterval(fetchNotifData, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifData])

  // Click outside hooks
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false)
        setShowPrefs(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMarkRead = async (id: string) => {
    if (!session) return
    const res = await markNotificationReadAction(session.access_token, id)
    if (res.success) {
      fetchNotifData()
    }
  }

  const handleMarkAllRead = async () => {
    if (!session) return
    const res = await markAllNotificationsReadAction(session.access_token)
    if (res.success) {
      fetchNotifData()
    }
  }

  const handleDeleteNotif = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (!session) return
    const res = await deleteNotificationAction(session.access_token, id)
    if (res.success) {
      fetchNotifData()
    }
  }

  const handleSavePrefs = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return
    try {
      setSavingPrefs(true)
      const res = await updateNotificationPreferencesAction(session.access_token, {
        emailEnabled,
        inAppEnabled,
        reminderPreferences: reminderPref,
      })
      if (res.success) {
        setShowPrefs(false)
        fetchNotifData()
      } else {
        alert(res.error || 'Failed to update preferences.')
      }
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'An error occurred.')
    } finally {
      setSavingPrefs(false)
    }
  }

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

      <div className="flex items-center gap-4">
        {/* NOTIFICATIONS DRAWER TRIGGER */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition relative text-slate-300 hover:text-white"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden text-xs">
              {!showPrefs ? (
                // NOTIFICATIONS INBOX VIEW
                <div className="flex flex-col max-h-96">
                  <div className="p-4 border-b border-white/5 flex items-center justify-between bg-slate-950/20">
                    <span className="font-bold text-slate-100 flex items-center gap-1.5">
                      <Inbox className="w-4 h-4 text-teal-400" /> Notifications ({unreadCount}{' '}
                      unread)
                    </span>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[10px] font-bold text-teal-400 hover:text-white transition"
                          title="Mark all as read"
                        >
                          Mark all read
                        </button>
                      )}
                      <button
                        onClick={() => setShowPrefs(true)}
                        className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
                        title="Configure settings"
                      >
                        <Settings className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="overflow-y-auto flex-1 divide-y divide-white/5 custom-scrollbar min-h-[150px]">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center p-8 text-slate-500 gap-2 min-h-[150px]">
                        <Bell className="w-8 h-8 opacity-20" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          No notifications
                        </span>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => handleMarkRead(notif.id)}
                          className={`p-3.5 transition text-left cursor-pointer relative group flex gap-2.5 items-start ${
                            !notif.read ? 'bg-blue-600/5 hover:bg-blue-600/10' : 'hover:bg-white/5'
                          }`}
                        >
                          {!notif.read && (
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                          )}
                          <div className="space-y-0.5 min-w-0 flex-1">
                            <div className="font-bold text-slate-200 truncate">{notif.title}</div>
                            <div className="text-slate-400 text-[10px] leading-relaxed line-clamp-2">
                              {notif.message}
                            </div>
                            <div className="text-[9px] text-slate-500">
                              {new Date(notif.createdAt).toLocaleDateString()}
                            </div>
                          </div>

                          <button
                            onClick={(e) => handleDeleteNotif(e, notif.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded transition flex-shrink-0 self-center"
                            title="Delete alert"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                // NOTIFICATION PREFERENCES FORM
                <form onSubmit={handleSavePrefs} className="p-4 space-y-4 text-left">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="font-bold text-slate-100 flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-violet-400" /> Preferences
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPrefs(false)}
                      className="text-slate-400 hover:text-white transition text-[10px] font-bold"
                    >
                      Back to Inbox
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-200">Email Notifications</div>
                        <div className="text-[10px] text-slate-500">
                          Receive alerts via email logs
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={emailEnabled}
                        onChange={(e) => setEmailEnabled(e.target.checked)}
                        className="rounded bg-slate-950 border-white/10 text-teal-500 focus:ring-0 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-200">In-App Messages</div>
                        <div className="text-[10px] text-slate-500">
                          Display alerts in portal bell
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={inAppEnabled}
                        onChange={(e) => setInAppEnabled(e.target.checked)}
                        className="rounded bg-slate-950 border-white/10 text-teal-500 focus:ring-0 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                        Reminders Schedule
                      </label>
                      <select
                        value={reminderPref}
                        onChange={(e) => setReminderPref(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-white/10 bg-slate-950 text-white text-xs outline-none focus:border-teal-500/50"
                      >
                        <option value="daily">Daily reminders</option>
                        <option value="weekly">Weekly reminders</option>
                        <option value="off">Turn reminders off</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={savingPrefs}
                    className="w-full py-2 bg-teal-600 hover:bg-teal-500 rounded-xl text-white font-bold transition flex items-center justify-center gap-1"
                  >
                    {savingPrefs ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    {savingPrefs ? 'Saving...' : 'Save Preferences'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* USER PROFILE DROPDOWN */}
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
            <div className="absolute right-0 mt-3 w-56 bg-slate-800 border border-white/10 rounded-2xl p-1.5 shadow-2xl relative z-50">
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
      </div>
    </header>
  )
}
