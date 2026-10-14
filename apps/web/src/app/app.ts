import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Sidebar, TopNav } from '@opshub/web/shell';

@Component({
  imports: [RouterModule, Sidebar, TopNav],
  selector: 'ops-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'web';
}
