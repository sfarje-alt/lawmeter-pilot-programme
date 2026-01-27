import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scale, FileText, Eye } from "lucide-react";
import { useClientUser } from "@/hooks/useClientUser";
import { useAlerts } from "@/contexts/AlertsContext";
import { ClientBillsInbox } from "./ClientBillsInbox";
import { ClientRegulationsInbox } from "./ClientRegulationsInbox";

export function ClientInbox() {
  const { clientId, clientName } = useClientUser();
  const { getPublishedAlertsForClient } = useAlerts();

  // Get published alerts for this client from shared context
  const publishedAlerts = useMemo(() => {
    if (!clientId) return [];
    return getPublishedAlertsForClient(clientId);
  }, [clientId, getPublishedAlertsForClient]);

  // Split by type for tab counts
  const bills = useMemo(() => 
    publishedAlerts.filter(a => a.legislation_type === "proyecto_de_ley"), 
    [publishedAlerts]
  );
  const regulations = useMemo(() => 
    publishedAlerts.filter(a => a.legislation_type === "norma"), 
    [publishedAlerts]
  );

  if (!clientId) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No se pudo identificar el cliente.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alertas Publicadas</h1>
          <p className="text-muted-foreground">
            Alertas legislativas publicadas para {clientName || "tu organización"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-500/10 border-green-500/30 text-green-500">
            <Eye className="h-3 w-3 mr-1" />
            Solo Lectura
          </Badge>
          <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary">
            {publishedAlerts.length} alertas
          </Badge>
        </div>
      </div>

      {/* Tabs with Full Admin-Like Inboxes */}
      <Tabs defaultValue="bills" className="w-full">
        <TabsList className="bg-muted/30">
          <TabsTrigger value="bills" className="gap-2">
            <Scale className="h-4 w-4" />
            Proyectos de Ley
            <Badge variant="secondary">{bills.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="regulations" className="gap-2">
            <FileText className="h-4 w-4" />
            Normas
            <Badge variant="secondary">{regulations.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bills" className="mt-4">
          {bills.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground border border-dashed rounded-lg">
              <Scale className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay proyectos de ley publicados para tu organización.</p>
            </div>
          ) : (
            <ClientBillsInbox alerts={publishedAlerts} clientId={clientId} />
          )}
        </TabsContent>

        <TabsContent value="regulations" className="mt-4">
          {regulations.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground border border-dashed rounded-lg">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay normas publicadas para tu organización.</p>
            </div>
          ) : (
            <ClientRegulationsInbox alerts={publishedAlerts} clientId={clientId} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
