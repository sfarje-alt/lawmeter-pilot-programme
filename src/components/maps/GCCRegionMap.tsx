import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InternationalLegislation } from "@/data/mockInternationalLegislation";
import { MapPin } from "lucide-react";

interface GCCRegionMapProps {
  legislation: InternationalLegislation[];
}

// Simplified GCC region paths (Arabian Peninsula)
const gccPaths: Record<string, { d: string; name: string; cx: number; cy: number }> = {
  "Saudi Arabia": { 
    d: "M30,50 L120,30 L180,60 L200,120 L180,180 L120,200 L60,180 L20,130 L15,80 Z", 
    name: "Saudi Arabia", 
    cx: 105, cy: 115 
  },
  Kuwait: { 
    d: "M145,25 L165,20 L175,40 L160,50 L145,45 Z", 
    name: "Kuwait", 
    cx: 160, cy: 35 
  },
  Bahrain: { 
    d: "M185,58 L195,55 L200,70 L190,75 Z", 
    name: "Bahrain", 
    cx: 192, cy: 65 
  },
  Qatar: { 
    d: "M195,75 L210,70 L215,95 L200,100 Z", 
    name: "Qatar", 
    cx: 205, cy: 85 
  },
  UAE: { 
    d: "M200,100 L250,90 L265,130 L240,145 L205,140 Z", 
    name: "United Arab Emirates", 
    cx: 230, cy: 118 
  },
  Oman: { 
    d: "M240,145 L265,130 L290,150 L280,200 L230,210 L200,180 L205,155 Z", 
    name: "Oman", 
    cx: 245, cy: 175 
  },
};

function getAlertFillColor(high: number, medium: number, low: number): string {
  if (high > 0) return "hsl(0, 75%, 55%)";
  if (medium > 0) return "hsl(35, 85%, 55%)";
  if (low > 0) return "hsl(142, 60%, 45%)";
  return "hsl(220, 30%, 20%)";
}

export function GCCRegionMap({ legislation }: GCCRegionMapProps) {
  const gccCountries = ["UAE", "Saudi Arabia", "Kuwait", "Bahrain", "Qatar", "Oman"];
  const stats = new Map<string, { total: number; high: number; medium: number; low: number }>();
  
  legislation.filter(l => gccCountries.includes(l.jurisdiction)).forEach(item => {
    const existing = stats.get(item.jurisdiction) || { total: 0, high: 0, medium: 0, low: 0 };
    existing.total++;
    if (item.riskLevel === "high") existing.high++;
    else if (item.riskLevel === "medium") existing.medium++;
    else existing.low++;
    stats.set(item.jurisdiction, existing);
  });
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          GCC Region Alert Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <svg viewBox="0 0 320 240" className="w-full h-auto max-w-[350px] mx-auto">
            {/* Persian Gulf water */}
            <rect x="0" y="0" width="320" height="240" fill="hsl(210, 50%, 15%)" rx="8" />
            <path d="M140,20 L200,15 L220,50 L210,80 L195,55 L180,60 L165,50 L145,25 Z" fill="hsl(200, 60%, 25%)" opacity="0.5" />
            
            {Object.entries(gccPaths).map(([code, { d, name, cx, cy }]) => {
              const stat = stats.get(code);
              const fillColor = stat ? getAlertFillColor(stat.high, stat.medium, stat.low) : "hsl(220, 25%, 25%)";
              
              return (
                <Tooltip key={code}>
                  <TooltipTrigger asChild>
                    <g className="cursor-pointer transition-all hover:opacity-80">
                      <path d={d} fill={fillColor} stroke="hsl(220, 20%, 35%)" strokeWidth="1.5" />
                      {stat && stat.total > 0 && (
                        <>
                          <circle cx={cx} cy={cy} r={12} fill="hsl(220, 40%, 8%)" stroke="hsl(210, 40%, 98%)" strokeWidth="1.5" />
                          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill="hsl(210, 40%, 98%)" fontSize="10" fontWeight="bold">{stat.total}</text>
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
