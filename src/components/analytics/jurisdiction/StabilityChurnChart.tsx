// Stability & Churn Chart - Block D (Optional)
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";
import { Info, Layers, RefreshCw } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend
} from "recharts";
import { calculateAmendmentIntensity } from "./analyticsUtils";

interface StabilityChurnChartProps {
  data: UnifiedLegislationItem[];
  onSegmentClick: (type: "original" | "amending", items: UnifiedLegislationItem[]) => void;
}

export function StabilityChurnChart({ data, onSegmentClick }: StabilityChurnChartProps) {
  const amendmentData = useMemo(() => {
    return calculateAmendmentIntensity(data, 365); // Full year
  }, [data]);
  
  // Get top amended instruments
  const topAmendedInstruments = useMemo(() => {
    const amendmentCounts: Record<string, { title: string; count: number; id: string }> = {};
    
    data.forEach(item => {
      const amended = item.aiSummary?.relatedLegislation?.filter(rel => rel.relationship === "amends");
      if (amended) {
        amended.forEach(rel => {
          if (!amendmentCounts[rel.identifier]) {
            amendmentCounts[rel.identifier] = { 
              title: rel.title, 
              count: 0, 
              id: rel.identifier 
            };
          }
          amendmentCounts[rel.identifier].count++;
        });
      }
    });
    
    return Object.values(amendmentCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [data]);
  
  // If no amendment data available, don't render this block
  if (amendmentData.percentage === null || amendmentData.percentage === 0) {
    return null;
  }
  
  const pieData = [
    { name: "Original", value: amendmentData.originalCount, color: "hsl(200, 60%, 50%)" },
    { name: "Amending", value: amendmentData.amendingCount, color: "hsl(30, 70%, 50%)" }
  ];
  
  const handleClick = (type: "original" | "amending") => {
    if (type === "amending") {
      const items = data.filter(item => 
        item.aiSummary?.relatedLegislation?.some(rel => rel.relationship === "amends")
      );
      onSegmentClick("amending", items);
    } else {
      const items = data.filter(item => 
        !item.aiSummary?.relatedLegislation?.some(rel => rel.relationship === "amends")
      );
      onSegmentClick("original", items);
    }
  };

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base font-medium">
              Stability & Amendment Churn
            </CardTitle>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground/60" />
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs">
                <p className="text-sm">
                  Shows the mix of original vs. amending documents over the past 12 months.
                  High amendment activity indicates a volatile regulatory environment.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-6">
          {/* Pie Chart */}
          <div className="w-1/2 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  dataKey="value"
                  cursor="pointer"
                  onClick={(data) => handleClick(data.name.toLowerCase() as "original" | "amending")}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px"
                  }}
                  formatter={(value: number, name: string) => [`${value} items`, name]}
                />
                <Legend 
                  wrapperStyle={{ fontSize: "11px" }}
                  formatter={(value) => <span className="text-muted-foreground">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Amendment Chain List */}
          <div className="w-1/2">
            <div className="flex items-center gap-2 mb-3">
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Most Amended (12m)
              </span>
            </div>
            {topAmendedInstruments.length === 0 ? (
              <div className="text-xs text-muted-foreground">
                No amendment chain data available
              </div>
            ) : (
              <div className="space-y-2">
                {topAmendedInstruments.map((item, index) => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-muted-foreground truncate flex-1 mr-2" title={item.title}>
                      {index + 1}. {item.id}
                    </span>
                    <span className="font-medium text-foreground">
                      {item.count}x
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
