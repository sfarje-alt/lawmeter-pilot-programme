// Effective Date Runway Chart - Block C
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";
import { Info, Calendar, AlertTriangle } from "lucide-react";
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
import { getRunwayDistribution, calculateShortRunwayShare, chartColors } from "./analyticsUtils";

interface EffectiveDateRunwayChartProps {
  data: UnifiedLegislationItem[];
  onBarClick: (bucket: string, items: UnifiedLegislationItem[]) => void;
}

export function EffectiveDateRunwayChart({ data, onBarClick }: EffectiveDateRunwayChartProps) {
  const distribution = useMemo(() => {
    return getRunwayDistribution(data);
  }, [data]);
  
  const shortRunwayShare = useMemo(() => {
    return calculateShortRunwayShare(data);
  }, [data]);
  
  const totalWithRunway = distribution.reduce((sum, b) => sum + b.count, 0);
  
  // Color coding: shorter runways get warmer colors
  const bucketColors = [
    "hsl(0, 70%, 50%)",     // 0-7: Red (urgent)
    "hsl(30, 70%, 50%)",    // 8-30: Orange
    "hsl(50, 70%, 50%)",    // 31-90: Yellow
    "hsl(120, 50%, 45%)",   // 91-180: Green
    "hsl(200, 60%, 50%)"    // 181+: Blue (comfortable)
  ];

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base font-medium">
              Effective Date Runway
            </CardTitle>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground/60" />
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs">
                <p className="text-sm">
                  Distribution of days between publication and effective date. 
                  Shorter runways mean less time for compliance preparation.
                  Click any bar to view items in that bucket.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          {/* Main Chart */}
          <div className="flex-1 h-[260px]">
            {totalWithRunway === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Not enough data (no items with effective dates)
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={distribution} 
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="bucket"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                    height={50}
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
                    formatter={(value: number, name: string, props: any) => {
                      const bucket = props.payload.bucket;
                      return [`${value} items`, bucket];
                    }}
                  />
                  <Bar
                    dataKey="count"
                    cursor="pointer"
                    onClick={(data) => onBarClick(data.bucket, data.items)}
                  >
                    {distribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={bucketColors[index]} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          
          {/* Callout Card */}
          <div className="w-32 flex-shrink-0">
            <div className="bg-muted/30 rounded-lg p-3 h-full flex flex-col justify-center">
              <div className="flex items-center gap-1.5 mb-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-medium text-muted-foreground">Short Runway</span>
              </div>
              <div className="text-3xl font-bold text-foreground">
                {shortRunwayShare}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                in 0-30d bucket
              </div>
              {shortRunwayShare > 30 && (
                <Badge variant="outline" className="mt-2 text-xs bg-amber-500/10 text-amber-500 border-amber-500/30">
                  High urgency
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
