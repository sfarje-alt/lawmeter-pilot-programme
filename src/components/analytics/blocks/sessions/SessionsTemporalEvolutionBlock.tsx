import * as React from "react";
import { AnalyticsBlock, ChartTooltip } from "../../shared";
import { ANALYTICS_COLORS } from "@/lib/analyticsColors";
import { TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

interface Props {
  timeframe: string;
  source?: string;
  data?: { date: string; sessions: number }[];
}

const DEMO_DATA = [
  { date: "Nov 1", sessions: 4 },
  { date: "Nov 8", sessions: 6 },
  { date: "Nov 15", sessions: 8 },
  { date: "Nov 22", sessions: 7 },
  { date: "Nov 29", sessions: 9 },
  { date: "Dic 6", sessions: 11 },
  { date: "Dic 13", sessions: 10 },
  { date: "Dic 20", sessions: 5 },
  { date: "Ene 5", sessions: 7 },
  { date: "Ene 12", sessions: 12 },
  { date: "Ene 19", sessions: 14 },
];

export function SessionsTemporalEvolutionBlock({
  timeframe,
  source = "Sesiones del Congreso",
  data = DEMO_DATA,
}: Props) {
  const total = data.reduce((s, d) => s + d.sessions, 0);
  const last = data[data.length - 1];

  return (
    <AnalyticsBlock
      title="Evolución temporal de alertas de sesiones"
      takeaway={`${total} alertas de sesiones en el período. Última semana: ${last?.sessions ?? 0}.`}
      infoTooltip="Tendencia semanal del volumen de alertas de sesiones publicadas."
      timeframe={timeframe}
      source={source}
      icon={<TrendingUp className="h-4 w-4 text-primary" />}
      isEmpty={data.length === 0}
      renderDataTable={() => (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Período</TableHead>
              <TableHead className="text-right">Alertas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((d) => (
              <TableRow key={d.date}>
                <TableCell>{d.date}</TableCell>
                <TableCell className="text-right font-medium">{d.sessions}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    >
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
          <defs>
            <linearGradient id="sessionsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ANALYTICS_COLORS.legislationType.bills} stopOpacity={0.4} />
              <stop offset="100%" stopColor={ANALYTICS_COLORS.legislationType.bills} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip content={<ChartTooltip />} />
          <Area
            type="monotone"
            dataKey="sessions"
            stroke={ANALYTICS_COLORS.legislationType.bills}
            strokeWidth={2}
            fill="url(#sessionsGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </AnalyticsBlock>
  );
}
