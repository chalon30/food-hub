import { Component } from '@angular/core';
import { Inicio } from '../../Components/inicio/inicio';
import { ProductosComponent } from '../../Components/productos/productos';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [Inicio, ProductosComponent],
  templateUrl: './principal.html',
  styleUrls: ['./principal.css']
})
export class Principal {}
