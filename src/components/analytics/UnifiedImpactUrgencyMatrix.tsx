import { useState, useMemo } from "react";
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, Info, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RegionCode, regionThemes, RegionIcon } from "@/components/regions/RegionConfig";

interface UnifiedImpactUrgencyMatrixProps {
  data: UnifiedLegislationItem[];
}

// Country display info with commercial region mapping
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

// Region display info
const REGION_INFO: Record<RegionCode, { name: string; countries: string[] }> = {
  NAM: { name: "North America", countries: ["USA", "Canada"] },
  LATAM: { name: "Latin America", countries: ["Peru", "Costa Rica"] },
  EU: { name: "European Union", countries: ["EU"] },
  GCC: { name: "Gulf States", countries: ["UAE", "Saudi Arabia", "Oman", "Kuwait", "Bahrain", "Qatar"] },
  APAC: { name: "Asia-Pacific", countries: ["Japan", "Korea", "Taiwan"] },
};

export function UnifiedImpactUrgencyMatrix({ data }: UnifiedImpactUrgencyMatrixProps) {
  const [selectedRegion, setSelectedRegion] = useState<RegionCode | "all">("all");
  const [selectedCountry, setSelectedCountry] = useState<string | "all">("all");

  // Get available countries based on selected region
  const availableCountries = useMemo(() => {
    if (selectedRegion === "all") {
      return Object.keys(COUNTRY_INFO);
    }
    return REGION_INFO[selectedRegion].countries;
  }, [selectedRegion]);

  // Filter data based on region and country
  const filteredData = useMemo(() => {
    let result = data;

    if (selectedRegion !== "all") {
      const countriesInRegion = REGION_INFO[selectedRegion].countries;
      result = result.filter(item => countriesInRegion.includes(item.jurisdictionCode));
    }

    if (selectedCountry !== "all") {
      result = result.filter(item => item.jurisdictionCode === selectedCountry);
    }

    return result;
  }, [data, selectedRegion, selectedCountry]);

  const now = new Date();
  const next30Days = new Date();
  next30Days.setDate(next30Days.getDate() + 30);
  const next90Days = new Date();
  next90Days.setDate(next90Days.getDate() + 90);

  const categorizedItems = filteredData.map((item) => {
    const impact = item.riskLevel;
    let urgency: "high" | "medium" | "low" = "low";

    if (item.complianceDeadline) {
      const deadline = new Date(item.complianceDeadline);
      if (deadline <= next30Days && deadline >= now) {
        urgency = "high";
      } else if (deadline <= next90Days && deadline >= now) {
        urgency = "medium";
      }
    } else if (item.isPipeline) {
      // Pipeline items in late stages are more urgent
      if (item.currentStageIndex !== undefined && item.currentStageIndex >= 3) {
        urgency = "high";
      } else if (item.currentStageIndex !== undefined && item.currentStageIndex >= 1) {
        urgency = "medium";
      }
    }

    return { item, impact, urgency };
  });

  const quadrants = {
    highImpactHighUrgency: categorizedItems.filter(
      (i) => i.impact === "high" && i.urgency === "high"
    ),
    highImpactLowUrgency: categorizedItems.filter(
      (i) => i.impact === "high" && (i.urgency === "low" || i.urgency === "medium")
    ),
    lowImpactHighUrgency: categorizedItems.filter(
      (i) => (i.impact === "low" || i.impact === "medium") && i.urgency === "high"
    ),
    lowImpactLowUrgency: categorizedItems.filter(
      (i) => (i.impact === "low" || i.impact === "medium") && (i.urgency === "low" || i.urgency === "medium")
    ),
  };

  const QuadrantSection = ({
    title,
    items,
    badgeVariant,
    borderClass,
    bgClass,
  }: {
    title: string;
    items: typeof categorizedItems;
    badgeVariant: "destructive" | "secondary" | "outline";
    borderClass: string;
    bgClass: string;
  }) => (
    <div className={`border-2 ${borderClass} rounded-lg p-4 ${bgClass} flex flex-col h-full`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-sm">{title}</h4>
        <Badge variant={badgeVariant}>{items.length}</Badge>
      </div>
      <ScrollArea className="flex-1 min-h-0">
        <div className="space-y-2 pr-2">
          <TooltipProvider>
            {items.map(({ item }) => (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <div className="text-xs p-2 bg-background rounded border cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground shrink-0">
                        {COUNTRY_INFO[item.jurisdictionCode]?.flag || "🌐"} {item.jurisdictionCode}
                      </span>
                      <span className="truncate flex-1">{item.title}</span>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-[300px] z-50 bg-popover">
                  <div className="space-y-1">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.jurisdictionCode} • {item.regulatoryCategory}
                    </p>
                    <p className="text-xs">
                      Risk: <span className={item.riskLevel === "high" ? "text-destructive" : item.riskLevel === "medium" ? "text-warning" : "text-muted-foreground"}>{item.riskLevel}</span>
                    </p>
                    {item.complianceDeadline && (
                      <p className="text-xs text-warning">
                        Deadline: {new Date(item.complianceDeadline).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
          {items.length === 0 && (
            <div className="text-xs text-muted-foreground text-center py-4">
              No items in this quadrant
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );

  const handleClearFilters = () => {
    setSelectedRegion("all");
    setSelectedCountry("all");
  };

  const hasActiveFilters = selectedRegion !== "all" || selectedCountry !== "all";

  return (
    <Card className="glass-card border-border/30 h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="h-5 w-5 text-primary" />
            Impact vs. Urgency Matrix
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[350px] bg-popover p-3">
                  <div className="space-y-2 text-xs">
                    <p className="font-semibold">How the Matrix is Calculated:</p>
                    <div className="space-y-1">
                      <p><strong>Impact</strong> is determined by the risk level assigned to each legislation item (High, Medium, or Low).</p>
                      <p><strong>Urgency</strong> is calculated based on:</p>
                      <ul className="list-disc list-inside pl-2 space-y-0.5">
                        <li><span className="text-destructive font-medium">High</span>: Deadline within 30 days, or pipeline item in late stage (stage 3+)</li>
                        <li><span className="text-warning font-medium">Medium</span>: Deadline within 90 days, or pipeline item in mid stage</li>
                        <li><span className="text-muted-foreground">Low</span>: No imminent deadline or early-stage item</li>
                      </ul>
                    </div>
                    <div className="pt-1 border-t">
                      <p className="text-muted-foreground">Total items: {filteredData.length} of {data.length}</p>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <Select
              value={selectedRegion}
              onValueChange={(v) => {
                setSelectedRegion(v as RegionCode | "all");
                setSelectedCountry("all"); // Reset country when region changes
              }}
            >
              <SelectTrigger className="w-[150px] h-8 text-xs">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">All Regions</SelectItem>
                {(Object.keys(REGION_INFO) as RegionCode[]).map(region => (
                  <SelectItem key={region} value={region}>
                    <div className="flex items-center gap-2">
                      <RegionIcon region={region} size={14} showCode={false} />
                      <span>{REGION_INFO[region].name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedCountry}
              onValueChange={(v) => setSelectedCountry(v)}
            >
              <SelectTrigger className="w-[160px] h-8 text-xs">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">All Countries</SelectItem>
                {availableCountries.map(country => (
                  <SelectItem key={country} value={country}>
                    <span>{COUNTRY_INFO[country]?.flag} {COUNTRY_INFO[country]?.name || country}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={handleClearFilters} className="h-8 px-2">
                <X className="h-3.5 w-3.5 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Active filters summary */}
        <div className="text-xs text-muted-foreground mt-2">
          Showing {filteredData.length} of {data.length} items
          {selectedRegion !== "all" && (
            <Badge variant="secondary" className="ml-2 text-[10px]">
              {REGION_INFO[selectedRegion].name}
            </Badge>
          )}
          {selectedCountry !== "all" && (
            <Badge variant="secondary" className="ml-1 text-[10px]">
              {COUNTRY_INFO[selectedCountry]?.flag} {selectedCountry}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <div className="grid grid-cols-2 gap-3 h-full" style={{ minHeight: "500px" }}>
          <QuadrantSection
            title="Critical & Urgent"
            items={quadrants.highImpactHighUrgency}
            badgeVariant="destructive"
            borderClass="border-risk-high"
            bgClass="bg-risk-high/5"
          />
          <QuadrantSection
            title="Critical but Not Urgent"
            items={quadrants.highImpactLowUrgency}
            badgeVariant="secondary"
            borderClass="border-risk-medium"
            bgClass="bg-risk-medium/5"
          />
          <QuadrantSection
            title="Urgent but Lower Impact"
            items={quadrants.lowImpactHighUrgency}
            badgeVariant="outline"
            borderClass="border-warning"
            bgClass="bg-warning/5"
          />
          <QuadrantSection
            title="Monitor"
            items={quadrants.lowImpactLowUrgency}
            badgeVariant="outline"
            borderClass="border-muted"
            bgClass="bg-muted/30"
          />
        </div>
      </CardContent>
    </Card>
  );
}
