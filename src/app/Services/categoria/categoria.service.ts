import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../../Models/Categoria';
import { ResponseAPI } from '../../Models/ResponseAPI';
import { appsettings } from '../../Settings/appsettings';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private http = inject(HttpClient);
  private apiUrl: string = `${appsettings.apiUrl}categorias`;

  constructor() {}

  // Obtener todas las categorías
  listar(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  // Obtener una categoría por ID
  obtenerCategoria(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva categoría
  crearCategoria(categoria: Categoria): Observable<ResponseAPI> {
    return this.http.post<ResponseAPI>(this.apiUrl, categoria);
  }

  // Editar una categoría
  editarCategoria(id: number, categoria: Categoria): Observable<ResponseAPI> {
    return this.http.put<ResponseAPI>(`${this.apiUrl}/${id}`, categoria);
  }

  // Eliminar una categoría
  eliminarCategoria(id: number): Observable<ResponseAPI> {
    return this.http.delete<ResponseAPI>(`${this.apiUrl}/${id}`);
  }
}
