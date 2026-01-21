// Session Detail Drawer - Full editorial workflow for session review and publication

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  ExternalLink, 
  Calendar, 
  Building2, 
  Video,
  Users,
  PenLine,
  Send,
  CheckCircle2,
  MessageSquarePlus,
  Brain,
  Link2,
  RefreshCw,
  Sparkles
} from "lucide-react";
import { PeruSession, SessionClientCommentary, SessionAnalysis } from "@/types/peruSessions";
import { MOCK_CLIENTS } from "@/data/peruAlertsMockData";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { SessionQAPanel } from "./SessionQAPanel";
import { useSessionAnalysis } from "@/hooks/useSessionAnalysis";

interface SessionDetailDrawerProps {
  session: PeruSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPublish: (session: PeruSession, clientIds: string[], commentaries: SessionClientCommentary[]) => void;
  onUpdateExpertCommentary?: (sessionId: string, commentary: string) => void;
  onResolveVideo: (sessionId: string) => void;
  onSetManualUrl: (sessionId: string, url: string) => void;
  onUpdateRecording?: (sessionId: string, recordingUpdate: Partial<PeruSession['recording']>) => void;
}

export function SessionDetailDrawer({ 
  session, 
  open, 
  onOpenChange, 
  onPublish, 
  onUpdateExpertCommentary,
  onResolveVideo,
  onSetManualUrl,
  onUpdateRecording,
}: SessionDetailDrawerProps) {
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [clientCommentaries, setClientCommentaries] = useState<Record<string, string>>({});
  const [useSharedCommentary, setUseSharedCommentary] = useState(true);
  const [sharedCommentary, setSharedCommentary] = useState("");
  const [manualUrl, setManualUrl] = useState("");
  const [qaMode, setQaMode] = useState<'summary' | 'qa'>('summary');
  const { isAnalyzing, analyzeSession } = useSessionAnalysis();

  // Reset state when session changes
  useEffect(() => {
    if (session) {
      setSelectedClients([]);
      setClientCommentaries({});
      setSharedCommentary(session.expert_commentary || "");
      setUseSharedCommentary(true);
      setManualUrl("");
      setQaMode('summary');
    }
  }, [session?.id]);

  if (!session) return null;

  const analysis = session.recording?.analysis_result as SessionAnalysis | undefined;
  const analysisStatus = session.recording?.analysis_status;

  const formattedDate = session.scheduled_at 
    ? format(new Date(session.scheduled_at), "EEEE, d 'de' MMMM yyyy, HH:mm", { locale: es })
    : session.scheduled_date_text || 'Fecha no disponible';

  // Auto-save expert commentary when it changes
  const handleCommentaryChange = (commentary: string) => {
    setSharedCommentary(commentary);
    if (onUpdateExpertCommentary && session) {
      onUpdateExpertCommentary(session.id, commentary);
    }
  };

  const handlePublish = () => {
    if (selectedClients.length > 0) {
      const commentaries: SessionClientCommentary[] = selectedClients.map(clientId => ({
        clientId,
        commentary: useSharedCommentary ? sharedCommentary : (clientCommentaries[clientId] || "")
      }));
      onPublish(session, selectedClients, commentaries);
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

  const handleSetManualUrl = () => {
    if (manualUrl.trim()) {
      onSetManualUrl(session.id, manualUrl.trim());
      setManualUrl("");
    }
  };

  const handleAnalyze = async () => {
    if (!session.recording?.video_url) return;
    
    const result = await analyzeSession(
      session.id,
      session.recording.video_url,
      session.commission_name,
      session.session_title,
      session.scheduled_at
    );
    
    if (result && onUpdateRecording) {
      onUpdateRecording(session.id, {
        analysis_result: result,
        analysis_status: 'COMPLETED',
        analyzed_at: new Date().toISOString(),
        transcription_status: 'COMPLETED',
      });
    }
  };

  const hasVideo = !!session.recording?.video_url;
  const hasAnalysis = analysisStatus === 'COMPLETED';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl bg-card border-border/50 p-0">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            {/* Header */}
            <SheetHeader className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <Badge variant="outline" className="text-sm bg-blue-500/10 text-blue-600 border-blue-500/20">
                  <Building2 className="h-3 w-3 mr-1" />
                  Sesión de Comisión
                </Badge>
                {session.is_pinned_for_publication && (
                  <Badge className="bg-primary/20 text-primary">
                    📌 Pineada
                  </Badge>
                )}
              </div>
              <SheetTitle className="text-left text-lg font-semibold leading-tight">
                Comisión de {session.commission_name}
              </SheetTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="capitalize">{formattedDate}</span>
              </div>
            </SheetHeader>

            <Separator className="bg-border/30" />

            {/* Video Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <Video className="h-4 w-4" />
                Video de la Sesión
              </h3>
              
              {hasVideo ? (
                <div className="space-y-3">
                  <Button
                    className="w-full gap-2 bg-green-600 hover:bg-green-700"
                    onClick={() => window.open(session.recording!.video_url, '_blank')}
                  >
                    <Video className="h-4 w-4" />
                    Ver Video
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                  
                  {/* AI Analysis */}
                  {hasAnalysis ? (
                    <SessionQAPanel
                      session={session}
                      analysis={analysis || null}
                      transcription={session.recording?.transcription_text || null}
                      mode={qaMode}
                      onModeChange={setQaMode}
                    />
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || analysisStatus === 'PROCESSING'}
                    >
                      {isAnalyzing || analysisStatus === 'PROCESSING' ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Analizando...
                        </>
                      ) : (
                        <>
                          <Brain className="h-4 w-4" />
                          Ejecutar Análisis AI
                        </>
                      )}
                    </Button>
                  )}
                </div>
              ) : session.video_status === 'RESOLVING' ? (
                <div className="p-4 rounded-lg bg-muted/30 border border-border/30 text-center">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Buscando video...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => onResolveVideo(session.id)}
                  >
                    <Video className="h-4 w-4" />
                    Buscar Video Automáticamente
                  </Button>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="URL de YouTube..."
                      value={manualUrl}
                      onChange={(e) => setManualUrl(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={handleSetManualUrl}
                      disabled={!manualUrl.trim()}
                    >
                      <Link2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <Separator className="bg-border/30" />

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
                  onChange={(e) => handleCommentaryChange(e.target.value)}
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
            </div>

            {/* Source Links */}
            <div className="flex flex-wrap gap-2">
              {session.agenda_url && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary"
                  asChild
                >
                  <a href={session.agenda_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver Agenda
                  </a>
                </Button>
              )}
              {session.documents_url && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary"
                  asChild
                >
                  <a href={session.documents_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver Documentos
                  </a>
                </Button>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}