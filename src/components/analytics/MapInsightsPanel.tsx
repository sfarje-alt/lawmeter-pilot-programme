import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Map, 
  Grid3X3, 
  ChevronDown, 
  ChevronUp,
  Maximize2,
  Minimize2
} from "lucide-react";
import { WorldMap } from "@/components/maps";
import { TopJurisdictionsList } from "./TopJurisdictionsList";
import { CountryAnalyticsPanel } from "./CountryAnalyticsPanel";
import { UnifiedImpactUrgencyMatrix } from "./UnifiedImpactUrgencyMatrix";
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";
import { AnalyticsFilters, AnalyticsFilterBar } from "./AnalyticsFilterBar";

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
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function MapInsightsPanel({
  data,
  filters,
  onFiltersChange,
  onNavigateToAlerts,
  isExpanded,
  onToggleExpand,
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
        const itemDate = new Date(item.publishedDate || item.effectiveDate || "");
        return itemDate >= cutoffDate;
      });
    }

    // Risk level filter
    if (filters.riskLevels.length > 0) {
      result = result.filter((item) => filters.riskLevels.includes(item.riskLevel));
    }

    // Lifecycle filter
    if (filters.lifecycle !== "all") {
      if (filters.lifecycle === "in-force") {
        result = result.filter((item) => item.isInForce);
      } else if (filters.lifecycle === "pipeline") {
        result = result.filter((item) => item.isPipeline);
      }
    }

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter(
        (item) =>
          item.regulatoryCategory && filters.categories.includes(item.regulatoryCategory)
      );
    }

    // Convert to InternationalLegislation format for WorldMap
    return result.map((item) => ({
      id: item.id,
      title: item.title,
      summary: item.summary || "",
      bullets: item.bullets || [],
      status: item.status,
      jurisdiction: item.region as string,
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

    // Date range filter
    if (filters.dateRange !== "all") {
      const days = parseInt(filters.dateRange);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      result = result.filter((item) => {
        const itemDate = new Date(item.publishedDate || item.effectiveDate || "");
        return itemDate >= cutoffDate;
      });
    }

    // Jurisdiction filter (only for matrix when global)
    if (filters.jurisdictions.length > 0 && !selectedJurisdiction) {
      result = result.filter((item) =>
        filters.jurisdictions.includes(item.region) ||
        filters.jurisdictions.includes(item.jurisdictionCode || "")
      );
    }

    // Risk level filter
    if (filters.riskLevels.length > 0) {
      result = result.filter((item) => filters.riskLevels.includes(item.riskLevel));
    }

    // Lifecycle filter
    if (filters.lifecycle !== "all") {
      if (filters.lifecycle === "in-force") {
        result = result.filter((item) => item.isInForce);
      } else if (filters.lifecycle === "pipeline") {
        result = result.filter((item) => item.isPipeline);
      }
    }

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter(
        (item) =>
          item.regulatoryCategory && filters.categories.includes(item.regulatoryCategory)
      );
    }

    return result;
  }, [data, filters, selectedJurisdiction]);

  // Country-specific data
  const countryData = useMemo(() => {
    if (!selectedJurisdiction) return [];
    return filteredData.filter((item) => item.region === selectedJurisdiction);
  }, [filteredData, selectedJurisdiction]);

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

  const countryInfo = selectedJurisdiction
    ? COUNTRY_INFO[selectedJurisdiction] || { flag: "🌍", name: selectedJurisdiction }
    : null;

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <AnalyticsFilterBar
        filters={filters}
        onFiltersChange={onFiltersChange}
        totalItems={data.length}
        filteredItems={filteredData.length}
      />

      {/* Tab Toggle */}
      <div className="flex items-center justify-between">
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

        <Button variant="ghost" size="sm" onClick={onToggleExpand} className="gap-2">
          {isExpanded ? (
            <>
              <Minimize2 className="w-4 h-4" />
              Collapse
            </>
          ) : (
            <>
              <Maximize2 className="w-4 h-4" />
              Expand
            </>
          )}
        </Button>
      </div>

      {/* Content */}
      {activeTab === "map" ? (
        selectedJurisdiction ? (
          // Country drill-down view
          <CountryAnalyticsPanel
            countryKey={selectedJurisdiction}
            countryName={countryInfo?.name || selectedJurisdiction}
            countryFlag={countryInfo?.flag || "🌍"}
            data={countryData}
            selectedSubdivision={selectedSubdivision}
            onSelectSubdivision={setSelectedSubdivision}
            onBack={handleBackToMap}
            onViewAlerts={handleViewAlerts}
          />
        ) : (
          // World map view
          <div className={`grid gap-4 ${isExpanded ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3"}`}>
            <div className={isExpanded ? "" : "lg:col-span-2"}>
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
            {!isExpanded && (
              <div>
                <TopJurisdictionsList
                  data={filteredData}
                  onSelectJurisdiction={(key) => {
                    setSelectedJurisdiction(key);
                    setSelectedSubdivision(null);
                  }}
                  selectedJurisdiction={selectedJurisdiction}
                />
              </div>
            )}
          </div>
        )
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
