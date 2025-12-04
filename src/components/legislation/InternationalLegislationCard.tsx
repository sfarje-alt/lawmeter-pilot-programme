import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Calendar, Building2, MapPin, FileText, Gavel, ScrollText, Clock, CheckCircle2, Circle } from "lucide-react";
import { InternationalLegislation, LegislationType, TimelineStage } from "@/data/mockInternationalLegislation";

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
    if (status.includes("In Force") || status.includes("Enacted") || status.includes("Adopted") || status.includes("Royal Assent") || status.includes("Published")) {
      return "bg-success/20 text-success border-success/30";
    }
    if (status.includes("Draft") || status.includes("Proposed") || status.includes("Public") || status.includes("Voluntary") || status.includes("First")) {
      return "bg-info/20 text-info border-info/30";
    }
    return "bg-warning/20 text-warning border-warning/30";
  };

  const getLegislationTypeInfo = (type: LegislationType) => {
    switch (type) {
      case "law": return { label: "Law", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: Gavel };
      case "regulation": return { label: "Regulation", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: ScrollText };
      case "bill": return { label: "Bill", color: "bg-amber-500/20 text-amber-400 border-amber-500/30", icon: FileText };
      case "decree": return { label: "Decree", color: "bg-purple-500/20 text-purple-400 border-purple-500/30", icon: Gavel };
      case "directive": return { label: "Directive", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30", icon: ScrollText };
      case "proposal": return { label: "Proposal", color: "bg-orange-500/20 text-orange-400 border-orange-500/30", icon: FileText };
      default: return { label: "Unknown", color: "bg-muted text-muted-foreground", icon: FileText };
    }
  };

  const typeInfo = getLegislationTypeInfo(legislation.legislationType);
  const TypeIcon = typeInfo.icon;
  const isPending = legislation.legislativeCategory === "pending";

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getDaysUntil = (dateString: string) => {
    const target = new Date(dateString);
    const today = new Date();
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <Card className="glass-card hover:shadow-lg transition-all duration-200 border-white/10">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant="outline" className={typeInfo.color}>
                <TypeIcon className="w-3 h-3 mr-1" />
                {legislation.localTerminology || typeInfo.label}
              </Badge>
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
            {legislation.subJurisdiction && (
              <Badge variant="outline" className="mt-2 bg-primary/10 text-primary border-primary/30">
                <MapPin className="w-3 h-3 mr-1" />
                {legislation.subJurisdiction}
              </Badge>
            )}
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

        {/* Timeline for pending legislation */}
        {isPending && legislation.timeline && legislation.timeline.length > 0 && (
          <div className="pt-2 border-t border-white/10">
            <div className="text-xs text-muted-foreground mb-2 font-medium">Legislative Progress</div>
            <div className="flex items-center gap-1">
              {legislation.timeline.map((stage, idx) => (
                <div key={idx} className="flex items-center">
                  <div className="flex flex-col items-center">
                    {stage.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground/40" />
                    )}
                    <span className={`text-[10px] mt-1 text-center max-w-[50px] leading-tight ${stage.completed ? 'text-foreground' : 'text-muted-foreground/60'}`}>
                      {stage.name}
                    </span>
                  </div>
                  {idx < legislation.timeline!.length - 1 && (
                    <div className={`h-0.5 w-4 mx-0.5 ${stage.completed ? 'bg-success' : 'bg-muted-foreground/20'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          <Badge variant="secondary" className="text-xs">
            <Building2 className="w-3 h-3 mr-1" />
            {legislation.regulatoryBody}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {legislation.category}
          </Badge>
        </div>

        {/* Dates section */}
        <div className="grid grid-cols-1 gap-1 text-xs text-muted-foreground pt-2 border-t border-white/10">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Published: {formatDate(legislation.publishedDate)}</span>
          </div>
          {legislation.effectiveDate && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Effective: {formatDate(legislation.effectiveDate)}</span>
              {getDaysUntil(legislation.effectiveDate) > 0 && (
                <Badge variant="outline" className="ml-1 text-[10px] px-1 py-0">
                  in {getDaysUntil(legislation.effectiveDate)} days
                </Badge>
              )}
            </div>
          )}
          {legislation.complianceDeadline && (
            <div className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-warning" />
              <span className="text-warning">Compliance Deadline: {formatDate(legislation.complianceDeadline)}</span>
              {getDaysUntil(legislation.complianceDeadline) > 0 && getDaysUntil(legislation.complianceDeadline) <= 90 && (
                <Badge variant="outline" className="ml-1 text-[10px] px-1 py-0 border-warning text-warning">
                  {getDaysUntil(legislation.complianceDeadline)} days left
                </Badge>
              )}
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
