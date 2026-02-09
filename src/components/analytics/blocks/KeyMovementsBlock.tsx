import * as React from "react";
import { AnalyticsBlock } from "../shared/AnalyticsBlock";
import { Sparkles, ArrowRight, Clock, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DEMO_KEY_MOVEMENTS } from "@/lib/analyticsMockData";

interface KeyMovementsBlockProps {
  timeframe: string;
  source?: string;
  demoData?: typeof DEMO_KEY_MOVEMENTS;
}

const TYPE_CONFIG = {
  new: { icon: Plus, label: "Nuevo", color: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" },
  progress: { icon: ArrowRight, label: "Avance", color: "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30" },
  deadline: { icon: Clock, label: "Plazo", color: "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30" },
};

export function KeyMovementsBlock({
  timeframe,
  source = "Alertas publicadas",
  demoData = DEMO_KEY_MOVEMENTS,
}: KeyMovementsBlockProps) {
  const data = demoData;
  const isEmpty = data.items.length === 0;

  const takeaway = isEmpty
    ? "No hay movimientos recientes en el período"
    : `${data.newItems} nuevos items, ${data.stageChanges} cambios de etapa, ${data.upcomingDeadlines} plazos próximos`;

  return (
    <AnalyticsBlock
      title="Movimientos Clave"
      takeaway={takeaway}
      infoTooltip="Resumen de actividad reciente: nuevas alertas publicadas, cambios de estado legislativo y plazos de cumplimiento próximos."
      timeframe={timeframe}
      source={source}
      isEmpty={isEmpty}
      icon={<Sparkles className="h-4 w-4 text-primary" />}
    >
      <div className="space-y-3">
        {/* Summary badges */}
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
            <Plus className="h-3 w-3 mr-1" /> {data.newItems} nuevos
          </Badge>
          <Badge variant="outline" className="text-xs bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400">
            <ArrowRight className="h-3 w-3 mr-1" /> {data.stageChanges} avances
          </Badge>
          <Badge variant="outline" className="text-xs bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400">
            <Clock className="h-3 w-3 mr-1" /> {data.upcomingDeadlines} plazos
          </Badge>
        </div>

        {/* Timeline items */}
        <div className="space-y-2">
          {data.items.map((item) => {
            const config = TYPE_CONFIG[item.type];
            const Icon = config.icon;
            return (
              <div
                key={item.id}
                className="flex items-start gap-3 p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className={cn("p-1.5 rounded-md flex-shrink-0 border", config.color)}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                  {'detail' in item && (
                    <p className="text-xs text-muted-foreground mt-0.5">{(item as any).detail}</p>
                  )}
                  <p className="text-xs text-muted-foreground/70 mt-0.5">
                    {formatDate(item.date)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AnalyticsBlock>
  );
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}
