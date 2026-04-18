import * as React from "react";
import { AnalyticsBlock, ChartTooltip, AnalyticsDrilldownSheet } from "../shared";
import { ANALYTICS_COLORS } from "@/lib/analyticsColors";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
} from "recharts";
import { type PeruAlert } from "@/data/peruAlertsMockData";

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
 * Regulatory Pulse Block - Line chart showing volume trend over time
 * Shared between Internal (aggregated) and Client views
 */
export function RegulatoryPulseBlock({
  alerts,
  timeframe,
  source = "Alertas publicadas",
  showTypeBreakdown = false,
  onDrilldown,
  demoData,
}: RegulatoryPulseBlockProps) {
  const [drilldownOpen, setDrilldownOpen] = React.useState(false);
  
  const { chartData, billsTotal, regulationsTotal, trendDirection, trendPercent } = React.useMemo(() => {
    if (demoData) return demoData;

    const weekMap = new Map<string, { date: string; total: number; bills: number; regulations: number; ids: string[] }>();
    
    alerts.forEach(alert => {
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
    const billsCount = alerts.filter(a => a.legislation_type === 'proyecto_de_ley').length;
    const regsCount = alerts.filter(a => a.legislation_type !== 'proyecto_de_ley').length;
    
    return {
      chartData: sortedData,
      billsTotal: billsCount,
      regulationsTotal: regsCount,
      trendDirection: direction as 'up' | 'down' | 'stable',
      trendPercent: trendPct,
    };
  }, [alerts, demoData]);

  const isEmpty = chartData.length === 0;
  const TrendIcon = trendDirection === 'up' ? TrendingUp : trendDirection === 'down' ? TrendingDown : Minus;

  const takeaway = isEmpty 
    ? "No hay datos suficientes para mostrar tendencias"
    : trendDirection === 'up'
    ? `Actividad regulatoria aumentó ${Math.abs(trendPercent)}% vs período anterior`
    : trendDirection === 'down'
    ? `Actividad regulatoria disminuyó ${Math.abs(trendPercent)}% vs período anterior`
    : "Actividad regulatoria estable respecto al período anterior";

  const handleDrilldown = () => {
    const allIds = alerts.map(a => a.id);
    setDrilldownOpen(true);
    onDrilldown?.(allIds);
  };

  return (
    <>
      <AnalyticsBlock
        title="Pulso Regulatorio"
        takeaway={takeaway}
        infoTooltip="Tendencia de volumen de alertas por semana. Muestra si el entorno regulatorio se está acelerando o estabilizando."
        timeframe={timeframe}
        source={source}
        onDrilldown={handleDrilldown}
        isEmpty={isEmpty}
        icon={<TrendIcon className="h-4 w-4 text-primary" />}
      >
        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={ANALYTICS_COLORS.chart.grid} 
                vertical={false}
              />
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
              
              {showTypeBreakdown ? (
                <>
                  <Line
                    type="monotone"
                    dataKey="bills"
                    name="Proyectos de Ley"
                    stroke={ANALYTICS_COLORS.legislationType.bills}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="regulations"
                    name="Normas"
                    stroke={ANALYTICS_COLORS.legislationType.regulations}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '11px' }}
                    iconType="line"
                  />
                </>
              ) : (
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Alertas"
                  stroke={ANALYTICS_COLORS.chart.primary}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </AnalyticsBlock>

      {/* Drilldown Sheet */}
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

// Helper to format dates
function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' });
  } catch {
    return dateStr;
  }
}
