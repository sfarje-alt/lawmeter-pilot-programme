// "Feedback de alertas" — aggregated micro-feedback signal in Operaciones internas.
// Read-only learning signal; no automatic mutation of keywords/scoring/classification.

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, ThumbsUp, AlertTriangle, Sparkles } from "lucide-react";
import { useAlertFeedbackStats } from "@/hooks/useAlertFeedbackStats";

interface Props {
  timeframe?: string;
}

export function AlertFeedbackBlock({ timeframe }: Props) {
  const stats = useAlertFeedbackStats();

  const pct = (n: number) => (stats.total === 0 ? 0 : Math.round((n / stats.total) * 100));

  return (
    <Card className="bg-card border-border/40 col-span-1 lg:col-span-2">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              Feedback de alertas
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              Señal de relevancia enviada por usuarios — no afecta scoring automáticamente.
              {timeframe ? ` · ${timeframe}` : ""}
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
            Solo lectura
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <KpiTile label="Total" value={stats.total} />
          <KpiTile
            label="Muy útil"
            value={stats.veryUseful}
            sub={`${pct(stats.veryUseful)}%`}
            tone="emerald"
            icon={<ThumbsUp className="h-3 w-3" />}
          />
          <KpiTile
            label="Útil"
            value={stats.useful}
            sub={`${pct(stats.useful)}%`}
            tone="neutral"
          />
          <KpiTile
            label="No relevante"
            value={stats.notRelevant}
            sub={`${pct(stats.notRelevant)}%`}
            tone="amber"
            icon={<AlertTriangle className="h-3 w-3" />}
          />
        </div>

        {/* Stacked bar */}
        {stats.total > 0 && (
          <div className="h-2 w-full rounded-full overflow-hidden bg-muted/40 flex">
            <div
              className="bg-emerald-500/70"
              style={{ width: `${pct(stats.veryUseful)}%` }}
              title={`Muy útil ${pct(stats.veryUseful)}%`}
            />
            <div
              className="bg-primary/60"
              style={{ width: `${pct(stats.useful)}%` }}
              title={`Útil ${pct(stats.useful)}%`}
            />
            <div
              className="bg-amber-500/70"
              style={{ width: `${pct(stats.notRelevant)}%` }}
              title={`No relevante ${pct(stats.notRelevant)}%`}
            />
          </div>
        )}

        {stats.loading ? (
          <p className="text-xs text-muted-foreground py-6 text-center">Cargando feedback…</p>
        ) : stats.total === 0 ? (
          <div className="rounded-md border border-dashed border-border/40 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Aún no hay feedback registrado. Cuando los usuarios valoren alertas, los patrones
              aparecerán aquí.
            </p>
          </div>
        ) : (
          <Tabs defaultValue="keyword" className="w-full">
            <TabsList className="h-8">
              <TabsTrigger value="keyword" className="text-xs">
                Por keyword
              </TabsTrigger>
              <TabsTrigger value="profile" className="text-xs">
                Por perfil
              </TabsTrigger>
              <TabsTrigger value="area" className="text-xs">
                Por área legal
              </TabsTrigger>
            </TabsList>

            <TabsContent value="keyword" className="mt-3">
              <ScrollArea className="h-[260px] pr-2">
                <div className="space-y-1.5">
                  {stats.byKeyword.slice(0, 30).map((k) => (
                    <RowItem
                      key={k.keyword}
                      label={k.keyword}
                      total={k.total}
                      negative={k.not_relevant}
                      positive={k.very_useful}
                      flag={k.flag}
                      flagTone="amber"
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="profile" className="mt-3">
              <ScrollArea className="h-[260px] pr-2">
                <div className="space-y-1.5">
                  {stats.byProfile.map((p, i) => (
                    <RowItem
                      key={p.client_id ?? `np-${i}`}
                      label={p.client_id ?? "Sin cliente asignado"}
                      total={p.total}
                      negative={p.not_relevant}
                      positive={p.very_useful}
                      flag={p.flag}
                      flagTone="amber"
                      mono
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="area" className="mt-3">
              <ScrollArea className="h-[260px] pr-2">
                <div className="space-y-1.5">
                  {stats.byArea.slice(0, 30).map((a) => (
                    <RowItem
                      key={a.area}
                      label={a.area}
                      total={a.total}
                      negative={a.not_relevant}
                      positive={a.very_useful}
                      flag={a.flag}
                      flagTone="emerald"
                      flagIcon={<Sparkles className="h-3 w-3" />}
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}

function KpiTile({
  label,
  value,
  sub,
  tone = "default",
  icon,
}: {
  label: string;
  value: number;
  sub?: string;
  tone?: "default" | "emerald" | "amber" | "neutral";
  icon?: React.ReactNode;
}) {
  const toneClass =
    tone === "emerald"
      ? "border-emerald-500/30 bg-emerald-500/10"
      : tone === "amber"
        ? "border-amber-500/30 bg-amber-500/10"
        : tone === "neutral"
          ? "border-primary/30 bg-primary/10"
          : "border-border/40 bg-background/40";
  return (
    <div className={`rounded-md border ${toneClass} p-2`}>
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <div className="flex items-baseline gap-1.5 mt-0.5">
        <span className="text-lg font-semibold text-foreground">{value}</span>
        {sub && <span className="text-[11px] text-muted-foreground">{sub}</span>}
      </div>
    </div>
  );
}

function RowItem({
  label,
  total,
  negative,
  positive,
  flag,
  flagTone = "amber",
  flagIcon,
  mono,
}: {
  label: string;
  total: number;
  negative: number;
  positive: number;
  flag: string | null;
  flagTone?: "amber" | "emerald";
  flagIcon?: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-md border border-border/30 bg-background/30 px-3 py-1.5">
      <div className="min-w-0 flex-1">
        <p className={`text-xs text-foreground truncate ${mono ? "font-mono" : ""}`}>{label}</p>
        {flag && (
          <Badge
            variant="outline"
            className={`mt-1 text-[10px] gap-1 ${
              flagTone === "emerald"
                ? "border-emerald-500/40 text-emerald-300 bg-emerald-500/10"
                : "border-amber-500/40 text-amber-300 bg-amber-500/10"
            }`}
          >
            {flagIcon}
            {flag}
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0 text-[11px]">
        <span className="text-emerald-400">{positive}</span>
        <span className="text-muted-foreground">/</span>
        <span className="text-amber-400">{negative}</span>
        <span className="text-muted-foreground">/ {total}</span>
      </div>
    </div>
  );
}
