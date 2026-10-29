import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideDynamicIcon } from '@lucide/angular';

@Component({
  selector: 'ops-forbidden',
  standalone: true,
  imports: [RouterLink, LucideDynamicIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './forbidden.html',
})
export class Forbidden {}
