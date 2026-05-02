// Extras compartidos para la fila de toolbar (Zone 3) del header de la bandeja:
// botón de fechas (popover con quick-ranges + rangos), toggle de archivados y
// botón de filtros avanzados (popover con MultiSelects).

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Archive, CalendarIcon, ChevronDown, Filter } from "lucide-react";
import { format, subDays } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { MultiSelect, MultiSelectOption } from "@/components/ui/multi-select";

const QUICK_DATE_OPTIONS = [
  { label: "Últimos 7 días", days: 7 },
  { label: "Últimos 15 días", days: 15 },
  { label: "Últimos 30 días", days: 30 },
  { label: "Últimos 60 días", days: 60 },
  { label: "Últimos 90 días", days: 90 },
];

interface DateRangeButtonProps {
  dateFrom?: Date;
  dateTo?: Date;
  onChange: (from: Date | undefined, to: Date | undefined) => void;
}

export function DateRangeButton({ dateFrom, dateTo, onChange }: DateRangeButtonProps) {
  const active = !!(dateFrom || dateTo);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 gap-1.5 bg-muted/30 border-border/50 text-xs",
            active && "border-primary/50 bg-primary/10"
          )}
        >
          <CalendarIcon className="h-3.5 w-3.5" />
          <span>
            {dateFrom && dateTo
              ? `${format(dateFrom, "dd/MM", { locale: es })} - ${format(dateTo, "dd/MM", { locale: es })}`
              : dateFrom
              ? `Desde ${format(dateFrom, "dd/MM", { locale: es })}`
              : dateTo
              ? `Hasta ${format(dateTo, "dd/MM", { locale: es })}`
              : "Fechas"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-50 bg-popover border border-border" align="start">
        <div className="p-3 space-y-3">
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground mb-2">Acceso rápido</div>
            <div className="flex flex-wrap gap-1">
              {QUICK_DATE_OPTIONS.map((option) => (
                <Button
                  key={option.days}
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => {
                    const today = new Date();
                    onChange(subDays(today, option.days), today);
                  }}
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
                  selected={dateFrom}
                  onSelect={(d) => onChange(d, dateTo)}
                  locale={es}
                  className="rounded-md border pointer-events-auto bg-background"
                />
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Hasta</div>
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={(d) => onChange(dateFrom, d)}
                  locale={es}
                  className="rounded-md border pointer-events-auto bg-background"
                />
              </div>
            </div>
          </div>
          {active && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => onChange(undefined, undefined)}
            >
              Limpiar fechas
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface ArchivedToggleProps {
  pressed: boolean;
  onPressedChange: (v: boolean) => void;
  count?: number;
}

export function ArchivedToggle({ pressed, onPressedChange, count = 0 }: ArchivedToggleProps) {
  return (
    <Toggle
      pressed={pressed}
      onPressedChange={onPressedChange}
      className="gap-1.5 h-8 text-xs data-[state=on]:bg-muted data-[state=on]:text-foreground"
      aria-label="Ver archivados"
    >
      <Archive className="h-3.5 w-3.5" />
      <span>Archivados</span>
      {count > 0 && (
        <Badge variant="secondary" className="ml-1 h-4 px-1.5 text-[10px]">
          {count}
        </Badge>
      )}
    </Toggle>
  );
}

export interface FilterGroup {
  key: string;
  placeholder: string;
  options: MultiSelectOption[];
  selected: string[];
  onChange: (next: string[]) => void;
  width?: string;
}

interface AdvancedFiltersButtonProps {
  groups: FilterGroup[];
}

export function AdvancedFiltersButton({ groups }: AdvancedFiltersButtonProps) {
  const activeCount = groups.filter((g) => g.selected.length > 0).length;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 gap-1.5 bg-muted/30 border-border/50 text-xs",
            activeCount > 0 && "border-primary/50 bg-primary/10"
          )}
        >
          <Filter className="h-3.5 w-3.5" />
          <span>Filtros</span>
          {activeCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-4 px-1.5 text-[10px] bg-primary/20 text-primary">
              {activeCount}
            </Badge>
          )}
          <ChevronDown className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-3 z-50 bg-popover border border-border" align="end">
        <div className="space-y-2">
          {groups.map((g) => (
            <MultiSelect
              key={g.key}
              options={g.options}
              selected={g.selected}
              onChange={g.onChange}
              placeholder={g.placeholder}
              className={g.width ?? "w-full"}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
