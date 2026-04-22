import * as React from "react";
import { AnalyticsBlock, ChartTooltip, SessionsDrilldownSheet } from "../../shared";
import { ANALYTICS_COLORS } from "@/lib/analyticsColors";
import { Tags } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
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
  data?: { topic: string; mentions: number }[];
}

export function SessionTopicsBlock({
  timeframe,
  source = "Áreas de interés detectadas en sesiones",
  sessions,
  data,
}: Props) {
  const [drilldownOpen, setDrilldownOpen] = React.useState(false);
  const [selectedTopic, setSelectedTopic] = React.useState<string | null>(null);

  const sorted = React.useMemo(() => {
    if (sessions) {
      const map = new Map<string, number>();
      sessions.forEach((s) => {
        // Try area_de_interes first; fall back to commission_name so the
        // chart never silently disappears when sessions don't yet have AI tags.
        const tags = (s.area_de_interes && s.area_de_interes.length > 0)
          ? s.area_de_interes
          : [s.commission_name || "Sin clasificar"];
        tags.forEach((t) => {
          if (!t) return;
          map.set(t, (map.get(t) ?? 0) + 1);
        });
      });
      return Array.from(map.entries())
        .map(([topic, mentions]) => ({ topic, mentions }))
        .sort((a, b) => b.mentions - a.mentions);
    }
    return [...(data || [])].sort((a, b) => b.mentions - a.mentions);
  }, [sessions, data]);

  const top = sorted[0];
  const isEmpty = sorted.length === 0;

  const drilldownSessions = React.useMemo(() => {
    if (!sessions || !selectedTopic) return sessions || [];
    return sessions.filter((s) => {
      const tags = (s.area_de_interes && s.area_de_interes.length > 0)
        ? s.area_de_interes
        : [s.commission_name || "Sin clasificar"];
      return tags.includes(selectedTopic);
    });
  }, [sessions, selectedTopic]);

  const handleBarClick = (payload: any) => {
    if (!sessions) return;
    const topic = payload?.activePayload?.[0]?.payload?.topic;
    if (topic) {
      setSelectedTopic(topic);
      setDrilldownOpen(true);
    }
  };

  return (
    <>
      <AnalyticsBlock
        title="Áreas de interés más frecuentes en sesiones"
        takeaway={
          isEmpty
            ? "Aún no hay materias temáticas registradas en sesiones del período."
            : top
            ? `${top.topic} lidera con ${top.mentions} mención(es) en sesiones del período.`
            : "Sin datos."
        }
        infoTooltip="Áreas de interés que más aparecen en las sesiones reales del período. Si la IA aún no clasificó la sesión, se usa la comisión como categoría temporal."
        timeframe={timeframe}
        source={source}
        icon={<Tags className="h-4 w-4 text-primary" />}
        isEmpty={isEmpty}
        onDrilldown={sessions ? () => { setSelectedTopic(null); setDrilldownOpen(true); } : undefined}
        renderDataTable={() => (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Área</TableHead>
                <TableHead className="text-right">Menciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((d) => (
                <TableRow
                  key={d.topic}
                  className={sessions ? "cursor-pointer hover:bg-muted/50" : ""}
                  onClick={sessions ? () => { setSelectedTopic(d.topic); setDrilldownOpen(true); } : undefined}
                >
                  <TableCell>{d.topic}</TableCell>
                  <TableCell className="text-right font-medium">{d.mentions}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      >
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={sorted}
            layout="vertical"
            margin={{ top: 8, right: 16, left: 24, bottom: 8 }}
            onClick={handleBarClick}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
            <YAxis type="category" dataKey="topic" tick={{ fontSize: 11 }} width={120} />
            <Tooltip content={<ChartTooltip />} />
            <Bar
              dataKey="mentions"
              fill={ANALYTICS_COLORS.legislationType.regulations}
              radius={[0, 4, 4, 0]}
              cursor={sessions ? "pointer" : "default"}
            />
          </BarChart>
        </ResponsiveContainer>
      </AnalyticsBlock>

      {sessions && (
        <SessionsDrilldownSheet
          open={drilldownOpen}
          onOpenChange={setDrilldownOpen}
          title={selectedTopic ? `Sesiones — ${selectedTopic}` : "Todas las sesiones"}
          description={selectedTopic ? `Sesiones relacionadas con "${selectedTopic}".` : `Todas las sesiones del período.`}
          sessions={drilldownSessions}
        />
      )}
    </>
  );
}
