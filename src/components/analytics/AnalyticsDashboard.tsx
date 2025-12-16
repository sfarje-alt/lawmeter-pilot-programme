import { useState, useMemo } from "react";
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";
import { AnalyticsFilterBar, AnalyticsFilters } from "./AnalyticsFilterBar";
import { AnalyticsKPIRow } from "./AnalyticsKPIRow";
import { UnifiedImpactUrgencyMatrix } from "./UnifiedImpactUrgencyMatrix";
import { JurisdictionHeatMap } from "./JurisdictionHeatMap";
import { JurisdictionAnalyticsDashboard } from "./jurisdiction/JurisdictionAnalyticsDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Target } from "lucide-react";

import {
  enrichedUSAData,
  enrichedCanadaData,
  enrichedJapanData,
  enrichedKoreaData,
  enrichedTaiwanData,
  enrichedEUData,
  enrichedGCCData,
  enrichedPeruData,
} from "@/data/enrichedMockData";
import { enrichedCostaRicaData } from "@/data/enrichedMockData";

// Default filters
const defaultFilters: AnalyticsFilters = {
  dateRange: "90",
  jurisdictions: [],
  riskLevels: [],
  lifecycle: "all",
  categories: [],
};

// Jurisdiction mappings for analytics
const jurisdictionDataMap: Record<string, { data: UnifiedLegislationItem[]; name: string }> = {
  "USA": { data: enrichedUSAData, name: "United States" },
  "Canada": { data: enrichedCanadaData, name: "Canada" },
  "Japan": { data: enrichedJapanData, name: "Japan" },
  "Korea": { data: enrichedKoreaData, name: "South Korea" },
  "Taiwan": { data: enrichedTaiwanData, name: "Taiwan" },
  "EU": { data: enrichedEUData, name: "European Union" },
  "GCC": { data: enrichedGCCData, name: "GCC Countries" },
  "Peru": { data: enrichedPeruData, name: "Peru" },
  "CR": { data: enrichedCostaRicaData, name: "Costa Rica" },
};

export function AnalyticsDashboard() {
  const [filters, setFilters] = useState<AnalyticsFilters>(defaultFilters);
  const [analyticsView, setAnalyticsView] = useState<"overview" | "jurisdiction">("overview");
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>("USA");

  // Aggregate all legislation data
  const allData = useMemo<UnifiedLegislationItem[]>(() => {
    return [
      ...enrichedUSAData,
      ...enrichedCanadaData,
      ...enrichedJapanData,
      ...enrichedKoreaData,
      ...enrichedTaiwanData,
      ...enrichedEUData,
      ...enrichedGCCData,
      ...enrichedCostaRicaData,
      ...enrichedPeruData,
    ];
  }, []);

  // Apply filters
  const filteredData = useMemo(() => {
    let data = [...allData];

    // Date range filter
    if (filters.dateRange !== "all") {
      const days = parseInt(filters.dateRange);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      data = data.filter((item) => {
        const itemDate = new Date(item.publishedDate || item.effectiveDate || "");
        return itemDate >= cutoffDate;
      });
    }

    // Jurisdiction filter
    if (filters.jurisdictions.length > 0) {
      data = data.filter((item) => 
        filters.jurisdictions.includes(item.region) ||
        filters.jurisdictions.includes(item.jurisdictionCode)
      );
    }

    // Risk level filter
    if (filters.riskLevels.length > 0) {
      data = data.filter((item) => filters.riskLevels.includes(item.riskLevel));
    }

    // Lifecycle filter
    if (filters.lifecycle !== "all") {
      if (filters.lifecycle === "in-force") {
        data = data.filter((item) => item.isInForce);
      } else if (filters.lifecycle === "pipeline") {
        data = data.filter((item) => item.isPipeline);
      }
    }

    // Category filter
    if (filters.categories.length > 0) {
      data = data.filter((item) => 
        item.regulatoryCategory && filters.categories.includes(item.regulatoryCategory)
      );
    }

    return data;
  }, [allData, filters]);

  // Get jurisdiction-specific data
  const jurisdictionData = useMemo(() => {
    return jurisdictionDataMap[selectedJurisdiction]?.data || [];
  }, [selectedJurisdiction]);

  const jurisdictionName = jurisdictionDataMap[selectedJurisdiction]?.name || selectedJurisdiction;

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <Tabs value={analyticsView} onValueChange={(v) => setAnalyticsView(v as "overview" | "jurisdiction")}>
        <div className="flex items-center justify-between">
          <TabsList className="bg-muted/30">
            <TabsTrigger value="overview" className="gap-2">
              <Target className="h-4 w-4" />
              Impact & Risk Overview
            </TabsTrigger>
            <TabsTrigger value="jurisdiction" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Jurisdiction Behavior
            </TabsTrigger>
          </TabsList>
          
          {analyticsView === "jurisdiction" && (
            <select
              value={selectedJurisdiction}
              onChange={(e) => setSelectedJurisdiction(e.target.value)}
              className="h-9 px-3 rounded-md border border-border bg-background text-sm"
            >
              {Object.entries(jurisdictionDataMap).map(([code, { name }]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          )}
        </div>
        
        {/* Overview Tab - Impact & Urgency Focus */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Filter Bar */}
          <AnalyticsFilterBar
            filters={filters}
            onFiltersChange={setFilters}
            totalItems={allData.length}
            filteredItems={filteredData.length}
          />

          {/* KPI Row */}
          <AnalyticsKPIRow data={filteredData} allData={allData} />

          {/* Main Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Impact vs Urgency Matrix */}
            <div className="lg:col-span-2">
              <UnifiedImpactUrgencyMatrix data={filteredData} />
            </div>

            {/* Jurisdiction Heat Map */}
            <div className="lg:col-span-2">
              <JurisdictionHeatMap data={filteredData} />
            </div>
          </div>
        </TabsContent>
        
        {/* Jurisdiction Behavior Tab - New Analytics */}
        <TabsContent value="jurisdiction" className="mt-6">
          <JurisdictionAnalyticsDashboard
            data={jurisdictionData}
            jurisdictionCode={selectedJurisdiction}
            jurisdictionName={jurisdictionName}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
