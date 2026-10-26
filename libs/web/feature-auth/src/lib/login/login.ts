import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Button } from '@opshub/web/ui';

@Component({
  selector: 'ops-login',
  standalone: true,
  imports: [Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.html',
})
export class Login {
  private readonly oidcSecurityService = inject(OidcSecurityService);

  signIn(): void {
    this.oidcSecurityService.authorize();
  }
}
