// Institutional Shape KPIs - Second Row
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";
import { Info, Building2, Scale, MessageSquare, Database } from "lucide-react";
import { 
  calculateTopAuthorityShare, 
  calculateConcentrationIndex, 
  calculateOpenConsultations,
  calculateDataFreshness,
  TimeWindow 
} from "./analyticsUtils";

interface InstitutionalShapeKPIsProps {
  data: UnifiedLegislationItem[];
  timeWindow: TimeWindow;
  onKpiClick: (filterId: string, filterDescription: string, items: UnifiedLegislationItem[]) => void;
}

export function InstitutionalShapeKPIs({ data, timeWindow, onKpiClick }: InstitutionalShapeKPIsProps) {
  const topAuthority = calculateTopAuthorityShare(data, parseInt(timeWindow) || 30);
  const concentration = calculateConcentrationIndex(data, 90);
  const consultations = calculateOpenConsultations(data);
  const freshness = calculateDataFreshness(data);
  
  const kpis = [
    {
      id: "top-authority",
      label: "Top Authority Share",
      value: `${topAuthority.share}%`,
      subLabel: topAuthority.topAuthority.length > 20 
        ? topAuthority.topAuthority.substring(0, 20) + "..." 
        : topAuthority.topAuthority,
      icon: Building2,
      tooltip: `Share of recent publications attributable to the single most-active issuing authority (${topAuthority.topAuthority}: ${topAuthority.count} items). High share = concentrated regulatory power.`,
      onClick: () => {
        const items = data.filter(item => item.authority === topAuthority.topAuthority);
        onKpiClick("top-authority", `Publications by ${topAuthority.topAuthority}`, items);
      }
    },
    {
      id: "concentration",
      label: "Authority Concentration",
      value: concentration.level,
      subLabel: `HHI: ${concentration.index}`,
      icon: Scale,
      badgeColor: concentration.level === "High" ? "bg-amber-500/20 text-amber-400" :
                  concentration.level === "Medium" ? "bg-yellow-500/20 text-yellow-400" :
                  "bg-emerald-500/20 text-emerald-400",
      tooltip: "Measures how concentrated regulatory output is across authorities using the Herfindahl-Hirschman Index (HHI). High (>2500) = few authorities dominate; Medium (1500-2500) = moderate concentration; Low (<1500) = distributed output.",
      onClick: () => {
        // Group by authority and show breakdown
        onKpiClick("concentration", "All authorities breakdown", data);
      }
    },
    {
      id: "consultations",
      label: "Consultations Open",
      value: consultations,
      subLabel: "active now",
      icon: MessageSquare,
      hidden: consultations === 0,
      tooltip: "Number of items currently in public consultation phase with open comment windows.",
      onClick: () => {
        const items = data.filter(item => 
          item.status?.toLowerCase().includes("consulta") ||
          item.status?.toLowerCase().includes("consultation") ||
          item.status?.toLowerCase().includes("comment")
        );
        onKpiClick("consultations", "Open consultations", items);
      }
    },
    {
      id: "freshness",
      label: "Data Freshness",
      value: `${freshness.last7d}%`,
      subLabel: "updated 7d",
      icon: Database,
      tooltip: `Percentage of tracked sources successfully updated recently. ${freshness.last24h}% updated in last 24h, ${freshness.last7d}% in last 7 days. Lower freshness = potential data gaps.`,
      onClick: () => {
        const week = new Date();
        week.setDate(week.getDate() - 7);
        const items = data.filter(item => {
          const date = item.lastUpdated || item.publishedDate;
          return date && new Date(date) >= week;
        });
        onKpiClick("freshness", "Recently updated items", items);
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
              
              <div>
                {kpi.badgeColor ? (
                  <div className={`inline-flex items-center px-2 py-1 rounded text-lg font-bold ${kpi.badgeColor}`}>
                    {kpi.value}
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-foreground">
                    {kpi.value}
                  </div>
                )}
                <div className="text-xs text-muted-foreground mt-1 truncate" title={kpi.subLabel}>
                  {kpi.subLabel}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TooltipProvider>
  );
}
