import * as React from "react";
import { AnalyticsBlock } from "../shared/AnalyticsBlock";
import { AnalyticsDrilldownSheet } from "../shared/AnalyticsDrilldownSheet";
import { getStageColor } from "@/lib/analyticsColors";
import { Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { type PeruAlert } from "@/data/peruAlertsMockData";

interface LegislativeFunnelBlockProps {
  alerts: PeruAlert[];
  timeframe: string;
  source?: string;
  onDrilldown?: (alertIds: string[]) => void;
}

// Stage order for funnel display
const STAGE_ORDER = ['EN COMISIÓN', 'DICTAMEN', 'EN AGENDA DEL PLENO', 'APROBADO', 'AUTÓGRAFA', 'PROMULGADA', 'AL ARCHIVO'];

/**
 * Legislative Funnel Block - Shows distribution of bills by stage
 * Client-visible analytics block
 */
export function LegislativeFunnelBlock({
  alerts,
  timeframe,
  source = "Proyectos de Ley publicados",
  onDrilldown,
}: LegislativeFunnelBlockProps) {
  const [drilldownOpen, setDrilldownOpen] = React.useState(false);
  const [selectedStageLabel, setSelectedStageLabel] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  // Only include bills
  const bills = React.useMemo(() => 
    alerts.filter(a => a.legislation_type === 'proyecto_de_ley'),
  [alerts]);

  // Build stage data from bills
  const stageData = React.useMemo(() => {
    const stageGroups: Record<string, string[]> = {};
    
    bills.forEach(bill => {
      const stage = bill.current_stage || 'EN COMISIÓN';
      if (!stageGroups[stage]) stageGroups[stage] = [];
      stageGroups[stage].push(bill.id);
    });

    const totalBills = bills.length;
    
    return STAGE_ORDER
      .filter(stage => stageGroups[stage] && stageGroups[stage].length > 0)
      .map(stage => ({
        stage,
        count: stageGroups[stage]?.length || 0,
        percentage: totalBills > 0 ? ((stageGroups[stage]?.length || 0) / totalBills) * 100 : 0,
        items: stageGroups[stage] || [],
      }));
  }, [bills]);

  const totalBills = bills.length;
  const isEmpty = totalBills === 0;

  // Find where most bills are
  const maxStage = stageData.reduce((max, stage) => 
    stage.count > max.count ? stage : max, 
    { stage: '', count: 0, percentage: 0, items: [] as string[] }
  );

  const takeaway = isEmpty 
    ? "No hay proyectos de ley en el período seleccionado"
    : maxStage.count > 0
    ? `${maxStage.count} proyectos (${Math.round(maxStage.percentage)}%) están en etapa "${formatStageName(maxStage.stage)}"`
    : "Distribución equilibrada entre etapas";

  const handleStageClick = (stage: { stage: string; items: string[] }) => {
    if (stage.items.length > 0) {
      setSelectedStageLabel(formatStageName(stage.stage));
      setSelectedIds(stage.items);
      setDrilldownOpen(true);
      onDrilldown?.(stage.items);
    }
  };

  // Get max count for scaling
  const maxCount = Math.max(...stageData.map(d => d.count), 1);

  return (
    <>
      <AnalyticsBlock
        title="Embudo Legislativo"
        takeaway={takeaway}
        infoTooltip="Distribución de proyectos de ley por etapa del proceso: Comisión, Pleno, Trámite Final, etc. Haga clic en una etapa para ver los proyectos."
        timeframe={timeframe}
        source={source}
        isEmpty={isEmpty}
        icon={<Filter className="h-4 w-4 text-primary" />}
      >
        <div className="space-y-2">
          {stageData.map((stage) => {
            const stageColor = getStageColor(stage.stage);
            const widthPercent = (stage.count / maxCount) * 100;
            
            return (
              <button
                key={stage.stage}
                onClick={() => handleStageClick(stage)}
                disabled={stage.count === 0}
                className={cn(
                  "w-full text-left transition-all rounded-lg p-2",
                  "hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50",
                  stage.count === 0 && "opacity-50 cursor-default"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-foreground truncate flex-1">
                    {formatStageName(stage.stage)}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {stage.count} ({Math.round(stage.percentage)}%)
                  </span>
                </div>
                <div className="h-5 bg-muted/30 rounded overflow-hidden">
                  <div
                    className="h-full rounded transition-all duration-500 flex items-center"
                    style={{ 
                      width: `${Math.max(widthPercent, 2)}%`,
                      backgroundColor: stageColor,
                    }}
                  >
                    {widthPercent > 15 && (
                      <span className="text-[10px] font-medium text-white px-2">
                        {stage.count}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </AnalyticsBlock>

      {/* Drilldown Sheet */}
      <AnalyticsDrilldownSheet
        open={drilldownOpen}
        onOpenChange={setDrilldownOpen}
        title={`Etapa: ${selectedStageLabel}`}
        description={`${selectedIds.length} proyectos en esta etapa`}
        alertIds={selectedIds}
      />
    </>
  );
}

// Format stage names for display
function formatStageName(stage: string): string {
  const nameMap: Record<string, string> = {
    'EN COMISIÓN': 'En Comisión',
    'DICTAMEN': 'Con Dictamen',
    'EN AGENDA DEL PLENO': 'Agenda del Pleno',
    'APROBADO': 'Aprobado',
    'AUTÓGRAFA': 'Autógrafa',
    'PROMULGADA': 'Promulgada',
    'AL ARCHIVO': 'Archivado',
  };
  
  return nameMap[stage] || stage.charAt(0) + stage.slice(1).toLowerCase();
}
