
# Fix: Analytics en Reportes PDF

## Problemas Identificados

Hay 3 problemas que impiden que las analiticas aparezcan en los PDFs:

1. **`includeAnalytics` esta en `false` por defecto** -- El usuario tiene que ir al paso 10 del wizard y activarlo manualmente. Deberia estar siempre visible como opcion de contenido en el paso 9.

2. **Los bloques PDF calculan desde el array `alerts`** -- Si las alertas filtradas son pocas o vacias, los bloques muestran datos vacios. Los bloques PDF no usan los datos demo estaticos que ya existen en `analyticsMockData.ts`.

3. **`AnalyticsPagePDF` linea 119: si `alerts.length === 0` muestra estado vacio** -- Esto bloquea la pagina completa de analiticas incluso cuando hay datos demo disponibles.

## Solucion

### Cambio 1: Agregar toggle de Analytics en Step09ContentOptions

Mover el toggle "Incluir Pagina de Analytics" al paso 9 (Opciones de Contenido) junto con las demas opciones. Esto hace que el usuario siempre lo vea cuando configura contenido. El paso 10 seguira existiendo para la personalizacion detallada de bloques.

**Archivo**: `src/components/reports/ReportWizardSteps/Step09ContentOptions.tsx`
- Agregar un tercer toggle card: "Incluir Pagina de Analytics" con icono BarChart3
- Al activarlo, setea `includeAnalytics: true` y inicializa `analyticsBlocks` con los defaults

### Cambio 2: Cambiar default de `includeAnalytics` a `true`

**Archivo**: `src/components/reports/types.ts`
- Cambiar `includeAnalytics: false` a `includeAnalytics: true` en `DEFAULT_REPORT_CONFIG`
- Inicializar `analyticsBlocks` con los bloques default del registro

### Cambio 3: Hacer que AnalyticsPagePDF use datos demo

**Archivo**: `src/components/reports/pdf/AnalyticsPagePDF.tsx`
- Eliminar el check de `alerts.length === 0` que muestra estado vacio
- Las analiticas deben renderizarse siempre que esten habilitadas

### Cambio 4: Hacer que AnalyticsBlockPDF use datos demo estaticos

**Archivo**: `src/components/reports/pdf/AnalyticsBlockPDF.tsx`
- Importar los datasets de `src/lib/analyticsMockData.ts`
- Cada sub-componente PDF (ImpactMatrixBlockPDF, RegulatoryPulseBlockPDF, etc.) usara datos demo en lugar de calcular desde `alerts`
- Agregar renders PDF para los 5 bloques que faltan: `key_movements`, `emerging_topics`, `exposure`, `editorial_response_time`, `aggregated_entity_monitoring`
- Agregar renders para `editorial_coverage`, `operational_queue`, `industry_benchmark`

## Archivos a Modificar (4)

| Archivo | Cambio |
|---------|--------|
| `src/components/reports/types.ts` | Default `includeAnalytics: true`, inicializar `analyticsBlocks` |
| `src/components/reports/ReportWizardSteps/Step09ContentOptions.tsx` | Agregar toggle de Analytics |
| `src/components/reports/pdf/AnalyticsPagePDF.tsx` | Eliminar check de alerts vacias |
| `src/components/reports/pdf/AnalyticsBlockPDF.tsx` | Usar datos demo, agregar 8 bloques PDF faltantes |
