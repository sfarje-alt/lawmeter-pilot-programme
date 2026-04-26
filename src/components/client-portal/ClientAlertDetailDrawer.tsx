import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ExternalLink,
  Calendar,
  User,
  Building2,
  FileText,
  Users,
  Clock,
  Eye,
  Lightbulb,
  CalendarClock,
  TrendingUp,
  Link2,
} from "lucide-react";
import { PeruAlert, getTypeLabel, getTypeColor } from "@/data/peruAlertsMockData";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { AlertFeedbackPopover } from "@/components/inbox/feedback/AlertFeedbackPopover";

interface ClientAlertDetailDrawerProps {
  alert: PeruAlert | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
}

export function ClientAlertDetailDrawer({ alert, open, onOpenChange, clientId }: ClientAlertDetailDrawerProps) {
  if (!alert) return null;

  const isBill = alert.legislation_type === "proyecto_de_ley";
  
  // Get display date based on type
  const displayDate = isBill 
    ? alert.stage_date || alert.project_date 
    : alert.publication_date;
  
  const formattedDate = displayDate 
    ? format(new Date(displayDate), "dd 'de' MMMM, yyyy", { locale: es })
    : format(new Date(alert.created_at), "dd 'de' MMMM, yyyy", { locale: es });

  // Get client-specific or shared commentary
  const clientCommentary = alert.client_commentaries?.find(c => c.clientId === clientId);
  const commentary = clientCommentary?.commentary || alert.expert_commentary;

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
                <div className="flex items-center gap-2">
                  {isBill && alert.current_stage && (
                    <Badge variant="secondary" className="text-sm">
                      {alert.current_stage}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-sm bg-green-500/10 border-green-500/30 text-green-500">
                    <Eye className="h-3 w-3 mr-1" />
                    Solo Lectura
                  </Badge>
                  <AlertFeedbackPopover alert={alert} clientId={clientId} />
                </div>
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

                {isBill && (alert.autores && alert.autores.length > 0 ? (
                  <div className="flex items-start gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span className="text-muted-foreground shrink-0">Autores:</span>
                    <span className="text-foreground">{alert.autores.join(", ")}</span>
                  </div>
                ) : alert.author ? (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Autor:</span>
                    <span className="text-foreground">{alert.author}</span>
                  </div>
                ) : null)}
                {isBill && alert.proponente && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Proponente:</span>
                    <span className="text-foreground">{alert.proponente}</span>
                  </div>
                )}

                {!isBill && alert.entity && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Entidad:</span>
                    <span className="text-foreground">{alert.entity}</span>
                  </div>
                )}

                {isBill ? (
                  <>
                    {alert.project_date && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Fecha de presentación:</span>
                        <span className="text-foreground">
                          {format(new Date(alert.project_date), "dd 'de' MMMM, yyyy", { locale: es })}
                        </span>
                      </div>
                    )}
                    {alert.stage_date && alert.stage_date !== alert.project_date && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Fecha último estado:</span>
                        <span className="text-foreground">
                          {format(new Date(alert.stage_date), "dd 'de' MMMM, yyyy", { locale: es })}
                        </span>
                      </div>
                    )}
                    {!alert.project_date && !alert.stage_date && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Fecha:</span>
                        <span className="text-foreground">{formattedDate}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Fecha de publicación:</span>
                    <span className="text-foreground">{formattedDate}</span>
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

            {/* Identified dates — flexible list */}
            {alert.key_dates && alert.key_dates.length > 0 && (
              <>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Fechas identificadas
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {alert.key_dates.map((kd, i) => {
                      const role = String(kd.rol ?? "").toLowerCase();
                      const isPub = ["publicacion", "publicación", "published", "publication"].includes(role);
                      const isPlazo = ["plazo", "vencimiento", "deadline"].includes(role);
                      const isVig = role.startsWith("vigencia") || role === "entrada_vigor";
                      const roleStyle = isPub
                        ? "bg-blue-500/15 text-blue-400 border-blue-500/35"
                        : isPlazo
                          ? "bg-orange-500/15 text-orange-400 border-orange-500/35"
                          : isVig
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/35"
                            : "bg-muted/40 text-muted-foreground border-border/40";
                      let formatted = kd.fecha;
                      try {
                        formatted = format(new Date(kd.fecha), "dd MMM yyyy", { locale: es });
                      } catch {
                        // keep raw
                      }
                      const isFuture = (() => {
                        try {
                          return new Date(kd.fecha).getTime() > Date.now();
                        } catch {
                          return false;
                        }
                      })();
                      return (
                        <li
                          key={`${kd.fecha}-${kd.rol}-${i}`}
                          className="flex items-start gap-3 rounded-md border border-border/30 bg-muted/20 px-3 py-2"
                        >
                          <Badge variant="outline" className={cn("text-[10px] uppercase tracking-wide shrink-0", roleStyle)}>
                            {kd.rol}
                          </Badge>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                              {formatted}
                              {isFuture && (isPlazo || isVig) && (
                                <Clock className="h-3 w-3 text-[hsl(var(--warning))]" />
                              )}
                            </div>
                            {kd.contexto && (
                              <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                                {kd.contexto}
                              </p>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <Separator className="bg-border/30" />
              </>
            )}

            {/* AI rationale */}
            {alert.rationale && alert.rationale.length > 0 && (
              <>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Racional del análisis
                    </h3>
                  </div>
                  <ul className="space-y-2 list-disc pl-5">
                    {alert.rationale.map((r, i) => (
                      <li key={i} className="text-sm text-foreground leading-relaxed">
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
                <Separator className="bg-border/30" />
              </>
            )}

            {alert.fuente && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Link2 className="h-3.5 w-3.5" />
                <span>Fuente: {alert.fuente}</span>
              </div>
            )}

            {/* Expert Commentary (Read-Only) */}
            {commentary && (
              <>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Comentario Experto
                    </h3>
                  </div>
                  <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                      {commentary}
                    </p>
                  </div>
                </div>
                <Separator className="bg-border/30" />
              </>
            )}

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
