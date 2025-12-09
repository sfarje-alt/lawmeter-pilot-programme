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
  ChevronRight,
  Tag
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AlertActionMenu } from "./AlertActionMenu";
import { useAISummary } from "@/hooks/useAISummary";
import { USLegislationItem } from "@/types/usaLegislation";
import { CongressBill } from "@/types/congress";

interface UnifiedAlertCardProps {
  isRead: boolean;
  isStarred: boolean;
  onMarkRead: () => void;
  onToggleStar: () => void;
  onDelete: () => void;
  onRefresh: () => void;
  onReport: () => void;
  onViewDetails: () => void;
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

// Normalize data from both sources to a common structure
interface NormalizedAlertData {
  id: string;
  title: string;
  documentType: string;
  billTextUrl?: string;
  policyArea: string;
  jurisdictionLevel: "Federal" | "State" | "Local";
  jurisdictionLocation: string;
  authority: string;
  chamber?: string;
  lifecycle: "In Force" | "Pipeline";
  isInForce: boolean;
  stage: string;
  stages?: string[];
  currentStageIndex?: number;
  riskLevel: "high" | "medium" | "low";
  riskScore: number;
  keyDate: string;
  keyDateLabel: string;
  deadline?: string;
  effectiveDate?: string;
  publishedDate?: string;
  isCongressBill: boolean;
  congressBillUrl?: string;
}

function normalizeData(mockItem?: USLegislationItem, congressBill?: CongressBill): NormalizedAlertData | null {
  if (mockItem) {
    const jurisdictionLevel = mockItem.authority === "city" 
      ? "Local" 
      : mockItem.subJurisdiction ? "State" : "Federal";
    
    return {
      id: mockItem.id,
      title: mockItem.title,
      documentType: mockItem.documentType,
      policyArea: mockItem.regulatoryCategory,
      jurisdictionLevel,
      jurisdictionLocation: mockItem.subJurisdiction || "US",
      authority: mockItem.regulatoryBody,
      lifecycle: mockItem.isInForce ? "In Force" : "Pipeline",
      isInForce: mockItem.isInForce,
      stage: mockItem.status,
      riskLevel: mockItem.riskLevel,
      riskScore: mockItem.riskScore,
      keyDate: mockItem.effectiveDate || mockItem.publishedDate,
      keyDateLabel: mockItem.effectiveDate ? "Effective" : "Published",
      deadline: mockItem.complianceDeadline,
      effectiveDate: mockItem.effectiveDate,
      publishedDate: mockItem.publishedDate,
      isCongressBill: false
    };
  }
  
  if (congressBill) {
    const stages = ["Introduced", "Passed House", "Passed Senate", "To President", "Became Law"];
    let currentStageIndex = 0;

    if (congressBill.latestAction) {
      const text = congressBill.latestAction.text.toLowerCase();
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

    const isInForce = currentStageIndex === 4;
    
    return {
      id: `${congressBill.congress}-${congressBill.type}-${congressBill.number}`,
      title: congressBill.title,
      documentType: "bill",
      billTextUrl: `https://www.congress.gov/bill/${congressBill.congress}th-congress/${congressBill.type.toLowerCase() === 'hr' ? 'house' : 'senate'}-bill/${congressBill.number}/text`,
      policyArea: congressBill.policyArea?.name || "Legislation",
      jurisdictionLevel: "Federal",
      jurisdictionLocation: "US",
      authority: "U.S. Congress",
      chamber: congressBill.originChamber,
      lifecycle: isInForce ? "In Force" : "Pipeline",
      isInForce,
      stage: stages[currentStageIndex],
      stages,
      currentStageIndex,
      riskLevel: "medium",
      riskScore: 50,
      keyDate: congressBill.latestAction?.actionDate || congressBill.introducedDate || "",
      keyDateLabel: congressBill.latestAction ? "Last Action" : "Introduced",
      publishedDate: congressBill.introducedDate,
      isCongressBill: true,
      congressBillUrl: `https://www.congress.gov/bill/${congressBill.congress}th-congress/${congressBill.type.toLowerCase() === 'hr' ? 'house' : 'senate'}-bill/${congressBill.number}`
    };
  }
  
  return null;
}

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
  const data = useMemo(() => normalizeData(mockItem, congressBill), [mockItem, congressBill]);
  
  if (!data) return null;

  // AI Summary hook
  const { summary, isGenerating, generateSummary } = useAISummary(
    data.id,
    data.title,
    data.billTextUrl,
    data.policyArea,
    {
      effectiveDate: data.effectiveDate,
      deadline: data.deadline,
      publishedDate: data.publishedDate,
      isInForce: data.isInForce
    }
  );

  // Auto-generate summary if not cached
  useEffect(() => {
    if (!summary && !isGenerating) {
      const timer = setTimeout(() => {
        generateSummary();
      }, Math.random() * 2000);
      return () => clearTimeout(timer);
    }
  }, [summary, isGenerating, generateSummary]);

  // Get risk info from summary or data
  const riskInfo = useMemo(() => {
    if (summary) {
      return {
        score: summary.riskScore,
        category: summary.riskCategory,
        level: summary.riskScore >= 70 ? "high" : summary.riskScore >= 40 ? "medium" : "low"
      };
    }
    return {
      score: data.riskScore,
      category: data.riskLevel.charAt(0).toUpperCase() + data.riskLevel.slice(1),
      level: data.riskLevel
    };
  }, [summary, data]);

  // Build jurisdiction line
  const jurisdictionLine = `${data.jurisdictionLevel} · ${data.jurisdictionLocation} · ${data.authority}${data.chamber ? ` · ${data.chamber}` : ""}`;

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
                data.isInForce 
                  ? "bg-success/10 text-success border-success/30" 
                  : "bg-warning/10 text-warning border-warning/30"
              )}
            >
              {data.isInForce ? (
                <CheckCircle className="h-3 w-3 mr-1" />
              ) : (
                <Clock className="h-3 w-3 mr-1" />
              )}
              {data.lifecycle}
            </Badge>
            
            {/* Stage badge */}
            <Badge variant="secondary" className="text-xs">
              {data.stage}
            </Badge>
          </div>

          {/* Consolidated Action Menu (click to open) */}
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

        {/* Row 2: Document type icon + Full Title (no truncation) */}
        <div className="flex items-start gap-2">
          <span className="text-xl flex-shrink-0">{docTypeIcons[data.documentType] || "📄"}</span>
          <h3 className="text-base font-semibold leading-tight hover:text-primary transition-colors">
            {data.title}
          </h3>
        </div>

        {/* Row 3: Jurisdiction line */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1.5">
          {data.jurisdictionLevel !== "Federal" ? (
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

        {/* Congress Bill Status Timeline */}
        {data.stages && data.currentStageIndex !== undefined && (
          <div className="bg-muted/20 p-2 rounded-md">
            <div className="flex items-center gap-1">
              {data.stages.map((stage, index) => (
                <div key={`stage-${index}`} className="flex items-center gap-0.5 flex-1">
                  {index > 0 && (
                    <ChevronRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  )}
                  <div className="flex flex-col items-center flex-1">
                    <div className={cn(
                      "w-full h-1.5 rounded-full transition-colors",
                      index <= data.currentStageIndex! ? "bg-primary" : "bg-muted"
                    )} />
                    <span className={cn(
                      "text-[10px] mt-1 text-center leading-tight",
                      index === data.currentStageIndex ? "text-foreground font-medium" : "text-muted-foreground"
                    )}>
                      {stage}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Row: Date + Deadline + Policy Area + Risk */}
        <div className="flex items-center justify-between gap-2 flex-wrap text-xs pt-1">
          <div className="flex items-center gap-3 text-muted-foreground flex-wrap">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{data.keyDateLabel}: {formatDate(data.keyDate)}</span>
            </div>
            
            {data.deadline && (
              <div className="flex items-center gap-1 text-warning">
                <AlertTriangle className="h-3 w-3" />
                <span>Due: {formatDate(data.deadline)}</span>
              </div>
            )}
            
            {/* Policy Area badge - always show */}
            <Badge variant="outline" className="text-xs py-0 gap-1">
              <Tag className="h-2.5 w-2.5" />
              {data.policyArea}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Badge className={cn("text-xs", getRiskBadgeClass(riskInfo.level as string))}>
              {riskInfo.category} {riskInfo.score}
            </Badge>
            
            {data.isCongressBill && data.congressBillUrl && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(data.congressBillUrl, "_blank");
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