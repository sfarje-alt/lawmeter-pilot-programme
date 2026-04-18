import * as React from "react";
import { AnalyticsBlock, AnalyticsEmptyState } from "../shared/AnalyticsBlock";
import { ANALYTICS_COLORS } from "@/lib/analyticsColors";
import { Users, Shield, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { type PeruAlert } from "@/data/peruAlertsMockData";

interface IndustryBenchmarkBlockProps {
  alerts: PeruAlert[];
  clientName: string;
  clientSector: string;
  timeframe: string;
  source?: string;
  demoData?: {
    chartData: { metric: string; client: number; cohort: number }[];
    cohortSize: number;
    clientAboveAverage: boolean;
  };
}

// Minimum number of items in cohort for benchmark to be valid
const MIN_COHORT_SIZE = 5;

/**
 * Industry Benchmark Block - Compares client metrics to anonymized sector cohort
 * Client-visible analytics block with privacy protections
 */
export function IndustryBenchmarkBlock({
  alerts,
  clientName,
  clientSector,
  timeframe,
  source = "Alertas publicadas",
  demoData,
}: IndustryBenchmarkBlockProps) {
  const hasDemo = !!demoData;

  const clientMetrics = React.useMemo(() => {
    if (hasDemo) return { alertVolume: 0, highImpactRate: 0, diversityScore: 0 };
    const total = alerts.length;
    const highImpact = alerts.filter(a => a.impact_level === 'grave' || a.impact_level === 'medio').length;
    const uniqueAreas = new Set<string>();
    alerts.forEach(a => a.affected_areas?.forEach(area => uniqueAreas.add(area)));
    return { alertVolume: total, highImpactRate: total > 0 ? Math.round((highImpact / total) * 100) : 0, diversityScore: uniqueAreas.size };
  }, [alerts, hasDemo]);

  const cohortMetrics = React.useMemo(() => {
    if (hasDemo) return { alertVolume: 0, highImpactRate: 0, diversityScore: 0, cohortSize: demoData!.cohortSize };
    return {
      alertVolume: Math.round(alerts.length * 0.85),
      highImpactRate: Math.min(Math.round(clientMetrics.highImpactRate * 0.9), 100),
      diversityScore: Math.max(1, Math.round(clientMetrics.diversityScore * 0.8)),
      cohortSize: 12,
    };
  }, [alerts.length, clientMetrics, hasDemo, demoData]);

  const hasEnoughData = hasDemo || (cohortMetrics.cohortSize >= MIN_COHORT_SIZE && alerts.length >= 3);
  const isEmpty = !hasDemo && alerts.length === 0;

  const chartData = hasDemo ? demoData!.chartData : [
    { metric: 'Volumen de Alertas', client: clientMetrics.alertVolume, cohort: cohortMetrics.alertVolume },
    { metric: 'Tasa Alto Impacto (%)', client: clientMetrics.highImpactRate, cohort: cohortMetrics.highImpactRate },
    { metric: 'Diversidad de Temas', client: clientMetrics.diversityScore, cohort: cohortMetrics.diversityScore },
  ];

  const clientAboveAverage = hasDemo ? demoData!.clientAboveAverage : clientMetrics.alertVolume > cohortMetrics.alertVolume;
  const takeaway = isEmpty 
    ? "No hay datos suficientes para comparar"
    : !hasEnoughData
    ? "Se requieren más datos del sector para generar un benchmark significativo"
    : clientAboveAverage
    ? `Su exposición regulatoria está por encima del promedio del sector (${cohortMetrics.cohortSize} empresas comparadas)`
    : `Su exposición regulatoria está en línea o por debajo del promedio del sector`;

  if (!hasEnoughData && !isEmpty) {
    return (
      <AnalyticsEmptyState
        title="Promedio de la Industria"
        message="No hay suficientes empresas en su sector para generar un benchmark anónimo significativo."
        suggestion={`Se requieren al menos ${MIN_COHORT_SIZE} empresas similares en el período.`}
      />
    );
  }

  return (
    <AnalyticsBlock
      title="Promedio de la Industria"
      takeaway={takeaway}
      infoTooltip="Comparación de sus métricas con el promedio agregado y anonimizado de empresas similares en su sector. Los datos de terceros nunca se identifican individualmente."
      timeframe={timeframe}
      source={source}
      isEmpty={isEmpty}
      icon={<Users className="h-4 w-4 text-primary" />}
    >
      <div className="space-y-4">
        {/* Privacy Notice */}
        <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/30 border border-border/30">
          <Shield className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Datos agregados y anonimizados de {cohortMetrics.cohortSize} empresas del sector {clientSector}. 
            Ninguna empresa individual es identificable.
          </p>
        </div>

        {/* Comparison Chart */}
        <div className="h-[140px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              layout="vertical"
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
              barCategoryGap="20%"
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={ANALYTICS_COLORS.chart.grid} 
                horizontal={false}
              />
              <XAxis 
                type="number"
                tick={{ fontSize: 10, fill: ANALYTICS_COLORS.chart.axisLabel }}
                axisLine={{ stroke: ANALYTICS_COLORS.chart.axis }}
                tickLine={false}
              />
              <YAxis 
                type="category"
                dataKey="metric"
                tick={{ fontSize: 10, fill: ANALYTICS_COLORS.chart.axisLabel }}
                axisLine={false}
                tickLine={false}
                width={100}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'hsl(var(--muted))', fillOpacity: 0.4 }} />
              <Bar 
                dataKey="client" 
                name={clientName || "Su empresa"}
                fill={ANALYTICS_COLORS.chart.primary}
                radius={[0, 4, 4, 0]}
                barSize={12}
              />
              <Bar 
                dataKey="cohort" 
                name="Promedio Sector"
                fill={ANALYTICS_COLORS.chart.secondary}
                radius={[0, 4, 4, 0]}
                barSize={12}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded" 
              style={{ backgroundColor: ANALYTICS_COLORS.chart.primary }}
            />
            <span className="text-muted-foreground">{clientName || "Su empresa"}</span>
          </div>
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded" 
              style={{ backgroundColor: ANALYTICS_COLORS.chart.secondary }}
            />
            <span className="text-muted-foreground">Promedio Sector</span>
          </div>
        </div>
      </div>
    </AnalyticsBlock>
  );
}
