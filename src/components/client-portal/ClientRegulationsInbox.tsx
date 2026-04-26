import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Inbox as InboxIcon, FileText } from "lucide-react";
import { ClientAlertDetailDrawer } from "./ClientAlertDetailDrawer";
import { ClientRegulationsFilterBar, ClientRegulationsFilters } from "./ClientRegulationsFilterBar";
import { ClientAlertCard } from "./ClientAlertCard";
import { PeruAlert } from "@/data/peruAlertsMockData";
import { normalizeEntityName } from "@/lib/entityNormalization";

interface ClientRegulationsInboxProps {
  alerts: PeruAlert[];
  clientId: string;
}

export function ClientRegulationsInbox({ alerts, clientId }: ClientRegulationsInboxProps) {
  const [selectedAlert, setSelectedAlert] = useState<PeruAlert | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<ClientRegulationsFilters>({
    search: "",
    areas: [],
    entities: [],
    sectors: [],
    impactLevels: [],
    dateFrom: undefined,
    dateTo: undefined,
  });

  // Filter only regulations
  const regulationAlerts = useMemo(() => {
    return alerts.filter(a => a.legislation_type === "norma");
  }, [alerts]);

  // Extract dynamic filter options from data
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

  // Apply filters
  const filteredAlerts = useMemo(() => {
    return regulationAlerts.filter((alert) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesTitle = alert.legislation_title.toLowerCase().includes(searchLower);
        const matchesEntity = normalizeEntityName(alert.entity).toLowerCase().includes(searchLower) || false;
        const matchesSummary = alert.legislation_summary?.toLowerCase().includes(searchLower) || false;
        if (!matchesTitle && !matchesEntity && !matchesSummary) return false;
      }

      // Area filter
      if (filters.areas.length > 0 && !filters.areas.some(area => alert.affected_areas.includes(area))) {
        return false;
      }

      // Entity filter
      if (filters.entities.length > 0 && !filters.entities.includes(normalizeEntityName(alert.entity))) {
        return false;
      }

      // Sector filter
      if (filters.sectors.length > 0 && !filters.sectors.includes(alert.sector || "")) {
        return false;
      }

      // Impact level filter
      if (filters.impactLevels.length > 0 && !filters.impactLevels.includes(alert.impact_level || "")) {
        return false;
      }

      // Date range filter
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

  // Sort alerts by date (newest first)
  const sortedAlerts = useMemo(() => {
    return [...filteredAlerts].sort((a, b) => {
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

  return (
    <div className="space-y-4">
      {/* KPI Cards - Without "Pineados" */}
      <div className="grid grid-cols-2 gap-3">
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
      </div>

      {/* Filters */}
      <ClientRegulationsFilterBar
        filters={filters}
        onFiltersChange={setFilters}
        availableEntities={availableEntities}
        availableSectors={availableSectors}
        availableImpactLevels={availableImpactLevels}
        availableAreas={availableAreas}
        totalCount={alertCounts.total}
        filteredCount={alertCounts.filtered}
      />

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {sortedAlerts.length === 0 ? (
          <div className="col-span-full p-8 text-center text-muted-foreground">
            No hay normas que coincidan con los filtros.
          </div>
        ) : (
          sortedAlerts.map((alert) => (
            <ClientAlertCard
              key={alert.id}
              alert={alert}
              onClick={() => handleAlertClick(alert)}
              clientId={clientId}
            />
          ))
        )}
      </div>

      {/* Alert Detail Drawer */}
      <ClientAlertDetailDrawer
        alert={selectedAlert}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        clientId={clientId}
      />
    </div>
  );
}
