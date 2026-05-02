// Sección de un grupo de entidad para el feed de Normas (vertical, full-width).
// Header rico con icono, label, subtítulo y contador. Contenido stack vertical.

import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Building, Landmark, Plane, Receipt, Scale } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import {
  NormaEntityGroupMeta,
} from "@/lib/alertClassification";

const ICONS: Record<NormaEntityGroupMeta["iconName"], LucideIcon> = {
  Landmark,
  Plane,
  Receipt,
  Scale,
  Building,
};

interface EntityGroupSectionProps {
  meta: NormaEntityGroupMeta;
  count: number;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export function EntityGroupSection({
  meta,
  count,
  open,
  onToggle,
  children,
}: EntityGroupSectionProps) {
  const Icon = ICONS[meta.iconName];
  return (
    <Collapsible open={open} onOpenChange={onToggle}>
      <div className="rounded-lg border border-border/40 bg-card/40 overflow-hidden">
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2.5 bg-muted/30 hover:bg-muted/50 transition-colors text-left",
              open && "border-b border-border/40",
            )}
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform shrink-0",
                !open && "-rotate-90",
              )}
            />
            <div
              className={cn(
                "h-8 w-8 rounded-md flex items-center justify-center shrink-0",
                meta.bgClass,
              )}
            >
              <Icon className={cn("h-4 w-4", meta.toneClass)} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-foreground truncate">{meta.label}</div>
              <div className="text-[11px] text-muted-foreground truncate">{meta.subtitle}</div>
            </div>
            <Badge variant="secondary" className="h-5 px-2 text-xs shrink-0">
              {count}
            </Badge>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="flex flex-col gap-2 px-3 py-3">{children}</div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
