

## Mejorar la presentación del markdown de la agenda

Hoy la agenda se muestra dentro de un `<pre>` con `whitespace-pre-wrap`, así que aparecen los asteriscos, `##`, `[texto](url)`, imágenes en bruto y bloques repetidos del portal. Vamos a renderizarlo como texto formateado.

### Sin costo de IA

Solo formateo visual del markdown que ya está guardado en `sesiones.agenda_markdown`. **No se llama a ningún modelo de IA, no toca edge functions, no consume créditos.** Todo ocurre en el navegador.

### Cambios

**1. Nuevo archivo `src/components/sessions/AgendaMarkdownView.tsx`**

- Función `cleanAgendaMarkdown(md)` — limpia con regex el ruido del scraper:
  - Quita imágenes (`![](...logo_congreso.svg)`, `portada.svg`).
  - Elimina cabecera repetitiva (`## CONGRESO DE LA REPÚBLICA`, `Portal`, `[![](...)](#/)`).
  - Elimina footer (`# Congreso de la República`, `Visor de SGSC…`, `Plaza Bolívar…`, `Copyright © …`).
  - Colapsa líneas en blanco múltiples.
- Renderiza con `react-markdown` + `remark-gfm` y overrides Tailwind:
  - `h1/h2` → `text-base font-semibold` (no gigantes).
  - `a` → `text-primary underline` con `target="_blank"` e ícono `ExternalLink`.
  - `ul/ol/li` → bullets nativos con `space-y-1`.
  - `img` → `null` (descartar).
  - `strong/em` respetados.
- Detecta códigos de proyecto de ley (regex `\d{4,5}/\d{4}-(CR|PE)`) y los envuelve en `Badge` monoespaciado.

**2. Editar `src/components/sessions/SesionDetailDrawer.tsx` (líneas 154–164)**

Reemplazar el bloque `<pre>` por:

```tsx
<div className="rounded-lg border bg-muted/30 p-4 max-h-[60vh] overflow-y-auto">
  <AgendaMarkdownView markdown={sesion.agenda_markdown} />
</div>
```

**3. Dependencias nuevas (package.json)**

- `react-markdown`
- `remark-gfm`

(No requiere `@tailwindcss/typography`; los estilos se aplican vía `components` overrides para mantener coherencia con el resto de la app.)

### Resultado visual esperado

```text
┌─ Agenda ─────────────────────────────────────┐
│ Comercio Exterior y Turismo                  │
│ Periodo Anual de Sesiones 2025 - 2026        │
│                                              │
│ • TITULO   DÉCIMA SESIÓN ORDINARIA …         │
│ • FECHA    miércoles, 15 de abril de 2026    │
│ • HORA     11:00 AM                          │
│ • LUGAR    Presencial · Sala 1 / Virtual     │
│                                              │
│ I — APROBACIÓN DE ACTAS                      │
│   • ACTA 9na Ses. Ordinaria 21.11.25 [Ver ↗] │
│                                              │
│ V — ORDEN DEL DÍA                            │
│   5.2 Exposición del Proyecto de Ley         │
│       [12369/2025-CR ↗] — "Ley que modifica  │
│       las leyes 27790, 29890…"               │
│       Autor: J. C. Lizarzaburu  [OFICIO ↗]   │
└──────────────────────────────────────────────┘
```

