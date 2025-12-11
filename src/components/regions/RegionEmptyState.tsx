import React from "react";
import { Button } from "@/components/ui/button";
import { RegionCode, regionThemes, RegionIcon } from "./RegionConfig";
import { FileText, Search, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface RegionEmptyStateProps {
  region: RegionCode;
  onAction?: (action: string) => void;
  className?: string;
}

export function RegionEmptyState({ region, onAction, className }: RegionEmptyStateProps) {
  const theme = regionThemes[region];
  const { emptyStateMessages } = theme;

  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center py-12 px-6 rounded-lg border border-dashed",
        className
      )}
      style={{
        borderColor: `color-mix(in srgb, ${theme.primaryColor} 30%, transparent)`,
        backgroundColor: `color-mix(in srgb, ${theme.primaryColor} 3%, transparent)`,
      }}
    >
      {/* Region icon */}
      <div 
        className="flex items-center justify-center w-16 h-16 rounded-full mb-4"
        style={{
          backgroundColor: `color-mix(in srgb, ${theme.primaryColor} 10%, transparent)`,
        }}
      >
        <RegionIcon region={region} size={32} showCode={false} />
      </div>

      {/* Title */}
      <h3 
        className="text-lg font-semibold mb-1"
        style={{ color: theme.primaryColor }}
      >
        {emptyStateMessages.title}
      </h3>

      {/* Subtitle with regional tone */}
      <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
        {emptyStateMessages.subtitle}
      </p>

      {/* Suggestion buttons */}
      <div className="flex flex-wrap justify-center gap-2">
        {emptyStateMessages.suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="text-xs"
            style={{
              borderColor: `color-mix(in srgb, ${theme.primaryColor} 40%, transparent)`,
              color: theme.primaryColor,
            }}
            onClick={() => onAction?.(suggestion)}
          >
            {index === 0 && <FileText className="h-3 w-3 mr-1.5" />}
            {index === 1 && <Search className="h-3 w-3 mr-1.5" />}
            {index === 2 && <RefreshCw className="h-3 w-3 mr-1.5" />}
            {suggestion}
          </Button>
        ))}
      </div>

      {/* Regional tone indicator */}
      <div className="mt-6 text-[10px] uppercase tracking-wider text-muted-foreground/60">
        {theme.tone}
      </div>
    </div>
  );
}

export default RegionEmptyState;
