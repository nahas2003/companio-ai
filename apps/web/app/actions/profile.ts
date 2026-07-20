'use server'

import { prisma } from '@companio/db'
import { createClient } from '@supabase/supabase-js'

import { getVerifiedUser } from './authUtils'

export async function getUserProfile(accessToken: string) {
  try {
    const verifiedUser = await getVerifiedUser(accessToken)
    return { success: true, profile: verifiedUser }
  } catch (error: any) {
    console.error('Error in getUserProfile action:', error)
    return { success: false, error: error.message || 'Failed to fetch user profile' }
  }
}

export async function updateUserProfile(accessToken: string, displayName: string) {
  try {
    const verifiedUser = await getVerifiedUser(accessToken)

    if (!displayName || displayName.trim().length < 2) {
      throw new Error('Display name must be at least 2 characters.')
    }

    const updatedProfile = await prisma.user.update({
      where: { id: verifiedUser.id },
      data: {
        displayName: displayName.trim(),
      },
    })

    console.log(`Successfully updated profile for user: ${verifiedUser.id} to '${displayName}'`)
    return { success: true, profile: updatedProfile }
  } catch (error: any) {
    console.error('Error in updateUserProfile action:', error)
    return { success: false, error: error.message || 'Failed to update user profile' }
  }
}

import { Role } from '@companio/db'

export async function updateUserRole(accessToken: string, targetUserId: string, newRole: Role) {
  try {
    const verifiedUser = await getVerifiedUser(accessToken)

    const updaterProfile = await prisma.user.findUnique({
      where: { id: verifiedUser.id },
    })

    if (
      !updaterProfile ||
      (updaterProfile.role !== 'ADMIN' && updaterProfile.role !== 'SUPER_ADMIN')
    ) {
      throw new Error('Access denied. Administrative privileges required.')
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
    })

    console.log(`Administrator ${verifiedUser.id} updated user ${targetUserId} role to ${newRole}`)
    return { success: true, user: updatedUser }
  } catch (error: any) {
    console.error('Error in updateUserRole server action:', error)
    return { success: false, error: error.message || 'Failed to update user role' }
  }
}
