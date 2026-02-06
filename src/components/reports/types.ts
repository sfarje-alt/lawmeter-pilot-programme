// Report Generator Types

import type { AnalyticsBlockKey } from '@/types/analytics';

export type ReportType = 'daily' | 'weekly' | 'custom';
export type ReportAction = 'generate_now' | 'schedule' | 'view_history';
export type OutputFormat = 'pdf' | 'docx';
export type DateMode = 'today' | 'last_7' | 'last_15' | 'last_30' | 'last_60' | 'last_90' | 'custom';
export type LegislationStage = 'only_bills' | 'bills_and_enacted' | 'only_enacted';

// Analytics block configuration for reports
export interface AnalyticsBlockConfig {
  key: AnalyticsBlockKey;
  enabled: boolean;
  order: number;
}

export interface ReportConfig {
  // Step 1: Type of Report
  reportType: ReportType;
  
  // Step 2: Action
  action: ReportAction;
  
  // Step 3: Audience
  clientIds: string[];
  targetAreas?: string[];
  
  // Step 4: Date Range
  dateMode: DateMode;
  customDateFrom?: Date;
  customDateTo?: Date;
  
  // Step 5: Stage
  legislationStage: LegislationStage;
  
  // Step 6: Bills Status (17 estados procesales)
  billsStatuses: string[];
  
  // Step 7: Type of Laws (Normas)
  normTypes: string[];
  entities: string[];
  
  // Step 8: Business Filters
  sectors: string[];
  areas: string[];
  themes: string[];
  
  // Step 9: Content Options
  includeSessions: boolean;
  includeExpertCommentary: boolean;
  
  // Step 10: Analytics Options
  includeAnalytics: boolean;
  analyticsSections: string[];
  analyticsBlocks: AnalyticsBlockConfig[]; // NEW: Detailed block config with drag-drop order
  analyticsTemplateId?: string; // NEW: Optional saved template ID
  
  // Step 11: Output & Delivery
  outputFormat: OutputFormat;
  
  // Step 12: Schedule (only for scheduled reports)
  frequency?: 'daily' | 'weekly';
  weeklyDay?: number;
  scheduleTime?: string;
  timezone?: string;
  sendOnlyIfAlerts?: boolean;
  
  // Step 13: Recipients
  emailRecipients: string[];
  whatsappRecipients: string[];
}

export interface ReportAuditEntry {
  id: string;
  generatedAt: string;
  generatedBy: string;
  reportType: ReportType;
  clientIds: string[];
  clientNames: string[];
  filters: Partial<ReportConfig>;
  status: 'sent' | 'failed' | 'pending' | 'downloaded';
  channels: ('email' | 'whatsapp' | 'download')[];
  downloadUrl?: string;
  alertCount: number;
}

export const DEFAULT_REPORT_CONFIG: ReportConfig = {
  reportType: 'weekly',
  action: 'generate_now',
  clientIds: [],
  targetAreas: [],
  dateMode: 'last_7',
  customDateFrom: undefined,
  customDateTo: undefined,
  legislationStage: 'bills_and_enacted',
  billsStatuses: [],
  normTypes: [],
  entities: [],
  sectors: [],
  areas: [],
  themes: [],
  includeSessions: true,
  includeExpertCommentary: true,
  includeAnalytics: false,
  analyticsSections: [],
  outputFormat: 'pdf',
  frequency: 'weekly',
  weeklyDay: 1,
  scheduleTime: '08:00',
  timezone: 'America/Lima',
  sendOnlyIfAlerts: true,
  emailRecipients: [],
  whatsappRecipients: [],
};

// Constants for wizard options
export const REPORT_TYPE_OPTIONS = [
  { value: 'daily', label: 'Diario', description: 'Resumen de actividad del día' },
  { value: 'weekly', label: 'Semanal', description: 'Consolidado de la semana' },
  { value: 'custom', label: 'Personalizado', description: 'Rango de fechas específico' },
] as const;

export const REPORT_ACTION_OPTIONS = [
  { value: 'generate_now', label: 'Generar Ahora', icon: 'FileDown' },
  { value: 'schedule', label: 'Programar', icon: 'Calendar' },
  { value: 'view_history', label: 'Ver Historial', icon: 'History' },
] as const;

export const DATE_MODE_OPTIONS = [
  { value: 'today', label: 'Hoy' },
  { value: 'last_7', label: 'Últimos 7 días' },
  { value: 'last_15', label: 'Últimos 15 días' },
  { value: 'last_30', label: 'Últimos 30 días' },
  { value: 'last_60', label: 'Últimos 60 días' },
  { value: 'last_90', label: 'Últimos 90 días' },
  { value: 'custom', label: 'Personalizado' },
] as const;

export const LEGISLATION_STAGE_OPTIONS = [
  { value: 'only_bills', label: 'Solo Proyectos de Ley', description: 'Únicamente PLs en trámite' },
  { value: 'bills_and_enacted', label: 'PLs + Normas Publicadas', description: 'Incluye ambos tipos' },
  { value: 'only_enacted', label: 'Solo Normas Publicadas', description: 'Únicamente normas vigentes' },
] as const;

export const NORM_TYPE_OPTIONS = [
  'Ley',
  'Decreto Supremo',
  'Decreto Legislativo',
  'Decreto de Urgencia',
  'Resolución Suprema',
  'Resolución Ministerial',
  'Resolución Directoral',
  'Ordenanza Regional',
  'Ordenanza Municipal',
  'NTP (Norma Técnica)',
] as const;

export const ANALYTICS_SECTION_OPTIONS = [
  { value: 'volume_trends', label: 'Tendencias de Volumen' },
  { value: 'stage_distribution', label: 'Distribución por Estado' },
  { value: 'sector_breakdown', label: 'Desglose por Sector' },
  { value: 'impact_matrix', label: 'Matriz de Impacto' },
  { value: 'timeline', label: 'Línea de Tiempo' },
] as const;

export const TIMEZONE_OPTIONS = [
  { value: 'America/Lima', label: 'Lima (UTC-5)' },
  { value: 'America/Bogota', label: 'Bogotá (UTC-5)' },
  { value: 'America/Mexico_City', label: 'Ciudad de México (UTC-6)' },
  { value: 'America/New_York', label: 'Nueva York (UTC-5)' },
  { value: 'Europe/Madrid', label: 'Madrid (UTC+1)' },
] as const;

export const WEEKDAY_OPTIONS = [
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
  { value: 0, label: 'Domingo' },
] as const;
