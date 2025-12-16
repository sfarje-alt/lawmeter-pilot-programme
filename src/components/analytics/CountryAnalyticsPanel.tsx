import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  X,
  ExternalLink,
  Info,
  MapPin
} from "lucide-react";
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";
import {
  JurisdictionPulseKPIs,
  InstitutionalShapeKPIs,
  ThroughputInstrumentMixChart,
  LegislativeProcessAnalyticsChart,
  EffectiveDateRunwayChart,
  StabilityChurnChart,
  AnalyticsDrilldownSheet,
  TimeWindow,
  NormalizeBy,
} from "./jurisdiction";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// ISO codes for subdivisions
const SUBDIVISION_LABELS: Record<string, Record<string, string>> = {
  USA: {
    "California": "US-CA",
    "Texas": "US-TX",
    "New York": "US-NY",
    "Florida": "US-FL",
  },
  Canada: {
    "Ontario": "CA-ON",
    "Quebec": "CA-QC",
    "British Columbia": "CA-BC",
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
  showHeader?: boolean;
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
  // Time window and normalization state
  const [timeWindow, setTimeWindow] = useState<TimeWindow>("90d");
  const [normalizeBy, setNormalizeBy] = useState<NormalizeBy>("raw");
  
  // Drilldown state
  const [drilldownOpen, setDrilldownOpen] = useState(false);
  const [drilldownTitle, setDrilldownTitle] = useState("");
  const [drilldownDescription, setDrilldownDescription] = useState("");
  const [drilldownItems, setDrilldownItems] = useState<UnifiedLegislationItem[]>([]);

  // Filter by subdivision if selected
  const filteredData = useMemo(() => {
    if (!selectedSubdivision) return data;
    return data.filter(
      (item) =>
        item.jurisdictionCode === selectedSubdivision ||
        item.subnationalUnit === selectedSubdivision
    );
  }, [data, selectedSubdivision]);

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

  // Drilldown handler
  const handleDrilldown = (title: string, description: string, items: UnifiedLegislationItem[]) => {
    setDrilldownTitle(title);
    setDrilldownDescription(description);
    setDrilldownItems(items);
    setDrilldownOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Header with breadcrumb */}
      <div className="flex items-center justify-between flex-wrap gap-2">
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
        <div className="flex items-center gap-2">
          {/* Time Window Control */}
          <div className="flex items-center rounded-md border border-border/50 bg-muted/30">
            {(["30d", "90d", "12m"] as TimeWindow[]).map((tw) => (
              <Button
                key={tw}
                variant={timeWindow === tw ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-2.5 text-xs"
                onClick={() => setTimeWindow(tw)}
              >
                {tw}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={onViewAlerts} className="gap-2">
            <ExternalLink className="w-4 h-4" />
            View Alerts
          </Button>
        </div>
      </div>

      {/* Country title */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">{countryFlag}</span>
        <div>
          <h2 className="text-xl font-bold">{countryName}</h2>
          <p className="text-sm text-muted-foreground">
            {filteredData.length} tracked items
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

      {/* Jurisdiction Pulse KPIs */}
      <JurisdictionPulseKPIs 
        data={filteredData} 
        timeWindow={timeWindow}
        onKpiClick={handleDrilldown}
      />

      {/* Institutional Shape KPIs */}
      <InstitutionalShapeKPIs 
        data={filteredData} 
        timeWindow={timeWindow}
        onKpiClick={handleDrilldown}
      />

      {/* Normalize Control */}
      <div className="flex items-center justify-end gap-2">
        <span className="text-xs text-muted-foreground">Normalize:</span>
        <div className="flex items-center rounded-md border border-border/50 bg-muted/30">
          {([
            { value: "raw", label: "Raw" },
            { value: "per-week", label: "Per Week" },
            { value: "percent", label: "%" },
          ] as { value: NormalizeBy; label: string }[]).map((opt) => (
            <Button
              key={opt.value}
              variant={normalizeBy === opt.value ? "secondary" : "ghost"}
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => setNormalizeBy(opt.value)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Chart Block A: Throughput & Instrument Mix */}
      <ThroughputInstrumentMixChart
        data={filteredData}
        jurisdictionCode={countryKey}
        normalizeBy={normalizeBy}
        onBarClick={handleDrilldown}
      />

      {/* Chart Block B: Legislative Process Analytics */}
      <LegislativeProcessAnalyticsChart
        data={filteredData}
        jurisdictionCode={countryKey}
        onBarClick={handleDrilldown}
      />

      {/* Charts Grid: Runway + Stability */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart Block C: Effective Date Runway */}
        <EffectiveDateRunwayChart
          data={filteredData}
          onBarClick={handleDrilldown}
        />

        {/* Chart Block D: Stability & Churn (optional) */}
        <StabilityChurnChart
          data={filteredData}
          onSegmentClick={(type, items) => {
            handleDrilldown(
              type === "original" ? "Original Documents" : "Amending Documents",
              `${items.length} ${type} documents in this jurisdiction`,
              items
            );
          }}
        />
      </div>

      {/* Subdivision Distribution */}
      {hasSubdivisions ? (
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Subdivision Distribution
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Click a subdivision to filter analytics
            </p>
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
                      isSelected ? "bg-primary/10 border-l-2 border-primary" : ""
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

      {/* Footer Disclaimer */}
      <TooltipProvider>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70 pt-2 border-t border-border/30">
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-3 h-3 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-xs">
                Analytics derived from tracked legislative data. Metadata may include AI-extracted fields.
              </p>
            </TooltipContent>
          </Tooltip>
          <span>
            Informational analytics; may include AI-extracted metadata; verify with official sources.
          </span>
        </div>
      </TooltipProvider>

      {/* Drilldown Sheet */}
      <AnalyticsDrilldownSheet
        open={drilldownOpen}
        onOpenChange={setDrilldownOpen}
        title={drilldownTitle}
        description={drilldownDescription}
        items={drilldownItems}
      />
    </div>
  );
}
