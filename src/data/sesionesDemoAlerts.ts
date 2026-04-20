// Demo alerts for the Sesiones workspace prototype.
// STRICTLY source-backed: only fields explicitly available in the session JSON
// + agenda markdown for the parent session
// "PRESUPUESTO Y CUENTA GENERAL DE LA REPÚBLICA · 01/04/2026 09:00".
// No invented risk / urgency / impact / IA tag / commentary.

import type { PeruSession, SessionRecording } from '@/types/peruSessions';

const PARENT_ID = 'demo-presupuesto-2026-04-01';
const COMMISSION = 'PRESUPUESTO Y CUENTA GENERAL DE LA REPÚBLICA';
const SCHEDULED_AT = '2026-04-01T09:00:00';
const SCHEDULED_TEXT = '01/04/2026 09:00 AM';
const AGENDA_URL =
  'https://www.congreso.gob.pe/comisiones2025/PresupuestoCuentaGeneralRepublica/agenda';

const SHARED_RECORDING_BASE: Omit<SessionRecording, 'id' | 'session_id'> = {
  provider: 'YOUTUBE',
  channel_name: 'Congreso de la República del Perú',
  channel_id: 'UC9HLcODpEZuBRLSKXZx5igw',
  expected_title:
    '🔴 EN VIVO: Comisión de Presupuesto y Cuenta General de la República | 1 DE ABRIL DEL 2026',
  video_id: 'fhAo3QGZ1EY',
  video_url: 'https://www.youtube.com/watch?v=fhAo3QGZ1EY',
  resolution_confidence: 'HIGH',
  resolution_method: 'EXACT_STRIP_EMOJI',
  resolved_at: SCHEDULED_AT,
  created_at: SCHEDULED_AT,
};

function buildRecording(
  sessionId: string,
  overrides: Partial<SessionRecording> = {},
): SessionRecording {
  return {
    id: `rec-${sessionId}`,
    session_id: sessionId,
    ...SHARED_RECORDING_BASE,
    ...overrides,
  };
}

// Workflow seed: distintos estados de prototipo
// 5.1 → Nueva (no abierta)            · transcripción no solicitada · chatbot no solicitado
// 5.2 → Abierta + Pineada              · transcripción lista        · chatbot listo
// 5.3 → Abierta · Procesando IA        · transcripción procesando   · chatbot en cola
// 5.4 → Abierta · Lista                · transcripción lista        · chatbot listo

