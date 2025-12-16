import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Map, Grid3X3 } from "lucide-react";
import { WorldMap } from "@/components/maps";
import { TopJurisdictionsList } from "./TopJurisdictionsList";
import { CountryAnalyticsPanel } from "./CountryAnalyticsPanel";
import { RegionAnalyticsPanel } from "./RegionAnalyticsPanel";
import { UnifiedImpactUrgencyMatrix } from "./UnifiedImpactUrgencyMatrix";
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";
import { AnalyticsFilters } from "./AnalyticsFilterBar";
import { RegionCode, regionThemes, RegionIcon } from "@/components/regions/RegionConfig";
import { CountryFlag, getCountryInfo } from "@/components/shared/CountryFlag";

// Country to region mapping
const COUNTRY_REGION_MAP: Record<string, RegionCode> = {
  "USA": "NAM", "Canada": "NAM",
  "Japan": "APAC", "Korea": "APAC", "Taiwan": "APAC",
  "EU": "EU",
  "UAE": "GCC", "Saudi Arabia": "GCC", "Oman": "GCC", "Kuwait": "GCC", "Bahrain": "GCC", "Qatar": "GCC",
  "Peru": "LATAM", "Costa Rica": "LATAM",
};

// Region display info
const REGION_INFO: Record<RegionCode, { name: string; countries: string[] }> = {
  NAM: { name: "North America", countries: ["USA", "Canada"] },
  LATAM: { name: "Latin America", countries: ["Peru", "Costa Rica"] },
  EU: { name: "European Union", countries: ["EU"] },
  GCC: { name: "Gulf States", countries: ["UAE", "Saudi Arabia", "Oman", "Kuwait", "Bahrain", "Qatar"] },
  APAC: { name: "Asia-Pacific", countries: ["Japan", "Korea", "Taiwan"] },
};

// Check if key is a commercial region
const isRegionKey = (key: string): key is RegionCode => {
  return ["NAM", "LATAM", "EU", "GCC", "APAC"].includes(key);
};

// Helper to get country region
const getCountryRegion = (countryKey: string): RegionCode | undefined => {
  return COUNTRY_REGION_MAP[countryKey];
};

// Map WorldMap jurisdiction codes to our data keys
const JURISDICTION_DATA_MAP: Record<string, string> = {
  "usa": "USA",
  "canada": "Canada",
  "japan": "Japan",
  "korea": "Korea",
  "taiwan": "Taiwan",
  "eu": "EU",
  "uae": "UAE",
  "saudi": "Saudi Arabia",
  "oman": "Oman",
  "kuwait": "Kuwait",
  "bahrain": "Bahrain",
  "qatar": "Qatar",
  "peru": "Peru",
  "costa-rica": "Costa Rica",
};

interface MapInsightsPanelProps {
  data: UnifiedLegislationItem[];
  filters: AnalyticsFilters;
  onFiltersChange: (filters: AnalyticsFilters) => void;
  onNavigateToAlerts: (jurisdiction?: string, subdivision?: string) => void;
  onItemClick?: (item: UnifiedLegislationItem) => void;
}

