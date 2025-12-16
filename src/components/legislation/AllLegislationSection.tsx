import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Grid, List, Globe } from "lucide-react";
import { UnifiedLegislationCard } from "./UnifiedLegislationCard";
import { SimplifiedLegislationFilters, defaultSimplifiedFilters } from "./SimplifiedLegislationFilters";
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";
import { RegionEmptyState } from "@/components/regions/RegionEmptyState";
import { useReadAlerts } from "@/hooks/useReadAlerts";
import { useStarredBills } from "@/hooks/useStarredBills";
import { cn } from "@/lib/utils";
import { usaConfig, euConfig, gccConfig, japanConfig } from "@/config/jurisdictionConfig";
import { costaRicaConfig, koreaConfig, taiwanConfig, peruConfig } from "@/config/countryConfigs";

interface AllLegislationSectionProps {
  items: UnifiedLegislationItem[];
  onItemClick?: (item: UnifiedLegislationItem) => void;
}

export function AllLegislationSection({
  items,
  onItemClick
}: AllLegislationSectionProps) {
  const [filters, setFilters] = useState(defaultSimplifiedFilters);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  
  const { markAsRead, toggleRead, isRead, deleteAlert, isDeleted } = useReadAlerts();
  const { isStarred, toggleStar } = useStarredBills();

  // Get config for an item based on its region/jurisdiction
  const getConfigForItem = (item: UnifiedLegislationItem) => {
    const itemRegion = item.region;
    if (itemRegion === "LATAM") {
      if (item.jurisdictionCode === "Peru") return peruConfig;
      return costaRicaConfig;
    } else if (itemRegion === "APAC") {
      if (item.jurisdictionCode === "Japan") return japanConfig;
      if (item.jurisdictionCode === "Korea") return koreaConfig;
      return taiwanConfig;
    } else if (itemRegion === "EU") {
      return euConfig;
    } else if (itemRegion === "GCC") {
      return gccConfig;
    } else if (item.jurisdictionCode === "Canada") {
      return usaConfig; // Canada uses similar config
    }
    return usaConfig;
  };

  // Filter items based on current filters
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (isDeleted(item.id)) return false;
      
      // Lifecycle filter
      if (filters.lifecycle === "in-force" && !item.isInForce) return false;
      if (filters.lifecycle === "pipeline" && item.isInForce) return false;
      
      // Risk level filter
      if (filters.riskLevels.length > 0 && !filters.riskLevels.includes(item.riskLevel)) return false;
      
      // Deadline filter
      if (filters.deadlinePreset !== "none" && item.complianceDeadline) {
        const deadline = new Date(item.complianceDeadline);
        const now = new Date();
        const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        switch (filters.deadlinePreset) {
          case "7days": if (diffDays < 0 || diffDays > 7) return false; break;
          case "30days": if (diffDays < 0 || diffDays > 30) return false; break;
          case "90days": if (diffDays < 0 || diffDays > 90) return false; break;
          case "overdue": if (diffDays >= 0) return false; break;
        }
      }
      
      return true;
    });
  }, [items, filters, isDeleted]);

  // Sort items
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      switch (filters.sortBy) {
        case "date-desc":
          const dateADesc = new Date(a.publishedDate || a.effectiveDate || "").getTime();
          const dateBDesc = new Date(b.publishedDate || b.effectiveDate || "").getTime();
          return dateBDesc - dateADesc;
        case "date-asc":
          const dateAAsc = new Date(a.publishedDate || a.effectiveDate || "").getTime();
          const dateBAsc = new Date(b.publishedDate || b.effectiveDate || "").getTime();
          return dateAAsc - dateBAsc;
        case "risk-desc":
          return b.riskScore - a.riskScore;
        case "risk-asc":
          return a.riskScore - b.riskScore;
        case "deadline":
          const deadlineA = a.complianceDeadline ? new Date(a.complianceDeadline).getTime() : Infinity;
          const deadlineB = b.complianceDeadline ? new Date(b.complianceDeadline).getTime() : Infinity;
          return deadlineA - deadlineB;
        default:
          return 0;
      }
    });
  }, [filteredItems, filters.sortBy]);

  // Counts for filter tabs
  const counts = useMemo(() => ({
    all: items.filter(i => !isDeleted(i.id)).length,
    inForce: items.filter(i => !isDeleted(i.id) && i.isInForce).length,
    pipeline: items.filter(i => !isDeleted(i.id) && !i.isInForce).length
  }), [items, isDeleted]);

  // Unread count
  const unreadCount = useMemo(() => 
    sortedItems.filter(i => !isRead(i.id)).length
  , [sortedItems, isRead]);

  return (
    <div className="space-y-6">
      {/* All Legislation Header - Neutral styling */}
      <div className="relative overflow-hidden rounded-lg border p-4 bg-card">
        {/* Subtle gradient overlay - neutral purple/indigo */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.3), hsl(var(--muted) / 0.5))" }}
        />
        
        {/* Header content */}
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-primary">
                  All Legislation
                </h3>
                <Badge 
                  variant="outline" 
                  className="text-[10px] font-bold tracking-wider px-1.5 py-0 border-primary text-primary"
                >
                  ALL
                </Badge>
                {unreadCount > 0 && (
                  <Badge className="text-[10px] px-1.5 py-0 bg-primary text-primary-foreground">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                All jurisdictions - Regulatory Monitoring
              </p>
            </div>
          </div>
          
          {/* Region full name */}
          <div className="hidden md:block text-right">
            <span className="text-xs text-muted-foreground">Global Coverage</span>
          </div>
        </div>
      </div>

      {/* Simplified Filters */}
      <SimplifiedLegislationFilters
        filters={filters}
        onFiltersChange={setFilters}
        counts={counts}
      />

      {/* View Mode Toggle + Results Count */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{sortedItems.length}</span> results
          {unreadCount > 0 && (
            <span className="ml-2">
              (<span className="text-primary">{unreadCount} unread</span>)
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Items */}
      {sortedItems.length === 0 ? (
        <RegionEmptyState region="NAM" />
      ) : (
        <div className={cn(
          viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            : "space-y-4"
        )}>
          {sortedItems.map((item) => {
            const config = getConfigForItem(item);
            return (
              <UnifiedLegislationCard
                key={item.id}
                item={item}
                config={config}
                isRead={isRead(item.id)}
                isStarred={isStarred(item.id)}
                onMarkRead={() => toggleRead(item.id)}
                onToggleStar={() => toggleStar(item.id)}
                onDelete={() => deleteAlert(item.id)}
                onViewDetails={() => {
                  markAsRead(item.id);
                  onItemClick?.(item);
                }}
                viewMode={viewMode}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AllLegislationSection;
