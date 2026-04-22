import * as React from "react";
import { AnalyticsBlock, ChartTooltip, AnalyticsDrilldownSheet } from "../shared";
import { ANALYTICS_COLORS, getNeutralColor } from "@/lib/analyticsColors";
import { PieChart as PieChartIcon } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { type PeruAlert } from "@/data/peruAlertsMockData";
import { useBlockFilters } from "@/hooks/useBlockFilters";
import { applyAlertFilters } from "@/lib/blockFilterUtils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

type Slice = { name: string; value: number; ids: string[] };

/**
 * Alert Distribution Block - Pie chart showing breakdown by type or area.
 * Per-block filters affect both the small preview and the expanded view.
 */
export function AlertDistributionBlock({
  alerts,
  timeframe,
  source = "Alertas monitoreadas",
  showByArea = false,
  onDrilldown,
  demoData,
}: AlertDistributionBlockProps) {
  const filterState = useBlockFilters('alert_distribution', { legislationType: 'all' });
  const [view, setView] = React.useState<'type' | 'area'>(showByArea ? 'area' : 'type');
  const [drilldownOpen, setDrilldownOpen] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [selectedLabel, setSelectedLabel] = React.useState("");

  const filteredAlerts = React.useMemo(
    () => applyAlertFilters(alerts, filterState.filters),
    [alerts, filterState.filters]
  );

  const buildSlices = React.useCallback((source: PeruAlert[]): Slice[] => {
    if (demoData && source === alerts && Object.keys(filterState.filters).every(k => {
      const v = (filterState.filters as any)[k];
      return v === undefined || v === '' || v === 'all' || v === 'inherit' || (Array.isArray(v) && v.length === 0);
    })) {
      const data = view === 'type' ? demoData.typeData : demoData.areaData;
      return data;
    }

    if (view === 'type') {
      const groups: Record<string, string[]> = {};
      source.forEach(a => {
        const type = a.legislation_type === 'proyecto_de_ley' ? 'Proyectos de Ley' : 'Normas';
        (groups[type] ||= []).push(a.id);
      });
      return Object.entries(groups)
        .map(([name, ids]) => ({ name, value: ids.length, ids }))
        .sort((a, b) => b.value - a.value);
    }
    const groups: Record<string, string[]> = {};
    source.forEach(a => {
      a.affected_areas?.forEach(area => {
        (groups[area] ||= []).push(a.id);
      });
    });
    return Object.entries(groups)
      .map(([name, ids]) => ({ name, value: ids.length, ids }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [alerts, demoData, filterState.filters, view]);

  const chartData = React.useMemo(() => buildSlices(filteredAlerts), [buildSlices, filteredAlerts]);
  const total = chartData.reduce((s, d) => s + d.value, 0);
  const isEmpty = total === 0;
  const topItem = chartData[0];

  const takeaway = isEmpty
    ? "No hay datos para mostrar la distribución"
    : view === 'type'
    ? `${topItem?.name || ''} representan ${Math.round(((topItem?.value || 0) / total) * 100)}% del total`
    : `${topItem?.name || ''} es el área más activa con ${Math.round(((topItem?.value || 0) / total) * 100)}% de las alertas`;

  const getColor = (name: string, index: number): string => {
    if (view === 'type') {
      return name === 'Proyectos de Ley'
        ? ANALYTICS_COLORS.legislationType.bills
        : ANALYTICS_COLORS.legislationType.regulations;
    }
    return getNeutralColor(index);
  };

  const handleSliceClick = (entry: Slice) => {
    setSelectedLabel(entry.name);
    setSelectedIds(entry.ids);
    setDrilldownOpen(true);
    onDrilldown?.(entry.ids);
  };

  const renderPie = (data: Slice[], compact: boolean) => (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={compact ? 45 : 80}
          outerRadius={compact ? 75 : 140}
          paddingAngle={2}
          label={false}
          onClick={(d: any) => handleSliceClick(d)}
          cursor="pointer"
        >
          {data.map((entry, index) => (
            <Cell
              key={entry.name}
              fill={getColor(entry.name, index)}
              stroke="hsl(var(--background))"
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'hsl(var(--muted))', fillOpacity: 0.4 }} />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <>
      <AnalyticsBlock
        title="Distribución de Alertas"
        takeaway={takeaway}
        infoTooltip="Desglose de alertas por tipo de legislación (Proyectos de Ley vs Normas) o por área legal. Tu configuración se guarda automáticamente."
        timeframe={timeframe}
        source={source}
        isEmpty={isEmpty}
        icon={<PieChartIcon className="h-4 w-4 text-primary" />}
        filterDimensions={['legislationType', 'impactLevels', 'search']}
        filterState={filterState}
        renderExpanded={() => (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <div className="lg:col-span-2 min-h-[400px]">
              {renderPie(chartData, false)}
            </div>
            <div className="space-y-2 overflow-auto">
              {chartData.map((entry, index) => (
                <button
                  key={entry.name}
                  onClick={() => handleSliceClick(entry)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                >
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getColor(entry.name, index) }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{entry.name}</p>
                    <p className="text-xs text-muted-foreground">{entry.value} alertas</p>
                  </div>
                  <span className="text-sm font-semibold tabular-nums">
                    {Math.round((entry.value / total) * 100)}%
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
        renderDataTable={() => (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="text-right">Alertas</TableHead>
                  <TableHead className="text-right">% del total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chartData.map(row => (
                  <TableRow key={row.name}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.value}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {Math.round((row.value / total) * 100)}%
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/30 font-semibold">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right tabular-nums">{total}</TableCell>
                  <TableCell className="text-right tabular-nums">100%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
        renderInsights={() => (
          <div className="space-y-3">
            <InsightCard title="Categoría dominante" body={takeaway} />
            {chartData.length > 1 && (
              <InsightCard
                title="Concentración"
                body={`Las 3 principales categorías concentran ${Math.round(
                  (chartData.slice(0, 3).reduce((s, d) => s + d.value, 0) / total) * 100
                )}% de las alertas filtradas (${total} alertas en total).`}
              />
            )}
            <p className="text-[11px] text-muted-foreground italic pt-2">
              Insights derivados de los filtros activos. Cambia los filtros arriba para recalcular.
            </p>
          </div>
        )}
      >
        <div className="h-[220px] w-full">
          {renderPie(chartData, true)}
        </div>

        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-1 px-2">
          {chartData.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: getColor(entry.name, index) }}
              />
              <span className="truncate max-w-[120px]">{entry.name}</span>
              <span className="font-medium text-foreground">{Math.round((entry.value / total) * 100)}%</span>
            </div>
          ))}
        </div>

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

      <AnalyticsDrilldownSheet
        open={drilldownOpen}
        onOpenChange={setDrilldownOpen}
        title={`Distribución: ${selectedLabel}`}
        description={`${selectedIds.length} alertas`}
        alertIds={selectedIds}
        alertsData={filteredAlerts}
      />
    </>
  );
}

function InsightCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground mt-0.5">{body}</p>
    </div>
  );
}
