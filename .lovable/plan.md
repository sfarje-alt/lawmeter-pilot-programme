

## Plan: Refactor analíticas operativas + uniformar calendario + persistencia de pin

### 1. Refactorizar analíticas operativas (eliminar "publicación")

Reemplazar las métricas obsoletas de "alertas publicadas" por métricas reales de uso del único usuario/equipo:

| Bloque actual | Nueva métrica |
|---|---|
| Cobertura Editorial (publicadas/capturadas) | **Cobertura con Comentario Experto** — % alertas con `expert_commentary` no vacío |
| Editorial Response Time (tiempo a publicar) | **Tiempo Medio de Apertura** — promedio entre creación y primera lectura |
| Service KPIs (publicaciones/SLA) | **KPIs de Uso**: alertas revisadas, % comentadas, % clasificadas, % con tags |
| Operational Queue (cola publicación) | **Cola de Revisión Pendiente** — sin abrir / sin comentario / sin clasificar |

**Nuevos bloques** dentro de "Operaciones Internas":
- **Alertas Pinneadas**: total + % sobre el total de alertas activas.
- **Alertas Archivadas**: total + % sobre el total histórico.

Archivos:
- `src/lib/analyticsMockData.ts` — reemplazar `DEMO_EDITORIAL_COVERAGE`, `DEMO_SERVICE_KPIS`, `DEMO_OPERATIONAL_QUEUE`, `DEMO_EDITORIAL_RESPONSE_TIME` por shapes de uso real.
- `src/types/analytics.ts` — actualizar interfaces (`captured/published` → `total/withCommentary`, etc.).
- `src/components/analytics/blocks/EditorialCoverageBlock.tsx`, `EditorialResponseTimeBlock.tsx`, `ServiceKPIsBlock.tsx`, `OperationalQueueBlock.tsx` — refactor copy + lógica.
- Crear `PinnedArchivedBlock.tsx` (o dos bloques separados) y registrarlo en `blocks/index.ts`.
- `src/components/analytics/LegalTeamAnalyticsDashboard.tsx` — incorporar los nuevos bloques en la sección "Operaciones Internas".

### 2. Calendario sin gradiente por fecha

`src/components/calendar/AlertsCalendar.tsx`: localizar y eliminar las clases que oscurecen/atenuan días o semanas anteriores a hoy (`bg-muted/30`, `opacity-60`, etc.). Todas las celdas comparten `bg-card`. Mantener:
- Día actual → discreto `ring-2 ring-primary` (no gradiente).
- Día seleccionado → énfasis estándar.

### 3. Persistencia del pin (sobrevive refresh y logout)

`src/contexts/AlertsContext.tsx`:
- Al inicializar, hidratar `is_pinned_for_publication` desde `localStorage` (clave `lawmeter:pinned-alerts` = array de `alertId`).
- En `togglePinAlert`, después de actualizar el estado, persistir el set actualizado de IDs pinneados en `localStorage`.
- Al hacer login/cargar sesión, los pins se restauran automáticamente porque viven en `localStorage` del navegador.
- (Opcional futuro: migrar a tabla Supabase para sincronizar entre dispositivos — fuera de alcance ahora).

### Archivos a modificar
- `src/lib/analyticsMockData.ts`
- `src/types/analytics.ts`
- `src/components/analytics/blocks/EditorialCoverageBlock.tsx`
- `src/components/analytics/blocks/EditorialResponseTimeBlock.tsx`
- `src/components/analytics/blocks/ServiceKPIsBlock.tsx`
- `src/components/analytics/blocks/OperationalQueueBlock.tsx`
- `src/components/analytics/blocks/PinnedArchivedBlock.tsx` (nuevo)
- `src/components/analytics/blocks/index.ts`
- `src/components/analytics/LegalTeamAnalyticsDashboard.tsx`
- `src/components/calendar/AlertsCalendar.tsx`
- `src/contexts/AlertsContext.tsx`

### Reglas respetadas
- Cero referencias a "publicación" en analíticas.
- Métricas reflejan flujo real: leer, comentar, clasificar, pin, archivar.
- Calendario visualmente uniforme.
- Pin persistente en cliente, sólo el usuario lo cambia.
- UI en español, tokens semánticos.

