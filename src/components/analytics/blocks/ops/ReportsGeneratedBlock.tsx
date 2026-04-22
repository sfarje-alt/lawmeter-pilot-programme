import * as React from "react";
import { AnalyticsBlock, ChartTooltip } from "../../shared";
import { ANALYTICS_COLORS } from "@/lib/analyticsColors";
import { FileBarChart } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

interface Props {
  timeframe: string;
  source?: string;
  /** Pre-computed real data: weekly reports + alerts used. */
  data?: { week: string; reports: number; alertsUsed: number }[];
}

export function ReportsGeneratedBlock({
  timeframe,
  source = "Reportes generados internamente",
  data = [],
}: Props) {
  const totalReports = data.reduce((s, d) => s + d.reports, 0);
  const totalAlerts = data.reduce((s, d) => s + d.alertsUsed, 0);
  const isEmpty = data.length === 0 || totalReports === 0;

  return (
    <AnalyticsBlock
      title="Reportes generados y alertas utilizadas"
      takeaway={
        isEmpty
          ? "Aún no se han generado reportes en el período."
          : `${totalReports} reportes generados, con ${totalAlerts} alertas incluidas en el período.`
      }
      infoTooltip="Volumen semanal de reportes generados y total de alertas que fueron utilizadas como contenido en esos reportes."
      timeframe={timeframe}
      source={source}
      icon={<FileBarChart className="h-4 w-4 text-primary" />}
      isEmpty={isEmpty}
      renderDataTable={() => (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Semana</TableHead>
              <TableHead className="text-right">Reportes</TableHead>
              <TableHead className="text-right">Alertas usadas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((d) => (
              <TableRow key={d.week}>
                <TableCell>{d.week}</TableCell>
                <TableCell className="text-right tabular-nums">{d.reports}</TableCell>
                <TableCell className="text-right tabular-nums">{d.alertsUsed}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    >
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
          <defs>
            <linearGradient id="reportsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ANALYTICS_COLORS.legislationType.bills} stopOpacity={0.4} />
              <stop offset="100%" stopColor={ANALYTICS_COLORS.legislationType.bills} stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="alertsUsedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ANALYTICS_COLORS.legislationType.regulations} stopOpacity={0.4} />
              <stop offset="100%" stopColor={ANALYTICS_COLORS.legislationType.regulations} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis dataKey="week" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip content={<ChartTooltip />} />
          <Area type="monotone" dataKey="reports" name="Reportes" stroke={ANALYTICS_COLORS.legislationType.bills} strokeWidth={2} fill="url(#reportsGrad)" />
          <Area type="monotone" dataKey="alertsUsed" name="Alertas usadas" stroke={ANALYTICS_COLORS.legislationType.regulations} strokeWidth={2} fill="url(#alertsUsedGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </AnalyticsBlock>
  );
}
