import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, BillItem } from "@/types/legislation";
import { Badge } from "@/components/ui/badge";
import { Network, Hash } from "lucide-react";

interface TopicClustersChartProps {
  data: Alert[] | BillItem[];
  type: "acts" | "bills";
}

export function TopicClustersChart({ data, type }: TopicClustersChartProps) {
  // Extract and cluster topics from the data
  const extractTopics = () => {
    const topicMap = new Map<string, { count: number; items: string[]; avgRisk: number }>();

    data.forEach((item) => {
      const topics = type === "acts"
        ? (item as Alert).AI_triage?.affected_units || []
        : [(item as BillItem).portfolio || "General"];

      const riskScore = type === "acts"
        ? (item as Alert).AI_triage?.risk_score_hint || 0
        : (item as BillItem).risk_score;

      const title = type === "acts"
        ? (item as Alert).title
        : (item as BillItem).title;

      topics.forEach((topic) => {
        if (!topicMap.has(topic)) {
          topicMap.set(topic, { count: 0, items: [], avgRisk: 0 });
        }
        const cluster = topicMap.get(topic)!;
        cluster.count += 1;
        cluster.items.push(title);
        cluster.avgRisk = ((cluster.avgRisk * (cluster.count - 1)) + riskScore) / cluster.count;
      });
    });

    return Array.from(topicMap.entries())
      .map(([topic, data]) => ({ topic, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);
  };

  const topics = extractTopics();

  const getRiskColor = (risk: number) => {
    if (risk >= 70) return "hsl(var(--risk-high))";
    if (risk >= 40) return "hsl(var(--risk-medium))";
    return "hsl(var(--risk-low))";
  };

  const maxCount = Math.max(...topics.map(t => t.count), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="w-5 h-5" />
          Topic Clusters
        </CardTitle>
        <CardDescription>
          Main themes and their distribution across legislation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((topicData, index) => (
            <div
              key={index}
              className="relative p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
              style={{
                borderLeftWidth: "4px",
                borderLeftColor: getRiskColor(topicData.avgRisk),
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-sm line-clamp-2 flex-1">
                  {topicData.topic}
                </h4>
                <Badge variant="secondary" className="ml-2 shrink-0">
                  {topicData.count}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Avg Risk:</span>
                  <span className="font-medium" style={{ color: getRiskColor(topicData.avgRisk) }}>
                    {topicData.avgRisk.toFixed(0)}
                  </span>
                </div>

                <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(topicData.count / maxCount) * 100}%`,
                      backgroundColor: getRiskColor(topicData.avgRisk),
                      opacity: 0.7,
                    }}
                  />
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Hash className="w-3 h-3" />
                  <span>{((topicData.count / data.length) * 100).toFixed(1)}% of total</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {topics.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Network className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No topics detected in current dataset</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
