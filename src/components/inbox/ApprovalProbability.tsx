import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApprovalProbabilityProps {
  probability: number; // 0-100
  trend?: "up" | "down" | "stable";
}

export function ApprovalProbability({ probability, trend = "stable" }: ApprovalProbabilityProps) {
  const getColor = () => {
    if (probability >= 70) return "text-green-600";
    if (probability >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getBgColor = () => {
    if (probability >= 70) return "bg-green-500";
    if (probability >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Brain className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Probabilidad de Aprobación (IA)
        </h3>
      </div>
      
      <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
        <div className="flex items-center justify-between mb-2">
          <span className={cn("text-2xl font-bold", getColor())}>
            {probability}%
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <TrendIcon className={cn(
              "h-3.5 w-3.5",
              trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-gray-500"
            )} />
            <span>{trend === "up" ? "Subiendo" : trend === "down" ? "Bajando" : "Estable"}</span>
          </div>
        </div>
        
        <Progress value={probability} className="h-2" />
        
        <p className="text-xs text-muted-foreground mt-2">
          Basado en análisis de historial legislativo, composición del congreso y patrones de votación similares.
        </p>
      </div>
    </div>
  );
}
