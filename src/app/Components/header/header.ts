import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CapitalizeFirstPipe } from './capitalize-first.pipe';
import { Usuario } from '../../Models/Usuario';
import { CarritoService } from '../../Services/carrito/carrito.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    CommonModule,
    CapitalizeFirstPipe
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements OnInit, OnDestroy {
  usuario: Usuario | null = null;
  cantidadCarrito = 0;
  private carritoSub!: Subscription;

  constructor(
    private router: Router,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    this.cargarUsuario();
    this.suscribirseCarrito();
  }

  /** ✅ Carga el usuario del localStorage si existe */
  private cargarUsuario(): void {
    if (this.isBrowser()) {
      const storedUser = localStorage.getItem('usuario');
      this.usuario = storedUser ? JSON.parse(storedUser) : null;
    }
  }

  /** ✅ Se suscribe al carrito y actualiza la cantidad total de unidades */
  private suscribirseCarrito(): void {
    this.carritoSub = this.carritoService.carrito$.subscribe(items => {
      this.cantidadCarrito = items ? items.reduce((total, item) => total + item.cantidad, 0) : 0;

    });
  }

  /** ✅ Cierra sesión, limpia usuario y carrito */
  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('usuario');
    }
    this.usuario = null;
    this.carritoService.limpiarCarrito();

    this.router.navigate(['/login']).then(() => {
      if (this.isBrowser()) {
        window.location.reload();
      }
    });
  }

  ngOnDestroy(): void {
    this.carritoSub?.unsubscribe();
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }
}
