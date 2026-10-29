import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { hasPermission, type Permission } from '@opshub/shared/models';
import { map, take } from 'rxjs';
import { CurrentUserStore } from '../current-user.store';

/** Allows a route only when the signed in user holds every listed permission. */
export const permissionGuard =
  (...permissions: Permission[]): CanActivateFn =>
  () => {
    const store = inject(CurrentUserStore);
    const router = inject(Router);

    return store.user$.pipe(
      take(1),
      map((user) => {
        if (!user) {
          return router.createUrlTree(['/login']);
        }

        const allowed = permissions.every((permission) =>
          hasPermission(user.role, permission),
        );
        return allowed ? true : router.createUrlTree(['/forbidden']);
      }),
    );
  };
