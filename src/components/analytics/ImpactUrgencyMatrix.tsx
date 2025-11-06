import { Alert, BillItem } from "@/types/legislation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";
import { parseDate } from "@/lib/dateUtils";

interface ImpactUrgencyMatrixProps {
  data: Alert[] | BillItem[];
  type: "acts" | "bills";
}

export function ImpactUrgencyMatrix({ data, type }: ImpactUrgencyMatrixProps) {
  const now = new Date();
  const next30Days = new Date();
  next30Days.setDate(next30Days.getDate() + 30);

  const categorizedItems = data.map(item => {
    let impact: "high" | "medium" | "low" = "low";
    let urgency: "high" | "medium" | "low" = "low";
    let deadline: Date | null = null;

    if (type === "acts") {
      const alert = item as Alert;
      impact = alert.AI_triage?.risk_level as any || "low";
      if (alert.AI_triage?.deadline_detected) {
        deadline = parseDate(alert.AI_triage.deadline_detected);
        if (deadline && deadline <= next30Days) {
          urgency = "high";
        } else if (deadline && deadline <= new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)) {
          urgency = "medium";
        }
      }
    } else {
      const bill = item as BillItem;
      impact = bill.risk_level;
      // Bills in later stages are more urgent
      if (bill.status.includes("Aprobado") || bill.status.includes("Tercer Debate")) {
        urgency = "high";
      } else if (bill.status.includes("Primer Debate") || bill.status.includes("En comisión")) {
        urgency = "medium";
      }
    }

    return { item, impact, urgency };
  });

  const quadrants = {
    highImpactHighUrgency: categorizedItems.filter(i => i.impact === "high" && i.urgency === "high"),
    highImpactLowUrgency: categorizedItems.filter(i => i.impact === "high" && (i.urgency === "low" || i.urgency === "medium")),
    lowImpactHighUrgency: categorizedItems.filter(i => (i.impact === "low" || i.impact === "medium") && i.urgency === "high"),
    lowImpactLowUrgency: categorizedItems.filter(i => (i.impact === "low" || i.impact === "medium") && (i.urgency === "low" || i.urgency === "medium")),
  };

  const getTitle = (item: Alert | BillItem): string => {
    return type === "acts" ? (item as Alert).title : (item as BillItem).title;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Impact vs. Urgency Matrix
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* High Impact, High Urgency */}
          <div className="border-2 border-risk-high rounded-lg p-4 bg-risk-high/5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-sm">Critical & Urgent</h4>
              <Badge variant="destructive">{quadrants.highImpactHighUrgency.length}</Badge>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {quadrants.highImpactHighUrgency.slice(0, 5).map(({ item }) => (
                <div key={type === "acts" ? (item as Alert).title_id : (item as BillItem).id} 
                     className="text-xs p-2 bg-background rounded border">
                  {getTitle(item)}
                </div>
              ))}
              {quadrants.highImpactHighUrgency.length > 5 && (
                <div className="text-xs text-muted-foreground text-center">
                  +{quadrants.highImpactHighUrgency.length - 5} more
                </div>
              )}
            </div>
          </div>

          {/* High Impact, Low Urgency */}
          <div className="border-2 border-risk-medium rounded-lg p-4 bg-risk-medium/5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-sm">Critical but Not Urgent</h4>
              <Badge variant="secondary">{quadrants.highImpactLowUrgency.length}</Badge>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {quadrants.highImpactLowUrgency.slice(0, 5).map(({ item }) => (
                <div key={type === "acts" ? (item as Alert).title_id : (item as BillItem).id} 
                     className="text-xs p-2 bg-background rounded border">
                  {getTitle(item)}
                </div>
              ))}
              {quadrants.highImpactLowUrgency.length > 5 && (
                <div className="text-xs text-muted-foreground text-center">
                  +{quadrants.highImpactLowUrgency.length - 5} more
                </div>
              )}
            </div>
          </div>

          {/* Low Impact, High Urgency */}
          <div className="border-2 border-warning rounded-lg p-4 bg-warning/5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-sm">Urgent but Lower Impact</h4>
              <Badge variant="outline">{quadrants.lowImpactHighUrgency.length}</Badge>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {quadrants.lowImpactHighUrgency.slice(0, 5).map(({ item }) => (
                <div key={type === "acts" ? (item as Alert).title_id : (item as BillItem).id} 
                     className="text-xs p-2 bg-background rounded border">
                  {getTitle(item)}
                </div>
              ))}
              {quadrants.lowImpactHighUrgency.length > 5 && (
                <div className="text-xs text-muted-foreground text-center">
                  +{quadrants.lowImpactHighUrgency.length - 5} more
                </div>
              )}
            </div>
          </div>

          {/* Low Impact, Low Urgency */}
          <div className="border-2 border-muted rounded-lg p-4 bg-muted/30">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-sm">Monitor</h4>
              <Badge variant="outline">{quadrants.lowImpactLowUrgency.length}</Badge>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {quadrants.lowImpactLowUrgency.slice(0, 5).map(({ item }) => (
                <div key={type === "acts" ? (item as Alert).title_id : (item as BillItem).id} 
                     className="text-xs p-2 bg-background rounded border">
                  {getTitle(item)}
                </div>
              ))}
              {quadrants.lowImpactLowUrgency.length > 5 && (
                <div className="text-xs text-muted-foreground text-center">
                  +{quadrants.lowImpactLowUrgency.length - 5} more
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
