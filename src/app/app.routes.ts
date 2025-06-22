import { Routes } from '@angular/router';
import { Principal } from './Pages/principal/principal';
import { Nosotros } from './Pages/nosotros/nosotros';
import { DetalleProductoComponent } from './Pages/detalle-producto/detalle-producto';
import { Perfil } from './Pages/perfil/perfil';
import { Login } from './Pages/login/login';
import { Register } from './Pages/register/register';

export const routes: Routes = [
  { path: '', component: Principal },
  { path: 'nosotros', component: Nosotros },
  {
    path: 'producto/:id',
    component: DetalleProductoComponent,
    data: { renderMode: 'client' },
  },
  {
    path: 'perfil',
    component: Perfil,
  },
  { path: 'login', component: Login },
  { path: 'register', component: Register}

];
