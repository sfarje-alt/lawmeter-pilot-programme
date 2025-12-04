import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Calendar, Building2, ExternalLink } from "lucide-react";
import { InternationalLegislation } from "@/data/mockInternationalLegislation";

interface InternationalLegislationCardProps {
  legislation: InternationalLegislation;
}

export function InternationalLegislationCard({ legislation }: InternationalLegislationCardProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case "high": return "bg-risk-high/20 text-risk-high border-risk-high/30";
      case "medium": return "bg-risk-medium/20 text-risk-medium border-risk-medium/30";
      case "low": return "bg-risk-low/20 text-risk-low border-risk-low/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    if (status.includes("In Force") || status.includes("Enacted") || status.includes("Adopted")) {
      return "bg-success/20 text-success border-success/30";
    }
    if (status.includes("Draft") || status.includes("Proposed") || status.includes("Public")) {
      return "bg-info/20 text-info border-info/30";
    }
    return "bg-warning/20 text-warning border-warning/30";
  };

  return (
    <Card className="glass-card hover:shadow-lg transition-all duration-200 border-white/10">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className={getRiskColor(legislation.riskLevel)}>
                <AlertTriangle className="w-3 h-3 mr-1" />
                {legislation.riskLevel.toUpperCase()} ({legislation.riskScore})
              </Badge>
              <Badge variant="outline" className={getStatusColor(legislation.status)}>
                {legislation.status}
              </Badge>
            </div>
            <CardTitle className="text-base font-semibold leading-tight">
              {legislation.title}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {legislation.summary}
        </p>

        <div className="space-y-1">
          {legislation.bullets.slice(0, 3).map((bullet, idx) => (
            <div key={idx} className="flex gap-2 text-sm">
              <span className="text-primary mt-1">•</span>
              <span className="text-muted-foreground">{bullet}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <Badge variant="secondary" className="text-xs">
            <Building2 className="w-3 h-3 mr-1" />
            {legislation.regulatoryBody}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {legislation.category}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-white/10">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Published: {legislation.publishedDate}
          </div>
          {legislation.effectiveDate && (
            <div className="flex items-center gap-1">
              <span>Effective: {legislation.effectiveDate}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1 pt-1">
          {legislation.impactAreas.map((area, idx) => (
            <Badge key={idx} variant="outline" className="text-xs bg-accent/10">
              {area}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
