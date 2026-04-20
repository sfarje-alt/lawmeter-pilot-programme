// Workspace principal de Sesiones (single-profile, dark premium).
// Tabs · KPIs · Filtros · ReportesConnector · Lista de SesionAlertCard.

import { useMemo, useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useSesionesWorkspace } from '@/hooks/useSesionesWorkspace';
import { SesionesKPIRow } from './SesionesKPIRow';
import {
  SesionesFilterBar,
  applySesionesFilters,
  DEFAULT_FILTERS,
  type SesionesFilters,
} from './SesionesFilterBar';
import { SesionAlertCard } from './SesionAlertCard';
import { ReportesConnector } from './ReportesConnector';
import { SesionesEmptyState } from './SesionesEmptyStates';
import { SesionDetailWorkstation } from './SesionDetailWorkstation';
import type { PeruSession } from '@/types/peruSessions';

type TabKey =
  | 'todas'
  | 'nuevas'
  | 'pineadas'
  | 'seguimiento'
  | 'procesando'
  | 'listas'
  | 'archivadas';

interface Props {
  initialSessionId?: string | null;
}

export function SesionesWorkspace({ initialSessionId }: Props) {
  const {
    sessions,
    stats,
    togglePin,
    toggleFollowUp,
    archiveSession,
    requestTranscription,
    requestChatbot,
    updateLegalReview,
  } = useSesionesWorkspace();

  const [tab, setTab] = useState<TabKey>('todas');
  const [filters, setFilters] = useState<SesionesFilters>(DEFAULT_FILTERS);
  const [openSession, setOpenSession] = useState<PeruSession | null>(null);

  useEffect(() => {
    if (!initialSessionId) return;
    const s = sessions.find((x) => x.id === initialSessionId);
    if (s) setOpenSession(s);
  }, [initialSessionId, sessions]);

  // Mantener referencia viva a la sesión abierta cuando cambia el estado
  useEffect(() => {
    if (!openSession) return;
    const fresh = sessions.find((s) => s.id === openSession.id);
    if (fresh && fresh !== openSession) setOpenSession(fresh);
  }, [sessions, openSession]);

  const visibleByTab = useMemo(() => {
    const notArchived = sessions.filter((s) => !s.is_archived);
    switch (tab) {
      case 'nuevas':
        return notArchived.filter((s) => (s.editorial_state ?? 'nueva') === 'nueva');
      case 'pineadas':
        return notArchived.filter((s) => s.is_pinned);
      case 'seguimiento':
        return notArchived.filter((s) => s.is_follow_up);
      case 'procesando':
        return notArchived.filter(
          (s) =>
            s.transcription_state === 'procesando' ||
            s.transcription_state === 'en_cola' ||
            s.chatbot_state === 'procesando' ||
            s.chatbot_state === 'en_cola',
        );
      case 'listas':
        return notArchived.filter(
          (s) => s.transcription_state === 'lista' && s.chatbot_state === 'listo',
        );
      case 'archivadas':
        return sessions.filter((s) => s.is_archived);
      default:
        return notArchived;
    }
  }, [sessions, tab]);

  const filtered = useMemo(
    () => applySesionesFilters(visibleByTab, filters),
    [visibleByTab, filters],
  );

  const emptyVariant: 'pinned' | 'follow_up' | 'archived' | 'all' =
    tab === 'pineadas'
      ? 'pinned'
      : tab === 'seguimiento'
        ? 'follow_up'
        : tab === 'archivadas'
          ? 'archived'
          : 'all';

  return (
    <div className="space-y-6">
      <SesionesKPIRow
        total={stats.total}
        pinned={stats.pinned}
        followUp={stats.followUp}
        processingAI={stats.processingAI}
        eligibleForReport={stats.eligibleForReport}
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)}>
        <TabsList className="bg-muted/40 flex-wrap h-auto">
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="nuevas">Nuevas</TabsTrigger>
          <TabsTrigger value="pineadas">
            Pineadas {stats.pinned > 0 && <span className="ml-1.5 text-[10px] opacity-70">({stats.pinned})</span>}
          </TabsTrigger>
          <TabsTrigger value="seguimiento">
            Seguimiento {stats.followUp > 0 && <span className="ml-1.5 text-[10px] opacity-70">({stats.followUp})</span>}
          </TabsTrigger>
          <TabsTrigger value="procesando">
            Procesando IA {stats.processingAI > 0 && <span className="ml-1.5 text-[10px] opacity-70">({stats.processingAI})</span>}
          </TabsTrigger>
          <TabsTrigger value="listas">
            Listas para revisión {stats.readyForReview > 0 && <span className="ml-1.5 text-[10px] opacity-70">({stats.readyForReview})</span>}
          </TabsTrigger>
          <TabsTrigger value="archivadas">
            Archivadas {stats.archived > 0 && <span className="ml-1.5 text-[10px] opacity-70">({stats.archived})</span>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-6 space-y-4">
          <SesionesFilterBar filters={filters} onChange={setFilters} sessions={sessions} />

          <ReportesConnector pinned={stats.pinned} followUp={stats.followUp} />

          {filtered.length === 0 ? (
            <SesionesEmptyState variant={emptyVariant} />
          ) : (
            <>
              <p className="text-xs text-muted-foreground">
                Mostrando {filtered.length} {filtered.length === 1 ? 'sesión' : 'sesiones'}
              </p>
              <div className="space-y-3">
                {filtered.map((s) => (
                  <SesionAlertCard
                    key={s.id}
                    session={s}
                    onTogglePin={togglePin}
                    onToggleFollowUp={toggleFollowUp}
                    onArchive={archiveSession}
                    onOpen={setOpenSession}
                  />
                ))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      <SesionDetailWorkstation
        session={openSession}
        open={!!openSession}
        onOpenChange={(o) => !o && setOpenSession(null)}
        onTogglePin={togglePin}
        onToggleFollowUp={toggleFollowUp}
        onArchive={archiveSession}
        onRequestTranscription={requestTranscription}
        onRequestChatbot={requestChatbot}
        onUpdateLegalReview={updateLegalReview}
      />
    </div>
  );
}
