// Pills de filtro rápido sobre el feed de alertas (Fase A).

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { QuickFilter } from "@/lib/alertClassification";

interface QuickFilterPillsProps {
  active: QuickFilter;
  onChange: (qf: QuickFilter) => void;
  counts: Record<QuickFilter, number>;
}

const PILLS: { value: QuickFilter; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "action", label: "Acción requerida" },
  { value: "bookmarks", label: "Bookmarks" },
  { value: "recent", label: "Movimiento 7d" },
  { value: "low", label: "Bajo impacto" },
];

export function QuickFilterPills({ active, onChange, counts }: QuickFilterPillsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {PILLS.map((p) => {
        const isActive = active === p.value;
        return (
          <Button
            key={p.value}
            variant="outline"
            size="sm"
            onClick={() => onChange(p.value)}
            className={cn(
              "h-8 rounded-full text-xs gap-1.5 border-border/50",
              isActive
                ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                : "bg-muted/30 hover:bg-muted/50"
            )}
          >
            <span>{p.label}</span>
            <Badge
              variant="secondary"
              className={cn(
                "h-4 px-1.5 text-[10px]",
                isActive && "bg-primary-foreground/20 text-primary-foreground"
              )}
            >
              {counts[p.value]}
            </Badge>
          </Button>
        );
      })}
    </div>
  );
}
