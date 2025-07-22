import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DefenseStrategyComponent } from './defense-strategy.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DefenseStrategyComponent],
  template: `
    <app-defense-strategy></app-defense-strategy>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = signal('ZombieClient');
}
