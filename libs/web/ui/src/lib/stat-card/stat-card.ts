import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';

export type TrendDirection = 'up' | 'down' | 'neutral';

@Component({
  selector: 'ops-stat-card',
  standalone: true,
  imports: [LucideDynamicIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stat-card.html',
})
export class StatCard {
  label = input.required<string>();
  value = input.required<string>();
  icon = input<string>('activity');
  trendValue = input<string>('');
  trendDirection = input<TrendDirection>('neutral');
  comparisonLabel = input<string>('vs last month');

  trendIcon = computed(() => {
    const direction = this.trendDirection();
    if (direction === 'up') return 'trending-up';
    if (direction === 'down') return 'trending-down';
    return 'minus';
  });

  trendClasses = computed(() => {
    const direction = this.trendDirection();
    if (direction === 'up') return 'text-[var(--color-success)]';
    if (direction === 'down') return 'text-[var(--color-danger)]';
    return 'text-[var(--color-text-muted)]';
  });
}
