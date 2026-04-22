import * as React from "react";
import { AnalyticsBlock, ChartTooltip, SessionsDrilldownSheet } from "../../shared";
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
import type { Sesion } from "@/hooks/useSesiones";

interface SessionsByCommissionBlockProps {
  timeframe: string;
  source?: string;
  /** Raw live sessions; preferred input. */
  sessions?: Sesion[];
  /** Legacy pre-computed data (used only if `sessions` not provided). */
  data?: { commission: string; sessions: number }[];
}

export function SessionsByCommissionBlock({
  timeframe,
  source = "Sesiones del Congreso",
  sessions,
  data,
}: SessionsByCommissionBlockProps) {
  const [drilldownOpen, setDrilldownOpen] = React.useState(false);
  const [selectedCommission, setSelectedCommission] = React.useState<string | null>(null);

  // Derive commission breakdown from real sessions when available
  const sorted = React.useMemo(() => {
    if (sessions) {
      const map = new Map<string, number>();
      sessions.forEach((s) => {
        const key = (s.commission_name || "Sin comisión").trim();
        map.set(key, (map.get(key) ?? 0) + 1);
      });
      return Array.from(map.entries())
        .map(([commission, count]) => ({ commission, sessions: count }))
        .sort((a, b) => b.sessions - a.sessions);
    }
    return [...(data || [])].sort((a, b) => b.sessions - a.sessions);
  }, [sessions, data]);

  const total = sorted.reduce((s, d) => s + d.sessions, 0);
  const top = sorted[0];
  const isEmpty = sorted.length === 0;

  const drilldownSessions = React.useMemo(() => {
    if (!sessions || !selectedCommission) return sessions || [];
    return sessions.filter((s) => (s.commission_name || "Sin comisión").trim() === selectedCommission);
  }, [sessions, selectedCommission]);

  const handleBarClick = (payload: any) => {
    if (!sessions) return;
    const commission = payload?.activePayload?.[0]?.payload?.commission;
    if (commission) {
      setSelectedCommission(commission);
      setDrilldownOpen(true);
    }
  };

  return (
    <>
      <AnalyticsBlock
        title="Alertas de sesiones por comisión"
        takeaway={
          isEmpty
            ? "Aún no hay sesiones registradas en el período."
            : top
            ? `${top.commission} concentra ${top.sessions} sesión(es) (${Math.round((top.sessions / total) * 100)}%) en el período.`
            : "Sin datos."
        }
        infoTooltip="Volumen de sesiones del Congreso agrupadas por la comisión parlamentaria que las convoca, calculado a partir de las sesiones reales del período."
        timeframe={timeframe}
        source={source}
        icon={<Building2 className="h-4 w-4 text-primary" />}
        isEmpty={isEmpty}
        onDrilldown={sessions ? () => { setSelectedCommission(null); setDrilldownOpen(true); } : undefined}
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
                <TableRow
                  key={d.commission}
                  className={sessions ? "cursor-pointer hover:bg-muted/50" : ""}
                  onClick={sessions ? () => { setSelectedCommission(d.commission); setDrilldownOpen(true); } : undefined}
                >
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
          <BarChart
            data={sorted}
            margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
            onClick={handleBarClick}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="commission" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip content={<ChartTooltip />} />
            <Bar
              dataKey="sessions"
              fill={ANALYTICS_COLORS.legislationType.bills}
              radius={[4, 4, 0, 0]}
              cursor={sessions ? "pointer" : "default"}
            />
          </BarChart>
        </ResponsiveContainer>
      </AnalyticsBlock>

      {sessions && (
        <SessionsDrilldownSheet
          open={drilldownOpen}
          onOpenChange={setDrilldownOpen}
          title={selectedCommission ? `Sesiones — ${selectedCommission}` : "Todas las sesiones"}
          description={selectedCommission ? `Sesiones registradas en la comisión seleccionada.` : `Todas las sesiones del período.`}
          sessions={drilldownSessions}
        />
      )}
    </>
  );
}
