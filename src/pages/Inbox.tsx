import { useState, useMemo, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scale, FileText } from "lucide-react";
import { BillsInbox } from "@/components/inbox/BillsInbox";
import { RegulationsInbox } from "@/components/inbox/RegulationsInbox";
import { PublicationPanel } from "@/components/inbox/PublicationPanel";
import { ALL_MOCK_ALERTS, PeruAlert, ClientCommentary } from "@/data/peruAlertsMockData";

export default function Inbox() {
  const [alerts, setAlerts] = useState<PeruAlert[]>(ALL_MOCK_ALERTS);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  // Count by type
  const counts = useMemo(() => ({
    bills: alerts.filter(a => a.legislation_type === "proyecto_de_ley").length,
    regulations: alerts.filter(a => a.legislation_type === "norma").length,
  }), [alerts]);

  // Pinned alerts
  const pinnedAlerts = useMemo(() => {
    return alerts.filter(a => a.is_pinned_for_publication);
  }, [alerts]);

  // Check if alert has commentary for client
  const hasCommentaryForClient = useCallback((alert: PeruAlert, clientId: string): boolean => {
    const clientCommentary = alert.client_commentaries.find(c => c.clientId === clientId);
    if (clientCommentary && clientCommentary.commentary.trim()) return true;
    return !!(alert.expert_commentary && alert.expert_commentary.trim());
  }, []);

  // Toggle pin for publication
  const togglePinAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? { ...a, is_pinned_for_publication: !a.is_pinned_for_publication, updated_at: new Date().toISOString() }
          : a
      )
    );
  }, []);

  // Update expert commentary
  const updateExpertCommentary = useCallback((alertId: string, commentary: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? { ...a, expert_commentary: commentary, updated_at: new Date().toISOString() }
          : a
      )
    );
  }, []);

  // Publish alert
  const publishAlert = useCallback((alert: PeruAlert, clientIds: string[], commentaries: { clientId: string; commentary: string }[]) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alert.id
          ? { 
              ...a, 
              kanban_stage: "publicado" as const, 
              status: "published" as const, 
              client_id: clientIds[0] || null,
              is_pinned_for_publication: false,
              updated_at: new Date().toISOString() 
            }
          : a
      )
    );
  }, []);

  // Batch publish pinned alerts
  const batchPublishPinned = useCallback((clientIds: string[]) => {
    setAlerts((prev) =>
      prev.map((a) => {
        if (!a.is_pinned_for_publication) return a;
        return {
          ...a,
          kanban_stage: "publicado" as const,
          status: "published" as const,
          client_id: clientIds[0] || null,
          is_pinned_for_publication: false,
          updated_at: new Date().toISOString()
        };
      })
    );
  }, []);

  // Move alert
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
        <div className="flex items-center gap-3">
          <PublicationPanel
            pinnedAlerts={pinnedAlerts}
            selectedClientId={selectedClientId}
            onClientChange={setSelectedClientId}
            hasCommentaryForClient={hasCommentaryForClient}
            onBatchPublish={batchPublishPinned}
            onUnpinAlert={togglePinAlert}
          />
          <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary">
            Perú
          </Badge>
        </div>
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
            onPublish={publishAlert}
            onTogglePin={togglePinAlert}
            selectedClientId={selectedClientId}
            hasCommentaryForClient={hasCommentaryForClient}
            onUpdateExpertCommentary={updateExpertCommentary}
          />
        </TabsContent>

        <TabsContent value="regulations" className="mt-6">
          <RegulationsInbox
            alerts={alerts}
            onPublish={publishAlert}
            onMoveAlert={moveAlert}
            onTogglePin={togglePinAlert}
            selectedClientId={selectedClientId}
            hasCommentaryForClient={hasCommentaryForClient}
            onUpdateExpertCommentary={updateExpertCommentary}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
