import * as React from "react";
import { AnalyticsBlock, SessionsDrilldownSheet } from "../../shared";
import { FileText } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Sesion } from "@/hooks/useSesiones";

interface Props {
  timeframe: string;
  source?: string;
  /** Raw live sessions; preferred input. */
  sessions?: Sesion[];
  /** Legacy pre-computed data. */
  data?: { code: string; title: string; sessions: number }[];
}

export function SessionRecurringBillsBlock({
  timeframe,
  source = "Sesiones del Congreso",
  sessions,
  data,
}: Props) {
  const [drilldownOpen, setDrilldownOpen] = React.useState(false);
  const [selectedCommission, setSelectedCommission] = React.useState<string | null>(null);

  const sorted = React.useMemo(() => {
    if (sessions) {
      const map = new Map<string, number>();
      sessions.forEach((s) => {
        const key = (s.commission_name || "Sin comisión").trim();
        map.set(key, (map.get(key) ?? 0) + 1);
      });
      return Array.from(map.entries())
        .map(([commission, count]) => ({
          code: commission.slice(0, 16).toUpperCase(),
          title: commission,
          sessions: count,
        }))
        .sort((a, b) => b.sessions - a.sessions)
        .slice(0, 10);
    }
    return [...(data || [])].sort((a, b) => b.sessions - a.sessions);
  }, [sessions, data]);

  const top = sorted[0];
  const isEmpty = sorted.length === 0;

  const drilldownSessions = React.useMemo(() => {
    if (!sessions || !selectedCommission) return sessions || [];
    return sessions.filter((s) => (s.commission_name || "Sin comisión").trim() === selectedCommission);
  }, [sessions, selectedCommission]);

  const Body = (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[140px]">Comisión</TableHead>
          <TableHead>Sesión</TableHead>
          <TableHead className="text-right w-[110px]">Apariciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((d) => (
          <TableRow
            key={`${d.code}-${d.title}`}
            className={sessions ? "cursor-pointer hover:bg-muted/50" : ""}
            onClick={sessions ? () => { setSelectedCommission(d.title); setDrilldownOpen(true); } : undefined}
          >
            <TableCell>
              <Badge variant="outline" className="font-mono text-[11px]">{d.code}</Badge>
            </TableCell>
            <TableCell className="text-sm">{d.title}</TableCell>
            <TableCell className="text-right font-medium">{d.sessions}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <>
      <AnalyticsBlock
        title="Comisiones más activas en sesiones"
        takeaway={
          isEmpty
            ? "Aún no hay sesiones registradas en el período."
            : top
            ? `${top.title} concentra ${top.sessions} sesión(es) en el período.`
            : "Sin datos."
        }
        infoTooltip="Ranking de comisiones / sesiones recurrentes en el período, calculado a partir de las sesiones reales registradas."
        timeframe={timeframe}
        source={source}
        icon={<FileText className="h-4 w-4 text-primary" />}
        isEmpty={isEmpty}
        onDrilldown={sessions ? () => { setSelectedCommission(null); setDrilldownOpen(true); } : undefined}
        renderDataTable={() => Body}
      >
        <div className="overflow-auto max-h-[260px]">{Body}</div>
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
