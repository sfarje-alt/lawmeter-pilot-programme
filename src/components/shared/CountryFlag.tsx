import { useState } from "react";
import { cn } from "@/lib/utils";
import { COUNTRY_FLAGS, CountryFlagInfo } from "@/config/countryFlags";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Globe } from "lucide-react";

export type CountryFlagVariant = "flag" | "compact" | "full";
export type CountryFlagSize = "xs" | "sm" | "md" | "lg";

interface CountryFlagProps {
  countryKey: string;
  variant?: CountryFlagVariant;
  size?: CountryFlagSize;
  showTooltip?: boolean;
  className?: string;
}

// Size presets (height in pixels, maintaining 3:2 aspect ratio for flags)
const SIZE_MAP: Record<CountryFlagSize, { height: number; fontSize: string }> = {
  xs: { height: 12, fontSize: "text-[10px]" },
  sm: { height: 16, fontSize: "text-xs" },
  md: { height: 20, fontSize: "text-sm" },
  lg: { height: 24, fontSize: "text-base" },
};

export function CountryFlag({
  countryKey,
  variant = "flag",
  size = "sm",
  showTooltip = true,
  className,
}: CountryFlagProps) {
  const [imageError, setImageError] = useState(false);
  const info = COUNTRY_FLAGS[countryKey];
  const sizeConfig = SIZE_MAP[size];

  if (!info) {
    // Fallback for unknown country
    return (
      <span className={cn("inline-flex items-center gap-1", className)}>
        <Globe className="text-muted-foreground" style={{ height: sizeConfig.height, width: sizeConfig.height }} />
        {variant !== "flag" && (
          <span className={cn(sizeConfig.fontSize, "text-muted-foreground")}>
            {variant === "compact" ? countryKey.slice(0, 2).toUpperCase() : countryKey}
          </span>
        )}
      </span>
    );
  }

  const flagElement = imageError ? (
    // Emoji fallback if CDN fails
    <span style={{ fontSize: sizeConfig.height * 0.9 }}>{info.emoji}</span>
  ) : (
    <img
      src={info.flagUrl}
      alt={`${info.name} flag`}
      loading="lazy"
      onError={() => setImageError(true)}
      className="inline-block rounded-[2px] object-cover"
      style={{
        height: sizeConfig.height,
        width: Math.round(sizeConfig.height * 1.5), // 3:2 aspect ratio
      }}
    />
  );

  const content = (
    <span className={cn("inline-flex items-center gap-1", className)}>
      {flagElement}
      {variant === "compact" && (
        <span className={cn(sizeConfig.fontSize, "font-medium")}>{info.code}</span>
      )}
      {variant === "full" && (
        <span className={cn(sizeConfig.fontSize)}>{info.name}</span>
      )}
    </span>
  );

  // Only show tooltip for flag-only variant or when explicitly requested
  if (showTooltip && variant === "flag") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-default">{content}</span>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            {info.name}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
}

// Export a helper function to get country info directly
export function getCountryInfo(countryKey: string): CountryFlagInfo | null {
  return COUNTRY_FLAGS[countryKey] || null;
}
