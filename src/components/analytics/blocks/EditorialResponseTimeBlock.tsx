import * as React from "react";
import { AnalyticsBlock, ChartTooltip } from "../shared";
import { ANALYTICS_COLORS } from "@/lib/analyticsColors";
import { Eye, TrendingDown, Sparkles } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { DEMO_EDITORIAL_RESPONSE_TIME } from "@/lib/analyticsMockData";
import { useBlockFilters } from "@/hooks/useBlockFilters";
import { resolveDateRange } from "@/lib/blockFilterUtils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface EditorialResponseTimeBlockProps {
  timeframe: string;
  source?: string;
  demoData?: typeof DEMO_EDITORIAL_RESPONSE_TIME;
}

const TARGET_HOURS = 12;

export function EditorialResponseTimeBlock({
  timeframe,
  source = "Tiempo entre creación y primera lectura",
  demoData = DEMO_EDITORIAL_RESPONSE_TIME,
}: EditorialResponseTimeBlockProps) {
  const filterState = useBlockFilters('editorial_response_time');

  const filteredTrend = React.useMemo(() => {
    const { from, to } = resolveDateRange(filterState.filters);
    if (!from && !to) return demoData.weeklyTrend;
    const fromMs = from ? new Date(from).getTime() : -Infinity;
    const toMs = to ? new Date(to).getTime() : Infinity;
    return demoData.weeklyTrend.filter(p => {
      const t = new Date(p.date).getTime();
      return t >= fromMs && t <= toMs;
    });
  }, [demoData.weeklyTrend, filterState.filters]);

  const stats = React.useMemo(() => {
    if (filteredTrend.length === 0) {
      return { avg: demoData.avgHours, median: demoData.medianHours };
    }
    const values = filteredTrend.map(p => p.value).sort((a, b) => a - b);
    const avg = Math.round(values.reduce((s, v) => s + v, 0) / values.length);
    const median = values[Math.floor(values.length / 2)];
    return { avg, median };
  }, [filteredTrend, demoData]);

  const isEmpty = filteredTrend.length === 0;

  const takeaway = isEmpty
    ? "No hay datos de apertura en el rango filtrado"
    : `Tiempo medio de ${stats.avg}h (mediana: ${stats.median}h) entre creación y primera apertura`;

  const renderChart = (compact: boolean) => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={filteredTrend} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={ANALYTICS_COLORS.chart.grid} vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(v) => {
            try { return new Date(v).toLocaleDateString("es-PE", { day: "numeric", month: "short" }); }
            catch { return v; }
          }}
          tick={{ fontSize: compact ? 10 : 11, fill: ANALYTICS_COLORS.chart.axisLabel }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: compact ? 10 : 11, fill: ANALYTICS_COLORS.chart.axisLabel }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}h`}
        />
        <Tooltip content={<ChartTooltip valueFormatter={(v) => `${v} horas`} />} cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '3 3' }} />
        <ReferenceLine
          y={TARGET_HOURS}
          stroke="hsl(0, 65%, 50%)"
          strokeDasharray="4 4"
          label={{ value: `Meta ${TARGET_HOURS}h`, fill: "hsl(0, 65%, 50%)", fontSize: 10, position: "insideTopRight" }}
        />
        <Line type="monotone" dataKey="value" stroke={ANALYTICS_COLORS.chart.primary} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <AnalyticsBlock
      title="Tiempo Medio de Apertura"
      takeaway={takeaway}
      infoTooltip={`Horas promedio entre la creación de una alerta y la primera vez que el equipo la abre. Meta: < ${TARGET_HOURS}h. Tu configuración se guarda automáticamente.`}
      timeframe={timeframe}
      source={source}
      isEmpty={isEmpty}
      icon={<Eye className="h-4 w-4 text-primary" />}
      filterDimensions={[]}
      filterState={filterState}
      renderExpanded={() => (
        <div className="h-full w-full">{renderChart(false)}</div>
      )}
      renderDataTable={() => (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Semana</TableHead>
                <TableHead className="text-right">Tiempo (horas)</TableHead>
                <TableHead className="text-right">Vs meta ({TARGET_HOURS}h)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrend.map(row => (
                <TableRow key={row.date}>
                  <TableCell className="font-medium">
                    {new Date(row.date).toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" })}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{row.value}h</TableCell>
                  <TableCell className={`text-right tabular-nums ${row.value <= TARGET_HOURS ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {row.value <= TARGET_HOURS ? '✓ OK' : `+${row.value - TARGET_HOURS}h`}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      renderInsights={() => {
        const overTarget = filteredTrend.filter(p => p.value > TARGET_HOURS).length;
        const onTarget = filteredTrend.length - overTarget;
        const compliance = filteredTrend.length ? Math.round((onTarget / filteredTrend.length) * 100) : 0;
        return (
          <div className="space-y-3">
            <InsightCard icon={<Eye className="h-4 w-4" />} title="Resumen" body={takeaway} />
            <InsightCard
              icon={<TrendingDown className="h-4 w-4" />}
              title="Cumplimiento de meta"
              body={`${onTarget} de ${filteredTrend.length} semanas (${compliance}%) cumplieron la meta de apertura < ${TARGET_HOURS}h.`}
            />
            <InsightCard
              icon={<Sparkles className="h-4 w-4" />}
              title="Recomendación"
              body={overTarget > filteredTrend.length / 2
                ? "Más de la mitad de las semanas excedieron la meta. Las alertas tardan en ser abiertas."
                : "El equipo abre las alertas de forma oportuna."}
            />
            <p className="text-[11px] text-muted-foreground italic pt-2">
              Insights derivados del rango filtrado. Cambia el período arriba para recalcular.
            </p>
          </div>
        );
      }}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-2 rounded-lg bg-muted/30">
            <div className="text-lg font-semibold text-foreground">{stats.avg}h</div>
            <div className="text-xs text-muted-foreground">Promedio</div>
          </div>
          <div className="p-2 rounded-lg bg-muted/30">
            <div className="text-lg font-semibold text-foreground">{stats.median}h</div>
            <div className="text-xs text-muted-foreground">Mediana</div>
          </div>
          <div className={`p-2 rounded-lg ${stats.avg <= TARGET_HOURS ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
            <div className={`flex items-center justify-center gap-1 text-lg font-semibold ${stats.avg <= TARGET_HOURS ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
              <TrendingDown className="h-4 w-4" />
              {stats.avg <= TARGET_HOURS ? 'OK' : '!'}
            </div>
            <div className="text-xs text-muted-foreground">{`< ${TARGET_HOURS}h`}</div>
          </div>
        </div>

        <div className="h-[160px] w-full">{renderChart(true)}</div>
      </div>
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
