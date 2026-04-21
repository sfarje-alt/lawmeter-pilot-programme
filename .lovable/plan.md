

## Fix `ingest-alerts` + drawer flexible para fechas identificadas

### Problema raíz
1. La edge function lee `source.*` (nombres viejos), pero tu pipeline manda `source_ref.*` con campos nuevos (`entity`, `reference_number`, `fuente` como URL, `date` en DD/MM/YYYY). Resultado: todas las columnas top-level de norma quedan en `null`.
2. `fechas_identificadas` se guarda en `ai_analysis` pero no se aprovecha: ni para poblar `fecha_publicacion`, ni para mostrarse al usuario en el drawer.
3. Forzar cada rol a una columna fija sería frágil — los roles varían de norma a norma (`aprobacion`, `publicacion`, `plazo`, `vigencia_inicio`, `vigencia_fin`, `entrada_vigor`, `consulta`, lo que sea, y puede haber varios del mismo rol).

### Estrategia
- **Columnas top-level**: solo las 2 que el sistema usa para lógica → `fecha_publicacion` (para ordenar/filtrar/mostrar en card) y `deadline` (para calendario y alerts urgentes).
- **Resto de fechas**: se preservan crudas en `ai_analysis.fechas_identificadas[]` y se muestran en el drawer como lista flexible con rol + fecha + contexto. Acepta cualquier rol, cualquier cantidad.

### Cambios en `supabase/functions/ingest-alerts/index.ts`

1. **Helper `readSourceRef(item)`** — acepta tanto `source_ref` como `source` y normaliza:
   - `entity` ← `src.entity ?? src.entidad`
   - `reference_number` ← `src.reference_number`
   - `url` ← `src.url ?? src.fuente` (tu `fuente` es la URL completa)
   - `fuente_label` ← derivar "El Peruano" / "SPIJ" desde la URL si es reconocible, sino guardar la URL como label
   - `fecha_publicacion_iso` ← normalizar `src.date ?? src.fecha_publicacion` (acepta `DD/MM/YYYY` o ISO)
   - `sumilla` ← `src.sumilla`

2. **Helper `normalizeDate(s)`**: `DD/MM/YYYY` → `YYYY-MM-DD`. ISO se mantiene. Inválida → `null`.

3. **Helper `pickPublicationDate(item, src)`** — prioridad:
   1. `src.date / src.fecha_publicacion` normalizada
   2. Primer item de `fechas_identificadas` con `rol === "publicacion"` (o variantes: `publicación`, `published`)
   3. `null`

4. **`pickDeadline()`** — mantener lógica actual, pero ampliar roles aceptados: `["plazo", "vencimiento", "vigencia_inicio", "entrada_vigor"]` (en ese orden de prioridad). Acepta cualquier rol que coincida case-insensitive.

5. **`external_id` opcional**: fallback automático a `item.alerta_id`. Si tampoco existe, error claro.

6. **Mapeo a columnas top-level** (norma):
   - `entity`, `reference_number`, `sumilla` ← desde `readSourceRef`
   - `url`, `source_url` ← desde `readSourceRef.url`
   - `fuente` ← `readSourceRef.fuente_label`
   - `fecha_publicacion` ← desde `pickPublicationDate`
   - `published_at` ← mismo valor
   - `deadline` ← desde `pickDeadline`
   - `legislation_summary` ← `item.resumen ?? item.comentario` (fallback porque tu pipeline manda el análisis en `comentario`)
   - `affected_areas` ← `item.area_de_interes ?? []`

7. **`ai_analysis` enriquecido** (preservar todo crudo para el drawer):
   - `fechas_identificadas` ← `item.fechas_identificadas ?? []` (sin filtrar nada, todos los roles)
   - `racional`, `impacto`, `urgencia`, `model`, `version`, `generated_at`, `alerta_id` ← como ya está
   - `ui_extras.source_client` ← `{ id: cliente_id, name: cliente_nombre }` para auditoría
   - `ui_extras.raw_payload` ← payload crudo del item para reprocesamiento futuro

8. **No tocar PL/sesion**: misma lógica de source aplica gratis (ya que `readSourceRef` es agnóstico).

### Cambios en `src/components/inbox/AlertDetailDrawer.tsx`

Agregar/asegurar sección **"Fechas identificadas"** flexible:

```text
┌─ Fechas identificadas ──────────────┐
│ [aprobación] 14 abr 2026            │
│   Lima, 14 de abril – fecha de...   │
│                                     │
│ [publicación] 17 abr 2026           │
│   Publicación en El Peruano: 17/04  │
│                                     │
│ [plazo] 17 may 2026  ⏰              │
│   Plazo de 30 días calendario...    │
└─────────────────────────────────────┘
```

- Render: lista (no tabla) con cada `{ rol, fecha, contexto }` de `key_dates`.
- Badge de rol con color por categoría (publicación = azul, plazo/vencimiento = naranja, vigencia = verde, otros = gris).
- Fecha formateada `dd MMM yyyy`.
- Contexto en texto pequeño debajo.
- Si la fecha es futura y rol es plazo/vencimiento/vigencia_inicio: icono ⏰.
- Acepta CUALQUIER rol — colorea los conocidos, los demás caen al gris default.
- Si `key_dates` está vacío, no se renderiza la sección.

### Cambios en `src/components/client-portal/ClientAlertDetailDrawer.tsx`

Mismo bloque "Fechas identificadas" (read-only, sin acciones). Dejar consistente con admin drawer.

### Verificación post-deploy

1. Re-ingestar la `RESOLUCION SBS N° 01116-2026`.
2. Query a `alerts` para confirmar columnas top-level pobladas: `entity`, `reference_number`, `url`, `fecha_publicacion`, `sumilla`.
3. Abrir drawer en Inbox → debe mostrar las 3 fechas (aprobación, publicación, plazo) como lista flexible con badges de color.
4. Card en Inbox → entity badge, reference_number, link externo y fecha de publicación visibles.

### Lo que NO cambia
- Schema del DB (todas las columnas existen).
- ID determinístico (`uuidv5`).
- Frontend `AlertsContext` y `InboxAlertCard` — el mapping ya está listo, solo necesita data.
- RLS, `INGEST_TOKEN`.
- Lógica de PLs / sesiones (se beneficia gratis del nuevo `readSourceRef`).

