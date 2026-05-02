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

/**
 * Last *legislative* movement. Priority: stage_date (último seguimiento) →
 * project_date / fecha_presentacion → publication_date → updated_at (last resort,
 * since en datos reales suele ser la fecha de ingesta y no de movimiento real).
 */
export function getLastMovementDate(a: PeruAlert): Date | null {
  const candidate =
    a.stage_date ||
    a.project_date ||
    a.fecha_presentacion ||
    a.publication_date ||
    a.updated_at;
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

export type SortMode = "movement" | "impact" | "urgency" | "date";

function getIngestionTime(a: PeruAlert): number {
  const raw = (a as any).created_at || a.updated_at;
  if (!raw) return 0;
  const t = new Date(raw).getTime();
  return isNaN(t) ? 0 : t;
}

export function sortAlerts(alerts: PeruAlert[], mode: SortMode): PeruAlert[] {
  const copy = [...alerts];
  copy.sort((a, b) => {
    // Bookmarks ya no se anclan arriba — aparecen en su posición natural por score.
    if (mode === "impact") return getImpactScore(b) - getImpactScore(a);
    if (mode === "urgency") return getUrgencyScore(b) - getUrgencyScore(a);
    if (mode === "date") return getIngestionTime(b) - getIngestionTime(a);
    // movement (most recent first)
    const da = getLastMovementDate(a)?.getTime() ?? 0;
    const db = getLastMovementDate(b)?.getTime() ?? 0;
    return db - da;
  });
  return copy;
}

/** Briefing filter: top-level filter activated from the briefing cards. */
export type BriefingFilter = "action" | "new24" | "bookmarks" | "lagging" | null;

export function applyBriefingFilter(alerts: PeruAlert[], bf: BriefingFilter): PeruAlert[] {
  if (!bf) return alerts;
  if (bf === "action") return alerts.filter(isActionRequired);
  if (bf === "new24") return alerts.filter((a) => isRecentMovement(a, 1));
  if (bf === "bookmarks") return alerts.filter((a) => a.is_pinned_for_publication);
  if (bf === "lagging") return alerts.filter(isRezagada);
  return alerts;
}

export function countBriefing(alerts: PeruAlert[]): Record<Exclude<BriefingFilter, null>, number> {
  return {
    action: alerts.filter(isActionRequired).length,
    new24: alerts.filter((a) => isRecentMovement(a, 1)).length,
    bookmarks: alerts.filter((a) => a.is_pinned_for_publication).length,
    lagging: alerts.filter(isRezagada).length,
  };
}

/**
 * Quick-filter por temática. "all" muestra todo, "bookmarks" filtra por
 * pin/bookmark, "otros" agrupa todo lo que no encaja en una temática conocida.
 */
export type QuickFilter =
  | "all"
  | "publicidad"
  | "consumidor"
  | "aml"
  | "fintech"
  | "tributario"
  | "privacidad"
  | "deportiva"
  | "ciberseguridad"
  | "societario"
  | "bookmarks"
  | "otros";

/** Patrones (regex case-insensitive) por temática contra el área de interés. */
const TOPIC_PATTERNS: Record<Exclude<QuickFilter, "all" | "bookmarks" | "otros">, RegExp> = {
  publicidad: /publicidad|advertising/i,
  consumidor: /consumidor|consumer/i,
  aml: /\baml\b|uif|lavado|antilavado|anti-?lavado|money\s*laundering/i,
  fintech: /fintech|pagos|payment|medios de pago/i,
  tributario: /tributari|fiscal|impuest|\btax\b|sunat/i,
  privacidad: /privacidad|datos personales|anpd|gdpr|protecci[oó]n de datos/i,
  deportiva: /deportiv|integridad deportiva|sport/i,
  ciberseguridad: /ciberseg|cybersec|seguridad de la informaci[oó]n|infosec/i,
  societario: /societari|gobierno corporativo|corporate governance|mercantil/i,
};

const ALL_TOPIC_PATTERNS = Object.values(TOPIC_PATTERNS);

function getAlertTopics(a: PeruAlert): string[] {
  const fromAreas = Array.isArray(a.affected_areas) ? a.affected_areas : [];
  const fromInterest = Array.isArray((a as any).area_de_interes)
    ? ((a as any).area_de_interes as string[])
    : [];
  return [...fromAreas, ...fromInterest].filter(
    (s): s is string => typeof s === "string" && s.length > 0,
  );
}

function matchesTopic(a: PeruAlert, pattern: RegExp): boolean {
  return getAlertTopics(a).some((t) => pattern.test(t));
}

function isOtros(a: PeruAlert): boolean {
  const topics = getAlertTopics(a);
  if (topics.length === 0) return true;
  return !topics.some((t) => ALL_TOPIC_PATTERNS.some((re) => re.test(t)));
}

export function applyQuickFilter(alerts: PeruAlert[], qf: QuickFilter): PeruAlert[] {
  if (qf === "all") return alerts;
  if (qf === "bookmarks") return alerts.filter((a) => a.is_pinned_for_publication);
  if (qf === "otros") return alerts.filter(isOtros);
  const pattern = TOPIC_PATTERNS[qf];
  return alerts.filter((a) => matchesTopic(a, pattern));
}

export function countByQuickFilter(alerts: PeruAlert[]): Record<QuickFilter, number> {
  return {
    all: alerts.length,
    publicidad: alerts.filter((a) => matchesTopic(a, TOPIC_PATTERNS.publicidad)).length,
    consumidor: alerts.filter((a) => matchesTopic(a, TOPIC_PATTERNS.consumidor)).length,
    aml: alerts.filter((a) => matchesTopic(a, TOPIC_PATTERNS.aml)).length,
    fintech: alerts.filter((a) => matchesTopic(a, TOPIC_PATTERNS.fintech)).length,
    tributario: alerts.filter((a) => matchesTopic(a, TOPIC_PATTERNS.tributario)).length,
    privacidad: alerts.filter((a) => matchesTopic(a, TOPIC_PATTERNS.privacidad)).length,
    deportiva: alerts.filter((a) => matchesTopic(a, TOPIC_PATTERNS.deportiva)).length,
    ciberseguridad: alerts.filter((a) => matchesTopic(a, TOPIC_PATTERNS.ciberseguridad)).length,
    societario: alerts.filter((a) => matchesTopic(a, TOPIC_PATTERNS.societario)).length,
    bookmarks: alerts.filter((a) => a.is_pinned_for_publication).length,
    otros: alerts.filter(isOtros).length,
  };
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
  hint: string;
  /** Tailwind classes for the dot + accent. */
  dot: string;
  text: string;
}

export const ZONE_META: Record<CardZone, ZoneMeta> = {
  action: {
    id: "action",
    label: "Acción requerida",
    hint: "Proyectos con impacto o urgencia ≥ 70 en etapa avanzada del Congreso, o con movimiento en los últimos 30 días. Son los de mayor riesgo en el corto plazo.",
    dot: "bg-destructive",
    text: "text-destructive",
  },
  monitor: {
    id: "monitor",
    label: "Monitorear",
    hint: "Impacto o urgencia moderados (al menos uno ≥ 40). Si su score sube o avanzan en el Congreso, suben a Acción requerida automáticamente.",
    dot: "bg-[hsl(var(--warning))]",
    text: "text-[hsl(var(--warning))]",
  },
  low: {
    id: "low",
    label: "Bajo impacto",
    hint: "Score de impacto y urgencia bajos (ambos < 40). No son prioridad por ahora.",
    dot: "bg-muted-foreground",
    text: "text-muted-foreground",
  },
  lagging: {
    id: "lagging",
    label: "Rezagadas",
    hint: "Sin movimiento en el Congreso: 6 meses si score < 70, o 12 meses si score ≥ 70. Bookmark protege de este movimiento automático.",
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
