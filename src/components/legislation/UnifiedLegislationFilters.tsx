import { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { 
  FileText,
  Clock,
  Gavel,
  ChevronDown,
  SlidersHorizontal,
  X,
  AlertTriangle,
  MapPin,
  Building2,
  Sparkles
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { JurisdictionConfig } from "@/config/jurisdictionConfig";
import { UnifiedFilterState, defaultFilterState, UnifiedFilterPreset } from "@/types/unifiedLegislation";
import { regionThemes, RegionCode } from "@/components/regions/RegionConfig";

interface UnifiedLegislationFiltersProps {
  config: JurisdictionConfig;
  filters: UnifiedFilterState;
  onFiltersChange: (filters: UnifiedFilterState) => void;
  counts: {
    all: number;
    inForce: number;
    pipeline: number;
  };
  presets?: UnifiedFilterPreset[];
  activePresetId?: string;
  onApplyPreset?: (preset: UnifiedFilterPreset) => void;
  categories?: string[];
}

export function UnifiedLegislationFilters({
  config,
  filters,
  onFiltersChange,
  counts,
  presets = [],
  activePresetId,
  onApplyPreset,
  categories = []
}: UnifiedLegislationFiltersProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const theme = regionThemes[config.region];

  // Update a single filter field
  const updateFilter = <K extends keyof UnifiedFilterState>(
    key: K, 
    value: UnifiedFilterState[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  // Toggle array filter value
  const toggleArrayFilter = <K extends keyof UnifiedFilterState>(
    key: K,
    value: string
  ) => {
    const current = filters[key] as string[];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    onFiltersChange({ ...filters, [key]: updated });
  };

  // Clear all filters
  const clearFilters = () => {
    onFiltersChange(defaultFilterState);
  };

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.instrumentTypes.length > 0) count++;
    if (filters.hierarchyLevels.length > 0) count++;
    if (filters.statuses.length > 0) count++;
    if (filters.subnationalUnits.length > 0) count++;
    if (filters.riskLevels.length > 0) count++;
    if (filters.categories.length > 0) count++;
    if (filters.authorities.length > 0) count++;
    if (filters.deadlinePreset !== "none") count++;
    return count;
  }, [filters]);

  const lifecycleIcons = {
    all: <FileText className="h-4 w-4" />,
    "in-force": <Gavel className="h-4 w-4" />,
    pipeline: <Clock className="h-4 w-4" />
  };

  return (
    <div className="space-y-4">
      {/* Presets Row */}
      {presets.length > 0 && onApplyPreset && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 animate-pulse" style={{ color: theme.primaryColor }} />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Quick Filters
            </span>
          </div>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-2 pb-2">
              {presets.map((preset) => (
                <Button
                  key={preset.id}
                  variant={activePresetId === preset.id ? "default" : "outline"}
                  size="sm"
                  className="h-8 px-3 flex-shrink-0"
                  style={{
                    backgroundColor: activePresetId === preset.id ? theme.primaryColor : undefined,
                    borderColor: activePresetId === preset.id ? theme.primaryColor : undefined
                  }}
                  onClick={() => onApplyPreset(preset)}
                >
                  <span className="text-xs">{preset.name}</span>
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}

      {/* Row 1: Scope Filters (Lifecycle + Level) */}
      <div 
        className="flex items-center gap-4 p-3 rounded-lg"
        style={{ backgroundColor: `${theme.primaryColor}10` }}
      >
        {/* Lifecycle Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Lifecycle:</span>
          <Tabs 
            value={filters.lifecycle} 
            onValueChange={(v) => updateFilter("lifecycle", v as any)}
          >
            <TabsList className="h-8">
              <TabsTrigger value="all" className="text-xs px-3 gap-1.5">
                {lifecycleIcons.all}
                All ({counts.all})
              </TabsTrigger>
              <TabsTrigger value="in-force" className="text-xs px-3 gap-1.5">
                {lifecycleIcons["in-force"]}
                In Force ({counts.inForce})
              </TabsTrigger>
              <TabsTrigger value="pipeline" className="text-xs px-3 gap-1.5">
                {lifecycleIcons.pipeline}
                Pipeline ({counts.pipeline})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Jurisdiction Level Filter - Adapted per jurisdiction */}
        {config.jurisdictionLevels && config.jurisdictionLevels.some(l => l.enabled) && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Level:</span>
            <Tabs 
              value={filters.jurisdictionLevel} 
              onValueChange={(v) => updateFilter("jurisdictionLevel", v as any)}
            >
              <TabsList className="h-8">
                <TabsTrigger value="all" className="text-xs px-3">All</TabsTrigger>
                {config.jurisdictionLevels.filter(l => l.enabled).map(level => (
                  <TabsTrigger key={level.id} value={level.id} className="text-xs px-3">
                    {level.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )}
        {/* Fallback for configs without jurisdictionLevels */}
        {!config.jurisdictionLevels && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Level:</span>
            <Tabs 
              value={filters.jurisdictionLevel} 
              onValueChange={(v) => updateFilter("jurisdictionLevel", v as any)}
            >
              <TabsList className="h-8">
                <TabsTrigger value="all" className="text-xs px-3">All</TabsTrigger>
                <TabsTrigger value="federal" className="text-xs px-3">National</TabsTrigger>
                {config.subnationalUnits && (
                  <TabsTrigger value="state" className="text-xs px-3">
                    {config.filterLabels.subnational}
                  </TabsTrigger>
                )}
              </TabsList>
            </Tabs>
          </div>
        )}
      </div>

      {/* Row 2: Core Filter Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Subnational Unit Filter */}
        {config.subnationalUnits && filters.jurisdictionLevel !== "federal" && (
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant={filters.subnationalUnits.length > 0 ? "default" : "outline"} 
                size="sm" 
                className="h-8 gap-1.5"
                style={{
                  backgroundColor: filters.subnationalUnits.length > 0 ? theme.primaryColor : undefined,
                  borderColor: filters.subnationalUnits.length > 0 ? theme.primaryColor : undefined
                }}
              >
                <MapPin className="h-3.5 w-3.5" />
                {config.filterLabels.subnational}
                {filters.subnationalUnits.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                    {filters.subnationalUnits.length}
                  </Badge>
                )}
                <ChevronDown className="h-3.5 w-3.5 ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3" align="start">
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {config.subnationalUnits.units.map((unit) => (
                    <div key={unit.code} className="flex items-center gap-2">
                      <Checkbox
                        id={`unit-${unit.code}`}
                        checked={filters.subnationalUnits.includes(unit.code)}
                        onCheckedChange={() => toggleArrayFilter("subnationalUnits", unit.code)}
                      />
                      <label htmlFor={`unit-${unit.code}`} className="text-sm cursor-pointer">
                        {unit.name} ({unit.code})
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        )}

        {/* Instrument Type Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant={filters.instrumentTypes.length > 0 ? "default" : "outline"} 
              size="sm" 
              className="h-8 gap-1.5"
              style={{
                backgroundColor: filters.instrumentTypes.length > 0 ? theme.primaryColor : undefined,
                borderColor: filters.instrumentTypes.length > 0 ? theme.primaryColor : undefined
              }}
            >
              <FileText className="h-3.5 w-3.5" />
              {config.filterLabels.instrumentType}
              {filters.instrumentTypes.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                  {filters.instrumentTypes.length}
                </Badge>
              )}
              <ChevronDown className="h-3.5 w-3.5 ml-1" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3" align="start">
            <div className="space-y-2">
              {config.instrumentTypes.map((type) => (
                <div key={type.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`type-${type.id}`}
                    checked={filters.instrumentTypes.includes(type.id)}
                    onCheckedChange={() => toggleArrayFilter("instrumentTypes", type.id)}
                  />
                  <label htmlFor={`type-${type.id}`} className="text-sm cursor-pointer">
                    {type.emoji} {type.label}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Category Filter */}
        {categories.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant={filters.categories.length > 0 ? "default" : "outline"} 
                size="sm" 
                className="h-8 gap-1.5"
                style={{
                  backgroundColor: filters.categories.length > 0 ? theme.primaryColor : undefined,
                  borderColor: filters.categories.length > 0 ? theme.primaryColor : undefined
                }}
              >
                Category
                {filters.categories.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                    {filters.categories.length}
                  </Badge>
                )}
                <ChevronDown className="h-3.5 w-3.5 ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3" align="start">
              <div className="space-y-2">
                {categories.map((cat) => (
                  <div key={cat} className="flex items-center gap-2">
                    <Checkbox
                      id={`cat-${cat}`}
                      checked={filters.categories.includes(cat)}
                      onCheckedChange={() => toggleArrayFilter("categories", cat)}
                    />
                    <label htmlFor={`cat-${cat}`} className="text-sm cursor-pointer">
                      {cat}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* Risk Level Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant={filters.riskLevels.length > 0 ? "default" : "outline"} 
              size="sm" 
              className="h-8 gap-1.5"
              style={{
                backgroundColor: filters.riskLevels.length > 0 ? theme.primaryColor : undefined,
                borderColor: filters.riskLevels.length > 0 ? theme.primaryColor : undefined
              }}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              Risk Level
              {filters.riskLevels.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                  {filters.riskLevels.length}
                </Badge>
              )}
              <ChevronDown className="h-3.5 w-3.5 ml-1" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-3" align="start">
            <div className="space-y-2">
              {(["high", "medium", "low"] as const).map((level) => (
                <div key={level} className="flex items-center gap-2">
                  <Checkbox
                    id={`risk-${level}`}
                    checked={filters.riskLevels.includes(level)}
                    onCheckedChange={() => toggleArrayFilter("riskLevels", level)}
                  />
                  <label htmlFor={`risk-${level}`} className="text-sm cursor-pointer capitalize">
                    {level}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Advanced Filters Toggle */}
        <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
          <CollapsibleTrigger asChild>
            <Button 
              variant={activeFilterCount > 0 ? "default" : "outline"} 
              size="sm" 
              className="h-8 gap-1.5"
              style={{
                backgroundColor: activeFilterCount > 0 ? theme.primaryColor : undefined,
                borderColor: activeFilterCount > 0 ? theme.primaryColor : undefined
              }}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Advanced
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                  {activeFilterCount}
                </Badge>
              )}
              <ChevronDown className={cn(
                "h-3.5 w-3.5 ml-1 transition-transform",
                advancedOpen && "rotate-180"
              )} />
            </Button>
          </CollapsibleTrigger>
        </Collapsible>

        {/* Clear Filters */}
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-muted-foreground"
            onClick={clearFilters}
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>

      {/* Row 3: Advanced Filters (Collapsible) */}
      <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
        <CollapsibleContent>
          <div 
            className="p-4 rounded-lg border space-y-4"
            style={{ borderColor: `${theme.primaryColor}30` }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Authority Filter */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  {config.filterLabels.authority}
                </label>
                <div className="space-y-1.5">
                  {Object.entries(config.authorityLabels).map(([key, label]) => (
                    <div key={key} className="flex items-center gap-2">
                      <Checkbox
                        id={`auth-${key}`}
                        checked={filters.authorities.includes(key)}
                        onCheckedChange={() => toggleArrayFilter("authorities", key)}
                      />
                      <label htmlFor={`auth-${key}`} className="text-xs cursor-pointer">
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hierarchy Level Filter */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  {config.filterLabels.hierarchy}
                </label>
                <div className="space-y-1.5">
                  {Object.entries(config.hierarchyLabels).map(([key, label]) => (
                    <div key={key} className="flex items-center gap-2">
                      <Checkbox
                        id={`hier-${key}`}
                        checked={filters.hierarchyLevels.includes(key as any)}
                        onCheckedChange={() => toggleArrayFilter("hierarchyLevels", key)}
                      />
                      <label htmlFor={`hier-${key}`} className="text-xs cursor-pointer">
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deadline Preset */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Deadline
                </label>
                <div className="space-y-1.5">
                  {(["none", "next-30", "next-60", "next-90", "this-quarter"] as const).map((preset) => (
                    <div key={preset} className="flex items-center gap-2">
                      <Checkbox
                        id={`deadline-${preset}`}
                        checked={filters.deadlinePreset === preset}
                        onCheckedChange={() => updateFilter("deadlinePreset", preset)}
                      />
                      <label htmlFor={`deadline-${preset}`} className="text-xs cursor-pointer">
                        {preset === "none" ? "No filter" : 
                         preset === "next-30" ? "Next 30 days" :
                         preset === "next-60" ? "Next 60 days" :
                         preset === "next-90" ? "Next 90 days" :
                         "This quarter"}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Sort By
                </label>
                <div className="space-y-1.5">
                  {(["date", "risk", "deadline", "relevance"] as const).map((sort) => (
                    <div key={sort} className="flex items-center gap-2">
                      <Checkbox
                        id={`sort-${sort}`}
                        checked={filters.sortBy === sort}
                        onCheckedChange={() => updateFilter("sortBy", sort)}
                      />
                      <label htmlFor={`sort-${sort}`} className="text-xs cursor-pointer capitalize">
                        {sort}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export default UnifiedLegislationFilters;
