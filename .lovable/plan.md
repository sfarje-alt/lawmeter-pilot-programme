

# Fix: Tendencias/Movimientos en PDF + Colores en Matriz de Impacto

## Problema 1: Bloques no visibles en el PDF

Los 10 bloques de analiticas se renderizan, pero todos van dentro de un solo `<View>` en una sola `<Page>`. Con 10 bloques en 2 columnas, el contenido se desborda fuera del area visible de la pagina A4 y los bloques de abajo (Movimientos Clave, Temas Emergentes, Exposicion, etc.) simplemente no se ven.

**Solucion**: Distribuir los bloques en multiples paginas PDF. En lugar de meter todo en un solo `<View>`, agrupar los bloques en lotes de 4 por pagina (2x2 grid). Cada lote va en su propia `<Page>`.

### Cambios en `src/components/reports/pdf/AnalyticsPagePDF.tsx`:
- Dividir `enabledBlocks` en chunks de 4
- Renderizar cada chunk en una `<Page size="A4">` separada
- La primera pagina incluye el header "Analiticas del Periodo"
- Las paginas siguientes incluyen un header mas compacto "Analiticas (cont.)"
- Mover el footer a la ultima pagina

### Cambios en `src/components/reports/ReportManualGeneration.tsx`:
- Cambiar de envolver `AnalyticsPagePDF` en un solo `<Page>` a dejar que `AnalyticsPagePDF` genere sus propias paginas internamente
- Importar `Page` de react-pdf en AnalyticsPagePDF si no esta ya

## Problema 2: Matriz de Impacto sin colores diferenciados

Actualmente cada celda de la matriz tiene el mismo fondo gris (`#e2e8f0`). Deberia usar colores que reflejen la severidad de la combinacion impacto/urgencia, similar a la version interactiva del dashboard.

### Cambios en `src/components/reports/pdf/AnalyticsBlockPDF.tsx` (funcion `ImpactMatrixBlockPDF`):
- Agregar un mapa de colores por celda:
  - `grave-alta`: rojo (#fecaca / borde #dc2626) - Critico
  - `grave-media`: naranja (#fed7aa / borde #f97316)
  - `grave-baja`: amarillo (#fef08a / borde #eab308)
  - `medio-alta`: naranja (#fed7aa / borde #f97316)
  - `medio-media`: amarillo (#fef9c4 / borde #eab308)
  - `medio-baja`: verde claro (#d1fae5 / borde #22c55e)
  - `leve-alta`: amarillo (#fef08a / borde #eab308)
  - `leve-media`: verde claro (#d1fae5 / borde #22c55e)
  - `leve-baja`: verde (#bbf7d0 / borde #16a34a)
- Agregar etiquetas de fila (Grave/Medio/Leve) y columna (Alta/Media/Baja) para que la matriz sea legible sin interactividad
- Agregar una mini-leyenda de colores debajo de la matriz

## Archivos a modificar (3)

| Archivo | Cambio |
|---------|--------|
| `src/components/reports/pdf/AnalyticsPagePDF.tsx` | Multi-pagina: dividir bloques en chunks de 4, cada chunk en su propia Page |
| `src/components/reports/pdf/AnalyticsBlockPDF.tsx` | Colores diferenciados por celda en ImpactMatrixBlockPDF |
| `src/components/reports/ReportManualGeneration.tsx` | Ajustar para que AnalyticsPagePDF genere sus propias Pages |

