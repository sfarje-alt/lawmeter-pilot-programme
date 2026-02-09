

# Plan: Completar Analytics - Datos Mock Estáticos + Bloques Faltantes + UX Mejorado

## Resumen de los 6 Puntos a Resolver

1. **Datos mock estáticos para Nov 2025 - Ene 2026** (sin crear nuevas alertas)
2. **Bloques de analítica faltantes** (5 bloques nunca implementados)
3. **Mas espacio, secciones tematicas, "Ver mas" funcional**
4. **Tooltip (i) cortado - corregir overflow**
5. **Opcion de editar orden de analiticas en el dashboard**
6. **Verificar que PDF y Layout Builder cubran todos los bloques**

---

## Punto 1: Datos Mock Estaticos (Nov 2025 - Ene 2026)

### Problema actual
Los bloques calculan datos a partir de `created_at` de alertas reales, que no cubren Nov-Ene. Al filtrar "Ultimos 30 dias" no hay datos suficientes.

### Solucion
Crear un generador de datos estaticos en `src/lib/analyticsMockData.ts` que retorne datasets pre-calculados para cada bloque, simulando datos de Nov 2025 - Ene 2026 como si hubiera suficiente data. **No se crean nuevas alertas en peruAlertsMockData.ts**, no se modifica el inbox.

Cada bloque recibira un prop opcional `demoData` que, si existe, se usa en lugar del calculo dinamico. El repositorio (`analyticsRepository.ts`) exportara un objeto `DEMO_ANALYTICS_DATA` con datasets listos para:

- **Pulso Regulatorio**: Series semanales Nov-Ene (8-12 semanas) con volumenes de 5-15 por semana
- **Prioridad de Alertas**: Distribucion Grave: 12, Medio: 28, Leve: 35, Positivo: 8
- **Distribucion**: 45% PLs, 55% Normas; por area top 6
- **Cobertura Editorial**: 83 capturadas, 52 publicadas (63% cobertura), tendencia semanal
- **Tiempo de Respuesta**: Promedio 18h, tendencia semanal
- **Cola Operativa**: 15 pendientes revision, 8 pendientes publicar
- **Monitoreo Entidades**: Top 10 con MINSA, ESSALUD, SUSALUD, etc.
- **Matriz de Impacto**: Valores 3x3 distribuidos
- **Embudo Legislativo**: 18 en Comision, 8 Dictamen, 5 Pleno, 3 Aprobado
- **Temas Populares**: Top 7 areas con conteos
- **Temas Emergentes**: 3-4 temas con tendencia vs periodo anterior
- **Movimientos Clave**: 5-6 items recientes simulados
- **Exposicion**: 5 areas de negocio con scores
- **KPIs de Servicio**: Alertas publicadas: 52, Tiempo: <24h, Cobertura: 96%
- **Benchmark Industria**: Volumne, Alto Impacto, Diversidad vs cohorte de 12 empresas

### Archivos a crear
- `src/lib/analyticsMockData.ts` - Datos estaticos pre-calculados

### Archivos a modificar
- Cada bloque en `src/components/analytics/blocks/` - Agregar prop `demoData?` y usarlo si existe
- `LegalTeamAnalyticsDashboard.tsx` - Pasar `demoData` a cada bloque
- `ClientAnalytics.tsx` - Pasar `demoData` a cada bloque

---

## Punto 2: Bloques Faltantes

### Bloques que existen como componentes:
1. ImpactMatrixBlock
2. RegulatoryPulseBlock
3. AlertPriorityBlock
4. AlertDistributionBlock
5. TopEntitiesBlock
6. LegislativeFunnelBlock
7. PopularTopicsBlock
8. ServiceKPIsBlock
9. EditorialCoverageBlock
10. OperationalQueueBlock
11. IndustryBenchmarkBlock

### Bloques definidos en el registro pero SIN componente:
1. **Movimientos Clave** (`key_movements`) - Timeline/cards de items nuevos y cambios de etapa
2. **Temas Emergentes** (`emerging_topics`) - Cards comparativas este periodo vs anterior
3. **Exposicion** (`exposure`) - Barras de areas del negocio mas expuestas
4. **Tiempo de Respuesta Editorial** (`editorial_response_time`) - Lineas/barras de tiempo entre captura y publicacion
5. **Monitoreo de Entidades Agregado** (`aggregated_entity_monitoring`) - Barras ranking entidades/partidos (interno)

