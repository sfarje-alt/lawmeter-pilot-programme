import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, ChevronRight, AlertCircle, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalyticsBlockProps {
  title: string;
  takeaway: string;
  infoTooltip: string;
  timeframe: string;
  source: string;
  onDrilldown?: () => void;
  isEmpty?: boolean;
  emptyMessage?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
  expandable?: boolean;
}

/**
 * Base component for all analytics blocks.
 * Provides consistent structure: title, takeaway, chart area, footer with metadata.
 */
export function AnalyticsBlock({
  title,
  takeaway,
  infoTooltip,
  timeframe,
  source,
  onDrilldown,
  isEmpty = false,
  emptyMessage = "No hay suficientes datos para mostrar este análisis",
  icon,
  children,
  className,
  compact = false,
  expandable = true,
}: AnalyticsBlockProps) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <>
      <Card className={cn(
        "border-border/50 bg-card/50 backdrop-blur-sm",
        className
      )}>
        <CardContent className={cn("p-0", compact ? "p-4" : "p-6")}>
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {icon && (
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  {icon}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-foreground truncate">
                  {title}
                </h3>
              </div>
            </div>
            
            <div className="flex items-center gap-1 flex-shrink-0">
              {expandable && !isEmpty && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-foreground"
                  onClick={() => setExpanded(true)}
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span className="sr-only">Ver más</span>
                </Button>
              )}
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    >
                      <Info className="h-4 w-4" />
                      <span className="sr-only">Información</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="top" 
                    align="end" 
                    sideOffset={8} 
                    className="max-w-sm z-[100]"
                  >
                    <p className="text-sm">{infoTooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Takeaway */}
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {takeaway}
          </p>

          {/* Content / Chart Area */}
          <div className={cn(
            "relative",
            compact ? "min-h-[120px]" : "min-h-[280px]"
          )}>
            {isEmpty ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <AlertCircle className="h-8 w-8 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">
                  {emptyMessage}
                </p>
              </div>
            ) : (
              children
            )}
          </div>

          {/* Footer */}
          <div className={cn(
            "flex items-center justify-between gap-4 pt-4 mt-4 border-t border-border/30",
            "text-xs text-muted-foreground"
          )}>
            <div className="flex items-center gap-2 flex-wrap">
              <span>Período: {timeframe}</span>
              <span className="text-border">•</span>
              <span>{source}</span>
            </div>
            
            {onDrilldown && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-primary hover:text-primary/80"
                onClick={onDrilldown}
              >
                Ver alertas
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Expanded Dialog */}
      {expandable && (
        <Dialog open={expanded} onOpenChange={setExpanded}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                {icon}
                {title}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">{takeaway}</p>
            </DialogHeader>
            <div className="min-h-[500px] py-4">
              {children}
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/30">
              <div className="flex items-center gap-2">
                <span>Período: {timeframe}</span>
                <span className="text-border">•</span>
                <span>{source}</span>
              </div>
              <p className="text-xs italic">{infoTooltip}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

/**
 * Empty state component for when there's not enough data.
 */
export function AnalyticsEmptyState({
  title,
  message = "No hay suficientes alertas publicadas en este período para mostrar este análisis.",
  suggestion,
}: {
  title: string;
  message?: string;
  suggestion?: string;
}) {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6 text-center">
        <AlertCircle className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
        <h3 className="text-sm font-medium text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-2">{message}</p>
        {suggestion && (
          <p className="text-xs text-muted-foreground/70 italic">{suggestion}</p>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Data freshness indicator to show when data was last updated.
 */
export function DataFreshnessIndicator({
  lastUpdate,
  dataThrough,
  className,
}: {
  lastUpdate: string;
  dataThrough: string;
  className?: string;
}) {
  const formattedDate = new Date(dataThrough).toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  
  return (
    <div className={cn(
      "text-xs text-muted-foreground flex items-center gap-2",
      className
    )}>
      <span>Datos hasta: {formattedDate}</span>
    </div>
  );
}
