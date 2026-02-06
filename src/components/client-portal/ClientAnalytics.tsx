import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Eye, Calendar, Filter } from "lucide-react";
import { useClientUser } from "@/hooks/useClientUser";
import { ALL_MOCK_ALERTS, MOCK_CLIENTS, type PeruAlert } from "@/data/peruAlertsMockData";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
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
} from "@/components/analytics/blocks";
import { AnalyticsDrilldownSheet, DataFreshnessIndicator } from "@/components/analytics/shared";
import { getDataFreshness } from "@/lib/analyticsRepository";
import type { KPIMetric } from "@/types/analytics";

type PeriodFilter = "7d" | "30d" | "90d" | "all";
type TypeFilter = "all" | "proyecto_de_ley" | "norma";

export function ClientAnalytics() {
  const { clientId, clientName } = useClientUser();
  const [period, setPeriod] = useState<PeriodFilter>("30d");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  
  // Drilldown state
  const [drilldownOpen, setDrilldownOpen] = useState(false);
  const [drilldownTitle, setDrilldownTitle] = useState("");
  const [drilldownAlertIds, setDrilldownAlertIds] = useState<string[]>([]);

  // Filter only published alerts for this client
  const clientAlerts = useMemo(() => {
    let alerts = ALL_MOCK_ALERTS.filter(alert => 
      alert.status === "published" && 
      (alert.client_id === clientId || alert.primary_client_id === clientId)
    );

    // Apply type filter
    if (typeFilter !== "all") {
      alerts = alerts.filter(a => a.legislation_type === typeFilter);
    }

    // Apply period filter (using created_at as proxy)
    if (period !== "all") {
      const now = new Date();
      const daysMap: Record<string, number> = { "7d": 7, "30d": 30, "90d": 90 };
      const days = daysMap[period];
      const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      alerts = alerts.filter(a => new Date(a.created_at) >= cutoff);
    }

    return alerts;
  }, [clientId, period, typeFilter]);

  // Get timeframe label
  const getTimeframeLabel = () => {
    const labels: Record<PeriodFilter, string> = {
      "7d": "Últimos 7 días",
      "30d": "Últimos 30 días",
      "90d": "Últimos 90 días",
      "all": "Todo el período",
    };
    return labels[period];
  };

  // Handle drilldown - collect alert IDs
  const handleDrilldown = (title: string, alertIds: string[]) => {
    setDrilldownTitle(title);
    setDrilldownAlertIds(alertIds);
    setDrilldownOpen(true);
  };

  // Reset filters
  const resetFilters = () => {
    setPeriod("30d");
    setTypeFilter("all");
  };

  const hasActiveFilters = period !== "30d" || typeFilter !== "all";

  // Calculate service KPIs from alerts
  const serviceKPIs: KPIMetric[] = useMemo(() => {
    const totalAlerts = clientAlerts.length;
    const alertsWithCommentary = clientAlerts.filter(a => a.expert_commentary).length;
    
    // Mock response time (in real app, calculate from timestamps)
    const avgResponseTime = alertsWithCommentary > 0 ? "< 24h" : "N/A";
    
    return [
      { label: "Alertas Publicadas", value: totalAlerts, icon: "file-text" },
      { label: "Tiempo Típico", value: avgResponseTime, icon: "clock" },
      { label: "Comentarios", value: alertsWithCommentary, icon: "check-circle" },
    ];
  }, [clientAlerts]);

  // Get data freshness
  const freshness = getDataFreshness();
  
  // Get client sector for benchmark
  const clientSector = useMemo(() => {
    const client = MOCK_CLIENTS.find(c => c.id === clientId);
    return client?.sector || 'Salud';
  }, [clientId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">
            Métricas y análisis de alertas publicadas para {clientName || "tu organización"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <DataFreshnessIndicator 
            lastUpdate={freshness.lastUpdate}
            dataThrough={freshness.dataThrough}
          />
          <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-500 w-fit">
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

        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as TypeFilter)}>
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            <SelectItem value="proyecto_de_ley">Proyectos de Ley</SelectItem>
            <SelectItem value="norma">Normas</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground">
            Limpiar filtros
          </Button>
        )}

        <div className="ml-auto text-sm text-muted-foreground">
          {clientAlerts.length} alertas publicadas
        </div>
      </div>

      {/* Service KPIs Row */}
      <ServiceKPIsBlock 
        data={serviceKPIs}
        timeframe={getTimeframeLabel()}
      />

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Impact Matrix - Full width on mobile, half on desktop */}
        <ImpactMatrixBlock
          alerts={clientAlerts}
          timeframe={getTimeframeLabel()}
          onDrilldown={(ids) => handleDrilldown("Matriz de Impacto - Alertas", ids)}
        />

        {/* Regulatory Pulse */}
        <RegulatoryPulseBlock
          alerts={clientAlerts}
          timeframe={getTimeframeLabel()}
          onDrilldown={(ids) => handleDrilldown("Pulso Regulatorio - Alertas", ids)}
        />

        {/* Alert Priority */}
        <AlertPriorityBlock
          alerts={clientAlerts}
          timeframe={getTimeframeLabel()}
          onDrilldown={(ids) => handleDrilldown("Prioridad de Alertas", ids)}
        />

        {/* Alert Distribution */}
        <AlertDistributionBlock
          alerts={clientAlerts}
          timeframe={getTimeframeLabel()}
          onDrilldown={(ids) => handleDrilldown("Distribución de Alertas", ids)}
        />

        {/* Top Entities */}
        <TopEntitiesBlock
          alerts={clientAlerts}
          timeframe={getTimeframeLabel()}
          onDrilldown={(ids) => handleDrilldown("Principales Entidades - Alertas", ids)}
          maxItems={5}
        />

        {/* Legislative Funnel */}
        <LegislativeFunnelBlock
          alerts={clientAlerts}
          timeframe={getTimeframeLabel()}
          onDrilldown={(ids) => handleDrilldown("Embudo Legislativo - Alertas", ids)}
        />

        {/* Popular Topics */}
        <PopularTopicsBlock
          alerts={clientAlerts}
          timeframe={getTimeframeLabel()}
          onDrilldown={(ids) => handleDrilldown("Temas Populares - Alertas", ids)}
          maxItems={7}
        />

        {/* Industry Benchmark */}
        <IndustryBenchmarkBlock
          alerts={clientAlerts}
          clientName={clientName || "Su empresa"}
          clientSector={clientSector}
          timeframe={getTimeframeLabel()}
        />
      </div>

      {/* Drilldown Sheet */}
      <AnalyticsDrilldownSheet
        open={drilldownOpen}
        onOpenChange={setDrilldownOpen}
        title={drilldownTitle}
        alertIds={drilldownAlertIds}
      />
    </div>
  );
}
