import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { appsettings } from '../../Settings/appsettings';
import { MetodoPagoItem } from '../../Models/MetodoPagoItem';

@Injectable({
  providedIn: 'root',
})
export class MetodosPagoService {
  private http = inject(HttpClient);
  private apiUrl: string = `${appsettings.apiUrl}enums/metodos-pago`;

  constructor() {}

  listar(): Observable<MetodoPagoItem[]> {
    return this.http.get<MetodoPagoItem[]>(this.apiUrl);
  }
}
