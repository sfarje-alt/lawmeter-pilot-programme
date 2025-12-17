// Mock data for Peru Congress Commission Sessions

import { PeruSession, SessionRecording } from '@/types/peruSessions';

// Empty - sessions will be populated via PDF import
export const PERU_MOCK_SESSIONS: PeruSession[] = [];

// Empty - recordings will be resolved after import
export const PERU_MOCK_RECORDINGS: SessionRecording[] = [];

// Default watched commissions for demo
export const DEFAULT_WATCHED_COMMISSIONS = [
  "Ciencia, Innovación y Tecnología",
  "Defensa del Consumidor y Organismos Reguladores de los Servicios Públicos",
  "Producción, Micro y Pequeña Empresa y Cooperativas",
];
