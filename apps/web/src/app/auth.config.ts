import { OpenIdConfiguration } from 'angular-auth-oidc-client';
import { environment } from './environment';

export const authConfig: OpenIdConfiguration = {
  authority: `${environment.keycloakUrl}/realms/${environment.keycloakRealm}`,
  redirectUrl: window.location.origin,
  postLogoutRedirectUri: window.location.origin,
  clientId: environment.keycloakClientId,
  scope: 'openid profile email',
  responseType: 'code',
  silentRenew: true,
  useRefreshToken: true,
  secureRoutes: [environment.apiUrl],
};
