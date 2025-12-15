import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { InternationalLegislation } from "@/data/mockInternationalLegislation";
import { Globe, ZoomIn, ZoomOut, RotateCcw, ArrowLeft, Info } from "lucide-react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { calculateActivityScore, getJurisdictionGradientColor } from "./JurisdictionMapUtils";

// TopoJSON/GeoJSON URLs for different map views
const geoUrls = {
  world: "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
  usa: "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json",
  canada: "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/canada.geojson",
  japan: "https://raw.githubusercontent.com/dataofjapan/land/master/japan.geojson",
  korea: "https://raw.githubusercontent.com/southkorea/southkorea-maps/master/kostat/2018/json/skorea-provinces-2018-geo.json",
  taiwan: "https://raw.githubusercontent.com/AJLiu/taiwan-atlas/master/taiwan-counties.json",
  peru: "https://raw.githubusercontent.com/juaneladio/peru-geojson/master/peru_departamental_simple.geojson",
  costaRica: "/maps/costa-rica-provinces.geojson",
  gcc: "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
  eu: "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
};

interface WorldMapProps {
  legislation: InternationalLegislation[];
  onSelectRegion?: (region: string) => void;
  onSelectSubJurisdiction?: (jurisdiction: string, subJurisdiction: string) => void;
}

// Country name to jurisdiction mapping
const countryNameToJurisdiction: Record<string, string> = {
  "United States of America": "usa",
  "United States": "usa",
  "Canada": "canada",
  "Japan": "japan",
  "South Korea": "korea",
  "Korea": "korea",
  "Taiwan": "taiwan",
  "United Arab Emirates": "uae",
  "Saudi Arabia": "saudi",
  "Kuwait": "kuwait",
  "Bahrain": "bahrain",
  "Qatar": "qatar",
  "Oman": "oman",
  "Costa Rica": "costa-rica",
  "Peru": "peru",
  // EU member states - all map to EU as single unit for direct filter (no zoom)
  "Germany": "eu", "Austria": "eu", "Belgium": "eu", "Bulgaria": "eu", 
  "Croatia": "eu", "Cyprus": "eu", "Czechia": "eu", "Czech Republic": "eu",
  "Denmark": "eu", "Estonia": "eu", "Finland": "eu", "France": "eu", 
  "Greece": "eu", "Hungary": "eu", "Ireland": "eu", "Italy": "eu", 
  "Latvia": "eu", "Lithuania": "eu", "Luxembourg": "eu", "Malta": "eu", 
  "Netherlands": "eu", "Poland": "eu", "Portugal": "eu", "Romania": "eu", 
  "Slovakia": "eu", "Slovenia": "eu", "Spain": "eu", "Sweden": "eu",
};

// EU member states for unified coloring
const euMemberStates = new Set([
  "Germany", "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czechia", 
  "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Greece", "Hungary", 
  "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands", 
  "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden"
]);

// GCC countries for filtering
const gccCountries = new Set([
  "United Arab Emirates", "Saudi Arabia", "Kuwait", "Bahrain", "Qatar", "Oman"
]);

// All jurisdictions that support subnational zoom
const zoomableJurisdictions = new Set([
  "usa", "canada", "japan", "korea", "taiwan", "peru", "costa-rica", "gcc", "eu"
]);

// Map jurisdiction data keys for stats aggregation
const jurisdictionToDataKey: Record<string, string[]> = {
  usa: ["USA", "usa"],
  canada: ["Canada", "canada"],
  japan: ["Japan", "japan"],
  korea: ["Korea", "korea"],
  taiwan: ["Taiwan", "taiwan"],
  gcc: ["UAE", "uae", "Saudi Arabia", "saudi", "Kuwait", "kuwait", "Bahrain", "bahrain", "Qatar", "qatar", "Oman", "oman", "GCC", "gcc"],
  uae: ["UAE", "uae"],
  saudi: ["Saudi Arabia", "saudi"],
  kuwait: ["Kuwait", "kuwait"],
  bahrain: ["Bahrain", "bahrain"],
  qatar: ["Qatar", "qatar"],
  oman: ["Oman", "oman"],
  "costa-rica": ["Costa Rica", "costa-rica", "CR"],
  peru: ["Peru", "peru"],
  eu: ["EU", "eu"],
};

