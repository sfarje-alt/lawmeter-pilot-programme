import * as React from "react";
import { AnalyticsBlock, ChartTooltip, AnalyticsDrilldownSheet } from "../shared";
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
import { useBlockFilters } from "@/hooks/useBlockFilters";
import { applyAlertFilters } from "@/lib/blockFilterUtils";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

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

export function AlertPriorityBlock({
  alerts,
  timeframe,
  source = "Alertas monitoreadas",
  onDrilldown,
}: AlertPriorityBlockProps) {
  const filterState = useBlockFilters('alert_priority');
  const [drilldownOpen, setDrilldownOpen] = React.useState(false);
  const [selectedLevel, setSelectedLevel] = React.useState<string | null>(null);
  const [selectedAlertIds, setSelectedAlertIds] = React.useState<string[]>([]);

  const filteredAlerts = React.useMemo(
    () => applyAlertFilters(alerts, filterState.filters),
    [alerts, filterState.filters]
  );

  const { chartData, impactGroups } = React.useMemo(() => {
    const groups: Record<string, string[]> = {};
    filteredAlerts.forEach(alert => {
      const impact = (alert.impact_level || 'leve').toLowerCase();
      (groups[impact] ||= []).push(alert.id);
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
  }, [filteredAlerts]);

  const total = filteredAlerts.length;
  const isEmpty = total === 0;
  const highPriorityCount = (impactGroups['grave']?.length || 0) + (impactGroups['medio']?.length || 0);

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

  const renderChart = (data: typeof chartData) => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={ANALYTICS_COLORS.chart.grid} vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: ANALYTICS_COLORS.chart.axisLabel }}
          axisLine={{ stroke: ANALYTICS_COLORS.chart.axis }} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: ANALYTICS_COLORS.chart.axisLabel }}
          axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'hsl(var(--muted))', fillOpacity: 0.4 }} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} onClick={(d: any) => handleBarClick(d)} cursor="pointer">
          {data.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <>
      <AnalyticsBlock
        title="Prioridad de Alertas"
        takeaway={takeaway}
        infoTooltip="Distribución de alertas por nivel de impacto: Grave, Medio, Leve, Positivo. Filtra para enfocar el análisis."
        timeframe={timeframe}
        source={source}
        isEmpty={isEmpty}
        icon={<BarChart3 className="h-4 w-4 text-primary" />}
        filterDimensions={['period', 'legislationType', 'impactLevels', 'search']}
        filterState={filterState}
        renderExpanded={() => <div className="h-full w-full">{renderChart(chartData)}</div>}
        renderDataTable={() => (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nivel</TableHead>
                  <TableHead className="text-right">Alertas</TableHead>
                  <TableHead className="text-right">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chartData.map(row => (
                  <TableRow key={row.key}>
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
            <InsightCard title="Atención prioritaria" body={takeaway} />
            <InsightCard
              title="Alertas positivas"
              body={`${impactGroups['positivo']?.length || 0} alertas tienen impacto positivo en el rango filtrado.`}
            />
            <p className="text-[11px] text-muted-foreground italic pt-2">
              Insights derivados de los filtros activos.
            </p>
          </div>
        )}
      >
        <div className="h-[180px] w-full">{renderChart(chartData)}</div>

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

function InsightCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground mt-0.5">{body}</p>
    </div>
  );
}
