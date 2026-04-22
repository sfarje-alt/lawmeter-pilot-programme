// Card for one Sesion in the bandeja
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Youtube, ExternalLink, Sparkles, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Sesion } from "@/hooks/useSesiones";

interface Props {
  sesion: Sesion;
  onOpen: () => void;
}

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  try {
    return format(new Date(iso), "d MMM yyyy · HH:mm", { locale: es });
  } catch {
    return iso;
  }
}

export function SesionCard({ sesion, onOpen }: Props) {
  const status = sesion.analysis_status;

  return (
    <Card
      className="p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onOpen}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg">🎥</span>
          <Badge variant="outline" className="truncate">
            {sesion.commission_name}
          </Badge>
        </div>
        {sesion.video_url && (
          <Badge variant="secondary" className="shrink-0">
            <Youtube className="h-3 w-3 mr-1" />
            Video
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
        <Calendar className="h-3 w-3" />
        <span>{fmtDate(sesion.scheduled_at)}</span>
      </div>

      <h3 className="text-sm font-medium leading-snug mb-3 line-clamp-2">
        {sesion.session_title ?? "Sesión sin título"}
      </h3>

      {status === "COMPLETED" && sesion.resumen_ejecutivo && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {sesion.resumen_ejecutivo}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {sesion.agenda_url && (
          <Button
            variant="ghost"
            size="sm"
            asChild
            onClick={(e) => e.stopPropagation()}
          >
            <a href={sesion.agenda_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3 mr-1" />
              Agenda
            </a>
          </Button>
        )}

        {status === "NOT_REQUESTED" && (
          <Badge variant="outline" className="text-muted-foreground">
            Sin analizar
          </Badge>
        )}
        {(status === "REQUESTED" || status === "PROCESSING") && (
          <Badge variant="secondary">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Analizando
          </Badge>
        )}
        {status === "COMPLETED" && (
          <>
            <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-500">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Analizada
            </Badge>
            {sesion.impacto_categoria && (
              <Badge variant="outline">Impacto: {sesion.impacto_categoria}</Badge>
            )}
            {sesion.urgencia_categoria && (
              <Badge variant="outline">Urgencia: {sesion.urgencia_categoria}</Badge>
            )}
          </>
        )}
        {status === "FAILED" && (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Falló el análisis
          </Badge>
        )}
      </div>
    </Card>
  );
}
