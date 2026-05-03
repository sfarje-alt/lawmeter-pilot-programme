import { useState, useMemo, useEffect } from "react";
import { AlertDetailDrawer } from "./AlertDetailDrawer";
import { InboxBriefingHeader } from "./InboxBriefingHeader";
import { ArchivedToggle, QuickDateButton } from "./InboxToolbarExtras";
import { EntityGroupSection } from "./EntityGroupSection";
import { EntityZoneStack } from "./EntityZoneStack";
import { PeruAlert } from "@/data/peruAlertsMockData";
import { useReadAlerts } from "@/hooks/useReadAlerts";
import { usePersistedState } from "@/hooks/usePersistedState";
import { normalizeEntityName } from "@/lib/entityNormalization";
import {
  applyBriefingFilter,
  filterByTags,
  getQuickDateFrom,
  BriefingFilter,
  QuickDateRange,
  sortAlerts,
  SortMode,
  getNormaEntityGroup,
  NORMA_ENTITY_GROUPS,
  NORMA_ENTITY_GROUP_ORDER,
  NormaEntityGroup,
} from "@/lib/alertClassification";

interface RegulationsInboxProps {
  alerts: PeruAlert[];
  onTogglePin: (alertId: string) => void;
  onArchive: (alertId: string) => void;
  onUnarchive: (alertId: string) => void;
  onUpdateExpertCommentary: (alertId: string, commentary: string) => void;
  initialAlertId?: string | null;
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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [briefingFilter, setBriefingFilter] = useState<BriefingFilter>(null);
  const [sortMode, setSortMode] = useState<SortMode>("movement");
  const [search, setSearch] = useState("");
  const [quickDate, setQuickDate] = useState<QuickDateRange>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<NormaEntityGroup>>(new Set());

  const regulationAlerts = useMemo(() => {
    return alerts.filter((a) => {
      if (a.legislation_type !== "norma") return false;
      if (showArchived) return !!a.archived_at;
      return !a.archived_at;
    });
  }, [alerts, showArchived]);

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

  const filteredAlerts = useMemo(() => {
    const dateFrom = getQuickDateFrom(quickDate);
    const base = regulationAlerts.filter((alert) => {
      if (search) {
        const s = search.toLowerCase();
        const m =
          alert.legislation_title.toLowerCase().includes(s) ||
          normalizeEntityName(alert.entity).toLowerCase().includes(s) ||
          (alert.legislation_summary?.toLowerCase().includes(s) ?? false);
        if (!m) return false;
      }
      if (dateFrom) {
        const d = alert.publication_date;
        if (!d) return false;
        if (new Date(d) < dateFrom) return false;
      }
      return true;
    });
    return applyBriefingFilter(filterByTags(base, selectedTags), briefingFilter);
  }, [regulationAlerts, search, quickDate, selectedTags, briefingFilter]);

  const grouped = useMemo(() => {
    const map = new Map<NormaEntityGroup, PeruAlert[]>();
    filteredAlerts.forEach((a) => {
      const key = getNormaEntityGroup(a.entity);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(a);
    });
    return NORMA_ENTITY_GROUP_ORDER
      .filter((id) => map.has(id))
      .map((id) => ({
        id,
        meta: NORMA_ENTITY_GROUPS[id],
        items: sortAlerts(map.get(id)!, sortMode),
      }));
  }, [filteredAlerts, sortMode]);

  const handleAlertClick = (alert: PeruAlert) => {
    markAsRead(alert.id);
    setSelectedAlert(alert);
    setDrawerOpen(true);
  };

  const unreadIds = useMemo(
    () => new Set(regulationAlerts.filter((a) => !isRead(a.id)).map((a) => a.id)),
    [regulationAlerts, isRead]
  );

  const toggleGroup = (g: NormaEntityGroup) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(g)) next.delete(g);
      else next.add(g);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <InboxBriefingHeader
        alerts={regulationAlerts}
        briefingFilter={briefingFilter}
        onBriefingFilterChange={setBriefingFilter}
        selectedTags={selectedTags}
        onSelectedTagsChange={setSelectedTags}
        sortMode={sortMode}
        onSortModeChange={setSortMode}
        search={search}
        onSearchChange={setSearch}
        toolbarExtras={
          <>
            <QuickDateButton value={quickDate} onChange={setQuickDate} />
            <ArchivedToggle
              pressed={showArchived}
              onPressedChange={setShowArchived}
              count={archivedCount}
            />
          </>
        }
      />

      <div className="space-y-3">
        {grouped.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground border border-dashed border-border/40 rounded-lg">
            No hay alertas que coincidan con los filtros aplicados.
          </div>
        ) : (
          grouped.map(({ id, meta, items }) => (
            <EntityGroupSection
              key={id}
              meta={meta}
              count={items.length}
              open={!collapsedGroups.has(id)}
              onToggle={() => toggleGroup(id)}
            >
              <EntityZoneStack
                alerts={items}
                onAlertClick={handleAlertClick}
                onTogglePin={onTogglePin}
                onArchive={onArchive}
                onUnarchive={onUnarchive}
                isArchiveView={showArchived}
                unreadIds={unreadIds}
              />
            </EntityGroupSection>
          ))
        )}
      </div>

      <AlertDetailDrawer
        alert={selectedAlert}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onUpdateExpertCommentary={onUpdateExpertCommentary}
        onArchive={onArchive}
        onUnarchive={onUnarchive}
        onTogglePin={onTogglePin}
      />
    </div>
  );
}
