import * as React from "react";
import { AnalyticsBlock, ChartTooltip, SessionsDrilldownSheet } from "../../shared";
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
import type { Sesion } from "@/hooks/useSesiones";

interface Props {
  timeframe: string;
  source?: string;
  /** Raw live sessions; preferred input. */
  sessions?: Sesion[];
  /** Legacy pre-computed weekly buckets. */
  data?: { date: string; sessions: number }[];
}

function isoWeekStart(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}
function formatWeekLabel(d: Date): string {
  return d.toLocaleDateString("es-PE", { day: "numeric", month: "short" });
}

export function SessionsTemporalEvolutionBlock({
  timeframe,
  source = "Sesiones del Congreso",
  sessions,
  data,
}: Props) {
  const [drilldownOpen, setDrilldownOpen] = React.useState(false);
  const [selectedWeekKey, setSelectedWeekKey] = React.useState<string | null>(null);

  // Build weekly buckets with sortKey AND keep mapping week→sessions for drilldown
  const { rows, weekToSessions } = React.useMemo(() => {
    const wk2sessions = new Map<string, Sesion[]>();
    if (sessions) {
      const buckets = new Map<string, { date: string; sessions: number; sortKey: number; key: string }>();
      sessions.forEach((s) => {
        const ref = s.scheduled_at || s.created_at;
        if (!ref) return;
        const wk = isoWeekStart(new Date(ref));
        const key = wk.toISOString();
        const label = formatWeekLabel(wk);
        const existing = buckets.get(key);
        if (existing) existing.sessions += 1;
        else buckets.set(key, { date: label, sessions: 1, sortKey: wk.getTime(), key });
        const arr = wk2sessions.get(key) ?? [];
        arr.push(s);
        wk2sessions.set(key, arr);
      });
      const r = Array.from(buckets.values())
        .sort((a, b) => a.sortKey - b.sortKey)
        .map(({ date, sessions, key }) => ({ date, sessions, key }));
      return { rows: r, weekToSessions: wk2sessions };
    }
    const r = (data || []).map((d) => ({ date: d.date, sessions: d.sessions, key: d.date }));
    return { rows: r, weekToSessions: wk2sessions };
  }, [sessions, data]);

  const total = rows.reduce((s, d) => s + d.sessions, 0);
  const last = rows[rows.length - 1];
  const isEmpty = rows.length === 0;

  const drilldownSessions = React.useMemo(() => {
    if (!sessions) return [];
    if (!selectedWeekKey) return sessions;
    return weekToSessions.get(selectedWeekKey) ?? [];
  }, [sessions, selectedWeekKey, weekToSessions]);

  const handleClick = (payload: any) => {
    if (!sessions) return;
    const key = payload?.activePayload?.[0]?.payload?.key;
    if (key) {
      setSelectedWeekKey(key);
      setDrilldownOpen(true);
    }
  };

  return (
    <>
      <AnalyticsBlock
        title="Evolución temporal de sesiones"
        takeaway={
          isEmpty
            ? "Aún no hay sesiones registradas en el período."
            : `${total} sesiones en el período. Última semana: ${last?.sessions ?? 0}.`
        }
        infoTooltip="Tendencia semanal del volumen de sesiones del Congreso registradas, calculada a partir de la fecha real de cada sesión."
        timeframe={timeframe}
        source={source}
        icon={<TrendingUp className="h-4 w-4 text-primary" />}
        isEmpty={isEmpty}
        onDrilldown={sessions ? () => { setSelectedWeekKey(null); setDrilldownOpen(true); } : undefined}
        renderDataTable={() => (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Período</TableHead>
                <TableHead className="text-right">Sesiones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((d) => (
                <TableRow
                  key={d.key}
                  className={sessions ? "cursor-pointer hover:bg-muted/50" : ""}
                  onClick={sessions ? () => { setSelectedWeekKey(d.key); setDrilldownOpen(true); } : undefined}
                >
                  <TableCell>{d.date}</TableCell>
                  <TableCell className="text-right font-medium">{d.sessions}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      >
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={rows} margin={{ top: 8, right: 16, left: 0, bottom: 8 }} onClick={handleClick}>
            <defs>
              <linearGradient id="sessionsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ANALYTICS_COLORS.legislationType.bills} stopOpacity={0.4} />
                <stop offset="100%" stopColor={ANALYTICS_COLORS.legislationType.bills} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="sessions"
              stroke={ANALYTICS_COLORS.legislationType.bills}
              strokeWidth={2}
              fill="url(#sessionsGradient)"
              cursor={sessions ? "pointer" : "default"}
            />
          </AreaChart>
        </ResponsiveContainer>
      </AnalyticsBlock>

      {sessions && (
        <SessionsDrilldownSheet
          open={drilldownOpen}
          onOpenChange={setDrilldownOpen}
          title={selectedWeekKey ? `Sesiones — semana del ${formatWeekLabel(new Date(selectedWeekKey))}` : "Todas las sesiones"}
          description={selectedWeekKey ? "Sesiones registradas en la semana seleccionada." : "Todas las sesiones del período."}
          sessions={drilldownSessions}
        />
      )}
    </>
  );
}
