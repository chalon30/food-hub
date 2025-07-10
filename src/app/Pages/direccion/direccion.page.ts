import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subject, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { DireccionService } from '../../Services/direccion/direccion.service';
import { UsuarioService } from '../../Services/usuarios/usuario.service';

@Component({
  selector: 'app-direccion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './direccion.page.html',
  styleUrls: ['./direccion.page.css'],
})
export class DireccionComponent implements OnInit {
  map: any;
  marker: any;
  L: any;

  // 📌 Datos de dirección
  direccion: string = '';
  distrito: string = '';
  codigoPostal: string = '';
  usuarioId: number | null = null;

  // 📌 SSR
  isBrowser: boolean;

  // 📌 Autocompletado por código postal
  codigoPostalInput$ = new Subject<string>();
  opcionesDirecciones: any[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private direccionService: DireccionService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      const usuario = this.usuarioService.getUsuarioActual();

      if (!usuario || !usuario.id) {
        alert('⚠️ Debes iniciar sesión para poder ingresar una dirección.');
        return;
      }

      this.usuarioId = usuario.id;

      import('leaflet').then((L) => {
        this.L = L;
        this.initMap();
        this.setupAutocomplete();
      });
    }
  }

  // ✅ Inicializa el mapa
  private initMap(): void {
    const limaLat = -12.0464;
    const limaLng = -77.0428;

    this.map = this.L.map('mapa').setView([limaLat, limaLng], 13);

    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

    this.marker = this.L.marker([limaLat, limaLng], { draggable: true }).addTo(this.map);

    this.marker.on('dragend', () => {
      const pos = this.marker.getLatLng();
      console.log('📍 Marcador movido a:', pos.lat, pos.lng);
    });
  }

  // ✅ Configura el autocompletado al escribir el código postal
  private setupAutocomplete(): void {
    this.codigoPostalInput$
      .pipe(
        debounceTime(400),
        switchMap((query) => this.buscarPorCodigoPostal(query))
      )
      .subscribe((resultados) => {
        this.opcionesDirecciones = resultados;
      });
  }

  // ✅ Búsqueda en Nominatim con código postal
  private buscarPorCodigoPostal(cp: string) {
    if (!cp || cp.trim() === '') return of([]);
    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&country=Peru&postalcode=${encodeURIComponent(cp)}`;
    return this.http.get<any[]>(url);
  }

  // ✅ Cuando el usuario selecciona una opción de la lista
  seleccionarDireccion(opcion: any) {
    if (opcion.address) {
      this.distrito =
        opcion.address.suburb ||
        opcion.address.city ||
        opcion.address.town ||
        opcion.display_name;
      this.codigoPostal = opcion.address.postcode || this.codigoPostal;
    } else {
      this.distrito = opcion.display_name;
    }

    this.opcionesDirecciones = [];

    // ✅ Centrar mapa
    if (this.map && this.marker && opcion.lat && opcion.lon) {
      const lat = parseFloat(opcion.lat);
      const lon = parseFloat(opcion.lon);
      this.map.setView([lat, lon], 15);
      this.marker.setLatLng([lat, lon]);
    }
  }

  // ✅ Enviar la dirección completa al backend con confirmación y redirección
  guardarDireccion() {
    if (this.usuarioId == null) {
      alert('⚠️ Debes iniciar sesión para guardar la dirección.');
      return;
    }

    if (!this.codigoPostal || !this.distrito || !this.direccion) {
      alert('⚠️ Por favor completa todos los campos obligatorios.');
      return;
    }

    // ✅ Mostrar confirmación
    const confirmacion = window.confirm(
      `¿Estás seguro de guardar esta dirección?\n\nDirección: ${this.direccion}\nDistrito: ${this.distrito}\nCódigo Postal: ${this.codigoPostal}`
    );

    if (!confirmacion) {
      return;
    }

    const direccionCompleta = {
      usuarioId: this.usuarioId,
      direccion: this.direccion,
      distrito: this.distrito,
      codigoPostal: this.codigoPostal,
    };

    console.log('📍 Enviando dirección al backend:', direccionCompleta);

    this.direccionService.crearDireccion(direccionCompleta).subscribe({
      next: () => {
        alert('✅ Dirección guardada correctamente en el servidor. ¡Gracias!');
        // ✅ Redirigir a la página de pago
        this.router.navigate(['/pago']);
      },
      error: (err) => {
        console.error('❌ Error al guardar dirección:', err);
        alert('❌ No se pudo guardar la dirección. Intenta nuevamente.');
      },
    });
  }
}
