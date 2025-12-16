import { useState, useMemo } from "react";
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, Info, X, Maximize2, Calendar } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RegionCode, RegionIcon } from "@/components/regions/RegionConfig";

interface UnifiedImpactUrgencyMatrixProps {
  data: UnifiedLegislationItem[];
  onItemClick?: (item: UnifiedLegislationItem) => void;
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

type QuadrantKey = "highImpactHighUrgency" | "highImpactLowUrgency" | "lowImpactHighUrgency" | "lowImpactLowUrgency";

interface CategorizedItem {
  item: UnifiedLegislationItem;
  impact: "high" | "medium" | "low";
  urgency: "high" | "medium" | "low";
}

export function UnifiedImpactUrgencyMatrix({ data, onItemClick }: UnifiedImpactUrgencyMatrixProps) {
  const [selectedRegion, setSelectedRegion] = useState<RegionCode | "all">("all");
  const [selectedCountry, setSelectedCountry] = useState<string | "all">("all");
  const [deadlineFilter, setDeadlineFilter] = useState<"all" | "7d" | "30d" | "90d">("all");
  const [expandedQuadrant, setExpandedQuadrant] = useState<{
    key: QuadrantKey;
    title: string;
    items: CategorizedItem[];
  } | null>(null);

  // Get available countries based on selected region
  const availableCountries = useMemo(() => {
    if (selectedRegion === "all") {
      return Object.keys(COUNTRY_INFO);
    }
    return REGION_INFO[selectedRegion].countries;
  }, [selectedRegion]);

  // Filter data based on region, country, and deadline
  const filteredData = useMemo(() => {
    let result = data;

    if (selectedRegion !== "all") {
      const countriesInRegion = REGION_INFO[selectedRegion].countries;
      result = result.filter(item => countriesInRegion.includes(item.jurisdictionCode));
    }

    if (selectedCountry !== "all") {
      result = result.filter(item => item.jurisdictionCode === selectedCountry);
    }

    // Deadline filter
    if (deadlineFilter !== "all") {
      const now = new Date();
      const days = deadlineFilter === "7d" ? 7 : deadlineFilter === "30d" ? 30 : 90;
      const cutoff = new Date();
      cutoff.setDate(now.getDate() + days);
      
      result = result.filter(item => {
        if (!item.complianceDeadline) return false;
        const deadline = new Date(item.complianceDeadline);
        return deadline >= now && deadline <= cutoff;
      });
    }

    return result;
  }, [data, selectedRegion, selectedCountry, deadlineFilter]);

  const now = new Date();
  const next30Days = new Date();
  next30Days.setDate(next30Days.getDate() + 30);
  const next90Days = new Date();
  next90Days.setDate(next90Days.getDate() + 90);

  const categorizedItems = useMemo(() => filteredData.map((item): CategorizedItem => {
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
      if (item.currentStageIndex !== undefined && item.currentStageIndex >= 3) {
        urgency = "high";
      } else if (item.currentStageIndex !== undefined && item.currentStageIndex >= 1) {
        urgency = "medium";
      }
    }

    return { item, impact, urgency };
  }), [filteredData, now, next30Days, next90Days]);

  const quadrants = useMemo(() => ({
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
  }), [categorizedItems]);

  const handleItemClick = (item: UnifiedLegislationItem) => {
    setExpandedQuadrant(null);
    onItemClick?.(item);
  };

