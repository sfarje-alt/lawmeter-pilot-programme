import * as React from "react";
import { AnalyticsBlock } from "../shared/AnalyticsBlock";
import { Pin, Archive, Sparkles } from "lucide-react";
import { useAlerts } from "@/contexts/AlertsContext";
import { useBlockFilters } from "@/hooks/useBlockFilters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PinnedArchivedBlockProps {
  timeframe: string;
  source?: string;
}

export function PinnedArchivedBlock({
  timeframe,
  source = "Alertas pinneadas y archivadas",
}: PinnedArchivedBlockProps) {
  const { alerts } = useAlerts();
  const filterState = useBlockFilters('pin_archive');

  const stats = React.useMemo(() => {
    const total = alerts.length;
    const archived = alerts.filter(a => !!a.archived_at).length;
    const active = total - archived;
    const pinned = alerts.filter(a => a.is_pinned_for_publication && !a.archived_at).length;
    const pinnedRate = active > 0 ? (pinned / active) * 100 : 0;
    const archivedRate = total > 0 ? (archived / total) * 100 : 0;
    return { total, active, pinned, archived, pinnedRate, archivedRate };
  }, [alerts]);

  const isEmpty = stats.total === 0;
  const takeaway = isEmpty
    ? "No hay alertas registradas"
    : `${stats.pinned} pinneadas (${stats.pinnedRate.toFixed(1)}% activas) · ${stats.archived} archivadas (${stats.archivedRate.toFixed(1)}% históricas)`;

  return (
    <AnalyticsBlock
      title="Pinneadas y Archivadas"
      takeaway={takeaway}
      infoTooltip="Total y porcentaje de alertas que el usuario ha pinneado (sobre el total activo) y archivado (sobre el total histórico). Los pins persisten entre sesiones."
      timeframe={timeframe}
      source={source}
      isEmpty={isEmpty}
      icon={<Pin className="h-4 w-4 text-primary" />}
      filterDimensions={[]}
      filterState={filterState}
      renderExpanded={() => (
        <div className="grid grid-cols-2 gap-4 p-4">
          <BigKPI
            icon={Pin}
            label="Pinneadas"
            value={stats.pinned}
            pct={stats.pinnedRate}
            denominator={stats.active}
            denominatorLabel="activas"
            tone="primary"
          />
          <BigKPI
            icon={Archive}
            label="Archivadas"
            value={stats.archived}
            pct={stats.archivedRate}
            denominator={stats.total}
            denominatorLabel="totales"
            tone="muted"
          />
        </div>
      )}
      renderDataTable={() => (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead className="text-right">Porcentaje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Pinneadas (sobre activas)</TableCell>
                <TableCell className="text-right tabular-nums">{stats.pinned}</TableCell>
                <TableCell className="text-right tabular-nums">{stats.pinnedRate.toFixed(1)}%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Archivadas (sobre total histórico)</TableCell>
                <TableCell className="text-right tabular-nums">{stats.archived}</TableCell>
                <TableCell className="text-right tabular-nums">{stats.archivedRate.toFixed(1)}%</TableCell>
              </TableRow>
              <TableRow className="bg-muted/30 font-semibold">
                <TableCell>Total alertas</TableCell>
                <TableCell className="text-right tabular-nums">{stats.total}</TableCell>
                <TableCell className="text-right tabular-nums">100%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
      renderInsights={() => (
        <div className="space-y-3">
          <InsightCard icon={<Pin className="h-4 w-4" />} title="Resumen" body={takeaway} />
          <InsightCard
            icon={<Sparkles className="h-4 w-4" />}
            title="Persistencia de pins"
            body="Las alertas pinneadas se mantienen entre refrescos y sesiones hasta que el usuario las quite manualmente."
          />
          <InsightCard
            icon={<Archive className="h-4 w-4" />}
            title="Limpieza"
            body={`${stats.archived} alertas archivadas representan trabajo cerrado o descartado. Quedan ${stats.active} alertas activas en flujo.`}
          />
        </div>
      )}
    >
      <div className="grid grid-cols-2 gap-3">
        <SmallKPI icon={Pin} label="Pinneadas" value={stats.pinned} pct={stats.pinnedRate} denominator={stats.active} denominatorLabel="activas" />
        <SmallKPI icon={Archive} label="Archivadas" value={stats.archived} pct={stats.archivedRate} denominator={stats.total} denominatorLabel="históricas" />
      </div>
    </AnalyticsBlock>
  );
}

function SmallKPI({
  icon: Icon, label, value, pct, denominator, denominatorLabel,
}: {
  icon: React.ElementType; label: string; value: number; pct: number; denominator: number; denominatorLabel: string;
}) {
  return (
    <div className="text-center p-3 rounded-lg bg-muted/30">
      <Icon className="h-4 w-4 mx-auto mb-1 text-primary" />
      <div className="text-2xl font-semibold text-foreground tabular-nums">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-[11px] text-muted-foreground/80 mt-1 tabular-nums">
        {pct.toFixed(1)}% de {denominator} {denominatorLabel}
      </div>
    </div>
  );
}

function BigKPI({
  icon: Icon, label, value, pct, denominator, denominatorLabel, tone,
}: {
  icon: React.ElementType; label: string; value: number; pct: number; denominator: number; denominatorLabel: string; tone: 'primary' | 'muted';
}) {
  return (
    <div className={`text-center p-6 rounded-lg ${tone === 'primary' ? 'bg-primary/10' : 'bg-muted/40'}`}>
      <Icon className={`h-8 w-8 mx-auto mb-2 ${tone === 'primary' ? 'text-primary' : 'text-muted-foreground'}`} />
      <div className="text-4xl font-bold text-foreground tabular-nums">{value}</div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
      <div className="text-xs text-muted-foreground/80 mt-2 tabular-nums">
        {pct.toFixed(1)}% de {denominator} {denominatorLabel}
      </div>
    </div>
  );
}

function InsightCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex gap-3 p-3 rounded-lg border border-border/60 bg-muted/20">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{body}</p>
      </div>
    </div>
  );
}
