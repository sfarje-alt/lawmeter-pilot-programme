import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InternationalLegislation } from "@/data/mockInternationalLegislation";
import { aggregateByJurisdiction } from "./JurisdictionMapUtils";
import { MapPin } from "lucide-react";

interface CanadaProvincesMapProps {
  legislation: InternationalLegislation[];
}

// Canada provinces/territories positions
const provincePositions: Record<string, { x: number; y: number; name: string; width?: number }> = {
  BC: { x: 0, y: 1, name: "British Columbia" },
  AB: { x: 1, y: 1, name: "Alberta" },
  SK: { x: 2, y: 1, name: "Saskatchewan" },
  MB: { x: 3, y: 1, name: "Manitoba" },
  ON: { x: 4, y: 1, name: "Ontario", width: 1.5 },
  QC: { x: 5.5, y: 1, name: "Quebec", width: 1.5 },
  NB: { x: 7, y: 1, name: "New Brunswick" },
  NS: { x: 8, y: 1, name: "Nova Scotia" },
  PE: { x: 8, y: 0, name: "Prince Edward Island" },
  NL: { x: 9, y: 1, name: "Newfoundland" },
  YT: { x: 0, y: 0, name: "Yukon" },
  NT: { x: 1, y: 0, name: "Northwest Territories", width: 2 },
  NU: { x: 3, y: 0, name: "Nunavut", width: 2 },
  Federal: { x: 5, y: 0, name: "Federal", width: 2 },
};

function getAlertFillColor(high: number, medium: number, low: number): string {
  if (high > 0) return "hsl(0, 75%, 55%)";
  if (medium > 0) return "hsl(35, 85%, 55%)";
  if (low > 0) return "hsl(142, 60%, 45%)";
  return "hsl(220, 30%, 15%)";
}

export function CanadaProvincesMap({ legislation }: CanadaProvincesMapProps) {
  const stats = aggregateByJurisdiction(legislation, "Canada");
  
  const cellSize = 40;
  const cellHeight = 36;
  const padding = 4;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Canada Provinces Alert Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="relative overflow-x-auto">
            <svg viewBox="-10 -10 460 110" className="w-full h-auto min-w-[380px]">
              {Object.entries(provincePositions).map(([code, pos]) => {
                const stat = stats.get(code);
                const fillColor = stat 
                  ? getAlertFillColor(stat.high, stat.medium, stat.low)
                  : "hsl(220, 30%, 15%)";
                const width = (pos.width || 1) * cellSize + (pos.width ? (pos.width - 1) * padding : 0);
                
                return (
                  <Tooltip key={code}>
                    <TooltipTrigger asChild>
                      <g className="cursor-pointer hover:opacity-80 transition-opacity">
                        <rect
                          x={pos.x * (cellSize + padding)}
                          y={pos.y * (cellHeight + padding)}
                          width={width}
                          height={cellHeight}
                          rx={4}
                          fill={fillColor}
                          stroke="hsl(220, 40%, 8%)"
                          strokeWidth={1}
                        />
                        <text
                          x={pos.x * (cellSize + padding) + width / 2}
                          y={pos.y * (cellHeight + padding) + cellHeight / 2}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-foreground text-[9px] font-medium"
                        >
                          {code}
                        </text>
                        {stat && stat.total > 0 && (
                          <>
                            <circle
                              cx={pos.x * (cellSize + padding) + width - 6}
                              cy={pos.y * (cellHeight + padding) + 6}
                              r={9}
                              className="fill-background stroke-foreground"
                              strokeWidth={1}
                            />
                            <text
                              x={pos.x * (cellSize + padding) + width - 6}
                              y={pos.y * (cellHeight + padding) + 6}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="fill-foreground text-[8px] font-bold"
                            >
                              {stat.total}
                            </text>
                          </>
                        )}
                      </g>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-sm">
                        <p className="font-semibold">{pos.name}</p>
                        {stat ? (
                          <div className="flex gap-2 mt-1">
                            <Badge variant="destructive" className="text-xs">{stat.high} High</Badge>
                            <Badge className="bg-risk-medium text-xs">{stat.medium} Med</Badge>
                            <Badge className="bg-risk-low text-foreground text-xs">{stat.low} Low</Badge>
                          </div>
                        ) : (
                          <p className="text-muted-foreground">No alerts</p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </svg>
          </div>
        </TooltipProvider>
        
        {/* Legend */}
        <div className="flex gap-4 mt-4 justify-center text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-risk-high" />
            <span>High</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-risk-medium" />
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-risk-low" />
            <span>Low</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-muted/30" />
            <span>None</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
