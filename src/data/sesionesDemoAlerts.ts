// Demo alerts for the new Sesiones workstation.
// 4 child alerts derived from the parent session
// "PRESUPUESTO Y CUENTA GENERAL DE LA REPÚBLICA · 01/04/2026 09:00".

import type { PeruSession, SessionRecording } from '@/types/peruSessions';

const PARENT_ID = 'demo-presupuesto-2026-04-01';
const COMMISSION = 'PRESUPUESTO Y CUENTA GENERAL DE LA REPÚBLICA';
const SCHEDULED_AT = '2026-04-01T09:00:00';
const SCHEDULED_TEXT = '01/04/2026 09:00 AM';

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

function emptyLegalReview() {
  return {
    resumen_legal: '',
    riesgo: '',
    urgencia: '',
    impacto: '',
    areas_afectadas: [] as string[],
    proximos_pasos: '',
    comentario_experto: '',
  };
}

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
    status: 'scheduled',
    source: 'PERU_CONGRESS_SYNC',
    jurisdiction: 'PERU',
    created_at: SCHEDULED_AT,

    agenda_state: 'lista',
    video_state: 'vinculado',
    transcription_state: 'lista',
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
    etiqueta_ia: 'Defensa / Presupuesto Público',
    risk_level: 'medio',
    urgency_level: 'media',
    impact_level: 'medio',

    executive_summary:
      'El Ministro de Defensa sustentará ante la Comisión el Proyecto de Ley 14305/2025-PE, iniciativa del Ejecutivo orientada a reordenar la asignación presupuestal del sector y a habilitar partidas específicas para personal militar.',
    why_it_matters:
      'La sustentación ministerial fija el marco político y técnico con el que el Ejecutivo defenderá la propuesta. Cualquier ajuste anunciado en esta sesión condicionará el predictamen y los proyectos relacionados (4122, 7073) que se debaten más adelante.',
    preliminary_impact:
      'Impacto regulatorio medio: si bien el proyecto es de iniciativa del Ejecutivo, los cambios remunerativos y de estructura presupuestal en Defensa pueden generar precedente para otros sectores con regímenes especiales.',
    suggested_next_step:
      'Revisar la transcripción cuando esté lista, identificar los compromisos asumidos por el Ministro y compararlos con el texto vigente del proyecto antes del debate del ítem 5.2.',
    legal_review: emptyLegalReview(),

    recording: buildRecording('demo-sesion-5-1', {
      transcription_status: 'COMPLETED',
      transcription_text:
        '[Transcripción completa de la sustentación ministerial · 1 de abril de 2026 · Comisión de Presupuesto]\n\nMinistro: "Señor Presidente, agradezco la oportunidad de sustentar ante esta comisión el Proyecto 14305..."',
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
    status: 'scheduled',
    source: 'PERU_CONGRESS_SYNC',
    jurisdiction: 'PERU',
    created_at: SCHEDULED_AT,

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
    etiqueta_ia: 'Fuerzas Armadas / Remuneración Pública',
    risk_level: 'alto',
    urgency_level: 'alta',
    impact_level: 'alto',

    executive_summary:
      'La Comisión someterá a votación el predictamen acumulado de tres iniciativas relativas al régimen remunerativo y de bonificaciones del personal de las Fuerzas Armadas. La aprobación habilitaría su pase al Pleno con un texto sustitutorio único.',
    why_it_matters:
      'Es la primera definición política sobre un paquete que reescribe condiciones laborales en el sector Defensa. Una aprobación con dispensa de segunda votación acelera el cronograma legislativo y obliga a anticipar impactos fiscales y operativos.',
    preliminary_impact:
      'Impacto alto: cambios estructurales en remuneraciones del sector público con efecto multiplicador en otros regímenes especiales. Riesgo presupuestal y precedente para futuras leyes salariales.',
    suggested_next_step:
      'Pinear y dar seguimiento. Preparar nota de alerta para la dirección legal con escenarios A/B según el sentido de la votación, e incluir en el próximo reporte regulatorio.',
    legal_review: emptyLegalReview(),

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
    status: 'scheduled',
    source: 'PERU_CONGRESS_SYNC',
    jurisdiction: 'PERU',
    created_at: SCHEDULED_AT,

    agenda_state: 'lista',
    video_state: 'vinculado',
    transcription_state: 'lista',
    chatbot_state: 'procesando',
    editorial_state: 'en_seguimiento',
    is_pinned: false,
    is_follow_up: true,
    is_archived: false,

    agenda_item: {
      item_number: '5.3',
      title:
        'Debate y votación del predictamen sobre el Proyecto de Ley 13828/2025-CR para implementar escala remunerativa en el IRTP',
      thematic_area: 'ECONOMIA',
      bill_numbers: ['13828/2025-CR'],
    },
    etiqueta_ia: 'Laboral Público / Remuneración',
    risk_level: 'medio',
    urgency_level: 'media',
    impact_level: 'medio_alto',

    executive_summary:
      'Predictamen que propone aprobar e implementar una escala remunerativa específica para el Instituto Nacional de Radio y Televisión del Perú (IRTP), con criterios de ordenamiento salarial y de homologación interna.',
    why_it_matters:
      'Aunque acotado al IRTP, sienta criterio para la definición de escalas en organismos públicos descentralizados y puede ser usado como referencia en futuras propuestas para empresas y entidades análogas.',
    preliminary_impact:
      'Impacto medio-alto en gestión presupuestal sectorial y en negociaciones colectivas del sector público. Requiere validar opinión del MEF y consistencia con la Ley de Presupuesto.',
    suggested_next_step:
      'Mantener seguimiento. Esperar el chatbot de la sesión para validar argumentos del MEF y consignar el resultado de la votación en el reporte semanal.',
    legal_review: emptyLegalReview(),

    recording: buildRecording('demo-sesion-5-3', {
      transcription_status: 'COMPLETED',
      transcription_text:
        '[Transcripción del debate · ítem 5.3 · IRTP]\n\nCongresista ponente: "El proyecto 13828 busca cerrar una brecha histórica en la escala del IRTP..."',
      analysis_status: 'PROCESSING',
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
    status: 'scheduled',
    source: 'PERU_CONGRESS_SYNC',
    jurisdiction: 'PERU',
    created_at: SCHEDULED_AT,

    agenda_state: 'lista',
    video_state: 'vinculado',
    transcription_state: 'lista',
    chatbot_state: 'no_solicitado',
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
    etiqueta_ia: 'Igualdad Remunerativa / Sector Público',
    risk_level: 'medio',
    urgency_level: 'baja',
    impact_level: 'medio',

    executive_summary:
      'Predictamen que propone establecer criterios de igualdad remunerativa entre servidores del Ministerio de la Mujer y Poblaciones Vulnerables (MIMP) que cumplen funciones equivalentes bajo regímenes laborales distintos.',
    why_it_matters:
      'La iniciativa puede servir como precedente para nivelaciones salariales en otros pliegos del Estado y modifica los criterios para definir trabajo de igual valor en el sector público.',
    preliminary_impact:
      'Impacto medio en política remunerativa pública. Eventual efecto cascada limitado, sujeto a opinión técnica de Servir y MEF.',
    suggested_next_step:
      'Revisar el resultado de la votación en la transcripción y, si se aprueba, evaluar si corresponde elevar a alerta pineada para inclusión en el próximo reporte.',
    legal_review: emptyLegalReview(),

    recording: buildRecording('demo-sesion-5-4', {
      transcription_status: 'COMPLETED',
      transcription_text:
        '[Transcripción del debate · ítem 5.4 · MIMP]\n\nCongresista: "El proyecto 11480 plantea cerrar una brecha de género en la planilla del MIMP..."',
      analysis_status: 'NOT_STARTED',
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
