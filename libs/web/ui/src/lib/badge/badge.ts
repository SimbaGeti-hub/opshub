import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

@Component({
  selector: 'ops-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span [class]="classes()">
      <ng-content />
    </span>
  `,
})
export class Badge {
  tone = input<BadgeTone>('neutral');

  private readonly base =
    'inline-flex items-center rounded-[var(--radius-sm)] px-2 py-0.5 text-xs font-medium';

  private readonly tones: Record<BadgeTone, string> = {
    neutral:
      'bg-[var(--color-bg)] text-[var(--color-text-muted)] border border-[var(--color-border)]',
    success: 'bg-[var(--color-success-bg)] text-[var(--color-success)]',
    warning: 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]',
    danger: 'bg-[var(--color-danger-bg)] text-[var(--color-danger)]',
    info: 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]',
  };

  classes(): string {
    return `${this.base} ${this.tones[this.tone()]}`;
  }
}
