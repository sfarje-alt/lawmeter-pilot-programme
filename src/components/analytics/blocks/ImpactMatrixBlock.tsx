import * as React from "react";
import { AnalyticsBlock } from "../shared/AnalyticsBlock";
import { AnalyticsDrilldownSheet } from "../shared/AnalyticsDrilldownSheet";
import { getImpactColor } from "@/lib/analyticsColors";
import { cn } from "@/lib/utils";
import { AlertTriangle, AlertCircle, MinusCircle, CheckCircle, Grid3x3 } from "lucide-react";
import { type PeruAlert } from "@/data/peruAlertsMockData";
import { useBlockFilters } from "@/hooks/useBlockFilters";
import { applyAlertFilters } from "@/lib/blockFilterUtils";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

interface ImpactMatrixBlockProps {
  alerts: PeruAlert[];
  timeframe: string;
  source?: string;
  onDrilldown?: (alertIds: string[]) => void;
  demoData?: Record<string, { value: number; items: string[] }>;
}

const IMPACT_ROWS = ['grave', 'medio', 'leve'];
const IMPACT_DISPLAY: Record<string, string> = { grave: 'Grave', medio: 'Medio', leve: 'Leve' };
const URGENCY_COLS = ['alta', 'media', 'baja'];
const URGENCY_DISPLAY: Record<string, string> = { alta: 'Alta', media: 'Media', baja: 'Baja' };

const IMPACT_ICONS: Record<string, React.ElementType> = {
  'grave': AlertTriangle,
  'medio': AlertCircle,
  'leve': MinusCircle,
  'positivo': CheckCircle,
};

const CELL_COLORS: Record<string, { filled: string; empty: string }> = {
  'grave-alta':   { filled: 'bg-red-500/30 text-red-400', empty: 'bg-red-500/10 text-muted-foreground/50' },
  'grave-media':  { filled: 'bg-orange-500/25 text-orange-400', empty: 'bg-orange-500/10 text-muted-foreground/50' },
  'grave-baja':   { filled: 'bg-amber-500/20 text-amber-400', empty: 'bg-amber-500/10 text-muted-foreground/50' },
  'medio-alta':   { filled: 'bg-orange-500/25 text-orange-400', empty: 'bg-orange-500/10 text-muted-foreground/50' },
  'medio-media':  { filled: 'bg-amber-500/15 text-foreground', empty: 'bg-muted/30 text-muted-foreground/50' },
  'medio-baja':   { filled: 'bg-emerald-500/15 text-foreground', empty: 'bg-muted/30 text-muted-foreground/50' },
  'leve-alta':    { filled: 'bg-amber-500/20 text-amber-400', empty: 'bg-amber-500/10 text-muted-foreground/50' },
  'leve-media':   { filled: 'bg-emerald-500/15 text-foreground', empty: 'bg-muted/30 text-muted-foreground/50' },
  'leve-baja':    { filled: 'bg-emerald-500/20 text-emerald-400', empty: 'bg-muted/30 text-muted-foreground/50' },
};

function getCellColorClass(impact: string, urgency: string, value: number): string {
  const key = `${impact}-${urgency}`;
  const colors = CELL_COLORS[key];
  if (!colors) return value > 0 ? 'bg-muted/80 text-foreground' : 'bg-muted/30 text-muted-foreground/50';
  return value > 0 ? colors.filled : colors.empty;
}

