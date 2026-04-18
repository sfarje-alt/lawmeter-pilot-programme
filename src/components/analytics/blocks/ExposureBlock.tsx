import * as React from "react";
import { AnalyticsBlock } from "../shared/AnalyticsBlock";
import { AnalyticsDrilldownSheet } from "../shared/AnalyticsDrilldownSheet";
import { getNeutralColor } from "@/lib/analyticsColors";
import { Shield, AlertTriangle, Sparkles } from "lucide-react";
import { DEMO_EXPOSURE } from "@/lib/analyticsMockData";
import type { RankingItem } from "@/types/analytics";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useBlockFilters } from "@/hooks/useBlockFilters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  const filterState = useBlockFilters('exposure', { search: '', impactLevels: [] });
  const [drilldownOpen, setDrilldownOpen] = React.useState(false);
  const [selectedLabel, setSelectedLabel] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  // Filter areas by search + impact level
  const filteredData = React.useMemo(() => {
    let items = demoData;
    const q = (filterState.filters.search || '').trim().toLowerCase();
    if (q) {
      items = items.filter(i => i.label.toLowerCase().includes(q));
    }
    const impacts = filterState.filters.impactLevels || [];
    if (impacts.length > 0) {
      items = items.filter(i => impacts.includes(AREA_SEVERITY[i.label] || 'leve'));
    }
    return items;
  }, [demoData, filterState.filters]);

  const isEmpty = filteredData.length === 0;
  const maxValue = Math.max(...filteredData.map(d => d.value), 1);
  const total = filteredData.reduce((sum, d) => sum + d.value, 0);

  const takeaway = isEmpty
    ? "No hay áreas que coincidan con los filtros"
    : `${filteredData[0]?.label} es el área más expuesta con ${Math.round(((filteredData[0]?.value || 0) / total) * 100)}% de las alertas`;

  const handleAreaClick = (item: RankingItem) => {
    setSelectedLabel(item.label);
    setSelectedIds([]);
    setDrilldownOpen(true);
  };

  const renderBars = (items: RankingItem[], compact: boolean) => (
    <TooltipProvider>
      <div className={compact ? "space-y-3" : "space-y-4"}>
        {items.map((item, index) => {
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
                  <div className={compact ? "h-3 bg-muted/30 rounded-full overflow-hidden" : "h-4 bg-muted/30 rounded-full overflow-hidden"}>
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
  );

  return (
    <>
      <AnalyticsBlock
        title="Exposición por Área de Negocio"
        takeaway={takeaway}
        infoTooltip="Desglose de alertas por área funcional del negocio. Combina perfil del cliente, autoridades y clasificación de impacto. Tu configuración se guarda automáticamente."
        timeframe={timeframe}
        source={source}
        isEmpty={isEmpty}
        icon={<Shield className="h-4 w-4 text-primary" />}
        filterDimensions={['search', 'impactLevels']}
        filterState={filterState}
        renderExpanded={() => (
          <div className="h-full w-full overflow-auto">{renderBars(filteredData, false)}</div>
        )}
        renderDataTable={() => (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Área</TableHead>
                  <TableHead>Severidad</TableHead>
                  <TableHead>Autoridades</TableHead>
                  <TableHead className="text-right">Alertas</TableHead>
                  <TableHead className="text-right">% del total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map(item => {
                  const severity = AREA_SEVERITY[item.label] || 'leve';
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.label}</TableCell>
                      <TableCell>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${SEVERITY_COLORS[severity]}`}>
                          {severity === 'grave' ? 'Alto' : severity === 'medio' ? 'Medio' : 'Bajo'}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {(AREA_AUTHORITIES[item.label] || []).join(', ') || '—'}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{item.value}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {Math.round((item.value / total) * 100)}%
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow className="bg-muted/30 font-semibold">
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell className="text-right tabular-nums">{total}</TableCell>
                  <TableCell className="text-right tabular-nums">100%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
        renderInsights={() => {
          const highExposure = filteredData.filter(d => AREA_SEVERITY[d.label] === 'grave');
          const top3Share = filteredData.slice(0, 3).reduce((s, d) => s + d.value, 0);
          return (
            <div className="space-y-3">
              <InsightCard icon={<Shield className="h-4 w-4" />} title="Resumen" body={takeaway} />
              {highExposure.length > 0 && (
                <InsightCard
                  icon={<AlertTriangle className="h-4 w-4" />}
                  title="Áreas de alto riesgo"
                  body={`${highExposure.length} área(s) con severidad alta: ${highExposure.map(a => a.label).join(', ')}.`}
                />
              )}
              <InsightCard
                icon={<Sparkles className="h-4 w-4" />}
                title="Concentración"
                body={`Las 3 áreas principales concentran ${Math.round((top3Share / total) * 100)}% de las alertas (${top3Share} de ${total}).`}
              />
              <p className="text-[11px] text-muted-foreground italic pt-2">
                Insights derivados de las áreas filtradas.
              </p>
            </div>
          );
        }}
      >
        {renderBars(filteredData, true)}
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
