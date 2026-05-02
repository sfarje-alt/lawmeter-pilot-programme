import { useState, useMemo, useEffect } from "react";
import { AlertDetailDrawer } from "./AlertDetailDrawer";
import { RegulationsFilterBar } from "./RegulationsFilterBar";
import { InboxAlertCard } from "./InboxAlertCard";
import { BriefingKPIRow } from "./BriefingKPIRow";
import { QuickFilterPills } from "./QuickFilterPills";
import { InboxToolbar } from "./InboxToolbar";
import { EntityGroupSection } from "./EntityGroupSection";
import { PeruAlert } from "@/data/peruAlertsMockData";
import { useReadAlerts } from "@/hooks/useReadAlerts";
import { normalizeEntityName } from "@/lib/entityNormalization";
import {
  applyQuickFilter,
  isRezagada,
  countByQuickFilter,
  getEntityGroup,
  sortAlerts,
  QuickFilter,
  SortMode,
} from "@/lib/alertClassification";

interface RegulationsInboxProps {
  alerts: PeruAlert[];
  onTogglePin: (alertId: string) => void;
  onArchive: (alertId: string) => void;
  onUnarchive: (alertId: string) => void;
  onUpdateExpertCommentary: (alertId: string, commentary: string) => void;
  initialAlertId?: string | null;
}

export interface RegulationsFilters {
  search: string;
  areas: string[];
  entities: string[];
  sectors: string[];
  impactLevels: string[];
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  onlyPinned: boolean;
  showArchived: boolean;
}

