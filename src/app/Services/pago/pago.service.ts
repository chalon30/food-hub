import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { appsettings } from '../../Settings/appsettings';
import { CarritoPagoRequestDTO } from '../../Models/CarritoPagoRequestDTO';

export interface PreferenciaResponse {
  id: string;
  initPoint: string;
}

@Injectable({
  providedIn: 'root',
})
export class PagosService {
  private http = inject(HttpClient);
  private apiUrl = `${appsettings.apiUrl}pagos`;

  constructor() {}

  generarPreferenciaPago(carrito: CarritoPagoRequestDTO): Observable<PreferenciaResponse> {
    return this.http.post<PreferenciaResponse>(
      `${this.apiUrl}/generar-preferencia`,
      carrito
    );
  }
}
