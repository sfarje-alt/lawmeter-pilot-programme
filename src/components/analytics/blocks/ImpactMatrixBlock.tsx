import * as React from "react";
import { AnalyticsBlock } from "../shared/AnalyticsBlock";
import { AnalyticsDrilldownSheet } from "../shared/AnalyticsDrilldownSheet";
import { getImpactColor } from "@/lib/analyticsColors";
import { cn } from "@/lib/utils";
import { AlertTriangle, AlertCircle, MinusCircle, CheckCircle } from "lucide-react";
import { type PeruAlert } from "@/data/peruAlertsMockData";

interface ImpactMatrixBlockProps {
  alerts: PeruAlert[];
  timeframe: string;
  source?: string;
  onDrilldown?: (alertIds: string[]) => void;
}
  timeframe: string;
  source?: string;
  onDrilldown?: (alertIds: string[]) => void;
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

/**
 * Impact Matrix Block - 3x3 grid showing impact vs urgency
 * Client-visible analytics block
 */
export function ImpactMatrixBlock({
  alerts,
  timeframe,
  source = "Alertas publicadas",
  onDrilldown,
}: ImpactMatrixBlockProps) {
  const [drilldownOpen, setDrilldownOpen] = React.useState(false);
  const [selectedAlertIds, setSelectedAlertIds] = React.useState<string[]>([]);
  const [selectedLabel, setSelectedLabel] = React.useState("");

  // Build matrix data from alerts
  const matrixData = React.useMemo(() => {
    const matrix: Record<string, { value: number; items: string[] }> = {};
    
    IMPACT_ROWS.forEach(impact => {
      URGENCY_COLS.forEach(urgency => {
        matrix[`${impact}-${urgency}`] = { value: 0, items: [] };
      });
    });

    alerts.forEach(alert => {
      const impact = (alert.impact_level || 'leve').toLowerCase();
      const urgency = (alert.urgency_level || 'baja').toLowerCase();
      const key = `${impact}-${urgency}`;
      if (matrix[key]) {
        matrix[key].value++;
        matrix[key].items.push(alert.id);
      }
    });

    return matrix;
  }, [alerts]);

  // Calculate totals
  const totalAlerts = alerts.length;
  const highPriorityCount = alerts.filter(a => 
    a.impact_level === 'grave' || a.urgency_level === 'alta'
  ).length;

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

  return (
    <>
      <AnalyticsBlock
        title="Matriz de Impacto"
        takeaway={takeaway}
        infoTooltip="Matriz 3x3 que cruza nivel de impacto (Grave/Medio/Leve) con urgencia (Alta/Media/Baja). Haga clic en una celda para ver las alertas."
        timeframe={timeframe}
        source={source}
        isEmpty={isEmpty}
      >
        <div className="space-y-3">
          {/* Matrix Grid */}
          <div className="grid grid-cols-4 gap-1">
            {/* Header row */}
            <div /> {/* Empty corner */}
            {URGENCY_COLS.map(urgency => (
              <div 
                key={urgency}
                className="text-center text-xs font-medium text-muted-foreground py-1"
              >
                <span className="hidden sm:inline">Urgencia </span>{URGENCY_DISPLAY[urgency]}
              </div>
            ))}
            
            {/* Data rows */}
            {IMPACT_ROWS.map(impact => {
              const Icon = IMPACT_ICONS[impact] || MinusCircle;
              const impactColor = getImpactColor(impact);
              
              return (
                <React.Fragment key={impact}>
                  {/* Row header */}
                  <div className="flex items-center gap-1.5 text-xs font-medium py-2 pr-2">
                    <Icon 
                      className="h-3.5 w-3.5 flex-shrink-0" 
                      style={{ color: impactColor }}
                    />
                    <span className="truncate">{IMPACT_DISPLAY[impact]}</span>
                  </div>
                  
                  {/* Cells */}
                  {URGENCY_COLS.map(urgency => {
                    const key = `${impact}-${urgency}`;
                    const cell = matrixData[key];
                    const value = cell?.value || 0;
                    const isHighPriority = impact === 'grave' || urgency === 'alta';
                    
                    return (
                      <button
                        key={key}
                        className={cn(
                          "relative aspect-square rounded-lg flex items-center justify-center",
                          "text-sm font-semibold transition-all",
                          "hover:ring-2 hover:ring-primary/50 focus:outline-none focus:ring-2 focus:ring-primary",
                          value > 0 ? "cursor-pointer" : "cursor-default",
                          isHighPriority && value > 0
                            ? "bg-destructive/20 text-destructive"
                            : value > 0
                            ? "bg-muted/80 text-foreground"
                            : "bg-muted/30 text-muted-foreground/50"
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
          
          {/* Legend */}
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-destructive/20" />
              <span>Alta prioridad</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-muted/80" />
              <span>Prioridad normal</span>
            </div>
          </div>
        </div>
      </AnalyticsBlock>

      {/* Drilldown Sheet */}
      <AnalyticsDrilldownSheet
        open={drilldownOpen}
        onOpenChange={setDrilldownOpen}
        title={selectedLabel}
        description={`${selectedAlertIds.length} alertas en esta categoría`}
        alertIds={selectedAlertIds}
      />
    </>
  );
}
