import { UnifiedLegislationItem } from "@/types/unifiedLegislation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface UnifiedImpactUrgencyMatrixProps {
  data: UnifiedLegislationItem[];
}

export function UnifiedImpactUrgencyMatrix({ data }: UnifiedImpactUrgencyMatrixProps) {
  const now = new Date();
  const next30Days = new Date();
  next30Days.setDate(next30Days.getDate() + 30);
  const next90Days = new Date();
  next90Days.setDate(next90Days.getDate() + 90);

  const categorizedItems = data.map((item) => {
    const impact = item.riskLevel;
    let urgency: "high" | "medium" | "low" = "low";

    if (item.complianceDeadline) {
      const deadline = new Date(item.complianceDeadline);
      if (deadline <= next30Days && deadline >= now) {
        urgency = "high";
      } else if (deadline <= next90Days && deadline >= now) {
        urgency = "medium";
      }
    } else if (item.isPipeline) {
      // Pipeline items in late stages are more urgent
      if (item.currentStageIndex !== undefined && item.currentStageIndex >= 3) {
        urgency = "high";
      } else if (item.currentStageIndex !== undefined && item.currentStageIndex >= 1) {
        urgency = "medium";
      }
    }

    return { item, impact, urgency };
  });

  const quadrants = {
    highImpactHighUrgency: categorizedItems.filter(
      (i) => i.impact === "high" && i.urgency === "high"
    ),
    highImpactLowUrgency: categorizedItems.filter(
      (i) => i.impact === "high" && (i.urgency === "low" || i.urgency === "medium")
    ),
    lowImpactHighUrgency: categorizedItems.filter(
      (i) => (i.impact === "low" || i.impact === "medium") && i.urgency === "high"
    ),
    lowImpactLowUrgency: categorizedItems.filter(
      (i) => (i.impact === "low" || i.impact === "medium") && (i.urgency === "low" || i.urgency === "medium")
    ),
  };

  const QuadrantSection = ({
    title,
    items,
    badgeVariant,
    borderClass,
    bgClass,
  }: {
    title: string;
    items: typeof categorizedItems;
    badgeVariant: "destructive" | "secondary" | "outline";
    borderClass: string;
    bgClass: string;
  }) => (
    <div className={`border-2 ${borderClass} rounded-lg p-4 ${bgClass}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-sm">{title}</h4>
        <Badge variant={badgeVariant}>{items.length}</Badge>
      </div>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        <TooltipProvider>
          {items.slice(0, 5).map(({ item }) => (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <div className="text-xs p-2 bg-background rounded border cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{item.jurisdictionCode}</span>
                    <span className="truncate flex-1">{item.title}</span>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-[300px]">
                <div className="space-y-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.jurisdictionCode} • {item.regulatoryCategory}
                  </p>
                  {item.complianceDeadline && (
                    <p className="text-xs text-warning">
                      Deadline: {new Date(item.complianceDeadline).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
        {items.length > 5 && (
          <div className="text-xs text-muted-foreground text-center py-1">
            +{items.length - 5} more
          </div>
        )}
        {items.length === 0 && (
          <div className="text-xs text-muted-foreground text-center py-2">
            No items
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Card className="glass-card border-border/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Target className="h-5 w-5 text-primary" />
          Impact vs. Urgency Matrix
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <QuadrantSection
            title="Critical & Urgent"
            items={quadrants.highImpactHighUrgency}
            badgeVariant="destructive"
            borderClass="border-risk-high"
            bgClass="bg-risk-high/5"
          />
          <QuadrantSection
            title="Critical but Not Urgent"
            items={quadrants.highImpactLowUrgency}
            badgeVariant="secondary"
            borderClass="border-risk-medium"
            bgClass="bg-risk-medium/5"
          />
          <QuadrantSection
            title="Urgent but Lower Impact"
            items={quadrants.lowImpactHighUrgency}
            badgeVariant="outline"
            borderClass="border-warning"
            bgClass="bg-warning/5"
          />
          <QuadrantSection
            title="Monitor"
            items={quadrants.lowImpactLowUrgency}
            badgeVariant="outline"
            borderClass="border-muted"
            bgClass="bg-muted/30"
          />
        </div>
      </CardContent>
    </Card>
  );
}
