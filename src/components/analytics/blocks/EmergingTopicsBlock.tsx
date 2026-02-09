import * as React from "react";
import { AnalyticsBlock } from "../shared/AnalyticsBlock";
import { TrendingUp, TrendingDown, Minus, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DEMO_EMERGING_TOPICS } from "@/lib/analyticsMockData";
import type { RankingItem } from "@/types/analytics";

interface EmergingTopicsBlockProps {
  timeframe: string;
  source?: string;
  demoData?: RankingItem[];
}

export function EmergingTopicsBlock({
  timeframe,
  source = "Alertas publicadas",
  demoData = DEMO_EMERGING_TOPICS,
}: EmergingTopicsBlockProps) {
  const data = demoData;
  const isEmpty = data.length === 0;
  const growingTopics = data.filter(t => t.change?.direction === "up");

  const takeaway = isEmpty
    ? "No hay temas emergentes en el período"
    : `${growingTopics.length} temas en crecimiento respecto al período anterior`;

  return (
    <AnalyticsBlock
      title="Temas Emergentes"
      takeaway={takeaway}
      infoTooltip="Temas que muestran un aumento significativo en volumen de alertas respecto al período anterior. Útil para anticipar tendencias regulatorias."
      timeframe={timeframe}
      source={source}
      isEmpty={isEmpty}
      icon={<Zap className="h-4 w-4 text-primary" />}
    >
      <div className="space-y-3">
        {data.map((topic) => {
          const change = topic.change;
          const TrendIcon = change?.direction === "up" ? TrendingUp : change?.direction === "down" ? TrendingDown : Minus;
          const trendColor = change?.direction === "up"
            ? "text-emerald-500"
            : change?.direction === "down"
            ? "text-red-500"
            : "text-muted-foreground";

          return (
            <div
              key={topic.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{topic.label}</p>
                <p className="text-xs text-muted-foreground">
                  {topic.value} alertas este período
                  {change?.previous !== undefined && ` (antes: ${change.previous})`}
                </p>
              </div>
              <div className={`flex items-center gap-1.5 ${trendColor}`}>
                <TrendIcon className="h-4 w-4" />
                {change && (
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      change.direction === "up"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : change.direction === "down"
                        ? "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
                        : "border-border"
                    }`}
                  >
                    {change.direction === "up" ? "+" : ""}{Math.round(change.change)}%
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AnalyticsBlock>
  );
}
