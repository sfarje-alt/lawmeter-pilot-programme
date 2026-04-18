

## Plan: Calendario como extensión de la Bandeja

### Problemas actuales del calendario
1. Lee de `MOCK_BILLS`/`MOCK_REGULATIONS` directamente, no del `AlertsContext` → desincronizado con la Bandeja (no refleja archivado, pin, comentarios, cambios).
2. Conserva lógica multi-cliente (filtro Cliente, badges con nombre del cliente, "Publicar al calendario del cliente") — incoherente con el modelo de una sola compañía.
3. Filtros desalineados con la Bandeja: usa `risk_level` heurístico en vez de `impact_level`/`urgency_level` reales; faltan etiquetas, estado, búsqueda libre.
4. El click navega fuera del calendario → no hay panel/drawer integrado para gestionar la alerta sin perder contexto.
5. Sin jerarquía visual por impacto crítico ni señales de carga regulatoria (heatmap semanal).
6. Sin capa analítica integrada (KPIs, semanas críticas, ventanas de riesgo).

### Cambios propuestos

**1. Conectar al AlertsContext (fuente única de verdad)**
- Reemplazar `MOCK_BILLS`/`MOCK_REGULATIONS` por `useAlerts().alerts`.
- Excluir alertas archivadas por defecto (toggle "Mostrar archivadas").
- Cualquier acción (archivar, fijar, comentario) hecha en el drawer del calendario se propaga vía contexto y aparece al instante en la Bandeja.

**2. Limpiar terminología multi-cliente**
- Remover filtro "Cliente", "Sector" hardcoded y "Tema" placeholder.
- Reemplazar badges de "Cliente: X" por etiquetas/áreas afectadas.
- Quitar botón "Publicar al calendario del cliente".

**3. Filtros sincronizados con la Bandeja**
- Búsqueda libre (título, ID, autor, entidad).
- Tipo de alerta: PL / Norma / Sesión.
- Etapa legislativa (canónica, no heurística).
- Etiquetas / áreas afectadas (multiselect).
- Nivel de impacto: Positivo / Leve / Medio / Grave (usa `impact_level` real).
- Urgencia: Baja / Media / Alta / Crítica.
- Estado: Bandeja / Revisado / Publicado / Archivado.
- Rango temporal personalizado (date pickers).
- Botón "Limpiar filtros" + persistencia en `localStorage` (`calendar-filters-v2`).

**4. Reglas de Fecha (mantener y mejorar)**
- Ingreso a etapa, Publicación, Entrada en vigor, Manual, Sesiones — toggles.
- Persistencia en `localStorage`.

**5. Jerarquía visual avanzada**
- Color de pill por impacto: Grave (rojo), Medio (ámbar), Leve (gris), Positivo (verde) — alineado con tokens semánticos del sistema.
- Borde izquierdo grueso + ícono de alerta para Grave + Urgencia Alta/Crítica (alertas críticas).
- Badge numérico por día con tono según concentración.

**6. Heatmap de carga regulatoria**
- En vista mensual, fondo de cada celda con intensidad proporcional a # eventos del día (escala 4 niveles).
- En vista semanal, banner superior por día indicando "Carga: Baja/Media/Alta/Crítica".
- Resaltar semanas con ≥ N alertas críticas con borde sutil de advertencia.

**7. Panel lateral integrado (sin salir del calendario)**
- Click en evento → abre `AlertDetailDrawer` existente (mismo de Bandeja) directamente sobre el calendario.
- Soporta archivar, fijar, editar comentario experto, urgencia, impacto y etiquetas — todo refleja en Bandeja vía contexto.
- Botón secundario "Abrir en Bandeja" para deep-link (mantener navegación opcional).
- Para sesiones, mantener navegación a Sesiones (drawer no aplica).

**8. Panel de inteligencia temporal (KPIs)**
Tarjeta superior con 4 KPIs del rango visible:
- Total de alertas
- Alertas críticas (Grave + Urgencia Alta/Crítica)
- Semana de mayor concentración
- Próximo deadline / entrada en vigor
Más mini-bar chart de "alertas por semana" (sparkline) usando recharts.

**9. Coherencia bidireccional**
- Ya garantizada al usar `useAlerts()`. Cualquier cambio se observa por re-render del provider.

### Archivos a modificar/crear
- `src/components/calendar/AlertsCalendar.tsx` — reescritura sustancial: contexto, filtros, drawer integrado, heatmap, KPIs.
- `src/hooks/useCalendarFilters.ts` (nuevo) — hook con persistencia local de filtros y reglas de fecha.
- `src/lib/calendarUtils.ts` (nuevo) — helpers: `convertAlertsToEvents`, `computeDayLoad`, `computeWeekLoad`, `getCriticalEvents`, `parseAlertDate`.
- Reutilizar `AlertDetailDrawer` tal cual (sin modificar firma).

### Diagrama de flujo

```text
AlertsContext (fuente única)
        │
        ▼
useCalendarFilters ──► filtros + reglas (localStorage)
        │
        ▼
calendarUtils.convertAlertsToEvents
        │
        ▼
┌─────────────────────────────────────────┐
│ AlertsCalendar                          │
│ ┌────────────┐  ┌─────────────────────┐ │
│ │ KPIs +     │  │ Heatmap mes/semana  │ │
│ │ sparkline  │  │ celdas con carga    │ │
│ └────────────┘  └─────────────────────┘ │
│        │                  │              │
│        └─── click evento ─┘              │
│                  ▼                       │
│        AlertDetailDrawer (mismo Bandeja) │
└─────────────────────────────────────────┘
        │
        ▼ (acciones: archivar, comentar, etc.)
AlertsContext ─► Bandeja se actualiza en vivo
```

### Reglas respetadas
- Sin lógica multi-cliente, todo proviene del contexto único.
- Sin duplicación de datos.
- Drawer reutilizado de la Bandeja para paridad de experiencia.
- UI en español, tokens semánticos del design system.

