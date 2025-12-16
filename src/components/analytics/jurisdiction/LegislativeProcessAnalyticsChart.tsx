// Legislative Process Analytics Chart - Block B
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";
import { Info, GitBranch, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Cell
} from "recharts";
import { getStageDistribution, getThroughputByWeek, chartColors } from "./analyticsUtils";

interface LegislativeProcessAnalyticsChartProps {
  data: UnifiedLegislationItem[];
  jurisdictionCode: string;
  onBarClick: (stage: string, items: UnifiedLegislationItem[]) => void;
}

export function LegislativeProcessAnalyticsChart({ 
  data, 
  jurisdictionCode,
  onBarClick 
}: LegislativeProcessAnalyticsChartProps) {
  // Check if we have bills/proposals
  const hasBills = useMemo(() => {
    return data.some(item => 
      item.isPipeline && 
      (item.instrumentType?.toLowerCase().includes("bill") || 
       item.instrumentType?.toLowerCase().includes("proyecto") ||
       item.instrumentType?.toLowerCase().includes("proposal"))
    );
  }, [data]);
  
  // Stage distribution for bills
  const stageData = useMemo(() => {
    if (!hasBills) return [];
    
    const distribution = getStageDistribution(data);
    return distribution.slice(0, 8); // Top 8 stages
  }, [data, hasBills]);
  
  // Alternative: Regulatory actions timeline
  const regulatoryTimeline = useMemo(() => {
    if (hasBills) return [];
    
    const nonBillItems = data.filter(item => 
      !item.instrumentType?.toLowerCase().includes("bill") &&
      !item.instrumentType?.toLowerCase().includes("proyecto")
    );
    
    return getThroughputByWeek(nonBillItems, 12, "instrumentType");
  }, [data, hasBills]);
  
  if (hasBills) {
    // Bills by Stage view
    return (
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base font-medium">
                Bills/Proposals by Stage
              </CardTitle>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground/60" />
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs">
                  <p className="text-sm">
                    Distribution of pending bills/proposals across legislative stages. 
                    Click any bar to view items at that stage.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent>
          {stageData.length === 0 ? (
            <div className="h-[280px] flex items-center justify-center text-muted-foreground">
              Not enough data
            </div>
          ) : (
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={stageData} 
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 80, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    type="number"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <YAxis 
                    type="category"
                    dataKey="stage"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    width={75}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px"
                    }}
                    formatter={(value: number) => [`${value} items`, "Count"]}
                  />
                  <Bar
                    dataKey="count"
                    cursor="pointer"
                    onClick={(data) => onBarClick(data.stage, data.items)}
                  >
                    {stageData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={chartColors[index % chartColors.length]} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
  
  // Regulatory Actions Timeline (fallback when no bills)
  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base font-medium">
              Regulatory Actions Timeline
            </CardTitle>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground/60" />
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs">
                <p className="text-sm">
                  Weekly timeline of regulatory actions (regulations, guidance, decisions) 
                  when bill data is not tracked for this jurisdiction.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        {regulatoryTimeline.length === 0 ? (
          <div className="h-[280px] flex items-center justify-center text-muted-foreground">
            Not enough data
          </div>
        ) : (
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={regulatoryTimeline.map(w => ({ week: w.week, count: w.total }))} 
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="week"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px"
                  }}
                  formatter={(value: number) => [`${value} items`, "Count"]}
                />
                <Bar dataKey="count" fill={chartColors[0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
