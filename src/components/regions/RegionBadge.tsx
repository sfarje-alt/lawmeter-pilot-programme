import React from "react";
import { Badge } from "@/components/ui/badge";
import { RegionCode, regionThemes } from "./RegionConfig";
import { NAMIcon, LATAMIcon, EUIcon, GCCIcon, APACIcon, JPIcon } from "./RegionConfig";
import { cn } from "@/lib/utils";

interface RegionBadgeProps {
  region: RegionCode;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "subtle";
  showIcon?: boolean;
  className?: string;
}

const iconComponents = {
  NAM: NAMIcon,
  LATAM: LATAMIcon,
  EU: EUIcon,
  GCC: GCCIcon,
  APAC: APACIcon,
  JP: JPIcon
};

const sizeConfig = {
  sm: { badge: "text-[9px] px-1 py-0 h-4", icon: 10, gap: "gap-0.5" },
  md: { badge: "text-[10px] px-1.5 py-0.5 h-5", icon: 12, gap: "gap-1" },
  lg: { badge: "text-xs px-2 py-1 h-6", icon: 14, gap: "gap-1.5" }
};

export function RegionBadge({ 
  region, 
  size = "md", 
  variant = "default",
  showIcon = true,
  className 
}: RegionBadgeProps) {
  const theme = regionThemes[region];
  const IconComponent = iconComponents[region];
  const config = sizeConfig[size];

  const getStyles = () => {
    switch (variant) {
      case "outline":
        return {
          backgroundColor: 'transparent',
          borderColor: theme.primaryColor,
          color: theme.primaryColor,
        };
      case "subtle":
        return {
          backgroundColor: `color-mix(in srgb, ${theme.primaryColor} 10%, transparent)`,
          borderColor: 'transparent',
          color: theme.primaryColor,
        };
      default:
        return {
          backgroundColor: theme.primaryColor,
          borderColor: theme.primaryColor,
          color: 'white',
        };
    }
  };

  return (
    <Badge 
      className={cn(
        "font-bold tracking-wider inline-flex items-center",
        config.badge,
        config.gap,
        className
      )}
      style={getStyles()}
    >
      {showIcon && (
        <IconComponent size={config.icon} className="flex-shrink-0" />
      )}
      <span>{region}</span>
    </Badge>
  );
}

export default RegionBadge;
