import { useState, useMemo, useCallback } from "react";
import { ALL_MOCK_ALERTS, PeruAlert, KANBAN_COLUMNS, ClientCommentary } from "@/data/peruAlertsMockData";

export interface InboxFilters {
  search: string;
  type: "all" | "proyecto_de_ley" | "norma";
  area: string;
  entity: string;
}

export function useInboxAlerts() {
  const [alerts, setAlerts] = useState<PeruAlert[]>(ALL_MOCK_ALERTS);
  const [filters, setFilters] = useState<InboxFilters>({
    search: "",
    type: "all",
    area: "all",
    entity: "all",
  });
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  // Filter alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesTitle = alert.legislation_title.toLowerCase().includes(searchLower);
        const matchesId = alert.legislation_id?.toLowerCase().includes(searchLower) || false;
        const matchesAuthor = alert.author?.toLowerCase().includes(searchLower) || false;
        const matchesEntity = alert.entity?.toLowerCase().includes(searchLower) || false;
        if (!matchesTitle && !matchesId && !matchesAuthor && !matchesEntity) return false;
      }

      // Type filter
      if (filters.type !== "all" && alert.legislation_type !== filters.type) {
        return false;
      }

      // Area filter
      if (filters.area !== "all" && !alert.affected_areas.includes(filters.area)) {
        return false;
      }

      // Entity filter (for normas)
      if (filters.entity !== "all" && alert.entity !== filters.entity) {
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

  // Pinned alerts
  const pinnedAlerts = useMemo(() => {
    return alerts.filter(a => a.is_pinned_for_publication);
  }, [alerts]);

  // Check if alert has commentary for selected client
  const hasCommentaryForClient = useCallback((alert: PeruAlert, clientId: string): boolean => {
    // First check if there's a client-specific commentary
    const clientCommentary = alert.client_commentaries.find(c => c.clientId === clientId);
    if (clientCommentary && clientCommentary.commentary.trim()) return true;
    // Fall back to shared expert_commentary
    return !!(alert.expert_commentary && alert.expert_commentary.trim());
  }, []);

  // Pin/unpin alert for publication
  const togglePinAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? { ...a, is_pinned_for_publication: !a.is_pinned_for_publication, updated_at: new Date().toISOString() }
          : a
      )
    );
  }, []);

  // Update client commentary for an alert
  const updateClientCommentary = useCallback((alertId: string, clientId: string, commentary: string) => {
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id !== alertId) return a;
        
        const existingIndex = a.client_commentaries.findIndex(c => c.clientId === clientId);
        const newCommentaries = [...a.client_commentaries];
        
        if (existingIndex >= 0) {
          newCommentaries[existingIndex] = { clientId, commentary };
        } else {
          newCommentaries.push({ clientId, commentary });
        }
        
        return {
          ...a,
          client_commentaries: newCommentaries,
          updated_at: new Date().toISOString()
        };
      })
    );
  }, []);

  // Update shared expert commentary
  const updateExpertCommentary = useCallback((alertId: string, commentary: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? { ...a, expert_commentary: commentary, updated_at: new Date().toISOString() }
          : a
      )
    );
  }, []);

  // Decline alert (move to archivado)
  const declineAlert = useCallback((alert: PeruAlert) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alert.id
          ? { ...a, kanban_stage: "archivado" as const, status: "declined" as const, is_pinned_for_publication: false, updated_at: new Date().toISOString() }
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
              is_pinned_for_publication: false,
              updated_at: new Date().toISOString() 
            }
          : a
      )
    );
  }, []);

  // Batch publish pinned alerts to selected clients
  const batchPublishPinned = useCallback((clientIds: string[]) => {
    setAlerts((prev) =>
      prev.map((a) => {
        if (!a.is_pinned_for_publication) return a;
        return {
          ...a,
          kanban_stage: "publicado" as const,
          status: "published" as const,
          client_id: clientIds[0] || null,
          is_pinned_for_publication: false,
          updated_at: new Date().toISOString()
        };
      })
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
    allAlerts: alerts,
    alertsByStage,
    alertCounts,
    pinnedAlerts,
    filters,
    setFilters,
    selectedClientId,
    setSelectedClientId,
    togglePinAlert,
    updateClientCommentary,
    updateExpertCommentary,
    hasCommentaryForClient,
    declineAlert,
    publishAlert,
    batchPublishPinned,
    moveAlert,
    kanbanColumns: KANBAN_COLUMNS,
  };
}
