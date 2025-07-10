import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MetodosPagoService } from '../../Services/metodos-pago/metodos-pago.service';
import { MetodoPagoItem } from '../../Models/MetodoPagoItem';

@Component({
  selector: 'app-metodo-pago-selector',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatIconModule, FormsModule],
  templateUrl: './metodo-pago-selector.html',
  styleUrls: ['./metodo-pago-selector.css']
})
export class MetodoPagoSelectorComponent implements OnInit {
  metodos: MetodoPagoItem[] = [];
  metodoSeleccionado: number | null = null;

  @Output() metodoSeleccionadoChange = new EventEmitter<number>();

  constructor(private metodosPagoService: MetodosPagoService) {}

  ngOnInit(): void {
    this.metodosPagoService.listar().subscribe({
      next: (data) => this.metodos = data,
      error: (err) => console.error('Error al cargar métodos de pago', err)
    });
  }

  onSeleccionar(): void {
    if (this.metodoSeleccionado !== null) {
      this.metodoSeleccionadoChange.emit(this.metodoSeleccionado);
    }
  }
}
