import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RegionCode, regionThemes, RegionIcon } from "./RegionConfig";
import { cn } from "@/lib/utils";
import { Calendar, AlertTriangle, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RegionLegislationCardProps {
  region: RegionCode;
  id: string;
  title: string;
  summary?: string;
  documentType: string;
  status: string;
  riskLevel: "high" | "medium" | "low";
  date?: string;
  deadline?: string;
  isRead?: boolean;
  onClick?: () => void;
  className?: string;
}

export function RegionLegislationCard({
  region,
  id,
  title,
  summary,
  documentType,
  status,
  riskLevel,
  date,
  deadline,
  isRead = false,
  onClick,
  className
}: RegionLegislationCardProps) {
  const theme = regionThemes[region];

  const getRiskBadgeClass = (level: string) => {
    switch (level) {
      case "high": return "bg-risk-high text-risk-high-foreground";
      case "medium": return "bg-risk-medium text-risk-medium-foreground";
      case "low": return "bg-risk-low text-risk-low-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card 
      className={cn(
        "transition-all hover:shadow-lg cursor-pointer group",
        !isRead && "border-l-4",
        className
      )}
      style={{
        borderLeftColor: !isRead ? theme.primaryColor : undefined,
        backgroundColor: !isRead 
          ? `color-mix(in srgb, ${theme.primaryColor} 3%, transparent)` 
          : undefined
      }}
      onClick={onClick}
    >
      <CardHeader className="pb-2 pt-3">
        {/* Region + Status badges */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Region badge */}
            <Badge 
              variant="outline" 
              className="text-[10px] font-bold tracking-wider px-1.5 py-0 gap-1"
              style={{ 
                borderColor: theme.primaryColor,
                color: theme.primaryColor,
                backgroundColor: `color-mix(in srgb, ${theme.primaryColor} 10%, transparent)`
              }}
            >
              <RegionIcon region={region} size={10} showCode={false} />
              {region}
            </Badge>
            
            {/* Document type */}
            <Badge variant="secondary" className="text-[10px]">
              {documentType}
            </Badge>
            
            {/* Status */}
            <Badge variant="outline" className="text-[10px]">
              {status}
            </Badge>
          </div>
          
          {/* Risk badge */}
          <Badge className={cn("text-[10px]", getRiskBadgeClass(riskLevel))}>
            {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
          </Badge>
        </div>

        {/* Title */}
        <h3 
          className="text-sm font-semibold leading-tight group-hover:text-primary transition-colors"
          style={{ color: isRead ? undefined : theme.primaryColor }}
        >
          {title}
        </h3>
      </CardHeader>

      <CardContent className="pt-0 space-y-2">
        {/* Summary */}
        {summary && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {summary}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 text-[10px] text-muted-foreground pt-1">
          <div className="flex items-center gap-3">
            {date && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{date}</span>
              </div>
            )}
            {deadline && (
              <div className="flex items-center gap-1 text-warning">
                <AlertTriangle className="h-3 w-3" />
                <span>Due: {deadline}</span>
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color: theme.primaryColor }}
          >
            <FileText className="h-3 w-3 mr-1" />
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default RegionLegislationCard;
