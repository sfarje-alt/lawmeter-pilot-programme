
# Plan: Analytics Overhaul - Sistema Dual (Equipo Legal + Cliente)

## Resumen Ejecutivo

Este plan implementa una renovación completa del sistema de analíticas con dos vistas diferenciadas (Equipo Legal interno y Cliente view-only), un constructor de plantillas de reportes con drag & drop, y gráficos renderizables tanto en dashboard interactivo como en PDF estático. El sistema se basa en datos publicados para clientes y datos completos para el equipo legal.

---

## Arquitectura General

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    ANALYTICS DATA LAYER                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐   │
│  │ Datos Públicos  │ + │ Evolución       │ + │ Capa Editorial  │   │
│  │ (PLs + Normas)  │   │ Temporal        │   │ (Comentarios)   │   │
│  └────────┬────────┘   └────────┬────────┘   └────────┬────────┘   │
│           │                     │                     │             │
│           └─────────────────────┴─────────────────────┘             │
│                                 │                                   │
│                    ┌────────────┴────────────┐                      │
│                    │   Analytics Repository  │                      │
│                    │   (Unified Data Store)  │                      │
│                    └────────────┬────────────┘                      │
│                                 │                                   │
│           ┌─────────────────────┴─────────────────────┐             │
│           │                                           │             │
│  ┌────────┴────────┐                       ┌──────────┴────────┐   │
│  │ EQUIPO LEGAL    │                       │ CLIENTE           │   │
│  │ (Vista Interna) │                       │ (View-only)       │   │
│  │                 │                       │                   │   │
│  │ - Todos los     │                       │ - Solo alertas    │   │
│  │   datos         │                       │   publicadas      │   │
│  │ - Métricas      │                       │ - Sin notas       │   │
│  │   operativas    │                       │   internas        │   │
│  │ - Cross-client  │                       │ - Sin benchmark   │   │
│  │   comparison    │                       │   cross-client    │   │
│  └─────────────────┘                       └───────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Fase 1: Data Layer & Analytics Repository

### 1.1 Crear Analytics Repository

Archivo: `src/lib/analyticsRepository.ts`

Este módulo centraliza todos los cálculos de analíticas, combinando:
- Datos públicos (alertas de PLs y Normas)
- Evolución temporal (fechas de publicación, cambios de estado)
- Capa editorial (comentarios expertos, timestamps de publicación)

Funciones principales:
- `getAggregatedMetrics(filters, userType)` - Métricas agregadas
- `getClientMetrics(clientId, filters)` - Métricas por cliente
- `getTrendData(period, filters)` - Datos de tendencia
- `getEditorialMetrics(period)` - Cobertura y tiempo de respuesta

### 1.2 Tipos de Datos

Archivo: `src/types/analytics.ts`

```typescript
interface AnalyticsBlock {
  id: string;
  key: string;              // Identificador único
  title: string;            // Título legible
  takeaway: string;         // Frase resumen de 1 línea
  infoTooltip: string;      // Explicación del cálculo
  visibility: 'internal' | 'client' | 'both';
  renderDashboard: boolean; // Si se muestra en dashboard
  renderPDF: boolean;       // Si se incluye en PDF
  order: number;            // Orden en el reporte
  enabled: boolean;         // Toggle on/off
}

interface AnalyticsTemplate {
  id: string;
  name: string;
  clientId: string | null;  // null = plantilla por defecto
  blocks: AnalyticsBlock[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
```

---

## Fase 2: Componentes de Analíticas

### 2.1 Estructura de Componentes

Cada bloque de analítica tendrá la siguiente estructura:

