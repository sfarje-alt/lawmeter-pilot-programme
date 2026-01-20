import { useState, useMemo } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Pin, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  Scale,
  FileText
} from "lucide-react";
import { PeruAlert, MOCK_CLIENTS, getTypeLabel } from "@/data/peruAlertsMockData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PublicationPanelProps {
  pinnedAlerts: PeruAlert[];
  selectedClientId: string | null;
  onClientChange: (clientId: string | null) => void;
  hasCommentaryForClient: (alert: PeruAlert, clientId: string) => boolean;
  onBatchPublish: (clientIds: string[]) => void;
  onUnpinAlert: (alertId: string) => void;
}

export function PublicationPanel({
  pinnedAlerts,
  selectedClientId,
  onClientChange,
  hasCommentaryForClient,
  onBatchPublish,
  onUnpinAlert,
}: PublicationPanelProps) {
  const [selectedAlertIds, setSelectedAlertIds] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false);

  // Alerts with and without commentary for selected client
  const categorizedAlerts = useMemo(() => {
    if (!selectedClientId) return { withCommentary: [], withoutCommentary: pinnedAlerts };
    
    const withCommentary: PeruAlert[] = [];
    const withoutCommentary: PeruAlert[] = [];
    
    pinnedAlerts.forEach(alert => {
      if (hasCommentaryForClient(alert, selectedClientId)) {
        withCommentary.push(alert);
      } else {
        withoutCommentary.push(alert);
      }
    });
    
    return { withCommentary, withoutCommentary };
  }, [pinnedAlerts, selectedClientId, hasCommentaryForClient]);

  const toggleAlertSelection = (alertId: string) => {
    setSelectedAlertIds(prev => {
      const next = new Set(prev);
      if (next.has(alertId)) {
        next.delete(alertId);
      } else {
        next.add(alertId);
      }
      return next;
    });
  };

  const selectAllWithCommentary = () => {
    setSelectedAlertIds(new Set(categorizedAlerts.withCommentary.map(a => a.id)));
  };

  const handlePublish = () => {
    if (selectedAlertIds.size === 0 || !selectedClientId) {
      toast.error("Selecciona al menos una alerta y un cliente");
      return;
    }
    
    onBatchPublish([selectedClientId]);
    
    const clientName = MOCK_CLIENTS.find(c => c.id === selectedClientId)?.name || selectedClientId;
    toast.success(`${selectedAlertIds.size} alerta(s) publicada(s) a ${clientName}`);
    
    setSelectedAlertIds(new Set());
    setOpen(false);
  };

  const pinnedCount = pinnedAlerts.length;
  const readyCount = categorizedAlerts.withCommentary.length;
  const pendingCount = categorizedAlerts.withoutCommentary.length;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          className={cn(
            "gap-2",
            pinnedCount > 0 && "border-primary/50 bg-primary/10"
          )}
        >
          <Pin className={cn("h-4 w-4", pinnedCount > 0 && "text-primary")} />
          <span>Panel de Publicación</span>
          {pinnedCount > 0 && (
            <Badge variant="secondary" className="ml-1 bg-primary text-primary-foreground">
              {pinnedCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg bg-card border-border/50 p-0">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Pin className="h-5 w-5 text-primary" />
                Panel de Publicación
              </SheetTitle>
            </SheetHeader>

            {pinnedCount === 0 ? (
              <div className="text-center py-12">
                <Pin className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No hay alertas pineadas para publicar.
                </p>
                <p className="text-sm text-muted-foreground/60 mt-2">
                  Pinea alertas desde el Inbox para agregarlas aquí.
                </p>
              </div>
            ) : (
              <>
                {/* Client Selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Seleccionar Cliente
                  </label>
                  <Select 
                    value={selectedClientId || ""} 
                    onValueChange={(val) => onClientChange(val || null)}
                  >
                    <SelectTrigger className="w-full bg-muted/30">
                      <SelectValue placeholder="Selecciona un cliente..." />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_CLIENTS.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            <span>{client.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="bg-border/30" />

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <div className="text-xl font-bold text-foreground">{pinnedCount}</div>
                    <div className="text-xs text-muted-foreground">Pineadas</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-green-500/10">
                    <div className="text-xl font-bold text-green-400">{readyCount}</div>
                    <div className="text-xs text-muted-foreground">Listas</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-amber-500/10">
                    <div className="text-xl font-bold text-amber-400">{pendingCount}</div>
                    <div className="text-xs text-muted-foreground">Sin comentario</div>
                  </div>
                </div>

                <Separator className="bg-border/30" />

                {/* Alerts List */}
                <div className="space-y-4">
                  {/* Ready alerts (with commentary) */}
                  {categorizedAlerts.withCommentary.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-green-400 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          Listas para publicar ({categorizedAlerts.withCommentary.length})
                        </h4>
                        <Button variant="ghost" size="sm" onClick={selectAllWithCommentary}>
                          Seleccionar todas
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {categorizedAlerts.withCommentary.map((alert) => (
                          <AlertItem 
                            key={alert.id}
                            alert={alert}
                            selected={selectedAlertIds.has(alert.id)}
                            onToggle={() => toggleAlertSelection(alert.id)}
                            onUnpin={() => onUnpinAlert(alert.id)}
                            hasCommentary
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pending alerts (without commentary) */}
                  {categorizedAlerts.withoutCommentary.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-amber-400 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Falta comentario experto ({categorizedAlerts.withoutCommentary.length})
                      </h4>
                      <div className="space-y-2">
                        {categorizedAlerts.withoutCommentary.map((alert) => (
                          <AlertItem 
                            key={alert.id}
                            alert={alert}
                            selected={selectedAlertIds.has(alert.id)}
                            onToggle={() => toggleAlertSelection(alert.id)}
                            onUnpin={() => onUnpinAlert(alert.id)}
                            hasCommentary={false}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Separator className="bg-border/30" />

                {/* Actions */}
                <div className="space-y-3">
                  <Button
                    className="w-full"
                    onClick={handlePublish}
                    disabled={selectedAlertIds.size === 0 || !selectedClientId}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Publicar {selectedAlertIds.size > 0 ? `${selectedAlertIds.size} Seleccionada(s)` : 'Seleccionadas'}
                  </Button>
                  
                  {selectedClientId && categorizedAlerts.withCommentary.length > 0 && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        selectAllWithCommentary();
                        handlePublish();
                      }}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Publicar Todas las Listas ({categorizedAlerts.withCommentary.length})
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

// Individual alert item component
function AlertItem({ 
  alert, 
  selected, 
  onToggle, 
  onUnpin,
  hasCommentary 
}: { 
  alert: PeruAlert; 
  selected: boolean; 
  onToggle: () => void;
  onUnpin: () => void;
  hasCommentary: boolean;
}) {
  const isBill = alert.legislation_type === "proyecto_de_ley";
  
  return (
    <div 
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer",
        selected 
          ? "bg-primary/10 border-primary/50" 
          : "bg-muted/20 border-border/30 hover:border-border/50"
      )}
      onClick={onToggle}
    >
      <Checkbox 
        checked={selected}
        onCheckedChange={onToggle}
        className="mt-0.5 pointer-events-none"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {isBill ? (
            <Scale className="h-3 w-3 text-blue-400" />
          ) : (
            <FileText className="h-3 w-3 text-emerald-400" />
          )}
          <span className="text-xs text-muted-foreground">{getTypeLabel(alert.legislation_type)}</span>
          {alert.legislation_id && (
            <span className="text-xs font-mono text-primary">{alert.legislation_id}</span>
          )}
        </div>
        <p className="text-sm font-medium text-foreground line-clamp-2">
          {alert.legislation_title}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1">
        {hasCommentary ? (
          <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400">
            ✓ Comentado
          </Badge>
        ) : (
          <Badge variant="secondary" className="text-xs bg-amber-500/20 text-amber-400">
            ⚠ Sin comentario
          </Badge>
        )}
        <button 
          onClick={(e) => { e.stopPropagation(); onUnpin(); }}
          className="text-xs text-muted-foreground hover:text-destructive transition-colors"
        >
          Quitar pin
        </button>
      </div>
    </div>
  );
}