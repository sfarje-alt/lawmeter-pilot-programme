import * as React from "react";
import { AnalyticsBlock } from "../shared/AnalyticsBlock";
import { ChartTooltip } from "../shared/ChartTooltip";
import { AnalyticsDrilldownSheet } from "../shared/AnalyticsDrilldownSheet";
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
import { type PeruAlert } from "@/data/peruAlertsMockData";

interface AlertPriorityBlockProps {
  alerts: PeruAlert[];
  timeframe: string;
  source?: string;
  onDrilldown?: (alertIds: string[]) => void;
  demoData?: {
    chartData: { name: string; value: number; color: string; key: string }[];
    total: number;
    highPriorityCount: number;
  };
}

const IMPACT_ORDER = ['grave', 'medio', 'leve', 'positivo'];
const IMPACT_DISPLAY: Record<string, string> = { grave: 'Grave', medio: 'Medio', leve: 'Leve', positivo: 'Positivo' };

const IMPACT_CONFIG: Record<string, { icon: React.ElementType; label: string }> = {
  'grave': { icon: AlertTriangle, label: 'Grave' },
  'medio': { icon: AlertCircle, label: 'Medio' },
  'leve': { icon: MinusCircle, label: 'Leve' },
  'positivo': { icon: CheckCircle, label: 'Positivo' },
};

/**
 * Alert Priority Block - Bar chart showing distribution by impact level
 * Shared between Internal (aggregated) and Client views
 */
export function AlertPriorityBlock({
  alerts,
  timeframe,
  source = "Alertas publicadas",
  onDrilldown,
  demoData,
}: AlertPriorityBlockProps) {
  const [drilldownOpen, setDrilldownOpen] = React.useState(false);
  const [selectedLevel, setSelectedLevel] = React.useState<string | null>(null);
  const [selectedAlertIds, setSelectedAlertIds] = React.useState<string[]>([]);

  const { chartData, impactGroups } = React.useMemo(() => {
    if (demoData) {
      const groups: Record<string, string[]> = {};
      demoData.chartData.forEach(d => { groups[d.key] = []; });
      return { chartData: demoData.chartData, impactGroups: groups };
    }

    const groups: Record<string, string[]> = {};
    alerts.forEach(alert => {
      const impact = (alert.impact_level || 'leve').toLowerCase();
      if (!groups[impact]) groups[impact] = [];
      groups[impact].push(alert.id);
    });
    const data = IMPACT_ORDER
      .filter(level => groups[level] && groups[level].length > 0)
      .map(level => ({
        name: IMPACT_DISPLAY[level],
        value: groups[level]?.length || 0,
        color: getImpactColor(level),
        key: level,
      }));
    return { chartData: data, impactGroups: groups };
  }, [alerts, demoData]);
  
  const total = demoData ? demoData.total : alerts.length;
  const isEmpty = total === 0;
  const highPriorityCount = demoData ? demoData.highPriorityCount : (impactGroups['grave']?.length || 0) + (impactGroups['medio']?.length || 0);
  
  const takeaway = isEmpty 
    ? "No hay datos de impacto en el período seleccionado"
    : highPriorityCount > 0
    ? `${highPriorityCount} alertas (${Math.round((highPriorityCount / total) * 100)}%) requieren atención prioritaria`
    : "No hay alertas de alto impacto en este período";

  const handleBarClick = (entry: { key: string; name: string }) => {
    const ids = impactGroups[entry.key] || [];
    setSelectedLevel(entry.name);
    setSelectedAlertIds(ids);
    setDrilldownOpen(true);
    onDrilldown?.(ids);
  };

  return (
    <>
      <AnalyticsBlock
        title="Prioridad de Alertas"
        takeaway={takeaway}
        infoTooltip="Distribución de alertas por nivel de impacto: Grave (requiere acción inmediata), Medio, Leve, Positivo (beneficioso)."
        timeframe={timeframe}
        source={source}
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
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'hsl(var(--muted))', fillOpacity: 0.4 }} />
              <Bar 
                dataKey="value" 
                radius={[4, 4, 0, 0]}
                onClick={(data) => handleBarClick(data)}
                cursor="pointer"
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
            const config = IMPACT_CONFIG[entry.key];
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

      {/* Drilldown Sheet */}
      <AnalyticsDrilldownSheet
        open={drilldownOpen}
        onOpenChange={setDrilldownOpen}
        title={`Impacto ${selectedLevel}`}
        description={`${selectedAlertIds.length} alertas con impacto ${selectedLevel?.toLowerCase()}`}
        alertIds={selectedAlertIds}
      />
    </>
  );
}
