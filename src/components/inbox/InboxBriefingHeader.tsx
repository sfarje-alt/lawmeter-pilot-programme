// Header de la bandeja: 3 zonas — Briefing, Filtrar por temática (tags), Búsqueda y orden.
// Zone 1 siempre visible; Zone 2 y 3 colapsadas por default.

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PeruAlert } from "@/data/peruAlertsMockData";
import {
  BriefingFilter,
  SortMode,
  countBriefing,
  aggregateTagCounts,
} from "@/lib/alertClassification";

interface InboxBriefingHeaderProps {
  alerts: PeruAlert[];
  briefingFilter: BriefingFilter;
  onBriefingFilterChange: (bf: BriefingFilter) => void;
  /** Tags seleccionados (multi-select desde tag-cloud). */
  selectedTags: string[];
  onSelectedTagsChange: (next: string[]) => void;
  sortMode: SortMode;
  onSortModeChange: (m: SortMode) => void;
  search: string;
  onSearchChange: (s: string) => void;
  /** Extras (Fechas, Archivadas) en la fila del toolbar. */
  toolbarExtras?: React.ReactNode;
}

const SORT_LABELS: Record<SortMode, string> = {
  movement: "Último movimiento",
  impact: "Mayor impacto",
  urgency: "Mayor urgencia",
  date: "Fecha",
};

const BRIEFING_LABELS: Record<Exclude<BriefingFilter, null>, string> = {
  action: "Requieren acción",
  new24: "Nuevas últimas 24h",
  bookmarks: "Bookmarks",
  lagging: "Rezagadas",
};

function formatBriefingDate(d: Date): string {
  const day = d.toLocaleDateString("es-PE", { weekday: "long" });
  const date = d.toLocaleDateString("es-PE", { day: "numeric", month: "long" });
  return `${day} ${date}`.toUpperCase();
}

interface BriefingCardProps {
  value: number;
  label: string;
  active: boolean;
  tone: "destructive" | "warning" | "neutral" | "muted";
  onClick: () => void;
}

function BriefingCard({ value, label, active, tone, onClick }: BriefingCardProps) {
  const toneNumber: Record<BriefingCardProps["tone"], string> = {
    destructive: "text-destructive",
    warning: "text-[hsl(var(--warning))]",
    neutral: "text-foreground",
    muted: "text-muted-foreground",
  };
  const toneBorder: Record<BriefingCardProps["tone"], string> = {
    destructive: "border-l-destructive",
    warning: "border-l-[hsl(var(--warning))]",
    neutral: "border-l-foreground",
    muted: "border-l-muted-foreground",
  };
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "glass-card border-border/30 cursor-pointer transition-all px-4 py-3 select-none",
        "hover:bg-muted/30",
        active ? cn("border-l-4", toneBorder[tone]) : "border-l-4 border-l-transparent"
      )}
    >
      <div className={cn("font-mono text-2xl font-semibold leading-none", toneNumber[tone])}>
        {value}
      </div>
      <div className="text-xs text-muted-foreground mt-1.5">{label}</div>
    </Card>
  );
}

