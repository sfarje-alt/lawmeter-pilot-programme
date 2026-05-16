## Objetivo

Crear un nuevo tenant **Diez Canseco** cuyo flujo de ingreso de alertas NO depende de scrapers/ingest automáticos, sino de un **portal interno de subida de JSON** (PLs y Normas por separado) con un **preview** antes de empujar al inbox.

---

## 1. Provisión de la cuenta (migration SQL)

Crear vía migración (mismo patrón que ISA):

- **Organization**: `Diez Canseco` — UUID `b7e15500-0006-4000-8000-000000000001`
- **Client**: `Diez Canseco` (vacío) — UUID `b7e15500-0007-4000-8000-000000000001`
- **Auth user**: `pmalca@dclegal.pe` / password `070398`  
  (bcrypt vía `crypt(..., gen_salt('bf'))`, entradas en `auth.users` + `auth.identities`)
- **Profile**: `P. Malca`, `account_type='admin'`, ligado a la org
- **user_roles**: rol `admin`
- Añadir el org id a `EMPTY_DATA_ORG_IDS` en `src/lib/orgDataIsolation.ts` para arrancar todas las secciones vacías.

---

## 2. Schema JSON propio simplificado

Documento a aceptar en el portal (un archivo por tipo):

```json
{
  "tipo": "pl" | "norma",
  "items": [
    {
      "external_id": "string (requerido, único)",
      "titulo": "string (requerido)",
      "resumen": "string opcional",
      "comentario": "string opcional",
      "impacto_categoria": "Alta|Media|Baja",
      "urgencia_categoria": "Alta|Media|Baja",
      "area_de_interes": ["string"],
      "url": "string opcional",
      "fuente": "string opcional",
      "fecha_publicacion": "DD/MM/YYYY o ISO (norma)",
      "fecha_presentacion": "DD/MM/YYYY o ISO (pl)",
      "codigo": "string opcional (pl)",
      "estado_actual": "string opcional (pl)",
      "autores": ["string"] (pl),
      "entity": "string opcional (norma)",
      "reference_number": "string opcional (norma)",
      "sumilla": "string opcional (norma)"
    }
  ]
}
```

Mapeo interno al schema canónico de `ingest-alerts` (impacto/urgencia categóricos → numéricos, normalización de fechas, construcción de `ai_analysis.ui_extras`, etc).

---

## 3. Edge function nueva: `ingest-alerts-manual`

- Auth: **JWT del usuario logueado** (no INGEST_TOKEN); valida que el caller pertenece a la org Diez Canseco vía `profiles.organization_id`.
- Acepta body `{ tipo, items[] }` con el schema simplificado, valida con zod.
- Reusa la lógica de mapeo de `ingest-alerts` (upsert idempotente por UUIDv5 con seed `org|client|tipo|external_id|v1`).
- Inyecta `organization_id` y `client_id` desde el server (no del cliente).
- Devuelve `{ processed, inserted, updated, failed }`.

> Alternativa más simple: llamar al `ingest-alerts` existente desde el frontend con `INGEST_TOKEN`. Se descarta porque exponer el token al browser es inseguro. Por eso una función dedicada con JWT.

---

## 4. Portal de subida (UI)

Nueva ruta `/upload-alerts` accesible solo para admins de orgs marcadas como "manual ingest" (Diez Canseco). Entrada en el sidebar: **"Cargar alertas"** con icono `Upload`.

### Layout

- **Header**: título "Cargar alertas (JSON)" + descripción corta.
- **Tabs** (selector explícito de tipo):
  - **Proyectos de Ley**
  - **Normas**

### Por cada tab, dos estados:

**Estado A — Upload**
- Dropzone para `.json` (drag&drop + input file).
- Link "Descargar plantilla" → genera JSON de ejemplo del tipo seleccionado.
- Al soltar archivo: parseo client-side, validación con zod del schema simplificado.
- Errores de parseo → toast rojo con detalle de campo.

**Estado B — Preview**
- Cabecera: "N alertas detectadas" + botones **Cancelar** / **Confirmar e ingresar al inbox**.
- Lista de cards (read-only) con: título, código/reference_number, fecha, impacto/urgencia (badges), resumen truncado, fuente/url.
- No hay edición ni selección por item — confirmación all-or-nothing.

### Acción "Confirmar"
- POST a `ingest-alerts-manual` con el JSON original.
- Toast con resumen (`X insertadas, Y actualizadas, Z fallidas`).
- Redirige a `/inbox?tab={bills|regulations}`.

---

## 5. Marca de "manual ingest org"

- Añadir `MANUAL_INGEST_ORG_IDS` en `src/lib/orgDataIsolation.ts` (set con el id de Diez Canseco).
- Helper `isManualIngestOrg(orgId)`.
- `AppSidebar` muestra el item "Cargar alertas" solo si `isManualIngestOrg(currentOrgId)` Y `account_type === 'admin'`.
- La ruta también protege con el mismo check.

---

## 6. Archivos nuevos / modificados

**Nuevos**
- `supabase/migrations/<timestamp>_diez_canseco_tenant.sql`
- `supabase/functions/ingest-alerts-manual/index.ts`
- `src/pages/UploadAlerts.tsx`
- `src/components/upload/JsonDropzone.tsx`
- `src/components/upload/AlertsPreviewList.tsx`
- `src/lib/manualAlertSchema.ts` (zod schema + ejemplo plantilla)

**Modificados**
- `src/lib/orgDataIsolation.ts` (añade org Diez Canseco a empty + manual ingest set)
- `src/App.tsx` (ruta `/upload-alerts`)
- `src/components/layout/AppSidebar.tsx` (item condicional)

---

## 7. Notas técnicas

- El portal NO toca el flujo actual de ISA/Betsson — solo Diez Canseco lo verá.
- El edge function reutiliza casi todo el código de mapeo de `ingest-alerts`; se puede extraer un módulo `_shared/mapAlertItem.ts` si quieres evitar duplicación (recomendado pero opcional, se puede hacer copy en una primera iteración).
- RLS existente de `alerts` ya garantiza aislamiento: el `organization_id` se setea server-side a partir del JWT del caller.
- Sin cambios en `peruAlertsMockData` ni componentes de inbox — los datos cargados aparecen automáticamente porque vienen de la tabla `alerts` ya consumida por `useAlerts`.
