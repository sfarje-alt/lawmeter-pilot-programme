import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import {
  Bookmark,
  ExternalLink,
  Clock,
  User,
  Users,
  FileText,
  Tag,
  CheckCircle2,
  AlertCircle,
  Archive,
  ArchiveRestore,
  TrendingUp,
  Sparkles,
  CalendarClock,
  ArrowUpRight,
} from "lucide-react";
import { AlertFeedbackPopover } from "@/components/inbox/feedback/AlertFeedbackPopover";

import {
  PeruAlert,
  getTypeLabel,
  getTypeColor,
  getImpactLevelInfo,
  getArchiveDaysRemaining,
  getStateFamilyStyle,
  KeyDate,
} from "@/data/peruAlertsMockData";
import { format, isAfter, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface InboxAlertCardProps {
  alert: PeruAlert;
  onClick: () => void;
  onTogglePin?: (alertId: string) => void;
  onArchive?: (alertId: string) => void;
  onUnarchive?: (alertId: string) => void;
  isArchiveView?: boolean;
  /** Si es true, la card recibe un brillo sutil tipo "correo no abierto". */
  isUnread?: boolean;
}

function tryParse(s: string): Date | null {
  try {
    const d = parseISO(s);
    if (Number.isNaN(d.getTime())) return null;
    return d;
  } catch {
    return null;
  }
}

/** Returns next upcoming key date with role plazo / vigencia_inicio / sesion. */
function getUpcomingKeyDate(keyDates: KeyDate[] | undefined, excludeFechas: string[] = []): KeyDate | null {
  if (!keyDates || keyDates.length === 0) return null;
  const excludedRoles = ["presentacion", "presentación", "fecha_presentacion", "publicacion", "publicación"];
  const filtered = keyDates.filter((d) => {
    const role = String(d.rol ?? "").toLowerCase();
    if (excludedRoles.includes(role)) return false;
    if (excludeFechas.includes(d.fecha)) return false;
    return true;
  });
  if (filtered.length === 0) return null;
  const priorityRoles = ["plazo", "vigencia_inicio", "sesion"];
  const candidates = filtered.filter((d) => priorityRoles.includes(d.rol));
  const pool = candidates.length > 0 ? candidates : filtered;
  const now = new Date();
  const upcoming = pool
    .map((d) => ({ d, parsed: tryParse(d.fecha) }))
    .filter((x) => x.parsed && isAfter(x.parsed, now))
    .sort((a, b) => a.parsed!.getTime() - b.parsed!.getTime());
  if (upcoming.length > 0) return upcoming[0].d;
  return pool[0] ?? null;
}

/** Bar color by score (0-100) using HSL semantic tokens. */
function scoreBarColor(score: number): string {
  if (score >= 70) return "bg-[hsl(var(--destructive))]";
  if (score >= 40) return "bg-[hsl(var(--warning))]";
  return "bg-muted-foreground/60";
}

interface ScoreBarProps {
  label: string;
  score: number;
}
function ScoreBar({ label, score }: ScoreBarProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground w-14 shrink-0">
        {label}
      </span>
      <div className="flex-1 h-1.5 rounded-full bg-muted/40 overflow-hidden min-w-0">
        <div
          className={cn("h-full rounded-full transition-all", scoreBarColor(clamped))}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span className="text-[10px] font-mono tabular-nums text-foreground w-7 text-right shrink-0">
        {clamped}
      </span>
    </div>
  );
}

