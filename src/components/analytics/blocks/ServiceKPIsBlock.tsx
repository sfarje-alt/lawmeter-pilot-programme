import * as React from "react";
import { AnalyticsBlock } from "../shared/AnalyticsBlock";
import { ANALYTICS_COLORS } from "@/lib/analyticsColors";
import { Activity, Clock, CheckCircle, FileText } from "lucide-react";
import type { KPIMetric } from "@/types/analytics";

interface ServiceKPIsBlockProps {
  data: KPIMetric[];
  timeframe: string;
  source?: string;
  onDrilldown?: () => void;
}

const KPI_ICONS: Record<string, React.ElementType> = {
  'file-text': FileText,
  'clock': Clock,
  'check-circle': CheckCircle,
  'activity': Activity,
};

/**
 * Service KPIs Block - Key performance indicators cards
 * Client-visible analytics block showing service quality metrics
 */
export function ServiceKPIsBlock({
  data,
  timeframe,
  source = "Métricas de servicio",
  onDrilldown,
}: ServiceKPIsBlockProps) {
  const isEmpty = data.length === 0;

  const takeaway = isEmpty 
    ? "No hay métricas disponibles"
    : `${data[0].value} alertas publicadas con tiempo de respuesta ${data[1]?.value || 'N/A'}`;

  return (
    <AnalyticsBlock
      title="Indicadores de Servicio"
      takeaway={takeaway}
      infoTooltip="Métricas de calidad del servicio: alertas publicadas, tiempo típico de respuesta editorial, y consistencia de cobertura."
      timeframe={timeframe}
      source={source}
      onDrilldown={onDrilldown}
      isEmpty={isEmpty}
      icon={<Activity className="h-4 w-4 text-primary" />}
      compact
    >
      <div className="grid grid-cols-3 gap-3">
        {data.map((kpi, index) => {
          const Icon = KPI_ICONS[kpi.icon || 'activity'] || Activity;
          
          return (
            <div 
              key={kpi.label}
              className="text-center p-3 rounded-lg bg-muted/30"
            >
              <div className="flex justify-center mb-2">
                <div className="p-2 rounded-full bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="text-xl font-semibold text-foreground">
                {kpi.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {kpi.label}
              </div>
            </div>
          );
        })}
      </div>
    </AnalyticsBlock>
  );
}
