import React from "react";
import { Badge } from "@/components/ui/badge";
import { RegionCode, regionThemes, RegionIcon } from "./RegionConfig";
import { cn } from "@/lib/utils";

interface RegionHeaderProps {
  region: RegionCode;
  title?: string;
  subtitle?: string;
  alertCount?: number;
  className?: string;
}

export function RegionHeader({ 
  region, 
  title, 
  subtitle,
  alertCount,
  className 
}: RegionHeaderProps) {
  const theme = regionThemes[region];
  
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-lg border p-4",
        className
      )}
      style={{
        background: theme.bgPattern,
        borderColor: `color-mix(in srgb, ${theme.primaryColor} 20%, transparent)`,
      }}
    >
      {/* Decorative background elements */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: getRegionPattern(region),
          backgroundSize: region === 'EU' ? '60px 60px' : '80px 80px',
        }}
      />
      
      {/* Header content */}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <RegionIcon region={region} size={28} showCode={false} />
          
          <div>
            <div className="flex items-center gap-2">
              <h3 
                className="text-lg font-bold"
                style={{ color: theme.primaryColor }}
              >
                {title || theme.name}
              </h3>
              <Badge 
                variant="outline" 
                className="text-[10px] font-bold tracking-wider px-1.5 py-0"
                style={{ 
                  borderColor: theme.primaryColor,
                  color: theme.primaryColor,
                  backgroundColor: `color-mix(in srgb, ${theme.primaryColor} 10%, transparent)`
                }}
              >
                {region}
              </Badge>
              {alertCount !== undefined && alertCount > 0 && (
                <Badge 
                  className="text-[10px] px-1.5 py-0"
                  style={{ 
                    backgroundColor: theme.primaryColor,
                    color: 'white'
                  }}
                >
                  {alertCount}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {subtitle || theme.tone}
            </p>
          </div>
        </div>
        
        {/* Region full name */}
        <div className="hidden md:block text-right">
          <span className="text-xs text-muted-foreground">{theme.fullName}</span>
        </div>
      </div>
    </div>
  );
}

// Region-specific background patterns
function getRegionPattern(region: RegionCode): string {
  switch (region) {
    case 'NAM':
      // Horizontal lines (case files/dockets)
      return `repeating-linear-gradient(
        0deg,
        currentColor 0px,
        currentColor 1px,
        transparent 1px,
        transparent 8px
      )`;
    case 'LATAM':
      // River/topography curves
      return `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40c20-10 40 10 60 0s40 10 60 0' stroke='currentColor' fill='none' stroke-width='1'/%3E%3Cpath d='M0 60c20-10 40 10 60 0s40 10 60 0' stroke='currentColor' fill='none' stroke-width='1'/%3E%3C/svg%3E")`;
    case 'EU':
      // Ring of dots
      return `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='20' stroke='currentColor' fill='none' stroke-width='1' stroke-dasharray='3 5'/%3E%3C/svg%3E")`;
    case 'GCC':
      // Arch/dome outlines
      return `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 80c0-44 36-80 80-80' stroke='currentColor' fill='none' stroke-width='1'/%3E%3C/svg%3E")`;
    case 'APAC':
      // Diagonal dynamic lines
      return `repeating-linear-gradient(
        135deg,
        currentColor 0px,
        currentColor 1px,
        transparent 1px,
        transparent 12px
      )`;
    case 'JP':
      // Clean grid (precision)
      return `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20h40M20 0v40' stroke='currentColor' fill='none' stroke-width='0.5'/%3E%3C/svg%3E")`;
    default:
      return 'none';
  }
}

export default RegionHeader;
