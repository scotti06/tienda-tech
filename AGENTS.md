<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Mobile First — Techstylebv

Diseñar primero para **390–430px** (iPhone). Desktop se adapta con `md:` / `lg:`.

## Principios

- App de accesorios iPhone: descubrimiento rápido, mínimo scroll, densidad premium.
- **No eliminar componentes** — reorganizar layout y proporciones.
- Conservar identidad visual (colores, tipografía, glass, animaciones, botones).

## Home mobile — jerarquía

1. Header + título + CTA
2. Banner del carrusel Hero (producto/categoría destacada, ~232px)
3. Categorías (carrusel horizontal)
4. Filtros sticky
5. Productos destacados
6. TrustBar, Novedades, Más vendidos, etc.

## Espaciado mobile

8 / 16 / 24 / 32 / 48px — clases `.home-section`, `.home-section-tight` en `globals.css`.
