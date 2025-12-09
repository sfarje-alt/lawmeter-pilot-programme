import { useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles,
  Building2,
  MapPin,
  ExternalLink,
  Loader2,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AlertActionMenu } from "./AlertActionMenu";
import { useAISummary } from "@/hooks/useAISummary";
import { USLegislationItem } from "@/types/usaLegislation";
import { CongressBill } from "@/types/congress";

interface UnifiedAlertCardProps {
  // Common props
  isRead: boolean;
  isStarred: boolean;
  onMarkRead: () => void;
  onToggleStar: () => void;
  onDelete: () => void;
  onRefresh: () => void;
  onReport: () => void;
  onViewDetails: () => void;
  // Either mock item or congress bill
  mockItem?: USLegislationItem;
  congressBill?: CongressBill;
}

// Document type icons
const docTypeIcons: Record<string, string> = {
  bill: "📜",
  statute: "⚖️",
  regulation: "📋",
  treaty: "🤝",
  ordinance: "🏛️"
};

export function UnifiedAlertCard({
  isRead,
  isStarred,
  onMarkRead,
  onToggleStar,
  onDelete,
  onRefresh,
  onReport,
  onViewDetails,
  mockItem,
  congressBill
}: UnifiedAlertCardProps) {
  // Determine which type of item we're displaying
  const isMock = !!mockItem;
  const item = mockItem || congressBill;
  
  if (!item) return null;

  // Extract common properties
  const id = isMock 
    ? mockItem!.id 
    : `${congressBill!.congress}-${congressBill!.type}-${congressBill!.number}`;
  
  const title = isMock ? mockItem!.title : congressBill!.title;
  
  const documentType = isMock ? mockItem!.documentType : "bill";
  
  const billTextUrl = !isMock && congressBill 
    ? `https://www.congress.gov/bill/${congressBill.congress}th-congress/${congressBill.type.toLowerCase() === 'hr' ? 'house' : 'senate'}-bill/${congressBill.number}/text`
    : undefined;
  
  const policyArea = isMock 
    ? mockItem!.regulatoryCategory 
    : congressBill?.policyArea?.name;

  // AI Summary hook
  const { summary, isGenerating, generateSummary } = useAISummary(
    id,
    title,
    billTextUrl,
    policyArea
  );

  // Auto-generate summary if not cached
  useEffect(() => {
    if (!summary && !isGenerating) {
      // Delay to avoid too many simultaneous requests
      const timer = setTimeout(() => {
        generateSummary();
      }, Math.random() * 2000);
      return () => clearTimeout(timer);
    }
  }, [summary, isGenerating, generateSummary]);

  // Build jurisdiction line
  const jurisdictionLine = useMemo(() => {
    if (isMock) {
      const level = mockItem!.subJurisdiction 
        ? (mockItem!.authority === "city" ? "Local" : "State")
        : "Federal";
      const location = mockItem!.subJurisdiction || "US";
      const authority = mockItem!.regulatoryBody;
      return `${level} · ${location} · ${authority}`;
    } else {
      const chamber = congressBill!.originChamber;
      return `Federal · US · Congress · ${chamber}`;
    }
  }, [isMock, mockItem, congressBill]);

  // Status/Stage info
  const statusInfo = useMemo(() => {
    if (isMock) {
      return {
        lifecycle: mockItem!.isInForce ? "In Force" : "Pipeline",
        isInForce: mockItem!.isInForce,
        stage: mockItem!.status
      };
    } else {
      // Parse Congress bill status
      const stages = ["Introduced", "Passed House", "Passed Senate", "To President", "Became Law"];
      let currentStageIndex = 0;

      if (congressBill!.latestAction) {
        const text = congressBill!.latestAction.text.toLowerCase();
        if (text.includes("became public law") || text.includes("signed by president")) {
          currentStageIndex = 4;
        } else if (text.includes("presented to president") || text.includes("sent to president")) {
          currentStageIndex = 3;
        } else if (text.includes("passed") && text.includes("senate")) {
          currentStageIndex = 2;
        } else if (text.includes("passed") && (text.includes("house") || text.includes("h.r."))) {
          currentStageIndex = 1;
        }
      }

      return {
        lifecycle: currentStageIndex === 4 ? "In Force" : "Pipeline",
        isInForce: currentStageIndex === 4,
        stage: stages[currentStageIndex],
        stages,
        currentStageIndex
      };
    }
  }, [isMock, mockItem, congressBill]);

  // Risk info
  const riskInfo = useMemo(() => {
    if (summary) {
      return {
        score: summary.riskScore,
        category: summary.riskCategory,
        level: summary.riskScore >= 70 ? "high" : summary.riskScore >= 40 ? "medium" : "low"
      };
    }
    if (isMock) {
      return {
        score: mockItem!.riskScore,
        category: mockItem!.riskLevel.charAt(0).toUpperCase() + mockItem!.riskLevel.slice(1),
        level: mockItem!.riskLevel
      };
    }
    return { score: 50, category: "Medium", level: "medium" };
  }, [summary, isMock, mockItem]);

  // Dates
  const keyDate = isMock 
    ? mockItem!.effectiveDate || mockItem!.publishedDate
    : congressBill!.latestAction?.actionDate;
  
  const deadline = isMock ? mockItem!.complianceDeadline : undefined;
  
  const category = isMock 
    ? mockItem!.regulatoryCategory 
    : congressBill?.policyArea?.name || "Legislation";

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  // Get risk badge styling
  const getRiskBadgeClass = (level: string) => {
    switch (level) {
      case "high": return "bg-risk-high text-risk-high-foreground";
      case "medium": return "bg-risk-medium text-risk-medium-foreground";
      case "low": return "bg-risk-low text-risk-low-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card 
      className={cn(
        "transition-all hover:shadow-lg cursor-pointer",
        !isRead && "bg-primary/5 border-primary/20 border-l-4 border-l-primary"
      )}
      onClick={() => {
        onMarkRead();
        onViewDetails();
      }}
    >
      <CardHeader className="pb-2 pt-3">
        {/* Row 1: Status badges + Action Menu */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Lifecycle badge */}
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs font-medium",
                statusInfo.isInForce 
                  ? "bg-success/10 text-success border-success/30" 
                  : "bg-warning/10 text-warning border-warning/30"
              )}
            >
              {statusInfo.isInForce ? (
                <CheckCircle className="h-3 w-3 mr-1" />
              ) : (
                <Clock className="h-3 w-3 mr-1" />
              )}
              {statusInfo.lifecycle}
            </Badge>
            
            {/* Stage badge */}
            <Badge variant="secondary" className="text-xs">
              {statusInfo.stage}
            </Badge>

            {/* NEW indicator */}
            {!isRead && (
              <Badge className="bg-primary text-primary-foreground text-xs animate-pulse">
                NEW
              </Badge>
            )}
          </div>

          {/* Consolidated Action Menu */}
          <div onClick={(e) => e.stopPropagation()}>
            <AlertActionMenu
              isRead={isRead}
              isStarred={isStarred}
              onMarkRead={onMarkRead}
              onToggleStar={onToggleStar}
              onDelete={onDelete}
              onRefresh={onRefresh}
              onReport={onReport}
            />
          </div>
        </div>

        {/* Row 2: Document type icon + Title */}
        <div className="flex items-start gap-2">
          <span className="text-xl flex-shrink-0">{docTypeIcons[documentType] || "📄"}</span>
          <h3 className="text-base font-semibold leading-tight line-clamp-2 hover:text-primary transition-colors">
            {title}
          </h3>
        </div>

        {/* Row 3: Jurisdiction line */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1.5">
          {isMock && mockItem!.subJurisdiction ? (
            <MapPin className="h-3 w-3" />
          ) : (
            <Building2 className="h-3 w-3" />
          )}
          <span>{jurisdictionLine}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        {/* AI Summary Block */}
        <div className="bg-muted/30 rounded-md p-3 border border-border/50">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">AI Summary</span>
            {isGenerating && (
              <Loader2 className="h-3 w-3 animate-spin text-muted-foreground ml-1" />
            )}
          </div>
          
          {summary ? (
            <div className="space-y-1.5 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground font-medium min-w-[60px]">Changes:</span>
                <span className="text-foreground">{summary.whatChanges}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground font-medium min-w-[60px]">Impacts:</span>
                <span className="text-foreground">{summary.whoImpacted}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground font-medium min-w-[60px]">Timeline:</span>
                <span className="text-foreground">{summary.keyDeadline}</span>
              </div>
              {summary.comparedToPrevious && (
                <div className="flex items-center gap-2 mt-2 text-xs text-warning">
                  <AlertTriangle className="h-3 w-3" />
                  <span>{summary.comparedToPrevious}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              {isGenerating ? "Analyzing content..." : "Click to generate AI analysis"}
            </div>
          )}
        </div>

        {/* Congress Bill Status Timeline (only for Congress bills) */}
        {!isMock && statusInfo.stages && (
          <div className="bg-muted/20 p-2 rounded-md">
            <div className="flex items-center gap-1">
              {statusInfo.stages.map((stage, index) => (
                <div key={`stage-${index}`} className="flex items-center gap-0.5 flex-1">
                  {index > 0 && (
                    <ChevronRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  )}
                  <div className="flex flex-col items-center flex-1">
                    <div className={cn(
                      "w-full h-1.5 rounded-full transition-colors",
                      index <= (statusInfo.currentStageIndex || 0) ? "bg-primary" : "bg-muted"
                    )} />
                    <span className={cn(
                      "text-[10px] mt-1 text-center leading-tight",
                      index === statusInfo.currentStageIndex ? "text-foreground font-medium" : "text-muted-foreground"
                    )}>
                      {stage}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Row: Date + Deadline + Category + Risk */}
        <div className="flex items-center justify-between gap-2 flex-wrap text-xs pt-1">
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(keyDate)}</span>
            </div>
            
            {deadline && (
              <div className="flex items-center gap-1 text-warning">
                <AlertTriangle className="h-3 w-3" />
                <span>Due: {formatDate(deadline)}</span>
              </div>
            )}
            
            <Badge variant="outline" className="text-xs py-0">
              {category}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Badge className={cn("text-xs", getRiskBadgeClass(riskInfo.level))}>
              {riskInfo.category} {riskInfo.score}
            </Badge>
            
            {!isMock && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(
                    `https://www.congress.gov/bill/${congressBill!.congress}th-congress/${congressBill!.type.toLowerCase() === 'hr' ? 'house' : 'senate'}-bill/${congressBill!.number}`,
                    "_blank"
                  );
                }}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Congress.gov
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
