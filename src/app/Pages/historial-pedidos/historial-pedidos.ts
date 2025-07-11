import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../Services/pedidos/pedidos.service';
import { PedidoResponse } from '../../Models/PedidoResponse';

@Component({
  selector: 'app-historial-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial-pedidos.html',
  styleUrls: ['./historial-pedidos.css']
})
export class HistorialPedidos implements OnInit {
  pedidos: PedidoResponse[] = [];
  cargando = true;
  error = '';

  constructor(private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.getMisPedidos();
  }

  getMisPedidos(): void {
    this.cargando = true;
    this.pedidoService.getMisPedidos().subscribe({
      next: (data) => {
        console.log('Pedidos cargados:', data);
        this.pedidos = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar pedidos:', err);
        this.error = 'No se pudieron cargar tus pedidos.';
        this.cargando = false;
      },
      
    });
  }
}
