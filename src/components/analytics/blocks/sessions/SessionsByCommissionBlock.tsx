import * as React from "react";
import { AnalyticsBlock, ChartTooltip } from "../../shared";
import { ANALYTICS_COLORS } from "@/lib/analyticsColors";
import { Building2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

interface SessionsByCommissionBlockProps {
  timeframe: string;
  source?: string;
  /** Pre-computed real data: count of sessions per commission. */
  data?: { commission: string; sessions: number }[];
}

export function SessionsByCommissionBlock({
  timeframe,
  source = "Sesiones del Congreso",
  data = [],
}: SessionsByCommissionBlockProps) {
  const sorted = React.useMemo(
    () => [...data].sort((a, b) => b.sessions - a.sessions),
    [data]
  );
  const total = sorted.reduce((s, d) => s + d.sessions, 0);
  const top = sorted[0];
  const isEmpty = sorted.length === 0;

  return (
    <AnalyticsBlock
      title="Alertas de sesiones por comisión"
      takeaway={
        isEmpty
          ? "Aún no hay sesiones registradas en el período."
          : top
          ? `${top.commission} concentra ${top.sessions} sesiones (${Math.round((top.sessions / total) * 100)}%) en el período.`
          : "Sin datos."
      }
      infoTooltip="Volumen de sesiones del Congreso agrupadas por la comisión parlamentaria que las convoca, calculado a partir de las sesiones reales del período."
      timeframe={timeframe}
      source={source}
      icon={<Building2 className="h-4 w-4 text-primary" />}
      isEmpty={isEmpty}
      renderDataTable={() => (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Comisión</TableHead>
              <TableHead className="text-right">Sesiones</TableHead>
              <TableHead className="text-right">% del total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((d) => (
              <TableRow key={d.commission}>
                <TableCell>{d.commission}</TableCell>
                <TableCell className="text-right font-medium">{d.sessions}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {total > 0 ? Math.round((d.sessions / total) * 100) : 0}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    >
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={sorted} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis dataKey="commission" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={60} />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip content={<ChartTooltip />} />
          <Bar dataKey="sessions" fill={ANALYTICS_COLORS.legislationType.bills} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </AnalyticsBlock>
  );
}
