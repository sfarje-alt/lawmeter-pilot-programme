import { useState, useMemo, useEffect } from "react";
import { KanbanColumn } from "./KanbanColumn";
import { AlertDetailDrawer } from "./AlertDetailDrawer";
import { BillsFilterBar } from "./BillsFilterBar";
import { BriefingKPIRow } from "./BriefingKPIRow";
import { QuickFilterPills } from "./QuickFilterPills";
import { InboxToolbar } from "./InboxToolbar";
import { PeruAlert, BILLS_KANBAN_COLUMNS, ALL_LEGISLATIVE_STAGES } from "@/data/peruAlertsMockData";
import { useReadAlerts } from "@/hooks/useReadAlerts";
import {
  applyQuickFilter,
  isRezagada,
  isActionRequired,
  isRecentMovement,
  getImpactScore,
  sortAlerts,
  QuickFilter,
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

export interface BillsFilters {
  search: string;
  areas: string[];
  stages: string[];
  sectors: string[];
  parliamentaryGroups: string[];
  impactLevels: string[];
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  onlyPinned: boolean;
  showArchived: boolean;
}

type BillKanbanStage = "comision" | "pleno" | "tramite_final";

export function BillsInbox({ alerts, onTogglePin, onArchive, onUnarchive, onUpdateExpertCommentary, initialAlertId }: BillsInboxProps) {
  const [selectedAlert, setSelectedAlert] = useState<PeruAlert | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [processedInitialAlert, setProcessedInitialAlert] = useState(false);
  const { isRead, markAsRead } = useReadAlerts();
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("movement");
  const [showRezagadas, setShowRezagadas] = useState(false);
  const [filters, setFilters] = useState<BillsFilters>({
    search: "",
    areas: [],
    stages: [],
    sectors: [],
    parliamentaryGroups: [],
    impactLevels: [],
    dateFrom: undefined,
    dateTo: undefined,
    onlyPinned: false,
    showArchived: false,
  });

  // Filter only bills (and respect archive toggle)
  const billAlerts = useMemo(() => {
    return alerts.filter(a => {
      if (a.legislation_type !== "proyecto_de_ley") return false;
      if (filters.showArchived) return !!a.archived_at;
      return !a.archived_at;
    });
  }, [alerts, filters.showArchived]);

  const archivedCount = useMemo(
    () => alerts.filter(a => a.legislation_type === "proyecto_de_ley" && !!a.archived_at).length,
    [alerts]
  );

  // Reset processed flag when initialAlertId changes
  useEffect(() => {
    if (initialAlertId) {
      setProcessedInitialAlert(false);
    }
  }, [initialAlertId]);

  // Open drawer automatically if initialAlertId is provided
  useEffect(() => {
    if (initialAlertId && !processedInitialAlert && billAlerts.length > 0) {
      const alertToOpen = billAlerts.find(a => a.id === initialAlertId);
      if (alertToOpen) {
        setSelectedAlert(alertToOpen);
        setDrawerOpen(true);
        setProcessedInitialAlert(true);
      }
    }
  }, [initialAlertId, billAlerts, processedInitialAlert]);

  // Pinned count
  const pinnedCount = useMemo(() => {
    return billAlerts.filter(a => a.is_pinned_for_publication).length;
  }, [billAlerts]);

  // Get unique parliamentary groups from data
  const availableParliamentaryGroups = useMemo(() => {
    const groups = new Set<string>();
    billAlerts.forEach(alert => {
      if (alert.parliamentary_group) {
        groups.add(alert.parliamentary_group);
      }
    });
    return Array.from(groups).sort();
  }, [billAlerts]);

  // Get unique sectors from data
  const availableSectors = useMemo(() => {
    const sectors = new Set<string>();
    billAlerts.forEach(alert => {
      if (alert.sector) {
        sectors.add(alert.sector);
      }
    });
    return Array.from(sectors).sort();
  }, [billAlerts]);

  // Use canonical list of all legislative stages (normalized to uppercase)
  const availableStages = useMemo(() => {
    return ALL_LEGISLATIVE_STAGES;
  }, []);

  // Get unique impact levels from data
  const availableImpactLevels = useMemo(() => {
    const levels = new Set<string>();
    billAlerts.forEach(alert => {
      if (alert.impact_level) {
        levels.add(alert.impact_level);
      }
    });
    return Array.from(levels);
  }, [billAlerts]);

  // Get unique areas from data
  const availableAreas = useMemo(() => {
    const areas = new Set<string>();
    billAlerts.forEach(alert => {
      alert.affected_areas.forEach(area => areas.add(area));
    });
    return Array.from(areas).sort();
  }, [billAlerts]);

  // Apply filters with multi-select support
  const filteredAlerts = useMemo(() => {
    const base = billAlerts.filter((alert) => {
      // Pinned filter
      if (filters.onlyPinned && !alert.is_pinned_for_publication) {
        return false;
      }

      // Nota: las rezagadas NO se filtran del kanban — siempre están presentes
      // en su zona colapsable. El toggle `showRezagadas` solo controla si esa
      // zona arranca abierta o cerrada (ver KanbanColumn).

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesTitle = alert.legislation_title.toLowerCase().includes(searchLower);
        const matchesId = alert.legislation_id?.toLowerCase().includes(searchLower) || false;
        const matchesAuthor = alert.author?.toLowerCase().includes(searchLower) || false;
        if (!matchesTitle && !matchesId && !matchesAuthor) return false;
      }

      // Area filter (multi-select: match if any selected area is in affected_areas)
      if (filters.areas.length > 0 && !filters.areas.some(area => alert.affected_areas.includes(area))) {
        return false;
      }

      // Stage filter (multi-select)
      if (filters.stages.length > 0 && !filters.stages.includes(alert.current_stage || "")) {
        return false;
      }

      // Sector filter (multi-select)
      if (filters.sectors.length > 0 && !filters.sectors.includes(alert.sector || "")) {
        return false;
      }

      // Parliamentary Group filter (multi-select)
      if (filters.parliamentaryGroups.length > 0 && !filters.parliamentaryGroups.includes(alert.parliamentary_group || "")) {
        return false;
      }

      // Impact Level filter (multi-select)
      if (filters.impactLevels.length > 0 && !filters.impactLevels.includes(alert.impact_level || "")) {
        return false;
      }

      // Date range filter (using project_date or stage_date)
      if (filters.dateFrom || filters.dateTo) {
        const alertDate = alert.project_date ? new Date(alert.project_date) : null;
        if (alertDate) {
          if (filters.dateFrom && alertDate < filters.dateFrom) return false;
          if (filters.dateTo && alertDate > filters.dateTo) return false;
        } else {
          return false;
        }
      }

      return true;
    });

    return applyQuickFilter(base, quickFilter);
  }, [billAlerts, filters, quickFilter]);

  // Group alerts by kanban stage (legislative stage)
  const alertsByStage = useMemo(() => {
    const grouped: Record<BillKanbanStage, PeruAlert[]> = {
      comision: [],
      pleno: [],
      tramite_final: [],
    };

    filteredAlerts.forEach((alert) => {
      const stage = alert.kanban_stage as BillKanbanStage;
      if (grouped[stage]) {
        grouped[stage].push(alert);
      }
    });

    Object.keys(grouped).forEach((stage) => {
      grouped[stage as BillKanbanStage] = sortAlerts(grouped[stage as BillKanbanStage], sortMode);
    });

    return grouped;
  }, [filteredAlerts, sortMode]);

  // Counts
  const alertCounts = useMemo(() => ({
    total: billAlerts.length,
    filtered: filteredAlerts.length,
    byStage: {
      comision: alertsByStage.comision.length,
      pleno: alertsByStage.pleno.length,
      tramite_final: alertsByStage.tramite_final.length,
    }
  }), [billAlerts, filteredAlerts, alertsByStage]);

  const handleAlertClick = (alert: PeruAlert) => {
    markAsRead(alert.id);
    setSelectedAlert(alert);
    setDrawerOpen(true);
  };

  // Set de ids no leídas (vista actual)
  const unreadIds = useMemo(() => {
    return new Set(billAlerts.filter((a) => !isRead(a.id)).map((a) => a.id));
  }, [billAlerts, isRead]);

  const pendingCount = alertCounts.byStage.comision + alertCounts.byStage.pleno + alertCounts.byStage.tramite_final;

  return (
    <div className="space-y-4">
      {/* Briefing diario */}
      <BriefingKPIRow alerts={billAlerts} />

      {/* Pills + toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <QuickFilterPills
          active={quickFilter}
          onChange={setQuickFilter}
          counts={{
            all: billAlerts.length,
            action: billAlerts.filter(isActionRequired).length,
            bookmarks: billAlerts.filter(a => a.is_pinned_for_publication).length,
            recent: billAlerts.filter(a => isRecentMovement(a, 7)).length,
            low: billAlerts.filter(a => getImpactScore(a) < 40).length,
          }}
        />
        <InboxToolbar
          sortMode={sortMode}
          onSortModeChange={setSortMode}
          showRezagadas={showRezagadas}
          onShowRezagadasChange={setShowRezagadas}
          rezagadasCount={billAlerts.filter(a => isRezagada(a)).length}
        />
      </div>

      {/* Filters */}
      <BillsFilterBar
        filters={filters}
        onFiltersChange={setFilters}
        availableParliamentaryGroups={availableParliamentaryGroups}
        availableSectors={availableSectors}
        availableStages={availableStages}
        availableImpactLevels={availableImpactLevels}
        availableAreas={availableAreas}
        totalCount={alertCounts.total}
        filteredCount={alertCounts.filtered}
        pinnedCount={pinnedCount}
        archivedCount={archivedCount}
      />

      {/* Kanban Board */}
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
            isArchiveView={filters.showArchived}
            unreadIds={unreadIds}
            laggingOpen={showRezagadas}
          />
        ))}
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
