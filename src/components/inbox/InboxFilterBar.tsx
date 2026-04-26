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
import { ENTITIES } from "@/data/peruAlertsMockData";
import { InboxFilters } from "@/hooks/useInboxAlerts";
import { normalizeEntityName } from "@/lib/entityNormalization";

interface InboxFilterBarProps {
  filters: InboxFilters;
  onFiltersChange: (filters: InboxFilters) => void;
  alertCounts: {
    total: number;
    bills: number;
    norms: number;
  };
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

export function InboxFilterBar({ filters, onFiltersChange, alertCounts }: InboxFilterBarProps) {
  const hasActiveFilters = 
    filters.search !== "" || 
    filters.type !== "all" || 
    filters.area !== "all" || 
    filters.entity !== "all";

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      type: "all",
      area: "all",
      entity: "all",
    });
  };

  return (
    <div className="space-y-4">
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

        {/* Type Filter */}
        <Select
          value={filters.type}
          onValueChange={(value) => onFiltersChange({ ...filters, type: value as InboxFilters["type"] })}
        >
          <SelectTrigger className="w-[180px] bg-muted/30 border-border/50">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            <SelectItem value="proyecto_de_ley">Proyectos de Ley ({alertCounts.bills})</SelectItem>
            <SelectItem value="norma">Normas ({alertCounts.norms})</SelectItem>
          </SelectContent>
        </Select>

        {/* Area Filter */}
        <Select
          value={filters.area}
          onValueChange={(value) => onFiltersChange({ ...filters, area: value })}
        >
          <SelectTrigger className="w-[200px] bg-muted/30 border-border/50">
            <SelectValue placeholder="Área de interés" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las áreas</SelectItem>
            {AREAS.map((area) => (
              <SelectItem key={area} value={area}>{area}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Entity Filter (for normas) */}
        <Select
          value={filters.entity}
          onValueChange={(value) => onFiltersChange({ ...filters, entity: value })}
        >
          <SelectTrigger className="w-[180px] bg-muted/30 border-border/50">
            <SelectValue placeholder="Institución" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las instituciones</SelectItem>
            {Array.from(new Set(ENTITIES.map(normalizeEntityName))).sort().map((entity) => (
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
          <span className="text-xs text-muted-foreground">Filtros activos:</span>
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Búsqueda: "{filters.search}"
              <button onClick={() => onFiltersChange({ ...filters, search: "" })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.type !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {filters.type === "proyecto_de_ley" ? "Proyectos de Ley" : "Normas"}
              <button onClick={() => onFiltersChange({ ...filters, type: "all" })}>
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
              Institución: {normalizeEntityName(filters.entity)}
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
