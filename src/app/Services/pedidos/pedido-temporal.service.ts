import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PedidoRequest } from '../../Models/PedidoRequest';

@Injectable({
  providedIn: 'root',
})
export class PedidoTemporalService {
  private storageKey = 'pedidoTemporal';
  private platformId = inject(PLATFORM_ID);

  guardarPedidoTemporal(pedido: PedidoRequest): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.storageKey, JSON.stringify(pedido));
    }
  }

  obtenerPedidoTemporal(): PedidoRequest | null {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  limpiarPedidoTemporal(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.storageKey);
    }
  }
}
