import * as React from "react";
import { AnalyticsBlock, ChartTooltip } from "../../shared";
import { ANALYTICS_COLORS } from "@/lib/analyticsColors";
import { Clock } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

interface Props {
  timeframe: string;
  source?: string;
  /** Pre-computed real data: weekly avg hours from creation to first open / pin. */
  data?: { week: string; openHrs: number; pinHrs: number }[];
}

export function DetectionToActionTimeBlock({
  timeframe,
  source = "Tiempos editoriales internos",
  data = [],
}: Props) {
  const isEmpty = data.length === 0;
  const avgOpen = isEmpty
    ? "0"
    : (data.reduce((s, d) => s + d.openHrs, 0) / data.length).toFixed(1);
  const avgPin = isEmpty
    ? "0"
    : (data.reduce((s, d) => s + d.pinHrs, 0) / data.length).toFixed(1);

  return (
    <AnalyticsBlock
      title="Tiempo medio: detección → apertura / pin"
      takeaway={
        isEmpty
          ? "Aún no hay actividad editorial suficiente para calcular tiempos."
          : `Apertura promedio: ${avgOpen}h · Pin promedio: ${avgPin}h en el período.`
      }
      infoTooltip="Tiempo medio entre la detección de una alerta y su primera apertura, y entre la detección y su pineo para publicación. Calculado sobre la actividad real."
      timeframe={timeframe}
      source={source}
      icon={<Clock className="h-4 w-4 text-primary" />}
      isEmpty={isEmpty}
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
            {data.map((d) => (
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
        <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
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
