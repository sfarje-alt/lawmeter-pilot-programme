// Analytics Repository - Unified Data Layer
// Centralizes all analytics calculations combining public data, temporal evolution, and editorial layer

import { ALL_MOCK_ALERTS, type PeruAlert } from '@/data/peruAlertsMockData';
import type {
  AnalyticsFilters,
  AggregatedMetrics,
  EditorialMetrics,
  OperationalQueueMetrics,
  ClientMetrics,
  IndustryBenchmark,
  TimeSeriesDataPoint,
  TrendData,
  RankingItem,
  MatrixCell,
  FunnelStage,
  KPIMetric,
} from '@/types/analytics';

// Helper to parse date strings (DD/MM/YYYY format)
function parseDate(dateStr: string | undefined | null): Date | null {
  if (!dateStr) return null;
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  return new Date(year, month, day);
}

// Helper to get date range from filter
function getDateRange(filters: AnalyticsFilters): { start: Date; end: Date } {
  const end = new Date();
  let start = new Date();
  
  switch (filters.period) {
    case 'last_7':
      start.setDate(end.getDate() - 7);
      break;
    case 'last_30':
      start.setDate(end.getDate() - 30);
      break;
    case 'last_60':
      start.setDate(end.getDate() - 60);
      break;
    case 'last_90':
      start.setDate(end.getDate() - 90);
      break;
    case 'custom':
      start = filters.customDateFrom || new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      start.setDate(end.getDate() - 30);
  }
  
  return { start, end };
}

// Get date from alert (handles both bills and regulations)
function getAlertDate(alert: PeruAlert): string | undefined {
  return alert.project_date || alert.publication_date || alert.stage_date;
}

// Get type label
function getAlertType(alert: PeruAlert): string {
  return alert.legislation_type === 'proyecto_de_ley' ? 'Proyecto de Ley' : 'Norma';
}

// Get impact level normalized
function getImpactLevel(alert: PeruAlert): string {
  const level = alert.impact_level;
  if (!level) return 'Leve';
  return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();
}

// Filter alerts based on criteria
function filterAlerts(
  alerts: PeruAlert[],
  filters: AnalyticsFilters,
  options: { onlyPublished?: boolean; clientId?: string } = {}
): PeruAlert[] {
  const { start, end } = getDateRange(filters);
  
  return alerts.filter(alert => {
    // Date filter
    const alertDateStr = getAlertDate(alert);
    const alertDate = parseDate(alertDateStr);
    if (alertDate && (alertDate < start || alertDate > end)) return false;
    
    // Published filter
    if (options.onlyPublished && alert.status !== 'published') return false;
    
    // Client filter
    if (options.clientId && alert.client_id !== options.clientId && alert.primary_client_id !== options.clientId) return false;
    if (filters.clientIds?.length && !filters.clientIds.includes(alert.client_id || '') && !filters.clientIds.includes(alert.primary_client_id || '')) return false;
    
    // Legislation type filter
    if (filters.legislationType && filters.legislationType !== 'all') {
      const isBill = alert.legislation_type === 'proyecto_de_ley';
      if (filters.legislationType === 'bills' && !isBill) return false;
      if (filters.legislationType === 'regulations' && isBill) return false;
    }
    
    // Impact filter
    if (filters.impactLevels?.length) {
      const impactLevel = getImpactLevel(alert);
      if (!filters.impactLevels.includes(impactLevel)) return false;
    }
    
    // Area filter
    if (filters.areas?.length) {
      const alertAreas = alert.affected_areas || [];
      if (!alertAreas.some(a => filters.areas!.includes(a))) return false;
    }
    
    // Sector filter
    if (filters.sectors?.length && alert.sector && !filters.sectors.includes(alert.sector)) return false;
    
    // Stage filter
    if (filters.stages?.length && alert.current_stage && !filters.stages.includes(alert.current_stage)) return false;
    
    // Entity filter
    if (filters.entities?.length && alert.entity && !filters.entities.includes(alert.entity)) return false;
    
    return true;
  });
}

// Calculate trend between two values
function calculateTrend(current: number, previous: number): TrendData {
  if (previous === 0) {
    return {
      current,
      previous,
      change: current > 0 ? 100 : 0,
      direction: current > 0 ? 'up' : 'stable',
    };
  }
  
  const change = ((current - previous) / previous) * 100;
  return {
    current,
    previous,
    change: Math.round(change * 10) / 10,
    direction: change > 5 ? 'up' : change < -5 ? 'down' : 'stable',
  };
}

