import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InternationalLegislation } from "@/data/mockInternationalLegislation";
import { aggregateByJurisdiction } from "./JurisdictionMapUtils";
import { MapPin } from "lucide-react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

interface CanadaProvincesMapProps {
  legislation: InternationalLegislation[];
}

const geoUrl = "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/canada.geojson";

// Map province names to abbreviations
const provinceNameToAbbr: Record<string, string> = {
  "Alberta": "AB",
  "British Columbia": "BC",
  "Manitoba": "MB",
  "New Brunswick": "NB",
  "Newfoundland and Labrador": "NL",
  "Northwest Territories": "NT",
  "Nova Scotia": "NS",
  "Nunavut": "NU",
  "Ontario": "ON",
  "Prince Edward Island": "PE",
  "Quebec": "QC",
  "Saskatchewan": "SK",
  "Yukon": "YT",
};

function getAlertFillColor(high: number, medium: number, low: number): string {
  if (high > 0) return "#ef4444";
  if (medium > 0) return "#f59e0b";
  if (low > 0) return "#22c55e";
  return "#374151";
}

export function CanadaProvincesMap({ legislation }: CanadaProvincesMapProps) {
  const stats = aggregateByJurisdiction(legislation, "Canada");
  
  const getProvinceStats = (provinceName: string) => {
    const abbr = provinceNameToAbbr[provinceName];
    return abbr ? stats.get(abbr) : null;
  };

  const getProvinceColor = (provinceName: string) => {
    const stat = getProvinceStats(provinceName);
    if (!stat) return "#1f2937";
    return getAlertFillColor(stat.high, stat.medium, stat.low);
  };
  
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
          <div className="w-full" style={{ aspectRatio: "1.4/1" }}>
            <ComposableMap
              projection="geoAzimuthalEqualArea"
              projectionConfig={{
                scale: 500,
                center: [-96, 60],
              }}
              style={{ width: "100%", height: "100%", background: "hsl(210, 50%, 12%)", borderRadius: "8px" }}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const provinceName = geo.properties.name;
                    const stat = getProvinceStats(provinceName);
                    
                    return (
                      <Tooltip key={geo.rsmKey}>
                        <TooltipTrigger asChild>
                          <Geography
                            geography={geo}
                            fill={getProvinceColor(provinceName)}
                            stroke="#334155"
                            strokeWidth={0.5}
                            style={{
                              default: { outline: "none" },
                              hover: { fill: "#3b82f6", outline: "none" },
                              pressed: { fill: "#2563eb", outline: "none" },
                            }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-semibold">{provinceName}</p>
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
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{background: "#1f2937"}} /><span>None</span></div>
        </div>
      </CardContent>
    </Card>
  );
}
