import * as React from "react";
import { AnalyticsBlock } from "../shared/AnalyticsBlock";
import { AnalyticsDrilldownSheet } from "../shared/AnalyticsDrilldownSheet";
import { ANALYTICS_COLORS, getNeutralColor } from "@/lib/analyticsColors";
import { Building2, TrendingUp, TrendingDown, Minus } from "lucide-react";
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
import type { RankingItem, TrendData } from "@/types/analytics";

interface TopEntitiesBlockProps {
  data: RankingItem[];
  timeframe: string;
  source?: string;
  maxItems?: number;
  showTrends?: boolean;
  onDrilldown?: () => void;
}

/**
 * Top Entities Block - Bar chart ranking of most active entities
 * Shared between Internal (aggregated) and Client views
 */
export function TopEntitiesBlock({
  data,
  timeframe,
  source = "Alertas publicadas",
  maxItems = 7,
  showTrends = false,
  onDrilldown,
}: TopEntitiesBlockProps) {
  const [drilldownOpen, setDrilldownOpen] = React.useState(false);
  const [selectedEntity, setSelectedEntity] = React.useState<RankingItem | null>(null);

  const displayData = data.slice(0, maxItems);
  const isEmpty = displayData.length === 0;
  const remaining = data.length - maxItems;

  const topEntity = displayData[0];
  const takeaway = isEmpty 
    ? "No hay datos de entidades en el período seleccionado"
    : `${topEntity.label} lidera con ${topEntity.value} alertas (${Math.round((topEntity.value / data.reduce((s, d) => s + d.value, 0)) * 100)}% del total)`;

  const handleBarClick = (entry: RankingItem) => {
    setSelectedEntity(entry);
    setDrilldownOpen(true);
  };

  return (
    <>
      <AnalyticsBlock
        title="Principales Entidades"
        takeaway={takeaway}
        infoTooltip="Ranking de entidades emisoras (reguladores, partidos políticos) con mayor número de alertas publicadas. Haga clic en una barra para ver las alertas."
        timeframe={timeframe}
        source={source}
        onDrilldown={onDrilldown}
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
                radius={[0, 4, 4, 0]}
                onClick={(data) => handleBarClick(data as unknown as RankingItem)}
                style={{ cursor: 'pointer' }}
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
        title={selectedEntity ? `Entidad: ${selectedEntity.label}` : "Alertas"}
        description={selectedEntity ? `${selectedEntity.value} alertas de esta entidad` : undefined}
        alertIds={[]} // Would need to pass actual alert IDs
      />
    </>
  );
}

// Helper to truncate long labels
function truncateLabel(label: string, maxLength: number): string {
  if (label.length <= maxLength) return label;
  return label.slice(0, maxLength - 1) + '…';
}

// Trend indicator component
function TrendIndicator({ trend }: { trend: TrendData }) {
  const Icon = trend.direction === 'up' ? TrendingUp : trend.direction === 'down' ? TrendingDown : Minus;
  const color = trend.direction === 'up' 
    ? ANALYTICS_COLORS.trend.up 
    : trend.direction === 'down' 
    ? ANALYTICS_COLORS.trend.down 
    : ANALYTICS_COLORS.trend.stable;
  
  return (
    <span className="inline-flex items-center gap-0.5 text-xs" style={{ color }}>
      <Icon className="h-3 w-3" />
      {trend.change !== 0 && <span>{Math.abs(trend.change)}%</span>}
    </span>
  );
}
