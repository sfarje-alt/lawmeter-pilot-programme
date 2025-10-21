import { useState, useEffect, useMemo } from "react";
import { Alert, FilterState } from "@/types/legislation";
import { parseDate, isWithinTimeWindow, isWithinDateRange } from "@/lib/dateUtils";
import { generateMatrixAlerts } from "@/data/generateMatrixAlerts";

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
        
        // Add generated matrix alerts for demo
        const matrixAlerts = generateMatrixAlerts();
        const combined = [...matrixAlerts, ...filtered];
        
        setAlerts(combined);
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
    let filtered = alerts.filter((alert) => {
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

      // Risk level filter
      if (filters.riskLevels.length > 0 && !filters.riskLevels.includes(alert.AI_triage?.risk_level)) {
        return false;
      }

      // Urgency level filter (based on portfolio_priority)
      if (filters.urgencyLevels.length > 0 && !filters.urgencyLevels.includes(alert.AI_triage?.portfolio_priority)) {
        return false;
      }

      // Deadline filter
      if (filters.hasDeadline !== null) {
        const hasDeadline = !!alert.AI_triage?.deadline_detected;
        if (hasDeadline !== filters.hasDeadline) {
          return false;
        }
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

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case "registered":
        case "date":
          const regDateA = parseDate(a.registered_date) || new Date(0);
          const regDateB = parseDate(b.registered_date) || new Date(0);
          comparison = regDateA.getTime() - regDateB.getTime();
          break;
        
        case "effective":
          const effDateA = parseDate(a.effective_date) || new Date(0);
          const effDateB = parseDate(b.effective_date) || new Date(0);
          comparison = effDateA.getTime() - effDateB.getTime();
          break;
        
        case "risk":
          const riskA = a.AI_triage?.risk_score_hint || 0;
          const riskB = b.AI_triage?.risk_score_hint || 0;
          comparison = riskA - riskB;
          break;
        
        case "relevance":
          const relevanceA = a.AI_triage?.score || 0;
          const relevanceB = b.AI_triage?.score || 0;
          comparison = relevanceA - relevanceB;
          break;
        
        case "deadline":
          const deadlineA = a.AI_triage?.deadline_detected ? parseDate(a.AI_triage.deadline_detected) : null;
          const deadlineB = b.AI_triage?.deadline_detected ? parseDate(b.AI_triage.deadline_detected) : null;
          if (!deadlineA && !deadlineB) comparison = 0;
          else if (!deadlineA) comparison = 1;
          else if (!deadlineB) comparison = -1;
          else comparison = deadlineA.getTime() - deadlineB.getTime();
          break;
      }

      return filters.sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [alerts, filters]);
}
