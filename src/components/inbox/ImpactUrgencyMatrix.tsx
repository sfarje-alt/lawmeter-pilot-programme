import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

interface ImpactUrgencyMatrixProps {
  impact: "high" | "medium" | "low";
  urgency: "high" | "medium" | "low";
}

const impactLabels = { high: "Alto", medium: "Medio", low: "Bajo" };
const urgencyLabels = { high: "Alta", medium: "Media", low: "Baja" };

export function ImpactUrgencyMatrix({ impact, urgency }: ImpactUrgencyMatrixProps) {
  const getMatrixCell = (i: "high" | "medium" | "low", u: "high" | "medium" | "low") => {
    const isActive = impact === i && urgency === u;
    
    // Determine color based on combined risk
    let bgColor = "bg-muted/30";
    if (isActive) {
      if ((i === "high" && u === "high") || (i === "high" && u === "medium") || (i === "medium" && u === "high")) {
        bgColor = "bg-red-500";
      } else if (i === "medium" && u === "medium") {
        bgColor = "bg-yellow-500";
      } else if ((i === "high" && u === "low") || (i === "low" && u === "high")) {
        bgColor = "bg-orange-500";
      } else {
        bgColor = "bg-green-500";
      }
    }
    
    return (
      <div 
        className={cn(
          "w-8 h-8 rounded flex items-center justify-center transition-all",
          bgColor,
          isActive && "ring-2 ring-offset-2 ring-offset-background"
        )}
      >
        {isActive && <div className="w-2 h-2 rounded-full bg-white" />}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Matriz Impacto / Urgencia
        </h3>
      </div>
      
      <div className="flex gap-4">
        {/* Matrix */}
        <div className="relative">
          {/* Y-axis label */}
          <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-muted-foreground whitespace-nowrap">
            Impacto
          </div>
          
          <div className="flex flex-col gap-1">
            {/* High impact row */}
            <div className="flex gap-1">
              {getMatrixCell("high", "low")}
              {getMatrixCell("high", "medium")}
              {getMatrixCell("high", "high")}
            </div>
            {/* Medium impact row */}
            <div className="flex gap-1">
              {getMatrixCell("medium", "low")}
              {getMatrixCell("medium", "medium")}
              {getMatrixCell("medium", "high")}
            </div>
            {/* Low impact row */}
            <div className="flex gap-1">
              {getMatrixCell("low", "low")}
              {getMatrixCell("low", "medium")}
              {getMatrixCell("low", "high")}
            </div>
          </div>
          
          {/* X-axis label */}
          <div className="text-center mt-2 text-[10px] text-muted-foreground">
            Urgencia
          </div>
        </div>
        
        {/* Current values */}
        <div className="flex flex-col justify-center gap-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Impacto:</span>
            <span className="font-medium">{impactLabels[impact]}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Urgencia:</span>
            <span className="font-medium">{urgencyLabels[urgency]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
