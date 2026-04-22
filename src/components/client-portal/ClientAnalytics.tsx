import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, Settings2, LayoutGrid, FileText, Mic, Wrench } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useClientUser } from "@/hooks/useClientUser";
import { MOCK_CLIENTS } from "@/data/peruAlertsMockData";
import {
  ImpactMatrixBlock,
  RegulatoryPulseBlock,
  AlertPriorityBlock,
  AlertDistributionBlock,
  TopEntitiesBlock,
  LegislativeFunnelBlock,
  PopularTopicsBlock,
  IndustryBenchmarkBlock,
  KeyMovementsBlock,
  EmergingTopicsBlock,
  ExposureBlock,
  EditorialResponseTimeBlock,
  PinnedArchivedBlock,
} from "@/components/analytics/blocks";
import {
  SessionsByCommissionBlock,
  SessionsTemporalEvolutionBlock,
  SessionAgendaTypeBlock,
} from "@/components/analytics/blocks/sessions";
import {
  ReviewedAlertsBlock,
  DetectionToActionTimeBlock,
} from "@/components/analytics/blocks/ops";
import { DataFreshnessIndicator, CollapsibleAnalyticsSection } from "@/components/analytics/shared";
import { ReportLayoutBuilder } from "@/components/reports/ReportLayoutBuilder";
import { useAlerts } from "@/contexts/AlertsContext";
import { useSesiones } from "@/hooks/useSesiones";
import { CLIENT_ANALYTICS_BLOCKS, type AnalyticsBlockConfigExtended } from "@/types/analytics";
import type { KPIMetric } from "@/types/analytics";

