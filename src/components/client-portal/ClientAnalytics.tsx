import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, Calendar, Filter, Settings2 } from "lucide-react";
import { useClientUser } from "@/hooks/useClientUser";
import { MOCK_CLIENTS } from "@/data/peruAlertsMockData";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ImpactMatrixBlock,
  RegulatoryPulseBlock,
  AlertPriorityBlock,
  AlertDistributionBlock,
  TopEntitiesBlock,
  LegislativeFunnelBlock,
  PopularTopicsBlock,
  ServiceKPIsBlock,
  IndustryBenchmarkBlock,
  KeyMovementsBlock,
  EmergingTopicsBlock,
  ExposureBlock,
} from "@/components/analytics/blocks";
import { DataFreshnessIndicator } from "@/components/analytics/shared";
import { ReportLayoutBuilder } from "@/components/reports/ReportLayoutBuilder";
import { DataFreshnessIndicator as _DFI } from "@/components/analytics/shared";
import { useAlerts } from "@/contexts/AlertsContext";
import { CLIENT_ANALYTICS_BLOCKS, type AnalyticsBlockConfigExtended } from "@/types/analytics";
import type { KPIMetric } from "@/types/analytics";

// (kept for backwards compatibility; freshness/data-through derived live below)
const DEMO_DATA_FRESHNESS = { lastUpdate: new Date().toISOString(), dataThrough: new Date().toISOString().slice(0, 10) };

type PeriodFilter = "7d" | "30d" | "90d" | "all";

export function ClientAnalytics() {
  const { clientId, clientName } = useClientUser();
  const [period, setPeriod] = useState<PeriodFilter>("30d");
  const [customizeOpen, setCustomizeOpen] = useState(false);

  // Load saved block order
  const [blockOrder, setBlockOrder] = useState<AnalyticsBlockConfigExtended[]>(() => {
    try {
      const saved = localStorage.getItem('client-analytics-layout');
      if (saved) return JSON.parse(saved);
    } catch {}
    return CLIENT_ANALYTICS_BLOCKS.map((block, index) => ({
      ...block,
      order: index,
      enabled: block.renderDashboard,
    }));
  });

  const handleBlockOrderChange = (newBlocks: AnalyticsBlockConfigExtended[]) => {
    setBlockOrder(newBlocks);
    localStorage.setItem('client-analytics-layout', JSON.stringify(newBlocks));
  };

  const getTimeframeLabel = () => {
    const labels: Record<PeriodFilter, string> = {
      "7d": "Últimos 7 días",
      "30d": "Últimos 30 días",
      "90d": "Últimos 90 días",
      "all": "Todo el período",
    };
    return labels[period];
  };

  const clientSector = useMemo(() => {
    const client = MOCK_CLIENTS.find(c => c.id === clientId);
    return client?.sector || 'Salud';
  }, [clientId]);

  const isEnabled = (key: string) => {
    const block = blockOrder.find(b => b.key === key);
    return block ? block.enabled : true;
  };

  const freshness = DEMO_DATA_FRESHNESS;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">
            Métricas y análisis para {clientName || "tu organización"} — Demo Nov 2025 – Ene 2026
          </p>
        </div>
        <div className="flex items-center gap-3">
          <DataFreshnessIndicator 
            lastUpdate={freshness.lastUpdate}
            dataThrough={freshness.dataThrough}
          />
          <Button variant="outline" size="sm" onClick={() => setCustomizeOpen(true)}>
            <Settings2 className="h-4 w-4 mr-2" />
            Personalizar
          </Button>
          <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 w-fit">
            <Eye className="h-3 w-3 mr-1" />
            Solo Lectura
          </Badge>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-card/50 rounded-lg border border-border/50">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>Filtros:</span>
        </div>
        <Select value={period} onValueChange={(v) => setPeriod(v as PeriodFilter)}>
          <SelectTrigger className="w-[160px] h-9">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Últimos 7 días</SelectItem>
            <SelectItem value="30d">Últimos 30 días</SelectItem>
            <SelectItem value="90d">Últimos 90 días</SelectItem>
            <SelectItem value="all">Todo el período</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ===== SECTION: Visión General ===== */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-5">Visión General</h2>
        
        {isEnabled('service_kpis') && (
          <ServiceKPIsBlock data={DEMO_SERVICE_KPIS} timeframe={getTimeframeLabel()} />
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {isEnabled('impact_matrix') && (
            <ImpactMatrixBlock alerts={[]} timeframe={getTimeframeLabel()} demoData={DEMO_IMPACT_MATRIX} />
          )}
          {isEnabled('regulatory_pulse') && (
            <RegulatoryPulseBlock alerts={[]} timeframe={getTimeframeLabel()} demoData={DEMO_REGULATORY_PULSE} />
          )}
        </div>
      </section>

      <Separator />

      {/* ===== SECTION: Desglose y Rankings ===== */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-5">Desglose y Rankings</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isEnabled('alert_priority') && (
            <AlertPriorityBlock alerts={[]} timeframe={getTimeframeLabel()} demoData={DEMO_ALERT_PRIORITY} />
          )}
          {isEnabled('alert_distribution') && (
            <AlertDistributionBlock alerts={[]} timeframe={getTimeframeLabel()} demoData={DEMO_ALERT_DISTRIBUTION} />
          )}
          {isEnabled('top_entities') && (
            <TopEntitiesBlock alerts={[]} timeframe={getTimeframeLabel()} maxItems={5} demoData={DEMO_TOP_ENTITIES} />
          )}
          {isEnabled('popular_topics') && (
            <PopularTopicsBlock alerts={[]} timeframe={getTimeframeLabel()} maxItems={7} demoData={DEMO_POPULAR_TOPICS} />
          )}
        </div>
      </section>

      <Separator />

      {/* ===== SECTION: Tendencias y Movimientos ===== */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-5">Tendencias y Movimientos</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isEnabled('key_movements') && (
            <KeyMovementsBlock timeframe={getTimeframeLabel()} />
          )}
          {isEnabled('emerging_topics') && (
            <EmergingTopicsBlock timeframe={getTimeframeLabel()} />
          )}
          {isEnabled('legislative_funnel') && (
            <LegislativeFunnelBlock alerts={[]} timeframe={getTimeframeLabel()} demoData={DEMO_LEGISLATIVE_FUNNEL} />
          )}
          {isEnabled('exposure') && (
            <ExposureBlock timeframe={getTimeframeLabel()} />
          )}
        </div>
      </section>

      <Separator />

      {/* ===== SECTION: Servicio y Benchmark ===== */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-5">Servicio y Benchmark</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isEnabled('industry_benchmark') && (
            <IndustryBenchmarkBlock
              alerts={[]}
              clientName={clientName || "Su empresa"}
              clientSector={clientSector}
              timeframe={getTimeframeLabel()}
              demoData={DEMO_INDUSTRY_BENCHMARK}
            />
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
            mode="dashboard"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
