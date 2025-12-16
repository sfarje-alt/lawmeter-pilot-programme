import { useState, useMemo } from "react";
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, Info, X, Maximize2, Calendar, ArrowRight, ArrowUp, ChevronDown, ChevronUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface UnifiedImpactUrgencyMatrixProps {
  data: UnifiedLegislationItem[];
  onItemClick?: (item: UnifiedLegislationItem) => void;
}

// Country display info with commercial region mapping
const COUNTRY_INFO: Record<string, { flag: string; name: string; code: string; region: RegionCode }> = {
  "USA": { flag: "🇺🇸", name: "United States", code: "US", region: "NAM" },
  "Canada": { flag: "🇨🇦", name: "Canada", code: "CA", region: "NAM" },
  "Japan": { flag: "🇯🇵", name: "Japan", code: "JP", region: "APAC" },
  "Korea": { flag: "🇰🇷", name: "South Korea", code: "KR", region: "APAC" },
  "Taiwan": { flag: "🇹🇼", name: "Taiwan", code: "TW", region: "APAC" },
  "EU": { flag: "🇪🇺", name: "European Union", code: "EU", region: "EU" },
  "UAE": { flag: "🇦🇪", name: "United Arab Emirates", code: "AE", region: "GCC" },
  "Saudi Arabia": { flag: "🇸🇦", name: "Saudi Arabia", code: "SA", region: "GCC" },
  "Oman": { flag: "🇴🇲", name: "Oman", code: "OM", region: "GCC" },
  "Kuwait": { flag: "🇰🇼", name: "Kuwait", code: "KW", region: "GCC" },
  "Bahrain": { flag: "🇧🇭", name: "Bahrain", code: "BH", region: "GCC" },
  "Qatar": { flag: "🇶🇦", name: "Qatar", code: "QA", region: "GCC" },
  "Peru": { flag: "🇵🇪", name: "Peru", code: "PE", region: "LATAM" },
  "Costa Rica": { flag: "🇨🇷", name: "Costa Rica", code: "CR", region: "LATAM" },
};

// Region display info
const REGION_INFO: Record<RegionCode, { name: string; countries: string[] }> = {
  NAM: { name: "North America", countries: ["USA", "Canada"] },
  LATAM: { name: "Latin America", countries: ["Peru", "Costa Rica"] },
  EU: { name: "European Union", countries: ["EU"] },
  GCC: { name: "Gulf States", countries: ["UAE", "Saudi Arabia", "Oman", "Kuwait", "Bahrain", "Qatar"] },
  APAC: { name: "Asia-Pacific", countries: ["Japan", "Korea", "Taiwan"] },
};

type ImpactLevel = "high" | "medium" | "low";
type UrgencyLevel = "high" | "medium" | "low";
type CellKey = `${ImpactLevel}_${UrgencyLevel}`;

interface CategorizedItem {
  item: UnifiedLegislationItem;
  impact: ImpactLevel;
  urgency: UrgencyLevel;
}

interface CountryGroup {
  country: string;
  items: CategorizedItem[];
  nearestDeadline?: Date;
}

