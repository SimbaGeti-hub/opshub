import { TestBed } from '@angular/core/testing';
import { Router, provideRouter, type UrlTree } from '@angular/router';
import type { CurrentUser, Permission } from '@opshub/shared/models';
import { firstValueFrom, isObservable, of } from 'rxjs';
import { CurrentUserStore } from '../current-user.store';
import { permissionGuard } from './permission-guard';

jest.mock('angular-auth-oidc-client', () => ({
  OidcSecurityService: class {},
}));

const userWithRole = (role: CurrentUser['role']): CurrentUser => ({
  id: '1',
  email: `${role.toLowerCase()}@opshub.local`,
  name: role,
  role,
});

describe('permissionGuard', () => {
  const run = async (
    user: CurrentUser | null,
    ...permissions: Permission[]
  ) => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: CurrentUserStore, useValue: { user$: of(user) } },
      ],
    });

    const outcome = TestBed.runInInjectionContext(() =>
      permissionGuard(...permissions)({} as never, {} as never),
    );
    const result = isObservable(outcome)
      ? await firstValueFrom(outcome)
      : await outcome;

    return result === true
      ? true
      : TestBed.inject(Router).serializeUrl(result as UrlTree);
  };

  it('sends signed out visitors to the login page', async () => {
    expect(await run(null, 'dashboard:view')).toBe('/login');
  });

  it('allows a user who holds the permission', async () => {
    expect(await run(userWithRole('ADMIN'), 'users:manage')).toBe(true);
  });

  it('sends an employee away from administrator pages', async () => {
    expect(await run(userWithRole('EMPLOYEE'), 'users:manage')).toBe(
      '/forbidden',
    );
  });

  it('sends a manager away from administrator pages', async () => {
    expect(await run(userWithRole('MANAGER'), 'audit:view')).toBe('/forbidden');
  });

  it('requires every listed permission', async () => {
    expect(
      await run(userWithRole('EMPLOYEE'), 'tasks:view', 'users:manage'),
    ).toBe('/forbidden');
  });
});
