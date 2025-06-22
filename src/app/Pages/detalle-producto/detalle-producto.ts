import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../Services/productos/producto.service';
import { Producto } from '../../Models/Producto';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Location } from '@angular/common';

@Component({
  selector: 'app-detalle-producto',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './detalle-producto.html',
  styleUrls: ['./detalle-producto.css']
})
export class DetalleProductoComponent implements OnInit {
  producto!: Producto;
  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private location: Location // ✅ Servicio para volver atrás
  ) {}

  ngOnInit(): void {
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

  // ✅ Método para volver a la página anterior
  volver(): void {
    this.location.back();
  }
}
