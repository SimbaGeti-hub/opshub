import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconButtonVariant = 'primary' | 'ghost';
export type IconButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ops-icon-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      [attr.aria-label]="label()"
      [class]="classes()"
    >
      <ng-content />
    </button>
  `,
})
export class IconButton {
  label = input.required<string>();
  variant = input<IconButtonVariant>('ghost');
  size = input<IconButtonSize>('md');
  disabled = input<boolean>(false);
  type = input<'button' | 'submit' | 'reset'>('button');

  private readonly base =
    'inline-flex items-center justify-center rounded-[var(--radius-md)] transition-colors duration-[var(--motion-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:h-[1em] [&_svg]:w-[1em]';

  private readonly variants: Record<IconButtonVariant, string> = {
    primary:
      'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] focus-visible:ring-[var(--color-primary)]',
    ghost:
      'bg-transparent text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)] focus-visible:ring-[var(--color-primary)]',
  };

  private readonly sizes: Record<IconButtonSize, string> = {
    sm: 'h-8 w-8 text-base',
    md: 'h-10 w-10 text-lg',
    lg: 'h-12 w-12 text-xl',
  };

  classes(): string {
    return `${this.base} ${this.variants[this.variant()]} ${this.sizes[this.size()]}`;
  }
}
