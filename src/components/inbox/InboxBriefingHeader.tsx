// Header de la bandeja: 3 zonas — Briefing, Filtrar por temática, Búsqueda y orden.
// Zone 1 siempre visible; Zone 2 y 3 colapsadas por default.

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
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
  Hourglass,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PeruAlert } from "@/data/peruAlertsMockData";
import {
  BriefingFilter,
  QuickFilter,
  SortMode,
  countBriefing,
} from "@/lib/alertClassification";

interface InboxBriefingHeaderProps {
  alerts: PeruAlert[];
  briefingFilter: BriefingFilter;
  onBriefingFilterChange: (bf: BriefingFilter) => void;
  quickFilter: QuickFilter;
  onQuickFilterChange: (qf: QuickFilter) => void;
  sortMode: SortMode;
  onSortModeChange: (m: SortMode) => void;
  showRezagadas: boolean;
  onShowRezagadasChange: (v: boolean) => void;
  search: string;
  onSearchChange: (s: string) => void;
}

const PILLS: { value: QuickFilter; label: string }[] = [
  { value: "all", label: "Todo" },
  { value: "publicidad", label: "Publicidad" },
  { value: "consumidor", label: "Consumidor" },
  { value: "aml", label: "AML / UIF" },
  { value: "fintech", label: "Pagos / Fintech" },
  { value: "tributario", label: "Tributario" },
  { value: "privacidad", label: "Privacidad / ANPD" },
  { value: "deportiva", label: "Integridad deportiva" },
  { value: "ciberseguridad", label: "Ciberseguridad" },
  { value: "societario", label: "Societario" },
  { value: "bookmarks", label: "Bookmarks" },
  { value: "otros", label: "Otros" },
];

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
  quickFilter,
  onQuickFilterChange,
  sortMode,
  onSortModeChange,
  showRezagadas,
  onShowRezagadasChange,
  search,
  onSearchChange,
}: InboxBriefingHeaderProps) {
  const counts = useMemo(() => countBriefing(alerts), [alerts]);
  const briefingDate = useMemo(() => formatBriefingDate(new Date()), []);

  const [topicsOpen, setTopicsOpen] = useState(false);
  const [toolbarOpen, setToolbarOpen] = useState(false);

  const activePillLabel =
    quickFilter !== "all" ? PILLS.find((p) => p.value === quickFilter)?.label : null;
  const activeBriefingLabel = briefingFilter ? BRIEFING_LABELS[briefingFilter] : null;
  const activeFilterChip = activeBriefingLabel || activePillLabel;

  const toggleBriefing = (bf: Exclude<BriefingFilter, null>) => {
    if (briefingFilter === bf) {
      onBriefingFilterChange(null);
    } else {
      onBriefingFilterChange(bf);
      // Mutually exclusive with topic pill
      if (quickFilter !== "all") onQuickFilterChange("all");
    }
  };

  const setPill = (qf: QuickFilter) => {
    onQuickFilterChange(qf);
    if (qf !== "all" && briefingFilter) onBriefingFilterChange(null);
  };

  const clearActiveFilter = () => {
    if (briefingFilter) onBriefingFilterChange(null);
    if (quickFilter !== "all") onQuickFilterChange("all");
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

      <div className="border-t border-border/30" />

      {/* ZONE 2 — TOPIC PILLS */}
      <Collapsible open={topicsOpen} onOpenChange={setTopicsOpen}>
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
            {!topicsOpen && activePillLabel && (
              <span className="text-foreground">· {activePillLabel}</span>
            )}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {PILLS.map((p) => {
              const isActive = quickFilter === p.value;
              return (
                <Button
                  key={p.value}
                  variant="outline"
                  size="sm"
                  onClick={() => setPill(p.value)}
                  className={cn(
                    "h-8 rounded-full text-xs whitespace-nowrap shrink-0 border-border/50",
                    isActive
                      ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                      : "bg-muted/30 hover:bg-muted/50"
                  )}
                >
                  {p.label}
                </Button>
              );
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="border-t border-border/30" />

      {/* ZONE 3 — TOOLBAR */}
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

            <Toggle
              pressed={showRezagadas}
              onPressedChange={onShowRezagadasChange}
              className="gap-1.5 h-8 text-xs data-[state=on]:bg-muted data-[state=on]:text-foreground"
              aria-label="Mostrar rezagadas"
            >
              <Hourglass className="h-3.5 w-3.5" />
              <span>Rezagadas</span>
            </Toggle>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
