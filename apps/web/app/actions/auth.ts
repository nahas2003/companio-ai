'use server'

import { prisma } from '@companio/db'

export async function syncUser(id: string, email: string, displayName?: string) {
  try {
    if (!id || !email) {
      throw new Error('Missing required id or email for user synchronization.')
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
    })

    if (existingUser) {
      return { success: true, user: existingUser, status: 'exists' }
    }

    const newUser = await prisma.user.create({
      data: {
        id,
        email,
        displayName: displayName || email.split('@')[0],
      },
    })

    console.log(`Successfully synchronized user: ${id} (${email})`)
    return { success: true, user: newUser, status: 'created' }
  } catch (error: any) {
    console.error('Error in syncUser server action:', error)
    return { success: false, error: error.message || 'Failed to synchronize user profile' }
  }
}
