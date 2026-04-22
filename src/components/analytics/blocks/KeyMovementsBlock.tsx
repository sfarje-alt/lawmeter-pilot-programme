import * as React from "react";
import { AnalyticsBlock } from "../shared/AnalyticsBlock";
import { AnalyticsDrilldownSheet } from "../shared/AnalyticsDrilldownSheet";
import { Sparkles, ArrowRight, Clock, Plus, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useBlockFilters } from "@/hooks/useBlockFilters";
import { resolveDateRange } from "@/lib/blockFilterUtils";
import { type PeruAlert } from "@/data/peruAlertsMockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type MovementItem = {
  id: string;        // composite (new-/prog-/dl- + alert id)
  alertId: string;   // raw alert id, used for drilldown
  type: 'new' | 'progress' | 'deadline';
  title: string;
  date: string;
  detail?: string;
};

interface KeyMovementsBlockProps {
  alerts?: PeruAlert[];
  timeframe: string;
  source?: string;
}

const TYPE_CONFIG = {
  new: { icon: Plus, label: "Nuevo", color: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" },
  progress: { icon: ArrowRight, label: "Avance", color: "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30" },
  deadline: { icon: Clock, label: "Plazo", color: "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30" },
};

const TYPE_FILTER_OPTIONS = [
  { value: 'all', label: 'Todos los tipos' },
  { value: 'new', label: 'Nuevos' },
  { value: 'progress', label: 'Avances' },
  { value: 'deadline', label: 'Plazos' },
];

/**
 * Derive editorial movements directly from live alerts:
 *  - new: alert.created_at within recent window (14 days)
 *  - progress: alert.updated_at significantly after created_at
 *  - deadline: alert.deadline within next 30 days
 */
function deriveMovements(alerts: PeruAlert[]): MovementItem[] {
  const items: MovementItem[] = [];
  const now = Date.now();
  const RECENT_MS = 14 * 24 * 60 * 60 * 1000;
  const DEADLINE_MS = 30 * 24 * 60 * 60 * 1000;

  alerts.forEach((a) => {
    const created = a.created_at ? new Date(a.created_at).getTime() : 0;
    const updated = a.updated_at ? new Date(a.updated_at).getTime() : 0;
    const title = a.legislation_title || 'Alerta sin título';

    if (created && now - created <= RECENT_MS) {
      items.push({
        id: `new-${a.id}`,
        alertId: a.id,
        type: 'new',
        title,
        date: a.created_at!,
        detail: a.legislation_type === 'proyecto_de_ley' ? 'Proyecto de Ley' : 'Norma',
      });
    }

    if (created && updated && updated > created + 60_000) {
      items.push({
        id: `prog-${a.id}`,
        alertId: a.id,
        type: 'progress',
        title,
        date: a.updated_at!,
        detail: (a as any).current_stage || (a as any).estado_actual || 'Actualización editorial',
      });
    }

    const deadlineRaw = (a as any).deadline || (a as any).stage_deadline || (a as any).comment_deadline;
    if (deadlineRaw) {
      const t = new Date(deadlineRaw).getTime();
      if (!isNaN(t) && t >= now && t - now <= DEADLINE_MS) {
        items.push({
          id: `dl-${a.id}`,
          alertId: a.id,
          type: 'deadline',
          title,
          date: deadlineRaw,
          detail: 'Plazo próximo',
        });
      }
    }
  });

  return items.sort((x, y) => new Date(y.date).getTime() - new Date(x.date).getTime()).slice(0, 50);
}

export function KeyMovementsBlock({
  alerts = [],
  timeframe,
  source = "Alertas publicadas",
}: KeyMovementsBlockProps) {
  const filterState = useBlockFilters('key_movements', { search: '', status: 'all' });
  const [drilldownOpen, setDrilldownOpen] = React.useState(false);
  const movementType = (filterState.filters.status as string) || 'all';

  const allItems = React.useMemo(() => deriveMovements(alerts), [alerts]);

  const filteredItems = React.useMemo(() => {
    let items = allItems;
    const { from, to } = resolveDateRange(filterState.filters);
    if (from || to) {
      const fromMs = from ? new Date(from).getTime() : -Infinity;
      const toMs = to ? new Date(to).getTime() : Infinity;
      items = items.filter(i => {
        const t = new Date(i.date).getTime();
        return t >= fromMs && t <= toMs;
      });
    }
    if (movementType !== 'all') {
      items = items.filter(i => i.type === movementType);
    }
    const q = (filterState.filters.search || '').trim().toLowerCase();
    if (q) {
      items = items.filter(i =>
        i.title.toLowerCase().includes(q) ||
        (i.detail?.toLowerCase().includes(q))
      );
    }
    return items;
  }, [allItems, filterState.filters, movementType]);

  const counts = React.useMemo(() => ({
    newItems: filteredItems.filter(i => i.type === 'new').length,
    stageChanges: filteredItems.filter(i => i.type === 'progress').length,
    upcomingDeadlines: filteredItems.filter(i => i.type === 'deadline').length,
  }), [filteredItems]);

  const isEmpty = filteredItems.length === 0;

  const takeaway = isEmpty
    ? "No hay movimientos en el rango filtrado"
    : `${counts.newItems} nuevos, ${counts.stageChanges} avances, ${counts.upcomingDeadlines} plazos`;

  const drilldownAlertIds = React.useMemo(() => {
    const ids = new Set<string>();
    filteredItems.forEach(i => ids.add(i.alertId));
    return Array.from(ids);
  }, [filteredItems]);

  const handleItemClick = () => setDrilldownOpen(true);

  const renderItems = (items: typeof filteredItems, compact: boolean) => (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      {items.map((item) => {
        const config = TYPE_CONFIG[item.type];
        const Icon = config.icon;
        return (
          <button
            key={item.id}
            onClick={handleItemClick}
            className="w-full text-left flex items-start gap-3 p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className={cn("p-1.5 rounded-md flex-shrink-0 border", config.color)}>
              <Icon className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
              {item.detail && (
                <p className="text-xs text-muted-foreground mt-0.5">{item.detail}</p>
              )}
              <p className="text-xs text-muted-foreground/70 mt-0.5">
                {formatDate(item.date)}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      <AnalyticsBlock
        title="Movimientos Clave"
        takeaway={takeaway}
        infoTooltip="Resumen de actividad reciente: nuevas alertas publicadas, cambios de estado legislativo y plazos próximos. Tu configuración se guarda automáticamente."
        timeframe={timeframe}
        source={source}
        isEmpty={isEmpty}
        icon={<Sparkles className="h-4 w-4 text-primary" />}
        filterDimensions={['legislationType', 'impactLevels', 'search']}
        filterState={filterState}
        onDrilldown={isEmpty ? undefined : handleItemClick}
        renderExpanded={() => (
          <div className="space-y-4">
            <div className="flex gap-1.5 flex-wrap">
              {TYPE_FILTER_OPTIONS.map(opt => (
                <Badge
                  key={opt.value}
                  variant={movementType === opt.value ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => filterState.setFilter('status', opt.value as any)}
                >
                  {opt.label}
                </Badge>
              ))}
            </div>
            <div className="overflow-auto">
              {renderItems(filteredItems, false)}
            </div>
          </div>
        )}
        renderDataTable={() => (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Detalle</TableHead>
                  <TableHead className="text-right">Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${TYPE_CONFIG[item.type].color}`}>
                        {TYPE_CONFIG[item.type].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium max-w-[280px] truncate">{item.title}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {item.detail || '—'}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-xs">{formatDate(item.date)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        renderInsights={() => (
          <div className="space-y-3">
            <InsightCard icon={<Sparkles className="h-4 w-4" />} title="Resumen" body={takeaway} />
            <InsightCard
              icon={<TrendingUp className="h-4 w-4" />}
              title="Composición de movimientos"
              body={`En el rango filtrado: ${counts.newItems} nuevos items publicados, ${counts.stageChanges} avances de etapa legislativa, ${counts.upcomingDeadlines} plazos próximos.`}
            />
            {counts.upcomingDeadlines > 0 && (
              <InsightCard
                icon={<Clock className="h-4 w-4" />}
                title="Atención a plazos"
                body={`Hay ${counts.upcomingDeadlines} plazos próximos. Revísalos para evitar incumplimientos.`}
              />
            )}
            <p className="text-[11px] text-muted-foreground italic pt-2">
              Insights derivados del rango filtrado.
            </p>
          </div>
        )}
      >
        <div className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
              <Plus className="h-3 w-3 mr-1" /> {counts.newItems} nuevos
            </Badge>
            <Badge variant="outline" className="text-xs bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400">
              <ArrowRight className="h-3 w-3 mr-1" /> {counts.stageChanges} avances
            </Badge>
            <Badge variant="outline" className="text-xs bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400">
              <Clock className="h-3 w-3 mr-1" /> {counts.upcomingDeadlines} plazos
            </Badge>
          </div>

          {renderItems(filteredItems.slice(0, 5), true)}
        </div>
      </AnalyticsBlock>

      <AnalyticsDrilldownSheet
        open={drilldownOpen}
        onOpenChange={setDrilldownOpen}
        title="Movimientos Clave - Alertas relacionadas"
        description={`${drilldownAlertIds.length} alertas con movimientos en el período`}
        alertIds={drilldownAlertIds}
        alertsData={alerts}
      />
    </>
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
