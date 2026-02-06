import * as React from "react";
import { AnalyticsBlock } from "../shared/AnalyticsBlock";
import { AnalyticsDrilldownSheet } from "../shared/AnalyticsDrilldownSheet";
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
import type { TimeSeriesDataPoint } from "@/types/analytics";

interface RegulatoryPulseBlockProps {
  data: TimeSeriesDataPoint[];
  billsData?: TimeSeriesDataPoint[];
  regulationsData?: TimeSeriesDataPoint[];
  timeframe: string;
  source?: string;
  showTypeBreakdown?: boolean;
  onDrilldown?: () => void;
}

/**
 * Regulatory Pulse Block - Line chart showing volume trend over time
 * Shared between Internal (aggregated) and Client views
 */
export function RegulatoryPulseBlock({
  data,
  billsData,
  regulationsData,
  timeframe,
  source = "Alertas publicadas",
  showTypeBreakdown = false,
  onDrilldown,
}: RegulatoryPulseBlockProps) {
  const isEmpty = data.length === 0;

  // Calculate trend
  const currentTotal = data.slice(-4).reduce((sum, d) => sum + d.value, 0);
  const previousTotal = data.slice(-8, -4).reduce((sum, d) => sum + d.value, 0);
  const trendPercent = previousTotal > 0 
    ? Math.round(((currentTotal - previousTotal) / previousTotal) * 100) 
    : 0;
  
  const trendDirection = trendPercent > 5 ? 'up' : trendPercent < -5 ? 'down' : 'stable';
  const TrendIcon = trendDirection === 'up' ? TrendingUp : trendDirection === 'down' ? TrendingDown : Minus;

  const takeaway = isEmpty 
    ? "No hay datos suficientes para mostrar tendencias"
    : trendDirection === 'up'
    ? `Actividad regulatoria aumentó ${Math.abs(trendPercent)}% vs período anterior`
    : trendDirection === 'down'
    ? `Actividad regulatoria disminuyó ${Math.abs(trendPercent)}% vs período anterior`
    : "Actividad regulatoria estable respecto al período anterior";

  // Format data for chart
  const chartData = React.useMemo(() => {
    if (showTypeBreakdown && billsData && regulationsData) {
      // Merge data by date
      const dateMap = new Map<string, { date: string; total: number; bills: number; regulations: number }>();
      
      data.forEach(d => {
        dateMap.set(d.date, { date: d.date, total: d.value, bills: 0, regulations: 0 });
      });
      
      billsData.forEach(d => {
        const existing = dateMap.get(d.date);
        if (existing) existing.bills = d.value;
      });
      
      regulationsData.forEach(d => {
        const existing = dateMap.get(d.date);
        if (existing) existing.regulations = d.value;
      });
      
      return Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date));
    }
    
    return data.map(d => ({ ...d, label: formatDate(d.date) }));
  }, [data, billsData, regulationsData, showTypeBreakdown]);

  return (
    <AnalyticsBlock
      title="Pulso Regulatorio"
      takeaway={takeaway}
      infoTooltip="Tendencia de volumen de alertas por semana. Muestra si el entorno regulatorio se está acelerando o estabilizando."
      timeframe={timeframe}
      source={source}
      onDrilldown={onDrilldown}
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
              contentStyle={{ 
                backgroundColor: 'hsl(var(--popover))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              labelFormatter={(value) => `Semana del ${formatDate(value)}`}
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
                dataKey="value"
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
