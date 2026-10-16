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
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
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
    provideCharts(withDefaultRegisterables()),
    provideAppInitializer(() => {
      inject(ThemeService);
    }),
  ],
};