### Bloques faltantes de la especificacion original SIN ENTRADA en el registro:
6. **Pulso Regulatorio Agregado** (`aggregated_regulatory_pulse`) - Ya esta en registro pero no como componente separado del `RegulatoryPulseBlock` (puede reutilizarse con filtros cross-client)
7. **Prioridad de Alertas Agregada** (`aggregated_alert_priority`) - Similar, reutilizar
8. **Distribucion de Alertas Agregada** (`aggregated_alert_distribution`) - Similar, reutilizar

### Archivos a crear
- `src/components/analytics/blocks/KeyMovementsBlock.tsx` - Timeline de movimientos recientes
- `src/components/analytics/blocks/EmergingTopicsBlock.tsx` - Comparativa de temas en crecimiento
- `src/components/analytics/blocks/ExposureBlock.tsx` - Areas del negocio impactadas
- `src/components/analytics/blocks/EditorialResponseTimeBlock.tsx` - Tiempo de respuesta del equipo
- `src/components/analytics/blocks/AggregatedEntityMonitoringBlock.tsx` - Entidades agregadas (interno)

### Archivos a modificar
- `src/components/analytics/blocks/index.ts` - Exportar los 5 nuevos bloques
- `LegalTeamAnalyticsDashboard.tsx` - Agregar los nuevos bloques a sus secciones
- `ClientAnalytics.tsx` - Agregar KeyMovements, EmergingTopics, Exposure

---

## Punto 3: Mas Espacio, Secciones Tematicas, "Ver Mas"

### Problema actual
Los bloques estan en un grid de 3 columnas (`lg:grid-cols-3`) que los hace muy pequenos. El chart area es de solo 180px.

### Solucion

**Dashboards (Legal Team y Client)**:
- Cambiar grid a `lg:grid-cols-2` para bloques regulares (mas anchos)
- Bloques especiales (Matriz de Impacto, Cobertura Editorial) van full-width: `lg:col-span-2`
- Aumentar altura de charts de 180px a 280px
- Agregar padding interno (p-6 en lugar de p-4 para algunos)

**Secciones Tematicas con separadores**:
- Seccion "Vision General" (KPIs, Matriz, Pulso)
- Seccion "Desglose y Rankings" (Distribucion, Prioridad, Entidades, Temas)
- Seccion "Tendencias y Movimientos" (Movimientos Clave, Temas Emergentes, Embudo)
- Seccion "Servicio y Benchmark" (KPIs Servicio, Exposicion, Benchmark)
- Para Legal Team: Seccion "Operaciones Internas" (Cobertura, Tiempo Respuesta, Cola, Entidades Agregado)

Cada seccion con un `<h2>` y un `<Separator>`.

**"Ver mas" funcional**:
Agregar un estado expandido a `AnalyticsBlock` con prop `expandable?: boolean`. Al hacer clic en "Ver mas", el bloque se expande a un dialog/sheet con el grafico grande (500px+), datos completos, y mas detalles.

### Archivos a modificar
- `src/components/analytics/shared/AnalyticsBlock.tsx` - Agregar modo expandido (dialog grande)
- `LegalTeamAnalyticsDashboard.tsx` - Reestructurar layout con secciones tematicas
- `ClientAnalytics.tsx` - Reestructurar con secciones, grid 2-col

---

## Punto 4: Tooltip (i) Cortado

### Problema actual
El `TooltipContent` tiene `side="left"` y `className="max-w-xs"`, pero el texto se corta dentro del limite de la tarjeta por overflow-hidden en el Card.

### Solucion
- Cambiar `overflow-hidden` del Card a `overflow-visible` solo para el tooltip
- Usar `<TooltipContent side="top" align="end" sideOffset={8} className="max-w-sm z-50">` para que el tooltip aparezca fuera del card
- Agregar `z-50` al tooltip para asegurar que esta por encima de todo
- Quitar `overflow-hidden` del Card wrapper en `AnalyticsBlock`

### Archivos a modificar
- `src/components/analytics/shared/AnalyticsBlock.tsx` - Fix tooltip positioning y overflow

---

## Punto 5: Opcion de Editar Orden en el Dashboard

### Problema actual
El Layout Builder solo esta en el wizard de reportes (Step10). El usuario no puede reordenar bloques en el dashboard principal.

