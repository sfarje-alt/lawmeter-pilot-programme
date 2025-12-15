import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCcw } from "lucide-react";
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

export function AnalyticsFilterBar({
  filters,
  onFiltersChange,
  totalItems,
  filteredItems,
}: AnalyticsFilterBarProps) {
  const hasActiveFilters = filters.dateRange !== "90";

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
    <div className="glass-card rounded-lg p-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Period Filter */}
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

        <div className="flex-1" />

        {/* Item Count */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{filteredItems}</span>
          <span>of {totalItems} items</span>
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
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
    </div>
  );
}