export function ImpactMatrixBlock({
  alerts,
  timeframe,
  source = "Alertas monitoreadas",
  onDrilldown,
}: ImpactMatrixBlockProps) {
  const filterState = useBlockFilters('impact_matrix');
  const [drilldownOpen, setDrilldownOpen] = React.useState(false);
  const [selectedAlertIds, setSelectedAlertIds] = React.useState<string[]>([]);
  const [selectedLabel, setSelectedLabel] = React.useState("");

  const filteredAlerts = React.useMemo(
    () => applyAlertFilters(alerts, filterState.filters),
    [alerts, filterState.filters]
  );

  const matrixData = React.useMemo(() => {
    const matrix: Record<string, { value: number; items: string[] }> = {};
    IMPACT_ROWS.forEach(impact => {
      URGENCY_COLS.forEach(urgency => {
        matrix[`${impact}-${urgency}`] = { value: 0, items: [] };
      });
    });
    filteredAlerts.forEach(alert => {
      const impact = (alert.impact_level || 'leve').toLowerCase();
      const urgency = impact === 'grave' ? 'alta' : impact === 'medio' ? 'media' : 'baja';
      const key = `${impact}-${urgency}`;
      if (matrix[key]) {
        matrix[key].value++;
        matrix[key].items.push(alert.id);
      }
    });
    return matrix;
  }, [filteredAlerts]);

  const totalAlerts = filteredAlerts.length;
  const highPriorityCount =
    (matrixData['grave-alta']?.value || 0) +
    (matrixData['grave-media']?.value || 0) +
    (matrixData['grave-baja']?.value || 0) +
    (matrixData['medio-alta']?.value || 0);

  const handleCellClick = (impact: string, urgency: string) => {
    const key = `${impact}-${urgency}`;
    const cell = matrixData[key];
    if (cell && cell.value > 0) {
      setSelectedLabel(`Impacto ${IMPACT_DISPLAY[impact]} / Urgencia ${URGENCY_DISPLAY[urgency]}`);
      setSelectedAlertIds(cell.items);
      setDrilldownOpen(true);
      onDrilldown?.(cell.items);
    }
  };

  const isEmpty = totalAlerts === 0;
  const takeaway = isEmpty
    ? "No hay alertas en el período seleccionado"
    : highPriorityCount > 0
    ? `${highPriorityCount} alertas requieren atención prioritaria (impacto grave o urgencia alta)`
    : "No hay alertas de alta prioridad en este período";

  const renderMatrix = (large: boolean) => (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-1">
        <div />
        {URGENCY_COLS.map(urgency => (
          <div key={urgency} className="text-center text-xs font-medium text-muted-foreground py-1">
            <span className="hidden sm:inline">Urgencia </span>{URGENCY_DISPLAY[urgency]}
          </div>
        ))}
        {IMPACT_ROWS.map(impact => {
          const Icon = IMPACT_ICONS[impact] || MinusCircle;
          const impactColor = getImpactColor(impact);
          return (
            <React.Fragment key={impact}>
              <div className="flex items-center gap-1.5 text-xs font-medium py-2 pr-2">
                <Icon className="h-3.5 w-3.5 flex-shrink-0" style={{ color: impactColor }} />
                <span className="truncate">{IMPACT_DISPLAY[impact]}</span>
              </div>
              {URGENCY_COLS.map(urgency => {
                const key = `${impact}-${urgency}`;
                const cell = matrixData[key];
                const value = cell?.value || 0;
                const cellColorClass = getCellColorClass(impact, urgency, value);
                return (
                  <button
                    key={key}
                    className={cn(
                      "relative aspect-square rounded-lg flex items-center justify-center transition-all",
                      large ? "text-2xl font-bold" : "text-sm font-semibold",
                      "hover:ring-2 hover:ring-primary/50 focus:outline-none focus:ring-2 focus:ring-primary",
                      value > 0 ? "cursor-pointer" : "cursor-default",
                      cellColorClass
                    )}
                    onClick={() => handleCellClick(impact, urgency)}
                    disabled={value === 0}
                  >
                    {value}
                  </button>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-red-500/30" /><span>Crítico</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-orange-500/25" /><span>Alto</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-amber-500/20" /><span>Medio</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-emerald-500/20" /><span>Bajo</span></div>
      </div>
    </div>
  );

  return (
    <>
      <AnalyticsBlock
        title="Matriz de Impacto"
        takeaway={takeaway}
        infoTooltip="Matriz 3x3 que cruza nivel de impacto con urgencia. Haz clic en una celda para ver las alertas. Filtra para enfocar el análisis."
        timeframe={timeframe}
        source={source}
        isEmpty={isEmpty}
        icon={<Grid3x3 className="h-4 w-4 text-primary" />}
        filterDimensions={['legislationType', 'impactLevels', 'search']}
        filterState={filterState}
        renderExpanded={() => (
          <div className="max-w-3xl mx-auto py-4">{renderMatrix(true)}</div>
        )}
        renderDataTable={() => (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Impacto</TableHead>
                  <TableHead>Urgencia</TableHead>
                  <TableHead className="text-right">Alertas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {IMPACT_ROWS.flatMap(impact =>
                  URGENCY_COLS.map(urgency => {
                    const cell = matrixData[`${impact}-${urgency}`];
                    return (
                      <TableRow key={`${impact}-${urgency}`}>
                        <TableCell className="font-medium">{IMPACT_DISPLAY[impact]}</TableCell>
                        <TableCell>{URGENCY_DISPLAY[urgency]}</TableCell>
                        <TableCell className="text-right tabular-nums">{cell?.value || 0}</TableCell>
                      </TableRow>
                    );
                  })
                )}
                <TableRow className="bg-muted/30 font-semibold">
                  <TableCell colSpan={2}>Total</TableCell>
                  <TableCell className="text-right tabular-nums">{totalAlerts}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
        renderInsights={() => (
          <div className="space-y-3">
            <InsightCard title="Atención prioritaria" body={takeaway} />
            <InsightCard
              title="Distribución de severidad"
              body={`En el rango filtrado: ${matrixData['grave-alta']?.value || 0} críticas, ${
                (matrixData['grave-media']?.value || 0) + (matrixData['medio-alta']?.value || 0)
              } altas, ${(matrixData['medio-media']?.value || 0) + (matrixData['leve-alta']?.value || 0)} medias.`}
            />
            <p className="text-[11px] text-muted-foreground italic pt-2">
              Insights derivados de los filtros activos.
            </p>
          </div>
        )}
      >
        {renderMatrix(false)}
      </AnalyticsBlock>

      <AnalyticsDrilldownSheet
        open={drilldownOpen}
        onOpenChange={setDrilldownOpen}
        title={selectedLabel}
        description={`${selectedAlertIds.length} alertas en esta categoría`}
        alertIds={selectedAlertIds}
        alertsData={filteredAlerts}
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
