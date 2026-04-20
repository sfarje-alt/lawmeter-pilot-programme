// Filtros para Sesiones — replica el patrón compacto de BillsFilterBar:
// search + Pin/Archive toggles + popover Fechas + Filtros colapsables (MultiSelect).

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Toggle } from '@/components/ui/toggle';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  MultiSelect,
  type MultiSelectOption,
} from '@/components/ui/multi-select';
import {
  Search,
  X,
  Pin,
  CalendarIcon,
  ChevronDown,
  Filter,
  Archive,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import type { PeruSession } from '@/types/peruSessions';

// ── Tipo de filtros ─────────────────────────────────────────────────────────
export interface SesionesFilters {
  search: string;
  commissions: string[];
  aiStates: string[];           // 'idle' | 'processing' | 'ready'
  /** @deprecated estado eliminado del flujo editorial */
  editorialStates: string[];
  videoStates: string[];        // 'pendiente' | 'vinculado' | 'error'
  agendaStates: string[];       // 'pendiente' | 'lista' | 'error'
  sources: string[];
  impactLevels: string[];       // 'bajo' | 'medio' | 'medio_alto' | 'alto'
  tags: string[];
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  onlyPinned: boolean;
  showArchived: boolean;
}

export const DEFAULT_FILTERS: SesionesFilters = {
  search: '',
  commissions: [],
  aiStates: [],
  editorialStates: [],
  videoStates: [],
  agendaStates: [],
  sources: [],
  impactLevels: [],
  tags: [],
  dateFrom: undefined,
  dateTo: undefined,
  onlyPinned: false,
  showArchived: false,
};

const QUICK_DATE_OPTIONS = [
  { label: 'Últimos 7 días', days: 7 },
  { label: 'Últimos 15 días', days: 15 },
  { label: 'Últimos 30 días', days: 30 },
  { label: 'Últimos 60 días', days: 60 },
];

interface Props {
  filters: SesionesFilters;
  onChange: (next: SesionesFilters) => void;
  sessions: PeruSession[];
  pinnedCount: number;
  archivedCount: number;
}

export function SesionesFilterBar({
  filters,
  onChange,
  sessions,
  pinnedCount,
  archivedCount,
}: Props) {
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  // ── Opciones derivadas de los datos ───────────────────────────────────────
  const commissionOptions: MultiSelectOption[] = useMemo(() => {
    const set = new Set(sessions.map((s) => s.commission_name).filter(Boolean));
    return Array.from(set)
      .sort()
      .map((c) => ({ value: c, label: c.length > 50 ? `${c.slice(0, 50)}…` : c }));
  }, [sessions]);

  const sourceOptions: MultiSelectOption[] = useMemo(() => {
    const set = new Set(sessions.map((s) => s.source).filter(Boolean));
    return Array.from(set).map((s) => ({ value: s, label: s }));
  }, [sessions]);

  const tagOptions: MultiSelectOption[] = useMemo(() => {
    const set = new Set(
      sessions.map((s) => s.etiqueta_ia).filter((x): x is string => !!x),
    );
    return Array.from(set).sort().map((t) => ({ value: t, label: t }));
  }, [sessions]);

  const aiOptions: MultiSelectOption[] = [
    { value: 'idle', label: 'No solicitada' },
    { value: 'processing', label: 'Procesando' },
    { value: 'ready', label: 'Lista' },
  ];

  // (Filtro 'editorialOptions' eliminado: el estado "en seguimiento" ya no existe
  // y "Pineadas" / "Archivadas" se controlan con los toggles principales.)

  const videoOptions: MultiSelectOption[] = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'vinculado', label: 'Vinculado' },
    { value: 'error', label: 'Error' },
  ];

  const agendaOptions: MultiSelectOption[] = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'lista', label: 'Lista' },
    { value: 'error', label: 'Error' },
  ];

  const impactOptions: MultiSelectOption[] = [
    {
      value: 'bajo',
      label: 'Bajo',
      icon: <div className="w-2 h-2 rounded-full bg-muted-foreground/60" />,
    },
    {
      value: 'medio',
      label: 'Medio',
      icon: <div className="w-2 h-2 rounded-full bg-[hsl(var(--warning))]" />,
    },
    {
      value: 'medio_alto',
      label: 'Medio-alto',
      icon: <div className="w-2 h-2 rounded-full bg-[hsl(var(--warning))]" />,
    },
    {
      value: 'alto',
      label: 'Alto',
      icon: <div className="w-2 h-2 rounded-full bg-[hsl(var(--destructive))]" />,
    },
  ];

  // ── Estado activo ─────────────────────────────────────────────────────────
  const hasActiveFilters =
    filters.search !== '' ||
    filters.commissions.length > 0 ||
    filters.aiStates.length > 0 ||
    filters.videoStates.length > 0 ||
    filters.agendaStates.length > 0 ||
    filters.sources.length > 0 ||
    filters.impactLevels.length > 0 ||
    filters.tags.length > 0 ||
    filters.dateFrom !== undefined ||
    filters.dateTo !== undefined ||
    filters.onlyPinned;

  const activeFilterCount =
    (filters.commissions.length > 0 ? 1 : 0) +
    (filters.aiStates.length > 0 ? 1 : 0) +
    (filters.videoStates.length > 0 ? 1 : 0) +
    (filters.agendaStates.length > 0 ? 1 : 0) +
    (filters.sources.length > 0 ? 1 : 0) +
    (filters.impactLevels.length > 0 ? 1 : 0) +
    (filters.tags.length > 0 ? 1 : 0);

  const clearFilters = () => onChange(DEFAULT_FILTERS);

  const applyQuickDateFilter = (days: number) => {
    const today = new Date();
    const fromDate = subDays(today, days);
    onChange({ ...filters, dateFrom: fromDate, dateTo: today });
  };

  return (
    <div className="space-y-3">
      {/* ── Línea principal: search + toggles + popovers ─────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por comisión, ítem o tema..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="pl-10 bg-muted/30 border-border/50 h-9"
          />
        </div>

        <Toggle
          pressed={filters.onlyPinned}
          onPressedChange={(pressed) => onChange({ ...filters, onlyPinned: pressed })}
          className="gap-1.5 h-9 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          aria-label="Solo pineadas"
        >
          <Pin className="h-4 w-4" />
          <span className="hidden sm:inline text-sm">Pineadas</span>
          {pinnedCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
              {pinnedCount}
            </Badge>
          )}
        </Toggle>

        <Toggle
          pressed={filters.showArchived}
          onPressedChange={(pressed) => onChange({ ...filters, showArchived: pressed })}
          className="gap-1.5 h-9 data-[state=on]:bg-muted data-[state=on]:text-foreground"
          aria-label="Ver archivadas"
        >
          <Archive className="h-4 w-4" />
          <span className="hidden sm:inline text-sm">Archivadas</span>
          {archivedCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
              {archivedCount}
            </Badge>
          )}
        </Toggle>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'h-9 gap-1.5 bg-muted/30 border-border/50 text-sm',
                (filters.dateFrom || filters.dateTo) && 'border-primary/50 bg-primary/10',
              )}
            >
              <CalendarIcon className="h-4 w-4" />
              <span className="hidden sm:inline">
                {filters.dateFrom && filters.dateTo
                  ? `${format(filters.dateFrom, 'dd/MM', { locale: es })} - ${format(filters.dateTo, 'dd/MM', { locale: es })}`
                  : filters.dateFrom
                  ? `Desde ${format(filters.dateFrom, 'dd/MM', { locale: es })}`
                  : filters.dateTo
                  ? `Hasta ${format(filters.dateTo, 'dd/MM', { locale: es })}`
                  : 'Fechas'}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 z-50 bg-popover border border-border"
            align="start"
          >
            <div className="p-3 space-y-3">
              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  Acceso rápido
                </div>
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
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  Rango personalizado
                </div>
                <div className="flex gap-2">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Desde</div>
                    <Calendar
                      mode="single"
                      selected={filters.dateFrom}
                      onSelect={(date) => onChange({ ...filters, dateFrom: date })}
                      locale={es}
                      className="rounded-md border pointer-events-auto bg-background"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Hasta</div>
                    <Calendar
                      mode="single"
                      selected={filters.dateTo}
                      onSelect={(date) => onChange({ ...filters, dateTo: date })}
                      locale={es}
                      className="rounded-md border pointer-events-auto bg-background"
                    />
                  </div>
                </div>
              </div>
              {(filters.dateFrom || filters.dateTo) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() =>
                    onChange({ ...filters, dateFrom: undefined, dateTo: undefined })
                  }
                >
                  Limpiar fechas
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>

        <Collapsible open={filtersExpanded} onOpenChange={setFiltersExpanded}>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'h-9 gap-1.5 bg-muted/30 border-border/50 text-sm',
                activeFilterCount > 0 && 'border-primary/50 bg-primary/10',
              )}
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filtros</span>
              {activeFilterCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 h-5 px-1.5 text-xs bg-primary/20 text-primary"
                >
                  {activeFilterCount}
                </Badge>
              )}
              <ChevronDown
                className={cn(
                  'h-3 w-3 transition-transform',
                  filtersExpanded && 'rotate-180',
                )}
              />
            </Button>
          </CollapsibleTrigger>
        </Collapsible>

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

      {/* ── Filtros colapsables (MultiSelect) ────────────────────────────── */}
      <Collapsible open={filtersExpanded} onOpenChange={setFiltersExpanded}>
        <CollapsibleContent>
          <div className="flex flex-wrap items-center gap-2 pt-2 pb-1 border-t border-border/30">
            <MultiSelect
              options={commissionOptions}
              selected={filters.commissions}
              onChange={(commissions) => onChange({ ...filters, commissions })}
              placeholder="Comisión: Todas"
              className="w-[200px]"
            />
            <MultiSelect
              options={aiOptions}
              selected={filters.aiStates}
              onChange={(aiStates) => onChange({ ...filters, aiStates })}
              placeholder="Estado IA: Todos"
              className="w-[170px]"
            />
            {/* Filtro 'Editorial' eliminado — el estado "en seguimiento" ya no existe
                y los estados "Pineada" / "Archivada" se controlan con los toggles principales. */}
            <MultiSelect
              options={sourceOptions}
              selected={filters.sources}
              onChange={(sources) => onChange({ ...filters, sources })}
              placeholder="Fuente: Todas"
              className="w-[180px]"
            />
            {tagOptions.length > 0 && (
              <MultiSelect
                options={tagOptions}
                selected={filters.tags}
                onChange={(tags) => onChange({ ...filters, tags })}
                placeholder="Etiqueta IA: Todas"
                className="w-[180px]"
              />
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

// ── Aplicación de filtros sobre la lista ──────────────────────────────────
export function applySesionesFilters(
  sessions: PeruSession[],
  filters: SesionesFilters,
): PeruSession[] {
  return sessions.filter((s) => {
    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const hay = [
        s.commission_name,
        s.session_title,
        s.etiqueta_ia,
        s.agenda_item?.title,
        s.agenda_item?.thematic_area,
        ...(s.agenda_item?.bill_numbers ?? []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }

    // Pinned
    if (filters.onlyPinned && !s.is_pinned) return false;

    // Comisión
    if (filters.commissions.length > 0 && !filters.commissions.includes(s.commission_name)) {
      return false;
    }

    // Estado IA
    if (filters.aiStates.length > 0) {
      const t = s.transcription_state ?? 'no_solicitada';
      const c = s.chatbot_state ?? 'no_solicitado';
      const isProcessing =
        ['en_cola', 'procesando'].includes(t) || ['en_cola', 'procesando'].includes(c);
      const isReady = t === 'lista' || c === 'listo';
      const matched =
        (filters.aiStates.includes('processing') && isProcessing) ||
        (filters.aiStates.includes('ready') && isReady) ||
        (filters.aiStates.includes('idle') && !isProcessing && !isReady);
      if (!matched) return false;
    }

    // Editorial filter removed — "en seguimiento" no longer exists.

    // Video
    if (filters.videoStates.length > 0) {
      const v = s.video_state ?? 'pendiente';
      if (!filters.videoStates.includes(v)) return false;
    }

    // Agenda
    if (filters.agendaStates.length > 0) {
      const a = s.agenda_state ?? 'pendiente';
      if (!filters.agendaStates.includes(a)) return false;
    }

    // Fuente
    if (filters.sources.length > 0 && !filters.sources.includes(s.source)) {
      return false;
    }

    // Impacto
    if (filters.impactLevels.length > 0) {
      if (!s.impact_level || !filters.impactLevels.includes(s.impact_level)) return false;
    }

    // Etiqueta IA
    if (filters.tags.length > 0) {
      if (!s.etiqueta_ia || !filters.tags.includes(s.etiqueta_ia)) return false;
    }

    // Fechas
    if (filters.dateFrom || filters.dateTo) {
      if (!s.scheduled_at) return false;
      const date = new Date(s.scheduled_at);
      if (filters.dateFrom && date < filters.dateFrom) return false;
      if (filters.dateTo) {
        const endOfDay = new Date(filters.dateTo);
        endOfDay.setHours(23, 59, 59, 999);
        if (date > endOfDay) return false;
      }
    }

    return true;
  });
}
