import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
})

export const getEnv = () => {
  const vars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }

  const result = envSchema.safeParse(vars)

  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join(', ')
    const errorMessage = `Environment validation failed: ${issues}`

    if (typeof window !== 'undefined') {
      console.error(errorMessage)
    } else {
      throw new Error(errorMessage)
    }
  }

  return {
    supabaseUrl: vars.NEXT_PUBLIC_SUPABASE_URL || '',
    supabaseAnonKey: vars.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  }
}
