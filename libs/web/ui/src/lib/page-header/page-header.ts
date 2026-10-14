import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ops-page-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex flex-col gap-4 border-b border-[var(--color-border)] pb-6 sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="flex flex-col gap-1">
        <h1 class="text-2xl font-semibold text-[var(--color-text)]">
          {{ title() }}
        </h1>
        @if (description()) {
          <p class="text-sm text-[var(--color-text-muted)]">
            {{ description() }}
          </p>
        }
      </div>
      <div class="flex shrink-0 items-center gap-3">
        <ng-content />
      </div>
    </div>
  `,
})
export class PageHeader {
  title = input.required<string>();
  description = input<string>('');
}
