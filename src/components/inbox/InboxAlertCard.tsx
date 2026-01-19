import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Star, ExternalLink, AlertCircle, Clock } from "lucide-react";
import { PeruAlert, getTypeLabel, getTypeColor, getRiskColor } from "@/data/peruAlertsMockData";
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

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsStarred(!isStarred);
  };

  const displayDate = alert.ai_analysis.publication_date || alert.ai_analysis.stage_date || alert.created_at;
  const formattedDate = format(new Date(displayDate), "dd MMM yyyy", { locale: es });

  return (
    <Card 
      className="p-3 bg-card/50 border-border/30 hover:bg-card/80 hover:border-primary/30 transition-all cursor-pointer group"
      onClick={onClick}
    >
      {/* Header: Type Badge + Star */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <Badge variant="outline" className={cn("text-xs", getTypeColor(alert.legislation_type))}>
          {getTypeLabel(alert.legislation_type)}
        </Badge>
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

      {/* Title */}
      <h4 className="text-sm font-medium text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
        {alert.legislation_title}
      </h4>

      {/* Metadata Row */}
      <div className="flex items-center gap-2 flex-wrap mb-2">
        {/* Area Tags */}
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

      {/* Footer: Risk + Date */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <AlertCircle className={cn("h-3.5 w-3.5", getRiskColor(alert.risk_level))} />
          <span className={cn("capitalize", getRiskColor(alert.risk_level))}>
            {alert.risk_level === "high" ? "Alto" : alert.risk_level === "medium" ? "Medio" : "Bajo"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Deadline indicator */}
      {alert.deadline && (
        <div className="mt-2 pt-2 border-t border-border/30">
          <div className="flex items-center gap-1.5 text-xs text-warning">
            <Clock className="h-3 w-3" />
            <span>Vence: {format(new Date(alert.deadline), "dd MMM yyyy", { locale: es })}</span>
          </div>
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
