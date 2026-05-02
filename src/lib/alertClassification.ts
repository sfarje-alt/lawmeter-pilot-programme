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

/** Internal kanban zones inside a single legislative-stage column. */
export type CardZone = "action" | "monitor" | "low" | "lagging";

/**
 * Classify a card into one zone per Fase B spec:
 *  - lagging: ya rezagada (6m / 12m según impacto)
 *  - action:  impacto >= 70 OR urgencia >= 70
 *  - monitor: impacto entre 40 y 69 (relevancia media)
 *  - low:     impacto < 40 (bajo impacto)
 * Bookmarks nunca caen en lagging (los protege).
 */
export function classifyCard(a: PeruAlert): CardZone {
  if (isRezagada(a)) return "lagging";
  if (isActionRequired(a)) return "action";
  const impact = getImpactScore(a);
  if (impact >= 40) return "monitor";
  return "low";
}

export interface ZoneMeta {
  id: CardZone;
  label: string;
  /** Short inline hint (chip / aria). */
  hint: string;
  /** Long explanation shown in the (i) popover. */
  description: string;
  /** Tailwind classes for the dot + accent. */
  dot: string;
  text: string;
}

export const ZONE_META: Record<CardZone, ZoneMeta> = {
  action: {
    id: "action",
    label: "Acción requerida",
    hint: "Impacto o urgencia ≥ 70",
    description:
      "Proyectos con impacto o urgencia ≥ 70 en etapa avanzada o con movimiento reciente. Son los de mayor riesgo para Betsson en el corto plazo.",
    dot: "bg-destructive",
    text: "text-destructive",
  },
  monitor: {
    id: "monitor",
    label: "Monitorear",
    hint: "Impacto medio (40–69)",
    description:
      "Impacto o urgencia moderados. No requieren acción inmediata — si su score sube o avanzan en el Congreso, suben a Acción requerida automáticamente.",
    dot: "bg-[hsl(var(--warning))]",
    text: "text-[hsl(var(--warning))]",
  },
  low: {
    id: "low",
    label: "Bajo impacto",
    hint: "Impacto < 40",
    description:
      "Score de impacto y urgencia bajos. No son prioridad por ahora.",
    dot: "bg-muted-foreground",
    text: "text-muted-foreground",
  },
  lagging: {
    id: "lagging",
    label: "Rezagadas",
    hint: "Sin movimiento 6m (o 12m si impacto ≥ 70)",
    description:
      "Sin movimiento en el Congreso: 6 meses si score < 70, o 12 meses si score ≥ 70. Bookmark protege de este movimiento automático.",
    dot: "bg-slate-500",
    text: "text-slate-400",
  },
};

export const ZONE_ORDER: CardZone[] = ["action", "monitor", "low", "lagging"];

/**
 * Derive a coarse "entity group" from a regulator entity string.
 * Strategy: prefer well-known acronyms (SBS, MEF, MINSA, BCRP, PCM, INDECOPI,
 * SUNAT, OSIPTEL, OSINERGMIN, SUNARP, SMV, MTPE, MINJUS, MINEM, MININTER,
 * MINEDU, MTC, MIDIS, MINAM, MIDAGRI, PRODUCE, MINCETUR, MIMP, MINCUL,
 * RREE, CONGRESO, PJ, MP, INEI, ONP, ESSALUD, DIGEMID).
 * Fallback: first word of the entity.
 */
const KNOWN_ACRONYMS = [
  "SBS", "MEF", "MINSA", "BCRP", "PCM", "INDECOPI", "SUNAT", "OSIPTEL",
  "OSINERGMIN", "SUNARP", "SMV", "MTPE", "MINJUS", "MINEM", "MININTER",
  "MINEDU", "MTC", "MIDIS", "MINAM", "MIDAGRI", "PRODUCE", "MINCETUR",
  "MIMP", "MINCUL", "RREE", "CONGRESO", "MP", "INEI", "ONP", "ESSALUD",
  "DIGEMID", "OEFA", "ANA", "SUNEDU", "SERVIR", "CEPLAN",
];

export function getEntityGroup(entity?: string | null): string {
  if (!entity) return "Sin entidad";
  const upper = entity.toUpperCase();
  for (const acr of KNOWN_ACRONYMS) {
    const re = new RegExp(`\\b${acr}\\b`);
    if (re.test(upper)) return acr;
  }
  // Keyword fallbacks for common long forms.
  if (/PODER\s+JUDICIAL/.test(upper)) return "PJ";
  if (/MINISTERIO\s+P[ÚU]BLICO/.test(upper)) return "MP";
  if (/CONGRESO/.test(upper)) return "CONGRESO";
  if (/PRESIDENCIA\s+DEL\s+CONSEJO/.test(upper)) return "PCM";
  // Fallback: first 1-2 words.
  const words = entity.trim().split(/\s+/).slice(0, 2).join(" ");
  return words || "Sin entidad";
}

export type VigenciaStatus = "vigente" | "reciente" | "sin_info";

export interface VigenciaInfo {
  status: VigenciaStatus;
  label: string;
  daysSince: number | null;
}

/** Norma vigencia inferred from publication_date (fallback fecha_publicacion). */
export function getVigenciaInfo(a: PeruAlert): VigenciaInfo {
  const raw = a.publication_date;
  if (!raw) return { status: "sin_info", label: "Sin fecha de publicación", daysSince: null };
  const d = new Date(raw);
  if (isNaN(d.getTime())) return { status: "sin_info", label: "Sin fecha de publicación", daysSince: null };
  const days = Math.floor((Date.now() - d.getTime()) / (24 * 60 * 60 * 1000));
  const fmt = d.toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" });
  if (days < 0) return { status: "reciente", label: `Vigente desde ${fmt}`, daysSince: days };
  if (days <= 30) return { status: "reciente", label: `Vigente hace ${days}d`, daysSince: days };
  return { status: "vigente", label: `Vigente desde ${fmt}`, daysSince: days };
}
