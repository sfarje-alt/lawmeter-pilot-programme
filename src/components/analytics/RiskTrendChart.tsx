import { useMemo } from "react";
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface RiskTrendChartProps {
  data: UnifiedLegislationItem[];
}

export function RiskTrendChart({ data }: RiskTrendChartProps) {
  const chartData = useMemo(() => {
    // Group by month
    const monthlyData = new Map<string, { high: number; medium: number; low: number }>();

    data.forEach((item) => {
      const date = new Date(item.publishedDate || item.effectiveDate || "");
      if (isNaN(date.getTime())) return;

      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { high: 0, medium: 0, low: 0 });
      }

      const monthStats = monthlyData.get(monthKey)!;
      if (item.riskLevel === "high") monthStats.high++;
      else if (item.riskLevel === "medium") monthStats.medium++;
      else monthStats.low++;
    });

    // Convert to array and sort
    return Array.from(monthlyData.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-12) // Last 12 months
      .map(([month, stats]) => ({
        month: new Date(month + "-01").toLocaleDateString("en-US", {
          month: "short",
          year: "2-digit",
        }),
        ...stats,
        total: stats.high + stats.medium + stats.low,
      }));
  }, [data]);

  return (
    <Card className="glass-card border-border/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="h-5 w-5 text-primary" />
          Risk Trend Over Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "11px" }}
                />
                <Line
                  type="monotone"
                  dataKey="high"
                  stroke="hsl(var(--risk-high))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--risk-high))", strokeWidth: 0, r: 3 }}
                  name="High Risk"
                />
                <Line
                  type="monotone"
                  dataKey="medium"
                  stroke="hsl(var(--risk-medium))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--risk-medium))", strokeWidth: 0, r: 3 }}
                  name="Medium Risk"
                />
                <Line
                  type="monotone"
                  dataKey="low"
                  stroke="hsl(var(--risk-low))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--risk-low))", strokeWidth: 0, r: 3 }}
                  name="Low Risk"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No trend data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
