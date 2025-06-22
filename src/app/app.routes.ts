import { Routes } from '@angular/router';
import { Principal } from './Pages/principal/principal';
import { Nosotros } from './Pages/nosotros/nosotros';
import { DetalleProductoComponent } from './Pages/detalle-producto/detalle-producto';
import { Perfil } from './Pages/perfil/perfil';
import { Login } from './Pages/login/login';
import { Register } from './Pages/register/register';

export const routes: Routes = [
  { path: '', component: Principal }, // Página principal
  { path: 'nosotros', component: Nosotros },
  
  // Ruta para detalle de producto, con parámetro 'id'
  {
    path: 'producto/:id',
    component: DetalleProductoComponent,
    data: { renderMode: 'client' }, // si usas SSR o configuración especial
  },

  { path: 'perfil', component: Perfil },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // Carga perezosa (lazy load) para el componente standalone 'CartaComponent'
  {
    path: 'carta',
    loadComponent: () =>
      import('./Pages/carta/carta').then((m) => m.CartaComponent),
  },

  // Ruta comodín para redirigir a la principal si no existe la ruta
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
