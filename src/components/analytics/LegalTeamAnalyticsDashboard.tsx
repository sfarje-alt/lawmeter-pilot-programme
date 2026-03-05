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
  IndustryBenchmarkBlock,
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
  DEMO_INDUSTRY_BENCHMARK,
} from "@/lib/analyticsMockData";
import type { AnalyticsFilters } from "@/types/analytics";
import { MOCK_CLIENTS, type PeruAlert } from "@/data/peruAlertsMockData";
import { useAlerts } from "@/contexts/AlertsContext";
import { ReportLayoutBuilder } from "@/components/reports/ReportLayoutBuilder";
import { CLIENT_ANALYTICS_BLOCKS, ANALYTICS_BLOCK_REGISTRY, type AnalyticsBlockConfigExtended } from "@/types/analytics";

// Helper to compute metrics from filtered alerts
function computeServiceKPIs(alerts: PeruAlert[]): import("@/types/analytics").KPIMetric[] {
  const published = alerts.filter(a => a.status === 'published');
  const withCommentary = published.filter(a => 
    a.expert_commentary || a.client_commentaries.some(c => c.commentary?.trim())
  );
  return [
    { label: "Alertas Publicadas", value: published.length, unit: "items" as const, icon: "file-text" as const },
    { label: "Tiempo Típico", value: "< 24h", icon: "clock" as const },
    { label: "Con Comentario", value: withCommentary.length, unit: "items" as const, icon: "check-circle" as const },
  ];
}

function computeImpactMatrix(alerts: PeruAlert[]) {
  const matrix: Record<string, { value: number; items: string[] }> = {
    "grave-alta": { value: 0, items: [] }, "grave-media": { value: 0, items: [] }, "grave-baja": { value: 0, items: [] },
    "medio-alta": { value: 0, items: [] }, "medio-media": { value: 0, items: [] }, "medio-baja": { value: 0, items: [] },
    "leve-alta": { value: 0, items: [] }, "leve-media": { value: 0, items: [] }, "leve-baja": { value: 0, items: [] },
  };
  
  alerts.forEach((alert, i) => {
    const impact = alert.impact_level || 'leve';
    // Derive urgency from a hash of the index for consistency
    const urgencies = ['alta', 'media', 'baja'];
    const urgency = urgencies[i % 3];
    const key = `${impact}-${urgency}`;
    if (matrix[key]) {
      matrix[key].value++;
      matrix[key].items.push(alert.id);
    }
  });
  
  return matrix;
}

function computeAlertPriority(alerts: PeruAlert[]) {
  const counts: Record<string, number> = { grave: 0, medio: 0, leve: 0, positivo: 0 };
  alerts.forEach(a => { counts[a.impact_level || 'leve']++; });
  return {
    chartData: [
      { name: "Grave", value: counts.grave, color: "hsl(0, 65%, 50%)", key: "grave" },
      { name: "Medio", value: counts.medio, color: "hsl(40, 75%, 50%)", key: "medio" },
      { name: "Leve", value: counts.leve, color: "hsl(0, 0%, 55%)", key: "leve" },
      { name: "Positivo", value: counts.positivo, color: "hsl(140, 55%, 45%)", key: "positivo" },
    ],
    total: alerts.length,
    highPriorityCount: counts.grave + counts.medio,
  };
}

function computeAlertDistribution(alerts: PeruAlert[]) {
  const bills = alerts.filter(a => a.legislation_type === 'proyecto_de_ley').length;
  const regs = alerts.filter(a => a.legislation_type === 'norma').length;
  const areaCounts: Record<string, number> = {};
  alerts.forEach(a => (a.affected_areas || []).forEach(area => { areaCounts[area] = (areaCounts[area] || 0) + 1; }));
  return {
    typeData: [
      { name: "Proyectos de Ley", value: bills, ids: [] },
      { name: "Normas", value: regs, ids: [] },
    ],
    areaData: Object.entries(areaCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value]) => ({ name, value, ids: [] })),
  };
}

function computeTopEntities(alerts: PeruAlert[]): { id: string; label: string; value: number }[] {
  const counts: Record<string, number> = {};
  alerts.forEach(a => {
    const entity = a.entity || a.parliamentary_group;
    if (entity) counts[entity] = (counts[entity] || 0) + 1;
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([name, count], i) => ({ id: `entity-${i}`, label: name, value: count }));
}

function computePopularTopics(alerts: PeruAlert[]): { id: string; label: string; value: number }[] {
  const counts: Record<string, number> = {};
  alerts.forEach(a => (a.affected_areas || []).forEach(area => { counts[area] = (counts[area] || 0) + 1; }));
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([name, count], i) => ({ id: `topic-${i}`, label: name, value: count }));
}

