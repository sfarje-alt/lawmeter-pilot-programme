// Hook de workspace editorial para Sesiones (single-profile).
// Persiste el estado editorial (pin, follow-up, archivado, IA, revisión legal)
// en Supabase (tabla `session_editorial_state`) cuando hay usuario autenticado,
// y cae a localStorage como fallback (modo demo / no autenticado).

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { usePeruSessions } from './usePeruSessions';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { SESIONES_DEMO_ALERTS } from '@/data/sesionesDemoAlerts';
import type {
  PeruSession,
  SesionChatbotState,
  SesionEditorialState,
  SesionLegalReview,
  SesionTranscriptionState,
} from '@/types/peruSessions';

const LS_EDITORIAL = 'lawmeter:sesiones:editorial';
const LS_LEGAL = 'lawmeter:sesiones:legal-review';

interface EditorialEntry {
  is_pinned: boolean;
  is_follow_up: boolean;
  is_archived: boolean;
  editorial_state: SesionEditorialState;
  transcription_state: SesionTranscriptionState;
  chatbot_state: SesionChatbotState;
}

type EditorialMap = Record<string, EditorialEntry>;
type LegalMap = Record<string, SesionLegalReview>;

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

function deriveEditorialState(entry: EditorialEntry): SesionEditorialState {
  if (entry.is_archived) return 'archivada';
  if (entry.is_pinned) return 'pineada';
  if (entry.is_follow_up) return 'en_seguimiento';
  return entry.editorial_state === 'en_revision' ? 'en_revision' : 'nueva';
}

function makeEntry(session: PeruSession): EditorialEntry {
  return {
    is_pinned: !!(session.is_pinned ?? session.is_pinned_for_publication),
    is_follow_up: !!session.is_follow_up,
    is_archived: !!session.is_archived,
    editorial_state: session.editorial_state ?? 'nueva',
    transcription_state: session.transcription_state ?? 'no_solicitada',
    chatbot_state: session.chatbot_state ?? 'no_solicitado',
  };
}

