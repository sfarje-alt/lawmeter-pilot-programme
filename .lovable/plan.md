

## Plan: Limpiar restos de FarmaSalud y aislar data de Bedson/Betsson

Hoy el sistema tiene tres focos de fugas mock que afectan la cuenta de **Betsson Group** (el ID "Bedson" del piloto):

1. **Perfil** (`ClientProfileView` y `ClientsPage`) — carga `FARMASALUD_CLIENT_PROFILE` por defecto.
2. **Reportes** — `readCompanyName()` cae a `MOCK_CLIENT_PROFILES[0].legalName` ("FarmaSalud Perú S.A.C."), y faltan opciones para el filtro de sesiones.
3. **Analíticas** — `LegalTeamAnalyticsDashboard` pasa `getDemoDataForClient('all')` a todos los bloques, ignorando si la org tiene data real o no.

Existe ya una utilidad `isEmptyDataOrg(orgId)` que marca a Betsson como organización "vacía"; el Inbox y Sesiones la respetan, pero Reportes, Perfil y Analíticas no.

---

### 1) Perfil rígido de Bedson (esperando documento)

**Crear** `src/data/bedsonClientProfile.ts` con `BEDSON_CLIENT_PROFILE: ClientProfile` rellenado con los datos del Word que vas a subir.

**`ClientsPage.tsx`**:
- Cuando `profile.organization_id` es de Betsson (vía `isEmptyDataOrg`), cargar `BEDSON_CLIENT_PROFILE` por defecto en lugar de `FARMASALUD_CLIENT_PROFILE`.
- Mantener el formulario editable para que pueda ajustarse, pero la base inicial será Bedson.

**`ClientProfileView.tsx`** (portal cliente, hoy hardcodeado a FarmaSalud):
- Reemplazar el objeto local `MOCK_CLIENT_PROFILE` por una lectura de `BEDSON_CLIENT_PROFILE` (vista read-only).

> Espero el Word de Bedson antes de implementar para llenar campos reales. Si quieres avanzar mientras, puedo dejar el archivo con placeholders y completarlo después.

---

### 2) Reportes

**Etiqueta de organización** (`ReportsPage.tsx`, línea 100-111):
- Cambiar `readCompanyName()`: si hay `profile.organization_id` y es Betsson → devolver `"Bedson Group"` (o el legal name del perfil Bedson cargado). Eliminar el fallback a `MOCK_CLIENT_PROFILES[0]`.
- El header "Organización: …" ahora mostrará "Bedson Group".

**Filtro de fecha de sesiones** (nuevo, dentro del panel "Choices"):
- Cuando `source === "sesiones" || "mixto"`, mostrar dos checkboxes independientes bajo el campo Período:
  - ☑ Incluir sesiones cuya **fecha de sesión** esté en el período
  - ☐ Incluir sesiones cuya **fecha de análisis IA** esté en el período (`analysis_completed_at`)
- Una sesión entra al reporte si pasa **cualquiera** de los criterios marcados (OR lógico).
- `filteredSessions` y `handleRunScheduledNow` se actualizan para usar esa lógica; los `ScheduledReport` persisten ambos flags.

**Verificación de botones**:
- Auditar: "Generar reporte", "Programar", "Ejecutar ahora", "Pausar/Reanudar", "Eliminar programación", "Descargar PDF histórico". Asegurar que cada uno tiene handler funcional y que la pestaña "Programados" y "Generados" se actualizan en vivo.

---

### 3) Analíticas — usar solo datos reales de Bedson

**`LegalTeamAnalyticsDashboard.tsx`**:
- Detectar `isEmptyDataOrg(organization_id)` con `useAuth()`.
- Cuando es vacío:
  - **No** llamar a `getDemoDataForClient('all')`.
  - Pasar a cada bloque sus datos calculados desde `useAlerts()` (alertas reales de Bedson) y `useSesionesWorkspace()` (sesiones reales).
  - Bloques que dependen de métricas que aún no recolectamos (ej. `DetectionToActionTimeBlock`, `AIUsageBlock`, `IndustryBenchmarkBlock`, `ReportsGeneratedBlock`, `EditorialResponseTimeBlock`) reciben `data={undefined}` o `alerts={[]}` y muestran un **estado vacío** uniforme.

**Estado vacío estandarizado**:
- Añadir prop opcional `emptyMessage` al `AnalyticsBlock` (o reutilizar el slot existente). Si los datos están vacíos, renderiza un placeholder centrado: ícono + "Sin datos suficientes" + subtítulo "Los datos aparecerán cuando se acumule actividad real".
- Aplicar a los bloques que hoy reciben `demoData.*` siempre.

**Bloques con cómputo real disponible** (mantienen visualización si hay alertas/sesiones):
- ImpactMatrix, RegulatoryPulse, AlertPriority, AlertDistribution, LegislativeFunnel, TopEntities, PopularTopics, KeyMovements, EmergingTopics, Exposure, PinnedArchived → calcular desde alertas reales.
- SessionsByCommission, SessionsTemporalEvolution, SessionAgendaType, SessionTopics, SessionRecurringBills → calcular desde sesiones reales de Bedson.

**ClientAnalytics.tsx** (portal cliente): mismo tratamiento — eliminar el fallback a `MOCK_CLIENTS` para sector y usar Bedson.

---

### Archivos a tocar

```
src/data/bedsonClientProfile.ts            (nuevo)
src/components/clients/ClientsPage.tsx     (default profile por org)
src/components/client-portal/ClientProfileView.tsx  (Bedson read-only)
src/components/client-portal/ClientAnalytics.tsx    (sin mock)
src/components/reports/ReportsPage.tsx     (org name + filtro sesiones + auditar botones)
src/components/analytics/LegalTeamAnalyticsDashboard.tsx  (data real / estado vacío)
src/components/analytics/shared/AnalyticsBlock.tsx        (prop emptyMessage)
src/components/analytics/blocks/*.tsx      (manejar undefined → empty state)
```

---

### Próximo paso

Sube el **Word de Bedson** y avanzo con todo en una sola pasada. Sin él, dejaría placeholders en el perfil y tendrías que re-editar.

