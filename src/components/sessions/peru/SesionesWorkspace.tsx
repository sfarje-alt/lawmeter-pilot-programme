// Workspace de Sesiones — mismo patrón visual que la bandeja de Alertas Regulatorias.
// Layout split:
//   · Izquierda  → Bandeja: "Nuevas" + "Abiertas / vistas anteriores"
//   · Derecha    → Cola de estado: "Procesando IA" + "Listas" + "Archivadas"
// Acciones por alerta: Pin / Archivar.
// Chatbot global persistente en la esquina inferior derecha.

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Inbox as InboxIcon, Pin, Sparkles, CheckCircle2 } from 'lucide-react';
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
import { SesionesEmptyState } from './SesionesEmptyStates';
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

  // Filtrar
  const filtered = useMemo(
    () => applySesionesFilters(sessions, filters),
    [sessions, filters],
  );

  // Sort: pineadas arriba, luego por fecha desc
  const sortAlerts = (arr: PeruSession[]) =>
    [...arr].sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      const da = new Date(a.scheduled_at ?? a.created_at).getTime();
      const db = new Date(b.scheduled_at ?? b.created_at).getTime();
      return db - da;
    });

  // Bandeja izquierda
  const notArchived = useMemo(() => filtered.filter((s) => !s.is_archived), [filtered]);
  const newAlerts = useMemo(
    () => sortAlerts(notArchived.filter((s) => !openedIds.has(s.id))),
    [notArchived, openedIds],
  );
  const seenAlerts = useMemo(
    () => sortAlerts(notArchived.filter((s) => openedIds.has(s.id))),
    [notArchived, openedIds],
  );

  // Cola derecha
  const processingAI = useMemo(
    () =>
      sortAlerts(
        notArchived.filter(
          (s) =>
            s.transcription_state === 'procesando' ||
            s.transcription_state === 'en_cola' ||
            s.chatbot_state === 'procesando' ||
            s.chatbot_state === 'en_cola',
        ),
      ),
    [notArchived],
  );
  const readyAlerts = useMemo(
    () =>
      sortAlerts(
        notArchived.filter(
          (s) => s.transcription_state === 'lista' && s.chatbot_state === 'listo',
        ),
      ),
    [notArchived],
  );
  const archivedAlerts = useMemo(
    () => sortAlerts(filtered.filter((s) => s.is_archived)),
    [filtered],
  );

  const handleOpen = (s: PeruSession) => {
    markOpened(s.id);
    setOpenSession(s);
  };

  return (
    <div className="space-y-4">
      {/* KPI Cards — mismo diseño que la bandeja regulatoria */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard
          icon={<InboxIcon className="h-4 w-4 text-primary" />}
          tone="primary"
          value={stats.total}
          label="Total sesiones"
        />
        <KPICard
          icon={<Sparkles className="h-4 w-4 text-primary" />}
          tone="primary"
          value={stats.processingAI}
          label="Procesando IA"
        />
        <KPICard
          icon={<CheckCircle2 className="h-4 w-4 text-success" />}
          tone="success"
          value={stats.readyForReview}
          label="Listas"
        />
        <KPICard
          icon={<Pin className="h-4 w-4 text-primary" />}
          tone="primary"
          value={stats.pinned}
          label="Pineadas"
        />
      </div>

      {/* Filtros */}
      <SesionesFilterBar filters={filters} onChange={setFilters} sessions={sessions} />

      {/* Split workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ── Columna izquierda: BANDEJA ──────────────────────────────────── */}
        <div className="space-y-4">
          <BandejaSection
            title="Nuevas"
            count={newAlerts.length}
            tone="primary"
            empty="No hay alertas nuevas. Las sesiones que aún no abras aparecerán aquí."
          >
            {newAlerts.map((s) => (
              <SesionAlertCard
                key={s.id}
                session={s}
                isUnread
                onTogglePin={togglePin}
                onArchive={archiveSession}
                onOpen={handleOpen}
              />
            ))}
          </BandejaSection>

          <BandejaSection
            title="Abiertas / vistas anteriores"
            count={seenAlerts.length}
            tone="muted"
            empty="Aún no has abierto ninguna sesión."
          >
            {seenAlerts.map((s) => (
              <SesionAlertCard
                key={s.id}
                session={s}
                onTogglePin={togglePin}
                onArchive={archiveSession}
                onOpen={handleOpen}
              />
            ))}
          </BandejaSection>
        </div>

        {/* ── Columna derecha: COLA DE ESTADO ─────────────────────────────── */}
        <div className="space-y-4">
          <BandejaSection
            title="Procesando IA"
            count={processingAI.length}
            tone="primary"
            empty="No hay sesiones procesando transcripción o chatbot."
          >
            {processingAI.map((s) => (
              <SesionAlertCard
                key={s.id}
                session={s}
                onTogglePin={togglePin}
                onArchive={archiveSession}
                onOpen={handleOpen}
              />
            ))}
          </BandejaSection>

          <BandejaSection
            title="Listas"
            count={readyAlerts.length}
            tone="success"
            empty="No hay sesiones con transcripción y chatbot listos."
          >
            {readyAlerts.map((s) => (
              <SesionAlertCard
                key={s.id}
                session={s}
                onTogglePin={togglePin}
                onArchive={archiveSession}
                onOpen={handleOpen}
              />
            ))}
          </BandejaSection>

          <BandejaSection
            title="Archivadas"
            count={archivedAlerts.length}
            tone="muted"
            empty="No hay sesiones archivadas."
            collapsible
          >
            {archivedAlerts.map((s) => (
              <SesionAlertCard
                key={s.id}
                session={s}
                onTogglePin={togglePin}
                onArchive={archiveSession}
                onOpen={handleOpen}
              />
            ))}
          </BandejaSection>
        </div>
      </div>

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

// ── helpers ─────────────────────────────────────────────────────────────────
function KPICard({
  icon,
  tone,
  value,
  label,
}: {
  icon: React.ReactNode;
  tone: 'primary' | 'success' | 'muted';
  value: number;
  label: string;
}) {
  const bg =
    tone === 'success' ? 'bg-success/10' : tone === 'muted' ? 'bg-muted/40' : 'bg-primary/10';
  return (
    <Card className="glass-card border-border/30">
      <CardContent className="pt-3 pb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${bg}`}>{icon}</div>
          <div>
            <div className="text-xl font-bold text-foreground">{value}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BandejaSection({
  title,
  count,
  tone,
  empty,
  collapsible,
  children,
}: {
  title: string;
  count: number;
  tone: 'primary' | 'success' | 'muted';
  empty: string;
  collapsible?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(!collapsible);
  const dot =
    tone === 'success' ? 'bg-success' : tone === 'muted' ? 'bg-muted-foreground/40' : 'bg-primary';

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => collapsible && setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 px-1"
        disabled={!collapsible}
      >
        <div className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
          <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">
            {title}
          </h3>
          <span className="text-xs text-muted-foreground">({count})</span>
        </div>
        {collapsible && (
          <span className="text-[10px] text-muted-foreground">{open ? 'Ocultar' : 'Mostrar'}</span>
        )}
      </button>

      {open &&
        (count === 0 ? (
          <div className="rounded-md border border-dashed border-border/50 bg-muted/10 p-4 text-center text-xs text-muted-foreground">
            {empty}
          </div>
        ) : (
          <div className="space-y-2">{children}</div>
        ))}
    </div>
  );
}
