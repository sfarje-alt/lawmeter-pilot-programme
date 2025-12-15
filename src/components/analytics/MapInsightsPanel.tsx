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
import { AnalyticsFilters, AnalyticsFilterBar } from "./AnalyticsFilterBar";
import { RegionCode, regionThemes, RegionIcon } from "@/components/regions/RegionConfig";

// Country display info
const COUNTRY_INFO: Record<string, { flag: string; name: string }> = {
  "USA": { flag: "🇺🇸", name: "United States" },
  "Canada": { flag: "🇨🇦", name: "Canada" },
  "Japan": { flag: "🇯🇵", name: "Japan" },
  "Korea": { flag: "🇰🇷", name: "South Korea" },
  "Taiwan": { flag: "🇹🇼", name: "Taiwan" },
  "EU": { flag: "🇪🇺", name: "European Union" },
  "UAE": { flag: "🇦🇪", name: "United Arab Emirates" },
  "Saudi Arabia": { flag: "🇸🇦", name: "Saudi Arabia" },
  "Oman": { flag: "🇴🇲", name: "Oman" },
  "Kuwait": { flag: "🇰🇼", name: "Kuwait" },
  "Bahrain": { flag: "🇧🇭", name: "Bahrain" },
  "Qatar": { flag: "🇶🇦", name: "Qatar" },
  "Peru": { flag: "🇵🇪", name: "Peru" },
  "Costa Rica": { flag: "🇨🇷", name: "Costa Rica" },
};

// Region display info
const REGION_INFO: Record<string, { name: string; countries: string[] }> = {
  "NAM": { name: "North America", countries: ["USA", "Canada"] },
  "LATAM": { name: "Latin America", countries: ["Peru", "Costa Rica"] },
  "EU": { name: "European Union", countries: ["EU"] },
  "GCC": { name: "Gulf States", countries: ["UAE", "Saudi Arabia", "Oman", "Kuwait", "Bahrain", "Qatar"] },
  "APAC": { name: "Asia-Pacific", countries: ["Japan", "Korea", "Taiwan"] },
};

// Check if key is a region
const isRegionKey = (key: string): key is RegionCode => {
  return ["NAM", "LATAM", "EU", "GCC", "APAC"].includes(key);
};

// Map old jurisdiction names to data keys
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
}

