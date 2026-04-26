import { parseISO, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval } from "date-fns";
import { PeruAlert, ImpactLevel } from "@/data/peruAlertsMockData";
import { normalizeEntityName } from "@/lib/entityNormalization";

export type DateType = "stage_entry" | "publication" | "in_force" | "manual" | "session";
export type EventKind = "bill" | "regulation" | "session";
export type UrgencyLevel = "low" | "medium" | "high" | "critical";

export interface CalendarEvent {
  id: string;
  alertId?: string;            // links back to PeruAlert
  alert?: PeruAlert;           // attached for drawer use
  title: string;
  date: Date;
  dateType: DateType;
  kind: EventKind;
  stage?: string;
  entity?: string;
  commission?: string;
  affectedAreas: string[];
  impactLevel?: ImpactLevel;
  urgencyLevel: UrgencyLevel;
  status?: PeruAlert["status"];
  isCritical: boolean;
  isPinned?: boolean;
  isArchived?: boolean;
}

/** Parse "YYYY-MM-DD" or "DD/MM/YYYY". Returns null on failure. */
export function parseAlertDate(dateStr: string | undefined | null): Date | null {
  if (!dateStr) return null;
  if (dateStr.includes("-") && dateStr.split("-")[0].length === 4) {
    const d = parseISO(dateStr);
    if (!isNaN(d.getTime())) return d;
  }
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    if (!isNaN(d.getTime())) return d;
  }
  return null;
}

/** Derives an urgency level from impact + stage (no urgency_level field on PeruAlert). */
export function deriveUrgency(alert: PeruAlert): UrgencyLevel {
  const impact = alert.impact_level;
  const stage = (alert.current_stage || "").toUpperCase();
  if (impact === "grave" && (stage.includes("PLENO") || stage.includes("AUTÓGRAFA") || stage.includes("APROBADO"))) {
    return "critical";
  }
  if (impact === "grave") return "high";
  if (impact === "medio") return "medium";
  return "low";
}

export function isCriticalAlert(alert: PeruAlert): boolean {
  if (alert.impact_level !== "grave") return false;
  const u = deriveUrgency(alert);
  return u === "high" || u === "critical";
}

/** Convert PeruAlert[] (from context) into events, expanding multiple date sources. */
export function convertAlertsToEvents(
  alerts: PeruAlert[],
  rules: { showStageEntry: boolean; showPublication: boolean; showInForce: boolean; showManual: boolean }
): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  for (const alert of alerts) {
    const isBill = alert.legislation_type === "proyecto_de_ley";
    const urgency = deriveUrgency(alert);
    const critical = isCriticalAlert(alert);

    const base = {
      alertId: alert.id,
      alert,
      title: alert.legislation_title,
      stage: alert.current_stage,
      entity: normalizeEntityName(alert.entity) || undefined,
      affectedAreas: alert.affected_areas || [],
      impactLevel: alert.impact_level,
      urgencyLevel: urgency,
      status: alert.status,
      isCritical: critical,
      isPinned: alert.is_pinned_for_publication,
      isArchived: !!alert.archived_at,
    };

    if (isBill && rules.showStageEntry) {
      const d = parseAlertDate(alert.stage_date || alert.project_date);
      if (d) {
        events.push({
          ...base,
          id: `${alert.id}__stage`,
          date: d,
          dateType: "stage_entry",
          kind: "bill",
        });
      }
    }
    if (!isBill && rules.showPublication) {
      const d = parseAlertDate(alert.publication_date);
      if (d) {
        events.push({
          ...base,
          id: `${alert.id}__pub`,
          date: d,
          dateType: "publication",
          kind: "regulation",
        });
      }
    }

    // All AI-identified key dates (deadlines, vigencia, votación, sesión, etc.)
    if (rules.showManual && Array.isArray(alert.key_dates)) {
      const rolLower = (r: string) => r.toLowerCase();
      alert.key_dates.forEach((kd, idx) => {
        const d = parseAlertDate(kd.fecha);
        if (!d) return;
        const rol = rolLower(kd.rol || "");
        // Skip dates already plotted as stage_entry / publication to avoid duplicates
        if (rol.includes("publicaci")) return;
        if (isBill && (rol.includes("presentaci") || rol.includes("último estado") || rol.includes("ultimo estado"))) return;

        const isInForce = rol.includes("vigencia") || rol.includes("entrada en vigor") || rol.includes("vacatio");
        if (isInForce && !rules.showInForce) return;

        events.push({
          ...base,
          id: `${alert.id}__kd${idx}`,
          date: d,
          dateType: isInForce ? "in_force" : "manual",
          kind: isBill ? "bill" : "regulation",
          title: `${kd.rol}: ${alert.legislation_title}`,
        });
      });
    }
  }
  return events;
}

