// Briefing diario: 4 KPIs de la bandeja (Fase A del overhaul de alertas).

import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Inbox as InboxIcon, AlertTriangle, Star, Clock } from "lucide-react";
import { PeruAlert } from "@/data/peruAlertsMockData";
import {
  isActionRequired,
  isRezagada,
  isRecentMovement,
} from "@/lib/alertClassification";
import { useMemo } from "react";

interface BriefingKPIRowProps {
  alerts: PeruAlert[];
}

export function BriefingKPIRow({ alerts }: BriefingKPIRowProps) {
  const stats = useMemo(() => ({
    total: alerts.length,
    action: alerts.filter(isActionRequired).length,
    bookmarks: alerts.filter(a => a.is_pinned_for_publication).length,
    recent: alerts.filter(a => isRecentMovement(a, 7)).length,
    rezagadas: alerts.filter(a => isRezagada(a)).length,
  }), [alerts]);

  const kpis = [
    {
      label: "Activas",
      value: stats.total,
      hint: `${stats.rezagadas} rezagadas (>30d sin movimiento)`,
      icon: InboxIcon,
      tone: "primary" as const,
    },
    {
      label: "Acción requerida",
      value: stats.action,
      hint: "Impacto o urgencia ≥ 70",
      icon: AlertTriangle,
      tone: "destructive" as const,
    },
    {
      label: "Bookmarks",
      value: stats.bookmarks,
      hint: "Protegidas de archivo automático",
      icon: Star,
      tone: "warning" as const,
    },
    {
      label: "Movimiento 7d",
      value: stats.recent,
      hint: "Cambios en los últimos 7 días",
      icon: Clock,
      tone: "info" as const,
    },
  ];

  const toneClasses: Record<string, { bg: string; icon: string; ring: string }> = {
    primary: { bg: "bg-primary/10", icon: "text-primary", ring: "border-l-primary" },
    destructive: { bg: "bg-destructive/10", icon: "text-destructive", ring: "border-l-destructive" },
    warning: { bg: "bg-[hsl(var(--warning)/0.15)]", icon: "text-[hsl(var(--warning))]", ring: "border-l-[hsl(var(--warning))]" },
    info: { bg: "bg-blue-500/10", icon: "text-blue-400", ring: "border-l-blue-500" },
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map((kpi) => {
          const t = toneClasses[kpi.tone];
          return (
            <Tooltip key={kpi.label}>
              <TooltipTrigger asChild>
                <Card className={`glass-card border-border/30 border-l-4 ${t.ring}`}>
                  <CardContent className="pt-3 pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${t.bg}`}>
                        <kpi.icon className={`h-4 w-4 ${t.icon}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xl font-bold text-foreground">{kpi.value}</div>
                        <div className="text-xs text-muted-foreground truncate">{kpi.label}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">{kpi.hint}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
