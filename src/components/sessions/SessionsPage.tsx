// Sessions / Hearing Intelligence — Peru Congress
// Replaces previous PDF-based flow. Reads from public.sesiones.

import { useState, useMemo } from "react";
import { Video, Search, Library, Inbox as InboxIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CountryFlag } from "@/components/shared/CountryFlag";
import { useSesiones, type Sesion } from "@/hooks/useSesiones";
import { useSessionsUniverse } from "@/hooks/useSessionsUniverse";
import { SesionCard } from "./SesionCard";
import { SesionDetailDrawer } from "./SesionDetailDrawer";
import { CreditsBalanceBar } from "./CreditsBalanceBar";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export interface SessionsPageProps {
  className?: string;
  initialSessionId?: string | null;
}

function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .trim();
}

export function SessionsPage({ className }: SessionsPageProps) {
  const [view, setView] = useState<"bandeja" | "repositorio">("bandeja");
  const [selectedSesion, setSelectedSesion] = useState<Sesion | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Filters
  const [keyword, setKeyword] = useState("");
  const [commission, setCommission] = useState<string>("__all__");
  const [onlyVideo, setOnlyVideo] = useState(false);
  const [onlyAnalyzed, setOnlyAnalyzed] = useState(false);

  // Bandeja = canonical Sesiones universe (same dataset analytics consumes).
  // Repositorio = full historical archive (broader, only used in this page).
  const universe = useSessionsUniverse();
  const repositorio = useSesiones({ onlyDeInteres: false });
  const { sesiones, loading, error } =
    view === "bandeja" ? universe : repositorio;

  const allCommissions = useMemo(() => {
    const set = new Set<string>();
    sesiones.forEach((s) => set.add(s.commission_name));
    return Array.from(set).sort();
  }, [sesiones]);

  const filtered = useMemo(() => {
    const kw = normalize(keyword);
    return sesiones.filter((s) => {
      if (commission !== "__all__" && s.commission_name !== commission) return false;
      if (onlyVideo && !s.video_url) return false;
      if (onlyAnalyzed && s.analysis_status !== "COMPLETED") return false;
      if (kw) {
        const hay = normalize(
          `${s.session_title ?? ""} ${s.agenda_markdown ?? ""}`,
        );
        if (!hay.includes(kw)) return false;
      }
      return true;
    });
  }, [sesiones, keyword, commission, onlyVideo, onlyAnalyzed]);

  // Counters (computed from current view set, without keyword/filters)
  const counters = useMemo(() => {
    return {
      total: sesiones.length,
      processing: sesiones.filter((s) =>
        ["REQUESTED", "PROCESSING"].includes(s.analysis_status),
      ).length,
      completed: sesiones.filter((s) => s.analysis_status === "COMPLETED").length,
      withVideo: sesiones.filter((s) => !!s.video_url).length,
    };
  }, [sesiones]);

  const openSesion = (s: Sesion) => {
    setSelectedSesion(s);
    setDrawerOpen(true);
  };

  return (
    <div className={`space-y-6 ${className ?? ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Video className="h-6 w-6 text-primary" />
          </div>
          <div className="flex items-center gap-3">
            <CountryFlag countryKey="PE" variant="flag" size="md" showTooltip={false} />
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Sesiones del Congreso del Perú
              </h1>
              <p className="text-sm text-muted-foreground">
                Monitorea las sesiones de comisiones del Congreso
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CreditsBalanceBar compact />
          <Button
            variant={view === "bandeja" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("bandeja")}
          >
            <InboxIcon className="h-4 w-4 mr-2" />
            Bandeja
          </Button>
          <Button
            variant={view === "repositorio" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("repositorio")}
          >
            <Library className="h-4 w-4 mr-2" />
            Repositorio completo
          </Button>
        </div>
      </div>

      {/* Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">
            {view === "bandeja" ? "Sesiones de interés" : "Total sesiones"}
          </div>
          <div className="text-2xl font-bold">{counters.total}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Procesando IA</div>
          <div className="text-2xl font-bold">{counters.processing}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Listas</div>
          <div className="text-2xl font-bold text-emerald-600">
            {counters.completed}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Con video</div>
          <div className="text-2xl font-bold">{counters.withVideo}</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[240px]">
            <Label htmlFor="kw" className="text-xs">
              Buscar (título o agenda)
            </Label>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="kw"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Ej: turismo, gambling, IGV..."
                className="pl-8"
              />
            </div>
          </div>

          <div className="min-w-[240px]">
            <Label className="text-xs">Comisión</Label>
            <Select value={commission} onValueChange={setCommission}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Todas</SelectItem>
                {allCommissions.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="video"
              checked={onlyVideo}
              onCheckedChange={setOnlyVideo}
            />
            <Label htmlFor="video" className="text-sm">
              Solo con video
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="analyzed"
              checked={onlyAnalyzed}
              onCheckedChange={setOnlyAnalyzed}
            />
            <Label htmlFor="analyzed" className="text-sm">
              Solo analizadas
            </Label>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          Mostrando {filtered.length} de {sesiones.length} sesiones
        </div>
      </Card>

      {/* Content */}
      {loading && (
        <div className="text-center py-12 text-muted-foreground">
          Cargando sesiones…
        </div>
      )}

      {error && (
        <Card className="p-6 border-destructive/50 bg-destructive/5">
          <p className="text-sm text-destructive">Error: {error}</p>
        </Card>
      )}

      {!loading && !error && filtered.length === 0 && (
        <Card className="p-12 text-center">
          <Video className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
          <h3 className="font-semibold mb-1">
            No hay sesiones {view === "bandeja" ? "de interés" : ""} aún
          </h3>
          <p className="text-sm text-muted-foreground">
            {view === "bandeja"
              ? "Las sesiones aparecerán cuando el cron diario las ingese."
              : "El repositorio está vacío."}
          </p>
        </Card>
      )}

      {!loading && !error && filtered.length > 0 && view === "bandeja" && (
        <div className="grid gap-3">
          {filtered.map((s) => (
            <SesionCard key={s.id} sesion={s} onOpen={() => openSesion(s)} />
          ))}
        </div>
      )}

      {!loading && !error && filtered.length > 0 && view === "repositorio" && (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Comisión</TableHead>
                <TableHead>Título</TableHead>
                <TableHead className="text-center">Agenda</TableHead>
                <TableHead className="text-center">Video</TableHead>
                <TableHead className="text-center">Analizada</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow
                  key={s.id}
                  className="cursor-pointer"
                  onClick={() => openSesion(s)}
                >
                  <TableCell className="whitespace-nowrap text-xs">
                    {s.scheduled_at
                      ? format(new Date(s.scheduled_at), "d MMM yyyy", {
                          locale: es,
                        })
                      : "—"}
                  </TableCell>
                  <TableCell className="text-xs max-w-[200px] truncate">
                    {s.commission_name}
                  </TableCell>
                  <TableCell className="text-xs max-w-[300px] truncate">
                    {s.session_title ?? "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    {s.agenda_url ? "✓" : "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    {s.video_url ? "✓" : "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    {s.analysis_status === "COMPLETED" ? (
                      <Badge variant="default" className="bg-emerald-500">
                        Sí
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <SesionDetailDrawer
        sesion={selectedSesion}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}

export default SessionsPage;
