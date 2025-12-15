import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { InternationalLegislation } from "@/data/mockInternationalLegislation";
import { aggregateByJurisdiction, calculateActivityScore, getJurisdictionGradientColor } from "./JurisdictionMapUtils";
import { MapPin, Info } from "lucide-react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

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

export function CanadaProvincesMap({ legislation }: CanadaProvincesMapProps) {
  const stats = aggregateByJurisdiction(legislation, "Canada");
  
  // Calculate max score for gradient normalization
  const maxScore = useMemo(() => {
    let max = 0;
    stats.forEach(s => {
      const score = calculateActivityScore(s.high, s.medium, s.low);
      if (score > max) max = score;
    });
    return max;
  }, [stats]);
  
  const getProvinceStats = (provinceName: string) => {
    const abbr = provinceNameToAbbr[provinceName];
    return abbr ? stats.get(abbr) : null;
  };

  const getProvinceColor = (provinceName: string) => {
    const stat = getProvinceStats(provinceName);
    if (!stat) return "#1f2937";
    return getJurisdictionGradientColor(stat.high, stat.medium, stat.low, maxScore);
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
        
        <div className="flex items-center gap-3 mt-3 justify-center">
          <span className="text-xs text-muted-foreground">Least Activity</span>
          <div 
            className="w-24 h-3 rounded-full" 
            style={{
              background: "linear-gradient(to right, hsl(120, 70%, 45%), hsl(60, 70%, 45%), hsl(0, 75%, 50%))"
            }} 
          />
          <span className="text-xs text-muted-foreground">Most Activity</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-5 w-5">
                <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 text-sm" side="top">
              <div className="space-y-2">
                <h4 className="font-semibold text-xs">Regulatory Activity Index (Weekly)</h4>
                <p className="text-xs text-muted-foreground">
                  High-risk ×3, Medium ×2, Low ×1. Intensity relative to province with most activity.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
}