```text
┌─────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────┬───────────────────┐    │
│  │ [Icon] TÍTULO DEL BLOQUE        │  (i) Info    [⋮]  │    │
│  └─────────────────────────────────┴───────────────────┘    │
│                                                             │
│  "Frase takeaway de 1 línea explicando el insight"         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │              [GRÁFICO / VISUALIZACIÓN]              │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Período: Últimos 30 días  •  Fuente: Alertas publi. │   │
│  │                               [Ver alertas →]        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Bloques del Equipo Legal (Solo Internos)

| Bloque | Tipo | Datos Combinados |
|--------|------|------------------|
| **Pulso Regulatorio Agregado** | Líneas por semana | PLs + Normas con fechas oficiales, permite comparar por cliente |
| **Prioridad de Alertas Agregada** | Barras | Alertas × Impacto/Urgencia agregado |
| **Distribución de Alertas Agregada** | Pie/Barras | Por tipo, área, sector (todos los clientes) |
| **Cobertura Editorial** | Barras apiladas | Total capturadas vs publicadas por periodo |
| **Tiempo de Respuesta Editorial** | Líneas/Barras | Tiempo entre creación y publicación de comentario |
| **Cola Operativa** | KPIs + Desglose | Items por etapa, prioridad, tiempo en cola |
| **Monitoreo de Entidades Agregado** | Barras ranking | Top entidades/partidos por volumen |

### 2.3 Bloques de Cliente (Compartidos)

| Bloque | Tipo | Datos Combinados |
|--------|------|------------------|
| **Matriz de Impacto** | Matriz 3×3 | Alertas publicadas × Impacto × Urgencia |
| **Pulso Regulatorio** | Líneas por semana | Conteos publicados al cliente |
| **Prioridad de Alertas** | Barras | Impacto/Urgencia de alertas publicadas |
| **Distribución de Alertas** | Pie/Barras | Por tipo y área (cliente específico) |
| **Principales Entidades** | Barras Top 5-7 | Entidades más activas para el cliente |
| **Embudo Legislativo** | Funnel | Distribución por etapa de PLs publicados |
| **Movimientos Clave** | Timeline/Cards | Items nuevos y cambios de etapa recientes |
| **Temas Populares** | Barras/Cards Top 5-7 | Áreas con más alertas publicadas |
| **Temas Emergentes** | Cards comparativas | Temas en crecimiento vs periodo anterior |
| **Exposición** | Cards/Barras | Áreas del negocio más expuestas |
| **KPIs de Servicio** | 2-3 KPI Cards | Alertas publicadas, tiempo de respuesta |
| **Promedio de la Industria** | Barras comparativas | Cliente vs cohorte anonimizada |

---

## Fase 3: Dashboards Diferenciados

### 3.1 Dashboard Equipo Legal

Archivo: `src/components/analytics/LegalTeamAnalyticsDashboard.tsx`

Características:
- Acceso a TODAS las analíticas (internas + cliente)
- Filtros globales completos (jurisdicción, cliente, período, sector, etc.)
- Drill-down interactivo a lista de alertas
- Comparación cross-client
- Toggle para ver "como cliente" (preview)

### 3.2 Dashboard Cliente

Archivo: `src/components/client-portal/ClientAnalytics.tsx` (actualizar)

Características:
- Solo analíticas de tipo "client" o "both"
- Datos filtrados a alertas `status='published'` para ese cliente
- Sin filtros avanzados (máximo tipo de legislación y período)
- Drill-down solo a alertas propias publicadas
- Badge "Solo Lectura" visible

---

## Fase 4: Report Layout Builder

### 4.1 Constructor de Plantillas

Archivo: `src/components/reports/ReportLayoutBuilder.tsx`

Funcionalidad:
- Lista de bloques disponibles con checkboxes on/off
- Drag & drop con @dnd-kit para reordenar
- Preview en tiempo real del orden
- Guardar como plantilla por cliente o como default

### 4.2 Gestión de Plantillas

Actualizar `src/components/reports/types.ts`:

```typescript
interface ReportConfig {
  // ... campos existentes ...
  
