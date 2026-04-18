import * as React from "react";
import { AnalyticsBlock } from "../shared/AnalyticsBlock";
import { getStageColor } from "@/lib/analyticsColors";
import { ListTodo, Inbox, MessageSquareOff, TagIcon, Sparkles } from "lucide-react";
import type { OperationalQueueMetrics } from "@/types/analytics";
import { useBlockFilters } from "@/hooks/useBlockFilters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface OperationalQueueBlockProps {
  data: OperationalQueueMetrics;
  timeframe: string;
  source?: string;
  onDrilldown?: () => void;
}

export function OperationalQueueBlock({
  data,
  timeframe,
  source = "Alertas activas",
  onDrilldown,
}: OperationalQueueBlockProps) {
  const filterState = useBlockFilters('operational_queue', { search: '' });

  const filteredByStage = React.useMemo(() => {
    const q = (filterState.filters.search || '').trim().toLowerCase();
    return data.byStage.filter(s => !q || s.stage.toLowerCase().includes(q));
  }, [data.byStage, filterState.filters.search]);

  const totalPending = data.unread + data.withoutCommentary + data.withoutTags;
  const isEmpty = data.totalActive === 0;

  const pctUnread = data.totalActive ? Math.round((data.unread / data.totalActive) * 100) : 0;
  const pctNoComment = data.totalActive ? Math.round((data.withoutCommentary / data.totalActive) * 100) : 0;
  const pctNoTags = data.totalActive ? Math.round((data.withoutTags / data.totalActive) * 100) : 0;

  const takeaway = isEmpty
    ? "No hay alertas activas"
    : `${data.unread} sin abrir, ${data.withoutCommentary} sin comentario, ${data.withoutTags} sin clasificar`;

  return (
    <AnalyticsBlock
      title="Cola de Revisión Pendiente"
      takeaway={takeaway}
      infoTooltip="Alertas activas que requieren acción del equipo: sin abrir, sin comentario experto o sin etiquetas. Tu configuración se guarda automáticamente."
      timeframe={timeframe}
      source={source}
      onDrilldown={onDrilldown}
      isEmpty={isEmpty}
      icon={<ListTodo className="h-4 w-4 text-primary" />}
      filterDimensions={['search']}
      filterState={filterState}
      renderExpanded={() => (
        <div className="space-y-5 overflow-auto">
          <div className="grid grid-cols-3 gap-3">
            <KPICard label="Sin abrir" value={data.unread} pct={pctUnread} icon={Inbox} variant="warning" />
            <KPICard label="Sin comentario" value={data.withoutCommentary} pct={pctNoComment} icon={MessageSquareOff} variant="info" />
            <KPICard label="Sin clasificar" value={data.withoutTags} pct={pctNoTags} icon={TagIcon} variant="danger" />
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Por Etapa Legislativa</h4>
            <div className="space-y-2">
              {filteredByStage.map(item => (
                <div key={item.stage} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getStageColor(item.stage) }} />
                    <span className="text-sm font-medium">{formatStageName(item.stage)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="tabular-nums">{item.count} alertas</span>
                    <span>•</span>
                    <span className="tabular-nums">~{item.avgDaysInStage}d en etapa</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      renderDataTable={() => (
        <div className="space-y-4">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead className="text-right">% del total activo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Sin abrir</TableCell>
                  <TableCell className="text-right tabular-nums">{data.unread}</TableCell>
                  <TableCell className="text-right tabular-nums">{pctUnread}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Sin comentario experto</TableCell>
                  <TableCell className="text-right tabular-nums">{data.withoutCommentary}</TableCell>
                  <TableCell className="text-right tabular-nums">{pctNoComment}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Sin etiquetas</TableCell>
                  <TableCell className="text-right tabular-nums">{data.withoutTags}</TableCell>
                  <TableCell className="text-right tabular-nums">{pctNoTags}%</TableCell>
                </TableRow>
                <TableRow className="bg-muted/30 font-semibold">
                  <TableCell>Total alertas activas</TableCell>
                  <TableCell className="text-right tabular-nums">{data.totalActive}</TableCell>
                  <TableCell className="text-right tabular-nums">100%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Por Etapa</h4>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Etapa</TableHead>
                    <TableHead className="text-right">Alertas</TableHead>
                    <TableHead className="text-right">Días promedio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredByStage.map(item => (
                    <TableRow key={item.stage}>
                      <TableCell className="font-medium">{formatStageName(item.stage)}</TableCell>
                      <TableCell className="text-right tabular-nums">{item.count}</TableCell>
                      <TableCell className="text-right tabular-nums">{item.avgDaysInStage}d</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}
      renderInsights={() => {
        const slowestStage = [...data.byStage].sort((a, b) => b.avgDaysInStage - a.avgDaysInStage)[0];
        return (
          <div className="space-y-3">
            <InsightCard icon={<ListTodo className="h-4 w-4" />} title="Resumen" body={takeaway} />
            <InsightCard
              icon={<Sparkles className="h-4 w-4" />}
              title="Trabajo pendiente total"
              body={`${totalPending} acción(es) por completar entre apertura, comentario y clasificación de alertas activas.`}
            />
            {slowestStage && (
              <InsightCard
                icon={<Inbox className="h-4 w-4" />}
                title="Etapa con mayor demora"
                body={`"${formatStageName(slowestStage.stage)}" acumula alertas por ~${slowestStage.avgDaysInStage} días en promedio.`}
              />
            )}
            <p className="text-[11px] text-muted-foreground italic pt-2">
              Insights basados en alertas activas no archivadas.
            </p>
          </div>
        );
      }}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <KPICard label="Sin abrir" value={data.unread} pct={pctUnread} icon={Inbox} variant="warning" />
          <KPICard label="Sin comentario" value={data.withoutCommentary} pct={pctNoComment} icon={MessageSquareOff} variant="info" />
          <KPICard label="Sin clasificar" value={data.withoutTags} pct={pctNoTags} icon={TagIcon} variant="danger" />
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground">Por Etapa</h4>
          <div className="space-y-1.5">
            {filteredByStage.slice(0, 5).map(item => (
              <div key={item.stage} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getStageColor(item.stage) }} />
                  <span className="text-foreground truncate max-w-[120px]">{formatStageName(item.stage)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{item.count}</span>
                  <span className="text-muted-foreground/50">•</span>
                  <span>~{item.avgDaysInStage}d</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnalyticsBlock>
  );
}

function KPICard({
  label, value, pct, icon: Icon, variant,
}: { label: string; value: number; pct: number; icon: React.ElementType; variant: 'warning' | 'info' | 'danger' }) {
  const colors = {
    warning: 'hsl(40, 75%, 50%)',
    info: 'hsl(200, 70%, 50%)',
    danger: 'hsl(0, 65%, 50%)',
  };
  return (
    <div className="text-center p-2 rounded-lg bg-muted/30">
      <Icon className="h-4 w-4 mx-auto mb-1" style={{ color: colors[variant] }} />
      <div className="text-lg font-semibold text-foreground">{value}</div>
      <div className="text-[10px] text-muted-foreground leading-tight">{label}</div>
      <div className="text-[10px] text-muted-foreground/70 tabular-nums">{pct}%</div>
    </div>
  );
}

function formatStageName(stage: string): string {
  const nameMap: Record<string, string> = {
    'EN COMISIÓN': 'Comisión',
    'DICTAMEN': 'Dictamen',
    'EN AGENDA DEL PLENO': 'Agenda Pleno',
    'Sin Estado': 'Sin Estado',
  };
  return nameMap[stage] || stage.charAt(0) + stage.slice(1).toLowerCase();
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
