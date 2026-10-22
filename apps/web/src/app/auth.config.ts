import { OpenIdConfiguration } from 'angular-auth-oidc-client';

export const authConfig: OpenIdConfiguration = {
  authority: 'http://localhost:8080/realms/opshub',
  redirectUrl: window.location.origin,
  postLogoutRedirectUri: window.location.origin,
  clientId: 'opshub-web',
  scope: 'openid profile email',
  responseType: 'code',
  silentRenew: true,
  useRefreshToken: true,
  secureRoutes: ['http://localhost:3000/api/v1'],
};
