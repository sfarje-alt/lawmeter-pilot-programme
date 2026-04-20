import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { PeruAlert } from "@/data/peruAlertsMockData";
import { InboxAlertCard } from "./InboxAlertCard";

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
  return (
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
        <div className="flex flex-col gap-2 w-full min-w-0 max-w-full">
          {alerts.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No hay alertas
            </div>
          ) : (
            alerts.map((alert) => (
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
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
