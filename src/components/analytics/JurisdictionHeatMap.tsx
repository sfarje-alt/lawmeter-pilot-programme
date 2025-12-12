import { UnifiedLegislationItem } from "@/types/unifiedLegislation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface JurisdictionHeatMapProps {
  data: UnifiedLegislationItem[];
}

interface JurisdictionStats {
  code: string;
  label: string;
  flag: string;
  total: number;
  high: number;
  medium: number;
  low: number;
}

export function JurisdictionHeatMap({ data }: JurisdictionHeatMapProps) {
  // Aggregate by jurisdiction
  const jurisdictionMap = new Map<string, JurisdictionStats>();

  const jurisdictionMeta: Record<string, { label: string; flag: string }> = {
    USA: { label: "United States", flag: "🇺🇸" },
    Canada: { label: "Canada", flag: "🇨🇦" },
    EU: { label: "European Union", flag: "🇪🇺" },
    Japan: { label: "Japan", flag: "🇯🇵" },
    Korea: { label: "Korea", flag: "🇰🇷" },
    Taiwan: { label: "Taiwan", flag: "🇹🇼" },
    UAE: { label: "UAE", flag: "🇦🇪" },
    "Saudi Arabia": { label: "Saudi Arabia", flag: "🇸🇦" },
    Oman: { label: "Oman", flag: "🇴🇲" },
    Kuwait: { label: "Kuwait", flag: "🇰🇼" },
    Bahrain: { label: "Bahrain", flag: "🇧🇭" },
    Qatar: { label: "Qatar", flag: "🇶🇦" },
    "Costa Rica": { label: "Costa Rica", flag: "🇨🇷" },
  };

  data.forEach((item) => {
    const code = item.jurisdictionCode;
    const meta = jurisdictionMeta[code] || { label: code, flag: "🌐" };
    
    if (!jurisdictionMap.has(code)) {
      jurisdictionMap.set(code, {
        code,
        label: meta.label,
        flag: meta.flag,
        total: 0,
        high: 0,
        medium: 0,
        low: 0,
      });
    }

    const stats = jurisdictionMap.get(code)!;
    stats.total++;
    if (item.riskLevel === "high") stats.high++;
    else if (item.riskLevel === "medium") stats.medium++;
    else stats.low++;
  });

  const jurisdictions = Array.from(jurisdictionMap.values())
    .sort((a, b) => b.total - a.total);

  const maxTotal = Math.max(...jurisdictions.map((j) => j.total), 1);

  const getRiskIntensity = (stats: JurisdictionStats) => {
    if (stats.total === 0) return 0;
    const riskScore = (stats.high * 3 + stats.medium * 2 + stats.low) / stats.total;
    return riskScore / 3; // Normalize to 0-1
  };

  return (
    <Card className="glass-card border-border/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Globe className="h-5 w-5 text-primary" />
          Jurisdiction Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {jurisdictions.slice(0, 8).map((j) => {
            const widthPct = (j.total / maxTotal) * 100;
            const riskIntensity = getRiskIntensity(j);
            
            return (
              <div key={j.code} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span>{j.flag}</span>
                    <span className="font-medium">{j.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{j.total}</span>
                    {j.high > 0 && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-risk-high/20 text-risk-high">
                        {j.high} high
                      </span>
                    )}
                  </div>
                </div>
                <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      riskIntensity > 0.6
                        ? "bg-gradient-to-r from-risk-high to-risk-high/70"
                        : riskIntensity > 0.4
                        ? "bg-gradient-to-r from-risk-medium to-risk-medium/70"
                        : "bg-gradient-to-r from-risk-low to-risk-low/70"
                    )}
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            );
          })}

          {jurisdictions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No jurisdiction data available
            </div>
          )}

          {jurisdictions.length > 8 && (
            <div className="text-xs text-center text-muted-foreground pt-2">
              +{jurisdictions.length - 8} more jurisdictions
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
