import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InternationalLegislation } from "@/data/mockInternationalLegislation";
import { Globe } from "lucide-react";

interface WorldMapProps {
  legislation: InternationalLegislation[];
}

// Simplified world country paths (stylized but recognizable shapes)
const countryPaths: Record<string, { d: string; name: string; cx: number; cy: number }> = {
  USA: {
    d: "M45,85 L120,85 L125,95 L130,90 L135,95 L120,110 L100,115 L80,110 L45,105 Z M20,90 L35,85 L40,95 L30,100 Z",
    name: "United States",
    cx: 85, cy: 98
  },
  Canada: {
    d: "M45,40 L140,40 L145,55 L140,70 L120,75 L100,70 L80,75 L60,70 L45,75 L40,60 Z",
    name: "Canada",
    cx: 92, cy: 57
  },
  "Costa Rica": {
    d: "M95,130 L102,128 L105,135 L100,140 L93,137 Z",
    name: "Costa Rica",
    cx: 99, cy: 134
  },
  EU: {
    d: "M245,60 L280,55 L290,65 L285,85 L275,95 L260,95 L250,85 L245,70 Z",
    name: "European Union",
    cx: 267, cy: 75
  },
  Japan: {
    d: "M390,85 L400,80 L405,90 L400,105 L392,100 L388,90 Z",
    name: "Japan",
    cx: 396, cy: 92
  },
  Korea: {
    d: "M375,90 L382,85 L387,95 L382,105 L375,100 Z",
    name: "South Korea",
    cx: 380, cy: 95
  },
  Taiwan: {
    d: "M382,115 L388,112 L390,122 L385,128 L380,122 Z",
    name: "Taiwan",
    cx: 385, cy: 120
  },
  UAE: {
    d: "M310,115 L325,112 L330,120 L325,128 L312,125 Z",
    name: "UAE",
    cx: 320, cy: 120
  },
  "Saudi Arabia": {
    d: "M285,100 L320,95 L330,110 L320,135 L295,140 L280,125 L280,110 Z",
    name: "Saudi Arabia",
    cx: 302, cy: 118
  },
  Kuwait: {
    d: "M305,98 L312,95 L315,102 L310,105 Z",
    name: "Kuwait",
    cx: 310, cy: 100
  },
  Qatar: {
    d: "M318,108 L323,105 L325,115 L320,118 Z",
    name: "Qatar",
    cx: 321, cy: 111
  },
  Bahrain: {
    d: "M314,105 L318,103 L319,108 L315,110 Z",
    name: "Bahrain",
    cx: 316, cy: 106
  },
  Oman: {
    d: "M325,120 L340,115 L345,135 L335,145 L325,135 Z",
    name: "Oman",
    cx: 335, cy: 130
  },
};

function getAlertFillColor(high: number, medium: number, low: number): string {
  if (high > 0) return "hsl(0, 75%, 55%)";
  if (medium > 0) return "hsl(35, 85%, 55%)";
  if (low > 0) return "hsl(142, 60%, 45%)";
  return "hsl(220, 30%, 20%)";
}

export function WorldMap({ legislation }: WorldMapProps) {
  const stats = new Map<string, { total: number; high: number; medium: number; low: number }>();
  
  legislation.forEach(item => {
    const key = item.jurisdiction;
    const existing = stats.get(key) || { total: 0, high: 0, medium: 0, low: 0 };
    existing.total++;
    if (item.riskLevel === "high") existing.high++;
    else if (item.riskLevel === "medium") existing.medium++;
    else existing.low++;
    stats.set(key, existing);
  });
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Globe className="w-4 h-4" />
          National / Federal Alert Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <svg viewBox="0 0 450 200" className="w-full h-auto">
            {/* Ocean background */}
            <rect x="0" y="0" width="450" height="200" fill="hsl(210, 50%, 15%)" rx="8" />
            
            {/* Grid lines for map feel */}
            {[40, 80, 120, 160].map(y => (
              <line key={`h${y}`} x1="0" y1={y} x2="450" y2={y} stroke="hsl(210, 30%, 20%)" strokeWidth="0.5" strokeDasharray="4,4" />
            ))}
            {[90, 180, 270, 360].map(x => (
              <line key={`v${x}`} x1={x} y1="0" x2={x} y2="200" stroke="hsl(210, 30%, 20%)" strokeWidth="0.5" strokeDasharray="4,4" />
            ))}
            
            {/* Countries */}
            {Object.entries(countryPaths).map(([code, { d, name, cx, cy }]) => {
              const stat = stats.get(code);
              const fillColor = stat ? getAlertFillColor(stat.high, stat.medium, stat.low) : "hsl(220, 25%, 25%)";
              
              return (
                <Tooltip key={code}>
                  <TooltipTrigger asChild>
                    <g className="cursor-pointer transition-all hover:opacity-80">
                      <path
                        d={d}
                        fill={fillColor}
                        stroke="hsl(220, 20%, 35%)"
                        strokeWidth="1"
                        className="transition-all"
                      />
                      {stat && stat.total > 0 && (
                        <>
                          <circle cx={cx} cy={cy} r={10} fill="hsl(220, 40%, 8%)" stroke="hsl(210, 40%, 98%)" strokeWidth="1.5" />
                          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill="hsl(210, 40%, 98%)" fontSize="8" fontWeight="bold">
                            {stat.total}
                          </text>
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
        
        <div className="flex gap-4 mt-4 justify-center text-xs flex-wrap">
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-risk-high" /><span>High Risk</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-risk-medium" /><span>Medium Risk</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-risk-low" /><span>Low Risk</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{background: "hsl(220, 25%, 25%)"}} /><span>No Alerts</span></div>
        </div>
      </CardContent>
    </Card>
  );
}
