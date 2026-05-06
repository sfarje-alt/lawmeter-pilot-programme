## Problema

El PDF actual tiene páginas casi vacías y otras con una sola ficha. Causas:

1. Cada sección grande está envuelta en su propio `<Page>`, así que cuando el contenido se desborda crea una página nueva con apenas una ficha. La paginación natural de `@react-pdf/renderer` queda bloqueada.
2. `AlertCard` usa `wrap={false}` + padding/margenes generosos → cada ficha ocupa ~⅔ de página, y cuando dos no caben juntas, una salta sola dejando hueco grande.
3. Filas del Heatmap también con `wrap={false}` + sub‑headers que rompen la tabla en dos bloques con poco contenido.
4. Algunos textos quedaron en inglés ("EXECUTIVE SNAPSHOT", "TOP DEVELOPMENTS", "WATCHLIST", pills "ALERTAS + SESIONES / SOLO PINEADAS", "FICHAS", etc.).

## Cambios

### 1. Una sola `<Page>` con flujo continuo
- Reemplazar las 6 `<Page>` separadas por **una única `<Page>`** y dejar que el motor pagine.
- Usar `break` solo en headers de bloque mayor (Visualizaciones, Heatmap, Fichas PL, Fichas Normas, Sesiones, Fuentes) cuando realmente convenga arrancar en página nueva — sin forzarlo si quedan ≥40% de página libre.

### 2. Fichas más compactas (`AlertCard`)
- Quitar `wrap={false}` para que puedan dividirse entre páginas si hace falta.
- Reducir paddings (16→10), `marginBottom` (14→8), tipografías de cuerpo (9→8.5), `lineHeight` (1.4→1.3).
- Compactar grid: "QUÉ CAMBIÓ" en `fieldFull` con resumen recortado a ~320 chars, y los 4 metadatos en una sola fila de 4 columnas (25% c/u) en lugar de 2×2.
- Comentario experto y "Clasificación IA" en una misma fila lado a lado (50/50) cuando ambos existen.

### 3. Heatmap denso
- Quitar `wrap={false}` de las filas para permitir corte natural entre páginas.
- Mantener `fixed` solo en el header de tabla.
- Reducir padding de celdas (6→4) y fuente (8→7.5).

### 4. Sesiones y Snapshot
- `sessionCard`: quitar `wrap={false}`, compactar paddings.
- `snapshotBlock`: reducir margen entre los 3 bloques.

### 5. Traducción completa al español
- "EXECUTIVE SNAPSHOT" → "RESUMEN EJECUTIVO"
- "TOP DEVELOPMENTS" → "DESARROLLOS PRINCIPALES"
- "WATCHLIST" → "EN OBSERVACIÓN"
- "DECISIONES / SOPORTE REQUERIDO" (ya está)
- Pills: "ALERTAS + SESIONES", "SOLO PINEADAS" → "ALERTAS Y SESIONES", "SOLO DESTACADAS"
- "REQUIEREN DECISIÓN" (ok)
- "FICHAS — PROYECTOS DE LEY" → "DETALLE — PROYECTOS DE LEY"
- "FICHAS — NORMAS" → "DETALLE — NORMAS"
- "VISUALIZACIONES" (ok), subtítulos ya en español
- Brand chip: "LAWMETER · REGULATORY AFFAIRS BRIEF" → "LAWMETER · INFORME DE ASUNTOS REGULATORIOS"
- Cabeceras de tabla ya están en español.

### 6. QA obligatorio
- Regenerar PDF a `/mnt/documents/reporte-betsson-2026-05-06_v2.pdf`.
- `pdftoppm -jpeg -r 110` y revisar **cada página** buscando: páginas vacías, fichas solas, overflow, textos cortados. Iterar hasta que no haya huecos.

### Archivo afectado
- `scripts/genreport.tsx` (reestructuración del `<Document>`, ajustes de estilos y traducciones).
- Salida: `/mnt/documents/reporte-betsson-2026-05-06_v2.pdf`.

¿Procedo?
