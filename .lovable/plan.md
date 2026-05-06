## Objetivo

Regenerar `reporte-betsson-2026-05-06.pdf` (artefacto descargable, no UI) tomando el modelo previo que ya tenía buena estructura y añadiendo lo que pediste:

1. **Cliente correcto**: "Betsson Group" (marcas Betsson / Betsafe / Inkabet), no "Bedson". Sector: juegos a distancia y apuestas deportivas a distancia. Autoridades: MINCETUR / DGJCMT / SUNAT / SBS / UIF-Perú / INDECOPI / MEF.
2. **División PL vs Normas**: en Heatmap, en Fichas y en el Snapshot, separar claramente Proyectos de Ley vs Normas (dos sub-bloques con sus propios contadores y headers).
3. **Visualizaciones**: añadir una página "Visualizaciones" con gráficos vectoriales nativos en `@react-pdf/renderer` (sin depender del DOM), todos hechos con `<Svg>`:
   - Distribución por impacto (barras: Grave / Medio / Leve / Positivo)
   - Distribución por tipo (PL vs Normas, donut o barras)
   - Distribución por owner / área interna (barras horizontales)
   - Distribución por autoridad / fuente (barras horizontales)
4. **Sección Sesiones**: nueva sección que incluya las sesiones de comisiones cuya fecha cae dentro del período del reporte (29 abr – 6 may 2026), con: comisión, fecha, link a video oficial, ítems relevantes y mini-resumen experto. Si no hay sesiones en el período se muestra estado vacío explícito.
5. **Mantener lo bueno del modelo previo**: header con caja de control, executive snapshot (Top developments / Watchlist / Decisiones requeridas), heatmap tabular, fichas con grid de 6 campos, comentario experto, clasificación IA, anexo de fuentes oficiales con hipervínculos.

## Estructura final del PDF

```text
Página 1   Portada · Caja de control · Executive Snapshot
           (Top Developments | Watchlist | Decisiones requeridas)
Página 2   Visualizaciones (4 gráficos SVG)
Página 3   Heatmap Regulatorio — bloque PROYECTOS DE LEY
Página 4   Heatmap Regulatorio — bloque NORMAS
Página 5+  Fichas — PROYECTOS DE LEY
Página N+  Fichas — NORMAS
Página N+1 Sesiones de Comisiones del período
Página N+2 Fuentes oficiales (links)
```

## Datos mock relevantes para Betsson (resumen)

- **PL Betsson-relevantes** (5): modificación al régimen tributario de juegos a distancia / ISC sobre apuestas; restricción de publicidad de apuestas deportivas; obligaciones reforzadas de juego responsable y autoexclusión; ampliación de obligaciones AML/UIF para operadores; registro nacional de jugadores autoexcluidos.
- **Normas Betsson-relevantes** (4): RD MINCETUR/DGJCMT con nuevos requisitos de homologación de plataforma; RM con plazo de adecuación KYC; resolución SBS/UIF sobre debida diligencia reforzada; RS SUNAT sobre formulario virtual del impuesto a juegos a distancia.
- **Sesiones** (2-3): Comisión de Comercio Exterior y Turismo (revisión reglamento juegos a distancia), Comisión de Economía/Banca/Finanzas (debate ISC apuestas), Comisión de Defensa del Consumidor (publicidad y promociones).

Todos con `owners` mapeados a las áreas internas reales del perfil Betsson (Legal & Compliance, AML, Tributario, Operaciones, Producto, Marketing, Tecnología) y `requires_decision` donde aplique.

## Notas técnicas

- Editar `scripts/genreport.tsx`: reemplazar mock por dataset Betsson, separar `bills` y `norms`, añadir `sessions`, añadir helpers `BarChart` / `DonutChart` con primitivas `<Svg>` `<Rect>` `<Path>` `<Text>` de `@react-pdf/renderer`, agregar páginas correspondientes.
- Output: `/mnt/documents/reporte-betsson-2026-05-06.pdf` (nuevo archivo, no sobreescribe el de Bedson).
- QA obligatorio: convertir cada página a JPG con `pdftoppm` e inspeccionar overflow, solapamiento y alineación de gráficos antes de entregar.

¿Procedo así?