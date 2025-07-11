import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { UsuarioService } from '../Services/usuarios/usuario.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
  const usuarioService = inject(UsuarioService);
  const token = usuarioService.getToken();
  console.log('TOKEN INTERCEPTOR:', token);

  // ✅ Solo agregar token si existe y no está expirado (suponiendo que getToken ya valida expiración)
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  
  // ✅ Continuar con la request y limpiar sesión si llega un 401
  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        usuarioService.logout(); // Limpiar la sesión
        // Opcional: redirigir a login para que usuario inicie sesión de nuevo
        // const router = inject(Router);
        // router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
