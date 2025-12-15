import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  FileText, 
  AlertTriangle, 
  Clock, 
  TrendingUp,
  X,
  ExternalLink
} from "lucide-react";
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";
import { RiskTrendChart } from "./RiskTrendChart";
import { CategoryBreakdownChart } from "./CategoryBreakdownChart";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// ISO codes for subdivisions
const SUBDIVISION_LABELS: Record<string, Record<string, string>> = {
  USA: {
    "California": "US-CA",
    "Texas": "US-TX",
    "New York": "US-NY",
    "Florida": "US-FL",
    // Add more as needed
  },
  Canada: {
    "Ontario": "CA-ON",
    "Quebec": "CA-QC",
    "British Columbia": "CA-BC",
    // Add more as needed
  },
};

interface CountryAnalyticsPanelProps {
  countryKey: string;
  countryName: string;
  countryFlag: string;
  data: UnifiedLegislationItem[];
  selectedSubdivision: string | null;
  onSelectSubdivision: (subdivision: string | null) => void;
  onBack: () => void;
  onViewAlerts: () => void;
}

export function CountryAnalyticsPanel({
  countryKey,
  countryName,
  countryFlag,
  data,
  selectedSubdivision,
  onSelectSubdivision,
  onBack,
  onViewAlerts,
}: CountryAnalyticsPanelProps) {
  // Filter by subdivision if selected
  const filteredData = useMemo(() => {
    if (!selectedSubdivision) return data;
    return data.filter(
      (item) =>
        item.jurisdictionCode === selectedSubdivision ||
        item.subnationalUnit === selectedSubdivision
    );
  }, [data, selectedSubdivision]);

  // KPIs
  const kpis = useMemo(() => {
    const total = filteredData.length;
    const high = filteredData.filter((d) => d.riskLevel === "high").length;
    const highPct = total > 0 ? Math.round((high / total) * 100) : 0;
    const criticalUrgent = filteredData.filter(
      (d) => d.riskLevel === "high" && d.complianceDeadline
    ).length;
    const upcomingDeadlines = filteredData.filter((d) => {
      if (!d.complianceDeadline) return false;
      const deadline = new Date(d.complianceDeadline);
      const now = new Date();
      const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      return deadline >= now && deadline <= thirtyDays;
    }).length;

    return { total, high, highPct, criticalUrgent, upcomingDeadlines };
  }, [filteredData]);

  // Subdivision distribution
  const subdivisionStats = useMemo(() => {
    const stats = new Map<
      string,
      { name: string; total: number; high: number; medium: number; low: number }
    >();

    data.forEach((item) => {
      const subKey = item.subnationalUnit || item.jurisdictionCode || "National";
      if (!stats.has(subKey)) {
        stats.set(subKey, { name: subKey, total: 0, high: 0, medium: 0, low: 0 });
      }
      const s = stats.get(subKey)!;
      s.total++;
      if (item.riskLevel === "high") s.high++;
      else if (item.riskLevel === "medium") s.medium++;
      else s.low++;
    });

    return Array.from(stats.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }, [data]);

  const hasSubdivisions = subdivisionStats.length > 1 || 
    (subdivisionStats.length === 1 && subdivisionStats[0].name !== "National");

  return (
    <div className="space-y-4">
      {/* Header with breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Map
          </Button>
          <div className="h-6 w-px bg-border" />
          <span className="text-muted-foreground text-sm">
            Analytics / Map / {countryName}
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={onViewAlerts} className="gap-2">
          <ExternalLink className="w-4 h-4" />
          View Alerts
        </Button>
      </div>

      {/* Country title */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">{countryFlag}</span>
        <div>
          <h2 className="text-xl font-bold">{countryName}</h2>
          <p className="text-sm text-muted-foreground">
            {kpis.total} tracked items
          </p>
        </div>
      </div>

      {/* Subdivision filter chip */}
      {selectedSubdivision && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-2 pl-3 pr-1 py-1">
            Subdivision: {selectedSubdivision}
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 hover:bg-transparent"
              onClick={() => onSelectSubdivision(null)}
            >
              <X className="w-3 h-3" />
            </Button>
          </Badge>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <FileText className="w-4 h-4" />
              <span className="text-xs">Total Items</span>
            </div>
            <div className="text-2xl font-bold">{kpis.total}</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <AlertTriangle className="w-4 h-4 text-risk-high" />
              <span className="text-xs">High Risk</span>
            </div>
            <div className="text-2xl font-bold text-risk-high">
              {kpis.high}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                ({kpis.highPct}%)
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              <span className="text-xs">Critical & Urgent</span>
            </div>
            {kpis.criticalUrgent > 0 ? (
              <div className="text-2xl font-bold text-amber-500">{kpis.criticalUrgent}</div>
            ) : (
              <div className="text-sm text-muted-foreground">No urgent items</div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-xs">Deadlines (30d)</span>
            </div>
            {kpis.upcomingDeadlines > 0 ? (
              <div className="text-2xl font-bold text-blue-500">{kpis.upcomingDeadlines}</div>
            ) : (
              <div className="text-sm text-muted-foreground">No upcoming</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RiskTrendChart data={filteredData} />
        <CategoryBreakdownChart data={filteredData} />
      </div>

      {/* Subdivision Distribution */}
      {hasSubdivisions ? (
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Subdivision Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50 max-h-[300px] overflow-y-auto">
              {subdivisionStats.map((stat) => {
                const isoCode = SUBDIVISION_LABELS[countryKey]?.[stat.name] || stat.name;
                const isSelected = selectedSubdivision === stat.name;

                return (
                  <button
                    key={stat.name}
                    onClick={() => onSelectSubdivision(isSelected ? null : stat.name)}
                    className={`w-full text-left px-4 py-2.5 hover:bg-muted/50 transition-colors ${
                      isSelected ? "bg-primary/10" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate">
                          {stat.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {isoCode} • {stat.total} items
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
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
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass-card">
          <CardContent className="py-8 text-center text-muted-foreground">
            <p className="text-sm">
              No state/province breakdown available for this jurisdiction
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
