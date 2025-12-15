import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, TrendingUp, AlertTriangle } from "lucide-react";
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";
import { cn } from "@/lib/utils";

// ISO 3166-1 alpha-2 country codes with display labels
const JURISDICTION_LABELS: Record<string, { flag: string; name: string; iso: string }> = {
  "USA": { flag: "🇺🇸", name: "United States", iso: "US" },
  "Canada": { flag: "🇨🇦", name: "Canada", iso: "CA" },
  "Japan": { flag: "🇯🇵", name: "Japan", iso: "JP" },
  "Korea": { flag: "🇰🇷", name: "South Korea", iso: "KR" },
  "Taiwan": { flag: "🇹🇼", name: "Taiwan", iso: "TW" },
  "EU": { flag: "🇪🇺", name: "European Union", iso: "EU" },
  "UAE": { flag: "🇦🇪", name: "United Arab Emirates", iso: "AE" },
  "Saudi Arabia": { flag: "🇸🇦", name: "Saudi Arabia", iso: "SA" },
  "Oman": { flag: "🇴🇲", name: "Oman", iso: "OM" },
  "Kuwait": { flag: "🇰🇼", name: "Kuwait", iso: "KW" },
  "Bahrain": { flag: "🇧🇭", name: "Bahrain", iso: "BH" },
  "Qatar": { flag: "🇶🇦", name: "Qatar", iso: "QA" },
  "Peru": { flag: "🇵🇪", name: "Peru", iso: "PE" },
  "Costa Rica": { flag: "🇨🇷", name: "Costa Rica", iso: "CR" },
};

interface JurisdictionStats {
  jurisdiction: string;
  total: number;
  high: number;
  medium: number;
  low: number;
  activityIndex: number;
}

interface TopJurisdictionsListProps {
  data: UnifiedLegislationItem[];
  onSelectJurisdiction: (jurisdictionKey: string) => void;
  selectedJurisdiction: string | null;
  maxItems?: number;
}

export function TopJurisdictionsList({
  data,
  onSelectJurisdiction,
  selectedJurisdiction,
  maxItems = 10,
}: TopJurisdictionsListProps) {
  const jurisdictionStats = useMemo(() => {
    const stats = new Map<string, JurisdictionStats>();

    data.forEach((item) => {
      const key = item.region;
      if (!stats.has(key)) {
        stats.set(key, {
          jurisdiction: key,
          total: 0,
          high: 0,
          medium: 0,
          low: 0,
          activityIndex: 0,
        });
      }
      const s = stats.get(key)!;
      s.total++;
      if (item.riskLevel === "high") s.high++;
      else if (item.riskLevel === "medium") s.medium++;
      else s.low++;
    });

    // Calculate activity index: High * 3 + Medium * 2 + Low * 1
    stats.forEach((s) => {
      s.activityIndex = s.high * 3 + s.medium * 2 + s.low * 1;
    });

    return Array.from(stats.values())
      .sort((a, b) => b.activityIndex - a.activityIndex)
      .slice(0, maxItems);
  }, [data, maxItems]);

  const maxActivity = jurisdictionStats[0]?.activityIndex || 1;

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Top Jurisdictions by Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
          {jurisdictionStats.map((stat) => {
            const info = JURISDICTION_LABELS[stat.jurisdiction] || {
              flag: "🌍",
              name: stat.jurisdiction,
              iso: stat.jurisdiction.slice(0, 2).toUpperCase(),
            };
            const isSelected = selectedJurisdiction === stat.jurisdiction;
            const barWidth = (stat.activityIndex / maxActivity) * 100;

            return (
              <button
                key={stat.jurisdiction}
                onClick={() => onSelectJurisdiction(stat.jurisdiction)}
                className={cn(
                  "w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors relative",
                  isSelected && "bg-primary/10"
                )}
              >
                {/* Activity bar background */}
                <div
                  className="absolute inset-y-0 left-0 bg-primary/10 transition-all"
                  style={{ width: `${barWidth}%` }}
                />

                <div className="relative flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-lg">{info.flag}</span>
                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate">
                        {info.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stat.total} items • Index: {stat.activityIndex}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {stat.high > 0 && (
                      <Badge
                        variant="outline"
                        className="bg-risk-high/20 border-risk-high/30 text-risk-high text-xs px-1.5"
                      >
                        {stat.high}
                      </Badge>
                    )}
                    {stat.medium > 0 && (
                      <Badge
                        variant="outline"
                        className="bg-risk-medium/20 border-risk-medium/30 text-risk-medium text-xs px-1.5"
                      >
                        {stat.medium}
                      </Badge>
                    )}
                    {stat.low > 0 && (
                      <Badge
                        variant="outline"
                        className="bg-risk-low/20 border-risk-low/30 text-risk-low text-xs px-1.5"
                      >
                        {stat.low}
                      </Badge>
                    )}
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {jurisdictionStats.length === 0 && (
          <div className="px-4 py-8 text-center text-muted-foreground text-sm">
            No jurisdiction data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
