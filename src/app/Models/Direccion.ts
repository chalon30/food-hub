export interface Direccion {
    id?: number;
    usuarioId: number; // <-- lo nuevo
    direccion: string;
    distrito: string;
    codigoPostal: string;
}
