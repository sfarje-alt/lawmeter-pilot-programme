import { useMemo, useState } from "react";
import { useAlerts } from "@/contexts/AlertsContext";
import { usePeruSessions } from "@/hooks/usePeruSessions";
import { AlertDetailDrawer } from "@/components/inbox/AlertDetailDrawer";
import { BETSSON_COUNTRIES } from "@/lib/betssonCountries";
import { CountryFlag } from "@/components/regional/CountryFlag";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  FileText,
  Globe2,
  Inbox as InboxIcon,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PeruAlert } from "@/data/peruAlertsMockData";
import type { PeruSession } from "@/types/peruSessions";

interface MorningBriefPageProps {
  onNavigate: (tab: string) => void;
}

const PLACEHOLDER = "—";

function getAlertScore(a: PeruAlert): number {
  const impact = typeof a.impacto_score === "number" ? a.impacto_score : 0;
  const urgency = typeof a.urgencia_score === "number" ? a.urgencia_score : 0;
  return impact + urgency;
}

function getUrgencyRank(a: PeruAlert): number {
  const map: Record<string, number> = { alta: 3, media: 2, baja: 1 };
  return a.urgency_category ? map[a.urgency_category] ?? 0 : 0;
}

function getNearestDeadline(a: PeruAlert): number {
  if (!a.key_dates || a.key_dates.length === 0) return Number.POSITIVE_INFINITY;
  const now = Date.now();
  const futures = a.key_dates
    .map((kd) => new Date(kd.fecha).getTime())
    .filter((t) => !isNaN(t) && t >= now);
  return futures.length ? Math.min(...futures) : Number.POSITIVE_INFINITY;
}

