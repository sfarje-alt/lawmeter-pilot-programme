// Demo alerts for the Sesiones workspace prototype.
// SOURCE: PERU-01-04-2026-34cfb0ff (JSON + agenda markdown).
// Comisión: PRESUPUESTO Y CUENTA GENERAL DE LA REPÚBLICA — 01/04/2026 09:00.
// Solo campos explícitamente presentes en los archivos fuente.
// No se inventa risk / urgency / impact / IA tag / commentario.

import type { PeruSession, SessionRecording } from '@/types/peruSessions';

const PARENT_ID = 'PERU-01-04-2026-34cfb0ff';
const COMMISSION = 'PRESUPUESTO Y CUENTA GENERAL DE LA REPÚBLICA';
const SESSION_TITLE =
  'DÉCIMA SEGUNDA SESIÓN ORDINARIA DE LA COMISIÓN DE PRESUPUESTO Y CUENTA GENERAL DE LA REPÚBLICA';
const SCHEDULED_AT = '2026-04-01T09:00:00-05:00';
const SCHEDULED_TEXT = '01/04/2026 9:00AM';
const AGENDA_URL = 'https://wb2server.congreso.gob.pe/visor-sesiones/#/agenda/2230';
const SOURCE_FILE_NAME = '2026-04-20.pdf';
const CREATED_AT = '2026-04-19T09:43:40.027740+00:00';
const UPDATED_AT = '2026-04-20T14:40:49.094621+00:00';
const AGENDA_SCRAPED_AT = '2026-04-20T14:40:13.905538+00:00';

