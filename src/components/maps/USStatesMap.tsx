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

interface USStatesMapProps {
  legislation: InternationalLegislation[];
}

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// Map state names to abbreviations
const stateNameToAbbr: Record<string, string> = {
  "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR", "California": "CA",
  "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE", "Florida": "FL", "Georgia": "GA",
  "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA",
  "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
  "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS", "Missouri": "MO",
  "Montana": "MT", "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ",
  "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH",
  "Oklahoma": "OK", "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
  "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT", "Vermont": "VT",
  "Virginia": "VA", "Washington": "WA", "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY",
  "District of Columbia": "DC"
};

export function USStatesMap({ legislation }: USStatesMapProps) {
  const stats = aggregateByJurisdiction(legislation, "USA");
  
  // Calculate max score for gradient normalization
  const maxScore = useMemo(() => {
    let max = 0;
    stats.forEach(s => {
      const score = calculateActivityScore(s.high, s.medium, s.low);
      if (score > max) max = score;
    });
    return max;
  }, [stats]);
  
  const getStateStats = (stateName: string) => {
    const abbr = stateNameToAbbr[stateName];
    return abbr ? stats.get(abbr) : null;
  };

  const getStateColor = (stateName: string) => {
    const stat = getStateStats(stateName);
    if (!stat) return "#1f2937";
    return getJurisdictionGradientColor(stat.high, stat.medium, stat.low, maxScore);
  };
  
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
          <div className="w-full" style={{ aspectRatio: "1.6/1" }}>
            <ComposableMap
              projection="geoAlbersUsa"
              projectionConfig={{ scale: 1000 }}
              style={{ width: "100%", height: "100%", background: "hsl(210, 50%, 12%)", borderRadius: "8px" }}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const stateName = geo.properties.name;
                    const stat = getStateStats(stateName);
                    
                    return (
                      <Tooltip key={geo.rsmKey}>
                        <TooltipTrigger asChild>
                          <Geography
                            geography={geo}
                            fill={getStateColor(stateName)}
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
                          <p className="font-semibold">{stateName}</p>
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
                  High-risk ×3, Medium ×2, Low ×1. Intensity relative to state with most activity.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
}