'use server'

import { prisma, Role } from '@companio/db'
import { getVerifiedUser } from './authUtils'

/**
 * Restricts access to Admin/Super Admin roles
 */
async function verifyAdminRole(accessToken: string) {
  const verifiedUser = await getVerifiedUser(accessToken)
  if (verifiedUser.role !== Role.ADMIN && verifiedUser.role !== Role.SUPER_ADMIN) {
    throw new Error('Access denied. Administrative permissions required.')
  }
  return verifiedUser
}

/**
 * Logs an administrative action to the audit logs
 */
async function writeAuditLog(adminId: string, action: string, target: string, details: string) {
  try {
    await prisma.adminAuditLog.create({
      data: {
        adminId,
        action,
        target,
        details,
      },
    })
  } catch (err) {
    console.error('Failed to write admin audit log:', err)
  }
}

export async function getAdminUsersAction(accessToken: string, searchQuery = '', roleFilter = '') {
  try {
    await verifyAdminRole(accessToken)

    const whereClause: any = {}

    // Search query on display name or email
    if (searchQuery.trim()) {
      whereClause.OR = [
        { displayName: { contains: searchQuery.trim(), mode: 'insensitive' } },
        { email: { contains: searchQuery.trim(), mode: 'insensitive' } },
      ]
    }

    // Role filter
    if (roleFilter && roleFilter !== 'ALL') {
      whereClause.role = roleFilter as Role
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    })

    return {
      success: true,
      users: users.map((u) => ({
        id: u.id,
        email: u.email,
        displayName: u.displayName,
        role: u.role,
        active: u.active,
        createdAt: u.createdAt,
      })),
    }
  } catch (error: any) {
    console.error('Error loading admin users:', error)
    return { success: false, error: error.message || 'Failed to load user directory.' }
  }
}

export async function toggleUserStatusAction(accessToken: string, targetUserId: string) {
  try {
    const admin = await verifyAdminRole(accessToken)

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    })

    if (!targetUser) throw new Error('Target user not found.')
    if (targetUser.role === Role.SUPER_ADMIN) {
      throw new Error('Super Admin accounts cannot be deactivated.')
    }

    const newActiveState = !targetUser.active

    await prisma.user.update({
      where: { id: targetUserId },
      data: { active: newActiveState },
    })

    await writeAuditLog(
      admin.id,
      'TOGGLE_USER_STATUS',
      targetUserId,
      JSON.stringify({ email: targetUser.email, active: newActiveState }),
    )

    return { success: true, active: newActiveState }
  } catch (error: any) {
    console.error('Error toggling user status:', error)
    return { success: false, error: error.message }
  }
}

export async function updateAdminUserRoleAction(
  accessToken: string,
  targetUserId: string,
  newRole: Role,
) {
  try {
    const admin = await verifyAdminRole(accessToken)

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    })

    if (!targetUser) throw new Error('Target user not found.')
    if (targetUser.role === Role.SUPER_ADMIN && admin.role !== Role.SUPER_ADMIN) {
      throw new Error('Only Super Admins can modify other Super Admin accounts.')
    }

    await prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
    })

    await writeAuditLog(
      admin.id,
      'UPDATE_USER_ROLE',
      targetUserId,
      JSON.stringify({ email: targetUser.email, oldRole: targetUser.role, newRole }),
    )

    return { success: true }
  } catch (error: any) {
    console.error('Error updating user role:', error)
    return { success: false, error: error.message }
  }
}

export async function triggerPasswordResetAction(accessToken: string, targetUserId: string) {
  try {
    const admin = await verifyAdminRole(accessToken)

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    })

    if (!targetUser) throw new Error('Target user not found.')

    console.log(`[MOCK PASSWORD RESET] Triggered password reset email for user ${targetUser.email}`)

    await writeAuditLog(
      admin.id,
      'RESET_USER_PASSWORD',
      targetUserId,
      JSON.stringify({ email: targetUser.email }),
    )

    return { success: true }
  } catch (error: any) {
    console.error('Error resetting user password:', error)
    return { success: false, error: error.message }
  }
}

