import { FilterState } from "@/types/legislation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Filter, X } from "lucide-react";

interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  portfolios: string[];
  types: string[];
  parties?: string[];
  showPartyFilters?: boolean;
}

export function FilterBar({
  filters,
  onFiltersChange,
  portfolios,
  types,
  parties = [],
  showPartyFilters = false,
}: FilterBarProps) {
  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleMultiSelect = (key: "portfolios" | "types" | "parties", value: string) => {
    const current = filters[key] as string[];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateFilter(key, updated);
  };

  const clearFilters = () => {
    onFiltersChange({
      timeWindow: "all",
      portfolios: [],
      regulators: [],
      types: [],
      riskScoreRange: [0, 100],
      parties: [],
      mpSearch: "",
      searchText: "",
    });
  };

  const hasActiveFilters =
    filters.portfolios.length > 0 ||
    filters.types.length > 0 ||
    filters.parties.length > 0 ||
    filters.riskScoreRange[0] !== 0 ||
    filters.riskScoreRange[1] !== 100 ||
    filters.searchText !== "";

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <Input
          placeholder="Search legislation, bills, acts..."
          value={filters.searchText}
          onChange={(e) => updateFilter("searchText", e.target.value)}
          className="flex-1"
        />

        <div className="flex flex-wrap gap-2">
          <Select value={filters.timeWindow} onValueChange={(v) => updateFilter("timeWindow", v as FilterState["timeWindow"])}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All time</SelectItem>
              <SelectItem value="1w">Last 1 week</SelectItem>
              <SelectItem value="2w">Last 2 weeks</SelectItem>
              <SelectItem value="4w">Last 4 weeks</SelectItem>
              <SelectItem value="8w">Last 8 weeks</SelectItem>
              <SelectItem value="12w">Last 12 weeks</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="1y">Last 1 year</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Portfolios
                {filters.portfolios.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {filters.portfolios.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {portfolios.map((portfolio) => (
                  <div key={portfolio} className="flex items-center gap-2">
                    <Checkbox
                      checked={filters.portfolios.includes(portfolio)}
                      onCheckedChange={() => toggleMultiSelect("portfolios", portfolio)}
                    />
                    <label className="text-sm cursor-pointer flex-1">
                      {portfolio}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Types
                {filters.types.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {filters.types.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {types.map((type) => (
                  <div key={type} className="flex items-center gap-2">
                    <Checkbox
                      checked={filters.types.includes(type)}
                      onCheckedChange={() => toggleMultiSelect("types", type)}
                    />
                    <label className="text-sm cursor-pointer flex-1">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {showPartyFilters && parties.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Party
                  {filters.parties.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                      {filters.parties.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  {parties.map((party) => (
                    <div key={party} className="flex items-center gap-2">
                      <Checkbox
                        checked={filters.parties.includes(party)}
                        onCheckedChange={() => toggleMultiSelect("parties", party)}
                      />
                      <label className="text-sm cursor-pointer flex-1">
                        {party}
                      </label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Risk Score
                {(filters.riskScoreRange[0] !== 0 || filters.riskScoreRange[1] !== 100) && (
                  <Badge variant="secondary" className="ml-1">
                    {filters.riskScoreRange[0]}-{filters.riskScoreRange[1]}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div>
                  <p className="text-sm mb-2">
                    Range: {filters.riskScoreRange[0]} - {filters.riskScoreRange[1]}
                  </p>
                  <Slider
                    value={filters.riskScoreRange}
                    onValueChange={(value) => updateFilter("riskScoreRange", value as [number, number])}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateFilter("riskScoreRange", [1, 39])}
                  >
                    Low (1-39)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateFilter("riskScoreRange", [40, 79])}
                  >
                    Medium (40-79)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateFilter("riskScoreRange", [80, 100])}
                  >
                    High (80-100)
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {hasActiveFilters && (
            <Button variant="ghost" size="icon" onClick={clearFilters}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.portfolios.map((p) => (
            <Badge key={p} variant="secondary" className="gap-1">
              {p}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleMultiSelect("portfolios", p)}
              />
            </Badge>
          ))}
          {filters.types.map((t) => (
            <Badge key={t} variant="secondary" className="gap-1">
              {t}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleMultiSelect("types", t)}
              />
            </Badge>
          ))}
          {filters.parties.map((p) => (
            <Badge key={p} variant="secondary" className="gap-1">
              {p}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleMultiSelect("parties", p)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
