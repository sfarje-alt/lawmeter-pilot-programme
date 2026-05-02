// Cabecera colapsable de un grupo de entidad para el feed de Normas (Fase C).

import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface EntityGroupHeaderProps {
  group: string;
  count: number;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export function EntityGroupSection({
  group,
  count,
  open,
  onToggle,
  children,
}: EntityGroupHeaderProps) {
  return (
    <Collapsible open={open} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-muted/30 hover:bg-muted/50 border border-border/30 transition-colors"
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              !open && "-rotate-90",
            )}
          />
          <Building2 className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">{group}</span>
          <Badge variant="secondary" className="ml-auto h-5 px-2 text-xs">
            {count}
          </Badge>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pt-3 pb-1">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
