import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
import { Calendar } from "@/components/ui/calendar";
import { 
  Filter, 
  Calendar as CalendarIcon, 
  X, 
  ChevronDown,
  Building2,
  Users,
  Tag,
  AlertTriangle,
  FileText
} from "lucide-react";
import { format, subDays, subMonths } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { IMPACT_LEVELS, ImpactLevel } from "@/data/peruAlertsMockData";

export interface AnalyticsFilters {
  areas: string[];
  sectors: string[];
  impactLevels: ImpactLevel[];
  legislativeStages: string[];
  parliamentaryGroups: string[];
  entities: string[];
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  legislationType: "all" | "proyecto_de_ley" | "norma";
}

export const DEFAULT_ANALYTICS_FILTERS: AnalyticsFilters = {
  areas: [],
  sectors: [],
  impactLevels: [],
  legislativeStages: [],
  parliamentaryGroups: [],
  entities: [],
  dateRange: { from: undefined, to: undefined },
  legislationType: "all",
};

// Dynamic options interface - all options come from data
export interface AnalyticsFilterOptions {
  areas: string[];
  sectors: string[];
  legislativeStages: string[];
  parliamentaryGroups: string[];
  entities: string[];
}

interface AnalyticsGlobalFiltersProps {
  filters: AnalyticsFilters;
  onFiltersChange: (filters: AnalyticsFilters) => void;
  filterOptions: AnalyticsFilterOptions;
}

// Quick date range options
const DATE_PRESETS = [
  { label: "Últimos 7 días", days: 7 },
  { label: "Últimos 30 días", days: 30 },
  { label: "Últimos 90 días", days: 90 },
  { label: "Últimos 6 meses", months: 6 },
  { label: "Último año", months: 12 },
];

