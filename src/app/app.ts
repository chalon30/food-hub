import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { Header } from './Components/header/header';
import { Footer } from './Components/footer/footer';
import { UsuarioService } from './Services/usuarios/usuario.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'front-end';

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    const expired = this.usuarioService.checkAndHandleExpiredSession();
    if (expired) {
      alert('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
      this.router.navigate(['/login']);
    }
  }
}
