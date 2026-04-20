// Workspace de Sesiones — mismo patrón visual que la bandeja de Alertas Regulatorias.
// Layout: kanban de 3 columnas (Nuevas / Procesando IA / Listas) usando KanbanColumn.
// Acciones por alerta: Pin / Archivar.
// Toggle "Archivadas" muestra una vista única (grid) de archivadas.
// Chatbot global persistente en la esquina inferior derecha.

import { useEffect, useMemo, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Inbox as InboxIcon, Pin, Sparkles, CheckCircle2, Mail } from 'lucide-react';
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

type SessionKanbanStage = 'nuevas' | 'procesando' | 'listas';

const KANBAN_COLUMNS: { id: SessionKanbanStage; label: string; color: string }[] = [
  { id: 'nuevas', label: 'Nuevas', color: 'bg-primary' },
  { id: 'procesando', label: 'Procesando IA', color: 'bg-blue-500' },
  { id: 'listas', label: 'Listas', color: 'bg-success' },
];

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

  // Counts globales
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

  // ── Agrupación por columna kanban ────────────────────────────────────────
  const alertsByStage = useMemo(() => {
    const grouped: Record<SessionKanbanStage, PeruSession[]> = {
      nuevas: [],
      procesando: [],
      listas: [],
    };

    filtered.forEach((s) => {
      const t = s.transcription_state ?? 'no_solicitada';
      const c = s.chatbot_state ?? 'no_solicitado';
      const isProcessing =
        ['en_cola', 'procesando'].includes(t) || ['en_cola', 'procesando'].includes(c);
      const isReady = t === 'lista' || c === 'listo';

      if (isReady) grouped.listas.push(s);
      else if (isProcessing) grouped.procesando.push(s);
      else grouped.nuevas.push(s);
    });

    (Object.keys(grouped) as SessionKanbanStage[]).forEach((k) => {
      grouped[k] = sortAlerts(grouped[k]);
    });

    return grouped;
  }, [filtered, openedIds]);

  const handleOpen = (s: PeruSession) => {
    markOpened(s.id);
    setOpenSession(s);
  };

  const newCount = useMemo(
    () => visibleSessions.filter((s) => !openedIds.has(s.id)).length,
    [visibleSessions, openedIds],
  );

  // Vista archivadas (grid)
  const archivedView = filters.showArchived;

  return (
    <div className="space-y-4">
      {/* ── KPI Cards (mismo diseño que BillsInbox) ─────────────────────── */}
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
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Sparkles className="h-4 w-4 text-blue-400" />
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

      {/* ── Filtros (mismo patrón compacto que BillsFilterBar) ──────────── */}
      <SesionesFilterBar
        filters={filters}
        onChange={setFilters}
        sessions={sessions}
        pinnedCount={stats.pinned}
        archivedCount={archivedCount}
      />

      {/* ── Kanban 3 columnas (o grid de archivadas) ───────────────────── */}
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
        <div className="flex gap-4 w-full">
          {KANBAN_COLUMNS.map((col) => (
            <SessionKanbanColumn
              key={col.id}
              label={col.label}
              color={col.color}
              alerts={alertsByStage[col.id]}
              openedIds={openedIds}
              onAlertClick={handleOpen}
              onTogglePin={togglePin}
              onArchive={archiveSession}
            />
          ))}
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

// ── Columna kanban (réplica de KanbanColumn de Inbox) ─────────────────────
function SessionKanbanColumn({
  label,
  color,
  alerts,
  openedIds,
  onAlertClick,
  onTogglePin,
  onArchive,
}: {
  label: string;
  color: string;
  alerts: PeruSession[];
  openedIds: Set<string>;
  onAlertClick: (s: PeruSession) => void;
  onTogglePin: (id: string) => void;
  onArchive: (id: string) => void;
}) {
  return (
    <div className="flex flex-col flex-1 min-w-0 basis-0 bg-card/30 rounded-lg border border-border/30 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b border-border/30">
        <div className={`w-2 h-2 rounded-full ${color}`} />
        <h3 className="text-sm font-medium text-foreground truncate">{label}</h3>
        <Badge variant="secondary" className="ml-auto text-xs">
          {alerts.length}
        </Badge>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 p-2 w-full [&>[data-radix-scroll-area-viewport]]:!block [&>[data-radix-scroll-area-viewport]>div]:!block [&>[data-radix-scroll-area-viewport]>div]:!w-full">
        <div className="flex flex-col gap-2 w-full min-w-0 max-w-full">
          {alerts.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No hay sesiones
            </div>
          ) : (
            alerts.map((s) => (
              <SesionAlertCard
                key={`${s.id}-${s.updated_at ?? ''}`}
                session={s}
                isUnread={!openedIds.has(s.id)}
                onTogglePin={onTogglePin}
                onArchive={onArchive}
                onOpen={onAlertClick}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
