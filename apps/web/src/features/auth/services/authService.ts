import { getSupabaseClient } from '../../../lib/supabase'
import { useAuthStore } from '../store/authStore'
import type { LoginCredentials, RegisterCredentials } from '../types/auth.types'

export const authService = {
  async signUp({ email, password, displayName }: RegisterCredentials) {
    const supabase = getSupabaseClient()
    useAuthStore.getState().setLoading(true)
    useAuthStore.getState().setError(null)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            displayName: displayName || email.split('@')[0],
          },
        },
      })

      if (error) throw error
      return { success: true, user: data.user }
    } catch (err: any) {
      console.error('SignUp error:', err)
      useAuthStore.getState().setError(err.message || 'Failed to register account')
      return { success: false, error: err.message }
    } finally {
      useAuthStore.getState().setLoading(false)
    }
  },

  async signIn({ email, password }: LoginCredentials) {
    const supabase = getSupabaseClient()
    useAuthStore.getState().setLoading(true)
    useAuthStore.getState().setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      return { success: true, session: data.session, user: data.user }
    } catch (err: any) {
      console.error('SignIn error:', err)
      useAuthStore.getState().setError(err.message || 'Failed to sign in')
      return { success: false, error: err.message }
    } finally {
      useAuthStore.getState().setLoading(false)
    }
  },

  async signOut() {
    const supabase = getSupabaseClient()
    useAuthStore.getState().setLoading(true)
    useAuthStore.getState().setError(null)

    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      useAuthStore.getState().setUser(null)
      useAuthStore.getState().setSession(null)
      return { success: true }
    } catch (err: any) {
      console.error('SignOut error:', err)
      useAuthStore.getState().setError(err.message || 'Failed to sign out')
      return { success: false, error: err.message }
    } finally {
      useAuthStore.getState().setLoading(false)
    }
  },
}
