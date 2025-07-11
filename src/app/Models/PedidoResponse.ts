import { Usuario } from './Usuario';
import { DetallePedidoResponse } from './DetallePedidoResponse';
import { EnumItem } from './EnumItem'; // importa aquí

export interface PedidoResponse {
  id: number;
  fecha: string;
  total: number;
  usuario: Usuario;
  detalles: DetallePedidoResponse[];
  descuento: number;
  estado: EnumItem; // <-- aquí está lo importante
}