export async function getSystemSettingsAction(accessToken: string) {
  try {
    await verifyAdminRole(accessToken)

    // Load existing settings
    const settingsRows = await prisma.systemSetting.findMany()
    const flagsRows = await prisma.featureFlag.findMany()

    // Pre-populate defaults if database is empty
    const settings: Record<string, string> = {
      appName: 'Companio AI',
      brandingTheme: 'Dark Mode',
      defaultLanguage: 'en',
      timezone: 'UTC',
      uploadSizeLimit: '10MB',
      sessionTimeout: '30',
      aiProvider: 'Gemini',
      aiModel: 'gemini-1.5-pro',
      generationLimit: '20',
      requestTimeout: '60',
      retryCount: '3',
      allowedFileTypes: 'PDF, DOCX, TXT, MD',
    }

    const flags: Record<string, boolean> = {
      practiceMode: true,
      assessments: true,
      aiGeneration: true,
    }

    // Map rows if they exist in DB
    settingsRows.forEach((r) => {
      settings[r.key] = r.value
    })

    flagsRows.forEach((f) => {
      flags[f.key] = f.enabled
    })

    return { success: true, settings, flags }
  } catch (error: any) {
    console.error('Error loading system settings:', error)
    return { success: false, error: error.message || 'Failed to load settings.' }
  }
}

export async function updateSystemSettingsAction(
  accessToken: string,
  payload: {
    settings: Record<string, string>
    flags: Record<string, boolean>
  },
) {
  try {
    const admin = await verifyAdminRole(accessToken)

    // Save settings & flags in transaction upserts
    await prisma.$transaction(async (tx) => {
      // Upsert Settings
      for (const [key, value] of Object.entries(payload.settings)) {
        await tx.systemSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      }

      // Upsert Flags
      for (const [key, enabled] of Object.entries(payload.flags)) {
        await tx.featureFlag.upsert({
          where: { key },
          update: { enabled },
          create: { key, enabled },
        })
      }
    })

    await writeAuditLog(admin.id, 'UPDATE_SYSTEM_SETTINGS', 'SYSTEM', JSON.stringify(payload))

    return { success: true }
  } catch (error: any) {
    console.error('Error updating system settings:', error)
    return { success: false, error: error.message || 'Failed to save settings.' }
  }
}

export async function getAdminAuditLogsAction(accessToken: string) {
  try {
    await verifyAdminRole(accessToken)

    const logs = await prisma.adminAuditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    return {
      success: true,
      logs: logs.map((l) => ({
        id: l.id,
        adminId: l.adminId,
        action: l.action,
        target: l.target,
        details: l.details,
        createdAt: l.createdAt,
      })),
    }
  } catch (error: any) {
    console.error('Error fetching audit logs:', error)
    return { success: false, error: error.message || 'Failed to load audit trail logs.' }
  }
}

export async function purgeStaleGuestAttemptsAction(accessToken: string) {
  try {
    const admin = await verifyAdminRole(accessToken)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    const result = await prisma.assessmentAttempt.deleteMany({
      where: {
        userId: null,
        completedAt: {
          lt: thirtyDaysAgo,
        },
      },
    })

    await writeAuditLog(
      admin.id,
      'PURGE_GUEST_ATTEMPTS',
      'ATTEMPTS',
      `Purged guest attempts older than 30 days. Count: ${result.count}`,
    )

    return { success: true, count: result.count }
  } catch (error: any) {
    console.error('Error purging stale attempts:', error)
    return { success: false, error: error.message || 'Failed to purge stale attempts.' }
  }
}

