import * as React from "react";
import { AnalyticsBlock } from "../shared/AnalyticsBlock";
import { ANALYTICS_COLORS, getNeutralColor, getTrendColor } from "@/lib/analyticsColors";
import { Hash, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { RankingItem } from "@/types/analytics";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PopularTopicsBlockProps {
  data: RankingItem[];
  timeframe: string;
  source?: string;
  maxItems?: number;
  showTrends?: boolean;
  onDrilldown?: () => void;
}

/**
 * Popular Topics Block - Ranking of most active legal areas/topics
 * Client-visible analytics block
 */
export function PopularTopicsBlock({
  data,
  timeframe,
  source = "Alertas publicadas",
  maxItems = 7,
  showTrends = false,
  onDrilldown,
}: PopularTopicsBlockProps) {
  const displayData = data.slice(0, maxItems);
  const isEmpty = displayData.length === 0;
  const remaining = data.length - maxItems;
  const total = data.reduce((sum, d) => sum + d.value, 0);

  const topTopic = displayData[0];
  const takeaway = isEmpty 
    ? "No hay datos de temas en el período seleccionado"
    : `"${topTopic.label}" es el tema más activo con ${topTopic.value} alertas (${Math.round((topTopic.value / total) * 100)}%)`;

  return (
    <AnalyticsBlock
      title="Temas Populares"
      takeaway={takeaway}
      infoTooltip="Ranking de áreas legales/temas con mayor número de alertas publicadas. Los temas se derivan de las áreas de interés de cada alerta."
      timeframe={timeframe}
      source={source}
      onDrilldown={onDrilldown}
      isEmpty={isEmpty}
      icon={<Hash className="h-4 w-4 text-primary" />}
    >
      <div className="space-y-2">
        {displayData.map((topic, index) => {
          const percentage = total > 0 ? (topic.value / total) * 100 : 0;
          
          return (
            <div 
              key={topic.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              {/* Rank */}
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white flex-shrink-0"
                style={{ backgroundColor: getNeutralColor(index) }}
              >
                {index + 1}
              </div>
              
              {/* Label and bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground truncate">
                    {topic.label}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                    {topic.value}
                  </span>
                </div>
                <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: getNeutralColor(index),
                    }}
                  />
                </div>
              </div>
              
              {/* Trend indicator */}
              {showTrends && topic.change && (
                <TrendBadge change={topic.change} />
              )}
            </div>
          );
        })}
        
        {remaining > 0 && (
          <p className="text-xs text-muted-foreground text-center pt-2">
            +{remaining} temas más
          </p>
        )}
      </div>
    </AnalyticsBlock>
  );
}

function TrendBadge({ change }: { change: { direction: 'up' | 'down' | 'stable'; change: number } }) {
  const Icon = change.direction === 'up' ? TrendingUp : change.direction === 'down' ? TrendingDown : Minus;
  const color = getTrendColor(change.direction);
  
  return (
    <div 
      className="flex items-center gap-0.5 text-xs flex-shrink-0"
      style={{ color }}
    >
      <Icon className="h-3 w-3" />
      {change.change !== 0 && (
        <span>{Math.abs(change.change)}%</span>
      )}
    </div>
  );
}
