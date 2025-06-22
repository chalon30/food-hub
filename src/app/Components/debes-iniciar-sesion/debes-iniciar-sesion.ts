
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-debes-iniciar-sesion',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterModule],
    templateUrl: './debes-iniciar-sesion.html',
    styleUrl: './debes-iniciar-sesion.css'
})
export class DebesIniciarSesionComponent { }
