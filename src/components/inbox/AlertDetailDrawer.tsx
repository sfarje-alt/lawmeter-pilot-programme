import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Clock
} from "lucide-react";
import { PeruAlert, getTypeLabel, getTypeColor } from "@/data/peruAlertsMockData";
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
