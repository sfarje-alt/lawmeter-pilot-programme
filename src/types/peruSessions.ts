// Peru Legislative Session Monitoring Types

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
  source: 'PERU_CONGRESS_COMMISSION_SESSIONS';
  jurisdiction: 'PERU';
  created_at: string;
  updated_at?: string;
  
  // Computed/joined fields
  is_recommended?: boolean;
  is_selected?: boolean;
  video_status?: VideoResolutionStatus;
  recording?: SessionRecording;
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
}

export type VideoResolutionStatus = 
  | 'NOT_ATTEMPTED'
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
  channelId: "UCqGWuVvk-3XhRJi7VgeVVKg", // Official channel ID
  titleTemplate: "🔴 EN VIVO: Comisión de {commission} | {day} DE {month} DEL {year}",
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
