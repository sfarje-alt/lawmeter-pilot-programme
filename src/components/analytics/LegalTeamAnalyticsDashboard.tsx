import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings2 } from "lucide-react";
import { DataFreshnessIndicator } from "./shared/AnalyticsBlock";
import {
  ImpactMatrixBlock,
  RegulatoryPulseBlock,
  LegislativeFunnelBlock,
  TopEntitiesBlock,
  AlertDistributionBlock,
  AlertPriorityBlock,
  ServiceKPIsBlock,
  PopularTopicsBlock,
  EditorialCoverageBlock,
  OperationalQueueBlock,
  KeyMovementsBlock,
  EmergingTopicsBlock,
  ExposureBlock,
  EditorialResponseTimeBlock,
  AggregatedEntityMonitoringBlock,
  IndustryBenchmarkBlock,
  PinnedArchivedBlock,
} from "./blocks";
import {
  DEMO_EDITORIAL_COVERAGE,
  DEMO_OPERATIONAL_QUEUE,
  DEMO_DATA_FRESHNESS,
  getDemoDataForClient,
} from "@/lib/analyticsMockData";
import type { AnalyticsFilters } from "@/types/analytics";

import { ReportLayoutBuilder } from "@/components/reports/ReportLayoutBuilder";
import { CLIENT_ANALYTICS_BLOCKS, ANALYTICS_BLOCK_REGISTRY, type AnalyticsBlockConfigExtended } from "@/types/analytics";

/**
 * Legal Team Analytics Dashboard
 * Full access to all analytics blocks (internal + client-visible)
 * Uses static demo data for Nov 2025 - Jan 2026
 */
