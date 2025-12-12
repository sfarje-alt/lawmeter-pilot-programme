import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InternationalLegislation } from "@/data/mockInternationalLegislation";
import { Globe, ZoomIn, ZoomOut, RotateCcw, ArrowLeft } from "lucide-react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";

// TopoJSON URLs for different map views
const worldGeoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const usStatesGeoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";
const canadaProvincesUrl = "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/canada.geojson";

interface WorldMapProps {
  legislation: InternationalLegislation[];
  onSelectRegion?: (region: string) => void;
  onSelectSubJurisdiction?: (jurisdiction: string, subJurisdiction: string) => void;
}

// Country name to jurisdiction mapping (including Peru and all tracked jurisdictions)
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
  "Peru": "peru",
  // EU member states - all map to EU as single unit
  "Germany": "eu", "Austria": "eu", "Belgium": "eu", "Bulgaria": "eu", 
  "Croatia": "eu", "Cyprus": "eu", "Czechia": "eu", "Czech Republic": "eu",
  "Denmark": "eu", "Estonia": "eu", "Finland": "eu", "France": "eu", 
  "Greece": "eu", "Hungary": "eu", "Ireland": "eu", "Italy": "eu", 
  "Latvia": "eu", "Lithuania": "eu", "Luxembourg": "eu", "Malta": "eu", 
  "Netherlands": "eu", "Poland": "eu", "Portugal": "eu", "Romania": "eu", 
  "Slovakia": "eu", "Slovenia": "eu", "Spain": "eu", "Sweden": "eu",
};

// EU member state names for unified coloring
const euMemberStates = new Set([
  "Germany", "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czechia", 
  "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Greece", "Hungary", 
  "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands", 
  "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden"
]);

// Jurisdictions that support subnational zoom
const zoomableJurisdictions = new Set(["usa", "canada"]);

// Map jurisdiction data keys for stats aggregation (matches jurisdiction values in mock data)
const jurisdictionToDataKey: Record<string, string[]> = {
  usa: ["USA", "usa"],
  canada: ["Canada", "canada"],
  japan: ["Japan", "japan"],
  korea: ["Korea", "korea"],
  taiwan: ["Taiwan", "taiwan"],
  gcc: ["UAE", "uae", "Saudi Arabia", "saudi", "Kuwait", "kuwait", "Bahrain", "bahrain", "Qatar", "qatar", "Oman", "oman", "GCC", "gcc"],
  "costa-rica": ["Costa Rica", "costa-rica", "CR"],
  peru: ["Peru", "peru"],
  eu: ["EU", "eu"],
};

// US state abbreviation to name mapping
const usStateNameToAbbr: Record<string, string> = {
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
  "District of Columbia": "DC", "Puerto Rico": "PR"
};

// Canada province abbreviation mapping
const canadaProvinceToAbbr: Record<string, string> = {
  "Ontario": "ON", "Quebec": "QC", "British Columbia": "BC", "Alberta": "AB",
  "Manitoba": "MB", "Saskatchewan": "SK", "Nova Scotia": "NS", "New Brunswick": "NB",
  "Newfoundland and Labrador": "NL", "Prince Edward Island": "PE",
  "Northwest Territories": "NT", "Yukon": "YT", "Nunavut": "NU"
};

// Zoom centers for each jurisdiction
const jurisdictionZoomCenters: Record<string, { center: [number, number]; zoom: number }> = {
  usa: { center: [-98, 39], zoom: 3.5 },
  canada: { center: [-100, 60], zoom: 2.5 },
};

function getAlertFillColor(high: number, medium: number, low: number): string {
  if (high > 0) return "hsl(0, 84%, 60%)"; // risk-high
  if (medium > 0) return "hsl(38, 92%, 50%)"; // risk-medium
  if (low > 0) return "hsl(142, 71%, 45%)"; // risk-low
  return "hsl(215, 14%, 34%)"; // muted/tracked
}

type MapView = "world" | "usa-states" | "canada-provinces";

