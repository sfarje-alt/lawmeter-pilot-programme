// Mock data for Peru Congress Commission Sessions

import { PeruSession, SessionRecording } from '@/types/peruSessions';

// Generate realistic mock sessions for the past 30 days and next 30 days
const generateMockSessions = (): PeruSession[] => {
  const sessions: PeruSession[] = [];
  const now = new Date();
  
  const commissions = [
    "Ciencia, Innovación y Tecnología",
    "Defensa del Consumidor y Organismos Reguladores de los Servicios Públicos",
    "Producción, Micro y Pequeña Empresa y Cooperativas",
    "Comercio Exterior y Turismo",
    "Economía, Banca, Finanzas e Inteligencia Financiera",
    "Energía y Minas",
    "Trabajo y Seguridad Social",
    "Salud y Población",
    "Pueblos Andinos, Amazónicos y Afroperuanos, Ambiente y Ecología",
    "Transportes y Comunicaciones",
  ];
  
  // Generate past sessions (completed)
  for (let i = 30; i >= 1; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    // 2-3 sessions per day
    const sessionsPerDay = Math.floor(Math.random() * 2) + 2;
    for (let j = 0; j < sessionsPerDay; j++) {
      const commission = commissions[Math.floor(Math.random() * commissions.length)];
      const hours = [9, 10, 11, 14, 15, 16][Math.floor(Math.random() * 6)];
      date.setHours(hours, 0, 0, 0);
      
      sessions.push({
        id: `session-past-${i}-${j}`,
        external_session_id: `${2000 + sessions.length}`,
        commission_name: commission,
        session_title: `Sesión Ordinaria - ${commission}`,
        scheduled_at: date.toISOString(),
        scheduled_date_text: date.toLocaleDateString('es-PE', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        agenda_url: `https://www2.congreso.gob.pe/sicr/comisiones/agenda.nsf/agenda/${2000 + sessions.length}`,
        documents_url: `https://www2.congreso.gob.pe/sicr/comisiones/documentos.nsf/${2000 + sessions.length}`,
        status: 'completed',
        source: 'PERU_CONGRESS_COMMISSION_SESSIONS',
        jurisdiction: 'PERU',
        created_at: new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        is_recommended: false,
        is_selected: false,
        video_status: Math.random() > 0.3 ? 'FOUND_HIGH' : 'NOT_ATTEMPTED',
      });
    }
  }
  
  // Generate future sessions (scheduled)
  for (let i = 1; i <= 30; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    // 2-3 sessions per day
    const sessionsPerDay = Math.floor(Math.random() * 2) + 2;
    for (let j = 0; j < sessionsPerDay; j++) {
      const commission = commissions[Math.floor(Math.random() * commissions.length)];
      const hours = [9, 10, 11, 14, 15, 16][Math.floor(Math.random() * 6)];
      date.setHours(hours, 0, 0, 0);
      
      sessions.push({
        id: `session-future-${i}-${j}`,
        external_session_id: `${3000 + sessions.length}`,
        commission_name: commission,
        session_title: `Sesión Ordinaria - ${commission}`,
        scheduled_at: date.toISOString(),
        scheduled_date_text: date.toLocaleDateString('es-PE', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        agenda_url: `https://www2.congreso.gob.pe/sicr/comisiones/agenda.nsf/agenda/${3000 + sessions.length}`,
        status: 'scheduled',
        source: 'PERU_CONGRESS_COMMISSION_SESSIONS',
        jurisdiction: 'PERU',
        created_at: new Date().toISOString(),
        is_recommended: false,
        is_selected: false,
        video_status: 'NOT_ATTEMPTED',
      });
    }
  }
  
  return sessions;
};

export const PERU_MOCK_SESSIONS: PeruSession[] = generateMockSessions();

// Mock recordings for some past sessions
export const PERU_MOCK_RECORDINGS: SessionRecording[] = PERU_MOCK_SESSIONS
  .filter(s => s.status === 'completed' && s.video_status === 'FOUND_HIGH')
  .slice(0, 20)
  .map((session, index) => ({
    id: `recording-${index}`,
    session_id: session.id,
    provider: 'YOUTUBE' as const,
    channel_name: 'Congreso de la República del Perú',
    channel_id: 'UCqGWuVvk-3XhRJi7VgeVVKg',
    expected_title: `🔴 EN VIVO: Comisión de ${session.commission_name} | ${new Date(session.scheduled_at!).getDate()} DE ${['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'][new Date(session.scheduled_at!).getMonth()]} DEL ${new Date(session.scheduled_at!).getFullYear()}`,
    video_id: `dQw4w9WgXcQ${index}`,
    video_url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ${index}`,
    resolution_confidence: 'HIGH',
    resolution_method: 'EXACT_STRIP_EMOJI',
    resolved_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  }));

// Default watched commissions for demo
export const DEFAULT_WATCHED_COMMISSIONS = [
  "Ciencia, Innovación y Tecnología",
  "Defensa del Consumidor y Organismos Reguladores de los Servicios Públicos",
  "Producción, Micro y Pequeña Empresa y Cooperativas",
];