// Generate time series data grouped by week
function generateWeeklyTimeSeries(alerts: PeruAlert[]): TimeSeriesDataPoint[] {
  const weekMap = new Map<string, number>();
  
  alerts.forEach(alert => {
    const dateStr = getAlertDate(alert);
    const date = parseDate(dateStr);
    if (!date) return;
    
    // Get start of week
    const weekStart = new Date(date);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekKey = weekStart.toISOString().split('T')[0];
    
    weekMap.set(weekKey, (weekMap.get(weekKey) || 0) + 1);
  });
  
  return Array.from(weekMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, value]) => ({ date, value }));
}

// Get aggregated metrics (for Legal Team)
export function getAggregatedMetrics(
  filters: AnalyticsFilters,
  userType: 'admin' | 'client' = 'admin'
): AggregatedMetrics {
  const filtered = filterAlerts(ALL_MOCK_ALERTS, filters, {
    onlyPublished: userType === 'client',
  });
  
  const bills = filtered.filter(a => a.legislation_type === 'proyecto_de_ley');
  const regulations = filtered.filter(a => a.legislation_type === 'norma');
  
  // Count by different dimensions
  const alertsByImpact: Record<string, number> = {};
  const alertsByUrgency: Record<string, number> = {};
  const alertsByStage: Record<string, number> = {};
  const alertsByArea: Record<string, number> = {};
  const alertsBySector: Record<string, number> = {};
  const entityCounts: Record<string, number> = {};
  const topicCounts: Record<string, number> = {};
  
  filtered.forEach(alert => {
    // Impact
    const impact = getImpactLevel(alert);
    alertsByImpact[impact] = (alertsByImpact[impact] || 0) + 1;
    
    // Urgency (derive from impact for now)
    const urgency = impact === 'Grave' ? 'Alta' : impact === 'Medio' ? 'Media' : 'Baja';
    alertsByUrgency[urgency] = (alertsByUrgency[urgency] || 0) + 1;
    
    // Stage
    const stage = alert.current_stage || 'Sin Estado';
    alertsByStage[stage] = (alertsByStage[stage] || 0) + 1;
    
    // Areas
    (alert.affected_areas || []).forEach(area => {
      alertsByArea[area] = (alertsByArea[area] || 0) + 1;
      topicCounts[area] = (topicCounts[area] || 0) + 1;
    });
    
    // Sector
    if (alert.sector) {
      alertsBySector[alert.sector] = (alertsBySector[alert.sector] || 0) + 1;
    }
    
    // Entity
    const entity = alert.entity || alert.parliamentary_group;
    if (entity) {
      entityCounts[entity] = (entityCounts[entity] || 0) + 1;
    }
  });
  
  // Top entities
  const topEntities: RankingItem[] = Object.entries(entityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([label, value], index) => ({
      id: `entity-${index}`,
      label,
      value,
    }));
  
  // Top topics
  const topTopics: RankingItem[] = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([label, value], index) => ({
      id: `topic-${index}`,
      label,
      value,
    }));
  
  return {
    totalAlerts: filtered.length,
    totalBills: bills.length,
    totalRegulations: regulations.length,
    alertsByImpact,
    alertsByUrgency,
    alertsByStage,
    alertsByArea,
    alertsBySector,
    volumeTrend: generateWeeklyTimeSeries(filtered),
    topEntities,
    topTopics,
  };
}

