

## Rediseño del Inbox para el schema real de alertas (PLs y Normas)

Las cards del Inbox seguían pensadas para los mocks de farma. Ahora muestran datos reales del DB, pero hay tres problemas: (1) el mapeo DB → UI deja campos vacíos o desordenados, (2) los 17 estados posibles no caen siempre en la columna correcta del Kanban, (3) las cards no exponen la riqueza del análisis IA (impacto/urgencia 0-100, racional, fechas identificadas) ni distinguen visualmente "estado real" vs "columna del Kanban".

### Mapeo de estados → columnas del Kanban

Según tu guía. **Publicado/Vigente** y **Archivado/Retirado** ya no son columnas: la card se queda en la última columna donde estuvo (`tramite_final` por default si no tenemos historial), pero el badge de estado en la card siempre muestra el `estado_actual` exacto.

| Columna UI | Estados que mapean aquí |
|---|---|
| **Comisión / Consulta** | `EN COMISIÓN`, `PRESENTADO`, `DICTAMEN`, `RETORNA A COMISIÓN`, `EN CONSULTA PÚBLICA`, `PREPUBLICACIÓN`, `RECEPCIÓN DE APORTES` |
| **Pleno** | `ORDEN DEL DÍA`, `EN AGENDA DEL PLENO`, `APROBADO 1ERA. VOTACIÓN`, `EN RECONSIDERACIÓN`, `ACLARACIÓN`, `EN CUARTO INTERMEDIO`, `PENDIENTE 2DA. VOTACIÓN` |
| **Trámite Final** | `APROBADO`, `AUTÓGRAFA`, `PENDIENTE DE PROMULGACIÓN`, `EN FIRMA`, `EN REFRENDO`, `REMITIDO PARA PUBLICACIÓN` |
| **Trámite Final (sticky)** | `PUBLICADA EN EL DIARIO OFICIAL EL PERUANO`, `PUBLICADO`, `LEY PUBLICADA` → quedan en Trámite Final con badge verde "Publicada" |
| **Trámite Final (sticky)** | `RETIRADO POR SU AUTOR`, `AL ARCHIVO`, `DECRETO DE ARCHIVO`, `RECHAZADO` → quedan en Trámite Final con badge gris "Archivada/Retirada" |

Las **Normas** no usan Kanban (siguen con la grid única "Pendiente Revisión").

### Rediseño de la card de PL

Header
- Badge tipo "Proyecto de Ley" + código (`row.codigo`, ej: `13172/2025-CR`)
- Badge **estado_actual** exacto (texto del DB) con color según familia: azul (Comisión), morado (Pleno), naranja (Trámite Final), verde (Publicada), gris (Archivada)
- Si `es_cambio_estado=true`: pequeño chip "↑ cambio" para señalar movimiento reciente
- Iconos derecha: link externo (`url`/`source_url`), pin, archivar

Cuerpo
- Título (`legislation_title`, line-clamp-2)
- Autor (`ui_extras.author`) + Grupo parlamentario (`ui_extras.parliamentary_group`)
- **Bloque de impacto IA** (nuevo): dos mini-barras horizontales con `ai_analysis.impacto` y `ai_analysis.urgencia` (0-100), color por umbral (≥70 destructivo, ≥40 warning, <40 muted). Si solo hay `impacto_categoria`, fallback a badge Alta/Media/Baja.
- Racional IA: primer ítem de `ai_analysis.racional[]` truncado a 2 líneas con tooltip que muestra la lista completa
- Áreas afectadas (`affected_areas`) — primeras 2 + "+N"

Footer
- Fecha del proyecto / fecha de cambio de estado
- Si hay `fechas_identificadas` con rol `plazo` o `vigencia_inicio`: chip con icono ⏰ y la fecha más próxima
- Indicador de "comentario experto cargado" cuando aplique

### Rediseño de la card de Norma

Header
- Badge "Norma" + `reference_number` (ej: "Resolución SBS 01116-2026")
- Badge entidad emisora (`entity`, ej: SBS, MINSA) con color por entidad
- Badge "Publicada" verde
- Iconos derecha: link, pin, archivar

