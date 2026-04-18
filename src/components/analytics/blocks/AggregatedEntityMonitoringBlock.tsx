import * as React from "react";
import { AnalyticsBlock, ChartTooltip } from "../shared";
import { getNeutralColor, ANALYTICS_COLORS } from "@/lib/analyticsColors";
import { Building } from "lucide-react";
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
  const data = demoData.slice(0, maxItems);
  const isEmpty = data.length === 0;

  const takeaway = isEmpty
    ? "No hay datos de entidades en el período"
    : `${data[0]?.label} lidera con ${data[0]?.value} alertas capturadas (todos los clientes)`;

  return (
    <AnalyticsBlock
      title="Monitoreo de Entidades Agregado"
      takeaway={takeaway}
      infoTooltip="Ranking de reguladores y grupos parlamentarios por volumen total de items capturados, incluyendo todas las alertas (no solo publicadas). Métrica interna del equipo."
      timeframe={timeframe}
      source={source}
      isEmpty={isEmpty}
      icon={<Building className="h-4 w-4 text-primary" />}
    >
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
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
              width={120}
              tickFormatter={(v) => (v.length > 18 ? v.slice(0, 17) + "…" : v)}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'hsl(var(--muted))', fillOpacity: 0.4 }} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((_, index) => (
                <Cell key={index} fill={getNeutralColor(index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </AnalyticsBlock>
  );
}