export function WorldMap({ legislation, onSelectRegion, onSelectSubJurisdiction }: WorldMapProps) {
  const [position, setPosition] = useState({ coordinates: [20, 30] as [number, number], zoom: 1 });
  const [currentView, setCurrentView] = useState<MapView>("world");
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string | null>(null);
  
  // Aggregate stats by jurisdiction
  const stats = useMemo(() => {
    const map = new Map<string, { total: number; high: number; medium: number; low: number }>();
    legislation.forEach(item => {
      const key = item.jurisdiction;
      const existing = map.get(key) || { total: 0, high: 0, medium: 0, low: 0 };
      existing.total++;
      if (item.riskLevel === "high") existing.high++;
      else if (item.riskLevel === "medium") existing.medium++;
      else existing.low++;
      map.set(key, existing);
    });
    return map;
  }, [legislation]);

  // Aggregate stats by sub-jurisdiction (state/province)
  const subJurisdictionStats = useMemo(() => {
    const map = new Map<string, { total: number; high: number; medium: number; low: number }>();
    legislation.forEach(item => {
      if (item.subJurisdiction) {
        const key = item.subJurisdiction;
        const existing = map.get(key) || { total: 0, high: 0, medium: 0, low: 0 };
        existing.total++;
        if (item.riskLevel === "high") existing.high++;
        else if (item.riskLevel === "medium") existing.medium++;
        else existing.low++;
        map.set(key, existing);
      }
    });
    return map;
  }, [legislation]);

  const getJurisdictionStats = useCallback((jurisdiction: string) => {
    const dataKeys = jurisdictionToDataKey[jurisdiction] || [];
    let total = 0, high = 0, medium = 0, low = 0;
    dataKeys.forEach(key => {
      const s = stats.get(key);
      if (s) { total += s.total; high += s.high; medium += s.medium; low += s.low; }
    });
    return total > 0 ? { total, high, medium, low } : null;
  }, [stats]);

  const handleCountryClick = useCallback((countryName: string) => {
    const jurisdiction = countryNameToJurisdiction[countryName];
    if (!jurisdiction) return;
    
    // Check if this jurisdiction supports subnational zoom
    if (zoomableJurisdictions.has(jurisdiction)) {
      setSelectedJurisdiction(jurisdiction);
      if (jurisdiction === "usa") {
        setCurrentView("usa-states");
        setPosition({ coordinates: [-98, 39], zoom: 1 });
      } else if (jurisdiction === "canada") {
        setCurrentView("canada-provinces");
        setPosition({ coordinates: [-100, 60], zoom: 1 });
      }
    } else {
      // Direct navigation for non-zoomable jurisdictions
      if (onSelectRegion) {
        onSelectRegion(jurisdiction);
      }
    }
  }, [onSelectRegion]);

  const handleSubJurisdictionClick = useCallback((name: string) => {
    if (!selectedJurisdiction) return;
    
    let abbr = name;
    if (selectedJurisdiction === "usa") {
      abbr = usStateNameToAbbr[name] || name;
    } else if (selectedJurisdiction === "canada") {
      abbr = canadaProvinceToAbbr[name] || name;
    }
    
    if (onSelectSubJurisdiction) {
      onSelectSubJurisdiction(selectedJurisdiction, abbr);
    }
  }, [selectedJurisdiction, onSelectSubJurisdiction]);

  const handleBackToWorld = useCallback(() => {
    setCurrentView("world");
    setSelectedJurisdiction(null);
    setPosition({ coordinates: [20, 30], zoom: 1 });
  }, []);

  const getCountryColor = useCallback((countryName: string) => {
    const jurisdiction = countryNameToJurisdiction[countryName];
    if (!jurisdiction) return "hsl(215, 28%, 17%)"; // dark bg for non-tracked
    const jurisdictionStats = getJurisdictionStats(jurisdiction);
    if (!jurisdictionStats) return "hsl(215, 14%, 34%)"; // tracked but no alerts
    return getAlertFillColor(jurisdictionStats.high, jurisdictionStats.medium, jurisdictionStats.low);
  }, [getJurisdictionStats]);

  const getSubJurisdictionColor = useCallback((name: string) => {
    let abbr = name;
    if (selectedJurisdiction === "usa") {
      abbr = usStateNameToAbbr[name] || name;
    } else if (selectedJurisdiction === "canada") {
      abbr = canadaProvinceToAbbr[name] || name;
    }
    
    const subStats = subJurisdictionStats.get(abbr);
    if (!subStats) return "hsl(215, 14%, 34%)"; // tracked but no alerts
    return getAlertFillColor(subStats.high, subStats.medium, subStats.low);
  }, [selectedJurisdiction, subJurisdictionStats]);

  const handleZoomIn = useCallback(() => {
    if (position.zoom >= 8) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom * 1.5 }));
  }, [position.zoom]);

  const handleZoomOut = useCallback(() => {
    if (position.zoom <= 1) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom / 1.5 }));
  }, [position.zoom]);

  const handleReset = useCallback(() => {
    if (currentView === "world") {
      setPosition({ coordinates: [20, 30], zoom: 1 });
    } else if (currentView === "usa-states") {
      setPosition({ coordinates: [-98, 39], zoom: 1 });
    } else if (currentView === "canada-provinces") {
      setPosition({ coordinates: [-100, 60], zoom: 1 });
    }
  }, [currentView]);

  const handleMoveEnd = useCallback((pos: { coordinates: [number, number]; zoom: number }) => {
    setPosition(pos);
  }, []);

  // Get current geo URL and projection config based on view
  const getMapConfig = () => {
    switch (currentView) {
      case "usa-states":
        return {
          geoUrl: usStatesGeoUrl,
          projection: "geoAlbersUsa" as const,
          projectionConfig: { scale: 1000 },
          center: [-98, 39] as [number, number],
        };
      case "canada-provinces":
        return {
          geoUrl: canadaProvincesUrl,
          projection: "geoMercator" as const,
          projectionConfig: { scale: 400, center: [-95, 60] as [number, number] },
          center: [-100, 60] as [number, number],
        };
      default:
        return {
          geoUrl: worldGeoUrl,
          projection: "geoMercator" as const,
          projectionConfig: { scale: 130, center: [20, 35] as [number, number] },
          center: [20, 30] as [number, number],
        };
    }
  };

  const mapConfig = getMapConfig();

  const getViewTitle = () => {
    switch (currentView) {
      case "usa-states": return "United States - Select a State";
      case "canada-provinces": return "Canada - Select a Province";
      default: return "Tracked Jurisdictions";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            {currentView !== "world" && (
              <Button variant="ghost" size="icon" className="h-6 w-6 mr-1" onClick={handleBackToWorld}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <Globe className="w-4 h-4" />
            {getViewTitle()}
            {currentView === "world" && (
              <span className="text-xs text-muted-foreground ml-2">(Click a country to navigate)</span>
            )}
          </CardTitle>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleZoomIn} disabled={position.zoom >= 8}>
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleZoomOut} disabled={position.zoom <= 1}>
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleReset}>
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <TooltipProvider>
          <div className="w-full relative" style={{ aspectRatio: "2.2/1" }}>
            {currentView === "world" ? (
              <ComposableMap
                projection={mapConfig.projection}
                projectionConfig={mapConfig.projectionConfig}
                style={{ width: "100%", height: "100%", background: "hsl(210, 50%, 12%)", borderRadius: "8px" }}
              >
                <ZoomableGroup
                  zoom={position.zoom}
                  center={position.coordinates}
                  onMoveEnd={handleMoveEnd}
                  minZoom={1}
                  maxZoom={8}
                >
                  <Geographies geography={mapConfig.geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const countryName = geo.properties.name;
                        const jurisdiction = countryNameToJurisdiction[countryName];
                        const isClickable = !!jurisdiction;
                        const isEU = euMemberStates.has(countryName);
                        const displayName = isEU ? "European Union" : countryName;
                        const jurisdictionStats = jurisdiction ? getJurisdictionStats(jurisdiction) : null;
                        const canZoom = jurisdiction && zoomableJurisdictions.has(jurisdiction);
                        
                        return (
                          <Tooltip key={geo.rsmKey}>
                            <TooltipTrigger asChild>
                              <Geography
                                geography={geo}
                                fill={getCountryColor(countryName)}
                                stroke="hsl(215, 25%, 27%)"
                                strokeWidth={0.5}
                                style={{
                                  default: { outline: "none", cursor: isClickable ? "pointer" : "default" },
                                  hover: { 
                                    fill: isClickable ? "hsl(217, 91%, 60%)" : getCountryColor(countryName), 
                                    outline: "none", 
                                    cursor: isClickable ? "pointer" : "default" 
                                  },
                                  pressed: { fill: isClickable ? "hsl(217, 91%, 50%)" : getCountryColor(countryName), outline: "none" },
                                }}
                                onClick={() => isClickable && handleCountryClick(countryName)}
                              />
                            </TooltipTrigger>
                            {isClickable && (
                              <TooltipContent>
                                <p className="font-semibold">{displayName}</p>
                                {jurisdictionStats ? (
                                  <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Total: {jurisdictionStats.total} alerts</p>
                                    <div className="flex gap-2">
                                      <Badge variant="destructive" className="text-xs">{jurisdictionStats.high} High</Badge>
                                      <Badge className="bg-risk-medium text-xs">{jurisdictionStats.medium} Med</Badge>
                                      <Badge className="bg-risk-low text-foreground text-xs">{jurisdictionStats.low} Low</Badge>
                                    </div>
                                    <p className="text-xs text-primary mt-1">
                                      {canZoom ? "Click to zoom to states/provinces" : "Click to view"}
                                    </p>
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
            ) : currentView === "usa-states" ? (
              <ComposableMap
                projection="geoAlbersUsa"
                projectionConfig={{ scale: 1000 }}
                style={{ width: "100%", height: "100%", background: "hsl(210, 50%, 12%)", borderRadius: "8px" }}
              >
                <Geographies geography={usStatesGeoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const stateName = geo.properties.name;
                      const stateAbbr = usStateNameToAbbr[stateName] || stateName;
                      const stateStats = subJurisdictionStats.get(stateAbbr);
                      
                      return (
                        <Tooltip key={geo.rsmKey}>
                          <TooltipTrigger asChild>
                            <Geography
                              geography={geo}
                              fill={getSubJurisdictionColor(stateName)}
                              stroke="hsl(215, 25%, 27%)"
                              strokeWidth={0.5}
                              style={{
                                default: { outline: "none", cursor: "pointer" },
                                hover: { fill: "hsl(217, 91%, 60%)", outline: "none", cursor: "pointer" },
                                pressed: { fill: "hsl(217, 91%, 50%)", outline: "none" },
                              }}
                              onClick={() => handleSubJurisdictionClick(stateName)}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-semibold">{stateName} ({stateAbbr})</p>
                            {stateStats ? (
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Total: {stateStats.total} alerts</p>
                                <div className="flex gap-2">
                                  <Badge variant="destructive" className="text-xs">{stateStats.high} High</Badge>
                                  <Badge className="bg-risk-medium text-xs">{stateStats.medium} Med</Badge>
                                  <Badge className="bg-risk-low text-foreground text-xs">{stateStats.low} Low</Badge>
                                </div>
                                <p className="text-xs text-primary mt-1">Click to filter</p>
                              </div>
                            ) : <p className="text-xs text-muted-foreground">Click to filter to {stateAbbr}</p>}
                          </TooltipContent>
                        </Tooltip>
                      );
                    })
                  }
                </Geographies>
              </ComposableMap>
            ) : (
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{ scale: 400, center: [-95, 60] }}
                style={{ width: "100%", height: "100%", background: "hsl(210, 50%, 12%)", borderRadius: "8px" }}
              >
                <Geographies geography={canadaProvincesUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const provinceName = geo.properties.name;
                      const provinceAbbr = canadaProvinceToAbbr[provinceName] || provinceName;
                      const provinceStats = subJurisdictionStats.get(provinceAbbr);
                      
                      return (
                        <Tooltip key={geo.rsmKey}>
                          <TooltipTrigger asChild>
                            <Geography
                              geography={geo}
                              fill={getSubJurisdictionColor(provinceName)}
                              stroke="hsl(215, 25%, 27%)"
                              strokeWidth={0.5}
                              style={{
                                default: { outline: "none", cursor: "pointer" },
                                hover: { fill: "hsl(217, 91%, 60%)", outline: "none", cursor: "pointer" },
                                pressed: { fill: "hsl(217, 91%, 50%)", outline: "none" },
                              }}
                              onClick={() => handleSubJurisdictionClick(provinceName)}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-semibold">{provinceName} ({provinceAbbr})</p>
                            {provinceStats ? (
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Total: {provinceStats.total} alerts</p>
                                <div className="flex gap-2">
                                  <Badge variant="destructive" className="text-xs">{provinceStats.high} High</Badge>
                                  <Badge className="bg-risk-medium text-xs">{provinceStats.medium} Med</Badge>
                                  <Badge className="bg-risk-low text-foreground text-xs">{provinceStats.low} Low</Badge>
                                </div>
                                <p className="text-xs text-primary mt-1">Click to filter</p>
                              </div>
                            ) : <p className="text-xs text-muted-foreground">Click to filter to {provinceAbbr}</p>}
                          </TooltipContent>
                        </Tooltip>
                      );
                    })
                  }
                </Geographies>
              </ComposableMap>
            )}
          </div>
        </TooltipProvider>
        
        <div className="flex gap-4 mt-2 justify-center text-xs flex-wrap">
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{background: "hsl(0, 84%, 60%)"}} /><span className="text-foreground">High Risk</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{background: "hsl(38, 92%, 50%)"}} /><span className="text-foreground">Medium Risk</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{background: "hsl(142, 71%, 45%)"}} /><span className="text-foreground">Low Risk</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{background: "hsl(215, 14%, 34%)"}} /><span className="text-foreground">Tracked</span></div>
        </div>
      </CardContent>
    </Card>
  );
}