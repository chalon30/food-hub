import {
  Component,
  OnInit,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subject, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { DireccionService } from '../../Services/direccion/direccion.service';
import { UsuarioService } from '../../Services/usuarios/usuario.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-direccion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './direccion.page.html',
  styleUrls: ['./direccion.page.css'],
})
export class DireccionComponent implements OnInit, AfterViewInit {
  map: any;
  marker: any;
  L: any;

  direccion: string = '';
  distrito: string = '';
  codigoPostal: string = '';
  usuarioId: number | null = null;

  isBrowser: boolean;

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
    if (!this.isBrowser) return;

    const usuario = this.usuarioService.getUsuarioActual();
    if (!usuario || !usuario.id) {
      alert('⚠️ Debes iniciar sesión para poder ingresar una dirección.');
      return;
    }

    this.usuarioId = usuario.id;
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    import('leaflet').then((L) => {
      this.L = L;
      this.initMap();
      this.setupAutocomplete();
    });
  }

  private initMap(): void {
    const limaLat = -12.0464;
    const limaLng = -77.0428;

    this.map = this.L.map('mapa').setView([limaLat, limaLng], 13);

    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    const icon = this.L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    this.marker = this.L.marker([limaLat, limaLng], {
      draggable: true,
      icon: icon,
    }).addTo(this.map);

    this.marker.on('dragend', () => {
      const pos = this.marker.getLatLng();
      console.log('📍 Marcador movido a:', pos.lat, pos.lng);
    });
  }

  private setupAutocomplete(): void {
    this.codigoPostalInput$
      .pipe(
        debounceTime(400),
        switchMap((query) =>
          this.isBrowser ? this.buscarPorCodigoPostal(query) : of([])
        )
      )
      .subscribe((resultados) => {
        this.opcionesDirecciones = resultados;
      });
  }

  private buscarPorCodigoPostal(cp: string) {
    if (!cp || cp.trim() === '') return of([]);

    // ✅ Llama a tu backend como proxy para evitar CORS
    const url = `${environment.apiUrl}/api/nominatim?postalcode=${encodeURIComponent(cp)}`;
    return this.http.get<any[]>(url);
  }

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

    if (this.map && this.marker && opcion.lat && opcion.lon) {
      const lat = parseFloat(opcion.lat);
      const lon = parseFloat(opcion.lon);
      this.map.setView([lat, lon], 15);
      this.marker.setLatLng([lat, lon]);
    }
  }

  guardarDireccion() {
    if (this.usuarioId == null) {
      alert('⚠️ Debes iniciar sesión para guardar la dirección.');
      return;
    }

    if (!this.codigoPostal || !this.distrito || !this.direccion) {
      alert('⚠️ Por favor completa todos los campos obligatorios.');
      return;
    }

    const confirmacion = window.confirm(
      `¿Estás seguro de guardar esta dirección?\n\nDirección: ${this.direccion}\nDistrito: ${this.distrito}\nCódigo Postal: ${this.codigoPostal}`
    );

    if (!confirmacion) return;

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
        this.router.navigate(['/pago']);
      },
      error: (err) => {
        console.error('❌ Error al guardar dirección:', err);
        alert('❌ No se pudo guardar la dirección. Intenta nuevamente.');
      },
    });
  }
}
