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

const DEMO_DATA = [
  { topic: "Defensa nacional", mentions: 22 },
  { topic: "Economía", mentions: 31 },
  { topic: "Educación", mentions: 18 },
  { topic: "Salud", mentions: 27 },
  { topic: "Trabajo", mentions: 14 },
  { topic: "Justicia", mentions: 11 },
  { topic: "Medio ambiente", mentions: 9 },
];

export function SessionTopicsBlock({
  timeframe,
  source = "Materias temáticas detectadas",
  data = DEMO_DATA,
}: Props) {
  const sorted = [...data].sort((a, b) => b.mentions - a.mentions);
  const top = sorted[0];

  return (
    <AnalyticsBlock
      title="Materias temáticas más frecuentes en sesiones"
      takeaway={top ? `${top.topic} lidera con ${top.mentions} menciones en sesiones del período.` : "Sin datos."}
      infoTooltip="Materias temáticas más mencionadas en las sesiones (defensa, economía, educación, salud, etc.)."
      timeframe={timeframe}
      source={source}
      icon={<Tags className="h-4 w-4 text-primary" />}
      isEmpty={data.length === 0}
      renderDataTable={() => (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Materia</TableHead>
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
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="topic" tick={{ fontSize: 11 }} width={120} />
          <Tooltip content={<ChartTooltip />} />
          <Bar dataKey="mentions" fill={ANALYTICS_COLORS.legislationType.regulations} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </AnalyticsBlock>
  );
}
