import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InternationalLegislation } from "@/data/mockInternationalLegislation";
import { aggregateByJurisdiction } from "./JurisdictionMapUtils";
import { MapPin } from "lucide-react";

interface USStatesMapProps {
  legislation: InternationalLegislation[];
}

// Simplified US state positions for a grid-style map
const statePositions: Record<string, { x: number; y: number; name: string }> = {
  WA: { x: 1, y: 0, name: "Washington" },
  OR: { x: 1, y: 1, name: "Oregon" },
  CA: { x: 0, y: 2, name: "California" },
  NV: { x: 1, y: 2, name: "Nevada" },
  AZ: { x: 1, y: 3, name: "Arizona" },
  ID: { x: 2, y: 1, name: "Idaho" },
  MT: { x: 2, y: 0, name: "Montana" },
  WY: { x: 3, y: 1, name: "Wyoming" },
  UT: { x: 2, y: 2, name: "Utah" },
  CO: { x: 3, y: 2, name: "Colorado" },
  NM: { x: 2, y: 3, name: "New Mexico" },
  ND: { x: 4, y: 0, name: "North Dakota" },
  SD: { x: 4, y: 1, name: "South Dakota" },
  NE: { x: 4, y: 2, name: "Nebraska" },
  KS: { x: 4, y: 3, name: "Kansas" },
  OK: { x: 4, y: 4, name: "Oklahoma" },
  TX: { x: 3, y: 4, name: "Texas" },
  MN: { x: 5, y: 0, name: "Minnesota" },
  IA: { x: 5, y: 1, name: "Iowa" },
  MO: { x: 5, y: 2, name: "Missouri" },
  AR: { x: 5, y: 3, name: "Arkansas" },
  LA: { x: 5, y: 4, name: "Louisiana" },
  WI: { x: 6, y: 0, name: "Wisconsin" },
  IL: { x: 6, y: 1, name: "Illinois" },
  IN: { x: 7, y: 1, name: "Indiana" },
  MI: { x: 7, y: 0, name: "Michigan" },
  OH: { x: 8, y: 1, name: "Ohio" },
  KY: { x: 7, y: 2, name: "Kentucky" },
  TN: { x: 6, y: 2, name: "Tennessee" },
  MS: { x: 6, y: 3, name: "Mississippi" },
  AL: { x: 7, y: 3, name: "Alabama" },
  GA: { x: 8, y: 3, name: "Georgia" },
  FL: { x: 8, y: 4, name: "Florida" },
  SC: { x: 9, y: 3, name: "South Carolina" },
  NC: { x: 9, y: 2, name: "North Carolina" },
  VA: { x: 9, y: 1, name: "Virginia" },
  WV: { x: 8, y: 2, name: "West Virginia" },
  PA: { x: 9, y: 0, name: "Pennsylvania" },
  NY: { x: 10, y: 0, name: "New York" },
  NJ: { x: 10, y: 1, name: "New Jersey" },
  MD: { x: 10, y: 2, name: "Maryland" },
  DE: { x: 11, y: 1, name: "Delaware" },
  CT: { x: 11, y: 0, name: "Connecticut" },
  MA: { x: 12, y: 0, name: "Massachusetts" },
  RI: { x: 12, y: 1, name: "Rhode Island" },
  VT: { x: 11, y: -1, name: "Vermont" },
  NH: { x: 12, y: -1, name: "New Hampshire" },
  ME: { x: 13, y: 0, name: "Maine" },
  AK: { x: 0, y: 4, name: "Alaska" },
  HI: { x: 0, y: 5, name: "Hawaii" },
};

function getAlertFillColor(high: number, medium: number, low: number): string {
  if (high > 0) return "hsl(0, 75%, 55%)";
  if (medium > 0) return "hsl(35, 85%, 55%)";
  if (low > 0) return "hsl(142, 60%, 45%)";
  return "hsl(220, 30%, 20%)";
}

export function USStatesMap({ legislation }: USStatesMapProps) {
  const stats = aggregateByJurisdiction(legislation, "USA");
  
  const cellSize = 32;
  const padding = 4;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          US States Alert Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="relative overflow-x-auto">
            <svg viewBox="-10 -40 480 230" className="w-full h-auto min-w-[400px]">
              {Object.entries(statePositions).map(([code, pos]) => {
                const stat = stats.get(code);
                const fillColor = stat 
                  ? getAlertFillColor(stat.high, stat.medium, stat.low)
                  : "hsl(220, 30%, 15%)";
                
                return (
                  <Tooltip key={code}>
                    <TooltipTrigger asChild>
                      <g className="cursor-pointer hover:opacity-80 transition-opacity">
                        <rect
                          x={pos.x * (cellSize + padding)}
                          y={pos.y * (cellSize + padding)}
                          width={cellSize}
                          height={cellSize}
                          rx={4}
                          fill={fillColor}
                          stroke="hsl(220, 40%, 8%)"
                          strokeWidth={1}
                        />
                        <text
                          x={pos.x * (cellSize + padding) + cellSize / 2}
                          y={pos.y * (cellSize + padding) + cellSize / 2}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-foreground text-[8px] font-medium"
                        >
                          {code}
                        </text>
                        {stat && stat.total > 0 && (
                          <circle
                            cx={pos.x * (cellSize + padding) + cellSize - 4}
                            cy={pos.y * (cellSize + padding) + 4}
                            r={8}
                            className="fill-background stroke-foreground"
                            strokeWidth={1}
                          />
                        )}
                        {stat && stat.total > 0 && (
                          <text
                            x={pos.x * (cellSize + padding) + cellSize - 4}
                            y={pos.y * (cellSize + padding) + 4}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-foreground text-[7px] font-bold"
                          >
                            {stat.total}
                          </text>
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
            <span>High Risk</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-risk-medium" />
            <span>Medium Risk</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-risk-low" />
            <span>Low Risk</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-muted/30" />
            <span>No Alerts</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
