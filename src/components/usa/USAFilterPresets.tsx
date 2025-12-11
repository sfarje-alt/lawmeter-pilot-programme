import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { 
  Bookmark, 
  AlertTriangle, 
  FileText, 
  Scale, 
  MapPin,
  Sparkles
} from "lucide-react";
import { USFilterPreset, LifecycleStatus, JurisdictionLevel, USBranch, USInstrumentType, RiskLevel, DeadlinePreset } from "@/types/usaLegislation";

// Default presets for common US compliance workflows
export const DEFAULT_US_PRESETS: USFilterPreset[] = [
  {
    id: "federal-rulemakings-high-risk",
    name: "Federal Rulemakings (High Risk)",
    description: "High-risk federal agency rulemakings with deadlines in next 90 days",
    filters: {
      level: "federal",
      branch: "executive",
      instrumentTypes: ["agency-rulemaking"],
      riskLevels: ["high"],
      deadlinePreset: "next-90"
    }
  },
  {
    id: "congress-bills-pipeline",
    name: "Congress Bills (Pipeline)",
    description: "Active Congressional bills in progress",
    filters: {
      lifecycle: "pipeline",
      level: "federal",
      branch: "legislative",
      instrumentTypes: ["congress-bill"]
    }
  },
  {
    id: "state-privacy-bills",
    name: "State Privacy Bills (CA, NY, TX)",
    description: "Privacy-related state bills in major jurisdictions",
    filters: {
      level: "state",
      states: ["CA", "NY", "TX"],
      instrumentTypes: ["congress-bill"],
      lifecycle: "pipeline"
    }
  },
  {
    id: "high-risk-all",
    name: "All High Risk Items",
    description: "All high-risk legislation across all levels",
    filters: {
      riskLevels: ["high"]
    }
  },
  {
    id: "deadlines-next-30",
    name: "Deadlines Next 30 Days",
    description: "Items with compliance deadlines in the next 30 days",
    filters: {
      deadlinePreset: "next-30"
    }
  }
];

interface USAFilterPresetsProps {
  onApplyPreset: (filters: USFilterPreset['filters']) => void;
  activePresetId?: string;
}

export function USAFilterPresets({ onApplyPreset, activePresetId }: USAFilterPresetsProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Quick Views</span>
      </div>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-2">
          {DEFAULT_US_PRESETS.map((preset) => (
            <Button
              key={preset.id}
              variant={activePresetId === preset.id ? "default" : "outline"}
              size="sm"
              className="h-8 px-3 flex-shrink-0 gap-2"
              onClick={() => onApplyPreset(preset.filters)}
            >
              {getPresetIcon(preset)}
              <span className="text-xs">{preset.name}</span>
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

function getPresetIcon(preset: USFilterPreset) {
  if (preset.filters.riskLevels?.includes("high")) {
    return <AlertTriangle className="h-3.5 w-3.5" />;
  }
  if (preset.filters.branch === "legislative") {
    return <FileText className="h-3.5 w-3.5" />;
  }
  if (preset.filters.level === "state") {
    return <MapPin className="h-3.5 w-3.5" />;
  }
  if (preset.filters.deadlinePreset) {
    return <Scale className="h-3.5 w-3.5" />;
  }
  return <Bookmark className="h-3.5 w-3.5" />;
}
