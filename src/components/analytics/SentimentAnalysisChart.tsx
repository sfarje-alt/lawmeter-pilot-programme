import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, BillItem } from "@/types/legislation";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface SentimentAnalysisChartProps {
  data: Alert[] | BillItem[];
  type: "acts" | "bills";
}

export function SentimentAnalysisChart({ data, type }: SentimentAnalysisChartProps) {
  // Analyze sentiment based on risk indicators and language
  const analyzeSentiment = (item: Alert | BillItem) => {
    const text = type === "acts" 
      ? (item as Alert).AI_triage?.summary || ""
      : (item as BillItem).summary;
    
    const riskScore = type === "acts"
      ? (item as Alert).AI_triage?.risk_score_hint || 0
      : (item as BillItem).risk_score;

    // Simple sentiment analysis based on keywords and risk
    const negativeWords = ["risk", "threat", "danger", "concern", "violation", "breach", "penalty"];
    const positiveWords = ["opportunity", "benefit", "growth", "improvement", "advantage"];
    const neutralWords = ["update", "change", "amendment", "revision"];

    const lowerText = text.toLowerCase();
    const negativeCount = negativeWords.filter(w => lowerText.includes(w)).length;
    const positiveCount = positiveWords.filter(w => lowerText.includes(w)).length;
    const neutralCount = neutralWords.filter(w => lowerText.includes(w)).length;

    if (riskScore > 70 || negativeCount > positiveCount + 1) return "negative";
    if (riskScore < 30 && positiveCount > negativeCount) return "positive";
    return "neutral";
  };

  const sentimentCounts = data.reduce((acc, item) => {
    const sentiment = analyzeSentiment(item);
    acc[sentiment] = (acc[sentiment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = [
    { name: "Negative", value: sentimentCounts.negative || 0, color: "hsl(var(--risk-high))" },
    { name: "Neutral", value: sentimentCounts.neutral || 0, color: "hsl(var(--muted-foreground))" },
    { name: "Positive", value: sentimentCounts.positive || 0, color: "hsl(var(--success))" },
  ];

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Analysis</CardTitle>
        <CardDescription>
          Overall tone and sentiment of legislative content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-risk-high/10 border border-risk-high/20">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-risk-high" />
                <span className="font-medium">Negative</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{sentimentCounts.negative || 0}</div>
                <div className="text-xs text-muted-foreground">
                  {total ? ((((sentimentCounts.negative || 0) / total) * 100).toFixed(1)) : 0}%
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-center gap-2">
                <Minus className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">Neutral</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{sentimentCounts.neutral || 0}</div>
                <div className="text-xs text-muted-foreground">
                  {total ? ((((sentimentCounts.neutral || 0) / total) * 100).toFixed(1)) : 0}%
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/20">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-success" />
                <span className="font-medium">Positive</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{sentimentCounts.positive || 0}</div>
                <div className="text-xs text-muted-foreground">
                  {total ? ((((sentimentCounts.positive || 0) / total) * 100).toFixed(1)) : 0}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
