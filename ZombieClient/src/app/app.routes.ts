import { Routes } from '@angular/router';
import { DefenseStrategyComponent } from './defense-strategy.component';

export const routes: Routes = [
  { path: 'defense-strategy', component: DefenseStrategyComponent },
  { path: '', redirectTo: '/defense-strategy', pathMatch: 'full' }
];
