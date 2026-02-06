import * as React from "react";
import { useClientUser } from "@/hooks/useClientUser";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
} from "./blocks";
import {
  getEditorialMetrics,
  getOperationalQueueMetrics,
  getDataFreshness,
} from "@/lib/analyticsRepository";
import type { AnalyticsFilters, KPIMetric } from "@/types/analytics";
import { ALL_MOCK_ALERTS, MOCK_CLIENTS } from "@/data/peruAlertsMockData";

/**
 * Legal Team Analytics Dashboard
 * Full access to all analytics blocks (internal + client-visible)
 */
export function LegalTeamAnalyticsDashboard() {
  const [period, setPeriod] = React.useState<AnalyticsFilters['period']>('last_30');
  const [selectedClientId, setSelectedClientId] = React.useState<string>('all');

  const filters: AnalyticsFilters = { period };
  const freshness = getDataFreshness();

  // Filter alerts based on period and client
  const filteredAlerts = React.useMemo(() => {
    let alerts = [...ALL_MOCK_ALERTS];

    // Filter by client if selected
    if (selectedClientId !== 'all') {
      alerts = alerts.filter(a => 
        a.client_id === selectedClientId || a.primary_client_id === selectedClientId
      );
    }

    // Filter by period
    const now = new Date();
    const daysMap: Record<string, number> = { 
      'last_7': 7, 'last_30': 30, 'last_60': 60, 'last_90': 90 
    };
    const days = daysMap[period] || 30;
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    alerts = alerts.filter(a => new Date(a.created_at) >= cutoff);

    return alerts;
  }, [period, selectedClientId]);

  // Published alerts for client-visible metrics
  const publishedAlerts = React.useMemo(() => 
    filteredAlerts.filter(a => a.status === 'published'),
  [filteredAlerts]);

  // Get editorial metrics
  const editorialMetrics = React.useMemo(() => 
    getEditorialMetrics(filters), [period]);
  
  const queueMetrics = React.useMemo(() => 
    getOperationalQueueMetrics(), []);

  // Service KPIs
  const serviceKPIs: KPIMetric[] = React.useMemo(() => {
    const total = publishedAlerts.length;
    const withCommentary = publishedAlerts.filter(a => a.expert_commentary).length;
    return [
      { label: "Alertas Publicadas", value: total, icon: "file-text" },
      { label: "Tiempo Típico", value: "< 24h", icon: "clock" },
      { label: "Con Comentario", value: withCommentary, icon: "check-circle" },
    ];
  }, [publishedAlerts]);

  const timeframeLabel = {
    'last_7': 'Últimos 7 días',
    'last_30': 'Últimos 30 días',
    'last_60': 'Últimos 60 días',
    'last_90': 'Últimos 90 días',
  }[period] || period;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Métricas operativas y de servicio
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

          <DataFreshnessIndicator 
            lastUpdate={freshness.lastUpdate} 
            dataThrough={freshness.dataThrough} 
          />
        </div>
      </div>

      {/* Internal Metrics Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold text-foreground">Métricas Operativas</h2>
          <Badge variant="outline" className="text-xs">Solo Interno</Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <EditorialCoverageBlock
            captured={editorialMetrics.totalCaptured}
            published={editorialMetrics.totalPublished}
            coverageRate={editorialMetrics.coverageRate}
            coverageTrend={editorialMetrics.coverageTrend}
            timeframe={timeframeLabel}
          />
          
          <OperationalQueueBlock
            data={queueMetrics}
            timeframe={timeframeLabel}
          />
          
          <TopEntitiesBlock
            alerts={filteredAlerts}
            timeframe={timeframeLabel}
            source="Todas las alertas"
            maxItems={5}
          />
        </div>
      </section>

      {/* Client-visible Metrics Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            {selectedClientId === 'all' ? 'Métricas Agregadas' : 'Métricas del Cliente'}
          </h2>
          <Badge variant="secondary" className="text-xs">Visible para Clientes</Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <RegulatoryPulseBlock
            alerts={publishedAlerts}
            timeframe={timeframeLabel}
          />
          
          <AlertPriorityBlock
            alerts={publishedAlerts}
            timeframe={timeframeLabel}
          />
          
          <AlertDistributionBlock
            alerts={publishedAlerts}
            timeframe={timeframeLabel}
            showByArea
          />
          
          <ImpactMatrixBlock
            alerts={publishedAlerts}
            timeframe={timeframeLabel}
          />
          
          <LegislativeFunnelBlock
            alerts={publishedAlerts}
            timeframe={timeframeLabel}
          />
          
          <ServiceKPIsBlock
            data={serviceKPIs}
            timeframe={timeframeLabel}
          />
          
          <PopularTopicsBlock
            alerts={publishedAlerts}
            timeframe={timeframeLabel}
            maxItems={5}
          />
        </div>
      </section>
    </div>
  );
}
