import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InternationalLegislation } from "@/data/mockInternationalLegislation";
import { MapPin } from "lucide-react";

interface GCCRegionMapProps {
  legislation: InternationalLegislation[];
}

const gccPositions: Record<string, { x: number; y: number; name: string; width?: number; height?: number }> = {
  Kuwait: { x: 1, y: 0, name: "Kuwait" },
  Bahrain: { x: 2, y: 1, name: "Bahrain" },
  Qatar: { x: 2, y: 2, name: "Qatar" },
  UAE: { x: 2, y: 3, name: "United Arab Emirates", width: 1.5 },
  Oman: { x: 3.5, y: 2, name: "Oman", height: 2 },
  "Saudi Arabia": { x: 0, y: 1, name: "Saudi Arabia", width: 2, height: 3 },
};

function getAlertFillColor(high: number, medium: number, low: number): string {
  if (high > 0) return "hsl(0, 75%, 55%)";
  if (medium > 0) return "hsl(35, 85%, 55%)";
  if (low > 0) return "hsl(142, 60%, 45%)";
  return "hsl(220, 30%, 15%)";
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
  
  const cellSize = 60;
  const cellHeight = 50;
  const padding = 6;
  
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
          <svg viewBox="-10 -10 320 260" className="w-full h-auto max-w-[300px] mx-auto">
            {Object.entries(gccPositions).map(([code, pos]) => {
              const stat = stats.get(code);
              const fillColor = stat ? getAlertFillColor(stat.high, stat.medium, stat.low) : "hsl(220, 30%, 15%)";
              const width = (pos.width || 1) * cellSize + (pos.width ? (pos.width - 1) * padding : 0);
              const height = (pos.height || 1) * cellHeight + (pos.height ? (pos.height - 1) * padding : 0);
              
              return (
                <Tooltip key={code}>
                  <TooltipTrigger asChild>
                    <g className="cursor-pointer hover:opacity-80 transition-opacity">
                      <rect x={pos.x * (cellSize + padding)} y={pos.y * (cellHeight + padding)} width={width} height={height} rx={6} fill={fillColor} stroke="hsl(220, 40%, 8%)" strokeWidth={2} />
                      <text x={pos.x * (cellSize + padding) + width / 2} y={pos.y * (cellHeight + padding) + height / 2} textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-[10px] font-medium">
                        {code.length > 6 ? code.split(" ").map(w => w[0]).join("") : code}
                      </text>
                      {stat && stat.total > 0 && (
                        <>
                          <circle cx={pos.x * (cellSize + padding) + width - 10} cy={pos.y * (cellHeight + padding) + 10} r={12} className="fill-background stroke-foreground" strokeWidth={1} />
                          <text x={pos.x * (cellSize + padding) + width - 10} y={pos.y * (cellHeight + padding) + 10} textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-[10px] font-bold">{stat.total}</text>
                        </>
                      )}
                    </g>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-semibold">{pos.name}</p>
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
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-muted/30" /><span>None</span></div>
        </div>
      </CardContent>
    </Card>
  );
}
