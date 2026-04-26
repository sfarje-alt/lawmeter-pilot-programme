// Aggregates alert_feedback rows for the Operaciones internas block.
// Pulls org-scoped rows and computes simple rule-based flags client-side.

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface FeedbackRow {
  id: string;
  alert_id: string;
  user_id: string;
  client_id: string | null;
  rating: "very_useful" | "useful" | "not_relevant";
  reason_selected: string | null;
  optional_comment: string | null;
  alert_keywords_detected: string[] | null;
  alert_area: string | null;
  alert_jurisdiction: string | null;
  created_at: string;
}

export interface KeywordAggregate {
  keyword: string;
  total: number;
  not_relevant: number;
  very_useful: number;
  flag: string | null;
}

export interface ProfileAggregate {
  client_id: string | null;
  total: number;
  not_relevant: number;
  very_useful: number;
  flag: string | null;
}

export interface AreaAggregate {
  area: string;
  total: number;
  very_useful: number;
  not_relevant: number;
  flag: string | null;
}

export interface AlertFeedbackStats {
  loading: boolean;
  rows: FeedbackRow[];
  total: number;
  veryUseful: number;
  useful: number;
  notRelevant: number;
  byKeyword: KeywordAggregate[];
  byProfile: ProfileAggregate[];
  byArea: AreaAggregate[];
}

const NEGATIVE_THRESHOLD = 3;
const POSITIVE_THRESHOLD = 3;

export function useAlertFeedbackStats(): AlertFeedbackStats {
  const { profile } = useAuth();
  const [rows, setRows] = useState<FeedbackRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!profile?.organization_id) {
      setRows([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from("alert_feedback")
      .select(
        "id, alert_id, user_id, client_id, rating, reason_selected, optional_comment, alert_keywords_detected, alert_area, alert_jurisdiction, created_at",
      )
      .eq("organization_id", profile.organization_id)
      .order("created_at", { ascending: false })
      .limit(1000)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error("[useAlertFeedbackStats]", error);
          setRows([]);
        } else {
          setRows((data ?? []) as FeedbackRow[]);
        }
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [profile?.organization_id]);

  return useMemo(() => {
    const total = rows.length;
    const veryUseful = rows.filter((r) => r.rating === "very_useful").length;
    const useful = rows.filter((r) => r.rating === "useful").length;
    const notRelevant = rows.filter((r) => r.rating === "not_relevant").length;

    // Keyword aggregation (one row contributes once per keyword in its snapshot).
    const kwMap = new Map<string, KeywordAggregate>();
    for (const r of rows) {
      for (const kw of r.alert_keywords_detected ?? []) {
        const key = kw.trim();
        if (!key) continue;
        const cur =
          kwMap.get(key) ?? { keyword: key, total: 0, not_relevant: 0, very_useful: 0, flag: null };
        cur.total += 1;
        if (r.rating === "not_relevant") cur.not_relevant += 1;
        if (r.rating === "very_useful") cur.very_useful += 1;
        kwMap.set(key, cur);
      }
    }
    const byKeyword = Array.from(kwMap.values())
      .map((k) => ({
        ...k,
        flag: k.not_relevant >= NEGATIVE_THRESHOLD ? "Posible keyword demasiado amplia" : null,
      }))
      .sort((a, b) => b.not_relevant - a.not_relevant || b.total - a.total);

    // Profile/client aggregation
    const profMap = new Map<string, ProfileAggregate>();
    for (const r of rows) {
      const key = r.client_id ?? "__no_client__";
      const cur =
        profMap.get(key) ?? {
          client_id: r.client_id,
          total: 0,
          not_relevant: 0,
          very_useful: 0,
          flag: null,
        };
      cur.total += 1;
      if (r.rating === "not_relevant") cur.not_relevant += 1;
      if (r.rating === "very_useful") cur.very_useful += 1;
      profMap.set(key, cur);
    }
    const byProfile = Array.from(profMap.values())
      .map((p) => ({
        ...p,
        flag: p.not_relevant >= NEGATIVE_THRESHOLD ? "Perfil requiere ajuste" : null,
      }))
      .sort((a, b) => b.not_relevant - a.not_relevant);

    // Area aggregation
    const areaMap = new Map<string, AreaAggregate>();
    for (const r of rows) {
      const a = (r.alert_area ?? "Sin área").trim() || "Sin área";
      const cur =
        areaMap.get(a) ?? { area: a, total: 0, very_useful: 0, not_relevant: 0, flag: null };
      cur.total += 1;
      if (r.rating === "very_useful") cur.very_useful += 1;
      if (r.rating === "not_relevant") cur.not_relevant += 1;
      areaMap.set(a, cur);
    }
    const byArea = Array.from(areaMap.values())
      .map((a) => ({
        ...a,
        flag:
          a.very_useful >= POSITIVE_THRESHOLD ? "Área de alta relevancia para este perfil" : null,
      }))
      .sort((a, b) => b.very_useful - a.very_useful || b.total - a.total);

    return {
      loading,
      rows,
      total,
      veryUseful,
      useful,
      notRelevant,
      byKeyword,
      byProfile,
      byArea,
    };
  }, [rows, loading]);
}
