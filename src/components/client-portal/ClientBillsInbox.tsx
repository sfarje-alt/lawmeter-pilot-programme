import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Inbox as InboxIcon, Scale } from "lucide-react";
import { ClientKanbanColumn } from "./ClientKanbanColumn";
import { ClientAlertDetailDrawer } from "./ClientAlertDetailDrawer";
import { ClientBillsFilterBar, ClientBillsFilters } from "./ClientBillsFilterBar";
import { PeruAlert, BILLS_KANBAN_COLUMNS, ALL_LEGISLATIVE_STAGES } from "@/data/peruAlertsMockData";

interface ClientBillsInboxProps {
  alerts: PeruAlert[];
  clientId: string;
}

type BillKanbanStage = "comision" | "pleno" | "tramite_final";

export function ClientBillsInbox({ alerts, clientId }: ClientBillsInboxProps) {
  const [selectedAlert, setSelectedAlert] = useState<PeruAlert | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<ClientBillsFilters>({
    search: "",
    areas: [],
    stages: [],
    sectors: [],
    parliamentaryGroups: [],
    impactLevels: [],
    dateFrom: undefined,
    dateTo: undefined,
  });

  // Filter only bills
  const billAlerts = useMemo(() => {
    return alerts.filter(a => a.legislation_type === "proyecto_de_ley");
  }, [alerts]);

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

  // Use canonical list of all legislative stages
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

  // Apply filters
  const filteredAlerts = useMemo(() => {
    return billAlerts.filter((alert) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesTitle = alert.legislation_title.toLowerCase().includes(searchLower);
        const matchesId = alert.legislation_id?.toLowerCase().includes(searchLower) || false;
        const matchesAuthor = alert.author?.toLowerCase().includes(searchLower) || false;
        if (!matchesTitle && !matchesId && !matchesAuthor) return false;
      }

      // Area filter
      if (filters.areas.length > 0 && !filters.areas.some(area => alert.affected_areas.includes(area))) {
        return false;
      }

      // Stage filter
      if (filters.stages.length > 0 && !filters.stages.includes(alert.current_stage || "")) {
        return false;
      }

      // Sector filter
      if (filters.sectors.length > 0 && !filters.sectors.includes(alert.sector || "")) {
        return false;
      }

      // Parliamentary Group filter
      if (filters.parliamentaryGroups.length > 0 && !filters.parliamentaryGroups.includes(alert.parliamentary_group || "")) {
        return false;
      }

      // Impact Level filter
      if (filters.impactLevels.length > 0 && !filters.impactLevels.includes(alert.impact_level || "")) {
        return false;
      }

      // Date range filter
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
  }, [billAlerts, filters]);

  // Group alerts by kanban stage
  const alertsByStage = useMemo(() => {
    const grouped: Record<BillKanbanStage, PeruAlert[]> = {
      comision: [],
      pleno: [],
      tramite_final: [],
    };

    filteredAlerts.forEach((alert) => {
      let stage = alert.kanban_stage as BillKanbanStage;
      if (stage === "publicado" as any) {
        stage = "tramite_final";
      }
      if (grouped[stage]) {
        grouped[stage].push(alert);
      }
    });

    // Sort by date
    Object.keys(grouped).forEach((stage) => {
      grouped[stage as BillKanbanStage].sort((a, b) => {
        const dateA = new Date(a.updated_at).getTime();
        const dateB = new Date(b.updated_at).getTime();
        return dateB - dateA;
      });
    });

    return grouped;
  }, [filteredAlerts]);

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
    setSelectedAlert(alert);
    setDrawerOpen(true);
  };

  // Pending count
  const pendingCount = alertCounts.byStage.comision + alertCounts.byStage.pleno + alertCounts.byStage.tramite_final;

  return (
    <div className="space-y-4">
      {/* KPI Cards - Without "Pineados" */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="glass-card border-border/30">
          <CardContent className="pt-3 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <InboxIcon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">{pendingCount}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/30">
          <CardContent className="pt-3 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Scale className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">{alertCounts.byStage.comision}</div>
                <div className="text-xs text-muted-foreground">En Comisión</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/30">
          <CardContent className="pt-3 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Scale className="h-4 w-4 text-purple-400" />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">{alertCounts.byStage.pleno}</div>
                <div className="text-xs text-muted-foreground">En Pleno</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/30">
          <CardContent className="pt-3 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Scale className="h-4 w-4 text-orange-400" />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">{alertCounts.byStage.tramite_final}</div>
                <div className="text-xs text-muted-foreground">Trámite Final</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <ClientBillsFilterBar
        filters={filters}
        onFiltersChange={setFilters}
        availableParliamentaryGroups={availableParliamentaryGroups}
        availableSectors={availableSectors}
        availableStages={availableStages}
        availableImpactLevels={availableImpactLevels}
        availableAreas={availableAreas}
        totalCount={alertCounts.total}
        filteredCount={alertCounts.filtered}
      />

      {/* Kanban Board */}
      <div className="flex gap-4 w-full">
        {BILLS_KANBAN_COLUMNS.map((column) => (
          <ClientKanbanColumn
            key={column.id}
            id={column.id}
            label={column.label}
            color={column.color}
            alerts={alertsByStage[column.id as BillKanbanStage] || []}
            onAlertClick={handleAlertClick}
            clientId={clientId}
          />
        ))}
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
