import { Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CurrentUserService } from '@opshub/web/data-access';
import {
  hasPermission,
  type CurrentUser,
  type Permission,
} from '@opshub/shared/models';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { catchError, of, shareReplay, switchMap, type Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CurrentUserStore {
  private readonly oidcSecurityService = inject(OidcSecurityService);
  private readonly currentUserService = inject(CurrentUserService);

  /**
   * The signed in user as the API knows them, or null when signed out or when
   * the API cannot be reached. Loaded once and replayed to every subscriber.
   */
  readonly user$: Observable<CurrentUser | null> =
    this.oidcSecurityService.isAuthenticated$.pipe(
      switchMap(({ isAuthenticated }) =>
        isAuthenticated
          ? this.currentUserService.getMe().pipe(catchError(() => of(null)))
          : of(null),
      ),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

  readonly user = toSignal(this.user$, { initialValue: null });
  readonly role = computed(() => this.user()?.role ?? null);

  can(permission: Permission): boolean {
    return hasPermission(this.role(), permission);
  }
}
