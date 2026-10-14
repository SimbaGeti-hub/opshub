import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconButton } from '@opshub/web/ui';
import { LucideIcon } from '@lucide/angular';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'ops-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconButton, LucideIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.html',
})
export class Sidebar {
  collapsed = signal(false);

  readonly mainNav: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: 'layout-dashboard' },
    { label: 'Tasks', path: '/tasks', icon: 'list-checks' },
    { label: 'Resources', path: '/resources', icon: 'boxes' },
    { label: 'Team', path: '/team', icon: 'users' },
    { label: 'Analytics', path: '/analytics', icon: 'bar-chart-3' },
    { label: 'Reports', path: '/reports', icon: 'file-text' },
  ];

  readonly secondaryNav: NavItem[] = [
    { label: 'Settings', path: '/settings', icon: 'settings' },
    { label: 'Help', path: '/help', icon: 'circle-help' },
  ];

  toggle(): void {
    this.collapsed.update((value) => !value);
  }
}
