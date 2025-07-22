import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-defense-strategy',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h1>Zombie Defense Strategy</h1>
    <form (ngSubmit)="onSubmit()" #strategyForm="ngForm">
      <div>
        <label for="bullets">Number of Bullets:</label>
        <input id="bullets" type="number" name="bullets" [(ngModel)]="bullets" required min="1" />
      </div>
      <div>
        <label for="secondsAvailable">Seconds Available:</label>
        <input id="secondsAvailable" type="number" name="secondsAvailable" [(ngModel)]="secondsAvailable" required min="1" />
      </div>
      <button type="submit">Get Strategy</button>
    </form>

    <div *ngIf="optimalStrategy">
      <h2>Optimal Strategy</h2>
      <pre>{{ optimalStrategy | json }}</pre>
    </div>

    <div *ngIf="historicalStrategies.length > 0">
      <h2>Historical Strategies</h2>
      <ul>
        <li *ngFor="let strategy of historicalStrategies">
          {{ strategy | json }}
        </li>
      </ul>
    </div>
  `,
  styles: [],
})
export class DefenseStrategyComponent {
  bullets: number = 100;
  secondsAvailable: number = 60;
  optimalStrategy: any = null;
  historicalStrategies: any[] = [];

  onSubmit() {
    // Dummy implementation for demonstration
    this.optimalStrategy = {
      bullets: this.bullets,
      seconds: this.secondsAvailable,
      action: 'Find high ground and conserve ammo.',
    };
    this.historicalStrategies.push(this.optimalStrategy);
  }
}