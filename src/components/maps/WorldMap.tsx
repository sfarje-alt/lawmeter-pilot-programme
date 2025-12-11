import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InternationalLegislation } from "@/data/mockInternationalLegislation";
import { Globe, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldMapProps {
  legislation: InternationalLegislation[];
  onSelectRegion?: (region: string) => void;
}

const countryNameToJurisdiction: Record<string, string> = {
  "United States of America": "usa",
  "United States": "usa",
  "Canada": "canada",
  "Japan": "japan",
  "South Korea": "korea",
  "Korea": "korea",
  "Taiwan": "taiwan",
  "United Arab Emirates": "gcc",
  "Saudi Arabia": "gcc",
  "Kuwait": "gcc",
  "Bahrain": "gcc",
  "Qatar": "gcc",
  "Oman": "gcc",
  "Costa Rica": "costa-rica",
  "Germany": "eu", "Austria": "eu", "Belgium": "eu", "Bulgaria": "eu", 
  "Croatia": "eu", "Cyprus": "eu", "Czechia": "eu", "Czech Republic": "eu",
  "Denmark": "eu", "Estonia": "eu", "Finland": "eu", "France": "eu", 
  "Greece": "eu", "Hungary": "eu", "Ireland": "eu", "Italy": "eu", 
  "Latvia": "eu", "Lithuania": "eu", "Luxembourg": "eu", "Malta": "eu", 
  "Netherlands": "eu", "Poland": "eu", "Portugal": "eu", "Romania": "eu", 
  "Slovakia": "eu", "Slovenia": "eu", "Spain": "eu", "Sweden": "eu",
};

const jurisdictionToDataKey: Record<string, string[]> = {
  usa: ["USA"],
  canada: ["Canada"],
  japan: ["Japan"],
  korea: ["Korea"],
  taiwan: ["Taiwan"],
  gcc: ["UAE", "Saudi Arabia", "Kuwait", "Bahrain", "Qatar", "Oman"],
  "costa-rica": ["Costa Rica"],
  eu: ["EU"],
};

function getAlertFillColor(high: number, medium: number, low: number): string {
  if (high > 0) return "#ef4444";
  if (medium > 0) return "#f59e0b";
  if (low > 0) return "#22c55e";
  return "#374151";
}

export function WorldMap({ legislation, onSelectRegion }: WorldMapProps) {
  const [position, setPosition] = useState({ coordinates: [20, 30] as [number, number], zoom: 1 });
  
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

  const getJurisdictionStats = (jurisdiction: string) => {
    const dataKeys = jurisdictionToDataKey[jurisdiction] || [];
    let total = 0, high = 0, medium = 0, low = 0;
    dataKeys.forEach(key => {
      const s = stats.get(key);
      if (s) { total += s.total; high += s.high; medium += s.medium; low += s.low; }
    });
    return total > 0 ? { total, high, medium, low } : null;
  };

  const handleClick = (countryName: string) => {
    const jurisdiction = countryNameToJurisdiction[countryName];
    if (jurisdiction && onSelectRegion) {
      onSelectRegion(jurisdiction);
    }
  };

  const getCountryColor = (countryName: string) => {
    const jurisdiction = countryNameToJurisdiction[countryName];
    if (!jurisdiction) return "#1f2937";
    const jurisdictionStats = getJurisdictionStats(jurisdiction);
    if (!jurisdictionStats) return "#374151";
    return getAlertFillColor(jurisdictionStats.high, jurisdictionStats.medium, jurisdictionStats.low);
  };

  const handleZoomIn = useCallback(() => {
    if (position.zoom >= 4) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom * 1.5 }));
  }, [position.zoom]);

  const handleZoomOut = useCallback(() => {
    if (position.zoom <= 1) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom / 1.5 }));
  }, [position.zoom]);

  const handleReset = useCallback(() => {
    setPosition({ coordinates: [20, 30], zoom: 1 });
  }, []);

  const handleMoveEnd = useCallback((position: { coordinates: [number, number]; zoom: number }) => {
    setPosition(position);
  }, []);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Tracked Jurisdictions
          <span className="text-xs text-muted-foreground ml-2">(Click a country to navigate, scroll to zoom)</span>
        </CardTitle>
        <div className="flex gap-1 ml-auto">
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleZoomIn} disabled={position.zoom >= 4}>
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleZoomOut} disabled={position.zoom <= 1}>
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleReset}>
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <TooltipProvider>
          <div className="w-full relative" style={{ aspectRatio: "2.2/1" }}>
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 130, center: [20, 35] }}
              style={{ width: "100%", height: "100%", background: "hsl(210, 50%, 12%)", borderRadius: "8px" }}
            >
              <ZoomableGroup
                zoom={position.zoom}
                center={position.coordinates}
                onMoveEnd={handleMoveEnd}
                minZoom={1}
                maxZoom={4}
              >
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const countryName = geo.properties.name;
                      const jurisdiction = countryNameToJurisdiction[countryName];
                      const isClickable = !!jurisdiction;
                      const jurisdictionStats = jurisdiction ? getJurisdictionStats(jurisdiction) : null;
                      
                      return (
                        <Tooltip key={geo.rsmKey}>
                          <TooltipTrigger asChild>
                            <Geography
                              geography={geo}
                              fill={getCountryColor(countryName)}
                              stroke="#334155"
                              strokeWidth={0.5}
                              style={{
                                default: { outline: "none", cursor: isClickable ? "pointer" : "default" },
                                hover: { 
                                  fill: isClickable ? "#3b82f6" : getCountryColor(countryName), 
                                  outline: "none", 
                                  cursor: isClickable ? "pointer" : "default" 
                                },
                                pressed: { fill: isClickable ? "#2563eb" : getCountryColor(countryName), outline: "none" },
                              }}
                              onClick={() => isClickable && handleClick(countryName)}
                            />
                          </TooltipTrigger>
                          {isClickable && (
                            <TooltipContent>
                              <p className="font-semibold">{countryName}</p>
                              {jurisdictionStats ? (
                                <div className="space-y-1">
                                  <p className="text-xs text-muted-foreground">Total: {jurisdictionStats.total} alerts</p>
                                  <div className="flex gap-2">
                                    <Badge variant="destructive" className="text-xs">{jurisdictionStats.high} High</Badge>
                                    <Badge className="bg-risk-medium text-xs">{jurisdictionStats.medium} Med</Badge>
                                    <Badge className="bg-risk-low text-foreground text-xs">{jurisdictionStats.low} Low</Badge>
                                  </div>
                                  <p className="text-xs text-primary mt-1">Click to view</p>
                                </div>
                              ) : <p className="text-xs text-muted-foreground">Click to view</p>}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      );
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
          </div>
        </TooltipProvider>
        
        <div className="flex gap-4 mt-2 justify-center text-xs flex-wrap">
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{background: "#ef4444"}} /><span>High Risk</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{background: "#f59e0b"}} /><span>Medium Risk</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{background: "#22c55e"}} /><span>Low Risk</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{background: "#374151"}} /><span>Tracked</span></div>
        </div>
      </CardContent>
    </Card>
  );
}
