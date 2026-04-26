// Computes "since last login" stats for the DailySummaryPopup.
//
// Source of truth:
// - "Leyes y proyectos analizados" = alerts created/ingested since last login
//   (across the user's organization).
// - "Alertas relevantes detectadas" = alerts in the inbox queue since last
//   login (status = 'pending_review' or 'in_review' OR client-published for
//   client users).
// - "Urgentes" = subset of the above with high urgency.
//
// We use `profile.last_login_at` as the cutoff. AuthContext refreshes that
// timestamp on SIGNED_IN, but we compute against the *previous* value: the
// profile object loaded on mount still holds the prior last_login_at, since
// the update happens server-side after the profile fetch resolves with the
// stored value. If last_login_at is null, fall back to last 24h.

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useClientUser } from "./useClientUser";

interface DailySummaryStats {
  lawsAnalyzed: number;
  alertsDetected: number;
  urgentAlerts: number;
  loading: boolean;
  sinceDate: Date | null;
}

export function useDailySummaryStats(enabled: boolean = true): DailySummaryStats {
  const { profile } = useAuth();
  const { isClientUser, clientId } = useClientUser();
  const [stats, setStats] = useState<DailySummaryStats>({
    lawsAnalyzed: 0,
    alertsDetected: 0,
    urgentAlerts: 0,
    loading: true,
    sinceDate: null,
  });

  useEffect(() => {
    if (!enabled || !profile) {
      return;
    }

    let cancelled = false;

    const run = async () => {
      // Cutoff: previous last_login_at, else last 24h.
      const cutoff = profile.last_login_at
        ? new Date(profile.last_login_at)
        : new Date(Date.now() - 24 * 60 * 60 * 1000);
      const cutoffIso = cutoff.toISOString();

      try {
        // Total alerts ingested since cutoff (org-wide for admin, client-scoped for client).
        let analyzedQuery = supabase
          .from("alerts")
          .select("id", { count: "exact", head: true })
          .gte("created_at", cutoffIso);

        if (isClientUser && clientId) {
          analyzedQuery = analyzedQuery
            .eq("client_id", clientId)
            .eq("status", "published");
        } else if (profile.organization_id) {
          analyzedQuery = analyzedQuery.eq("organization_id", profile.organization_id);
        }

        // Relevant alerts (inbox-worthy) since cutoff.
        let relevantQuery = supabase
          .from("alerts")
          .select("id, urgency_level, urgencia_categoria", { count: "exact" })
          .gte("created_at", cutoffIso);

        if (isClientUser && clientId) {
          relevantQuery = relevantQuery
            .eq("client_id", clientId)
            .eq("status", "published");
        } else if (profile.organization_id) {
          relevantQuery = relevantQuery
            .eq("organization_id", profile.organization_id)
            .in("status", ["pending_review", "in_review", "published"]);
        }

        const [analyzedRes, relevantRes] = await Promise.all([
          analyzedQuery,
          relevantQuery,
        ]);

        if (cancelled) return;

        const relevantRows = (relevantRes.data ?? []) as Array<{
          urgency_level: string | null;
          urgencia_categoria: string | null;
        }>;

        const urgentCount = relevantRows.filter((r) => {
          const lvl = (r.urgency_level || "").toLowerCase();
          const cat = (r.urgencia_categoria || "").toLowerCase();
          return (
            lvl === "high" ||
            lvl === "critical" ||
            lvl === "urgent" ||
            cat === "alta" ||
            cat === "crítica" ||
            cat === "critica" ||
            cat === "urgente"
          );
        }).length;

        setStats({
          lawsAnalyzed: analyzedRes.count ?? 0,
          alertsDetected: relevantRes.count ?? relevantRows.length,
          urgentAlerts: urgentCount,
          loading: false,
          sinceDate: cutoff,
        });
      } catch (err) {
        console.error("[useDailySummaryStats] Failed to load stats", err);
        if (!cancelled) {
          setStats((s) => ({ ...s, loading: false }));
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [enabled, profile, isClientUser, clientId]);

  return stats;
}