export const SESIONES_DEMO_ALERTS: PeruSession[] = [
  // ── 5.1 ────────────────────────────────────────────────────────────────────
  {
    id: 'demo-sesion-5-1',
    parent_session_id: PARENT_ID,
    external_session_id: `${PARENT_ID}-5-1`,
    commission_name: COMMISSION,
    session_title:
      'Presentación del Ministro de Defensa para sustentar el Proyecto de Ley 14305/2025-PE',
    scheduled_at: SCHEDULED_AT,
    scheduled_date_text: SCHEDULED_TEXT,
    agenda_url: AGENDA_URL,
    status: 'scheduled',
    source: 'PERU_CONGRESS_SYNC',
    source_file_name: 'agenda_presupuesto_2026-04-01.md',
    jurisdiction: 'PERU',
    created_at: SCHEDULED_AT,
    updated_at: SCHEDULED_AT,

    agenda_state: 'lista',
    video_state: 'vinculado',
    transcription_state: 'no_solicitada',
    chatbot_state: 'no_solicitado',
    editorial_state: 'nueva',
    is_pinned: false,
    is_follow_up: false,
    is_archived: false,

    agenda_item: {
      item_number: '5.1',
      title:
        'Presentación del Ministro de Defensa para sustentar el Proyecto de Ley 14305/2025-PE',
      thematic_area: 'DEFENSA NACIONAL',
      bill_numbers: ['14305/2025-PE'],
    },

    recording: buildRecording('demo-sesion-5-1', {
      transcription_status: 'NOT_STARTED',
      analysis_status: 'NOT_STARTED',
    }),
  },

  // ── 5.2 ────────────────────────────────────────────────────────────────────
  {
    id: 'demo-sesion-5-2',
    parent_session_id: PARENT_ID,
    external_session_id: `${PARENT_ID}-5-2`,
    commission_name: COMMISSION,
    session_title:
      'Debate y votación del predictamen sobre los Proyectos de Ley 04122/2022-CR, 07073/2023-CR y 14305/2025-PE',
    scheduled_at: SCHEDULED_AT,
    scheduled_date_text: SCHEDULED_TEXT,
    agenda_url: AGENDA_URL,
    status: 'scheduled',
    source: 'PERU_CONGRESS_SYNC',
    source_file_name: 'agenda_presupuesto_2026-04-01.md',
    jurisdiction: 'PERU',
    created_at: SCHEDULED_AT,
    updated_at: SCHEDULED_AT,

    agenda_state: 'lista',
    video_state: 'vinculado',
    transcription_state: 'lista',
    chatbot_state: 'listo',
    editorial_state: 'pineada',
    is_pinned: true,
    is_pinned_for_publication: true,
    is_follow_up: false,
    is_archived: false,

    agenda_item: {
      item_number: '5.2',
      title:
        'Debate y votación del predictamen sobre los Proyectos de Ley 04122/2022-CR, 07073/2023-CR y 14305/2025-PE',
      thematic_area: 'DEFENSA NACIONAL',
      bill_numbers: ['04122/2022-CR', '07073/2023-CR', '14305/2025-PE'],
    },

    recording: buildRecording('demo-sesion-5-2', {
      transcription_status: 'COMPLETED',
      transcription_text:
        '[Transcripción del debate y votación · ítem 5.2]\n\nPresidente de la Comisión: "Pasamos al debate del predictamen acumulado de los proyectos 4122, 7073 y 14305..."',
      analysis_status: 'COMPLETED',
      analyzed_at: SCHEDULED_AT,
    }),
  },

  // ── 5.3 ────────────────────────────────────────────────────────────────────
  {
    id: 'demo-sesion-5-3',
    parent_session_id: PARENT_ID,
    external_session_id: `${PARENT_ID}-5-3`,
    commission_name: COMMISSION,
    session_title:
      'Debate y votación del predictamen sobre el Proyecto de Ley 13828/2025-CR — escala remunerativa en el IRTP',
    scheduled_at: SCHEDULED_AT,
    scheduled_date_text: SCHEDULED_TEXT,
    agenda_url: AGENDA_URL,
    status: 'scheduled',
    source: 'PERU_CONGRESS_SYNC',
    source_file_name: 'agenda_presupuesto_2026-04-01.md',
    jurisdiction: 'PERU',
    created_at: SCHEDULED_AT,
    updated_at: SCHEDULED_AT,

    agenda_state: 'lista',
    video_state: 'vinculado',
    transcription_state: 'procesando',
    chatbot_state: 'en_cola',
    editorial_state: 'nueva',
    is_pinned: false,
    is_follow_up: false,
    is_archived: false,

    agenda_item: {
      item_number: '5.3',
      title:
        'Debate y votación del predictamen sobre el Proyecto de Ley 13828/2025-CR para implementar escala remunerativa en el IRTP',
      thematic_area: 'ECONOMIA',
      bill_numbers: ['13828/2025-CR'],
    },

    recording: buildRecording('demo-sesion-5-3', {
      transcription_status: 'PROCESSING',
      analysis_status: 'NOT_STARTED',
    }),
  },

  // ── 5.4 ────────────────────────────────────────────────────────────────────
  {
    id: 'demo-sesion-5-4',
    parent_session_id: PARENT_ID,
    external_session_id: `${PARENT_ID}-5-4`,
    commission_name: COMMISSION,
    session_title:
      'Debate y votación del predictamen sobre el Proyecto de Ley 11480/2024-CR — igualdad remunerativa en el MIMP',
    scheduled_at: SCHEDULED_AT,
    scheduled_date_text: SCHEDULED_TEXT,
    agenda_url: AGENDA_URL,
    status: 'scheduled',
    source: 'PERU_CONGRESS_SYNC',
    source_file_name: 'agenda_presupuesto_2026-04-01.md',
    jurisdiction: 'PERU',
    created_at: SCHEDULED_AT,
    updated_at: SCHEDULED_AT,

    agenda_state: 'lista',
    video_state: 'vinculado',
    transcription_state: 'lista',
    chatbot_state: 'listo',
    editorial_state: 'nueva',
    is_pinned: false,
    is_follow_up: false,
    is_archived: false,

    agenda_item: {
      item_number: '5.4',
      title:
        'Debate y votación del predictamen sobre el Proyecto de Ley 11480/2024-CR sobre igualdad remunerativa en el MIMP',
      thematic_area: 'ECONOMIA',
      bill_numbers: ['11480/2024-CR'],
    },

    recording: buildRecording('demo-sesion-5-4', {
      transcription_status: 'COMPLETED',
      transcription_text:
        '[Transcripción del debate · ítem 5.4 · MIMP]\n\nCongresista: "El proyecto 11480 plantea cerrar una brecha de género en la planilla del MIMP..."',
      analysis_status: 'COMPLETED',
      analyzed_at: SCHEDULED_AT,
    }),
  },
];

// Helpers compartidos por el workspace

export const SESIONES_PARENT_INFO = {
  id: PARENT_ID,
  commission: COMMISSION,
  scheduledAt: SCHEDULED_AT,
  scheduledText: SCHEDULED_TEXT,
  videoUrl: 'https://www.youtube.com/watch?v=fhAo3QGZ1EY',
  videoId: 'fhAo3QGZ1EY',
  channelName: 'Congreso de la República del Perú',
  source: 'PERU_CONGRESS_SYNC' as const,
};
