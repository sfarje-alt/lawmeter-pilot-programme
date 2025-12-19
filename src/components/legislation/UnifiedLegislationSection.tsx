import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Grid, List, Loader2 } from "lucide-react";
import { UnifiedLegislationCard } from "./UnifiedLegislationCard";
import { UnifiedLegislationFilters, UnifiedFilterToggleButton } from "./UnifiedLegislationFilters";
import { 
  UnifiedLegislationItem, 
  UnifiedFilterState, 
  defaultFilterState,
  UnifiedFilterPreset 
} from "@/types/unifiedLegislation";
import { JurisdictionConfig } from "@/config/jurisdictionConfig";
import { RegionEmptyState } from "@/components/regions/RegionEmptyState";
import { useReadAlerts } from "@/hooks/useReadAlerts";
import { useStarredBills } from "@/hooks/useStarredBills";
import { cn } from "@/lib/utils";
import { regionThemes } from "@/components/regions/RegionConfig";

interface UnifiedLegislationSectionProps {
  config: JurisdictionConfig;
  items: UnifiedLegislationItem[];
  loading?: boolean;
  error?: string | null;
  presets?: UnifiedFilterPreset[];
  categories?: string[];
  onItemClick?: (item: UnifiedLegislationItem) => void;
  title?: string;
  subtitle?: string;
  prioritizeRealData?: boolean; // Sort items with originalData first
  initialSubnationalFilter?: string | null; // Pre-selected state/province from map
  onClearSubnationalFilter?: () => void; // Callback to clear the filter
}

