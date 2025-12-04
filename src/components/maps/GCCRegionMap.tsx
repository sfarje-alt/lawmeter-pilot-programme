import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InternationalLegislation } from "@/data/mockInternationalLegislation";
import { MapPin } from "lucide-react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

interface GCCRegionMapProps {
  legislation: InternationalLegislation[];
}

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Map country names to our jurisdiction names
const gccCountryNames: Record<string, string> = {
  "United Arab Emirates": "UAE",
  "Saudi Arabia": "Saudi Arabia",
  "Kuwait": "Kuwait",
  "Bahrain": "Bahrain",
  "Qatar": "Qatar",
  "Oman": "Oman",
};

const gccCountryList = Object.keys(gccCountryNames);

function getAlertFillColor(high: number, medium: number, low: number): string {
  if (high > 0) return "#ef4444";
  if (medium > 0) return "#f59e0b";
  if (low > 0) return "#22c55e";
  return "#374151";
}

export function GCCRegionMap({ legislation }: GCCRegionMapProps) {
  const gccJurisdictions = ["UAE", "Saudi Arabia", "Kuwait", "Bahrain", "Qatar", "Oman"];
  const stats = new Map<string, { total: number; high: number; medium: number; low: number }>();
  
  legislation.filter(l => gccJurisdictions.includes(l.jurisdiction)).forEach(item => {
    const existing = stats.get(item.jurisdiction) || { total: 0, high: 0, medium: 0, low: 0 };
    existing.total++;
    if (item.riskLevel === "high") existing.high++;
    else if (item.riskLevel === "medium") existing.medium++;
    else existing.low++;
    stats.set(item.jurisdiction, existing);
  });

  const getCountryStats = (countryName: string) => {
    const jurisdiction = gccCountryNames[countryName];
    return jurisdiction ? stats.get(jurisdiction) : null;
  };

  const getCountryColor = (countryName: string) => {
    if (!gccCountryList.includes(countryName)) return "#1f2937";
    const stat = getCountryStats(countryName);
    if (!stat) return "#374151";
    return getAlertFillColor(stat.high, stat.medium, stat.low);
  };
  
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
          <div className="w-full max-w-md mx-auto" style={{ aspectRatio: "1.3/1" }}>
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 800,
                center: [50, 24],
              }}
              style={{ width: "100%", height: "100%", background: "hsl(210, 50%, 12%)", borderRadius: "8px" }}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const countryName = geo.properties.name;
                    const isGCC = gccCountryList.includes(countryName);
                    const stat = getCountryStats(countryName);
                    
                    // Only show GCC countries and immediate neighbors for context
                    const neighborsToShow = ["Iran", "Iraq", "Yemen", "Jordan", "Egypt", "Pakistan", "Afghanistan"];
                    const shouldShow = isGCC || neighborsToShow.includes(countryName);
                    
                    if (!shouldShow) return null;
                    
                    return (
                      <Tooltip key={geo.rsmKey}>
                        <TooltipTrigger asChild>
                          <Geography
                            geography={geo}
                            fill={getCountryColor(countryName)}
                            stroke="#334155"
                            strokeWidth={0.5}
                            style={{
                              default: { outline: "none" },
                              hover: { fill: isGCC ? "#3b82f6" : getCountryColor(countryName), outline: "none" },
                              pressed: { fill: isGCC ? "#2563eb" : getCountryColor(countryName), outline: "none" },
                            }}
                          />
                        </TooltipTrigger>
                        {isGCC && (
                          <TooltipContent>
                            <p className="font-semibold">{gccCountryNames[countryName] || countryName}</p>
                            {stat ? (
                              <div className="flex gap-2 mt-1">
                                <Badge variant="destructive" className="text-xs">{stat.high} High</Badge>
                                <Badge className="bg-risk-medium text-xs">{stat.medium} Med</Badge>
                                <Badge className="bg-risk-low text-foreground text-xs">{stat.low} Low</Badge>
                              </div>
                            ) : <p className="text-muted-foreground">No alerts</p>}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
          </div>
        </TooltipProvider>
        
        <div className="flex gap-4 mt-4 justify-center text-xs">
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{background: "#ef4444"}} /><span>High</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{background: "#f59e0b"}} /><span>Medium</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{background: "#22c55e"}} /><span>Low</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{background: "#374151"}} /><span>None</span></div>
        </div>
      </CardContent>
    </Card>
  );
}
