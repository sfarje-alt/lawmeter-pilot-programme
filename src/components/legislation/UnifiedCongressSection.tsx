// Unified Congress Bills Section - Uses real Congress API data with unified card structure
import { useState, useMemo } from "react";
import { useCongressBills, SortOption } from "@/hooks/useCongressBills";
import { convertCongressBillsToUnified } from "@/lib/congressConverter";
import { UnifiedLegislationSection } from "./UnifiedLegislationSection";
import { usaConfig, FilterPreset } from "@/config/jurisdictionConfig";
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

// USA-specific regulatory categories
const usaCategories = [
  "Product Safety",
  "Radio Regulations", 
  "Cybersecurity",
  "Battery Regulations",
  "Food Contact Material"
];

interface UnifiedCongressSectionProps {
  onItemClick?: (item: UnifiedLegislationItem) => void;
  onCongressBillClick?: (bill: any) => void; // For opening CongressBillDrawer with original data
  initialSubnationalFilter?: string | null; // Pre-selected state from map
  onClearSubnationalFilter?: () => void;
}

export function UnifiedCongressSection({ 
  onItemClick, 
  onCongressBillClick,
  initialSubnationalFilter,
  onClearSubnationalFilter
}: UnifiedCongressSectionProps) {
  const [sortBy] = useState<SortOption>("latestAction-desc");
  const { bills, loading, error } = useCongressBills(sortBy);
  
  // Convert Congress bills to unified format
  const unifiedItems = useMemo(() => {
    if (!bills || bills.length === 0) return [];
    return convertCongressBillsToUnified(bills);
  }, [bills]);
  
  // Handle item click - check if it's a real Congress bill
  const handleItemClick = (item: UnifiedLegislationItem) => {
    // If item has originalData (real Congress bill), use CongressBillDrawer
    if (item.originalData && onCongressBillClick) {
      onCongressBillClick(item.originalData);
    } else if (onItemClick) {
      onItemClick(item);
    }
  };
  
  // Use presets from config
  const presets = usaConfig.filterPresets || [];

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load Congress bills: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <UnifiedLegislationSection
      config={usaConfig}
      items={unifiedItems}
      loading={loading}
      error={error}
      presets={presets}
      categories={usaCategories}
      title="US Congress Bills"
      subtitle="Live data from Congress.gov API (119th Congress)"
      onItemClick={handleItemClick}
      prioritizeRealData={true}
      initialSubnationalFilter={initialSubnationalFilter}
      onClearSubnationalFilter={onClearSubnationalFilter}
    />
  );
}
