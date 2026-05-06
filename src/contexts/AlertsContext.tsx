import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import {
  PeruAlert,
  AttachedFileMetaRef,
  ImpactLevel,
  STAGE_TO_KANBAN,
  getStateFamily,
  purgeOldArchivedAlerts,
  KeyDate,
} from "@/data/peruAlertsMockData";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { normalizeEntityName } from "@/lib/entityNormalization";

interface AlertsContextType {
  alerts: PeruAlert[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  togglePinAlert: (alertId: string) => void;
  archiveAlert: (alertId: string) => void;
  unarchiveAlert: (alertId: string) => void;
  updateSharedCommentary: (alertId: string, commentary: string) => void;
  updateAttachments: (alertId: string, attachments: AttachedFileMetaRef[]) => void;
  getPinnedAlerts: () => PeruAlert[];
}

const AlertsContext = createContext<AlertsContextType | undefined>(undefined);

const PINNED_STORAGE_KEY = "lawmeter:pinned-alerts";
const ARCHIVED_STORAGE_KEY = "lawmeter:archived-alerts"; // alertId -> ISO archived_at
const COMMENTARY_STORAGE_KEY = "lawmeter:expert-commentary"; // alertId -> string
const ATTACHMENTS_STORAGE_KEY = "lawmeter:alert-attachments"; // alertId -> AttachedFileMetaRef[]

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
function saveJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

function loadPinnedIds(): Set<string> {
  const arr = loadJSON<string[]>(PINNED_STORAGE_KEY, []);
  return new Set(Array.isArray(arr) ? arr : []);
}
function savePinnedIds(ids: Set<string>) {
  saveJSON(PINNED_STORAGE_KEY, Array.from(ids));
}

const AUTO_ARCHIVE_DAYS = 30;

/**
 * Auto-archive any non-pinned alert that has been in the inbox for more than
 * AUTO_ARCHIVE_DAYS days (based on created_at). Bookmarked alerts are protected.
 * Mutates the archived_at field in-place on returned alerts and persists to
 * localStorage so it sticks across reloads.
 */
function applyAutoArchive(alerts: PeruAlert[]): PeruAlert[] {
  const now = Date.now();
  const cutoffMs = AUTO_ARCHIVE_DAYS * 24 * 60 * 60 * 1000;
  const archivedMap = loadJSON<Record<string, string>>(ARCHIVED_STORAGE_KEY, {});
  let mutated = false;
  const out = alerts.map((a) => {
    if (a.archived_at) return a;
    if (a.is_pinned_for_publication) return a;
    const createdMs = a.created_at ? new Date(a.created_at).getTime() : NaN;
    if (!Number.isFinite(createdMs)) return a;
    if (now - createdMs <= cutoffMs) return a;
    const archivedIso = new Date(createdMs + cutoffMs).toISOString();
    archivedMap[a.id] = archivedIso;
    mutated = true;
    return { ...a, archived_at: archivedIso };
  });
  if (mutated) saveJSON(ARCHIVED_STORAGE_KEY, archivedMap);
  return out;
}

/** Normalize DB legislation_type to UI value. */
function normalizeType(t: string | null): "proyecto_de_ley" | "norma" | null {
  if (!t) return null;
  if (t === "pl" || t === "proyecto_de_ley") return "proyecto_de_ley";
  if (t === "norma") return "norma";
  return null;
}

/** Map "Alta/Media/Baja" (case-insensitive) to ImpactLevel. */
function mapCategoriaToImpact(cat: string | null | undefined): ImpactLevel | null {
  if (!cat) return null;
  const c = String(cat).trim().toLowerCase();
  if (c === "alta") return "grave";
  if (c === "media") return "medio";
  if (c === "baja") return "leve";
  if (c === "positivo" || c === "positiva") return "positivo";
  return null;
}

/** Derive an ImpactLevel label from a numeric AI impact score (0-100). Thresholds 70/30/0. */
function deriveImpactLevel(score: number | null | undefined, fallback?: string | null): ImpactLevel {
  if (typeof score === "number" && !Number.isNaN(score)) {
    if (score >= 70) return "grave";
    if (score >= 30) return "medio";
    return "leve";
  }
  if (fallback === "grave" || fallback === "medio" || fallback === "leve" || fallback === "positivo") {
    return fallback;
  }
  return "medio";
}

/** Map DB row to PeruAlert shape used across the UI. */
function mapDbRowToAlert(
  row: any,
  pinned: Set<string>,
  archivedMap: Record<string, string>,
  commentaryMap: Record<string, string>,
  attachmentsMap: Record<string, AttachedFileMetaRef[]>,
): PeruAlert | null {
  const type = normalizeType(row.legislation_type);
  if (!type) return null;

  const ai = (row.ai_analysis ?? {}) as Record<string, any>;
  const ui = (ai.ui_extras ?? {}) as Record<string, any>;
  const sourceRef = (ui.source_ref ?? {}) as Record<string, any>;

  // Resolve kanban_stage — Publicado/Archivado mapean a tramite_final por regla.
  let kanban: PeruAlert["kanban_stage"];
  if (type === "norma") {
    kanban = "publicado";
  } else {
    const stageKey = String(row.estado_actual ?? "").trim().toUpperCase();
    kanban = STAGE_TO_KANBAN[stageKey] ?? "comision";
  }

  // State family — drives badge color (independent of kanban column).
  const family = getStateFamily(row.estado_actual);

  // Impact level: prioridad estricta:
  //   1) row.impacto_categoria  (top-level columna, "Alta/Media/Baja" del payload)
  //   2) ui.impact_level        (legacy en ai_analysis.ui_extras)
  //   3) deriveImpactLevel(score) con umbrales 70/30/0
  const impactoScore = typeof row.impacto === "number"
    ? row.impacto
    : (typeof ai.impacto === "number" ? ai.impacto : null);
  const urgenciaScore = typeof row.urgencia === "number"
    ? row.urgencia
    : (typeof ai.urgencia === "number" ? ai.urgencia : null);
  const impact: ImpactLevel =
    mapCategoriaToImpact(row.impacto_categoria) ??
    (ui.impact_level as ImpactLevel | undefined) ??
    deriveImpactLevel(impactoScore, ui.impact_level);

  const rationale: string[] = Array.isArray(ai.racional) ? ai.racional.filter((r: unknown): r is string => typeof r === "string") : [];
  const keyDates: KeyDate[] = Array.isArray(ai.fechas_identificadas)
    ? ai.fechas_identificadas.filter((d: any) => d && typeof d.fecha === "string" && typeof d.rol === "string")
    : [];

  // Title fallback for safety
  const title =
    row.legislation_title ||
    row.sumilla ||
    row.codigo ||
    row.reference_number ||
    "Sin título";

  return {
    id: row.id,
    legislation_type: type,
    legislation_title: title,
    affected_areas: Array.isArray(row.affected_areas) ? row.affected_areas : [],
    source_url: row.url ?? row.source_url ?? null,
    status: (row.status as PeruAlert["status"]) ?? "inbox",
    kanban_stage: kanban,
    client_id: row.client_id ?? null,
    created_at: row.created_at,
    updated_at: row.updated_at,

    // Bill-specific
    legislation_id: row.codigo ?? sourceRef.codigo ?? row.legislation_id ?? undefined,
    expert_commentary: commentaryMap[row.id] ?? row.expert_commentary ?? null,
    parliamentary_group: ui.parliamentary_group ?? sourceRef.grupo_parlamentario ?? undefined,
    author: ui.author ?? sourceRef.autor ?? undefined,
    current_stage: row.estado_actual ?? sourceRef.estado_actual ?? undefined,
    stage_date: (() => {
      // Última fecha del seguimiento (más reciente)
      const seg = Array.isArray(row.seguimiento) ? row.seguimiento : [];
      const dates = seg
        .map((e: any) => e?.fecha)
        .filter((f: any): f is string => typeof f === "string" && f.length > 0)
        .sort();
      return dates.length > 0 ? dates[dates.length - 1] : (sourceRef.fecha_estado ?? undefined);
    })(),
    project_date: row.fecha_presentacion ?? sourceRef.fecha_proyecto ?? sourceRef.fecha_presentacion ?? undefined,
    sector: ui.sector ?? undefined,
    impact_level: impact,

    // Regulation-specific
    entity: normalizeEntityName(row.entity ?? ui.entity ?? undefined) || undefined,
    publication_date:
      row.fecha_publicacion
      ?? ui.publication_date
      ?? sourceRef.date
      ?? sourceRef.fecha_publicacion
      ?? keyDates.find((d) => ["publicacion", "publicación", "publication", "published"].includes(String(d.rol).toLowerCase()))?.fecha
      ?? undefined,
    legislation_summary: row.legislation_summary ?? row.sumilla ?? null,

    // Workflow
    is_pinned_for_publication: pinned.has(row.id) || !!ui.is_pinned_for_publication,
    client_commentaries: Array.isArray(ui.client_commentaries) ? ui.client_commentaries : [],
    primary_client_id: ui.primary_client_id ?? undefined,
    archived_at: archivedMap[row.id] ?? null,
    approval_probability: ui.approval_probability ?? undefined,
    attachments: attachmentsMap[row.id] ?? [],

    // ---- New fields backed by ai_analysis + DB extras ----
    impacto_score: impactoScore ?? undefined,
    urgencia_score: urgenciaScore ?? undefined,
    rationale,
    key_dates: keyDates,
    state_family: family,
    previous_stage: row.estado_anterior ?? null,
    is_state_change: !!row.es_cambio_estado,
    reference_number: row.reference_number ?? undefined,
    fuente: row.fuente ?? undefined,
    urgency_category: (() => {
      const c = String(row.urgencia_categoria ?? "").trim().toLowerCase();
      if (c === "alta" || c === "media" || c === "baja") return c;
      // fallback derived from numeric urgencia (70/30/0)
      if (typeof urgenciaScore === "number") {
        if (urgenciaScore >= 70) return "alta";
        if (urgenciaScore >= 30) return "media";
        return "baja";
      }
      return null;
    })(),
    impact_category: (() => {
      const c = String(row.impacto_categoria ?? "").trim().toLowerCase();
      if (c === "alta" || c === "media" || c === "baja" || c === "positivo") return c;
      return null;
    })(),
    autores: Array.isArray(row.autores) ? row.autores : [],
    proponente: row.proponente ?? undefined,
    fecha_presentacion: row.fecha_presentacion ?? undefined,
    comentario: row.comentario ?? undefined,
    seguimiento: Array.isArray(row.seguimiento) ? row.seguimiento : [],
    version: typeof row.version === "number" ? row.version : undefined,
    source_codigo: sourceRef.codigo ?? row.codigo ?? undefined,
    version_history: Array.isArray(ai.version_history) ? ai.version_history : [],
  };
}

/**
 * Dedupe PL alerts by source_ref.codigo (or codigo): keep only the row with
 * the highest `version`. Normas and rows without codigo pass through.
 */
function dedupeByCodigoLatestVersion(alerts: PeruAlert[]): PeruAlert[] {
  const byKey = new Map<string, PeruAlert>();
  const passthrough: PeruAlert[] = [];
  for (const a of alerts) {
    const key = a.source_codigo || a.legislation_id;
    if (!key || a.legislation_type !== "proyecto_de_ley") {
      passthrough.push(a);
      continue;
    }
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, a);
      continue;
    }
    const va = a.version ?? 0;
    const ve = existing.version ?? 0;
    if (va > ve) {
      byKey.set(key, a);
    } else if (va === ve) {
      const ta = new Date(a.updated_at || a.created_at || 0).getTime();
      const te = new Date(existing.updated_at || existing.created_at || 0).getTime();
      if (ta > te) byKey.set(key, a);
    }
  }
  return [...byKey.values(), ...passthrough];
}

