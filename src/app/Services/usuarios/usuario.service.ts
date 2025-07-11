import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { appsettings } from '../../Settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../Models/Usuario';
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
  login(
    correo: string,
    clave: string
  ): Observable<{ token: string; usuario: Usuario }> {
    return this.http.post<{ token: string; usuario: Usuario }>(
      `${this.apiUrl}/login`,
      { correo, clave }
    );
  }

  /** ✅ Guardar usuario + token juntos */
  guardarUsuarioConToken(usuario: Usuario, token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify({
          ...usuario,
          token,
        })
      );
    }
  }

  /** ✅ Obtener token desde LocalStorage si no está expirado */
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const usuario = JSON.parse(data);
        const token = usuario.token;
        if (token && !this.isTokenExpired(token)) {
          return token;
        } else {
          // Si está expirado, limpiar sesión
          this.logout();
          return null;
        }
      }
    }
    return null;
  }

  /** ✅ Registro */
  register(
    usuario: Usuario
  ): Observable<{ mensaje: string; usuario: Usuario; token: string }> {
    return this.http.post<{ mensaje: string; usuario: Usuario; token: string }>(
      `${this.apiUrl}/register`,
      usuario
    );
  }

  /** ✅ Obtener usuario actual */
  getUsuarioActual(): Usuario | null {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const usuario = JSON.parse(data);
        if (usuario.token && !this.isTokenExpired(usuario.token)) {
          return usuario;
        }
      }
    }
    return null;
  }

  /** ✅ Verificar si hay sesión activa */
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  /** ✅ Logout */
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.storageKey);
    }
  }

  /** ✅ Verificar si un token expiró */
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true; // Token inválido
    }
  }

  /**
   * ✅ Verificar y limpiar sesión si el token expiró.
   * Devuelve true si expiró y se hizo logout.
   */
  checkAndHandleExpiredSession(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const usuario = JSON.parse(data);
        if (usuario.token && this.isTokenExpired(usuario.token)) {
          this.logout();
          return true;
        }
      }
    }
    return false;
  }
}
