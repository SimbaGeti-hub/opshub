import {
  PERMISSIONS,
  ROLE_PERMISSIONS,
  hasAnyPermission,
  hasPermission,
  type Permission,
} from './permissions';

describe('permissions', () => {
  it('grants every defined permission to at least one role', () => {
    const granted = new Set<Permission>([
      ...ROLE_PERMISSIONS.EMPLOYEE,
      ...ROLE_PERMISSIONS.MANAGER,
      ...ROLE_PERMISSIONS.ADMIN,
    ]);

    expect(
      PERMISSIONS.filter((permission) => !granted.has(permission)),
    ).toEqual([]);
  });

  it('keeps administrator only capabilities away from managers and employees', () => {
    const adminOnly: Permission[] = [
      'users:manage',
      'roles:manage',
      'departments:manage',
      'settings:manage',
      'audit:view',
      'analytics:view_all',
      'resources:manage',
    ];

    for (const permission of adminOnly) {
      expect(hasPermission('ADMIN', permission)).toBe(true);
      expect(hasPermission('MANAGER', permission)).toBe(false);
      expect(hasPermission('EMPLOYEE', permission)).toBe(false);
    }
  });

  it('keeps manager capabilities away from employees', () => {
    const managerLevel: Permission[] = [
      'tasks:create',
      'tasks:assign',
      'resources:approve',
      'team:view',
      'analytics:view_team',
      'reports:view',
    ];

    for (const permission of managerLevel) {
      expect(hasPermission('MANAGER', permission)).toBe(true);
      expect(hasPermission('EMPLOYEE', permission)).toBe(false);
    }
  });

  it('lets each role do everything the role below it can', () => {
    for (const permission of ROLE_PERMISSIONS.EMPLOYEE) {
      expect(hasPermission('MANAGER', permission)).toBe(true);
    }
    for (const permission of ROLE_PERMISSIONS.MANAGER) {
      expect(hasPermission('ADMIN', permission)).toBe(true);
    }
  });

  it('denies everything when there is no role', () => {
    expect(hasPermission(null, 'dashboard:view')).toBe(false);
    expect(hasPermission(undefined, 'dashboard:view')).toBe(false);
    expect(hasAnyPermission(null, ['dashboard:view', 'tasks:view'])).toBe(
      false,
    );
  });

  it('matches when any one permission in a list is held', () => {
    expect(hasAnyPermission('EMPLOYEE', ['users:manage', 'tasks:view'])).toBe(
      true,
    );
    expect(hasAnyPermission('EMPLOYEE', ['users:manage', 'audit:view'])).toBe(
      false,
    );
  });
});
