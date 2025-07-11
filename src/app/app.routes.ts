import { Routes } from '@angular/router';
import { Principal } from './Pages/principal/principal';
import { Nosotros } from './Pages/nosotros/nosotros';
import { DetalleProductoComponent } from './Pages/detalle-producto/detalle-producto';
import { Perfil } from './Pages/perfil/perfil';
import { Login } from './Pages/login/login';
import { Register } from './Pages/register/register';
import { NoEncontrado } from './Pages/no-encontrado/no-encontrado';

export const routes: Routes = [
  { path: '', component: Principal },
  { path: 'nosotros', component: Nosotros },

  {
    path: 'contacto',
    loadComponent: () =>
      import('./Pages/contacto/contacto').then((m) => m.Contacto),
  },

  {
    path: 'producto/:id',
    component: DetalleProductoComponent,
    data: { renderMode: 'client' },
  },

  { path: 'perfil', component: Perfil },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  {
    path: 'carta',
    loadComponent: () =>
      import('./Pages/carta/carta').then((m) => m.CartaComponent),
  },

  // 👉 Página del carrito
  {
    path: 'carrito',
    loadComponent: () =>
      import('./Pages/carrito/carrito').then((m) => m.Carrito),
  },

  // 👉 Página de pago (sin la barra final)
  {
    path: 'pago',
    loadComponent: () => import('./Pages/pago/pago').then((m) => m.PagoPage),
  },

  {
    path: 'direccion',
    loadComponent: () =>
      import('./Pages/direccion/direccion.page').then(
        (m) => m.DireccionComponent
      ),
  },

  {
    path: 'pago-exito',
    loadComponent: () =>
      import('./Pages/pago-exito/pago-exito').then((m) => m.PagoExitoComponent),
  },

  {
    path: 'historial-pedidos',
    loadComponent: () =>
      import('./Pages/historial-pedidos/historial-pedidos').then(
        (m) => m.HistorialPedidos
      ),
  },

  // 👉 Página personalizada de No Encontrado
  { path: '**', component: NoEncontrado },
];
