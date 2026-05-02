import { useState, useMemo, useEffect } from "react";
import { KanbanColumn } from "./KanbanColumn";
import { AlertDetailDrawer } from "./AlertDetailDrawer";
import { InboxBriefingHeader } from "./InboxBriefingHeader";
import { ArchivedToggle, QuickDateButton } from "./InboxToolbarExtras";
import { PeruAlert, BILLS_KANBAN_COLUMNS } from "@/data/peruAlertsMockData";
import { useReadAlerts } from "@/hooks/useReadAlerts";
import {
  applyBriefingFilter,
  filterByTags,
  getQuickDateFrom,
  BriefingFilter,
  QuickDateRange,
  sortAlerts,
  SortMode,
} from "@/lib/alertClassification";

interface BillsInboxProps {
  alerts: PeruAlert[];
  onTogglePin: (alertId: string) => void;
  onArchive: (alertId: string) => void;
  onUnarchive: (alertId: string) => void;
  onUpdateExpertCommentary: (alertId: string, commentary: string) => void;
  initialAlertId?: string | null;
}

type BillKanbanStage = "comision" | "pleno" | "tramite_final";

export function BillsInbox({
  alerts,
  onTogglePin,
  onArchive,
  onUnarchive,
  onUpdateExpertCommentary,
  initialAlertId,
}: BillsInboxProps) {
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

  const billAlerts = useMemo(() => {
    return alerts.filter((a) => {
      if (a.legislation_type !== "proyecto_de_ley") return false;
      if (showArchived) return !!a.archived_at;
      return !a.archived_at;
    });
  }, [alerts, showArchived]);

  const archivedCount = useMemo(
    () => alerts.filter((a) => a.legislation_type === "proyecto_de_ley" && !!a.archived_at).length,
    [alerts]
  );

  useEffect(() => {
    if (initialAlertId) setProcessedInitialAlert(false);
  }, [initialAlertId]);

  useEffect(() => {
    if (initialAlertId && !processedInitialAlert && billAlerts.length > 0) {
      const alertToOpen = billAlerts.find((a) => a.id === initialAlertId);
      if (alertToOpen) {
        setSelectedAlert(alertToOpen);
        setDrawerOpen(true);
        setProcessedInitialAlert(true);
      }
    }
  }, [initialAlertId, billAlerts, processedInitialAlert]);

  const filteredAlerts = useMemo(() => {
    const dateFrom = getQuickDateFrom(quickDate);
    const base = billAlerts.filter((alert) => {
      if (search) {
        const s = search.toLowerCase();
        const m =
          alert.legislation_title.toLowerCase().includes(s) ||
          alert.legislation_id?.toLowerCase().includes(s) ||
          alert.author?.toLowerCase().includes(s);
        if (!m) return false;
      }
      if (dateFrom) {
        const d = alert.project_date || alert.stage_date;
        if (!d) return false;
        if (new Date(d) < dateFrom) return false;
      }
      return true;
    });

    return applyBriefingFilter(filterByTags(base, selectedTags), briefingFilter);
  }, [billAlerts, search, quickDate, selectedTags, briefingFilter]);

  const alertsByStage = useMemo(() => {
    const grouped: Record<BillKanbanStage, PeruAlert[]> = {
      comision: [],
      pleno: [],
      tramite_final: [],
    };
    filteredAlerts.forEach((alert) => {
      const stage = alert.kanban_stage as BillKanbanStage;
      if (grouped[stage]) grouped[stage].push(alert);
    });
    (Object.keys(grouped) as BillKanbanStage[]).forEach((stage) => {
      grouped[stage] = sortAlerts(grouped[stage], sortMode);
    });
    return grouped;
  }, [filteredAlerts, sortMode]);

  const handleAlertClick = (alert: PeruAlert) => {
    markAsRead(alert.id);
    setSelectedAlert(alert);
    setDrawerOpen(true);
  };

  const unreadIds = useMemo(
    () => new Set(billAlerts.filter((a) => !isRead(a.id)).map((a) => a.id)),
    [billAlerts, isRead]
  );

  return (
    <div className="space-y-4">
      <InboxBriefingHeader
        alerts={billAlerts}
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

      <div className="flex gap-4 w-full">
        {BILLS_KANBAN_COLUMNS.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            label={column.label}
            color={column.color}
            alerts={alertsByStage[column.id as BillKanbanStage] || []}
            onAlertClick={handleAlertClick}
            onTogglePin={onTogglePin}
            onArchive={onArchive}
            onUnarchive={onUnarchive}
            isArchiveView={showArchived}
            unreadIds={unreadIds}
          />
        ))}
      </div>

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
