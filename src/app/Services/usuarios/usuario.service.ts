import { inject, Injectable } from '@angular/core';
import { appsettings } from '../../Settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../Models/Usuario';
import { ResponseAPI } from '../../Models/ResponseAPI';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl: string = appsettings.apiUrl + 'usuarios';
  private http = inject(HttpClient);

  constructor() {}

  // ✅ Login
  login(correo: string, clave: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, { correo, clave });
  }

  // ✅ Registro
  register(usuario: Usuario) {
  return this.http.post<{ mensaje: string; usuario: Usuario }>(
    this.apiUrl + '/register',
    usuario
  );
}

  // ✅ Guardar en localStorage
  guardarUsuario(usuario: Usuario) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  // ✅ Obtener usuario actual
  getUsuarioActual(): Usuario | null {
    const data = localStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }

  // ✅ Verificar si está logueado
  isLoggedIn(): boolean {
    return localStorage.getItem('usuario') !== null;
  }

  // ✅ Logout
  logout() {
    localStorage.removeItem('usuario');
  }
}
