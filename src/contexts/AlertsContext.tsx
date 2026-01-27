import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { 
  ALL_MOCK_ALERTS, 
  PeruAlert, 
  ClientCommentary,
  PRIMARY_CLIENT_ID 
} from "@/data/peruAlertsMockData";

interface AlertsContextType {
  alerts: PeruAlert[];
  // Publishing
  publishAlert: (alert: PeruAlert, clientIds: string[], commentaries: ClientCommentary[]) => void;
  unpublishAlert: (alertId: string) => void;
  // Pinning
  togglePinAlert: (alertId: string) => void;
  // Commentary
  updateAlertCommentary: (alertId: string, clientId: string, commentary: string) => void;
  updateSharedCommentary: (alertId: string, commentary: string) => void;
  // Filtering helpers
  getPublishedAlertsForClient: (clientId: string) => PeruAlert[];
  getPinnedAlerts: () => PeruAlert[];
  // Check commentary
  hasCommentaryForClient: (alert: PeruAlert, clientId: string) => boolean;
}

const AlertsContext = createContext<AlertsContextType | undefined>(undefined);

// Initialize with some alerts pre-published for demo purposes
// Note: kanban_stage represents legislative stage (comision, pleno, tramite_final)
// and is independent of publication status
function initializeAlerts(): PeruAlert[] {
  return ALL_MOCK_ALERTS.map((alert, index) => {
    // Pre-publish first 5 bills and 3 regulations to FarmaSalud for demo
    const shouldPublish = 
      (alert.legislation_type === "proyecto_de_ley" && index < 5) ||
      (alert.legislation_type === "norma" && index >= 37 && index < 40);
    
    if (shouldPublish) {
      return {
        ...alert,
        status: "published" as const,
        // Keep original kanban_stage - publication doesn't change legislative stage
        client_id: PRIMARY_CLIENT_ID,
        client_commentaries: [{
          clientId: PRIMARY_CLIENT_ID,
          commentary: alert.expert_commentary || "Este proyecto de ley tiene implicaciones directas para las operaciones farmacéuticas. Se recomienda monitoreo continuo."
        }]
      };
    }
    return alert;
  });
}

export function AlertsProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<PeruAlert[]>(initializeAlerts);

  // Publish alert to specific clients
  // Note: Publishing only changes status - kanban_stage (legislative stage) remains unchanged
  const publishAlert = useCallback((
    alert: PeruAlert, 
    clientIds: string[], 
    commentaries: ClientCommentary[]
  ) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alert.id
          ? {
              ...a,
              status: "published" as const,
              // Keep original kanban_stage - publication doesn't change legislative stage
              client_id: clientIds[0] || null,
              is_pinned_for_publication: false,
              client_commentaries: commentaries,
              updated_at: new Date().toISOString(),
            }
          : a
      )
    );
  }, []);

  // Unpublish alert (return to reviewed status)
  // Note: Unpublishing only changes status - kanban_stage (legislative stage) remains unchanged
  const unpublishAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              status: "reviewed" as const,
              // Keep original kanban_stage - unpublishing doesn't change legislative stage
              client_id: null,
              updated_at: new Date().toISOString(),
            }
          : a
      )
    );
  }, []);

  // Toggle pin for publication
  const togglePinAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? { ...a, is_pinned_for_publication: !a.is_pinned_for_publication }
          : a
      )
    );
  }, []);

  // Update client-specific commentary
  const updateAlertCommentary = useCallback((alertId: string, clientId: string, commentary: string) => {
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
        
        return { ...a, client_commentaries: newCommentaries };
      })
    );
  }, []);

  // Update shared expert commentary
  const updateSharedCommentary = useCallback((alertId: string, commentary: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId ? { ...a, expert_commentary: commentary } : a
      )
    );
  }, []);

  // Get published alerts for a specific client
  const getPublishedAlertsForClient = useCallback((clientId: string): PeruAlert[] => {
    return alerts.filter(
      (alert) =>
        alert.status === "published" &&
        (
          alert.client_id === clientId || 
          alert.primary_client_id === clientId ||
          alert.client_commentaries.some(c => c.clientId === clientId)
        )
    );
  }, [alerts]);

  // Get all pinned alerts
  const getPinnedAlerts = useCallback((): PeruAlert[] => {
    return alerts.filter((a) => a.is_pinned_for_publication);
  }, [alerts]);

  // Check if alert has commentary for client
  const hasCommentaryForClient = useCallback((alert: PeruAlert, clientId: string): boolean => {
    const clientCommentary = alert.client_commentaries.find(c => c.clientId === clientId);
    if (clientCommentary && clientCommentary.commentary.trim()) return true;
    return !!(alert.expert_commentary && alert.expert_commentary.trim());
  }, []);

  return (
    <AlertsContext.Provider
      value={{
        alerts,
        publishAlert,
        unpublishAlert,
        togglePinAlert,
        updateAlertCommentary,
        updateSharedCommentary,
        getPublishedAlertsForClient,
        getPinnedAlerts,
        hasCommentaryForClient,
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
