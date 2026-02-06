import * as React from "react";
import { useClientUser } from "@/hooks/useClientUser";
import { Card } from "@/components/ui/card";
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
  getAggregatedMetrics,
  getEditorialMetrics,
  getOperationalQueueMetrics,
  getClientMetrics,
  getDataFreshness,
} from "@/lib/analyticsRepository";
import type { AnalyticsFilters } from "@/types/analytics";
import { MOCK_CLIENTS, PRIMARY_CLIENT_ID } from "@/data/peruAlertsMockData";

/**
 * Legal Team Analytics Dashboard
 * Full access to all analytics blocks (internal + client-visible)
 */
export function LegalTeamAnalyticsDashboard() {
  const { isAdmin } = useClientUser();
  const [period, setPeriod] = React.useState<AnalyticsFilters['period']>('last_30');
  const [selectedClientId, setSelectedClientId] = React.useState<string>('all');

  const filters: AnalyticsFilters = { period };
  const freshness = getDataFreshness();

  // Get metrics
  const aggregatedMetrics = React.useMemo(() => 
    getAggregatedMetrics(filters, 'admin'), [period]);
  
  const editorialMetrics = React.useMemo(() => 
    getEditorialMetrics(filters), [period]);
  
  const queueMetrics = React.useMemo(() => 
    getOperationalQueueMetrics(), []);

  const clientMetrics = React.useMemo(() => {
    if (selectedClientId === 'all') return null;
    const client = MOCK_CLIENTS.find(c => c.id === selectedClientId);
    return getClientMetrics(selectedClientId, client?.name || '', filters);
  }, [selectedClientId, period]);

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
            data={aggregatedMetrics.topEntities}
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
            data={aggregatedMetrics.volumeTrend}
            timeframe={timeframeLabel}
          />
          
          <AlertPriorityBlock
            data={aggregatedMetrics.alertsByImpact}
            timeframe={timeframeLabel}
          />
          
          <AlertDistributionBlock
            byType={{
              'Proyecto de Ley': aggregatedMetrics.totalBills,
              'Norma': aggregatedMetrics.totalRegulations,
            }}
            byArea={aggregatedMetrics.alertsByArea}
            timeframe={timeframeLabel}
            showByArea
          />
          
          {clientMetrics && (
            <>
              <ImpactMatrixBlock
                data={clientMetrics.impactMatrix}
                timeframe={timeframeLabel}
              />
              
              <LegislativeFunnelBlock
                data={clientMetrics.legislativeFunnel}
                timeframe={timeframeLabel}
              />
              
              <ServiceKPIsBlock
                data={clientMetrics.serviceKPIs}
                timeframe={timeframeLabel}
              />
            </>
          )}
          
          <PopularTopicsBlock
            data={aggregatedMetrics.topTopics}
            timeframe={timeframeLabel}
            maxItems={5}
          />
        </div>
      </section>
    </div>
  );
}
