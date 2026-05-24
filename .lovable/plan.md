# Plan: Integración de Mixpanel

## 1. Setup base

- Instalar `mixpanel-browser`.
- Agregar `VITE_MIXPANEL_TOKEN` como variable de entorno (te lo pediré con el tool de secrets/env al iniciar la implementación).
- Crear `src/lib/analytics/mixpanel.ts` con:
  - `initMixpanel()` — inicialización idempotente, `debug: false` en prod, `track_pageview: false` (lo manejamos manual con React Router).
  - `identifyUser(profile)` — llama `mixpanel.identify(user.id)` + `people.set` con `email`, `account_type`, `organization_id`, `client_id`, `created_at`.
  - `resetUser()` — `mixpanel.reset()` en logout.
  - `track(event, props?)` — wrapper que mergea super properties y hace no-op si el token no está configurado.
  - `registerSuperProperties(profile)` — `account_type`, `organization_id`, `client_id`, `environment` (dev/prod).

## 2. Bootstrapping

- `src/main.tsx`: llamar `initMixpanel()`.
- `src/contexts/AuthContext.tsx`: al cargar `profile` → `identifyUser` + `registerSuperProperties`. En `signOut` → `resetUser`.
- `src/App.tsx`: hook `usePageTracking` que escucha cambios de ruta y dispara `Page Viewed` con `{ path, tab }`.

## 3. Eventos a trackear (nivel completo)

**Auth & sesión**
- `User Signed Up`, `User Signed In`, `User Signed Out`, `Password Reset Requested`

**Navegación**
- `Page Viewed` (auto), `Tab Changed` (sidebar)

**Alertas (Inbox)**
- `Alert Opened` (id, tipo PL/norma, stage, impacto)
- `Alert Filter Applied` (filter_type, value)
- `Alert Search Performed` (query_length)
- `Alert Pinned` / `Alert Unpinned`
- `Alert Published` (client_ids[], has_commentary)
- `Alert Commentary Saved` (length)
- `Alert Feedback Submitted` (rating, reason)
- `Alert Stage Changed`

**Reportes**
- `Report Generated` (manual/scheduled, include_analytics)
- `Report PDF Downloaded`
- `Report Config Created` / `Updated` / `Deleted`

**Sesiones**
- `Session Opened`, `Session Published`, `Session QA Asked`, `Session Transcript Requested`

**Analíticas**
- `Analytics Dashboard Viewed` (view: internal/client)
- `Analytics Drilldown Opened` (metric)
- `Analytics Layout Customized`

**Calendario**
- `Calendar Event Clicked` (deep-link target)

**Carga manual (DC Legal)**
- `Manual Alerts Upload Started`, `Manual Alerts Upload Confirmed` (count, tipo)

**IA**
- `AI Feature Used` (feature_name, model) — espejo ligero de `ai_usage_logs`

## 4. Segmentación admin vs cliente

Todos los eventos llevan super property `account_type`. En Mixpanel podrás filtrar dashboards por `account_type = user` para uso real de clientes y excluir admins de DC Legal. No bloqueamos tracking de admins (útil para QA), solo lo dejas segmentable.

## 5. Detalles técnicos

- Helper `trackEvent` se importa donde se necesite; nunca rompe la UI si Mixpanel falla (try/catch silencioso).
- Token vive en `import.meta.env.VITE_MIXPANEL_TOKEN` (público, seguro para frontend).
- Sin PII sensible en propiedades (no enviamos contenido de alertas, solo IDs y metadata).
- Respeta el principio de aislamiento por org: `organization_id` y `client_id` van como super properties para que cada cohorte sea filtrable.

## 6. Archivos a crear/editar

**Crear**
- `src/lib/analytics/mixpanel.ts` (core)
- `src/lib/analytics/events.ts` (constantes de nombres de eventos)
- `src/hooks/usePageTracking.ts`

**Editar**
- `src/main.tsx` — init
- `src/contexts/AuthContext.tsx` — identify / reset
- `src/App.tsx` — page tracking hook
- `src/pages/Inbox.tsx` + componentes de alert (open, filter, search, pin, publish, feedback)
- `src/components/reports/ReportsPage.tsx` (generate, download, config CRUD)
- `src/components/sessions/SessionsPage.tsx` + `SesionDetailDrawer.tsx` + `SesionQABox.tsx`
- `src/components/analytics/*Dashboard.tsx` (view + drilldown + customization)
- `src/components/calendar/AlertsCalendar.tsx`
- `src/pages/UploadAlerts.tsx`
- `src/pages/Auth.tsx` (signup/signin events)

Al implementar pediré el token con el tool de secrets para que lo agregues como `VITE_MIXPANEL_TOKEN`.
