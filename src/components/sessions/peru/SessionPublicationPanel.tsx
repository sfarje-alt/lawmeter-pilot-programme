// Session Publication Panel - Batch publication workflow for pinned sessions

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
  Video,
  Brain,
  Calendar
} from "lucide-react";
import { PeruSession, SessionClientCommentary } from "@/types/peruSessions";
import { MOCK_CLIENTS } from "@/data/peruAlertsMockData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface SessionPublicationPanelProps {
  pinnedSessions: PeruSession[];
  selectedClientId: string | null;
  onClientChange: (clientId: string | null) => void;
  hasCommentaryForClient: (session: PeruSession, clientId: string) => boolean;
  onBatchPublish: (sessionIds: string[], clientIds: string[]) => void;
  onUnpinSession: (sessionId: string) => void;
  onOpenSession: (session: PeruSession) => void;
}

export function SessionPublicationPanel({
  pinnedSessions,
  selectedClientId,
  onClientChange,
  hasCommentaryForClient,
  onBatchPublish,
  onUnpinSession,
  onOpenSession,
}: SessionPublicationPanelProps) {
  const [selectedSessionIds, setSelectedSessionIds] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false);

  // Sessions with and without commentary for selected client
  const categorizedSessions = useMemo(() => {
    if (!selectedClientId) return { withCommentary: [], withoutCommentary: pinnedSessions };
    
    const withCommentary: PeruSession[] = [];
    const withoutCommentary: PeruSession[] = [];
    
    pinnedSessions.forEach(session => {
      if (hasCommentaryForClient(session, selectedClientId)) {
        withCommentary.push(session);
      } else {
        withoutCommentary.push(session);
      }
    });
    
    return { withCommentary, withoutCommentary };
  }, [pinnedSessions, selectedClientId, hasCommentaryForClient]);

  const toggleSessionSelection = (sessionId: string) => {
    setSelectedSessionIds(prev => {
      const next = new Set(prev);
      if (next.has(sessionId)) {
        next.delete(sessionId);
      } else {
        next.add(sessionId);
      }
      return next;
    });
  };

  const selectAllWithCommentary = () => {
    setSelectedSessionIds(new Set(categorizedSessions.withCommentary.map(s => s.id)));
  };

  const handlePublish = () => {
    if (selectedSessionIds.size === 0 || !selectedClientId) {
      toast.error("Selecciona al menos una sesión y un cliente");
      return;
    }
    
    onBatchPublish(Array.from(selectedSessionIds), [selectedClientId]);
    
    const clientName = MOCK_CLIENTS.find(c => c.id === selectedClientId)?.name || selectedClientId;
    toast.success(`${selectedSessionIds.size} sesión(es) publicada(s) a ${clientName}`);
    
    setSelectedSessionIds(new Set());
    setOpen(false);
  };

  const pinnedCount = pinnedSessions.length;
  const readyCount = categorizedSessions.withCommentary.length;
  const pendingCount = categorizedSessions.withoutCommentary.length;

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
                Panel de Publicación - Sesiones
              </SheetTitle>
            </SheetHeader>

            {pinnedCount === 0 ? (
              <div className="text-center py-12">
                <Pin className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No hay sesiones pineadas para publicar.
                </p>
                <p className="text-sm text-muted-foreground/60 mt-2">
                  Pinea sesiones desde la lista para agregarlas aquí.
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

                {/* Sessions List */}
                <div className="space-y-4">
                  {/* Ready sessions (with commentary) */}
                  {categorizedSessions.withCommentary.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-green-400 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          Listas para publicar ({categorizedSessions.withCommentary.length})
                        </h4>
                        <Button variant="ghost" size="sm" onClick={selectAllWithCommentary}>
                          Seleccionar todas
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {categorizedSessions.withCommentary.map((session) => (
                          <SessionItem 
                            key={session.id}
                            session={session}
                            selected={selectedSessionIds.has(session.id)}
                            onToggle={() => toggleSessionSelection(session.id)}
                            onUnpin={() => onUnpinSession(session.id)}
                            onOpen={() => onOpenSession(session)}
                            hasCommentary
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pending sessions (without commentary) */}
                  {categorizedSessions.withoutCommentary.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-amber-400 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Falta comentario experto ({categorizedSessions.withoutCommentary.length})
                      </h4>
                      <div className="space-y-2">
                        {categorizedSessions.withoutCommentary.map((session) => (
                          <SessionItem 
                            key={session.id}
                            session={session}
                            selected={selectedSessionIds.has(session.id)}
                            onToggle={() => toggleSessionSelection(session.id)}
                            onUnpin={() => onUnpinSession(session.id)}
                            onOpen={() => onOpenSession(session)}
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
                    disabled={selectedSessionIds.size === 0 || !selectedClientId}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Publicar {selectedSessionIds.size > 0 ? `${selectedSessionIds.size} Seleccionada(s)` : 'Seleccionadas'}
                  </Button>
                  
                  {selectedClientId && categorizedSessions.withCommentary.length > 0 && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        selectAllWithCommentary();
                        handlePublish();
                      }}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Publicar Todas las Listas ({categorizedSessions.withCommentary.length})
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

// Individual session item component
function SessionItem({ 
  session, 
  selected, 
  onToggle, 
  onUnpin,
  onOpen,
  hasCommentary 
}: { 
  session: PeruSession; 
  selected: boolean; 
  onToggle: () => void;
  onUnpin: () => void;
  onOpen: () => void;
  hasCommentary: boolean;
}) {
  const formattedDate = session.scheduled_at 
    ? format(new Date(session.scheduled_at), "dd MMM yyyy", { locale: es })
    : session.scheduled_date_text || '';
  
  const hasVideo = !!session.recording?.video_url;
  const hasAnalysis = session.recording?.analysis_status === 'COMPLETED';
  
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
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <Building2 className="h-3 w-3 text-blue-400" />
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
          {hasVideo && <Video className="h-3 w-3 text-green-400" />}
          {hasAnalysis && <Brain className="h-3 w-3 text-purple-400" />}
        </div>
        <p className="text-sm font-medium text-foreground line-clamp-2">
          Comisión de {session.commission_name}
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
        <div className="flex gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onOpen(); }}
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            Abrir
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onUnpin(); }}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            Quitar pin
          </button>
        </div>
      </div>
    </div>
  );
}