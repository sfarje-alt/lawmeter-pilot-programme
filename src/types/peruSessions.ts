// Peru Legislative Session Monitoring Types

// Client-specific commentary for sessions
export interface SessionClientCommentary {
  clientId: string;
  commentary: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sesiones · Modelo de alerta editorial (workspace single-profile)
// ─────────────────────────────────────────────────────────────────────────────

export type SesionEditorialState =
  | 'nueva'
  | 'en_revision'
  | 'pineada'
  | 'archivada';

export type SesionAgendaState = 'lista' | 'pendiente' | 'error';
export type SesionVideoState = 'vinculado' | 'pendiente' | 'error';
export type SesionTranscriptionState =
  | 'no_solicitada'
  | 'en_cola'
  | 'procesando'
  | 'lista'
  | 'error';
export type SesionChatbotState =
  | 'no_solicitado'
  | 'en_cola'
  | 'procesando'
  | 'listo'
  | 'error';

export type SesionRiskLevel = 'bajo' | 'medio' | 'alto';
export type SesionUrgencyLevel = 'baja' | 'media' | 'alta';
export type SesionImpactLevel = 'bajo' | 'medio' | 'medio_alto' | 'alto';

export interface SesionAgendaItem {
  item_number: string;
  title: string;
  thematic_area: string;
  bill_numbers: string[];
}

export interface SesionLegalReview {
  resumen_legal: string;
  riesgo: string;
  urgencia: string;
  impacto: string;
  areas_afectadas: string[];
  proximos_pasos: string;
  comentario_experto: string;
}

export interface PeruSession {
  id: string;
  external_session_id?: string;
  commission_name: string;
  session_title?: string;
  scheduled_at?: string;
  scheduled_date_text?: string;
  agenda_url?: string;
  documents_url?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'unknown';
  source_file_name?: string;
  source: 'PERU_CONGRESS_COMMISSION_SESSIONS' | 'IMPORTED' | 'DATABASE' | 'PERU_CONGRESS_SYNC';
  jurisdiction: 'PERU' | 'Peru';
  created_at: string;
  updated_at?: string;

  // Computed/joined fields
  is_recommended?: boolean;
  is_selected?: boolean;
  video_status?: VideoResolutionStatus;
  recording?: SessionRecording;

  // Legacy editorial fields (kept for compatibility with publication flows)
  is_pinned_for_publication?: boolean;
  expert_commentary?: string;
  client_commentaries?: SessionClientCommentary[];
  published_to_clients?: string[];
  publication_status?: 'draft' | 'pinned' | 'published';

  // ── Nuevo workflow editorial single-profile ────────────────────────────────
  editorial_state?: SesionEditorialState;
  is_pinned?: boolean;        // alias semántico de is_pinned_for_publication
  /** @deprecated estado eliminado del flujo editorial */
  is_follow_up?: boolean;
  is_archived?: boolean;      // archivado manual

  // Análisis acumulado del chatbot sobre esta sesión (se actualiza con cada interacción)
  chatbot_summary?: string;

  agenda_state?: SesionAgendaState;
  video_state?: SesionVideoState;
  transcription_state?: SesionTranscriptionState;
  chatbot_state?: SesionChatbotState;

  // Alerta hija derivada de un ítem de agenda
  parent_session_id?: string;
  agenda_item?: SesionAgendaItem;
  etiqueta_ia?: string;
  risk_level?: SesionRiskLevel;
  urgency_level?: SesionUrgencyLevel;
  impact_level?: SesionImpactLevel;

  // Contenido legal/IA
  executive_summary?: string;
  why_it_matters?: string;
  preliminary_impact?: string;
  suggested_next_step?: string;