// Subnational unit abbreviation mappings
const subJurisdictionMappings: Record<string, Record<string, string>> = {
  usa: {
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
  },
  canada: {
    "Ontario": "ON", "Quebec": "QC", "British Columbia": "BC", "Alberta": "AB",
    "Manitoba": "MB", "Saskatchewan": "SK", "Nova Scotia": "NS", "New Brunswick": "NB",
    "Newfoundland and Labrador": "NL", "Prince Edward Island": "PE",
    "Northwest Territories": "NT", "Yukon": "YT", "Nunavut": "NU"
  },
  japan: {
    "Hokkaido": "HK", "Aomori": "AM", "Iwate": "IW", "Miyagi": "MY", "Akita": "AK", "Yamagata": "YM",
    "Fukushima": "FK", "Ibaraki": "IB", "Tochigi": "TC", "Gunma": "GM", "Saitama": "ST", "Chiba": "CB",
    "Tokyo": "TK", "Kanagawa": "KN", "Niigata": "NG", "Toyama": "TY", "Ishikawa": "IS", "Fukui": "FI",
    "Yamanashi": "YN", "Nagano": "NN", "Gifu": "GF", "Shizuoka": "SZ", "Aichi": "AI", "Mie": "ME",
    "Shiga": "SG", "Kyoto": "KY", "Osaka": "OS", "Hyogo": "HG", "Nara": "NR", "Wakayama": "WK",
    "Tottori": "TT", "Shimane": "SM", "Okayama": "OK", "Hiroshima": "HR", "Yamaguchi": "YG",
    "Tokushima": "TS", "Kagawa": "KG", "Ehime": "EH", "Kochi": "KC", "Fukuoka": "FO", "Saga": "SA",
    "Nagasaki": "NS", "Kumamoto": "KM", "Oita": "OT", "Miyazaki": "MZ", "Kagoshima": "KS", "Okinawa": "OW"
  },
  korea: {
    "Seoul": "SE", "Busan": "BS", "Daegu": "DG", "Incheon": "IC", "Gwangju": "GJ", "Daejeon": "DJ",
    "Ulsan": "US", "Sejong": "SJ", "Gyeonggi-do": "GG", "Gangwon-do": "GW", "Chungcheongbuk-do": "CB",
    "Chungcheongnam-do": "CN", "Jeollabuk-do": "JB", "Jeollanam-do": "JN", "Gyeongsangbuk-do": "GB",
    "Gyeongsangnam-do": "GN", "Jeju-do": "JJ"
  },
  taiwan: {
    "Taipei City": "TPE", "New Taipei City": "NWT", "Taoyuan City": "TAO", "Taichung City": "TXG",
    "Tainan City": "TNN", "Kaohsiung City": "KHH", "Keelung City": "KEE", "Hsinchu City": "HSZ",
    "Chiayi City": "CYI", "Hsinchu County": "HSQ", "Miaoli County": "MIA", "Changhua County": "CHA",
    "Nantou County": "NAN", "Yunlin County": "YUN", "Chiayi County": "CYQ", "Pingtung County": "PIF",
    "Yilan County": "ILA", "Hualien County": "HUA", "Taitung County": "TTT", "Penghu County": "PEN",
    "Kinmen County": "KIN", "Lienchiang County": "LIE"
  },
  peru: {
    "Amazonas": "AMA", "Áncash": "ANC", "Apurímac": "APU", "Arequipa": "ARE", "Ayacucho": "AYA",
    "Cajamarca": "CAJ", "Callao": "CAL", "Cusco": "CUS", "Huancavelica": "HUV", "Huánuco": "HUC",
    "Ica": "ICA", "Junín": "JUN", "La Libertad": "LAL", "Lambayeque": "LAM", "Lima": "LIM",
    "Loreto": "LOR", "Madre de Dios": "MDD", "Moquegua": "MOQ", "Pasco": "PAS", "Piura": "PIU",
    "Puno": "PUN", "San Martín": "SAM", "Tacna": "TAC", "Tumbes": "TUM", "Ucayali": "UCA"
  },
  "costa-rica": {
    "San José": "SJ", "Alajuela": "AL", "Cartago": "CA", "Heredia": "HE",
    "Guanacaste": "GU", "Puntarenas": "PU", "Limón": "LI",
    "Costa Rica": "CR"
  },
  gcc: {
    "United Arab Emirates": "UAE", "Saudi Arabia": "KSA", "Kuwait": "KWT",
    "Bahrain": "BHR", "Qatar": "QAT", "Oman": "OMN"
  },
  eu: {}
};

