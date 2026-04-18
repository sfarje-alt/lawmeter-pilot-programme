import * as React from "react";
import { AnalyticsBlock, ChartTooltip } from "../shared";
import { getNeutralColor, ANALYTICS_COLORS } from "@/lib/analyticsColors";
import { Building, TrendingUp, Sparkles } from "lucide-react";
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
import { DEMO_AGGREGATED_ENTITIES } from "@/lib/analyticsMockData";
import type { RankingItem } from "@/types/analytics";
import { useBlockFilters } from "@/hooks/useBlockFilters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AggregatedEntityMonitoringBlockProps {
  timeframe: string;
  source?: string;
  maxItems?: number;
  demoData?: RankingItem[];
}

export function AggregatedEntityMonitoringBlock({
  timeframe,
  source = "Todas las alertas capturadas",
  maxItems = 10,
  demoData = DEMO_AGGREGATED_ENTITIES,
}: AggregatedEntityMonitoringBlockProps) {
  const filterState = useBlockFilters('aggregated_entity_monitoring', { search: '' });

  const filteredData = React.useMemo(() => {
    const q = (filterState.filters.search || '').trim().toLowerCase();
    if (!q) return demoData;
    return demoData.filter(d => d.label.toLowerCase().includes(q));
  }, [demoData, filterState.filters.search]);

  const previewData = filteredData.slice(0, maxItems);
  const isEmpty = previewData.length === 0;

  const total = filteredData.reduce((s, d) => s + d.value, 0);
  const takeaway = isEmpty
    ? "No hay entidades que coincidan con la búsqueda"
    : `${filteredData[0]?.label} lidera con ${filteredData[0]?.value} alertas (de ${total} totales)`;

  const renderChart = (items: RankingItem[], compact: boolean) => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={items}
        layout="vertical"
        margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={ANALYTICS_COLORS.chart.grid}
          horizontal={false}
        />
        <XAxis
          type="number"
          tick={{ fontSize: compact ? 11 : 12, fill: ANALYTICS_COLORS.chart.axisLabel }}
          axisLine={{ stroke: ANALYTICS_COLORS.chart.axis }}
          tickLine={false}
          allowDecimals={false}
        />
        <YAxis
          type="category"
          dataKey="label"
          tick={{ fontSize: compact ? 11 : 12, fill: ANALYTICS_COLORS.chart.axisLabel }}
          axisLine={false}
          tickLine={false}
          width={compact ? 120 : 200}
          tickFormatter={(v) => (compact && v.length > 18 ? v.slice(0, 17) + "…" : v)}
        />
        <Tooltip content={<ChartTooltip valueFormatter={(v) => `${v} alertas`} />} cursor={{ fill: 'hsl(var(--muted))', fillOpacity: 0.4 }} />
        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
          {items.map((_, index) => (
            <Cell key={index} fill={getNeutralColor(index)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <AnalyticsBlock
      title="Monitoreo de Entidades Agregado"
      takeaway={takeaway}
      infoTooltip="Ranking de reguladores y grupos parlamentarios por volumen total de items capturados, incluyendo todas las alertas. Tu configuración se guarda automáticamente."
      timeframe={timeframe}
      source={source}
      isEmpty={isEmpty}
      icon={<Building className="h-4 w-4 text-primary" />}
      filterDimensions={['search']}
      filterState={filterState}
      renderExpanded={() => (
        <div className="h-full w-full">{renderChart(filteredData, false)}</div>
      )}
      renderDataTable={() => (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Entidad</TableHead>
                <TableHead className="text-right">Alertas capturadas</TableHead>
                <TableHead className="text-right">% del total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((row, idx) => (
                <TableRow key={row.id}>
                  <TableCell className="text-muted-foreground tabular-nums">{idx + 1}</TableCell>
                  <TableCell className="font-medium">{row.label}</TableCell>
                  <TableCell className="text-right tabular-nums">{row.value}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {Math.round((row.value / total) * 100)}%
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/30 font-semibold">
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell className="text-right tabular-nums">{total}</TableCell>
                <TableCell className="text-right tabular-nums">100%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
      renderInsights={() => {
        const top3 = filteredData.slice(0, 3);
        const top3Share = top3.reduce((s, d) => s + d.value, 0);
        return (
          <div className="space-y-3">
            <InsightCard icon={<Building className="h-4 w-4" />} title="Resumen" body={takeaway} />
            <InsightCard
              icon={<TrendingUp className="h-4 w-4" />}
              title="Top 3 entidades"
              body={`${top3.map(t => t.label).join(', ')} concentran ${Math.round((top3Share / total) * 100)}% de las alertas (${top3Share} de ${total}).`}
            />
            <InsightCard
              icon={<Sparkles className="h-4 w-4" />}
              title="Cobertura"
              body={`Estás monitoreando ${filteredData.length} entidad(es) regulatorias y grupos parlamentarios.`}
            />
            <p className="text-[11px] text-muted-foreground italic pt-2">
              Insights derivados del ranking filtrado.
            </p>
          </div>
        );
      }}
    >
      <div className="h-[280px] w-full">{renderChart(previewData, true)}</div>
    </AnalyticsBlock>
  );
}

function InsightCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex gap-3 p-3 rounded-lg border border-border/60 bg-muted/20">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{body}</p>
      </div>
    </div>
  );
}
