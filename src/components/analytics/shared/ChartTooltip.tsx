import * as React from "react";
import type { TooltipProps } from "recharts";
import { cn } from "@/lib/utils";

/**
 * Unified Recharts tooltip with proper light-on-dark contrast.
 * Uses design-system tokens (popover + popover-foreground) so it works in both themes.
 *
 * Usage:
 *   <Tooltip content={<ChartTooltip />} />
 *   <Tooltip content={<ChartTooltip labelFormatter={(v) => `Semana ${v}`} valueFormatter={(v) => `${v} alertas`} />} />
 */
export interface ChartTooltipProps extends TooltipProps<number, string> {
  labelFormatter?: (label: any) => React.ReactNode;
  valueFormatter?: (value: number, name?: string) => React.ReactNode;
  /** Hide the colored swatch next to each series */
  hideIndicator?: boolean;
  /** Hide the series name (useful for single-series charts) */
  hideLabel?: boolean;
  className?: string;
}

export const ChartTooltip = React.forwardRef<HTMLDivElement, ChartTooltipProps>(
  ({ active, payload, label, labelFormatter, valueFormatter, hideIndicator, hideLabel, className }, ref) => {
    if (!active || !payload || payload.length === 0) return null;

    const formattedLabel = labelFormatter ? labelFormatter(label) : label;

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-border bg-popover px-3 py-2 shadow-lg",
          "text-popover-foreground text-xs",
          "min-w-[140px] max-w-[280px]",
          className
        )}
      >
        {formattedLabel !== undefined && formattedLabel !== null && formattedLabel !== "" && (
          <div className="font-medium text-popover-foreground mb-1.5 border-b border-border/50 pb-1.5">
            {formattedLabel}
          </div>
        )}
        <div className="space-y-1">
          {payload.map((entry, index) => {
            const value = entry.value as number;
            const name = entry.name as string | undefined;
            const color = (entry.color || entry.payload?.fill) as string | undefined;

            return (
              <div key={`${name ?? "series"}-${index}`} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  {!hideIndicator && color && (
                    <span
                      className="inline-block h-2 w-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                  )}
                  {!hideLabel && name && (
                    <span className="text-muted-foreground truncate">{name}</span>
                  )}
                </div>
                <span className="font-semibold text-popover-foreground tabular-nums">
                  {valueFormatter ? valueFormatter(value, name) : value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
ChartTooltip.displayName = "ChartTooltip";

/**
 * Default Recharts wrapper props for the cursor (so it doesn't leave dark artifacts).
 */
export const CHART_CURSOR = {
  fill: "hsl(var(--muted))",
  fillOpacity: 0.4,
};
