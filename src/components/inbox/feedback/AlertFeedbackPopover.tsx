// Compact micro-feedback popover attached to alert cards / detail drawer.
// One-click rating submit; reason chips + comment are optional.
// Stored as a learning signal only — never mutates alert/keyword logic.

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquarePlus, ThumbsUp, CheckCircle2, AlertTriangle, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAlerts } from "@/contexts/AlertsContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  submitAlertFeedback,
  POSITIVE_REASONS,
  NEGATIVE_REASONS,
  type FeedbackRating,
} from "@/lib/alertFeedback";
import type { PeruAlert } from "@/data/peruAlertsMockData";

interface Props {
  alert: Partial<PeruAlert> & { id: string; affected_areas?: string[] };
  /** Visual style of the trigger button. */
  variant?: "icon" | "button";
  /** Override client_id (used in client portal). */
  clientId?: string | null;
}

export function AlertFeedbackPopover({ alert, variant = "icon", clientId }: Props) {
  const { user, profile } = useAuth();
  const { archiveAlert } = useAlerts();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<FeedbackRating | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const reset = () => {
    setRating(null);
    setReason(null);
    setComment("");
    setDone(false);
    setSubmitting(false);
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setTimeout(reset, 200);
  };

  const handleSubmit = async () => {
    if (!rating) return;
    if (!user || !profile?.organization_id) {
      toast({
        title: "No se pudo enviar el feedback",
        description: "Inicia sesión para enviar feedback.",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    try {
      await submitAlertFeedback(
        alert,
        { rating, reason, comment },
        {
          userId: user.id,
          organizationId: profile.organization_id,
          clientId: clientId ?? profile.client_id ?? null,
        },
      );

      // Si la alerta es marcada como "no relevante" por un admin (Equipo Legal),
      // se archiva automáticamente para sacarla del flujo de revisión.
      const isAdmin = profile.account_type === "admin";
      if (rating === "not_relevant" && isAdmin) {
        try {
          archiveAlert(alert.id);
          toast({
            title: "Alerta archivada",
            description: "La alerta se movió al archivo por no ser relevante.",
          });
        } catch (archiveErr) {
          console.error("[AlertFeedback] archive failed", archiveErr);
        }
      }

      setDone(true);
      setTimeout(() => setOpen(false), 1800);
    } catch (err) {
      console.error("[AlertFeedback] insert failed", err);
      toast({
        title: "Error al enviar feedback",
        description: "Inténtalo nuevamente en unos segundos.",
        variant: "destructive",
      });
      setSubmitting(false);
    }
  };

  const reasons = rating === "not_relevant" ? NEGATIVE_REASONS : POSITIVE_REASONS;

  const trigger =
    variant === "button" ? (
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={(e) => e.stopPropagation()}
      >
        <MessageSquarePlus className="h-3.5 w-3.5" />
        Feedback
      </Button>
    ) : (
      <button
        onClick={(e) => e.stopPropagation()}
        className="p-1 hover:bg-white/10 rounded transition-colors"
        title="Dar feedback sobre esta alerta"
        aria-label="Dar feedback"
      >
        <MessageSquarePlus className="h-3.5 w-3.5 text-muted-foreground hover:text-primary" />
      </button>
    );

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-80 p-4 bg-card border-border/50"
        onClick={(e) => e.stopPropagation()}
      >
        {done ? (
          <div className="flex flex-col items-center text-center gap-2 py-2">
            <div className="h-10 w-10 rounded-full bg-emerald-500/15 flex items-center justify-center">
              <Check className="h-5 w-5 text-emerald-500" />
            </div>
            <p className="text-sm text-foreground font-medium">Gracias.</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Usaremos este feedback para mejorar futuras alertas.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-foreground">¿Qué tal esta alerta?</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Tu valoración nos ayuda a afinar la relevancia.
              </p>
            </div>

            {/* Step 1 — rating buttons */}
            <div className="grid grid-cols-1 gap-1.5">
              <RatingButton
                active={rating === "very_useful"}
                onClick={() => setRating("very_useful")}
                icon={<ThumbsUp className="h-3.5 w-3.5" />}
                label="Muy útil"
                tone="emerald"
              />
              <RatingButton
                active={rating === "useful"}
                onClick={() => setRating("useful")}
                icon={<CheckCircle2 className="h-3.5 w-3.5" />}
                label="Útil"
                tone="neutral"
              />
              <RatingButton
                active={rating === "not_relevant"}
                onClick={() => {
                  setRating("not_relevant");
                  setReason(null);
                }}
                icon={<AlertTriangle className="h-3.5 w-3.5" />}
                label="No relevante"
                tone="amber"
              />
            </div>

            {rating === "not_relevant" && profile?.account_type === "admin" && (
              <div className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400 mt-0.5 shrink-0" />
                <p className="text-[11px] text-amber-200 leading-snug">
                  Al enviar, esta alerta se moverá automáticamente al archivo.
                </p>
              </div>
            )}

            {/* Step 2 — optional reason */}
            {rating && (
              <div className="space-y-1.5">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Razón (opcional)
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {reasons.map((r) => {
                    const selected = reason === r;
                    return (
                      <Badge
                        key={r}
                        variant="outline"
                        className={cn(
                          "text-[11px] cursor-pointer py-0.5 px-2 transition-colors border",
                          selected
                            ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                            : "bg-background/60 text-foreground border-border/60 hover:bg-muted hover:border-primary/40",
                        )}
                        onClick={() => setReason(selected ? null : r)}
                      >
                        {r}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3 — optional comment */}
            {rating && (
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Comentario opcional
                </label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ej.: Esta alerta menciona apuestas, pero no impacta operación de iGaming."
                  className="min-h-[60px] text-xs resize-none bg-background/40"
                />
              </div>
            )}

            <Button
              size="sm"
              className="w-full"
              disabled={!rating || submitting}
              onClick={handleSubmit}
            >
              {submitting ? "Enviando..." : "Enviar feedback"}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

function RatingButton({
  active,
  onClick,
  icon,
  label,
  tone,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  tone: "emerald" | "neutral" | "amber";
}) {
  const toneClass = {
    emerald: active
      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
      : "hover:bg-emerald-500/10 hover:text-emerald-300 hover:border-emerald-500/30",
    neutral: active
      ? "bg-primary/20 text-primary border-primary/50"
      : "hover:bg-primary/10 hover:text-primary hover:border-primary/30",
    amber: active
      ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
      : "hover:bg-amber-500/10 hover:text-amber-300 hover:border-amber-500/30",
  }[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-border/40 bg-background/40 text-sm text-foreground transition-colors",
        toneClass,
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
