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
import { isEmptyDataOrg } from '@/lib/orgDataIsolation';
import type {
  PeruSession,
  SesionChatbotState,
  SesionChatMessage,
  SesionEditorialState,
  SesionLegalReview,
  SesionTranscriptionState,
} from '@/types/peruSessions';

const LS_EDITORIAL = 'lawmeter:sesiones:editorial';
const LS_LEGAL = 'lawmeter:sesiones:legal-review';

interface EditorialEntry {
  is_pinned: boolean;
  is_archived: boolean;
  editorial_state: SesionEditorialState;
  transcription_state: SesionTranscriptionState;
  chatbot_state: SesionChatbotState;
  chatbot_summary?: string;
  chat_history?: SesionChatMessage[];
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
  return entry.editorial_state === 'en_revision' ? 'en_revision' : 'nueva';
}

function makeEntry(session: PeruSession): EditorialEntry {
  return {
    is_pinned: !!(session.is_pinned ?? session.is_pinned_for_publication),
    is_archived: !!session.is_archived,
    editorial_state: session.editorial_state ?? 'nueva',
    transcription_state: session.transcription_state ?? 'no_solicitada',
    chatbot_state: session.chatbot_state ?? 'no_solicitado',
    chatbot_summary: session.chatbot_summary,
    chat_history: session.chat_history,
  };
}

