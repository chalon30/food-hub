import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PedidoTemporalService } from '../../Services/pedidos/pedido-temporal.service';
import { UsuarioService } from '../../Services/usuarios/usuario.service';
import { ProductoService } from '../../Services/productos/producto.service';
import { Producto } from '../../Models/Producto';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { DireccionService } from '../../Services/direccion/direccion.service';
import { PagosService } from '../../Services/pago/pago.service';
import { CarritoPagoRequestDTO } from '../../Models/CarritoPagoRequestDTO';
import { PreferenciaResponse } from '../../Models/PreferenciaResponse';
import { PedidoRequest } from '../../Models/PedidoRequest';

@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './pago.html',
  styleUrls: ['./pago.css']
})
export class PagoPage implements OnInit {
  pedidoTemporal: PedidoRequest | null = null;
  cargando = true;

  usuarioNombre = '';
  usuarioId: number | null = null;
  direccionId: number | null = null;
  direccionUsuario: {
    direccion: string;
    distrito: string;
    codigoPostal: string;
  } | null = null;

  productosDetallados: {
    nombre: string;
    precio: number;
    cantidad: number;
    subtotal: number;
  }[] = [];

  subtotal = 0;
  descuento = 0;
  total = 0;

  constructor(
    private pedidoTemporalService: PedidoTemporalService,
    private usuarioService: UsuarioService,
    private productoService: ProductoService,
    private direccionService: DireccionService,
    private pagosService: PagosService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarPedidoTemporal();
  }

  private cargarPedidoTemporal(): void {
    this.pedidoTemporal = this.pedidoTemporalService.obtenerPedidoTemporal();

    if (!this.pedidoTemporal) {
      this.snackBar.open('⚠️ No hay un pedido preparado. Por favor vuelve al carrito.', 'Cerrar', {
        duration: 5000
      });
      this.router.navigate(['/carrito']);
      return;
    }

    const usuario = this.usuarioService.getUsuarioActual();
    if (!usuario) {
      this.snackBar.open('⚠️ Usuario no identificado. Inicia sesión nuevamente.', 'Cerrar', {
        duration: 5000
      });
      this.router.navigate(['/login']);
      return;
    }

    this.usuarioNombre = usuario.nombre;
    this.usuarioId = usuario.id!;

    // ✅ Cargar dirección más reciente
    this.direccionService.obtenerDireccionesPorUsuario(usuario.id!).subscribe({
      next: (direcciones) => {
        if (direcciones.length > 0) {
          const ultima = direcciones[direcciones.length - 1];
          this.direccionUsuario = {
            direccion: ultima.direccion,
            distrito: ultima.distrito,
            codigoPostal: ultima.codigoPostal
          };
          this.direccionId = ultima.id ?? null;
        } else {
          this.direccionUsuario = null;
          this.direccionId = null;
        }
      },
      error: () => {
        this.direccionUsuario = null;
        this.direccionId = null;
        this.snackBar.open('❌ Error al obtener la dirección. Intenta nuevamente.', 'Cerrar', {
          duration: 5000
        });
      }
    });

    this.cargarDetallesDeProductos();
  }

  private cargarDetallesDeProductos(): void {
    if (!this.pedidoTemporal) return;

    this.cargando = true;

    const observables = this.pedidoTemporal.detalles.map((detalle) =>
      this.productoService.obtenerProducto(detalle.productoId)
    );

    forkJoin(observables).subscribe({
      next: (productos: Producto[]) => {
        this.productosDetallados = productos.map((producto, index) => {
          const detalle = this.pedidoTemporal!.detalles[index];
          const subtotal = this.redondear(producto.precio * detalle.cantidad);

          return {
            nombre: producto.nombre,
            precio: this.redondear(producto.precio),
            cantidad: detalle.cantidad,
            subtotal
          };
        });

        this.subtotal = this.redondear(
          this.productosDetallados.reduce((sum, item) => sum + item.subtotal, 0)
        );
        this.descuento = this.calcularDescuento(this.subtotal);
        this.total = this.redondear(this.subtotal - this.descuento);

        this.cargando = false;
      },
      error: () => {
        this.snackBar.open('❌ Error al cargar productos. Intenta de nuevo.', 'Cerrar', {
          duration: 5000
        });
        this.router.navigate(['/carrito']);
      }
    });
  }

  private calcularDescuento(subtotal: number): number {
    let descuento = 0;
    if (subtotal > 99) {
      descuento = subtotal * 0.2;
      if (descuento > 20) descuento = 20;
    }
    return this.redondear(descuento);
  }

  private redondear(valor: number): number {
    return parseFloat(valor.toFixed(2));
  }

  confirmarPago(): void {
    if (!this.pedidoTemporal || !this.usuarioId || !this.direccionId) {
      this.snackBar.open('⚠️ No se puede procesar el pago. Falta información.', 'Cerrar', {
        duration: 5000
      });
      return;
    }

    this.cargando = true;

    const carritoRequest: CarritoPagoRequestDTO = {
      usuarioId: this.usuarioId,
      direccionId: this.direccionId,
      detalles: this.pedidoTemporal.detalles
    };

    this.pagosService.generarPreferenciaPago(carritoRequest).subscribe({
      next: (preferencia: PreferenciaResponse) => {
        
        window.location.href = preferencia.initPoint;
      },
      error: () => {
        this.snackBar.open('❌ No se pudo iniciar el pago. Intenta nuevamente.', 'Cerrar', {
          duration: 5000
        });
        this.cargando = false;
      }
    });
  }
}
