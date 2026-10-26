import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { LucideDynamicIcon } from '@lucide/angular';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { CurrentUserService } from '@opshub/web/data-access';
import { Avatar, Badge, IconButton, ThemeService } from '@opshub/web/ui';

interface UserProfile {
  name?: string;
  preferred_username?: string;
}

@Component({
  selector: 'ops-top-nav',
  standalone: true,
  imports: [LucideDynamicIcon, Avatar, Badge, IconButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './top-nav.html',
})
export class TopNav {
  private readonly themeService = inject(ThemeService);
  private readonly oidcSecurityService = inject(OidcSecurityService);
  private readonly currentUserService = inject(CurrentUserService);

  private readonly profile = toSignal(
    this.oidcSecurityService.userData$.pipe(
      map(({ userData }) => userData as UserProfile | null),
    ),
    { initialValue: null },
  );

  private readonly apiUser = toSignal(
    this.oidcSecurityService.isAuthenticated$.pipe(
      filter(({ isAuthenticated }) => isAuthenticated),
      switchMap(() =>
        this.currentUserService.getMe().pipe(catchError(() => of(null))),
      ),
    ),
    { initialValue: null },
  );

  protected readonly role = computed(() => this.apiUser()?.role ?? null);

  protected readonly displayName = computed(() => {
    const profile = this.profile();
    return (
      this.apiUser()?.name ??
      profile?.name ??
      profile?.preferred_username ??
      'User'
    );
  });

  toggleTheme(): void {
    this.themeService.toggle();
  }

  signOut(): void {
    this.oidcSecurityService.logoff().subscribe();
  }
}
