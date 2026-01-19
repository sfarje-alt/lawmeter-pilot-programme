import { useState, useMemo, useCallback } from "react";
import { ALL_MOCK_ALERTS, PeruAlert, KANBAN_COLUMNS } from "@/data/peruAlertsMockData";
import { InboxFilters } from "@/components/inbox/InboxFilterBar";

export function useInboxAlerts() {
  const [alerts, setAlerts] = useState<PeruAlert[]>(ALL_MOCK_ALERTS);
  const [filters, setFilters] = useState<InboxFilters>({
    search: "",
    type: "all",
    area: "all",
    riskLevel: "all",
  });

  // Filter alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesTitle = alert.legislation_title.toLowerCase().includes(searchLower);
        const matchesId = alert.legislation_id.toLowerCase().includes(searchLower);
        if (!matchesTitle && !matchesId) return false;
      }

      // Type filter
      if (filters.type !== "all" && alert.legislation_type !== filters.type) {
        return false;
      }

      // Area filter
      if (filters.area !== "all" && !alert.affected_areas.includes(filters.area)) {
        return false;
      }

      // Risk level filter
      if (filters.riskLevel !== "all" && alert.risk_level !== filters.riskLevel) {
        return false;
      }

      return true;
    });
  }, [alerts, filters]);

  // Group alerts by kanban stage
  const alertsByStage = useMemo(() => {
    const grouped: Record<PeruAlert["kanban_stage"], PeruAlert[]> = {
      comision: [],
      pleno: [],
      tramite_final: [],
      publicado: [],
      archivado: [],
    };

    filteredAlerts.forEach((alert) => {
      grouped[alert.kanban_stage].push(alert);
    });

    // Sort each column by date (newest first)
    Object.keys(grouped).forEach((stage) => {
      grouped[stage as PeruAlert["kanban_stage"]].sort((a, b) => {
        const dateA = new Date(a.updated_at).getTime();
        const dateB = new Date(b.updated_at).getTime();
        return dateB - dateA;
      });
    });

    return grouped;
  }, [filteredAlerts]);

  // Alert counts
  const alertCounts = useMemo(() => ({
    total: alerts.length,
    bills: alerts.filter(a => a.legislation_type === "proyecto_de_ley").length,
    norms: alerts.filter(a => a.legislation_type === "norma").length,
  }), [alerts]);

  // Decline alert (move to archivado)
  const declineAlert = useCallback((alert: PeruAlert) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alert.id
          ? { ...a, kanban_stage: "archivado" as const, status: "declined" as const, updated_at: new Date().toISOString() }
          : a
      )
    );
  }, []);

  // Publish alert (move to publicado and assign client)
  const publishAlert = useCallback((alert: PeruAlert, clientId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alert.id
          ? { 
              ...a, 
              kanban_stage: "publicado" as const, 
              status: "published" as const, 
              client_id: clientId,
              updated_at: new Date().toISOString() 
            }
          : a
      )
    );
  }, []);

  // Update alert commentary
  const updateCommentary = useCallback((alertId: string, commentary: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? { ...a, expert_commentary: commentary, updated_at: new Date().toISOString() }
          : a
      )
    );
  }, []);

  // Move alert to a different stage
  const moveAlert = useCallback((alertId: string, newStage: PeruAlert["kanban_stage"]) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? { ...a, kanban_stage: newStage, updated_at: new Date().toISOString() }
          : a
      )
    );
  }, []);

  return {
    alerts: filteredAlerts,
    alertsByStage,
    alertCounts,
    filters,
    setFilters,
    declineAlert,
    publishAlert,
    updateCommentary,
    moveAlert,
    kanbanColumns: KANBAN_COLUMNS,
  };
}