export function LegalTeamAnalyticsDashboard() {
  const [period, setPeriod] = React.useState<AnalyticsFilters['period']>('all_time');
  const [customizeOpen, setCustomizeOpen] = React.useState(false);

  // Load saved block order from localStorage
  const [blockOrder, setBlockOrder] = React.useState<AnalyticsBlockConfigExtended[]>(() => {
    try {
      const saved = localStorage.getItem('analytics-dashboard-layout');
      if (saved) return JSON.parse(saved);
    } catch {}
    return ANALYTICS_BLOCK_REGISTRY.map((block, index) => ({
      ...block,
      order: index,
      enabled: block.defaultEnabled,
      renderPDF: block.defaultEnabled,
      renderDashboard: true,
    }));
  });

  const handleBlockOrderChange = (newBlocks: AnalyticsBlockConfigExtended[]) => {
    setBlockOrder(newBlocks);
    localStorage.setItem('analytics-dashboard-layout', JSON.stringify(newBlocks));
  };

  const freshness = DEMO_DATA_FRESHNESS;

  // Aggregated demo data for the company
  const demoData = React.useMemo(() => getDemoDataForClient('all'), []);

  const timeframeLabel = {
    'all_time': 'Todo el período',
    'last_7': 'Últimos 7 días',
    'last_30': 'Últimos 30 días',
    'last_60': 'Últimos 60 días',
    'last_90': 'Últimos 90 días',
  }[period] || period;

  // Check if a block is enabled
  const isEnabled = (key: string) => {
    const block = blockOrder.find(b => b.key === key);
    return block ? block.enabled : true;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analíticas</h1>
          <p className="text-sm text-muted-foreground">
            Inteligencia regulatoria — explora cada módulo, aplica filtros y guarda tu configuración.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={(v) => setPeriod(v as AnalyticsFilters['period'])}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_time">Todo el período</SelectItem>
              <SelectItem value="last_7">Últimos 7 días</SelectItem>
              <SelectItem value="last_30">Últimos 30 días</SelectItem>
              <SelectItem value="last_60">Últimos 60 días</SelectItem>
              <SelectItem value="last_90">Últimos 90 días</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={() => setCustomizeOpen(true)}>
            <Settings2 className="h-4 w-4 mr-2" />
            Personalizar
          </Button>

          <DataFreshnessIndicator 
            lastUpdate={freshness.lastUpdate} 
            dataThrough={freshness.dataThrough} 
          />
        </div>
      </div>

      {/* ===== SECTION: Visión General ===== */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <h2 className="text-lg font-semibold text-foreground">Visión General</h2>
        </div>
        
        {isEnabled('service_kpis') && (
          <ServiceKPIsBlock data={demoData.serviceKpis} timeframe={timeframeLabel} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {isEnabled('impact_matrix') && (
            <ImpactMatrixBlock alerts={[]} timeframe={timeframeLabel} demoData={demoData.impactMatrix} />
          )}
          {isEnabled('regulatory_pulse') && (
            <RegulatoryPulseBlock alerts={[]} timeframe={timeframeLabel} demoData={demoData.regulatoryPulse} />
          )}
        </div>
      </section>

      <Separator />

      {/* ===== SECTION: Desglose y Rankings ===== */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <h2 className="text-lg font-semibold text-foreground">Desglose y Rankings</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isEnabled('alert_priority') && (
            <AlertPriorityBlock alerts={[]} timeframe={timeframeLabel} demoData={demoData.alertPriority} />
          )}
          {isEnabled('alert_distribution') && (
            <AlertDistributionBlock alerts={[]} timeframe={timeframeLabel} showByArea demoData={demoData.alertDistribution} />
          )}
          {isEnabled('top_entities') && (
            <TopEntitiesBlock alerts={[]} timeframe={timeframeLabel} maxItems={7} demoData={demoData.topEntities} />
          )}
          {isEnabled('popular_topics') && (
            <PopularTopicsBlock alerts={[]} timeframe={timeframeLabel} maxItems={7} demoData={demoData.popularTopics} />
          )}
          {isEnabled('industry_benchmark') && (
            <IndustryBenchmarkBlock
              alerts={[]}
              clientName="Mi Empresa"
              clientSector="Regulado"
              timeframe={timeframeLabel}
              demoData={demoData.industryBenchmark}
            />
          )}
        </div>
      </section>

      <Separator />

      {/* ===== SECTION: Tendencias y Movimientos ===== */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <h2 className="text-lg font-semibold text-foreground">Tendencias y Movimientos</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isEnabled('key_movements') && (
            <KeyMovementsBlock timeframe={timeframeLabel} demoData={demoData.keyMovements} />
          )}
          {isEnabled('emerging_topics') && (
            <EmergingTopicsBlock timeframe={timeframeLabel} />
          )}
          {isEnabled('legislative_funnel') && (
            <LegislativeFunnelBlock alerts={[]} timeframe={timeframeLabel} demoData={demoData.legislativeFunnel} />
          )}
          {isEnabled('exposure') && (
            <ExposureBlock timeframe={timeframeLabel} demoData={demoData.exposure} />
          )}
        </div>
      </section>

      <Separator />

      {/* ===== SECTION: Operaciones Internas ===== */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <h2 className="text-lg font-semibold text-foreground">Operaciones Internas</h2>
          <Badge variant="outline" className="text-xs">Solo Interno</Badge>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isEnabled('editorial_coverage') && (
            <EditorialCoverageBlock
              totalAlerts={DEMO_EDITORIAL_COVERAGE.totalAlerts}
              withCommentary={DEMO_EDITORIAL_COVERAGE.withCommentary}
              coverageRate={DEMO_EDITORIAL_COVERAGE.coverageRate}
              coverageTrend={DEMO_EDITORIAL_COVERAGE.coverageTrend}
              timeframe={timeframeLabel}
            />
          )}
          {isEnabled('editorial_response_time') && (
            <EditorialResponseTimeBlock timeframe={timeframeLabel} />
          )}
          {isEnabled('operational_queue') && (
            <OperationalQueueBlock data={DEMO_OPERATIONAL_QUEUE} timeframe={timeframeLabel} />
          )}
          {isEnabled('pin_archive') && (
            <PinnedArchivedBlock timeframe={timeframeLabel} />
          )}
          {isEnabled('aggregated_entity_monitoring') && (
            <AggregatedEntityMonitoringBlock timeframe={timeframeLabel} />
          )}
        </div>
      </section>

      {/* Customize Side Sheet — wide, BI-style */}
      <Sheet open={customizeOpen} onOpenChange={setCustomizeOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-[640px] md:max-w-[720px] lg:max-w-[820px] p-0 flex flex-col"
        >
          <SheetHeader className="px-6 py-4 border-b border-border flex-shrink-0">
            <SheetTitle className="text-lg">Personalizar Dashboard</SheetTitle>
            <SheetDescription>
              Arrastra para reordenar los bloques. Usa los toggles para mostrar u ocultar cada análisis.
              Tus preferencias se guardan automáticamente.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-6">
            <ReportLayoutBuilder
              blocks={blockOrder}
              onChange={handleBlockOrderChange}
              showInternalBlocks
              mode="dashboard"
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
