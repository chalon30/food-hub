import { Component } from '@angular/core';
import { UsuarioService } from '../../Services/usuarios/usuario.service';
import { Usuario } from '../../Models/Usuario';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
  ],
})
export class Register {
  usuario: Usuario = {
    correo: '',
    clave: '',
    nombre: '',
  };
  error = '';
  mensaje = '';

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  register() {
    this.usuarioService.register(this.usuario).subscribe({
      next: (resp) => {
        alert(resp.mensaje);
        this.usuarioService.guardarUsuario(resp.usuario);
        this.router.navigate(['/login']); // <-- Aquí rediriges a login
      },
      error: (err) => {
        if (err.error && typeof err.error === 'string') {
          this.error = err.error;
        } else if (err.error?.mensaje) {
          this.error = err.error.mensaje;
        } else if (err.error?.error) {
          this.error = err.error.error;
        } else {
          this.error = 'Error inesperado';
        }
      },
    });
  }
}
