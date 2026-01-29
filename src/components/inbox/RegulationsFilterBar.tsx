import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Search, X, Pin, CalendarIcon } from "lucide-react";
import { RegulationsFilters } from "./RegulationsInbox";
import { format, subDays } from "date-fns";
import { es } from "date-fns/locale";
import { IMPACT_LEVELS } from "@/data/peruAlertsMockData";
import { cn } from "@/lib/utils";
import { MultiSelect, MultiSelectOption } from "@/components/ui/multi-select";

interface RegulationsFilterBarProps {
  filters: RegulationsFilters;
  onFiltersChange: (filters: RegulationsFilters) => void;
  availableEntities: string[];
  availableSectors: string[];
  availableImpactLevels: string[];
  availableAreas: string[];
  availableClients: { id: string; name: string }[];
  totalCount: number;
  filteredCount: number;
  pinnedCount: number;
}

const QUICK_DATE_OPTIONS = [
  { label: "Últimos 7 días", days: 7 },
  { label: "Últimos 15 días", days: 15 },
  { label: "Últimos 30 días", days: 30 },
  { label: "Últimos 60 días", days: 60 },
  { label: "Últimos 90 días", days: 90 },
];

export function RegulationsFilterBar({ 
  filters, 
  onFiltersChange, 
  availableEntities,
  availableSectors,
  availableImpactLevels,
  availableAreas,
  availableClients,
  totalCount,
  filteredCount,
  pinnedCount
}: RegulationsFilterBarProps) {
  const hasActiveFilters = 
    filters.search !== "" || 
    filters.areas.length > 0 || 
    filters.entities.length > 0 ||
    filters.sectors.length > 0 ||
    filters.impactLevels.length > 0 ||
    filters.clientIds.length > 0 ||
    filters.dateFrom !== undefined ||
    filters.dateTo !== undefined ||
    filters.onlyPinned;

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      areas: [],
      entities: [],
      sectors: [],
      impactLevels: [],
      clientIds: [],
      dateFrom: undefined,
      dateTo: undefined,
      onlyPinned: false,
    });
  };

  const applyQuickDateFilter = (days: number) => {
    const today = new Date();
    const fromDate = subDays(today, days);
    onFiltersChange({ ...filters, dateFrom: fromDate, dateTo: today });
  };

  // Build options for multiselects
  const impactOptions: MultiSelectOption[] = availableImpactLevels.map(level => {
    const levelInfo = IMPACT_LEVELS.find(l => l.value === level);
    return {
      value: level,
      label: levelInfo?.label || level,
      icon: (
        <div className={cn("w-2 h-2 rounded-full", 
          level === "positivo" && "bg-green-500",
          level === "leve" && "bg-gray-400",
          level === "medio" && "bg-yellow-500",
          level === "grave" && "bg-red-500"
        )} />
      ),
    };
  });

  const sectorOptions: MultiSelectOption[] = availableSectors.map(sector => ({
    value: sector,
    label: sector,
  }));

  const entityOptions: MultiSelectOption[] = availableEntities.map(entity => ({
    value: entity,
    label: entity,
  }));

  const areaOptions: MultiSelectOption[] = availableAreas.map(area => ({
    value: area,
    label: area,
  }));

  const clientOptions: MultiSelectOption[] = availableClients.map(client => ({
    value: client.id,
    label: client.name,
  }));

  return (
    <div className="space-y-3">
      {/* Main Filter Row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por título, entidad, resumen..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-10 bg-muted/30 border-border/50 h-9"
          />
        </div>

        {/* Pinned Filter Toggle */}
        <Toggle
          pressed={filters.onlyPinned}
          onPressedChange={(pressed) => onFiltersChange({ ...filters, onlyPinned: pressed })}
          className="gap-1.5 h-9 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          aria-label="Solo pineados"
        >
          <Pin className="h-4 w-4" />
          <span className="hidden sm:inline text-sm">Pineados</span>
          {pinnedCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
              {pinnedCount}
            </Badge>
          )}
        </Toggle>

        {/* Impact Level Filter - MultiSelect */}
        <MultiSelect
          options={impactOptions}
          selected={filters.impactLevels}
          onChange={(impactLevels) => onFiltersChange({ ...filters, impactLevels })}
          placeholder="Impacto: Todos"
          className="w-[160px]"
        />

        {/* Sector Filter - MultiSelect */}
        <MultiSelect
          options={sectorOptions}
          selected={filters.sectors}
          onChange={(sectors) => onFiltersChange({ ...filters, sectors })}
          placeholder="Sector: Todos"
          className="w-[160px]"
        />

        {/* Entity Filter - MultiSelect */}
        <MultiSelect
          options={entityOptions}
          selected={filters.entities}
          onChange={(entities) => onFiltersChange({ ...filters, entities })}
          placeholder="Institución: Todas"
          className="w-[175px]"
        />

        {/* Client Filter - MultiSelect */}
        <MultiSelect
          options={clientOptions}
          selected={filters.clientIds}
          onChange={(clientIds) => onFiltersChange({ ...filters, clientIds })}
          placeholder="Cliente: Todos"
          className="w-[170px]"
        />

        {/* Date Range Filter with Quick Options */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className={cn(
                "h-9 gap-1.5 bg-muted/30 border-border/50 text-sm",
                (filters.dateFrom || filters.dateTo) && "border-primary/50"
              )}
            >
              <CalendarIcon className="h-4 w-4" />
              <span className="hidden sm:inline">
                {filters.dateFrom && filters.dateTo
                  ? `${format(filters.dateFrom, "dd/MM", { locale: es })} - ${format(filters.dateTo, "dd/MM", { locale: es })}`
                  : filters.dateFrom
                  ? `Desde ${format(filters.dateFrom, "dd/MM", { locale: es })}`
                  : filters.dateTo
                  ? `Hasta ${format(filters.dateTo, "dd/MM", { locale: es })}`
                  : "Fechas"
                }
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 z-50" align="start">
            <div className="p-3 space-y-3">
              {/* Quick Date Options */}
              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground mb-2">Acceso rápido</div>
                <div className="flex flex-wrap gap-1">
                  {QUICK_DATE_OPTIONS.map((option) => (
                    <Button
                      key={option.days}
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => applyQuickDateFilter(option.days)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-3">
                <div className="text-xs font-medium text-muted-foreground mb-2">Rango personalizado</div>
                <div className="flex gap-2">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Desde</div>
                    <Calendar
                      mode="single"
                      selected={filters.dateFrom}
                      onSelect={(date) => onFiltersChange({ ...filters, dateFrom: date })}
                      locale={es}
                      className="rounded-md border pointer-events-auto"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Hasta</div>
                    <Calendar
                      mode="single"
                      selected={filters.dateTo}
                      onSelect={(date) => onFiltersChange({ ...filters, dateTo: date })}
                      locale={es}
                      className="rounded-md border pointer-events-auto"
                    />
                  </div>
                </div>
              </div>
              
              {(filters.dateFrom || filters.dateTo) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => onFiltersChange({ ...filters, dateFrom: undefined, dateTo: undefined })}
                >
                  Limpiar fechas
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Area Filter - MultiSelect */}
        <MultiSelect
          options={areaOptions}
          selected={filters.areas}
          onChange={(areas) => onFiltersChange({ ...filters, areas })}
          placeholder="Área: Todas"
          className="w-[160px]"
        />

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-9 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">
            Mostrando {filteredCount} de {totalCount} normas:
          </span>
          {filters.search && (
            <Badge variant="secondary" className="gap-1 text-xs">
              Búsqueda: "{filters.search}"
              <button onClick={() => onFiltersChange({ ...filters, search: "" })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.onlyPinned && (
            <Badge variant="secondary" className="gap-1 text-xs bg-primary/20 text-primary">
              <Pin className="h-3 w-3" />
              Solo pineados
              <button onClick={() => onFiltersChange({ ...filters, onlyPinned: false })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.impactLevels.map(level => (
            <Badge key={level} variant="secondary" className={cn(
              "gap-1 text-xs",
              IMPACT_LEVELS.find(l => l.value === level)?.color
            )}>
              Impacto: {IMPACT_LEVELS.find(l => l.value === level)?.label || level}
              <button onClick={() => onFiltersChange({ ...filters, impactLevels: filters.impactLevels.filter(l => l !== level) })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.sectors.map(sector => (
            <Badge key={sector} variant="secondary" className="gap-1 text-xs">
              Sector: {sector}
              <button onClick={() => onFiltersChange({ ...filters, sectors: filters.sectors.filter(s => s !== sector) })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.entities.map(entity => (
            <Badge key={entity} variant="secondary" className="gap-1 text-xs">
              Institución: {entity}
              <button onClick={() => onFiltersChange({ ...filters, entities: filters.entities.filter(e => e !== entity) })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.areas.map(area => (
            <Badge key={area} variant="secondary" className="gap-1 text-xs">
              Área: {area}
              <button onClick={() => onFiltersChange({ ...filters, areas: filters.areas.filter(a => a !== area) })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.clientIds.map(clientId => {
            const client = availableClients.find(c => c.id === clientId);
            return (
              <Badge key={clientId} variant="secondary" className="gap-1 text-xs bg-blue-500/20 text-blue-300">
                Cliente: {client?.name || clientId}
                <button onClick={() => onFiltersChange({ ...filters, clientIds: filters.clientIds.filter(c => c !== clientId) })}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
          {(filters.dateFrom || filters.dateTo) && (
            <Badge variant="secondary" className="gap-1 text-xs">
              {filters.dateFrom && filters.dateTo
                ? `${format(filters.dateFrom, "dd/MM/yy")} - ${format(filters.dateTo, "dd/MM/yy")}`
                : filters.dateFrom
                ? `Desde ${format(filters.dateFrom, "dd/MM/yy")}`
                : `Hasta ${format(filters.dateTo!, "dd/MM/yy")}`
              }
              <button onClick={() => onFiltersChange({ ...filters, dateFrom: undefined, dateTo: undefined })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
