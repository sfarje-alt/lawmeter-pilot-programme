import * as React from "react";
import { AnalyticsBlock } from "../../shared";
import { FileText } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Props {
  timeframe: string;
  source?: string;
  data?: { code: string; title: string; sessions: number }[];
}

const DEMO_DATA = [
  { code: "PL 1245/2024-CR", title: "Modificación de la Ley General de Salud", sessions: 8 },
  { code: "PL 0987/2024-CR", title: "Reforma del régimen laboral juvenil", sessions: 6 },
  { code: "PL 1502/2024-CR", title: "Ley de transparencia en compras públicas", sessions: 5 },
  { code: "PL 0721/2024-CR", title: "Modificación al Código Tributario", sessions: 4 },
  { code: "PL 1890/2024-CR", title: "Promoción de energías renovables", sessions: 4 },
  { code: "PL 1102/2024-CR", title: "Régimen especial de inversiones", sessions: 3 },
];

export function SessionRecurringBillsBlock({
  timeframe,
  source = "Sesiones del Congreso",
  data = DEMO_DATA,
}: Props) {
  const sorted = [...data].sort((a, b) => b.sessions - a.sessions);
  const top = sorted[0];

  const Body = (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[140px]">Proyecto</TableHead>
          <TableHead>Título</TableHead>
          <TableHead className="text-right w-[110px]">Sesiones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((d) => (
          <TableRow key={d.code}>
            <TableCell>
              <Badge variant="outline" className="font-mono text-[11px]">{d.code}</Badge>
            </TableCell>
            <TableCell className="text-sm">{d.title}</TableCell>
            <TableCell className="text-right font-medium">{d.sessions}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <AnalyticsBlock
      title="Proyectos de ley más recurrentes en sesiones"
      takeaway={top ? `${top.code} aparece en ${top.sessions} sesiones del período.` : "Sin datos."}
      infoTooltip="Ranking de proyectos de ley que más veces aparecen en el orden del día de las sesiones del período."
      timeframe={timeframe}
      source={source}
      icon={<FileText className="h-4 w-4 text-primary" />}
      isEmpty={data.length === 0}
      renderDataTable={() => Body}
    >
      <div className="overflow-auto max-h-[260px]">{Body}</div>
    </AnalyticsBlock>
  );
}
