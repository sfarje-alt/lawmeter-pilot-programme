// Canonical front-end source of truth for "Sesiones" across the platform.
//
// IMPORTANT (do not change without aligning Sesiones UI):
// This hook returns the EXACT same dataset that powers the Sesiones page
// (Bandeja). All Sesiones analytics, all session counters and all drilldowns
// opened from those analytics MUST consume this hook. There must be no
// parallel "all sessions" / "raw sessions" / "analyzed sessions" universe in
// analytics — only this one.
//
// Currently equivalent to: useSesiones({ onlyDeInteres: true, daysBack: 30 })
// which is the Bandeja view the user actually sees in /sesiones.

import { useSesiones, type Sesion } from "./useSesiones";

export type { Sesion } from "./useSesiones";

export function useSessionsUniverse(): {
  sesiones: Sesion[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  return useSesiones({ onlyDeInteres: true, daysBack: 30 });
}
