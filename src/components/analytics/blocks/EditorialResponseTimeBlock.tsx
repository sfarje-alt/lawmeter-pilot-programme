import * as React from "react";
import { AnalyticsBlock } from "../shared/AnalyticsBlock";
import { ANALYTICS_COLORS } from "@/lib/analyticsColors";
import { Clock, TrendingDown } from "lucide-react";
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

interface EditorialResponseTimeBlockProps {
  timeframe: string;
  source?: string;
  demoData?: typeof DEMO_EDITORIAL_RESPONSE_TIME;
}

export function EditorialResponseTimeBlock({
  timeframe,
  source = "Alertas publicadas con comentario",
  demoData = DEMO_EDITORIAL_RESPONSE_TIME,
}: EditorialResponseTimeBlockProps) {
  const data = demoData;
  const isEmpty = data.weeklyTrend.length === 0;

  const takeaway = isEmpty
    ? "No hay datos de tiempo de respuesta"
    : `Tiempo promedio de ${data.avgHours}h (mediana: ${data.medianHours}h) entre captura y publicación`;

  return (
    <AnalyticsBlock
      title="Tiempo de Respuesta Editorial"
      takeaway={takeaway}
      infoTooltip="Tiempo promedio entre la captura de una alerta y la publicación del comentario experto. Objetivo: < 24h."
      timeframe={timeframe}
      source={source}
      isEmpty={isEmpty}
      icon={<Clock className="h-4 w-4 text-primary" />}
    >
      <div className="space-y-4">
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-2 rounded-lg bg-muted/30">
            <div className="text-lg font-semibold text-foreground">{data.avgHours}h</div>
            <div className="text-xs text-muted-foreground">Promedio</div>
          </div>
          <div className="p-2 rounded-lg bg-muted/30">
            <div className="text-lg font-semibold text-foreground">{data.medianHours}h</div>
            <div className="text-xs text-muted-foreground">Mediana</div>
          </div>
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <div className="flex items-center justify-center gap-1 text-lg font-semibold text-emerald-600 dark:text-emerald-400">
              <TrendingDown className="h-4 w-4" />
              OK
            </div>
            <div className="text-xs text-muted-foreground">{"< 24h"}</div>
          </div>
        </div>

        {/* Trend chart */}
        <div className="h-[160px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.weeklyTrend} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={ANALYTICS_COLORS.chart.grid}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tickFormatter={(v) => {
                  try { return new Date(v).toLocaleDateString("es-PE", { day: "numeric", month: "short" }); }
                  catch { return v; }
                }}
                tick={{ fontSize: 10, fill: ANALYTICS_COLORS.chart.axisLabel }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: ANALYTICS_COLORS.chart.axisLabel }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}h`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [`${value}h`, "Tiempo"]}
                labelFormatter={(v) => {
                  try { return `Semana del ${new Date(v).toLocaleDateString("es-PE", { day: "numeric", month: "short" })}`; }
                  catch { return v; }
                }}
              />
              <ReferenceLine
                y={24}
                stroke="hsl(0, 65%, 50%)"
                strokeDasharray="4 4"
                label={{ value: "Meta 24h", fill: "hsl(0, 65%, 50%)", fontSize: 10, position: "insideTopRight" }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={ANALYTICS_COLORS.chart.primary}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AnalyticsBlock>
  );
}
