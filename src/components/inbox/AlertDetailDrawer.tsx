import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  ExternalLink, 
  Calendar, 
  User, 
  Building2, 
  FileText,
  Users,
  PenLine,
  Send,
  Archive,
  Clock,
  CheckCircle2,
  MessageSquarePlus
} from "lucide-react";
import { PeruAlert, getTypeLabel, getTypeColor, MOCK_CLIENTS } from "@/data/peruAlertsMockData";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface ClientCommentary {
  clientId: string;
  commentary: string;
}

interface AlertDetailDrawerProps {
  alert: PeruAlert | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDecline: (alert: PeruAlert) => void;
  onPublish: (alert: PeruAlert, clientIds: string[], commentaries: ClientCommentary[]) => void;
}

export function AlertDetailDrawer({ alert, open, onOpenChange, onDecline, onPublish }: AlertDetailDrawerProps) {
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [clientCommentaries, setClientCommentaries] = useState<Record<string, string>>({});
  const [useSharedCommentary, setUseSharedCommentary] = useState(true);
  const [sharedCommentary, setSharedCommentary] = useState("");

  // Reset state when alert changes
  useEffect(() => {
    if (alert) {
      setSelectedClients([]);
      setClientCommentaries({});
      setSharedCommentary(alert.expert_commentary || "");
      setUseSharedCommentary(true);
    }
  }, [alert?.id]);

  if (!alert) return null;

  const isBill = alert.legislation_type === "proyecto_de_ley";
  
  // Get display date based on type
  const displayDate = isBill 
    ? alert.stage_date || alert.project_date 
    : alert.publication_date;
  
  const formattedDate = displayDate 
    ? format(new Date(displayDate), "dd 'de' MMMM, yyyy", { locale: es })
    : format(new Date(alert.created_at), "dd 'de' MMMM, yyyy", { locale: es });

  const handleDecline = () => {
    onDecline(alert);
    onOpenChange(false);
  };

  const handlePublish = () => {
    if (selectedClients.length > 0) {
      const commentaries: ClientCommentary[] = selectedClients.map(clientId => ({
        clientId,
        commentary: useSharedCommentary ? sharedCommentary : (clientCommentaries[clientId] || "")
      }));
      onPublish(alert, selectedClients, commentaries);
      onOpenChange(false);
    }
  };

  const toggleClient = (clientId: string) => {
    setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const updateClientCommentary = (clientId: string, commentary: string) => {
    setClientCommentaries(prev => ({
      ...prev,
      [clientId]: commentary
    }));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl bg-card border-border/50 p-0">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            {/* Header */}
            <SheetHeader className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <Badge variant="outline" className={cn("text-sm", getTypeColor(alert.legislation_type))}>
                  {getTypeLabel(alert.legislation_type)}
                </Badge>
                {isBill && alert.current_stage && (
                  <Badge variant="secondary" className="text-sm">
                    {alert.current_stage}
                  </Badge>
                )}
              </div>
              <SheetTitle className="text-left text-lg font-semibold leading-tight">
                {alert.legislation_title}
              </SheetTitle>
            </SheetHeader>

            <Separator className="bg-border/30" />

            {/* Metadata Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Información
              </h3>
              
              <div className="grid gap-2">
                {alert.legislation_id && (
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">ID:</span>
                    <span className="text-foreground font-medium font-mono">{alert.legislation_id}</span>
                  </div>
                )}

                {isBill && alert.author && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Autor:</span>
                    <span className="text-foreground">{alert.author}</span>
                  </div>
                )}

                {isBill && alert.parliamentary_group && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Grupo:</span>
                    <span className="text-foreground">{alert.parliamentary_group}</span>
                  </div>
                )}

                {!isBill && alert.entity && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Entidad:</span>
                    <span className="text-foreground">{alert.entity}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Fecha:</span>
                  <span className="text-foreground">{formattedDate}</span>
                </div>

                {isBill && alert.project_date && alert.stage_date && alert.project_date !== alert.stage_date && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Fecha proyecto:</span>
                    <span className="text-foreground">
                      {format(new Date(alert.project_date), "dd MMM yyyy", { locale: es })}
                    </span>
                  </div>
                )}
              </div>

              {/* Affected Areas */}
              <div className="flex flex-wrap gap-2 mt-3">
                {alert.affected_areas.map((area) => (
                  <Badge key={area} variant="outline" className="bg-primary/10 border-primary/30 text-primary">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator className="bg-border/30" />

            {/* Summary Section (for normas) */}
            {!isBill && alert.legislation_summary && (
              <>
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Resumen
                  </h3>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                    <p className="text-sm text-foreground leading-relaxed">
                      {alert.legislation_summary}
                    </p>
                  </div>
                </div>
                <Separator className="bg-border/30" />
              </>
            )}

            {/* EDITORIAL SECTION - Publish for Client (Multi-selection) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Send className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Publicar para Cliente
                </h3>
                <Badge variant="secondary" className="text-xs">Multi-selección</Badge>
              </div>
              
              <div className="grid gap-2">
                {MOCK_CLIENTS.map((client) => (
                  <div 
                    key={client.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer",
                      selectedClients.includes(client.id)
                        ? "bg-primary/10 border-primary/50"
                        : "bg-muted/20 border-border/30 hover:border-border/50"
                    )}
                    onClick={() => toggleClient(client.id)}
                  >
                    <Checkbox 
                      checked={selectedClients.includes(client.id)}
                      onCheckedChange={() => toggleClient(client.id)}
                      className="pointer-events-none"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{client.name}</p>
                      <p className="text-xs text-muted-foreground">{client.sector}</p>
                    </div>
                    {selectedClients.includes(client.id) && (
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    )}
                  </div>
                ))}
              </div>
              
              {selectedClients.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {selectedClients.length} cliente{selectedClients.length > 1 ? 's' : ''} seleccionado{selectedClients.length > 1 ? 's' : ''}
                </p>
              )}
            </div>

            <Separator className="bg-border/30" />

            {/* EDITORIAL SECTION - Expert Commentary */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <PenLine className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Comentario Experto
                </h3>
              </div>

              {/* Toggle between shared and personalized */}
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/20 border border-border/30">
                <div 
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer transition-colors",
                    useSharedCommentary ? "bg-primary text-primary-foreground" : "hover:bg-muted/50"
                  )}
                  onClick={() => setUseSharedCommentary(true)}
                >
                  <MessageSquarePlus className="h-4 w-4" />
                  <span className="text-sm font-medium">Compartido</span>
                </div>
                <div 
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer transition-colors",
                    !useSharedCommentary ? "bg-primary text-primary-foreground" : "hover:bg-muted/50"
                  )}
                  onClick={() => setUseSharedCommentary(false)}
                >
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">Por Cliente</span>
                </div>
              </div>

              {useSharedCommentary ? (
                <Textarea
                  placeholder="Agregar comentario experto compartido para todos los clientes..."
                  value={sharedCommentary}
                  onChange={(e) => setSharedCommentary(e.target.value)}
                  className="min-h-[120px] bg-muted/30 border-border/50 resize-none"
                />
              ) : (
                <div className="space-y-4">
                  {selectedClients.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">
                      Selecciona clientes arriba para agregar comentarios personalizados
                    </p>
                  ) : (
                    selectedClients.map(clientId => {
                      const client = MOCK_CLIENTS.find(c => c.id === clientId);
                      if (!client) return null;
                      return (
                        <div key={clientId} className="space-y-2">
                          <Label className="text-sm font-medium flex items-center gap-2">
                            <Building2 className="h-3.5 w-3.5" />
                            {client.name}
                          </Label>
                          <Textarea
                            placeholder={`Comentario personalizado para ${client.name}...`}
                            value={clientCommentaries[clientId] || ""}
                            onChange={(e) => updateClientCommentary(clientId, e.target.value)}
                            className="min-h-[80px] bg-muted/30 border-border/50 resize-none"
                          />
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            <Separator className="bg-border/30" />

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                className="w-full"
                onClick={handlePublish}
                disabled={selectedClients.length === 0}
              >
                <Send className="h-4 w-4 mr-2" />
                Publicar a {selectedClients.length > 0 ? `${selectedClients.length} Cliente${selectedClients.length > 1 ? 's' : ''}` : 'Cliente'}
              </Button>
              
              <Button
                variant="outline"
                className="w-full border-amber-500/50 text-amber-500 hover:bg-amber-500/10"
                onClick={handleDecline}
              >
                <Archive className="h-4 w-4 mr-2" />
                Declinar para Cliente
                <span className="ml-2 text-xs text-muted-foreground">(Auditoría interna)</span>
              </Button>
            </div>

            {/* Source Link */}
            {alert.source_url && (
              <Button
                variant="ghost"
                className="w-full text-muted-foreground hover:text-primary"
                asChild
              >
                <a href={alert.source_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver fuente original
                </a>
              </Button>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}