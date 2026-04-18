import * as React from "react";
import { AnalyticsBlock } from "../shared/AnalyticsBlock";
import { AnalyticsDrilldownSheet } from "../shared/AnalyticsDrilldownSheet";
import { getNeutralColor } from "@/lib/analyticsColors";
import { Building2 } from "lucide-react";
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
import { ANALYTICS_COLORS } from "@/lib/analyticsColors";
import { type PeruAlert } from "@/data/peruAlertsMockData";

interface TopEntitiesBlockProps {
  alerts: PeruAlert[];
  timeframe: string;
  source?: string;
  maxItems?: number;
  showTrends?: boolean;
  onDrilldown?: (alertIds: string[]) => void;
  demoData?: RankingItem[];
}

type RankingItem = { id: string; label: string; value: number };

/**
 * Top Entities Block - Bar chart ranking of most active entities
 * Shared between Internal (aggregated) and Client views
 */
export function TopEntitiesBlock({
  alerts,
  timeframe,
  source = "Alertas publicadas",
  maxItems = 7,
  onDrilldown,
  demoData,
}: TopEntitiesBlockProps) {
  const [drilldownOpen, setDrilldownOpen] = React.useState(false);
  const [selectedLabel, setSelectedLabel] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const { displayData, entityGroups, total } = React.useMemo(() => {
    if (demoData) {
      const data = demoData.slice(0, maxItems).map(d => ({ ...d, ids: [] as string[] }));
      return { displayData: data, entityGroups: {} as Record<string, string[]>, total: demoData.reduce((s, d) => s + d.value, 0) };
    }

    const groups: Record<string, string[]> = {};
    alerts.forEach(alert => {
      const entity = alert.entity || alert.parliamentary_group || 'Sin entidad';
      if (!groups[entity]) groups[entity] = [];
      groups[entity].push(alert.id);
    });
    const data = Object.entries(groups)
      .map(([label, ids]) => ({ id: label, label, value: ids.length, ids }))
      .sort((a, b) => b.value - a.value)
      .slice(0, maxItems);
    return { displayData: data, entityGroups: groups, total: alerts.length };
  }, [alerts, maxItems, demoData]);

  const isEmpty = displayData.length === 0;
  const remaining = Object.keys(entityGroups).length - maxItems;

  const topEntity = displayData[0];
  const takeaway = isEmpty 
    ? "No hay datos de entidades en el período seleccionado"
    : `${topEntity?.label || ''} lidera con ${topEntity?.value || 0} alertas (${Math.round(((topEntity?.value || 0) / total) * 100)}% del total)`;

  const handleBarClick = (entry: { label: string; ids: string[] }) => {
    setSelectedLabel(entry.label);
    setSelectedIds(entry.ids);
    setDrilldownOpen(true);
    onDrilldown?.(entry.ids);
  };

  return (
    <>
      <AnalyticsBlock
        title="Principales Entidades"
        takeaway={takeaway}
        infoTooltip="Ranking de entidades emisoras (reguladores, partidos políticos) con mayor número de alertas publicadas. Haga clic en una barra para ver las alertas."
        timeframe={timeframe}
        source={source}
        isEmpty={isEmpty}
        icon={<Building2 className="h-4 w-4 text-primary" />}
      >
        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={displayData} 
              layout="vertical"
              margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={ANALYTICS_COLORS.chart.grid} 
                horizontal={false}
              />
              <XAxis 
                type="number"
                tick={{ fontSize: 11, fill: ANALYTICS_COLORS.chart.axisLabel }}
                axisLine={{ stroke: ANALYTICS_COLORS.chart.axis }}
                tickLine={false}
                allowDecimals={false}
              />
              <YAxis 
                type="category"
                dataKey="label"
                tick={{ fontSize: 11, fill: ANALYTICS_COLORS.chart.axisLabel }}
                axisLine={false}
                tickLine={false}
                width={100}
                tickFormatter={(value) => truncateLabel(value, 14)}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'hsl(var(--muted))', fillOpacity: 0.4 }} />
              <Bar 
                dataKey="value" 
                radius={[0, 4, 4, 0]}
                onClick={(data) => handleBarClick(data)}
                cursor="pointer"
              >
                {displayData.map((entry, index) => (
                  <Cell 
                    key={entry.id} 
                    fill={getNeutralColor(index)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {remaining > 0 && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            +{remaining} entidades más
          </p>
        )}
      </AnalyticsBlock>

      {/* Drilldown Sheet */}
      <AnalyticsDrilldownSheet
        open={drilldownOpen}
        onOpenChange={setDrilldownOpen}
        title={`Entidad: ${selectedLabel}`}
        description={`${selectedIds.length} alertas de esta entidad`}
        alertIds={selectedIds}
      />
    </>
  );
}

// Helper to truncate long labels
function truncateLabel(label: string, maxLength: number): string {
  if (label.length <= maxLength) return label;
  return label.slice(0, maxLength - 1) + '…';
}
