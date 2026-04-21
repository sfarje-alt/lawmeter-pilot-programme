// Analytics System Types

export type AnalyticsVisibility = 'internal' | 'client' | 'both';

export type AnalyticsSection = 'general' | 'bills' | 'sessions' | 'ops';

export type AnalyticsBlockKey = 
  // Internal (Legal Team only) — operations
  | 'editorial_response_time'
  | 'pin_archive'
  | 'reviewed_alerts'
  | 'detection_to_action_time'
  | 'ai_usage'
  | 'reports_generated'
  // Client (shared with Legal Team)
  | 'impact_matrix'
  | 'regulatory_pulse'
  | 'alert_priority'
  | 'alert_distribution'
  | 'top_entities'
  | 'legislative_funnel'
  | 'key_movements'
  | 'popular_topics'
  | 'emerging_topics'
  | 'exposure'
  | 'service_kpis'
  // Sessions (Sesiones del Congreso)
  | 'sessions_by_commission'
  | 'sessions_temporal_evolution'
  | 'session_agenda_type'
  | 'session_topics'
  | 'session_recurring_bills';

export interface AnalyticsBlockDefinition {
  key: AnalyticsBlockKey;
  title: string;
  takeaway: string;
  infoTooltip: string;
  visibility: AnalyticsVisibility;
  section: AnalyticsSection;
  chartType: 'line' | 'bar' | 'stacked_bar' | 'pie' | 'matrix' | 'funnel' | 'kpi' | 'timeline' | 'cards';
  defaultEnabled: boolean;
  maxItems?: number; // For rankings (e.g., Top 5-7)
}

export interface AnalyticsBlockConfig {
  key: AnalyticsBlockKey;
  enabled: boolean;
  order: number;
}

export interface AnalyticsTemplate {
  id: string;
  name: string;
  clientId: string | null; // null = default firm template
  blocks: AnalyticsBlockConfig[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  version: number;
}

// Data types for analytics calculations
export interface TimeSeriesDataPoint {
  date: string; // ISO date
  value: number;
  label?: string;
}

export interface TrendData {
  current: number;
  previous: number;
  change: number; // percentage
  direction: 'up' | 'down' | 'stable';
}

export interface RankingItem {
  id: string;
  label: string;
  value: number;
  change?: TrendData;
  icon?: string;
}

export interface MatrixCell {
  row: string; // Impact level
  col: string; // Urgency level
  value: number;
  items: string[]; // Alert IDs
}

export interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
  items: string[]; // Alert IDs
}

export interface KPIMetric {
  label: string;
  value: string | number;
  unit?: string;
  trend?: TrendData;
  icon?: string;
}

// Filters
export interface AnalyticsFilters {
  period: 'all_time' | 'last_7' | 'last_30' | 'last_60' | 'last_90' | 'custom';
  customDateFrom?: Date;
  customDateTo?: Date;
  clientIds?: string[];
  legislationType?: 'bills' | 'regulations' | 'all';
  sectors?: string[];
  areas?: string[];
  impactLevels?: string[];
  stages?: string[];
  entities?: string[];
}

// Aggregated metrics result types
export interface AggregatedMetrics {
  totalAlerts: number;
  totalBills: number;
  totalRegulations: number;
  alertsByImpact: Record<string, number>;
  alertsByUrgency: Record<string, number>;
  alertsByStage: Record<string, number>;
  alertsByArea: Record<string, number>;
  alertsBySector: Record<string, number>;
  volumeTrend: TimeSeriesDataPoint[];
  topEntities: RankingItem[];
  topTopics: RankingItem[];
}

export interface EditorialMetrics {
  totalCaptured: number;
  totalPublished: number;
  coverageRate: number;
  avgResponseTimeHours: number;
  medianResponseTimeHours: number;
  responseTimeTrend: TimeSeriesDataPoint[];
  coverageTrend: TimeSeriesDataPoint[];
}

export interface OperationalQueueMetrics {
  unread: number;
  withoutCommentary: number;
  withoutTags: number;
  totalActive: number;
  byStage: { stage: string; count: number; avgDaysInStage: number }[];
}

export interface ClientMetrics extends AggregatedMetrics {
  clientId: string;
  clientName: string;
  impactMatrix: MatrixCell[];
  legislativeFunnel: FunnelStage[];
  keyMovements: {
    newItems: number;
    stageChanges: number;
    upcomingDeadlines: number;
    items: { id: string; type: 'new' | 'progress' | 'deadline'; title: string; date: string }[];
  };
  emergingTopics: RankingItem[];
  exposureByArea: RankingItem[];
  serviceKPIs: KPIMetric[];
}

