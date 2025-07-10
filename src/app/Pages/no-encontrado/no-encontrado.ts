import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-no-encontrado',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule],
  templateUrl: './no-encontrado.html',
  styleUrl: './no-encontrado.css'
})
export class NoEncontrado {

}
