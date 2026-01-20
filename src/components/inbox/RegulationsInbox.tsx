import { useState, useMemo } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Inbox as InboxIcon, FileText, Building2 } from "lucide-react";
import { KanbanColumn } from "./KanbanColumn";
import { AlertDetailDrawer } from "./AlertDetailDrawer";
import { RegulationsFilterBar } from "./RegulationsFilterBar";
import { PeruAlert, REGULATIONS_KANBAN_COLUMNS, MOCK_CLIENTS, ENTITIES } from "@/data/peruAlertsMockData";
import { toast } from "sonner";

interface RegulationsInboxProps {
  alerts: PeruAlert[];
  onDecline: (alert: PeruAlert) => void;
  onPublish: (alert: PeruAlert, clientIds: string[], commentaries: { clientId: string; commentary: string }[]) => void;
  onMoveAlert: (alertId: string, newStage: PeruAlert["kanban_stage"]) => void;
}

export interface RegulationsFilters {
  search: string;
  area: string;
  entity: string;
}

type RegulationKanbanStage = "pendiente" | "en_revision" | "publicado" | "archivado";

export function RegulationsInbox({ alerts, onDecline, onPublish, onMoveAlert }: RegulationsInboxProps) {
  const [selectedAlert, setSelectedAlert] = useState<PeruAlert | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<RegulationsFilters>({
    search: "",
    area: "all",
    entity: "all",
  });

  // Filter only regulations
  const regulationAlerts = useMemo(() => {
    return alerts.filter(a => a.legislation_type === "norma");
  }, [alerts]);

  // Apply filters
  const filteredAlerts = useMemo(() => {
    return regulationAlerts.filter((alert) => {
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

  // Map regulation kanban stages (they use different stages)
  const mapToRegulationStage = (alert: PeruAlert): RegulationKanbanStage => {
    // Regulations by default come in as "publicado" (from source) but we treat them as "pendiente" for review workflow
    if (alert.status === "published") return "publicado";
    if (alert.status === "declined") return "archivado";
    if (alert.status === "reviewed") return "en_revision";
    return "pendiente";
  };

  // Group alerts by kanban stage
  const alertsByStage = useMemo(() => {
    const grouped: Record<RegulationKanbanStage, PeruAlert[]> = {
      pendiente: [],
      en_revision: [],
      publicado: [],
      archivado: [],
    };

    filteredAlerts.forEach((alert) => {
      const stage = mapToRegulationStage(alert);
      grouped[stage].push(alert);
    });

    // Sort each column by date (newest first)
    Object.keys(grouped).forEach((stage) => {
      grouped[stage as RegulationKanbanStage].sort((a, b) => {
        const dateA = new Date(a.updated_at).getTime();
        const dateB = new Date(b.updated_at).getTime();
        return dateB - dateA;
      });
    });

    return grouped;
  }, [filteredAlerts]);

  // Counts
  const alertCounts = useMemo(() => ({
    total: regulationAlerts.length,
    filtered: filteredAlerts.length,
    byStage: {
      pendiente: alertsByStage.pendiente.length,
      en_revision: alertsByStage.en_revision.length,
      publicado: alertsByStage.publicado.length,
      archivado: alertsByStage.archivado.length,
    }
  }), [regulationAlerts, filteredAlerts, alertsByStage]);

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

  const handleDecline = (alert: PeruAlert) => {
    onDecline(alert);
    toast.success("Norma declinada", {
      description: "Guardada para auditoría interna"
    });
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

  // Pending count (pendiente + en_revision)
  const pendingCount = alertCounts.byStage.pendiente + alertCounts.byStage.en_revision;

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <FileText className="h-4 w-4 text-yellow-400" />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">{alertCounts.byStage.pendiente}</div>
                <div className="text-xs text-muted-foreground">Por Revisar</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/30">
          <CardContent className="pt-3 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <FileText className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">{alertCounts.byStage.en_revision}</div>
                <div className="text-xs text-muted-foreground">En Revisión</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/30">
          <CardContent className="pt-3 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Building2 className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">{alertCounts.byStage.publicado}</div>
                <div className="text-xs text-muted-foreground">Publicadas</div>
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
      />

      {/* Kanban Board */}
      <div className="relative">
        <ScrollArea className="w-full pb-4">
          <div className="flex gap-4 min-w-max">
            {REGULATIONS_KANBAN_COLUMNS.map((column) => (
              <KanbanColumn
                key={column.id}
                id={column.id}
                label={column.label}
                color={column.color}
                alerts={alertsByStage[column.id as RegulationKanbanStage] || []}
                onAlertClick={handleAlertClick}
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
        onDecline={handleDecline}
        onPublish={handlePublish}
      />
    </div>
  );
}
