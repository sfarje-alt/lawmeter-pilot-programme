import { useMemo, useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scale, FileText } from "lucide-react";
import { BillsInbox } from "@/components/inbox/BillsInbox";
import { RegulationsInbox } from "@/components/inbox/RegulationsInbox";
import { useAlerts } from "@/contexts/AlertsContext";

interface InboxProps {
  initialTab?: string | null;
  initialAlertId?: string | null;
}

export default function Inbox({ initialTab, initialAlertId }: InboxProps) {
  const {
    alerts,
    togglePinAlert,
    archiveAlert,
    unarchiveAlert,
    updateSharedCommentary,
  } = useAlerts();
  const [activeTab, setActiveTab] = useState<string>(initialTab === 'regulations' ? 'regulations' : 'bills');

  // Update tab when initialTab changes (from URL navigation)
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab === 'regulations' ? 'regulations' : 'bills');
    }
  }, [initialTab]);

  // Count by type
  const counts = useMemo(() => ({
    bills: alerts.filter(a => a.legislation_type === "proyecto_de_ley").length,
    regulations: alerts.filter(a => a.legislation_type === "norma").length,
  }), [alerts]);

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* Page Header */}
      <div className="flex min-w-0 items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-foreground">Alertas</h1>
          <p className="text-muted-foreground">
            Revisa, clasifica y gestiona las alertas regulatorias de tu organización
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary">
            Perú
          </Badge>
        </div>
      </div>

      {/* Tabs for Bills vs Regulations */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full min-w-0">
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-muted/30">
          <TabsTrigger value="bills" className="flex items-center gap-2 data-[state=active]:bg-primary/20 min-w-0">
            <Scale className="h-4 w-4 shrink-0" />
            <span className="truncate">Proyectos de Ley</span>
            <Badge variant="secondary" className="ml-1 text-xs shrink-0">
              {counts.bills}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="regulations" className="flex items-center gap-2 data-[state=active]:bg-primary/20 min-w-0">
            <FileText className="h-4 w-4 shrink-0" />
            <span className="truncate">Normas</span>
            <Badge variant="secondary" className="ml-1 text-xs shrink-0">
              {counts.regulations}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bills" className="mt-6 w-full min-w-0">
          <BillsInbox
            alerts={alerts}
            onTogglePin={togglePinAlert}
            onArchive={archiveAlert}
            onUnarchive={unarchiveAlert}
            onUpdateExpertCommentary={updateSharedCommentary}
            initialAlertId={activeTab === 'bills' ? initialAlertId : undefined}
          />
        </TabsContent>

        <TabsContent value="regulations" className="mt-6 w-full min-w-0">
          <RegulationsInbox
            alerts={alerts}
            onTogglePin={togglePinAlert}
            onArchive={archiveAlert}
            onUnarchive={unarchiveAlert}
            onUpdateExpertCommentary={updateSharedCommentary}
            initialAlertId={activeTab === 'regulations' ? initialAlertId : undefined}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
