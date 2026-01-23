
# Plan: Generador Inteligente de Reportes

## Resumen Ejecutivo

Se implementará un sistema completo de generación de reportes legislativos profesionales que permitirá a los administradores configurar, generar y programar reportes personalizados por cliente. Los reportes incluirán proyectos de ley, normas y sesiones legislativas, con subdivisión por estado procesal y comentarios expertos.

## Alcance del Feature

### Funcionalidades Principales

1. **Wizard de Configuración de Reportes (16 pasos según screenshot)**
   - Tipo de reporte (Diario, Semanal, Personalizado)
   - Acción (Generar ahora, Programar, Ver historial)
   - Audiencia (Selector de cliente, área opcional)
   - Rango de fechas (Hoy, 7 días, 30 días, personalizado)
   - Filtros de etapa (Solo Bills, Bills + Enacted, Solo Enacted)
   - Estados de PLs (17 estados procesales)
   - Tipos de normas (Ley, Decreto Supremo, Resoluciones, etc.)
   - Filtros de negocio (Sector, Área, Tema)
   - Opciones de contenido
   - Opciones de analytics
   - Output y delivery (PDF o DOCX)
   - Configuración de programación (frecuencia, día, hora, timezone)
   - Destinatarios (Email, WhatsApp)
   - Preview y confirmación
   - Audit trail

2. **Generación de PDF Profesional**
   - Portada con logo y datos del cliente
   - Sección de Proyectos de Ley subdividida por estado procesal
   - Sección de Normas agrupadas por institución
   - Sección de Sesiones con resúmenes de AI
   - Comentario experto por cada alerta
   - Diseño profesional y consistente

3. **Integración con Datos Existentes**
   - Usar alertas publicadas al cliente desde el Inbox
   - Respetar filtros del perfil del cliente
   - Incluir comentarios expertos por cliente

## Arquitectura Técnica

### Nuevos Archivos a Crear

```text
src/components/reports/
├── ReportGenerator.tsx           # Componente principal del wizard
├── ReportWizardSteps/
│   ├── Step01TypeOfReport.tsx    # Tipo de reporte
│   ├── Step02ChooseAction.tsx    # Acción a realizar
│   ├── Step03Audience.tsx        # Selector de cliente
│   ├── Step04DateRange.tsx       # Rango de fechas
│   ├── Step05Stage.tsx           # Etapa legislativa
│   ├── Step06BillsStatus.tsx     # Estados procesales
│   ├── Step07TypeOfLaws.tsx      # Tipos de normas
│   ├── Step08BusinessFilters.tsx # Filtros de negocio
│   ├── Step09ContentOptions.tsx  # Opciones de contenido
│   ├── Step10AnalyticsOptions.tsx# Opciones de analytics
│   ├── Step11OutputDelivery.tsx  # Formato de salida
│   ├── Step12ScheduleSettings.tsx# Programación
│   ├── Step13Recipients.tsx      # Destinatarios
│   ├── Step14PreviewConfirm.tsx  # Vista previa
│   └── Step15AuditTrail.tsx      # Historial
├── ReportPreview.tsx             # Vista previa del reporte
├── ReportPDFGenerator.tsx        # Generador de PDF
├── ReportHistory.tsx             # Historial de reportes
├── ReportScheduler.tsx           # Programador de reportes
└── types.ts                      # Tipos para reportes
```

### Dependencia Nueva Requerida
- `@react-pdf/renderer` - Para generación de PDF profesional client-side

### Flujo de Datos

```text
+-------------------+       +------------------+       +-------------------+
|   Report Wizard   |  -->  |  Filter Alerts   |  -->  |  Generate PDF     |
|   (16 Steps)      |       |  (Published to   |       |  (Professional    |
|                   |       |   Client)        |       |   Layout)         |
+-------------------+       +------------------+       +-------------------+
         |                          |                          |
         v                          v                          v
+-------------------+       +------------------+       +-------------------+
| Client Profile    |       | peruAlertsMock   |       | Download/Email    |
| Settings          |       | Data.ts          |       | Distribution      |
+-------------------+       +------------------+       +-------------------+
```

