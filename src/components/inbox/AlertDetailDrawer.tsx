import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ExternalLink, 
  AlertCircle, 
  Calendar, 
  User, 
  Building2, 
  FileText,
  Sparkles,
  PenLine,
  X,
  Send,
  Archive,
  Clock
} from "lucide-react";
import { PeruAlert, getTypeLabel, getTypeColor, getRiskColor, getRiskBgColor } from "@/data/peruAlertsMockData";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface AlertDetailDrawerProps {
  alert: PeruAlert | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDecline: (alert: PeruAlert) => void;
  onPublish: (alert: PeruAlert, clientId: string) => void;
}

export function AlertDetailDrawer({ alert, open, onOpenChange, onDecline, onPublish }: AlertDetailDrawerProps) {
  const [commentary, setCommentary] = useState(alert?.expert_commentary || "");
  const [selectedClient, setSelectedClient] = useState<string>("");

  if (!alert) return null;

  const displayDate = alert.ai_analysis.publication_date || alert.ai_analysis.stage_date || alert.created_at;
  const formattedDate = format(new Date(displayDate), "dd 'de' MMMM, yyyy", { locale: es });

  const handleDecline = () => {
    onDecline(alert);
    onOpenChange(false);
  };

  const handlePublish = () => {
    if (selectedClient) {
      onPublish(alert, selectedClient);
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl bg-card border-border/50 p-0">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            {/* Header */}
            <SheetHeader className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <Badge variant="outline" className={cn("text-sm", getTypeColor(alert.legislation_type))}>
                  {getTypeLabel(alert.legislation_type)}
                </Badge>
                <Badge variant="outline" className={cn("text-sm", getRiskBgColor(alert.risk_level))}>
                  <AlertCircle className={cn("h-3.5 w-3.5 mr-1.5", getRiskColor(alert.risk_level))} />
                  Riesgo {alert.risk_level === "high" ? "Alto" : alert.risk_level === "medium" ? "Medio" : "Bajo"}
                </Badge>
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
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">ID:</span>
                  <span className="text-foreground font-medium">{alert.legislation_id}</span>
                </div>

                {alert.ai_analysis.author && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Autor:</span>
                    <span className="text-foreground">{alert.ai_analysis.author}</span>
                  </div>
                )}

                {alert.ai_analysis.parliamentary_group && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Grupo:</span>
                    <span className="text-foreground">{alert.ai_analysis.parliamentary_group}</span>
                  </div>
                )}

                {alert.ai_analysis.entity && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Entidad:</span>
                    <span className="text-foreground">{alert.ai_analysis.entity}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Fecha:</span>
                  <span className="text-foreground">{formattedDate}</span>
                </div>

                {alert.ai_analysis.current_stage && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Estado:</span>
                    <Badge variant="secondary" className="text-xs">
                      {alert.ai_analysis.current_stage}
                    </Badge>
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

              {/* Deadline */}
              {alert.deadline && (
                <div className="p-3 rounded-lg bg-warning/10 border border-warning/30">
                  <div className="flex items-center gap-2 text-warning">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Fecha límite: {format(new Date(alert.deadline), "dd 'de' MMMM, yyyy", { locale: es })}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <Separator className="bg-border/30" />

            {/* AI Summary Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Resumen AI
                </h3>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                <p className="text-sm text-foreground leading-relaxed">
                  {alert.ai_analysis.summary || alert.legislation_summary || "Sin resumen disponible."}
                </p>
              </div>
            </div>

            <Separator className="bg-border/30" />

            {/* Expert Commentary Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <PenLine className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Comentario Experto
                </h3>
              </div>
              <Textarea
                placeholder="Agregar comentario experto..."
                value={commentary}
                onChange={(e) => setCommentary(e.target.value)}
                className="min-h-[120px] bg-muted/30 border-border/50 resize-none"
              />
            </div>

            <Separator className="bg-border/30" />

            {/* Client Assignment */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Asignar a Cliente
              </h3>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger className="bg-muted/30 border-border/50">
                  <SelectValue placeholder="Seleccionar cliente..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client-001">Clínica Ricardo Palma</SelectItem>
                  <SelectItem value="client-002">Laboratorios Bagó</SelectItem>
                  <SelectItem value="client-003">Oncosalud</SelectItem>
                  <SelectItem value="client-004">EsSalud</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-border/30" />

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-destructive/50 text-destructive hover:bg-destructive/10"
                onClick={handleDecline}
              >
                <Archive className="h-4 w-4 mr-2" />
                Declinar
              </Button>
              <Button
                className="flex-1"
                onClick={handlePublish}
                disabled={!selectedClient}
              >
                <Send className="h-4 w-4 mr-2" />
                Publicar a Cliente
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
