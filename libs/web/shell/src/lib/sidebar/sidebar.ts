import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { hasPermission, type Permission } from '@opshub/shared/models';
import { CurrentUserStore } from '@opshub/web/auth';
import { IconButton } from '@opshub/web/ui';
import { LucideDynamicIcon } from '@lucide/angular';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  /** The permission needed to see this item. Omit it for items everyone may see. */
  permission?: Permission;
}

@Component({
  selector: 'ops-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconButton, LucideDynamicIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.html',
})
export class Sidebar {
  private readonly currentUserStore = inject(CurrentUserStore);

  collapsed = signal(false);

  private readonly mainNav: NavItem[] = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'layout-dashboard',
      permission: 'dashboard:view',
    },
    {
      label: 'Tasks',
      path: '/tasks',
      icon: 'list-checks',
      permission: 'tasks:view',
    },
    {
      label: 'Resources',
      path: '/resources',
      icon: 'boxes',
      permission: 'resources:view',
    },
    { label: 'Team', path: '/team', icon: 'users', permission: 'team:view' },
    {
      label: 'Analytics',
      path: '/analytics',
      icon: 'bar-chart-3',
      permission: 'analytics:view_team',
    },
    {
      label: 'Reports',
      path: '/reports',
      icon: 'file-text',
      permission: 'reports:view',
    },
  ];

  protected readonly visibleMainNav = computed(() => {
    const role = this.currentUserStore.role();
    return this.mainNav.filter(
      (item) => !item.permission || hasPermission(role, item.permission),
    );
  });

  readonly secondaryNav: NavItem[] = [
    { label: 'Settings', path: '/settings', icon: 'settings' },
    { label: 'Help', path: '/help', icon: 'circle-help' },
  ];

  toggle(): void {
    this.collapsed.update((value) => !value);
  }
}
