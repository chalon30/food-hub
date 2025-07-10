import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appsettings } from '../../Settings/appsettings';
import { Direccion } from '../../Models/Direccion';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DireccionService {
  private http = inject(HttpClient);
  private apiUrl = `${appsettings.apiUrl}direcciones`;

  constructor() {}

  crearDireccion(direccion: Direccion): Observable<any> {
    return this.http.post<any>(this.apiUrl, direccion);
  }

  /** ✅ Obtener direcciones por usuario */
  obtenerDireccionesPorUsuario(usuarioId: number): Observable<Direccion[]> {
    return this.http.get<Direccion[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }
}
