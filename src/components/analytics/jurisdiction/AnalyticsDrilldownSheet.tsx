// Analytics Drilldown Sheet - Shows filtered items
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";
import { ExternalLink, FileText, Calendar, Building2, AlertTriangle } from "lucide-react";

interface AnalyticsDrilldownSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  items: UnifiedLegislationItem[];
  onItemClick?: (item: UnifiedLegislationItem) => void;
}

export function AnalyticsDrilldownSheet({
  open,
  onOpenChange,
  title,
  description,
  items,
  onItemClick
}: AnalyticsDrilldownSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-lg">{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
          <Badge variant="outline" className="w-fit">
            {items.length} items
          </Badge>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-180px)] pr-4">
          <div className="space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No items match this filter
              </div>
            ) : (
              items.map(item => (
                <DrilldownItemCard 
                  key={item.id} 
                  item={item} 
                  onClick={() => onItemClick?.(item)}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

interface DrilldownItemCardProps {
  item: UnifiedLegislationItem;
  onClick?: () => void;
}

function DrilldownItemCard({ item, onClick }: DrilldownItemCardProps) {
  const riskColors = {
    high: "bg-red-500/10 text-red-400 border-red-500/30",
    medium: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
  };
  
  return (
    <div 
      className="bg-card/50 border border-border/50 rounded-lg p-4 hover:bg-card/70 transition-colors cursor-pointer"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs">
              {item.identifier}
            </Badge>
            {item.riskLevel && (
              <Badge variant="outline" className={`text-xs ${riskColors[item.riskLevel]}`}>
                {item.riskLevel}
              </Badge>
            )}
          </div>
          <h4 className="font-medium text-sm text-foreground line-clamp-2">
            {item.title}
          </h4>
        </div>
      </div>
      
      {/* Meta info */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
        <div className="flex items-center gap-1">
          <Building2 className="h-3 w-3" />
          <span>{item.authority || "Unknown"}</span>
        </div>
        {item.publishedDate && (
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>
              {new Date(item.publishedDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              })}
            </span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <FileText className="h-3 w-3" />
          <span>{item.instrumentType}</span>
        </div>
      </div>
      
      {/* AI Summary snippet */}
      {item.aiSummary?.whatChanges && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {item.aiSummary.whatChanges}
        </p>
      )}
      
      {/* Footer with source link */}
      <div className="flex items-center justify-between">
        {item.effectiveDate && (
          <div className="flex items-center gap-1 text-xs">
            <AlertTriangle className="h-3 w-3 text-amber-500" />
            <span className="text-amber-500">
              Effective: {new Date(item.effectiveDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              })}
            </span>
          </div>
        )}
        
        {item.sourceUrl && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs gap-1"
            onClick={(e) => {
              e.stopPropagation();
              window.open(item.sourceUrl, "_blank");
            }}
          >
            <ExternalLink className="h-3 w-3" />
            Official Source
          </Button>
        )}
      </div>
    </div>
  );
}