  const ItemRow = ({ item, showDetails = false }: { item: UnifiedLegislationItem; showDetails?: boolean }) => (
    <div 
      className="text-xs p-2 bg-background rounded border hover:bg-muted/50 transition-colors cursor-pointer"
      onClick={() => handleItemClick(item)}
    >
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground shrink-0">
          {COUNTRY_INFO[item.jurisdictionCode]?.flag || "🌐"} {item.jurisdictionCode}
        </span>
        <span className={showDetails ? "" : "truncate flex-1"}>{item.title}</span>
      </div>
      {showDetails && (
        <div className="mt-2 pt-2 border-t space-y-1">
          <p className="text-muted-foreground">{item.regulatoryCategory}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={item.riskLevel === "high" ? "destructive" : item.riskLevel === "medium" ? "secondary" : "outline"} className="text-[10px]">
              {item.riskLevel} risk
            </Badge>
            {item.complianceDeadline && (
              <span className="text-warning text-[10px]">
                Deadline: {new Date(item.complianceDeadline).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const QuadrantSection = ({
    title,
    quadrantKey,
    items,
    badgeVariant,
    borderClass,
    bgClass,
  }: {
    title: string;
    quadrantKey: QuadrantKey;
    items: CategorizedItem[];
    badgeVariant: "destructive" | "secondary" | "outline";
    borderClass: string;
    bgClass: string;
  }) => (
    <div className={`border-2 ${borderClass} rounded-lg p-4 ${bgClass} flex flex-col h-full`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-sm">{title}</h4>
        <div className="flex items-center gap-2">
          <Badge variant={badgeVariant}>{items.length}</Badge>
          {items.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setExpandedQuadrant({ key: quadrantKey, title, items })}
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
      <ScrollArea className="flex-1 min-h-0">
        <div className="space-y-2 pr-2">
          <TooltipProvider>
            {items.slice(0, 10).map(({ item }) => (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <div>
                    <ItemRow item={item} />
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
                    <p className="text-xs text-primary mt-1">Click to view details →</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
          {items.length > 10 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-xs text-muted-foreground"
              onClick={() => setExpandedQuadrant({ key: quadrantKey, title, items })}
            >
              +{items.length - 10} more items - Click to expand
            </Button>
          )}
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
    setDeadlineFilter("all");
  };

  const hasActiveFilters = selectedRegion !== "all" || selectedCountry !== "all" || deadlineFilter !== "all";

  return (
    <>
      <Card className="glass-card border-border/30 h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-5 w-5 text-primary" />
              Impact vs. Urgency Matrix
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="bottom" align="start" className="w-80 bg-popover p-3">
                  <div className="space-y-2 text-xs">
                    <p className="font-semibold text-sm">How the Matrix is Calculated</p>
                    <div className="space-y-2">
                      <div>
                        <p className="font-medium">Impact</p>
                        <p className="text-muted-foreground">Determined by the risk level assigned to each legislation item (High, Medium, or Low).</p>
                      </div>
                      <div>
                        <p className="font-medium">Urgency</p>
                        <p className="text-muted-foreground">Calculated based on:</p>
                        <ul className="list-disc list-inside pl-2 space-y-0.5 mt-1">
                          <li><span className="text-destructive font-medium">High</span>: Deadline within 30 days, or pipeline item in late stage (stage 3+)</li>
                          <li><span className="text-warning font-medium">Medium</span>: Deadline within 90 days, or pipeline item in mid stage</li>
                          <li><span className="text-muted-foreground">Low</span>: No imminent deadline or early-stage item</li>
                        </ul>
                      </div>
                    </div>
                    <div className="pt-2 border-t mt-2">
                      <p className="text-muted-foreground">Currently showing: <span className="text-foreground font-medium">{filteredData.length}</span> of {data.length} total items</p>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </CardTitle>

            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Deadline Filter */}
              <Tabs value={deadlineFilter} onValueChange={(v) => setDeadlineFilter(v as typeof deadlineFilter)}>
                <TabsList className="h-8">
                  <TabsTrigger value="all" className="text-xs px-2 h-6">All</TabsTrigger>
                  <TabsTrigger value="7d" className="text-xs px-2 h-6">7d</TabsTrigger>
                  <TabsTrigger value="30d" className="text-xs px-2 h-6">30d</TabsTrigger>
                  <TabsTrigger value="90d" className="text-xs px-2 h-6">90d</TabsTrigger>
                </TabsList>
              </Tabs>

              <Select
                value={selectedRegion}
                onValueChange={(v) => {
                  setSelectedRegion(v as RegionCode | "all");
                  setSelectedCountry("all");
                }}
              >
                <SelectTrigger className="w-[140px] h-8 text-xs">
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
                <SelectTrigger className="w-[150px] h-8 text-xs">
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
            {deadlineFilter !== "all" && (
              <Badge variant="secondary" className="ml-2 text-[10px]">
                <Calendar className="h-3 w-3 mr-1" />
                Next {deadlineFilter}
              </Badge>
            )}
            {selectedRegion !== "all" && (
              <Badge variant="secondary" className="ml-1 text-[10px]">
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
              quadrantKey="highImpactHighUrgency"
              items={quadrants.highImpactHighUrgency}
              badgeVariant="destructive"
              borderClass="border-risk-high"
              bgClass="bg-risk-high/5"
            />
            <QuadrantSection
              title="Critical but Not Urgent"
              quadrantKey="highImpactLowUrgency"
              items={quadrants.highImpactLowUrgency}
              badgeVariant="secondary"
              borderClass="border-risk-medium"
              bgClass="bg-risk-medium/5"
            />
            <QuadrantSection
              title="Urgent but Lower Impact"
              quadrantKey="lowImpactHighUrgency"
              items={quadrants.lowImpactHighUrgency}
              badgeVariant="outline"
              borderClass="border-warning"
              bgClass="bg-warning/5"
            />
            <QuadrantSection
              title="Monitor"
              quadrantKey="lowImpactLowUrgency"
              items={quadrants.lowImpactLowUrgency}
              badgeVariant="outline"
              borderClass="border-muted"
              bgClass="bg-muted/30"
            />
          </div>
        </CardContent>
      </Card>

      {/* Expanded Quadrant Modal */}
      <Dialog open={!!expandedQuadrant} onOpenChange={(open) => !open && setExpandedQuadrant(null)}>
        <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-4 border-b">
            <DialogTitle className="flex items-center gap-2">
              {expandedQuadrant?.title}
              <Badge variant="secondary">{expandedQuadrant?.items.length} items</Badge>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6 pt-4">
            <div className="space-y-2">
              {expandedQuadrant?.items.map(({ item }) => (
                <ItemRow key={item.id} item={item} showDetails />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
