// src/app/Services/pedido/pedido.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { appsettings } from '../../Settings/appsettings';
import { PedidoRequest } from '../../Models/PedidoRequest';
import { PedidoResponse } from '../../Models/PedidoResponse';
import { PreferenciaResponse } from '../../Models/PreferenciaResponse';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private pedidosUrl = `${appsettings.apiUrl}pedidos`;
  private pagosUrl = `${appsettings.apiUrl}pagos`;

  constructor(private http: HttpClient) {}

  /** ✅ Crea un pedido en el backend */
  crearPedido(pedido: PedidoRequest): Observable<PedidoResponse> {
    return this.http.post<PedidoResponse>(this.pedidosUrl, pedido);
  }

  /** ✅ Obtiene un pedido por ID */
  obtenerPedidoPorId(id: number): Observable<PedidoResponse> {
    return this.http.get<PedidoResponse>(`${this.pedidosUrl}/${id}`);
  }

  /** ✅ NUEVO: Llama al endpoint /pagos/crear-preferencia del backend */
  crearPreferenciaPago(pedidoId: number): Observable<PreferenciaResponse> {
    return this.http.post<PreferenciaResponse>(
      `${appsettings.apiUrl}pagos/crear-preferencia`,
      { pedidoId }
    );
  }

  /** ✅ Obtener pedidos del usuario autenticado */
getMisPedidos(): Observable<PedidoResponse[]> {
  return this.http.get<PedidoResponse[]>(`${this.pedidosUrl}/mis`);
}
}