export function MapInsightsPanel({
  data,
  filters,
  onFiltersChange,
  onNavigateToAlerts,
  onItemClick,
}: MapInsightsPanelProps) {
  const [activeTab, setActiveTab] = useState<"map" | "matrix">("map");
  // selectedRegion is always a commercial region (NAM, LATAM, EU, GCC, APAC)
  const [selectedRegion, setSelectedRegion] = useState<RegionCode | null>(null);
  // selectedCountry is the country within the region (USA, Canada, Japan, etc.)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedSubdivision, setSelectedSubdivision] = useState<string | null>(null);

  // Convert filtered UnifiedLegislationItem data to InternationalLegislation format for WorldMap
  const filteredLegislationForMap = useMemo(() => {
    let result = [...data];

    // Date range filter
    if (filters.dateRange !== "all") {
      const days = parseInt(filters.dateRange);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      result = result.filter((item) => {
        if (!item.publishedDate && !item.effectiveDate) return true;
        const itemDate = new Date(item.publishedDate || item.effectiveDate || "");
        return !isNaN(itemDate.getTime()) && itemDate >= cutoffDate;
      });
    }

    // Lifecycle filter
    if (filters.lifecycle !== "all") {
      if (filters.lifecycle === "in-force") {
        result = result.filter((item) => item.isInForce);
      } else if (filters.lifecycle === "pipeline") {
        result = result.filter((item) => item.isPipeline);
      }
    }

    // Convert to WorldMap format
    return result.map((item) => ({
      id: item.id,
      title: item.title,
      summary: item.summary || "",
      bullets: item.bullets || [],
      status: item.status,
      jurisdiction: item.jurisdictionCode || (item.region as string),
      subJurisdiction: item.subnationalUnit,
      riskLevel: item.riskLevel,
      riskScore: item.riskScore,
      category: item.policyArea || "General",
      regulatoryCategory: (item.regulatoryCategory || "Product Safety") as any,
      publishedDate: item.publishedDate || new Date().toISOString().slice(0, 10),
      effectiveDate: item.effectiveDate,
      complianceDeadline: item.complianceDeadline,
      regulatoryBody: item.authority,
      impactAreas: item.impactAreas || [],
      legislationType: "enacted" as any,
      legislativeCategory: "enacted" as any,
    }));
  }, [data, filters]);

  // Apply global filters to data
  const filteredData = useMemo(() => {
    let result = [...data];

    if (filters.dateRange !== "all") {
      const days = parseInt(filters.dateRange);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      result = result.filter((item) => {
        if (!item.publishedDate && !item.effectiveDate) return true;
        const itemDate = new Date(item.publishedDate || item.effectiveDate || "");
        return !isNaN(itemDate.getTime()) && itemDate >= cutoffDate;
      });
    }

    if (filters.lifecycle !== "all") {
      if (filters.lifecycle === "in-force") {
        result = result.filter((item) => item.isInForce);
      } else if (filters.lifecycle === "pipeline") {
        result = result.filter((item) => item.isPipeline);
      }
    }

    return result;
  }, [data, filters]);

  // Handle map country click - determines region and pre-selects country
  const handleMapSelectRegion = (jurisdictionCode: string) => {
    const countryKey = JURISDICTION_DATA_MAP[jurisdictionCode] || jurisdictionCode;
    const region = getCountryRegion(countryKey);
    
    if (region) {
      // Set the commercial region and pre-select the country
      setSelectedRegion(region);
      setSelectedCountry(countryKey);
      setSelectedSubdivision(null);
    }
  };

  // Handle region selection from TopJurisdictionsList
  const handleSelectRegion = (regionKey: string) => {
    if (isRegionKey(regionKey)) {
      setSelectedRegion(regionKey);
      setSelectedCountry(null);
      setSelectedSubdivision(null);
    }
  };

  const handleBackToMap = () => {
    setSelectedRegion(null);
    setSelectedCountry(null);
    setSelectedSubdivision(null);
  };

  const handleViewAlerts = () => {
    onNavigateToAlerts(selectedCountry || selectedRegion || undefined, selectedSubdivision || undefined);
  };

  const regionInfo = selectedRegion ? REGION_INFO[selectedRegion] : null;

  return (
    <div className="space-y-4">
      {/* Tab Toggle */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "map" | "matrix")}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="map" className="gap-2">
            <Map className="w-4 h-4" />
            Map
          </TabsTrigger>
          <TabsTrigger value="matrix" className="gap-2">
            <Grid3X3 className="w-4 h-4" />
            Impact vs Urgency (Global)
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Content */}
      {activeTab === "map" ? (
        <div className="space-y-4">
          {/* Map always visible at top */}
          <div className="w-full">
            <WorldMap
              legislation={filteredLegislationForMap}
              onSelectRegion={handleMapSelectRegion}
                onSelectSubJurisdiction={(jurisdiction, sub) => {
                  const countryKey = JURISDICTION_DATA_MAP[jurisdiction] || jurisdiction;
                  const region = getCountryRegion(countryKey);
                  if (region) {
                    setSelectedRegion(region);
                    setSelectedCountry(countryKey);
                    setSelectedSubdivision(sub);
                  }
                }}
              />
            </div>

            {/* Selected region/country indicator */}
            {selectedRegion && (
              <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <RegionIcon region={selectedRegion} size={24} />
                <span className="font-medium flex items-center gap-1">
                  Viewing: {regionInfo?.name}
                  {selectedCountry && (
                    <>
                      {" → "}
                      <CountryFlag countryKey={selectedCountry} variant="full" size="sm" showTooltip={false} />
                    </>
                  )}
                </span>
                <Button variant="ghost" size="sm" onClick={handleBackToMap} className="ml-auto">
                Clear Selection
              </Button>
            </div>
          )}

          {/* Analytics section below map */}
          {selectedRegion ? (
            <RegionAnalyticsPanel
              regionKey={selectedRegion}
              regionName={regionInfo?.name || selectedRegion}
              data={filteredData}
              selectedCountry={selectedCountry}
              onSelectCountry={setSelectedCountry}
              onBack={handleBackToMap}
              onViewAlerts={handleViewAlerts}
              showHeader={false}
            />
          ) : (
            // Commercial regions list when no selection
            <TopJurisdictionsList
              data={filteredData}
              onSelectJurisdiction={handleSelectRegion}
              selectedJurisdiction={selectedRegion}
            />
          )}
        </div>
      ) : (
        // Impact vs Urgency Matrix - Full page
        <div className="h-full min-h-[600px]">
          <UnifiedImpactUrgencyMatrix data={data} onItemClick={onItemClick} />
        </div>
      )}
    </div>
  );
}
