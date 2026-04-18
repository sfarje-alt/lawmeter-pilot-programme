import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Pin, ExternalLink, Clock, Building2, User, Users, FileText, Tag, CheckCircle2, AlertCircle, Archive, ArchiveRestore } from "lucide-react";
import {
  PeruAlert,
  getTypeLabel,
  getTypeColor,
  getImpactLevelInfo,
  getArchiveDaysRemaining,
} from "@/data/peruAlertsMockData";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface InboxAlertCardProps {
  alert: PeruAlert;
  onClick: () => void;
  onTogglePin?: (alertId: string) => void;
  onArchive?: (alertId: string) => void;
  onUnarchive?: (alertId: string) => void;
  isArchiveView?: boolean;
}

export function InboxAlertCard({
  alert,
  onClick,
  onTogglePin,
  onArchive,
  onUnarchive,
  isArchiveView,
}: InboxAlertCardProps) {
  const isBill = alert.legislation_type === "proyecto_de_ley";
  const isPinned = alert.is_pinned_for_publication;
  const isArchived = !!alert.archived_at;
  const daysRemaining = getArchiveDaysRemaining(alert.archived_at);

  // Single-profile commentary indicator
  const hasCommentary = !!(alert.expert_commentary && alert.expert_commentary.trim());

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

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return null;
    try {
      return format(new Date(dateStr), "dd MMM yyyy", { locale: es });
    } catch {
      return dateStr;
    }
  };

  return (
    <Card
      className={cn(
        "p-3 bg-card border-border/30 hover:bg-card/90 transition-all cursor-pointer group w-full max-w-full min-w-0 overflow-hidden",
        isPinned && !isArchived && "border-l-4 border-l-primary",
        isArchived && "opacity-70 border-dashed"
      )}
      onClick={onClick}
    >
      {/* Header: Actions row (always contained) */}
      <div className="flex items-center justify-end gap-1 mb-2 -mt-1 -mr-1">
        {/* Commentary Status Badge (only when pinned) */}
        {isPinned && !isArchived && (
          hasCommentary ? (
            <Badge variant="secondary" className="text-xs bg-[hsl(var(--success)/0.18)] text-[hsl(var(--success))] border-[hsl(var(--success)/0.35)] py-0 px-1.5 shrink-0">
              <CheckCircle2 className="h-3 w-3" />
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs bg-[hsl(var(--warning)/0.18)] text-[hsl(var(--warning))] border-[hsl(var(--warning)/0.35)] py-0 px-1.5 shrink-0">
              <AlertCircle className="h-3 w-3" />
            </Badge>
          )
        )}
        {alert.source_url && (
          <button
            onClick={handleLinkClick}
            className="p-1 hover:bg-white/10 rounded transition-colors shrink-0"
            title="Ver documento original"
          >
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-primary" />
          </button>
        )}
        {!isArchived && onTogglePin && (
          <button
            onClick={handlePinClick}
            className={cn(
              "p-1 rounded transition-colors shrink-0",
              isPinned
                ? "bg-primary/20 hover:bg-primary/30"
                : "hover:bg-white/10"
            )}
            title={isPinned ? "Quitar fijación" : "Fijar arriba"}
          >
            <Pin
              className={cn(
                "h-3.5 w-3.5 transition-colors",
                isPinned ? "fill-primary text-primary" : "text-muted-foreground"
              )}
            />
          </button>
        )}
        {(onArchive || onUnarchive) && (
          <button
            onClick={handleArchiveClick}
            className="p-1 hover:bg-white/10 rounded transition-colors shrink-0"
            title={isArchived ? "Restaurar del archivo" : "Archivar"}
          >
            {isArchived ? (
              <ArchiveRestore className="h-3.5 w-3.5 text-muted-foreground hover:text-primary" />
            ) : (
              <Archive className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
            )}
          </button>
        )}
      </div>

      {/* Badges row: wraps freely, never collides with actions */}
      <div className="flex items-center gap-1.5 flex-wrap min-w-0 mb-2">
        <Badge variant="outline" className={cn("text-xs max-w-full truncate", getTypeColor(alert.legislation_type))}>
          {getTypeLabel(alert.legislation_type)}
        </Badge>
        {alert.impact_level && (
          <Badge
            variant="outline"
            className={cn("text-xs max-w-full truncate", getImpactLevelInfo(alert.impact_level)?.color)}
          >
            {getImpactLevelInfo(alert.impact_level)?.label}
          </Badge>
        )}
        {isBill && alert.legislation_id && (
          <span className="text-xs text-primary font-mono font-medium truncate max-w-full">
            {alert.legislation_id}
          </span>
        )}
        {isArchived && daysRemaining !== null && (
          <Badge variant="outline" className="text-xs bg-muted/50 text-muted-foreground border-border/50">
            <Archive className="h-3 w-3 mr-1" />
            {daysRemaining}d restantes
          </Badge>
        )}
      </div>

      {/* Hidden legacy wrapper to keep diff minimal */}
      <div className="hidden">
        <div className="flex items-center gap-1 shrink-0">
          {/* Commentary Status Badge (only when pinned) */}
          {isPinned && !isArchived && (
            hasCommentary ? (
              <Badge variant="secondary" className="text-xs bg-[hsl(var(--success)/0.18)] text-[hsl(var(--success))] border-[hsl(var(--success)/0.35)] py-0 px-1.5">
                <CheckCircle2 className="h-3 w-3" />
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs bg-[hsl(var(--warning)/0.18)] text-[hsl(var(--warning))] border-[hsl(var(--warning)/0.35)] py-0 px-1.5">
                <AlertCircle className="h-3 w-3" />
              </Badge>
            )
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
            <button
              onClick={handlePinClick}
              className={cn(
                "p-1 rounded transition-colors",
                isPinned
                  ? "bg-primary/20 hover:bg-primary/30"
                  : "hover:bg-white/10"
              )}
              title={isPinned ? "Quitar fijación" : "Fijar arriba"}
            >
              <Pin
                className={cn(
                  "h-3.5 w-3.5 transition-colors",
                  isPinned ? "fill-primary text-primary" : "text-muted-foreground"
                )}
              />
            </button>
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

      {/* Bill-specific: Author + Parliamentary Group */}
      {isBill && (
        <div className="space-y-1 mb-2">
          {alert.author && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <User className="h-3 w-3 shrink-0" />
              <span className="truncate">{alert.author}</span>
            </div>
          )}
          {alert.parliamentary_group && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="h-3 w-3 shrink-0" />
              <span className="truncate">{alert.parliamentary_group}</span>
            </div>
          )}
        </div>
      )}

      {/* Norma-specific: Entity */}
      {!isBill && alert.entity && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
          <Building2 className="h-3 w-3 shrink-0" />
          <span className="font-medium">{alert.entity}</span>
        </div>
      )}

      {/* Bill-specific: Current Stage */}
      {isBill && alert.current_stage && (
        <div className="mb-2">
          <Badge variant="secondary" className="text-xs bg-muted/50">
            {alert.current_stage}
          </Badge>
        </div>
      )}

      {/* Norma-specific: Summary/Commentary (truncated) */}
      {!isBill && alert.legislation_summary && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2 italic border-l-2 border-primary/30 pl-2 cursor-default">
                {alert.legislation_summary}
              </p>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-md">
              <p className="text-xs">{alert.legislation_summary}</p>
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
                className="text-xs text-muted-foreground line-clamp-2 mb-2 italic border-l-2 border-primary/30 pl-2 cursor-default break-words [&>*]:inline"
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

      {/* Footer: Dates */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2 border-t border-border/30">
        {isBill ? (
          <>
            {alert.project_date && (
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                <span>{formatDate(alert.project_date)}</span>
              </div>
            )}
            {alert.stage_date && alert.stage_date !== alert.project_date && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatDate(alert.stage_date)}</span>
              </div>
            )}
          </>
        ) : (
          alert.publication_date && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatDate(alert.publication_date)}</span>
            </div>
          )
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
