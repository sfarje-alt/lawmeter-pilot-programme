import * as React from "react";
import { AnalyticsBlock, ChartTooltip } from "../shared";
import { ANALYTICS_COLORS } from "@/lib/analyticsColors";
import { Eye } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

interface Props {
  timeframe: string;
  source?: string;
}

const DEMO = [
  { week: "Sem 1", reviewed: 28 },
  { week: "Sem 2", reviewed: 34 },
  { week: "Sem 3", reviewed: 31 },
  { week: "Sem 4", reviewed: 41 },
  { week: "Sem 5", reviewed: 47 },
];

export function ReviewedAlertsBlock({
  timeframe,
  source = "Actividad editorial",
}: Props) {
  const total = DEMO.reduce((s, d) => s + d.reviewed, 0);
  const avg = (total / DEMO.length).toFixed(0);

  return (
    <AnalyticsBlock
      title="Alertas revisadas por período"
      takeaway={`${total} alertas revisadas en el período (promedio ${avg}/semana).`}
      infoTooltip="Conteo semanal de alertas que el equipo abrió y revisó al menos una vez."
      timeframe={timeframe}
      source={source}
      icon={<Eye className="h-4 w-4 text-primary" />}
      renderDataTable={() => (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Semana</TableHead>
              <TableHead className="text-right">Revisadas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DEMO.map((d) => (
              <TableRow key={d.week}>
                <TableCell>{d.week}</TableCell>
                <TableCell className="text-right tabular-nums">{d.reviewed}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    >
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={DEMO} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis dataKey="week" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip content={<ChartTooltip />} />
          <Bar dataKey="reviewed" fill={ANALYTICS_COLORS.legislationType.bills} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </AnalyticsBlock>
  );
}
