import { useMemo } from "react";
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComplianceTimelineProps {
  data: UnifiedLegislationItem[];
}

export function ComplianceTimeline({ data }: ComplianceTimelineProps) {
  const upcomingDeadlines = useMemo(() => {
    const now = new Date();
    const days90 = new Date();
    days90.setDate(days90.getDate() + 90);

    return data
      .filter((item) => {
        if (!item.complianceDeadline) return false;
        const deadline = new Date(item.complianceDeadline);
        return deadline >= now && deadline <= days90;
      })
      .map((item) => {
        const deadline = new Date(item.complianceDeadline!);
        const daysRemaining = Math.ceil(
          (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        return { ...item, deadline, daysRemaining };
      })
      .sort((a, b) => a.daysRemaining - b.daysRemaining)
      .slice(0, 8);
  }, [data]);

  const getUrgencyColor = (daysRemaining: number) => {
    if (daysRemaining <= 7) return "border-l-risk-high bg-risk-high/5";
    if (daysRemaining <= 30) return "border-l-risk-medium bg-risk-medium/5";
    return "border-l-risk-low bg-risk-low/5";
  };

  const getDaysLabel = (daysRemaining: number) => {
    if (daysRemaining === 0) return "Today";
    if (daysRemaining === 1) return "Tomorrow";
    if (daysRemaining <= 7) return `${daysRemaining} days`;
    if (daysRemaining <= 30) return `${Math.ceil(daysRemaining / 7)} weeks`;
    return `${Math.ceil(daysRemaining / 30)} months`;
  };

  return (
    <Card className="glass-card border-border/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarClock className="h-5 w-5 text-primary" />
          Compliance Timeline
          {upcomingDeadlines.length > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {upcomingDeadlines.length} upcoming
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[320px] overflow-y-auto">
          {upcomingDeadlines.length > 0 ? (
            upcomingDeadlines.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "p-3 rounded-r-lg border-l-4 transition-colors hover:bg-muted/50",
                  getUrgencyColor(item.daysRemaining)
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-muted-foreground">
                        {item.jurisdictionCode}
                      </span>
                      {item.riskLevel === "high" && (
                        <AlertTriangle className="w-3 h-3 text-risk-high" />
                      )}
                    </div>
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.regulatoryCategory}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div
                      className={cn(
                        "text-sm font-bold",
                        item.daysRemaining <= 7
                          ? "text-risk-high"
                          : item.daysRemaining <= 30
                          ? "text-risk-medium"
                          : "text-muted-foreground"
                      )}
                    >
                      {getDaysLabel(item.daysRemaining)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.deadline.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarClock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No upcoming deadlines in the next 90 days</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