## Implementación Detallada

### Paso 1: Tipos y Interfaces

```typescript
// src/components/reports/types.ts

export type ReportType = 'daily' | 'weekly' | 'custom';
export type ReportAction = 'generate_now' | 'schedule' | 'view_history';
export type OutputFormat = 'pdf' | 'docx';
export type DateMode = 'today' | 'last_7' | 'last_15' | 'last_30' | 'last_60' | 'last_90' | 'custom';
export type LegislationStage = 'only_bills' | 'bills_and_enacted' | 'only_enacted';

export interface ReportConfig {
  // Step 1: Type of Report
  reportType: ReportType;
  
  // Step 2: Action
  action: ReportAction;
  
  // Step 3: Audience
  clientIds: string[];
  targetAreas?: string[];
  
  // Step 4: Date Range
  dateMode: DateMode;
  customDateFrom?: Date;
  customDateTo?: Date;
  
  // Step 5: Stage
  legislationStage: LegislationStage;
  
  // Step 6: Bills Status
  billsStatuses: string[];  // 17 estados procesales
  
  // Step 7: Type of Laws (Normas)
  normTypes: string[];
  entities: string[];
  
  // Step 8: Business Filters
  sectors: string[];
  areas: string[];
  themes: string[];  // Law branches
  
  // Step 9: Content Options
  includeSessions: boolean;
  includeExpertCommentary: boolean;
  
  // Step 10: Analytics Options
  includeAnalytics: boolean;
  analyticsSections: string[];
  
  // Step 11: Output & Delivery
  outputFormat: OutputFormat;
  
  // Step 12: Schedule (only for scheduled reports)
  frequency?: 'daily' | 'weekly';
  weeklyDay?: number;
  scheduleTime?: string;
  timezone?: string;
  sendOnlyIfAlerts?: boolean;
  
  // Step 13: Recipients
  emailRecipients: string[];
  whatsappRecipients: string[];
}

export interface ReportAuditEntry {
  id: string;
  generatedAt: string;
  generatedBy: string;
  reportType: ReportType;
  clientIds: string[];
  filters: Partial<ReportConfig>;
  status: 'sent' | 'failed' | 'pending';
  channels: ('email' | 'whatsapp')[];
  downloadUrl?: string;
}
```

### Paso 2: Estructura del PDF

```text
+================================================+
|                                                |
|  [LOGO]     REPORTE LEGISLATIVO                |
|             FarmaSalud Perú S.A.C.             |
|             23 de Enero 2026                   |
|             Período: Últimos 7 días            |
|                                                |
+================================================+

+------------------------------------------------+
| RESUMEN EJECUTIVO                              |
+------------------------------------------------+
| • 5 Proyectos de Ley relevantes               |
| • 3 Normas publicadas                          |
| • 2 Sesiones de comisión monitoreadas         |
+------------------------------------------------+

+================================================+
| PROYECTOS DE LEY                               |
+================================================+

+--- PRESENTADO (2) -----------------------------|
|                                                |
| PL 13172/2025-CR                              |
| Título: PROYECTO DE LEY QUE CREA LA AUTORIDAD |
|         NACIONAL DE SALUD...                   |
| Autor: Bustamante Donayre, Carlos             |
| Grupo: Fuerza Popular                          |
| Fecha: 11/11/2025                             |
|                                                |
| COMENTARIO EXPERTO:                            |
| Se modifican los principios de la Ley...       |
|                                                |
+------------------------------------------------+

+--- EN COMISIÓN (2) ----------------------------|
| ...                                            |
+------------------------------------------------+

+--- DICTAMEN (1) -------------------------------|
| ...                                            |
+------------------------------------------------+

+================================================+
| NORMAS PUBLICADAS                              |
+================================================+

+--- MINSA (2) ----------------------------------|
| ...                                            |
+------------------------------------------------+

+--- ESSALUD (1) --------------------------------|
| ...                                            |
+------------------------------------------------+

+================================================+
| SESIONES DE COMISIÓN                           |
+================================================+
| ...                                            |
+================================================+
```

