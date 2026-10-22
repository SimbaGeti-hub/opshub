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

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([authInterceptor()])),
    provideAuth({ config: authConfig }, withAppInitializerAuthCheck()),
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
