// Helpers shared by the inbox briefing UI (KPIs, pills, toolbar, classification).
// Mapea sobre campos reales: impacto/urgencia (0-100), impact_level, updated_at,
// fecha_presentacion, fecha_publicacion. Documenta fallbacks donde aplica.

import { PeruAlert } from "@/data/peruAlertsMockData";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Numeric impact 0-100. Prefer ai score, fallback to impact_level mapping. */
export function getImpactScore(a: PeruAlert): number {
  if (typeof a.impacto_score === "number") return a.impacto_score;
  switch (a.impact_level) {
    case "grave": return 85;
    case "medio": return 60;
    case "leve": return 30;
    case "positivo": return 25;
    default: return 0;
  }
}

/** Numeric urgency 0-100. Prefer ai score, fallback to urgency_category. */
export function getUrgencyScore(a: PeruAlert): number {
  if (typeof a.urgencia_score === "number") return a.urgencia_score;
  switch (a.urgency_category) {
    case "alta": return 80;
    case "media": return 50;
    case "baja": return 20;
    default: return 0;
  }
}

/** Last movement timestamp. Fallback chain: updated_at → stage_date → project_date → publication_date. */
export function getLastMovementDate(a: PeruAlert): Date | null {
  const candidate = a.updated_at || a.stage_date || a.project_date || a.publication_date || a.fecha_presentacion;
  if (!candidate) return null;
  const d = new Date(candidate);
  return isNaN(d.getTime()) ? null : d;
}

export function getDaysSinceMovement(a: PeruAlert): number | null {
  const d = getLastMovementDate(a);
  if (!d) return null;
  return Math.floor((Date.now() - d.getTime()) / DAY_MS);
}

/** Lagging: no movement in 6 months (or 12 months if impacto >= 70). Bookmarks excluded. */
export function isRezagada(a: PeruAlert): boolean {
  if (a.is_pinned_for_publication) return false;
  const days = getDaysSinceMovement(a);
  if (days === null) return false;
  const months = days / 30;
  const thresholdMonths = getImpactScore(a) >= 70 ? 12 : 6;
  return months >= thresholdMonths;
}

/** Action required: high impact OR high urgency (>= 70). */
export function isActionRequired(a: PeruAlert): boolean {
  return getImpactScore(a) >= 70 || getUrgencyScore(a) >= 70;
}

/** Recent movement (last N days, default 7). */
export function isRecentMovement(a: PeruAlert, days = 7): boolean {
  const d = getDaysSinceMovement(a);
  return d !== null && d <= days;
}

export type SortMode = "movement" | "impact" | "urgency";

export function sortAlerts(alerts: PeruAlert[], mode: SortMode): PeruAlert[] {
  const copy = [...alerts];
  copy.sort((a, b) => {
    // Bookmarks always first
    if (a.is_pinned_for_publication !== b.is_pinned_for_publication) {
      return a.is_pinned_for_publication ? -1 : 1;
    }
    if (mode === "impact") return getImpactScore(b) - getImpactScore(a);
    if (mode === "urgency") return getUrgencyScore(b) - getUrgencyScore(a);
    // movement (most recent first)
    const da = getLastMovementDate(a)?.getTime() ?? 0;
    const db = getLastMovementDate(b)?.getTime() ?? 0;
    return db - da;
  });
  return copy;
}

export type QuickFilter = "all" | "action" | "bookmarks" | "recent" | "low";

export function applyQuickFilter(alerts: PeruAlert[], qf: QuickFilter): PeruAlert[] {
  switch (qf) {
    case "action": return alerts.filter(isActionRequired);
    case "bookmarks": return alerts.filter(a => a.is_pinned_for_publication);
    case "recent": return alerts.filter(a => isRecentMovement(a, 7));
    case "low": return alerts.filter(a => getImpactScore(a) < 40);
    case "all":
    default:
      return alerts;
  }
}
