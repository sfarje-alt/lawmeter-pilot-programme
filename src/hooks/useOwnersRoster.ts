import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const STORAGE_PREFIX = "lawmeter:owners-roster:";
const DEFAULT_OWNERS = ["Legal", "Compliance", "Asuntos Públicos", "Finanzas", "Operaciones"];

function keyFor(orgId: string | null | undefined) {
  return `${STORAGE_PREFIX}${orgId ?? "default"}`;
}

function loadRoster(orgId: string | null | undefined): string[] {
  try {
    const raw = localStorage.getItem(keyFor(orgId));
    if (!raw) return DEFAULT_OWNERS;
    const arr = JSON.parse(raw);
    return Array.isArray(arr) && arr.length > 0 ? arr : DEFAULT_OWNERS;
  } catch {
    return DEFAULT_OWNERS;
  }
}

/** Org-wide owner roster (e.g. "Legal", "Compliance"). Persists in localStorage. */
export function useOwnersRoster() {
  const { profile } = useAuth();
  const orgId = profile?.organization_id ?? null;
  const [roster, setRoster] = useState<string[]>(() => loadRoster(orgId));

  useEffect(() => {
    setRoster(loadRoster(orgId));
  }, [orgId]);

  const persist = useCallback(
    (next: string[]) => {
      try {
        localStorage.setItem(keyFor(orgId), JSON.stringify(next));
      } catch {
        // ignore
      }
      setRoster(next);
    },
    [orgId],
  );

  const addOwner = useCallback(
    (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      if (roster.includes(trimmed)) return;
      persist([...roster, trimmed]);
    },
    [roster, persist],
  );

  const removeOwner = useCallback(
    (name: string) => {
      persist(roster.filter((o) => o !== name));
    },
    [roster, persist],
  );

  return { roster, addOwner, removeOwner, setRoster: persist };
}