// Get editorial metrics (for Legal Team only)
export function getEditorialMetrics(filters: AnalyticsFilters): EditorialMetrics {
  const allAlerts = filterAlerts(ALL_MOCK_ALERTS, filters);
  const publishedAlerts = allAlerts.filter(a => a.status === 'published');
  
  // Calculate response times (mock calculation)
  const responseTimes = publishedAlerts
    .filter(a => a.expert_commentary)
    .map(() => Math.random() * 48 + 2); // Random 2-50 hours for demo
  
  const avgResponseTime = responseTimes.length > 0
    ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
    : 0;
  
  const sortedTimes = [...responseTimes].sort((a, b) => a - b);
  const medianResponseTime = sortedTimes.length > 0
    ? sortedTimes[Math.floor(sortedTimes.length / 2)]
    : 0;
  
  const coverageRate = allAlerts.length > 0
    ? (publishedAlerts.length / allAlerts.length) * 100
    : 0;
  
  // Generate trend data
  const coverageTrend: TimeSeriesDataPoint[] = [];
  const responseTimeTrend: TimeSeriesDataPoint[] = [];
  
  // Group by week for trends
  const weekMap = new Map<string, { captured: number; published: number; responseSum: number; responseCount: number }>();
  
  allAlerts.forEach(alert => {
    const dateStr = getAlertDate(alert);
    const date = parseDate(dateStr);
    if (!date) return;
    
    const weekStart = new Date(date);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekKey = weekStart.toISOString().split('T')[0];
    
    const week = weekMap.get(weekKey) || { captured: 0, published: 0, responseSum: 0, responseCount: 0 };
    week.captured++;
    
    if (alert.status === 'published') {
      week.published++;
      if (alert.expert_commentary) {
        week.responseSum += Math.random() * 24 + 4;
        week.responseCount++;
      }
    }
    
    weekMap.set(weekKey, week);
  });
  
  weekMap.forEach((data, date) => {
    coverageTrend.push({
      date,
      value: data.captured > 0 ? (data.published / data.captured) * 100 : 0,
    });
    
    responseTimeTrend.push({
      date,
      value: data.responseCount > 0 ? data.responseSum / data.responseCount : 0,
    });
  });
  
  coverageTrend.sort((a, b) => a.date.localeCompare(b.date));
  responseTimeTrend.sort((a, b) => a.date.localeCompare(b.date));
  
  return {
    totalCaptured: allAlerts.length,
    totalPublished: publishedAlerts.length,
    coverageRate: Math.round(coverageRate * 10) / 10,
    avgResponseTimeHours: Math.round(avgResponseTime * 10) / 10,
    medianResponseTimeHours: Math.round(medianResponseTime * 10) / 10,
    responseTimeTrend,
    coverageTrend,
  };
}

// Get operational queue metrics (for Legal Team only)
export function getOperationalQueueMetrics(): OperationalQueueMetrics {
  const pendingReview = ALL_MOCK_ALERTS.filter(a => a.status === 'inbox').length;
  const reviewed = ALL_MOCK_ALERTS.filter(a => a.status === 'reviewed').length;
  const pendingPublish = reviewed;
  
  // Count by stage
  const stageCounts: Record<string, { count: number; totalDays: number }> = {};
  
  ALL_MOCK_ALERTS
    .filter(a => a.status !== 'declined' && a.status !== 'published')
    .forEach(alert => {
      const stage = alert.current_stage || 'Sin Estado';
      if (!stageCounts[stage]) {
        stageCounts[stage] = { count: 0, totalDays: 0 };
      }
      stageCounts[stage].count++;
      stageCounts[stage].totalDays += Math.floor(Math.random() * 14) + 1;
    });
  
  const byStage = Object.entries(stageCounts).map(([stage, data]) => ({
    stage,
    count: data.count,
    avgDaysInStage: Math.round(data.totalDays / data.count),
  }));
  
  // Count by priority
  const priorityCounts: Record<string, number> = { Alta: 0, Media: 0, Baja: 0 };
  ALL_MOCK_ALERTS
    .filter(a => a.status !== 'declined' && a.status !== 'published')
    .forEach(alert => {
      const impact = getImpactLevel(alert);
      const priority = impact === 'Grave' ? 'Alta' : impact === 'Medio' ? 'Media' : 'Baja';
      priorityCounts[priority]++;
    });
  
  const byPriority = Object.entries(priorityCounts).map(([priority, count]) => ({
    priority,
    count,
  }));
  
  return {
    byStage,
    byPriority,
    pendingReview,
    pendingPublish,
    totalInQueue: pendingReview + pendingPublish,
  };
}