  // Revisión legal editable
  legal_review?: SesionLegalReview;
}

export interface SessionRecording {
  id: string;
  session_id: string;
  provider: 'YOUTUBE';
  channel_name?: string;
  channel_id?: string;
  expected_title?: string;
  video_id?: string;
  video_url?: string;
  resolution_confidence?: 'HIGH' | 'MEDIUM' | 'LOW';
  resolution_method?: 'EXACT_STRIP_EMOJI' | 'CONTAINS' | 'MANUAL';
  resolved_at?: string;
  last_error?: string;
  created_at: string;
  // Transcription and analysis fields
  transcription_text?: string;
  transcription_status?: 'NOT_STARTED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  analysis_result?: SessionAnalysis;
  analysis_status?: 'NOT_STARTED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  analyzed_at?: string;
}

export interface SessionAnalysis {
  relevanceScore: number;
  relevanceCategory: 'High' | 'Medium' | 'Low' | 'None';
  executiveSummary: string;
  keyTopics: Array<{
    topic: string;
    relevance: 'Direct' | 'Indirect' | 'None';
    details: string;
  }>;
  regulatoryMentions: Array<{
    type: string;
    quote: string;
    implication: string;
  }>;
  actionItems: string[];
  speakerSentiments: Array<{
    speaker: string;
    position: 'Supportive' | 'Opposed' | 'Neutral';
    keyStatement: string;
  }>;
  clientImpact: {
    productSafety: string;
    radioRegulations: string;
    cybersecurity: string;
    energyEfficiency: string;
    overallAssessment: string;
  };
}

export type VideoResolutionStatus = 
  | 'NOT_ATTEMPTED'
  | 'NOT_CHECKED'
  | 'RESOLVING'
  | 'FOUND_HIGH'
  | 'FOUND_MEDIUM'
  | 'FOUND_LOW'
  | 'NOT_FOUND'
  | 'MANUAL';

export interface SessionWatch {
  id: string;
  user_id: string;
  session_id: string;
  watch_status: 'SELECTED' | 'UNSELECTED';
  created_at: string;
}

export interface WatchedCommission {
  id: string;
  user_id: string;
  commission_name: string;
  jurisdiction: 'PERU';
  created_at: string;
}

export interface BillSessionLink {
  id: string;
  bill_id: string;
  session_id: string;
  user_id: string;
  created_at: string;
}

// Known commissions from Peru Congress
export const PERU_COMMISSIONS = [
  "Agraria",
  "Ciencia, Innovación y Tecnología",
  "Comercio Exterior y Turismo",
  "Constitución y Reglamento",
  "Cultura y Patrimonio Cultural",
  "Defensa del Consumidor y Organismos Reguladores de los Servicios Públicos",
  "Defensa Nacional, Orden Interno, Desarrollo Alternativo y Lucha contra las Drogas",
  "Descentralización, Regionalización, Gobiernos Locales y Modernización de la Gestión del Estado",
  "Economía, Banca, Finanzas e Inteligencia Financiera",
  "Educación, Juventud y Deporte",
  "Energía y Minas",
  "Fiscalización y Contraloría",
  "Inclusión Social y Personas con Discapacidad",
  "Inteligencia",
  "Justicia y Derechos Humanos",
  "Mujer y Familia",
  "Presupuesto y Cuenta General de la República",
  "Producción, Micro y Pequeña Empresa y Cooperativas",
  "Pueblos Andinos, Amazónicos y Afroperuanos, Ambiente y Ecología",
  "Relaciones Exteriores",
  "Salud y Población",
  "Trabajo y Seguridad Social",
  "Transportes y Comunicaciones",
  "Vivienda y Construcción",
] as const;

export type PeruCommission = typeof PERU_COMMISSIONS[number];

// YouTube channel info for Peru Congress
export const PERU_CONGRESS_YOUTUBE = {
  channelName: "Congreso de la República del Perú",
  channelId: "UC9HLcODpEZuBRLSKXZx5igw", // Correct official channel ID
  uploadsPlaylistId: "UU9HLcODpEZuBRLSKXZx5igw", // UC→UU for uploads playlist
  titleTemplate: "🔴 EN VIVO: Comisión de {commission} | {day} DE {month} DEL {year}",
};

// Commissions that don't use "de" prefix in YouTube titles
export const COMISIONES_SIN_DE = ["Agraria", "Inteligencia"];

// Commission name mappings (truncated → full name)
export const COMISIONES_COMPLETAS: Record<string, string> = {
  "Agraria": "Agraria",
  "Defensa del Consumidor": "Defensa del Consumidor y Organismos Reguladores de los Servicios Públicos",
  "Defensa Nacional": "Defensa Nacional, Orden Interno, Desarrollo Alternativo y Lucha contra las Drogas",
  "Descentralización": "Descentralización, Regionalización, Gobiernos Locales y Modernización de la Gestión del Estado",
  "Economía": "Economía, Banca, Finanzas e Inteligencia Financiera",
  "Educación": "Educación, Juventud y Deporte",
  "Inclusión Social": "Inclusión Social y Personas con Discapacidad",
  "Justicia": "Justicia y Derechos Humanos",
  "Presupuesto": "Presupuesto y Cuenta General de la República",
  "Producción": "Producción, Micro y Pequeña Empresa y Cooperativas",
  "Pueblos Andinos": "Pueblos Andinos, Amazónicos y Afroperuanos, Ambiente y Ecología",
  "Salud": "Salud y Población",
  "Trabajo": "Trabajo y Seguridad Social",
  "Transportes": "Transportes y Comunicaciones",
  "Vivienda": "Vivienda y Construcción",
};

// Month names in Spanish for title matching
export const SPANISH_MONTHS = [
  "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
  "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
] as const;

// Helper to generate expected YouTube title
export function generateExpectedYoutubeTitle(
  commissionName: string,
  date: Date
): string {
  const day = date.getDate();
  const month = SPANISH_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  
  return `🔴 EN VIVO: Comisión de ${commissionName} | ${day} DE ${month} DEL ${year}`;
}

// Helper to strip emojis for comparison
export function stripEmojis(text: string): string {
  return text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]/gu, '').trim();
}

