import { useState, useMemo } from "react";
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, Info, X, Maximize2, Calendar, ArrowRight, ArrowUp } from "lucide-react";
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

type ImpactLevel = "high" | "medium" | "low";
type UrgencyLevel = "high" | "medium" | "low";
type CellKey = `${ImpactLevel}_${UrgencyLevel}`;

interface CategorizedItem {
  item: UnifiedLegislationItem;
  impact: ImpactLevel;
  urgency: UrgencyLevel;
}

// Cell configuration for 3x3 grid
const CELL_CONFIG: Record<CellKey, {
  title: string;
  emoji: string;
  borderClass: string;
  bgClass: string;
  badgeClass: string;
  priority: number;
}> = {
  high_high: {
    title: "Critical - Act Now",
    emoji: "🔴",
    borderClass: "border-destructive",
    bgClass: "bg-gradient-to-br from-destructive/15 to-destructive/5",
    badgeClass: "bg-destructive text-destructive-foreground",
    priority: 1,
  },
  high_medium: {
    title: "Important - Plan Action",
    emoji: "🟠",
    borderClass: "border-orange-500",
    bgClass: "bg-gradient-to-br from-orange-500/12 to-orange-500/4",
    badgeClass: "bg-orange-500 text-white",
    priority: 2,
  },
  high_low: {
    title: "Strategic - Schedule",
    emoji: "🟡",
    borderClass: "border-yellow-500",
    bgClass: "bg-gradient-to-br from-yellow-500/10 to-yellow-500/3",
    badgeClass: "bg-yellow-500 text-yellow-950",
    priority: 3,
  },
  medium_high: {
    title: "Urgent - Address Soon",
    emoji: "🟠",
    borderClass: "border-orange-400",
    bgClass: "bg-gradient-to-br from-orange-400/10 to-orange-400/3",
    badgeClass: "bg-orange-400 text-white",
    priority: 4,
  },
  medium_medium: {
    title: "Moderate - Review",
    emoji: "🟡",
    borderClass: "border-amber-400",
    bgClass: "bg-gradient-to-br from-amber-400/8 to-amber-400/2",
    badgeClass: "bg-amber-400 text-amber-950",
    priority: 5,
  },
  medium_low: {
    title: "Normal - Monitor",
    emoji: "⚪",
    borderClass: "border-slate-400",
    bgClass: "bg-gradient-to-br from-slate-400/8 to-slate-400/2",
    badgeClass: "bg-slate-400 text-slate-950",
    priority: 6,
  },
  low_high: {
    title: "Quick Win - Easy Fix",
    emoji: "🟡",
    borderClass: "border-yellow-400",
    bgClass: "bg-gradient-to-br from-yellow-400/8 to-yellow-400/2",
    badgeClass: "bg-yellow-400 text-yellow-950",
    priority: 7,
  },
  low_medium: {
    title: "Low Priority - Track",
    emoji: "⚪",
    borderClass: "border-slate-300",
    bgClass: "bg-gradient-to-br from-slate-300/6 to-slate-300/2",
    badgeClass: "bg-slate-300 text-slate-800",
    priority: 8,
  },
  low_low: {
    title: "Archive - Minimal",
    emoji: "⚪",
    borderClass: "border-muted",
    bgClass: "bg-muted/20",
    badgeClass: "bg-muted text-muted-foreground",
    priority: 9,
  },
};

