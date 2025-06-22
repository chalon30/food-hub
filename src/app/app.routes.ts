import { Routes } from '@angular/router';
import { Principal } from './Pages/principal/principal';
import { Nosotros } from './Pages/nosotros/nosotros';


export const routes: Routes = [
  { path: '', component: Principal },
  { path: 'nosotros', component: Nosotros },
];
