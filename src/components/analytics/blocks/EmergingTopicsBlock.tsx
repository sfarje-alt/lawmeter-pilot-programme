import * as React from "react";
import { AnalyticsBlock } from "../shared/AnalyticsBlock";
import { AnalyticsDrilldownSheet } from "../shared/AnalyticsDrilldownSheet";
import { TrendingUp, TrendingDown, Minus, Zap, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { RankingItem } from "@/types/analytics";
import { useBlockFilters } from "@/hooks/useBlockFilters";
import { type PeruAlert } from "@/data/peruAlertsMockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface EmergingTopicsBlockProps {
  alerts?: PeruAlert[];
  timeframe: string;
  source?: string;
}

type TopicWithIds = RankingItem & { ids: string[] };

/**
 * Derive emerging topics from live alerts.
 * Topic = each tag in `area_de_interes` (with fallback to legislative theme/sumilla keywords).
 * Compares the most recent half of the period vs. the previous half.
 */
function deriveTopics(alerts: PeruAlert[]): TopicWithIds[] {
  if (alerts.length === 0) return [];

  // Sort alerts by date asc to split in halves
  const dated = alerts
    .map(a => ({
      a,
      t: new Date((a as any).created_at || (a as any).publication_date || (a as any).project_date || 0).getTime(),
    }))
    .filter(x => x.t > 0)
    .sort((x, y) => x.t - y.t);

  if (dated.length === 0) return [];

  const mid = Math.floor(dated.length / 2);
  const previousHalf = dated.slice(0, mid).map(x => x.a);
  const currentHalf = dated.slice(mid).map(x => x.a);

  const extractTopics = (alert: PeruAlert): string[] => {
    const tags = (alert as any).area_de_interes || (alert as any).tags || [];
    if (Array.isArray(tags) && tags.length > 0) return tags.filter(Boolean);
    // Fallback to legislation type as a generic bucket
    return [alert.legislation_type === 'proyecto_de_ley' ? 'Proyectos de Ley' : 'Normas'];
  };

  const countWithIds = (list: PeruAlert[]) => {
    const map = new Map<string, { count: number; ids: string[] }>();
    list.forEach(a => {
      extractTopics(a).forEach(t => {
        const entry = map.get(t) || { count: 0, ids: [] };
        entry.count += 1;
        entry.ids.push(a.id);
        map.set(t, entry);
      });
    });
    return map;
  };

  const currentMap = countWithIds(currentHalf);
  const previousMap = countWithIds(previousHalf);

  const result: TopicWithIds[] = [];
  currentMap.forEach((cur, label) => {
    const prev = previousMap.get(label)?.count ?? 0;
    const change = prev === 0 ? (cur.count > 0 ? 100 : 0) : ((cur.count - prev) / prev) * 100;
    const direction: 'up' | 'down' | 'stable' =
      change > 5 ? 'up' : change < -5 ? 'down' : 'stable';
    result.push({
      id: label,
      label,
      value: cur.count,
      ids: cur.ids,
      change: { current: cur.count, previous: prev, change, direction },
    });
  });

  // Include topics that disappeared (current 0, previous > 0) as declining
  previousMap.forEach((prev, label) => {
    if (currentMap.has(label)) return;
    result.push({
      id: label,
      label,
      value: 0,
      ids: [],
      change: { current: 0, previous: prev.count, change: -100, direction: 'down' },
    });
  });

  return result.sort((a, b) => (b.change?.change || 0) - (a.change?.change || 0));
}

