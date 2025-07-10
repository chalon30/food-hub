import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../Services/productos/producto.service';
import { Producto } from '../../Models/Producto';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Location } from '@angular/common';
import { CarritoService } from '../../Services/carrito/carrito.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-detalle-producto',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './detalle-producto.html',
  styleUrls: ['./detalle-producto.css']
})
export class DetalleProductoComponent implements OnInit {
  producto!: Producto;
  cargando = true;
  usuarioLogeado = false;

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private location: Location,
    private carritoService: CarritoService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.verificarSesion();

    const id = this.route.snapshot.params['id'];
    this.productoService.obtenerProducto(id).subscribe({
      next: (data) => {
        this.producto = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar producto:', err);
        this.cargando = false;
      }
    });
  }

  verificarSesion(): void {
    if (typeof window !== 'undefined') {
      const usuario = localStorage.getItem('usuario');
      this.usuarioLogeado = !!usuario;
    }
  }

  volver(): void {
    this.location.back();
  }

  agregarAlCarrito(): void {
    if (!this.usuarioLogeado) {
      this.snackBar.open('Debes iniciar sesión para comprar', 'Iniciar sesión', {
        duration: 4000
      }).onAction().subscribe(() => {
        this.router.navigate(['/login']);
      });
      return;
    }

    if (!this.producto.disponible) {
      this.snackBar.open('Producto agotado', 'Cerrar', { duration: 3000 });
      return;
    }

    this.carritoService.agregarProducto(this.producto);
    this.snackBar.open('¡Agregado al carrito!', 'Ver carrito', {
      duration: 3000
    }).onAction().subscribe(() => {
      this.router.navigate(['/carrito']);
    });
  }

  comprarAhora(): void {
    if (!this.usuarioLogeado) {
      this.snackBar.open('Debes iniciar sesión para comprar', 'Iniciar sesión', {
        duration: 4000
      }).onAction().subscribe(() => {
        this.router.navigate(['/login']);
      });
      return;
    }

    if (!this.producto.disponible) {
      this.snackBar.open('Producto agotado', 'Cerrar', { duration: 3000 });
      return;
    }

    // ✅ Agrega al carrito y navega directo al carrito
    this.carritoService.agregarProducto(this.producto);
    this.router.navigate(['/carrito']);
  }
}
