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
  area: string;
  entity: string;
  onlyPinned: boolean;
}

export function RegulationsInbox({ alerts, onPublish, onMoveAlert, onTogglePin, selectedClientId, hasCommentaryForClient, onUpdateExpertCommentary }: RegulationsInboxProps) {
  const [selectedAlert, setSelectedAlert] = useState<PeruAlert | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<RegulationsFilters>({
    search: "",
    area: "all",
    entity: "all",
    onlyPinned: false,
  });

  // Filter only regulations
  const regulationAlerts = useMemo(() => {
    return alerts.filter(a => a.legislation_type === "norma");
  }, [alerts]);

  // Apply filters
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

      // Area filter
      if (filters.area !== "all" && !alert.affected_areas.includes(filters.area)) {
        return false;
      }

      // Entity filter
      if (filters.entity !== "all" && alert.entity !== filters.entity) {
        return false;
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

  // Get unique entities from the data for the filter
  const availableEntities = useMemo(() => {
    const entities = new Set<string>();
    regulationAlerts.forEach(alert => {
      if (alert.entity) {
        entities.add(alert.entity);
      }
    });
    return Array.from(entities).sort();
  }, [regulationAlerts]);

  const handleAlertClick = (alert: PeruAlert) => {
    setSelectedAlert(alert);
    setDrawerOpen(true);
  };


  const handlePublish = (alert: PeruAlert, clientIds: string[], commentaries: { clientId: string; commentary: string }[]) => {
    clientIds.forEach(clientId => {
      onPublish(alert, [clientId], commentaries);
    });
    
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