  // Analytics customization (nuevo)
  analyticsTemplateId?: string;      // ID de plantilla guardada
  analyticsBlocks: {                 // O configuración ad-hoc
    key: string;
    enabled: boolean;
    order: number;
  }[];
}
```

### 4.3 Paso en el Wizard

Actualizar `src/components/reports/ReportWizardSteps/Step10AnalyticsOptions.tsx`:

- Mostrar lista de bloques disponibles para ese cliente
- Permitir activar/desactivar cada uno
- Drag & drop para reordenar
- Opción de guardar como plantilla
- Si no se configura nada, se muestran todas las analíticas del cliente

---

## Fase 5: PDF con Analíticas

### 5.1 Estructura del PDF

```text
┌─────────────────────────────────────────┐
│            PORTADA (Página 1)           │
│  - Logo                                 │
│  - Título del Reporte                   │
│  - Cliente                              │
│  - Período                              │
│  - Fecha de generación                  │
└─────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────┐
│         ANALÍTICAS (Página 2)           │
│  - Máximo 3-5 tarjetas                  │
│  - Orden según plantilla                │
│  - Cada tarjeta autocontenible          │
│  - Sin tooltips (texto completo)        │
└─────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────┐
│        ALERTAS (Páginas 3+)             │
│  - Proyectos de Ley por etapa           │
│  - Normas por entidad                   │
│  - Comentarios expertos                 │
│  - Links a fuentes oficiales            │
└─────────────────────────────────────────┘
```

### 5.2 Componentes PDF

Archivos nuevos:
- `src/components/reports/pdf/AnalyticsPagePDF.tsx` - Página de analíticas
- `src/components/reports/pdf/AnalyticsBlockPDF.tsx` - Bloque individual
- `src/components/reports/pdf/AnalyticsChartPDF.tsx` - Gráficos estáticos

Características:
- Gráficos vectoriales (no screenshots)
- Mínimo 12pt para texto
- Alto contraste
- Cada tarjeta autocontenible sin tooltip

---

## Fase 6: Sistema de Diseño

### 6.1 Paleta de Colores Estandarizada

Archivo: `src/lib/analyticsColors.ts`

```typescript
export const ANALYTICS_COLORS = {
  // Tipos de legislación (consistente en toda la app)
  bills: 'hsl(220, 70%, 55%)',        // Azul
  regulations: 'hsl(160, 60%, 45%)',  // Verde

  // Etapas legislativas
  stages: {
    comision: 'hsl(210, 60%, 55%)',
    pleno: 'hsl(270, 50%, 55%)',
    tramite: 'hsl(30, 70%, 55%)',
    publicado: 'hsl(140, 55%, 45%)',
    archivado: 'hsl(0, 0%, 50%)',
  },

  // Impacto (con iconos para accesibilidad)
  impact: {
    grave: { color: 'hsl(0, 65%, 50%)', icon: 'alert-triangle' },
    medio: { color: 'hsl(40, 75%, 50%)', icon: 'alert-circle' },
    leve: { color: 'hsl(0, 0%, 55%)', icon: 'minus-circle' },
    positivo: { color: 'hsl(140, 55%, 45%)', icon: 'check-circle' },
  },

  // Color de atención (único)
  attention: 'hsl(0, 75%, 55%)',

  // Escala neutra para rankings
  neutral: ['hsl(220, 50%, 55%)', 'hsl(220, 40%, 65%)', 'hsl(220, 30%, 75%)'],
};
```

### 6.2 Componente Base de Bloque

Archivo: `src/components/analytics/shared/AnalyticsBlock.tsx`

```typescript
interface AnalyticsBlockProps {
  title: string;
  takeaway: string;
  infoTooltip: string;
  timeframe: string;           // "Últimos 30 días"
  source: string;              // "Alertas publicadas"
  onDrilldown?: () => void;    // Solo en dashboard
  isEmpty?: boolean;
  emptyMessage?: string;
  children: React.ReactNode;
}
```

Características:
- Grid consistente con spacing 8px/16px/24px
- Info tooltip con (i) icon
- Footer con timeframe + source + "Ver alertas"
- Empty state automático

---

## Fase 7: Drill-down y Navegación

### 7.1 Sheet de Drill-down

Archivo: `src/components/analytics/shared/AnalyticsDrilldownSheet.tsx`

Funcionalidad:
- Abre desde cualquier gráfico clickeable
- Muestra lista de alertas que generaron el dato
- Filtros inline para refinar
- Botón "Volver a analíticas"
- Link a cada alerta individual

### 7.2 Estado Vacío

Cuando no hay datos suficientes:
- Mensaje explicativo: "No hay suficientes alertas publicadas en este período"
- Ocultar automáticamente bloques de benchmark
- Mostrar requisito mínimo si aplica

---

## Fase 8: Seguridad y Permisos

### 8.1 Control de Acceso

En cada componente y función:

```typescript
// En hooks/useAnalyticsData.ts
export function useAnalyticsData(blockKey: string) {
  const { isClientUser, clientId } = useClientUser();
  
  // Cliente: solo datos publicados para su clientId
  // Admin: todos los datos
  
  const filters = isClientUser 
    ? { status: 'published', clientId }
    : {};
    
  // ...
}
```

### 8.2 Validaciones

- Cliente NO puede ver alertas no publicadas
- Cliente NO puede ver notas internas
- Cliente NO puede comparar con otros clientes
- Cliente NO puede ver métricas operativas (cola, cobertura editorial)

---

## Fase 9: Performance y Caché

### 9.1 Optimizaciones

- Precomputar agregados por período/cliente
- Caché de 5 minutos para datos que no cambian frecuentemente
- Lazy loading de gráficos fuera de viewport
- Memoización de cálculos pesados

### 9.2 Data Freshness

Mostrar en dashboard y PDF:
- "Datos hasta: [fecha/hora]"
- "Generado el: [fecha/hora]"

---

## Fase 10: Integración con Reportes

### 10.1 Actualizar ReportPDFGenerator

Modificar `src/components/reports/ReportPDFGenerator.tsx`:

1. Después de la portada, insertar página de Analíticas
2. Renderizar solo los bloques habilitados en la plantilla
3. Máximo 3-5 bloques por página
4. Respetar orden configurado

### 10.2 Actualizar Wizard

En `Step10AnalyticsOptions.tsx`:
- Mostrar bloques disponibles para el tipo de reporte
- Drag & drop para reordenar
- Toggle para cada bloque
- Preview del orden final

---

## Archivos a Crear

| Archivo | Propósito |
|---------|-----------|
| `src/types/analytics.ts` | Tipos de analíticas |
| `src/lib/analyticsRepository.ts` | Capa de datos unificada |
| `src/lib/analyticsColors.ts` | Paleta estandarizada |
| `src/components/analytics/shared/AnalyticsBlock.tsx` | Componente base |
| `src/components/analytics/shared/AnalyticsDrilldownSheet.tsx` | Drill-down |
| `src/components/analytics/shared/AnalyticsEmptyState.tsx` | Estado vacío |
| `src/components/analytics/LegalTeamAnalyticsDashboard.tsx` | Dashboard admin |
| `src/components/analytics/blocks/*.tsx` | ~15 bloques individuales |
| `src/components/reports/ReportLayoutBuilder.tsx` | Constructor de plantillas |
| `src/components/reports/pdf/AnalyticsPagePDF.tsx` | Página PDF analíticas |
| `src/components/reports/pdf/AnalyticsBlockPDF.tsx` | Bloque PDF individual |
| `src/hooks/useAnalyticsData.ts` | Hook de datos con permisos |

## Archivos a Modificar

| Archivo | Cambios |
|---------|---------|
| `src/components/client-portal/ClientAnalytics.tsx` | Nuevo dashboard cliente |
| `src/components/reports/types.ts` | Añadir campos de plantilla |
| `src/components/reports/ReportWizardSteps/Step10AnalyticsOptions.tsx` | Nuevo UI |
| `src/components/reports/ReportPDFGenerator.tsx` | Integrar página analíticas |
| `src/pages/LawMeterDashboard.tsx` | Nuevo dashboard admin |

---

## Detalles Técnicos

### Dependencias Existentes Utilizadas

- `recharts` - Gráficos interactivos
- `@react-pdf/renderer` - Gráficos PDF
- `@dnd-kit` - Drag & drop para Layout Builder
- `lucide-react` - Iconos consistentes

### Reglas de Accesibilidad

1. Nunca usar solo color para transmitir información
2. Siempre incluir iconos o etiquetas junto a colores
3. Contraste mínimo WCAG AA (4.5:1 para texto)
4. No usar rojo/verde como únicos diferenciadores

### Reglas de Lenguaje

| Evitar | Usar |
|--------|------|
| Mediana | Típico |
| Varianza | Cambio |
| Distribución | Desglose |
| Percentil | Posición |
| Cohorte | Grupo del sector |

---

## Orden de Implementación Sugerido

1. **Fase 1**: Data Layer (tipos + repository)
2. **Fase 6**: Sistema de diseño (colores + componente base)
3. **Fase 2**: Bloques individuales (empezar con 3-4 core)
4. **Fase 3**: Dashboard Cliente actualizado
5. **Fase 3**: Dashboard Equipo Legal
6. **Fase 4**: Report Layout Builder
7. **Fase 5**: Integración PDF
8. **Fase 7-10**: Drill-down, seguridad, performance