// Map view configurations
type MapView = "world" | "usa" | "canada" | "japan" | "korea" | "taiwan" | "peru" | "costa-rica" | "gcc" | "eu";

interface MapConfig {
  geoUrl: string;
  projection: "geoMercator" | "geoAlbersUsa" | "geoAzimuthalEqualArea";
  projectionConfig: Record<string, any>;
  center: [number, number];
  filterFn?: (geo: any) => boolean;
  nameProperty?: string;
}

const mapConfigs: Record<MapView, MapConfig> = {
  world: {
    geoUrl: geoUrls.world,
    projection: "geoMercator",
    projectionConfig: { scale: 130, center: [20, 35] },
    center: [20, 30]
  },
  usa: {
    geoUrl: geoUrls.usa,
    projection: "geoAlbersUsa",
    projectionConfig: { scale: 1000 },
    center: [-98, 39]
  },
  canada: {
    geoUrl: geoUrls.canada,
    projection: "geoMercator",
    projectionConfig: { scale: 400, center: [-95, 60] },
    center: [-100, 60]
  },
  japan: {
    geoUrl: geoUrls.japan,
    projection: "geoMercator",
    projectionConfig: { scale: 1500, center: [138, 36] },
    center: [138, 36],
    nameProperty: "nam_ja"
  },
  korea: {
    geoUrl: geoUrls.korea,
    projection: "geoMercator",
    projectionConfig: { scale: 4500, center: [127.5, 36] },
    center: [127.5, 36],
    nameProperty: "name"
  },
  taiwan: {
    geoUrl: geoUrls.taiwan,
    projection: "geoMercator",
    projectionConfig: { scale: 6000, center: [121, 23.5] },
    center: [121, 23.5]
  },
  peru: {
    geoUrl: geoUrls.peru,
    projection: "geoMercator",
    projectionConfig: { scale: 1200, center: [-75, -10] },
    center: [-75, -10],
    nameProperty: "NOMBDEP"
  },
  "costa-rica": {
    geoUrl: geoUrls.costaRica,
    projection: "geoMercator",
    projectionConfig: { scale: 8000, center: [-84, 9.9] },
    center: [-84, 9.9],
    nameProperty: "NAME_1"
  },
  gcc: {
    geoUrl: geoUrls.gcc,
    projection: "geoMercator",
    projectionConfig: { scale: 800, center: [50, 24] },
    center: [50, 24],
    filterFn: (geo: any) => gccCountries.has(geo.properties.name)
  },
  eu: {
    geoUrl: geoUrls.eu,
    projection: "geoMercator",
    projectionConfig: { scale: 600, center: [15, 52] },
    center: [15, 52],
    filterFn: (geo: any) => euMemberStates.has(geo.properties.name)
  }
};

const viewTitles: Record<MapView, string> = {
  world: "Tracked Jurisdictions",
  usa: "United States - Select a State",
  canada: "Canada - Select a Province",
  japan: "Japan - Select a Prefecture",
  korea: "South Korea - Select a Province",
  taiwan: "Taiwan - Select a County",
  peru: "Peru - Select a Department",
  "costa-rica": "Costa Rica - Select a Province",
  gcc: "GCC Region - Select a Country",
  eu: "European Union - Select a Country"
};

