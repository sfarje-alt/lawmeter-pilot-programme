import * as React from "react";
import { AnalyticsBlock } from "../shared/AnalyticsBlock";
import { AnalyticsDrilldownSheet } from "../shared/AnalyticsDrilldownSheet";
import { getNeutralColor } from "@/lib/analyticsColors";
import { Shield } from "lucide-react";
import { DEMO_EXPOSURE } from "@/lib/analyticsMockData";
import type { RankingItem } from "@/types/analytics";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Authority mapping per business area (demo)
const AREA_AUTHORITIES: Record<string, string[]> = {
  "Operaciones": ["MINSA", "DIGEMID", "DIGESA"],
  "Asuntos Regulatorios": ["DIGEMID", "SUSALUD", "ANM"],
  "Compliance": ["SBS", "SUSALUD", "INDECOPI"],
  "Comercial": ["INDECOPI", "SUNAT", "MEF"],
  "Propiedad Intelectual": ["INDECOPI", "OMPI"],
};

const AREA_SEVERITY: Record<string, "grave" | "medio" | "leve"> = {
  "Operaciones": "grave",
  "Asuntos Regulatorios": "grave",
  "Compliance": "medio",
  "Comercial": "medio",
  "Propiedad Intelectual": "leve",
};

const SEVERITY_COLORS: Record<string, string> = {
  grave: "bg-destructive/20 text-destructive",
  medio: "bg-amber-500/20 text-amber-600",
  leve: "bg-muted text-muted-foreground",
};

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
  const [drilldownOpen, setDrilldownOpen] = React.useState(false);
  const [selectedLabel, setSelectedLabel] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const data = demoData;
  const isEmpty = data.length === 0;
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const total = data.reduce((sum, d) => sum + d.value, 0);

  const takeaway = isEmpty
    ? "No hay datos de exposición en el período"
    : `${data[0]?.label} es el área más expuesta con ${Math.round(((data[0]?.value || 0) / total) * 100)}% de las alertas`;

  const handleAreaClick = (item: RankingItem) => {
    setSelectedLabel(item.label);
    setSelectedIds([]); // demo mode - no real alert IDs
    setDrilldownOpen(true);
  };

  return (
    <>
      <AnalyticsBlock
        title="Exposición por Área de Negocio"
        takeaway={takeaway}
        infoTooltip="Desglose de alertas por área funcional del negocio (Operaciones, Compliance, Comercial, etc.). Muestra dónde se concentra el impacto regulatorio. Combina el perfil del cliente, las autoridades relevantes y la clasificación de impacto."
        timeframe={timeframe}
        source={source}
        isEmpty={isEmpty}
        icon={<Shield className="h-4 w-4 text-primary" />}
      >
        <TooltipProvider>
          <div className="space-y-3">
            {data.map((item, index) => {
              const percentage = total > 0 ? (item.value / total) * 100 : 0;
              const barWidth = (item.value / maxValue) * 100;
              const authorities = AREA_AUTHORITIES[item.label] || [];
              const severity = AREA_SEVERITY[item.label] || "leve";
              const severityClass = SEVERITY_COLORS[severity];

              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleAreaClick(item)}
                      className="w-full text-left space-y-1 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{item.label}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${severityClass}`}>
                            {severity === 'grave' ? 'Alto' : severity === 'medio' ? 'Medio' : 'Bajo'}
                          </span>
                        </div>
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
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="font-medium text-xs mb-1">Autoridades relevantes:</p>
                    <p className="text-xs text-muted-foreground">
                      {authorities.length > 0 ? authorities.join(", ") : "Sin autoridades específicas"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      </AnalyticsBlock>

      <AnalyticsDrilldownSheet
        open={drilldownOpen}
        onOpenChange={setDrilldownOpen}
        title={`Exposición: ${selectedLabel}`}
        description={`Alertas que impactan el área de ${selectedLabel}`}
        alertIds={selectedIds}
      />
    </>
  );
}
