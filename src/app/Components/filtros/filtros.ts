import { Component, EventEmitter, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CategoriaService } from '../../Services/categoria/categoria.service';
import { Categoria } from '../../Models/Categoria';

@Component({
  selector: 'app-filtros',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatButtonModule],
  templateUrl: './filtros.html',
  styleUrls: ['./filtros.css'],
})
export class Filtros implements OnInit {
  private categoriaService = inject(CategoriaService);

  categorias: Categoria[] = [];
  categoriaSeleccionada: number | null = null;

  @Output() filtrar = new EventEmitter<string>();

  ngOnInit(): void {
    this.categoriaService.listar().subscribe({
      next: (data) => this.categorias = data,
      error: () => alert('Error al cargar categorías')
    });
  }

  aplicarFiltro() {
    if (this.categoriaSeleccionada !== null) {
      const categoria = this.categorias.find(c => c.id === this.categoriaSeleccionada);
      this.filtrar.emit(categoria?.nombre || 'todas');
    } else {
      this.filtrar.emit('todas');
    }
  }

  limpiarFiltro() {
    this.categoriaSeleccionada = null;
    this.filtrar.emit('todas'); // Emitir string consistente
  }
}
