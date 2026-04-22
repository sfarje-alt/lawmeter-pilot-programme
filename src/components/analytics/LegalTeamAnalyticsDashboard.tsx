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
import type { AnalyticsFilters, KPIMetric } from "@/types/analytics";
import { ANALYTICS_BLOCK_REGISTRY, type AnalyticsBlockConfigExtended } from "@/types/analytics";
import { ReportLayoutBuilder } from "@/components/reports/ReportLayoutBuilder";
import { cn } from "@/lib/utils";
import { useAlerts } from "@/contexts/AlertsContext";
import { useSesiones } from "@/hooks/useSesiones";

type SectionId = "general" | "bills" | "sessions" | "ops";

// ----- Helpers -----
function isoWeekStart(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatWeekLabel(d: Date): string {
  return d.toLocaleDateString("es-PE", { day: "numeric", month: "short" });
}

function periodCutoffDate(period: AnalyticsFilters["period"]): Date | null {
  const map: Record<string, number> = { last_7: 7, last_30: 30, last_60: 60, last_90: 90 };
  const days = map[period as string];
  if (!days) return null;
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

/**
 * Legal Team Analytics Dashboard — bound to live data:
 *  - useAlerts() for regulatory alerts
 *  - useSesiones() for Congress sessions
 *  - local pinned/archived state for ops metrics
 *
 * No mock or seeded data is used. Empty states are shown when there is no
 * underlying live data for a given metric.
 */
export function LegalTeamAnalyticsDashboard({ snapshotMode = false }: { snapshotMode?: boolean } = {}) {
  const [period, setPeriod] = React.useState<AnalyticsFilters["period"]>("all_time");
  const [customizeOpen, setCustomizeOpen] = React.useState(false);
  const [maximized, setMaximized] = React.useState<SectionId | null>(null);

  // Section-specific filters
  const [sessionsCommission, setSessionsCommission] = React.useState<string>("all");
  const [sessionsActuation, setSessionsActuation] = React.useState<string>("all");
  const [opsEditorialState, setOpsEditorialState] = React.useState<string>("all");
  const [opsAIState, setOpsAIState] = React.useState<string>("all");

  const [blockOrder, setBlockOrder] = React.useState<AnalyticsBlockConfigExtended[]>(() => {
    const buildDefault = () =>
      ANALYTICS_BLOCK_REGISTRY.map((block, index) => ({
        ...block,
        order: index,
        enabled: block.defaultEnabled,
        renderPDF: block.defaultEnabled,
        renderDashboard: true,
      }));

    try {
      const saved = localStorage.getItem("analytics-dashboard-layout-v2");
      if (saved) {
        const parsed: AnalyticsBlockConfigExtended[] = JSON.parse(saved);
        const byKey = new Map(parsed.map((b) => [b.key, b]));
        return ANALYTICS_BLOCK_REGISTRY.map((block, index) => {
          const prev = byKey.get(block.key);
          return {
            ...block,
            order: prev?.order ?? index,
            enabled: prev?.enabled ?? block.defaultEnabled,
            renderPDF: prev?.renderPDF ?? block.defaultEnabled,
            renderDashboard: prev?.renderDashboard ?? true,
          };
        });
      }
    } catch {}
    return buildDefault();
  });

  const handleBlockOrderChange = (newBlocks: AnalyticsBlockConfigExtended[]) => {
    setBlockOrder(newBlocks);
    localStorage.setItem("analytics-dashboard-layout-v2", JSON.stringify(newBlocks));
  };

  // ---------- Live data sources ----------
  const { alerts: liveAlerts } = useAlerts();
  const { sesiones: liveSesiones } = useSesiones({ onlyDeInteres: false });

  // Apply page-level period filter to alerts
  const periodCutoff = React.useMemo(() => periodCutoffDate(period), [period]);
  const alerts = React.useMemo(() => {
    if (!periodCutoff) return liveAlerts;
    const cutoffMs = periodCutoff.getTime();
    return liveAlerts.filter((a) => {
      const ref = new Date(a.created_at || a.updated_at || a.publication_date || a.project_date || 0).getTime();
      return ref >= cutoffMs;
    });
  }, [liveAlerts, periodCutoff]);

  const sesiones = React.useMemo(() => {
    if (!periodCutoff) return liveSesiones;
    const cutoffMs = periodCutoff.getTime();
    return liveSesiones.filter((s) => {
      const t = new Date(s.scheduled_at || s.created_at || 0).getTime();
      return t >= cutoffMs;
    });
  }, [liveSesiones, periodCutoff]);

  // ---------- Derived: Sessions blocks ----------
  const sessionsByCommissionData = React.useMemo(() => {
    const map = new Map<string, number>();
    sesiones.forEach((s) => {
      const key = s.commission_name || "Sin comisión";
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return Array.from(map.entries()).map(([commission, count]) => ({ commission, sessions: count }));
  }, [sesiones]);

  const sessionsTemporalData = React.useMemo(() => {
    const buckets = new Map<string, { date: string; sessions: number; sortKey: number }>();
    sesiones.forEach((s) => {
      const ref = s.scheduled_at || s.created_at;
      if (!ref) return;
      const wk = isoWeekStart(new Date(ref));
      const key = wk.toISOString();
      const label = formatWeekLabel(wk);
      const existing = buckets.get(key);
      if (existing) existing.sessions += 1;
      else buckets.set(key, { date: label, sessions: 1, sortKey: wk.getTime() });
    });
    return Array.from(buckets.values()).sort((a, b) => a.sortKey - b.sortKey).map(({ date, sessions }) => ({ date, sessions }));
  }, [sesiones]);

  const sessionAgendaTypeData = React.useMemo(() => {
    const map = new Map<string, number>();
    const labelMap: Record<string, string> = {
      NOT_REQUESTED: "Sin analizar",
      REQUESTED: "Solicitado",
      PROCESSING: "En proceso",
      COMPLETED: "Analizado",
      FAILED: "Falló",
    };
    sesiones.forEach((s) => {
      const label = labelMap[s.analysis_status] || "Sin analizar";
      map.set(label, (map.get(label) ?? 0) + 1);
    });
    return Array.from(map.entries()).map(([type, value]) => ({ type, value }));
  }, [sesiones]);

  const sessionTopicsData = React.useMemo(() => {
    const map = new Map<string, number>();
    sesiones.forEach((s) => {
      (s.area_de_interes || []).forEach((area) => {
        if (!area) return;
        map.set(area, (map.get(area) ?? 0) + 1);
      });
    });
    return Array.from(map.entries()).map(([topic, mentions]) => ({ topic, mentions }));
  }, [sesiones]);

  const sessionRecurringBillsData = React.useMemo(() => {
    return sessionsByCommissionData
      .map((item) => ({
        code: item.commission.slice(0, 16).toUpperCase(),
        title: item.commission,
        sessions: item.sessions,
      }))
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 10);
  }, [sessionsByCommissionData]);

  // ---------- Derived: Ops blocks ----------
  // Reviewed alerts: weekly count of alerts that have a real `updated_at`
  // newer than `created_at` (i.e. someone interacted) OR are pinned/archived.
  const reviewedAlertsData = React.useMemo(() => {
    const buckets = new Map<string, { week: string; reviewed: number; sortKey: number }>();
    alerts.forEach((a) => {
      const wasReviewed =
        !!a.is_pinned_for_publication ||
        !!a.archived_at ||
        (a.updated_at && a.created_at && a.updated_at !== a.created_at);
      if (!wasReviewed) return;
      const ref = a.updated_at || a.created_at;
      if (!ref) return;
      const wk = isoWeekStart(new Date(ref));
      const key = wk.toISOString();
      const label = formatWeekLabel(wk);
      const existing = buckets.get(key);
      if (existing) existing.reviewed += 1;
      else buckets.set(key, { week: label, reviewed: 1, sortKey: wk.getTime() });
    });
    return Array.from(buckets.values()).sort((a, b) => a.sortKey - b.sortKey).map(({ week, reviewed }) => ({ week, reviewed }));
  }, [alerts]);

  // AI usage: derived from real sesiones — transcription requested vs analysis completed.
  const aiUsageData = React.useMemo(() => {
    const buckets = new Map<string, { week: string; transcript: number; chatbot: number; sortKey: number }>();
    sesiones.forEach((s) => {
      const ref = s.analysis_requested_at || s.scheduled_at || s.created_at;
      if (!ref) return;
      const wk = isoWeekStart(new Date(ref));
      const key = wk.toISOString();
      const label = formatWeekLabel(wk);
      const existing = buckets.get(key) ?? { week: label, transcript: 0, chatbot: 0, sortKey: wk.getTime() };
      if (s.analysis_requested_at) existing.transcript += 1;
      if (s.analysis_status === "COMPLETED") existing.chatbot += 1;
      buckets.set(key, existing);
    });
    return Array.from(buckets.values())
      .sort((a, b) => a.sortKey - b.sortKey)
      .map(({ week, transcript, chatbot }) => ({ week, transcript, chatbot }));
  }, [sesiones]);

  // Detection → action: sesiones avg hours from created_at to analysis_requested_at and analysis_completed_at
  const detectionToActionData = React.useMemo(() => {
    const buckets = new Map<string, { week: string; openSum: number; openN: number; pinSum: number; pinN: number; sortKey: number }>();
    sesiones.forEach((s) => {
      if (!s.created_at) return;
      const created = new Date(s.created_at).getTime();
      const wk = isoWeekStart(new Date(s.created_at));
      const key = wk.toISOString();
      const label = formatWeekLabel(wk);
      const b = buckets.get(key) ?? { week: label, openSum: 0, openN: 0, pinSum: 0, pinN: 0, sortKey: wk.getTime() };
      if (s.analysis_requested_at) {
        b.openSum += (new Date(s.analysis_requested_at).getTime() - created) / 3_600_000;
        b.openN += 1;
      }
      if (s.analysis_completed_at) {
        b.pinSum += (new Date(s.analysis_completed_at).getTime() - created) / 3_600_000;
        b.pinN += 1;
      }
      buckets.set(key, b);
    });
    return Array.from(buckets.values())
      .filter((b) => b.openN > 0 || b.pinN > 0)
      .sort((a, b) => a.sortKey - b.sortKey)
      .map((b) => ({
        week: b.week,
        openHrs: b.openN ? Math.max(0, b.openSum / b.openN) : 0,
        pinHrs: b.pinN ? Math.max(0, b.pinSum / b.pinN) : 0,
      }));
  }, [sesiones]);

  // Reports generated: not tracked client-side yet → empty state.
  const reportsGeneratedData = React.useMemo(() => [] as { week: string; reports: number; alertsUsed: number }[], []);

  // Editorial response time: derived from alerts (updated_at - created_at when there's any interaction)
  const editorialResponseTimeData = React.useMemo(() => {
    const weekly = new Map<string, { date: string; sum: number; n: number; sortKey: number }>();
    alerts.forEach((a) => {
      if (!a.created_at || !a.updated_at) return;
      const created = new Date(a.created_at).getTime();
      const updated = new Date(a.updated_at).getTime();
      if (updated <= created) return;
      const hours = (updated - created) / 3_600_000;
      const wk = isoWeekStart(new Date(a.created_at));
      const key = wk.toISOString();
      const label = wk.toISOString().slice(0, 10);
      const existing = weekly.get(key) ?? { date: label, sum: 0, n: 0, sortKey: wk.getTime() };
      existing.sum += hours;
      existing.n += 1;
      weekly.set(key, existing);
    });
    const trend = Array.from(weekly.values())
      .sort((a, b) => a.sortKey - b.sortKey)
      .map(({ date, sum, n }) => ({ date, value: Math.round(sum / n) }));
    if (trend.length === 0) return { avgHours: 0, medianHours: 0, weeklyTrend: [] };
    const values = trend.map((t) => t.value).sort((a, b) => a - b);
    return {
      avgHours: Math.round(values.reduce((s, v) => s + v, 0) / values.length),
      medianHours: values[Math.floor(values.length / 2)],
      weeklyTrend: trend,
    };
  }, [alerts]);

  // Service KPIs: derived from real alerts state
  const serviceKpisData = React.useMemo<KPIMetric[]>(() => {
    const total = alerts.length;
    const reviewed = alerts.filter(
      (a) => !!a.is_pinned_for_publication || !!a.archived_at || (a.updated_at && a.updated_at !== a.created_at),
    ).length;
    const withCommentary = alerts.filter((a) => (a.expert_commentary || "").trim().length > 0).length;
    const withTags = alerts.filter((a) => (a.affected_areas || []).length > 0).length;
    const pct = (n: number) => (total > 0 ? `${Math.round((n / total) * 100)}%` : "0%");
    return [
      { label: "Alertas Revisadas", value: String(reviewed), icon: "check-circle" },
      { label: "Comentarios Añadidos", value: String(withCommentary), icon: "file-text" },
      { label: "% Con Comentario", value: pct(withCommentary), icon: "activity" },
      { label: "% Con Tags", value: pct(withTags), icon: "clock" },
    ];
  }, [alerts]);

  const timeframeLabel =
    {
      all_time: "Todo el período",
      last_7: "Últimos 7 días",
      last_30: "Últimos 30 días",
      last_60: "Últimos 60 días",
      last_90: "Últimos 90 días",
    }[period as string] || (period as string);

  const isEnabled = (key: string) => {
    const block = blockOrder.find((b) => b.key === key);
    return block ? block.enabled : true;
  };

  const isHidden = (section: SectionId) => maximized !== null && maximized !== section;

  const handleMaximize = (section: SectionId) => (next: boolean) => {
    setMaximized(next ? section : null);
  };

  const freshness = React.useMemo(() => {
    const lastAlert = liveAlerts.reduce<string | null>((acc, a) => {
      const t = a.updated_at || a.created_at || null;
      if (!t) return acc;
      return acc == null || t > acc ? t : acc;
    }, null);
    const lastSession = liveSesiones.reduce<string | null>((acc, s) => {
      const t = s.updated_at || s.created_at || null;
      if (!t) return acc;
      return acc == null || t > acc ? t : acc;
    }, null);
    const lastUpdate = [lastAlert, lastSession].filter(Boolean).sort().pop() || new Date().toISOString();
    return { lastUpdate, dataThrough: lastUpdate.slice(0, 10) };
  }, [liveAlerts, liveSesiones]);

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
          <Select value={period} onValueChange={(v) => setPeriod(v as AnalyticsFilters["period"])}>
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

          <DataFreshnessIndicator lastUpdate={freshness.lastUpdate} dataThrough={freshness.dataThrough} />
        </div>
      </div>

      {/* ========== SECTION 1: General ========== */}
      <div className={cn("transition-all", isHidden("general") && "hidden")}>
        <CollapsibleAnalyticsSection
          id="section-general"
          title="General"
          description="Vista de servicio y matriz de impacto consolidada."
          icon={<LayoutGrid className="h-4 w-4" />}
          defaultOpen={snapshotMode}
          isMaximized={maximized === "general"}
          onMaximizeChange={handleMaximize("general")}
        >
          <div className="space-y-6">
            {isEnabled("impact_matrix") && (
              <ImpactMatrixBlock alerts={alerts} timeframe={timeframeLabel} />
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
          defaultOpen={snapshotMode}
          isMaximized={maximized === "bills"}
          onMaximizeChange={handleMaximize("bills")}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {isEnabled("regulatory_pulse") && (
              <RegulatoryPulseBlock alerts={alerts} timeframe={timeframeLabel} />
            )}
            {isEnabled("alert_priority") && (
              <AlertPriorityBlock alerts={alerts} timeframe={timeframeLabel} />
            )}
            {isEnabled("alert_distribution") && (
              <AlertDistributionBlock alerts={alerts} timeframe={timeframeLabel} showByArea />
            )}
            {isEnabled("legislative_funnel") && (
              <LegislativeFunnelBlock alerts={alerts} timeframe={timeframeLabel} />
            )}
            {isEnabled("top_entities") && (
              <TopEntitiesBlock alerts={alerts} timeframe={timeframeLabel} maxItems={7} />
            )}
            {isEnabled("popular_topics") && (
              <PopularTopicsBlock alerts={alerts} timeframe={timeframeLabel} maxItems={7} />
            )}
            {isEnabled("key_movements") && <KeyMovementsBlock timeframe={timeframeLabel} />}
            {isEnabled("emerging_topics") && <EmergingTopicsBlock timeframe={timeframeLabel} />}
            {isEnabled("exposure") && <ExposureBlock timeframe={timeframeLabel} />}
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
          defaultOpen={snapshotMode}
          isMaximized={maximized === "sessions"}
          onMaximizeChange={handleMaximize("sessions")}
          filters={
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Filtros de sección:</span>
              <Select value={sessionsCommission} onValueChange={setSessionsCommission}>
                <SelectTrigger className="w-[200px] h-8 text-xs">
                  <SelectValue placeholder="Comisión" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las comisiones</SelectItem>
                  {sessionsByCommissionData.map((c) => (
                    <SelectItem key={c.commission} value={c.commission}>
                      {c.commission}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sessionsActuation} onValueChange={setSessionsActuation}>
                <SelectTrigger className="w-[180px] h-8 text-xs">
                  <SelectValue placeholder="Estado de análisis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="NOT_REQUESTED">Sin analizar</SelectItem>
                  <SelectItem value="REQUESTED">Solicitado</SelectItem>
                  <SelectItem value="PROCESSING">En proceso</SelectItem>
                  <SelectItem value="COMPLETED">Analizado</SelectItem>
                  <SelectItem value="FAILED">Falló</SelectItem>
                </SelectContent>
              </Select>
            </div>
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {isEnabled("sessions_by_commission") && (
              <SessionsByCommissionBlock timeframe={timeframeLabel} data={sessionsByCommissionData} />
            )}
            {isEnabled("sessions_temporal_evolution") && (
              <SessionsTemporalEvolutionBlock timeframe={timeframeLabel} data={sessionsTemporalData} />
            )}
            {isEnabled("session_agenda_type") && (
              <SessionAgendaTypeBlock timeframe={timeframeLabel} data={sessionAgendaTypeData} />
            )}
            {isEnabled("session_topics") && (
              <SessionTopicsBlock timeframe={timeframeLabel} data={sessionTopicsData} />
            )}
            {isEnabled("session_recurring_bills") && (
              <div className="lg:col-span-2">
                <SessionRecurringBillsBlock timeframe={timeframeLabel} data={sessionRecurringBillsData} />
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
          defaultOpen={snapshotMode}
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
                  <SelectItem value="pinned">Pineada</SelectItem>
                  <SelectItem value="archived">Archivada</SelectItem>
                  <SelectItem value="reviewed">Revisada</SelectItem>
                </SelectContent>
              </Select>
              <Select value={opsAIState} onValueChange={setOpsAIState}>
                <SelectTrigger className="w-[170px] h-8 text-xs">
                  <SelectValue placeholder="Estado IA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todo el uso de IA</SelectItem>
                  <SelectItem value="transcription">Con transcripción</SelectItem>
                  <SelectItem value="chatbot">Con análisis</SelectItem>
                  <SelectItem value="none">Sin uso de IA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {isEnabled("editorial_response_time") && (
              <EditorialResponseTimeBlock timeframe={timeframeLabel} data={editorialResponseTimeData} />
            )}
            {isEnabled("pin_archive") && <PinnedArchivedBlock timeframe={timeframeLabel} />}
            {isEnabled("reviewed_alerts") && (
              <ReviewedAlertsBlock timeframe={timeframeLabel} data={reviewedAlertsData} />
            )}
            {isEnabled("detection_to_action_time") && (
              <DetectionToActionTimeBlock timeframe={timeframeLabel} data={detectionToActionData} />
            )}
            {isEnabled("ai_usage") && <AIUsageBlock timeframe={timeframeLabel} data={aiUsageData} />}
            {isEnabled("reports_generated") && (
              <ReportsGeneratedBlock timeframe={timeframeLabel} data={reportsGeneratedData} />
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