Cuerpo
- Título (`legislation_title`)
- Sumilla (`sumilla` o `legislation_summary`) en cita lateral
- Bloque de impacto IA (igual que PLs)
- Racional IA (primer ítem + tooltip)
- Áreas afectadas

Footer
- Fecha de publicación (`fecha_publicacion`)
- Plazo de cumplimiento si está en `fechas_identificadas`
- Fuente (`fuente`)

### Cambios técnicos

`src/data/peruAlertsMockData.ts`
- Reescribir `STAGE_TO_KANBAN` con los 17 estados de la guía (todos los Publicado/Archivado/Retirado mapean a `tramite_final`).
- Agregar export `STAGE_BADGE_STYLE: Record<string, { label, color, family }>` para que la card pinte el badge según el estado exacto.
- Agregar export `BILL_STATE_FAMILY` (`comision | pleno | tramite_final | publicada | archivada`) derivado del estado.
- Quitar `KANBAN_COLUMNS` con `publicado` y `archivado` del flujo del Inbox (mantener export por compatibilidad pero el Inbox usa solo `BILLS_KANBAN_COLUMNS` de 3 columnas).

`src/contexts/AlertsContext.tsx` (`mapDbRowToAlert`)
- Normalizar `estado_actual` con `.trim().toUpperCase()` y aplicar `STAGE_TO_KANBAN` con fallback `tramite_final` si el estado pertenece a familia "publicada/archivada", `comision` si es desconocido.
- Leer `ai_analysis.impacto`, `ai_analysis.urgencia`, `ai_analysis.racional`, `ai_analysis.fechas_identificadas` y exponerlos en el shape `PeruAlert` (campos nuevos opcionales).
- Mapear `row.fuente`, `row.reference_number`, `row.es_cambio_estado`.
- Derivar `impact_level` desde `impacto` numérico cuando `impact_categoria` no esté: ≥70→grave, ≥40→medio, ≥15→leve, resto→leve.

`src/data/peruAlertsMockData.ts` (interface `PeruAlert`)
- Agregar campos opcionales: `impacto_score?: number`, `urgencia_score?: number`, `rationale?: string[]`, `key_dates?: { fecha: string; rol: string; contexto?: string }[]`, `state_family?: 'comision'|'pleno'|'tramite_final'|'publicada'|'archivada'`, `is_state_change?: boolean`, `reference_number?: string`, `fuente?: string`.

`src/components/inbox/InboxAlertCard.tsx`
- Reemplazar el badge genérico de `current_stage` por el badge con color por familia + el chip "↑ cambio" cuando aplique.
- Insertar bloque de barras impacto/urgencia entre cuerpo y áreas.
- Insertar racional IA truncado con tooltip.
- Insertar chip de plazo más próximo cuando `key_dates` lo tenga.
- Cards de Norma: mostrar entidad y `reference_number` en header.

`src/components/inbox/AlertDetailDrawer.tsx`
- Sección "Análisis IA" nueva: barras impacto/urgencia, lista completa de racional, tabla de fechas identificadas con rol y contexto.
- Sección "Trazabilidad de estado": estado actual, estado anterior (`row.estado_anterior`), flag de cambio.
- Mostrar `fuente` y link verificable a `url`.

`src/components/client-portal/ClientAlertCard.tsx`
- Mismos cambios visuales que `InboxAlertCard` pero sin acciones (pin/archivar).

### Diagrama de mapeo

```text
DB row (alerts table)
├─ codigo, estado_actual, estado_anterior, es_cambio_estado
├─ legislation_title, legislation_summary, sumilla
├─ entity, reference_number, fuente, url, fecha_publicacion
├─ ai_analysis.{impacto, urgencia, racional[], fechas_identificadas[]}
└─ ai_analysis.ui_extras.{author, parliamentary_group, kanban_stage}
                      │
                      ▼
        mapDbRowToAlert (AlertsContext)
                      │
        ┌─────────────┼──────────────┐
        ▼             ▼              ▼
    Kanban col    state_family   Card badges
   (3 columnas)   (5 familias)   (estado exacto)
```

### Lo que NO cambia
- RLS, edge function `ingest-alerts`, schema del DB.
- Layout 3 columnas para PLs / grid única para Normas.
- Sistema de pin / archivar / comentario experto / adjuntos.
- Realtime subscription.

