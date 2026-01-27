import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Inbox as InboxIcon, FileText, Pin } from "lucide-react";
import { AlertDetailDrawer } from "./AlertDetailDrawer";
import { RegulationsFilterBar } from "./RegulationsFilterBar";
import { InboxAlertCard } from "./InboxAlertCard";
import { PeruAlert, MOCK_CLIENTS } from "@/data/peruAlertsMockData";
import { toast } from "sonner";

interface RegulationsInboxProps {
  alerts: PeruAlert[];
  onPublish: (alert: PeruAlert, clientIds: string[], commentaries: { clientId: string; commentary: string }[]) => void;
  onMoveAlert: (alertId: string, newStage: PeruAlert["kanban_stage"]) => void;
  onTogglePin: (alertId: string) => void;
  selectedClientId: string | null;
  hasCommentaryForClient: (alert: PeruAlert, clientId: string) => boolean;
  onUpdateExpertCommentary: (alertId: string, commentary: string) => void;
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
}

export function RegulationsInbox({ alerts, onPublish, onMoveAlert, onTogglePin, selectedClientId, hasCommentaryForClient, onUpdateExpertCommentary }: RegulationsInboxProps) {
  const [selectedAlert, setSelectedAlert] = useState<PeruAlert | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<RegulationsFilters>({
    search: "",
    areas: [],
    entities: [],
    sectors: [],
    impactLevels: [],
    dateFrom: undefined,
    dateTo: undefined,
    onlyPinned: false,
  });

  // Filter only regulations
  const regulationAlerts = useMemo(() => {
    return alerts.filter(a => a.legislation_type === "norma");
  }, [alerts]);

  // Extract dynamic filter options from data
  const availableEntities = useMemo(() => {
    const entities = new Set<string>();
    regulationAlerts.forEach(alert => {
      if (alert.entity) entities.add(alert.entity);
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
      // Pinned filter
      if (filters.onlyPinned && !alert.is_pinned_for_publication) {
        return false;
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesTitle = alert.legislation_title.toLowerCase().includes(searchLower);
        const matchesEntity = alert.entity?.toLowerCase().includes(searchLower) || false;
        const matchesSummary = alert.legislation_summary?.toLowerCase().includes(searchLower) || false;
        if (!matchesTitle && !matchesEntity && !matchesSummary) return false;
      }

      // Area filter (multi-select: match if any selected area is in affected_areas)
      if (filters.areas.length > 0 && !filters.areas.some(area => alert.affected_areas.includes(area))) {
        return false;
      }

      // Entity filter (multi-select)
      if (filters.entities.length > 0 && !filters.entities.includes(alert.entity || "")) {
        return false;
      }

      // Sector filter (multi-select)
      if (filters.sectors.length > 0 && !filters.sectors.includes(alert.sector || "")) {
        return false;
      }

      // Impact level filter (multi-select)
      if (filters.impactLevels.length > 0 && !filters.impactLevels.includes(alert.impact_level || "")) {
        return false;
      }

      // Date range filter (using publication_date for regulations)
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

  // Pinned count
  const pinnedCount = useMemo(() => {
    return regulationAlerts.filter(a => a.is_pinned_for_publication).length;
  }, [regulationAlerts]);

  // Sort alerts by date (newest first) - with pinned at top
  const sortedAlerts = useMemo(() => {
    return [...filteredAlerts].sort((a, b) => {
      // Pinned items first
      if (a.is_pinned_for_publication && !b.is_pinned_for_publication) return -1;
      if (!a.is_pinned_for_publication && b.is_pinned_for_publication) return 1;
      
      // Then by date
      const dateA = new Date(a.updated_at).getTime();
      const dateB = new Date(b.updated_at).getTime();
      return dateB - dateA;
    });
  }, [filteredAlerts]);

  // Counts
  const alertCounts = useMemo(() => ({
    total: regulationAlerts.length,
    filtered: filteredAlerts.length,
  }), [regulationAlerts, filteredAlerts]);

  const handleAlertClick = (alert: PeruAlert) => {
    setSelectedAlert(alert);
    setDrawerOpen(true);
  };

  const handlePublish = (alert: PeruAlert, clientIds: string[], commentaries: { clientId: string; commentary: string }[]) => {
    // Call onPublish once with all clients - context handles multi-client publishing
    onPublish(alert, clientIds, commentaries);
    
    const clientNames = clientIds.map(id => 
      MOCK_CLIENTS.find(c => c.id === id)?.name || id
    ).join(", ");
    
    toast.success(`Publicado a ${clientIds.length} cliente${clientIds.length > 1 ? 's' : ''}`, {
      description: clientNames
    });
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
              selectedClientId={selectedClientId}
              hasCommentaryForClient={hasCommentaryForClient}
            />
          ))
        )}
      </div>

      {/* Alert Detail Drawer */}
      <AlertDetailDrawer
        alert={selectedAlert}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onPublish={handlePublish}
        onUpdateExpertCommentary={onUpdateExpertCommentary}
      />
    </div>
  );
}
