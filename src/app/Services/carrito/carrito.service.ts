import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Producto } from '../../Models/Producto';
import { ProductoCarrito } from '../../Models/ProductoCarrito';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private storageKey = 'carrito';

  private carritoSubject!: BehaviorSubject<ProductoCarrito[]>;
  public carrito$!: Observable<ProductoCarrito[]>;

  constructor() {
    const inicial = this.isBrowser() ? this.cargarCarrito() : [];
    this.carritoSubject = new BehaviorSubject<ProductoCarrito[]>(inicial);
    this.carrito$ = this.carritoSubject.asObservable();
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  private cargarCarrito(): ProductoCarrito[] {
    try {
      const datos = localStorage.getItem(this.storageKey);
      const parsed = JSON.parse(datos ?? '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Error al parsear carrito desde localStorage:', e);
      return [];
    }
  }

  private guardarCarrito(carrito: ProductoCarrito[]): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.storageKey, JSON.stringify(carrito));
    }
    this.carritoSubject.next(carrito);
  }

  obtenerCarrito(): ProductoCarrito[] {
    return this.carritoSubject.getValue();
  }

  agregarProducto(producto: Producto): void {
    if (!producto || !producto.id || !producto.precio) {
      console.error('Producto inválido al agregar:', producto);
      return;
    }

    const carrito = this.obtenerCarrito();
    const index = carrito.findIndex((item) => item.producto.id === producto.id);

    if (index !== -1) {
      carrito[index].cantidad += 1;
    } else {
      carrito.push({ producto, cantidad: 1 });
    }

    this.guardarCarrito(carrito);
  }

  actualizarCantidad(index: number, nuevaCantidad: number): void {
    const carrito = this.obtenerCarrito();

    if (nuevaCantidad <= 0) {
      carrito.splice(index, 1);
    } else {
      carrito[index].cantidad = nuevaCantidad;
    }

    this.guardarCarrito(carrito);
  }

  eliminarProducto(index: number): void {
    const carrito = this.obtenerCarrito();
    carrito.splice(index, 1);
    this.guardarCarrito(carrito);
  }

  limpiarCarrito(): void {
    this.guardarCarrito([]);
  }

  /** 🔵 Helper para redondear a 2 decimales */
  private redondear(valor: number): number {
    return parseFloat(valor.toFixed(2));
  }

  /** ✅ Subtotal ya redondeado */
  getSubtotal(): number {
    const subtotal = this.obtenerCarrito().reduce(
      (sum, item) => sum + item.producto.precio * item.cantidad,
      0
    );
    return this.redondear(subtotal);
  }

  /** ✅ Resumen completo con descuento */
  getResumenConDescuento(): {
    subtotal: number;
    descuento: number;
    total: number;
  } {
    const subtotal = this.getSubtotal();
    let descuento = 0;

    if (subtotal > 99) {
      descuento = subtotal * 0.2;
      if (descuento > 20) {
        descuento = 20;
      }
    }

    const total = subtotal - descuento;

    return {
      subtotal: this.redondear(subtotal),
      descuento: this.redondear(descuento),
      total: this.redondear(total),
    };
  }

  /** ✅ Total para mostrar por separado */
  getTotal(): number {
    return this.getResumenConDescuento().total;
  }

  /** ✅ Detalles para crear PedidoRequest */
  getDetallesPedido(): { productoId: number; cantidad: number }[] {
    return this.obtenerCarrito().map((item) => ({
      productoId: item.producto.id,
      cantidad: item.cantidad,
    }));
  }
}