export function EmergingTopicsBlock({
  alerts = [],
  timeframe,
  source = "Alertas publicadas",
}: EmergingTopicsBlockProps) {
  const filterState = useBlockFilters('emerging_topics', { search: '' });
  const [drilldownOpen, setDrilldownOpen] = React.useState(false);
  const [selectedLabel, setSelectedLabel] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const baseData = React.useMemo(() => deriveTopics(alerts), [alerts]);

  const filteredData = React.useMemo(() => {
    const q = (filterState.filters.search || '').trim().toLowerCase();
    if (!q) return baseData;
    return baseData.filter(t => t.label.toLowerCase().includes(q));
  }, [baseData, filterState.filters.search]);

  const isEmpty = filteredData.length === 0;
  const growingTopics = filteredData.filter(t => t.change?.direction === "up");
  const decliningTopics = filteredData.filter(t => t.change?.direction === "down");

  const takeaway = isEmpty
    ? "No hay temas emergentes que coincidan con tu búsqueda"
    : `${growingTopics.length} en crecimiento, ${decliningTopics.length} en descenso (de ${filteredData.length} temas)`;

  const handleTopicClick = (topic: TopicWithIds) => {
    setSelectedLabel(topic.label);
    setSelectedIds(topic.ids);
    setDrilldownOpen(true);
  };

  const renderTopicList = (items: TopicWithIds[], compact: boolean) => (
    <div className={compact ? "space-y-3" : "space-y-2"}>
      {items.map((topic) => {
        const change = topic.change;
        const TrendIcon = change?.direction === "up" ? TrendingUp : change?.direction === "down" ? TrendingDown : Minus;
        const trendColor = change?.direction === "up"
          ? "text-emerald-500"
          : change?.direction === "down"
          ? "text-red-500"
          : "text-muted-foreground";

        return (
          <button
            key={topic.id}
            onClick={() => handleTopicClick(topic)}
            className="w-full text-left flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
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
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      <AnalyticsBlock
        title="Temas Emergentes"
        takeaway={takeaway}
        infoTooltip="Temas que muestran un aumento significativo en volumen de alertas respecto al período anterior. Útil para anticipar tendencias regulatorias."
        timeframe={timeframe}
        source={source}
        isEmpty={isEmpty}
        icon={<Zap className="h-4 w-4 text-primary" />}
        filterDimensions={['legislationType', 'impactLevels', 'search']}
        filterState={filterState}
        renderExpanded={() => (
          <div className="h-full w-full overflow-auto">{renderTopicList(filteredData, false)}</div>
        )}
        renderDataTable={() => (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tema</TableHead>
                  <TableHead className="text-right">Alertas</TableHead>
                  <TableHead className="text-right">Período anterior</TableHead>
                  <TableHead className="text-right">Cambio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map(t => (
                  <TableRow key={t.id} className="cursor-pointer" onClick={() => handleTopicClick(t)}>
                    <TableCell className="font-medium">{t.label}</TableCell>
                    <TableCell className="text-right tabular-nums">{t.value}</TableCell>
                    <TableCell className="text-right tabular-nums">{t.change?.previous ?? '—'}</TableCell>
                    <TableCell className={`text-right tabular-nums ${
                      t.change?.direction === 'up' ? 'text-emerald-600' :
                      t.change?.direction === 'down' ? 'text-red-600' : ''
                    }`}>
                      {t.change ? `${t.change.direction === 'up' ? '+' : ''}${Math.round(t.change.change)}%` : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        renderInsights={() => {
          const topGrowing = [...growingTopics].sort((a, b) => (b.change?.change || 0) - (a.change?.change || 0))[0];
          const topDeclining = [...decliningTopics].sort((a, b) => (a.change?.change || 0) - (b.change?.change || 0))[0];
          return (
            <div className="space-y-3">
              <InsightCard icon={<TrendingUp className="h-4 w-4" />} title="Resumen" body={takeaway} />
              {topGrowing && (
                <InsightCard
                  icon={<Sparkles className="h-4 w-4" />}
                  title="Tema más emergente"
                  body={`"${topGrowing.label}" creció ${Math.round(topGrowing.change?.change || 0)}% (de ${topGrowing.change?.previous} a ${topGrowing.value} alertas).`}
                />
              )}
              {topDeclining && (
                <InsightCard
                  icon={<TrendingDown className="h-4 w-4" />}
                  title="Tema con mayor descenso"
                  body={`"${topDeclining.label}" cayó ${Math.round(topDeclining.change?.change || 0)}% respecto al período anterior.`}
                />
              )}
              <p className="text-[11px] text-muted-foreground italic pt-2">
                Insights derivados de los temas filtrados. Cambia el filtro de búsqueda arriba para refinar.
              </p>
            </div>
          );
        }}
      >
        {renderTopicList(filteredData, true)}
      </AnalyticsBlock>

      <AnalyticsDrilldownSheet
        open={drilldownOpen}
        onOpenChange={setDrilldownOpen}
        title={`Tema emergente: ${selectedLabel}`}
        description={`${selectedIds.length} alertas asociadas a este tema`}
        alertIds={selectedIds}
        alertsData={alerts}
      />
    </>
  );
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