export function InboxBriefingHeader({
  alerts,
  briefingFilter,
  onBriefingFilterChange,
  selectedTags,
  onSelectedTagsChange,
  sortMode,
  onSortModeChange,
  search,
  onSearchChange,
  toolbarExtras,
}: InboxBriefingHeaderProps) {
  const counts = useMemo(() => countBriefing(alerts), [alerts]);
  const briefingDate = useMemo(() => formatBriefingDate(new Date()), []);
  const tagCounts = useMemo(() => aggregateTagCounts(alerts), [alerts]);

  const [topicsOpen, setTopicsOpen] = useState(false);
  const [toolbarOpen, setToolbarOpen] = useState(false);

  const activeBriefingLabel = briefingFilter ? BRIEFING_LABELS[briefingFilter] : null;
  const activeFilterChip =
    activeBriefingLabel ||
    (selectedTags.length > 0
      ? selectedTags.length === 1
        ? selectedTags[0]
        : `${selectedTags.length} temáticas`
      : null);

  const toggleBriefing = (bf: Exclude<BriefingFilter, null>) => {
    if (briefingFilter === bf) {
      onBriefingFilterChange(null);
    } else {
      onBriefingFilterChange(bf);
      if (selectedTags.length) onSelectedTagsChange([]);
    }
  };

  const toggleTag = (tag: string) => {
    const has = selectedTags.includes(tag);
    const next = has ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag];
    onSelectedTagsChange(next);
    if (next.length > 0 && briefingFilter) onBriefingFilterChange(null);
  };

  const clearActiveFilter = () => {
    if (briefingFilter) onBriefingFilterChange(null);
    if (selectedTags.length) onSelectedTagsChange([]);
  };

  return (
    <div className="space-y-4">
      {/* ZONE 1 — DAILY BRIEFING */}
      <div className="space-y-2">
        <div className="text-[10px] font-semibold tracking-wider text-muted-foreground/80">
          BRIEFING — {briefingDate}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <BriefingCard
            value={counts.action}
            label="Requieren acción"
            tone="destructive"
            active={briefingFilter === "action"}
            onClick={() => toggleBriefing("action")}
          />
          <BriefingCard
            value={counts.new24}
            label="Nuevas últimas 24h"
            tone="warning"
            active={briefingFilter === "new24"}
            onClick={() => toggleBriefing("new24")}
          />
          <BriefingCard
            value={counts.bookmarks}
            label="Bookmarks"
            tone="neutral"
            active={briefingFilter === "bookmarks"}
            onClick={() => toggleBriefing("bookmarks")}
          />
          <BriefingCard
            value={counts.lagging}
            label="Rezagadas"
            tone="muted"
            active={briefingFilter === "lagging"}
            onClick={() => toggleBriefing("lagging")}
          />
        </div>
      </div>

      {/* ZONES 2 + 3 wrapped together in one container */}
      <div className="rounded-lg border border-border/40 bg-card/40 divide-y divide-border/30">
        {/* ZONE 2 — TAG CLOUD (filtros por temática reales) */}
        <Collapsible open={topicsOpen} onOpenChange={setTopicsOpen}>
          <div className="flex items-center justify-between gap-3 px-3 py-2.5">
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {topicsOpen ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
                <span>Filtrar por temática</span>
                {!topicsOpen && selectedTags.length > 0 && (
                  <span className="text-foreground">· {selectedTags.length} seleccionadas</span>
                )}
              </button>
            </CollapsibleTrigger>
            {topicsOpen && selectedTags.length > 0 && (
              <button
                type="button"
                onClick={() => onSelectedTagsChange([])}
                className="text-xs text-primary hover:underline"
              >
                Limpiar
              </button>
            )}
          </div>
          <CollapsibleContent className="px-3 pb-3">
            {tagCounts.length === 0 ? (
              <div className="text-xs text-muted-foreground italic px-1">
                No hay temáticas en el dataset actual.
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pb-1">
                {tagCounts.map(({ tag, count }) => {
                  const isActive = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        "inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full text-xs border transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                          : "bg-muted/30 border-border/50 text-foreground hover:bg-muted/50"
                      )}
                    >
                      <span className="truncate max-w-[220px]">{tag}</span>
                      <span
                        className={cn(
                          "tabular-nums text-[10px] px-1 rounded",
                          isActive ? "bg-primary-foreground/20" : "bg-muted/60 text-muted-foreground"
                        )}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>

        {/* ZONE 3 — TOOLBAR: search · Orden · Fechas · Archivadas */}
        <Collapsible open={toolbarOpen} onOpenChange={setToolbarOpen}>
          <div className="flex items-center justify-between gap-3 flex-wrap px-3 py-2.5">
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {toolbarOpen ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
                <span>Búsqueda y orden</span>
              </button>
            </CollapsibleTrigger>

            {activeFilterChip && (
              <button
                type="button"
                onClick={clearActiveFilter}
                className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full bg-primary/10 text-primary text-xs hover:bg-primary/15 transition-colors"
              >
                <span>{activeFilterChip}</span>
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <CollapsibleContent className="px-3 pb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Buscar por título, ID o autor..."
                  className="h-8 pl-8 text-xs bg-muted/30 border-border/50"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 bg-muted/30 border-border/50 text-xs"
                  >
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

              {toolbarExtras}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="border-t border-border/30" />

      {/* ZONE 3 — TOOLBAR: search · Orden · Fechas · Archivadas */}
      <Collapsible open={toolbarOpen} onOpenChange={setToolbarOpen}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {toolbarOpen ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
              <span>Búsqueda y orden</span>
            </button>
          </CollapsibleTrigger>

          {activeFilterChip && (
            <button
              type="button"
              onClick={clearActiveFilter}
              className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full bg-primary/10 text-primary text-xs hover:bg-primary/15 transition-colors"
            >
              <span>{activeFilterChip}</span>
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
        <CollapsibleContent className="pt-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar por título, ID o autor..."
                className="h-8 pl-8 text-xs bg-muted/30 border-border/50"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 bg-muted/30 border-border/50 text-xs"
                >
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

            {toolbarExtras}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
