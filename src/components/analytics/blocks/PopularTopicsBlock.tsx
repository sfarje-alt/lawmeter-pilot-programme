import * as React from "react";
import { AnalyticsBlock } from "../shared/AnalyticsBlock";
import { AnalyticsDrilldownSheet } from "../shared/AnalyticsDrilldownSheet";
import { getNeutralColor } from "@/lib/analyticsColors";
import { Hash } from "lucide-react";
import { type PeruAlert } from "@/data/peruAlertsMockData";
import { useBlockFilters } from "@/hooks/useBlockFilters";
import { applyAlertFilters } from "@/lib/blockFilterUtils";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

interface PopularTopicsBlockProps {
  alerts: PeruAlert[];
  timeframe: string;
  source?: string;
  maxItems?: number;
  showTrends?: boolean;
  onDrilldown?: (alertIds: string[]) => void;
  demoData?: { id: string; label: string; value: number }[];
}

export function PopularTopicsBlock({
  alerts,
  timeframe,
  source = "Alertas monitoreadas",
  maxItems = 7,
  onDrilldown,
}: PopularTopicsBlockProps) {
  const filterState = useBlockFilters('popular_topics');
  const [drilldownOpen, setDrilldownOpen] = React.useState(false);
  const [selectedLabel, setSelectedLabel] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const filteredAlerts = React.useMemo(
    () => applyAlertFilters(alerts, filterState.filters),
    [alerts, filterState.filters]
  );

  const { displayData, total, remaining, fullData } = React.useMemo(() => {
    const topicGroups: Record<string, string[]> = {};
    filteredAlerts.forEach(alert => {
      alert.affected_areas?.forEach(area => {
        (topicGroups[area] ||= []).push(alert.id);
      });
    });
    const allData = Object.entries(topicGroups)
      .map(([label, ids]) => ({ id: label, label, value: ids.length, ids }))
      .sort((a, b) => b.value - a.value);
    return {
      displayData: allData.slice(0, maxItems),
      fullData: allData,
      total: filteredAlerts.length,
      remaining: Math.max(allData.length - maxItems, 0),
    };
  }, [filteredAlerts, maxItems]);

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

  const renderList = (items: typeof displayData) => (
    <div className="space-y-2">
      {items.map((topic, index) => {
        const percentage = total > 0 ? (topic.value / total) * 100 : 0;
        return (
          <button
            key={topic.id}
            onClick={() => handleTopicClick(topic)}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white flex-shrink-0"
              style={{ backgroundColor: getNeutralColor(index) }}
            >
              {index + 1}
            </div>
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
    </div>
  );

  return (
    <>
      <AnalyticsBlock
        title="Temas Populares"
        takeaway={takeaway}
        infoTooltip="Ranking de áreas legales/temas con mayor número de alertas. Los temas se derivan de las áreas de interés de cada alerta."
        timeframe={timeframe}
        source={source}
        isEmpty={isEmpty}
        icon={<Hash className="h-4 w-4 text-primary" />}
        filterDimensions={['period', 'legislationType', 'impactLevels', 'search']}
        filterState={filterState}
        renderExpanded={() => (
          <div className="overflow-auto">{renderList(fullData.slice(0, 20))}</div>
        )}
        renderDataTable={() => (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Tema</TableHead>
                  <TableHead className="text-right">Alertas</TableHead>
                  <TableHead className="text-right">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fullData.map((row, i) => (
                  <TableRow key={row.id} className="cursor-pointer" onClick={() => handleTopicClick(row)}>
                    <TableCell className="tabular-nums text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="font-medium">{row.label}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.value}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {Math.round((row.value / total) * 100)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        renderInsights={() => (
          <div className="space-y-3">
            <InsightCard title="Tema dominante" body={takeaway} />
            <InsightCard
              title="Diversidad temática"
              body={`${fullData.length} áreas/temas distintos aparecen en el rango filtrado.`}
            />
            {fullData.length >= 3 && (
              <InsightCard
                title="Concentración"
                body={`Los 3 temas principales acumulan ${Math.round(
                  (fullData.slice(0, 3).reduce((s, d) => s + d.value, 0) / total) * 100
                )}% de las alertas.`}
              />
            )}
          </div>
        )}
      >
        {renderList(displayData)}

        {remaining > 0 && (
          <p className="text-xs text-muted-foreground text-center pt-2">
            +{remaining} temas más
          </p>
        )}
      </AnalyticsBlock>

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

function InsightCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground mt-0.5">{body}</p>
    </div>
  );
}
