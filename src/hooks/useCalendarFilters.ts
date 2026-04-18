import { useEffect, useState, useCallback, useMemo } from "react";
import { ImpactLevel, PeruAlert } from "@/data/peruAlertsMockData";
import { UrgencyLevel } from "@/lib/calendarUtils";

const STORAGE_KEY = "calendar-filters-v2";

export interface CalendarFilters {
  search: string;
  alertTypes: ("bill" | "regulation" | "session")[]; // empty = all
  stages: string[];                                  // empty = all
  tags: string[];                                    // empty = all
  impactLevels: ImpactLevel[];                       // empty = all
  urgencyLevels: UrgencyLevel[];                     // empty = all
  statuses: PeruAlert["status"][];                   // empty = all
  dateFrom: string | null;                           // ISO yyyy-mm-dd
  dateTo: string | null;
  showArchived: boolean;
}

export interface CalendarDateRules {
  showStageEntry: boolean;
  showPublication: boolean;
  showInForce: boolean;
  showManual: boolean;
  showSessions: boolean;
}

const defaultFilters: CalendarFilters = {
  search: "",
  alertTypes: [],
  stages: [],
  tags: [],
  impactLevels: [],
  urgencyLevels: [],
  statuses: [],
  dateFrom: null,
  dateTo: null,
  showArchived: false,
};

const defaultRules: CalendarDateRules = {
  showStageEntry: true,
  showPublication: true,
  showInForce: true,
  showManual: true,
  showSessions: true,
};

interface PersistedShape {
  filters: CalendarFilters;
  rules: CalendarDateRules;
}

function load(): PersistedShape {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { filters: defaultFilters, rules: defaultRules };
    const parsed = JSON.parse(raw);
    return {
      filters: { ...defaultFilters, ...(parsed.filters || {}) },
      rules: { ...defaultRules, ...(parsed.rules || {}) },
    };
  } catch {
    return { filters: defaultFilters, rules: defaultRules };
  }
}

export function useCalendarFilters() {
  const initial = useMemo(() => load(), []);
  const [filters, setFilters] = useState<CalendarFilters>(initial.filters);
  const [rules, setRules] = useState<CalendarDateRules>(initial.rules);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ filters, rules }));
    } catch {
      // noop
    }
  }, [filters, rules]);

  const reset = useCallback(() => {
    setFilters(defaultFilters);
    setRules(defaultRules);
  }, []);

  const activeCount =
    (filters.search ? 1 : 0) +
    filters.alertTypes.length +
    filters.stages.length +
    filters.tags.length +
    filters.impactLevels.length +
    filters.urgencyLevels.length +
    filters.statuses.length +
    (filters.dateFrom ? 1 : 0) +
    (filters.dateTo ? 1 : 0) +
    (filters.showArchived ? 1 : 0);

  return { filters, setFilters, rules, setRules, reset, activeCount };
}
