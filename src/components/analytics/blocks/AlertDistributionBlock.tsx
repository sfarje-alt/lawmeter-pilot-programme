import * as React from "react";
import { AnalyticsBlock } from "../shared/AnalyticsBlock";
import { ANALYTICS_COLORS, getLegislationTypeColor } from "@/lib/analyticsColors";
import { PieChart as PieChartIcon } from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface AlertDistributionBlockProps {
  byType: Record<string, number>;
  byArea?: Record<string, number>;
  timeframe: string;
  source?: string;
  showByArea?: boolean;
  onDrilldown?: () => void;
}

/**
 * Alert Distribution Block - Pie chart showing breakdown by type or area
 * Shared between Internal (aggregated) and Client views
 */
export function AlertDistributionBlock({
  byType,
  byArea,
  timeframe,
  source = "Alertas publicadas",
  showByArea = false,
  onDrilldown,
}: AlertDistributionBlockProps) {
  const [view, setView] = React.useState<'type' | 'area'>(showByArea ? 'area' : 'type');
  
  const data = view === 'type' 
    ? byType 
    : (byArea || {});
  
  const chartData = Object.entries(data)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  
  const total = chartData.reduce((sum, d) => sum + d.value, 0);
  const isEmpty = total === 0;
  
  const topItem = chartData[0];
  const takeaway = isEmpty 
    ? "No hay datos para mostrar la distribución"
    : view === 'type'
    ? `${topItem.name === 'Proyecto de Ley' ? 'Proyectos de Ley' : 'Normas'} representan ${Math.round((topItem.value / total) * 100)}% del total`
    : `${topItem.name} es el área más activa con ${Math.round((topItem.value / total) * 100)}% de las alertas`;

  // Colors for pie chart
  const getColor = (name: string, index: number): string => {
    if (view === 'type') {
      return name === 'Proyecto de Ley' || name === 'Bills' 
        ? ANALYTICS_COLORS.legislationType.bills 
        : ANALYTICS_COLORS.legislationType.regulations;
    }
    return ANALYTICS_COLORS.neutral[index % ANALYTICS_COLORS.neutral.length];
  };

  return (
    <AnalyticsBlock
      title="Distribución de Alertas"
      takeaway={takeaway}
      infoTooltip="Desglose de alertas por tipo de legislación (Proyectos de Ley vs Normas) o por área legal."
      timeframe={timeframe}
      source={source}
      onDrilldown={onDrilldown}
      isEmpty={isEmpty}
      icon={<PieChartIcon className="h-4 w-4 text-primary" />}
    >
      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData.slice(0, 6)}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={70}
              paddingAngle={2}
              label={({ name, percent }) => 
                percent > 0.1 ? `${Math.round(percent * 100)}%` : ''
              }
              labelLine={false}
            >
              {chartData.slice(0, 6).map((entry, index) => (
                <Cell 
                  key={entry.name} 
                  fill={getColor(entry.name, index)}
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--popover))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`${value} alertas`, 'Cantidad']}
            />
            <Legend 
              wrapperStyle={{ fontSize: '11px' }}
              iconType="circle"
              formatter={(value) => truncateLegend(value, 20)}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* View toggle for area view */}
      {showByArea && byArea && (
        <div className="flex justify-center gap-2 mt-2">
          <button
            onClick={() => setView('type')}
            className={`text-xs px-2 py-1 rounded ${view === 'type' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
          >
            Por Tipo
          </button>
          <button
            onClick={() => setView('area')}
            className={`text-xs px-2 py-1 rounded ${view === 'area' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
          >
            Por Área
          </button>
        </div>
      )}
    </AnalyticsBlock>
  );
}

function truncateLegend(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + '…';
}
