import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "usa-legislation-read-status";

interface ReadStatus {
  [alertId: string]: boolean;
}

export function useReadAlerts() {
  const [readStatus, setReadStatus] = useState<ReadStatus>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(readStatus));
  }, [readStatus]);

  const markAsRead = useCallback((alertId: string) => {
    setReadStatus(prev => ({ ...prev, [alertId]: true }));
  }, []);

  const markAsUnread = useCallback((alertId: string) => {
    setReadStatus(prev => {
      const next = { ...prev };
      delete next[alertId];
      return next;
    });
  }, []);

  const toggleRead = useCallback((alertId: string) => {
    setReadStatus(prev => {
      if (prev[alertId]) {
        const next = { ...prev };
        delete next[alertId];
        return next;
      }
      return { ...prev, [alertId]: true };
    });
  }, []);

  const isRead = useCallback((alertId: string): boolean => {
    return !!readStatus[alertId];
  }, [readStatus]);

  const getUnreadCount = useCallback((alertIds: string[]): number => {
    return alertIds.filter(id => !readStatus[id]).length;
  }, [readStatus]);

  const deleteAlert = useCallback((alertId: string) => {
    // Mark as "deleted" - in real app would remove from data
    setReadStatus(prev => ({ ...prev, [`deleted_${alertId}`]: true }));
  }, []);

  const isDeleted = useCallback((alertId: string): boolean => {
    return !!readStatus[`deleted_${alertId}`];
  }, [readStatus]);

  return {
    markAsRead,
    markAsUnread,
    toggleRead,
    isRead,
    getUnreadCount,
    deleteAlert,
    isDeleted
  };
}
