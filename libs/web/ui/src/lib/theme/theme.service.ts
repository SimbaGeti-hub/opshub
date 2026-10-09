import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'opshub-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>(this.readStored());

  constructor() {
    effect(() => {
      const value = this.theme();
      const root = document.documentElement;

      if (value === 'system') {
        root.removeAttribute('data-theme');
      } else {
        root.setAttribute('data-theme', value);
      }

      localStorage.setItem(STORAGE_KEY, value);
    });
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
  }

  toggle(): void {
    const current = this.theme();
    const isDark =
      current === 'dark' ||
      (current === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    this.setTheme(isDark ? 'light' : 'dark');
  }

  private readStored(): Theme {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' || stored === 'system'
      ? stored
      : 'system';
  }
}
