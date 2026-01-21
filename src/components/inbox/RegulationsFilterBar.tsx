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
import { Search, X, Pin } from "lucide-react";
import { RegulationsFilters } from "./RegulationsInbox";

interface RegulationsFilterBarProps {
  filters: RegulationsFilters;
  onFiltersChange: (filters: RegulationsFilters) => void;
  availableEntities: string[];
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

export function RegulationsFilterBar({ 
  filters, 
  onFiltersChange, 
  availableEntities,
  totalCount,
  filteredCount,
  pinnedCount
}: RegulationsFilterBarProps) {
  const hasActiveFilters = 
    filters.search !== "" || 
    filters.area !== "all" || 
    filters.entity !== "all" ||
    filters.onlyPinned;

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      area: "all",
      entity: "all",
      onlyPinned: false,
    });
  };

  return (
    <div className="space-y-3">
      {/* Main Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por título, entidad, resumen..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-10 bg-muted/30 border-border/50"
          />
        </div>

        {/* Pinned Filter Toggle */}
        <Toggle
          pressed={filters.onlyPinned}
          onPressedChange={(pressed) => onFiltersChange({ ...filters, onlyPinned: pressed })}
          className="gap-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          aria-label="Solo pineados"
        >
          <Pin className="h-4 w-4" />
          <span className="hidden sm:inline">Pineados</span>
          {pinnedCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
              {pinnedCount}
            </Badge>
          )}
        </Toggle>

        {/* Area Filter */}
        <Select
          value={filters.area}
          onValueChange={(value) => onFiltersChange({ ...filters, area: value })}
        >
          <SelectTrigger className="w-[180px] bg-muted/30 border-border/50">
            <SelectValue placeholder="Área de interés" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las áreas</SelectItem>
            {AREAS.map((area) => (
              <SelectItem key={area} value={area}>{area}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Entity Filter */}
        <Select
          value={filters.entity}
          onValueChange={(value) => onFiltersChange({ ...filters, entity: value })}
        >
          <SelectTrigger className="w-[180px] bg-muted/30 border-border/50">
            <SelectValue placeholder="Institución" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las instituciones</SelectItem>
            {availableEntities.map((entity) => (
              <SelectItem key={entity} value={entity}>{entity}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
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
            <Badge variant="secondary" className="gap-1">
              Búsqueda: "{filters.search}"
              <button onClick={() => onFiltersChange({ ...filters, search: "" })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.onlyPinned && (
            <Badge variant="secondary" className="gap-1 bg-primary/20 text-primary">
              <Pin className="h-3 w-3" />
              Solo pineados
              <button onClick={() => onFiltersChange({ ...filters, onlyPinned: false })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.area !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {filters.area}
              <button onClick={() => onFiltersChange({ ...filters, area: "all" })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.entity !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Institución: {filters.entity}
              <button onClick={() => onFiltersChange({ ...filters, entity: "all" })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
