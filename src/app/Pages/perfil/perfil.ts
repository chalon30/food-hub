import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DebesIniciarSesionComponent } from '../../Components/debes-iniciar-sesion/debes-iniciar-sesion';
import { Usuario } from '../../Models/Usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, DebesIniciarSesionComponent],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css'],
})
export class Perfil implements OnInit {
  estaLogeado = false;
  usuario: Usuario | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('usuario');
      if (storedUser) {
        this.usuario = JSON.parse(storedUser);
        this.estaLogeado = true;
      }
    }
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('usuario');
    }

    this.estaLogeado = false;
    this.usuario = null;
    this.router.navigate(['/login']).then(() => {
      window.location.reload(); // 🔄 Recarga la página después de redirigir
    });
  }
}
