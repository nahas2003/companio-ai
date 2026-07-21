import { Role, prisma } from '@companio/db'
import { Permission, ROLE_PERMISSIONS } from '../types/rbac.types'

export type OrgRole = 'OWNER' | 'ADMIN' | 'INSTRUCTOR' | 'MEMBER'

// Maintain existing global Role based permissions check
export function hasPermission(role: Role, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role] || []
  return permissions.includes(permission)
}

// Add new database organization-scoped RBAC checks
export const rbac = {
  async checkPermission(
    userId: string,
    organizationId: string,
    minRole: OrgRole,
  ): Promise<boolean> {
    try {
      const mapping = await prisma.userOrganization.findUnique({
        where: {
          organizationId_userId: {
            organizationId,
            userId,
          },
        },
      })

      if (!mapping) return false

      const roleHierarchy: Record<OrgRole, number> = {
        OWNER: 4,
        ADMIN: 3,
        INSTRUCTOR: 2,
        MEMBER: 1,
      }

      const userWeight = roleHierarchy[mapping.role as OrgRole] || 0
      const minWeight = roleHierarchy[minRole]

      return userWeight >= minWeight
    } catch (err) {
      console.error('RBAC validation check failed:', err)
      return false
    }
  },

  async getUserOrgs(userId: string) {
    try {
      return await prisma.userOrganization.findMany({
        where: { userId },
        include: { organization: true },
      })
    } catch (err) {
      console.error('Failed to load user organizations:', err)
      return []
    }
  },
}
