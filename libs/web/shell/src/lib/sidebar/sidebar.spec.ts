import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import type { Role } from '@opshub/shared/models';
import { CurrentUserStore } from '@opshub/web/auth';
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
} from '@lucide/angular';
import { Sidebar } from './sidebar';

describe('Sidebar', () => {
  const mainNavLabels = async (role: Role | null): Promise<string[]> => {
    TestBed.configureTestingModule({
      imports: [Sidebar],
      providers: [
        provideRouter([]),
        {
          provide: CurrentUserStore,
          useValue: { role: signal<Role | null>(role) },
        },
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
        ),
      ],
    });

    const fixture = TestBed.createComponent(Sidebar);
    await fixture.whenStable();

    return Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('nav a'),
    ).map((link) => link.textContent?.trim() ?? '');
  };

  it('shows employees only the pages they may use', async () => {
    expect(await mainNavLabels('EMPLOYEE')).toEqual([
      'Dashboard',
      'Tasks',
      'Resources',
    ]);
  });

  it('adds team, analytics and reports for managers', async () => {
    expect(await mainNavLabels('MANAGER')).toEqual([
      'Dashboard',
      'Tasks',
      'Resources',
      'Team',
      'Analytics',
      'Reports',
    ]);
  });

  it('shows administrators everything managers see', async () => {
    expect(await mainNavLabels('ADMIN')).toEqual([
      'Dashboard',
      'Tasks',
      'Resources',
      'Team',
      'Analytics',
      'Reports',
    ]);
  });

  it('shows no pages while the role is still unknown', async () => {
    expect(await mainNavLabels(null)).toEqual([]);
  });
});