// Cell configuration for 3x3 grid
const CELL_CONFIG: Record<CellKey, {
  title: string;
  shortTitle: string;
  emoji: string;
  borderClass: string;
  bgClass: string;
  badgeClass: string;
  pillClass: string;
  priority: number;
  description: string;
}> = {
  high_high: {
    title: "Critical - Act Now",
    shortTitle: "Critical",
    emoji: "🔴",
    borderClass: "border-destructive",
    bgClass: "bg-gradient-to-br from-destructive/15 to-destructive/5",
    badgeClass: "bg-destructive text-destructive-foreground",
    pillClass: "bg-destructive/20 border-destructive/40 text-destructive hover:bg-destructive/30",
    priority: 1,
    description: "Immediate action required. High-risk items with imminent deadlines.",
  },
  high_medium: {
    title: "Important - Plan Action",
    shortTitle: "Important",
    emoji: "🟠",
    borderClass: "border-orange-500",
    bgClass: "bg-gradient-to-br from-orange-500/12 to-orange-500/4",
    badgeClass: "bg-orange-500 text-white",
    pillClass: "bg-orange-500/15 border-orange-500/30 text-orange-600 dark:text-orange-400 hover:bg-orange-500/25",
    priority: 2,
    description: "Plan action within days. High-risk items with upcoming deadlines.",
  },
  high_low: {
    title: "Strategic - Schedule",
    shortTitle: "Strategic",
    emoji: "🟡",
    borderClass: "border-yellow-500",
    bgClass: "bg-gradient-to-br from-yellow-500/10 to-yellow-500/3",
    badgeClass: "bg-yellow-500 text-yellow-950",
    pillClass: "bg-yellow-500/15 border-yellow-500/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/25",
    priority: 3,
    description: "Schedule for review. High-risk but no immediate deadline pressure.",
  },
  medium_high: {
    title: "Urgent - Address Soon",
    shortTitle: "Urgent",
    emoji: "🟠",
    borderClass: "border-orange-400",
    bgClass: "bg-gradient-to-br from-orange-400/10 to-orange-400/3",
    badgeClass: "bg-orange-400 text-white",
    pillClass: "bg-orange-400/15 border-orange-400/30 text-orange-600 dark:text-orange-400 hover:bg-orange-400/25",
    priority: 4,
    description: "Address soon. Medium-risk items requiring timely attention.",
  },
  medium_medium: {
    title: "Moderate - Review",
    shortTitle: "Moderate",
    emoji: "🟡",
    borderClass: "border-amber-400",
    bgClass: "bg-gradient-to-br from-amber-400/8 to-amber-400/2",
    badgeClass: "bg-amber-400 text-amber-950",
    pillClass: "bg-amber-400/12 border-amber-400/25 text-amber-700 dark:text-amber-400 hover:bg-amber-400/20",
    priority: 5,
    description: "Review when possible. Medium priority items to track.",
  },
  medium_low: {
    title: "Normal - Monitor",
    shortTitle: "Normal",
    emoji: "⚪",
    borderClass: "border-slate-400",
    bgClass: "bg-gradient-to-br from-slate-400/8 to-slate-400/2",
    badgeClass: "bg-slate-400 text-slate-950",
    pillClass: "bg-slate-400/10 border-slate-400/20 text-slate-600 dark:text-slate-400 hover:bg-slate-400/15",
    priority: 6,
    description: "Monitor passively. Medium-risk, no deadline pressure.",
  },
  low_high: {
    title: "Quick Win - Easy Fix",
    shortTitle: "Quick Win",
    emoji: "🟡",
    borderClass: "border-yellow-400",
    bgClass: "bg-gradient-to-br from-yellow-400/8 to-yellow-400/2",
    badgeClass: "bg-yellow-400 text-yellow-950",
    pillClass: "bg-yellow-400/12 border-yellow-400/25 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-400/20",
    priority: 7,
    description: "Quick wins. Low-risk items with upcoming deadlines – easy to address.",
  },
  low_medium: {
    title: "Low Priority - Track",
    shortTitle: "Low Priority",
    emoji: "⚪",
    borderClass: "border-slate-300",
    bgClass: "bg-gradient-to-br from-slate-300/6 to-slate-300/2",
    badgeClass: "bg-slate-300 text-slate-800",
    pillClass: "bg-slate-300/10 border-slate-300/20 text-slate-500 dark:text-slate-400 hover:bg-slate-300/15",
    priority: 8,
    description: "Track periodically. Low-risk, medium-term items.",
  },
  low_low: {
    title: "Archive - Minimal",
    shortTitle: "Archive",
    emoji: "⚪",
    borderClass: "border-muted",
    bgClass: "bg-muted/20",
    badgeClass: "bg-muted text-muted-foreground",
    pillClass: "bg-muted/30 border-muted/30 text-muted-foreground hover:bg-muted/40",
    priority: 9,
    description: "Minimal attention needed. Archive or review annually.",
  },
};

// Legend items with classification criteria
const LEGEND_ITEMS: { key: CellKey; criteria: string }[] = [
  { key: "high_high", criteria: "High Risk + Deadline ≤30d or Stage ≥3" },
  { key: "high_medium", criteria: "High Risk + Deadline ≤90d or Stage ≥1" },
  { key: "high_low", criteria: "High Risk + No imminent deadline" },
  { key: "medium_high", criteria: "Medium Risk + Deadline ≤30d or Stage ≥3" },
  { key: "medium_medium", criteria: "Medium Risk + Deadline ≤90d or Stage ≥1" },
  { key: "medium_low", criteria: "Medium Risk + No imminent deadline" },
  { key: "low_high", criteria: "Low Risk + Deadline ≤30d or Stage ≥3" },
  { key: "low_medium", criteria: "Low Risk + Deadline ≤90d or Stage ≥1" },
  { key: "low_low", criteria: "Low Risk + No imminent deadline" },
];