export function UnifiedImpactUrgencyMatrix({ data, onItemClick }: UnifiedImpactUrgencyMatrixProps) {
  const [selectedRegion, setSelectedRegion] = useState<RegionCode | "all">("all");
  const [selectedCountry, setSelectedCountry] = useState<string | "all">("all");
  const [deadlineFilter, setDeadlineFilter] = useState<"all" | "7d" | "30d" | "90d">("all");
  const [expandedCell, setExpandedCell] = useState<{
    key: CellKey;
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

  // Create 9 cells for the 3x3 grid
  const cells = useMemo(() => {
    const result: Record<CellKey, CategorizedItem[]> = {
      high_high: [],
      high_medium: [],
      high_low: [],
      medium_high: [],
      medium_medium: [],
      medium_low: [],
      low_high: [],
      low_medium: [],
      low_low: [],
    };

    categorizedItems.forEach((item) => {
      const key: CellKey = `${item.impact}_${item.urgency}`;
      result[key].push(item);
    });

    return result;
  }, [categorizedItems]);

  const handleItemClick = (item: UnifiedLegislationItem) => {
    setExpandedCell(null);
    onItemClick?.(item);
  };

  const ItemRow = ({ item, showDetails = false }: { item: UnifiedLegislationItem; showDetails?: boolean }) => (
    <div 
      className="text-xs p-2 bg-background/80 rounded border border-border/50 hover:bg-accent/50 hover:border-primary/30 transition-all cursor-pointer"
      onClick={() => handleItemClick(item)}
    >
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground shrink-0 text-[11px]">
          {COUNTRY_INFO[item.jurisdictionCode]?.flag || "🌐"}
        </span>
        <span className={`${showDetails ? "" : "truncate"} flex-1 font-medium`}>{item.title}</span>
      </div>
      {showDetails && (
        <div className="mt-2 pt-2 border-t border-border/50 space-y-1.5">
          <p className="text-muted-foreground">{item.regulatoryCategory}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge 
              variant={item.riskLevel === "high" ? "destructive" : item.riskLevel === "medium" ? "secondary" : "outline"} 
              className="text-[10px]"
            >
              {item.riskLevel} risk
            </Badge>
            {item.complianceDeadline && (
              <span className="text-warning text-[10px] flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(item.complianceDeadline).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const CellSection = ({
    cellKey,
    items,
  }: {
    cellKey: CellKey;
    items: CategorizedItem[];
  }) => {
    const config = CELL_CONFIG[cellKey];
    
    return (
      <div className={`border-2 ${config.borderClass} rounded-xl p-3 ${config.bgClass} flex flex-col h-full min-h-[140px] transition-all hover:shadow-md`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{config.emoji}</span>
            <h4 className="font-semibold text-xs leading-tight">{config.title}</h4>
          </div>
          <div className="flex items-center gap-1.5">
            <Badge className={`${config.badgeClass} text-[10px] px-1.5 py-0 h-5 font-bold`}>
              {items.length}
            </Badge>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 hover:bg-background/50"
                onClick={() => setExpandedCell({ key: cellKey, title: config.title, items })}
              >
                <Maximize2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
        <ScrollArea className="flex-1 min-h-0">
          <div className="space-y-1.5 pr-1">
            <TooltipProvider>
              {items.slice(0, 4).map(({ item }) => (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <div>
                      <ItemRow item={item} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-[280px] z-50 bg-popover">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {COUNTRY_INFO[item.jurisdictionCode]?.flag} {item.jurisdictionCode} • {item.regulatoryCategory}
                      </p>
                      <p className="text-xs">
                        Risk: <span className={item.riskLevel === "high" ? "text-destructive font-medium" : item.riskLevel === "medium" ? "text-warning font-medium" : "text-muted-foreground"}>{item.riskLevel}</span>
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
            {items.length > 4 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-[10px] text-muted-foreground h-6 hover:bg-background/50"
                onClick={() => setExpandedCell({ key: cellKey, title: config.title, items })}
              >
                +{items.length - 4} more
              </Button>
            )}
            {items.length === 0 && (
              <div className="text-[10px] text-muted-foreground text-center py-3 opacity-60">
                No items
              </div>
            )}
          </div>
        </ScrollArea>
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
                    <div className="pt-2 border-t mt-2">
                      <p className="text-muted-foreground">Showing: <span className="text-foreground font-medium">{filteredData.length}</span> of {data.length} items</p>
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

          {/* Active filters summary */}
          <div className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5 flex-wrap">
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
                <div className="flex flex-col justify-around w-14 shrink-0 text-right pr-1">
                  <span className="text-[10px] font-medium text-destructive">High</span>
                  <span className="text-[10px] font-medium text-warning">Medium</span>
                  <span className="text-[10px] font-medium text-muted-foreground">Low</span>
                </div>
                
                {/* 3x3 Grid */}
                <div className="flex-1 grid grid-cols-3 gap-2" style={{ minHeight: "420px" }}>
                  {gridOrder.map((cellKey) => (
                    <CellSection
                      key={cellKey}
                      cellKey={cellKey}
                      items={cells[cellKey]}
                    />
                  ))}
                </div>
              </div>
              
              {/* X-Axis Level Labels */}
              <div className="flex gap-2 pl-16">
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
              <div className="flex items-center justify-center gap-1 pl-16">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Urgency</span>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expanded Cell Modal */}
      <Dialog open={!!expandedCell} onOpenChange={(open) => !open && setExpandedCell(null)}>
        <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-4 border-b shrink-0">
            <DialogTitle className="flex items-center gap-2">
              {expandedCell && CELL_CONFIG[expandedCell.key].emoji}
              {expandedCell?.title}
              <Badge variant="secondary">{expandedCell?.items.length} items</Badge>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6 pt-4">
            <div className="space-y-2">
              {expandedCell?.items.map(({ item }) => (
                <ItemRow key={item.id} item={item} showDetails />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
