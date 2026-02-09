import * as React from "react";
import { AnalyticsBlock } from "../shared/AnalyticsBlock";
import { getNeutralColor } from "@/lib/analyticsColors";
import { Shield } from "lucide-react";
import { DEMO_EXPOSURE } from "@/lib/analyticsMockData";
import type { RankingItem } from "@/types/analytics";

interface ExposureBlockProps {
  timeframe: string;
  source?: string;
  demoData?: RankingItem[];
}

export function ExposureBlock({
  timeframe,
  source = "Alertas publicadas",
  demoData = DEMO_EXPOSURE,
}: ExposureBlockProps) {
  const data = demoData;
  const isEmpty = data.length === 0;
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const total = data.reduce((sum, d) => sum + d.value, 0);

  const takeaway = isEmpty
    ? "No hay datos de exposición en el período"
    : `${data[0]?.label} es el área más expuesta con ${Math.round(((data[0]?.value || 0) / total) * 100)}% de las alertas`;

  return (
    <AnalyticsBlock
      title="Exposición por Área de Negocio"
      takeaway={takeaway}
      infoTooltip="Desglose de alertas por área funcional del negocio (Operaciones, Compliance, Comercial, etc.). Muestra dónde se concentra el impacto regulatorio."
      timeframe={timeframe}
      source={source}
      isEmpty={isEmpty}
      icon={<Shield className="h-4 w-4 text-primary" />}
    >
      <div className="space-y-3">
        {data.map((item, index) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0;
          const barWidth = (item.value / maxValue) * 100;

          return (
            <div key={item.id} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{item.label}</span>
                <span className="text-xs text-muted-foreground">
                  {item.value} ({Math.round(percentage)}%)
                </span>
              </div>
              <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: getNeutralColor(index),
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </AnalyticsBlock>
  );
}
