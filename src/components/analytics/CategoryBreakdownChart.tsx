import { useMemo } from "react";
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutGrid } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface CategoryBreakdownChartProps {
  data: UnifiedLegislationItem[];
}

export function CategoryBreakdownChart({ data }: CategoryBreakdownChartProps) {
  const chartData = useMemo(() => {
    const categoryMap = new Map<
      string,
      { category: string; high: number; medium: number; low: number; total: number }
    >();

    data.forEach((item) => {
      const category = item.regulatoryCategory || "Other";

      if (!categoryMap.has(category)) {
        categoryMap.set(category, {
          category,
          high: 0,
          medium: 0,
          low: 0,
          total: 0,
        });
      }

      const stats = categoryMap.get(category)!;
      stats.total++;
      if (item.riskLevel === "high") stats.high++;
      else if (item.riskLevel === "medium") stats.medium++;
      else stats.low++;
    });

    return Array.from(categoryMap.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 6);
  }, [data]);

  const getBarColor = (entry: typeof chartData[0]) => {
    const highPct = entry.high / entry.total;
    if (highPct > 0.5) return "hsl(var(--risk-high))";
    if (highPct > 0.25) return "hsl(var(--risk-medium))";
    return "hsl(var(--risk-low))";
  };

  return (
    <Card className="glass-card border-border/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <LayoutGrid className="h-5 w-5 text-primary" />
          Regulatory Category Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ left: 0, right: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  opacity={0.3}
                  horizontal={true}
                  vertical={false}
                />
                <XAxis
                  type="number"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                  formatter={(value: number, name: string, entry: any) => {
                    const item = entry.payload;
                    return [
                      <span key="breakdown">
                        {value} total ({item.high} high, {item.medium} medium, {item.low} low)
                      </span>,
                      "",
                    ];
                  }}
                />
                <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No category data available
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-risk-high" />
            <span className="text-muted-foreground">&gt;50% high risk</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-risk-medium" />
            <span className="text-muted-foreground">25-50% high risk</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-risk-low" />
            <span className="text-muted-foreground">&lt;25% high risk</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
