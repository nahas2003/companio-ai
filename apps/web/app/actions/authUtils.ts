import { prisma } from '@companio/db'
import { createClient } from '@supabase/supabase-js'

const getSupabaseServerAdmin = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Missing Supabase URL or Anon Key for server verification.')
  }
  return createClient(url, key)
}

export async function getVerifiedUser(accessToken: string) {
  if (!accessToken) {
    throw new Error('Missing access token for authorization.')
  }

  const supabase = getSupabaseServerAdmin()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(accessToken)

  if (error || !user) {
    throw new Error('Invalid or expired session token. Please sign in again.')
  }

  // Lazy-provision / auto-sync user profile if they do not exist in PostgreSQL yet
  let dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  })

  if (!dbUser) {
    console.log(`Auto-syncing missing user profile for ${user.id} (${user.email})`)
    dbUser = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email!,
        displayName:
          user.user_metadata?.display_name ||
          user.user_metadata?.displayName ||
          user.email!.split('@')[0],
      },
    })

    // Trigger welcome notification
    try {
      const { triggerNotification } = await import('./notifications')
      await triggerNotification(dbUser.id, {
        title: 'Welcome to Companio AI!',
        message: `Hello ${dbUser.displayName || 'Learner'}, thank you for registering. Start uploading your study notes and generating customized practice decks to supercharge your learning!`,
        type: 'WELCOME',
      })
    } catch (notifErr) {
      console.error('Failed to trigger welcome notification:', notifErr)
    }
  }

  return dbUser
}
