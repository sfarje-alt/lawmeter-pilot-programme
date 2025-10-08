import { Alert } from "@/types/legislation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { parseDate } from "@/lib/dateUtils";

interface ComplianceDeadlineCalendarProps {
  alerts: Alert[];
}

export function ComplianceDeadlineCalendar({ alerts }: ComplianceDeadlineCalendarProps) {
  // Get alerts with deadlines in the next 90 days
  const now = new Date();
  const next90Days = new Date();
  next90Days.setDate(next90Days.getDate() + 90);

  const upcomingDeadlines = alerts
    .map(alert => ({
      alert,
      deadline: alert.AI_triage?.deadline_detected ? parseDate(alert.AI_triage.deadline_detected) : null,
      riskLevel: alert.AI_triage?.risk_level || "low"
    }))
    .filter(item => item.deadline && item.deadline >= now && item.deadline <= next90Days)
    .sort((a, b) => (a.deadline!.getTime() - b.deadline!.getTime()));

  // Group by week
  const weeklyDeadlines = upcomingDeadlines.reduce((acc, item) => {
    const weekStart = new Date(item.deadline!);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const key = weekStart.toISOString().split('T')[0];
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, typeof upcomingDeadlines>);

  const weeks = Object.entries(weeklyDeadlines)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(0, 12);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Compliance Deadline Calendar (Next 90 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {weeks.length === 0 ? (
          <p className="text-muted-foreground text-sm">No upcoming deadlines in the next 90 days</p>
        ) : (
          <div className="space-y-4">
            {weeks.map(([weekKey, items]) => {
              const weekDate = new Date(weekKey);
              const weekEnd = new Date(weekDate);
              weekEnd.setDate(weekEnd.getDate() + 6);
              
              return (
                <div key={weekKey} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-semibold">
                      {weekDate.toLocaleDateString("en-AU", { month: "short", day: "numeric" })} - {weekEnd.toLocaleDateString("en-AU", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                    <Badge variant="outline">{items.length} deadline{items.length > 1 ? 's' : ''}</Badge>
                  </div>
                  <div className="space-y-2">
                    {items.map(({ alert, deadline, riskLevel }) => (
                      <div key={alert.title_id} className="flex items-start gap-3 p-2 rounded bg-muted/50">
                        <Clock className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                          riskLevel === 'high' ? 'text-risk-high' : 
                          riskLevel === 'medium' ? 'text-risk-medium' : 
                          'text-risk-low'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{alert.title}</div>
                          <div className="text-xs text-muted-foreground">
                            Due: {deadline!.toLocaleDateString("en-AU", { weekday: 'short', month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                        <Badge variant={riskLevel === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                          {riskLevel}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
