import { Role } from '@companio/db'

export type Permission =
  | 'practice:create'
  | 'practice:view'
  | 'assessment:create'
  | 'assessment:edit'
  | 'assessment:publish'
  | 'assessment:view'
  | 'question-bank:create'
  | 'question-bank:edit'
  | 'admin:users'
  | 'admin:config'

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  STUDENT: ['practice:create', 'practice:view', 'assessment:view'],
  INSTRUCTOR: [
    'practice:create',
    'practice:view',
    'assessment:create',
    'assessment:edit',
    'assessment:publish',
    'assessment:view',
    'question-bank:create',
    'question-bank:edit',
  ],
  ADMIN: [
    'practice:create',
    'practice:view',
    'assessment:create',
    'assessment:edit',
    'assessment:publish',
    'assessment:view',
    'question-bank:create',
    'question-bank:edit',
    'admin:users',
  ],
  SUPER_ADMIN: [
    'practice:create',
    'practice:view',
    'assessment:create',
    'assessment:edit',
    'assessment:publish',
    'assessment:view',
    'question-bank:create',
    'question-bank:edit',
    'admin:users',
    'admin:config',
  ],
}
