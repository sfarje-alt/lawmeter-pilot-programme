// Detail drawer for a Congress session.
// Fase 6-7: análisis IA on-demand con Realtime + polling fallback.

import { useEffect, useRef } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  ExternalLink,
  Youtube,
  FileText,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import type { Sesion } from "@/hooks/useSesiones";
import { useSesionRealtime } from "@/hooks/useSesionRealtime";
import { useSolicitarAnalisis } from "@/hooks/useSolicitarAnalisis";
import { AgendaMarkdownView } from "./AgendaMarkdownView";
import { SesionQABox } from "./SesionQABox";
import { useAICredits, SESSION_ANALYSIS_COST } from "@/hooks/useAICredits";

interface Props {
  sesion: Sesion | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return format(new Date(iso), "d 'de' MMMM yyyy · HH:mm", { locale: es });
  } catch {
    return iso;
  }
}

function timestampToSeconds(ts: string): number {
  const parts = ts.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
}

function buildYoutubeUrlAt(videoUrl: string, ts: string): string {
  const seconds = timestampToSeconds(ts);
  const sep = videoUrl.includes("?") ? "&" : "?";
  return `${videoUrl}${sep}t=${seconds}s`;
}

export function SesionDetailDrawer({ sesion: initial, open, onOpenChange }: Props) {
  const sesion = useSesionRealtime(initial, open);
  const { solicitar, loading } = useSolicitarAnalisis();
  const { balance } = useAICredits();
  const insufficientCredits = balance < SESSION_ANALYSIS_COST;
  const prevStatusRef = useRef<string | null>(null);

  useEffect(() => {
    const prev = prevStatusRef.current;
    const curr = sesion?.analysis_status ?? null;
    if (prev && prev !== curr) {
      if (curr === "COMPLETED") {
        toast.success("Análisis listo", {
          description: "El análisis IA de la sesión se completó.",
        });
      } else if (curr === "FAILED") {
        toast.error("Falló el análisis", {
          description: sesion?.analysis_error ?? "Intenta de nuevo.",
        });
      }
    }
    prevStatusRef.current = curr;
  }, [sesion?.analysis_status, sesion?.analysis_error]);

  if (!sesion) return null;

  const analysisStatus = sesion.analysis_status;
  const isCompleted = analysisStatus === "COMPLETED";
  const isProcessing =
    analysisStatus === "REQUESTED" || analysisStatus === "PROCESSING";
  const isFailed = analysisStatus === "FAILED";
  const isNotRequested = analysisStatus === "NOT_REQUESTED";

  async function onClickAnalizar() {
    if (insufficientCredits) {
      toast.error("Créditos insuficientes", {
        description: `Necesitas ${SESSION_ANALYSIS_COST} créditos. Saldo actual: ${balance}.`,
      });
      return;
    }
    if (!confirm(`Esto consumirá ${SESSION_ANALYSIS_COST} créditos. Saldo actual: ${balance} → ${balance - SESSION_ANALYSIS_COST}. ¿Continuar?`)) {
      return;
    }
    try {
      await solicitar(sesion!.external_id);
      toast.success("Análisis solicitado", {
        description: "Tardará entre 3 y 5 minutos. Te avisamos al terminar.",
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error al solicitar análisis";
      toast.error("No se pudo solicitar", { description: msg });
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl overflow-hidden flex flex-col p-0"
      >
        <SheetHeader className="px-6 py-4 border-b">
          <Badge variant="outline" className="w-fit mb-2">
            {sesion.commission_name}
          </Badge>
          <SheetTitle className="text-xl leading-tight text-left">
            {sesion.session_title ?? "Sesión sin título"}
          </SheetTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <Calendar className="h-4 w-4" />
            <span>{fmtDate(sesion.scheduled_at)}</span>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="px-6 py-4 space-y-6">
            <div className="flex flex-wrap gap-2">
              {sesion.agenda_url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={sesion.agenda_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver en portal Congreso
                  </a>
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                disabled={!sesion.video_url}
                asChild={!!sesion.video_url}
              >
                {sesion.video_url ? (
                  <a href={sesion.video_url} target="_blank" rel="noopener noreferrer">
                    <Youtube className="h-4 w-4 mr-2" />
                    Ver video YouTube
                  </a>
                ) : (
                  <span>
                    <Youtube className="h-4 w-4 mr-2" />
                    Video no disponible
                  </span>
                )}
              </Button>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Agenda</h3>
              </div>
              {sesion.agenda_markdown ? (
                <div className="rounded-lg border bg-muted/30 p-4 max-h-[60vh] overflow-y-auto">
                  <AgendaMarkdownView markdown={sesion.agenda_markdown} />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Aún no se ha extraído la agenda de esta sesión.
                </p>
              )}
            </div>

            <Separator />

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Análisis IA</h3>
              </div>

              {isNotRequested && (
                <div className="rounded-lg border border-dashed p-6 text-center space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Esta sesión aún no ha sido analizada por IA.
                  </p>
                  <Button onClick={onClickAnalizar} disabled={loading} title="Toma entre 3 y 5 minutos">
                    {loading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    Analizar sesión con IA
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Descargamos el video, transcribimos y analizamos contra el perfil
                    regulatorio del cliente. Tarda 3–5 minutos.
                  </p>
                </div>
              )}

              {isProcessing && (
                <div className="rounded-lg border bg-muted/30 p-6 text-center space-y-3">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                  <p className="text-sm">
                    {analysisStatus === "REQUESTED"
                      ? "En cola…"
                      : "Analizando… puede tardar 3–5 min."}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Puedes cerrar este panel; el análisis continúa en segundo plano.
                  </p>
                </div>
              )}

              {isFailed && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium">Falló el análisis</span>
                  </div>
                  {sesion.analysis_error && (
                    <p className="text-xs text-muted-foreground break-words">
                      {sesion.analysis_error}
                    </p>
                  )}
                  <Button size="sm" variant="outline" onClick={onClickAnalizar} disabled={loading}>
                    {loading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Reintentar análisis
                  </Button>
                </div>
              )}

              {isCompleted && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Análisis completado</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {sesion.impacto_categoria && (
                      <Badge variant="secondary">
                        Impacto: {sesion.impacto_categoria}
                        {sesion.impacto !== null && ` (${sesion.impacto})`}
                      </Badge>
                    )}
                    {sesion.urgencia_categoria && (
                      <Badge variant="secondary">
                        Urgencia: {sesion.urgencia_categoria}
                        {sesion.urgencia !== null && ` (${sesion.urgencia})`}
                      </Badge>
                    )}
                  </div>

                  {sesion.resumen_ejecutivo && (
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Resumen ejecutivo</h4>
                      <p className="text-sm text-foreground whitespace-pre-wrap">
                        {sesion.resumen_ejecutivo}
                      </p>
                    </div>
                  )}

                  {sesion.comentario && (
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Comentario</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {sesion.comentario}
                      </p>
                    </div>
                  )}

                  {sesion.puntos_clave && sesion.puntos_clave.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Puntos clave</h4>
                      <ul className="space-y-2">
                        {sesion.puntos_clave.map((p, i) => (
                          <li key={i} className="flex gap-2 text-sm border-l-2 border-primary/30 pl-3">
                            {sesion.video_url ? (
                              <a
                                href={buildYoutubeUrlAt(sesion.video_url, p.timestamp)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-primary hover:underline shrink-0"
                              >
                                {p.timestamp}
                              </a>
                            ) : (
                              <span className="font-mono text-muted-foreground shrink-0">
                                {p.timestamp}
                              </span>
                            )}
                            <span className="flex-1">{p.topic}</span>
                            <Badge variant="outline" className="text-xs">
                              {p.relevancia}
                            </Badge>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {sesion.racional && sesion.racional.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Racional</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {sesion.racional.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {sesion.recomendaciones && sesion.recomendaciones.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Recomendaciones</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {sesion.recomendaciones.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {sesion.area_de_interes && sesion.area_de_interes.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Áreas de interés</h4>
                      <div className="flex flex-wrap gap-1">
                        {sesion.area_de_interes.map((a, i) => (
                          <Badge key={i} variant="outline">
                            {a}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />
                  <SesionQABox sesion={sesion} />
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
