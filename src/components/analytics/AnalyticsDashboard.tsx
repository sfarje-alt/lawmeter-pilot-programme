import { useState, useMemo } from "react";
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";
import { AnalyticsFilterBar, AnalyticsFilters } from "./AnalyticsFilterBar";
import { AnalyticsKPIRow } from "./AnalyticsKPIRow";
import { UnifiedImpactUrgencyMatrix } from "./UnifiedImpactUrgencyMatrix";
import { JurisdictionHeatMap } from "./JurisdictionHeatMap";
import { RiskTrendChart } from "./RiskTrendChart";
import { CategoryBreakdownChart } from "./CategoryBreakdownChart";
import { CompactDeadlineCalendar } from "./CompactDeadlineCalendar";
import { ComplianceTimeline } from "./ComplianceTimeline";
import {
  enrichedUSAData,
  enrichedCanadaData,
  enrichedJapanData,
  enrichedKoreaData,
  enrichedTaiwanData,
  enrichedEUData,
  enrichedGCCData,
} from "@/data/enrichedMockData";
import { enrichedCostaRicaData } from "@/data/costaRicaEnrichedData";

// Default filters
const defaultFilters: AnalyticsFilters = {
  dateRange: "90",
  jurisdictions: [],
  riskLevels: [],
  lifecycle: "all",
  categories: [],
};

export function AnalyticsDashboard() {
  const [filters, setFilters] = useState<AnalyticsFilters>(defaultFilters);

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

  return (
    <div className="space-y-6">
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
        {/* Impact vs Urgency Matrix - Full Width on Mobile */}
        <div className="lg:col-span-1">
          <UnifiedImpactUrgencyMatrix data={filteredData} />
        </div>

        {/* Jurisdiction Heat Map */}
        <div className="lg:col-span-1">
          <JurisdictionHeatMap data={filteredData} />
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Timeline */}
        <ComplianceTimeline data={filteredData} />

        {/* Risk Trend Over Time */}
        <RiskTrendChart data={filteredData} />
      </div>

      {/* Third Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <CategoryBreakdownChart data={filteredData} />

        {/* Compact Deadline Calendar */}
        <CompactDeadlineCalendar data={filteredData} />
      </div>
    </div>
  );
}
