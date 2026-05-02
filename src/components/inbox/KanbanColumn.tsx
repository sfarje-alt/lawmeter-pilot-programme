import { useMemo, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronDown, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { PeruAlert } from "@/data/peruAlertsMockData";
import { InboxAlertCard } from "./InboxAlertCard";
import { classifyCard, ZONE_META, ZONE_ORDER, CardZone } from "@/lib/alertClassification";

interface KanbanColumnProps {
  id: string;
  label: string;
  color: string;
  alerts: PeruAlert[];
  onAlertClick: (alert: PeruAlert) => void;
  onTogglePin?: (alertId: string) => void;
  onArchive?: (alertId: string) => void;
  onUnarchive?: (alertId: string) => void;
  isArchiveView?: boolean;
  /** Conjunto de ids de alertas no leídas (estilo "correo no abierto"). */
  unreadIds?: Set<string>;
}

export function KanbanColumn({
  id,
  label,
  color,
  alerts,
  onAlertClick,
  onTogglePin,
  onArchive,
  onUnarchive,
  isArchiveView,
  unreadIds,
}: KanbanColumnProps) {
  // Group alerts by inner zone, preserving input order (already sorted upstream).
  const byZone = useMemo(() => {
    const grouped: Record<CardZone, PeruAlert[]> = {
      action: [],
      monitor: [],
      low: [],
      lagging: [],
    };
    alerts.forEach((a) => {
      grouped[classifyCard(a)].push(a);
    });
    return grouped;
  }, [alerts]);

  // Lagging starts collapsed; others open by default.
  const [openZones, setOpenZones] = useState<Record<CardZone, boolean>>({
    action: true,
    monitor: true,
    low: false,
    lagging: false,
  });

  const toggleZone = (z: CardZone) =>
    setOpenZones((prev) => ({ ...prev, [z]: !prev[z] }));

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col flex-1 min-w-0 basis-0 bg-card/30 rounded-lg border border-border/30 overflow-hidden">
        {/* Column Header */}
        <div className="flex items-center gap-2 p-3 border-b border-border/30">
          <div className={`w-2 h-2 rounded-full ${color}`} />
          <h3 className="text-sm font-medium text-foreground truncate">{label}</h3>
          <Badge variant="secondary" className="ml-auto text-xs">
            {alerts.length}
          </Badge>
        </div>

        {/* Column Content */}
        <ScrollArea className="flex-1 p-2 w-full [&>[data-radix-scroll-area-viewport]]:!block [&>[data-radix-scroll-area-viewport]>div]:!block [&>[data-radix-scroll-area-viewport]>div]:!w-full">
          <div className="flex flex-col gap-3 w-full min-w-0 max-w-full">
            {alerts.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                No hay alertas
              </div>
            ) : (
              ZONE_ORDER.map((zone) => {
                const zoneAlerts = byZone[zone];
                if (zoneAlerts.length === 0) return null;
                const meta = ZONE_META[zone];
                const isOpen = openZones[zone];

                return (
                  <Collapsible
                    key={zone}
                    open={isOpen}
                    onOpenChange={() => toggleZone(zone)}
                  >
                    <CollapsibleTrigger asChild>
                      <button
                        type="button"
                        className="flex items-center gap-1.5 w-full px-1.5 py-1 rounded hover:bg-muted/30 transition-colors"
                      >
                        <ChevronDown
                          className={cn(
                            "h-3 w-3 text-muted-foreground transition-transform",
                            !isOpen && "-rotate-90",
                          )}
                        />
                        <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                        <span className={cn("text-[11px] font-semibold uppercase tracking-wide", meta.text)}>
                          {meta.label}
                        </span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span
                              role="button"
                              tabIndex={0}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex"
                            >
                              <Info className="h-3 w-3 text-muted-foreground/70 hover:text-foreground" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <p className="text-xs leading-snug">{meta.description}</p>
                          </TooltipContent>
                        </Tooltip>
                        <Badge variant="secondary" className="ml-auto h-4 px-1.5 text-[10px]">
                          {zoneAlerts.length}
                        </Badge>
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="flex flex-col gap-2 mt-1.5">
                        {zoneAlerts.map((alert) => (
                          <InboxAlertCard
                            key={`${alert.id}-${alert.status}-${alert.updated_at}`}
                            alert={alert}
                            onClick={() => onAlertClick(alert)}
                            onTogglePin={onTogglePin}
                            onArchive={onArchive}
                            onUnarchive={onUnarchive}
                            isArchiveView={isArchiveView}
                            isUnread={unreadIds ? !unreadIds.has(alert.id) : false}
                          />
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}