type PeriodFilter = "7d" | "30d" | "90d" | "all";

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
function periodCutoffDate(p: PeriodFilter): Date | null {
  const map: Record<PeriodFilter, number | null> = { "7d": 7, "30d": 30, "90d": 90, all: null };
  const days = map[p];
  if (!days) return null;
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

/**
 * Client Portal Analytics — bound to live data, filtered for the current client.
 *  - useAlerts() filtered to alerts published/pinned for this client
 *  - useSesiones() filtered for this client
 *  - 4 sections: General / Proyectos / Sesiones / Operaciones
 *  - Per-section local filters
 *  - Read-only badge; no internal AI/cost detail
 */
export function ClientAnalytics() {
  const { clientId, clientName } = useClientUser();
  const [period, setPeriod] = React.useState<PeriodFilter>("all");
  const [customizeOpen, setCustomizeOpen] = React.useState(false);

  // Per-section filters
  const [sessionsCommission, setSessionsCommission] = React.useState<string>("all");
  const [sessionsActuation, setSessionsActuation] = React.useState<string>("all");
  const [opsEditorialState, setOpsEditorialState] = React.useState<string>("all");

  // Block layout (persisted per client portal)
  const [blockOrder, setBlockOrder] = React.useState<AnalyticsBlockConfigExtended[]>(() => {
    try {
      const saved = localStorage.getItem("client-analytics-layout-v2");
      if (saved) return JSON.parse(saved);
    } catch {}
    return CLIENT_ANALYTICS_BLOCKS.map((block, index) => ({
      ...block,
      order: index,
      enabled: block.renderDashboard,
    }));
  });

  const handleBlockOrderChange = (newBlocks: AnalyticsBlockConfigExtended[]) => {
    setBlockOrder(newBlocks);
    localStorage.setItem("client-analytics-layout-v2", JSON.stringify(newBlocks));
  };

  const isEnabled = (key: string) => {
    const block = blockOrder.find((b) => b.key === key);
    return block ? block.enabled : true;
  };

  const timeframeLabel: Record<PeriodFilter, string> = {
    "7d": "Últimos 7 días",
    "30d": "Últimos 30 días",
    "90d": "Últimos 90 días",
    all: "Todo el período",
  };

  const clientSector = React.useMemo(() => {
    const client = MOCK_CLIENTS.find((c) => c.id === clientId);
    return client?.sector || "Salud";
  }, [clientId]);

  // ---------- Live data sources ----------
  const { alerts: liveAlerts } = useAlerts();
  const { sesiones: liveSesiones } = useSesiones({ onlyDeInteres: false });

  // Client filter: only alerts published/pinned for this client (read-only portal)
  const clientAlertsAll = React.useMemo(() => {
    if (!clientId) return liveAlerts;
    return liveAlerts.filter((a: any) => {
      const inComments = Array.isArray(a.client_commentaries)
        ? a.client_commentaries.some((c: any) => c?.client_id === clientId)
        : false;
      const isClientAlert = a.client_id === clientId;
      const isPublished = a.status === "published";
      return inComments || (isClientAlert && isPublished);
    });
  }, [liveAlerts, clientId]);

  const clientSesionesAll = React.useMemo(() => {
    if (!clientId) return liveSesiones;
    return liveSesiones.filter((s: any) => s.client_id === clientId);
  }, [liveSesiones, clientId]);

  // Apply page-level period
  const periodCutoff = React.useMemo(() => periodCutoffDate(period), [period]);
  const alerts = React.useMemo(() => {
    if (!periodCutoff) return clientAlertsAll;
    const cutoffMs = periodCutoff.getTime();
    return clientAlertsAll.filter((a: any) => {
      const ref = new Date(
        a.created_at || a.updated_at || a.publication_date || a.project_date || 0,
      ).getTime();
      return ref >= cutoffMs;
    });
  }, [clientAlertsAll, periodCutoff]);

  const sesiones = React.useMemo(() => {
    if (!periodCutoff) return clientSesionesAll;
    const cutoffMs = periodCutoff.getTime();
    return clientSesionesAll.filter((s: any) => {
      const t = new Date(s.scheduled_at || s.created_at || 0).getTime();
      return t >= cutoffMs;
    });
  }, [clientSesionesAll, periodCutoff]);

  // ---------- Derived: Sessions blocks ----------
  const sessionsByCommissionData = React.useMemo(() => {
    const map = new Map<string, number>();
    sesiones.forEach((s: any) => {
      const key = s.commission_name || "Sin comisión";
      if (sessionsCommission !== "all" && key !== sessionsCommission) return;
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return Array.from(map.entries()).map(([commission, count]) => ({ commission, sessions: count }));
  }, [sesiones, sessionsCommission]);

  const sessionsTemporalData = React.useMemo(() => {
    const buckets = new Map<string, { date: string; sessions: number; sortKey: number }>();
    sesiones.forEach((s: any) => {
      if (sessionsCommission !== "all" && s.commission_name !== sessionsCommission) return;
      const ref = s.scheduled_at || s.created_at;
      if (!ref) return;
      const wk = isoWeekStart(new Date(ref));
      const key = wk.toISOString();
      const label = formatWeekLabel(wk);
      const existing = buckets.get(key);
      if (existing) existing.sessions += 1;
      else buckets.set(key, { date: label, sessions: 1, sortKey: wk.getTime() });
    });
    return Array.from(buckets.values())
      .sort((a, b) => a.sortKey - b.sortKey)
      .map(({ date, sessions }) => ({ date, sessions }));
  }, [sesiones, sessionsCommission]);

  const sessionAgendaTypeData = React.useMemo(() => {
    const map = new Map<string, number>();
    const labelMap: Record<string, string> = {
      NOT_REQUESTED: "Sin analizar",
      REQUESTED: "Solicitado",
      PROCESSING: "En proceso",
      COMPLETED: "Analizado",
      FAILED: "Falló",
    };
    sesiones.forEach((s: any) => {
      if (sessionsActuation !== "all" && s.analysis_status !== sessionsActuation) return;
      const label = labelMap[s.analysis_status] || "Sin analizar";
      map.set(label, (map.get(label) ?? 0) + 1);
    });
    return Array.from(map.entries()).map(([type, value]) => ({ type, value }));
  }, [sesiones, sessionsActuation]);

  const sessionTopicsData = React.useMemo(() => {
    const map = new Map<string, number>();
    sesiones.forEach((s: any) => {
      (s.area_de_interes || []).forEach((area: string) => {
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

  // ---------- Derived: Ops blocks (filtered to this client) ----------
  const opsAlerts = React.useMemo(() => {
    return alerts.filter((a: any) => {
      if (opsEditorialState === "pinned") return !!a.is_pinned_for_publication;
      if (opsEditorialState === "archived") return !!a.archived_at;
      if (opsEditorialState === "reviewed") {
        return (
          !!a.is_pinned_for_publication ||
          !!a.archived_at ||
          (a.updated_at && a.created_at && a.updated_at !== a.created_at)
        );
      }
      return true;
    });
  }, [alerts, opsEditorialState]);

  const reviewedAlertsData = React.useMemo(() => {
    const buckets = new Map<string, { week: string; reviewed: number; sortKey: number }>();
    opsAlerts.forEach((a: any) => {
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
    return Array.from(buckets.values())
      .sort((a, b) => a.sortKey - b.sortKey)
      .map(({ week, reviewed }) => ({ week, reviewed }));
  }, [opsAlerts]);

  const detectionToActionData = React.useMemo(() => {
    const buckets = new Map<
      string,
      { week: string; openSum: number; openN: number; pinSum: number; pinN: number; sortKey: number }
    >();
    sesiones.forEach((s: any) => {
      if (!s.created_at) return;
      const created = new Date(s.created_at).getTime();
      const wk = isoWeekStart(new Date(s.created_at));
      const key = wk.toISOString();
      const label = formatWeekLabel(wk);
      const b = buckets.get(key) ?? {
        week: label,
        openSum: 0,
        openN: 0,
        pinSum: 0,
        pinN: 0,
        sortKey: wk.getTime(),
      };
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

  const editorialResponseTimeData = React.useMemo(() => {
    const weekly = new Map<string, { date: string; sum: number; n: number; sortKey: number }>();
    alerts.forEach((a: any) => {
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

  // (Service KPIs block was removed from General per UX simplification)


  // Freshness from real data
  const freshness = React.useMemo(() => {
    const lastAlert = clientAlertsAll.reduce<string | null>((acc, a: any) => {
      const t = a.updated_at || a.created_at || null;
      if (!t) return acc;
      return acc == null || t > acc ? t : acc;
    }, null);
    const lastSession = clientSesionesAll.reduce<string | null>((acc, s: any) => {
      const t = s.updated_at || s.created_at || null;
      if (!t) return acc;
      return acc == null || t > acc ? t : acc;
    }, null);
    const lastUpdate =
      [lastAlert, lastSession].filter(Boolean).sort().pop() || new Date().toISOString();
    return { lastUpdate, dataThrough: lastUpdate.slice(0, 10) };
  }, [clientAlertsAll, clientSesionesAll]);

  const tfLabel = timeframeLabel[period];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analíticas</h1>
          <p className="text-sm text-muted-foreground">
            Métricas en vivo para {clientName || "tu organización"} — datos actualizados automáticamente.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Select value={period} onValueChange={(v) => setPeriod(v as PeriodFilter)}>
            <SelectTrigger className="w-[170px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todo el período</SelectItem>
              <SelectItem value="7d">Últimos 7 días</SelectItem>
              <SelectItem value="30d">Últimos 30 días</SelectItem>
              <SelectItem value="90d">Últimos 90 días</SelectItem>
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
          <Badge
            variant="outline"
            className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 w-fit"
          >
            <Eye className="h-3 w-3 mr-1" />
            Solo Lectura
          </Badge>
        </div>
      </div>

      {/* ========== SECTION 1: General ========== */}
      <CollapsibleAnalyticsSection
        id="client-section-general"
        title="General"
        description="Resumen de servicio y matriz de impacto consolidada."
        icon={<LayoutGrid className="h-4 w-4" />}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {isEnabled("impact_matrix") && (
              <ImpactMatrixBlock alerts={alerts} timeframe={tfLabel} />
            )}
            {isEnabled("regulatory_pulse") && (
              <RegulatoryPulseBlock alerts={alerts} timeframe={tfLabel} />
            )}
          </div>
        </div>
      </CollapsibleAnalyticsSection>

      {/* ========== SECTION 2: Proyectos de ley y normas ========== */}
      <CollapsibleAnalyticsSection
        id="client-section-bills"
        title="Proyectos de ley y normas"
        description="Pulso regulatorio, prioridad, distribución y embudo legislativo."
        icon={<FileText className="h-4 w-4" />}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isEnabled("alert_priority") && (
            <AlertPriorityBlock alerts={alerts} timeframe={tfLabel} />
          )}
          {isEnabled("alert_distribution") && (
            <AlertDistributionBlock alerts={alerts} timeframe={tfLabel} showByArea />
          )}
          {isEnabled("top_entities") && (
            <TopEntitiesBlock alerts={alerts} timeframe={tfLabel} maxItems={7} />
          )}
          {isEnabled("popular_topics") && (
            <PopularTopicsBlock alerts={alerts} timeframe={tfLabel} maxItems={7} />
          )}
          {isEnabled("legislative_funnel") && (
            <LegislativeFunnelBlock alerts={alerts} timeframe={tfLabel} />
          )}
          {isEnabled("key_movements") && <KeyMovementsBlock alerts={alerts} timeframe={tfLabel} />}
          {isEnabled("emerging_topics") && <EmergingTopicsBlock alerts={alerts} timeframe={tfLabel} />}
          {isEnabled("exposure") && <ExposureBlock alerts={alerts} timeframe={tfLabel} />}
        </div>
      </CollapsibleAnalyticsSection>

      {/* ========== SECTION 3: Sesiones del Congreso ========== */}
      <CollapsibleAnalyticsSection
        id="client-section-sessions"
        title="Sesiones del Congreso"
        description="Comportamiento de las sesiones, agenda y materias temáticas."
        icon={<Mic className="h-4 w-4" />}
        filters={
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Filtros de sección:</span>
            <Select value={sessionsCommission} onValueChange={setSessionsCommission}>
              <SelectTrigger className="w-[200px] h-8 text-xs">
                <SelectValue placeholder="Comisión" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las comisiones</SelectItem>
                {Array.from(new Set(clientSesionesAll.map((s: any) => s.commission_name).filter(Boolean))).map(
                  (c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ),
                )}
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
            <SessionsByCommissionBlock timeframe={tfLabel} sessions={sesiones} />
          )}
          {isEnabled("sessions_temporal_evolution") && (
            <SessionsTemporalEvolutionBlock timeframe={tfLabel} sessions={sesiones} />
          )}
         {isEnabled("session_agenda_type") && (
            <SessionAgendaTypeBlock timeframe={tfLabel} sessions={sesiones} />
          )}
        </div>
      </CollapsibleAnalyticsSection>

      {/* ========== SECTION 4: Operaciones internas ========== */}
      <CollapsibleAnalyticsSection
        id="client-section-ops"
        title="Operaciones internas"
        description="Productividad editorial sobre tus alertas y sesiones."
        icon={<Wrench className="h-4 w-4" />}
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
          </div>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isEnabled("editorial_response_time") && (
            <EditorialResponseTimeBlock timeframe={tfLabel} data={editorialResponseTimeData} />
          )}
          {isEnabled("pin_archive") && <PinnedArchivedBlock timeframe={tfLabel} />}
          {isEnabled("reviewed_alerts") && (
            <ReviewedAlertsBlock timeframe={tfLabel} data={reviewedAlertsData} />
          )}
          {isEnabled("detection_to_action_time") && (
            <DetectionToActionTimeBlock timeframe={tfLabel} data={detectionToActionData} />
          )}
          {isEnabled("industry_benchmark") && (
            <IndustryBenchmarkBlock
              alerts={alerts}
              clientName={clientName || "Su empresa"}
              clientSector={clientSector}
              timeframe={tfLabel}
            />
          )}
        </div>
      </CollapsibleAnalyticsSection>

      {/* Customize Dialog */}
      <Dialog open={customizeOpen} onOpenChange={setCustomizeOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Personalizar Dashboard</DialogTitle>
          </DialogHeader>
          <ReportLayoutBuilder
            blocks={blockOrder}
            onChange={handleBlockOrderChange}
            mode="dashboard"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
