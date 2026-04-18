import * as React from "react";
import { AnalyticsBlock, ChartTooltip, AnalyticsDrilldownSheet } from "../shared";
import { ANALYTICS_COLORS, getNeutralColor } from "@/lib/analyticsColors";
import { Building2 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { type PeruAlert } from "@/data/peruAlertsMockData";
import { useBlockFilters } from "@/hooks/useBlockFilters";
import { applyAlertFilters } from "@/lib/blockFilterUtils";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

interface TopEntitiesBlockProps {
  alerts: PeruAlert[];
  timeframe: string;
  source?: string;
  maxItems?: number;
  showTrends?: boolean;
  onDrilldown?: (alertIds: string[]) => void;
  demoData?: { id: string; label: string; value: number }[];
}

export function TopEntitiesBlock({
  alerts,
  timeframe,
  source = "Alertas monitoreadas",
  maxItems = 7,
  onDrilldown,
}: TopEntitiesBlockProps) {
  const filterState = useBlockFilters('top_entities');
  const [drilldownOpen, setDrilldownOpen] = React.useState(false);
  const [selectedLabel, setSelectedLabel] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const filteredAlerts = React.useMemo(
    () => applyAlertFilters(alerts, filterState.filters),
    [alerts, filterState.filters]
  );

  const { displayData, total, remaining, fullData } = React.useMemo(() => {
    const groups: Record<string, string[]> = {};
    filteredAlerts.forEach(alert => {
      const entity = alert.entity || alert.parliamentary_group || 'Sin entidad';
      (groups[entity] ||= []).push(alert.id);
    });
    const allData = Object.entries(groups)
      .map(([label, ids]) => ({ id: label, label, value: ids.length, ids }))
      .sort((a, b) => b.value - a.value);
    return {
      displayData: allData.slice(0, maxItems),
      fullData: allData,
      total: filteredAlerts.length,
      remaining: Math.max(allData.length - maxItems, 0),
    };
  }, [filteredAlerts, maxItems]);

  const isEmpty = displayData.length === 0;
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

  const renderChart = (data: typeof displayData) => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={ANALYTICS_COLORS.chart.grid} horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11, fill: ANALYTICS_COLORS.chart.axisLabel }}
          axisLine={{ stroke: ANALYTICS_COLORS.chart.axis }} tickLine={false} allowDecimals={false} />
        <YAxis type="category" dataKey="label"
          tick={{ fontSize: 11, fill: ANALYTICS_COLORS.chart.axisLabel }}
          axisLine={false} tickLine={false} width={140}
          tickFormatter={(value) => truncateLabel(value, 18)} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'hsl(var(--muted))', fillOpacity: 0.4 }} />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} onClick={(d: any) => handleBarClick(d)} cursor="pointer">
          {data.map((entry, index) => <Cell key={entry.id} fill={getNeutralColor(index)} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <>
      <AnalyticsBlock
        title="Principales Entidades"
        takeaway={takeaway}
        infoTooltip="Ranking de entidades emisoras (reguladores, partidos políticos) con mayor número de alertas. Haz clic en una barra para ver las alertas."
        timeframe={timeframe}
        source={source}
        isEmpty={isEmpty}
        icon={<Building2 className="h-4 w-4 text-primary" />}
        filterDimensions={['period', 'legislationType', 'impactLevels', 'search']}
        filterState={filterState}
        renderExpanded={() => (
          <div className="h-full w-full">{renderChart(fullData.slice(0, 20))}</div>
        )}
        renderDataTable={() => (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Entidad</TableHead>
                  <TableHead className="text-right">Alertas</TableHead>
                  <TableHead className="text-right">% del total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fullData.map((row, i) => (
                  <TableRow key={row.id} className="cursor-pointer" onClick={() => handleBarClick(row)}>
                    <TableCell className="tabular-nums text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="font-medium">{row.label}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.value}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {Math.round((row.value / total) * 100)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        renderInsights={() => (
          <div className="space-y-3">
            <InsightCard title="Entidad líder" body={takeaway} />
            {fullData.length >= 3 && (
              <InsightCard
                title="Concentración de actividad"
                body={`Las 3 entidades principales emiten ${Math.round(
                  (fullData.slice(0, 3).reduce((s, d) => s + d.value, 0) / total) * 100
                )}% de las alertas filtradas.`}
              />
            )}
            <InsightCard
              title="Diversidad regulatoria"
              body={`${fullData.length} entidades distintas aparecen en el rango filtrado.`}
            />
          </div>
        )}
      >
        <div className="h-[180px] w-full">{renderChart(displayData)}</div>

        {remaining > 0 && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            +{remaining} entidades más
          </p>
        )}
      </AnalyticsBlock>

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

function truncateLabel(label: string, maxLength: number): string {
  if (label.length <= maxLength) return label;
  return label.slice(0, maxLength - 1) + '…';
}

function InsightCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground mt-0.5">{body}</p>
    </div>
  );
}