const SHARED_RECORDING_BASE: Omit<SessionRecording, 'id' | 'session_id'> = {
  provider: 'YOUTUBE',
  channel_name: 'Congreso de la República del Perú',
  channel_id: 'UC9HLcODpEZuBRLSKXZx5igw',
  expected_title:
    'EN VIVO: Comisión de Presupuesto y Cuenta General de la República | 1 DE ABRIL DEL 2026',
  video_id: 'fhAo3QGZ1EY',
  video_url: 'https://www.youtube.com/watch?v=fhAo3QGZ1EY',
  resolution_confidence: 'HIGH',
  resolution_method: 'EXACT_STRIP_EMOJI',
  resolved_at: '2026-04-19T09:51:08.823621+00:00',
  created_at: CREATED_AT,
  // Source-backed transcription metadata (whisper, COMPLETED).
  transcription_status: 'COMPLETED',
  analysis_status: 'NOT_STARTED',
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

// Workflow seed (estados de prototipo):
// 5.1 → Bandeja, sin abrir, sin pin, sin IA solicitada
// 5.2 → Bandeja, abierta, pineada, IA lista (transcripción + chatbot)
// 5.3 → Sesiones preparadas > En procesamiento, transcripción procesando
// 5.4 → Sesiones preparadas > Listas, transcripción y chatbot listos

export const SESIONES_DEMO_ALERTS: PeruSession[] = [
  // ── 5.1 ────────────────────────────────────────────────────────────────────
  {
    id: 'demo-sesion-5-1',
    parent_session_id: PARENT_ID,
    external_session_id: `${PARENT_ID}-5-1`,
    commission_name: COMMISSION,
    session_title: SESSION_TITLE,
    scheduled_at: SCHEDULED_AT,
    scheduled_date_text: SCHEDULED_TEXT,
    agenda_url: AGENDA_URL,
    status: 'scheduled',
    source: 'PERU_CONGRESS_SYNC',
    source_file_name: SOURCE_FILE_NAME,
    jurisdiction: 'PERU',
    created_at: CREATED_AT,
    updated_at: UPDATED_AT,

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
        'Presentación del señor Diaz Dañino, Carlos Alberto Francisco, Ministro de Defensa, con la finalidad de sustentar el Proyecto de Ley 14305/2025-PE',
      thematic_area: 'DEFENSA NACIONAL',
      bill_numbers: ['14305/2025-PE'],
    },

    recording: buildRecording('demo-sesion-5-1'),
  },

  // ── 5.2 ────────────────────────────────────────────────────────────────────
  {
    id: 'demo-sesion-5-2',
    parent_session_id: PARENT_ID,
    external_session_id: `${PARENT_ID}-5-2`,
    commission_name: COMMISSION,
    session_title: SESSION_TITLE,
    scheduled_at: SCHEDULED_AT,
    scheduled_date_text: SCHEDULED_TEXT,
    agenda_url: AGENDA_URL,
    status: 'scheduled',
    source: 'PERU_CONGRESS_SYNC',
    source_file_name: SOURCE_FILE_NAME,
    jurisdiction: 'PERU',
    created_at: CREATED_AT,
    updated_at: UPDATED_AT,

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
        'Debate y votación del predictamen de aprobación recaído en los proyectos de ley 04122/2022-CR, 07073/2023-CR y 14305/2025-PE',
      thematic_area: 'DEFENSA NACIONAL',
      bill_numbers: ['04122/2022-CR', '07073/2023-CR', '14305/2025-PE'],
    },

    recording: buildRecording('demo-sesion-5-2', {
      transcription_status: 'COMPLETED',
      transcription_text:
        '[Transcripción del debate y votación · ítem 5.2]\n\nPresidente de la Comisión: "Pasamos al debate del predictamen acumulado de los proyectos 4122, 7073 y 14305..."',
      analysis_status: 'COMPLETED',
      analyzed_at: UPDATED_AT,
    }),
  },

  // ── 5.3 ────────────────────────────────────────────────────────────────────
  {
    id: 'demo-sesion-5-3',
    parent_session_id: PARENT_ID,
    external_session_id: `${PARENT_ID}-5-3`,
    commission_name: COMMISSION,
    session_title: SESSION_TITLE,
    scheduled_at: SCHEDULED_AT,
    scheduled_date_text: SCHEDULED_TEXT,
    agenda_url: AGENDA_URL,
    status: 'scheduled',
    source: 'PERU_CONGRESS_SYNC',
    source_file_name: SOURCE_FILE_NAME,
    jurisdiction: 'PERU',
    created_at: CREATED_AT,
    updated_at: UPDATED_AT,

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
        'Debate y votación del predictamen de aprobación recaído en el Proyecto de Ley 13828/2025-CR — escala remunerativa para los trabajadores del régimen laboral del Decreto Legislativo 728 del IRTP',
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
    session_title: SESSION_TITLE,
    scheduled_at: SCHEDULED_AT,
    scheduled_date_text: SCHEDULED_TEXT,
    agenda_url: AGENDA_URL,
    status: 'scheduled',
    source: 'PERU_CONGRESS_SYNC',
    source_file_name: SOURCE_FILE_NAME,
    jurisdiction: 'PERU',
    created_at: CREATED_AT,
    updated_at: UPDATED_AT,

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
        'Debate y votación del predictamen de aprobación recaído en el Proyecto de Ley 11480/2024-CR — igualdad remunerativa para los servidores civiles del régimen del Decreto Legislativo 728 en la unidad ejecutora 001 del MIMP',
      thematic_area: 'ECONOMIA',
      bill_numbers: ['11480/2024-CR'],
    },

    recording: buildRecording('demo-sesion-5-4', {
      transcription_status: 'COMPLETED',
      transcription_text:
        '[Transcripción del debate · ítem 5.4 · MIMP]\n\nCongresista: "El proyecto 11480 plantea cerrar una brecha de género en la planilla del MIMP..."',
      analysis_status: 'COMPLETED',
      analyzed_at: UPDATED_AT,
    }),
  },
];

// Helpers compartidos por el workspace
export const SESIONES_PARENT_INFO = {
  id: PARENT_ID,
  commission: COMMISSION,
  sessionTitle: SESSION_TITLE,
  scheduledAt: SCHEDULED_AT,
  scheduledText: SCHEDULED_TEXT,
  videoUrl: 'https://www.youtube.com/watch?v=fhAo3QGZ1EY',
  videoId: 'fhAo3QGZ1EY',
  channelName: 'Congreso de la República del Perú',
  source: 'PERU_CONGRESS_SYNC' as const,
  sourceFileName: SOURCE_FILE_NAME,
  agendaScrapedAt: AGENDA_SCRAPED_AT,
  agendaChars: 8452,
  // Modalidad presencial/virtual desde el markdown
  modalidad: 'Presencial — Sala "GUSTAVO MOHME LLONA (SALA 5)" / Virtual — Plataforma de Videoconferencia',
  periodo: 'Periodo Anual de Sesiones 2025 - 2026',
};
