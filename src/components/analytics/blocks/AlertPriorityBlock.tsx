import * as React from "react";
import { AnalyticsBlock } from "../shared/AnalyticsBlock";
import { ANALYTICS_COLORS, getImpactColor } from "@/lib/analyticsColors";
import { BarChart3, AlertTriangle, AlertCircle, MinusCircle, CheckCircle } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
} from "recharts";

interface AlertPriorityBlockProps {
  data: Record<string, number>;
  timeframe: string;
  source?: string;
  onDrilldown?: () => void;
}

const IMPACT_ORDER = ['Grave', 'Medio', 'Leve', 'Positivo'];

const IMPACT_CONFIG: Record<string, { icon: React.ElementType; label: string }> = {
  'Grave': { icon: AlertTriangle, label: 'Grave' },
  'Medio': { icon: AlertCircle, label: 'Medio' },
  'Leve': { icon: MinusCircle, label: 'Leve' },
  'Positivo': { icon: CheckCircle, label: 'Positivo' },
};

/**
 * Alert Priority Block - Bar chart showing distribution by impact level
 * Shared between Internal (aggregated) and Client views
 */
export function AlertPriorityBlock({
  data,
  timeframe,
  source = "Alertas publicadas",
  onDrilldown,
}: AlertPriorityBlockProps) {
  // Normalize and sort data
  const chartData = IMPACT_ORDER
    .filter(level => data[level] !== undefined || data[level.toLowerCase()] !== undefined)
    .map(level => ({
      name: level,
      value: data[level] || data[level.toLowerCase()] || 0,
      color: getImpactColor(level),
    }));
  
  const total = chartData.reduce((sum, d) => sum + d.value, 0);
  const isEmpty = total === 0;
  
  const graveCount = data['Grave'] || data['grave'] || 0;
  const medioCount = data['Medio'] || data['medio'] || 0;
  const highPriorityCount = graveCount + medioCount;
  
  const takeaway = isEmpty 
    ? "No hay datos de impacto en el período seleccionado"
    : highPriorityCount > 0
    ? `${highPriorityCount} alertas (${Math.round((highPriorityCount / total) * 100)}%) requieren atención prioritaria`
    : "No hay alertas de alto impacto en este período";

  return (
    <AnalyticsBlock
      title="Prioridad de Alertas"
      takeaway={takeaway}
      infoTooltip="Distribución de alertas por nivel de impacto: Grave (requiere acción inmediata), Medio, Leve, Positivo (beneficioso)."
      timeframe={timeframe}
      source={source}
      onDrilldown={onDrilldown}
      isEmpty={isEmpty}
      icon={<BarChart3 className="h-4 w-4 text-primary" />}
    >
      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={ANALYTICS_COLORS.chart.grid} 
              vertical={false}
            />
            <XAxis 
              dataKey="name"
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
              formatter={(value: number) => [`${value} alertas`, 'Cantidad']}
              cursor={{ fill: 'hsl(var(--muted))' }}
            />
            <Bar 
              dataKey="value" 
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((entry) => (
                <Cell 
                  key={entry.name} 
                  fill={entry.color}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend with icons */}
      <div className="flex justify-center gap-4 mt-2">
        {chartData.map(entry => {
          const config = IMPACT_CONFIG[entry.name];
          const Icon = config?.icon || MinusCircle;
          
          return (
            <div key={entry.name} className="flex items-center gap-1 text-xs text-muted-foreground">
              <Icon className="h-3 w-3" style={{ color: entry.color }} />
              <span>{entry.name}</span>
            </div>
          );
        })}
      </div>
    </AnalyticsBlock>
  );
}
