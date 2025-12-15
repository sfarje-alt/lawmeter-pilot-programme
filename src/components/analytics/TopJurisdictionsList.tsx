import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, TrendingUp } from "lucide-react";
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";
import { RegionIcon, regionThemes, RegionCode } from "@/components/regions/RegionConfig";
import { cn } from "@/lib/utils";

// Map jurisdiction regions to commercial region codes
const JURISDICTION_TO_REGION: Record<string, RegionCode> = {
  "USA": "NAM",
  "Canada": "NAM",
  "Japan": "APAC",
  "Korea": "APAC",
  "Taiwan": "APAC",
  "EU": "EU",
  "UAE": "GCC",
  "Saudi Arabia": "GCC",
  "Oman": "GCC",
  "Kuwait": "GCC",
  "Bahrain": "GCC",
  "Qatar": "GCC",
  "Peru": "LATAM",
  "Costa Rica": "LATAM",
};

// Region display names
const REGION_NAMES: Record<RegionCode, string> = {
  NAM: "North America",
  LATAM: "Latin America",
  EU: "European Union",
  GCC: "Gulf States",
  APAC: "Asia-Pacific",
};

interface RegionStats {
  region: RegionCode;
  name: string;
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
  // Aggregate by commercial region (NAM, LATAM, EU, GCC, APAC)
  const regionStats = useMemo(() => {
    const stats = new Map<RegionCode, RegionStats>();

    // Initialize all regions
    (["NAM", "LATAM", "EU", "GCC", "APAC"] as RegionCode[]).forEach((region) => {
      stats.set(region, {
        region,
        name: REGION_NAMES[region],
        total: 0,
        high: 0,
        medium: 0,
        low: 0,
        activityIndex: 0,
      });
    });

    data.forEach((item) => {
      // Map item's region to commercial region
      const commercialRegion = JURISDICTION_TO_REGION[item.region] || 
        (item.region as RegionCode in REGION_NAMES ? item.region as RegionCode : null);
      
      if (!commercialRegion || !stats.has(commercialRegion)) return;

      const s = stats.get(commercialRegion)!;
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

  // Map region back to a representative jurisdiction for navigation
  const regionToJurisdiction: Record<RegionCode, string> = {
    NAM: "USA",
    LATAM: "Costa Rica",
    EU: "EU",
    GCC: "UAE",
    APAC: "Japan",
  };

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
          {regionStats.map((stat) => {
            const theme = regionThemes[stat.region];
            const barWidth = (stat.activityIndex / maxActivity) * 100;
            const isSelected = selectedJurisdiction && 
              JURISDICTION_TO_REGION[selectedJurisdiction] === stat.region;

            return (
              <button
                key={stat.region}
                onClick={() => onSelectJurisdiction(regionToJurisdiction[stat.region])}
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
                    <RegionIcon region={stat.region} size={20} showCode={false} />
                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate flex items-center gap-2">
                        <span style={{ color: theme.primaryColor }}>{stat.region}</span>
                        <span className="text-muted-foreground font-normal">{stat.name}</span>
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

        {regionStats.length === 0 && (
          <div className="px-4 py-8 text-center text-muted-foreground text-sm">
            No jurisdiction data available for current filters
          </div>
        )}
      </CardContent>
    </Card>
  );
}
