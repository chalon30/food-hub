import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../../Models/Producto';
import { ResponseAPI } from '../../Models/ResponseAPI';
import { appsettings } from '../../Settings/appsettings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private http = inject(HttpClient);
  private apiUrl: string = `${appsettings.apiUrl}productos`;

  constructor() {}

  // ✅ Obtener todos los productos
  listar(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  // ✅ Obtener un producto por ID
  obtenerProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  // ✅ Crear un nuevo producto (requiere FormData por la imagen)
  crearProducto(formData: FormData): Observable<ResponseAPI> {
    return this.http.post<ResponseAPI>(this.apiUrl, formData);
  }

  // ✅ Editar un producto (PUT con FormData)
  editarProducto(id: number, formData: FormData): Observable<ResponseAPI> {
    return this.http.put<ResponseAPI>(`${this.apiUrl}/${id}`, formData);
  }

  // ✅ Eliminar un producto por ID
  eliminarProducto(id: number): Observable<ResponseAPI> {
    return this.http.delete<ResponseAPI>(`${this.apiUrl}/${id}`);
  }
}
