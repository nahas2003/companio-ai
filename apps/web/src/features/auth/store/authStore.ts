import { create } from 'zustand'
import { getSupabaseClient } from '../../../lib/supabase'
import type { AuthState } from '../types/auth.types'
import { syncUser } from '../../../../app/actions/auth'

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  error: null,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
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
        await syncUser(
          session.user.id,
          session.user.email || '',
          session.user.user_metadata?.displayName,
        )
      } else {
        set({ session: null, user: null })
      }

      supabase.auth.onAuthStateChange(async (event, currentSession) => {
        set({ session: currentSession, user: currentSession?.user ?? null })

        if (event === 'SIGNED_IN' && currentSession?.user) {
          await syncUser(
            currentSession.user.id,
            currentSession.user.email || '',
            currentSession.user.user_metadata?.displayName,
          )
        }

        set({ isLoading: false })
      })
    } catch (err: any) {
      console.error('Error initializing auth state:', err)
      set({ error: err.message || 'Failed to initialize authentication state' })
    } finally {
      set({ isLoading: false })
    }
  },
}))
