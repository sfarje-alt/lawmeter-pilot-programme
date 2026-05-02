// Render vertical de las 4 zonas (Acción/Monitorear/Bajo/Rezagadas) para un set
// de alertas, con cabeceras colapsables idénticas a las del KanbanColumn.

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronDown, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { PeruAlert } from "@/data/peruAlertsMockData";
import { InboxAlertCard } from "./InboxAlertCard";
import { classifyCard, ZONE_META, ZONE_ORDER, CardZone } from "@/lib/alertClassification";

interface EntityZoneStackProps {
  alerts: PeruAlert[];
  onAlertClick: (a: PeruAlert) => void;
  onTogglePin?: (alertId: string) => void;
  onArchive?: (alertId: string) => void;
  onUnarchive?: (alertId: string) => void;
  isArchiveView?: boolean;
  unreadIds?: Set<string>;
}

export function EntityZoneStack({
  alerts,
  onAlertClick,
  onTogglePin,
  onArchive,
  onUnarchive,
  isArchiveView,
  unreadIds,
}: EntityZoneStackProps) {
  const byZone = useMemo(() => {
    const grouped: Record<CardZone, PeruAlert[]> = {
      action: [],
      monitor: [],
      low: [],
      lagging: [],
    };
    alerts.forEach((a) => grouped[classifyCard(a)].push(a));
    return grouped;
  }, [alerts]);

  const [openZones, setOpenZones] = useState<Record<CardZone, boolean>>({
    action: true,
    monitor: true,
    low: false,
    lagging: false,
  });

  const toggleZone = (z: CardZone) => setOpenZones((p) => ({ ...p, [z]: !p[z] }));

  const allEmpty = ZONE_ORDER.every((z) => byZone[z].length === 0);
  if (allEmpty) {
    return (
      <div className="text-xs text-muted-foreground italic px-2 py-3">
        No hay alertas que coincidan con los filtros aplicados.
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col gap-3">
        {ZONE_ORDER.map((zone) => {
          const items = byZone[zone];
          if (items.length === 0) return null;
          const meta = ZONE_META[zone];
          const isOpen = openZones[zone];
          return (
            <Collapsible key={zone} open={isOpen} onOpenChange={() => toggleZone(zone)}>
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
                      <Info className="h-3 w-3 text-muted-foreground/70" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="text-xs">{meta.hint}</p>
                    </TooltipContent>
                  </Tooltip>
                  <Badge variant="secondary" className="ml-auto h-4 px-1.5 text-[10px]">
                    {items.length}
                  </Badge>
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-col gap-2 mt-1.5">
                  {items.map((alert) => (
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
        })}
      </div>
    </TooltipProvider>
  );
}
