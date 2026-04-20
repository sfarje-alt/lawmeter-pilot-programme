import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Search, RotateCcw, CalendarIcon, SlidersHorizontal } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { BlockFilters } from "@/hooks/useBlockFilters";

export type FilterDimension =
  | 'period'
  | 'legislationType'
  | 'status'
  | 'impactLevels'
  | 'tags'
  | 'profileId'
  | 'search';

interface BlockFilterPanelProps {
  filters: BlockFilters;
  setFilter: <K extends keyof BlockFilters>(key: K, value: BlockFilters[K]) => void;
  resetFilters: () => void;
  isCustomized: boolean;
  /** Which filter dimensions to show. Defaults to ['period', 'legislationType', 'status', 'search'] */
  dimensions?: FilterDimension[];
  availableTags?: { id: string; label: string }[];
  availableProfiles?: { id: string; name: string }[];
  /** Compact horizontal layout (for top of expanded modal) */
  compact?: boolean;
}

const PERIOD_OPTIONS = [
  { value: 'inherit', label: 'Heredar del dashboard' },
  { value: 'last_7', label: 'Últimos 7 días' },
  { value: 'last_30', label: 'Últimos 30 días' },
  { value: 'last_60', label: 'Últimos 60 días' },
  { value: 'last_90', label: 'Últimos 90 días' },
  { value: 'all_time', label: 'Todo el período' },
  { value: 'custom', label: 'Rango personalizado' },
] as const;

const LEGISLATION_TYPE_OPTIONS = [
  { value: 'all', label: 'Todos los tipos' },
  { value: 'bills', label: 'Proyectos de Ley' },
  { value: 'regulations', label: 'Normas' },
] as const;

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'inbox', label: 'Bandeja' },
  { value: 'reviewing', label: 'En revisión' },
  { value: 'published', label: 'Publicadas' },
  { value: 'archived', label: 'Archivadas' },
] as const;

const IMPACT_OPTIONS = [
  { value: 'grave', label: 'Grave' },
  { value: 'medio', label: 'Medio' },
  { value: 'leve', label: 'Leve' },
  { value: 'positivo', label: 'Positivo' },
];

/**
 * Reusable filter panel for analytics blocks.
 * Renders only the dimensions specified, all wired to a useBlockFilters hook.
 */
export function BlockFilterPanel({
  filters,
  setFilter,
  resetFilters,
  isCustomized,
  dimensions = ['period', 'legislationType', 'status', 'search'],
  availableTags = [],
  availableProfiles = [],
  compact = false,
}: BlockFilterPanelProps) {
  const showCustomDate = filters.period === 'custom';

  return (
    <div
      className={cn(
        "flex flex-wrap items-end gap-3 p-3 rounded-lg border border-border/60 bg-muted/20",
        compact && "p-2 gap-2"
      )}
    >
      <div className="flex items-center gap-1.5 mr-1 text-xs font-medium text-muted-foreground">
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Filtros
      </div>

      {/* Período se controla desde el filtro global del dashboard, no por bloque */}

      {dimensions.includes('legislationType') && (
        <div className="flex flex-col gap-1 min-w-[160px]">
          <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">Tipo</Label>
          <Select
            value={filters.legislationType || 'all'}
            onValueChange={(v) => setFilter('legislationType', v as BlockFilters['legislationType'])}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEGISLATION_TYPE_OPTIONS.map(o => (
                <SelectItem key={o.value} value={o.value} className="text-xs">{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {dimensions.includes('status') && (
        <div className="flex flex-col gap-1 min-w-[160px]">
          <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">Estado</Label>
          <Select
            value={filters.status || 'all'}
            onValueChange={(v) => setFilter('status', v as BlockFilters['status'])}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map(o => (
                <SelectItem key={o.value} value={o.value} className="text-xs">{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {dimensions.includes('profileId') && availableProfiles.length > 0 && (
        <div className="flex flex-col gap-1 min-w-[180px]">
          <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">Perfil</Label>
          <Select
            value={filters.profileId || 'all'}
            onValueChange={(v) => setFilter('profileId', v)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">Todos los perfiles</SelectItem>
              {availableProfiles.map(p => (
                <SelectItem key={p.id} value={p.id} className="text-xs">{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {dimensions.includes('impactLevels') && (
        <MultiSelectChips
          label="Impacto"
          options={IMPACT_OPTIONS}
          values={filters.impactLevels || []}
          onChange={(v) => setFilter('impactLevels', v)}
        />
      )}

      {dimensions.includes('tags') && availableTags.length > 0 && (
        <MultiSelectChips
          label="Etiquetas"
          options={availableTags.map(t => ({ value: t.id, label: t.label }))}
          values={filters.tags || []}
          onChange={(v) => setFilter('tags', v)}
        />
      )}

      {dimensions.includes('search') && (
        <div className="flex flex-col gap-1 min-w-[200px] flex-1">
          <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">Buscar</Label>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={filters.search || ''}
              onChange={(e) => setFilter('search', e.target.value)}
              placeholder="Texto libre..."
              className="h-8 pl-7 text-xs"
            />
          </div>
        </div>
      )}

      {isCustomized && (
        <div className="flex items-end ml-auto">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
            onClick={resetFilters}
          >
            <RotateCcw className="h-3 w-3 mr-1.5" />
            Restablecer
          </Button>
        </div>
      )}
    </div>
  );
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (v?: string) => void;
}) {
  const date = value ? new Date(value) : undefined;
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 text-xs justify-start font-normal min-w-[140px]">
            <CalendarIcon className="h-3 w-3 mr-1.5" />
            {date ? format(date, "PP", { locale: es }) : "Selecciona"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => onChange(d ? d.toISOString() : undefined)}
            locale={es}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function MultiSelectChips({
  label,
  options,
  values,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  values: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (val: string) => {
    if (values.includes(val)) onChange(values.filter(v => v !== val));
    else onChange([...values, val]);
  };
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</Label>
      <div className="flex flex-wrap gap-1 items-center min-h-[32px]">
        {options.map(o => {
          const active = values.includes(o.value);
          return (
            <Badge
              key={o.value}
              variant={active ? "default" : "outline"}
              className={cn(
                "cursor-pointer text-[11px] py-0.5 px-2 transition-colors",
                !active && "hover:bg-muted"
              )}
              onClick={() => toggle(o.value)}
            >
              {o.label}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
