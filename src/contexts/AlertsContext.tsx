import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import {
  ALL_MOCK_ALERTS,
  PeruAlert,
  AttachedFileMetaRef,
  purgeOldArchivedAlerts,
} from "@/data/peruAlertsMockData";

interface AlertsContextType {
  alerts: PeruAlert[];
  // Pinning (pin to top of list)
  togglePinAlert: (alertId: string) => void;
  // Archiving
  archiveAlert: (alertId: string) => void;
  unarchiveAlert: (alertId: string) => void;
  // Commentary (single shared expert commentary per alert)
  updateSharedCommentary: (alertId: string, commentary: string) => void;
  // Attachments (persisted on the alert across drawer sessions)
  updateAttachments: (alertId: string, attachments: AttachedFileMetaRef[]) => void;
  // Pinned helper
  getPinnedAlerts: () => PeruAlert[];
}

const AlertsContext = createContext<AlertsContextType | undefined>(undefined);

// Single-profile model: alerts are not pre-published to any client.
// All alerts belong to the organization's single profile.
const PINNED_STORAGE_KEY = "lawmeter:pinned-alerts";

function loadPinnedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(PINNED_STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function savePinnedIds(ids: Set<string>) {
  try {
    localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify(Array.from(ids)));
  } catch {
    // ignore quota / private mode
  }
}

function initializeAlerts(): PeruAlert[] {
  const pinned = loadPinnedIds();
  return ALL_MOCK_ALERTS.map((alert) => ({
    ...alert,
    is_pinned_for_publication: pinned.has(alert.id) ? true : !!alert.is_pinned_for_publication,
  }));
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

  // Archive an alert
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

  // Get all pinned alerts
  const getPinnedAlerts = useCallback((): PeruAlert[] => {
    return alerts.filter((a) => a.is_pinned_for_publication);
  }, [alerts]);

  return (
    <AlertsContext.Provider
      value={{
        alerts,
        togglePinAlert,
        archiveAlert,
        unarchiveAlert,
        updateSharedCommentary,
        updateAttachments,
        getPinnedAlerts,
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
