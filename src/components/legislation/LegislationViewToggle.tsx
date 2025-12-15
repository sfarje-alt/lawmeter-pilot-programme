import { Button } from "@/components/ui/button";
import { Map, List, Focus, Grid3X3 } from "lucide-react";
import { cn } from "@/lib/utils";

export type LegislationViewMode = "alerts" | "map-insights" | "focus";

interface LegislationViewToggleProps {
  mode: LegislationViewMode;
  onModeChange: (mode: LegislationViewMode) => void;
}

export function LegislationViewToggle({ mode, onModeChange }: LegislationViewToggleProps) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50 border border-border/50">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onModeChange("alerts")}
        className={cn(
          "gap-2 px-3",
          mode === "alerts" && "bg-background shadow-sm"
        )}
      >
        <List className="w-4 h-4" />
        Alerts
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onModeChange("map-insights")}
        className={cn(
          "gap-2 px-3",
          mode === "map-insights" && "bg-background shadow-sm"
        )}
      >
        <Map className="w-4 h-4" />
        Map + Insights
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onModeChange("focus")}
        className={cn(
          "gap-2 px-3",
          mode === "focus" && "bg-background shadow-sm"
        )}
      >
        <Focus className="w-4 h-4" />
        Focus
      </Button>
    </div>
  );
}
