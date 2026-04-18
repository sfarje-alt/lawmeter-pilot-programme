import * as React from "react";
import { AnalyticsBlock } from "../shared/AnalyticsBlock";
import { Activity, Clock, CheckCircle, FileText, Sparkles } from "lucide-react";
import type { KPIMetric } from "@/types/analytics";
import { useBlockFilters } from "@/hooks/useBlockFilters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

export function ServiceKPIsBlock({
  data,
  timeframe,
  source = "Métricas de servicio",
  onDrilldown,
}: ServiceKPIsBlockProps) {
  const filterState = useBlockFilters('service_kpis', { search: '' });

  // Filter KPIs by name search
  const filteredData = React.useMemo(() => {
    const q = (filterState.filters.search || '').trim().toLowerCase();
    if (!q) return data;
    return data.filter(k => k.label.toLowerCase().includes(q));
  }, [data, filterState.filters.search]);

  const isEmpty = filteredData.length === 0;

  const takeaway = isEmpty
    ? "No hay métricas que coincidan con tu búsqueda"
    : filteredData.length > 1
    ? `${filteredData[0].value} ${filteredData[0].label.toLowerCase()}, ${filteredData[1].value} ${filteredData[1].label.toLowerCase()}`
    : `${filteredData[0].value} ${filteredData[0].label.toLowerCase()}`;

  const renderKPIGrid = (items: KPIMetric[], compact: boolean) => (
    <div className={compact ? "grid grid-cols-3 gap-3" : "grid grid-cols-2 md:grid-cols-3 gap-4"}>
      {items.map((kpi) => {
        const Icon = KPI_ICONS[kpi.icon || 'activity'] || Activity;
        return (
          <div
            key={kpi.label}
            className={compact ? "text-center p-3 rounded-lg bg-muted/30" : "text-center p-5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"}
          >
            <div className="flex justify-center mb-2">
              <div className={compact ? "p-2 rounded-full bg-primary/10" : "p-3 rounded-full bg-primary/10"}>
                <Icon className={compact ? "h-4 w-4 text-primary" : "h-6 w-6 text-primary"} />
              </div>
            </div>
            <div className={compact ? "text-xl font-semibold text-foreground" : "text-3xl font-bold text-foreground"}>
              {kpi.value}
            </div>
            <div className={compact ? "text-xs text-muted-foreground mt-1" : "text-sm text-muted-foreground mt-2"}>
              {kpi.label}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <AnalyticsBlock
      title="Indicadores de Servicio"
      takeaway={takeaway}
      infoTooltip="Métricas de calidad operativa del servicio: tiempo de revisión, cobertura con comentario experto y cumplimiento de SLA. Tu configuración se guarda automáticamente."
      timeframe={timeframe}
      source={source}
      onDrilldown={onDrilldown}
      isEmpty={isEmpty}
      icon={<Activity className="h-4 w-4 text-primary" />}
      compact
      filterDimensions={['search']}
      filterState={filterState}
      renderExpanded={() => (
        <div className="h-full w-full overflow-auto p-4">{renderKPIGrid(filteredData, false)}</div>
      )}
      renderDataTable={() => (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Indicador</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map(k => (
                <TableRow key={k.label}>
                  <TableCell className="font-medium">{k.label}</TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">{k.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      renderInsights={() => (
        <div className="space-y-3">
          <InsightCard icon={<Activity className="h-4 w-4" />} title="Resumen" body={takeaway} />
          <InsightCard
            icon={<Sparkles className="h-4 w-4" />}
            title="Indicadores activos"
            body={`Estás monitoreando ${filteredData.length} indicador(es) de servicio. Cada KPI mide la calidad y consistencia de la cobertura.`}
          />
          <p className="text-[11px] text-muted-foreground italic pt-2">
            Filtra por nombre de indicador arriba para enfocar el análisis.
          </p>
        </div>
      )}
    >
      {renderKPIGrid(filteredData, true)}
    </AnalyticsBlock>
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
