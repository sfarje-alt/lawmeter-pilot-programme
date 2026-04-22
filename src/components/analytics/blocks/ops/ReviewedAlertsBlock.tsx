import * as React from "react";
import { AnalyticsBlock, ChartTooltip } from "../../shared";
import { ANALYTICS_COLORS } from "@/lib/analyticsColors";
import { Eye } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

interface Props {
  timeframe: string;
  source?: string;
  /** Pre-computed real data: weekly count of reviewed alerts. */
  data?: { week: string; reviewed: number }[];
}

export function ReviewedAlertsBlock({
  timeframe,
  source = "Actividad editorial",
  data = [],
}: Props) {
  const total = data.reduce((s, d) => s + d.reviewed, 0);
  const avg = data.length ? (total / data.length).toFixed(0) : "0";
  const isEmpty = data.length === 0 || total === 0;

  return (
    <AnalyticsBlock
      title="Alertas revisadas por período"
      takeaway={
        isEmpty
          ? "Aún no hay alertas revisadas en el período."
          : `${total} alertas revisadas en el período (promedio ${avg}/semana).`
      }
      infoTooltip="Conteo semanal de alertas que el equipo ha abierto y marcado como leídas. Se calcula a partir del estado real de lectura."
      timeframe={timeframe}
      source={source}
      icon={<Eye className="h-4 w-4 text-primary" />}
      isEmpty={isEmpty}
      renderDataTable={() => (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Semana</TableHead>
              <TableHead className="text-right">Revisadas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((d) => (
              <TableRow key={d.week}>
                <TableCell>{d.week}</TableCell>
                <TableCell className="text-right tabular-nums">{d.reviewed}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    >
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis dataKey="week" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip content={<ChartTooltip />} />
          <Bar dataKey="reviewed" fill={ANALYTICS_COLORS.legislationType.bills} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </AnalyticsBlock>
  );
}
