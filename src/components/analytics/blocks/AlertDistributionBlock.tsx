import * as React from "react";
import { AnalyticsBlock } from "../shared/AnalyticsBlock";
import { AnalyticsDrilldownSheet } from "../shared/AnalyticsDrilldownSheet";
import { ANALYTICS_COLORS, getLegislationTypeColor, getNeutralColor } from "@/lib/analyticsColors";
import { PieChart as PieChartIcon } from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { type PeruAlert } from "@/data/peruAlertsMockData";

interface AlertDistributionBlockProps {
  alerts: PeruAlert[];
  timeframe: string;
  source?: string;
  showByArea?: boolean;
  onDrilldown?: (alertIds: string[]) => void;
  demoData?: {
    typeData: { name: string; value: number; ids: string[] }[];
    areaData: { name: string; value: number; ids: string[] }[];
  };
}

/**
 * Alert Distribution Block - Pie chart showing breakdown by type or area
 * Shared between Internal (aggregated) and Client views
 */
export function AlertDistributionBlock({
  alerts,
  timeframe,
  source = "Alertas publicadas",
  showByArea = false,
  onDrilldown,
}: AlertDistributionBlockProps) {
  const [view, setView] = React.useState<'type' | 'area'>(showByArea ? 'area' : 'type');
  const [drilldownOpen, setDrilldownOpen] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [selectedLabel, setSelectedLabel] = React.useState("");

  // Build data from alerts
  const { chartData, groups } = React.useMemo(() => {
    const typeGroups: Record<string, string[]> = {};
    const areaGroups: Record<string, string[]> = {};

    alerts.forEach(alert => {
      // By type
      const type = alert.legislation_type === 'proyecto_de_ley' ? 'Proyectos de Ley' : 'Normas';
      if (!typeGroups[type]) typeGroups[type] = [];
      typeGroups[type].push(alert.id);

      // By area
      alert.affected_areas?.forEach(area => {
        if (!areaGroups[area]) areaGroups[area] = [];
        areaGroups[area].push(alert.id);
      });
    });

    const currentGroups = view === 'type' ? typeGroups : areaGroups;
    const data = Object.entries(currentGroups)
      .map(([name, ids]) => ({ name, value: ids.length, ids }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    return { chartData: data, groups: currentGroups };
  }, [alerts, view]);
  
  const total = alerts.length;
  const isEmpty = total === 0;
  
  const topItem = chartData[0];
  const takeaway = isEmpty 
    ? "No hay datos para mostrar la distribución"
    : view === 'type'
    ? `${topItem?.name || ''} representan ${Math.round(((topItem?.value || 0) / total) * 100)}% del total`
    : `${topItem?.name || ''} es el área más activa con ${Math.round(((topItem?.value || 0) / total) * 100)}% de las alertas`;

  // Colors for pie chart
  const getColor = (name: string, index: number): string => {
    if (view === 'type') {
      return name === 'Proyectos de Ley' || name === 'Bills' 
        ? ANALYTICS_COLORS.legislationType.bills 
        : ANALYTICS_COLORS.legislationType.regulations;
    }
    return getNeutralColor(index);
  };

  const handleSliceClick = (entry: { name: string; ids: string[] }) => {
    setSelectedLabel(entry.name);
    setSelectedIds(entry.ids);
    setDrilldownOpen(true);
    onDrilldown?.(entry.ids);
  };

  return (
    <>
      <AnalyticsBlock
        title="Distribución de Alertas"
        takeaway={takeaway}
        infoTooltip="Desglose de alertas por tipo de legislación (Proyectos de Ley vs Normas) o por área legal."
        timeframe={timeframe}
        source={source}
        isEmpty={isEmpty}
        icon={<PieChartIcon className="h-4 w-4 text-primary" />}
      >
        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                label={({ percent }) => 
                  percent > 0.1 ? `${Math.round(percent * 100)}%` : ''
                }
                labelLine={false}
                onClick={(data) => handleSliceClick(data)}
                cursor="pointer"
              >
                {chartData.map((entry, index) => (
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
        {showByArea && (
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

      {/* Drilldown Sheet */}
      <AnalyticsDrilldownSheet
        open={drilldownOpen}
        onOpenChange={setDrilldownOpen}
        title={`Distribución: ${selectedLabel}`}
        description={`${selectedIds.length} alertas`}
        alertIds={selectedIds}
      />
    </>
  );
}

function truncateLegend(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + '…';
}
