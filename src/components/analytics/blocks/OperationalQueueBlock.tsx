import * as React from "react";
import { AnalyticsBlock } from "../shared/AnalyticsBlock";
import { ANALYTICS_COLORS, getStageColor } from "@/lib/analyticsColors";
import { ListTodo, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { OperationalQueueMetrics } from "@/types/analytics";

interface OperationalQueueBlockProps {
  data: OperationalQueueMetrics;
  timeframe: string;
  source?: string;
  onDrilldown?: () => void;
}

/**
 * Operational Queue Block - KPIs + stage breakdown for work queue
 * Internal-only analytics block for Legal Team
 */
export function OperationalQueueBlock({
  data,
  timeframe,
  source = "Cola de trabajo",
  onDrilldown,
}: OperationalQueueBlockProps) {
  const isEmpty = data.totalInQueue === 0;

  const highPriorityCount = data.byPriority.find(p => p.priority === 'Alta')?.count || 0;
  const takeaway = isEmpty 
    ? "No hay items en la cola de trabajo"
    : highPriorityCount > 0
    ? `${data.totalInQueue} items en cola, ${highPriorityCount} de alta prioridad`
    : `${data.totalInQueue} items en cola, ninguno de alta prioridad`;

  return (
    <AnalyticsBlock
      title="Cola Operativa"
      takeaway={takeaway}
      infoTooltip="Items pendientes de revisión y publicación, agrupados por etapa y prioridad. Tiempo promedio en cada etapa."
      timeframe={timeframe}
      source={source}
      onDrilldown={onDrilldown}
      isEmpty={isEmpty}
      icon={<ListTodo className="h-4 w-4 text-primary" />}
    >
      <div className="space-y-4">
        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-2">
          <KPICard
            label="Pendiente Revisión"
            value={data.pendingReview}
            icon={Clock}
            variant="warning"
          />
          <KPICard
            label="Pendiente Publicar"
            value={data.pendingPublish}
            icon={CheckCircle}
            variant="info"
          />
          <KPICard
            label="Alta Prioridad"
            value={highPriorityCount}
            icon={AlertTriangle}
            variant="danger"
          />
        </div>

        {/* By Stage */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground">Por Etapa</h4>
          <div className="space-y-1.5">
            {data.byStage.slice(0, 5).map(item => (
              <div 
                key={item.stage}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getStageColor(item.stage) }}
                  />
                  <span className="text-foreground truncate max-w-[120px]">
                    {formatStageName(item.stage)}
                  </span>
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

        {/* By Priority */}
        <div className="flex gap-2 justify-center">
          {data.byPriority.map(item => (
            <Badge
              key={item.priority}
              variant="outline"
              className="text-xs"
              style={{
                borderColor: getPriorityColor(item.priority),
                color: getPriorityColor(item.priority),
              }}
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
  label,
  value,
  icon: Icon,
  variant,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  variant: 'warning' | 'info' | 'danger';
}) {
  const colors = {
    warning: 'hsl(40, 75%, 50%)',
    info: 'hsl(200, 70%, 50%)',
    danger: 'hsl(0, 65%, 50%)',
  };
  
  return (
    <div className="text-center p-2 rounded-lg bg-muted/30">
      <Icon 
        className="h-4 w-4 mx-auto mb-1" 
        style={{ color: colors[variant] }}
      />
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
