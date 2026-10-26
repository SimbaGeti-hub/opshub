import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { Sidebar, TopNav } from '@opshub/web/shell';

@Component({
  imports: [RouterModule, Sidebar, TopNav],
  selector: 'ops-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'web';

  private readonly router = inject(Router);

  protected readonly showShell = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => !event.urlAfterRedirects.startsWith('/login')),
    ),
    { initialValue: true },
  );
}
