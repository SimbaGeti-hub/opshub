import { Route } from '@angular/router';
import { authGuard } from '@opshub/web/auth';

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'login',
    loadComponent: () =>
      import('@opshub/web/feature-auth').then((m) => m.Login),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@opshub/web/feature-dashboard').then((m) => m.Dashboard),
  },
];