export async function createOrganizationAction(accessToken: string, name: string) {
  try {
    const verifiedUser = await getVerifiedUser(accessToken)
    if (!name || name.trim().length === 0) {
      throw new Error('Organization name cannot be empty.')
    }

    const org = await prisma.$transaction(async (tx) => {
      const o = await tx.organization.create({
        data: { name: name.trim() },
      })
      await tx.userOrganization.create({
        data: {
          organizationId: o.id,
          userId: verifiedUser.id,
          role: 'OWNER',
        },
      })
      return o
    })

    return { success: true, organizationId: org.id }
  } catch (error: any) {
    console.error('Error creating organization:', error)
    return { success: false, error: error.message || 'Failed to create organization.' }
  }
}

export async function getOrganizationMembersAction(accessToken: string, organizationId: string) {
  try {
    const verifiedUser = await getVerifiedUser(accessToken)

    // Ensure user belongs to the organization
    const mapping = await prisma.userOrganization.findFirst({
      where: { organizationId, userId: verifiedUser.id },
    })
    if (!mapping) {
      throw new Error('Access denied. You do not belong to this organization.')
    }

    const members = await prisma.userOrganization.findMany({
      where: { organizationId },
      include: {
        user: {
          select: { id: true, email: true, displayName: true },
        },
      },
    })

    return {
      success: true,
      members: members.map((m) => ({
        id: m.id,
        userId: m.userId,
        email: m.user.email,
        displayName: m.user.displayName,
        role: m.role,
        createdAt: m.createdAt,
      })),
    }
  } catch (error: any) {
    console.error('Error listing organization members:', error)
    return { success: false, error: error.message || 'Failed to load organization members.' }
  }
}

export async function addMemberToOrganizationAction(
  accessToken: string,
  payload: { organizationId: string; email: string; role: string },
) {
  try {
    const verifiedUser = await getVerifiedUser(accessToken)

    // Check if user is OWNER or ADMIN
    const mapping = await prisma.userOrganization.findFirst({
      where: { organizationId: payload.organizationId, userId: verifiedUser.id },
    })
    if (!mapping || (mapping.role !== 'OWNER' && mapping.role !== 'ADMIN')) {
      throw new Error('Unauthorized. OWNER or ADMIN permissions required.')
    }

    const targetUser = await prisma.user.findUnique({
      where: { email: payload.email.trim() },
    })
    if (!targetUser) {
      throw new Error('User with this email does not exist.')
    }

    await prisma.userOrganization.create({
      data: {
        organizationId: payload.organizationId,
        userId: targetUser.id,
        role: payload.role.toUpperCase(),
      },
    })

    return { success: true }
  } catch (error: any) {
    console.error('Error adding organization member:', error)
    return { success: false, error: error.message || 'Failed to add organization member.' }
  }
}

export async function removeMemberFromOrganizationAction(
  accessToken: string,
  organizationId: string,
  memberUserId: string,
) {
  try {
    const verifiedUser = await getVerifiedUser(accessToken)

    // Check permissions: Must be OWNER or ADMIN
    const mapping = await prisma.userOrganization.findFirst({
      where: { organizationId, userId: verifiedUser.id },
    })
    if (!mapping || (mapping.role !== 'OWNER' && mapping.role !== 'ADMIN')) {
      throw new Error('Unauthorized. OWNER or ADMIN permissions required.')
    }

    // OWNER can remove anyone. ADMIN cannot remove OWNER.
    const targetMapping = await prisma.userOrganization.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId: memberUserId,
        },
      },
    })

    if (!targetMapping) throw new Error('Member not found in organization.')
    if (targetMapping.role === 'OWNER') {
      throw new Error('OWNER role cannot be removed from organization.')
    }
    if (targetMapping.role === 'ADMIN' && mapping.role !== 'OWNER') {
      throw new Error('Only the OWNER can remove ADMIN members.')
    }

    await prisma.userOrganization.delete({
      where: {
        organizationId_userId: {
          organizationId,
          userId: memberUserId,
        },
      },
    })

    return { success: true }
  } catch (error: any) {
    console.error('Error removing organization member:', error)
    return { success: false, error: error.message || 'Failed to remove member.' }
  }
}
