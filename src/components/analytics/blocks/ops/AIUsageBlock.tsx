import * as React from "react";
import { AnalyticsBlock, ChartTooltip } from "../../shared";
import { ANALYTICS_COLORS } from "@/lib/analyticsColors";
import { Bot, FileAudio } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

interface Props {
  timeframe: string;
  source?: string;
}

const DEMO = [
  { week: "Sem 1", transcript: 6, chatbot: 9 },
  { week: "Sem 2", transcript: 8, chatbot: 12 },
  { week: "Sem 3", transcript: 11, chatbot: 14 },
  { week: "Sem 4", transcript: 9, chatbot: 17 },
  { week: "Sem 5", transcript: 13, chatbot: 21 },
];

export function AIUsageBlock({
  timeframe,
  source = "Uso de IA en alertas",
}: Props) {
  const totalT = DEMO.reduce((s, d) => s + d.transcript, 0);
  const totalC = DEMO.reduce((s, d) => s + d.chatbot, 0);

  return (
    <AnalyticsBlock
      title="Uso de IA: transcripción y chatbot"
      takeaway={`${totalT} alertas con transcripción solicitada · ${totalC} con chatbot habilitado.`}
      infoTooltip="Volumen de alertas que tuvieron transcripción solicitada y/o el chatbot habilitado, agrupado por semana."
      timeframe={timeframe}
      source={source}
      icon={<Bot className="h-4 w-4 text-primary" />}
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
            {DEMO.map((d) => (
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
        <BarChart data={DEMO} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis dataKey="week" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip content={<ChartTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="transcript" name="Transcripción" fill={ANALYTICS_COLORS.legislationType.bills} radius={[4, 4, 0, 0]} />
          <Bar dataKey="chatbot" name="Chatbot" fill={ANALYTICS_COLORS.legislationType.regulations} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </AnalyticsBlock>
  );
}
