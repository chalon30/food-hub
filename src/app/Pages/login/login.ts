import { Component } from '@angular/core';
import { UsuarioService } from '../../Services/usuarios/usuario.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    RouterModule,
  ],
})
export class Login {
  correo = '';
  clave = '';
  error = '';

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  login() {
    this.usuarioService.login(this.correo, this.clave).subscribe({
      next: (respuesta: any) => {
        alert(respuesta.mensaje); // ✅ Muestra el mensaje de bienvenida
        localStorage.setItem('usuario', JSON.stringify(respuesta.usuario));
        this.router.navigate(['/']).then(() => {
          window.location.reload(); // 🔄 Recarga después de redirigir al home
        });
      },
      error: () => {
        this.error = 'Correo o clave incorrectos';
      },
    });
  }
}
