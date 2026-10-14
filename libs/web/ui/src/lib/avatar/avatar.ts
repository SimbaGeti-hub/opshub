import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

export type AvatarSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ops-avatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (imageUrl()) {
      <img [src]="imageUrl()" [alt]="name()" [class]="imageClasses()" />
    } @else {
      <span [class]="initialsClasses()">{{ initials() }}</span>
    }
  `,
})
export class Avatar {
  name = input.required<string>();
  imageUrl = input<string | undefined>(undefined);
  size = input<AvatarSize>('md');

  private readonly sizeClasses: Record<AvatarSize, string> = {
    sm: 'h-7 w-7 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  initials = computed(() => {
    const parts = this.name().trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
  });

  imageClasses(): string {
    return `inline-block rounded-full object-cover ${this.sizeClasses[this.size()]}`;
  }

  initialsClasses(): string {
    return `inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] font-medium text-white ${this.sizeClasses[this.size()]}`;
  }
}
