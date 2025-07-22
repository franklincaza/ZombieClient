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
  private baseUrl = 'https://zombiezonetest-enahb7hwdrdtfycq.canadacentral-01.azurewebsites.net/api/defense';
  // TODO: Reemplaza 'your-secret-api-key' con tu clave de API real.
  private apiKey = 'your-secret-api-key';

  constructor(private http: HttpClient) {}

  getOptimalStrategy(bullets: number, secondsAvailable: number): Observable<DefenseStrategy> {
    const headers = new HttpHeaders({
      'X-API-KEY': this.apiKey
    });
    const params = new HttpParams()
      .set('bullets', bullets.toString())
      .set('secondsAvailable', secondsAvailable.toString());
    const url = `${this.baseUrl}/optimal-strategy`;

    return this.http.get<DefenseStrategy>(url, { headers, params });
  }

  // Método para registrar una estrategia real (endpoint no especificado, se asume POST /api/defense/strategy)
  registerStrategy(strategy: DefenseStrategy): Observable<any> {
    const headers = new HttpHeaders({
      'X-API-KEY': this.apiKey,
      'Content-Type': 'application/json'
    });
    const url = `${this.baseUrl}/strategy`;

    return this.http.post(url, strategy, { headers });
  }

  // Nuevo método para obtener estrategias históricas
  getHistoricalStrategies(): Observable<DefenseStrategy[]> {
    const headers = new HttpHeaders({
      'X-API-KEY': this.apiKey
    });
    const url = `${this.baseUrl}/strategies`; // Asumiendo que este es el endpoint correcto para el historial

    return this.http.get<DefenseStrategy[]>(url, { headers });
  }
}
