import * as React from "react";
import { AnalyticsBlock, ChartTooltip, SessionsDrilldownSheet } from "../../shared";
import { ANALYTICS_COLORS } from "@/lib/analyticsColors";
import { ListChecks } from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
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
  /** Legacy pre-computed data. */
  data?: { type: string; value: number }[];
}

const STATUS_LABELS: Record<string, string> = {
  NOT_REQUESTED: "Sin analizar",
  REQUESTED: "Solicitado",
  PROCESSING: "En proceso",
  COMPLETED: "Analizado",
  FAILED: "Falló",
};

const COLORS = [
  ANALYTICS_COLORS.stages.comision,
  ANALYTICS_COLORS.stages.dictamen,
  ANALYTICS_COLORS.stages.pleno,
  ANALYTICS_COLORS.stages.tramite,
  ANALYTICS_COLORS.stages.archivado,
];

export function SessionAgendaTypeBlock({
  timeframe,
  source = "Estado de análisis de sesiones",
  sessions,
  data,
}: Props) {
  const [drilldownOpen, setDrilldownOpen] = React.useState(false);
  const [selectedType, setSelectedType] = React.useState<string | null>(null);

  const derived = React.useMemo(() => {
    if (sessions) {
      const map = new Map<string, number>();
      sessions.forEach((s) => {
        const label = STATUS_LABELS[s.analysis_status] || "Sin analizar";
        map.set(label, (map.get(label) ?? 0) + 1);
      });
      return Array.from(map.entries()).map(([type, value]) => ({ type, value }));
    }
    return data || [];
  }, [sessions, data]);

  const total = derived.reduce((s, d) => s + d.value, 0);
  const top = [...derived].sort((a, b) => b.value - a.value)[0];
  const isEmpty = derived.length === 0 || total === 0;

  const drilldownSessions = React.useMemo(() => {
    if (!sessions || !selectedType) return sessions || [];
    return sessions.filter((s) => (STATUS_LABELS[s.analysis_status] || "Sin analizar") === selectedType);
  }, [sessions, selectedType]);

  const handleSliceClick = (entry: any) => {
    if (!sessions) return;
    const type = entry?.type;
    if (type) {
      setSelectedType(type);
      setDrilldownOpen(true);
    }
  };

  return (
    <>
      <AnalyticsBlock
        title="Distribución por estado de sesión"
        takeaway={
          isEmpty
            ? "Aún no hay sesiones registradas en el período."
            : top
            ? `${top.type} es el estado más frecuente (${Math.round((top.value / total) * 100)}% de las sesiones).`
            : "Sin datos."
        }
        infoTooltip="Distribución de las sesiones del período según su estado actual de análisis (sin analizar, en proceso, analizada, etc.)."
        timeframe={timeframe}
        source={source}
        icon={<ListChecks className="h-4 w-4 text-primary" />}
        isEmpty={isEmpty}
        onDrilldown={sessions ? () => { setSelectedType(null); setDrilldownOpen(true); } : undefined}
        renderDataTable={() => (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Sesiones</TableHead>
                <TableHead className="text-right">%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {derived.map((d) => (
                <TableRow
                  key={d.type}
                  className={sessions ? "cursor-pointer hover:bg-muted/50" : ""}
                  onClick={sessions ? () => { setSelectedType(d.type); setDrilldownOpen(true); } : undefined}
                >
                  <TableCell>{d.type}</TableCell>
                  <TableCell className="text-right font-medium">{d.value}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {total > 0 ? Math.round((d.value / total) * 100) : 0}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      >
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={derived}
              dataKey="value"
              nameKey="type"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={2}
              onClick={handleSliceClick}
              cursor={sessions ? "pointer" : "default"}
            >
              {derived.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
      </AnalyticsBlock>

      {sessions && (
        <SessionsDrilldownSheet
          open={drilldownOpen}
          onOpenChange={setDrilldownOpen}
          title={selectedType ? `Sesiones — ${selectedType}` : "Todas las sesiones"}
          description={selectedType ? `Sesiones con estado "${selectedType}".` : `Todas las sesiones del período.`}
          sessions={drilldownSessions}
        />
      )}
    </>
  );
}
