import * as React from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings2, LayoutGrid, FileText, Mic, Wrench } from "lucide-react";
import {
  DataFreshnessIndicator,
  CollapsibleAnalyticsSection,
} from "./shared";
import {
  ImpactMatrixBlock,
  RegulatoryPulseBlock,
  LegislativeFunnelBlock,
  TopEntitiesBlock,
  AlertDistributionBlock,
  AlertPriorityBlock,
  ServiceKPIsBlock,
  PopularTopicsBlock,
  KeyMovementsBlock,
  EmergingTopicsBlock,
  ExposureBlock,
  EditorialResponseTimeBlock,
  PinnedArchivedBlock,
} from "./blocks";
import {
  SessionsByCommissionBlock,
  SessionsTemporalEvolutionBlock,
  SessionAgendaTypeBlock,
  SessionTopicsBlock,
  SessionRecurringBillsBlock,
} from "./blocks/sessions";
import {
  DetectionToActionTimeBlock,
  AIUsageBlock,
  ReportsGeneratedBlock,
  ReviewedAlertsBlock,
} from "./blocks/ops";
import {
  DEMO_DATA_FRESHNESS,
  getDemoDataForClient,
} from "@/lib/analyticsMockData";
import type { AnalyticsFilters } from "@/types/analytics";

import { ReportLayoutBuilder } from "@/components/reports/ReportLayoutBuilder";
import { ANALYTICS_BLOCK_REGISTRY, type AnalyticsBlockConfigExtended } from "@/types/analytics";
import { cn } from "@/lib/utils";

type SectionId = "general" | "bills" | "sessions" | "ops";

/**
 * Legal Team Analytics Dashboard — reorganized into 4 collapsible/maximizable sections:
 *  1. General
 *  2. Proyectos de ley y normas
 *  3. Sesiones del Congreso
 *  4. Operaciones internas
 *
 * The opened-analytic experience (AnalyticsBlock + expanded modal with
 * Visualización / Datos / Insights IA tabs, filters, footer "Ver alertas")
 * is preserved untouched. Only the page-level structure changed.
 */
