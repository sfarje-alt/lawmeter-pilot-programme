import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InternationalLegislation } from "@/data/mockInternationalLegislation";
import { aggregateByJurisdiction } from "./JurisdictionMapUtils";
import { MapPin } from "lucide-react";

interface CanadaProvincesMapProps {
  legislation: InternationalLegislation[];
}

// Simplified Canada province paths
const provincePaths: Record<string, { d: string; name: string; cx: number; cy: number }> = {
  BC: { d: "M20,80 L50,60 L60,90 L55,140 L30,150 L15,120 Z", name: "British Columbia", cx: 38, cy: 105 },
  AB: { d: "M55,60 L90,55 L95,140 L55,145 Z", name: "Alberta", cx: 75, cy: 100 },
  SK: { d: "M95,55 L135,52 L140,140 L95,145 Z", name: "Saskatchewan", cx: 117, cy: 97 },
  MB: { d: "M140,52 L180,50 L185,140 L140,145 Z", name: "Manitoba", cx: 162, cy: 95 },
  ON: { d: "M185,65 L250,55 L275,100 L260,150 L220,160 L185,145 Z", name: "Ontario", cx: 225, cy: 110 },
  QC: { d: "M260,40 L340,30 L360,75 L345,120 L290,130 L260,100 Z", name: "Quebec", cx: 305, cy: 80 },
  NB: { d: "M345,115 L365,110 L375,135 L355,145 Z", name: "New Brunswick", cx: 360, cy: 128 },
  NS: { d: "M365,130 L395,125 L405,150 L380,155 L370,145 Z", name: "Nova Scotia", cx: 385, cy: 140 },
  PE: { d: "M375,115 L395,112 L398,122 L378,125 Z", name: "Prince Edward Island", cx: 386, cy: 118 },
  NL: { d: "M365,60 L400,50 L415,95 L385,105 Z", name: "Newfoundland & Labrador", cx: 390, cy: 77 },
  YT: { d: "M15,20 L55,15 L60,60 L50,65 L20,75 Z", name: "Yukon", cx: 38, cy: 45 },
  NT: { d: "M60,15 L140,10 L145,52 L60,60 Z", name: "Northwest Territories", cx: 102, cy: 35 },
  NU: { d: "M145,8 L280,5 L290,50 L260,60 L180,55 L145,52 Z", name: "Nunavut", cx: 215, cy: 32 },
};

function getAlertFillColor(high: number, medium: number, low: number): string {
  if (high > 0) return "hsl(0, 75%, 55%)";
  if (medium > 0) return "hsl(35, 85%, 55%)";
  if (low > 0) return "hsl(142, 60%, 45%)";
  return "hsl(220, 30%, 20%)";
}

export function CanadaProvincesMap({ legislation }: CanadaProvincesMapProps) {
  const stats = aggregateByJurisdiction(legislation, "Canada");
  
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
          <svg viewBox="0 0 430 180" className="w-full h-auto">
            <rect x="0" y="0" width="430" height="180" fill="hsl(210, 50%, 15%)" rx="8" />
            
            {Object.entries(provincePaths).map(([code, { d, name, cx, cy }]) => {
              const stat = stats.get(code);
              const fillColor = stat ? getAlertFillColor(stat.high, stat.medium, stat.low) : "hsl(220, 25%, 25%)";
              
              return (
                <Tooltip key={code}>
                  <TooltipTrigger asChild>
                    <g className="cursor-pointer transition-all hover:opacity-80">
                      <path d={d} fill={fillColor} stroke="hsl(220, 20%, 35%)" strokeWidth="1" />
                      {stat && stat.total > 0 && (
                        <>
                          <circle cx={cx} cy={cy} r={10} fill="hsl(220, 40%, 8%)" stroke="hsl(210, 40%, 98%)" strokeWidth="1" />
                          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill="hsl(210, 40%, 98%)" fontSize="8" fontWeight="bold">{stat.total}</text>
                        </>
                      )}
                    </g>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-semibold">{name}</p>
                    {stat ? (
                      <div className="flex gap-2 mt-1">
                        <Badge variant="destructive" className="text-xs">{stat.high} High</Badge>
                        <Badge className="bg-risk-medium text-xs">{stat.medium} Med</Badge>
                        <Badge className="bg-risk-low text-foreground text-xs">{stat.low} Low</Badge>
                      </div>
                    ) : <p className="text-muted-foreground">No alerts</p>}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </svg>
        </TooltipProvider>
        
        <div className="flex gap-4 mt-4 justify-center text-xs">
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-risk-high" /><span>High</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-risk-medium" /><span>Medium</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-risk-low" /><span>Low</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{background: "hsl(220, 25%, 25%)"}} /><span>None</span></div>
        </div>
      </CardContent>
    </Card>
  );
}
