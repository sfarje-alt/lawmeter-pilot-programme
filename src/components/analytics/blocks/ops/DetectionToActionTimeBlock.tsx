import * as React from "react";
import { AnalyticsBlock, ChartTooltip } from "../../shared";
import { ANALYTICS_COLORS } from "@/lib/analyticsColors";
import { Clock, Pin } from "lucide-react";
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
  { week: "Sem 1", openHrs: 5.2, pinHrs: 18.4 },
  { week: "Sem 2", openHrs: 4.1, pinHrs: 15.7 },
  { week: "Sem 3", openHrs: 3.8, pinHrs: 14.2 },
  { week: "Sem 4", openHrs: 3.2, pinHrs: 12.5 },
  { week: "Sem 5", openHrs: 2.9, pinHrs: 11.1 },
];

export function DetectionToActionTimeBlock({
  timeframe,
  source = "Tiempos editoriales internos",
}: Props) {
  const avgOpen = (DEMO.reduce((s, d) => s + d.openHrs, 0) / DEMO.length).toFixed(1);
  const avgPin = (DEMO.reduce((s, d) => s + d.pinHrs, 0) / DEMO.length).toFixed(1);

  return (
    <AnalyticsBlock
      title="Tiempo medio: detección → apertura / pin"
      takeaway={`Apertura promedio: ${avgOpen}h · Pin promedio: ${avgPin}h en el período.`}
      infoTooltip="Tiempo medio entre la detección de una alerta y su primera apertura, y entre la detección y su pineo para publicación."
      timeframe={timeframe}
      source={source}
      icon={<Clock className="h-4 w-4 text-primary" />}
      renderDataTable={() => (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Semana</TableHead>
              <TableHead className="text-right">Apertura (h)</TableHead>
              <TableHead className="text-right">Pin (h)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DEMO.map((d) => (
              <TableRow key={d.week}>
                <TableCell>{d.week}</TableCell>
                <TableCell className="text-right tabular-nums">{d.openHrs.toFixed(1)}</TableCell>
                <TableCell className="text-right tabular-nums">{d.pinHrs.toFixed(1)}</TableCell>
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
          <YAxis tick={{ fontSize: 11 }} unit="h" />
          <Tooltip content={<ChartTooltip />} />
          <Bar dataKey="openHrs" name="Apertura" fill={ANALYTICS_COLORS.legislationType.bills} radius={[4, 4, 0, 0]} />
          <Bar dataKey="pinHrs" name="Pin" fill={ANALYTICS_COLORS.legislationType.regulations} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </AnalyticsBlock>
  );
}
