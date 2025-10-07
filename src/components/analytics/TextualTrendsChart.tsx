import { Alert, BillItem } from "@/types/legislation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

interface TextualTrendsChartProps {
  data: Alert[] | BillItem[];
  type: "acts" | "bills";
}

function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by", "from", "as", "is", "was", "are", "were", "been", "be", "have", "has", "had", "do", "does", "did", "will", "would", "should", "could", "may", "might", "must", "can", "shall"
  ]);
  
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word));
}

export function TextualTrendsChart({ data, type }: TextualTrendsChartProps) {
  const keywordCounts: Record<string, number> = {};
  
  if (type === "acts") {
    const alerts = data as Alert[];
    alerts.forEach(alert => {
      const text = [
        alert.AI_triage?.summary || "",
        ...(alert.AI_triage?.alert_bullets || [])
      ].join(" ");
      
      extractKeywords(text).forEach(keyword => {
        keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
      });
    });
  } else {
    const bills = data as BillItem[];
    bills.forEach(bill => {
      const text = [bill.summary, ...bill.bullets].join(" ");
      
      extractKeywords(text).forEach(keyword => {
        keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
      });
    });
  }
  
  const topKeywords = Object.entries(keywordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Trending Keywords & Topics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {topKeywords.map(([keyword, count]) => (
            <Badge 
              key={keyword} 
              variant="outline" 
              className="text-sm"
              style={{ 
                fontSize: `${Math.min(16, 10 + count)}px`,
                opacity: Math.min(1, 0.5 + (count / topKeywords[0][1]) * 0.5)
              }}
            >
              {keyword} ({count})
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
