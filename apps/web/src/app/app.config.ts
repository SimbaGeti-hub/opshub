import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideAppInitializer,
  inject,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  provideAuth,
  withAppInitializerAuthCheck,
  authInterceptor,
} from 'angular-auth-oidc-client';
import {
  provideLucideIcons,
  LucideLayoutDashboard,
  LucideListChecks,
  LucideBoxes,
  LucideUsers,
  LucideBarChart3,
  LucideFileText,
  LucideSettings,
  LucideCircleHelp,
  LucidePanelLeftOpen,
  LucidePanelLeftClose,
  LucideSearch,
  LucideSunMoon,
  LucideBell,
  LucideActivity,
  LucideTrendingUp,
  LucideTrendingDown,
  LucideMinus,
  LucideCircleCheck,
  LucideClock,
  LucideLogOut,
} from '@lucide/angular';
import { ThemeService } from '@opshub/web/ui';
import { appRoutes } from './app.routes';
import { authConfig } from './auth.config';
import { environment } from './environment';
import { API_BASE_URL } from '@opshub/web/data-access';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([authInterceptor()])),
    provideAuth({ config: authConfig }, withAppInitializerAuthCheck()),
    { provide: API_BASE_URL, useValue: environment.apiUrl },
    provideLucideIcons(
      LucideLayoutDashboard,
      LucideListChecks,
      LucideBoxes,
      LucideUsers,
      LucideBarChart3,
      LucideFileText,
      LucideSettings,
      LucideCircleHelp,
      LucidePanelLeftOpen,
      LucidePanelLeftClose,
      LucideSearch,
      LucideSunMoon,
      LucideBell,
      LucideActivity,
      LucideTrendingUp,
      LucideTrendingDown,
      LucideMinus,
      LucideCircleCheck,
      LucideClock,
      LucideLogOut,
    ),
    provideAppInitializer(() => {
      inject(ThemeService);
    }),
  ],
};
