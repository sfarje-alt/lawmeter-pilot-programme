// Workspace de Sesiones — bandeja editorial con dos columnas:
//   LEFT  · Bandeja                       (todas las alertas activas)
//   RIGHT · Sesiones preparadas           (En procesamiento + Listas)
// Pineadas flotan arriba en cualquier columna. Archivadas se ven con el toggle.
// Chatbot global persistente.

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Inbox as InboxIcon,
  Pin,
  Sparkles,
  CheckCircle2,
  Mail,
  Loader2,
} from 'lucide-react';
import { useSesionesWorkspace } from '@/hooks/useSesionesWorkspace';
import {
  SesionesFilterBar,
  applySesionesFilters,
  DEFAULT_FILTERS,
  type SesionesFilters,
} from './SesionesFilterBar';
import { SesionAlertCard } from './SesionAlertCard';
import { SesionDetailWorkstation } from './SesionDetailWorkstation';
import { SesionesGlobalChatbot } from './SesionesGlobalChatbot';
import type { PeruSession } from '@/types/peruSessions';

interface Props {
  initialSessionId?: string | null;
}

export function SesionesWorkspace({ initialSessionId }: Props) {
  const {
    sessions,
    stats,
    openedIds,
    markOpened,
    togglePin,
    archiveSession,
    requestTranscription,
    requestChatbot,
  } = useSesionesWorkspace();

  const [filters, setFilters] = useState<SesionesFilters>(DEFAULT_FILTERS);
  const [openSession, setOpenSession] = useState<PeruSession | null>(null);

  // Deep-link: abrir sesión por id
  useEffect(() => {
    if (!initialSessionId) return;
    const s = sessions.find((x) => x.id === initialSessionId);
    if (s) {
      setOpenSession(s);
      markOpened(s.id);
    }
  }, [initialSessionId, sessions, markOpened]);

  // Mantener referencia viva
  useEffect(() => {
    if (!openSession) return;
    const fresh = sessions.find((s) => s.id === openSession.id);
    if (fresh && fresh !== openSession) setOpenSession(fresh);
  }, [sessions, openSession]);

  // Sesiones según toggle archivado
  const visibleSessions = useMemo(() => {
    return sessions.filter((s) =>
      filters.showArchived ? !!s.is_archived : !s.is_archived,
    );
  }, [sessions, filters.showArchived]);

  // Filtrar
  const filtered = useMemo(
    () => applySesionesFilters(visibleSessions, filters),
    [visibleSessions, filters],
  );

  const archivedCount = useMemo(
    () => sessions.filter((s) => s.is_archived).length,
    [sessions],
  );

  // Sort: pineadas arriba, no leídas antes que leídas, luego por fecha desc
  const sortAlerts = (arr: PeruSession[]) =>
    [...arr].sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      const ua = !openedIds.has(a.id);
      const ub = !openedIds.has(b.id);
      if (ua && !ub) return -1;
      if (!ua && ub) return 1;
      const da = new Date(a.scheduled_at ?? a.created_at).getTime();
      const db = new Date(b.scheduled_at ?? b.created_at).getTime();
      return db - da;
    });

  const isProcessing = (s: PeruSession) => {
    const t = s.transcription_state ?? 'no_solicitada';
    const c = s.chatbot_state ?? 'no_solicitado';
    return ['en_cola', 'procesando'].includes(t) || ['en_cola', 'procesando'].includes(c);
  };
  const isReady = (s: PeruSession) => {
    const t = s.transcription_state ?? 'no_solicitada';
    const c = s.chatbot_state ?? 'no_solicitado';
    return t === 'lista' || c === 'listo';
  };

  // ── Agrupación por columna ────────────────────────────────────────────────
  const grouped = useMemo(() => {
    // Bandeja = todas las alertas activas (no archivadas)
    const bandeja = sortAlerts(filtered);
    // Sesiones preparadas = procesando + listas (subconjunto de la bandeja)
    const procesando = sortAlerts(filtered.filter(isProcessing));
    const listas = sortAlerts(filtered.filter((s) => isReady(s) && !isProcessing(s)));
    return { bandeja, procesando, listas };
  }, [filtered, openedIds]);

  const handleOpen = (s: PeruSession) => {
    markOpened(s.id);
    setOpenSession(s);
  };

  const newCount = useMemo(
    () => visibleSessions.filter((s) => !openedIds.has(s.id)).length,
    [visibleSessions, openedIds],
  );

  const archivedView = filters.showArchived;

  return (
    <div className="space-y-4">
      {/* ── KPI Cards ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="glass-card border-border/30">
          <CardContent className="pt-3 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <InboxIcon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">{stats.total}</div>
                <div className="text-xs text-muted-foreground">Total sesiones</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/30">
          <CardContent className="pt-3 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">{newCount}</div>
                <div className="text-xs text-muted-foreground">No leídas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/30">
          <CardContent className="pt-3 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Loader2 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">{stats.processingAI}</div>
                <div className="text-xs text-muted-foreground">Procesando IA</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/30">
          <CardContent className="pt-3 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <CheckCircle2 className="h-4 w-4 text-success" />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">{stats.readyForReview}</div>
                <div className="text-xs text-muted-foreground">Listas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/30">
          <CardContent className="pt-3 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Pin className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">{stats.pinned}</div>
                <div className="text-xs text-muted-foreground">Pineadas</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Filtros ─────────────────────────────────────────────────────── */}
      <SesionesFilterBar
        filters={filters}
        onChange={setFilters}
        sessions={sessions}
        pinnedCount={stats.pinned}
        archivedCount={archivedCount}
      />

      {/* ── Layout 2 columnas (o vista de archivadas) ───────────────────── */}
      {archivedView ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.length === 0 ? (
            <div className="col-span-full p-8 text-center text-muted-foreground text-sm">
              No hay sesiones archivadas.
            </div>
          ) : (
            sortAlerts(filtered).map((s) => (
              <SesionAlertCard
                key={s.id}
                session={s}
                isUnread={!openedIds.has(s.id)}
                onTogglePin={togglePin}
                onArchive={archiveSession}
                onOpen={handleOpen}
              />
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          {/* LEFT — Bandeja */}
          <BandejaColumn
            label="Bandeja"
            color="bg-primary"
            alerts={grouped.bandeja}
            openedIds={openedIds}
            onAlertClick={handleOpen}
            onTogglePin={togglePin}
            onArchive={archiveSession}
            emptyText="Bandeja vacía. Las nuevas sesiones aparecerán aquí."
          />

          {/* RIGHT — Sesiones preparadas (2 secciones internas) */}
          <PreparadasColumn
            procesando={grouped.procesando}
            listas={grouped.listas}
            openedIds={openedIds}
            onAlertClick={handleOpen}
            onTogglePin={togglePin}
            onArchive={archiveSession}
          />
        </div>
      )}

      {/* Drawer de detalle */}
      <SesionDetailWorkstation
        session={openSession}
        open={!!openSession}
        onOpenChange={(o) => !o && setOpenSession(null)}
        onTogglePin={togglePin}
        onArchive={archiveSession}
        onRequestTranscription={requestTranscription}
        onRequestChatbot={requestChatbot}
      />

      {/* Chatbot global persistente */}
      <SesionesGlobalChatbot sessions={sessions} />
    </div>
  );
}

// ── Columna Bandeja ─────────────────────────────────────────────────────────
function BandejaColumn({
  label,
  color,
  alerts,
  openedIds,
  onAlertClick,
  onTogglePin,
  onArchive,
  emptyText,
}: {
  label: string;
  color: string;
  alerts: PeruSession[];
  openedIds: Set<string>;
  onAlertClick: (s: PeruSession) => void;
  onTogglePin: (id: string) => void;
  onArchive: (id: string) => void;
  emptyText: string;
}) {
  return (
    <div className="flex flex-col min-w-0 bg-card/30 rounded-lg border border-border/30">
      <div className="flex items-center gap-2 p-3 border-b border-border/30 sticky top-0 bg-card/80 backdrop-blur z-[1] rounded-t-lg">
        <div className={`w-2 h-2 rounded-full ${color}`} />
        <h3 className="text-sm font-medium text-foreground truncate">{label}</h3>
        <Badge variant="secondary" className="ml-auto text-xs">
          {alerts.length}
        </Badge>
      </div>
      <div className="p-2">
        <div className="flex flex-col gap-2 w-full min-w-0 max-w-full">
          {alerts.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground text-xs">
              {emptyText}
            </div>
          ) : (
            alerts.map((s) => (
              <SesionAlertCard
                key={`bandeja-${s.id}-${s.updated_at ?? ''}`}
                session={s}
                isUnread={!openedIds.has(s.id)}
                onTogglePin={onTogglePin}
                onArchive={onArchive}
                onOpen={onAlertClick}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ── Columna Sesiones preparadas (2 secciones internas) ─────────────────────
function PreparadasColumn({
  procesando,
  listas,
  openedIds,
  onAlertClick,
  onTogglePin,
  onArchive,
}: {
  procesando: PeruSession[];
  listas: PeruSession[];
  openedIds: Set<string>;
  onAlertClick: (s: PeruSession) => void;
  onTogglePin: (id: string) => void;
  onArchive: (id: string) => void;
}) {
  const renderGroup = (
    title: string,
    icon: React.ReactNode,
    color: string,
    alerts: PeruSession[],
    emptyText: string,
  ) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-1">
        <div className={`w-2 h-2 rounded-full ${color}`} />
        {icon}
        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">{title}</h4>
        <Badge variant="secondary" className="ml-auto text-[10px] h-5">
          {alerts.length}
        </Badge>
      </div>
      <div className="flex flex-col gap-2">
        {alerts.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-xs rounded-md border border-dashed border-border/40 bg-muted/10">
            {emptyText}
          </div>
        ) : (
          alerts.map((s) => (
            <SesionAlertCard
              key={`prep-${s.id}-${s.updated_at ?? ''}`}
              session={s}
              isUnread={!openedIds.has(s.id)}
              onTogglePin={onTogglePin}
              onArchive={onArchive}
              onOpen={onAlertClick}
            />
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-w-0 bg-card/30 rounded-lg border border-border/30">
      <div className="flex items-center gap-2 p-3 border-b border-border/30 sticky top-0 bg-card/80 backdrop-blur z-[1] rounded-t-lg">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        <h3 className="text-sm font-medium text-foreground truncate">Sesiones preparadas</h3>
        <Badge variant="secondary" className="ml-auto text-xs">
          {procesando.length + listas.length}
        </Badge>
      </div>
      <div className="p-3">
        <div className="flex flex-col gap-4">
          {renderGroup(
            'En procesamiento',
            <Loader2 className="h-3 w-3 text-primary" />,
            'bg-primary',
            procesando,
            'No hay alertas en procesamiento.',
          )}
          {renderGroup(
            'Listas',
            <CheckCircle2 className="h-3 w-3 text-success" />,
            'bg-success',
            listas,
            'No hay alertas listas.',
          )}
        </div>
      </div>
    </div>
  );
}
