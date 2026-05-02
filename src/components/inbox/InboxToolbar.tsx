// Toolbar de orden + toggle "rezagadas" (Fase A).

import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, ChevronDown, Hourglass } from "lucide-react";
import { SortMode } from "@/lib/alertClassification";

interface InboxToolbarProps {
  sortMode: SortMode;
  onSortModeChange: (mode: SortMode) => void;
  showRezagadas: boolean;
  onShowRezagadasChange: (show: boolean) => void;
  rezagadasCount: number;
}

const SORT_LABELS: Record<SortMode, string> = {
  movement: "Último movimiento",
  impact: "Mayor impacto",
  urgency: "Mayor urgencia",
  date: "Fecha",
};

export function InboxToolbar({
  sortMode,
  onSortModeChange,
  showRezagadas,
  onShowRezagadasChange,
  rezagadasCount,
}: InboxToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 bg-muted/30 border-border/50 text-xs">
            <ArrowUpDown className="h-3.5 w-3.5" />
            <span>Orden: {SORT_LABELS[sortMode]}</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="z-50 bg-popover">
          {(Object.keys(SORT_LABELS) as SortMode[]).map((m) => (
            <DropdownMenuItem key={m} onClick={() => onSortModeChange(m)}>
              {SORT_LABELS[m]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Toggle
        pressed={showRezagadas}
        onPressedChange={onShowRezagadasChange}
        className="gap-1.5 h-8 text-xs data-[state=on]:bg-muted data-[state=on]:text-foreground"
        aria-label="Mostrar rezagadas"
      >
        <Hourglass className="h-3.5 w-3.5" />
        <span>Rezagadas</span>
        {rezagadasCount > 0 && (
          <Badge variant="secondary" className="ml-1 h-4 px-1.5 text-[10px]">
            {rezagadasCount}
          </Badge>
        )}
      </Toggle>
    </div>
  );
}
