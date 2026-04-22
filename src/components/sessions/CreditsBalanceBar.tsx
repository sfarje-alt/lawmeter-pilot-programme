// Barra de balance de créditos IA para sesiones.
import { Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAICredits, SESSION_ANALYSIS_COST } from "@/hooks/useAICredits";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  compact?: boolean;
}

export function CreditsBalanceBar({ className, compact = false }: Props) {
  const { balance, included, loading } = useAICredits();

  if (loading) return null;

  const pct = included > 0 ? Math.round((balance / included) * 100) : 0;
  const tone =
    pct > 50
      ? "text-emerald-600"
      : pct > 20
        ? "text-amber-600"
        : "text-destructive";

  const barColor =
    pct > 50
      ? "bg-emerald-500"
      : pct > 20
        ? "bg-amber-500"
        : "bg-destructive";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-card cursor-help",
              compact ? "text-xs" : "text-sm",
              className,
            )}
          >
            <Sparkles className={cn("h-4 w-4", tone)} />
            <span className="text-muted-foreground">Créditos IA:</span>
            <span className={cn("font-semibold", tone)}>
              {balance} / {included}
            </span>
            <div className="w-16 sm:w-24">
              <Progress
                value={pct}
                className="h-1.5"
                indicatorClassName={barColor}
              />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-1.5 text-xs">
            <p className="font-semibold">Balance de créditos IA</p>
            <p className="text-muted-foreground">
              Tu organización empieza con {included} créditos incluidos en el piloto.
            </p>
            <ul className="space-y-0.5 text-muted-foreground">
              <li>
                • <strong>Análisis de sesión</strong> (transcripción + resumen IA, hasta 90 min) ={" "}
                <strong className="text-foreground">{SESSION_ANALYSIS_COST} créditos</strong>
              </li>
              <li>
                • <strong>Pregunta Q&A</strong> sobre una sesión analizada ={" "}
                <strong className="text-foreground">1–3 créditos</strong> según complejidad
              </li>
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
