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

const DEMO_DATA = [
  { type: "Presentación", value: 38 },
  { type: "Debate", value: 27 },
  { type: "Votación", value: 18 },
  { type: "Predictamen", value: 12 },
  { type: "Otros", value: 5 },
];

const COLORS = [
  ANALYTICS_COLORS.stages.comision,
  ANALYTICS_COLORS.stages.dictamen,
  ANALYTICS_COLORS.stages.pleno,
  ANALYTICS_COLORS.stages.tramite,
  ANALYTICS_COLORS.stages.archivado,
];

export function SessionAgendaTypeBlock({
  timeframe,
  source = "Orden del día - Sesiones",
  data = DEMO_DATA,
}: Props) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const top = [...data].sort((a, b) => b.value - a.value)[0];

  return (
    <AnalyticsBlock
      title="Distribución de ítems del orden del día"
      takeaway={top ? `${top.type} es la actuación más frecuente (${Math.round((top.value / total) * 100)}% de los ítems).` : "Sin datos."}
      infoTooltip="Distribución de ítems del orden del día de las sesiones por tipo de actuación parlamentaria (presentación, debate, votación, predictamen, etc.)."
      timeframe={timeframe}
      source={source}
      icon={<ListChecks className="h-4 w-4 text-primary" />}
      isEmpty={data.length === 0}
      renderDataTable={() => (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo de actuación</TableHead>
              <TableHead className="text-right">Ítems</TableHead>
              <TableHead className="text-right">%</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((d) => (
              <TableRow key={d.type}>
                <TableCell>{d.type}</TableCell>
                <TableCell className="text-right font-medium">{d.value}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {Math.round((d.value / total) * 100)}%
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
