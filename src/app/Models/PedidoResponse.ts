import { Usuario } from './Usuario';
import { DetallePedidoResponse } from './DetallePedidoResponse';

export interface PedidoResponse{
  id: number;
  fecha: string; // o Date si lo parseas
  total: number;
  usuario: Usuario;
  detalles: DetallePedidoResponse[];
  descuento: number;
}
