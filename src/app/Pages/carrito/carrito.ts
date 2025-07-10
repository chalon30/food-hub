import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../Services/carrito/carrito.service';
import { ProductoCarrito } from '../../Models/ProductoCarrito';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsuarioService } from '../../Services/usuarios/usuario.service';
import { PedidoTemporalService } from '../../Services/pedidos/pedido-temporal.service';
import { PedidoRequest } from '../../Models/PedidoRequest';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './carrito.html',
  styleUrls: ['./carrito.css'],
})
export class Carrito implements OnInit, OnDestroy {
  productos: ProductoCarrito[] = [];

  resumen = {
    subtotal: 'S/ 0.00',
    descuento: 'S/ 0.00',
    total: 'S/ 0.00',
  };

  private carritoSub: Subscription | null = null;

  constructor(
    private carritoService: CarritoService,
    private usuarioService: UsuarioService,
    private pedidoTemporalService: PedidoTemporalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carritoSub = this.carritoService.carrito$.subscribe((productos) => {
      this.productos = productos ?? [];
      this.actualizarResumen();
    });
  }

  ngOnDestroy(): void {
    this.carritoSub?.unsubscribe();
  }

  actualizarResumen(): void {
    const resumen = this.carritoService.getResumenConDescuento();

    this.resumen = {
      subtotal: `S/ ${resumen.subtotal.toFixed(2)}`,
      descuento: `S/ ${resumen.descuento.toFixed(2)}`,
      total: `S/ ${resumen.total.toFixed(2)}`,
    };
  }

  eliminarProducto(index: number): void {
    this.carritoService.eliminarProducto(index);
  }

  limpiarCarrito(): void {
    this.carritoService.limpiarCarrito();
  }

  aumentarCantidad(index: number): void {
    const item = this.productos[index];
    if (item) {
      this.carritoService.actualizarCantidad(index, item.cantidad + 1);
    }
  }

  disminuirCantidad(index: number): void {
    const item = this.productos[index];
    if (item) {
      if (item.cantidad > 1) {
        this.carritoService.actualizarCantidad(index, item.cantidad - 1);
      } else {
        this.eliminarProducto(index);
      }
    }
  }

  getTotalUnidades(): number {
    return this.productos.reduce((sum, item) => sum + item.cantidad, 0);
  }

  generarPedido(): void {
    if (this.productos.length === 0) {
      alert(
        'Tu carrito está vacío. Agrega productos antes de generar el pedido.'
      );
      return;
    }

    const usuario = this.usuarioService.getUsuarioActual();
    if (!usuario || !usuario.id) {
      alert(
        '⚠️ Error: No estás logueado. Por favor inicia sesión antes de hacer un pedido.'
      );
      this.router.navigate(['/login']);
      return;
    }

    const usuarioId = usuario.id;
    const metodoPagoId = 1;

    const detalles = this.productos.map((item) => ({
      productoId: item.producto.id,
      cantidad: item.cantidad,
    }));

    const pedido: PedidoRequest = {
      usuarioId,
      metodoPagoId,
      detalles,
    };

    this.pedidoTemporalService.guardarPedidoTemporal(pedido);
    this.carritoService.limpiarCarrito();

    alert(
      '✅ Tu pedido está casi listo. Por favor ingresa la dirección de entrega para continuar.'
    );
    this.router.navigate(['/direccion']);
  }
}
