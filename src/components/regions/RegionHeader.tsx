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
        "relative overflow-hidden rounded-lg border p-4 bg-card",
        className
      )}
      style={{
        borderColor: `hsl(var(--border))`,
      }}
    >
      {/* Subtle gradient overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{ background: theme.bgPattern }}
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
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {subtitle}
              </p>
            )}
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

export default RegionHeader;
