import { useState, useEffect, Dispatch, SetStateAction } from "react";

/**
 * useState backed by localStorage. Persists user interactions across reloads.
 */
export function usePersistedState<T>(
  key: string,
  initial: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw == null) return initial;
      return JSON.parse(raw) as T;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // ignore quota/serialization errors
    }
  }, [key, state]);

  return [state, setState];
}
