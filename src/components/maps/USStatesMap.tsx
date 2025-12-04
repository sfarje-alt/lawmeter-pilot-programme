import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InternationalLegislation } from "@/data/mockInternationalLegislation";
import { aggregateByJurisdiction } from "./JurisdictionMapUtils";
import { MapPin } from "lucide-react";

interface USStatesMapProps {
  legislation: InternationalLegislation[];
}

// Simplified US state paths (recognizable shapes)
const statePaths: Record<string, { d: string; name: string; cx: number; cy: number }> = {
  WA: { d: "M40,20 L75,15 L80,35 L75,50 L45,50 L35,35 Z", name: "Washington", cx: 57, cy: 35 },
  OR: { d: "M35,50 L75,50 L80,75 L70,90 L35,85 Z", name: "Oregon", cx: 55, cy: 70 },
  CA: { d: "M35,85 L70,90 L75,120 L65,165 L40,170 L30,140 L25,100 Z", name: "California", cx: 50, cy: 130 },
  NV: { d: "M70,90 L100,85 L105,145 L75,150 L65,165 L75,120 Z", name: "Nevada", cx: 85, cy: 118 },
  AZ: { d: "M75,150 L105,145 L115,185 L70,190 L65,165 Z", name: "Arizona", cx: 90, cy: 168 },
  ID: { d: "M80,35 L100,30 L105,85 L100,85 L85,75 L80,50 Z", name: "Idaho", cx: 92, cy: 55 },
  MT: { d: "M100,30 L170,25 L175,60 L105,65 L100,45 Z", name: "Montana", cx: 138, cy: 45 },
  WY: { d: "M105,65 L175,60 L180,105 L110,110 Z", name: "Wyoming", cx: 143, cy: 85 },
  UT: { d: "M100,85 L110,85 L110,110 L115,145 L105,145 L100,110 Z", name: "Utah", cx: 107, cy: 115 },
  CO: { d: "M115,110 L185,105 L190,150 L120,155 Z", name: "Colorado", cx: 152, cy: 130 },
  NM: { d: "M115,155 L190,150 L195,200 L120,205 Z", name: "New Mexico", cx: 155, cy: 178 },
  ND: { d: "M175,25 L240,22 L242,55 L175,60 Z", name: "North Dakota", cx: 208, cy: 40 },
  SD: { d: "M175,60 L242,55 L245,95 L180,100 Z", name: "South Dakota", cx: 210, cy: 77 },
  NE: { d: "M180,100 L245,95 L250,130 L185,135 Z", name: "Nebraska", cx: 215, cy: 115 },
  KS: { d: "M185,135 L250,130 L255,170 L190,175 Z", name: "Kansas", cx: 220, cy: 152 },
  OK: { d: "M190,175 L255,170 L260,195 L225,200 L195,195 Z", name: "Oklahoma", cx: 225, cy: 185 },
  TX: { d: "M170,195 L225,200 L260,195 L275,250 L220,270 L165,265 L155,220 Z", name: "Texas", cx: 210, cy: 235 },
  MN: { d: "M242,22 L290,20 L295,75 L250,80 L245,55 Z", name: "Minnesota", cx: 268, cy: 50 },
  IA: { d: "M250,80 L295,75 L300,115 L255,120 Z", name: "Iowa", cx: 275, cy: 97 },
  MO: { d: "M255,120 L300,115 L310,170 L260,175 Z", name: "Missouri", cx: 282, cy: 145 },
  AR: { d: "M260,175 L310,170 L315,210 L265,215 Z", name: "Arkansas", cx: 287, cy: 192 },
  LA: { d: "M265,215 L315,210 L325,250 L280,260 L270,245 Z", name: "Louisiana", cx: 295, cy: 235 },
  WI: { d: "M295,40 L330,35 L340,80 L300,85 Z", name: "Wisconsin", cx: 317, cy: 60 },
  IL: { d: "M305,85 L340,80 L350,145 L310,150 Z", name: "Illinois", cx: 327, cy: 115 },
  MI: { d: "M330,35 L365,30 L375,70 L345,75 L340,55 Z M345,75 L375,70 L380,95 L350,100 Z", name: "Michigan", cx: 360, cy: 65 },
  IN: { d: "M340,95 L365,90 L370,145 L345,150 Z", name: "Indiana", cx: 355, cy: 120 },
  OH: { d: "M365,90 L400,85 L405,140 L370,145 Z", name: "Ohio", cx: 385, cy: 115 },
  KY: { d: "M345,150 L405,140 L410,170 L350,180 Z", name: "Kentucky", cx: 377, cy: 160 },
  TN: { d: "M325,175 L405,165 L410,195 L330,205 Z", name: "Tennessee", cx: 367, cy: 185 },
  MS: { d: "M315,210 L345,205 L350,260 L320,265 Z", name: "Mississippi", cx: 332, cy: 237 },
  AL: { d: "M345,205 L380,200 L385,260 L350,265 Z", name: "Alabama", cx: 365, cy: 232 },
  GA: { d: "M380,200 L420,195 L430,255 L385,260 Z", name: "Georgia", cx: 405, cy: 227 },
  FL: { d: "M390,260 L430,255 L460,290 L435,320 L400,305 L395,275 Z", name: "Florida", cx: 425, cy: 285 },
  SC: { d: "M410,195 L445,188 L455,225 L420,235 Z", name: "South Carolina", cx: 432, cy: 210 },
  NC: { d: "M405,165 L465,155 L475,188 L410,198 Z", name: "North Carolina", cx: 440, cy: 177 },
  VA: { d: "M400,140 L460,130 L470,158 L410,168 Z", name: "Virginia", cx: 435, cy: 150 },
  WV: { d: "M400,120 L425,115 L430,145 L405,150 Z", name: "West Virginia", cx: 415, cy: 133 },
  PA: { d: "M405,85 L460,78 L465,115 L410,122 Z", name: "Pennsylvania", cx: 435, cy: 100 },
  NY: { d: "M420,50 L480,40 L485,78 L430,85 Z", name: "New York", cx: 452, cy: 65 },
  NJ: { d: "M460,90 L475,85 L480,115 L465,120 Z", name: "New Jersey", cx: 470, cy: 102 },
  CT: { d: "M475,70 L495,65 L498,82 L478,85 Z", name: "Connecticut", cx: 486, cy: 75 },
  MA: { d: "M478,55 L510,48 L515,68 L480,72 Z", name: "Massachusetts", cx: 495, cy: 60 },
  VT: { d: "M468,35 L485,32 L488,55 L470,58 Z", name: "Vermont", cx: 478, cy: 45 },
  NH: { d: "M485,28 L500,25 L505,55 L488,58 Z", name: "New Hampshire", cx: 495, cy: 42 },
  ME: { d: "M500,15 L525,10 L530,50 L505,55 Z", name: "Maine", cx: 515, cy: 32 },
};

