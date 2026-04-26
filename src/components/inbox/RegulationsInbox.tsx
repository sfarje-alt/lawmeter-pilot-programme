import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Inbox as InboxIcon, FileText, Pin } from "lucide-react";
import { AlertDetailDrawer } from "./AlertDetailDrawer";
import { RegulationsFilterBar } from "./RegulationsFilterBar";
import { InboxAlertCard } from "./InboxAlertCard";
import { PeruAlert } from "@/data/peruAlertsMockData";
import { useReadAlerts } from "@/hooks/useReadAlerts";
import { normalizeEntityName } from "@/lib/entityNormalization";

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

export function RegulationsInbox({ alerts, onTogglePin, onArchive, onUnarchive, onUpdateExpertCommentary, initialAlertId }: RegulationsInboxProps) {
  const [selectedAlert, setSelectedAlert] = useState<PeruAlert | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [processedInitialAlert, setProcessedInitialAlert] = useState(false);
  const { isRead, markAsRead } = useReadAlerts();
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
    return alerts.filter(a => {
      if (a.legislation_type !== "norma") return false;
      if (filters.showArchived) return !!a.archived_at;
      return !a.archived_at;
    });
  }, [alerts, filters.showArchived]);

  const archivedCount = useMemo(
    () => alerts.filter(a => a.legislation_type === "norma" && !!a.archived_at).length,
    [alerts]
  );

  useEffect(() => {
    if (initialAlertId) {
      setProcessedInitialAlert(false);
    }
  }, [initialAlertId]);

  useEffect(() => {
    if (initialAlertId && !processedInitialAlert && regulationAlerts.length > 0) {
      const alertToOpen = regulationAlerts.find(a => a.id === initialAlertId);
      if (alertToOpen) {
        setSelectedAlert(alertToOpen);
        setDrawerOpen(true);
        setProcessedInitialAlert(true);
      }
    }
  }, [initialAlertId, regulationAlerts, processedInitialAlert]);

  const availableEntities = useMemo(() => {
    const entities = new Set<string>();
    regulationAlerts.forEach(alert => {
      const normalized = normalizeEntityName(alert.entity);
      if (normalized) entities.add(normalized);
    });
    return Array.from(entities).sort();
  }, [regulationAlerts]);

  const availableSectors = useMemo(() => {
    const sectors = new Set<string>();
    regulationAlerts.forEach(alert => {
      if (alert.sector) sectors.add(alert.sector);
    });
    return Array.from(sectors).sort();
  }, [regulationAlerts]);

  const availableImpactLevels = useMemo(() => {
    const levels = new Set<string>();
    regulationAlerts.forEach(alert => {
      if (alert.impact_level) levels.add(alert.impact_level);
    });
    return Array.from(levels);
  }, [regulationAlerts]);

  const availableAreas = useMemo(() => {
    const areas = new Set<string>();
    regulationAlerts.forEach(alert => {
      alert.affected_areas.forEach(area => areas.add(area));
    });
    return Array.from(areas).sort();
  }, [regulationAlerts]);

  // Apply filters with multi-select support
  const filteredAlerts = useMemo(() => {
    return regulationAlerts.filter((alert) => {
      if (filters.onlyPinned && !alert.is_pinned_for_publication) {
        return false;
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesTitle = alert.legislation_title.toLowerCase().includes(searchLower);
        const matchesEntity = normalizeEntityName(alert.entity).toLowerCase().includes(searchLower) || false;
        const matchesSummary = alert.legislation_summary?.toLowerCase().includes(searchLower) || false;
        if (!matchesTitle && !matchesEntity && !matchesSummary) return false;
      }

      if (filters.areas.length > 0 && !filters.areas.some(area => alert.affected_areas.includes(area))) {
        return false;
      }

      if (filters.entities.length > 0 && !filters.entities.includes(normalizeEntityName(alert.entity))) {
        return false;
      }

      if (filters.sectors.length > 0 && !filters.sectors.includes(alert.sector || "")) {
        return false;
      }

      if (filters.impactLevels.length > 0 && !filters.impactLevels.includes(alert.impact_level || "")) {
        return false;
      }

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
  }, [regulationAlerts, filters]);

  const pinnedCount = useMemo(() => {
    return regulationAlerts.filter(a => a.is_pinned_for_publication).length;
  }, [regulationAlerts]);

  const sortedAlerts = useMemo(() => {
    return [...filteredAlerts].sort((a, b) => {
      if (a.is_pinned_for_publication && !b.is_pinned_for_publication) return -1;
      if (!a.is_pinned_for_publication && b.is_pinned_for_publication) return 1;
      const dateA = new Date(a.updated_at).getTime();
      const dateB = new Date(b.updated_at).getTime();
      return dateB - dateA;
    });
  }, [filteredAlerts]);

  const alertCounts = useMemo(() => ({
    total: regulationAlerts.length,
    filtered: filteredAlerts.length,
  }), [regulationAlerts, filteredAlerts]);

  const handleAlertClick = (alert: PeruAlert) => {
    markAsRead(alert.id);
    setSelectedAlert(alert);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="glass-card border-border/30">
          <CardContent className="pt-3 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <InboxIcon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">{alertCounts.total}</div>
                <div className="text-xs text-muted-foreground">Total Normas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/30">
          <CardContent className="pt-3 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <FileText className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">{alertCounts.filtered}</div>
                <div className="text-xs text-muted-foreground">Mostrando</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/30">
          <CardContent className="pt-3 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Pin className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">{pinnedCount}</div>
                <div className="text-xs text-muted-foreground">Pineados</div>
              </div>
            </div>
          </CardContent>
        </Card>
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

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {sortedAlerts.length === 0 ? (
          <div className="col-span-full p-8 text-center text-muted-foreground">
            {filters.onlyPinned
              ? "No hay normas pineadas. Pinea algunas desde las cards para verlas aquí."
              : "No hay normas que coincidan con los filtros."
            }
          </div>
        ) : (
          sortedAlerts.map((alert) => (
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
