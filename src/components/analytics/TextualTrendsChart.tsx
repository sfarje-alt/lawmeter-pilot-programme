import { Alert, BillItem } from "@/types/legislation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { useBusinessProfile } from "@/contexts/BusinessProfileContext";

interface TextualTrendsChartProps {
  data: Alert[] | BillItem[];
  type: "acts" | "bills";
}

function extractPortfolioKeywords(text: string, keywords: string[]): string[] {
  const lowerText = text.toLowerCase();
  const foundKeywords: string[] = [];
  
  keywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase();
    // Use word boundary regex for more accurate matching
    const regex = new RegExp(`\\b${keywordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
    const matches = lowerText.match(regex);
    if (matches) {
      foundKeywords.push(...Array(matches.length).fill(keyword));
    }
  });
  
  return foundKeywords;
}

export function TextualTrendsChart({ data, type }: TextualTrendsChartProps) {
  const { profile } = useBusinessProfile();
  const keywordCounts: Record<string, number> = {};
  
  if (type === "acts") {
    const alerts = data as Alert[];
    alerts.forEach(alert => {
      const text = [
        alert.title,
        alert.AI_triage?.summary || "",
        ...(alert.AI_triage?.alert_bullets || [])
      ].join(" ");
      
      extractPortfolioKeywords(text, profile.portfolioKeywords).forEach(keyword => {
        keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
      });
    });
  } else {
    const bills = data as BillItem[];
    bills.forEach(bill => {
      const text = [bill.title, bill.summary, ...bill.bullets].join(" ");
      
      extractPortfolioKeywords(text, profile.portfolioKeywords).forEach(keyword => {
        keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
      });
    });
  }
  
  const topKeywords = Object.entries(keywordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 40);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Portfolio Keywords Detected
        </CardTitle>
      </CardHeader>
      <CardContent>
        {topKeywords.length === 0 ? (
          <p className="text-muted-foreground text-sm">No portfolio keywords detected in current data</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {topKeywords.map(([keyword, count]) => (
              <Badge 
                key={keyword} 
                variant="secondary"
                className="text-sm transition-all hover:scale-105"
                style={{ 
                  fontSize: `${Math.min(16, 11 + Math.log(count) * 2)}px`,
                  fontWeight: count > 5 ? 600 : 400
                }}
              >
                {keyword} ({count})
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
