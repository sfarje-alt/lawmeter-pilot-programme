// Hook for fetching Congress sessions from public.sesiones
// Phase 1-5: read-only, no IA on-demand yet.

import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AnalysisStatus =
  | "NOT_REQUESTED"
  | "REQUESTED"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

export interface Sesion {
  id: string;
  external_id: string;
  organization_id: string;
  client_id: string;
  commission_name: string;
  commission_normalized: string;
  session_title: string | null;
  scheduled_at: string | null;
  scheduled_date_text: string | null;
  agenda_url: string | null;
  agenda_markdown: string | null;
  agenda_scraped_at: string | null;
  video_url: string | null;
  video_resolved_at: string | null;
  es_de_interes: boolean;
  analysis_status: AnalysisStatus;
  analysis_error: string | null;
  analysis_requested_at: string | null;
  analysis_started_at: string | null;
  analysis_completed_at: string | null;
  impacto: number | null;
  urgencia: number | null;
  impacto_categoria: string | null;
  urgencia_categoria: string | null;
  resumen_ejecutivo: string | null;
  comentario: string | null;
  puntos_clave:
    | Array<{ timestamp: string; topic: string; relevancia: string }>
    | null;
  area_de_interes: string[] | null;
  racional: string[] | null;
  recomendaciones: string[] | null;
  transcript_excerpt: string | null;
  analysis_model: string | null;
  analysis_cost_usd: number | null;
  transcript_duration_s: number | null;
  created_at: string;
  updated_at: string;
}

interface UseSesionesOptions {
  onlyDeInteres?: boolean;
  daysBack?: number; // default 7 for bandeja
}

export function useSesiones(opts: UseSesionesOptions = {}) {
  const { onlyDeInteres = true, daysBack } = opts;
  const [sesiones, setSesiones] = useState<Sesion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSesiones = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from("sesiones" as any)
        .select("*")
        .order("scheduled_at", { ascending: false, nullsFirst: false });

      if (onlyDeInteres) query = query.eq("es_de_interes", true);
      if (daysBack !== undefined) {
        const since = new Date(
          Date.now() - daysBack * 24 * 60 * 60 * 1000,
        ).toISOString();
        query = query.gte("scheduled_at", since);
      }

      const { data, error: qErr } = await query;
      if (qErr) throw qErr;
      setSesiones((data ?? []) as unknown as Sesion[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [onlyDeInteres, daysBack]);

  // Mantener una ref con la última fetch para usar dentro de timers/realtime
  // sin re-suscribir en cada render.
  const fetchRef = useRef(fetchSesiones);
  fetchRef.current = fetchSesiones;

  // Initial fetch + realtime + polling — todo en un único effect para mantener
  // el conteo de hooks estable.
  useEffect(() => {
    fetchRef.current();

    const channel = supabase
      .channel(`sesiones-list-${Math.random().toString(36).slice(2, 8)}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "sesiones" },
        (payload) => {
          const updated = payload.new as unknown as Sesion;
          setSesiones((prev) => {
            const idx = prev.findIndex((s) => s.id === updated.id);
            if (idx === -1) {
              if (!onlyDeInteres || updated.es_de_interes) {
                return [updated, ...prev];
              }
              return prev;
            }
            const next = [...prev];
            next[idx] = { ...next[idx], ...updated };
            return next;
          });
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "sesiones" },
        (payload) => {
          const inserted = payload.new as unknown as Sesion;
          if (onlyDeInteres && !inserted.es_de_interes) return;
          setSesiones((prev) =>
            prev.some((s) => s.id === inserted.id) ? prev : [inserted, ...prev],
          );
        },
      )
      .subscribe();

    // Polling cada 20s — el chequeo de inFlight se hace dentro del tick.
    const interval = setInterval(() => {
      // Solo refrescar si hay análisis en vuelo
      setSesiones((prev) => {
        const inFlight = prev.some(
          (s) => s.analysis_status === "REQUESTED" || s.analysis_status === "PROCESSING",
        );
        if (inFlight) fetchRef.current();
        return prev;
      });
    }, 20000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [onlyDeInteres, daysBack]);

  return { sesiones, loading, error, refetch: fetchSesiones };
}
