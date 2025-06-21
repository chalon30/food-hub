import { inject, Injectable } from '@angular/core';
import { appsettings } from '../../Settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../Models/Usuario';
import { ResponseAPI } from '../../Models/ResponseAPI';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl: string = appsettings.apiUrl + 'usuarios';
  private http = inject(HttpClient);
  constructor() {}

  listar() {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  obtenerUsuario(id: number) {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  crearUsuario(obj: Usuario) {
    return this.http.post<ResponseAPI>(this.apiUrl, obj);
  }

  eliminarUsuario(id: number) {
    return this.http.delete<ResponseAPI>(`${this.apiUrl}/${id}`);
  }
}
