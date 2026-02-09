import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
} from "./blocks";
import {
  DEMO_EDITORIAL_COVERAGE,
  DEMO_OPERATIONAL_QUEUE,
  DEMO_DATA_FRESHNESS,
  DEMO_SERVICE_KPIS,
  DEMO_REGULATORY_PULSE,
  DEMO_ALERT_PRIORITY,
  DEMO_IMPACT_MATRIX,
  DEMO_LEGISLATIVE_FUNNEL,
  DEMO_ALERT_DISTRIBUTION,
  DEMO_TOP_ENTITIES,
  DEMO_POPULAR_TOPICS,
  DEMO_EMERGING_TOPICS,
  DEMO_KEY_MOVEMENTS,
  DEMO_EXPOSURE,
  DEMO_EDITORIAL_RESPONSE_TIME,
  DEMO_AGGREGATED_ENTITIES,
} from "@/lib/analyticsMockData";
import type { AnalyticsFilters } from "@/types/analytics";
import { MOCK_CLIENTS } from "@/data/peruAlertsMockData";
import { ReportLayoutBuilder } from "@/components/reports/ReportLayoutBuilder";
import { CLIENT_ANALYTICS_BLOCKS, ANALYTICS_BLOCK_REGISTRY, type AnalyticsBlockConfigExtended } from "@/types/analytics";

/**
 * Legal Team Analytics Dashboard
 * Full access to all analytics blocks (internal + client-visible)
 * Uses static demo data for Nov 2025 - Jan 2026
 */
export function LegalTeamAnalyticsDashboard() {
  const [period, setPeriod] = React.useState<AnalyticsFilters['period']>('last_30');
  const [selectedClientId, setSelectedClientId] = React.useState<string>('all');
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

  const timeframeLabel = {
    'last_7': 'Últimos 7 días',
    'last_30': 'Últimos 30 días',
    'last_60': 'Últimos 60 días',
    'last_90': 'Últimos 90 días',
  }[period] || period;

  const freshness = DEMO_DATA_FRESHNESS;

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
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Métricas operativas y de servicio — Demo Nov 2025 – Ene 2026
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={(v) => setPeriod(v as AnalyticsFilters['period'])}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_7">Últimos 7 días</SelectItem>
              <SelectItem value="last_30">Últimos 30 días</SelectItem>
              <SelectItem value="last_60">Últimos 60 días</SelectItem>
              <SelectItem value="last_90">Últimos 90 días</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedClientId} onValueChange={setSelectedClientId}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todos los clientes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los clientes</SelectItem>
              {MOCK_CLIENTS.map(client => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
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
          <ServiceKPIsBlock data={DEMO_SERVICE_KPIS} timeframe={timeframeLabel} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {isEnabled('impact_matrix') && (
            <ImpactMatrixBlock alerts={[]} timeframe={timeframeLabel} demoData={DEMO_IMPACT_MATRIX} />
          )}
          {isEnabled('regulatory_pulse') && (
            <RegulatoryPulseBlock alerts={[]} timeframe={timeframeLabel} demoData={DEMO_REGULATORY_PULSE} />
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
            <AlertPriorityBlock alerts={[]} timeframe={timeframeLabel} demoData={DEMO_ALERT_PRIORITY} />
          )}
          {isEnabled('alert_distribution') && (
            <AlertDistributionBlock alerts={[]} timeframe={timeframeLabel} showByArea demoData={DEMO_ALERT_DISTRIBUTION} />
          )}
          {isEnabled('top_entities') && (
            <TopEntitiesBlock alerts={[]} timeframe={timeframeLabel} maxItems={7} demoData={DEMO_TOP_ENTITIES} />
          )}
          {isEnabled('popular_topics') && (
            <PopularTopicsBlock alerts={[]} timeframe={timeframeLabel} maxItems={7} demoData={DEMO_POPULAR_TOPICS} />
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
            <KeyMovementsBlock timeframe={timeframeLabel} />
          )}
          {isEnabled('emerging_topics') && (
            <EmergingTopicsBlock timeframe={timeframeLabel} />
          )}
          {isEnabled('legislative_funnel') && (
            <LegislativeFunnelBlock alerts={[]} timeframe={timeframeLabel} />
          )}
          {isEnabled('exposure') && (
            <ExposureBlock timeframe={timeframeLabel} />
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
              captured={DEMO_EDITORIAL_COVERAGE.totalCaptured}
              published={DEMO_EDITORIAL_COVERAGE.totalPublished}
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
          {isEnabled('aggregated_entity_monitoring') && (
            <AggregatedEntityMonitoringBlock timeframe={timeframeLabel} />
          )}
        </div>
      </section>

      {/* Customize Dialog */}
      <Dialog open={customizeOpen} onOpenChange={setCustomizeOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Personalizar Dashboard</DialogTitle>
          </DialogHeader>
          <ReportLayoutBuilder
            blocks={blockOrder}
            onChange={handleBlockOrderChange}
            showInternalBlocks
            mode="dashboard"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
