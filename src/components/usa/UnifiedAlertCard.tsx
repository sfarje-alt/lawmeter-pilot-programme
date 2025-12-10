import { useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar,
  AlertTriangle,
  Sparkles,
  Building2,
  MapPin,
  ExternalLink,
  Loader2,
  ChevronRight,
  Tag,
  FileText
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

// Pipeline stages for different document types
const pipelineStages: Record<string, string[]> = {
  bill: ["Introduced", "Committee", "Passed House", "Passed Senate", "To President", "Enacted"],
  regulation: ["Draft", "Proposed", "Comment Period", "Final Rule", "Effective"],
  treaty: ["Proposed", "Negotiation", "Signed", "Ratification", "In Force"],
  ordinance: ["Proposed", "First Reading", "Public Comment", "Second Reading", "Adopted", "Effective"]
};

// Get stage index based on status
function getStageIndex(status: string, docType: string): number {
  const stages = pipelineStages[docType] || pipelineStages.bill;
  const statusLower = status.toLowerCase();
  
  if (docType === "bill") {
    if (statusLower.includes("introduced") || statusLower.includes("first")) return 0;
    if (statusLower.includes("committee")) return 1;
    if (statusLower.includes("passed house")) return 2;
    if (statusLower.includes("passed senate")) return 3;
    if (statusLower.includes("president")) return 4;
    if (statusLower.includes("enacted") || statusLower.includes("law") || statusLower.includes("in force")) return 5;
    if (statusLower.includes("second")) return 1;
  } else if (docType === "regulation") {
    if (statusLower.includes("draft")) return 0;
    if (statusLower.includes("proposed") || statusLower.includes("nprm")) return 1;
    if (statusLower.includes("comment")) return 2;
    if (statusLower.includes("final")) return 3;
    if (statusLower.includes("effective") || statusLower.includes("in force")) return 4;
  } else if (docType === "treaty") {
    if (statusLower.includes("proposed")) return 0;
    if (statusLower.includes("negotiat")) return 1;
    if (statusLower.includes("signed")) return 2;
    if (statusLower.includes("ratif")) return 3;
    if (statusLower.includes("in force")) return 4;
  } else if (docType === "ordinance") {
    if (statusLower.includes("proposed")) return 0;
    if (statusLower.includes("first")) return 1;
    if (statusLower.includes("comment") || statusLower.includes("public")) return 2;
    if (statusLower.includes("second")) return 3;
    if (statusLower.includes("adopted") || statusLower.includes("future")) return 4;
    if (statusLower.includes("effective") || statusLower.includes("in force")) return 5;
  }
  
  return 0;
}

// Normalize data from both sources to a common structure
interface NormalizedAlertData {
  id: string;
  identifier: string; // Bill/law number (e.g., "H.R. 1234", "S. 567", "P.L. 118-45")
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
  stages: string[];
  currentStageIndex: number;
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
    
    const docType = mockItem.documentType;
    const stages = pipelineStages[docType] || pipelineStages.bill;
    const currentStageIndex = mockItem.isInForce 
      ? stages.length - 1 
      : getStageIndex(mockItem.status, docType);
    
    return {
      id: mockItem.id,
      identifier: mockItem.localTerminology || mockItem.id.toUpperCase(),
      title: mockItem.title,
      documentType: mockItem.documentType,
      policyArea: mockItem.regulatoryCategory,
      jurisdictionLevel,
      jurisdictionLocation: mockItem.subJurisdiction || "US",
      authority: mockItem.regulatoryBody,
      lifecycle: mockItem.isInForce ? "In Force" : "Pipeline",
      isInForce: mockItem.isInForce,
      stage: mockItem.status,
      stages,
      currentStageIndex,
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
    const stages = ["Introduced", "Committee", "Passed House", "Passed Senate", "To President", "Enacted"];
    let currentStageIndex = 0;

    if (congressBill.latestAction) {
      const text = congressBill.latestAction.text.toLowerCase();
      if (text.includes("became public law") || text.includes("signed by president")) {
        currentStageIndex = 5;
      } else if (text.includes("presented to president") || text.includes("sent to president")) {
        currentStageIndex = 4;
      } else if (text.includes("passed") && text.includes("senate")) {
        currentStageIndex = 3;
      } else if (text.includes("passed") && (text.includes("house") || text.includes("h.r."))) {
        currentStageIndex = 2;
      } else if (text.includes("committee") || text.includes("referred")) {
        currentStageIndex = 1;
      }
    }

    const isInForce = currentStageIndex === 5;
    const billTypeLabel = congressBill.type === "HR" ? "H.R." : congressBill.type === "S" ? "S." : congressBill.type;
    
    return {
      id: `${congressBill.congress}-${congressBill.type}-${congressBill.number}`,
      identifier: `${billTypeLabel} ${congressBill.number}`,
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
        {/* Row 1: Lifecycle badge + Bill Identifier + Action Menu */}
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
              {data.lifecycle}
            </Badge>
            
            {/* Bill/Law Identifier (replaces status icon) */}
            <Badge variant="secondary" className="text-xs font-mono gap-1">
              <FileText className="h-3 w-3" />
              {data.identifier}
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

        {/* Legislative Status Tracker - Only for Pipeline items */}
        {!data.isInForce && data.stages && (
          <div className="bg-muted/20 p-3 rounded-md border border-border/30">
            <div className="text-xs font-medium text-muted-foreground mb-2">Legislative Progress</div>
            <div className="flex items-center gap-0.5">
              {data.stages.map((stage, index) => (
                <div key={`stage-${index}`} className="flex items-center gap-0.5 flex-1">
                  {index > 0 && (
                    <ChevronRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  )}
                  <div className="flex flex-col items-center flex-1">
                    <div className={cn(
                      "w-full h-2 rounded-full transition-colors",
                      index < data.currentStageIndex 
                        ? "bg-primary" 
                        : index === data.currentStageIndex 
                          ? "bg-primary animate-pulse" 
                          : "bg-muted"
                    )} />
                    <span className={cn(
                      "text-[9px] mt-1 text-center leading-tight",
                      index === data.currentStageIndex 
                        ? "text-primary font-semibold" 
                        : index < data.currentStageIndex 
                          ? "text-foreground" 
                          : "text-muted-foreground"
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