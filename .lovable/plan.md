## Objetivo

Corregir la lógica de archivado y visibilidad de alertas de forma **global y compartida**, para que sea coherente con un producto de monitoreo regulatorio: ninguna alerta debe desaparecer por antigüedad, el auto-archivado se basa solo en inactividad legislativa real, las alertas de alto impacto reciben protección reforzada, y la pestaña Archivadas muestra siempre razón y último movimiento.

## Alcance global

Todos los consumidores de alertas leen del mismo `AlertsContext` (`src/contexts/AlertsContext.tsx`), por lo que los cambios aplican automáticamente a **todos los perfiles** — Perú, Betsson, ISA Energía y cualquier perfil futuro — y a **todos los roles** (admin y client):

- `src/pages/Inbox.tsx` (admin)
- `src/components/inbox/*` (Bills, Regulations, Detail, Card)
- `src/components/client-portal/ClientInbox.tsx`, `ClientAnalytics.tsx`, `ClientBillsInbox.tsx`, `ClientRegulationsInbox.tsx`
- `src/components/panel/MorningBriefPage.tsx`
- `src/components/analytics/LegalTeamAnalyticsDashboard.tsx`, `blocks/PinnedArchivedBlock.tsx`
- `src/components/reports/ReportsPage.tsx`
- `src/components/calendar/AlertsCalendar.tsx`
- `src/lib/calendarUtils.ts`, `src/lib/analyticsRepository.ts`

No existe lógica de archivado separada por perfil. Se valida en la implementación que ningún módulo cliente reimplemente `purgeOldArchivedAlerts` o un criterio basado en `created_at`.

## Cambios

### 1. `src/data/peruAlertsMockData.ts`
- Extender `PeruAlert` con campos opcionales:
  - `archive_reason?: "manual" | "auto_inactivity" | null`
  - `archived_last_movement_at?: string | null`
- Eliminar por completo:
  - `ARCHIVE_RETENTION_DAYS`
  - `getArchiveDaysRemaining`
  - `purgeOldArchivedAlerts`
- Archivo nunca implica borrado.

### 2. `src/contexts/AlertsContext.tsx` (núcleo del cambio)
- Eliminar el `useEffect` que ejecuta `purgeOldArchivedAlerts` cada hora.
- Eliminar la llamada a `purgeOldArchivedAlerts` dentro de `fetchAlerts`.
- **Reescribir `applyAutoArchive`** (ya no usa `created_at`):
  - Imports: `getLastMovementDate`, `getImpactScore`, `isRezagada` desde `src/lib/alertClassification.ts`.
  - Constantes:
    - `AUTO_ARCHIVE_INACTIVITY_DAYS = 365`
    - `AUTO_ARCHIVE_HIGH_IMPACT_INACTIVITY_DAYS = 540`
  - Una alerta solo se auto-archiva si **todas** se cumplen:
    1. `!a.archived_at`
    2. `!a.is_pinned_for_publication`
    3. `isRezagada(a)` ya verdadero
    4. `getLastMovementDate(a)` existe
    5. Días sin movimiento ≥ 540 si `getImpactScore(a) >= 70`, sino ≥ 365
  - Al cumplirse: setear `archived_at = now`, `archive_reason = "auto_inactivity"`, `archived_last_movement_at = getLastMovementDate(a).toISOString()`, y persistir en el map local.
- **Persistencia local extendida** (`ARCHIVED_STORAGE_KEY = "lawmeter:archived-alerts"`):
  - Nuevo formato: `Record<string, { archived_at: string; reason: "manual" | "auto_inactivity"; last_movement_at?: string | null }>`.
  - **Migración tolerante**: si el valor leído es string, se interpreta como `{ archived_at: <string>, reason: "manual", last_movement_at: null }` (el formato viejo nunca contuvo `auto_inactivity`).
  - Helpers internos `readArchivedMap()` y `writeArchivedMap()` que encapsulan migración.
- `archiveAlert(alertId)`:
  - Setear en estado: `archived_at: now`, `archive_reason: "manual"`, `archived_last_movement_at = getLastMovementDate(a)?.toISOString() ?? null`, `is_pinned_for_publication: false`.
  - Persistir entrada completa en el map.
- `unarchiveAlert(alertId)`:
  - Limpiar en estado: `archived_at = null`, `archive_reason = null`, `archived_last_movement_at = null`.
  - Eliminar entrada del map persistido.
- `mapDbRowToAlert`: leer del map persistido y propagar `archived_at`, `archive_reason`, `archived_last_movement_at` al objeto `PeruAlert`.

