import { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Inbox as InboxIcon, FileText, Scale } from "lucide-react";
import { useInboxAlerts } from "@/hooks/useInboxAlerts";
import { InboxFilterBar } from "@/components/inbox/InboxFilterBar";
import { KanbanColumn } from "@/components/inbox/KanbanColumn";
import { AlertDetailDrawer } from "@/components/inbox/AlertDetailDrawer";
import { PeruAlert, MOCK_CLIENTS } from "@/data/peruAlertsMockData";
import { toast } from "sonner";

interface ClientCommentary {
  clientId: string;
  commentary: string;
}

export default function Inbox() {
  const {
    alertsByStage,
    alertCounts,
    filters,
    setFilters,
    declineAlert,
    publishAlert,
    kanbanColumns,
  } = useInboxAlerts();

  const [selectedAlert, setSelectedAlert] = useState<PeruAlert | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleAlertClick = (alert: PeruAlert) => {
    setSelectedAlert(alert);
    setDrawerOpen(true);
  };

  const handleDecline = (alert: PeruAlert) => {
    declineAlert(alert);
    toast.success("Alerta declinada", {
      description: "Guardada para auditoría interna del equipo legal"
    });
  };

  const handlePublish = (alert: PeruAlert, clientIds: string[], commentaries: ClientCommentary[]) => {
    // Publish to each selected client
    clientIds.forEach(clientId => {
      publishAlert(alert, clientId);
    });
    
    const clientNames = clientIds.map(id => 
      MOCK_CLIENTS.find(c => c.id === id)?.name || id
    ).join(", ");
    
    toast.success(`Publicado a ${clientIds.length} cliente${clientIds.length > 1 ? 's' : ''}`, {
      description: clientNames
    });
  };

  // Calculate pending count (non-archived, non-published)
  const pendingCount = 
    alertsByStage.comision.length + 
    alertsByStage.pleno.length + 
    alertsByStage.tramite_final.length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inbox</h1>
          <p className="text-muted-foreground">
            Revisa y gestiona alertas legislativas para tus clientes
          </p>
        </div>
        <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary">
          Perú
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="glass-card border-border/30">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <InboxIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{pendingCount}</div>
                <div className="text-xs text-muted-foreground">Pendientes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/30">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Scale className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{alertCounts.bills}</div>
                <div className="text-xs text-muted-foreground">Proyectos de Ley</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/30">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <FileText className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{alertCounts.norms}</div>
                <div className="text-xs text-muted-foreground">Normas</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <InboxFilterBar
        filters={filters}
        onFiltersChange={setFilters}
        alertCounts={alertCounts}
      />

      {/* Kanban Board */}
      <div className="relative">
        <ScrollArea className="w-full pb-4">
          <div className="flex gap-4 min-w-max">
            {kanbanColumns.map((column) => (
              <KanbanColumn
                key={column.id}
                id={column.id}
                label={column.label}
                color={column.color}
                alerts={alertsByStage[column.id as PeruAlert["kanban_stage"]]}
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
