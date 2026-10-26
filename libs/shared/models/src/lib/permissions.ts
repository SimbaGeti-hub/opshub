import type { Role } from './current-user';

export const PERMISSIONS = [
  'dashboard:view',
  'tasks:view',
  'tasks:update_status',
  'tasks:create',
  'tasks:assign',
  'resources:view',
  'resources:request',
  'resources:approve',
  'resources:manage',
  'team:view',
  'analytics:view_team',
  'analytics:view_all',
  'reports:view',
  'announcements:view',
  'activity:view_own',
  'users:manage',
  'roles:manage',
  'departments:manage',
  'settings:manage',
  'audit:view',
] as const;

export type Permission = (typeof PERMISSIONS)[number];

const EMPLOYEE_PERMISSIONS: readonly Permission[] = [
  'dashboard:view',
  'tasks:view',
  'tasks:update_status',
  'resources:view',
  'resources:request',
  'announcements:view',
  'activity:view_own',
];

const MANAGER_PERMISSIONS: readonly Permission[] = [
  ...EMPLOYEE_PERMISSIONS,
  'tasks:create',
  'tasks:assign',
  'resources:approve',
  'team:view',
  'analytics:view_team',
  'reports:view',
];

const ADMIN_PERMISSIONS: readonly Permission[] = [
  ...MANAGER_PERMISSIONS,
  'resources:manage',
  'analytics:view_all',
  'users:manage',
  'roles:manage',
  'departments:manage',
  'settings:manage',
  'audit:view',
];

export const ROLE_PERMISSIONS: Readonly<Record<Role, readonly Permission[]>> = {
  EMPLOYEE: EMPLOYEE_PERMISSIONS,
  MANAGER: MANAGER_PERMISSIONS,
  ADMIN: ADMIN_PERMISSIONS,
};

export function hasPermission(
  role: Role | null | undefined,
  permission: Permission,
): boolean {
  return role ? ROLE_PERMISSIONS[role].includes(permission) : false;
}

export function hasAnyPermission(
  role: Role | null | undefined,
  permissions: readonly Permission[],
): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}
