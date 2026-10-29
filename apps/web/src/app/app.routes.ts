import { Route } from '@angular/router';
import { authGuard, permissionGuard } from '@opshub/web/auth';

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'login',
    loadComponent: () =>
      import('@opshub/web/feature-auth').then((m) => m.Login),
  },
  {
    path: 'forbidden',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@opshub/web/feature-auth').then((m) => m.Forbidden),
  },
  {
    path: 'dashboard',
    canActivate: [permissionGuard('dashboard:view')],
    loadComponent: () =>
      import('@opshub/web/feature-dashboard').then((m) => m.Dashboard),
  },
];
