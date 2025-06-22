import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { Usuario } from '../../Models/Usuario';
import { CommonModule } from '@angular/common';
import { CapitalizeFirstPipe } from './capitalize-first.pipe';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterModule, CommonModule,CapitalizeFirstPipe],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements OnInit {
  usuario: Usuario | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && localStorage) {
      const storedUser = localStorage.getItem('usuario');
      this.usuario = storedUser ? JSON.parse(storedUser) : null;
    }
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('usuario');
    }
    this.usuario = null;
    this.router.navigate(['/login']);
  }
}