export function UnifiedLegislationSection({
  config,
  items,
  loading = false,
  error = null,
  presets = [],
  categories = [],
  onItemClick,
  title,
  subtitle,
  prioritizeRealData = false,
  initialSubnationalFilter = null,
  onClearSubnationalFilter
}: UnifiedLegislationSectionProps) {
  const [filters, setFilters] = useState<UnifiedFilterState>(defaultFilterState);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [activePresetId, setActivePresetId] = useState<string | undefined>();
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  const { markAsRead, toggleRead, isRead, deleteAlert, isDeleted } = useReadAlerts();
  const { isStarred, toggleStar } = useStarredBills();
  
  const theme = regionThemes[config.region];

  // Apply preset
  const applyPreset = useCallback((preset: UnifiedFilterPreset) => {
    setActivePresetId(preset.id);
    setFilters({
      ...defaultFilterState,
      ...preset.filters
    });
  }, []);

  // Filter items based on current filters
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (isDeleted(item.id)) return false;
      
      // Initial subnational filter from map click (takes priority)
      if (initialSubnationalFilter) {
        if (!item.subnationalUnit || item.subnationalUnit !== initialSubnationalFilter) return false;
      }
      
      // Lifecycle filter
      if (filters.lifecycle === "in-force" && !item.isInForce) return false;
      if (filters.lifecycle === "pipeline" && item.isInForce) return false;
      
      // Jurisdiction level filter
      if (filters.jurisdictionLevel !== "all" && item.jurisdictionLevel !== filters.jurisdictionLevel) return false;
      
      // Instrument type filter
      if (filters.instrumentTypes.length > 0 && !filters.instrumentTypes.includes(item.instrumentType)) return false;
      
      // Hierarchy level filter
      if (filters.hierarchyLevels.length > 0 && !filters.hierarchyLevels.includes(item.hierarchyLevel)) return false;
      
      // Subnational unit filter (only apply if no initial filter from map)
      if (!initialSubnationalFilter && filters.subnationalUnits.length > 0) {
        if (!item.subnationalUnit || !filters.subnationalUnits.includes(item.subnationalUnit)) return false;
      }
      
      // Risk level filter
      if (filters.riskLevels.length > 0 && !filters.riskLevels.includes(item.riskLevel)) return false;
      
      // Category filter
      if (filters.categories.length > 0) {
        const itemCat = item.policyArea || item.regulatoryCategory || "";
        if (!filters.categories.some(cat => itemCat.toLowerCase().includes(cat.toLowerCase()))) return false;
      }
      
      // Authority filter
      if (filters.authorities.length > 0 && !filters.authorities.includes(item.authority)) return false;
      
      // Search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const searchable = `${item.title} ${item.summary || ""} ${item.identifier}`.toLowerCase();
        if (!searchable.includes(query)) return false;
      }
      
      // Deadline filter
      if (filters.deadlinePreset !== "none" && item.complianceDeadline) {
        const deadline = new Date(item.complianceDeadline);
        const now = new Date();
        const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        switch (filters.deadlinePreset) {
          case "next-30": if (diffDays < 0 || diffDays > 30) return false; break;
          case "next-60": if (diffDays < 0 || diffDays > 60) return false; break;
          case "next-90": if (diffDays < 0 || diffDays > 90) return false; break;
          case "this-quarter": {
            const quarterEnd = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 + 3, 0);
            if (deadline < now || deadline > quarterEnd) return false;
            break;
          }
        }
      }
      
      return true;
    });
  }, [items, filters, isDeleted, initialSubnationalFilter]);

  // Sort items - prioritize real data if enabled
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      // First, prioritize items with originalData (real API data) if enabled
      if (prioritizeRealData) {
        const aHasOriginal = !!a.originalData;
        const bHasOriginal = !!b.originalData;
        if (aHasOriginal && !bHasOriginal) return -1;
        if (!aHasOriginal && bHasOriginal) return 1;
      }
      
      const multiplier = filters.sortOrder === "asc" ? 1 : -1;
      
      switch (filters.sortBy) {
        case "date":
          const dateA = new Date(a.publishedDate || a.effectiveDate || "").getTime();
          const dateB = new Date(b.publishedDate || b.effectiveDate || "").getTime();
          return (dateB - dateA) * multiplier;
        case "risk":
          return (b.riskScore - a.riskScore) * multiplier;
        case "deadline":
          const deadlineA = a.complianceDeadline ? new Date(a.complianceDeadline).getTime() : Infinity;
          const deadlineB = b.complianceDeadline ? new Date(b.complianceDeadline).getTime() : Infinity;
          return (deadlineA - deadlineB) * multiplier;
        default:
          return 0;
      }
    });
  }, [filteredItems, filters.sortBy, filters.sortOrder, prioritizeRealData]);

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

  // Active filter count for badge
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.instrumentTypes.length > 0) count++;
    if (filters.hierarchyLevels.length > 0) count++;
    if (filters.statuses.length > 0) count++;
    if (filters.subnationalUnits.length > 0) count++;
    if (filters.riskLevels.length > 0) count++;
    if (filters.categories.length > 0) count++;
    if (filters.authorities.length > 0) count++;
    if (filters.deadlinePreset !== "none") count++;
    return count;
  }, [filters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: theme.primaryColor }} />
        <span className="ml-3 text-muted-foreground">Loading legislation...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-destructive">
        <p>Error loading legislation: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active State/Province Filter Badge */}
      {initialSubnationalFilter && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg border" style={{
          borderColor: `${theme.primaryColor}40`,
          backgroundColor: `${theme.primaryColor}10`
        }}>
          <span className="text-sm text-muted-foreground">Filtered to:</span>
          <Badge 
            className="gap-1 cursor-pointer hover:opacity-80"
            style={{ backgroundColor: theme.primaryColor }}
            onClick={onClearSubnationalFilter}
          >
            {initialSubnationalFilter}
            <span className="ml-1">×</span>
          </Badge>
          <span className="text-xs text-muted-foreground">(Click badge to clear)</span>
        </div>
      )}

      {/* View Mode Toggle + Results Count + Filter Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{sortedItems.length}</span> results
            {unreadCount > 0 && (
              <span className="ml-2">
                (<span style={{ color: theme.primaryColor }}>{unreadCount} unread</span>)
              </span>
            )}
          </div>
          <UnifiedFilterToggleButton
            isOpen={filtersOpen}
            onToggle={() => setFiltersOpen(!filtersOpen)}
            activeFilterCount={activeFilterCount}
            primaryColor={theme.primaryColor}
          />
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

      {/* Collapsible Filters */}
      <UnifiedLegislationFilters
        config={config}
        filters={filters}
        onFiltersChange={setFilters}
        counts={counts}
        presets={presets}
        activePresetId={activePresetId}
        onApplyPreset={applyPreset}
        categories={categories}
        isOpen={filtersOpen}
        onOpenChange={setFiltersOpen}
      />

      {/* Items */}
      {sortedItems.length === 0 ? (
        <RegionEmptyState region={config.region} />
      ) : (
        <div className={cn(
          viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            : "space-y-4"
        )}>
          {sortedItems.map((item) => (
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
          ))}
        </div>
      )}
    </div>
  );
}

export default UnifiedLegislationSection;