export interface IndustryBenchmark {
  clientValue: number;
  industryAverage: number;
  industryMin: number;
  industryMax: number;
  percentile: number;
  cohortSize: number;
  privacyNote: string;
}

// Block registry - defines all available analytics blocks
export const ANALYTICS_BLOCK_REGISTRY: AnalyticsBlockDefinition[] = [
  // Internal blocks (Operaciones internas)
  {
    key: 'editorial_response_time',
    title: 'Tiempo Medio de Apertura',
    takeaway: 'Horas promedio entre creación y primera lectura',
    infoTooltip: 'Mide qué tan rápido el equipo abre y revisa las alertas tras su creación.',
    visibility: 'internal',
    chartType: 'line',
    defaultEnabled: true,
  },
  {
    key: 'pin_archive',
    title: 'Pinneadas y Archivadas',
    takeaway: 'Total y porcentaje de alertas pinneadas y archivadas',
    infoTooltip: 'Mide cuántas alertas el usuario ha marcado como pinneadas o archivadas, con sus porcentajes.',
    visibility: 'internal',
    chartType: 'kpi',
    defaultEnabled: true,
  },
  {
    key: 'reviewed_alerts',
    title: 'Alertas Revisadas por Período',
    takeaway: 'Volumen semanal de alertas abiertas por el equipo',
    infoTooltip: 'Conteo de alertas que el equipo abrió y revisó al menos una vez, agrupado por semana.',
    visibility: 'internal',
    chartType: 'bar',
    defaultEnabled: true,
  },
  {
    key: 'detection_to_action_time',
    title: 'Tiempo: detección → apertura / pin',
    takeaway: 'Tiempos medios entre detección, apertura y pineo',
    infoTooltip: 'Tiempo medio entre detección y primera apertura, y entre detección y pineo para publicación.',
    visibility: 'internal',
    chartType: 'bar',
    defaultEnabled: true,
  },
  {
    key: 'ai_usage',
    title: 'Uso de IA: transcripción y chatbot',
    takeaway: 'Alertas con transcripción solicitada y chatbot habilitado',
    infoTooltip: 'Volumen de alertas que tuvieron transcripción solicitada y/o el chatbot habilitado.',
    visibility: 'internal',
    chartType: 'bar',
    defaultEnabled: true,
  },
  {
    key: 'reports_generated',
    title: 'Reportes generados y alertas utilizadas',
    takeaway: 'Reportes generados y alertas incluidas en cada uno',
    infoTooltip: 'Volumen semanal de reportes generados y total de alertas utilizadas como contenido.',
    visibility: 'internal',
    chartType: 'line',
    defaultEnabled: true,
  },
  
  // Client blocks (shared with Legal Team)
  {
    key: 'impact_matrix',
    title: 'Matriz de Impacto',
    takeaway: 'Alertas clasificadas por impacto y urgencia',
    infoTooltip: 'Matriz 3x3 que cruza nivel de impacto (Grave/Medio/Leve) con urgencia (Alta/Media/Baja).',
    visibility: 'both',
    chartType: 'matrix',
    defaultEnabled: true,
  },
  {
    key: 'regulatory_pulse',
    title: 'Pulso Regulatorio',
    takeaway: 'Actividad legislativa/regulatoria en el período',
    infoTooltip: 'Conteo de PLs, Leyes y Reglamentos publicados al cliente por fecha oficial.',
    visibility: 'both',
    chartType: 'line',
    defaultEnabled: true,
  },
  {
    key: 'alert_priority',
    title: 'Prioridad de Alertas',
    takeaway: 'Alertas por nivel de impacto',
    infoTooltip: 'Clasificación de alertas publicadas según nivel de impacto para el cliente.',
    visibility: 'both',
    chartType: 'bar',
    defaultEnabled: true,
  },
  {
    key: 'alert_distribution',
    title: 'Distribución de Alertas',
    takeaway: 'Desglose por tipo y área',
    infoTooltip: 'Distribución de alertas publicadas por tipo de legislación y área legal.',
    visibility: 'both',
    chartType: 'pie',
    defaultEnabled: true,
  },
  {
    key: 'top_entities',
    title: 'Principales Entidades',
    takeaway: 'Autoridades más activas para el cliente',
    infoTooltip: 'Ranking de entidades emisoras con mayor número de alertas publicadas.',
    visibility: 'both',
    chartType: 'bar',
    defaultEnabled: true,
    maxItems: 7,
  },
  {
    key: 'legislative_funnel',
    title: 'Embudo Legislativo',
    takeaway: 'Distribución de PLs por etapa del proceso',
    infoTooltip: 'Cuántos proyectos de ley están en cada fase: Comisión, Pleno, Trámite Final, etc.',
    visibility: 'both',
    chartType: 'funnel',
    defaultEnabled: true,
  },
  {
    key: 'key_movements',
    title: 'Movimientos Clave',
    takeaway: 'Items nuevos y cambios de etapa recientes',
    infoTooltip: 'Alertas recién publicadas, cambios de estado y plazos próximos.',
    visibility: 'both',
    chartType: 'timeline',
    defaultEnabled: true,
  },
  {
    key: 'popular_topics',
    title: 'Temas Populares',
    takeaway: 'Áreas con mayor concentración de alertas',
    infoTooltip: 'Ranking de temas/áreas legales con más alertas publicadas al cliente.',
    visibility: 'both',
    chartType: 'bar',
    defaultEnabled: true,
    maxItems: 7,
  },
  {
    key: 'emerging_topics',
    title: 'Temas Emergentes',
    takeaway: 'Temas en crecimiento vs período anterior',
    infoTooltip: 'Áreas que muestran aumento sostenido en volumen de alertas.',
    visibility: 'both',
    chartType: 'cards',
    defaultEnabled: false,
  },
  {
    key: 'exposure',
    title: 'Exposición',
    takeaway: 'Áreas del negocio más impactadas',
    infoTooltip: 'Desglose por área de negocio (operaciones, compliance, gobernanza, etc.) según alertas publicadas.',
    visibility: 'both',
    chartType: 'bar',
    defaultEnabled: true,
  },
  {
    key: 'service_kpis',
    title: 'Indicadores de Servicio',
    takeaway: 'Calidad operativa: tiempo, cobertura experta y SLA',
    infoTooltip: 'Tiempo medio de revisión, cobertura con comentario experto y cumplimiento de SLA del servicio.',
    visibility: 'both',
    chartType: 'kpi',
    defaultEnabled: true,
  },
];

