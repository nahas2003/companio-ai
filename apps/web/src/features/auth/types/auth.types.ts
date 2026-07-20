import type { User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js'

export interface UserProfile {
  id: string
  email: string
  displayName?: string | null
  avatarUrl?: string | null
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: SupabaseUser | null
  session: SupabaseSession | null
  isLoading: boolean
  error: string | null
  setUser: (user: SupabaseUser | null) => void
  setSession: (session: SupabaseSession | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  initAuth: () => Promise<void>
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  displayName?: string
}
