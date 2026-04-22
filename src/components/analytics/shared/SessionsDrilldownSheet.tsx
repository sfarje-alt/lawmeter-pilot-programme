import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, ExternalLink, Mic, Calendar, Building2 } from "lucide-react";
import type { Sesion } from "@/hooks/useSesiones";

interface SessionsDrilldownSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  sessions: Sesion[];
  onSessionClick?: (sessionId: string) => void;
}

const STATUS_LABEL: Record<string, string> = {
  NOT_REQUESTED: "Sin analizar",
  REQUESTED: "Solicitado",
  PROCESSING: "En proceso",
  COMPLETED: "Analizado",
  FAILED: "Falló",
};

/**
 * Drill-down sheet that lists the actual sessions behind a session-analytics
 * chart/metric. Bound to the live `Sesion[]` data passed in.
 */
export function SessionsDrilldownSheet({
  open,
  onOpenChange,
  title,
  description,
  sessions,
  onSessionClick,
}: SessionsDrilldownSheetProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    if (!searchQuery) return sessions;
    const q = searchQuery.toLowerCase();
    return sessions.filter(
      (s) =>
        (s.session_title || "").toLowerCase().includes(q) ||
        (s.commission_name || "").toLowerCase().includes(q) ||
        (STATUS_LABEL[s.analysis_status] || "").toLowerCase().includes(q),
    );
  }, [sessions, searchQuery]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader className="mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onOpenChange(false)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <SheetTitle className="text-lg">{title}</SheetTitle>
          </div>
          {description && (
            <p className="text-sm text-muted-foreground pl-10">{description}</p>
          )}
        </SheetHeader>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar sesiones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="text-sm text-muted-foreground mb-4">
          {filtered.length} de {sessions.length} sesiones
        </div>

        <ScrollArea className="h-[calc(100vh-220px)]">
          <div className="space-y-3 pr-4">
            {filtered.map((s) => (
              <SessionCard
                key={s.id}
                session={s}
                onClick={() => onSessionClick?.(s.id)}
              />
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No se encontraron sesiones</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function SessionCard({
  session,
  onClick,
}: {
  session: Sesion;
  onClick?: () => void;
}) {
  const dateLabel = session.scheduled_at
    ? new Date(session.scheduled_at).toLocaleDateString("es-PE", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : session.scheduled_date_text || null;

  return (
    <div
      className="p-3 rounded-lg border border-border/50 bg-card/50 hover:bg-muted/50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Mic className="h-4 w-4 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-foreground line-clamp-2 mb-1">
            {session.session_title || session.commission_name}
          </h4>

          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs gap-1">
              <Building2 className="h-3 w-3" />
              {session.commission_name}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {STATUS_LABEL[session.analysis_status] || "Sin analizar"}
            </Badge>
            {(session.area_de_interes || []).slice(0, 2).map((a) => (
              <Badge key={a} variant="outline" className="text-xs">
                {a}
              </Badge>
            ))}
          </div>

          {dateLabel && (
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {dateLabel}
            </p>
          )}
        </div>

        {session.video_url && (
          <a
            href={session.video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 p-1.5 rounded hover:bg-muted"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </a>
        )}
      </div>
    </div>
  );
}
