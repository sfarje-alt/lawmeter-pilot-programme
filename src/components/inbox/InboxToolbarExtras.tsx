// Extras compartidos para la fila de toolbar (Zone 3) del header de la bandeja:
// botón de fechas con chips de rangos rápidos y toggle de archivados.

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Archive, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  QuickDateRange,
  getQuickDateLabel,
} from "@/lib/alertClassification";

const QUICK_RANGES: Exclude<QuickDateRange, null>[] = ["7d", "30d", "60d", "1y"];

interface QuickDateButtonProps {
  value: QuickDateRange;
  onChange: (next: QuickDateRange) => void;
}

export function QuickDateButton({ value, onChange }: QuickDateButtonProps) {
  const active = !!value;
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
          <span>{value ? getQuickDateLabel(value) : "Fechas"}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2 z-50 bg-popover border border-border" align="start">
        <div className="flex flex-wrap gap-1.5 max-w-[280px]">
          {QUICK_RANGES.map((r) => {
            const isActive = value === r;
            return (
              <Button
                key={r}
                variant="outline"
                size="sm"
                className={cn(
                  "h-7 text-xs rounded-full",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                    : "bg-muted/30"
                )}
                onClick={() => onChange(isActive ? null : r)}
              >
                {getQuickDateLabel(r)}
              </Button>
            );
          })}
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
      aria-label="Ver archivadas"
    >
      <Archive className="h-3.5 w-3.5" />
      <span>Archivadas</span>
      {count > 0 && (
        <Badge variant="secondary" className="ml-1 h-4 px-1.5 text-[10px]">
          {count}
        </Badge>
      )}
    </Toggle>
  );
}
