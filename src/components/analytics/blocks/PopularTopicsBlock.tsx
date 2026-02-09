import * as React from "react";
import { AnalyticsBlock } from "../shared/AnalyticsBlock";
import { AnalyticsDrilldownSheet } from "../shared/AnalyticsDrilldownSheet";
import { getNeutralColor, getTrendColor } from "@/lib/analyticsColors";
import { Hash, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { type PeruAlert } from "@/data/peruAlertsMockData";

type RankingItemWithIds = { id: string; label: string; value: number; ids: string[] };

interface PopularTopicsBlockProps {
  alerts: PeruAlert[];
  timeframe: string;
  source?: string;
  maxItems?: number;
  showTrends?: boolean;
  onDrilldown?: (alertIds: string[]) => void;
  demoData?: { id: string; label: string; value: number }[];
}

/**
 * Popular Topics Block - Ranking of most active legal areas/topics
 * Client-visible analytics block
 */
export function PopularTopicsBlock({
  alerts,
  timeframe,
  source = "Alertas publicadas",
  maxItems = 7,
  showTrends = false,
  onDrilldown,
  demoData,
}: PopularTopicsBlockProps) {
  const [drilldownOpen, setDrilldownOpen] = React.useState(false);
  const [selectedLabel, setSelectedLabel] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const { displayData, total, remaining } = React.useMemo(() => {
    if (demoData) {
      const data = demoData.slice(0, maxItems).map(d => ({ ...d, ids: [] as string[] }));
      return { displayData: data, total: demoData.reduce((s, d) => s + d.value, 0), remaining: Math.max(demoData.length - maxItems, 0) };
    }

    const topicGroups: Record<string, string[]> = {};
    alerts.forEach(alert => {
      alert.affected_areas?.forEach(area => {
        if (!topicGroups[area]) topicGroups[area] = [];
        topicGroups[area].push(alert.id);
      });
    });
    const allData = Object.entries(topicGroups)
      .map(([label, ids]) => ({ id: label, label, value: ids.length, ids }))
      .sort((a, b) => b.value - a.value);
    return {
      displayData: allData.slice(0, maxItems),
      total: alerts.length,
      remaining: Math.max(allData.length - maxItems, 0),
    };
  }, [alerts, maxItems, demoData]);

  const isEmpty = displayData.length === 0;

  const topTopic = displayData[0];
  const takeaway = isEmpty 
    ? "No hay datos de temas en el período seleccionado"
    : `"${topTopic?.label || ''}" es el tema más activo con ${topTopic?.value || 0} alertas (${Math.round(((topTopic?.value || 0) / total) * 100)}%)`;

  const handleTopicClick = (topic: { label: string; ids: string[] }) => {
    setSelectedLabel(topic.label);
    setSelectedIds(topic.ids);
    setDrilldownOpen(true);
    onDrilldown?.(topic.ids);
  };

  return (
    <>
      <AnalyticsBlock
        title="Temas Populares"
        takeaway={takeaway}
        infoTooltip="Ranking de áreas legales/temas con mayor número de alertas publicadas. Los temas se derivan de las áreas de interés de cada alerta."
        timeframe={timeframe}
        source={source}
        isEmpty={isEmpty}
        icon={<Hash className="h-4 w-4 text-primary" />}
      >
        <div className="space-y-2">
          {displayData.map((topic, index) => {
            const percentage = total > 0 ? (topic.value / total) * 100 : 0;
            
            return (
              <button 
                key={topic.id}
                onClick={() => handleTopicClick(topic)}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
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
              </button>
            );
          })}
          
          {remaining > 0 && (
            <p className="text-xs text-muted-foreground text-center pt-2">
              +{remaining} temas más
            </p>
          )}
        </div>
      </AnalyticsBlock>

      {/* Drilldown Sheet */}
      <AnalyticsDrilldownSheet
        open={drilldownOpen}
        onOpenChange={setDrilldownOpen}
        title={`Tema: ${selectedLabel}`}
        description={`${selectedIds.length} alertas sobre este tema`}
        alertIds={selectedIds}
      />
    </>
  );
}
