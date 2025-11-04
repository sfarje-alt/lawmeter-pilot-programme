import { Alert, Comment } from "@/types/legislation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { AlertTriangle, Copy, ChevronDown, Trash2, Tag } from "lucide-react";
import { formatDate, isUpcomingDeadline } from "@/lib/dateUtils";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface AlertActDrawerProps {
  alert: Alert | null;
  isOpen: boolean;
  onClose: () => void;
  comments: Comment[];
  onAddComment: (visibility: "TEAM" | "PRIVATE", body: string) => void;
  onDeleteComment: (commentId: string) => void;
}

export function AlertActDrawer({
  alert,
  isOpen,
  onClose,
  comments,
  onAddComment,
  onDeleteComment,
}: AlertActDrawerProps) {
  const [teamComment, setTeamComment] = useState("");
  const [privateComment, setPrivateComment] = useState("");
  const { toast } = useToast();

  if (!alert) return null;

  const hasDeadline = alert.AI_triage?.deadline_detected && 
    isUpcomingDeadline(alert.AI_triage.deadline_detected);

  const teamComments = comments.filter((c) => c.visibility === "TEAM");
  const privateComments = comments.filter((c) => c.visibility === "PRIVATE");

  const handleCopyLink = () => {
    if (alert.link) {
      navigator.clipboard.writeText(alert.link);
      toast({ title: "Enlace copiado al portapapeles" });
    }
  };

  const handleCopySummary = () => {
    const text = alert.AI_triage?.summary || "";
    navigator.clipboard.writeText(text);
    toast({ title: "Resumen copiado al portapapeles" });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl">
            {alert.title || alert.law_number}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Legislative alert details
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {hasDeadline && (
            <div className="bg-warning/10 border border-warning rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <div>
                  <p className="font-semibold text-warning">Plazo Próximo</p>
                  <p className="text-sm text-muted-foreground">
                    {alert.AI_triage.deadline_detected}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {alert.AI_triage?.change_type?.map((type, idx) => (
              <Badge key={idx} variant="secondary">{type}</Badge>
            ))}
            {alert.AI_triage?.legal_stage && (
              <Badge variant="outline">{alert.AI_triage.legal_stage}</Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Fecha de Publicación</p>
              <p className="font-medium">{formatDate(alert.publication_date)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rige a partir de</p>
              <p className="font-medium">{formatDate(alert.effective_date)}</p>
            </div>
          </div>

          {alert.issuing_entity && (
            <div>
              <p className="text-sm text-muted-foreground">Ente Emisor</p>
              <p className="font-medium mt-1">{alert.issuing_entity}</p>
            </div>
          )}

          <div>
            <p className="text-sm text-muted-foreground mb-2">Resumen</p>
            <p className="text-sm">{alert.AI_triage?.summary}</p>
          </div>

          {alert.AI_triage?.alert_bullets && alert.AI_triage.alert_bullets.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Puntos Clave</p>
              <ul className="space-y-2">
                {alert.AI_triage.alert_bullets.map((bullet, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-sm">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Ministry Keyword Matches */}
          {alert.ministry_matches && alert.ministry_matches.length > 0 && alert.ministry && (
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                <Tag className="h-4 w-4" />
                Palabras Clave Detectadas ({alert.ministry})
              </div>
              <div className="flex flex-wrap gap-2">
                {alert.ministry_matches
                  .filter(match => match.portfolio === alert.ministry)
                  .map((match, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {match.pattern}
                    </Badge>
                  ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopyLink}>
              <Copy className="h-3 w-3 mr-2" />
              Copiar Enlace
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopySummary}>
              <Copy className="h-3 w-3 mr-2" />
              Copiar Resumen
            </Button>
          </div>

          {/* Full Text */}
          {alert.text && (
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full">
                  Texto Completo de la Norma
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <ScrollArea className="h-[400px] rounded-md border">
                  <div className="p-4">
                    <pre className="text-xs whitespace-pre-wrap font-mono">{alert.text}</pre>
                  </div>
                </ScrollArea>
              </CollapsibleContent>
            </Collapsible>
          )}

          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full">
                Razones de IA
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="bg-muted/50 rounded-lg p-4">
                <ul className="space-y-1 text-sm">
                  {alert.AI_triage?.reasons?.map((reason, idx) => (
                    <li key={idx}>• {reason}</li>
                  ))}
                </ul>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div>
            <h4 className="font-semibold mb-3">Enlaces</h4>
            <div className="space-y-2">
              {alert.link && (
                <Button variant="outline" className="w-full" asChild>
                  <a href={alert.link} target="_blank" rel="noopener noreferrer">
                    Ver en SINALEVI
                  </a>
                </Button>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Comentarios</h4>
            <Tabs defaultValue="team">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="team">Equipo ({teamComments.length})</TabsTrigger>
                <TabsTrigger value="private">Privado ({privateComments.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="team" className="space-y-3">
                <div className="space-y-2">
                  {teamComments.map((comment) => (
                    <div key={comment.id} className="bg-muted/50 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-medium text-sm">{comment.userName}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => onDeleteComment(comment.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm">{comment.body}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Textarea
                    placeholder="Agregar comentario del equipo..."
                    value={teamComment}
                    onChange={(e) => setTeamComment(e.target.value)}
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      if (teamComment.trim()) {
                        onAddComment("TEAM", teamComment);
                        setTeamComment("");
                      }
                    }}
                  >
                    Agregar Comentario del Equipo
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="private" className="space-y-3">
                <div className="space-y-2">
                  {privateComments.map((comment) => (
                    <div key={comment.id} className="bg-muted/50 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-medium text-sm">{comment.userName}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => onDeleteComment(comment.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm">{comment.body}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Textarea
                    placeholder="Agregar comentario privado..."
                    value={privateComment}
                    onChange={(e) => setPrivateComment(e.target.value)}
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      if (privateComment.trim()) {
                        onAddComment("PRIVATE", privateComment);
                        setPrivateComment("");
                      }
                    }}
                  >
                    Agregar Comentario Privado
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
