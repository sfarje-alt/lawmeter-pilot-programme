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

export function SessionRecurringBillsBlock({
  timeframe,
  source = "Sesiones del Congreso",
  data = [],
}: Props) {
  const sorted = React.useMemo(
    () => [...data].sort((a, b) => b.sessions - a.sessions),
    [data]
  );
  const top = sorted[0];
  const isEmpty = sorted.length === 0;

  const Body = (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[140px]">Comisión</TableHead>
          <TableHead>Sesión</TableHead>
          <TableHead className="text-right w-[110px]">Apariciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((d) => (
          <TableRow key={`${d.code}-${d.title}`}>
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
      title="Comisiones más activas en sesiones"
      takeaway={
        isEmpty
          ? "Aún no hay sesiones registradas en el período."
          : top
          ? `${top.code} concentra ${top.sessions} sesión(es) en el período.`
          : "Sin datos."
      }
      infoTooltip="Ranking de comisiones / sesiones recurrentes en el período, calculado a partir de las sesiones reales registradas."
      timeframe={timeframe}
      source={source}
      icon={<FileText className="h-4 w-4 text-primary" />}
      isEmpty={isEmpty}
      renderDataTable={() => Body}
    >
      <div className="overflow-auto max-h-[260px]">{Body}</div>
    </AnalyticsBlock>
  );
}
