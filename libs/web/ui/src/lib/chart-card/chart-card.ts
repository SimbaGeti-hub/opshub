import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ops-chart-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chart-card.html',
})
export class ChartCard {
  title = input.required<string>();
  description = input<string>('');
  loading = input<boolean>(false);
  empty = input<boolean>(false);
}
