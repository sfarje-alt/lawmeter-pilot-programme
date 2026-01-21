import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Search, X, Pin, CalendarIcon, Filter } from "lucide-react";
import { BillsFilters } from "./BillsInbox";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { SECTORS, ALL_LEGISLATIVE_STAGES, IMPACT_LEVELS, ImpactLevel } from "@/data/peruAlertsMockData";
import { cn } from "@/lib/utils";

interface BillsFilterBarProps {
  filters: BillsFilters;
  onFiltersChange: (filters: BillsFilters) => void;
  availableParliamentaryGroups: string[];
  totalCount: number;
  filteredCount: number;
  pinnedCount: number;
}

const AREAS = [
  "General",
  "Oncológico",
  "Raras y huérfanas",
  "Dispositivos Médicos",
  "Financiamiento y Presupuesto",
  "Contrataciones Públicas",
  "Salud Mental",
  "Tecnología",
  "Investigación",
  "Laboral",
];

export function BillsFilterBar({ 
  filters, 
  onFiltersChange, 
  availableParliamentaryGroups,
  totalCount,
  filteredCount,
  pinnedCount
}: BillsFilterBarProps) {
  const hasActiveFilters = 
    filters.search !== "" || 
    filters.area !== "all" || 
    filters.stage !== "all" ||
    filters.sector !== "all" ||
    filters.parliamentaryGroup !== "all" ||
    filters.impactLevel !== "all" ||
    filters.dateFrom !== undefined ||
    filters.dateTo !== undefined ||
    filters.onlyPinned;

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      area: "all",
      stage: "all",
      sector: "all",
      parliamentaryGroup: "all",
      impactLevel: "all",
      dateFrom: undefined,
      dateTo: undefined,
      onlyPinned: false,
    });
  };

  const activeFilterCount = [
    filters.area !== "all",
    filters.stage !== "all",
    filters.sector !== "all",
    filters.parliamentaryGroup !== "all",
    filters.impactLevel !== "all",
    filters.dateFrom !== undefined || filters.dateTo !== undefined,
  ].filter(Boolean).length;

  return (
    <div className="space-y-3">
      {/* Main Filter Row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por título, autor, ID..."
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

        {/* Último Estado (Stage Filter) */}
        <Select
          value={filters.stage}
          onValueChange={(value) => onFiltersChange({ ...filters, stage: value })}
        >
          <SelectTrigger className="w-[180px] h-9 bg-muted/30 border-border/50 text-sm">
            <SelectValue placeholder="Último estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            {ALL_LEGISLATIVE_STAGES.map((stage) => (
              <SelectItem key={stage} value={stage}>{stage}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Impact Level Filter */}
        <Select
          value={filters.impactLevel}
          onValueChange={(value) => onFiltersChange({ ...filters, impactLevel: value })}
        >
          <SelectTrigger className="w-[140px] h-9 bg-muted/30 border-border/50 text-sm">
            <SelectValue placeholder="Impacto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {IMPACT_LEVELS.map((level) => (
              <SelectItem key={level.value} value={level.value}>
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", 
                    level.value === "positivo" && "bg-green-500",
                    level.value === "leve" && "bg-gray-400",
                    level.value === "medio" && "bg-yellow-500",
                    level.value === "grave" && "bg-red-500"
                  )} />
                  {level.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Parliamentary Group Filter */}
        <Select
          value={filters.parliamentaryGroup}
          onValueChange={(value) => onFiltersChange({ ...filters, parliamentaryGroup: value })}
        >
          <SelectTrigger className="w-[180px] h-9 bg-muted/30 border-border/50 text-sm">
            <SelectValue placeholder="Grupo parlamentario" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los grupos</SelectItem>
            {availableParliamentaryGroups.map((group) => (
              <SelectItem key={group} value={group}>{group}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sector Filter */}
        <Select
          value={filters.sector}
          onValueChange={(value) => onFiltersChange({ ...filters, sector: value })}
        >
          <SelectTrigger className="w-[160px] h-9 bg-muted/30 border-border/50 text-sm">
            <SelectValue placeholder="Sector" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los sectores</SelectItem>
            {SECTORS.map((sector) => (
              <SelectItem key={sector} value={sector}>{sector}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Range Filter */}
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
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-3 space-y-3">
              <div className="text-sm font-medium text-muted-foreground">Rango de fechas</div>
              <div className="flex gap-2">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Desde</div>
                  <Calendar
                    mode="single"
                    selected={filters.dateFrom}
                    onSelect={(date) => onFiltersChange({ ...filters, dateFrom: date })}
                    locale={es}
                    className="rounded-md border"
                  />
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Hasta</div>
                  <Calendar
                    mode="single"
                    selected={filters.dateTo}
                    onSelect={(date) => onFiltersChange({ ...filters, dateTo: date })}
                    locale={es}
                    className="rounded-md border"
                  />
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

        {/* Area Filter */}
        <Select
          value={filters.area}
          onValueChange={(value) => onFiltersChange({ ...filters, area: value })}
        >
          <SelectTrigger className="w-[160px] h-9 bg-muted/30 border-border/50 text-sm">
            <SelectValue placeholder="Área de interés" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las áreas</SelectItem>
            {AREAS.map((area) => (
              <SelectItem key={area} value={area}>{area}</SelectItem>
            ))}
          </SelectContent>
        </Select>

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
            Mostrando {filteredCount} de {totalCount} proyectos:
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
          {filters.stage !== "all" && (
            <Badge variant="secondary" className="gap-1 text-xs">
              Estado: {filters.stage}
              <button onClick={() => onFiltersChange({ ...filters, stage: "all" })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.impactLevel !== "all" && (
            <Badge variant="secondary" className={cn(
              "gap-1 text-xs",
              IMPACT_LEVELS.find(l => l.value === filters.impactLevel)?.color
            )}>
              Impacto: {IMPACT_LEVELS.find(l => l.value === filters.impactLevel)?.label}
              <button onClick={() => onFiltersChange({ ...filters, impactLevel: "all" })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.parliamentaryGroup !== "all" && (
            <Badge variant="secondary" className="gap-1 text-xs">
              Grupo: {filters.parliamentaryGroup}
              <button onClick={() => onFiltersChange({ ...filters, parliamentaryGroup: "all" })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.sector !== "all" && (
            <Badge variant="secondary" className="gap-1 text-xs">
              Sector: {filters.sector}
              <button onClick={() => onFiltersChange({ ...filters, sector: "all" })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.area !== "all" && (
            <Badge variant="secondary" className="gap-1 text-xs">
              Área: {filters.area}
              <button onClick={() => onFiltersChange({ ...filters, area: "all" })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
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