/** Build a session event from a Supabase peru_sessions row. */
export function sessionToEvent(session: {
  id: string;
  scheduled_at: string | null;
  session_title?: string | null;
  commission_name: string;
}): CalendarEvent | null {
  if (!session.scheduled_at) return null;
  const d = new Date(session.scheduled_at);
  if (isNaN(d.getTime())) return null;
  return {
    id: `session-${session.id}`,
    title: session.session_title || `Sesión: ${session.commission_name}`,
    date: d,
    dateType: "session",
    kind: "session",
    commission: session.commission_name,
    affectedAreas: [],
    urgencyLevel: "medium",
    isCritical: false,
  };
}

/** Total events for a single day (used for heatmap intensity). */
export function computeDayLoad(events: CalendarEvent[], day: Date): number {
  return events.reduce((acc, e) => (isSameDay(e.date, day) ? acc + 1 : acc), 0);
}

/** Number of critical events for a day. */
export function computeDayCritical(events: CalendarEvent[], day: Date): number {
  return events.reduce((acc, e) => (isSameDay(e.date, day) && e.isCritical ? acc + 1 : acc), 0);
}

/** Map a numeric load to a 4-level scale: 0,1,2,3. */
export function loadLevel(count: number, max: number): 0 | 1 | 2 | 3 {
  if (count <= 0 || max <= 0) return 0;
  const ratio = count / max;
  if (ratio > 0.66) return 3;
  if (ratio > 0.33) return 2;
  return 1;
}

/** Returns the max daily load across the visible range — used to scale heatmap. */
export function maxDailyLoad(events: CalendarEvent[], days: Date[]): number {
  let max = 0;
  for (const day of days) {
    const c = computeDayLoad(events, day);
    if (c > max) max = c;
  }
  return max;
}

/** Aggregate events into ISO week buckets for sparkline. */
export function aggregateByWeek(
  events: CalendarEvent[],
  rangeStart: Date,
  rangeEnd: Date
): { weekLabel: string; weekStart: Date; total: number; critical: number }[] {
  const weeks: Map<string, { weekStart: Date; total: number; critical: number }> = new Map();
  for (const e of events) {
    if (!isWithinInterval(e.date, { start: rangeStart, end: rangeEnd })) continue;
    const ws = startOfWeek(e.date, { weekStartsOn: 1 });
    const key = ws.toISOString();
    const prev = weeks.get(key) || { weekStart: ws, total: 0, critical: 0 };
    prev.total += 1;
    if (e.isCritical) prev.critical += 1;
    weeks.set(key, prev);
  }
  return Array.from(weeks.values())
    .sort((a, b) => a.weekStart.getTime() - b.weekStart.getTime())
    .map((w) => ({
      ...w,
      weekLabel: `${w.weekStart.getDate()}/${w.weekStart.getMonth() + 1}`,
    }));
}

/** Find the busiest week within range. */
export function busiestWeek(
  events: CalendarEvent[],
  rangeStart: Date,
  rangeEnd: Date
): { weekStart: Date; weekEnd: Date; total: number } | null {
  const buckets = aggregateByWeek(events, rangeStart, rangeEnd);
  if (buckets.length === 0) return null;
  const top = buckets.reduce((a, b) => (b.total > a.total ? b : a));
  return {
    weekStart: top.weekStart,
    weekEnd: endOfWeek(top.weekStart, { weekStartsOn: 1 }),
    total: top.total,
  };
}

/** Soonest upcoming event from now (or null). */
export function nextUpcoming(events: CalendarEvent[]): CalendarEvent | null {
  const now = new Date();
  const future = events.filter((e) => e.date.getTime() >= now.getTime());
  if (future.length === 0) return null;
  return future.reduce((a, b) => (a.date.getTime() < b.date.getTime() ? a : b));
}

/** Days inside a month (full grid weeks Mon-Sun). */
export function monthGridDays(currentDate: Date): Date[] {
  const start = startOfWeek(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1), { weekStartsOn: 1 });
  const end = endOfWeek(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0), { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
}
