import { Card, CardContent } from "@/components/ui/card";
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";
import { FileText, AlertTriangle, Clock, Globe, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalyticsKPIRowProps {
  data: UnifiedLegislationItem[];
  allData: UnifiedLegislationItem[];
}

export function AnalyticsKPIRow({ data, allData }: AnalyticsKPIRowProps) {
  const totalItems = data.length;
  const highRiskItems = data.filter((d) => d.riskLevel === "high").length;
  const criticalUrgent = data.filter((d) => {
    if (d.riskLevel !== "high") return false;
    if (!d.complianceDeadline) return false;
    const deadline = new Date(d.complianceDeadline);
    const now = new Date();
    const days30 = new Date();
    days30.setDate(days30.getDate() + 30);
    return deadline <= days30 && deadline >= now;
  }).length;

  const upcomingDeadlines = data.filter((d) => {
    if (!d.complianceDeadline) return false;
    const deadline = new Date(d.complianceDeadline);
    const now = new Date();
    const days30 = new Date();
    days30.setDate(days30.getDate() + 30);
    return deadline <= days30 && deadline >= now;
  }).length;

  const activeJurisdictions = new Set(data.map((d) => d.jurisdictionCode)).size;

  // Calculate percentage changes (mock comparison)
  const highRiskPct = allData.length > 0 ? Math.round((highRiskItems / data.length) * 100) : 0;
  const prevHighRiskPct = 18; // Mock previous period value

  const kpis = [
    {
      label: "Total Items",
      value: totalItems,
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "High Risk",
      value: highRiskItems,
      icon: AlertTriangle,
      color: "text-risk-high",
      bgColor: "bg-risk-high/10",
      change: highRiskPct - prevHighRiskPct,
      suffix: `${highRiskPct}%`,
    },
    {
      label: "Critical & Urgent",
      value: criticalUrgent,
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      description: "High risk, deadline < 30 days",
    },
    {
      label: "Upcoming Deadlines",
      value: upcomingDeadlines,
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
      description: "Next 30 days",
    },
    {
      label: "Jurisdictions",
      value: activeJurisdictions,
      icon: Globe,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {kpis.map((kpi) => (
        <Card key={kpi.label} className="glass-card border-border/30">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">{kpi.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">{kpi.value}</span>
                  {kpi.suffix && (
                    <span className="text-xs text-muted-foreground">({kpi.suffix})</span>
                  )}
                </div>
                {kpi.change !== undefined && (
                  <div className={cn(
                    "flex items-center gap-1 text-xs",
                    kpi.change > 0 ? "text-risk-high" : "text-success"
                  )}>
                    {kpi.change > 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>{kpi.change > 0 ? "+" : ""}{kpi.change}% vs prev</span>
                  </div>
                )}
                {kpi.description && (
                  <p className="text-xs text-muted-foreground">{kpi.description}</p>
                )}
              </div>
              <div className={cn("p-2 rounded-lg", kpi.bgColor)}>
                <kpi.icon className={cn("w-4 h-4", kpi.color)} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