### Paso 3: Integración en Sidebar

El sidebar ya tiene un ítem "Reports" definido. Se conectará el componente del wizard a esta sección.

### Paso 4: Lógica de Filtrado

```typescript
// Pseudocódigo del filtrado de alertas para el reporte
function getAlertsForReport(config: ReportConfig): PeruAlert[] {
  return ALL_MOCK_ALERTS.filter(alert => {
    // Solo alertas publicadas al cliente seleccionado
    if (alert.status !== 'published') return false;
    if (!config.clientIds.includes(alert.client_id)) return false;
    
    // Filtrar por rango de fechas
    const alertDate = parseDate(alert.stage_date || alert.publication_date);
    if (!isWithinDateRange(alertDate, config)) return false;
    
    // Filtrar por tipo de legislación
    if (config.legislationStage === 'only_bills' && alert.legislation_type !== 'proyecto_de_ley') return false;
    if (config.legislationStage === 'only_enacted' && alert.legislation_type !== 'norma') return false;
    
    // Filtrar por estados (para PLs)
    if (alert.legislation_type === 'proyecto_de_ley') {
      if (config.billsStatuses.length && !config.billsStatuses.includes(alert.current_stage)) return false;
    }
    
    // Filtrar por tipo de norma
    if (alert.legislation_type === 'norma') {
      if (config.normTypes.length && !matchesNormType(alert, config.normTypes)) return false;
      if (config.entities.length && !config.entities.includes(alert.entity)) return false;
    }
    
    // Filtrar por sector/área/tema
    if (config.sectors.length && !matchesSector(alert, config.sectors)) return false;
    if (config.areas.length && !matchesArea(alert, config.areas)) return false;
    
    return true;
  });
}
```

## Plan de Implementación

### Fase 1: Estructura Base
1. Crear tipos e interfaces en `src/components/reports/types.ts`
2. Crear componente principal `ReportGenerator.tsx` con navegación del wizard
3. Implementar los primeros 8 pasos del wizard (configuración de contenido)

### Fase 2: Generación de PDF
1. Instalar `@react-pdf/renderer`
2. Crear `ReportPDFGenerator.tsx` con el diseño profesional
3. Implementar la lógica de agrupación por estado procesal
4. Agregar comentarios expertos por alerta

### Fase 3: Preview y Descarga
1. Implementar `ReportPreview.tsx` para vista previa
2. Agregar botón de descarga de PDF
3. Conectar con la pestaña "Reports" en el sidebar

### Fase 4: Programación y Historial
1. Implementar `ReportScheduler.tsx` (configuración de programación)
2. Crear `ReportHistory.tsx` para audit trail
3. Almacenar configuraciones programadas (mock inicial)

### Fase 5: Integración Final
1. Conectar el filtrado con datos de alertas publicadas del Inbox
2. Agregar validaciones de formulario
3. Pulir diseño y UX

## Consideraciones Importantes

1. **Datos Mock**: Inicialmente, los reportes usarán datos mock de `peruAlertsMockData.ts`. Las alertas "publicadas" al cliente serán las que aparezcan en el reporte.

2. **Estados Procesales**: Se usará la lista canónica de 17 estados de `ALL_LEGISLATIVE_STAGES` para garantizar consistencia con Inbox y Analytics.

3. **Comentarios Expertos**: El PDF mostrará el `expert_commentary` de cada alerta o el `client_commentaries` específico para el cliente seleccionado.

4. **Sesiones**: Se incluirán las sesiones pineadas y publicadas al cliente desde la sección Sessions.

5. **PDF vs DOCX**: La implementación inicial soportará solo PDF. DOCX puede agregarse posteriormente.

