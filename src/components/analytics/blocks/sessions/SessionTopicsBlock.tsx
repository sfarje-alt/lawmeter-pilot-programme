import * as React from "react";
import { AnalyticsBlock, ChartTooltip } from "../../shared";
import { ANALYTICS_COLORS } from "@/lib/analyticsColors";
import { Tags } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

interface Props {
  timeframe: string;
  source?: string;
  data?: { topic: string; mentions: number }[];
}

export function SessionTopicsBlock({
  timeframe,
  source = "Áreas de interés detectadas en sesiones",
  data = [],
}: Props) {
  const sorted = React.useMemo(
    () => [...data].sort((a, b) => b.mentions - a.mentions),
    [data]
  );
  const top = sorted[0];
  const isEmpty = sorted.length === 0;

  return (
    <AnalyticsBlock
      title="Áreas de interés más frecuentes en sesiones"
      takeaway={
        isEmpty
          ? "Aún no hay materias temáticas registradas en sesiones del período."
          : top
          ? `${top.topic} lidera con ${top.mentions} menciones en sesiones del período.`
          : "Sin datos."
      }
      infoTooltip="Áreas de interés que más aparecen en las sesiones reales del período, calculadas a partir de las áreas asignadas a cada sesión."
      timeframe={timeframe}
      source={source}
      icon={<Tags className="h-4 w-4 text-primary" />}
      isEmpty={isEmpty}
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
              <TableRow key={d.topic}>
                <TableCell>{d.topic}</TableCell>
                <TableCell className="text-right font-medium">{d.mentions}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    >
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={sorted} layout="vertical" margin={{ top: 8, right: 16, left: 24, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
          <YAxis type="category" dataKey="topic" tick={{ fontSize: 11 }} width={120} />
          <Tooltip content={<ChartTooltip />} />
          <Bar dataKey="mentions" fill={ANALYTICS_COLORS.legislationType.regulations} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </AnalyticsBlock>
  );
}
