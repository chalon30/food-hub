import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ProductoService } from '../../Services/productos/producto.service';
import { Producto } from '../../Models/Producto';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './productos.html',
  styleUrls: ['./productos.css'],
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.productoService.listar().subscribe({
      next: (data) => (this.productos = data.slice(0, 4)),
      error: (err) => console.error('Error al cargar productos', err),
    });
  }
}
