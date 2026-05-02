import { useState, useMemo, useEffect } from "react";
import { KanbanColumn } from "./KanbanColumn";
import { AlertDetailDrawer } from "./AlertDetailDrawer";
import { InboxBriefingHeader } from "./InboxBriefingHeader";
import {
  AdvancedFiltersButton,
  ArchivedToggle,
  DateRangeButton,
  FilterGroup,
} from "./InboxToolbarExtras";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { PeruAlert, BILLS_KANBAN_COLUMNS, ALL_LEGISLATIVE_STAGES, IMPACT_LEVELS } from "@/data/peruAlertsMockData";
import { useReadAlerts } from "@/hooks/useReadAlerts";
import {
  applyBriefingFilter,
  applyQuickFilter,
  BriefingFilter,
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
  const [briefingFilter, setBriefingFilter] = useState<BriefingFilter>(null);
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

    return applyBriefingFilter(applyQuickFilter(base, quickFilter), briefingFilter);
  }, [billAlerts, filters, quickFilter, briefingFilter]);

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

  const setF = (patch: Partial<BillsFilters>) => setFilters((f) => ({ ...f, ...patch }));

  const advancedGroups: FilterGroup[] = [
    {
      key: "stages",
      placeholder: "Estado: Todos",
      options: availableStages.map((s) => ({ value: s, label: s })),
      selected: filters.stages,
      onChange: (stages) => setF({ stages }),
    },
    {
      key: "impact",
      placeholder: "Impacto: Todos",
      options: availableImpactLevels.map((level) => {
        const info = IMPACT_LEVELS.find((l) => l.value === level);
        return {
          value: level,
          label: info?.label || level,
          icon: (
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                level === "positivo" && "bg-green-500",
                level === "leve" && "bg-gray-400",
                level === "medio" && "bg-yellow-500",
                level === "grave" && "bg-red-500"
              )}
            />
          ),
        };
      }),
      selected: filters.impactLevels,
      onChange: (impactLevels) => setF({ impactLevels }),
    },
    {
      key: "groups",
      placeholder: "Grupo: Todos",
      options: availableParliamentaryGroups.map((g) => ({ value: g, label: g })),
      selected: filters.parliamentaryGroups,
      onChange: (parliamentaryGroups) => setF({ parliamentaryGroups }),
    },
    {
      key: "sectors",
      placeholder: "Sector: Todos",
      options: availableSectors.map((s) => ({ value: s, label: s })),
      selected: filters.sectors,
      onChange: (sectors) => setF({ sectors }),
    },
    {
      key: "areas",
      placeholder: "Área: Todas",
      options: availableAreas.map((a) => ({ value: a, label: a })),
      selected: filters.areas,
      onChange: (areas) => setF({ areas }),
    },
  ];

  const hasActiveFilters =
    filters.stages.length > 0 ||
    filters.sectors.length > 0 ||
    filters.parliamentaryGroups.length > 0 ||
    filters.impactLevels.length > 0 ||
    filters.areas.length > 0 ||
    !!filters.dateFrom ||
    !!filters.dateTo;

  const activeFilterChips = (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-muted-foreground">
        Mostrando {alertCounts.filtered} de {alertCounts.total} proyectos:
      </span>
      {filters.stages.map((stage) => (
        <Badge key={stage} variant="secondary" className="gap-1 text-xs">
          Estado: {stage}
          <button onClick={() => setF({ stages: filters.stages.filter((s) => s !== stage) })}>
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      {filters.impactLevels.map((level) => (
        <Badge
          key={level}
          variant="secondary"
          className={cn("gap-1 text-xs", IMPACT_LEVELS.find((l) => l.value === level)?.color)}
        >
          Impacto: {IMPACT_LEVELS.find((l) => l.value === level)?.label || level}
          <button
            onClick={() => setF({ impactLevels: filters.impactLevels.filter((l) => l !== level) })}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      {filters.parliamentaryGroups.map((group) => (
        <Badge key={group} variant="secondary" className="gap-1 text-xs">
          Grupo: {group}
          <button
            onClick={() =>
              setF({ parliamentaryGroups: filters.parliamentaryGroups.filter((g) => g !== group) })
            }
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      {filters.sectors.map((sector) => (
        <Badge key={sector} variant="secondary" className="gap-1 text-xs">
          Sector: {sector}
          <button onClick={() => setF({ sectors: filters.sectors.filter((s) => s !== sector) })}>
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      {filters.areas.map((area) => (
        <Badge key={area} variant="secondary" className="gap-1 text-xs">
          Área: {area}
          <button onClick={() => setF({ areas: filters.areas.filter((a) => a !== area) })}>
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      {(filters.dateFrom || filters.dateTo) && (
        <Badge variant="secondary" className="gap-1 text-xs">
          {filters.dateFrom && filters.dateTo
            ? `${format(filters.dateFrom, "dd/MM/yy")} - ${format(filters.dateTo, "dd/MM/yy")}`
            : filters.dateFrom
            ? `Desde ${format(filters.dateFrom, "dd/MM/yy")}`
            : `Hasta ${format(filters.dateTo!, "dd/MM/yy")}`}
          <button onClick={() => setF({ dateFrom: undefined, dateTo: undefined })}>
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={() =>
          setF({
            stages: [],
            sectors: [],
            parliamentaryGroups: [],
            impactLevels: [],
            areas: [],
            dateFrom: undefined,
            dateTo: undefined,
          })
        }
        className="h-6 text-xs text-muted-foreground hover:text-foreground"
      >
        <X className="h-3 w-3 mr-1" /> Limpiar
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      <InboxBriefingHeader
        alerts={billAlerts}
        briefingFilter={briefingFilter}
        onBriefingFilterChange={setBriefingFilter}
        quickFilter={quickFilter}
        onQuickFilterChange={setQuickFilter}
        sortMode={sortMode}
        onSortModeChange={setSortMode}
        showRezagadas={showRezagadas}
        onShowRezagadasChange={setShowRezagadas}
        search={filters.search}
        onSearchChange={(s) => setFilters((f) => ({ ...f, search: s }))}
        toolbarExtras={
          <>
            <DateRangeButton
              dateFrom={filters.dateFrom}
              dateTo={filters.dateTo}
              onChange={(from, to) => setFilters((f) => ({ ...f, dateFrom: from, dateTo: to }))}
            />
            <ArchivedToggle
              pressed={filters.showArchived}
              onPressedChange={(v) => setFilters((f) => ({ ...f, showArchived: v }))}
              count={archivedCount}
            />
            <AdvancedFiltersButton groups={advancedGroups} />
          </>
        }
        toolbarFooter={hasActiveFilters ? activeFilterChips : null}
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
