'use server'

import { prisma } from '@companio/db'
import { getVerifiedUser } from './authUtils'

/**
 * Core utility to generate notifications & mock deliver emails based on preferences.
 */
export async function triggerNotification(
  userId: string,
  payload: {
    title: string
    message: string
    type:
      | 'WELCOME'
      | 'ASSESSMENT_PUBLISHED'
      | 'ASSESSMENT_REMINDER'
      | 'ASSESSMENT_COMPLETED'
      | 'RESULTS_AVAILABLE'
      | 'PASSWORD_RESET'
      | 'ACCOUNT_VERIFICATION'
      | 'SYSTEM'
  },
) {
  try {
    // 1. Resolve or create default preferences
    let prefs = await prisma.notificationPreference.findUnique({
      where: { userId },
    })

    if (!prefs) {
      prefs = await prisma.notificationPreference.create({
        data: {
          userId,
          emailEnabled: true,
          inAppEnabled: true,
          reminderPreferences: 'daily',
        },
      })
    }

    let createdNotificationId = ''

    // 2. Create in-app notification if enabled
    if (prefs.inAppEnabled) {
      const notif = await prisma.notification.create({
        data: {
          userId,
          title: payload.title,
          message: payload.message,
          type: payload.type,
          read: false,
        },
      })
      createdNotificationId = notif.id

      // Log successful in-app delivery
      await prisma.notificationHistory.create({
        data: {
          notificationId: notif.id,
          channel: 'IN_APP',
          status: 'SENT',
        },
      })
    }

    // 3. Mock Email Delivery if enabled
    if (prefs.emailEnabled) {
      // If we did not create an in-app notification, we need a parent Notification record for delivery logging
      let notifId = createdNotificationId
      if (!notifId) {
        const notif = await prisma.notification.create({
          data: {
            userId,
            title: payload.title,
            message: payload.message,
            type: payload.type,
            read: true,
            deleted: true, // hide from inbox
          },
        })
        notifId = notif.id
      }

      console.log(`[MOCK EMAIL SERVICE] Sending email to User: ${userId}`)
      console.log(`Subject: ${payload.title}`)
      console.log(`Body: ${payload.message}`)

      // Log email delivery history
      await prisma.notificationHistory.create({
        data: {
          notificationId: notifId,
          channel: 'EMAIL',
          status: 'SENT',
        },
      })
    }

    return { success: true }
  } catch (error: any) {
    console.error('Error triggering notification:', error)
    return { success: false, error: error.message }
  }
}

export async function getNotificationsAction(accessToken: string) {
  try {
    const verifiedUser = await getVerifiedUser(accessToken)

    const notifications = await prisma.notification.findMany({
      where: { userId: verifiedUser.id, deleted: false },
      orderBy: { createdAt: 'desc' },
    })

    const unreadCount = await prisma.notification.count({
      where: { userId: verifiedUser.id, deleted: false, read: false },
    })

    return {
      success: true,
      notifications: notifications.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type,
        read: n.read,
        createdAt: n.createdAt,
      })),
      unreadCount,
    }
  } catch (error: any) {
    console.error('Error fetching notifications:', error)
    return { success: false, error: error.message || 'Failed to load notifications.' }
  }
}

export async function markNotificationReadAction(accessToken: string, notificationId: string) {
  try {
    const verifiedUser = await getVerifiedUser(accessToken)

    const updated = await prisma.notification.updateMany({
      where: { id: notificationId, userId: verifiedUser.id },
      data: { read: true },
    })

    return { success: true, count: updated.count }
  } catch (error: any) {
    console.error('Error marking notification read:', error)
    return { success: false, error: error.message }
  }
}

export async function markAllNotificationsReadAction(accessToken: string) {
  try {
    const verifiedUser = await getVerifiedUser(accessToken)

    const updated = await prisma.notification.updateMany({
      where: { userId: verifiedUser.id, read: false, deleted: false },
      data: { read: true },
    })

    return { success: true, count: updated.count }
  } catch (error: any) {
    console.error('Error marking all notifications read:', error)
    return { success: false, error: error.message }
  }
}

export async function deleteNotificationAction(accessToken: string, notificationId: string) {
  try {
    const verifiedUser = await getVerifiedUser(accessToken)

    const updated = await prisma.notification.updateMany({
      where: { id: notificationId, userId: verifiedUser.id },
      data: { deleted: true },
    })

    return { success: true, count: updated.count }
  } catch (error: any) {
    console.error('Error deleting notification:', error)
    return { success: false, error: error.message }
  }
}

export async function getNotificationPreferencesAction(accessToken: string) {
  try {
    const verifiedUser = await getVerifiedUser(accessToken)

    let prefs = await prisma.notificationPreference.findUnique({
      where: { userId: verifiedUser.id },
    })

    if (!prefs) {
      prefs = await prisma.notificationPreference.create({
        data: {
          userId: verifiedUser.id,
          emailEnabled: true,
          inAppEnabled: true,
          reminderPreferences: 'daily',
        },
      })
    }

    return {
      success: true,
      preferences: {
        emailEnabled: prefs.emailEnabled,
        inAppEnabled: prefs.inAppEnabled,
        reminderPreferences: prefs.reminderPreferences,
      },
    }
  } catch (error: any) {
    console.error('Error retrieving notification preferences:', error)
    return { success: false, error: error.message || 'Failed to load preferences.' }
  }
}

export async function updateNotificationPreferencesAction(
  accessToken: string,
  payload: {
    emailEnabled: boolean
    inAppEnabled: boolean
    reminderPreferences: string
  },
) {
  try {
    const verifiedUser = await getVerifiedUser(accessToken)

    const updated = await prisma.notificationPreference.upsert({
      where: { userId: verifiedUser.id },
      update: {
        emailEnabled: payload.emailEnabled,
        inAppEnabled: payload.inAppEnabled,
        reminderPreferences: payload.reminderPreferences,
      },
      create: {
        userId: verifiedUser.id,
        emailEnabled: payload.emailEnabled,
        inAppEnabled: payload.inAppEnabled,
        reminderPreferences: payload.reminderPreferences,
      },
    })

    return { success: true }
  } catch (error: any) {
    console.error('Error updating notification preferences:', error)
    return { success: false, error: error.message || 'Failed to update preferences.' }
  }
}
