import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  ExternalLink,
  Settings,
  X,
  Building2,
  FileText,
  Clock,
  AlertTriangle,
  Scale,
  Info,
  Video,
  RotateCcw,
  Pin,
  Flame,
  TrendingUp,
  Search,
} from "lucide-react";
import {
  format,
  isSameDay,
  addDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isToday,
  isWithinInterval,
} from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  IMPACT_LEVELS,
  ImpactLevel,
  PeruAlert,
  BILL_STAGES,
} from "@/data/peruAlertsMockData";
import { useAlerts } from "@/contexts/AlertsContext";
import { AlertDetailDrawer } from "@/components/inbox/AlertDetailDrawer";
import { supabase } from "@/integrations/supabase/client";
import {
  CalendarEvent,
  UrgencyLevel,
  convertAlertsToEvents,
  sessionToEvent,
  computeDayLoad,
  computeDayCritical,
  loadLevel,
  maxDailyLoad,
  aggregateByWeek,
  busiestWeek,
  nextUpcoming,
  monthGridDays,
} from "@/lib/calendarUtils";
import { useCalendarFilters } from "@/hooks/useCalendarFilters";
import { Bar, BarChart, ResponsiveContainer, Tooltip as RTooltip, XAxis } from "recharts";

const URGENCY_OPTIONS: { value: UrgencyLevel; label: string }[] = [
  { value: "low", label: "Baja" },
  { value: "medium", label: "Media" },
  { value: "high", label: "Alta" },
  { value: "critical", label: "Crítica" },
];

const STATUS_OPTIONS: { value: PeruAlert["status"]; label: string }[] = [
  { value: "inbox", label: "Bandeja" },
  { value: "reviewed", label: "Revisado" },
  { value: "published", label: "Publicado" },
  { value: "declined", label: "Declinado" },
];

const TYPE_OPTIONS = [
  { value: "bill" as const, label: "Proyectos de Ley" },
  { value: "regulation" as const, label: "Normas" },
  { value: "session" as const, label: "Sesiones" },
];

// ---------- visual helpers (semantic tokens only) ----------

function impactClasses(level?: ImpactLevel): string {
  switch (level) {
    case "grave":
      return "bg-[hsl(var(--destructive)/0.15)] border-[hsl(var(--destructive)/0.45)] text-[hsl(var(--destructive))]";
    case "medio":
      return "bg-[hsl(var(--warning)/0.15)] border-[hsl(var(--warning)/0.45)] text-[hsl(var(--warning))]";
    case "positivo":
      return "bg-[hsl(var(--success)/0.15)] border-[hsl(var(--success)/0.45)] text-[hsl(var(--success))]";
    case "leve":
    default:
      return "bg-muted/40 border-border/50 text-muted-foreground";
  }
}

function eventClasses(event: CalendarEvent): string {
  if (event.kind === "session") {
    return "bg-primary/15 border-primary/40 text-primary";
  }
  return impactClasses(event.impactLevel);
}

function heatmapBg(level: 0 | 1 | 2 | 3): string {
  switch (level) {
    case 3:
      return "bg-primary/20";
    case 2:
      return "bg-primary/10";
    case 1:
      return "bg-primary/5";
    case 0:
    default:
      return "";
  }
}

// ---------- main component ----------

