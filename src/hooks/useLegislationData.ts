import { useState, useEffect, useMemo } from "react";
import { Alert, FilterState } from "@/types/legislation";
import { parseDate, isWithinTimeWindow, isWithinDateRange } from "@/lib/dateUtils";

export function useLegislationData() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("/data/alerts_final.json");
        if (!response.ok) {
          throw new Error("Failed to load legislation data");
        }
        const data: Alert[] = await response.json();
        
        // Filter to only ALERT_NOW items and exclude bills
        const filtered = data.filter(
          (item) =>
            item.AI_triage?.recommended_action === "ALERT_NOW" &&
            !item.csv_collection?.toLowerCase().includes("bill")
        );
        
        setAlerts(filtered);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return { alerts, loading, error };
}

export function useFilteredAlerts(alerts: Alert[], filters: FilterState) {
  return useMemo(() => {
    return alerts.filter((alert) => {
      // Time window filter
      const effectiveDate = parseDate(alert.effective_date) || parseDate(alert.registered_date);
      if (effectiveDate && !isWithinTimeWindow(effectiveDate, filters.timeWindow)) {
        return false;
      }

      // Portfolio filter
      if (filters.portfolios.length > 0 && !filters.portfolios.includes(alert.csv_portfolio)) {
        return false;
      }

      // Regulator filter
      if (filters.regulators.length > 0) {
        const regulator = alert.authorised_by?.name || "";
        if (!filters.regulators.includes(regulator)) {
          return false;
        }
      }

      // Type filter
      if (filters.types.length > 0) {
        const matchesCollection = filters.types.includes(alert.csv_collection);
        const matchesDocView = alert.doc_view && filters.types.includes(alert.doc_view);
        if (!matchesCollection && !matchesDocView) {
          return false;
        }
      }

      // Risk score filter
      const riskScore = alert.AI_triage?.risk_score_hint || 0;
      if (riskScore < filters.riskScoreRange[0] || riskScore > filters.riskScoreRange[1]) {
        return false;
      }

      // Search text filter
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        const matchesTitle = (alert.title || alert.csv_name || "").toLowerCase().includes(searchLower);
        const matchesSummary = (alert.AI_triage?.summary || "").toLowerCase().includes(searchLower);
        const matchesBullets = alert.AI_triage?.alert_bullets?.some(b => 
          b.toLowerCase().includes(searchLower)
        );
        
        if (!matchesTitle && !matchesSummary && !matchesBullets) {
          return false;
        }
      }

      return true;
    });
  }, [alerts, filters]);
}
