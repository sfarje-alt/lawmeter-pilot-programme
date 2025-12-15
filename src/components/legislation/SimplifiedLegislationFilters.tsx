import { useMemo } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  FileText,
  Clock,
  Gavel,
  ChevronDown,
  AlertTriangle,
  Calendar,
  ArrowUpDown,
  X
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SimplifiedFilterState {
  lifecycle: "all" | "in-force" | "pipeline";
  riskLevels: string[];
  deadlinePreset: string;
  sortBy: string;
}

interface SimplifiedLegislationFiltersProps {
  filters: SimplifiedFilterState;
  onFiltersChange: (filters: SimplifiedFilterState) => void;
  counts: {
    all: number;
    inForce: number;
    pipeline: number;
  };
}

export const defaultSimplifiedFilters: SimplifiedFilterState = {
  lifecycle: "all",
  riskLevels: [],
  deadlinePreset: "none",
  sortBy: "date-desc"
};

export function SimplifiedLegislationFilters({
  filters,
  onFiltersChange,
  counts
}: SimplifiedLegislationFiltersProps) {
  
  const updateFilter = <K extends keyof SimplifiedFilterState>(
    key: K, 
    value: SimplifiedFilterState[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleRiskLevel = (value: string) => {
    const current = filters.riskLevels;
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    onFiltersChange({ ...filters, riskLevels: updated });
  };

  const clearFilters = () => {
    onFiltersChange(defaultSimplifiedFilters);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.riskLevels.length > 0) count++;
    if (filters.deadlinePreset !== "none") count++;
    return count;
  }, [filters]);

  const lifecycleIcons = {
    all: <FileText className="h-4 w-4" />,
    "in-force": <Gavel className="h-4 w-4" />,
    pipeline: <Clock className="h-4 w-4" />
  };

  return (
    <div className="flex items-center gap-3 flex-wrap p-3 rounded-lg bg-muted/30">
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

      {/* Risk Level Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant={filters.riskLevels.length > 0 ? "default" : "outline"} 
            size="sm" 
            className="h-8 gap-1.5"
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
        <PopoverContent className="w-48 p-3 bg-popover" align="start">
          <div className="space-y-2">
            {(["high", "medium", "low"] as const).map((level) => (
              <div key={level} className="flex items-center gap-2">
                <Checkbox
                  id={`risk-${level}`}
                  checked={filters.riskLevels.includes(level)}
                  onCheckedChange={() => toggleRiskLevel(level)}
                />
                <label htmlFor={`risk-${level}`} className="text-sm cursor-pointer capitalize">
                  {level}
                </label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Deadline Filter */}
      <Select
        value={filters.deadlinePreset}
        onValueChange={(v) => updateFilter("deadlinePreset", v)}
      >
        <SelectTrigger className="w-[140px] h-8 text-xs">
          <Calendar className="h-3.5 w-3.5 mr-1.5" />
          <SelectValue placeholder="Deadline" />
        </SelectTrigger>
        <SelectContent className="bg-popover">
          <SelectItem value="none">Any Deadline</SelectItem>
          <SelectItem value="7days">Next 7 Days</SelectItem>
          <SelectItem value="30days">Next 30 Days</SelectItem>
          <SelectItem value="90days">Next 90 Days</SelectItem>
          <SelectItem value="overdue">Overdue</SelectItem>
        </SelectContent>
      </Select>

      {/* Sort By */}
      <Select
        value={filters.sortBy}
        onValueChange={(v) => updateFilter("sortBy", v)}
      >
        <SelectTrigger className="w-[150px] h-8 text-xs">
          <ArrowUpDown className="h-3.5 w-3.5 mr-1.5" />
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className="bg-popover">
          <SelectItem value="date-desc">Newest First</SelectItem>
          <SelectItem value="date-asc">Oldest First</SelectItem>
          <SelectItem value="risk-desc">Risk: High to Low</SelectItem>
          <SelectItem value="risk-asc">Risk: Low to High</SelectItem>
          <SelectItem value="deadline">Deadline</SelectItem>
        </SelectContent>
      </Select>

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
  );
}
