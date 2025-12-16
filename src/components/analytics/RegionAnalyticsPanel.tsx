import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  FileText, 
  AlertTriangle, 
  Clock, 
  TrendingUp,
  ExternalLink,
  Globe
} from "lucide-react";
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";
import { RiskTrendChart } from "./RiskTrendChart";
import { CategoryBreakdownChart } from "./CategoryBreakdownChart";
import { RegionCode, regionThemes, RegionIcon } from "@/components/regions/RegionConfig";
import { CountryFlag, getCountryInfo } from "@/components/shared/CountryFlag";

interface RegionAnalyticsPanelProps {
  regionKey: RegionCode;
  regionName: string;
  data: UnifiedLegislationItem[];
  selectedCountry: string | null;
  onSelectCountry: (country: string | null) => void;
  onBack: () => void;
  onViewAlerts: () => void;
  showHeader?: boolean;
}

export function RegionAnalyticsPanel({
  regionKey,
  regionName,
  data,
  selectedCountry,
  onSelectCountry,
  onBack,
  onViewAlerts,
}: RegionAnalyticsPanelProps) {
  const theme = regionThemes[regionKey];
  
  // Filter data for this region
  const regionData = useMemo(() => {
    return data.filter((item) => item.region === regionKey);
  }, [data, regionKey]);

  // Filter by country if selected
  const filteredData = useMemo(() => {
    if (!selectedCountry) return regionData;
    return regionData.filter(
      (item) => item.jurisdictionCode === selectedCountry
    );
  }, [regionData, selectedCountry]);

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

  // Country distribution within region
  const countryStats = useMemo(() => {
    const stats = new Map<
      string,
      { code: string; name: string; total: number; high: number; medium: number; low: number }
    >();

    regionData.forEach((item) => {
      const countryCode = item.jurisdictionCode || "Unknown";
      const countryInfo = getCountryInfo(countryCode);
      
      if (!stats.has(countryCode)) {
        stats.set(countryCode, { 
          code: countryCode,
          name: countryInfo?.name || countryCode, 
          total: 0, 
          high: 0, 
          medium: 0, 
          low: 0 
        });
      }
      const s = stats.get(countryCode)!;
      s.total++;
      if (item.riskLevel === "high") s.high++;
      else if (item.riskLevel === "medium") s.medium++;
      else s.low++;
    });

    return Array.from(stats.values())
      .sort((a, b) => b.total - a.total);
  }, [regionData]);

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
            Analytics / Map / {regionName}
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={onViewAlerts} className="gap-2">
          <ExternalLink className="w-4 h-4" />
          View Alerts
        </Button>
      </div>

      {/* Region title */}
      <div className="flex items-center gap-3">
        <div 
          className="p-2 rounded-lg"
          style={{ background: `${theme.primaryColor}20` }}
        >
          <RegionIcon region={regionKey} size={24} showCode={false} className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold">{regionName}</h2>
          <p className="text-sm text-muted-foreground">
            {kpis.total} tracked items across {countryStats.length} jurisdictions
          </p>
        </div>
      </div>

      {/* Country filter chip */}
      {selectedCountry && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-2 pl-3 pr-2 py-1.5">
            <CountryFlag countryKey={selectedCountry} variant="full" size="sm" showTooltip={false} />
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 hover:bg-transparent ml-1"
              onClick={() => onSelectCountry(null)}
            >
              ×
            </Button>
          </Badge>
          <span className="text-xs text-muted-foreground">
            Click to clear filter and see entire region
          </span>
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

      {/* Country Distribution within Region */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Countries in {regionName}
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Click a country to filter analytics, or view all region data
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50 max-h-[350px] overflow-y-auto">
            {countryStats.map((stat) => {
              const isSelected = selectedCountry === stat.code;

              return (
                <button
                  key={stat.code}
                  onClick={() => onSelectCountry(isSelected ? null : stat.code)}
                  className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors ${
                    isSelected ? "bg-primary/10 border-l-2 border-primary" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CountryFlag countryKey={stat.code} variant="flag" size="lg" showTooltip={false} />
                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate">
                          {stat.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {stat.total} items
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {stat.high > 0 && (
                        <Badge
                          variant="outline"
                          className="bg-risk-high/20 border-risk-high/30 text-risk-high text-xs px-2"
                        >
                          {stat.high}
                        </Badge>
                      )}
                      {stat.medium > 0 && (
                        <Badge
                          variant="outline"
                          className="bg-risk-medium/20 border-risk-medium/30 text-risk-medium text-xs px-2"
                        >
                          {stat.medium}
                        </Badge>
                      )}
                      {stat.low > 0 && (
                        <Badge
                          variant="outline"
                          className="bg-risk-low/20 border-risk-low/30 text-risk-low text-xs px-2"
                        >
                          {stat.low}
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
            {countryStats.length === 0 && (
              <div className="px-4 py-8 text-center text-muted-foreground">
                <p className="text-sm">No data available for this region</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
