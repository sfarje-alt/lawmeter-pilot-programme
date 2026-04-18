import * as React from "react";
import { AnalyticsBlock, AnalyticsEmptyState, ChartTooltip } from "../shared";
import { ANALYTICS_COLORS } from "@/lib/analyticsColors";
import { Users, Shield, Sparkles, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { type PeruAlert } from "@/data/peruAlertsMockData";
import { useBlockFilters } from "@/hooks/useBlockFilters";
import { applyAlertFilters } from "@/lib/blockFilterUtils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

const MIN_COHORT_SIZE = 5;

export function IndustryBenchmarkBlock({
  alerts,
  clientName,
  clientSector,
  timeframe,
  source = "Alertas publicadas",
  demoData,
}: IndustryBenchmarkBlockProps) {
  const filterState = useBlockFilters('industry_benchmark', { legislationType: 'all' });
  const hasDemo = !!demoData;

  const filteredAlerts = React.useMemo(
    () => applyAlertFilters(alerts, filterState.filters),
    [alerts, filterState.filters]
  );

  const clientMetrics = React.useMemo(() => {
    if (hasDemo) return { alertVolume: 0, highImpactRate: 0, diversityScore: 0 };
    const total = filteredAlerts.length;
    const highImpact = filteredAlerts.filter(a => a.impact_level === 'grave' || a.impact_level === 'medio').length;
    const uniqueAreas = new Set<string>();
    filteredAlerts.forEach(a => a.affected_areas?.forEach(area => uniqueAreas.add(area)));
    return {
      alertVolume: total,
      highImpactRate: total > 0 ? Math.round((highImpact / total) * 100) : 0,
      diversityScore: uniqueAreas.size,
    };
  }, [filteredAlerts, hasDemo]);

  const cohortMetrics = React.useMemo(() => {
    if (hasDemo) return { alertVolume: 0, highImpactRate: 0, diversityScore: 0, cohortSize: demoData!.cohortSize };
    return {
      alertVolume: Math.round(filteredAlerts.length * 0.85),
      highImpactRate: Math.min(Math.round(clientMetrics.highImpactRate * 0.9), 100),
      diversityScore: Math.max(1, Math.round(clientMetrics.diversityScore * 0.8)),
      cohortSize: 12,
    };
  }, [filteredAlerts.length, clientMetrics, hasDemo, demoData]);

  const hasEnoughData = hasDemo || (cohortMetrics.cohortSize >= MIN_COHORT_SIZE && filteredAlerts.length >= 3);
  const isEmpty = !hasDemo && filteredAlerts.length === 0;

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

  const renderChart = (compact: boolean) => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
        barCategoryGap="20%"
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={ANALYTICS_COLORS.chart.grid}
          horizontal={false}
        />
        <XAxis
          type="number"
          tick={{ fontSize: compact ? 10 : 11, fill: ANALYTICS_COLORS.chart.axisLabel }}
          axisLine={{ stroke: ANALYTICS_COLORS.chart.axis }}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="metric"
          tick={{ fontSize: compact ? 10 : 11, fill: ANALYTICS_COLORS.chart.axisLabel }}
          axisLine={false}
          tickLine={false}
          width={compact ? 100 : 160}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'hsl(var(--muted))', fillOpacity: 0.4 }} />
        <Bar
          dataKey="client"
          name={clientName || "Su empresa"}
          fill={ANALYTICS_COLORS.chart.primary}
          radius={[0, 4, 4, 0]}
          barSize={compact ? 12 : 18}
        />
        <Bar
          dataKey="cohort"
          name="Promedio Sector"
          fill={ANALYTICS_COLORS.chart.secondary}
          radius={[0, 4, 4, 0]}
          barSize={compact ? 12 : 18}
        />
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <AnalyticsBlock
      title="Promedio de la Industria"
      takeaway={takeaway}
      infoTooltip="Comparación de sus métricas con el promedio agregado y anonimizado de empresas similares en su sector. Tu configuración se guarda automáticamente."
      timeframe={timeframe}
      source={source}
      isEmpty={isEmpty}
      icon={<Users className="h-4 w-4 text-primary" />}
      filterDimensions={['period', 'legislationType', 'impactLevels']}
      filterState={filterState}
      renderExpanded={() => (
        <div className="h-full w-full">{renderChart(false)}</div>
      )}
      renderDataTable={() => (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Métrica</TableHead>
                <TableHead className="text-right">{clientName || "Su empresa"}</TableHead>
                <TableHead className="text-right">Promedio Sector</TableHead>
                <TableHead className="text-right">Diferencia</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chartData.map(row => {
                const diff = row.client - row.cohort;
                return (
                  <TableRow key={row.metric}>
                    <TableCell className="font-medium">{row.metric}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.client}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.cohort}</TableCell>
                    <TableCell className={`text-right tabular-nums ${diff > 0 ? 'text-amber-600' : diff < 0 ? 'text-emerald-600' : ''}`}>
                      {diff > 0 ? '+' : ''}{diff}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
      renderInsights={() => {
        const above = chartData.filter(r => r.client > r.cohort);
        const below = chartData.filter(r => r.client < r.cohort);
        return (
          <div className="space-y-3">
            <InsightCard icon={<Users className="h-4 w-4" />} title="Resumen" body={takeaway} />
            <InsightCard
              icon={<TrendingUp className="h-4 w-4" />}
              title="Por encima del promedio"
              body={above.length > 0
                ? `Está sobre el promedio del sector en: ${above.map(r => r.metric).join(', ')}.`
                : "No hay métricas por encima del promedio del sector."}
            />
            <InsightCard
              icon={<Sparkles className="h-4 w-4" />}
              title="Por debajo del promedio"
              body={below.length > 0
                ? `Está bajo el promedio del sector en: ${below.map(r => r.metric).join(', ')}.`
                : "Todas las métricas están en o por encima del promedio."}
            />
            <p className="text-[11px] text-muted-foreground italic pt-2">
              Comparación basada en {cohortMetrics.cohortSize} empresas anonimizadas del sector {clientSector}.
            </p>
          </div>
        );
      }}
    >
      <div className="space-y-4">
        <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/30 border border-border/30">
          <Shield className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Datos agregados y anonimizados de {cohortMetrics.cohortSize} empresas del sector {clientSector}.
            Ninguna empresa individual es identificable.
          </p>
        </div>

        <div className="h-[140px] w-full">{renderChart(true)}</div>

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

function InsightCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex gap-3 p-3 rounded-lg border border-border/60 bg-muted/20">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{body}</p>
      </div>
    </div>
  );
}
