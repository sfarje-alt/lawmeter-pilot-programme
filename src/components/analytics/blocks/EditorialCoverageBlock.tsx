import * as React from "react";
import { AnalyticsBlock, ChartTooltip } from "../shared";
import { ANALYTICS_COLORS } from "@/lib/analyticsColors";
import { MessageSquare, TrendingUp, Sparkles } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TimeSeriesDataPoint } from "@/types/analytics";
import { useBlockFilters } from "@/hooks/useBlockFilters";
import { resolveDateRange } from "@/lib/blockFilterUtils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface EditorialCoverageBlockProps {
  totalAlerts: number;
  withCommentary: number;
  coverageRate: number;
  coverageTrend: TimeSeriesDataPoint[];
  timeframe: string;
  source?: string;
  onDrilldown?: () => void;
}

export function EditorialCoverageBlock({
  totalAlerts,
  withCommentary,
  coverageRate,
  coverageTrend,
  timeframe,
  source = "Todas las alertas",
  onDrilldown,
}: EditorialCoverageBlockProps) {
  const filterState = useBlockFilters('editorial_coverage');

  const filteredTrend = React.useMemo(() => {
    const { from, to } = resolveDateRange(filterState.filters);
    if (!from && !to) return coverageTrend;
    const fromMs = from ? new Date(from).getTime() : -Infinity;
    const toMs = to ? new Date(to).getTime() : Infinity;
    return coverageTrend.filter(p => {
      const t = new Date(p.date).getTime();
      return t >= fromMs && t <= toMs;
    });
  }, [coverageTrend, filterState.filters]);

  const stats = React.useMemo(() => {
    if (filteredTrend.length === 0) return { totalAlerts, withCommentary, coverageRate };
    const ratio = filteredTrend.length / Math.max(coverageTrend.length, 1);
    const total = Math.round(totalAlerts * ratio);
    const withC = Math.round(withCommentary * ratio);
    const avg = filteredTrend.reduce((s, p) => s + p.value, 0) / filteredTrend.length;
    return { totalAlerts: total, withCommentary: withC, coverageRate: avg };
  }, [filteredTrend, coverageTrend.length, totalAlerts, withCommentary, coverageRate]);

  const isEmpty = stats.totalAlerts === 0;
  const withoutCommentary = stats.totalAlerts - stats.withCommentary;

  const takeaway = isEmpty
    ? "No hay alertas en el rango filtrado"
    : `${stats.coverageRate.toFixed(1)}% con comentario experto: ${stats.withCommentary} de ${stats.totalAlerts} alertas`;

  const chartData = filteredTrend.map(p => ({ date: p.date, coverage: p.value }));

  const renderChart = (compact: boolean) => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={ANALYTICS_COLORS.chart.grid} vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatWeek}
          tick={{ fontSize: compact ? 10 : 11, fill: ANALYTICS_COLORS.chart.axisLabel }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: compact ? 10 : 11, fill: ANALYTICS_COLORS.chart.axisLabel }}
          axisLine={false}
          tickLine={false}
          domain={[0, 100]}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip content={<ChartTooltip valueFormatter={(v) => `${v}% con comentario`} />} cursor={{ fill: 'hsl(var(--muted))', fillOpacity: 0.4 }} />
        <Bar dataKey="coverage" fill={ANALYTICS_COLORS.chart.primary} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <AnalyticsBlock
      title="Cobertura con Comentario Experto"
      takeaway={takeaway}
      infoTooltip="Porcentaje de alertas que cuentan con comentario experto añadido por el equipo. Tu configuración se guarda automáticamente."
      timeframe={timeframe}
      source={source}
      onDrilldown={onDrilldown}
      isEmpty={isEmpty}
      icon={<MessageSquare className="h-4 w-4 text-primary" />}
      filterDimensions={['period']}
      filterState={filterState}
      renderExpanded={() => (
        <div className="h-full w-full">{renderChart(false)}</div>
      )}
      renderDataTable={() => (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Semana</TableHead>
                <TableHead className="text-right">Cobertura (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chartData.map(row => (
                <TableRow key={row.date}>
                  <TableCell className="font-medium">{formatWeek(row.date)}</TableCell>
                  <TableCell className="text-right tabular-nums">{row.coverage.toFixed(1)}%</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/30 font-semibold">
                <TableCell>Promedio</TableCell>
                <TableCell className="text-right tabular-nums">{stats.coverageRate.toFixed(1)}%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
      renderInsights={() => {
        const peak = [...chartData].sort((a, b) => b.coverage - a.coverage)[0];
        const low = [...chartData].sort((a, b) => a.coverage - b.coverage)[0];
        return (
          <div className="space-y-3">
            <InsightCard icon={<MessageSquare className="h-4 w-4" />} title="Resumen" body={takeaway} />
            <InsightCard
              icon={<Sparkles className="h-4 w-4" />}
              title="Pendientes de comentario"
              body={`${withoutCommentary} alertas aún no tienen comentario experto en el rango seleccionado.`}
            />
            {peak && (
              <InsightCard
                icon={<TrendingUp className="h-4 w-4" />}
                title="Mejor semana"
                body={`Semana del ${formatWeek(peak.date)}: ${peak.coverage.toFixed(1)}% con comentario.`}
              />
            )}
            {low && (
              <InsightCard
                icon={<Sparkles className="h-4 w-4" />}
                title="Oportunidad de mejora"
                body={`La semana del ${formatWeek(low.date)} tuvo la cobertura más baja (${low.coverage.toFixed(1)}%).`}
              />
            )}
            <p className="text-[11px] text-muted-foreground italic pt-2">
              Insights derivados del rango filtrado. Cambia el período arriba para recalcular.
            </p>
          </div>
        );
      }}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-2 rounded-lg bg-muted/30">
            <div className="text-lg font-semibold text-foreground">{stats.totalAlerts}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div className="p-2 rounded-lg bg-muted/30">
            <div className="text-lg font-semibold text-primary">{stats.withCommentary}</div>
            <div className="text-xs text-muted-foreground">Con comentario</div>
          </div>
          <div className="p-2 rounded-lg bg-muted/30">
            <div className="text-lg font-semibold text-foreground">{stats.coverageRate.toFixed(0)}%</div>
            <div className="text-xs text-muted-foreground">Cobertura</div>
          </div>
        </div>

        {chartData.length > 1 && (
          <div className="h-[100px] w-full">{renderChart(true)}</div>
        )}
      </div>
    </AnalyticsBlock>
  );
}

function formatWeek(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' });
  } catch {
    return dateStr;
  }
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
