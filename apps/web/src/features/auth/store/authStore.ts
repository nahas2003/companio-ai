import { create } from 'zustand'
import { getSupabaseClient } from '../../../lib/supabase'
import type { AuthState } from '../types/auth.types'
import { syncUser } from '../../../../app/actions/auth'
import { Role } from '@companio/db'

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  role: null,
  isLoading: true,
  error: null,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setRole: (role) => set({ role }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  initAuth: async () => {
    try {
      set({ isLoading: true })
      const supabase = getSupabaseClient()

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) throw sessionError

      if (session) {
        set({ session, user: session.user })
        const syncResult = await syncUser(
          session.user.id,
          session.user.email || '',
          session.user.user_metadata?.displayName,
        )
        if (syncResult.success && syncResult.user) {
          set({ role: syncResult.user.role as Role })
        }
      } else {
        set({ session: null, user: null, role: null })
      }

      set({ isLoading: false })

      supabase.auth.onAuthStateChange(async (event, currentSession) => {
        if (event === 'INITIAL_SESSION') {
          return // Skip duplicate initial trigger to prevent double syncUser calls on mount
        }

        set({ session: currentSession, user: currentSession?.user ?? null })

        if (currentSession?.user) {
          set({ isLoading: true })
          const syncResult = await syncUser(
            currentSession.user.id,
            currentSession.user.email || '',
            currentSession.user.user_metadata?.displayName,
          )
          if (syncResult.success && syncResult.user) {
            set({ role: syncResult.user.role as Role })
          }
          set({ isLoading: false })
        } else {
          set({ role: null })
        }
      })
    } catch (err: any) {
      console.error('Error initializing auth state:', err)
      set({ error: err.message || 'Failed to initialize authentication state' })
    } finally {
      set({ isLoading: false })
    }
  },
}))
