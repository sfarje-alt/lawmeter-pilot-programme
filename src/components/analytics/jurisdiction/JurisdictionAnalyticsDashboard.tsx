// Jurisdiction Behavior Analytics Dashboard - Main Component
import { useState, useMemo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";
import { Calendar, SlidersHorizontal, Info } from "lucide-react";

import { JurisdictionPulseKPIs } from "./JurisdictionPulseKPIs";
import { InstitutionalShapeKPIs } from "./InstitutionalShapeKPIs";
import { ThroughputInstrumentMixChart } from "./ThroughputInstrumentMixChart";
import { LegislativeProcessAnalyticsChart } from "./LegislativeProcessAnalyticsChart";
import { EffectiveDateRunwayChart } from "./EffectiveDateRunwayChart";
import { StabilityChurnChart } from "./StabilityChurnChart";
import { AnalyticsDrilldownSheet } from "./AnalyticsDrilldownSheet";
import { TimeWindow, NormalizeBy, filterByTimeWindow } from "./analyticsUtils";

interface JurisdictionAnalyticsDashboardProps {
  data: UnifiedLegislationItem[];
  jurisdictionCode: string;
  jurisdictionName: string;
}

export function JurisdictionAnalyticsDashboard({
  data,
  jurisdictionCode,
  jurisdictionName
}: JurisdictionAnalyticsDashboardProps) {
  // Controls
  const [timeWindow, setTimeWindow] = useState<TimeWindow>("90");
  const [normalizeBy, setNormalizeBy] = useState<NormalizeBy>("raw");
  
  // Drilldown state
  const [drilldownOpen, setDrilldownOpen] = useState(false);
  const [drilldownTitle, setDrilldownTitle] = useState("");
  const [drilldownDescription, setDrilldownDescription] = useState("");
  const [drilldownItems, setDrilldownItems] = useState<UnifiedLegislationItem[]>([]);
  
  // Filter data by time window
  const filteredData = useMemo(() => {
    return filterByTimeWindow(data, timeWindow);
  }, [data, timeWindow]);
  
  // Handle drilldown from KPIs and charts
  const handleDrilldown = useCallback((
    title: string, 
    description: string, 
    items: UnifiedLegislationItem[]
  ) => {
    setDrilldownTitle(title);
    setDrilldownDescription(description);
    setDrilldownItems(items);
    setDrilldownOpen(true);
  }, []);
  
  // KPI click handler
  const handleKpiClick = useCallback((
    filterId: string, 
    filterDescription: string, 
    items: UnifiedLegislationItem[]
  ) => {
    handleDrilldown(filterDescription, `${items.length} items matching "${filterId}"`, items);
  }, [handleDrilldown]);
  
  // Chart click handlers
  const handleThroughputBarClick = useCallback((
    week: string, 
    type: string, 
    items: UnifiedLegislationItem[]
  ) => {
    handleDrilldown(
      `${type} - Week of ${week}`,
      `Publications of type "${type}" during week of ${week}`,
      items
    );
  }, [handleDrilldown]);
  
  const handleStageBarClick = useCallback((
    stage: string, 
    items: UnifiedLegislationItem[]
  ) => {
    handleDrilldown(
      `Stage: ${stage}`,
      `Bills/proposals currently at stage "${stage}"`,
      items
    );
  }, [handleDrilldown]);
  
  const handleRunwayBarClick = useCallback((
    bucket: string, 
    items: UnifiedLegislationItem[]
  ) => {
    handleDrilldown(
      `Runway: ${bucket}`,
      `Items with implementation runway of ${bucket}`,
      items
    );
  }, [handleDrilldown]);
  
  const handleStabilitySegmentClick = useCallback((
    type: "original" | "amending", 
    items: UnifiedLegislationItem[]
  ) => {
    handleDrilldown(
      type === "amending" ? "Amending Documents" : "Original Documents",
      `${type === "amending" ? "Documents that amend existing legislation" : "New original documents"}`,
      items
    );
  }, [handleDrilldown]);

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card className="bg-card/30 border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {jurisdictionName} Analytics
              </h2>
              <p className="text-sm text-muted-foreground">
                Jurisdiction behavior and regulatory throughput metrics
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Time Window */}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Select value={timeWindow} onValueChange={(v) => setTimeWindow(v as TimeWindow)}>
                  <SelectTrigger className="w-[120px] h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="365">12 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator orientation="vertical" className="h-6" />
              
              {/* Normalize By */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                <Select value={normalizeBy} onValueChange={(v) => setNormalizeBy(v as NormalizeBy)}>
                  <SelectTrigger className="w-[120px] h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="raw">Raw counts</SelectItem>
                    <SelectItem value="per-week">Per week avg</SelectItem>
                    <SelectItem value="percent">Percent share</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* KPI Row 1: Jurisdiction Pulse */}
      <div>
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Jurisdiction Pulse
        </h3>
        <JurisdictionPulseKPIs 
          data={filteredData} 
          timeWindow={timeWindow}
          onKpiClick={handleKpiClick}
        />
      </div>
      
      {/* KPI Row 2: Institutional Shape */}
      <div>
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Institutional Shape
        </h3>
        <InstitutionalShapeKPIs 
          data={filteredData} 
          timeWindow={timeWindow}
          onKpiClick={handleKpiClick}
        />
      </div>
      
      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Block A: Throughput & Instrument Mix */}
        <ThroughputInstrumentMixChart
          data={filteredData}
          jurisdictionCode={jurisdictionCode}
          normalizeBy={normalizeBy}
          onBarClick={handleThroughputBarClick}
        />
        
        {/* Block B: Legislative Process Analytics */}
        <LegislativeProcessAnalyticsChart
          data={filteredData}
          jurisdictionCode={jurisdictionCode}
          onBarClick={handleStageBarClick}
        />
      </div>
      
      {/* Block C: Effective Date Runway */}
      <EffectiveDateRunwayChart
        data={data} // Use full data for runway analysis
        onBarClick={handleRunwayBarClick}
      />
      
      {/* Block D: Stability & Churn (Optional - renders only if data exists) */}
      <StabilityChurnChart
        data={data}
        onSegmentClick={handleStabilitySegmentClick}
      />
      
      {/* Footer Disclaimer */}
      <div className="flex items-start gap-2 p-3 bg-muted/20 rounded-lg border border-border/30">
        <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
        <p className="text-xs text-muted-foreground">
          Informational analytics; may include AI-extracted metadata; verify with official sources. 
          All metrics based on tracked items within selected time window.
        </p>
      </div>
      
      {/* Drilldown Sheet */}
      <AnalyticsDrilldownSheet
        open={drilldownOpen}
        onOpenChange={setDrilldownOpen}
        title={drilldownTitle}
        description={drilldownDescription}
        items={drilldownItems}
      />
    </div>
  );
}
