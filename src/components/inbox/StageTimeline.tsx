import { cn } from "@/lib/utils";
import { Check, Clock, Circle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export interface StageHistoryItem {
  stage: string;
  date: string;
  description?: string;
  completed: boolean;
}

interface StageTimelineProps {
  stages: StageHistoryItem[];
  currentStage?: string;
}

export function StageTimeline({ stages, currentStage }: StageTimelineProps) {
  if (!stages || stages.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
        Historial de Etapas
      </h3>
      <div className="relative pl-6 space-y-4">
        {/* Timeline line */}
        <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-border/50" />
        
        {stages.map((stage, index) => {
          const isCurrent = stage.stage === currentStage;
          const isCompleted = stage.completed;
          
          return (
            <div key={index} className="relative flex items-start gap-3">
              {/* Timeline dot */}
              <div className={cn(
                "absolute -left-6 w-4 h-4 rounded-full flex items-center justify-center",
                isCompleted ? "bg-primary" : isCurrent ? "bg-primary/50 ring-2 ring-primary/30" : "bg-muted"
              )}>
                {isCompleted ? (
                  <Check className="h-2.5 w-2.5 text-primary-foreground" />
                ) : isCurrent ? (
                  <Clock className="h-2.5 w-2.5 text-primary-foreground" />
                ) : (
                  <Circle className="h-2 w-2 text-muted-foreground" />
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className={cn(
                    "text-sm font-medium",
                    isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {stage.stage}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(stage.date), "dd MMM yyyy", { locale: es })}
                  </span>
                </div>
                {stage.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {stage.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
