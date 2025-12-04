import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InternationalLegislation } from "@/data/mockInternationalLegislation";
import { getAlertColorClass } from "./JurisdictionMapUtils";
import { Globe } from "lucide-react";

interface GlobalJurisdictionMapProps {
  legislation: InternationalLegislation[];
}

// Global jurisdiction positions roughly matching world map layout
const jurisdictionPositions: Record<string, { x: number; y: number; name: string; width?: number }> = {
  USA: { x: 1, y: 1, name: "United States", width: 2 },
  Canada: { x: 1, y: 0, name: "Canada", width: 2 },
  EU: { x: 4, y: 0, name: "European Union", width: 1.5 },
  Japan: { x: 7, y: 1, name: "Japan" },
  Korea: { x: 6, y: 1, name: "South Korea" },
  Taiwan: { x: 6, y: 2, name: "Taiwan" },
  UAE: { x: 5, y: 2, name: "UAE" },
  "Saudi Arabia": { x: 4, y: 2, name: "Saudi Arabia" },
  Kuwait: { x: 4.5, y: 1.5, name: "Kuwait" },
  Bahrain: { x: 5, y: 1.5, name: "Bahrain" },
  Qatar: { x: 5.5, y: 1.5, name: "Qatar" },
  Oman: { x: 5.5, y: 2.5, name: "Oman" },
  "Costa Rica": { x: 2, y: 2, name: "Costa Rica" },
};

export function GlobalJurisdictionMap({ legislation }: GlobalJurisdictionMapProps) {
  // Aggregate by main jurisdiction
  const stats = new Map<string, { code: string; name: string; total: number; high: number; medium: number; low: number }>();
  
  legislation.forEach(item => {
    const key = item.jurisdiction;
    const existing = stats.get(key) || {
      code: key,
      name: key,
      total: 0,
      high: 0,
      medium: 0,
      low: 0
    };
    
    existing.total++;
    if (item.riskLevel === "high") existing.high++;
    else if (item.riskLevel === "medium") existing.medium++;
    else existing.low++;
    
    stats.set(key, existing);
  });
  
  const cellSize = 70;
  const cellHeight = 50;
  const padding = 8;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Global Alert Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="relative overflow-x-auto">
            <svg viewBox="-10 -10 620 200" className="w-full h-auto min-w-[500px]">
              {Object.entries(jurisdictionPositions).map(([code, pos]) => {
                const stat = stats.get(code);
                const colorClass = stat 
                  ? getAlertColorClass(stat.high, stat.medium, stat.low)
                  : "fill-muted/30";
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
                          rx={6}
                          className={`${colorClass} stroke-background`}
                          strokeWidth={2}
                        />
                        <text
                          x={pos.x * (cellSize + padding) + width / 2}
                          y={pos.y * (cellHeight + padding) + cellHeight / 2 - 6}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-foreground text-[10px] font-medium"
                        >
                          {code.length > 10 ? code.split(" ").map(w => w[0]).join("") : code}
                        </text>
                        {stat && (
                          <text
                            x={pos.x * (cellSize + padding) + width / 2}
                            y={pos.y * (cellHeight + padding) + cellHeight / 2 + 10}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-foreground/70 text-[9px]"
                          >
                            {stat.total} alert{stat.total !== 1 ? "s" : ""}
                          </text>
                        )}
                      </g>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-sm">
                        <p className="font-semibold">{pos.name}</p>
                        {stat ? (
                          <div className="space-y-1 mt-1">
                            <p className="text-muted-foreground">Total: {stat.total}</p>
                            <div className="flex gap-2">
                              <Badge variant="destructive" className="text-xs">{stat.high} High</Badge>
                              <Badge className="bg-risk-medium text-xs">{stat.medium} Med</Badge>
                              <Badge className="bg-risk-low text-foreground text-xs">{stat.low} Low</Badge>
                            </div>
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
        <div className="flex gap-4 mt-4 justify-center text-xs flex-wrap">
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
