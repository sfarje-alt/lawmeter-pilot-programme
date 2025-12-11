import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { RegionCode, regionThemes, RegionIcon } from "./RegionConfig";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface RegionSelectorProps {
  selectedRegion: RegionCode | null;
  onSelectRegion: (region: RegionCode) => void;
  alertCounts?: Partial<Record<RegionCode, number>>;
  className?: string;
  orientation?: "horizontal" | "vertical";
}

const REGION_ORDER: RegionCode[] = ["NAM", "LATAM", "EU", "GCC", "APAC", "JP"];

export function RegionSelector({ 
  selectedRegion, 
  onSelectRegion, 
  alertCounts = {},
  className,
  orientation = "horizontal"
}: RegionSelectorProps) {
  if (orientation === "vertical") {
    return (
      <div className={cn("space-y-1", className)}>
        {REGION_ORDER.map((regionCode) => {
          const theme = regionThemes[regionCode];
          const isSelected = selectedRegion === regionCode;
          const count = alertCounts[regionCode] || 0;

          return (
            <Button
              key={regionCode}
              variant="ghost"
              className={cn(
                "w-full justify-between h-auto py-2 px-3 transition-all",
                isSelected && "bg-muted"
              )}
              onClick={() => onSelectRegion(regionCode)}
            >
              <div className="flex items-center gap-2">
                <RegionIcon region={regionCode} size={18} showCode={false} />
                <div className="text-left">
                  <div className="text-sm font-medium">{theme.name}</div>
                  <div className="text-[10px] text-muted-foreground">{theme.tone}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {count > 0 && (
                  <span 
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ 
                      backgroundColor: `color-mix(in srgb, ${theme.primaryColor} 20%, transparent)`,
                      color: theme.primaryColor
                    }}
                  >
                    {count}
                  </span>
                )}
                <ChevronRight className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform",
                  isSelected && "text-primary rotate-90"
                )} />
              </div>
            </Button>
          );
        })}
      </div>
    );
  }

  return (
    <ScrollArea className={cn("w-full", className)}>
      <div className="flex gap-2 pb-2">
        {REGION_ORDER.map((regionCode) => {
          const theme = regionThemes[regionCode];
          const isSelected = selectedRegion === regionCode;
          const count = alertCounts[regionCode] || 0;

          return (
            <Button
              key={regionCode}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              className={cn(
                "flex-shrink-0 gap-2 h-10 px-3 transition-all",
                isSelected && "ring-2 ring-offset-2 ring-offset-background"
              )}
              style={isSelected ? {
                backgroundColor: theme.primaryColor,
                borderColor: theme.primaryColor,
                color: 'white',
                // @ts-ignore - CSS custom property for ring color
                '--tw-ring-color': theme.primaryColor
              } as React.CSSProperties : {
                borderColor: `color-mix(in srgb, ${theme.primaryColor} 40%, transparent)`,
                color: theme.primaryColor
              }}
              onClick={() => onSelectRegion(regionCode)}
            >
              <RegionIcon region={regionCode} size={16} showCode={false} />
              <span className="font-semibold">{regionCode}</span>
              {count > 0 && (
                <span 
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ 
                    backgroundColor: isSelected 
                      ? 'rgba(255,255,255,0.2)' 
                      : `color-mix(in srgb, ${theme.primaryColor} 15%, transparent)`,
                  }}
                >
                  {count}
                </span>
              )}
            </Button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

export default RegionSelector;