// Get client-specific metrics
export function getClientMetrics(
  clientId: string,
  clientName: string,
  filters: AnalyticsFilters
): ClientMetrics {
  const aggregated = getAggregatedMetrics(filters, 'client');
  const clientAlerts = filterAlerts(ALL_MOCK_ALERTS, filters, {
    onlyPublished: true,
    clientId,
  });
  
  // Impact Matrix (3x3)
  const matrixData: Record<string, Record<string, string[]>> = {
    Grave: { Alta: [], Media: [], Baja: [] },
    Medio: { Alta: [], Media: [], Baja: [] },
    Leve: { Alta: [], Media: [], Baja: [] },
  };
  
  clientAlerts.forEach(alert => {
    const impact = getImpactLevel(alert);
    const urgency = impact === 'Grave' ? 'Alta' : impact === 'Medio' ? 'Media' : 'Baja';
    if (matrixData[impact] && matrixData[impact][urgency]) {
      matrixData[impact][urgency].push(alert.id);
    }
  });
  
  const impactMatrix: MatrixCell[] = [];
  Object.entries(matrixData).forEach(([impact, urgencies]) => {
    Object.entries(urgencies).forEach(([urgency, items]) => {
      impactMatrix.push({
        row: impact,
        col: urgency,
        value: items.length,
        items,
      });
    });
  });
  
  // Legislative Funnel
  const funnelStages = ['EN COMISIÓN', 'DICTAMEN', 'EN AGENDA DEL PLENO', 'APROBADO', 'PROMULGADA'];
  const stageCounts: Record<string, string[]> = {};
  
  clientAlerts
    .filter(a => a.legislation_type === 'proyecto_de_ley')
    .forEach(alert => {
      const stage = alert.current_stage || 'EN COMISIÓN';
      if (!stageCounts[stage]) stageCounts[stage] = [];
      stageCounts[stage].push(alert.id);
    });
  
  const totalBills = clientAlerts.filter(a => a.legislation_type === 'proyecto_de_ley').length;
  const legislativeFunnel: FunnelStage[] = funnelStages.map(stage => ({
    stage,
    count: stageCounts[stage]?.length || 0,
    percentage: totalBills > 0 ? ((stageCounts[stage]?.length || 0) / totalBills) * 100 : 0,
    items: stageCounts[stage] || [],
  }));
  
  // Key Movements
  const recentAlerts = clientAlerts
    .slice(-5)
    .map(a => ({
      id: a.id,
      type: 'new' as const,
      title: a.legislation_title,
      date: getAlertDate(a) || '',
    }));
  
  const keyMovements = {
    newItems: recentAlerts.length,
    stageChanges: Math.floor(Math.random() * 3),
    upcomingDeadlines: Math.floor(Math.random() * 2),
    items: recentAlerts,
  };
  
  // Emerging Topics (compare with previous period)
  const emergingTopics: RankingItem[] = aggregated.topTopics
    .slice(0, 5)
    .map((topic) => ({
      ...topic,
      change: calculateTrend(topic.value, topic.value - Math.floor(Math.random() * 3)),
    }));
  
  // Exposure by Area
  const exposureByArea: RankingItem[] = Object.entries(aggregated.alertsByArea)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([label, value], index) => ({
      id: `exposure-${index}`,
      label,
      value,
    }));
  
  // Service KPIs — calidad operativa interna del servicio (no volumen)
  const editorial = getEditorialMetrics(filters);
  const serviceKPIs: KPIMetric[] = [
    {
      label: 'Tiempo Medio de Revisión',
      value: `${Math.round(editorial.medianResponseTimeHours)}h`,
      icon: 'clock',
    },
    {
      label: 'Cobertura con Comentario Experto',
      value: `${Math.round(editorial.coverageRate)}%`,
      icon: 'check-circle',
    },
    {
      label: 'Cumplimiento de SLA',
      value: `${Math.min(100, Math.round(editorial.coverageRate + 5))}%`,
      icon: 'activity',
    },
  ];
  
  return {
    ...aggregated,
    clientId,
    clientName,
    impactMatrix,
    legislativeFunnel,
    keyMovements,
    emergingTopics,
    exposureByArea,
    serviceKPIs,
  };
}

// Get industry benchmark (requires minimum cohort size)
export function getIndustryBenchmark(
  clientId: string,
  metric: 'volume' | 'entities' | 'topics',
  filters: AnalyticsFilters
): IndustryBenchmark | null {
  // Minimum cohort size for privacy
  const MIN_COHORT_SIZE = 5;
  
  // Mock: simulate industry data
  const cohortSize = Math.floor(Math.random() * 10) + 3;
  
  if (cohortSize < MIN_COHORT_SIZE) {
    return null;
  }
  
  const clientMetrics = getClientMetrics(clientId, '', filters);
  const clientValue = metric === 'volume' 
    ? clientMetrics.totalAlerts
    : metric === 'entities'
    ? clientMetrics.topEntities.length
    : clientMetrics.topTopics.length;
  
  const industryAverage = Math.round(clientValue * (0.8 + Math.random() * 0.4));
  const industryMin = Math.round(industryAverage * 0.5);
  const industryMax = Math.round(industryAverage * 1.5);
  
  const percentile = Math.min(100, Math.max(0, 
    Math.round(((clientValue - industryMin) / (industryMax - industryMin)) * 100)
  ));
  
  return {
    clientValue,
    industryAverage,
    industryMin,
    industryMax,
    percentile,
    cohortSize,
    privacyNote: 'Datos agregados y anonimizados de empresas del mismo sector.',
  };
}

// Data freshness information
export function getDataFreshness(): { lastUpdate: string; dataThrough: string } {
  const now = new Date();
  return {
    lastUpdate: now.toISOString(),
    dataThrough: now.toISOString().split('T')[0],
  };
}
