import * as React from "react";
import { AnalyticsBlock } from "../shared/AnalyticsBlock";
import { getStageColor } from "@/lib/analyticsColors";
import { ListTodo, Clock, AlertTriangle, CheckCircle, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

const PRIORITY_FILTER_OPTIONS = [
  { value: 'all', label: 'Todas' },
  { value: 'Alta', label: 'Alta' },
  { value: 'Media', label: 'Media' },
  { value: 'Baja', label: 'Baja' },
];

export function OperationalQueueBlock({
  data,
  timeframe,
  source = "Cola de trabajo",
  onDrilldown,
}: OperationalQueueBlockProps) {
  const filterState = useBlockFilters('operational_queue', { search: '', status: 'all' });
  // Reuse `status` field as priority filter
  const priorityFilter = (filterState.filters.status as string) || 'all';

  const filteredByStage = React.useMemo(() => {
    const q = (filterState.filters.search || '').trim().toLowerCase();
    return data.byStage.filter(s => !q || s.stage.toLowerCase().includes(q));
  }, [data.byStage, filterState.filters.search]);

  const filteredByPriority = React.useMemo(() => {
    if (priorityFilter === 'all') return data.byPriority;
    return data.byPriority.filter(p => p.priority === priorityFilter);
  }, [data.byPriority, priorityFilter]);

  const visibleTotal = filteredByStage.reduce((s, x) => s + x.count, 0);
  const isEmpty = visibleTotal === 0;
  const highPriorityCount = filteredByPriority.find(p => p.priority === 'Alta')?.count || 0;

  const takeaway = isEmpty
    ? "No hay items en la cola que coincidan con los filtros"
    : highPriorityCount > 0
    ? `${visibleTotal} items en cola, ${highPriorityCount} de alta prioridad`
    : `${visibleTotal} items en cola, ninguno de alta prioridad`;

  return (
    <AnalyticsBlock
      title="Cola Operativa"
      takeaway={takeaway}
      infoTooltip="Items pendientes de revisión y publicación, agrupados por etapa y prioridad. Tu configuración se guarda automáticamente."
      timeframe={timeframe}
      source={source}
      onDrilldown={onDrilldown}
      isEmpty={isEmpty}
      icon={<ListTodo className="h-4 w-4 text-primary" />}
      filterDimensions={['search']}
      filterState={filterState}
      renderExpanded={() => (
        <div className="space-y-5 overflow-auto">
          <div className="flex gap-1.5 flex-wrap">
            <span className="text-xs text-muted-foreground self-center mr-1">Prioridad:</span>
            {PRIORITY_FILTER_OPTIONS.map(opt => (
              <Badge
                key={opt.value}
                variant={priorityFilter === opt.value ? "default" : "outline"}
                className="cursor-pointer text-xs"
                onClick={() => filterState.setFilter('status', opt.value as any)}
              >
                {opt.label}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <KPICard label="Pendiente Revisión" value={data.pendingReview} icon={Clock} variant="warning" />
            <KPICard label="Pendiente Publicar" value={data.pendingPublish} icon={CheckCircle} variant="info" />
            <KPICard label="Alta Prioridad" value={highPriorityCount} icon={AlertTriangle} variant="danger" />
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Por Etapa</h4>
            <div className="space-y-2">
              {filteredByStage.map(item => (
                <div key={item.stage} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getStageColor(item.stage) }} />
                    <span className="text-sm font-medium">{formatStageName(item.stage)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="tabular-nums">{item.count} items</span>
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
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Por Etapa</h4>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Etapa</TableHead>
                    <TableHead className="text-right">Items</TableHead>
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
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Por Prioridad</h4>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Prioridad</TableHead>
                    <TableHead className="text-right">Items</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredByPriority.map(item => (
                    <TableRow key={item.priority}>
                      <TableCell className="font-medium" style={{ color: getPriorityColor(item.priority) }}>
                        {item.priority}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{item.count}</TableCell>
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
            {slowestStage && (
              <InsightCard
                icon={<Clock className="h-4 w-4" />}
                title="Etapa con mayor demora"
                body={`"${formatStageName(slowestStage.stage)}" acumula items por ~${slowestStage.avgDaysInStage} días en promedio.`}
              />
            )}
            {highPriorityCount > 0 && (
              <InsightCard
                icon={<AlertTriangle className="h-4 w-4" />}
                title="Atención prioritaria"
                body={`Hay ${highPriorityCount} item(s) de alta prioridad en cola. Considera atenderlos primero.`}
              />
            )}
            <p className="text-[11px] text-muted-foreground italic pt-2">
              Insights basados en la cola filtrada.
            </p>
          </div>
        );
      }}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <KPICard label="Pendiente Revisión" value={data.pendingReview} icon={Clock} variant="warning" />
          <KPICard label="Pendiente Publicar" value={data.pendingPublish} icon={CheckCircle} variant="info" />
          <KPICard label="Alta Prioridad" value={highPriorityCount} icon={AlertTriangle} variant="danger" />
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

        <div className="flex gap-2 justify-center">
          {filteredByPriority.map(item => (
            <Badge
              key={item.priority}
              variant="outline"
              className="text-xs"
              style={{ borderColor: getPriorityColor(item.priority), color: getPriorityColor(item.priority) }}
            >
              {item.priority}: {item.count}
            </Badge>
          ))}
        </div>
      </div>
    </AnalyticsBlock>
  );
}

function KPICard({
  label, value, icon: Icon, variant,
}: { label: string; value: number; icon: React.ElementType; variant: 'warning' | 'info' | 'danger' }) {
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

function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    'Alta': 'hsl(0, 65%, 50%)',
    'Media': 'hsl(40, 75%, 50%)',
    'Baja': 'hsl(200, 50%, 55%)',
  };
  return colors[priority] || 'hsl(0, 0%, 50%)';
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
