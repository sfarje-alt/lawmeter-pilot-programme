import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertFeedbackPopover } from "@/components/inbox/feedback/AlertFeedbackPopover";
import { normalizeEntityName } from "@/lib/entityNormalization";
import {
  ExternalLink,
  Calendar,
  User,
  Building2,
  FileText,
  Users,
  PenLine,
  Clock,
  Sparkles,
  AlertTriangle,
  Archive,
  ArchiveRestore,
  TrendingUp,
  History,
  CalendarClock,
  Link2,
  Bookmark,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  PeruAlert,
  getTypeLabel,
  getTypeColor,
  IMPACT_LEVELS,
  ImpactLevel,
  getArchiveDaysRemaining,
  getStateFamilyStyle,
} from "@/data/peruAlertsMockData";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { RichTextEditor, AttachedFile } from "./RichTextEditor";
import { useAlerts } from "@/contexts/AlertsContext";

interface AlertDetailDrawerProps {
  alert: PeruAlert | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateExpertCommentary?: (alertId: string, commentary: string) => void;
  onArchive?: (alertId: string) => void;
  onUnarchive?: (alertId: string) => void;
  onTogglePin?: (alertId: string) => void;
}

const URGENCY_OPTIONS = [
  { value: "low", label: "Baja" },
  { value: "medium", label: "Media" },
  { value: "high", label: "Alta" },
  { value: "critical", label: "Crítica" },
];

