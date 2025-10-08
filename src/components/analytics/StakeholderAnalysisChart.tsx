import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BillItem } from "@/types/legislation";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Building2, ThumbsUp, ThumbsDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StakeholderAnalysisChartProps {
  bills: BillItem[];
}

export function StakeholderAnalysisChart({ bills }: StakeholderAnalysisChartProps) {
  // Aggregate stakeholder positions
  const positionStats = bills.reduce((acc, bill) => {
    bill.stakeholders?.forEach(stakeholder => {
      acc[stakeholder.position] = (acc[stakeholder.position] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const positionData = [
    { name: "Support", value: positionStats.support || 0, color: "hsl(var(--success))" },
    { name: "Oppose", value: positionStats.oppose || 0, color: "hsl(var(--destructive))" },
    { name: "Neutral", value: positionStats.neutral || 0, color: "hsl(var(--muted-foreground))" },
  ].filter(d => d.value > 0);

  // Group stakeholders by type/category
  const stakeholdersByType = bills.reduce((acc, bill) => {
    bill.stakeholders?.forEach(stakeholder => {
      const type = stakeholder.organization || "Individual";
      if (!acc[type]) {
        acc[type] = { support: 0, oppose: 0, neutral: 0 };
      }
      acc[type][stakeholder.position] += 1;
    });
    return acc;
  }, {} as Record<string, { support: number; oppose: number; neutral: number }>);

  const stakeholderTypeData = Object.entries(stakeholdersByType)
    .map(([type, positions]) => ({
      type: type.length > 20 ? type.substring(0, 20) + "..." : type,
      Support: positions.support,
      Oppose: positions.oppose,
      Neutral: positions.neutral,
    }))
    .sort((a, b) => (b.Support + b.Oppose + b.Neutral) - (a.Support + a.Oppose + a.Neutral))
    .slice(0, 10);

  // Get most active stakeholders
  const stakeholderActivity = bills.reduce((acc, bill) => {
    bill.stakeholders?.forEach(stakeholder => {
      if (!acc[stakeholder.name]) {
        acc[stakeholder.name] = { 
          count: 0, 
          positions: { support: 0, oppose: 0, neutral: 0 },
          organization: stakeholder.organization 
        };
      }
      acc[stakeholder.name].count += 1;
      acc[stakeholder.name].positions[stakeholder.position] += 1;
    });
    return acc;
  }, {} as Record<string, { count: number; positions: Record<string, number>; organization?: string }>);

  const topStakeholders = Object.entries(stakeholderActivity)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 5);

  const getPositionColor = (position: string) => {
    switch (position) {
      case "support": return "text-success border-success bg-success/10";
      case "oppose": return "text-destructive border-destructive bg-destructive/10";
      default: return "text-muted-foreground border-muted bg-muted/10";
    }
  };

  const getDominantPosition = (positions: Record<string, number>): string => {
    const entries = Object.entries(positions);
    const max = entries.reduce((a, b) => a[1] > b[1] ? a : b);
    return max[0];
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Stakeholder Positions
            </CardTitle>
            <CardDescription>
              Overall distribution of stakeholder positions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {positionData.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No stakeholder data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={positionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {positionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Positions by Organization Type</CardTitle>
            <CardDescription>
              How different types of organizations are positioned
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stakeholderTypeData.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No stakeholder data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stakeholderTypeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis type="number" />
                  <YAxis dataKey="type" type="category" width={100} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="Support" stackId="a" fill="hsl(var(--success))" />
                  <Bar dataKey="Oppose" stackId="a" fill="hsl(var(--destructive))" />
                  <Bar dataKey="Neutral" stackId="a" fill="hsl(var(--muted-foreground))" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Most Active Stakeholders</CardTitle>
          <CardDescription>
            Organizations and groups with the most legislative engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          {topStakeholders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No stakeholder data available</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topStakeholders.map(([name, data], index) => {
                const dominantPosition = getDominantPosition(data.positions);
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${getPositionColor(dominantPosition)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold">{name}</h4>
                        {data.organization && (
                          <p className="text-sm text-muted-foreground">{data.organization}</p>
                        )}
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {data.count} bills engaged
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground mb-1">Positions</div>
                        <div className="flex gap-1 text-xs">
                          {data.positions.support > 0 && (
                            <div className="flex items-center gap-1 text-success">
                              <ThumbsUp className="w-3 h-3" />
                              {data.positions.support}
                            </div>
                          )}
                          {data.positions.oppose > 0 && (
                            <div className="flex items-center gap-1 text-destructive">
                              <ThumbsDown className="w-3 h-3" />
                              {data.positions.oppose}
                            </div>
                          )}
                          {data.positions.neutral > 0 && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Minus className="w-3 h-3" />
                              {data.positions.neutral}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
