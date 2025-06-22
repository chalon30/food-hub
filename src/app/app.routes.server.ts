import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'producto/:id',
    renderMode: RenderMode.Client // 👈 se renderiza en el cliente
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender // 👈 el resto sí se prerenderiza
  }
];
