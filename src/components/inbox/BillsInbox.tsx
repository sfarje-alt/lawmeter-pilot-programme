import { useState, useMemo, useEffect } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Inbox as InboxIcon, Scale, Pin } from "lucide-react";
import { KanbanColumn } from "./KanbanColumn";
import { AlertDetailDrawer } from "./AlertDetailDrawer";
import { BillsFilterBar } from "./BillsFilterBar";
import { PeruAlert, BILLS_KANBAN_COLUMNS, MOCK_CLIENTS, ALL_LEGISLATIVE_STAGES } from "@/data/peruAlertsMockData";
import { toast } from "sonner";

interface BillsInboxProps {
  alerts: PeruAlert[];
  onPublish: (alert: PeruAlert, clientIds: string[], commentaries: { clientId: string; commentary: string }[]) => void;
  onTogglePin: (alertId: string) => void;
  selectedClientId: string | null;
  hasCommentaryForClient: (alert: PeruAlert, clientId: string) => boolean;
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
  clientIds: string[];
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  onlyPinned: boolean;
}

type BillKanbanStage = "comision" | "pleno" | "tramite_final";

export function BillsInbox({ alerts, onPublish, onTogglePin, selectedClientId, hasCommentaryForClient, onUpdateExpertCommentary, initialAlertId }: BillsInboxProps) {
  const [selectedAlert, setSelectedAlert] = useState<PeruAlert | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [processedInitialAlert, setProcessedInitialAlert] = useState(false);
  const [filters, setFilters] = useState<BillsFilters>({
    search: "",
    areas: [],
    stages: [],
    sectors: [],
    parliamentaryGroups: [],
    impactLevels: [],
    clientIds: [],
    dateFrom: undefined,
    dateTo: undefined,
    onlyPinned: false,
  });

  // Filter only bills
  const billAlerts = useMemo(() => {
    return alerts.filter(a => a.legislation_type === "proyecto_de_ley");
  }, [alerts]);

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

  // Get available clients from data
  const availableClients = useMemo(() => {
    return MOCK_CLIENTS;
  }, []);

  // Apply filters with multi-select support
  const filteredAlerts = useMemo(() => {
    return billAlerts.filter((alert) => {
      // Pinned filter
      if (filters.onlyPinned && !alert.is_pinned_for_publication) {
        return false;
      }

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

      // Client filter (multi-select)
      if (filters.clientIds.length > 0) {
        const alertClientIds = [
          alert.client_id,
          alert.primary_client_id,
          ...alert.client_commentaries.map(c => c.clientId)
        ].filter(Boolean);
        if (!filters.clientIds.some(clientId => alertClientIds.includes(clientId))) {
          return false;
        }
      }

      // Date range filter (using project_date or stage_date)
      if (filters.dateFrom || filters.dateTo) {
        const alertDate = alert.project_date ? new Date(alert.project_date) : null;
        if (alertDate) {
          if (filters.dateFrom && alertDate < filters.dateFrom) return false;
          if (filters.dateTo && alertDate > filters.dateTo) return false;
        } else {
          // If no date, exclude when date filter is active
          return false;
        }
      }

      return true;
    });
  }, [billAlerts, filters]);

  // Group alerts by kanban stage (legislative stage)
  // Note: kanban_stage represents legislative progress and is independent of publication status
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

    // Sort each column: pinned first, then by date (newest first)
    Object.keys(grouped).forEach((stage) => {
      grouped[stage as BillKanbanStage].sort((a, b) => {
        // Pinned items first
        if (a.is_pinned_for_publication !== b.is_pinned_for_publication) {
          return a.is_pinned_for_publication ? -1 : 1;
        }
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

  // Pending count (non-archived)
  const pendingCount = alertCounts.byStage.comision + alertCounts.byStage.pleno + alertCounts.byStage.tramite_final;

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="glass-card border-border/30">
          <CardContent className="pt-3 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <InboxIcon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">{pendingCount}</div>
                <div className="text-xs text-muted-foreground">Pendientes</div>
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
      <BillsFilterBar
        filters={filters}
        onFiltersChange={setFilters}
        availableParliamentaryGroups={availableParliamentaryGroups}
        availableSectors={availableSectors}
        availableStages={availableStages}
        availableImpactLevels={availableImpactLevels}
        availableAreas={availableAreas}
        availableClients={availableClients}
        totalCount={alertCounts.total}
        filteredCount={alertCounts.filtered}
        pinnedCount={pinnedCount}
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
            selectedClientId={selectedClientId}
            hasCommentaryForClient={hasCommentaryForClient}
          />
        ))}
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
