import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './nosotros.html',
  styleUrls: ['./nosotros.css']
})
export class Nosotros {}
