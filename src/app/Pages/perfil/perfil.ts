import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DebesIniciarSesionComponent } from '../../Components/debes-iniciar-sesion/debes-iniciar-sesion';
import { Usuario } from '../../Models/Usuario';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CarritoService } from '../../Services/carrito/carrito.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    DebesIniciarSesionComponent,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css'],
})
export class Perfil implements OnInit {
  estaLogeado = false;
  usuario: Usuario | null = null;

  constructor(
    private router: Router,
    private carritoService: CarritoService
  ) {}

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
      this.carritoService.limpiarCarrito(); // ✅ Limpia el carrito al desloguear
    }
    this.estaLogeado = false;
    this.usuario = null;

    this.router.navigate(['/login']).then(() => {
      if (typeof window !== 'undefined') {
        window.location.reload(); // 🔄 Recarga para limpiar estado
      }
    });
  }

  irAlCarrito(): void {
    this.router.navigate(['/carrito']);
  }

  verPedidos(): void {
    this.router.navigate(['/mis-pedidos']);
  }

  editarPerfil(): void {
    alert('Funcionalidad de edición próximamente 🚀');
  }
}