export function LegalTeamAnalyticsDashboard() {
  const [period, setPeriod] = React.useState<AnalyticsFilters['period']>('all_time');
  const [customizeOpen, setCustomizeOpen] = React.useState(false);
  const [maximized, setMaximized] = React.useState<SectionId | null>(null);

  // Section-specific filters
  const [sessionsCommission, setSessionsCommission] = React.useState<string>("all");
  const [sessionsActuation, setSessionsActuation] = React.useState<string>("all");
  const [opsEditorialState, setOpsEditorialState] = React.useState<string>("all");
  const [opsAIState, setOpsAIState] = React.useState<string>("all");

  const [blockOrder, setBlockOrder] = React.useState<AnalyticsBlockConfigExtended[]>(() => {
    try {
      const saved = localStorage.getItem('analytics-dashboard-layout-v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return ANALYTICS_BLOCK_REGISTRY.map((block, index) => ({
      ...block,
      order: index,
      enabled: block.defaultEnabled,
      renderPDF: block.defaultEnabled,
      renderDashboard: true,
    }));
  });

  const handleBlockOrderChange = (newBlocks: AnalyticsBlockConfigExtended[]) => {
    setBlockOrder(newBlocks);
    localStorage.setItem('analytics-dashboard-layout-v2', JSON.stringify(newBlocks));
  };

  const freshness = DEMO_DATA_FRESHNESS;
  const demoData = React.useMemo(() => getDemoDataForClient('all'), []);

  const timeframeLabel = {
    'all_time': 'Todo el período',
    'last_7': 'Últimos 7 días',
    'last_30': 'Últimos 30 días',
    'last_60': 'Últimos 60 días',
    'last_90': 'Últimos 90 días',
  }[period] || period;

  const isEnabled = (key: string) => {
    const block = blockOrder.find(b => b.key === key);
    return block ? block.enabled : true;
  };

  const isHidden = (section: SectionId) => maximized !== null && maximized !== section;

  const handleMaximize = (section: SectionId) => (next: boolean) => {
    setMaximized(next ? section : null);
  };

  return (
    <div className="space-y-6">
      {/* Header — Layer 1: Global filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analíticas</h1>
          <p className="text-sm text-muted-foreground">
            Inteligencia regulatoria — explora cada sección, aplica filtros y guarda tu configuración.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Select value={period} onValueChange={(v) => setPeriod(v as AnalyticsFilters['period'])}>
            <SelectTrigger className="w-[170px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_time">Todo el período</SelectItem>
              <SelectItem value="last_7">Últimos 7 días</SelectItem>
              <SelectItem value="last_30">Últimos 30 días</SelectItem>
              <SelectItem value="last_60">Últimos 60 días</SelectItem>
              <SelectItem value="last_90">Últimos 90 días</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={() => setCustomizeOpen(true)}>
            <Settings2 className="h-4 w-4 mr-2" />
            Personalizar
          </Button>

          <DataFreshnessIndicator
            lastUpdate={freshness.lastUpdate}
            dataThrough={freshness.dataThrough}
          />
        </div>
      </div>

      {/* ========== SECTION 1: General ========== */}
      <div className={cn("transition-all", isHidden("general") && "hidden")}>
        <CollapsibleAnalyticsSection
          id="section-general"
          title="General"
          description="Vista de servicio y matriz de impacto consolidada."
          icon={<LayoutGrid className="h-4 w-4" />}
          isMaximized={maximized === "general"}
          onMaximizeChange={handleMaximize("general")}
        >
          <div className="space-y-6">
            {isEnabled('service_kpis') && (
              <ServiceKPIsBlock data={demoData.serviceKpis} timeframe={timeframeLabel} />
            )}
            {isEnabled('impact_matrix') && (
              <ImpactMatrixBlock alerts={[]} timeframe={timeframeLabel} demoData={demoData.impactMatrix} />
            )}
          </div>
        </CollapsibleAnalyticsSection>
      </div>

      {/* ========== SECTION 2: Proyectos de ley y normas ========== */}
      <div className={cn("transition-all", isHidden("bills") && "hidden")}>
        <CollapsibleAnalyticsSection
          id="section-bills"
          title="Proyectos de ley y normas"
          description="Pulso regulatorio, prioridad, distribución y embudo legislativo."
          icon={<FileText className="h-4 w-4" />}
          isMaximized={maximized === "bills"}
          onMaximizeChange={handleMaximize("bills")}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {isEnabled('regulatory_pulse') && (
              <RegulatoryPulseBlock alerts={[]} timeframe={timeframeLabel} demoData={demoData.regulatoryPulse} />
            )}
            {isEnabled('alert_priority') && (
              <AlertPriorityBlock alerts={[]} timeframe={timeframeLabel} demoData={demoData.alertPriority} />
            )}
            {isEnabled('alert_distribution') && (
              <AlertDistributionBlock alerts={[]} timeframe={timeframeLabel} showByArea demoData={demoData.alertDistribution} />
            )}
            {isEnabled('legislative_funnel') && (
              <LegislativeFunnelBlock alerts={[]} timeframe={timeframeLabel} demoData={demoData.legislativeFunnel} />
            )}
            {isEnabled('top_entities') && (
              <TopEntitiesBlock alerts={[]} timeframe={timeframeLabel} maxItems={7} demoData={demoData.topEntities} />
            )}
            {isEnabled('popular_topics') && (
              <PopularTopicsBlock alerts={[]} timeframe={timeframeLabel} maxItems={7} demoData={demoData.popularTopics} />
            )}
            {isEnabled('key_movements') && (
              <KeyMovementsBlock timeframe={timeframeLabel} demoData={demoData.keyMovements} />
            )}
            {isEnabled('emerging_topics') && (
              <EmergingTopicsBlock timeframe={timeframeLabel} />
            )}
            {isEnabled('exposure') && (
              <ExposureBlock timeframe={timeframeLabel} demoData={demoData.exposure} />
            )}
          </div>
        </CollapsibleAnalyticsSection>
      </div>

      {/* ========== SECTION 3: Sesiones del Congreso ========== */}
      <div className={cn("transition-all", isHidden("sessions") && "hidden")}>
        <CollapsibleAnalyticsSection
          id="section-sessions"
          title="Sesiones del Congreso"
          description="Comportamiento de las sesiones, agenda y materias temáticas."
          icon={<Mic className="h-4 w-4" />}
          isMaximized={maximized === "sessions"}
          onMaximizeChange={handleMaximize("sessions")}
          filters={
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Filtros de sección:</span>
              <Select value={sessionsCommission} onValueChange={setSessionsCommission}>
                <SelectTrigger className="w-[170px] h-8 text-xs">
                  <SelectValue placeholder="Comisión" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las comisiones</SelectItem>
                  <SelectItem value="constitucion">Constitución</SelectItem>
                  <SelectItem value="economia">Economía</SelectItem>
                  <SelectItem value="salud">Salud</SelectItem>
                  <SelectItem value="trabajo">Trabajo</SelectItem>
                  <SelectItem value="educacion">Educación</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sessionsActuation} onValueChange={setSessionsActuation}>
                <SelectTrigger className="w-[180px] h-8 text-xs">
                  <SelectValue placeholder="Tipo de actuación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las actuaciones</SelectItem>
                  <SelectItem value="presentacion">Presentación</SelectItem>
                  <SelectItem value="debate">Debate</SelectItem>
                  <SelectItem value="votacion">Votación</SelectItem>
                  <SelectItem value="predictamen">Predictamen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {isEnabled('sessions_by_commission') && (
              <SessionsByCommissionBlock timeframe={timeframeLabel} />
            )}
            {isEnabled('sessions_temporal_evolution') && (
              <SessionsTemporalEvolutionBlock timeframe={timeframeLabel} />
            )}
            {isEnabled('session_agenda_type') && (
              <SessionAgendaTypeBlock timeframe={timeframeLabel} />
            )}
            {isEnabled('session_topics') && (
              <SessionTopicsBlock timeframe={timeframeLabel} />
            )}
            {isEnabled('session_recurring_bills') && (
              <div className="lg:col-span-2">
                <SessionRecurringBillsBlock timeframe={timeframeLabel} />
              </div>
            )}
          </div>
        </CollapsibleAnalyticsSection>
      </div>

      {/* ========== SECTION 4: Operaciones internas ========== */}
      <div className={cn("transition-all", isHidden("ops") && "hidden")}>
        <CollapsibleAnalyticsSection
          id="section-ops"
          title="Operaciones internas"
          description="Productividad editorial, cola de revisión y uso de IA."
          icon={<Wrench className="h-4 w-4" />}
          badge="Solo Interno"
          isMaximized={maximized === "ops"}
          onMaximizeChange={handleMaximize("ops")}
          filters={
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Filtros de sección:</span>
              <Select value={opsEditorialState} onValueChange={setOpsEditorialState}>
                <SelectTrigger className="w-[170px] h-8 text-xs">
                  <SelectValue placeholder="Estado editorial" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="reviewed">Revisada</SelectItem>
                  <SelectItem value="pinned">Pineada</SelectItem>
                  <SelectItem value="archived">Archivada</SelectItem>
                  <SelectItem value="published">Publicada</SelectItem>
                </SelectContent>
              </Select>
              <Select value={opsAIState} onValueChange={setOpsAIState}>
                <SelectTrigger className="w-[170px] h-8 text-xs">
                  <SelectValue placeholder="Estado IA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todo el uso de IA</SelectItem>
                  <SelectItem value="transcription">Con transcripción</SelectItem>
                  <SelectItem value="chatbot">Con chatbot</SelectItem>
                  <SelectItem value="none">Sin uso de IA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {isEnabled('editorial_response_time') && (
              <EditorialResponseTimeBlock timeframe={timeframeLabel} />
            )}
            {isEnabled('pin_archive') && (
              <PinnedArchivedBlock timeframe={timeframeLabel} />
            )}
            {isEnabled('reviewed_alerts') && (
              <ReviewedAlertsBlock timeframe={timeframeLabel} />
            )}
            {isEnabled('detection_to_action_time') && (
              <DetectionToActionTimeBlock timeframe={timeframeLabel} />
            )}
            {isEnabled('ai_usage') && (
              <AIUsageBlock timeframe={timeframeLabel} />
            )}
            {isEnabled('reports_generated') && (
              <ReportsGeneratedBlock timeframe={timeframeLabel} />
            )}
          </div>
        </CollapsibleAnalyticsSection>
      </div>

      {/* Customize Side Sheet */}
      <Sheet open={customizeOpen} onOpenChange={setCustomizeOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-[640px] md:max-w-[720px] lg:max-w-[820px] p-0 flex flex-col"
        >
          <SheetHeader className="px-6 py-4 border-b border-border flex-shrink-0">
            <SheetTitle className="text-lg">Personalizar Dashboard</SheetTitle>
            <SheetDescription>
              Arrastra para reordenar los bloques. Usa los toggles para mostrar u ocultar cada análisis.
              Tus preferencias se guardan automáticamente.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-6">
            <ReportLayoutBuilder
              blocks={blockOrder}
              onChange={handleBlockOrderChange}
              showInternalBlocks
              mode="dashboard"
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
