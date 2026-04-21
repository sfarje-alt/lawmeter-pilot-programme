import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronDown, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleAnalyticsSectionProps {
  id: string;
  title: string;
  description?: string;
  badge?: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  /** Optional section-specific filter row rendered inside the section header area when expanded. */
  filters?: React.ReactNode;
  children: React.ReactNode;
  /**
   * When a section is maximized, the parent (dashboard) is notified so it can hide
   * other sections, focusing the user on this one.
   */
  isMaximized?: boolean;
  onMaximizeChange?: (next: boolean) => void;
}

/**
 * A calm, modular wrapper for an analytics section.
 * - Collapsible header (chevron)
 * - Maximize / Minimize control (focused analysis mode)
 * - Optional section-specific filter row (only visible when expanded)
 *
 * IMPORTANT: this wrapper only frames the section. It does NOT modify the
 * inner analytic blocks — when the user opens an individual analytic, the
 * existing AnalyticsBlock detail/expanded pattern is preserved untouched.
 */
export function CollapsibleAnalyticsSection({
  id,
  title,
  description,
  badge,
  icon,
  defaultOpen = false,
  filters,
  children,
  isMaximized = false,
  onMaximizeChange,
}: CollapsibleAnalyticsSectionProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  // When maximized, force open
  React.useEffect(() => {
    if (isMaximized) setOpen(true);
  }, [isMaximized]);

  return (
    <section
      id={id}
      className={cn(
        "rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm transition-all",
        isMaximized && "shadow-lg shadow-primary/5"
      )}
    >
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-3 flex-1 min-w-0 text-left group"
            >
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform flex-shrink-0",
                  !open && "-rotate-90"
                )}
              />
              {icon && (
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {icon}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {title}
                  </h2>
                  {badge && (
                    <Badge variant="outline" className="text-[10px] h-5">
                      {badge}
                    </Badge>
                  )}
                </div>
                {description && (
                  <p className="text-xs text-muted-foreground truncate">{description}</p>
                )}
              </div>
            </button>
          </CollapsibleTrigger>

          {onMaximizeChange && (
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => onMaximizeChange(!isMaximized)}
                  >
                    {isMaximized ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {isMaximized ? "Salir de vista enfocada" : "Maximizar sección"}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  {isMaximized ? "Salir de vista enfocada" : "Vista enfocada"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <CollapsibleContent>
          {filters && (
            <div className="px-5 pb-3 border-t border-border/30 pt-3">
              {filters}
            </div>
          )}
          <div className="px-5 pb-5 pt-1">{children}</div>
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
}
