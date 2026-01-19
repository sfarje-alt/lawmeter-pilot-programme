import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Star, ExternalLink, Clock, Building2, User, Users } from "lucide-react";
import { PeruAlert, getTypeLabel, getTypeColor } from "@/data/peruAlertsMockData";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface InboxAlertCardProps {
  alert: PeruAlert;
  onClick: () => void;
}

export function InboxAlertCard({ alert, onClick }: InboxAlertCardProps) {
  const [isStarred, setIsStarred] = useState(false);
  const isBill = alert.legislation_type === "proyecto_de_ley";

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsStarred(!isStarred);
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (alert.source_url) {
      window.open(alert.source_url, "_blank");
    }
  };

  // Get display date based on type
  const displayDate = isBill 
    ? alert.stage_date || alert.project_date 
    : alert.publication_date;
  
  const formattedDate = displayDate 
    ? format(new Date(displayDate), "dd MMM yyyy", { locale: es })
    : null;

  return (
    <Card 
      className="p-3 bg-card/50 border-border/30 hover:bg-card/80 hover:border-primary/30 transition-all cursor-pointer group"
      onClick={onClick}
    >
      {/* Header: Type Badge + ID + Actions */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className={cn("text-xs", getTypeColor(alert.legislation_type))}>
            {getTypeLabel(alert.legislation_type)}
          </Badge>
          {isBill && alert.legislation_id && (
            <span className="text-xs text-muted-foreground font-mono">
              {alert.legislation_id}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {alert.source_url && (
            <button
              onClick={handleLinkClick}
              className="p-1 hover:bg-white/10 rounded transition-colors"
              title="Ver documento original"
            >
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-primary" />
            </button>
          )}
          <button
            onClick={handleStarClick}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <Star 
              className={cn(
                "h-3.5 w-3.5 transition-colors",
                isStarred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
              )} 
            />
          </button>
        </div>
      </div>

      {/* Title */}
      <h4 className="text-sm font-medium text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
        {alert.legislation_title}
      </h4>

      {/* Author/Entity Row */}
      {isBill ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <User className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{alert.author}</span>
          {alert.parliamentary_group && (
            <>
              <span className="text-border">|</span>
              <Users className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{alert.parliamentary_group}</span>
            </>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <Building2 className="h-3.5 w-3.5 shrink-0" />
          <span>{alert.entity}</span>
        </div>
      )}

      {/* Summary (for normas only) */}
      {!isBill && alert.legislation_summary && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-2 italic">
          "{alert.legislation_summary}"
        </p>
      )}

      {/* Stage (for bills only) */}
      {isBill && alert.current_stage && (
        <div className="mb-2">
          <Badge variant="secondary" className="text-xs bg-muted/50">
            {alert.current_stage}
          </Badge>
        </div>
      )}

      {/* Area Tags */}
      <div className="flex items-center gap-2 flex-wrap mb-2">
        {alert.affected_areas.slice(0, 2).map((area) => (
          <Badge key={area} variant="secondary" className="text-xs bg-muted/50">
            {area}
          </Badge>
        ))}
        {alert.affected_areas.length > 2 && (
          <Badge variant="secondary" className="text-xs bg-muted/50">
            +{alert.affected_areas.length - 2}
          </Badge>
        )}
      </div>

      {/* Footer: Date */}
      {formattedDate && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{formattedDate}</span>
        </div>
      )}

      {/* Expert commentary indicator */}
      {alert.expert_commentary && (
        <div className="mt-2 pt-2 border-t border-border/30">
          <div className="flex items-center gap-1.5 text-xs text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>Con comentario experto</span>
          </div>
        </div>
      )}
    </Card>
  );
}
