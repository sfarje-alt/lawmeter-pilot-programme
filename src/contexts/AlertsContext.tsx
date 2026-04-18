import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { 
  ALL_MOCK_ALERTS, 
  PeruAlert, 
  ClientCommentary,
  PRIMARY_CLIENT_ID,
  BACKUS_CLIENT_ID,
  AttachedFileMetaRef,
  purgeOldArchivedAlerts,
} from "@/data/peruAlertsMockData";

interface AlertsContextType {
  alerts: PeruAlert[];
  // Publishing
  publishAlert: (alert: PeruAlert, clientIds: string[], commentaries: ClientCommentary[]) => void;
  unpublishAlert: (alertId: string) => void;
  // Pinning (pin to top of list)
  togglePinAlert: (alertId: string) => void;
  // Archiving
  archiveAlert: (alertId: string) => void;
  unarchiveAlert: (alertId: string) => void;
  // Commentary
  updateAlertCommentary: (alertId: string, clientId: string, commentary: string) => void;
  updateSharedCommentary: (alertId: string, commentary: string) => void;
  // Attachments (persisted on the alert across drawer sessions)
  updateAttachments: (alertId: string, attachments: AttachedFileMetaRef[]) => void;
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
    // Pre-publish first 5 bills and first 3 regulations to FarmaSalud for demo
    const shouldPublishFarmasalud = 
      (alert.legislation_type === "proyecto_de_ley" && index < 5) ||
      (alert.legislation_type === "norma" && alert.id.startsWith("reg-") && !alert.id.startsWith("reg-backus") && index >= 16 && index < 19);
    
    // Pre-publish Backus regulations
    const shouldPublishBackus = alert.id.startsWith("reg-backus-");

    if (shouldPublishBackus) {
      return {
        ...alert,
        status: "published" as const,
        client_id: BACKUS_CLIENT_ID,
        client_commentaries: [{
          clientId: BACKUS_CLIENT_ID,
          commentary: alert.expert_commentary || "Norma relevante para las operaciones de protección de datos de Backus."
        }]
      };
    }
    
    if (shouldPublishFarmasalud) {
      return {
        ...alert,
        status: "published" as const,
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
  const [alerts, setAlerts] = useState<PeruAlert[]>(() => purgeOldArchivedAlerts(initializeAlerts()));

  // Auto-purge: re-evaluate every hour while the app is open
  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts((prev) => {
        const next = purgeOldArchivedAlerts(prev);
        return next.length === prev.length ? prev : next;
      });
    }, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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

  // Archive an alert (sets archived_at; auto-purged after 30 days at the data layer)
  const archiveAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? { ...a, archived_at: new Date().toISOString(), is_pinned_for_publication: false, updated_at: new Date().toISOString() }
          : a
      )
    );
  }, []);

  // Restore an archived alert
  const unarchiveAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? { ...a, archived_at: null, updated_at: new Date().toISOString() }
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

  // Update attachments for an alert (persisted across drawer open/close)
  const updateAttachments = useCallback((alertId: string, attachments: AttachedFileMetaRef[]) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, attachments } : a))
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
        archiveAlert,
        unarchiveAlert,
        updateAlertCommentary,
        updateSharedCommentary,
        updateAttachments,
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
