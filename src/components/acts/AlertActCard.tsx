import { Alert } from "@/types/legislation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ExternalLink, FileText } from "lucide-react";
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

  const title = alert.AI_triage?.alert_title || alert.title || alert.csv_name || "Untitled";
  const summary = alert.AI_triage?.summary || "No summary available";
  const bullets = alert.AI_triage?.alert_bullets || [];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={getRiskColor(alert.AI_triage?.risk_level || "low")}>
              {alert.AI_triage?.risk_level?.toUpperCase() || "LOW"} RISK
            </Badge>
            {alert.AI_triage?.risk_score_hint !== undefined && (
              <Badge variant="outline">{alert.AI_triage.risk_score_hint}/100</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {formatDate(alert.effective_date)}
            </span>
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
        <h3 className="text-lg font-semibold mt-2">{title}</h3>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {alert.csv_portfolio && (
            <Badge variant="secondary">{alert.csv_portfolio}</Badge>
          )}
          {alert.doc_view && (
            <Badge variant="outline">{alert.doc_view}</Badge>
          )}
          {alert.csv_collection && (
            <Badge variant="outline">{alert.csv_collection}</Badge>
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
                Open FRL
              </a>
            </Button>
          )}
          {alert.authorised_by?.link && (
            <Button variant="outline" size="sm" asChild>
              <a href={alert.authorised_by.link} target="_blank" rel="noopener noreferrer">
                <FileText className="h-3 w-3 mr-1" />
                Mother Act
              </a>
            </Button>
          )}
          {alert.doc_view === "Amending/As Made" && alert.link && (
            <Button variant="outline" size="sm" asChild>
              <a href={alert.link} target="_blank" rel="noopener noreferrer">
                Amendment Act
              </a>
            </Button>
          )}
          <Button variant="default" size="sm" onClick={onOpenDrawer}>
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
