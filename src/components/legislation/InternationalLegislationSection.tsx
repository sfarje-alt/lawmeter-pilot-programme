import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InternationalLegislation, LegislativeCategory, filterByLegislativeCategory } from "@/data/mockInternationalLegislation";
import { InternationalLegislationCard } from "./InternationalLegislationCard";
import { FileText, Gavel, LayoutList, Map } from "lucide-react";
import { USStatesMap, CanadaProvincesMap, GCCRegionMap, GlobalJurisdictionMap } from "@/components/maps";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

interface InternationalLegislationSectionProps {
  legislation: InternationalLegislation[];
  title?: string;
  showDemo?: boolean;
  showCategoryFilter?: boolean;
  pendingLabel?: string;
  enactedLabel?: string;
  showMaps?: boolean;
  mapType?: "global" | "usa" | "canada" | "gcc";
}

export function InternationalLegislationSection({ 
  legislation, 
  title,
  showDemo = true,
  showCategoryFilter = true,
  pendingLabel = "Pending Bills",
  enactedLabel = "Enacted Laws",
  showMaps = false,
  mapType = "global"
}: InternationalLegislationSectionProps) {
  const [categoryFilter, setCategoryFilter] = useState<LegislativeCategory | "all">("all");
  const [mapsOpen, setMapsOpen] = useState(true);
  
  const filteredLegislation = filterByLegislativeCategory(legislation, categoryFilter);
  
  const kpis = {
    total: filteredLegislation.length,
    high: filteredLegislation.filter(l => l.riskLevel === "high").length,
    medium: filteredLegislation.filter(l => l.riskLevel === "medium").length,
    low: filteredLegislation.filter(l => l.riskLevel === "low").length,
  };

  const categoryStats = {
    pending: legislation.filter(l => l.legislativeCategory === "pending").length,
    enacted: legislation.filter(l => l.legislativeCategory === "enacted").length,
  };

  return (
    <div className="space-y-6">
      {showDemo && (
        <div className="bg-warning/10 border border-warning rounded-lg p-4">
          <div className="flex gap-2">
            <span className="text-warning">⚡</span>
            <div>
              <p className="font-semibold">Smart Kettle & Espresso Machine Compliance</p>
              <p className="text-sm text-muted-foreground">
                Legislation filtered for relevance to smart kettles and espresso machine manufacturers.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Category Filter Tabs */}
      {showCategoryFilter && (
        <Tabs value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as LegislativeCategory | "all")} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="all" className="gap-2">
              <LayoutList className="w-4 h-4" />
              All ({legislation.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="gap-2">
              <FileText className="w-4 h-4" />
              {pendingLabel} ({categoryStats.pending})
            </TabsTrigger>
            <TabsTrigger value="enacted" className="gap-2">
              <Gavel className="w-4 h-4" />
              {enactedLabel} ({categoryStats.enacted})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.total}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">High Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-risk-high">{kpis.high}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Medium Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-risk-medium">{kpis.medium}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Low Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-risk-low">{kpis.low}</div>
          </CardContent>
        </Card>
      </div>

      {/* Maps Section */}
      {showMaps && (
        <Collapsible open={mapsOpen} onOpenChange={setMapsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Map className="w-4 h-4" />
                Alert Distribution Map
              </span>
              <span className="text-muted-foreground text-xs">
                {mapsOpen ? "Click to collapse" : "Click to expand"}
              </span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            {mapType === "global" && <GlobalJurisdictionMap legislation={legislation} />}
            {mapType === "usa" && <USStatesMap legislation={legislation} />}
            {mapType === "canada" && <CanadaProvincesMap legislation={legislation} />}
            {mapType === "gcc" && <GCCRegionMap legislation={legislation} />}
          </CollapsibleContent>
        </Collapsible>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLegislation.map((item) => (
          <InternationalLegislationCard key={item.id} legislation={item} />
        ))}
      </div>

      {filteredLegislation.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No legislation found for this filter.
        </div>
      )}
    </div>
  );
}
