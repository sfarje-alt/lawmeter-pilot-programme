

## Plan: Eliminar funcionalidades obsoletas y consolidar a un único perfil en TODA la plataforma

Combina los cambios anteriores con una limpieza global del selector/filtro de cliente en Reportes, Analíticas y Calendario.

---

### 1. Eliminar Probabilidad de Aprobación
- `InboxAlertCard.tsx`: quitar import, cálculo y badge de probabilidad + ícono `TrendingUp` huérfano.
- `AlertDetailDrawer.tsx`: quitar badge en header e ícono `TrendingUp` huérfano.
- `peruAlertsMockData.ts`: borrar `approval_probability`, `getMockApprovalProbability`, `getApprovalProbabilityInfo`.
- Borrar `src/components/inbox/ApprovalProbability.tsx`.

### 2. Eliminar Plan de Acción
En `AlertDetailDrawer.tsx`: borrar la sección "Action plan" completa, interface `ActionItem`, estados (`actions/newTask/newOwner/newDue`), funciones (`addAction/toggleAction/removeAction`) e íconos `ListChecks/Plus/Trash2` huérfanos.

### 3. Consolidar a perfil único — Bandeja
- `AppSidebar.tsx`: renombrar `"Perfiles"` → `"Perfil"`.
- `Inbox.tsx`: borrar `selectedClientId`, `PublicationPanel`, `batchPublishPinned` y propagación de props relacionados.
- `BillsInbox.tsx` / `RegulationsInbox.tsx`: quitar estado/filtro `clientIds`, columna cliente en filter bars, prop `onPublish`.
- `KanbanColumn.tsx` / `InboxAlertCard.tsx`: quitar props `selectedClientId`/`hasCommentaryForClient`, badges "Publicado a Cliente X". El indicador de comentario se reduce a `¿hay expert_commentary?`.
- `AlertDetailDrawer.tsx`: quitar prop `onPublish`, lógica `ClientCommentary`.
- `AlertsContext.tsx`: eliminar `publishAlert`, `unpublishAlert`, `getPublishedAlertsForClient`, `hasCommentaryForClient`, `updateAlertCommentary`. Remover prepublicación a Backus/FarmaSalud en `initializeAlerts`.
- Borrar `src/components/inbox/PublicationPanel.tsx`.

### 4. Consolidar a perfil único — Sección Perfil
`ClientsPage.tsx`: reemplazar lista + drawer + wizard por **formulario directo** del perfil único, con tabs (Datos básicos, Monitoreo, Etiquetas, Confirmación) reutilizando `Step1Basics/Step2Monitoring/Step3Tags/Step5Confirm`. Persistencia en `localStorage` (`lawmeter:company-profile`). Botón único "Guardar cambios". Sin crear/eliminar.

### 5. Consolidar a perfil único — Reportes
- `ReportsPage.tsx`: eliminar selector/dropdown de cliente, listado por cliente y configuraciones por cliente. El reporte se genera para **el perfil único**.
- Quitar columna "Cliente" en cualquier tabla y badges de cliente.
- La configuración de reporte (frecuencia, métricas, "Incluir Analíticas") queda como **una sola configuración global**, persistida en `localStorage` (`lawmeter:report-config`).
- Generación manual: PDF respeta el perfil único; remover paso de "seleccionar cliente" si existe en el flujo.

### 6. Consolidar a perfil único — Analíticas
- `LegalTeamAnalyticsDashboard.tsx` y filtros globales (`AnalyticsGlobalFilters.tsx`): eliminar dropdown/multiselect "Cliente" y cualquier agrupamiento por cliente.
- En bloques que mostraban distribución por cliente (`ClientComparisonChart`, `ClientDistributionCharts`, `ClientImpactMatrix`, `ClientAlertTimelineChart`): **ocultar/retirar del dashboard** del equipo legal por irrelevancia. Mantener archivos para no romper imports residuales, pero quitar su registro en `blocks/index.ts` y en el layout por defecto.
- `IndustryBenchmarkBlock`: se mantiene (compara contra industria, no entre clientes).
- Quitar prop/filtro `clientIds` de `useBlockFilters` defaults y de cualquier bloque que lo use.

### 7. Consolidar a perfil único — Calendario
- `AlertsCalendar.tsx` + `useCalendarFilters.ts`: eliminar filtro "Perfil/Cliente" y badges de cliente en eventos. El calendario muestra todas las alertas del perfil único.
- Mantener resto de filtros (impacto, urgencia, etapa, etiquetas, búsqueda, reglas de fecha).

### 8. Limpieza transversal
- `useClientUser.ts`: ya devuelve `isClientUser: false`. Eliminar entradas `client-*` del sidebar y rutas no usadas en `LawMeterDashboard.tsx`.
- `MOCK_CLIENTS` / `mockClientProfiles.ts`: conservar solo como fuente del perfil único por defecto (no borrar para evitar romper imports).

---

### Diagrama

```text
ANTES                                    DESPUÉS
──────────────────────────────────      ──────────────────────────────────
Sidebar "Perfiles" (lista N)            Sidebar "Perfil" (1 formulario)
Inbox: selector cliente + publish       Inbox: solo clasificar/archivar
Drawer: publicar + plan acción          Drawer: comentario + archivar
Card: badge probabilidad + clientes     Card: limpia, sin badges cliente
Reportes: por-cliente + config N        Reportes: 1 config global
Analíticas: filtro cliente + comparar   Analíticas: solo perfil único
Calendario: filtro cliente              Calendario: sin filtro cliente
```

### Archivos clave
**Modificar**: `AppSidebar.tsx`, `Inbox.tsx`, `BillsInbox.tsx`, `RegulationsInbox.tsx`, `BillsFilterBar.tsx`, `RegulationsFilterBar.tsx`, `KanbanColumn.tsx`, `InboxAlertCard.tsx`, `AlertDetailDrawer.tsx`, `AlertsContext.tsx`, `peruAlertsMockData.ts`, `ClientsPage.tsx`, `ReportsPage.tsx`, `LegalTeamAnalyticsDashboard.tsx`, `AnalyticsGlobalFilters.tsx`, `analytics/blocks/index.ts`, `AlertsCalendar.tsx`, `useCalendarFilters.ts`, `LawMeterDashboard.tsx`.

**Borrar**: `ApprovalProbability.tsx`, `PublicationPanel.tsx`.

### Reglas respetadas
- Sin lógica multi-cliente en ninguna sección de UI.
- Sin duplicación de datos; reutiliza componentes Step1-5 y `AlertDetailDrawer` existentes.
- UI en español, tokens semánticos.