### 3. Utilidad temporal de recuperación
- Nuevo módulo `src/lib/archiveRecovery.ts` con:
  ```ts
  export function restoreRecentlyArchivedAlerts(days = 30): {
    found: number;
    inWindow: number;
    restored: number;
    notFoundInDataset: string[];
  }
  ```
  - Lee `lawmeter:archived-alerts` (acepta formato viejo y nuevo).
  - Para cada entrada con `archived_at` dentro de los últimos `days` días: borra esa entrada del map persistido y registra el id para limpieza en memoria.
  - Devuelve el resumen y lo imprime en `console.info`: total encontradas, total dentro del periodo, total restauradas en localStorage, IDs no presentes en el dataset actual.
  - **No borra definitivamente ningún registro de alertas.** Solo elimina entradas del map de archivado.
- `AlertsContext`: en el `useEffect` inicial, exponer `window.__lawmeterRestoreArchived = (days = 30) => { const r = restoreRecentlyArchivedAlerts(days); refresh(); return r; }` para uso puntual desde la consola del navegador, sin UI.

### 4. `src/lib/alertClassification.ts`
- **No tocar** `classifyCard`, `isRezagada`, `isActionRequired`, ni ninguna otra regla.
- Solo actualizar el copy de tooltips en `ZONE_META`:
  - `action.hint`: `"Alertas con impacto o urgencia igual o superior a 70."`
  - `monitor.hint`: `"Impacto entre 40 y 69 y no clasificada como acción requerida."`
  - `low.hint`: `"Impacto menor a 40 y urgencia menor a 70. Sin prioridad inmediata."`
  - `lagging.hint`: sin cambios.

### 5. `src/components/inbox/InboxAlertCard.tsx`
- Quitar import y uso de `getArchiveDaysRemaining` y la variable `daysRemaining`.
- Reemplazar el bloque (~líneas 454-459) por:
  - Texto principal según `archive_reason`:
    - `"Archivada manualmente"` si `"manual"` o ausente (compatibilidad).
    - `"Archivada automáticamente por inactividad"` si `"auto_inactivity"`.
  - Subtexto: `"Último movimiento: {fecha}"` usando `archived_last_movement_at` con fallback a `getLastMovementDate(alert)?.toISOString()`. Si no hay fecha, omitir el subtexto.
- Eliminar cualquier copy de "se eliminará en X días".

### 6. Paridad client-side
- `src/components/client-portal/ClientAlertCard.tsx` y `ClientAlertDetailDrawer.tsx`: aplicar el mismo bloque de razón + último movimiento si actualmente muestran "Archivada {fecha}" (revisar y, si lo muestran, alinear copy; si no muestran nada de archivado, dejar igual).
- ClientInbox, ClientAnalytics, ClientBillsInbox, ClientRegulationsInbox: usan `archived_at` del mismo contexto. Sin cambios funcionales adicionales.

### 7. Limpieza de referencias residuales
- Búsqueda y eliminación de cualquier uso de:
  - `purgeOldArchivedAlerts`
  - `ARCHIVE_RETENTION_DAYS`
  - `getArchiveDaysRemaining`
- en `src/contexts/AlertsContext.tsx`, `src/data/peruAlertsMockData.ts` y todo `src/`.
- Reemplazar por conteo simple `!!a.archived_at` donde aplique (analytics ya lo hacen así).

## Lo que NO cambia

- Backend, Supabase, edge functions, schema, RLS, datos productivos.
- Lógica de `classifyCard`, `isRezagada`, `isActionRequired`, `getLastMovementDate`.
- Lógica de dedupe (`dedupeByCodigoLatestVersion`).
- Filtros de bandeja activa (`!a.archived_at`).
- Comportamiento de pin/bookmark.
- Datos productivos de Perú, Betsson, ISA Energía.
- Lógica del Panel / Morning Brief (regional y single-country).
- `src/integrations/supabase/client.ts`, `src/integrations/supabase/types.ts`, `.env`.

## Resultado esperado

- **Global**: todos los perfiles (Perú, Betsson, ISA, futuros) heredan el mismo comportamiento automáticamente, porque consumen el mismo `AlertsContext`.
- Las alertas archivadas se conservan indefinidamente en estado, pestaña Archivadas, búsqueda, reportes históricos y trazabilidad.
- Auto-archivado solo dispara tras 12 meses (o 18 si impacto ≥ 70) sin movimiento legislativo real, y solo cuando la alerta ya está rezagada y no pinneada.
- Tarjetas archivadas muestran razón ("manualmente" / "automáticamente por inactividad") y fecha de último movimiento relevante.
- Tooltips de zonas Kanban alineados con la lógica real.
- `window.__lawmeterRestoreArchived(30)` disponible en consola para recuperar archivados recientes sin borrar registros.
- Ninguna alerta regulatoria vuelve a desaparecer por antigüedad de ingesta.