### Solucion
Agregar un boton "Personalizar" (icono de engranaje) en el header del dashboard que abre un Dialog con el `ReportLayoutBuilder` adaptado para el dashboard. El usuario puede:
- Arrastrar para reordenar
- Activar/desactivar bloques
- Guardar la configuracion (localStorage por ahora)

### Archivos a modificar
- `LegalTeamAnalyticsDashboard.tsx` - Agregar boton + dialog de personalizacion, estado con localStorage
- `ClientAnalytics.tsx` - Similar pero limitado a bloques de cliente
- `src/components/reports/ReportLayoutBuilder.tsx` - Agregar prop `mode?: 'report' | 'dashboard'` para adaptar UI

---

## Punto 6: PDF y Layout Builder Cubran Todos los Bloques

### Problema actual
El `AnalyticsBlockPDF.tsx` solo renderiza 8 tipos de bloques. Faltan los 5 nuevos.
El `CLIENT_ANALYTICS_BLOCKS` en `types/analytics.ts` los incluye pero `AnalyticsBlockPDF` no tiene sus renders.

### Solucion
- Agregar render PDF para: KeyMovements, EmergingTopics, Exposure, EditorialResponseTime, AggregatedEntityMonitoring
- Actualizar `ReportLayoutBuilder` para incluir los nuevos bloques con iconos
- Verificar que el `AnalyticsPagePDF` procese correctamente todos los bloques habilitados

### Archivos a modificar
- `src/components/reports/pdf/AnalyticsBlockPDF.tsx` - Agregar 5 renders PDF
- `src/components/reports/ReportLayoutBuilder.tsx` - Agregar iconos para nuevos bloques
- `src/types/analytics.ts` - Verificar que todos esten en `ANALYTICS_BLOCK_REGISTRY`

---

## Resumen de Archivos

### Archivos a crear (6)
| Archivo | Proposito |
|---------|-----------|
| `src/lib/analyticsMockData.ts` | Datos demo estaticos Nov 2025 - Ene 2026 |
| `src/components/analytics/blocks/KeyMovementsBlock.tsx` | Movimientos Clave |
| `src/components/analytics/blocks/EmergingTopicsBlock.tsx` | Temas Emergentes |
| `src/components/analytics/blocks/ExposureBlock.tsx` | Exposicion por area de negocio |
| `src/components/analytics/blocks/EditorialResponseTimeBlock.tsx` | Tiempo de respuesta editorial |
| `src/components/analytics/blocks/AggregatedEntityMonitoringBlock.tsx` | Monitoreo entidades agregado |

### Archivos a modificar (10)
| Archivo | Cambios |
|---------|---------|
| `src/components/analytics/shared/AnalyticsBlock.tsx` | Fix tooltip overflow, agregar modo expandido "Ver mas" |
| `src/components/analytics/blocks/index.ts` | Exportar 5 nuevos bloques |
| `src/components/analytics/LegalTeamAnalyticsDashboard.tsx` | Layout 2-col, secciones tematicas, datos demo, boton personalizar, nuevos bloques |
| `src/components/client-portal/ClientAnalytics.tsx` | Layout 2-col, secciones, datos demo, nuevos bloques, boton personalizar |
| `src/components/reports/pdf/AnalyticsBlockPDF.tsx` | 5 nuevos renders PDF |
| `src/components/reports/ReportLayoutBuilder.tsx` | Iconos nuevos, modo dashboard |
| `src/types/analytics.ts` | Verificar registro completo |
| `src/lib/analyticsRepository.ts` | Minor: exportar helpers para datos demo |
| `src/components/reports/ReportWizardSteps/Step10AnalyticsOptions.tsx` | Asegurar que muestre todos los bloques con secciones |
| `src/components/reports/pdf/AnalyticsPagePDF.tsx` | Asegurar renderizado de todos los bloques |

---

## Orden de Implementacion

1. Crear `analyticsMockData.ts` con todos los datasets estaticos
2. Crear los 5 bloques faltantes (KeyMovements, EmergingTopics, Exposure, EditorialResponseTime, AggregatedEntityMonitoring)
3. Fix `AnalyticsBlock.tsx` (tooltip + expandable)
4. Reestructurar `LegalTeamAnalyticsDashboard.tsx` (secciones, 2-col, datos demo, personalizar)
5. Reestructurar `ClientAnalytics.tsx` (secciones, 2-col, datos demo)
6. Actualizar `AnalyticsBlockPDF.tsx` + `ReportLayoutBuilder` + exports