// Legacy function kept for reference but no longer used
// function getAlertFillColor(high: number, medium: number, low: number): string {
//   if (high > 0) return "hsl(0, 84%, 60%)";
//   if (medium > 0) return "hsl(38, 92%, 50%)";
//   if (low > 0) return "hsl(142, 71%, 45%)";
//   return "hsl(215, 14%, 34%)";
// }

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

  // Aggregate stats by sub-jurisdiction
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

  // Calculate max activity scores for gradient normalization
  const { maxJurisdictionScore, maxSubJurisdictionScore } = useMemo(() => {
    let maxJuris = 0;
    let maxSubJuris = 0;
    
    stats.forEach(s => {
      const score = calculateActivityScore(s.high, s.medium, s.low);
      if (score > maxJuris) maxJuris = score;
    });
    
    subJurisdictionStats.forEach(s => {
      const score = calculateActivityScore(s.high, s.medium, s.low);
      if (score > maxSubJuris) maxSubJuris = score;
    });
    
    return { maxJurisdictionScore: maxJuris, maxSubJurisdictionScore: maxSubJuris };
  }, [stats, subJurisdictionStats]);

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
    
    // EU member states - zoom to EU view
    if (jurisdiction === "eu") {
      setSelectedJurisdiction("eu");
      setCurrentView("eu");
      setPosition({ coordinates: mapConfigs.eu.center, zoom: 1 });
      return;
    }
    
    // Check if this jurisdiction supports subnational zoom
    if (zoomableJurisdictions.has(jurisdiction)) {
      // For GCC individual countries, map to gcc view
      if (["uae", "saudi", "kuwait", "bahrain", "qatar", "oman"].includes(jurisdiction)) {
        setSelectedJurisdiction("gcc");
        setCurrentView("gcc");
        setPosition({ coordinates: mapConfigs.gcc.center, zoom: 1 });
      } else {
        setSelectedJurisdiction(jurisdiction);
        setCurrentView(jurisdiction as MapView);
        const config = mapConfigs[jurisdiction as MapView];
        if (config) {
          setPosition({ coordinates: config.center, zoom: 1 });
        }
      }
    } else {
      // Direct navigation for non-zoomable jurisdictions
      if (onSelectRegion) {
        onSelectRegion(jurisdiction);
      }
    }
  }, [onSelectRegion]);

  const handleSubJurisdictionClick = useCallback((name: string, propertyName?: string) => {
    if (!selectedJurisdiction) return;
    
    const mapping = subJurisdictionMappings[selectedJurisdiction] || {};
    const abbr = mapping[name] || name;
    
    // For GCC, clicking a country should select that specific country
    if (selectedJurisdiction === "gcc") {
      const countryJurisdiction = countryNameToJurisdiction[name];
      if (countryJurisdiction && onSelectRegion) {
        onSelectRegion(countryJurisdiction);
      }
      return;
    }
    
    // For EU, clicking any EU country filters to EU legislation
    if (selectedJurisdiction === "eu") {
      if (onSelectRegion) {
        onSelectRegion("eu");
      }
      return;
    }
    
    // For Costa Rica provinces, filter by province name
    if (selectedJurisdiction === "costa-rica") {
      if (onSelectSubJurisdiction) {
        onSelectSubJurisdiction("costa-rica", abbr);
      }
      return;
    }
    
    if (onSelectSubJurisdiction) {
      onSelectSubJurisdiction(selectedJurisdiction, abbr);
    }
  }, [selectedJurisdiction, onSelectSubJurisdiction, onSelectRegion]);

  const handleBackToWorld = useCallback(() => {
    setCurrentView("world");
    setSelectedJurisdiction(null);
    setPosition({ coordinates: [20, 30], zoom: 1 });
  }, []);

  const getCountryColor = useCallback((countryName: string) => {
    const jurisdiction = countryNameToJurisdiction[countryName];
    if (!jurisdiction) return "hsl(215, 28%, 17%)";
    const jurisdictionStats = getJurisdictionStats(jurisdiction);
    if (!jurisdictionStats) return "hsl(215, 14%, 34%)";
    return getJurisdictionGradientColor(
      jurisdictionStats.high, 
      jurisdictionStats.medium, 
      jurisdictionStats.low, 
      maxJurisdictionScore
    );
  }, [getJurisdictionStats, maxJurisdictionScore]);

  const getSubJurisdictionColor = useCallback((name: string) => {
    if (!selectedJurisdiction) return "hsl(215, 14%, 34%)";
    
    const mapping = subJurisdictionMappings[selectedJurisdiction] || {};
    const abbr = mapping[name] || name;
    
    // For GCC countries, use country jurisdiction stats
    if (selectedJurisdiction === "gcc") {
      const countryJurisdiction = countryNameToJurisdiction[name];
      if (countryJurisdiction) {
        const jurisdictionStats = getJurisdictionStats(countryJurisdiction);
        if (jurisdictionStats) {
          return getJurisdictionGradientColor(
            jurisdictionStats.high, 
            jurisdictionStats.medium, 
            jurisdictionStats.low, 
            maxJurisdictionScore
          );
        }
      }
      return "hsl(215, 14%, 34%)";
    }
    
    const subStats = subJurisdictionStats.get(abbr);
    if (!subStats) return "hsl(215, 14%, 34%)";
    return getJurisdictionGradientColor(
      subStats.high, 
      subStats.medium, 
      subStats.low, 
      maxSubJurisdictionScore
    );
  }, [selectedJurisdiction, subJurisdictionStats, getJurisdictionStats, maxJurisdictionScore, maxSubJurisdictionScore]);

  const handleZoomIn = useCallback(() => {
    if (position.zoom >= 8) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom * 1.5 }));
  }, [position.zoom]);

  const handleZoomOut = useCallback(() => {
    if (position.zoom <= 1) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom / 1.5 }));
  }, [position.zoom]);

  const handleReset = useCallback(() => {
    const config = mapConfigs[currentView];
    if (config) {
      setPosition({ coordinates: config.center, zoom: 1 });
    }
  }, [currentView]);

  const handleMoveEnd = useCallback((pos: { coordinates: [number, number]; zoom: number }) => {
    setPosition(pos);
  }, []);

  const config = mapConfigs[currentView];
  const isWorld = currentView === "world";

  // Get display name from geography properties
  const getDisplayName = (geo: any): string => {
    const nameProperty = config.nameProperty || "name";
    return geo.properties[nameProperty] || geo.properties.name || geo.properties.NAME || "Unknown";
  };

  // Get abbreviation for tooltip
  const getAbbreviation = (name: string): string => {
    if (!selectedJurisdiction) return name;
    const mapping = subJurisdictionMappings[selectedJurisdiction] || {};
    return mapping[name] || name;
  };

  // Get stats for subnational unit
  const getSubStats = (name: string) => {
    if (!selectedJurisdiction) return null;
    
    if (selectedJurisdiction === "gcc") {
      const countryJurisdiction = countryNameToJurisdiction[name];
      if (countryJurisdiction) {
        return getJurisdictionStats(countryJurisdiction);
      }
      return null;
    }
    
    const mapping = subJurisdictionMappings[selectedJurisdiction] || {};
    const abbr = mapping[name] || name;
    return subJurisdictionStats.get(abbr) || null;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            {!isWorld && (
              <Button variant="ghost" size="icon" className="h-6 w-6 mr-1" onClick={handleBackToWorld}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <Globe className="w-4 h-4" />
            {viewTitles[currentView]}
            {isWorld && (
              <span className="text-xs text-muted-foreground ml-2">(Click a country to zoom)</span>
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
            {isWorld ? (
              <ComposableMap
                projection={config.projection}
                projectionConfig={config.projectionConfig}
                style={{ width: "100%", height: "100%", background: "hsl(210, 50%, 12%)", borderRadius: "8px" }}
              >
                <ZoomableGroup
                  zoom={position.zoom}
                  center={position.coordinates}
                  onMoveEnd={handleMoveEnd}
                  minZoom={1}
                  maxZoom={8}
                >
                  <Geographies geography={config.geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const countryName = geo.properties.name;
                        const jurisdiction = countryNameToJurisdiction[countryName];
                        const isClickable = !!jurisdiction;
                        const isEU = euMemberStates.has(countryName);
                        const displayName = isEU ? "European Union" : countryName;
                        const jurisdictionStats = jurisdiction ? getJurisdictionStats(jurisdiction) : null;
                        const canZoom = jurisdiction && (zoomableJurisdictions.has(jurisdiction) || 
                          ["uae", "saudi", "kuwait", "bahrain", "qatar", "oman"].includes(jurisdiction));
                        
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
                                      {canZoom ? "Click to zoom" : "Click to view"}
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
            ) : currentView === "usa" ? (
              <ComposableMap
                projection="geoAlbersUsa"
                projectionConfig={{ scale: 1000 }}
                style={{ width: "100%", height: "100%", background: "hsl(210, 50%, 12%)", borderRadius: "8px" }}
              >
                <Geographies geography={geoUrls.usa}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const name = geo.properties.name;
                      const abbr = getAbbreviation(name);
                      const subStats = getSubStats(name);
                      
                      return (
                        <Tooltip key={geo.rsmKey}>
                          <TooltipTrigger asChild>
                            <Geography
                              geography={geo}
                              fill={getSubJurisdictionColor(name)}
                              stroke="hsl(215, 25%, 27%)"
                              strokeWidth={0.5}
                              style={{
                                default: { outline: "none", cursor: "pointer" },
                                hover: { fill: "hsl(217, 91%, 60%)", outline: "none", cursor: "pointer" },
                                pressed: { fill: "hsl(217, 91%, 50%)", outline: "none" },
                              }}
                              onClick={() => handleSubJurisdictionClick(name)}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-semibold">{name} ({abbr})</p>
                            {subStats ? (
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Total: {subStats.total} alerts</p>
                                <div className="flex gap-2">
                                  <Badge variant="destructive" className="text-xs">{subStats.high} High</Badge>
                                  <Badge className="bg-risk-medium text-xs">{subStats.medium} Med</Badge>
                                  <Badge className="bg-risk-low text-foreground text-xs">{subStats.low} Low</Badge>
                                </div>
                                <p className="text-xs text-primary mt-1">Click to filter</p>
                              </div>
                            ) : <p className="text-xs text-muted-foreground">Click to filter to {abbr}</p>}
                          </TooltipContent>
                        </Tooltip>
                      );
                    })
                  }
                </Geographies>
              </ComposableMap>
            ) : (
              // Generic handler for all other zoomed regions
              <ComposableMap
                projection={config.projection}
                projectionConfig={config.projectionConfig}
                style={{ width: "100%", height: "100%", background: "hsl(210, 50%, 12%)", borderRadius: "8px" }}
              >
                <Geographies geography={config.geoUrl}>
                  {({ geographies }) => {
                    const filteredGeos = config.filterFn 
                      ? geographies.filter(config.filterFn)
                      : geographies;
                    
                    return filteredGeos.map((geo) => {
                      const name = getDisplayName(geo);
                      const abbr = getAbbreviation(name);
                      const subStats = getSubStats(name);
                      
                      return (
                        <Tooltip key={geo.rsmKey}>
                          <TooltipTrigger asChild>
                            <Geography
                              geography={geo}
                              fill={getSubJurisdictionColor(name)}
                              stroke="hsl(215, 25%, 27%)"
                              strokeWidth={0.5}
                              style={{
                                default: { outline: "none", cursor: "pointer" },
                                hover: { fill: "hsl(217, 91%, 60%)", outline: "none", cursor: "pointer" },
                                pressed: { fill: "hsl(217, 91%, 50%)", outline: "none" },
                              }}
                              onClick={() => handleSubJurisdictionClick(name)}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-semibold">{name} {abbr !== name ? `(${abbr})` : ""}</p>
                            {subStats ? (
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Total: {subStats.total} alerts</p>
                                <div className="flex gap-2">
                                  <Badge variant="destructive" className="text-xs">{subStats.high} High</Badge>
                                  <Badge className="bg-risk-medium text-xs">{subStats.medium} Med</Badge>
                                  <Badge className="bg-risk-low text-foreground text-xs">{subStats.low} Low</Badge>
                                </div>
                                <p className="text-xs text-primary mt-1">Click to filter</p>
                              </div>
                            ) : <p className="text-xs text-muted-foreground">Click to select</p>}
                          </TooltipContent>
                        </Tooltip>
                      );
                    });
                  }}
                </Geographies>
              </ComposableMap>
            )}
          </div>
        </TooltipProvider>
        
        <div className="flex items-center gap-3 mt-3 justify-center">
          <span className="text-xs text-muted-foreground">Least Activity</span>
          <div 
            className="w-32 h-3 rounded-full" 
            style={{
              background: "linear-gradient(to right, hsl(120, 70%, 45%), hsl(60, 70%, 45%), hsl(0, 75%, 50%))"
            }} 
          />
          <span className="text-xs text-muted-foreground">Most Activity</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 text-sm" side="top">
              <div className="space-y-2">
                <h4 className="font-semibold">Regulatory Activity Index (Weekly)</h4>
                <p className="text-xs text-muted-foreground">
                  This gradient shows the volume of regulatory activity affecting each jurisdiction over the past week.
                </p>
                <div className="space-y-1 text-xs">
                  <p className="font-medium">How it's calculated:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                    <li>High-risk alerts: ×3 weight</li>
                    <li>Medium-risk alerts: ×2 weight</li>
                    <li>Low-risk alerts: ×1 weight</li>
                  </ul>
                </div>
                <div className="space-y-1 text-xs">
                  <p className="font-medium">Color scale:</p>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{background: "hsl(0, 75%, 50%)"}} />
                    <span className="text-muted-foreground">Red = Highest regulatory activity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{background: "hsl(60, 70%, 45%)"}} />
                    <span className="text-muted-foreground">Yellow = Moderate activity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{background: "hsl(120, 70%, 45%)"}} />
                    <span className="text-muted-foreground">Green = Lowest activity</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground italic">
                  Intensity is relative to the jurisdiction with the most activity.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
}
