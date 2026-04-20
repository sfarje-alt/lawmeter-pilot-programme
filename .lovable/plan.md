

## Plan: Rediseño completo de "Sesiones" como workstation legal de un solo perfil

Rediseño **únicamente** la sección Sesiones para convertirla en un workspace operativo premium, alineado al estilo de Perfil. Mantiene la arquitectura single-profile actual: nada de selector de cliente, nada de "Publicar a cliente". El editor decide y luego usa Reportes para empaquetar.

### 1. Nuevo modelo de datos de alerta de sesión

Ampliar `PeruSession` (en `src/types/peruSessions.ts`) con campos editoriales y de IA independientes:

```text
editorial_state: 'nueva' | 'en_revision' | 'pineada' | 'en_seguimiento' | 'archivada'
is_pinned: boolean              // reemplaza is_pinned_for_publication
is_follow_up: boolean           // NUEVO — independiente del pin
is_archived: boolean            // archivado manual

agenda_state: 'lista' | 'pendiente' | 'error'
video_state: 'vinculado' | 'pendiente' | 'error'
transcription_state: 'no_solicitada' | 'en_cola' | 'procesando' | 'lista' | 'error'
chatbot_state:       'no_solicitado' | 'en_cola' | 'procesando' | 'listo' | 'error'

// Campos por ítem de agenda (alerta hija)
parent_session_id?: string
agenda_item: {
  item_number: string
  title: string
  thematic_area: string
  bill_numbers: string[]
}
etiqueta_ia: string             // viene de tags configurados en Perfil
risk_level: 'bajo' | 'medio' | 'alto'
urgency_level: 'baja' | 'media' | 'alta'
impact_level: 'bajo' | 'medio' | 'medio_alto' | 'alto'

// Contenido legal/IA
executive_summary: string
why_it_matters: string
preliminary_impact: string
suggested_next_step: string

// Revisión legal editable
legal_review: {
  resumen_legal: string
  riesgo: string
  urgencia: string
  impacto: string
  areas_afectadas: string[]
  proximos_pasos: string
  comentario_experto: string
}
```

Las 4 alertas demo (5.1–5.4) se generan en un nuevo `src/data/sesionesDemoAlerts.ts` y se inyectan en `usePeruSessions` cuando no hay datos en la base.

### 2. Estructura de archivos a crear/modificar

**Nuevos:**
- `src/components/sessions/peru/SesionesWorkspace.tsx` — contenedor principal (KPIs + tabs + filtros + lista)
- `src/components/sessions/peru/SesionesKPIRow.tsx` — 4 KPI principales + 1 secundario
- `src/components/sessions/peru/SesionesFilterBar.tsx` — filtros y chips rápidos
- `src/components/sessions/peru/SesionAlertCard.tsx` — tarjeta con todos los chips de estado y acciones rápidas (Pin / Seguimiento / Archivar)
- `src/components/sessions/peru/SesionDetailWorkstation.tsx` — Sheet con header + 5 tabs
- `src/components/sessions/peru/tabs/TabResumen.tsx`
- `src/components/sessions/peru/tabs/TabAgenda.tsx` — bloques estructurados por ítem
- `src/components/sessions/peru/tabs/TabVideoFuente.tsx`
- `src/components/sessions/peru/tabs/TabIA.tsx` — Módulo Transcripción + Módulo Chatbot (independientes)
- `src/components/sessions/peru/tabs/TabRevisionLegal.tsx` — formulario editable
- `src/components/sessions/peru/SesionesEmptyStates.tsx` — empty states pulidos por tab/módulo
- `src/components/sessions/peru/ReportesConnector.tsx` — indicador conectado con Reportes
- `src/data/sesionesDemoAlerts.ts` — 4 alertas demo derivadas de la sesión PRESUPUESTO

**Modificados:**
- `src/types/peruSessions.ts` — extender modelo (compatibilidad: `is_pinned_for_publication` queda como alias)
- `src/hooks/usePeruSessions.ts` — agregar acciones `togglePin`, `toggleFollowUp`, `archiveSession`, `requestTranscription`, `requestChatbot`, `updateLegalReview`; sembrar las 4 demo si la BD está vacía
- `src/components/sessions/SessionsPage.tsx` — usar `SesionesWorkspace` en lugar de `PeruSessionsSection`
- `src/components/reports/ReportsPage.tsx` — añadir bloque opcional para incluir alertas de sesiones (pineadas / seguimiento / ambas) en el reporte

### 3. Layout del workspace

```text
┌───────────────────────────────────────────────────────────────────┐
│ Header existente: 🇵🇪  Sesiones del Congreso del Perú             │
├───────────────────────────────────────────────────────────────────┤
│ KPI ROW                                                           │
│ [Total sesiones] [Pineadas] [En seguimiento] [Procesando IA]      │
│                              [Elegibles para reporte] (secundario) │
├───────────────────────────────────────────────────────────────────┤
│ Tabs/segmentado:                                                  │
│  Todas · Nuevas · Pineadas · Seguimiento · Procesando IA ·        │
│  Listas para revisión · Archivadas                                │
├───────────────────────────────────────────────────────────────────┤
│ Filtros:                                                          │
│  [🔎 Buscar comisión/tema] [Comisión▾] [Fecha▾] [Estado IA▾]      │
│  [Estado editorial▾] [Etiqueta▾] [Impacto▾]                       │
│  Chips: 7d · 15d · 30d · Solo pineadas · Solo seguimiento         │
├───────────────────────────────────────────────────────────────────┤
│ ReportesConnector (banda discreta):                               │
│  "5 pineadas y 3 en seguimiento disponibles para reporte → Reportes" │
├───────────────────────────────────────────────────────────────────┤
│ Lista de SesionAlertCard (densidad compacta, dark premium)        │
└───────────────────────────────────────────────────────────────────┘
```

