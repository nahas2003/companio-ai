'use client'

import * as React from 'react'
import { useAuthStore } from '@/features/auth/store/authStore'
import { RoleGuard } from '@/features/auth/components/RoleGuard'
import {
  getAdminUsersAction,
  toggleUserStatusAction,
  updateAdminUserRoleAction,
  triggerPasswordResetAction,
  getSystemSettingsAction,
  updateSystemSettingsAction,
  getAdminAuditLogsAction,
} from '../../actions/admin'
import { getAiSystemStatus, testAiExecution } from '../../actions/ai'
import { Button } from '@companio/ui'
import { Role } from '@companio/db'
import {
  Shield,
  Users,
  Sliders,
  Cpu,
  Database,
  History,
  Terminal,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Play,
  UserCheck,
  UserX,
  Lock,
  ArrowLeft,
  Settings,
  Save,
  Activity,
} from 'lucide-react'
import Link from 'next/link'

type TabType = 'users' | 'system' | 'ai' | 'storage' | 'audit' | 'diagnostics'

export default function AdminPage() {
  const { session } = useAuthStore()
  const [activeTab, setActiveTab] = React.useState<TabType>('users')

  return (
    <RoleGuard requiredPermission="admin:users">
      <div className="space-y-6 text-text-primary text-left animate-fade-in max-w-7xl mx-auto pb-12">
        {/* Header */}
        <div className="border-b border-border pb-5">
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2.5">
            <Shield className="w-7 h-7 text-primary" /> Admin Control Workspace
          </h1>
          <p className="text-text-secondary text-xs font-semibold mt-1">
            Configure system preferences, manage student roles, inspect audit streams, and test
            endpoints.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* LEFT: Sidebar Navigation Tabs */}
          <div className="lg:col-span-1 space-y-2">
            <div className="p-4 rounded-large bg-surface border border-border flex items-center gap-3 shadow-sm">
              <div className="w-9 h-9 rounded-medium bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <Shield className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-text-primary">System Operator</h3>
                <span className="text-[9px] text-text-secondary font-bold uppercase tracking-wider">
                  Root Panel
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full text-left p-3 rounded-medium border flex items-center gap-3 font-bold transition duration-200 ${
                activeTab === 'users'
                  ? 'bg-primary/10 border-primary/20 text-primary'
                  : 'bg-surface border-border text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="text-xs">User Directory</span>
            </button>

            <button
              onClick={() => setActiveTab('system')}
              className={`w-full text-left p-3 rounded-medium border flex items-center gap-3 font-bold transition duration-200 ${
                activeTab === 'system'
                  ? 'bg-primary/10 border-primary/20 text-primary'
                  : 'bg-surface border-border text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span className="text-xs">System Preferences</span>
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`w-full text-left p-3 rounded-medium border flex items-center gap-3 font-bold transition duration-200 ${
                activeTab === 'ai'
                  ? 'bg-primary/10 border-primary/20 text-primary'
                  : 'bg-surface border-border text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span className="text-xs">AI Gateway Config</span>
            </button>

            <button
              onClick={() => setActiveTab('storage')}
              className={`w-full text-left p-3 rounded-medium border flex items-center gap-3 font-bold transition duration-200 ${
                activeTab === 'storage'
                  ? 'bg-primary/10 border-primary/20 text-primary'
                  : 'bg-surface border-border text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
              }`}
            >
              <Database className="w-4 h-4" />
              <span className="text-xs">Storage Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`w-full text-left p-3 rounded-medium border flex items-center gap-3 font-bold transition duration-200 ${
                activeTab === 'audit'
                  ? 'bg-primary/10 border-primary/20 text-primary'
                  : 'bg-surface border-border text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
              }`}
            >
              <History className="w-4 h-4" />
              <span className="text-xs">Audit Logs</span>
            </button>

            <button
              onClick={() => setActiveTab('diagnostics')}
              className={`w-full text-left p-3 rounded-medium border flex items-center gap-3 font-bold transition duration-200 ${
                activeTab === 'diagnostics'
                  ? 'bg-primary/10 border-primary/20 text-primary'
                  : 'bg-surface border-border text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span className="text-xs">System Diagnostics</span>
            </button>
          </div>

          {/* RIGHT: Main Details Tab view */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === 'users' && <UsersDirectory session={session} />}
            {activeTab === 'system' && <SystemSettingsTab session={session} />}
            {activeTab === 'ai' && <AiConfigTab session={session} />}
            {activeTab === 'storage' && <StorageSettingsTab session={session} />}
            {activeTab === 'audit' && <AuditLogsTab session={session} />}
            {activeTab === 'diagnostics' && <DiagnosticsTab session={session} />}
          </div>
        </div>
      </div>
    </RoleGuard>
  )
}

/* ==========================================
   SUB-COMPONENT: User Directory
   ========================================== */
function UsersDirectory({ session }: { session: any }) {
  const [users, setUsers] = React.useState<any[]>([])
  const [search, setSearch] = React.useState('')
  const [roleFilter, setRoleFilter] = React.useState('ALL')
  const [loading, setLoading] = React.useState(true)

  // Edit states
  const [editingUserId, setEditingUserId] = React.useState<string | null>(null)
  const [selectedRole, setSelectedRole] = React.useState<Role>('STUDENT')
  const [updating, setUpdating] = React.useState(false)

  const loadUsers = React.useCallback(async () => {
    if (!session) return
    try {
      setLoading(true)
      const res = await getAdminUsersAction(session.access_token, search, roleFilter)
      if (res.success) {
        setUsers(res.users || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [session, search, roleFilter])

  React.useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const handleToggleStatus = async (userId: string) => {
    if (!session) return
    const res = await toggleUserStatusAction(session.access_token, userId)
    if (res.success) {
      loadUsers()
    } else {
      alert(res.error || 'Action failed.')
    }
  }

  const handleUpdateRole = async (userId: string) => {
    if (!session) return
    try {
      setUpdating(true)
      const res = await updateAdminUserRoleAction(session.access_token, userId, selectedRole)
      if (res.success) {
        setEditingUserId(null)
        loadUsers()
      } else {
        alert(res.error || 'Failed to update role.')
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setUpdating(false)
    }
  }

  const handleResetPassword = async (userId: string) => {
    if (!session) return
    const res = await triggerPasswordResetAction(session.access_token, userId)
    if (res.success) {
      alert('Password reset log dispatched successfully (mock mail logged to server console).')
    } else {
      alert(res.error || 'Action failed.')
    }
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">User Access Directory</h2>
          <p className="text-slate-400 text-xs mt-1">
            Manage registration profile attributes and authorization values.
          </p>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search users name or email address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/50 text-white text-xs outline-none focus:border-blue-500/50"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900 text-white text-xs outline-none focus:border-blue-500/50 cursor-pointer"
        >
          <option value="ALL">All Roles</option>
          <option value="STUDENT">Students</option>
          <option value="INSTRUCTOR">Instructors</option>
          <option value="ADMIN">Admins</option>
          <option value="SUPER_ADMIN">Super Admins</option>
        </select>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 text-slate-400 gap-2 min-h-[250px]">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
          <span className="text-[10px] font-bold uppercase tracking-wider animate-pulse">
            Loading directory entries...
          </span>
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-slate-500 gap-2 border border-white/5 border-dashed rounded-2xl min-h-[250px]">
          <Users className="w-10 h-10 opacity-20" />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            No matching users found
          </span>
        </div>
      ) : (
        <div className="overflow-x-auto border border-white/5 rounded-2xl">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-slate-300 font-bold">
                <th className="p-4">User Info</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => {
                const isEditing = editingUserId === u.id
                return (
                  <tr key={u.id} className="hover:bg-white/5 transition">
                    <td className="p-4">
                      <div className="font-bold text-slate-200">
                        {u.displayName || 'Unknown User'}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                        {u.email}
                      </div>
                      <div className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">
                        ID: {u.id}
                      </div>
                    </td>
                    <td className="p-4">
                      {isEditing ? (
                        <select
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value as Role)}
                          className="px-2 py-1 rounded bg-slate-900 border border-white/10 text-white text-[10px]"
                        >
                          <option value="STUDENT">Student</option>
                          <option value="INSTRUCTOR">Instructor</option>
                          <option value="ADMIN">Admin</option>
                          <option value="SUPER_ADMIN">Super Admin</option>
                        </select>
                      ) : (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                            u.role === 'SUPER_ADMIN'
                              ? 'bg-red-500/15 text-red-400'
                              : u.role === 'ADMIN'
                                ? 'bg-amber-500/15 text-amber-400'
                                : u.role === 'INSTRUCTOR'
                                  ? 'bg-blue-500/15 text-blue-400'
                                  : 'bg-slate-500/15 text-slate-400'
                          }`}
                        >
                          {u.role.replace('_', ' ')}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          u.active ? 'bg-teal-500/15 text-teal-400' : 'bg-red-500/15 text-red-400'
                        }`}
                      >
                        {u.active ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleUpdateRole(u.id)}
                              disabled={updating}
                              className="px-2.5 py-1 bg-teal-600 hover:bg-teal-500 rounded text-[10px] font-bold"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingUserId(null)}
                              className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded text-[10px] text-slate-300"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingUserId(u.id)
                                setSelectedRole(u.role)
                              }}
                              className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300"
                              title="Edit Role"
                            >
                              <Settings className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleToggleStatus(u.id)}
                              className={`p-1 rounded ${u.active ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-teal-500/10 text-teal-400 hover:bg-teal-500/20'}`}
                              title={u.active ? 'Deactivate User' : 'Activate User'}
                            >
                              {u.active ? (
                                <UserX className="w-3.5 h-3.5" />
                              ) : (
                                <UserCheck className="w-3.5 h-3.5" />
                              )}
                            </button>

                            <button
                              onClick={() => handleResetPassword(u.id)}
                              className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300"
                              title="Reset Password Log"
                            >
                              <Lock className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

/* ==========================================
   SUB-COMPONENT: System Preferences Tab
   ========================================== */
function SystemSettingsTab({ session }: { session: any }) {
  const [settings, setSettings] = React.useState<Record<string, string>>({})
  const [flags, setFlags] = React.useState<Record<string, boolean>>({})
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    async function loadSettings() {
      if (!session) return
      const res = await getSystemSettingsAction(session.access_token)
      if (res.success && res.settings && res.flags) {
        setSettings(res.settings)
        setFlags(res.flags)
      }
      setLoading(false)
    }
    loadSettings()
  }, [session])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return
    try {
      setSaving(true)
      const res = await updateSystemSettingsAction(session.access_token, { settings, flags })
      if (res.success) {
        alert('System configurations saved successfully and logged to audit trails!')
      } else {
        alert(res.error || 'Save failed.')
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400 gap-2 min-h-[200px]">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
        <span className="text-xs">Loading preferences settings...</span>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSave}
      className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6 backdrop-blur-md"
    >
      <div>
        <h2 className="text-xl font-bold">System Preferences</h2>
        <p className="text-slate-400 text-xs mt-1">
          Configure global application branding parameters and timeouts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
            Application Name
          </label>
          <input
            type="text"
            required
            value={settings.appName || ''}
            onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/50 text-white text-xs outline-none focus:border-blue-500/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
            Branding Theme
          </label>
          <select
            value={settings.brandingTheme || 'Dark Mode'}
            onChange={(e) => setSettings({ ...settings, brandingTheme: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-800 text-white text-xs outline-none focus:border-blue-500/50 cursor-pointer"
          >
            <option value="Dark Mode">Dark Mode (Premium)</option>
            <option value="Light Mode">Light Mode</option>
            <option value="Glassmorphism">Glassmorphism Glow</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
            Default Language
          </label>
          <select
            value={settings.defaultLanguage || 'en'}
            onChange={(e) => setSettings({ ...settings, defaultLanguage: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-800 text-white text-xs outline-none focus:border-blue-500/50 cursor-pointer"
          >
            <option value="en">English (US)</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
            Time Zone
          </label>
          <select
            value={settings.timezone || 'UTC'}
            onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-800 text-white text-xs outline-none focus:border-blue-500/50 cursor-pointer"
          >
            <option value="UTC">UTC (Universal Time)</option>
            <option value="EST">EST (Eastern Standard)</option>
            <option value="IST">IST (Indian Standard)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
            Session Timeout (minutes)
          </label>
          <input
            type="number"
            value={settings.sessionTimeout || '30'}
            onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/50 text-white text-xs outline-none focus:border-blue-500/50"
          />
        </div>
      </div>

      <div className="border-t border-white/5 pt-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-300">Feature Activation Flags</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-slate-900/50">
            <div>
              <span className="font-semibold text-xs block text-slate-200">Practice Mode</span>
              <span className="text-[9px] text-slate-500 font-bold">Self study playroom</span>
            </div>
            <input
              type="checkbox"
              checked={!!flags.practiceMode}
              onChange={(e) => setFlags({ ...flags, practiceMode: e.target.checked })}
              className="rounded bg-slate-950 border-white/10 text-teal-500 focus:ring-0 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-slate-900/50">
            <div>
              <span className="font-semibold text-xs block text-slate-200">Assessments</span>
              <span className="text-[9px] text-slate-500 font-bold">Exam and key creation</span>
            </div>
            <input
              type="checkbox"
              checked={!!flags.assessments}
              onChange={(e) => setFlags({ ...flags, assessments: e.target.checked })}
              className="rounded bg-slate-950 border-white/10 text-teal-500 focus:ring-0 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-slate-900/50">
            <div>
              <span className="font-semibold text-xs block text-slate-200">AI Generation</span>
              <span className="text-[9px] text-slate-500 font-bold">Question generators</span>
            </div>
            <input
              type="checkbox"
              checked={!!flags.aiGeneration}
              onChange={(e) => setFlags({ ...flags, aiGeneration: e.target.checked })}
              className="rounded bg-slate-950 border-white/10 text-teal-500 focus:ring-0 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={saving}
        className="w-full h-11 bg-teal-600 hover:bg-teal-500 text-white font-bold flex items-center justify-center gap-2"
      >
        {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
        {saving ? 'Saving preferences...' : 'Save Preferences'}
      </Button>
    </form>
  )
}

/* ==========================================
   SUB-COMPONENT: AI Configuration Tab
   ========================================== */
function AiConfigTab({ session }: { session: any }) {
  const [settings, setSettings] = React.useState<Record<string, string>>({})
  const [flags, setFlags] = React.useState<Record<string, boolean>>({})
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    async function loadSettings() {
      if (!session) return
      const res = await getSystemSettingsAction(session.access_token)
      if (res.success && res.settings && res.flags) {
        setSettings(res.settings)
        setFlags(res.flags)
      }
      setLoading(false)
    }
    loadSettings()
  }, [session])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return
    try {
      setSaving(true)
      const res = await updateSystemSettingsAction(session.access_token, { settings, flags })
      if (res.success) {
        alert('AI configuration settings saved successfully and logged to audit trails!')
      } else {
        alert(res.error || 'Save failed.')
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400 gap-2 min-h-[200px]">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
        <span className="text-xs">Loading AI config...</span>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSave}
      className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6 backdrop-blur-md"
    >
      <div>
        <h2 className="text-xl font-bold">AI Orchestrator Configuration</h2>
        <p className="text-slate-400 text-xs mt-1">
          Configure models default settings, timeout gates, and retry limits.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
            Active AI Provider
          </label>
          <select
            value={settings.aiProvider || 'Gemini'}
            onChange={(e) => setSettings({ ...settings, aiProvider: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-800 text-white text-xs outline-none focus:border-blue-500/50 cursor-pointer"
          >
            <option value="Gemini">Google Gemini AI</option>
            <option value="Mock">Mock Loopback Adapter (Local Sandbox)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
            Default Model Selection
          </label>
          <select
            value={settings.aiModel || 'gemini-1.5-pro'}
            onChange={(e) => setSettings({ ...settings, aiModel: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-800 text-white text-xs outline-none focus:border-blue-500/50 cursor-pointer"
          >
            <option value="gemini-1.5-pro">gemini-1.5-pro (Multimodal)</option>
            <option value="gemini-1.5-flash">gemini-1.5-flash (Fast)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
            Max Generation Limits (questions)
          </label>
          <input
            type="number"
            value={settings.generationLimit || '20'}
            onChange={(e) => setSettings({ ...settings, generationLimit: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/50 text-white text-xs outline-none focus:border-blue-500/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
            Request Timeout (seconds)
          </label>
          <input
            type="number"
            value={settings.requestTimeout || '60'}
            onChange={(e) => setSettings({ ...settings, requestTimeout: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/50 text-white text-xs outline-none focus:border-blue-500/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
            Retry Policy (attempts)
          </label>
          <input
            type="number"
            value={settings.retryCount || '3'}
            onChange={(e) => setSettings({ ...settings, retryCount: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/50 text-white text-xs outline-none focus:border-blue-500/50"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={saving}
        className="w-full h-11 bg-teal-600 hover:bg-teal-500 text-white font-bold flex items-center justify-center gap-2"
      >
        {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
        {saving ? 'Saving AI config...' : 'Save AI Settings'}
      </Button>
    </form>
  )
}

/* ==========================================
   SUB-COMPONENT: Storage Settings Tab
   ========================================== */
function StorageSettingsTab({ session }: { session: any }) {
  const [settings, setSettings] = React.useState<Record<string, string>>({})
  const [flags, setFlags] = React.useState<Record<string, boolean>>({})
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    async function loadSettings() {
      if (!session) return
      const res = await getSystemSettingsAction(session.access_token)
      if (res.success && res.settings && res.flags) {
        setSettings(res.settings)
        setFlags(res.flags)
      }
      setLoading(false)
    }
    loadSettings()
  }, [session])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return
    try {
      setSaving(true)
      const res = await updateSystemSettingsAction(session.access_token, { settings, flags })
      if (res.success) {
        alert('Storage preferences saved successfully and logged to audit trails!')
      } else {
        alert(res.error || 'Save failed.')
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400 gap-2 min-h-[200px]">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
        <span className="text-xs">Loading storage settings...</span>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSave}
      className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6 backdrop-blur-md"
    >
      <div>
        <h2 className="text-xl font-bold">Storage & Upload Constraints</h2>
        <p className="text-slate-400 text-xs mt-1">
          Configure study note limits, file parsing permissions, and overview stats.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              Upload Size Limit
            </label>
            <select
              value={settings.uploadSizeLimit || '10MB'}
              onChange={(e) => setSettings({ ...settings, uploadSizeLimit: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-800 text-white text-xs outline-none focus:border-blue-500/50 cursor-pointer"
            >
              <option value="5MB">5 MB</option>
              <option value="10MB">10 MB (Default)</option>
              <option value="20MB">20 MB</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              Allowed File Extensions
            </label>
            <input
              type="text"
              required
              value={settings.allowedFileTypes || 'PDF, DOCX, TXT, MD'}
              onChange={(e) => setSettings({ ...settings, allowedFileTypes: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/50 text-white text-xs outline-none focus:border-blue-500/50"
            />
          </div>
        </div>

        {/* Overview Stats box */}
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/5 space-y-4 text-xs">
          <h3 className="font-bold text-slate-200">Supabase Bucket Overview</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between font-semibold text-slate-400 mb-1">
                <span>Active Storage Bucket</span>
                <span className="text-teal-400 font-bold uppercase text-[9px]">Private</span>
              </div>
              <div className="text-slate-100 font-bold">"sources"</div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-400 mb-1">
                <span>Retention Policy</span>
                <span className="text-slate-500 text-[10px]">Configured</span>
              </div>
              <div className="text-slate-200">
                Keep documents indefinitely unless deleted by owner.
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={saving}
        className="w-full h-11 bg-teal-600 hover:bg-teal-500 text-white font-bold flex items-center justify-center gap-2"
      >
        {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
        {saving ? 'Saving storage rules...' : 'Save Storage Rules'}
      </Button>
    </form>
  )
}

/* ==========================================
   SUB-COMPONENT: Audit Logs Tab
   ========================================== */
function AuditLogsTab({ session }: { session: any }) {
  const [logs, setLogs] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function loadLogs() {
      if (!session) return
      const res = await getAdminAuditLogsAction(session.access_token)
      if (res.success) {
        setLogs(res.logs || [])
      }
      setLoading(false)
    }
    loadLogs()
  }, [session])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400 gap-2 min-h-[250px]">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
        <span className="text-xs">Loading audit trails log...</span>
      </div>
    )
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6 backdrop-blur-md">
      <div>
        <h2 className="text-xl font-bold">Administrative Audit Trails</h2>
        <p className="text-slate-400 text-xs mt-1">
          Logs showing system changes and authorization actions executed by admins.
        </p>
      </div>

      {logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-slate-500 gap-2 border border-white/5 border-dashed rounded-2xl min-h-[200px]">
          <History className="w-10 h-10 opacity-20" />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            No audit records found
          </span>
        </div>
      ) : (
        <div className="overflow-x-auto border border-white/5 rounded-2xl">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-slate-300 font-bold">
                <th className="p-4">Timestamp</th>
                <th className="p-4">Admin ID</th>
                <th className="p-4">Action</th>
                <th className="p-4">Target ID</th>
                <th className="p-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.map((l) => (
                <tr key={l.id} className="hover:bg-white/5 transition text-[11px]">
                  <td className="p-4 text-slate-400 whitespace-nowrap">
                    {new Date(l.createdAt).toLocaleString()}
                  </td>
                  <td
                    className="p-4 text-slate-300 truncate max-w-[120px] font-mono"
                    title={l.adminId}
                  >
                    {l.adminId}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full text-[9px] bg-slate-900 border border-white/5 text-teal-400 font-bold">
                      {l.action}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 font-mono" title={l.target}>
                    {l.target === 'SYSTEM' ? 'SYSTEM' : l.target.slice(0, 8) + '...'}
                  </td>
                  <td className="p-4 text-slate-300 truncate max-w-[180px]" title={l.details}>
                    {l.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

/* ==========================================
   SUB-COMPONENT: System Diagnostics Tab (Preexisting checks)
   ========================================== */
function DiagnosticsTab({ session }: { session: any }) {
  const [loading, setLoading] = React.useState(true)
  const [testing, setTesting] = React.useState(false)
  const [statusData, setStatusData] = React.useState<any>(null)
  const [testResult, setTestResult] = React.useState<any>(null)

  const loadStatus = React.useCallback(async () => {
    if (!session) return
    try {
      setLoading(true)
      const res = await getAiSystemStatus(session.access_token)
      if (res.success) {
        setStatusData(res)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [session])

  React.useEffect(() => {
    loadStatus()
  }, [loadStatus])

  const handleTest = async () => {
    if (!session) return
    try {
      setTesting(true)
      setTestResult(null)
      const res = await testAiExecution(session.access_token)
      if (res.success) {
        setTestResult({ success: true, data: res.result })
      } else {
        setTestResult({ success: false, error: res.error })
      }
      loadStatus()
    } catch (err: any) {
      setTestResult({ success: false, error: err.message })
    } finally {
      setTesting(false)
    }
  }

  if (loading || !statusData) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md flex flex-col items-center justify-center gap-3 text-slate-400 min-h-[200px]">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
        <span className="text-xs font-medium animate-pulse">Loading AI system diagnostics...</span>
      </div>
    )
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6 backdrop-blur-md shadow-xl text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-400 animate-pulse" /> AI Orchestrator Diagnostics
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Monitor real AI API token usage and execute diagnostics loops checks.
          </p>
        </div>
        <Button
          onClick={handleTest}
          disabled={testing}
          className="bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold flex items-center gap-2 h-9 px-4 text-xs"
        >
          {testing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-3.5 h-3.5" />
          )}
          Run Loop diagnostics
        </Button>
      </div>

      {testResult && (
        <div
          className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1.5 ${
            testResult.success
              ? 'border-teal-500/30 bg-teal-500/10 text-teal-200'
              : 'border-red-500/30 bg-red-500/10 text-red-200'
          }`}
        >
          <div className="font-bold flex items-center gap-1.5">
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
            <span>Diagnostic Result: {testResult.success ? 'Passed' : 'Failed'}</span>
          </div>
          {testResult.success ? (
            <div>
              Loop verification success: AI Orchestrator processed {testResult.data.length} test
              cards correctly.
            </div>
          ) : (
            <div>Error: {testResult.error}</div>
          )}
        </div>
      )}

      {/* Grid items */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-white/5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Average Latency
          </div>
          <div className="text-xl font-extrabold text-slate-100 mt-1">
            {statusData.avgLatency ? `${Math.round(statusData.avgLatency)}ms` : 'N/A'}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-white/5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Prompt Tokens Used
          </div>
          <div className="text-xl font-extrabold text-slate-100 mt-1">
            {statusData.totalPromptTokens || '0'}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-white/5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Completion Tokens
          </div>
          <div className="text-xl font-extrabold text-slate-100 mt-1">
            {statusData.totalCompletionTokens || '0'}
          </div>
        </div>
      </div>
    </div>
  )
}
