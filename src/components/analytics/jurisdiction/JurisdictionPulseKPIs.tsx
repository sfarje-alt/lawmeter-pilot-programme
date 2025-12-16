// Jurisdiction Pulse KPIs - First Row
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";
import { Info, TrendingUp, TrendingDown, Minus, Clock, Activity, FileText, RefreshCw } from "lucide-react";
import { 
  calculatePublicationsMetric, 
  calculateVelocity, 
  calculateRunwayMetric, 
  calculateAmendmentIntensity,
  TimeWindow 
} from "./analyticsUtils";

interface JurisdictionPulseKPIsProps {
  data: UnifiedLegislationItem[];
  timeWindow: TimeWindow;
  onKpiClick: (filterId: string, filterDescription: string, items: UnifiedLegislationItem[]) => void;
}

export function JurisdictionPulseKPIs({ data, timeWindow, onKpiClick }: JurisdictionPulseKPIsProps) {
  const publications = calculatePublicationsMetric(data, parseInt(timeWindow) || 30);
  const velocity = calculateVelocity(data, 12);
  const runway = calculateRunwayMetric(data);
  const amendment = calculateAmendmentIntensity(data, 90);
  
  const kpis = [
    {
      id: "new-publications",
      label: "New Publications",
      subLabel: `${timeWindow}d`,
      value: publications.count,
      change: publications.change,
      icon: FileText,
      tooltip: `Number of new legislative/regulatory publications in this jurisdiction over the past ${timeWindow} days, compared to the prior period.`,
      onClick: () => {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - parseInt(timeWindow));
        const items = data.filter(item => {
          const date = item.publishedDate ? new Date(item.publishedDate) : null;
          return date && date >= cutoff;
        });
        onKpiClick("new-publications", `Publications in last ${timeWindow} days`, items);
      }
    },
    {
      id: "velocity",
      label: "Regulatory Velocity",
      subLabel: "avg/week",
      value: velocity.average,
      sparkline: velocity.sparklineData,
      icon: Activity,
      tooltip: "Average weekly publication rate over the past 3 months. Higher velocity = more active regulatory environment.",
      onClick: () => {
        onKpiClick("velocity", "All publications in velocity period", data);
      }
    },
    {
      id: "runway",
      label: "Median Implementation",
      subLabel: runway.sampleSize > 0 ? `n=${runway.sampleSize}` : "no data",
      value: runway.median !== null ? `${runway.median}d` : "—",
      icon: Clock,
      tooltip: "Median number of days between publication and effective date. Shorter runway = less compliance preparation time.",
      onClick: () => {
        const items = data.filter(item => item.effectiveDate && item.publishedDate);
        onKpiClick("runway", "Items with effective dates", items);
      }
    },
    {
      id: "amendment",
      label: "Amendment Intensity",
      subLabel: "90d",
      value: amendment.percentage !== null ? `${amendment.percentage}%` : "—",
      icon: RefreshCw,
      tooltip: "Percentage of recent publications that amend existing legislation vs. new original documents.",
      hidden: amendment.percentage === null,
      onClick: () => {
        const items = data.filter(item => 
          item.aiSummary?.relatedLegislation?.some(rel => rel.relationship === "amends")
        );
        onKpiClick("amendment", "Amending documents", items);
      }
    }
  ];

  return (
    <TooltipProvider>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.filter(kpi => !kpi.hidden).map(kpi => (
          <Card 
            key={kpi.id}
            className="bg-card/50 border-border/50 cursor-pointer hover:bg-card/70 transition-colors"
            onClick={kpi.onClick}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <kpi.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {kpi.label}
                  </span>
                </div>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3.5 w-3.5 text-muted-foreground/60" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="text-sm">{kpi.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {kpi.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {kpi.subLabel}
                  </div>
                </div>
                
                {kpi.change !== undefined && (
                  <div className={`flex items-center gap-1 text-xs ${
                    kpi.change > 0 ? "text-amber-500" : 
                    kpi.change < 0 ? "text-emerald-500" : "text-muted-foreground"
                  }`}>
                    {kpi.change > 0 ? <TrendingUp className="h-3 w-3" /> : 
                     kpi.change < 0 ? <TrendingDown className="h-3 w-3" /> : 
                     <Minus className="h-3 w-3" />}
                    <span>{kpi.change > 0 ? "+" : ""}{kpi.change}%</span>
                  </div>
                )}
                
                {kpi.sparkline && (
                  <div className="flex items-end gap-0.5 h-8">
                    {kpi.sparkline.map((val, i) => (
                      <div 
                        key={i}
                        className="w-1.5 bg-primary/60 rounded-sm"
                        style={{ 
                          height: `${Math.max(2, (val / Math.max(...kpi.sparkline!, 1)) * 100)}%` 
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TooltipProvider>
  );
}