export function RegulationsInbox({
  alerts,
  onTogglePin,
  onArchive,
  onUnarchive,
  onUpdateExpertCommentary,
  initialAlertId,
}: RegulationsInboxProps) {
  const [selectedAlert, setSelectedAlert] = useState<PeruAlert | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [processedInitialAlert, setProcessedInitialAlert] = useState(false);
  const { isRead, markAsRead } = useReadAlerts();
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("movement");
  const [showRezagadas, setShowRezagadas] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<RegulationsFilters>({
    search: "",
    areas: [],
    entities: [],
    sectors: [],
    impactLevels: [],
    dateFrom: undefined,
    dateTo: undefined,
    onlyPinned: false,
    showArchived: false,
  });

  // Filter only regulations (and respect archive toggle)
  const regulationAlerts = useMemo(() => {
    return alerts.filter((a) => {
      if (a.legislation_type !== "norma") return false;
      if (filters.showArchived) return !!a.archived_at;
      return !a.archived_at;
    });
  }, [alerts, filters.showArchived]);

  const archivedCount = useMemo(
    () => alerts.filter((a) => a.legislation_type === "norma" && !!a.archived_at).length,
    [alerts]
  );

  useEffect(() => {
    if (initialAlertId) setProcessedInitialAlert(false);
  }, [initialAlertId]);

  useEffect(() => {
    if (initialAlertId && !processedInitialAlert && regulationAlerts.length > 0) {
      const alertToOpen = regulationAlerts.find((a) => a.id === initialAlertId);
      if (alertToOpen) {
        setSelectedAlert(alertToOpen);
        setDrawerOpen(true);
        setProcessedInitialAlert(true);
      }
    }
  }, [initialAlertId, regulationAlerts, processedInitialAlert]);

  const availableEntities = useMemo(() => {
    const entities = new Set<string>();
    regulationAlerts.forEach((alert) => {
      const normalized = normalizeEntityName(alert.entity);
      if (normalized) entities.add(normalized);
    });
    return Array.from(entities).sort();
  }, [regulationAlerts]);

  const availableSectors = useMemo(() => {
    const sectors = new Set<string>();
    regulationAlerts.forEach((alert) => {
      if (alert.sector) sectors.add(alert.sector);
    });
    return Array.from(sectors).sort();
  }, [regulationAlerts]);

  const availableImpactLevels = useMemo(() => {
    const levels = new Set<string>();
    regulationAlerts.forEach((alert) => {
      if (alert.impact_level) levels.add(alert.impact_level);
    });
    return Array.from(levels);
  }, [regulationAlerts]);

  const availableAreas = useMemo(() => {
    const areas = new Set<string>();
    regulationAlerts.forEach((alert) => {
      alert.affected_areas.forEach((area) => areas.add(area));
    });
    return Array.from(areas).sort();
  }, [regulationAlerts]);

  // Apply filters with multi-select support
  const filteredAlerts = useMemo(() => {
    const base = regulationAlerts.filter((alert) => {
      if (filters.onlyPinned && !alert.is_pinned_for_publication) return false;
      if (!showRezagadas && isRezagada(alert)) return false;

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesTitle = alert.legislation_title.toLowerCase().includes(searchLower);
        const matchesEntity = normalizeEntityName(alert.entity).toLowerCase().includes(searchLower) || false;
        const matchesSummary = alert.legislation_summary?.toLowerCase().includes(searchLower) || false;
        if (!matchesTitle && !matchesEntity && !matchesSummary) return false;
      }

      if (filters.areas.length > 0 && !filters.areas.some((area) => alert.affected_areas.includes(area))) return false;
      if (filters.entities.length > 0 && !filters.entities.includes(normalizeEntityName(alert.entity))) return false;
      if (filters.sectors.length > 0 && !filters.sectors.includes(alert.sector || "")) return false;
      if (filters.impactLevels.length > 0 && !filters.impactLevels.includes(alert.impact_level || "")) return false;

      if (filters.dateFrom || filters.dateTo) {
        const alertDate = alert.publication_date ? new Date(alert.publication_date) : null;
        if (!alertDate) return false;
        if (filters.dateFrom && alertDate < filters.dateFrom) return false;
        if (filters.dateTo) {
          const endOfDay = new Date(filters.dateTo);
          endOfDay.setHours(23, 59, 59, 999);
          if (alertDate > endOfDay) return false;
        }
      }

      return true;
    });

    return applyQuickFilter(base, quickFilter);
  }, [regulationAlerts, filters, quickFilter, showRezagadas]);

  const pinnedCount = useMemo(
    () => regulationAlerts.filter((a) => a.is_pinned_for_publication).length,
    [regulationAlerts]
  );

  // Group filtered alerts by entity_group, sorted within each group.
  const grouped = useMemo(() => {
    const map = new Map<string, PeruAlert[]>();
    filteredAlerts.forEach((a) => {
      const key = getEntityGroup(a.entity);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(a);
    });
    const entries = Array.from(map.entries()).map(([group, items]) => ({
      group,
      items: sortAlerts(items, sortMode),
    }));
    // Sort groups by item count desc, then alphabetically.
    entries.sort((a, b) => b.items.length - a.items.length || a.group.localeCompare(b.group));
    return entries;
  }, [filteredAlerts, sortMode]);

  const alertCounts = useMemo(
    () => ({ total: regulationAlerts.length, filtered: filteredAlerts.length }),
    [regulationAlerts, filteredAlerts]
  );

  const handleAlertClick = (alert: PeruAlert) => {
    markAsRead(alert.id);
    setSelectedAlert(alert);
    setDrawerOpen(true);
  };

  const toggleGroup = (g: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(g)) next.delete(g);
      else next.add(g);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {/* Briefing diario */}
      <BriefingKPIRow alerts={regulationAlerts} />

      {/* Pills + toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <QuickFilterPills
          active={quickFilter}
          onChange={setQuickFilter}
          counts={countByQuickFilter(regulationAlerts)}
        />
        <InboxToolbar
          sortMode={sortMode}
          onSortModeChange={setSortMode}
          showRezagadas={showRezagadas}
          onShowRezagadasChange={setShowRezagadas}
          rezagadasCount={regulationAlerts.filter(isRezagada).length}
        />
      </div>

      {/* Filters */}
      <RegulationsFilterBar
        filters={filters}
        onFiltersChange={setFilters}
        availableEntities={availableEntities}
        availableSectors={availableSectors}
        availableImpactLevels={availableImpactLevels}
        availableAreas={availableAreas}
        totalCount={alertCounts.total}
        filteredCount={alertCounts.filtered}
        pinnedCount={pinnedCount}
        archivedCount={archivedCount}
      />

      {/* Feed agrupado por entidad */}
      <div className="space-y-3">
        {grouped.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground border border-dashed border-border/40 rounded-lg">
            {filters.onlyPinned
              ? "No hay normas pineadas. Pinea algunas desde las cards para verlas aquí."
              : "No hay normas que coincidan con los filtros."}
          </div>
        ) : (
          grouped.map(({ group, items }) => (
            <EntityGroupSection
              key={group}
              group={group}
              count={items.length}
              open={!collapsedGroups.has(group)}
              onToggle={() => toggleGroup(group)}
            >
              {items.map((alert) => (
                <InboxAlertCard
                  key={alert.id}
                  alert={alert}
                  onClick={() => handleAlertClick(alert)}
                  onTogglePin={onTogglePin}
                  onArchive={onArchive}
                  onUnarchive={onUnarchive}
                  isArchiveView={filters.showArchived}
                  isUnread={!isRead(alert.id)}
                />
              ))}
            </EntityGroupSection>
          ))
        )}
      </div>

      {/* Alert Detail Drawer */}
      <AlertDetailDrawer
        alert={selectedAlert}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onUpdateExpertCommentary={onUpdateExpertCommentary}
        onArchive={onArchive}
        onUnarchive={onUnarchive}
      />
    </div>
  );
}
