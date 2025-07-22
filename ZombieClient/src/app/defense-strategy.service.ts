import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DefenseStrategy {
  bullets: number;
  secondsAvailable: number;
  strategyDetails: any; // Ajustar según la estructura real de la estrategia
}

@Injectable({
  providedIn: 'root'
})
export class DefenseStrategyService {
  private apiUrl = 'https://zombiezonetest-enahb7hwdrdtfycq.canadacentral-01.azurewebsites.net/api/defense/optimal-strategy';
  private apiKey = 'your-secret-api-key';

  constructor(private http: HttpClient) {}

  getOptimalStrategy(bullets: number, secondsAvailable: number): Observable<DefenseStrategy> {
    const headers = new HttpHeaders({
      'X-API-KEY': this.apiKey
    });
    const params = new HttpParams()
      .set('bullets', bullets.toString())
      .set('secondsAvailable', secondsAvailable.toString());

    return this.http.get<DefenseStrategy>(this.apiUrl, { headers, params });
  }

  // Método para registrar una estrategia real (endpoint no especificado, se asume POST /api/defense/strategy)
  registerStrategy(strategy: DefenseStrategy): Observable<any> {
    const headers = new HttpHeaders({
      'X-API-KEY': this.apiKey,
      'Content-Type': 'application/json'
    });
    const url = 'https://zombiezonetest-enahb7hwdrdtfycq.canadacentral-01.azurewebsites.net/api/defense/strategy'; // Ajustar si es otro endpoint

    return this.http.post(url, strategy, { headers });
  }

  // Nuevo método para obtener estrategias históricas
  getHistoricalStrategies(): Observable<DefenseStrategy[]> {
    const headers = new HttpHeaders({
      'X-API-KEY': this.apiKey
    });
    const url = 'https://zombiezonetest-enahb7hwdrdtfycq.canadacentral-01.azurewebsites.net/';

    return this.http.get<DefenseStrategy[]>(url, { headers });
  }
}