export function AlertDetailDrawer({
  alert,
  open,
  onOpenChange,
  onUpdateExpertCommentary,
  onArchive,
  onUnarchive,
  onTogglePin,
}: AlertDetailDrawerProps) {
  const { updateAttachments } = useAlerts();
  const [sharedCommentary, setSharedCommentary] = useState("");
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const [impact, setImpact] = useState<ImpactLevel | undefined>(undefined);
  const [urgency, setUrgency] = useState<string>("medium");
  const [tagsText, setTagsText] = useState("");

  useEffect(() => {
    if (alert) {
      setSharedCommentary(alert.expert_commentary || "");
      setAttachments((alert.attachments as AttachedFile[]) || []);
      setImpact(alert.impact_level);
      // Map urgency_category ("alta/media/baja") → drawer value ("high/medium/low")
      const uc = alert.urgency_category;
      setUrgency(uc === "alta" ? "high" : uc === "baja" ? "low" : "medium");
      setTagsText((alert.affected_areas || []).join(", "));
    }
  }, [alert?.id]);

  const handleAttachmentsChange = (files: AttachedFile[]) => {
    setAttachments(files);
    if (alert) updateAttachments(alert.id, files);
  };

  if (!alert) return null;

  const isBill = alert.legislation_type === "proyecto_de_ley";
  const isArchived = !!alert.archived_at;
  const archiveDaysRemaining = getArchiveDaysRemaining(alert.archived_at);

  const displayDate = isBill ? alert.stage_date || alert.project_date : alert.publication_date;
  const formattedDate = displayDate
    ? format(new Date(displayDate), "dd 'de' MMMM, yyyy", { locale: es })
    : format(new Date(alert.created_at), "dd 'de' MMMM, yyyy", { locale: es });

  const handleCommentaryChange = (commentary: string) => {
    setSharedCommentary(commentary);
    if (onUpdateExpertCommentary) {
      onUpdateExpertCommentary(alert.id, commentary);
    }
  };

  const handleArchiveToggle = () => {
    if (isArchived) {
      onUnarchive?.(alert.id);
    } else {
      onArchive?.(alert.id);
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl bg-card border-border/50 p-0">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            {/* Header */}
            <SheetHeader className="space-y-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={cn("text-sm", getTypeColor(alert.legislation_type))}>
                    {getTypeLabel(alert.legislation_type)}
                  </Badge>
                  {isBill && alert.current_stage && (
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-sm",
                        getStateFamilyStyle(alert.state_family ?? "comision"),
                      )}
                    >
                      {alert.current_stage}
                    </Badge>
                  )}
                  {!isBill && alert.entity && (
                    <Badge variant="outline" className="text-sm bg-emerald-500/15 text-emerald-400 border-emerald-500/35">
                      <Building2 className="h-3.5 w-3.5 mr-1" />
                      {normalizeEntityName(alert.entity)}
                    </Badge>
                  )}
                  {alert.reference_number && !isBill && (
                    <Badge variant="outline" className="text-sm font-mono">
                      {alert.reference_number}
                    </Badge>
                  )}
                  {isArchived && archiveDaysRemaining !== null && (
                    <Badge variant="outline" className="text-sm gap-1 bg-muted/50 text-muted-foreground border-border/50">
                      <Archive className="h-3.5 w-3.5" />
                      Archivada · {archiveDaysRemaining}d restantes
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <AlertFeedbackPopover alert={alert} />
                  {(onArchive || onUnarchive) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleArchiveToggle}
                      className="gap-1.5"
                    >
                      {isArchived ? (
                        <>
                          <ArchiveRestore className="h-3.5 w-3.5" />
                          Restaurar
                        </>
                      ) : (
                        <>
                          <Archive className="h-3.5 w-3.5" />
                          Archivar
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
              <SheetTitle className="text-left text-lg font-semibold leading-tight">
                {alert.legislation_title}
              </SheetTitle>
            </SheetHeader>

            {/* AI disclaimer */}
            <div className="flex items-start gap-2 rounded-lg border border-primary/30 bg-primary/10 p-3">
              <AlertTriangle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-primary-foreground/90 leading-relaxed [&]:text-foreground">
                Análisis generado por IA. Valida el contenido y ajusta los campos antes de tomar decisiones.
              </p>
            </div>

            <Separator className="bg-border/30" />

            {/* Metadata */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Información</h3>
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
                    <span className="text-foreground">{normalizeEntityName(alert.entity)}</span>
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
            </div>

            {/* Summary (normas) */}
            {!isBill && alert.legislation_summary && (
              <>
                <Separator className="bg-border/30" />
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Resumen</h3>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                    <p className="text-sm text-foreground leading-relaxed">{alert.legislation_summary}</p>
                  </div>
                </div>
              </>
            )}

            {/* Identified dates — flexible list, any role/quantity */}
            {alert.key_dates && alert.key_dates.length > 0 && (
              <>
                <Separator className="bg-border/30" />
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
              </>
            )}

            {/* Bill follow-up timeline (Congreso SPLEY) */}
            {isBill && Array.isArray(alert.seguimiento) && alert.seguimiento.length > 0 && (
              <>
                <Separator className="bg-border/30" />
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Historial de seguimiento
                    </h3>
                    <Badge variant="outline" className="text-[10px] bg-muted/40 border-border/40 text-muted-foreground">
                      {alert.seguimiento.length} {alert.seguimiento.length === 1 ? "evento" : "eventos"}
                    </Badge>
                  </div>
                  <ol className="relative border-l border-border/40 ml-2 space-y-4 pl-5">
                    {alert.seguimiento.map((ev, i) => {
                      const estado = String(ev.estado_procesal ?? "").trim();
                      const estadoLower = estado.toLowerCase();
                      const isApproved = /aprob|publicad|promulgad|autograf|ley\s*n/i.test(estado);
                      const isComision = /comisi|decretad|dictamen/i.test(estado);
                      const isRejected = /rechaz|archiv|retirad/i.test(estado);
                      const dotStyle = isApproved
                        ? "bg-emerald-500"
                        : isRejected
                          ? "bg-destructive"
                          : isComision
                            ? "bg-amber-500"
                            : "bg-blue-500";
                      const badgeStyle = isApproved
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/35"
                        : isRejected
                          ? "bg-destructive/15 text-destructive border-destructive/35"
                          : isComision
                            ? "bg-amber-500/15 text-amber-400 border-amber-500/35"
                            : "bg-blue-500/15 text-blue-400 border-blue-500/35";
                      let formattedDate = ev.fecha ?? "";
                      try {
                        if (ev.fecha) formattedDate = format(new Date(ev.fecha), "dd MMM yyyy", { locale: es });
                      } catch {
                        // keep raw
                      }
                      const adjuntos = Array.isArray(ev.adjuntos) ? ev.adjuntos.filter((a) => a?.url) : [];
                      return (
                        <li key={`${ev.fecha}-${i}`} className="relative">
                          <span
                            className={cn(
                              "absolute -left-[27px] top-1.5 h-3 w-3 rounded-full ring-2 ring-background",
                              dotStyle,
                            )}
                          />
                          <div className="rounded-md border border-border/30 bg-muted/20 px-3 py-2 space-y-1.5">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <span className="text-sm font-medium text-foreground">{formattedDate}</span>
                              {estado && (
                                <Badge variant="outline" className={cn("text-[10px] uppercase tracking-wide", badgeStyle)}>
                                  {estado}
                                </Badge>
                              )}
                            </div>
                            {ev.detalle && (
                              <p className="text-xs text-foreground/90 leading-relaxed">{ev.detalle}</p>
                            )}
                            {Array.isArray(ev.comision) && ev.comision.length > 0 && (
                              <p className="text-[11px] italic text-muted-foreground">
                                {ev.comision.join(" · ")}
                              </p>
                            )}
                            {adjuntos.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {adjuntos.map((a, j) => (
                                  <Button
                                    key={`${a.url}-${j}`}
                                    asChild
                                    size="sm"
                                    variant="outline"
                                    className="h-7 px-2 text-[11px] gap-1.5 bg-background/40 border-border/40"
                                  >
                                    <a href={a.url} target="_blank" rel="noopener noreferrer">
                                      <FileText className="h-3 w-3" />
                                      Descargar PDF
                                      <ExternalLink className="h-3 w-3 opacity-60" />
                                    </a>
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </>
            )}
            {alert.rationale && alert.rationale.length > 0 && (
              <>
                <Separator className="bg-border/30" />
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Racional del análisis IA
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
              </>
            )}

            {/* Source / fuente */}
            {alert.fuente && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Link2 className="h-3.5 w-3.5" />
                <span>Fuente: {alert.fuente}</span>
              </div>
            )}

            <Separator className="bg-border/30" />

            {/* Editable classification */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Clasificación interna
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Impacto</Label>
                  <Select value={impact} onValueChange={(v) => setImpact(v as ImpactLevel)}>
                    <SelectTrigger className="bg-muted/30 border-border/50">
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {IMPACT_LEVELS.map((lvl) => (
                        <SelectItem key={lvl.value} value={lvl.value}>
                          {lvl.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Urgencia</Label>
                  <Select value={urgency} onValueChange={setUrgency}>
                    <SelectTrigger className="bg-muted/30 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {URGENCY_OPTIONS.map((u) => (
                        <SelectItem key={u.value} value={u.value}>
                          {u.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-primary" />
                  Etiquetas (asignadas automáticamente por IA según el perfil)
                </Label>
                <Input
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                  placeholder="p. ej. Salud, Datos personales, Tributario"
                  className="bg-muted/30 border-border/50"
                />
                <p className="text-[11px] text-muted-foreground">
                  La IA sugiere etiquetas basadas en las etiquetas configuradas en el perfil. Puedes editarlas si necesitas ajustar.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tagsText
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .map((t, i) => (
                      <Badge key={`${t}-${i}`} variant="outline" className="bg-primary/10 border-primary/30 text-primary">
                        {t}
                      </Badge>
                    ))}
                </div>
              </div>
            </div>

            <Separator className="bg-border/30" />

            {/* Expert commentary — rich text + attachments */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <PenLine className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Comentario experto
                </h3>
              </div>
              <RichTextEditor
                value={sharedCommentary}
                onChange={handleCommentaryChange}
                attachments={attachments}
                onAttachmentsChange={handleAttachmentsChange}
                placeholder="Documenta el criterio interno: cómo afecta a la organización, supuestos, postura sugerida..."
              />
              <p className="text-[11px] text-muted-foreground">
                Este comentario reemplaza o complementa el análisis generado por IA. Se guarda automáticamente.
                Puedes usar formato (negrita, cursiva, listas) y adjuntar documentos de soporte.
              </p>
            </div>

            {/* Source */}
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
