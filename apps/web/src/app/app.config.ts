import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideAppInitializer,
  inject,
} from '@angular/core';
import { provideRouter } from '@angular/router';
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
} from '@lucide/angular';
import { ThemeService } from '@opshub/web/ui';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
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
    ),
    provideAppInitializer(() => {
      inject(ThemeService);
    }),
  ],
};