export function UnifiedImpactUrgencyMatrix({ data, onItemClick }: UnifiedImpactUrgencyMatrixProps) {
  const [selectedRegion, setSelectedRegion] = useState<RegionCode | "all">("all");
  const [selectedCountry, setSelectedCountry] = useState<string | "all">("all");
  const [deadlineFilter, setDeadlineFilter] = useState<"all" | "7d" | "30d" | "90d">("all");
  const [legendOpen, setLegendOpen] = useState(false);
  const [expandedCell, setExpandedCell] = useState<{
    key: CellKey;
    title: string;
    items: CategorizedItem[];
    countryGroups: CountryGroup[];
  } | null>(null);
  const [modalCountryFilter, setModalCountryFilter] = useState<string | "all">("all");

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
    let urgency: UrgencyLevel = "low";

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

  // Create 9 cells for the 3x3 grid with country grouping
  const cells = useMemo(() => {
    const result: Record<CellKey, { items: CategorizedItem[]; countryGroups: CountryGroup[] }> = {
      high_high: { items: [], countryGroups: [] },
      high_medium: { items: [], countryGroups: [] },
      high_low: { items: [], countryGroups: [] },
      medium_high: { items: [], countryGroups: [] },
      medium_medium: { items: [], countryGroups: [] },
      medium_low: { items: [], countryGroups: [] },
      low_high: { items: [], countryGroups: [] },
      low_medium: { items: [], countryGroups: [] },
      low_low: { items: [], countryGroups: [] },
    };

    categorizedItems.forEach((item) => {
      const key: CellKey = `${item.impact}_${item.urgency}`;
      result[key].items.push(item);
    });

    // Group items by country for each cell
    Object.keys(result).forEach((cellKey) => {
      const cell = result[cellKey as CellKey];
      const countryMap = new Map<string, CategorizedItem[]>();
      
      cell.items.forEach((item) => {
        const country = item.item.jurisdictionCode;
        if (!countryMap.has(country)) {
          countryMap.set(country, []);
        }
        countryMap.get(country)!.push(item);
      });

      cell.countryGroups = Array.from(countryMap.entries())
        .map(([country, items]) => {
          const nearestDeadline = items
            .filter(i => i.item.complianceDeadline)
            .map(i => new Date(i.item.complianceDeadline!))
            .sort((a, b) => a.getTime() - b.getTime())[0];
          
          return { country, items, nearestDeadline };
        })
        .sort((a, b) => b.items.length - a.items.length); // Sort by count descending
    });

    return result;
  }, [categorizedItems]);

  const handleItemClick = (item: UnifiedLegislationItem) => {
    setExpandedCell(null);
    onItemClick?.(item);
  };

  const handleExpandCell = (cellKey: CellKey) => {
    const config = CELL_CONFIG[cellKey];
    const cell = cells[cellKey];
    setExpandedCell({ 
      key: cellKey, 
      title: config.title, 
      items: cell.items,
      countryGroups: cell.countryGroups,
    });
    setModalCountryFilter("all");
  };

  // Country pill component for cells
  const CountryPill = ({ country, count, cellKey }: { country: string; count: number; cellKey: CellKey }) => {
    const info = COUNTRY_INFO[country];
    const config = CELL_CONFIG[cellKey];
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-[11px] font-medium transition-all ${config.pillClass}`}
              onClick={() => handleExpandCell(cellKey)}
            >
              <span>{info?.flag || "🌐"}</span>
              <span>{info?.code || country}</span>
              <span className="font-bold">({count})</span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-popover text-xs">
            {info?.name || country}: {count} items
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const CellSection = ({
    cellKey,
    items,
    countryGroups,
  }: {
    cellKey: CellKey;
    items: CategorizedItem[];
    countryGroups: CountryGroup[];
  }) => {
    const config = CELL_CONFIG[cellKey];
    const nearestDeadline = countryGroups
      .flatMap(g => g.nearestDeadline ? [g.nearestDeadline] : [])
      .sort((a, b) => a.getTime() - b.getTime())[0];
    
    return (
      <div className={`border-2 ${config.borderClass} rounded-xl p-2.5 ${config.bgClass} flex flex-col h-full min-h-[120px] transition-all hover:shadow-md`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <span className="text-sm">{config.emoji}</span>
            <h4 className="font-semibold text-[11px] leading-tight">{config.shortTitle}</h4>
          </div>
          <div className="flex items-center gap-1">
            <Badge className={`${config.badgeClass} text-[10px] px-1.5 py-0 h-5 font-bold`}>
              {items.length}
            </Badge>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 hover:bg-background/50"
                onClick={() => handleExpandCell(cellKey)}
              >
                <Maximize2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        {items.length > 0 && (
          <div className="text-[9px] text-muted-foreground mb-2 flex items-center gap-2">
            <span>{countryGroups.length} jurisdiction{countryGroups.length !== 1 ? "s" : ""}</span>
            {nearestDeadline && (
              <span className="flex items-center gap-0.5 text-warning">
                <Calendar className="h-2.5 w-2.5" />
                {nearestDeadline.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            )}
          </div>
        )}

        {/* Country Pills Grid */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {countryGroups.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {countryGroups.slice(0, 6).map(({ country, items: countryItems }) => (
                <CountryPill 
                  key={country} 
                  country={country} 
                  count={countryItems.length}
                  cellKey={cellKey}
                />
              ))}
              {countryGroups.length > 6 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2 text-[10px] text-muted-foreground"
                  onClick={() => handleExpandCell(cellKey)}
                >
                  +{countryGroups.length - 6} more
                </Button>
              )}
            </div>
          ) : (
            <div className="text-[10px] text-muted-foreground text-center py-2 opacity-60">
              No items
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleClearFilters = () => {
    setSelectedRegion("all");
    setSelectedCountry("all");
    setDeadlineFilter("all");
  };

  const hasActiveFilters = selectedRegion !== "all" || selectedCountry !== "all" || deadlineFilter !== "all";

  // Grid order: rows are Impact (High → Low), columns are Urgency (High → Low)
  const gridOrder: CellKey[] = [
    "high_high", "high_medium", "high_low",
    "medium_high", "medium_medium", "medium_low",
    "low_high", "low_medium", "low_low",
  ];

  // Filtered items for modal
  const modalFilteredItems = useMemo(() => {
    if (!expandedCell) return [];
    if (modalCountryFilter === "all") return expandedCell.items;
    return expandedCell.items.filter(i => i.item.jurisdictionCode === modalCountryFilter);
  }, [expandedCell, modalCountryFilter]);

  return (
    <>
      <Card className="glass-card border-border/30 h-full flex flex-col">
        <CardHeader className="pb-2">
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
                        <p className="font-medium">Impact (Y-Axis)</p>
                        <p className="text-muted-foreground">Determined by the risk level: High, Medium, or Low.</p>
                      </div>
                      <div>
                        <p className="font-medium">Urgency (X-Axis)</p>
                        <ul className="list-disc list-inside pl-2 space-y-0.5 mt-1 text-muted-foreground">
                          <li><span className="text-destructive font-medium">High</span>: Deadline ≤30 days or pipeline stage ≥3</li>
                          <li><span className="text-warning font-medium">Medium</span>: Deadline ≤90 days or pipeline stage ≥1</li>
                          <li><span className="text-muted-foreground">Low</span>: No imminent deadline</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </CardTitle>

            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
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
                <SelectTrigger className="w-[130px] h-8 text-xs">
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
                <SelectTrigger className="w-[140px] h-8 text-xs">
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

          {/* Color Legend - Collapsible */}
          <Collapsible open={legendOpen} onOpenChange={setLegendOpen}>
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
                <span>{filteredData.length} of {data.length} items</span>
                {deadlineFilter !== "all" && (
                  <Badge variant="secondary" className="text-[10px] h-5">
                    <Calendar className="h-3 w-3 mr-1" />
                    Next {deadlineFilter}
                  </Badge>
                )}
                {selectedRegion !== "all" && (
                  <Badge variant="secondary" className="text-[10px] h-5">
                    {REGION_INFO[selectedRegion].name}
                  </Badge>
                )}
                {selectedCountry !== "all" && (
                  <Badge variant="secondary" className="text-[10px] h-5">
                    {COUNTRY_INFO[selectedCountry]?.flag} {selectedCountry}
                  </Badge>
                )}
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground">
                  {legendOpen ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
                  Legend
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="mt-3 p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="mb-3 pb-3 border-b border-border/50">
                  <h5 className="text-xs font-semibold mb-2">How Alerts Are Classified</h5>
                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div>
                      <p className="font-medium text-muted-foreground mb-1">Impact (Y-Axis) = Risk Level</p>
                      <ul className="space-y-0.5 text-muted-foreground">
                        <li><span className="text-destructive font-medium">High</span>: Alert has high risk assessment</li>
                        <li><span className="text-warning font-medium">Medium</span>: Alert has medium risk assessment</li>
                        <li><span className="text-muted-foreground">Low</span>: Alert has low risk assessment</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground mb-1">Urgency (X-Axis) = Time Pressure</p>
                      <ul className="space-y-0.5 text-muted-foreground">
                        <li><span className="text-destructive font-medium">High</span>: Deadline ≤30 days OR pipeline stage ≥3</li>
                        <li><span className="text-warning font-medium">Medium</span>: Deadline ≤90 days OR pipeline stage ≥1</li>
                        <li><span className="text-muted-foreground">Low</span>: No deadline or early pipeline stage</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <h5 className="text-xs font-semibold mb-2">Matrix Cell Meanings</h5>
                <div className="grid grid-cols-3 gap-2">
                  {LEGEND_ITEMS.map(({ key, criteria }) => {
                    const config = CELL_CONFIG[key];
                    return (
                      <div key={key} className={`p-2 rounded-md border ${config.borderClass} ${config.bgClass}`}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-sm">{config.emoji}</span>
                          <span className="text-[11px] font-semibold">{config.shortTitle}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-tight">{config.description}</p>
                        <p className="text-[9px] text-muted-foreground/70 mt-1 italic">{criteria}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 pt-2">
          {/* 3x3 Grid with Axis Labels */}
          <div className="flex h-full gap-2">
            {/* Y-Axis Label */}
            <div className="flex flex-col items-center justify-center w-6 shrink-0">
              <div className="flex items-center gap-1 -rotate-90 whitespace-nowrap">
                <ArrowUp className="h-3 w-3 text-muted-foreground rotate-90" />
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Impact</span>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col gap-2">
              {/* Y-Axis Level Labels + Grid */}
              <div className="flex-1 flex gap-2">
                {/* Y-Axis Level Labels */}
                <div className="flex flex-col justify-around w-12 shrink-0 text-right pr-1">
                  <span className="text-[10px] font-medium text-destructive">High</span>
                  <span className="text-[10px] font-medium text-warning">Medium</span>
                  <span className="text-[10px] font-medium text-muted-foreground">Low</span>
                </div>
                
                {/* 3x3 Grid */}
                <div className="flex-1 grid grid-cols-3 gap-2" style={{ minHeight: "380px" }}>
                  {gridOrder.map((cellKey) => (
                    <CellSection
                      key={cellKey}
                      cellKey={cellKey}
                      items={cells[cellKey].items}
                      countryGroups={cells[cellKey].countryGroups}
                    />
                  ))}
                </div>
              </div>
              
              {/* X-Axis Level Labels */}
              <div className="flex gap-2 pl-14">
                <div className="flex-1 text-center">
                  <span className="text-[10px] font-medium text-destructive">High</span>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-[10px] font-medium text-warning">Medium</span>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-[10px] font-medium text-muted-foreground">Low</span>
                </div>
              </div>
              
              {/* X-Axis Label */}
              <div className="flex items-center justify-center gap-1 pl-14">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Urgency</span>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expanded Cell Modal with Country Filter */}
      <Dialog open={!!expandedCell} onOpenChange={(open) => !open && setExpandedCell(null)}>
        <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-4 border-b shrink-0">
            <DialogTitle className="flex items-center gap-2">
              {expandedCell && CELL_CONFIG[expandedCell.key].emoji}
              {expandedCell?.title}
              <Badge variant="secondary">{expandedCell?.items.length} items</Badge>
            </DialogTitle>
            
            {/* Country filter tabs */}
            {expandedCell && expandedCell.countryGroups.length > 1 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                <Button
                  variant={modalCountryFilter === "all" ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setModalCountryFilter("all")}
                >
                  All ({expandedCell.items.length})
                </Button>
                {expandedCell.countryGroups.map(({ country, items }) => (
                  <Button
                    key={country}
                    variant={modalCountryFilter === country ? "default" : "outline"}
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setModalCountryFilter(country)}
                  >
                    {COUNTRY_INFO[country]?.flag} {COUNTRY_INFO[country]?.code || country} ({items.length})
                  </Button>
                ))}
              </div>
            )}
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6 pt-4">
            <div className="space-y-2">
              {modalFilteredItems.map(({ item }) => (
                <div 
                  key={item.id}
                  className="p-3 bg-background/80 rounded-lg border border-border/50 hover:bg-accent/50 hover:border-primary/30 transition-all cursor-pointer"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg shrink-0">
                      {COUNTRY_INFO[item.jurisdictionCode]?.flag || "🌐"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {COUNTRY_INFO[item.jurisdictionCode]?.name || item.jurisdictionCode} • {item.regulatoryCategory}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap mt-2">
                        <Badge 
                          variant={item.riskLevel === "high" ? "destructive" : item.riskLevel === "medium" ? "secondary" : "outline"} 
                          className="text-[10px]"
                        >
                          {item.riskLevel} risk
                        </Badge>
                        {item.isPipeline && (
                          <Badge variant="outline" className="text-[10px]">Pipeline</Badge>
                        )}
                        {item.complianceDeadline && (
                          <span className="text-warning text-[11px] flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(item.complianceDeadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