export function AnalyticsGlobalFilters({ 
  filters, 
  onFiltersChange, 
  filterOptions 
}: AnalyticsGlobalFiltersProps) {
  
  const updateFilter = <K extends keyof AnalyticsFilters>(
    key: K, 
    value: AnalyticsFilters[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = <K extends keyof AnalyticsFilters>(
    key: K, 
    value: string
  ) => {
    const current = filters[key] as string[];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    onFiltersChange({ ...filters, [key]: updated });
  };

  const clearAllFilters = () => {
    onFiltersChange(DEFAULT_ANALYTICS_FILTERS);
  };

  const applyDatePreset = (preset: { days?: number; months?: number }) => {
    const to = new Date();
    let from: Date;
    if (preset.months) {
      from = subMonths(to, preset.months);
    } else if (preset.days) {
      from = subDays(to, preset.days);
    } else {
      from = to;
    }
    updateFilter("dateRange", { from, to });
  };

  // Count active filters
  const activeFiltersCount = [
    filters.areas.length,
    filters.sectors.length,
    filters.impactLevels.length,
    filters.legislativeStages.length,
    filters.parliamentaryGroups.length,
    filters.entities.length,
    filters.dateRange.from ? 1 : 0,
    filters.legislationType !== "all" ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <Card className="glass-card border-border/30">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          {/* Main filter row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Filtros:</span>
            </div>

            {/* Legislation type */}
            <Select 
              value={filters.legislationType} 
              onValueChange={(v) => updateFilter("legislationType", v as AnalyticsFilters["legislationType"])}
            >
              <SelectTrigger className="w-[150px] h-8 text-xs">
                <FileText className="h-3 w-3 mr-1" />
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="proyecto_de_ley">Proyectos de Ley</SelectItem>
                <SelectItem value="norma">Normas</SelectItem>
              </SelectContent>
            </Select>

            {/* Areas multi-select - dynamic */}
            {filterOptions.areas.length > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                    <Tag className="h-3 w-3" />
                    Áreas
                    {filters.areas.length > 0 && (
                      <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                        {filters.areas.length}
                      </Badge>
                    )}
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[250px] p-3" align="start">
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {filterOptions.areas.map(area => (
                      <div key={area} className="flex items-center gap-2">
                        <Checkbox
                          checked={filters.areas.includes(area)}
                          onCheckedChange={() => toggleArrayFilter("areas", area)}
                        />
                        <Label className="text-sm cursor-pointer">{area}</Label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {/* Sectors multi-select - dynamic */}
            {filterOptions.sectors.length > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                    <Building2 className="h-3 w-3" />
                    Sectores
                    {filters.sectors.length > 0 && (
                      <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                        {filters.sectors.length}
                      </Badge>
                    )}
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[250px] p-3" align="start">
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {filterOptions.sectors.map(sector => (
                      <div key={sector} className="flex items-center gap-2">
                        <Checkbox
                          checked={filters.sectors.includes(sector)}
                          onCheckedChange={() => toggleArrayFilter("sectors", sector)}
                        />
                        <Label className="text-sm cursor-pointer">{sector}</Label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {/* Impact levels multi-select */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Impacto
                  {filters.impactLevels.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                      {filters.impactLevels.length}
                    </Badge>
                  )}
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-3" align="start">
                <div className="space-y-2">
                  {IMPACT_LEVELS.map(level => (
                    <div key={level.value} className="flex items-center gap-2">
                      <Checkbox
                        checked={filters.impactLevels.includes(level.value)}
                        onCheckedChange={() => toggleArrayFilter("impactLevels", level.value)}
                      />
                      <Badge className={cn("text-xs", level.color)}>{level.label}</Badge>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Legislative stages - only show for bills and when options exist */}
            {filters.legislationType !== "norma" && filterOptions.legislativeStages.length > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                    Estados
                    {filters.legislativeStages.length > 0 && (
                      <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                        {filters.legislativeStages.length}
                      </Badge>
                    )}
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-3" align="start">
                  <div className="space-y-2 max-h-[250px] overflow-y-auto">
                    {filterOptions.legislativeStages.map(stage => (
                      <div key={stage} className="flex items-center gap-2">
                        <Checkbox
                          checked={filters.legislativeStages.includes(stage)}
                          onCheckedChange={() => toggleArrayFilter("legislativeStages", stage)}
                        />
                        <Label className="text-xs cursor-pointer">{stage}</Label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {/* Parliamentary groups - only show for bills and when options exist */}
            {filters.legislationType !== "norma" && filterOptions.parliamentaryGroups.length > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                    <Users className="h-3 w-3" />
                    Grupo Parl.
                    {filters.parliamentaryGroups.length > 0 && (
                      <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                        {filters.parliamentaryGroups.length}
                      </Badge>
                    )}
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[220px] p-3" align="start">
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {filterOptions.parliamentaryGroups.map(group => (
                      <div key={group} className="flex items-center gap-2">
                        <Checkbox
                          checked={filters.parliamentaryGroups.includes(group)}
                          onCheckedChange={() => toggleArrayFilter("parliamentaryGroups", group)}
                        />
                        <Label className="text-xs cursor-pointer">{group}</Label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {/* Entities - only show for regulations and when options exist */}
            {filters.legislationType !== "proyecto_de_ley" && filterOptions.entities.length > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                    <Building2 className="h-3 w-3" />
                    Institución
                    {filters.entities.length > 0 && (
                      <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                        {filters.entities.length}
                      </Badge>
                    )}
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-3" align="start">
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {filterOptions.entities.map(entity => (
                      <div key={entity} className="flex items-center gap-2">
                        <Checkbox
                          checked={filters.entities.includes(entity)}
                          onCheckedChange={() => toggleArrayFilter("entities", entity)}
                        />
                        <Label className="text-sm cursor-pointer">{entity}</Label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {/* Date range */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                  <CalendarIcon className="h-3 w-3" />
                  {filters.dateRange.from ? (
                    filters.dateRange.to ? (
                      <>
                        {format(filters.dateRange.from, "dd/MM", { locale: es })} - {format(filters.dateRange.to, "dd/MM/yy", { locale: es })}
                      </>
                    ) : (
                      format(filters.dateRange.from, "dd/MM/yy", { locale: es })
                    )
                  ) : (
                    "Fechas"
                  )}
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3" align="start">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {DATE_PRESETS.map(preset => (
                      <Button
                        key={preset.label}
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => applyDatePreset(preset)}
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Calendar
                      mode="range"
                      selected={{ from: filters.dateRange.from, to: filters.dateRange.to }}
                      onSelect={(range) => updateFilter("dateRange", { from: range?.from, to: range?.to })}
                      numberOfMonths={2}
                      className="rounded-md border pointer-events-auto"
                    />
                  </div>
                  {filters.dateRange.from && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => updateFilter("dateRange", { from: undefined, to: undefined })}
                    >
                      Limpiar fechas
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            {/* Clear all button */}
            {activeFiltersCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllFilters}
                className="h-8 text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3 mr-1" />
                Limpiar ({activeFiltersCount})
              </Button>
            )}
          </div>

          {/* Active filters display */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border/30">
              {filters.legislationType !== "all" && (
                <Badge variant="secondary" className="text-xs gap-1">
                  {filters.legislationType === "proyecto_de_ley" ? "Proyectos de Ley" : "Normas"}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter("legislationType", "all")}
                  />
                </Badge>
              )}
              {filters.areas.map(area => (
                <Badge key={area} variant="secondary" className="text-xs gap-1">
                  {area}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => toggleArrayFilter("areas", area)}
                  />
                </Badge>
              ))}
              {filters.sectors.map(sector => (
                <Badge key={sector} variant="secondary" className="text-xs gap-1">
                  {sector}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => toggleArrayFilter("sectors", sector)}
                  />
                </Badge>
              ))}
              {filters.impactLevels.map(level => {
                const info = IMPACT_LEVELS.find(l => l.value === level);
                return (
                  <Badge key={level} className={cn("text-xs gap-1", info?.color)}>
                    {info?.label}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => toggleArrayFilter("impactLevels", level)}
                    />
                  </Badge>
                );
              })}
              {filters.legislativeStages.map(stage => (
                <Badge key={stage} variant="secondary" className="text-xs gap-1">
                  {stage.length > 20 ? stage.substring(0, 20) + "..." : stage}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => toggleArrayFilter("legislativeStages", stage)}
                  />
                </Badge>
              ))}
              {filters.parliamentaryGroups.map(group => (
                <Badge key={group} variant="secondary" className="text-xs gap-1">
                  {group}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => toggleArrayFilter("parliamentaryGroups", group)}
                  />
                </Badge>
              ))}
              {filters.entities.map(entity => (
                <Badge key={entity} variant="secondary" className="text-xs gap-1">
                  {entity}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => toggleArrayFilter("entities", entity)}
                  />
                </Badge>
              ))}
              {filters.dateRange.from && (
                <Badge variant="secondary" className="text-xs gap-1">
                  {format(filters.dateRange.from, "dd/MM/yy", { locale: es })}
                  {filters.dateRange.to && ` - ${format(filters.dateRange.to, "dd/MM/yy", { locale: es })}`}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter("dateRange", { from: undefined, to: undefined })}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
