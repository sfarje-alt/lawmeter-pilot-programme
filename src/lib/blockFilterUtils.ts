import type { BlockFilters } from "@/hooks/useBlockFilters";
import type { PeruAlert } from "@/data/peruAlertsMockData";

/**
 * Resolve the effective date range for a block, given its filters and
 * the dashboard's inherited timeframe.
 *
 * Returns ISO strings or undefined when no constraint applies.
 */
export function resolveDateRange(filters: BlockFilters): { from?: string; to?: string } {
  const period = filters.period || 'inherit';
  if (period === 'inherit' || period === 'all_time') return {};

  if (period === 'custom') {
    return {
      from: filters.customDateFrom,
      to: filters.customDateTo,
    };
  }

  const now = new Date();
  const days =
    period === 'last_7' ? 7 :
    period === 'last_30' ? 30 :
    period === 'last_60' ? 60 :
    period === 'last_90' ? 90 : 0;
  if (!days) return {};
  const from = new Date(now);
  from.setDate(from.getDate() - days);
  return { from: from.toISOString(), to: now.toISOString() };
}

/**
 * Apply per-block filters to a list of PeruAlert.
 * The same function is used both in the small preview and the expanded view,
 * so the user always sees the same data their filters produce.
 */
export function applyAlertFilters(alerts: PeruAlert[], filters: BlockFilters): PeruAlert[] {
  let result = alerts;

  // Date range
  const { from, to } = resolveDateRange(filters);
  if (from || to) {
    const fromMs = from ? new Date(from).getTime() : -Infinity;
    const toMs = to ? new Date(to).getTime() : Infinity;
    result = result.filter(a => {
      const ref = a.created_at || a.project_date || a.publication_date;
      if (!ref) return true;
      const t = new Date(ref).getTime();
      return t >= fromMs && t <= toMs;
    });
  }

  // Legislation type
  const legType = filters.legislationType || 'all';
  if (legType === 'bills') {
    result = result.filter(a => a.legislation_type === 'proyecto_de_ley');
  } else if (legType === 'regulations') {
    result = result.filter(a => a.legislation_type !== 'proyecto_de_ley');
  }

  // Status
  const status = filters.status || 'all';
  if (status !== 'all') {
    result = result.filter(a => (a as any).status === status);
  }

  // Impact levels
  const impacts = filters.impactLevels || [];
  if (impacts.length > 0) {
    result = result.filter(a => impacts.includes((a.impact_level || '').toLowerCase()));
  }

  // Tags (affected_areas as proxy)
  const tags = filters.tags || [];
  if (tags.length > 0) {
    result = result.filter(a => (a.affected_areas || []).some(area => tags.includes(area)));
  }

  // Free text search
  const q = (filters.search || '').trim().toLowerCase();
  if (q) {
    result = result.filter(a =>
      (a.legislation_title || '').toLowerCase().includes(q) ||
      (a.legislation_summary || '').toLowerCase().includes(q) ||
      (a.expert_commentary || '').toLowerCase().includes(q) ||
      (a.entity || '').toLowerCase().includes(q) ||
      (a.parliamentary_group || '').toLowerCase().includes(q) ||
      (a.author || '').toLowerCase().includes(q)
    );
  }

  return result;
}
