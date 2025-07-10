import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { appsettings } from '../../Settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../Models/Usuario';
import { ResponseAPI } from '../../Models/ResponseAPI';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl: string = `${appsettings.apiUrl}usuarios`;
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private storageKey = 'usuario';

  constructor() {}

  /** ✅ Login */
  login(correo: string, clave: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, { correo, clave });
  }

  /** ✅ Registro */
  register(usuario: Usuario): Observable<{ mensaje: string; usuario: Usuario }> {
    return this.http.post<{ mensaje: string; usuario: Usuario }>(
      `${this.apiUrl}/register`,
      usuario
    );
  }

  /** ✅ Guardar usuario en localStorage (solo en navegador) */
  guardarUsuario(usuario: Usuario): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.storageKey, JSON.stringify(usuario));
    }
  }

  /** ✅ Obtener usuario actual */
  getUsuarioActual(): Usuario | null {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  /** ✅ Verificar login */
  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.storageKey) !== null;
    }
    return false;
  }

  /** ✅ Logout */
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.storageKey);
    }
  }
}