// Helper to get blocks by visibility
export function getBlocksByVisibility(visibility: AnalyticsVisibility | 'all'): AnalyticsBlockDefinition[] {
  if (visibility === 'all') return ANALYTICS_BLOCK_REGISTRY;
  return ANALYTICS_BLOCK_REGISTRY.filter(
    block => block.visibility === visibility || block.visibility === 'both'
  );
}

// Helper to get internal-only blocks
export function getInternalBlocks(): AnalyticsBlockDefinition[] {
  return ANALYTICS_BLOCK_REGISTRY.filter(block => block.visibility === 'internal');
}

// Helper to get client-visible blocks
export function getClientBlocks(): AnalyticsBlockDefinition[] {
  return ANALYTICS_BLOCK_REGISTRY.filter(
    block => block.visibility === 'client' || block.visibility === 'both'
  );
}

// Default template for new clients
export function getDefaultAnalyticsTemplate(): AnalyticsBlockConfig[] {
  return ANALYTICS_BLOCK_REGISTRY
    .filter(block => block.visibility === 'client' || block.visibility === 'both')
    .filter(block => block.defaultEnabled)
    .map((block, index) => ({
      key: block.key,
      enabled: true,
      order: index,
    }));
}

// Extended config type for the Layout Builder (includes metadata for UI display)
export interface AnalyticsBlockConfigExtended extends AnalyticsBlockConfig {
  title: string;
  takeaway: string;
  infoTooltip: string;
  visibility: AnalyticsVisibility;
  renderPDF: boolean;
  renderDashboard: boolean;
}

// Client analytics blocks with full metadata for Layout Builder
export const CLIENT_ANALYTICS_BLOCKS: AnalyticsBlockConfigExtended[] = ANALYTICS_BLOCK_REGISTRY
  .filter(block => block.visibility === 'client' || block.visibility === 'both')
  .map((block, index) => ({
    key: block.key,
    enabled: block.defaultEnabled,
    order: index,
    title: block.title,
    takeaway: block.takeaway,
    infoTooltip: block.infoTooltip,
    visibility: block.visibility,
    renderPDF: block.defaultEnabled,
    renderDashboard: true,
  }));