export function MorningBriefPage({ onNavigate }: MorningBriefPageProps) {
  const { alerts: allAlerts, loading: alertsLoading, error: alertsError, archiveAlert, unarchiveAlert, togglePinAlert } = useAlerts();
  const { sessions, isLoading: sessionsLoading } = usePeruSessions();
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const upcomingSessions = useMemo<PeruSession[]>(() => {
    const now = Date.now();
    return sessions
      .filter((s) => {
        if (!s.scheduled_at) return false;
        const t = new Date(s.scheduled_at).getTime();
        return !isNaN(t) && t >= now;
      })
      .sort((a, b) => {
        const ta = new Date(a.scheduled_at!).getTime();
        const tb = new Date(b.scheduled_at!).getTime();
        return ta - tb;
      });
  }, [sessions]);

  const stats = useMemo(() => {
    const now = Date.now();
    const dayAgo = now - 24 * 60 * 60 * 1000;
    const weekAhead = now + 7 * 24 * 60 * 60 * 1000;

    const active = allAlerts.filter((a) => a.kanban_stage !== "archivado" && !a.archived_at);
    const criticalUnreviewed = active.filter(
      (a) =>
        (a.urgency_category === "alta" ||
          a.impact_category === "alta" ||
          (typeof a.impacto_score === "number" && a.impacto_score >= 70) ||
          (typeof a.urgencia_score === "number" && a.urgencia_score >= 70)) &&
        a.status === "inbox",
    );
    const newLast24h = allAlerts.filter((a) => {
      const t = new Date(a.created_at).getTime();
      return !isNaN(t) && t >= dayAgo;
    });
    const upcomingDeadlines = active.filter((a) => {
      if (!a.key_dates) return false;
      return a.key_dates.some((kd) => {
        const t = new Date(kd.fecha).getTime();
        return !isNaN(t) && t >= now && t <= weekAhead;
      });
    });

    return {
      active: active.length,
      criticalUnreviewed: criticalUnreviewed.length,
      newLast24h: newLast24h.length,
      upcomingDeadlines: upcomingDeadlines.length,
    };
  }, [allAlerts]);

  const topAlerts = useMemo(() => {
    return [...allAlerts]
      .filter((a) => a.kanban_stage !== "archivado" && !a.archived_at)
      .sort((a, b) => {
        const pinDiff = (b.is_pinned_for_publication ? 1 : 0) - (a.is_pinned_for_publication ? 1 : 0);
        if (pinDiff !== 0) return pinDiff;
        const scoreDiff = getAlertScore(b) - getAlertScore(a);
        if (scoreDiff !== 0) return scoreDiff;
        const urgDiff = getUrgencyRank(b) - getUrgencyRank(a);
        if (urgDiff !== 0) return urgDiff;
        const deadlineDiff = getNearestDeadline(a) - getNearestDeadline(b);
        if (deadlineDiff !== 0) return deadlineDiff;
        const unreadA = a.status === "inbox" ? 0 : 1;
        const unreadB = b.status === "inbox" ? 0 : 1;
        return unreadA - unreadB;
      })
      .slice(0, 5);
  }, [allAlerts]);

  const openAlert = (alertId: string) => {
    setSelectedAlertId(alertId);
    setDrawerOpen(true);
  };

  const selectedAlert = useMemo(
    () => allAlerts.find((a) => a.id === selectedAlertId) ?? null,
    [allAlerts, selectedAlertId],
  );

  const metricValue = (n: number): string | number => {
    if (alertsLoading || alertsError) return PLACEHOLDER;
    return n;
  };

  const activeCountries = BETSSON_COUNTRIES.filter((c) => c.status === "active");
  const activatingCountries = BETSSON_COUNTRIES.filter((c) => c.status === "activating");

  const topAlert = topAlerts[0];
  const nextDeadline = useMemo(() => {
    const candidates = allAlerts
      .flatMap((a) => (a.key_dates ?? []).map((kd) => ({ alert: a, fecha: kd.fecha, rol: kd.rol })))
      .map((x) => ({ ...x, t: new Date(x.fecha).getTime() }))
      .filter((x) => !isNaN(x.t) && x.t >= Date.now())
      .sort((a, b) => a.t - b.t);
    return candidates[0] ?? null;
  }, [allAlerts]);

  const kpis: { label: string; value: string | number; icon: any }[] = [
    { label: "Alertas activas", value: metricValue(stats.active), icon: InboxIcon },
    { label: "Críticas sin revisar", value: metricValue(stats.criticalUnreviewed), icon: AlertTriangle },
    { label: "Nuevas últimas 24h", value: metricValue(stats.newLast24h), icon: Clock },
    { label: "Próximos vencimientos", value: metricValue(stats.upcomingDeadlines), icon: CalendarIcon },
    { label: "Sesiones próximas", value: sessionsLoading ? PLACEHOLDER : upcomingSessions.length, icon: Video },
    { label: "Países activos", value: activeCountries.length, icon: Globe2 },
    { label: "Países en activación", value: activatingCountries.length, icon: Clock },
  ];

  const peruActiveCount = stats.active;
  const hasPeruPriority = stats.criticalUnreviewed > 0 || stats.upcomingDeadlines > 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-semibold text-foreground">
            Betsson · Morning Brief Regional
          </h1>
          <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary">
            Betsson · LATAM
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Lectura rápida del monitoreo regulatorio · Perú y Chile activos · Colombia y Argentina en activación
        </p>
      </div>

      {/* Executive summary strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <ExecCard
          title="Qué requiere atención hoy"
          body={
            hasPeruPriority
              ? "Perú concentra las alertas prioritarias actualmente disponibles. Revisar las alertas de mayor impacto y próximos vencimientos."
              : "Sin prioridades críticas detectadas en Perú en este momento. Mantener el monitoreo y revisar nuevas entradas."
          }
        />
        <ExecCard
          title="País con mayor carga regulatoria"
          body="Perú concentra la carga activa actual. Chile se encuentra habilitado a nivel frontend y pendiente de conexión de datos."
        />
        <ExecCard
          title="Próxima acción recomendada"
          body={
            topAlert
              ? "Revisar la alerta de mayor impacto y validar si debe incluirse en el próximo resumen ejecutivo."
              : nextDeadline
              ? "Revisar el próximo vencimiento registrado en Perú y confirmar responsable."
              : "Mantener el monitoreo. No hay acción prioritaria pendiente en este momento."
          }
        />
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="bg-white/[0.02] border-white/10">
            <CardContent className="p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{kpi.label}</span>
                <kpi.icon className="h-4 w-4 text-muted-foreground/70" />
              </div>
              <div className="text-2xl font-semibold text-foreground">
                {kpi.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Snapshot regional */}
      <Card className="bg-white/[0.02] border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Globe2 className="h-4 w-4 text-primary" />
            Snapshot regional
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {BETSSON_COUNTRIES.map((country) => {
            const isPeru = country.code === "PE";
            const isChile = country.code === "CL";
            const value = isPeru ? metricValue(peruActiveCount) : 0;
            const sub = isPeru
              ? "alertas activas"
              : isChile
              ? "sin datos conectados"
              : "en activación";
            return (
              <div
                key={country.code}
                className="rounded-lg border border-white/10 bg-white/[0.02] p-3 flex items-center gap-3"
              >
                <CountryFlag country={country.code} size={24} showName={false} />
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground truncate">{country.name}</div>
                  <div className="text-lg font-semibold text-foreground leading-tight">{value}</div>
                  <div className="text-[10px] text-muted-foreground/80 truncate">{sub}</div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top alerts */}
        <Card className="bg-white/[0.02] border-white/10 lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              Top alertas por monitorear
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {alertsLoading ? (
              <div className="text-sm text-muted-foreground py-6 text-center">Cargando…</div>
            ) : topAlerts.length === 0 ? (
              <div className="text-sm text-muted-foreground py-6 text-center">
                No hay alertas activas para Perú en este momento.
              </div>
            ) : (
              topAlerts.map((a) => <TopAlertRow key={a.id} alert={a} onOpen={openAlert} />)
            )}
          </CardContent>
        </Card>

        {/* Where to look first */}
        <Card className="bg-white/[0.02] border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Dónde mirar primero</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <QuickLink icon={InboxIcon} label="Alertas críticas" onClick={() => onNavigate("inbox")} />
            <QuickLink icon={Video} label="Sesiones próximas" onClick={() => onNavigate("sessions")} />
            <QuickLink icon={CalendarIcon} label="Vencimientos" onClick={() => onNavigate("calendar")} />
            <QuickLink icon={FileText} label="Resumen ejecutivo" onClick={() => onNavigate("reports")} />
            <QuickLink icon={BarChart3} label="Analíticas" onClick={() => onNavigate("analytics")} />
          </CardContent>
        </Card>
      </div>

      {/* Country status */}
      <Card className="bg-white/[0.02] border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Globe2 className="h-4 w-4 text-primary" />
            Países del perfil Betsson
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {BETSSON_COUNTRIES.map((country) => {
            const isActive = country.status === "active";
            return (
              <div
                key={country.code}
                className={cn(
                  "rounded-lg border p-4 flex items-start gap-3",
                  isActive
                    ? "bg-emerald-500/5 border-emerald-500/20"
                    : "bg-amber-500/5 border-amber-500/15",
                )}
              >
                <CountryFlag country={country.code} size={28} showName={false} />
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-foreground">{country.name}</span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] uppercase tracking-wide",
                        isActive
                          ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                          : "bg-amber-500/10 border-amber-500/25 text-amber-300/90",
                      )}
                    >
                      {isActive ? (
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                      ) : (
                        <Clock className="h-3 w-3 mr-1" />
                      )}
                      {country.statusLabel}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {country.description}
                  </p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Upcoming items */}
      <Card className="bg-white/[0.02] border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Próximos hitos</CardTitle>
        </CardHeader>
        <CardContent>
          <UpcomingMilestones
            alerts={allAlerts}
            sessions={upcomingSessions}
            loading={alertsLoading || sessionsLoading}
            onOpenAlert={openAlert}
            onOpenSessions={() => onNavigate("sessions")}
          />
        </CardContent>
      </Card>

      <AlertDetailDrawer
        alert={selectedAlert}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onArchive={archiveAlert}
        onUnarchive={unarchiveAlert}
        onTogglePin={togglePinAlert}
      />
    </div>
  );
}

function ExecCard({ title, body }: { title: string; body: string }) {
  return (
    <Card className="bg-white/[0.02] border-white/10 h-full">
      <CardContent className="p-4 space-y-2">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{title}</div>
        <p className="text-sm text-foreground/90 leading-relaxed">{body}</p>
      </CardContent>
    </Card>
  );
}

function TopAlertRow({
  alert,
  onOpen,
}: {
  alert: PeruAlert;
  onOpen: (id: string) => void;
}) {
  const deadline = getNearestDeadline(alert);
  const deadlineStr =
    deadline !== Number.POSITIVE_INFINITY
      ? new Date(deadline).toLocaleDateString("es-PE", { day: "2-digit", month: "short" })
      : null;

  const urgencyColor =
    alert.urgency_category === "alta"
      ? "bg-red-500/15 text-red-300 border-red-500/30"
      : alert.urgency_category === "media"
      ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
      : "bg-white/5 text-muted-foreground border-white/10";

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 hover:bg-white/[0.05] transition-colors">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-medium text-foreground line-clamp-2 flex-1">
              {alert.legislation_title}
            </h4>
            <CountryFlag country="PE" size={18} showName={false} className="shrink-0 mt-0.5" />
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            {alert.legislation_id && (
              <span className="text-muted-foreground">{alert.legislation_id}</span>
            )}
            {alert.entity && (
              <span className="text-muted-foreground">· {alert.entity}</span>
            )}
            {alert.fuente && (
              <span className="text-muted-foreground">· {alert.fuente}</span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {alert.urgency_category && (
              <Badge variant="outline" className={cn("text-[10px]", urgencyColor)}>
                Urgencia {alert.urgency_category}
              </Badge>
            )}
            {typeof alert.impacto_score === "number" && (
              <Badge variant="outline" className="text-[10px] bg-white/5 border-white/10">
                Impacto {alert.impacto_score}
              </Badge>
            )}
            {deadlineStr && (
              <Badge variant="outline" className="text-[10px] bg-white/5 border-white/10">
                <CalendarIcon className="h-2.5 w-2.5 mr-1" />
                {deadlineStr}
              </Badge>
            )}
            <Badge variant="outline" className="text-[10px] bg-white/5 border-white/10 capitalize">
              {alert.status}
            </Badge>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onOpen(alert.id)}
          className="shrink-0 h-8 text-xs"
        >
          Ver alerta
          <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </div>
    </div>
  );
}

function QuickLink({
  icon: Icon,
  label,
  onClick,
}: {
  icon: any;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between rounded-md border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] px-3 py-2.5 text-sm text-foreground transition-colors group"
    >
      <span className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
        {label}
      </span>
      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
    </button>
  );
}

type Milestone =
  | { kind: "alert"; date: Date; rol: string; alert: PeruAlert }
  | { kind: "session"; date: Date; session: PeruSession };

function UpcomingMilestones({
  alerts,
  sessions,
  loading,
  onOpenAlert,
  onOpenSessions,
}: {
  alerts: PeruAlert[];
  sessions: PeruSession[];
  loading: boolean;
  onOpenAlert: (id: string) => void;
  onOpenSessions: () => void;
}) {
  const now = Date.now();
  const weekAhead = now + 14 * 24 * 60 * 60 * 1000;
  const items: Milestone[] = [];

  alerts.forEach((a) => {
    if (a.kanban_stage === "archivado" || a.archived_at || !a.key_dates) return;
    a.key_dates.forEach((kd) => {
      const t = new Date(kd.fecha).getTime();
      if (!isNaN(t) && t >= now && t <= weekAhead) {
        items.push({ kind: "alert", date: new Date(t), rol: kd.rol, alert: a });
      }
    });
  });

  sessions.forEach((s) => {
    if (!s.scheduled_at) return;
    const t = new Date(s.scheduled_at).getTime();
    if (!isNaN(t) && t >= now && t <= weekAhead) {
      items.push({ kind: "session", date: new Date(t), session: s });
    }
  });

  items.sort((a, b) => a.date.getTime() - b.date.getTime());
  const top = items.slice(0, 8);

  if (loading) {
    return <div className="text-sm text-muted-foreground py-4 text-center">Cargando…</div>;
  }

  if (top.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-4 text-center">
        No hay hitos próximos registrados para Perú.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {top.map((it, idx) => {
        const dateLabel = it.date.toLocaleDateString("es-PE", { day: "2-digit", month: "short" });
        if (it.kind === "alert") {
          return (
            <button
              key={`alert-${it.alert.id}-${idx}`}
              onClick={() => onOpenAlert(it.alert.id)}
              className="w-full flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] px-3 py-2 text-left transition-colors"
            >
              <div className="text-xs font-medium text-foreground bg-white/5 rounded px-2 py-1 shrink-0">
                {dateLabel}
              </div>
              <Badge variant="outline" className="text-[10px] bg-white/5 border-white/10 shrink-0">
                Alerta
              </Badge>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-foreground line-clamp-1">
                  {it.alert.legislation_title}
                </div>
                <div className="text-[11px] text-muted-foreground line-clamp-1">{it.rol}</div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            </button>
          );
        }
        return (
          <button
            key={`session-${it.session.id}-${idx}`}
            onClick={onOpenSessions}
            className="w-full flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] px-3 py-2 text-left transition-colors"
          >
            <div className="text-xs font-medium text-foreground bg-white/5 rounded px-2 py-1 shrink-0">
              {dateLabel}
            </div>
            <Badge variant="outline" className="text-[10px] bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shrink-0">
              Sesión
            </Badge>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-foreground line-clamp-1">
                {it.session.session_title || it.session.commission_name}
              </div>
              <div className="text-[11px] text-muted-foreground line-clamp-1">
                {it.session.commission_name}
              </div>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          </button>
        );
      })}
    </div>
  );
}
