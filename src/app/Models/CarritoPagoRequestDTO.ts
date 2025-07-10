export interface CarritoPagoRequestDTO {
  usuarioId: number;
  direccionId: number;
  detalles: DetallePedidoRequestDTO[];
}

export interface DetallePedidoRequestDTO {
  productoId: number;
  cantidad: number;
}
