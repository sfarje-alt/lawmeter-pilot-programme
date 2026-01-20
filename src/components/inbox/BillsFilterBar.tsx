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
import { Search, X } from "lucide-react";
import { BillsFilters } from "./BillsInbox";

interface BillsFilterBarProps {
  filters: BillsFilters;
  onFiltersChange: (filters: BillsFilters) => void;
  availableStages: string[];
  totalCount: number;
  filteredCount: number;
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
  availableStages,
  totalCount,
  filteredCount 
}: BillsFilterBarProps) {
  const hasActiveFilters = 
    filters.search !== "" || 
    filters.area !== "all" || 
    filters.stage !== "all";

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      area: "all",
      stage: "all",
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
            placeholder="Buscar por título, autor, ID..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-10 bg-muted/30 border-border/50"
          />
        </div>

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

        {/* Stage Filter (current_stage) */}
        <Select
          value={filters.stage}
          onValueChange={(value) => onFiltersChange({ ...filters, stage: value })}
        >
          <SelectTrigger className="w-[200px] bg-muted/30 border-border/50">
            <SelectValue placeholder="Estado legislativo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            {availableStages.map((stage) => (
              <SelectItem key={stage} value={stage}>{stage}</SelectItem>
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
            Mostrando {filteredCount} de {totalCount} proyectos:
          </span>
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Búsqueda: "{filters.search}"
              <button onClick={() => onFiltersChange({ ...filters, search: "" })}>
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
          {filters.stage !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Estado: {filters.stage}
              <button onClick={() => onFiltersChange({ ...filters, stage: "all" })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