export function AlertsCalendar() {
  const navigate = useNavigate();
  const { alerts, archiveAlert, unarchiveAlert, updateSharedCommentary } = useAlerts();

  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [expandedDate, setExpandedDate] = useState<Date | null>(null);
  const [view, setView] = useState<"day" | "week" | "month">("month");
  const [showFilters, setShowFilters] = useState(false);
  const [showDateRules, setShowDateRules] = useState(false);

  // Drawer state — reuses Inbox drawer for parity
  const [activeAlert, setActiveAlert] = useState<PeruAlert | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { filters, setFilters, rules, setRules, reset, activeCount } = useCalendarFilters();

  // ---------- Sessions from Supabase ----------
  const [sessions, setSessions] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("sesiones" as any)
        .select("id, scheduled_at, session_title, commission_name, es_de_interes")
        .order("scheduled_at", { ascending: false });
      if (!error && data) setSessions(data as any[]);
    })();
  }, []);

  // ---------- Events ----------
  const alertEvents = useMemo(
    () =>
      convertAlertsToEvents(alerts, {
        showStageEntry: rules.showStageEntry,
        showPublication: rules.showPublication,
        showInForce: rules.showInForce,
        showManual: rules.showManual,
      }),
    [alerts, rules]
  );

  const sessionEvents = useMemo(() => {
    if (!rules.showSessions) return [] as CalendarEvent[];
    return sessions.map(sessionToEvent).filter((e): e is CalendarEvent => !!e);
  }, [sessions, rules.showSessions]);

  const allEvents = useMemo(() => [...alertEvents, ...sessionEvents], [alertEvents, sessionEvents]);

  // ---------- Filter options ----------
  const stageOptions = useMemo(() => {
    const set = new Set<string>(BILL_STAGES);
    alerts.forEach((a) => a.current_stage && set.add(a.current_stage));
    return Array.from(set).sort();
  }, [alerts]);

  const tagOptions = useMemo(() => {
    const set = new Set<string>();
    alerts.forEach((a) => a.affected_areas?.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [alerts]);

  // ---------- Apply filters ----------
  const filteredEvents = useMemo(() => {
    const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const toDate = filters.dateTo ? new Date(filters.dateTo) : null;
    const q = filters.search.trim().toLowerCase();

    return allEvents.filter((e) => {
      // archived
      if (!filters.showArchived && e.isArchived) return false;

      // search
      if (q) {
        const hay = `${e.title} ${e.alert?.legislation_id ?? ""} ${e.alert?.author ?? ""} ${e.entity ?? ""} ${e.commission ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      // type
      if (filters.alertTypes.length && !filters.alertTypes.includes(e.kind)) return false;
      // stage
      if (filters.stages.length && (!e.stage || !filters.stages.includes(e.stage))) {
        if (e.kind !== "session") return false;
        if (e.kind === "session") return false;
      }
      // tags
      if (filters.tags.length) {
        const hasAny = e.affectedAreas.some((t) => filters.tags.includes(t));
        if (!hasAny) return false;
      }
      // impact
      if (filters.impactLevels.length) {
        if (!e.impactLevel || !filters.impactLevels.includes(e.impactLevel)) return false;
      }
      // urgency
      if (filters.urgencyLevels.length && !filters.urgencyLevels.includes(e.urgencyLevel)) return false;
      // status
      if (filters.statuses.length) {
        if (!e.status || !filters.statuses.includes(e.status)) return false;
      }
      // range
      if (fromDate && e.date < fromDate) return false;
      if (toDate && e.date > toDate) return false;
      return true;
    });
  }, [allEvents, filters]);

  // ---------- View helpers ----------
  const viewDays = useMemo(() => {
    if (view === "day") return [currentDate];
    if (view === "week") {
      return eachDayOfInterval({
        start: startOfWeek(currentDate, { weekStartsOn: 1 }),
        end: endOfWeek(currentDate, { weekStartsOn: 1 }),
      });
    }
    return monthGridDays(currentDate);
  }, [view, currentDate]);

  const visibleRange = useMemo(() => {
    const start = viewDays[0];
    const end = viewDays[viewDays.length - 1];
    return { start, end };
  }, [viewDays]);

  const eventsInRange = useMemo(
    () => filteredEvents.filter((e) => isWithinInterval(e.date, visibleRange)),
    [filteredEvents, visibleRange]
  );

  const maxLoad = useMemo(() => maxDailyLoad(eventsInRange, viewDays), [eventsInRange, viewDays]);

  // ---------- KPIs ----------
  const kpis = useMemo(() => {
    const total = eventsInRange.length;
    const critical = eventsInRange.filter((e) => e.isCritical).length;
    const top = busiestWeek(eventsInRange, visibleRange.start, visibleRange.end);
    const next = nextUpcoming(eventsInRange);
    return { total, critical, top, next };
  }, [eventsInRange, visibleRange]);

  const sparkData = useMemo(
    () => aggregateByWeek(eventsInRange, visibleRange.start, visibleRange.end),
    [eventsInRange, visibleRange]
  );

  // ---------- Handlers ----------
  const getEventsForDate = (day: Date) => filteredEvents.filter((e) => isSameDay(e.date, day));

  const navigatePrev = () => {
    if (view === "day") setCurrentDate(addDays(currentDate, -1));
    else if (view === "week") setCurrentDate(addDays(currentDate, -7));
    else setCurrentDate(subMonths(currentDate, 1));
  };

  const navigateNext = () => {
    if (view === "day") setCurrentDate(addDays(currentDate, 1));
    else if (view === "week") setCurrentDate(addDays(currentDate, 7));
    else setCurrentDate(addMonths(currentDate, 1));
  };

  const openEvent = (event: CalendarEvent) => {
    if (event.kind === "session") {
      navigate(`/?section=sessions&sessionId=${event.id.replace(/^session-/, "")}&t=${Date.now()}`);
      return;
    }
    if (event.alert) {
      setActiveAlert(event.alert);
      setDrawerOpen(true);
    }
  };

  const openInInbox = (event: CalendarEvent) => {
    if (!event.alert) return;
    const tab = event.kind === "bill" ? "bills" : "regulations";
    navigate(`/?section=inbox&tab=${tab}&alertId=${event.alert.id}&t=${Date.now()}`);
  };

  // ---------- Toggle helpers ----------
  const toggleArrayFilter = <T,>(field: keyof CalendarFiltersFields, value: T) => {
    setFilters((prev) => {
      const arr = (prev as any)[field] as T[];
      const exists = arr.includes(value);
      return {
        ...prev,
        [field]: exists ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  };

  type CalendarFiltersFields = typeof filters;

  // ---------- Rendering ----------
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calendario</h1>
          <p className="text-muted-foreground">Vista temporal de la Bandeja — gestiona alertas en su contexto temporal.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {activeCount > 0 && (
            <Button variant="ghost" size="sm" onClick={reset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Limpiar filtros ({activeCount})
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => setShowDateRules(true)} className="gap-2">
            <Settings className="h-4 w-4" />
            Reglas de Fecha
          </Button>
          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilters((v) => !v)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtros{activeCount > 0 ? ` · ${activeCount}` : ""}
          </Button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="glass-card border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <CalendarIcon className="h-3.5 w-3.5" /> Alertas en rango
            </div>
            <div className="text-2xl font-semibold mt-1">{kpis.total}</div>
          </CardContent>
        </Card>
        <Card className={cn("border-border/30", kpis.critical > 0 && "border-[hsl(var(--destructive)/0.5)]")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Flame className="h-3.5 w-3.5 text-[hsl(var(--destructive))]" /> Críticas
            </div>
            <div className="text-2xl font-semibold mt-1 text-[hsl(var(--destructive))]">{kpis.critical}</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <TrendingUp className="h-3.5 w-3.5" /> Semana de mayor carga
            </div>
            <div className="text-sm font-semibold mt-1">
              {kpis.top
                ? `${format(kpis.top.weekStart, "d MMM", { locale: es })} · ${kpis.top.total} eventos`
                : "—"}
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Clock className="h-3.5 w-3.5" /> Próximo evento
            </div>
            <div className="text-sm font-semibold mt-1 line-clamp-1">
              {kpis.next ? `${format(kpis.next.date, "d MMM", { locale: es })} · ${kpis.next.title.slice(0, 40)}` : "—"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sparkline */}
      {sparkData.length > 0 && (
        <Card className="glass-card border-border/30">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Carga regulatoria por semana</span>
              <span className="text-[10px] text-muted-foreground">
                {format(visibleRange.start, "d MMM", { locale: es })} – {format(visibleRange.end, "d MMM", { locale: es })}
              </span>
            </div>
            <div className="h-20">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sparkData}>
                  <XAxis dataKey="weekLabel" hide />
                  <RTooltip
                    cursor={{ fill: "hsl(var(--muted) / 0.4)" }}
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      fontSize: 12,
                    }}
                    formatter={(value: number, name: string) => [value, name === "total" ? "Total" : "Críticas"]}
                  />
                  <Bar dataKey="total" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="critical" fill="hsl(var(--destructive))" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <Card className="glass-card border-border/30">
          <CardContent className="pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm">Filtros sincronizados con la Bandeja</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={filters.search}
                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                placeholder="Buscar por título, ID, autor o entidad…"
                className="pl-9"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Type */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Tipo</Label>
                <div className="flex flex-wrap gap-1">
                  {TYPE_OPTIONS.map((t) => {
                    const active = filters.alertTypes.includes(t.value);
                    return (
                      <Badge
                        key={t.value}
                        variant={active ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleArrayFilter("alertTypes", t.value)}
                      >
                        {t.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              {/* Impact */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Impacto</Label>
                <div className="flex flex-wrap gap-1">
                  {IMPACT_LEVELS.map((il) => {
                    const active = filters.impactLevels.includes(il.value);
                    return (
                      <Badge
                        key={il.value}
                        variant={active ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleArrayFilter("impactLevels", il.value)}
                      >
                        {il.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              {/* Urgency */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Urgencia</Label>
                <div className="flex flex-wrap gap-1">
                  {URGENCY_OPTIONS.map((u) => {
                    const active = filters.urgencyLevels.includes(u.value);
                    return (
                      <Badge
                        key={u.value}
                        variant={active ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleArrayFilter("urgencyLevels", u.value)}
                      >
                        {u.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Estado</Label>
                <div className="flex flex-wrap gap-1">
                  {STATUS_OPTIONS.map((s) => {
                    const active = filters.statuses.includes(s.value);
                    return (
                      <Badge
                        key={s.value}
                        variant={active ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleArrayFilter("statuses", s.value)}
                      >
                        {s.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              {/* Stage */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Etapa legislativa</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      {filters.stages.length === 0 ? "Todas" : `${filters.stages.length} seleccionadas`}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 max-h-72 overflow-y-auto p-2 bg-popover">
                    {stageOptions.map((stage) => (
                      <div key={stage} className="flex items-center gap-2 py-1">
                        <Checkbox
                          id={`stage-${stage}`}
                          checked={filters.stages.includes(stage)}
                          onCheckedChange={() => toggleArrayFilter("stages", stage)}
                        />
                        <Label htmlFor={`stage-${stage}`} className="text-xs cursor-pointer">
                          {stage}
                        </Label>
                      </div>
                    ))}
                  </PopoverContent>
                </Popover>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Etiquetas / Áreas</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      {filters.tags.length === 0 ? "Todas" : `${filters.tags.length} seleccionadas`}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 max-h-72 overflow-y-auto p-2 bg-popover">
                    {tagOptions.map((tag) => (
                      <div key={tag} className="flex items-center gap-2 py-1">
                        <Checkbox
                          id={`tag-${tag}`}
                          checked={filters.tags.includes(tag)}
                          onCheckedChange={() => toggleArrayFilter("tags", tag)}
                        />
                        <Label htmlFor={`tag-${tag}`} className="text-xs cursor-pointer">
                          {tag}
                        </Label>
                      </div>
                    ))}
                  </PopoverContent>
                </Popover>
              </div>

              {/* Date range */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Desde</Label>
                <Input
                  type="date"
                  value={filters.dateFrom ?? ""}
                  onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value || null }))}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Hasta</Label>
                <Input
                  type="date"
                  value={filters.dateTo ?? ""}
                  onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value || null }))}
                />
              </div>

              {/* Show archived */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Archivadas</Label>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={filters.showArchived}
                    onCheckedChange={(v) => setFilters((f) => ({ ...f, showArchived: v }))}
                  />
                  <span className="text-xs text-muted-foreground">Mostrar archivadas</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <Card className="glass-card border-border/30">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-primary" />
            <h3 className="font-medium text-sm">Leyenda</h3>
          </div>
          <div className="flex flex-wrap gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className={cn("inline-block w-3 h-3 rounded border", impactClasses("grave"))} />
              Grave
            </span>
            <span className="flex items-center gap-1.5">
              <span className={cn("inline-block w-3 h-3 rounded border", impactClasses("medio"))} />
              Medio
            </span>
            <span className="flex items-center gap-1.5">
              <span className={cn("inline-block w-3 h-3 rounded border", impactClasses("leve"))} />
              Leve
            </span>
            <span className="flex items-center gap-1.5">
              <span className={cn("inline-block w-3 h-3 rounded border", impactClasses("positivo"))} />
              Positivo
            </span>
            <span className="flex items-center gap-1.5 ml-2">
              <Video className="h-3 w-3 text-primary" /> Sesiones
            </span>
            <span className="flex items-center gap-1.5">
              <Flame className="h-3 w-3 text-[hsl(var(--destructive))]" /> Crítica (Grave + Urgencia alta)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded bg-primary/20" /> Heatmap de carga regulatoria
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Controls */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={navigatePrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
            Hoy
          </Button>
          <Button variant="outline" size="icon" onClick={navigateNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold ml-2">
            {format(
              currentDate,
              view === "day" ? "EEEE, d MMMM yyyy" : view === "week" ? "'Semana del' d MMMM" : "MMMM yyyy",
              { locale: es }
            )}
          </h2>
        </div>
        <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
          <TabsList className="bg-background/50">
            <TabsTrigger value="day">Día</TabsTrigger>
            <TabsTrigger value="week">Semana</TabsTrigger>
            <TabsTrigger value="month">Mes</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Calendar Grid */}
      <Card className="glass-card border-border/30">
        <CardContent className="p-4">
          {view === "month" ? (
            <div className="grid grid-cols-7 gap-1">
              {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
                <div key={d} className="p-2 text-center text-xs font-medium text-muted-foreground">
                  {d}
                </div>
              ))}
              {viewDays.map((day) => {
                const dayEvents = getEventsForDate(day);
                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                const load = computeDayLoad(filteredEvents, day);
                const crit = computeDayCritical(filteredEvents, day);
                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      "min-h-[110px] p-1 border border-border/20 rounded-md cursor-pointer hover:bg-muted/20 transition-colors relative bg-card",
                      !isCurrentMonth && "opacity-40",
                      isToday(day) && "ring-2 ring-primary",
                      selectedDate && isSameDay(day, selectedDate) && "ring-2 ring-primary",
                      crit > 0 && "border-[hsl(var(--destructive)/0.45)]"
                    )}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className={cn("text-xs font-medium", isToday(day) && "text-primary")}>
                        {format(day, "d")}
                      </div>
                      {load > 0 && (
                        <div
                          className={cn(
                            "text-[10px] px-1 rounded font-semibold",
                            crit > 0
                              ? "bg-[hsl(var(--destructive)/0.15)] text-[hsl(var(--destructive))]"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {crit > 0 ? `${crit}!/${load}` : load}
                        </div>
                      )}
                    </div>
                    <div className="space-y-0.5">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className={cn(
                            "text-[10px] px-1 py-0.5 rounded border truncate cursor-pointer hover:opacity-80 flex items-center gap-1",
                            eventClasses(event),
                            event.isCritical && "border-l-4"
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            openEvent(event);
                          }}
                          title={event.title}
                        >
                          {event.isCritical && <Flame className="h-2.5 w-2.5 shrink-0" />}
                          {event.isPinned && <Pin className="h-2.5 w-2.5 shrink-0" />}
                          <span className="truncate">{event.title}</span>
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div
                          className="text-[10px] text-primary font-medium text-center cursor-pointer hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedDate(day);
                          }}
                        >
                          +{dayEvents.length - 3} más
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : view === "week" ? (
            <div className="grid grid-cols-7 gap-2">
              {viewDays.map((day) => {
                const dayEvents = getEventsForDate(day);
                const load = computeDayLoad(filteredEvents, day);
                const crit = computeDayCritical(filteredEvents, day);
                const lvl = loadLevel(load, maxLoad);
                return (
                  <div key={day.toISOString()} className="space-y-2">
                    <div
                      className={cn(
                        "text-center p-2 rounded-lg bg-card",
                        isToday(day) && "ring-2 ring-primary",
                        crit > 0 && "border border-[hsl(var(--destructive)/0.45)]"
                      )}
                    >
                      <div className="text-xs text-muted-foreground">{format(day, "EEE", { locale: es })}</div>
                      <div className={cn("text-lg font-medium", isToday(day) && "text-primary")}>
                        {format(day, "d")}
                      </div>
                      <div className="text-[10px] mt-0.5">
                        {load > 0 ? (
                          <span className={crit > 0 ? "text-[hsl(var(--destructive))]" : "text-muted-foreground"}>
                            Carga: {lvl === 3 ? "Alta" : lvl === 2 ? "Media" : "Baja"}
                            {crit > 0 ? ` · ${crit} crítica${crit > 1 ? "s" : ""}` : ""}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/60">Sin eventos</span>
                        )}
                      </div>
                    </div>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-2 pr-2">
                        {dayEvents.map((event) => (
                          <div
                            key={event.id}
                            className={cn(
                              "p-2 rounded border text-xs cursor-pointer hover:opacity-80 transition-opacity",
                              eventClasses(event),
                              event.isCritical && "border-l-4"
                            )}
                            onClick={() => openEvent(event)}
                          >
                            <div className="flex items-start gap-1">
                              {event.isCritical && <Flame className="h-3 w-3 shrink-0 mt-0.5" />}
                              {event.isPinned && <Pin className="h-3 w-3 shrink-0 mt-0.5" />}
                              <span className="font-medium line-clamp-2">{event.title}</span>
                            </div>
                            {(event.stage || event.entity || event.commission) && (
                              <div className="flex items-center gap-1 mt-1 text-[10px] opacity-80">
                                {event.kind === "bill" && <Scale className="h-3 w-3" />}
                                {event.kind === "regulation" && <Building2 className="h-3 w-3" />}
                                {event.kind === "session" && <Video className="h-3 w-3" />}
                                {event.stage || event.entity || event.commission}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center py-4">
                <div
                  className={cn(
                    "inline-flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold",
                    isToday(currentDate) ? "bg-primary text-primary-foreground" : "bg-muted"
                  )}
                >
                  {format(currentDate, "d")}
                </div>
              </div>
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {getEventsForDate(currentDate).length > 0 ? (
                    getEventsForDate(currentDate).map((event) => (
                      <Card
                        key={event.id}
                        className={cn("border cursor-pointer hover:opacity-90", eventClasses(event), event.isCritical && "border-l-4")}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                {event.kind === "bill" ? (
                                  <Badge variant="outline" className="text-xs">Proyecto de Ley</Badge>
                                ) : event.kind === "regulation" ? (
                                  <Badge variant="outline" className="text-xs">Norma</Badge>
                                ) : (
                                  <Badge variant="outline" className="text-xs">Sesión</Badge>
                                )}
                                {event.impactLevel && (
                                  <Badge variant="outline" className={cn("text-xs", impactClasses(event.impactLevel))}>
                                    {IMPACT_LEVELS.find((i) => i.value === event.impactLevel)?.label}
                                  </Badge>
                                )}
                                {event.isCritical && (
                                  <Badge variant="outline" className="text-xs gap-1 bg-[hsl(var(--destructive)/0.15)] text-[hsl(var(--destructive))]">
                                    <Flame className="h-3 w-3" /> Crítica
                                  </Badge>
                                )}
                                {event.isPinned && (
                                  <Badge variant="outline" className="text-xs gap-1">
                                    <Pin className="h-3 w-3" /> Fijada
                                  </Badge>
                                )}
                              </div>
                              <h3 className="font-medium">{event.title}</h3>
                              {(event.stage || event.entity || event.commission) && (
                                <p className="text-sm opacity-80 mt-1">{event.stage || event.entity || event.commission}</p>
                              )}
                              {event.affectedAreas.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {event.affectedAreas.slice(0, 4).map((a) => (
                                    <Badge key={a} variant="secondary" className="text-[10px]">{a}</Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-1 shrink-0">
                              <Button size="sm" onClick={() => openEvent(event)}>Abrir</Button>
                              {event.alert && (
                                <Button size="sm" variant="outline" onClick={() => openInInbox(event)}>
                                  <ExternalLink className="h-3 w-3 mr-1" /> Bandeja
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No hay eventos en este día</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Date Panel (month view) */}
      {selectedDate && view === "month" && (
        <Card className="glass-card border-border/30">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setSelectedDate(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-[300px]">
              <div className="space-y-2">
                {getEventsForDate(selectedDate).length > 0 ? (
                  getEventsForDate(selectedDate).map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        "p-3 rounded-lg border cursor-pointer hover:opacity-90 transition-opacity",
                        eventClasses(event),
                        event.isCritical && "border-l-4"
                      )}
                      onClick={() => openEvent(event)}
                    >
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {event.kind === "bill" && <Scale className="h-4 w-4" />}
                        {event.kind === "regulation" && <Building2 className="h-4 w-4" />}
                        {event.kind === "session" && <Video className="h-4 w-4" />}
                        <span className="text-xs opacity-80">
                          {event.kind === "bill" ? "Proyecto de Ley" : event.kind === "regulation" ? "Norma" : "Sesión"}
                        </span>
                        {event.isCritical && <Flame className="h-3 w-3 text-[hsl(var(--destructive))]" />}
                        {event.isPinned && <Pin className="h-3 w-3" />}
                      </div>
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      {(event.stage || event.entity || event.commission) && (
                        <p className="text-xs opacity-80 mt-1">{event.stage || event.entity || event.commission}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-sm">No hay eventos en esta fecha</div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Date Rules Dialog */}
      <Dialog open={showDateRules} onOpenChange={setShowDateRules}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" /> Reglas de Fecha
            </DialogTitle>
            <DialogDescription>Define qué tipos de fecha se muestran en el calendario.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            {[
              { key: "showStageEntry", label: "Ingreso a etapa (PLs)", desc: "Fecha en que el proyecto ingresó a su etapa actual." },
              { key: "showPublication", label: "Publicación (Normas)", desc: "Fecha de publicación oficial." },
              { key: "showInForce", label: "Entrada en vigor", desc: "Cuando la norma entra en vigencia." },
              { key: "showManual", label: "Fechas manuales", desc: "Fechas personalizadas agregadas por el equipo." },
              { key: "showSessions", label: "Sesiones del Congreso", desc: "Sesiones programadas." },
            ].map((r) => (
              <div key={r.key} className="flex items-start gap-2">
                <Checkbox
                  id={r.key}
                  checked={(rules as any)[r.key]}
                  onCheckedChange={(c) => setRules((prev) => ({ ...prev, [r.key]: !!c }))}
                />
                <Label htmlFor={r.key} className="flex-1 cursor-pointer">
                  <span className="font-medium">{r.label}</span>
                  <p className="text-xs text-muted-foreground">{r.desc}</p>
                </Label>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Expanded date dialog */}
      <Dialog open={!!expandedDate} onOpenChange={(o) => !o && setExpandedDate(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              Eventos del {expandedDate && format(expandedDate, "d 'de' MMMM, yyyy", { locale: es })}
            </DialogTitle>
            <DialogDescription>
              {expandedDate && `${getEventsForDate(expandedDate).length} eventos en esta fecha`}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-2">
            {expandedDate &&
              getEventsForDate(expandedDate).map((event) => (
                <div
                  key={event.id}
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer hover:opacity-80 transition-opacity",
                    eventClasses(event),
                    event.isCritical && "border-l-4"
                  )}
                  onClick={() => {
                    setExpandedDate(null);
                    openEvent(event);
                  }}
                >
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge variant="outline" className="text-[10px]">
                      {event.kind === "bill" ? "Proyecto de Ley" : event.kind === "regulation" ? "Norma" : "Sesión"}
                    </Badge>
                    {event.impactLevel && (
                      <Badge variant="outline" className={cn("text-[10px]", impactClasses(event.impactLevel))}>
                        {IMPACT_LEVELS.find((i) => i.value === event.impactLevel)?.label}
                      </Badge>
                    )}
                    {event.isCritical && <Flame className="h-3 w-3 text-[hsl(var(--destructive))]" />}
                  </div>
                  <h4 className="font-medium text-sm line-clamp-2">{event.title}</h4>
                </div>
              ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Alert Detail Drawer (reused from Inbox for full parity) */}
      <AlertDetailDrawer
        alert={activeAlert}
        open={drawerOpen}
        onOpenChange={(o) => {
          setDrawerOpen(o);
          if (!o) setActiveAlert(null);
        }}
        onUpdateExpertCommentary={(id, c) => updateSharedCommentary(id, c)}
        onArchive={(id) => archiveAlert(id)}
        onUnarchive={(id) => unarchiveAlert(id)}
      />
    </div>
  );
}