export function MapInsightsPanel({
  data,
  filters,
  onFiltersChange,
  onNavigateToAlerts,
}: MapInsightsPanelProps) {
  const [activeTab, setActiveTab] = useState<"map" | "matrix">("map");
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string | null>(null);
  const [selectedSubdivision, setSelectedSubdivision] = useState<string | null>(null);

  // Convert filtered UnifiedLegislationItem data to InternationalLegislation format for WorldMap
  const filteredLegislationForMap = useMemo(() => {
    // Apply filters first, then convert to map format
    let result = [...data];

    // Date range filter
    if (filters.dateRange !== "all") {
      const days = parseInt(filters.dateRange);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      result = result.filter((item) => {
        // If no publishedDate, include the item
        if (!item.publishedDate && !item.effectiveDate) return true;
        const itemDate = new Date(item.publishedDate || item.effectiveDate || "");
        return !isNaN(itemDate.getTime()) && itemDate >= cutoffDate;
      });
    }

    // Lifecycle filter (Status)
    if (filters.lifecycle !== "all") {
      if (filters.lifecycle === "in-force") {
        result = result.filter((item) => item.isInForce);
      } else if (filters.lifecycle === "pipeline") {
        result = result.filter((item) => item.isPipeline);
      }
    }

    // Convert to InternationalLegislation format for WorldMap
    return result.map((item) => ({
      id: item.id,
      title: item.title,
      summary: item.summary || "",
      bullets: item.bullets || [],
      status: item.status,
      jurisdiction: item.jurisdictionCode || item.region as string,
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

  // Apply global filters to data (only Period and Status)
  const filteredData = useMemo(() => {
    let result = [...data];

    // Date range filter
    if (filters.dateRange !== "all") {
      const days = parseInt(filters.dateRange);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      result = result.filter((item) => {
        // If no publishedDate, include the item (don't filter it out)
        if (!item.publishedDate && !item.effectiveDate) return true;
        const itemDate = new Date(item.publishedDate || item.effectiveDate || "");
        return !isNaN(itemDate.getTime()) && itemDate >= cutoffDate;
      });
    }

    // Lifecycle filter (Status)
    if (filters.lifecycle !== "all") {
      if (filters.lifecycle === "in-force") {
        result = result.filter((item) => item.isInForce);
      } else if (filters.lifecycle === "pipeline") {
        result = result.filter((item) => item.isPipeline);
      }
    }

    return result;
  }, [data, filters]);

  // Check if selected jurisdiction is a commercial region
  const isSelectedRegion = selectedJurisdiction ? isRegionKey(selectedJurisdiction) : false;
  
  // Region info for display
  const regionInfo = selectedJurisdiction && isSelectedRegion
    ? REGION_INFO[selectedJurisdiction]
    : null;

  // Country-specific data (when a country is selected, not a region)
  const countryData = useMemo(() => {
    if (!selectedJurisdiction) return [];
    
    // If it's a region, filter by region field
    if (isSelectedRegion) {
      return filteredData.filter((item) => item.region === selectedJurisdiction);
    }
    
    // Otherwise filter by jurisdictionCode (country)
    return filteredData.filter((item) => item.jurisdictionCode === selectedJurisdiction);
  }, [filteredData, selectedJurisdiction, isSelectedRegion]);

  const handleMapSelectRegion = (region: string) => {
    const mappedKey = JURISDICTION_DATA_MAP[region] || region;
    setSelectedJurisdiction(mappedKey);
    setSelectedSubdivision(null);
  };

  const handleBackToMap = () => {
    setSelectedJurisdiction(null);
    setSelectedSubdivision(null);
  };

  const handleViewAlerts = () => {
    onNavigateToAlerts(selectedJurisdiction || undefined, selectedSubdivision || undefined);
  };

  const countryInfo = selectedJurisdiction && !isSelectedRegion
    ? COUNTRY_INFO[selectedJurisdiction] || { flag: "🌍", name: selectedJurisdiction }
    : null;

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
                const mappedKey = JURISDICTION_DATA_MAP[jurisdiction] || jurisdiction;
                setSelectedJurisdiction(mappedKey);
                setSelectedSubdivision(sub);
              }}
            />
          </div>

          {/* Selected jurisdiction indicator */}
          {selectedJurisdiction && (
            <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              {isSelectedRegion ? (
                <RegionIcon region={selectedJurisdiction as RegionCode} size={24} />
              ) : (
                <span className="text-xl">{countryInfo?.flag || "🌍"}</span>
              )}
              <span className="font-medium">
                Viewing: {isSelectedRegion ? regionInfo?.name : countryInfo?.name || selectedJurisdiction}
              </span>
              <Button variant="ghost" size="sm" onClick={handleBackToMap} className="ml-auto">
                Clear Selection
              </Button>
            </div>
          )}

          {/* Analytics section below map */}
          {selectedJurisdiction ? (
            isSelectedRegion ? (
              // Region analytics
              <RegionAnalyticsPanel
                regionKey={selectedJurisdiction as RegionCode}
                regionName={regionInfo?.name || selectedJurisdiction}
                data={filteredData}
                selectedCountry={selectedSubdivision}
                onSelectCountry={setSelectedSubdivision}
                onBack={handleBackToMap}
                onViewAlerts={handleViewAlerts}
                showHeader={false}
              />
            ) : (
              // Country analytics
              <CountryAnalyticsPanel
                countryKey={selectedJurisdiction}
                countryName={countryInfo?.name || selectedJurisdiction}
                countryFlag={countryInfo?.flag || "🌍"}
                data={countryData}
                selectedSubdivision={selectedSubdivision}
                onSelectSubdivision={setSelectedSubdivision}
                onBack={handleBackToMap}
                onViewAlerts={handleViewAlerts}
                showHeader={false}
              />
            )
          ) : (
            // Top Jurisdictions list when no selection
            <TopJurisdictionsList
              data={filteredData}
              onSelectJurisdiction={(key) => {
                setSelectedJurisdiction(key);
                setSelectedSubdivision(null);
              }}
              selectedJurisdiction={selectedJurisdiction}
            />
          )}
        </div>
      ) : (
        // Impact vs Urgency Matrix (always global)
        <div>
          <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-blue-400">
              <strong>Global View:</strong> This matrix shows all jurisdictions matching your current filters.
              It provides cross-jurisdiction prioritization for triage.
            </p>
          </div>
          <UnifiedImpactUrgencyMatrix data={filteredData} />
        </div>
      )}
    </div>
  );
}
