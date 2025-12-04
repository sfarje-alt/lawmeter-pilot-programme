import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Slider } from "@/components/ui/slider";
import { Filter, X, Search, SlidersHorizontal } from "lucide-react";
import { RegulatoryCategory, REGULATORY_CATEGORIES, LegislativeCategory } from "@/data/mockInternationalLegislation";

export interface LegislationFilters {
  search: string;
  regulatoryCategories: RegulatoryCategory[];
  riskLevels: ("low" | "medium" | "high")[];
  legislativeCategory: LegislativeCategory | "all";
  riskScoreRange: [number, number];
  hasDeadline: boolean | null;
  sortBy: "date" | "risk" | "deadline";
  sortOrder: "asc" | "desc";
}

interface LegislationAdvancedFiltersProps {
  filters: LegislationFilters;
  onFiltersChange: (filters: LegislationFilters) => void;
  totalCount: number;
  filteredCount: number;
}

export const defaultLegislationFilters: LegislationFilters = {
  search: "",
  regulatoryCategories: [],
  riskLevels: [],
  legislativeCategory: "all",
  riskScoreRange: [0, 100],
  hasDeadline: null,
  sortBy: "date",
  sortOrder: "desc",
};

export function LegislationAdvancedFilters({
  filters,
  onFiltersChange,
  totalCount,
  filteredCount,
}: LegislationAdvancedFiltersProps) {
  const [open, setOpen] = useState(false);

  const activeFiltersCount = [
    filters.regulatoryCategories.length > 0,
    filters.riskLevels.length > 0,
    filters.riskScoreRange[0] > 0 || filters.riskScoreRange[1] < 100,
    filters.hasDeadline !== null,
  ].filter(Boolean).length;

  const handleRegulatoryCategory = (category: RegulatoryCategory, checked: boolean) => {
    const newCategories = checked
      ? [...filters.regulatoryCategories, category]
      : filters.regulatoryCategories.filter((c) => c !== category);
    onFiltersChange({ ...filters, regulatoryCategories: newCategories });
  };

  const handleRiskLevel = (level: "low" | "medium" | "high", checked: boolean) => {
    const newLevels = checked
      ? [...filters.riskLevels, level]
      : filters.riskLevels.filter((l) => l !== level);
    onFiltersChange({ ...filters, riskLevels: newLevels });
  };

  const clearFilters = () => {
    onFiltersChange(defaultLegislationFilters);
  };

  return (
    <div className="space-y-4">
      {/* Search and Quick Filters Row */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search legislation..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-9"
          />
        </div>

        {/* Sort Controls */}
        <Select
          value={filters.sortBy}
          onValueChange={(v) => onFiltersChange({ ...filters, sortBy: v as any })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="risk">Risk Score</SelectItem>
            <SelectItem value="deadline">Deadline</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.sortOrder}
          onValueChange={(v) => onFiltersChange({ ...filters, sortOrder: v as any })}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Newest</SelectItem>
            <SelectItem value="asc">Oldest</SelectItem>
          </SelectContent>
        </Select>

        {/* Advanced Filters Popover */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4 bg-background border" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Advanced Filters</h4>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear all
                </Button>
              </div>

              {/* Regulatory Categories */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Regulatory Category</Label>
                <div className="grid grid-cols-1 gap-2">
                  {REGULATORY_CATEGORIES.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cat-${category}`}
                        checked={filters.regulatoryCategories.includes(category)}
                        onCheckedChange={(checked) =>
                          handleRegulatoryCategory(category, checked as boolean)
                        }
                      />
                      <label htmlFor={`cat-${category}`} className="text-sm cursor-pointer">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Levels */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Risk Level</Label>
                <div className="flex gap-2">
                  {(["high", "medium", "low"] as const).map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <Checkbox
                        id={`risk-${level}`}
                        checked={filters.riskLevels.includes(level)}
                        onCheckedChange={(checked) =>
                          handleRiskLevel(level, checked as boolean)
                        }
                      />
                      <label htmlFor={`risk-${level}`} className="text-sm capitalize cursor-pointer">
                        {level}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Score Range */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Risk Score: {filters.riskScoreRange[0]} - {filters.riskScoreRange[1]}
                </Label>
                <Slider
                  min={0}
                  max={100}
                  step={5}
                  value={filters.riskScoreRange}
                  onValueChange={(value) =>
                    onFiltersChange({ ...filters, riskScoreRange: value as [number, number] })
                  }
                />
              </div>

              {/* Has Deadline */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Compliance Deadline</Label>
                <Select
                  value={filters.hasDeadline === null ? "all" : filters.hasDeadline ? "yes" : "no"}
                  onValueChange={(v) =>
                    onFiltersChange({
                      ...filters,
                      hasDeadline: v === "all" ? null : v === "yes",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="yes">Has deadline</SelectItem>
                    <SelectItem value="no">No deadline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          {filteredCount} of {totalCount} alerts
        </div>
      </div>

      {/* Active Filter Tags */}
      {(filters.regulatoryCategories.length > 0 ||
        filters.riskLevels.length > 0 ||
        filters.search) && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Search: {filters.search}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onFiltersChange({ ...filters, search: "" })}
              />
            </Badge>
          )}
          {filters.regulatoryCategories.map((cat) => (
            <Badge key={cat} variant="secondary" className="gap-1">
              {cat}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleRegulatoryCategory(cat, false)}
              />
            </Badge>
          ))}
          {filters.riskLevels.map((level) => (
            <Badge
              key={level}
              variant="secondary"
              className={`gap-1 ${
                level === "high"
                  ? "bg-risk-high/20 text-risk-high"
                  : level === "medium"
                  ? "bg-risk-medium/20 text-risk-medium"
                  : "bg-risk-low/20 text-risk-low"
              }`}
            >
              {level} risk
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleRiskLevel(level, false)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
