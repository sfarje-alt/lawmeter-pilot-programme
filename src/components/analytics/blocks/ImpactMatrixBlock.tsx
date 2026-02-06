import * as React from "react";
import { AnalyticsBlock } from "../shared/AnalyticsBlock";
import { AnalyticsDrilldownSheet } from "../shared/AnalyticsDrilldownSheet";
import { ANALYTICS_COLORS, getImpactColor } from "@/lib/analyticsColors";
import { cn } from "@/lib/utils";
import { AlertTriangle, AlertCircle, MinusCircle, CheckCircle } from "lucide-react";
import type { MatrixCell } from "@/types/analytics";

interface ImpactMatrixBlockProps {
  data: MatrixCell[];
  timeframe: string;
  source?: string;
  onDrilldown?: () => void;
}

const IMPACT_ROWS = ['Grave', 'Medio', 'Leve'];
const URGENCY_COLS = ['Alta', 'Media', 'Baja'];

const IMPACT_ICONS: Record<string, React.ElementType> = {
  'Grave': AlertTriangle,
  'Medio': AlertCircle,
  'Leve': MinusCircle,
  'Positivo': CheckCircle,
};

/**
 * Impact Matrix Block - 3x3 grid showing impact vs urgency
 * Client-visible analytics block
 */
export function ImpactMatrixBlock({
  data,
  timeframe,
  source = "Alertas publicadas",
  onDrilldown,
}: ImpactMatrixBlockProps) {
  const [drilldownOpen, setDrilldownOpen] = React.useState(false);
  const [selectedCell, setSelectedCell] = React.useState<MatrixCell | null>(null);

  // Get value for a specific cell
  const getCellValue = (impact: string, urgency: string): MatrixCell | undefined => {
    return data.find(cell => cell.row === impact && cell.col === urgency);
  };

  // Calculate totals
  const totalAlerts = data.reduce((sum, cell) => sum + cell.value, 0);
  const highPriorityCount = data
    .filter(cell => cell.row === 'Grave' || cell.col === 'Alta')
    .reduce((sum, cell) => sum + cell.value, 0);

  const handleCellClick = (cell: MatrixCell | undefined) => {
    if (cell && cell.value > 0) {
      setSelectedCell(cell);
      setDrilldownOpen(true);
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
        onDrilldown={onDrilldown}
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
                <span className="hidden sm:inline">Urgencia </span>{urgency}
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
                    <span className="truncate">{impact}</span>
                  </div>
                  
                  {/* Cells */}
                  {URGENCY_COLS.map(urgency => {
                    const cell = getCellValue(impact, urgency);
                    const value = cell?.value || 0;
                    const isHighPriority = impact === 'Grave' || urgency === 'Alta';
                    
                    return (
                      <button
                        key={`${impact}-${urgency}`}
                        className={cn(
                          "relative aspect-square rounded-lg flex items-center justify-center",
                          "text-sm font-semibold transition-all",
                          "hover:ring-2 hover:ring-primary/50 focus:outline-none focus:ring-2 focus:ring-primary",
                          value > 0 ? "cursor-pointer" : "cursor-default",
                          isHighPriority && value > 0
                            ? "bg-red-500/20 text-red-400"
                            : value > 0
                            ? "bg-muted/80 text-foreground"
                            : "bg-muted/30 text-muted-foreground/50"
                        )}
                        onClick={() => handleCellClick(cell)}
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
              <div className="w-3 h-3 rounded bg-red-500/20" />
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
        title={selectedCell ? `Impacto ${selectedCell.row} / Urgencia ${selectedCell.col}` : "Alertas"}
        description={selectedCell ? `${selectedCell.value} alertas en esta categoría` : undefined}
        alertIds={selectedCell?.items || []}
      />
    </>
  );
}