function deriveSummaryFromChat(history: SesionChatMessage[] | undefined): string | undefined {
  if (!history || history.length === 0) return undefined;
  const stamp = (m: SesionChatMessage) =>
    new Date(m.created_at).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' });
  return history
    .map((m) => `[${stamp(m)}] ${m.role === 'user' ? 'P' : 'R'}: ${m.content}`)
    .join('\n\n')
    .slice(-6000);
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
  const [openedIdsArr, setOpenedIdsArr] = useState<string[]>(() =>
    readJSON<string[]>('lawmeter:sesiones:opened', ['demo-sesion-5-2', 'demo-sesion-5-3', 'demo-sesion-5-4']),
  );
  useEffect(() => writeJSON('lawmeter:sesiones:opened', openedIdsArr), [openedIdsArr]);
  const openedIds = useMemo(() => new Set(openedIdsArr), [openedIdsArr]);
  const markOpened = useCallback((id: string) => {
    setOpenedIdsArr((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);
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
          const meta = (row.legal_review as any) ?? {};
          nextEditorial[row.session_id] = {
            is_pinned: !!row.is_pinned,
            is_archived: !!row.is_archived,
            editorial_state: (row.editorial_state ?? 'nueva') as SesionEditorialState,
            transcription_state: (row.transcription_state ?? 'no_solicitada') as SesionTranscriptionState,
            chatbot_state: (row.chatbot_state ?? 'no_solicitado') as SesionChatbotState,
            chatbot_summary: typeof meta?.__chatbot_summary === 'string' ? meta.__chatbot_summary : undefined,
            chat_history: Array.isArray(meta?.__chat_history) ? (meta.__chat_history as SesionChatMessage[]) : undefined,
          };
          if (
            row.legal_review &&
            Object.keys(meta).some((k) => k !== '__chatbot_summary' && k !== '__chat_history')
          ) {
            const { __chatbot_summary, __chat_history, ...rest } = meta as any;
            nextLegal[row.session_id] = rest as unknown as SesionLegalReview;
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
        is_follow_up: false,
        is_archived: entry.is_archived,
        editorial_state,
        transcription_state: entry.transcription_state,
        chatbot_state: entry.chatbot_state,
        chatbot_summary:
          deriveSummaryFromChat(entry.chat_history) ?? entry.chatbot_summary ?? s.chatbot_summary,
        chat_history: entry.chat_history ?? s.chat_history,
        legal_review: legal[s.id] ?? s.legal_review,
      } satisfies PeruSession;
    });
  }, [baseSessions, editorial, legal]);

  // Upsert en Supabase (silencioso, no bloqueante)
  const upsertRemote = useCallback(
    async (sessionId: string, entry: EditorialEntry, legalReview?: SesionLegalReview) => {
      if (!userId) return;
      // Empaquetamos resumen + historial de chat dentro de legal_review (jsonb) para no requerir migración.
      const needsMeta =
        legalReview !== undefined ||
        entry.chatbot_summary !== undefined ||
        entry.chat_history !== undefined;
      const legalPayload = needsMeta
        ? {
            ...(legalReview ?? {}),
            __chatbot_summary: entry.chatbot_summary ?? null,
            __chat_history: entry.chat_history ?? null,
          }
        : undefined;
      const payload = {
        session_id: sessionId,
        user_id: userId,
        is_pinned: entry.is_pinned,
        is_follow_up: false,
        is_archived: entry.is_archived,
        editorial_state: deriveEditorialState(entry),
        transcription_state: entry.transcription_state,
        chatbot_state: entry.chatbot_state,
        ...(legalPayload !== undefined ? { legal_review: legalPayload as any } : {}),
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

  const archiveSession = useCallback(
    (sessionId: string) => {
      const s = sessions.find((x) => x.id === sessionId);
      const next = !s?.is_archived;
      mutate(sessionId, {
        is_archived: next,
        is_pinned: next ? false : s?.is_pinned ?? false,
      });
      toast.success(next ? 'Sesión archivada' : 'Sesión restaurada');
    },
    [sessions, mutate],
  );

  /** @deprecated Reemplazado por appendChatMessage; se mantiene por compat con el chatbot global eliminado. */
  const appendChatbotSummary = useCallback(
    (sessionId: string, snippet: string) => {
      const trimmed = snippet.trim();
      if (!trimmed) return;
      const s = sessions.find((x) => x.id === sessionId);
      const previous = s?.chatbot_summary?.trim() ?? '';
      const merged = (previous ? `${previous}\n\n${trimmed}` : trimmed).slice(-4000);
      mutate(sessionId, { chatbot_summary: merged });
    },
    [sessions, mutate],
  );

  /** Agrega un mensaje al historial de chat interno de la alerta.
   * Mantiene últimos 50 mensajes y refresca chatbot_summary derivado para Reportes legacy.
   */
  const appendChatMessage = useCallback(
    (sessionId: string, message: Omit<SesionChatMessage, 'id' | 'created_at'> & Partial<Pick<SesionChatMessage, 'id' | 'created_at'>>) => {
      const s = sessions.find((x) => x.id === sessionId);
      const previous = s?.chat_history ?? [];
      const full: SesionChatMessage = {
        id: message.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        role: message.role,
        content: message.content,
        created_at: message.created_at ?? new Date().toISOString(),
      };
      const next = [...previous, full].slice(-50);
      mutate(sessionId, {
        chat_history: next,
        chatbot_summary: deriveSummaryFromChat(next),
      });
    },
    [sessions, mutate],
  );

  const clearChatHistory = useCallback(
    (sessionId: string) => {
      mutate(sessionId, { chat_history: [], chatbot_summary: undefined });
    },
    [mutate],
  );

  /** Análisis IA en cadena: dispara transcripción + chatbot a la vez.
   * Estados internos avanzan en sincronía: en_cola → procesando → (lista/listo).
   * La transcripción NO se expone al usuario; solo habilita el chat interno.
   */
  const requestAIAnalysis = useCallback(
    (sessionId: string) => {
      const apply = (
        tState: SesionTranscriptionState,
        cState: SesionChatbotState,
      ) => mutate(sessionId, { transcription_state: tState, chatbot_state: cState });

      apply('en_cola', 'en_cola');
      toast.success('Análisis IA en cola · ~20 min');
      setTimeout(() => apply('procesando', 'procesando'), 1200);
      setTimeout(() => {
        apply('lista', 'listo');
        toast.success('Análisis IA listo. Ya puedes conversar con la alerta.');
      }, 4500);
    },
    [mutate],
  );

  // Aliases legacy (algunos consumidores aún los referencian)
  const requestTranscription = requestAIAnalysis;
  const requestChatbot = requestAIAnalysis;

  const updateLegalReview = useCallback(
    (sessionId: string, review: SesionLegalReview) => {
      setLegal((prev) => ({ ...prev, [sessionId]: review }));
      const entry = editorial[sessionId] ??
        makeEntry(sessions.find((s) => s.id === sessionId) ?? ({ id: sessionId } as PeruSession));
      upsertRemote(sessionId, entry, review);
    },
    [editorial, sessions, upsertRemote],
  );

  const stats = useMemo(() => {
    const visible = sessions.filter((s) => !s.is_archived);
    return {
      total: visible.length,
      pinned: visible.filter((s) => s.is_pinned).length,
      processingAI: visible.filter(
        (s) =>
          s.transcription_state === 'procesando' ||
          s.transcription_state === 'en_cola' ||
          s.chatbot_state === 'procesando' ||
          s.chatbot_state === 'en_cola',
      ).length,
      eligibleForReport: visible.filter((s) => s.is_pinned).length,
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
    openedIds,
    markOpened,
    togglePin,
    archiveSession,
    requestAIAnalysis,
    requestTranscription,
    requestChatbot,
    updateLegalReview,
    appendChatbotSummary,
    appendChatMessage,
    clearChatHistory,
  };
}
