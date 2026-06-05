# Plan: Analytics Inventory MD with Live Data Snapshot

Produce a single Markdown artifact at `/mnt/documents/analytics-inventory.md` that documents every analytics block currently in the app, what it's supposed to show, and how it actually looks today against the live database (ISA pilot data).

No code changes. Read-only deliverable.

## Scope of blocks to document

From `src/components/analytics/blocks/`:

**Core (15)**
- AggregatedEntityMonitoringBlock
- AlertDistributionBlock
- AlertPriorityBlock
- EditorialResponseTimeBlock
- EmergingTopicsBlock
- ExposureBlock
- ImpactMatrixBlock
- IndustryBenchmarkBlock
- KeyMovementsBlock
- LegislativeFunnelBlock
- PinnedArchivedBlock
- PopularTopicsBlock
- RegulatoryPulseBlock
- ServiceKPIsBlock
- TopEntitiesBlock

**Ops (5)** — AIUsageBlock, AlertFeedbackBlock, DetectionToActionTimeBlock, ReportsGeneratedBlock, ReviewedAlertsBlock

**Sesiones (3)** — SessionAgendaTypeBlock, SessionsByCommissionBlock, SessionsTemporalEvolutionBlock

## Per-block entry format

For each block:
1. **Title + file path**
2. **What it shows** (purpose, axes/series, takeaway logic)
3. **Data source** (table/column or hook used)
4. **Live snapshot** — what the user would actually see today, e.g. "447 alertas Media/Baja, 6 Alta/Alta → matriz casi vacía en la esquina crítica"
5. **Health flag**: ✅ funcional con datos / ⚠️ poco contenido / ❌ vacío o roto

## Live data baseline (already queried)

- 541 alertas totales, 100% ISA (539) + 2 Diez Canseco
- 0 publicadas, 0 marcadas reviewed, 2 con expert_commentary
- 100% tipo `pl` (522) + 19 `norma`; sin bills/norms en inglés
- Etapas: EN COMISIÓN 296, DICTAMEN 119, Orden del Día 88, resto <10
- Impacto/urgencia: 447 Media/Baja (83%), 48 Alta/Media, 6 Alta/Alta
- Top entidades: PCM 5, MINEM 2, SUNARP 2, MTC 2 (long tail)
- Top áreas: Energía eléctrica concesiones 55, Infraestructura 51, Transmisión 48
- 489 alertas del Congreso vs 9 Ejecutivo (proponente)
- 355 sesiones, 0 analizadas, top comisión Presupuesto 22 / Fiscalización 21 / Economía 20
- 3 reportes generados
- Rango fechas: presentación 2021-08 → 2026-05; ingesta 2026-05-15 → 2026-06-05

## Implementation steps (build mode)

1. Read all 23 block files in parallel to extract title, takeaway logic, expected data shape.
2. Cross-reference with `analyticsRepository.ts` / `useInboxAlerts` to confirm data binding.
3. Write `/mnt/documents/analytics-inventory.md` with sections: Resumen ejecutivo · Baseline de datos vivos · Bloques Core · Bloques Ops · Bloques Sesiones · Bloques con datos insuficientes hoy.
4. Emit `<presentation-artifact path="analytics-inventory.md" mime_type="text/markdown">`.

## Out of scope

- No fixes to broken blocks (just flag them)
- No code edits
- No PDF/export variants