### 4. Diseño de la tarjeta de alerta

Cada `SesionAlertCard` muestra en una fila densa pero elegante:

- **Línea 1 (chips)**: Estado editorial · Etiqueta IA · Impacto · Riesgo · Urgencia
- **Línea 2 (título)**: `Ítem 5.x · Título del predictamen/proyecto` + `Comisión de PRESUPUESTO Y CUENTA GENERAL DE LA REPÚBLICA`
- **Línea 3 (meta)**: 📅 fecha y hora · 🏛 tipo de sesión · chips: Agenda · Video · Transcripción · Chatbot (cada uno con su color de estado)
- **Línea 4 (bills)**: badges de proyectos `14305/2025-PE`, etc.
- **Acciones rápidas (derecha)**: `📌 Pin/Unpin` · `👁 Seguimiento/Quitar` · `🗄 Archivar` · `↗ Abrir`

Sin "Publicar a cliente". Sin selector de cliente.

### 5. Workstation de detalle (Sheet)

Header sticky:
- Título de la sesión (con número de ítem)
- Comisión · fecha y hora · badge fuente `PERU_CONGRESS_SYNC`
- Chips de estado: Agenda · Video · Transcripción · Chatbot
- Botones primarios: `📌 Pin` · `👁 Dar Seguimiento` · `🗄 Archivar`

Tabs:

1. **Resumen** — executive_summary, etiqueta IA, impacto, urgencia, "Por qué importa", "Próximo paso sugerido"
2. **Orden del día** — bloques por ítem (número, título, bills, área, resumen corto, badge de impacto)
3. **Video y fuente** — link oficial, bloque YouTube (provider, channel, expected title, confidence, CTA "Abrir fuente")
4. **IA** — dos módulos **independientes**:
   - **Transcripción**: estado actual → CTA "Solicitar transcripción" → estados En cola / Procesando (~20 min) / Lista (con preview + búsqueda)
   - **Chatbot de la sesión**: estado actual → CTA "Preparar chatbot" → estados En cola / Procesando (~20 min) / Listo (con prompts sugeridos)
5. **Revisión legal** — formulario con: Resumen legal, Riesgo, Urgencia, Impacto, Áreas afectadas (multi-tag), Próximos pasos, Comentario experto. Auto-save.

### 6. Conexión visual con Reportes

`ReportesConnector` aparece en el workspace y al pie del detalle:

> "Las alertas pineadas y en seguimiento pueden incluirse desde Reportes" — `5 pineadas · 3 en seguimiento` — botón `Ir a Reportes`.

En `ReportsPage.tsx`, añadir una sección **"Alertas de Sesiones"** con tres opciones (checkboxes): incluir pineadas / incluir seguimiento / ambas. Sin builder por alerta dentro de Sesiones.

### 7. Estados visuales (chips reutilizables)

Tokens semánticos del proyecto:
- Editorial: Nueva (`muted`), En revisión (`primary/20`), Pineada (`primary`), En seguimiento (`amber`), Archivada (`slate`)
- Agenda/Video: lista/vinculado = `green`, pendiente = `amber`, error = `destructive`
- Transcripción/Chatbot: no solicitado = `slate`, en cola = `slate`, procesando = `blue` con spinner, listo = `green`, error = `destructive`

### 8. Empty states pulidos

- Sin pineadas / sin seguimiento / sin archivadas → ilustración mínima + copy claro
- Tab IA sin transcripción solicitada → "La transcripción no ha sido solicitada. Toma unos 20 min." + CTA
- Tab IA sin chatbot preparado → idem con CTA "Preparar chatbot"

### 9. Datos demo a sembrar

`src/data/sesionesDemoAlerts.ts` genera 4 alertas hijas de la sesión padre **PRESUPUESTO Y CUENTA GENERAL DE LA REPÚBLICA · 01/04/2026 09:00** con todos los campos del prompt. El hook `usePeruSessions` las inyecta cuando la BD devuelve vacío. Se redacta en español jurídico-regulatorio: resumen ejecutivo, "Por qué importa", impacto preliminar y próximo paso para cada ítem 5.1–5.4.

### Detalles técnicos

- Reutilizar `Sheet`, `Tabs`, `Card`, `Badge`, `Button` de shadcn ya en uso.
- Persistencia local de pin/seguimiento/archivado vía `localStorage` (mismo patrón que `peru_selected_sessions`); cuando exista BD se persiste vía Supabase en una migración futura, pero por ahora demo + local.
- Filtros y chips rápidos siguen el patrón de `SessionsFilterBar` actual (refactor in-place).
- Etiqueta IA toma el catálogo de tags del Perfil ya existente (lectura, no edición desde Sesiones).
- Conservar i18n en español en toda la UI, toasts y empty states.

### Lo que NO se toca

- Perfil
- Sidebar, shell, theme global
- Inbox (Proyectos de Ley / Normas) y su Kanban
- Auth, roles, multi-cliente (no aplica)
- Edge functions ni esquema de Supabase (sólo lectura de tabla actual)

