import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, TrendingUp } from "lucide-react";
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";
import { RegionCode, regionThemes } from "@/components/regions/RegionConfig";
import { cn } from "@/lib/utils";

// Country display info with flags and commercial region mapping
const COUNTRY_INFO: Record<string, { flag: string; name: string; region: RegionCode }> = {
  "USA": { flag: "🇺🇸", name: "United States", region: "NAM" },
  "Canada": { flag: "🇨🇦", name: "Canada", region: "NAM" },
  "Japan": { flag: "🇯🇵", name: "Japan", region: "APAC" },
  "Korea": { flag: "🇰🇷", name: "South Korea", region: "APAC" },
  "Taiwan": { flag: "🇹🇼", name: "Taiwan", region: "APAC" },
  "EU": { flag: "🇪🇺", name: "European Union", region: "EU" },
  "UAE": { flag: "🇦🇪", name: "United Arab Emirates", region: "GCC" },
  "Saudi Arabia": { flag: "🇸🇦", name: "Saudi Arabia", region: "GCC" },
  "Oman": { flag: "🇴🇲", name: "Oman", region: "GCC" },
  "Kuwait": { flag: "🇰🇼", name: "Kuwait", region: "GCC" },
  "Bahrain": { flag: "🇧🇭", name: "Bahrain", region: "GCC" },
  "Qatar": { flag: "🇶🇦", name: "Qatar", region: "GCC" },
  "Peru": { flag: "🇵🇪", name: "Peru", region: "LATAM" },
  "Costa Rica": { flag: "🇨🇷", name: "Costa Rica", region: "LATAM" },
};

interface CountryStats {
  countryKey: string;
  name: string;
  flag: string;
  region: RegionCode;
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
  maxItems = 15,
}: TopJurisdictionsListProps) {
  // Aggregate by individual country (not commercial region)
  const countryStats = useMemo(() => {
    const stats = new Map<string, CountryStats>();

    // Initialize all tracked countries
    Object.entries(COUNTRY_INFO).forEach(([key, info]) => {
      stats.set(key, {
        countryKey: key,
        name: info.name,
        flag: info.flag,
        region: info.region,
        total: 0,
        high: 0,
        medium: 0,
        low: 0,
        activityIndex: 0,
      });
    });

    data.forEach((item) => {
      // Use jurisdictionCode or region to identify the country
      const countryKey = item.jurisdictionCode || item.region;
      
      if (!countryKey || !stats.has(countryKey)) return;

      const s = stats.get(countryKey)!;
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
      .filter((s) => s.total > 0) // Only show countries with data
      .sort((a, b) => b.activityIndex - a.activityIndex)
      .slice(0, maxItems);
  }, [data, maxItems]);

  const maxActivity = countryStats[0]?.activityIndex || 1;

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Countries by Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
          {countryStats.map((stat) => {
            const theme = regionThemes[stat.region];
            const barWidth = (stat.activityIndex / maxActivity) * 100;
            const isSelected = selectedJurisdiction === stat.countryKey;

            return (
              <button
                key={stat.countryKey}
                onClick={() => onSelectJurisdiction(stat.countryKey)}
                className={cn(
                  "w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors relative",
                  isSelected && "bg-primary/10"
                )}
              >
                {/* Activity bar background */}
                <div
                  className="absolute inset-y-0 left-0 transition-all opacity-20"
                  style={{ 
                    width: `${barWidth}%`,
                    backgroundColor: theme.primaryColor
                  }}
                />

                <div className="relative flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl">{stat.flag}</span>
                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate">
                        {stat.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stat.total} items • Index: {stat.activityIndex}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {stat.high > 0 && (
                      <Badge
                        variant="outline"
                        className="bg-risk-high/20 border-risk-high/50 text-risk-high text-xs px-2 min-w-[28px] justify-center"
                      >
                        {stat.high}
                      </Badge>
                    )}
                    {stat.medium > 0 && (
                      <Badge
                        variant="outline"
                        className="bg-risk-medium/20 border-risk-medium/50 text-risk-medium text-xs px-2 min-w-[28px] justify-center"
                      >
                        {stat.medium}
                      </Badge>
                    )}
                    {stat.low > 0 && (
                      <Badge
                        variant="outline"
                        className="bg-risk-low/20 border-risk-low/50 text-risk-low text-xs px-2 min-w-[28px] justify-center"
                      >
                        {stat.low}
                      </Badge>
                    )}
                    <ChevronRight className="w-4 h-4 text-muted-foreground ml-1" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {countryStats.length === 0 && (
          <div className="px-4 py-8 text-center text-muted-foreground text-sm">
            No jurisdiction data available for current filters
          </div>
        )}
      </CardContent>
    </Card>
  );
}
