import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { PedidoTemporalService } from '../../Services/pedidos/pedido-temporal.service';

@Component({
  standalone: true,
  selector: 'app-pago-exito',
  imports: [CommonModule, RouterModule, MatButtonModule],
  templateUrl: './pago-exito.html',
  styleUrls: ['./pago-exito.css']
})
export class PagoExitoComponent implements OnInit {

  constructor(
    private pedidoTemporalService: PedidoTemporalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // ✅ Limpiar el pedido temporal aquí
    this.pedidoTemporalService.limpiarPedidoTemporal();
  }

  volverAlInicio(): void {
    this.router.navigate(['/']);
  }
}