function computeEditorialCoverage(alerts: PeruAlert[]) {
  const published = alerts.filter(a => a.status === 'published').length;
  const rate = alerts.length > 0 ? (published / alerts.length) * 100 : 0;
  return {
    totalCaptured: alerts.length,
    totalPublished: published,
    coverageRate: Math.round(rate * 10) / 10,
    coverageTrend: DEMO_EDITORIAL_COVERAGE.coverageTrend,
  };
}

/**
 * Legal Team Analytics Dashboard
 * Full access to all analytics blocks (internal + client-visible)
 * Filters data by selected client
 */
export function LegalTeamAnalyticsDashboard() {
  const [period, setPeriod] = React.useState<AnalyticsFilters['period']>('last_30');
  const [selectedClientId, setSelectedClientId] = React.useState<string>('all');
  const [customizeOpen, setCustomizeOpen] = React.useState(false);
  const { alerts } = useAlerts();

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

  // Filter alerts by selected client
  const filteredAlerts = React.useMemo(() => {
    if (selectedClientId === 'all') return alerts;
    return alerts.filter(a => 
      a.client_id === selectedClientId || 
      a.primary_client_id === selectedClientId ||
      a.client_commentaries.some(c => c.clientId === selectedClientId)
    );
  }, [alerts, selectedClientId]);

  // Compute metrics from filtered alerts
  const serviceKPIs = React.useMemo(() => computeServiceKPIs(filteredAlerts), [filteredAlerts]);
  const impactMatrix = React.useMemo(() => computeImpactMatrix(filteredAlerts), [filteredAlerts]);
  const alertPriority = React.useMemo(() => computeAlertPriority(filteredAlerts), [filteredAlerts]);
  const alertDistribution = React.useMemo(() => computeAlertDistribution(filteredAlerts), [filteredAlerts]);
  const topEntities = React.useMemo(() => computeTopEntities(filteredAlerts), [filteredAlerts]);
  const popularTopics = React.useMemo(() => computePopularTopics(filteredAlerts), [filteredAlerts]);
  const editorialCoverage = React.useMemo(() => computeEditorialCoverage(filteredAlerts), [filteredAlerts]);

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

  const selectedClientName = selectedClientId !== 'all' 
    ? (MOCK_CLIENTS.find(c => c.id === selectedClientId)?.name || 'Cliente') 
    : 'Todos los clientes';

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
          <ServiceKPIsBlock data={serviceKPIs} timeframe={timeframeLabel} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {isEnabled('impact_matrix') && (
            <ImpactMatrixBlock alerts={filteredAlerts} timeframe={timeframeLabel} demoData={impactMatrix} />
          )}
          {isEnabled('regulatory_pulse') && (
            <RegulatoryPulseBlock alerts={filteredAlerts} timeframe={timeframeLabel} demoData={DEMO_REGULATORY_PULSE} />
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
            <AlertPriorityBlock alerts={filteredAlerts} timeframe={timeframeLabel} demoData={alertPriority} />
          )}
          {isEnabled('alert_distribution') && (
            <AlertDistributionBlock alerts={filteredAlerts} timeframe={timeframeLabel} showByArea demoData={alertDistribution} />
          )}
          {isEnabled('top_entities') && (
            <TopEntitiesBlock alerts={filteredAlerts} timeframe={timeframeLabel} maxItems={7} demoData={topEntities} />
          )}
          {isEnabled('popular_topics') && (
            <PopularTopicsBlock alerts={filteredAlerts} timeframe={timeframeLabel} maxItems={7} demoData={popularTopics} />
          )}
          {isEnabled('industry_benchmark') && (
            <IndustryBenchmarkBlock
              alerts={filteredAlerts}
              clientName={selectedClientName}
              clientSector="Regulado"
              timeframe={timeframeLabel}
              demoData={DEMO_INDUSTRY_BENCHMARK}
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
            <KeyMovementsBlock timeframe={timeframeLabel} />
          )}
          {isEnabled('emerging_topics') && (
            <EmergingTopicsBlock timeframe={timeframeLabel} />
          )}
          {isEnabled('legislative_funnel') && (
            <LegislativeFunnelBlock alerts={filteredAlerts} timeframe={timeframeLabel} demoData={DEMO_LEGISLATIVE_FUNNEL} />
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
              captured={editorialCoverage.totalCaptured}
              published={editorialCoverage.totalPublished}
              coverageRate={editorialCoverage.coverageRate}
              coverageTrend={editorialCoverage.coverageTrend}
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