export function InboxAlertCard({
  alert,
  onClick,
  onTogglePin,
  onArchive,
  onUnarchive,
  isArchiveView,
  isUnread,
}: InboxAlertCardProps) {
  const isBill = alert.legislation_type === "proyecto_de_ley";
  const isPinned = alert.is_pinned_for_publication;
  const isArchived = !!alert.archived_at;
  const daysRemaining = getArchiveDaysRemaining(alert.archived_at);

  const hasCommentary = !!(alert.expert_commentary && alert.expert_commentary.trim());
  const hasAiScores =
    typeof alert.impacto_score === "number" || typeof alert.urgencia_score === "number";
  const excludeFechas = [alert.project_date, alert.stage_date, alert.publication_date].filter(
    (d): d is string => !!d,
  );
  const upcomingDate = getUpcomingKeyDate(alert.key_dates, excludeFechas);
  const firstRationale = alert.rationale && alert.rationale.length > 0 ? alert.rationale[0] : null;

  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTogglePin?.(alert.id);
  };

  const handleArchiveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isArchived) {
      onUnarchive?.(alert.id);
    } else {
      onArchive?.(alert.id);
    }
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (alert.source_url) {
      window.open(alert.source_url, "_blank");
    }
  };

  const formatDate = (dateStr: string | undefined | null) => {
    if (!dateStr) return null;
    try {
      return format(new Date(dateStr), "dd MMM yyyy", { locale: es });
    } catch {
      return dateStr;
    }
  };

  // Header identifier: codigo for PLs, reference_number for normas, fallback id.
  const idLabel = isBill
    ? alert.legislation_id
    : alert.reference_number || alert.legislation_id;

  return (
    <Card
      className={cn(
        "p-3 bg-card border-border/30 hover:bg-card/90 transition-all cursor-pointer group w-full min-w-0 max-w-full overflow-hidden",
        isArchived && "opacity-70 border-dashed"
      )}
      onClick={onClick}
    >
      {/* Header: Type + State badge + ID + Actions */}
      <div className="flex items-start justify-between gap-2 mb-2 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap min-w-0 flex-1">
          <Badge variant="outline" className={cn("text-xs", getTypeColor(alert.legislation_type))}>
            {getTypeLabel(alert.legislation_type)}
          </Badge>

          {/* Estado actual exacto con color por familia (PLs) */}
          {isBill && alert.current_stage && (
            <Badge
              variant="outline"
              className={cn(
                "text-xs gap-1",
                getStateFamilyStyle(alert.state_family ?? "comision"),
              )}
            >
              {alert.current_stage}
              {alert.is_state_change && <ArrowUpRight className="h-3 w-3" />}
            </Badge>
          )}

          {/* Norma: entity badge eliminado — ya está en el header del grupo */}

          {/* Impact level */}
          {alert.impact_level && (
            <Badge
              variant="outline"
              className={cn("text-xs", getImpactLevelInfo(alert.impact_level)?.color)}
            >
              {getImpactLevelInfo(alert.impact_level)?.label}
            </Badge>
          )}

          {idLabel && (
            <span className="text-xs text-primary font-mono font-medium truncate max-w-full">
              {idLabel}
            </span>
          )}

          {isArchived && daysRemaining !== null && (
            <Badge variant="outline" className="text-xs bg-muted/50 text-muted-foreground border-border/50">
              <Archive className="h-3 w-3 mr-1" />
              {daysRemaining}d restantes
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {isPinned && !isArchived && hasCommentary && (
            <Badge variant="secondary" className="text-xs bg-[hsl(var(--success)/0.18)] text-[hsl(var(--success))] border-[hsl(var(--success)/0.35)] py-0 px-1.5">
              <CheckCircle2 className="h-3 w-3" />
            </Badge>
          )}
          {alert.source_url && (
            <button
              onClick={handleLinkClick}
              className="p-1 hover:bg-white/10 rounded transition-colors"
              title="Ver documento original"
            >
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-primary" />
            </button>
          )}
          {!isArchived && onTogglePin && (
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handlePinClick}
                    className="p-1 rounded hover:bg-white/10 transition-colors"
                  >
                    <Bookmark
                      className={cn(
                        "h-3.5 w-3.5 transition-colors",
                        isPinned ? "fill-primary text-primary" : "text-muted-foreground"
                      )}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="text-xs">Evita el archivo automático a los 30 días.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {(onArchive || onUnarchive) && (
            <button
              onClick={handleArchiveClick}
              className="p-1 hover:bg-white/10 rounded transition-colors"
              title={isArchived ? "Restaurar del archivo" : "Archivar"}
            >
              {isArchived ? (
                <ArchiveRestore className="h-3.5 w-3.5 text-muted-foreground hover:text-primary" />
              ) : (
                <Archive className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
              )}
            </button>
          )}
          <AlertFeedbackPopover alert={alert} />
        </div>
      </div>

      {/* Title with Tooltip */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <h4 className="text-sm font-medium text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors cursor-default">
              {alert.legislation_title}
            </h4>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-sm">
            <p className="text-sm">{alert.legislation_title}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Bill-specific: Authors / Author + Parliamentary Group / Proponente */}
      {isBill && (alert.author || alert.parliamentary_group || (alert.autores && alert.autores.length) || alert.proponente) && (
        <div className="space-y-1 mb-2">
          {alert.autores && alert.autores.length > 0 ? (
            <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <User className="h-3 w-3 shrink-0 mt-0.5" />
              <span className="line-clamp-2">{alert.autores.join(", ")}</span>
            </div>
          ) : alert.author ? (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <User className="h-3 w-3 shrink-0" />
              <span className="truncate">{alert.author}</span>
            </div>
          ) : null}
          {(alert.parliamentary_group || alert.proponente) && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="h-3 w-3 shrink-0" />
              <span className="truncate">{alert.parliamentary_group || alert.proponente}</span>
            </div>
          )}
        </div>
      )}

      {/* Norma-specific: Sumilla / Summary */}
      {!isBill && alert.legislation_summary && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2 italic border-l-2 border-emerald-500/40 pl-2 cursor-default">
                {alert.legislation_summary}
              </p>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-md">
              <p className="text-xs">{alert.legislation_summary}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* AI scores: Impact & Urgency bars */}
      {hasAiScores && (
        <div className="space-y-1 mb-2 rounded-md bg-muted/20 px-2 py-1.5 border border-border/20">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wide">
            <Sparkles className="h-2.5 w-2.5" />
            <span>Análisis IA</span>
          </div>
          {typeof alert.impacto_score === "number" && (
            <ScoreBar label="Impacto" score={alert.impacto_score} />
          )}
          {typeof alert.urgencia_score === "number" && (
            <ScoreBar label="Urgencia" score={alert.urgencia_score} />
          )}
        </div>
      )}

      {/* AI rationale (first bullet) */}
      {firstRationale && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-start gap-1.5 text-xs text-muted-foreground line-clamp-2 mb-2 cursor-default">
                <TrendingUp className="h-3 w-3 mt-0.5 shrink-0 text-primary/70" />
                <span className="line-clamp-2">{firstRationale}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-md">
              <ul className="text-xs list-disc pl-4 space-y-0.5">
                {alert.rationale!.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Bill-specific: Expert Commentary preview */}
      {isBill && alert.expert_commentary && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="text-xs text-muted-foreground line-clamp-2 mb-2 italic border-l-2 border-primary/30 pl-2 cursor-default [&>*]:inline"
                dangerouslySetInnerHTML={{ __html: alert.expert_commentary }}
              />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-md">
              <div
                className="text-xs"
                dangerouslySetInnerHTML={{ __html: alert.expert_commentary }}
              />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Area Tags */}
      {alert.affected_areas.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap mb-2">
          <Tag className="h-3 w-3 text-muted-foreground" />
          {alert.affected_areas.slice(0, 2).map((area) => (
            <Badge key={area} variant="secondary" className="text-xs bg-muted/50 py-0">
              {area}
            </Badge>
          ))}
          {alert.affected_areas.length > 2 && (
            <Badge variant="secondary" className="text-xs bg-muted/50 py-0">
              +{alert.affected_areas.length - 2}
            </Badge>
          )}
        </div>
      )}

      {/* Footer: Dates */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2 border-t border-border/30 flex-wrap">
        {isBill ? (
          <>
            {alert.project_date && (
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                <span className="text-muted-foreground/80">Presentación:</span>
                <span>{formatDate(alert.project_date)}</span>
              </div>
            )}
            {alert.stage_date && alert.stage_date !== alert.project_date && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span className="text-muted-foreground/80">Último estado:</span>
                <span>{formatDate(alert.stage_date)}</span>
              </div>
            )}
          </>
        ) : (
          alert.publication_date && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span className="text-muted-foreground/80">Publicación:</span>
              <span>{formatDate(alert.publication_date)}</span>
            </div>
          )
        )}

        {/* Upcoming key date chip */}
        {upcomingDate && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-[hsl(var(--warning))] cursor-default">
                  <CalendarClock className="h-3 w-3" />
                  <span className="capitalize">{upcomingDate.rol.replace(/_/g, " ")}:</span>
                  <span>{formatDate(upcomingDate.fecha)}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-xs">
                  <span className="font-medium capitalize">{upcomingDate.rol.replace(/_/g, " ")}</span>
                  {upcomingDate.contexto ? ` — ${upcomingDate.contexto}` : ""}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {isArchived && alert.archived_at && (
          <div className="flex items-center gap-1 ml-auto">
            <Archive className="h-3 w-3" />
            <span>Archivada {formatDate(alert.archived_at)}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
