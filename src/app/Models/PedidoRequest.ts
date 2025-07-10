import { DetallePedidoRequest} from './DetallePedidoRequest';

export interface PedidoRequest {
  usuarioId: number;
  metodoPagoId: number;
  detalles: DetallePedidoRequest[];
}
