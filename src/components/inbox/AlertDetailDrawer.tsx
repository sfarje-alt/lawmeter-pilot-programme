import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
} from "lucide-react";
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
      setUrgency("medium");
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
                    <Badge variant="secondary" className="text-sm">
                      {alert.current_stage}
                    </Badge>
                  )}
                  {isArchived && archiveDaysRemaining !== null && (
                    <Badge variant="outline" className="text-sm gap-1 bg-muted/50 text-muted-foreground border-border/50">
                      <Archive className="h-3.5 w-3.5" />
                      Archivada · {archiveDaysRemaining}d restantes
                    </Badge>
                  )}
                </div>
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
