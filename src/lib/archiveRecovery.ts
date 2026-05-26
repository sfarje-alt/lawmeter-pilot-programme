// Utilidad temporal de recuperación de alertas archivadas recientemente.
// No borra registros de alertas: solo limpia entradas del map persistido en
// localStorage (`lawmeter:archived-alerts`) cuyo `archived_at` esté dentro de
// los últimos `days` días. El estado en memoria se refresca llamando a
// `refresh()` desde AlertsContext después.

const ARCHIVED_STORAGE_KEY = "lawmeter:archived-alerts";
const DAY_MS = 24 * 60 * 60 * 1000;

interface ArchivedEntry {
  archived_at: string;
  reason?: "manual" | "auto_inactivity";
  last_movement_at?: string | null;
}

export interface RestoreSummary {
  found: number;
  inWindow: number;
  restored: number;
  notFoundInDataset: string[];
}

function readMap(): Record<string, ArchivedEntry | string> {
  try {
    const raw = localStorage.getItem(ARCHIVED_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeMap(map: Record<string, ArchivedEntry | string>) {
  try {
    localStorage.setItem(ARCHIVED_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}

function getArchivedAt(value: ArchivedEntry | string): string | null {
  if (typeof value === "string") return value;
  if (value && typeof value.archived_at === "string") return value.archived_at;
  return null;
}

/**
 * Restaura alertas archivadas dentro de los últimos `days` días eliminando su
 * entrada del map persistido. Devuelve un resumen y lo imprime en consola.
 * Acepta un `knownAlertIds` opcional para reportar IDs ausentes en el dataset.
 */
export function restoreRecentlyArchivedAlerts(
  days = 30,
  knownAlertIds?: Iterable<string>,
): RestoreSummary {
  const map = readMap();
  const cutoffMs = Date.now() - days * DAY_MS;
  const known = knownAlertIds ? new Set(knownAlertIds) : null;

  const entries = Object.entries(map);
  let inWindow = 0;
  let restored = 0;
  const notFoundInDataset: string[] = [];

  for (const [id, value] of entries) {
    const archivedAt = getArchivedAt(value);
    if (!archivedAt) continue;
    const ts = new Date(archivedAt).getTime();
    if (!Number.isFinite(ts)) continue;
    if (ts < cutoffMs) continue;
    inWindow++;
    delete map[id];
    restored++;
    if (known && !known.has(id)) notFoundInDataset.push(id);
  }

  if (restored > 0) writeMap(map);

  const summary: RestoreSummary = {
    found: entries.length,
    inWindow,
    restored,
    notFoundInDataset,
  };

  // eslint-disable-next-line no-console
  console.info("[archiveRecovery] restoreRecentlyArchivedAlerts", {
    days,
    ...summary,
  });

  return summary;
}
