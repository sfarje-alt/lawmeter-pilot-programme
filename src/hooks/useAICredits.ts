// Hook para leer y suscribirse al balance de créditos IA de la organización.
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface AICreditsState {
  balance: number;
  included: number;
  totalConsumed: number;
  loading: boolean;
}

export const SESSION_ANALYSIS_COST = 10;
export const QA_MIN_COST = 1;
export const QA_MAX_COST = 3;

export function useAICredits() {
  const { profile } = useAuth();
  const orgId = profile?.organization_id ?? null;
  const [state, setState] = useState<AICreditsState>({
    balance: 0,
    included: 30,
    totalConsumed: 0,
    loading: true,
  });

  const fetchBalance = useCallback(async () => {
    if (!orgId) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }
    const { data, error } = await supabase
      .from("org_ai_credits")
      .select("balance, included_credits, total_consumed")
      .eq("organization_id", orgId)
      .maybeSingle();

    if (error) {
      console.error("[useAICredits] fetch error:", error);
      setState((s) => ({ ...s, loading: false }));
      return;
    }

    setState({
      balance: data?.balance ?? 30,
      included: data?.included_credits ?? 30,
      totalConsumed: data?.total_consumed ?? 0,
      loading: false,
    });
  }, [orgId]);

  useEffect(() => {
    fetchBalance();
    if (!orgId) return;

    const channel = supabase
      .channel(`org-credits-${orgId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "org_ai_credits",
          filter: `organization_id=eq.${orgId}`,
        },
        (payload) => {
          const row = payload.new as { balance?: number; included_credits?: number; total_consumed?: number };
          if (row?.balance !== undefined) {
            setState({
              balance: row.balance,
              included: row.included_credits ?? 30,
              totalConsumed: row.total_consumed ?? 0,
              loading: false,
            });
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orgId, fetchBalance]);

  return { ...state, refetch: fetchBalance };
}
