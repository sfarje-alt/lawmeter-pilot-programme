import * as React from "react";
import { AnalyticsBlock, ChartTooltip } from "../../shared";
import { ANALYTICS_COLORS } from "@/lib/analyticsColors";
import { ListChecks } from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
} from "recharts";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

interface Props {
  timeframe: string;
  source?: string;
  data?: { type: string; value: number }[];
}

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
  data = [],
}: Props) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const top = [...data].sort((a, b) => b.value - a.value)[0];
  const isEmpty = data.length === 0 || total === 0;

  return (
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
            {data.map((d) => (
              <TableRow key={d.type}>
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
            data={data}
            dataKey="value"
            nameKey="type"
            innerRadius={50}
            outerRadius={90}
            paddingAngle={2}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </AnalyticsBlock>
  );
}
