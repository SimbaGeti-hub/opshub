import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { LucideDynamicIcon } from '@lucide/angular';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map } from 'rxjs';
import { CurrentUserStore } from '@opshub/web/auth';
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
  private readonly currentUserStore = inject(CurrentUserStore);

  private readonly profile = toSignal(
    this.oidcSecurityService.userData$.pipe(
      map(({ userData }) => userData as UserProfile | null),
    ),
    { initialValue: null },
  );

  protected readonly role = this.currentUserStore.role;

  protected readonly displayName = computed(() => {
    const profile = this.profile();
    return (
      this.currentUserStore.user()?.name ??
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