// Session regions for navigation
export type SessionRegion = 'NAM' | 'LATAM' | 'EU' | 'GCC' | 'APAC';

export interface SessionRegionConfig {
  id: SessionRegion;
  name: string;
  countries: SessionCountryConfig[];
}

export interface SessionCountryConfig {
  code: string;
  name: string;
  flag: string;
  isImplemented: boolean;
}

export const SESSION_REGIONS: SessionRegionConfig[] = [
  {
    id: 'NAM',
    name: 'North America',
    countries: [
      { code: 'US', name: 'United States', flag: '🇺🇸', isImplemented: false },
      { code: 'CA', name: 'Canada', flag: '🇨🇦', isImplemented: false },
    ]
  },
  {
    id: 'LATAM',
    name: 'Latin America',
    countries: [
      { code: 'PE', name: 'Perú', flag: '🇵🇪', isImplemented: true },
      { code: 'CR', name: 'Costa Rica', flag: '🇨🇷', isImplemented: false },
    ]
  },
  {
    id: 'EU',
    name: 'European Union',
    countries: [
      { code: 'EU', name: 'EU Parliament', flag: '🇪🇺', isImplemented: false },
    ]
  },
  {
    id: 'GCC',
    name: 'Gulf Cooperation Council',
    countries: [
      { code: 'AE', name: 'UAE', flag: '🇦🇪', isImplemented: false },
      { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', isImplemented: false },
    ]
  },
  {
    id: 'APAC',
    name: 'Asia-Pacific',
    countries: [
      { code: 'JP', name: 'Japan', flag: '🇯🇵', isImplemented: false },
      { code: 'KR', name: 'Korea', flag: '🇰🇷', isImplemented: false },
      { code: 'TW', name: 'Taiwan', flag: '🇹🇼', isImplemented: false },
    ]
  },
];
