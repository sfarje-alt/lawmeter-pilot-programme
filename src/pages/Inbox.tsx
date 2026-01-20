import { useState, useMemo, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scale, FileText } from "lucide-react";
import { BillsInbox } from "@/components/inbox/BillsInbox";
import { RegulationsInbox } from "@/components/inbox/RegulationsInbox";
import { ALL_MOCK_ALERTS, PeruAlert } from "@/data/peruAlertsMockData";

interface ClientCommentary {
  clientId: string;
  commentary: string;
}

export default function Inbox() {
  const [alerts, setAlerts] = useState<PeruAlert[]>(ALL_MOCK_ALERTS);

  // Count by type
  const counts = useMemo(() => ({
    bills: alerts.filter(a => a.legislation_type === "proyecto_de_ley").length,
    regulations: alerts.filter(a => a.legislation_type === "norma").length,
  }), [alerts]);

  // Decline alert (move to archivado)
  const declineAlert = useCallback((alert: PeruAlert) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alert.id
          ? { ...a, kanban_stage: "archivado" as const, status: "declined" as const, updated_at: new Date().toISOString() }
          : a
      )
    );
  }, []);

  // Publish alert (move to publicado and assign client)
  const publishAlert = useCallback((alert: PeruAlert, clientIds: string[], commentaries: ClientCommentary[]) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alert.id
          ? { 
              ...a, 
              kanban_stage: "publicado" as const, 
              status: "published" as const, 
              client_id: clientIds[0] || null,
              updated_at: new Date().toISOString() 
            }
          : a
      )
    );
  }, []);

  // Move alert to a different stage
  const moveAlert = useCallback((alertId: string, newStage: PeruAlert["kanban_stage"]) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? { ...a, kanban_stage: newStage, updated_at: new Date().toISOString() }
          : a
      )
    );
  }, []);

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

      {/* Tabs for Bills vs Regulations */}
      <Tabs defaultValue="bills" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-muted/30">
          <TabsTrigger value="bills" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
            <Scale className="h-4 w-4" />
            <span>Proyectos de Ley</span>
            <Badge variant="secondary" className="ml-1 text-xs">
              {counts.bills}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="regulations" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
            <FileText className="h-4 w-4" />
            <span>Normas</span>
            <Badge variant="secondary" className="ml-1 text-xs">
              {counts.regulations}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bills" className="mt-6">
          <BillsInbox
            alerts={alerts}
            onDecline={declineAlert}
            onPublish={publishAlert}
          />
        </TabsContent>

        <TabsContent value="regulations" className="mt-6">
          <RegulationsInbox
            alerts={alerts}
            onDecline={declineAlert}
            onPublish={publishAlert}
            onMoveAlert={moveAlert}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