function getAlertFillColor(high: number, medium: number, low: number): string {
  if (high > 0) return "hsl(0, 75%, 55%)";
  if (medium > 0) return "hsl(35, 85%, 55%)";
  if (low > 0) return "hsl(142, 60%, 45%)";
  return "hsl(220, 30%, 20%)";
}

export function USStatesMap({ legislation }: USStatesMapProps) {
  const stats = aggregateByJurisdiction(legislation, "USA");
  
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
          <svg viewBox="0 0 550 330" className="w-full h-auto">
            <rect x="0" y="0" width="550" height="330" fill="hsl(210, 50%, 15%)" rx="8" />
            
            {Object.entries(statePaths).map(([code, { d, name, cx, cy }]) => {
              const stat = stats.get(code);
              const fillColor = stat ? getAlertFillColor(stat.high, stat.medium, stat.low) : "hsl(220, 25%, 25%)";
              
              return (
                <Tooltip key={code}>
                  <TooltipTrigger asChild>
                    <g className="cursor-pointer transition-all hover:opacity-80">
                      <path d={d} fill={fillColor} stroke="hsl(220, 20%, 35%)" strokeWidth="1" />
                      {stat && stat.total > 0 && (
                        <>
                          <circle cx={cx} cy={cy} r={9} fill="hsl(220, 40%, 8%)" stroke="hsl(210, 40%, 98%)" strokeWidth="1" />
                          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill="hsl(210, 40%, 98%)" fontSize="7" fontWeight="bold">{stat.total}</text>
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
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-risk-high" /><span>High Risk</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-risk-medium" /><span>Medium Risk</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-risk-low" /><span>Low Risk</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{background: "hsl(220, 25%, 25%)"}} /><span>No Alerts</span></div>
        </div>
      </CardContent>
    </Card>
  );
}
