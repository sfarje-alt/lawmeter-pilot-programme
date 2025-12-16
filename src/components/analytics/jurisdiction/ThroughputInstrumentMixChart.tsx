// Throughput & Instrument Mix Chart - Block A
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";
import { Info, BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Cell,
  Tooltip as RechartsTooltip
} from "recharts";
import { 
  getThroughputByWeek, 
  getUniqueInstrumentTypes, 
  getUniqueSourceTypes,
  getInstrumentLocalLabel,
  chartColors,
  NormalizeBy 
} from "./analyticsUtils";

interface ThroughputInstrumentMixChartProps {
  data: UnifiedLegislationItem[];
  jurisdictionCode: string;
  normalizeBy: NormalizeBy;
  onBarClick: (week: string, type: string, items: UnifiedLegislationItem[]) => void;
}

export function ThroughputInstrumentMixChart({ 
  data, 
  jurisdictionCode,
  normalizeBy,
  onBarClick 
}: ThroughputInstrumentMixChartProps) {
  const [groupBy, setGroupBy] = useState<"instrumentType" | "sourceType">("instrumentType");
  
  const throughputData = useMemo(() => {
    return getThroughputByWeek(data, 12, groupBy);
  }, [data, groupBy]);
  
  const categories = useMemo(() => {
    return groupBy === "instrumentType" 
      ? getUniqueInstrumentTypes(data)
      : getUniqueSourceTypes(data);
  }, [data, groupBy]);
  
  // Normalize data based on setting
  const chartData = useMemo(() => {
    return throughputData.map(week => {
      const normalized: Record<string, number | string> = { week: week.week };
      
      categories.forEach(cat => {
        const value = week.data[cat] || 0;
        if (normalizeBy === "percent" && week.total > 0) {
          normalized[cat] = Math.round((value / week.total) * 100);
        } else if (normalizeBy === "per-week") {
          normalized[cat] = value; // Already per-week
        } else {
          normalized[cat] = value;
        }
      });
      
      return normalized;
    });
  }, [throughputData, categories, normalizeBy]);
  
  const handleBarClick = (weekData: any, category: string) => {
    const weekInfo = throughputData.find(w => w.week === weekData.week);
    if (!weekInfo) return;
    
    const items = data.filter(item => {
      const itemDate = item.publishedDate ? new Date(item.publishedDate) : null;
      if (!itemDate) return false;
      
      const weekEnd = new Date(weekInfo.weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      
      const inWeek = itemDate >= weekInfo.weekStart && itemDate < weekEnd;
      const matchesCategory = groupBy === "instrumentType" 
        ? item.instrumentType === category
        : true; // For source type, would need inferSourceType
      
      return inWeek && matchesCategory;
    });
    
    onBarClick(weekData.week, category, items);
  };

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base font-medium">
              Throughput & Instrument Mix
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-md overflow-hidden border border-border/50">
              <Button
                variant={groupBy === "instrumentType" ? "secondary" : "ghost"}
                size="sm"
                className="rounded-none text-xs h-7"
                onClick={() => setGroupBy("instrumentType")}
              >
                By Type
              </Button>
              <Button
                variant={groupBy === "sourceType" ? "secondary" : "ghost"}
                size="sm"
                className="rounded-none text-xs h-7"
                onClick={() => setGroupBy("sourceType")}
              >
                By Source
              </Button>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground/60" />
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs">
                  <p className="text-sm">
                    Weekly publication volume over the last 12 weeks, segmented by {groupBy === "instrumentType" ? "document type" : "source channel"}. 
                    Click any bar segment to view underlying items.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="week" 
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis 
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                label={normalizeBy === "percent" ? { value: "%", position: "insideLeft", offset: 10 } : undefined}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px"
                }}
                formatter={(value: number, name: string) => {
                  const localLabel = groupBy === "instrumentType" 
                    ? getInstrumentLocalLabel(name, jurisdictionCode)
                    : name;
                  return [
                    `${value}${normalizeBy === "percent" ? "%" : ""}`,
                    localLabel !== name ? `${name} (${localLabel})` : name
                  ];
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: "11px" }}
                formatter={(value) => {
                  const localLabel = groupBy === "instrumentType" 
                    ? getInstrumentLocalLabel(value, jurisdictionCode)
                    : value;
                  return localLabel !== value ? `${value} (${localLabel})` : value;
                }}
              />
              {categories.map((category, index) => (
                <Bar
                  key={category}
                  dataKey={category}
                  stackId="a"
                  fill={chartColors[index % chartColors.length]}
                  cursor="pointer"
                  onClick={(data) => handleBarClick(data, category)}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
