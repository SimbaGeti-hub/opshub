import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';
import { Avatar, IconButton, ThemeService } from '@opshub/web/ui';

@Component({
  selector: 'ops-top-nav',
  standalone: true,
  imports: [LucideDynamicIcon, Avatar, IconButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './top-nav.html',
})
export class TopNav {
  private readonly themeService = inject(ThemeService);

  toggleTheme(): void {
    this.themeService.toggle();
  }
}
