import {
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import type { Permission } from '@opshub/shared/models';
import type {
  AuthenticatedRequest,
  AuthenticatedUser,
} from './authenticated-user';
import { PermissionsGuard } from './permissions.guard';
import { IS_PUBLIC_KEY } from './public.decorator';
import { REQUIRED_PERMISSIONS_KEY } from './require-permissions.decorator';

const userWithRole = (role: AuthenticatedUser['role']): AuthenticatedUser => ({
  id: 'u1',
  keycloakId: 'kc1',
  email: `${role.toLowerCase()}@opshub.local`,
  name: role,
  role,
});

describe('PermissionsGuard', () => {
  let metadata: Record<string, unknown>;
  let guard: PermissionsGuard;

  const contextFor = (user?: AuthenticatedUser) => {
    const request: AuthenticatedRequest = { headers: {}, user };
    return {
      getHandler: () => undefined,
      getClass: () => undefined,
      switchToHttp: () => ({ getRequest: () => request }),
    } as unknown as ExecutionContext;
  };

  const require = (...permissions: Permission[]) => {
    metadata[REQUIRED_PERMISSIONS_KEY] = permissions;
  };

  beforeEach(() => {
    metadata = {};
    const reflector = {
      getAllAndOverride: jest.fn((key: string) => metadata[key]),
    };
    guard = new PermissionsGuard(reflector as never);
  });

  it('lets public routes through', () => {
    metadata[IS_PUBLIC_KEY] = true;
    require('users:manage');

    expect(guard.canActivate(contextFor())).toBe(true);
  });

  it('lets any signed in user through when no permission is declared', () => {
    expect(guard.canActivate(contextFor(userWithRole('EMPLOYEE')))).toBe(true);
  });

  it('allows a role that holds the required permission', () => {
    require('users:manage');

    expect(guard.canActivate(contextFor(userWithRole('ADMIN')))).toBe(true);
  });

  it('forbids an employee from administrator routes', () => {
    require('users:manage');

    expect(() =>
      guard.canActivate(contextFor(userWithRole('EMPLOYEE'))),
    ).toThrow(ForbiddenException);
  });

  it('forbids a manager from administrator routes', () => {
    require('audit:view');

    expect(() =>
      guard.canActivate(contextFor(userWithRole('MANAGER'))),
    ).toThrow(ForbiddenException);
  });

  it('requires every listed permission, not just one', () => {
    require('tasks:view', 'users:manage');

    expect(() =>
      guard.canActivate(contextFor(userWithRole('EMPLOYEE'))),
    ).toThrow(ForbiddenException);
    expect(guard.canActivate(contextFor(userWithRole('ADMIN')))).toBe(true);
  });

  it('rejects a protected route when no user was attached', () => {
    require('tasks:view');

    expect(() => guard.canActivate(contextFor())).toThrow(
      UnauthorizedException,
    );
  });

  it('does not reveal which permission was missing', () => {
    require('users:manage');

    expect(() =>
      guard.canActivate(contextFor(userWithRole('EMPLOYEE'))),
    ).toThrow('You do not have permission to perform this action');
  });
});
