# Plan: Migrar sección de Reportes al backend externo (lawmeter.io)

## Objetivo
Eliminar la implementación actual de reportes (basada en `reports` local + ReportLayoutBuilder + generación PDF en cliente con `@react-pdf/renderer`) y reconstruirla como un consumidor del backend Python que ya genera PDF/DOCX, sube a Storage y envía por email via Resend.

## Decisiones pendientes (recomiendo confirmar antes de Sprint 3)
1. **Bucket `reports`**: público read-only para piloto (recomendación del backend). Cambiar a privado + signed URLs cuando salgamos de piloto.
2. **SUPABASE_SERVICE_ROLE_KEY**: ya existe en secrets (`SUPABASE_SERVICE_ROLE_KEY`). Solo hay que pasársela al backend por DM.
3. **GITHUB_PAT_REPO_DISPATCH**: ya existe en secrets. Confirmar que el PAT está vigente y apunta al repo correcto.

## Sprint 1 — Base de datos + Storage (bloqueante)

### 1.1 Migración SQL
- **Eliminar** la tabla `public.reports` actual (esquema viejo: title, alert_ids, pdf_url, etc.).
- **Crear** nueva `public.reports` con el shape del backend:
  `organization_id, client_id, cliente_slug, cliente_nombre, periodo_desde, periodo_hasta, modelo, formatos[], idioma, paises[], pipelines[], total_pl, total_normas, total_sesiones, decisiones_requeridas, expert_comments_count, archivos jsonb, generated_at`.
  - Índice único `(organization_id, client_id, periodo_hasta, modelo)`.
  - Índice `(client_id, periodo_hasta desc)`.
- **Crear** `public.client_email_recipients` con `email, nombre, kind ('to'|'cc'|'bcc'), activo, notes`.
  - Índice único `(client_id, lower(email), kind)`.
- **RLS + GRANTs** scoped por `organization_id` vía `profiles.id = auth.uid()`. GRANT a `authenticated` y `service_role`.
- **Bucket** `reports` (público read) creado vía SQL `insert into storage.buckets` + policy `select` pública.

### 1.2 Limpieza de código existente
Borrar / vaciar:
- `src/components/reports/ReportsPage.tsx` (UI antigua de generación local).
- `src/components/reports/ReportLayoutBuilder.tsx` (drag & drop de bloques PDF).
- `src/components/reports/captureAnalyticsSnapshots.ts`.
- `src/components/client-portal/ClientReports.tsx` (versión antigua).
- Dependencia `@react-pdf/renderer` (revisar si se usa solo aquí antes de remover).

Mantener referencias en `LawMeterDashboard.tsx` y `client-portal/index.ts`, pero apuntando a los nuevos componentes.

## Sprint 2 — Nueva UI de Reportes (admin / legal team)

Nuevo `src/components/reports/ReportsPage.tsx`:
- Tabla histórica de `reports` filtrable por cliente, período, modelo.
- Cada fila muestra: cliente, período, modelo (A/B), totales (PL / normas / sesiones / decisiones), `generated_at`.
- Acciones por fila: botones Descargar PDF / Descargar DOCX leyendo `archivos[].public_url` (o pidiendo signed URL si el bucket es privado).
- Pestaña / sección "Distribución" por cliente: CRUD sobre `client_email_recipients` (alta, edición, baja, toggle activo, TO/CC/BCC).
- Hook `useReports(clientId?)` y `useEmailRecipients(clientId)` con `@tanstack/react-query` (patrón ya usado en el resto del proyecto).

Cliente portal (`src/components/client-portal/ClientReports.tsx`):
- Read-only: lista de reportes del propio `client_id` con descarga PDF/DOCX. Sin CRUD de destinatarios.

## Sprint 3 — Generación on-demand

### 3.1 Edge function `trigger-report-generation`
- Valida sesión del usuario (Supabase auth).
- Valida que `client_id` pertenezca a `organization_id` del usuario.
- Hace `POST` a GitHub `repository_dispatch` con `event_type: "generate_report"` y `client_payload` (cliente_slug, ultimos_dias|desde/hasta, modelo, formato, idioma, paises, enviar_email, destinatarios).
- Usa `GITHUB_PAT_REPO_DISPATCH` (ya en secrets).
- `verify_jwt = true` (default) — el frontend pasa el JWT del usuario.

### 3.2 Modal "Generar reporte ahora"
- Botón en ReportsPage que abre modal con formulario:
  - Cliente (autocomplete), Período (últimos N días o rango custom), Modelo (A/B/ambos), Formato (PDF/DOCX/both), Idioma, Países, Enviar email (sí/no), Destinatarios extra.
- Submit llama a la edge function. Respuesta 202 → toast "Reporte en cola, llegará en unos minutos".

## Detalles técnicos
- Las edge functions `ingest-reports`, `export-recipients`, `export-expert-comments` que pide el backend para Sprint 2 son **opcionales** (el backend tiene fallback REST con service_role). Las dejamos para una segunda iteración salvo que el usuario las pida ahora.
- Realtime opcional sobre `reports` para refrescar la tabla cuando llegue un nuevo reporte generado por el cron.
- Mantener todo en español (UI, labels, toasts) según core memory.
- Scoping estricto: admin ve todos los reportes de su organización; cliente solo los de su `client_id` (RLS + filtro adicional en query).

## Riesgos / notas
- La tabla `reports` actual ya tiene datos potencialmente — al droparla se pierden. Confirmo con el usuario que es aceptable (parece que sí, dado el mensaje "borrar y recrear").
- `@react-pdf/renderer` puede estar siendo usado por analytics PDF exports — verificar antes de desinstalar.
- El bucket público expone los PDFs a cualquiera con URL; aceptable para piloto pero documentarlo.

## Orden de ejecución sugerido
1. Migración SQL (drop+create reports, create recipients, create bucket+policy).
2. Borrar archivos viejos del módulo.
3. Crear nuevos `ReportsPage` + `ClientReports` + hooks.
4. Edge function `trigger-report-generation` + modal de generación on-demand.