export function AlertsProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const orgId = profile?.organization_id ?? null;

  const [alerts, setAlerts] = useState<PeruAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    if (!orgId) {
      setAlerts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: dbError } = await supabase
      .from("alerts")
      .select("*")
      .eq("organization_id", orgId)
      .order("created_at", { ascending: false });

    if (dbError) {
      console.error("[AlertsContext] error loading alerts:", dbError);
      setError(dbError.message);
      setAlerts([]);
      setLoading(false);
      return;
    }

    const pinned = loadPinnedIds();
    const archivedMap = loadJSON<Record<string, string>>(ARCHIVED_STORAGE_KEY, {});
    const commentaryMap = loadJSON<Record<string, string>>(COMMENTARY_STORAGE_KEY, {});
    const attachmentsMap = loadJSON<Record<string, AttachedFileMetaRef[]>>(ATTACHMENTS_STORAGE_KEY, {});

    const mapped = (data ?? [])
      .map((row) => mapDbRowToAlert(row, pinned, archivedMap, commentaryMap, attachmentsMap))
      .filter((a): a is PeruAlert => a !== null);

    setAlerts(purgeOldArchivedAlerts(mapped));
    setLoading(false);
  }, [orgId]);

  // Initial load + reload when org changes
  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  // Realtime subscription so newly ingested alerts appear without refresh
  useEffect(() => {
    if (!orgId) return;
    const channel = supabase
      .channel(`alerts-${orgId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "alerts", filter: `organization_id=eq.${orgId}` },
        () => fetchAlerts(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [orgId, fetchAlerts]);

  // Auto-purge archived periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts((prev) => {
        const next = purgeOldArchivedAlerts(prev);
        return next.length === prev.length ? prev : next;
      });
    }, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const togglePinAlert = useCallback((alertId: string) => {
    setAlerts((prev) => {
      const next = prev.map((a) =>
        a.id === alertId
          ? { ...a, is_pinned_for_publication: !a.is_pinned_for_publication }
          : a,
      );
      const pinnedIds = new Set(next.filter((a) => a.is_pinned_for_publication).map((a) => a.id));
      savePinnedIds(pinnedIds);
      return next;
    });
  }, []);

  const archiveAlert = useCallback((alertId: string) => {
    const nowIso = new Date().toISOString();
    setAlerts((prev) => {
      const next = prev.map((a) =>
        a.id === alertId
          ? { ...a, archived_at: nowIso, is_pinned_for_publication: false, updated_at: nowIso }
          : a,
      );
      const archivedMap = loadJSON<Record<string, string>>(ARCHIVED_STORAGE_KEY, {});
      archivedMap[alertId] = nowIso;
      saveJSON(ARCHIVED_STORAGE_KEY, archivedMap);
      const pinnedIds = new Set(next.filter((a) => a.is_pinned_for_publication).map((a) => a.id));
      savePinnedIds(pinnedIds);
      return next;
    });
  }, []);

  const unarchiveAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? { ...a, archived_at: null, updated_at: new Date().toISOString() }
          : a,
      ),
    );
    const archivedMap = loadJSON<Record<string, string>>(ARCHIVED_STORAGE_KEY, {});
    delete archivedMap[alertId];
    saveJSON(ARCHIVED_STORAGE_KEY, archivedMap);
  }, []);

  const updateSharedCommentary = useCallback((alertId: string, commentary: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, expert_commentary: commentary } : a)),
    );
    const map = loadJSON<Record<string, string>>(COMMENTARY_STORAGE_KEY, {});
    map[alertId] = commentary;
    saveJSON(COMMENTARY_STORAGE_KEY, map);
    // Persist to DB best-effort (RLS will allow org members)
    supabase
      .from("alerts")
      .update({ expert_commentary: commentary })
      .eq("id", alertId)
      .then(({ error: e }) => {
        if (e) console.warn("[AlertsContext] could not persist commentary:", e.message);
      });
  }, []);

  const updateAttachments = useCallback((alertId: string, attachments: AttachedFileMetaRef[]) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, attachments } : a)),
    );
    const map = loadJSON<Record<string, AttachedFileMetaRef[]>>(ATTACHMENTS_STORAGE_KEY, {});
    map[alertId] = attachments;
    saveJSON(ATTACHMENTS_STORAGE_KEY, map);
  }, []);

  const getPinnedAlerts = useCallback((): PeruAlert[] => {
    return alerts.filter((a) => a.is_pinned_for_publication);
  }, [alerts]);

  return (
    <AlertsContext.Provider
      value={{
        alerts,
        loading,
        error,
        refresh: fetchAlerts,
        togglePinAlert,
        archiveAlert,
        unarchiveAlert,
        updateSharedCommentary,
        updateAttachments,
        getPinnedAlerts,
      }}
    >
      {children}
    </AlertsContext.Provider>
  );
}

export function useAlerts() {
  const context = useContext(AlertsContext);
  if (!context) {
    throw new Error("useAlerts must be used within an AlertsProvider");
  }
  return context;
}
