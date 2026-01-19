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
}

export function KanbanColumn({ id, label, color, alerts, onAlertClick }: KanbanColumnProps) {
  return (
    <div className="flex flex-col min-w-[300px] max-w-[300px] bg-card/30 rounded-lg border border-border/30">
      {/* Column Header */}
      <div className="flex items-center gap-2 p-3 border-b border-border/30">
        <div className={`w-2 h-2 rounded-full ${color}`} />
        <h3 className="text-sm font-medium text-foreground truncate">{label}</h3>
        <Badge variant="secondary" className="ml-auto text-xs">
          {alerts.length}
        </Badge>
      </div>

      {/* Column Content */}
      <ScrollArea className="flex-1 p-2">
        <div className="flex flex-col gap-2">
          {alerts.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No hay alertas
            </div>
          ) : (
            alerts.map((alert) => (
              <InboxAlertCard
                key={alert.id}
                alert={alert}
                onClick={() => onAlertClick(alert)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
