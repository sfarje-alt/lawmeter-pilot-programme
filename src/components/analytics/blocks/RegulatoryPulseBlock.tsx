import * as React from "react";
import { AnalyticsBlock, ChartTooltip, AnalyticsDrilldownSheet } from "../shared";
import { ANALYTICS_COLORS } from "@/lib/analyticsColors";
import { TrendingUp, TrendingDown, Minus, Sparkles } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
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

interface RegulatoryPulseBlockProps {
  alerts: PeruAlert[];
  timeframe: string;
  source?: string;
  showTypeBreakdown?: boolean;
  onDrilldown?: (alertIds: string[]) => void;
  demoData?: {
    chartData: { date: string; total: number; bills: number; regulations: number; ids: string[] }[];
    billsTotal: number;
    regulationsTotal: number;
    trendDirection: 'up' | 'down' | 'stable';
    trendPercent: number;
  };
}

/**
 * Regulatory Pulse Block - Line chart showing volume trend over time.
 * Now an interactive analytics module with persistent per-block filters,
 * Visualización / Datos / Insights tabs, and date-range / type filtering.
 */
export function RegulatoryPulseBlock({
  alerts,
  timeframe,
  source = "Alertas monitoreadas",
  showTypeBreakdown = false,
  onDrilldown,
  demoData,
}: RegulatoryPulseBlockProps) {
  const [drilldownOpen, setDrilldownOpen] = React.useState(false);
  const filterState = useBlockFilters('regulatory_pulse', { legislationType: 'all' });

  // Apply per-block filters first so the small preview and expanded view stay in sync
  const filteredAlerts = React.useMemo(
    () => applyAlertFilters(alerts, filterState.filters),
    [alerts, filterState.filters]
  );

  const baseData = React.useMemo(() => {
    if (demoData) return demoData;

    const weekMap = new Map<string, { date: string; total: number; bills: number; regulations: number; ids: string[] }>();

    filteredAlerts.forEach(alert => {
      const date = new Date(alert.created_at || alert.project_date || alert.publication_date);
      const dayOfWeek = date.getDay();
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - dayOfWeek);
      const weekKey = startOfWeek.toISOString().split('T')[0];

      if (!weekMap.has(weekKey)) {
        weekMap.set(weekKey, { date: weekKey, total: 0, bills: 0, regulations: 0, ids: [] });
      }

      const week = weekMap.get(weekKey)!;
      week.total++;
      week.ids.push(alert.id);

      if (alert.legislation_type === 'proyecto_de_ley') {
        week.bills++;
      } else {
        week.regulations++;
      }
    });

    const sortedData = Array.from(weekMap.values()).sort((a, b) => a.date.localeCompare(b.date));
    const recentWeeks = sortedData.slice(-4);
    const previousWeeks = sortedData.slice(-8, -4);
    const currentTotal = recentWeeks.reduce((sum, w) => sum + w.total, 0);
    const previousTotal = previousWeeks.reduce((sum, w) => sum + w.total, 0);
    const trendPct = previousTotal > 0 ? Math.round(((currentTotal - previousTotal) / previousTotal) * 100) : 0;
    const direction = trendPct > 5 ? 'up' : trendPct < -5 ? 'down' : 'stable';
    const billsCount = filteredAlerts.filter(a => a.legislation_type === 'proyecto_de_ley').length;
    const regsCount = filteredAlerts.filter(a => a.legislation_type !== 'proyecto_de_ley').length;

    return {
      chartData: sortedData,
      billsTotal: billsCount,
      regulationsTotal: regsCount,
      trendDirection: direction as 'up' | 'down' | 'stable',
      trendPercent: trendPct,
    };
  }, [filteredAlerts, demoData]);

  const filteredData = baseData.chartData;

  const activeType = filterState.filters.legislationType || 'all';
  const totalsForView = React.useMemo(() => {
    const bills = filteredData.reduce((s, r) => s + r.bills, 0);
    const regs = filteredData.reduce((s, r) => s + r.regulations, 0);
    return { bills, regs, total: bills + regs };
  }, [filteredData]);

  const isEmpty = filteredData.length === 0;
  const TrendIcon = baseData.trendDirection === 'up' ? TrendingUp : baseData.trendDirection === 'down' ? TrendingDown : Minus;

  const takeaway = isEmpty
    ? "No hay datos suficientes para mostrar tendencias"
    : baseData.trendDirection === 'up'
    ? `Actividad regulatoria aumentó ${Math.abs(baseData.trendPercent)}% vs período anterior`
    : baseData.trendDirection === 'down'
    ? `Actividad regulatoria disminuyó ${Math.abs(baseData.trendPercent)}% vs período anterior`
    : "Actividad regulatoria estable respecto al período anterior";

  const handleDrilldown = () => {
    setDrilldownOpen(true);
    onDrilldown?.(alerts.map(a => a.id));
  };

  const renderChart = (data: typeof filteredData, breakdown: boolean) => (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
        <defs>
          <linearGradient id="pulseBills" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ANALYTICS_COLORS.legislationType.bills} stopOpacity={0.5} />
            <stop offset="100%" stopColor={ANALYTICS_COLORS.legislationType.bills} stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="pulseRegs" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ANALYTICS_COLORS.legislationType.regulations} stopOpacity={0.5} />
            <stop offset="100%" stopColor={ANALYTICS_COLORS.legislationType.regulations} stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="pulseTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ANALYTICS_COLORS.chart.primary} stopOpacity={0.5} />
            <stop offset="100%" stopColor={ANALYTICS_COLORS.chart.primary} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={ANALYTICS_COLORS.chart.grid} vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(value) => formatDate(value)}
          tick={{ fontSize: 11, fill: ANALYTICS_COLORS.chart.axisLabel }}
          axisLine={{ stroke: ANALYTICS_COLORS.chart.axis }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: ANALYTICS_COLORS.chart.axisLabel }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          content={
            <ChartTooltip
              labelFormatter={(value) => `Semana del ${formatDate(value as string)}`}
              valueFormatter={(value) => `${value} alertas`}
            />
          }
          cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '3 3' }}
        />
        {breakdown ? (
          <>
            {(activeType === 'all' || activeType === 'regulations') && (
              <Area type="monotone" dataKey="regulations" name="Normas" stackId="1"
                stroke={ANALYTICS_COLORS.legislationType.regulations} strokeWidth={2}
                fill="url(#pulseRegs)" activeDot={{ r: 4 }} />
            )}
            {(activeType === 'all' || activeType === 'bills') && (
              <Area type="monotone" dataKey="bills" name="Proyectos de Ley" stackId="1"
                stroke={ANALYTICS_COLORS.legislationType.bills} strokeWidth={2}
                fill="url(#pulseBills)" activeDot={{ r: 4 }} />
            )}
            <Legend wrapperStyle={{ fontSize: '11px' }} iconType="line" />
          </>
        ) : (
          <Area type="monotone" dataKey="total" name="Alertas"
            stroke={ANALYTICS_COLORS.chart.primary} strokeWidth={2}
            fill="url(#pulseTotal)" activeDot={{ r: 4 }} />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );

  return (
    <>
      <AnalyticsBlock
        title="Pulso Regulatorio"
        takeaway={takeaway}
        infoTooltip="Tendencia de volumen de alertas por semana. Filtra por rango de fechas o tipo para enfocar el análisis. Tu configuración se guarda automáticamente."
        timeframe={timeframe}
        source={source}
        onDrilldown={handleDrilldown}
        isEmpty={isEmpty}
        icon={<TrendIcon className="h-4 w-4 text-primary" />}
        filterDimensions={['legislationType', 'impactLevels', 'search']}
        filterState={filterState}
        renderExpanded={({ filters }) => {
          const breakdown = (filters.legislationType || 'all') !== 'all' || showTypeBreakdown;
          return <div className="h-full w-full">{renderChart(filteredData, breakdown || true)}</div>;
        }}
        renderDataTable={() => (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Semana</TableHead>
                  <TableHead className="text-right">Proyectos de Ley</TableHead>
                  <TableHead className="text-right">Normas</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map(row => (
                  <TableRow key={row.date}>
                    <TableCell className="font-medium">{formatDate(row.date)}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.bills}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.regulations}</TableCell>
                    <TableCell className="text-right tabular-nums font-semibold">{row.total}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/30 font-semibold">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right tabular-nums">{totalsForView.bills}</TableCell>
                  <TableCell className="text-right tabular-nums">{totalsForView.regs}</TableCell>
                  <TableCell className="text-right tabular-nums">{totalsForView.total}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
        renderInsights={() => {
          const peakWeek = [...filteredData].sort((a, b) => b.total - a.total)[0];
          const avg = filteredData.length ? Math.round(filteredData.reduce((s, r) => s + r.total, 0) / filteredData.length) : 0;
          return (
            <div className="space-y-3">
              <InsightCard
                icon={<TrendIcon className="h-4 w-4" />}
                title="Tendencia general"
                body={takeaway}
              />
              {peakWeek && (
                <InsightCard
                  icon={<Sparkles className="h-4 w-4" />}
                  title="Semana de mayor actividad"
                  body={`La semana del ${formatDate(peakWeek.date)} concentró ${peakWeek.total} alertas (${peakWeek.bills} proyectos y ${peakWeek.regulations} normas).`}
                />
              )}
              <InsightCard
                icon={<Minus className="h-4 w-4" />}
                title="Promedio semanal"
                body={`En el rango filtrado el promedio es ${avg} alertas por semana, con ${totalsForView.bills} proyectos y ${totalsForView.regs} normas.`}
              />
              <p className="text-[11px] text-muted-foreground italic pt-2">
                Insights derivados automáticamente del rango y filtros activos. Cambia los filtros arriba para recalcular.
              </p>
            </div>
          );
        }}
      >
        <div className="h-[180px] w-full">
          {renderChart(filteredData.slice(-12), showTypeBreakdown)}
        </div>
      </AnalyticsBlock>

      <AnalyticsDrilldownSheet
        open={drilldownOpen}
        onOpenChange={setDrilldownOpen}
        title="Pulso Regulatorio - Todas las Alertas"
        description={`${alerts.length} alertas en el período`}
        alertIds={alerts.map(a => a.id)}
      />
    </>
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

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' });
  } catch {
    return dateStr;
  }
}
