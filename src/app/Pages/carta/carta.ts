import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../Services/productos/producto.service';
import { Producto } from '../../Models/Producto';
import { Filtros } from '../../Components/filtros/filtros';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carta',
  standalone: true,
  imports: [
    CommonModule,
    Filtros,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './carta.html',
  styleUrls: ['./carta.css'],
})
export class CartaComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];

  constructor(
    private productoService: ProductoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.productoService.listar().subscribe({
      next: (data) => {
        this.productos = data;
        this.productosFiltrados = data;
      },
      error: () => console.error('Error al cargar productos'),
    });
  }

  filtrarCategoria(nombreCategoria: string): void {
    if (!nombreCategoria || nombreCategoria === 'todas') {
      this.productosFiltrados = this.productos;
    } else {
      this.productosFiltrados = this.productos.filter(
        (p) =>
          p.categoriaNombre?.toLowerCase() === nombreCategoria.toLowerCase()
      );
    }
  }

  verDetalle(producto: Producto): void {
    this.router.navigate(['/producto', producto.id]); // cambia 'detalle-producto' por 'producto'
  }
}
