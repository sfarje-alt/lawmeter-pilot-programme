import * as React from "react";
import { AnalyticsBlock, ChartTooltip } from "../../shared";
import { ANALYTICS_COLORS } from "@/lib/analyticsColors";
import { Bot } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

interface Props {
  timeframe: string;
  source?: string;
  /** Pre-computed real data: weekly counts of AI usage. */
  data?: { week: string; transcript: number; chatbot: number }[];
}

export function AIUsageBlock({
  timeframe,
  source = "Uso de IA en sesiones",
  data = [],
}: Props) {
  const totalT = data.reduce((s, d) => s + d.transcript, 0);
  const totalC = data.reduce((s, d) => s + d.chatbot, 0);
  const isEmpty = data.length === 0 || (totalT === 0 && totalC === 0);

  return (
    <AnalyticsBlock
      title="Uso de IA: transcripción y chatbot"
      takeaway={
        isEmpty
          ? "Aún no se ha solicitado IA en el período."
          : `${totalT} sesiones con transcripción solicitada · ${totalC} con chatbot habilitado.`
      }
      infoTooltip="Volumen real de sesiones que tuvieron transcripción solicitada y/o el chatbot habilitado, agrupado por semana."
      timeframe={timeframe}
      source={source}
      icon={<Bot className="h-4 w-4 text-primary" />}
      isEmpty={isEmpty}
      renderDataTable={() => (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Semana</TableHead>
              <TableHead className="text-right">Transcripción</TableHead>
              <TableHead className="text-right">Chatbot</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((d) => (
              <TableRow key={d.week}>
                <TableCell>{d.week}</TableCell>
                <TableCell className="text-right tabular-nums">{d.transcript}</TableCell>
                <TableCell className="text-right tabular-nums">{d.chatbot}</TableCell>
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
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip content={<ChartTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="transcript" name="Transcripción" fill={ANALYTICS_COLORS.legislationType.bills} radius={[4, 4, 0, 0]} />
          <Bar dataKey="chatbot" name="Chatbot" fill={ANALYTICS_COLORS.legislationType.regulations} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </AnalyticsBlock>
  );
}
