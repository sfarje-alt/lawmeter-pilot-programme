import { useState, useMemo } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Inbox as InboxIcon, Scale, Pin } from "lucide-react";
import { KanbanColumn } from "./KanbanColumn";
import { AlertDetailDrawer } from "./AlertDetailDrawer";
import { BillsFilterBar } from "./BillsFilterBar";
import { PeruAlert, BILLS_KANBAN_COLUMNS, MOCK_CLIENTS } from "@/data/peruAlertsMockData";
import { toast } from "sonner";

interface BillsInboxProps {
  alerts: PeruAlert[];
  onPublish: (alert: PeruAlert, clientIds: string[], commentaries: { clientId: string; commentary: string }[]) => void;
  onTogglePin: (alertId: string) => void;
  selectedClientId: string | null;
  hasCommentaryForClient: (alert: PeruAlert, clientId: string) => boolean;
  onUpdateExpertCommentary: (alertId: string, commentary: string) => void;
}

export interface BillsFilters {
  search: string;
  area: string;
  stage: string;
  onlyPinned: boolean;
}

type BillKanbanStage = "comision" | "pleno" | "tramite_final";

export function BillsInbox({ alerts, onPublish, onTogglePin, selectedClientId, hasCommentaryForClient, onUpdateExpertCommentary }: BillsInboxProps) {
  const [selectedAlert, setSelectedAlert] = useState<PeruAlert | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<BillsFilters>({
    search: "",
    area: "all",
    stage: "all",
    onlyPinned: false,
  });

  // Filter only bills
  const billAlerts = useMemo(() => {
    return alerts.filter(a => a.legislation_type === "proyecto_de_ley");
  }, [alerts]);

  // Pinned count
  const pinnedCount = useMemo(() => {
    return billAlerts.filter(a => a.is_pinned_for_publication).length;
  }, [billAlerts]);

  // Apply filters
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

      // Area filter
      if (filters.area !== "all" && !alert.affected_areas.includes(filters.area)) {
        return false;
      }

      // Stage filter (current_stage)
      if (filters.stage !== "all" && alert.current_stage !== filters.stage) {
        return false;
      }

      return true;
    });
  }, [billAlerts, filters]);

  // Group alerts by kanban stage (excluding publicado for bills)
  const alertsByStage = useMemo(() => {
    const grouped: Record<BillKanbanStage, PeruAlert[]> = {
      comision: [],
      pleno: [],
      tramite_final: [],
    };

    filteredAlerts.forEach((alert) => {
      // Map kanban_stage, excluding publicado (bills shouldn't be in publicado)
      let stage = alert.kanban_stage as BillKanbanStage;
      if (stage === "publicado" as any) {
        stage = "tramite_final"; // Bills that reach publicado go to tramite_final
      }
      if (grouped[stage]) {
        grouped[stage].push(alert);
      }
    });

    // Sort each column by date (newest first)
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

  // Get unique stages from the data for the filter
  const availableStages = useMemo(() => {
    const stages = new Set<string>();
    billAlerts.forEach(alert => {
      if (alert.current_stage) {
        stages.add(alert.current_stage);
      }
    });
    return Array.from(stages).sort();
  }, [billAlerts]);

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
        availableStages={availableStages}
        totalCount={alertCounts.total}
        filteredCount={alertCounts.filtered}
        pinnedCount={pinnedCount}
      />

      {/* Kanban Board */}
      <div className="relative">
        <ScrollArea className="w-full pb-4">
          <div className="flex gap-4 min-w-max">
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
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
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
