import { createClient } from '@supabase/supabase-js'
import { getEnv } from './env'

let supabaseClient: ReturnType<typeof createClient> | null = null

export const getSupabaseClient = () => {
  if (supabaseClient) return supabaseClient

  const { supabaseUrl, supabaseAnonKey } = getEnv()
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  return supabaseClient
}
