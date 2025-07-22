import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DefenseStrategy, DefenseStrategyService } from './defense-strategy.service';

@Component({
  selector: 'app-defense-strategy',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="zombie-container">
      <h2 class="zombie-title">🧟 Estrategias de Defensa Zombie 🧟</h2>
      <form (ngSubmit)="onSubmit()" #strategyForm="ngForm" class="zombie-form">
        <label>
          Balas:
          <input type="number" name="bullets" [(ngModel)]="bullets" required min="1" />
        </label>
        <label>
          Segundos Disponibles:
          <input type="number" name="secondsAvailable" [(ngModel)]="secondsAvailable" required min="1" />
        </label>
        <button type="button" (click)="getOptimalStrategy()" [disabled]="!strategyForm.form.valid" class="zombie-button">Obtener Estrategia Óptima</button>
        <button type="submit" [disabled]="!strategyForm.form.valid" class="zombie-button">Registrar Estrategia Real</button>
      </form>

      <div *ngIf="optimalStrategy" class="zombie-optimal">
        <h3>Estrategia Óptima</h3>
        <pre>{{ optimalStrategy | json }}</pre>
      </div>

      <div *ngIf="historicalStrategies.length > 0" class="zombie-historical">
        <h3>Ranking de Estrategias Históricas</h3>
        <ul>
          <li *ngFor="let strategy of historicalStrategies">
            🧟 Balas: {{ strategy.bullets }}, Segundos: {{ strategy.secondsAvailable }}
          </li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .zombie-container {
      background: linear-gradient(135deg, #2e2e2e, #1a1a1a);
      color: #7fff00;
      font-family: 'Creepster', cursive, 'Courier New', monospace;
      padding: 20px;
      border: 3px solid #4caf50;
      border-radius: 15px;
      max-width: 600px;
      margin: 20px auto;
      box-shadow: 0 0 15px #4caf50;
    }
    .zombie-title {
      text-align: center;
      font-size: 2.5em;
      text-shadow: 0 0 10px #7fff00, 0 0 20px #4caf50;
      margin-bottom: 20px;
    }
    .zombie-form {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 15px;
      margin-bottom: 20px;
    }
    label {
      color: #aaffaa;
      font-weight: bold;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    input {
      width: 6em;
      padding: 5px;
      border: 2px solid #4caf50;
      border-radius: 5px;
      background-color: #222;
      color: #7fff00;
      font-weight: bold;
      text-align: center;
      font-family: monospace;
      transition: border-color 0.3s ease;
    }
    input:focus {
      border-color: #7fff00;
      outline: none;
      box-shadow: 0 0 8px #7fff00;
    }
    .zombie-button {
      background-color: #4caf50;
      border: none;
      color: #1a1a1a;
      font-weight: bold;
      padding: 10px 15px;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.3s ease;
      box-shadow: 0 0 10px #4caf50;
    }
    .zombie-button:disabled {
      background-color: #2e2e2e;
      color: #555;
      cursor: not-allowed;
      box-shadow: none;
    }
    .zombie-button:hover:not(:disabled) {
      background-color: #7fff00;
      color: #1a1a1a;
      box-shadow: 0 0 15px #7fff00;
    }
    .zombie-optimal, .zombie-historical {
      background-color: #111;
      border: 2px solid #4caf50;
      border-radius: 10px;
      padding: 15px;
      box-shadow: 0 0 10px #4caf50;
      font-family: monospace;
      color: #7fff00;
    }
    ul {
      list-style: none;
      padding-left: 0;
    }
    li {
      padding: 5px 0;
      border-bottom: 1px solid #4caf50;
    }
    li:last-child {
      border-bottom: none;
    }
  `]
})
export class DefenseStrategyComponent implements OnInit {
  bullets: number | null = null;
  secondsAvailable: number | null = null;
  optimalStrategy: DefenseStrategy | null = null;
  historicalStrategies: DefenseStrategy[] = [];

  constructor(private defenseService: DefenseStrategyService) {}

  ngOnInit(): void {
    // Cargar estrategias históricas desde el backend
    this.defenseService.getHistoricalStrategies().subscribe({
      next: (strategies) => {
        this.historicalStrategies = strategies;
      },
      error: (err) => {
        console.error('Error al cargar estrategias históricas', err);
        this.historicalStrategies = [];
      }
    });
  }

  getOptimalStrategy(): void {
    if (this.bullets !== null && this.secondsAvailable !== null) {
      this.defenseService.getOptimalStrategy(this.bullets, this.secondsAvailable).subscribe({
        next: (strategy) => {
          this.optimalStrategy = strategy;
        },
        error: (err) => {
          if (err.status === 401) {
            alert('No autorizado: por favor verifica tu clave API.');
          } else {
            console.error('Error al obtener estrategia óptima', err);
          }
        }
      });
    }
  }

  onSubmit(): void {
    if (this.bullets !== null && this.secondsAvailable !== null) {
      const strategy: DefenseStrategy = {
        bullets: this.bullets,
        secondsAvailable: this.secondsAvailable,
        strategyDetails: this.optimalStrategy ? this.optimalStrategy.strategyDetails : null
      };
      this.defenseService.registerStrategy(strategy).subscribe({
        next: () => {
          alert('Estrategia registrada correctamente');
          // Actualizar ranking con la nueva estrategia
          this.historicalStrategies.push(strategy);
          // Ordenar ranking por balas y segundos
          this.historicalStrategies.sort((a, b) => {
            if (a.bullets !== b.bullets) return b.bullets - a.bullets;
            return b.secondsAvailable - a.secondsAvailable;
          });
        },
        error: (err) => {
          if (err.status === 401) {
            alert('No autorizado: por favor verifica tu clave API.');
          } else {
            console.error('Error al registrar estrategia', err);
            alert('Error al registrar estrategia');
          }
        }
      });
    }
  }
}
