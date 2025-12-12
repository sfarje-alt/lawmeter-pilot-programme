import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, X, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AnalyticsFilters {
  dateRange: string;
  jurisdictions: string[];
  riskLevels: ("high" | "medium" | "low")[];
  lifecycle: "all" | "in-force" | "pipeline";
  categories: string[];
}

interface AnalyticsFilterBarProps {
  filters: AnalyticsFilters;
  onFiltersChange: (filters: AnalyticsFilters) => void;
  totalItems: number;
  filteredItems: number;
}

const JURISDICTIONS = [
  { value: "NAM", label: "🌎 North America" },
  { value: "USA", label: "🇺🇸 USA" },
  { value: "Canada", label: "🇨🇦 Canada" },
  { value: "LATAM", label: "🌎 Latin America" },
  { value: "EU", label: "🇪🇺 European Union" },
  { value: "GCC", label: "🏜️ GCC" },
  { value: "APAC", label: "🌏 Asia-Pacific" },
  { value: "Japan", label: "🇯🇵 Japan" },
  { value: "Korea", label: "🇰🇷 Korea" },
  { value: "Taiwan", label: "🇹🇼 Taiwan" },
];

const RISK_LEVELS = [
  { value: "high", label: "High Risk", color: "bg-risk-high" },
  { value: "medium", label: "Medium Risk", color: "bg-risk-medium" },
  { value: "low", label: "Low Risk", color: "bg-risk-low" },
];

const CATEGORIES = [
  "Radio",
  "Product Safety",
  "Cybersecurity",
  "Battery",
  "Food Contact Material",
];

export function AnalyticsFilterBar({
  filters,
  onFiltersChange,
  totalItems,
  filteredItems,
}: AnalyticsFilterBarProps) {
  const activeFilterCount = 
    (filters.jurisdictions.length > 0 ? 1 : 0) +
    (filters.riskLevels.length > 0 ? 1 : 0) +
    (filters.lifecycle !== "all" ? 1 : 0) +
    (filters.categories.length > 0 ? 1 : 0);

  const resetFilters = () => {
    onFiltersChange({
      dateRange: "90",
      jurisdictions: [],
      riskLevels: [],
      lifecycle: "all",
      categories: [],
    });
  };

  return (
    <div className="glass-card rounded-lg p-4 space-y-4">
      {/* Top Row - Date Range and Lifecycle */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Period:</span>
          <Select
            value={filters.dateRange}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, dateRange: value })
            }
          >
            <SelectTrigger className="w-[140px] bg-muted/50 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="180">Last 6 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="h-6 w-px bg-border/50" />

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Status:</span>
          <div className="flex gap-1">
            {(["all", "in-force", "pipeline"] as const).map((lifecycle) => (
              <Button
                key={lifecycle}
                variant={filters.lifecycle === lifecycle ? "default" : "outline"}
                size="sm"
                onClick={() => onFiltersChange({ ...filters, lifecycle })}
                className={cn(
                  "text-xs",
                  filters.lifecycle === lifecycle && "bg-primary text-primary-foreground"
                )}
              >
                {lifecycle === "all" ? "All" : lifecycle === "in-force" ? "In Force" : "Pipeline"}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{filteredItems}</span>
          <span>of {totalItems} items</span>
        </div>

        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        )}
      </div>

      {/* Bottom Row - Advanced Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Jurisdiction Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "gap-2",
                filters.jurisdictions.length > 0 && "border-primary bg-primary/10"
              )}
            >
              <Filter className="w-3 h-3" />
              Jurisdiction
              {filters.jurisdictions.length > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                  {filters.jurisdictions.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3" align="start">
            <div className="space-y-2">
              <div className="text-sm font-medium">Jurisdictions</div>
              {JURISDICTIONS.map((j) => (
                <label key={j.value} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={filters.jurisdictions.includes(j.value)}
                    onCheckedChange={(checked) => {
                      const newJurisdictions = checked
                        ? [...filters.jurisdictions, j.value]
                        : filters.jurisdictions.filter((v) => v !== j.value);
                      onFiltersChange({ ...filters, jurisdictions: newJurisdictions });
                    }}
                  />
                  <span className="text-sm">{j.label}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Risk Level Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "gap-2",
                filters.riskLevels.length > 0 && "border-primary bg-primary/10"
              )}
            >
              <Filter className="w-3 h-3" />
              Risk Level
              {filters.riskLevels.length > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                  {filters.riskLevels.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-3" align="start">
            <div className="space-y-2">
              <div className="text-sm font-medium">Risk Levels</div>
              {RISK_LEVELS.map((r) => (
                <label key={r.value} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={filters.riskLevels.includes(r.value as any)}
                    onCheckedChange={(checked) => {
                      const newRiskLevels = checked
                        ? [...filters.riskLevels, r.value as any]
                        : filters.riskLevels.filter((v) => v !== r.value);
                      onFiltersChange({ ...filters, riskLevels: newRiskLevels });
                    }}
                  />
                  <div className={cn("w-2 h-2 rounded-full", r.color)} />
                  <span className="text-sm">{r.label}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Category Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "gap-2",
                filters.categories.length > 0 && "border-primary bg-primary/10"
              )}
            >
              <Filter className="w-3 h-3" />
              Category
              {filters.categories.length > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                  {filters.categories.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3" align="start">
            <div className="space-y-2">
              <div className="text-sm font-medium">Regulatory Categories</div>
              {CATEGORIES.map((cat) => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={filters.categories.includes(cat)}
                    onCheckedChange={(checked) => {
                      const newCategories = checked
                        ? [...filters.categories, cat]
                        : filters.categories.filter((v) => v !== cat);
                      onFiltersChange({ ...filters, categories: newCategories });
                    }}
                  />
                  <span className="text-sm">{cat}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Active Filter Tags */}
        {filters.jurisdictions.map((j) => (
          <Badge key={j} variant="secondary" className="gap-1 pl-2 pr-1">
            {JURISDICTIONS.find((x) => x.value === j)?.label || j}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() =>
                onFiltersChange({
                  ...filters,
                  jurisdictions: filters.jurisdictions.filter((v) => v !== j),
                })
              }
            >
              <X className="w-3 h-3" />
            </Button>
          </Badge>
        ))}
        {filters.riskLevels.map((r) => (
          <Badge key={r} variant="secondary" className="gap-1 pl-2 pr-1">
            {r.charAt(0).toUpperCase() + r.slice(1)} Risk
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() =>
                onFiltersChange({
                  ...filters,
                  riskLevels: filters.riskLevels.filter((v) => v !== r),
                })
              }
            >
              <X className="w-3 h-3" />
            </Button>
          </Badge>
        ))}
        {filters.categories.map((c) => (
          <Badge key={c} variant="secondary" className="gap-1 pl-2 pr-1">
            {c}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() =>
                onFiltersChange({
                  ...filters,
                  categories: filters.categories.filter((v) => v !== c),
                })
              }
            >
              <X className="w-3 h-3" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
