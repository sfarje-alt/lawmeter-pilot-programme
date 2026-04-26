import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ExternalLink, Clock, Building2, User, Users, FileText, Tag, Briefcase, Eye } from "lucide-react";
import { PeruAlert, getTypeLabel, getTypeColor, getImpactLevelInfo, MOCK_CLIENTS } from "@/data/peruAlertsMockData";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { AlertFeedbackPopover } from "@/components/inbox/feedback/AlertFeedbackPopover";
import { normalizeEntityName } from "@/lib/entityNormalization";

interface ClientAlertCardProps {
  alert: PeruAlert;
  onClick: () => void;
  clientId: string;
}

export function ClientAlertCard({ alert, onClick, clientId }: ClientAlertCardProps) {
  const isBill = alert.legislation_type === "proyecto_de_ley";

  // Get client-specific or shared commentary
  const clientCommentary = alert.client_commentaries?.find(c => c.clientId === clientId);
  const commentary = clientCommentary?.commentary || alert.expert_commentary;

  // Get primary client name
  const primaryClient = alert.primary_client_id 
    ? MOCK_CLIENTS.find(c => c.id === alert.primary_client_id)
    : null;

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (alert.source_url) {
      window.open(alert.source_url, "_blank");
    }
  };

  // Format dates
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
        "p-3 bg-card/50 border-border/30 hover:bg-card/80 transition-all cursor-pointer group"
      )}
      onClick={onClick}
    >
      {/* Header: Type Badge + Impact + ID + Actions */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className={cn("text-xs", getTypeColor(alert.legislation_type))}>
            {getTypeLabel(alert.legislation_type)}
          </Badge>
          {/* Impact Level Badge */}
          {alert.impact_level && (
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs",
                getImpactLevelInfo(alert.impact_level)?.color
              )}
            >
              {getImpactLevelInfo(alert.impact_level)?.label}
            </Badge>
          )}
          {isBill && alert.legislation_id && (
            <span className="text-xs text-primary font-mono font-medium">
              {alert.legislation_id}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {alert.source_url && (
            <button
              onClick={handleLinkClick}
              className="p-1 hover:bg-white/10 rounded transition-colors"
              title="Ver documento original"
            >
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-primary" />
            </button>
          )}
          <AlertFeedbackPopover alert={alert} clientId={clientId} />
        </div>
      </div>

      {/* Title */}
      <h4 className="text-sm font-medium text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
        {alert.legislation_title}
      </h4>

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
          <span className="font-medium">{normalizeEntityName(alert.entity)}</span>
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
        <p className="text-xs text-muted-foreground line-clamp-2 mb-2 italic border-l-2 border-primary/30 pl-2">
          {alert.legislation_summary}
        </p>
      )}

      {/* Bill-specific: Expert Commentary indicator or preview */}
      {isBill && commentary && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-2 italic border-l-2 border-primary/30 pl-2">
          {commentary}
        </p>
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
      </div>
    </Card>
  );
}
