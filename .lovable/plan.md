
# Plan: Datos Mock para TODAS las Analiticas + Mejoras a Exposicion y Benchmark

## Problema
8 de 16 bloques de analiticas reciben `alerts={[]}` y calculan metricas a partir de ese array vacio, mostrando estados vacios ("No hay datos"). Los bloques afectados son:

1. **ImpactMatrixBlock** - calcula desde `alerts`
2. **RegulatoryPulseBlock** - calcula desde `alerts`
3. **AlertPriorityBlock** - calcula desde `alerts`
4. **AlertDistributionBlock** - calcula desde `alerts`
5. **TopEntitiesBlock** - calcula desde `alerts`
6. **PopularTopicsBlock** - calcula desde `alerts`
7. **LegislativeFunnelBlock** - calcula desde `alerts`
8. **IndustryBenchmarkBlock** - calcula desde `alerts`

Los otros 8 bloques (KeyMovements, EmergingTopics, Exposure, EditorialResponseTime, AggregatedEntityMonitoring, ServiceKPIs, EditorialCoverage, OperationalQueue) ya funcionan con datos demo.

---

## Solucion

### Paso 1: Agregar `demoData` prop a cada bloque afectado

Cada bloque recibira un prop `demoData?` con el tipo correspondiente. Si existe, se usa directamente sin calcular desde `alerts`.

| Bloque | Prop nuevo | Dato mock |
|--------|-----------|-----------|
| ImpactMatrixBlock | `demoData?: Record<string, {value, items}>` | `DEMO_IMPACT_MATRIX` |
| RegulatoryPulseBlock | `demoData?: {chartData, billsTotal, ...}` | `DEMO_REGULATORY_PULSE` |
| AlertPriorityBlock | `demoData?: {chartData, total, highPriorityCount}` | `DEMO_ALERT_PRIORITY` |
| AlertDistributionBlock | `demoData?: {typeData, areaData}` | `DEMO_ALERT_DISTRIBUTION` |
| TopEntitiesBlock | `demoData?: RankingItem[]` | `DEMO_TOP_ENTITIES` |
| PopularTopicsBlock | `demoData?: RankingItem[]` | `DEMO_POPULAR_TOPICS` |
| LegislativeFunnelBlock | `demoData?: FunnelStage[]` | `DEMO_LEGISLATIVE_FUNNEL` |
| IndustryBenchmarkBlock | `demoData?: {chartData, cohortSize, ...}` | `DEMO_INDUSTRY_BENCHMARK` |

### Paso 2: Pasar datos mock desde los dashboards

Actualizar `LegalTeamAnalyticsDashboard.tsx` y `ClientAnalytics.tsx` para pasar los `demoData` correspondientes a cada bloque.

### Paso 3: Mejorar ExposureBlock (segun especificacion)

El bloque ya existe y usa datos mock, pero la especificacion pide:
- Combinar perfil del cliente (industria/modelo de negocio), autoridades relevantes y clasificacion de impacto
- Mostrar que partes del negocio estan mas expuestas y por que
- En dashboard: interactivo, filtrar por area de impacto y abrir alertas publicadas
- En PDF: estatico

Agregar:
- Tooltip por area mostrando las autoridades relevantes
- Boton de drill-down para ver alertas de cada area
- Indicador visual de severidad predominante por area

### Paso 4: Mejorar IndustryBenchmarkBlock (segun especificacion)

El bloque ya existe pero calcula desde alerts vacias. La especificacion pide:
- Comparacion "Cliente vs Promedio del sector" en barra horizontal
- Metricas: volumen publicado, entidades dominantes, temas dominantes
- Sin identificar a ningun tercero
- Aviso de privacidad

Cambios:
- Aceptar `demoData` para funcionar con datos mock
- Mantener la comparacion horizontal bar chart existente
- El aviso de privacidad ya esta implementado

---

## Archivos a Modificar (10)

| Archivo | Cambio |
|---------|--------|
| `src/components/analytics/blocks/ImpactMatrixBlock.tsx` | Agregar `demoData?` prop, usar si existe |
| `src/components/analytics/blocks/RegulatoryPulseBlock.tsx` | Agregar `demoData?` prop, usar si existe |
| `src/components/analytics/blocks/AlertPriorityBlock.tsx` | Agregar `demoData?` prop, usar si existe |
| `src/components/analytics/blocks/AlertDistributionBlock.tsx` | Agregar `demoData?` prop, usar si existe |
| `src/components/analytics/blocks/TopEntitiesBlock.tsx` | Agregar `demoData?` prop, usar si existe |
| `src/components/analytics/blocks/PopularTopicsBlock.tsx` | Agregar `demoData?` prop, usar si existe |
| `src/components/analytics/blocks/LegislativeFunnelBlock.tsx` | Agregar `demoData?` prop, usar si existe |
| `src/components/analytics/blocks/IndustryBenchmarkBlock.tsx` | Agregar `demoData?` prop, usar si existe |
| `src/components/analytics/LegalTeamAnalyticsDashboard.tsx` | Pasar `demoData` a los 7 bloques |
| `src/components/client-portal/ClientAnalytics.tsx` | Pasar `demoData` a los 8 bloques (incluye Benchmark) |

## Archivos sin cambios
- `src/lib/analyticsMockData.ts` - Ya contiene todos los datasets necesarios
- Bloques que ya funcionan (KeyMovements, EmergingTopics, Exposure, etc.)

---

## Patron de Implementacion (repetido en cada bloque)

Ejemplo para `AlertPriorityBlock`:

```text
// Agregar al interface:
demoData?: typeof DEMO_ALERT_PRIORITY;

// En el componente:
const { chartData, total, highPriorityCount } = React.useMemo(() => {
  if (demoData) return {
    chartData: demoData.chartData,
    total: demoData.total,
    highPriorityCount: demoData.highPriorityCount,
  };
  // ... calculo existente desde alerts ...
}, [alerts, demoData]);
```

En el dashboard:
```text
<AlertPriorityBlock
  alerts={[]}
  demoData={DEMO_ALERT_PRIORITY}
  timeframe={timeframeLabel}
/>
```
