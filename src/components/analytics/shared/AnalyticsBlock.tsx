import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Info, ChevronRight, AlertCircle, Maximize2, Calendar, Database } from "lucide-react";
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
  /** Optional render function for the expanded view. Receives a flag indicating expanded mode. Falls back to `children`. */
  renderExpanded?: () => React.ReactNode;
}

/**
 * Base component for all analytics blocks.
 * Provides consistent structure: title, takeaway, chart area, footer with metadata.
 * Expand button opens an immersive BI-style dialog with a much larger chart canvas.
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
  renderExpanded,
}: AnalyticsBlockProps) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <>
      <Card className={cn(
        "border-border/50 bg-card/50 backdrop-blur-sm transition-shadow hover:shadow-lg hover:shadow-primary/5",
        className
      )}>
        <CardContent className={cn(compact ? "p-4" : "p-6")}>
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
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        onClick={() => setExpanded(true)}
                      >
                        <Maximize2 className="h-3.5 w-3.5" />
                        <span className="sr-only">Explorar a pantalla completa</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Explorar</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted/50"
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
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {timeframe}
              </span>
              <span className="text-border">•</span>
              <span className="flex items-center gap-1">
                <Database className="h-3 w-3" />
                {source}
              </span>
            </div>

            {onDrilldown && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-primary hover:text-primary/80 hover:bg-primary/10"
                onClick={onDrilldown}
              >
                Ver alertas
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Expanded BI-style Dialog */}
      {expandable && (
        <Dialog open={expanded} onOpenChange={setExpanded}>
          <DialogContent
            className={cn(
              "max-w-[min(96vw,1400px)] w-[96vw] h-[92vh] max-h-[92vh]",
              "p-0 gap-0 flex flex-col overflow-hidden bg-background"
            )}
          >
            <DialogHeader className="px-6 py-4 border-b border-border bg-card/50 flex-shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  {icon && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      {icon}
                    </div>
                  )}
                  <div className="min-w-0">
                    <DialogTitle className="text-xl font-semibold text-foreground">
                      {title}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground mt-1">
                      {takeaway}
                    </DialogDescription>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant="outline" className="text-xs gap-1">
                    <Calendar className="h-3 w-3" />
                    {timeframe}
                  </Badge>
                  <Badge variant="outline" className="text-xs gap-1">
                    <Database className="h-3 w-3" />
                    {source}
                  </Badge>
                </div>
              </div>
            </DialogHeader>

            {/* Expanded chart canvas — much larger */}
            <div className="flex-1 overflow-auto px-8 py-6 bg-background">
              <div className="h-full min-h-[500px] w-full">
                {renderExpanded ? renderExpanded() : children}
              </div>
            </div>

            {/* Footer with explanation + drilldown */}
            <div className="flex items-center justify-between gap-4 px-6 py-3 border-t border-border bg-card/50 flex-shrink-0 text-xs">
              <div className="flex items-start gap-2 text-muted-foreground max-w-2xl">
                <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                <span>{infoTooltip}</span>
              </div>
              {onDrilldown && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    setExpanded(false);
                    onDrilldown();
                  }}
                >
                  Ver alertas
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              )}
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
