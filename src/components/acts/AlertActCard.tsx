import { Alert } from "@/types/legislation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ExternalLink, FileText, Calendar } from "lucide-react";
import { getPortfolioColor } from "@/lib/portfolioColors";
import { formatDate } from "@/lib/dateUtils";

interface AlertActCardProps {
  alert: Alert;
  isStarred: boolean;
  onToggleStar: () => void;
  onOpenDrawer: () => void;
}

export function AlertActCard({ alert, isStarred, onToggleStar, onOpenDrawer }: AlertActCardProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case "high": return "bg-risk-high text-white";
      case "medium": return "bg-risk-medium text-white";
      case "low": return "bg-risk-low text-white";
      default: return "bg-muted";
    }
  };

  const effectiveDate = alert.effective_date;
  const publicationDate = alert.publication_date;

  const displayTitle = alert.title || alert.law_number || "Sin título";
  const summary = alert.AI_triage?.summary || "Resumen no disponible";
  const bullets = alert.AI_triage?.alert_bullets || [];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={getRiskColor(alert.AI_triage?.risk_level || "low")}>
              RIESGO {alert.AI_triage?.risk_level?.toUpperCase() || "BAJO"}
            </Badge>
            {alert.AI_triage?.risk_score_hint !== undefined && (
              <Badge variant="outline">{alert.AI_triage.risk_score_hint}/100</Badge>
            )}
            {alert.ministry && (
              <Badge className={getPortfolioColor(alert.ministry)}>
                {alert.ministry}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleStar}
              className={isStarred ? "text-yellow-500" : ""}
            >
              <Star className="h-4 w-4" fill={isStarred ? "currentColor" : "none"} />
            </Button>
          </div>
        </div>
        <h3 className="text-lg font-semibold mt-2">{displayTitle}</h3>
        
        <div className="flex items-center gap-4 mt-2 text-sm">
          {effectiveDate && (
            <div className="flex items-center gap-1.5 text-foreground font-medium">
              <Calendar className="h-4 w-4" />
              <span>Rige: {formatDate(effectiveDate)}</span>
            </div>
          )}
          {publicationDate && (
            <span className="text-muted-foreground">
              Publicado: {formatDate(publicationDate)}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{alert.norm_type}</Badge>
          {alert.version && (
            <Badge variant="outline">{alert.version}</Badge>
          )}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3">{summary}</p>

        {bullets.length > 0 && (
          <ul className="text-sm space-y-1">
            {bullets.slice(0, 3).map((bullet, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-primary">•</span>
                <span className="text-muted-foreground">{bullet}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          {alert.link && (
            <Button variant="outline" size="sm" asChild>
              <a href={alert.link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                Ver en SINALEVI
              </a>
            </Button>
          )}
          <Button variant="default" size="sm" onClick={onOpenDrawer}>
            Detalles
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
