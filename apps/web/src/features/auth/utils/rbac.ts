import { Role } from '@companio/db'
import { Permission, ROLE_PERMISSIONS } from '../types/rbac.types'

const ROLE_RANK: Record<Role, number> = {
  STUDENT: 1,
  INSTRUCTOR: 2,
  ADMIN: 3,
  SUPER_ADMIN: 4,
}

export function hasPermission(role: Role | null, permission: Permission): boolean {
  if (!role) return false
  const permissions = ROLE_PERMISSIONS[role]
  return permissions ? permissions.includes(permission) : false
}

export function hasRole(role: Role | null, requiredRole: Role): boolean {
  if (!role) return false
  return ROLE_RANK[role] >= ROLE_RANK[requiredRole]
}
