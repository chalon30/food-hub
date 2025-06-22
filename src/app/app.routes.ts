import { Routes } from '@angular/router';
import { Principal } from './Pages/principal/principal';
import { Nosotros } from './Pages/nosotros/nosotros';
import { DetalleProductoComponent } from './Pages/detalle-producto/detalle-producto'; // <-- Importa el componente

export const routes: Routes = [
  { path: '', component: Principal },
  { path: 'nosotros', component: Nosotros },
  { path: 'producto/:id', component: DetalleProductoComponent },
];
