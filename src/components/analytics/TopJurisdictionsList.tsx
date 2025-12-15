import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, TrendingUp } from "lucide-react";
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";
import { RegionCode, regionThemes, RegionIcon } from "@/components/regions/RegionConfig";
import { cn } from "@/lib/utils";

// Commercial region configuration
const REGION_INFO: Record<RegionCode, { name: string; countries: string[] }> = {
  NAM: { name: "North America", countries: ["USA", "Canada"] },
  LATAM: { name: "Latin America", countries: ["Peru", "Costa Rica"] },
  EU: { name: "European Union", countries: ["EU"] },
  GCC: { name: "Gulf States", countries: ["UAE", "Saudi Arabia", "Oman", "Kuwait", "Bahrain", "Qatar"] },
  APAC: { name: "Asia-Pacific", countries: ["Japan", "Korea", "Taiwan"] },
};

interface RegionStats {
  regionKey: RegionCode;
  name: string;
  total: number;
  high: number;
  medium: number;
  low: number;
  activityIndex: number;
}

interface TopJurisdictionsListProps {
  data: UnifiedLegislationItem[];
  onSelectJurisdiction: (regionKey: string) => void;
  selectedJurisdiction: string | null;
  maxItems?: number;
}

export function TopJurisdictionsList({
  data,
  onSelectJurisdiction,
  selectedJurisdiction,
  maxItems = 10,
}: TopJurisdictionsListProps) {
  // Aggregate by commercial region
  const regionStats = useMemo(() => {
    const stats = new Map<RegionCode, RegionStats>();

    // Initialize all regions
    (Object.keys(REGION_INFO) as RegionCode[]).forEach((key) => {
      stats.set(key, {
        regionKey: key,
        name: REGION_INFO[key].name,
        total: 0,
        high: 0,
        medium: 0,
        low: 0,
        activityIndex: 0,
      });
    });

    data.forEach((item) => {
      const region = item.region as RegionCode;
      if (!region || !stats.has(region)) return;

      const s = stats.get(region)!;
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
      .filter((s) => s.total > 0) // Only show regions with data
      .sort((a, b) => b.activityIndex - a.activityIndex)
      .slice(0, maxItems);
  }, [data, maxItems]);

  const maxActivity = regionStats[0]?.activityIndex || 1;

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Activity per Commercial Region
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Click a region to view countries and detailed analytics
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
          {regionStats.map((stat) => {
            const theme = regionThemes[stat.regionKey];
            const barWidth = (stat.activityIndex / maxActivity) * 100;
            const isSelected = selectedJurisdiction === stat.regionKey;
            const regionCountries = REGION_INFO[stat.regionKey].countries;

            return (
              <button
                key={stat.regionKey}
                onClick={() => onSelectJurisdiction(stat.regionKey)}
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
                    backgroundColor: theme.primaryColor,
                  }}
                />

                <div className="relative flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <RegionIcon region={stat.regionKey} size={28} showCode={false} />
                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate">{stat.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {stat.total} items • {regionCountries.length} countries
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

        {regionStats.length === 0 && (
          <div className="px-4 py-8 text-center text-muted-foreground text-sm">
            No region data available for current filters
          </div>
        )}
      </CardContent>
    </Card>
  );
}
