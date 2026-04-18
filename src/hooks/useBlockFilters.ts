import * as React from "react";

/**
 * Per-block filter state with automatic localStorage persistence.
 * Each analytics block stores its own configuration under a unique key.
 */
export interface BlockFilters {
  /** Time range — overrides the dashboard global period for this block only */
  period?: 'inherit' | 'last_7' | 'last_30' | 'last_60' | 'last_90' | 'all_time' | 'custom';
  customDateFrom?: string; // ISO date
  customDateTo?: string;
  /** Alert type filter (Bills vs Regulations) */
  legislationType?: 'all' | 'bills' | 'regulations';
  /** Alert status filter */
  status?: 'all' | 'inbox' | 'reviewing' | 'published' | 'archived';
  /** Impact level multi-select */
  impactLevels?: string[];
  /** Tags multi-select */
  tags?: string[];
  /** Profile filter (monitoring profile id) */
  profileId?: string | 'all';
  /** Free-text search */
  search?: string;
  /** Active visualization tab */
  viewTab?: 'chart' | 'data' | 'insights';
}

const DEFAULT_FILTERS: BlockFilters = {
  period: 'inherit',
  legislationType: 'all',
  status: 'all',
  impactLevels: [],
  tags: [],
  profileId: 'all',
  search: '',
  viewTab: 'chart',
};

const STORAGE_PREFIX = 'analytics-block-filters:';

function readFromStorage(blockId: string): BlockFilters | null {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + blockId);
    if (!raw) return null;
    return JSON.parse(raw) as BlockFilters;
  } catch {
    return null;
  }
}

function writeToStorage(blockId: string, filters: BlockFilters) {
  try {
    localStorage.setItem(STORAGE_PREFIX + blockId, JSON.stringify(filters));
  } catch {
    // ignore quota / private mode
  }
}

/**
 * Hook that returns the persistent filters for a given analytics block.
 * Configuration auto-saves on every change.
 *
 * @example
 *   const { filters, setFilter, resetFilters, isCustomized } = useBlockFilters('regulatory_pulse');
 *   <Select value={filters.period} onValueChange={(v) => setFilter('period', v)} />
 */
export function useBlockFilters(blockId: string, defaults: Partial<BlockFilters> = {}) {
  const initialDefaults = React.useMemo(
    () => ({ ...DEFAULT_FILTERS, ...defaults }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [filters, setFilters] = React.useState<BlockFilters>(() => {
    const stored = readFromStorage(blockId);
    return { ...initialDefaults, ...(stored || {}) };
  });

  // Persist whenever filters change
  React.useEffect(() => {
    writeToStorage(blockId, filters);
  }, [blockId, filters]);

  const setFilter = React.useCallback(<K extends keyof BlockFilters>(key: K, value: BlockFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const setMany = React.useCallback((updates: Partial<BlockFilters>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  }, []);

  const resetFilters = React.useCallback(() => {
    setFilters(initialDefaults);
    try {
      localStorage.removeItem(STORAGE_PREFIX + blockId);
    } catch {}
  }, [blockId, initialDefaults]);

  const isCustomized = React.useMemo(() => {
    return Object.keys(initialDefaults).some(k => {
      const key = k as keyof BlockFilters;
      const a = filters[key];
      const b = initialDefaults[key];
      if (Array.isArray(a) && Array.isArray(b)) {
        return a.length !== b.length || a.some((v, i) => v !== b[i]);
      }
      return a !== b;
    });
  }, [filters, initialDefaults]);

  return { filters, setFilter, setMany, resetFilters, isCustomized };
}
