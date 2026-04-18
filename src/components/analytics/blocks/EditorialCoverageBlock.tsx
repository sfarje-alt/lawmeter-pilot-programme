import * as React from "react";
import { AnalyticsBlock, ChartTooltip } from "../shared";
import { ANALYTICS_COLORS } from "@/lib/analyticsColors";
import { Layers } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { TimeSeriesDataPoint } from "@/types/analytics";

interface EditorialCoverageBlockProps {
  captured: number;
  published: number;
  coverageRate: number;
  coverageTrend: TimeSeriesDataPoint[];
  timeframe: string;
  source?: string;
  onDrilldown?: () => void;
}

/**
 * Editorial Coverage Block - Stacked bar showing captured vs published
 * Internal-only analytics block for Legal Team
 */
export function EditorialCoverageBlock({
  captured,
  published,
  coverageRate,
  coverageTrend,
  timeframe,
  source = "Todas las alertas",
  onDrilldown,
}: EditorialCoverageBlockProps) {
  const isEmpty = captured === 0;
  const unpublished = captured - published;

  const takeaway = isEmpty 
    ? "No hay alertas capturadas en el período"
    : `${coverageRate.toFixed(1)}% de cobertura editorial: ${published} de ${captured} alertas publicadas`;

  // Prepare chart data
  const chartData = coverageTrend.map(point => ({
    date: point.date,
    coverage: point.value,
  }));

  return (
    <AnalyticsBlock
      title="Cobertura Editorial"
      takeaway={takeaway}
      infoTooltip="Proporción de alertas capturadas que fueron publicadas a clientes. Mide la curación del equipo legal."
      timeframe={timeframe}
      source={source}
      onDrilldown={onDrilldown}
      isEmpty={isEmpty}
      icon={<Layers className="h-4 w-4 text-primary" />}
    >
      <div className="space-y-4">
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-2 rounded-lg bg-muted/30">
            <div className="text-lg font-semibold text-foreground">{captured}</div>
            <div className="text-xs text-muted-foreground">Capturadas</div>
          </div>
          <div className="p-2 rounded-lg bg-muted/30">
            <div 
              className="text-lg font-semibold"
              style={{ color: ANALYTICS_COLORS.chart.published }}
            >
              {published}
            </div>
            <div className="text-xs text-muted-foreground">Publicadas</div>
          </div>
          <div className="p-2 rounded-lg bg-muted/30">
            <div className="text-lg font-semibold text-foreground">
              {coverageRate.toFixed(0)}%
            </div>
            <div className="text-xs text-muted-foreground">Cobertura</div>
          </div>
        </div>

        {/* Trend chart */}
        {chartData.length > 1 && (
          <div className="h-[100px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={ANALYTICS_COLORS.chart.grid} 
                  vertical={false}
                />
                <XAxis 
                  dataKey="date"
                  tickFormatter={(value) => formatWeek(value)}
                  tick={{ fontSize: 10, fill: ANALYTICS_COLORS.chart.axisLabel }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: ANALYTICS_COLORS.chart.axisLabel }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'hsl(var(--muted))', fillOpacity: 0.4 }} />
                <Bar 
                  dataKey="coverage" 
                  fill={ANALYTICS_COLORS.chart.primary}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
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
