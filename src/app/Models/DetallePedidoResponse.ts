import { Producto } from './Producto';

export interface DetallePedidoResponse{
  id: number;
  cantidad: number;
  subtotal: number;
  producto: Producto;
}