export function useSesionesWorkspace() {
  const base = usePeruSessions();
  const { user } = useAuth();
  const userId = user?.id;

  const [editorial, setEditorial] = useState<EditorialMap>(() =>
    readJSON<EditorialMap>(LS_EDITORIAL, {}),
  );
  const [legal, setLegal] = useState<LegalMap>(() =>
    readJSON<LegalMap>(LS_LEGAL, {}),
  );
  const hydratedRef = useRef(false);

  // Hidratar desde Supabase cuando hay usuario
  useEffect(() => {
    if (!userId) {
      hydratedRef.current = false;
      return;
    }
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('session_editorial_state')
        .select('*')
        .eq('user_id', userId);
      if (cancelled) return;
      if (error) {
        console.warn('[Sesiones] No se pudo cargar estado editorial:', error.message);
        return;
      }
      if (data) {
        const nextEditorial: EditorialMap = {};
        const nextLegal: LegalMap = {};
        for (const row of data) {
          nextEditorial[row.session_id] = {
            is_pinned: !!row.is_pinned,
            is_follow_up: !!row.is_follow_up,
            is_archived: !!row.is_archived,
            editorial_state: (row.editorial_state ?? 'nueva') as SesionEditorialState,
            transcription_state: (row.transcription_state ?? 'no_solicitada') as SesionTranscriptionState,
            chatbot_state: (row.chatbot_state ?? 'no_solicitado') as SesionChatbotState,
          };
          if (row.legal_review) {
            nextLegal[row.session_id] = row.legal_review as SesionLegalReview;
          }
        }
        setEditorial((prev) => ({ ...prev, ...nextEditorial }));
        setLegal((prev) => ({ ...prev, ...nextLegal }));
      }
      hydratedRef.current = true;
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Persistir local siempre (fallback offline / demo)
  useEffect(() => writeJSON(LS_EDITORIAL, editorial), [editorial]);
  useEffect(() => writeJSON(LS_LEGAL, legal), [legal]);

  // Combinar sesiones reales + demo (demo si BD viene vacía)
  const baseSessions = base.allSessions;
  const sessions = useMemo<PeruSession[]>(() => {
    const real = baseSessions.length > 0 ? baseSessions : SESIONES_DEMO_ALERTS;
    return real.map((s) => {
      const stored = editorial[s.id];
      const entry: EditorialEntry = stored ?? makeEntry(s);
      const editorial_state = deriveEditorialState(entry);
      return {
        ...s,
        is_pinned: entry.is_pinned,
        is_pinned_for_publication: entry.is_pinned,
        is_follow_up: entry.is_follow_up,
        is_archived: entry.is_archived,
        editorial_state,
        transcription_state: entry.transcription_state,
        chatbot_state: entry.chatbot_state,
        legal_review: legal[s.id] ?? s.legal_review,
      } satisfies PeruSession;
    });
  }, [baseSessions, editorial, legal]);

  // Upsert en Supabase (silencioso, no bloqueante)
  const upsertRemote = useCallback(
    async (sessionId: string, entry: EditorialEntry, legalReview?: SesionLegalReview) => {
      if (!userId) return;
      const payload = {
        session_id: sessionId,
        user_id: userId,
        is_pinned: entry.is_pinned,
        is_follow_up: entry.is_follow_up,
        is_archived: entry.is_archived,
        editorial_state: deriveEditorialState(entry),
        transcription_state: entry.transcription_state,
        chatbot_state: entry.chatbot_state,
        ...(legalReview !== undefined ? { legal_review: legalReview as any } : {}),
      };
      const { error } = await supabase
        .from('session_editorial_state')
        .upsert(payload, { onConflict: 'session_id,user_id' });
      if (error) {
        console.warn('[Sesiones] No se pudo persistir estado:', error.message);
      }
    },
    [userId],
  );

  // Mutadores
  const mutate = useCallback(
    (sessionId: string, partial: Partial<EditorialEntry>) => {
      setEditorial((prev) => {
        const current =
          prev[sessionId] ??
          makeEntry(
            sessions.find((s) => s.id === sessionId) ?? ({ id: sessionId } as PeruSession),
          );
        const next = { ...current, ...partial };
        // Persistir en background
        upsertRemote(sessionId, next, legal[sessionId]);
        return { ...prev, [sessionId]: next };
      });
    },
    [sessions, upsertRemote, legal],
  );

  const togglePin = useCallback(
    (sessionId: string) => {
      const s = sessions.find((x) => x.id === sessionId);
      const next = !s?.is_pinned;
      mutate(sessionId, { is_pinned: next, is_archived: false });
      toast.success(next ? 'Sesión pineada' : 'Pin removido');
    },
    [sessions, mutate],
  );

  const toggleFollowUp = useCallback(
    (sessionId: string) => {
      const s = sessions.find((x) => x.id === sessionId);
      const next = !s?.is_follow_up;
      mutate(sessionId, { is_follow_up: next, is_archived: false });
      toast.success(next ? 'Marcada para seguimiento' : 'Seguimiento removido');
    },
    [sessions, mutate],
  );

  const archiveSession = useCallback(
    (sessionId: string) => {
      const s = sessions.find((x) => x.id === sessionId);
      const next = !s?.is_archived;
      mutate(sessionId, {
        is_archived: next,
        is_pinned: next ? false : s?.is_pinned ?? false,
        is_follow_up: next ? false : s?.is_follow_up ?? false,
      });
      toast.success(next ? 'Sesión archivada' : 'Sesión restaurada');
    },
    [sessions, mutate],
  );

  // Acciones IA — simulan ciclo en cola → procesando → lista
  const startAIJob = useCallback(
    (
      sessionId: string,
      kind: 'transcription' | 'chatbot',
    ) => {
      const ready = kind === 'transcription' ? 'lista' : 'listo';

      const apply = (state: string) =>
        mutate(sessionId, kind === 'transcription'
          ? { transcription_state: state as SesionTranscriptionState }
          : { chatbot_state: state as SesionChatbotState });

      apply('en_cola');
      toast.success(
        kind === 'transcription'
          ? 'Transcripción en cola · ~20 min'
          : 'Chatbot en cola · ~20 min',
      );
      setTimeout(() => apply('procesando'), 1200);
      setTimeout(() => apply(ready), 4500);
    },
    [mutate],
  );

  const requestTranscription = useCallback(
    (sessionId: string) => startAIJob(sessionId, 'transcription'),
    [startAIJob],
  );

  const requestChatbot = useCallback(
    (sessionId: string) => startAIJob(sessionId, 'chatbot'),
    [startAIJob],
  );

  const updateLegalReview = useCallback(
    (sessionId: string, review: SesionLegalReview) => {
      setLegal((prev) => ({ ...prev, [sessionId]: review }));
      // Persistir junto al estado editorial actual
      const entry = editorial[sessionId] ??
        makeEntry(sessions.find((s) => s.id === sessionId) ?? ({ id: sessionId } as PeruSession));
      upsertRemote(sessionId, entry, review);
    },
    [editorial, sessions, upsertRemote],
  );

  // KPIs
  const stats = useMemo(() => {
    const visible = sessions.filter((s) => !s.is_archived);
    return {
      total: visible.length,
      pinned: visible.filter((s) => s.is_pinned).length,
      followUp: visible.filter((s) => s.is_follow_up).length,
      processingAI: visible.filter(
        (s) =>
          s.transcription_state === 'procesando' ||
          s.transcription_state === 'en_cola' ||
          s.chatbot_state === 'procesando' ||
          s.chatbot_state === 'en_cola',
      ).length,
      eligibleForReport: visible.filter((s) => s.is_pinned || s.is_follow_up).length,
      readyForReview: visible.filter(
        (s) => s.transcription_state === 'lista' && s.chatbot_state === 'listo',
      ).length,
      archived: sessions.filter((s) => s.is_archived).length,
    };
  }, [sessions]);

  return {
    sessions,
    isLoading: base.isLoading,
    stats,
    togglePin,
    toggleFollowUp,
    archiveSession,
    requestTranscription,
    requestChatbot,
    updateLegalReview,
  };
}
