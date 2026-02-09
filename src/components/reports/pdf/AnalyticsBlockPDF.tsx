import { View, Text, StyleSheet } from "@react-pdf/renderer";
import type { PeruAlert } from "@/data/peruAlertsMockData";
import {
  DEMO_IMPACT_MATRIX,
  DEMO_REGULATORY_PULSE,
  DEMO_ALERT_PRIORITY,
  DEMO_ALERT_DISTRIBUTION,
  DEMO_LEGISLATIVE_FUNNEL,
  DEMO_TOP_ENTITIES,
  DEMO_POPULAR_TOPICS,
  DEMO_KEY_MOVEMENTS,
  DEMO_EMERGING_TOPICS,
  DEMO_EXPOSURE,
  DEMO_EDITORIAL_COVERAGE,
  DEMO_EDITORIAL_RESPONSE_TIME,
  DEMO_OPERATIONAL_QUEUE,
  DEMO_AGGREGATED_ENTITIES,
  DEMO_SERVICE_KPIS,
  DEMO_INDUSTRY_BENCHMARK,
} from "@/lib/analyticsMockData";

// Standardized PDF block styles
const styles = StyleSheet.create({
  block: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 4,
    borderLeft: '3 solid #3b82f6',
  },
  blockHeader: {
    marginBottom: 8,
  },
  blockTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 2,
  },
  blockTakeaway: {
    fontSize: 9,
    color: '#64748b',
    fontStyle: 'italic',
  },
  blockContent: {
    marginTop: 8,
  },
  matrixGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  matrixCell: {
    width: '30%',
    padding: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    alignItems: 'center',
    marginBottom: 4,
    marginRight: 4,
  },
  matrixCellLabel: {
    fontSize: 7,
    color: '#64748b',
    marginBottom: 2,
  },
  matrixCellValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  barContainer: {
    marginBottom: 6,
  },
  barLabel: {
    fontSize: 8,
    color: '#475569',
    marginBottom: 2,
  },
  barWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  barFill: {
    height: 12,
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
  barValue: {
    fontSize: 8,
    color: '#64748b',
    width: 25,
    textAlign: 'right',
  },
  funnelStage: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
  },
  funnelLabel: {
    flex: 1,
    fontSize: 8,
    color: '#334155',
  },
  funnelValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  kpiCard: {
    flex: 1,
    padding: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    alignItems: 'center',
  },
  kpiValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 2,
  },
  kpiLabel: {
    fontSize: 7,
    color: '#64748b',
    textAlign: 'center',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  listBullet: {
    width: 4,
    height: 4,
    backgroundColor: '#3b82f6',
    borderRadius: 2,
    marginRight: 6,
  },
  listText: {
    fontSize: 8,
    color: '#334155',
    flex: 1,
  },
  listValue: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  blockFooter: {
    marginTop: 8,
    paddingTop: 6,
    borderTop: '1 solid #e2e8f0',
  },
  footerText: {
    fontSize: 7,
    color: '#94a3b8',
  },
  // Timeline items
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingLeft: 8,
    borderLeft: '2 solid #e2e8f0',
  },
  timelineDate: {
    fontSize: 7,
    color: '#94a3b8',
    width: 55,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 8,
    color: '#1e293b',
    fontWeight: 'bold',
  },
  timelineDetail: {
    fontSize: 7,
    color: '#64748b',
  },
  // Badge
  badge: {
    fontSize: 6,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
    marginRight: 4,
  },
});

const IMPACT_COLORS: Record<string, string> = {
  'Grave': '#dc2626',
  'Medio': '#f59e0b',
  'Leve': '#6b7280',
  'Positivo': '#22c55e',
};

const STAGE_COLORS: Record<string, string> = {
  'EN COMISIÓN': '#3b82f6',
  'DICTAMEN': '#6366f1',
  'EN AGENDA DEL PLENO': '#8b5cf6',
  'APROBADO': '#f59e0b',
  'AUTÓGRAFA': '#f97316',
  'PROMULGADA': '#22c55e',
  'AL ARCHIVO': '#6b7280',
};

interface AnalyticsBlockPDFProps {
  blockKey: string;
  title: string;
  takeaway: string;
  alerts: PeruAlert[];
  timeframe: string;
}

// Impact Matrix Block - uses demo data
function ImpactMatrixBlockPDF({ timeframe }: { timeframe: string }) {
  const data = DEMO_IMPACT_MATRIX;
  const levels = [
    { label: 'Grave', keys: ['grave-alta', 'grave-media', 'grave-baja'] },
    { label: 'Medio', keys: ['medio-alta', 'medio-media', 'medio-baja'] },
    { label: 'Leve', keys: ['leve-alta', 'leve-media', 'leve-baja'] },
  ];

  return (
    <View style={styles.block}>
      <View style={styles.blockHeader}>
        <Text style={styles.blockTitle}>Matriz de Impacto</Text>
        <Text style={styles.blockTakeaway}>
          Distribución de alertas por nivel de impacto y urgencia
        </Text>
      </View>
      <View style={styles.blockContent}>
        <View style={styles.matrixGrid}>
          {levels.map(level =>
            level.keys.map(key => (
              <View key={key} style={[styles.matrixCell, { borderLeft: `3 solid ${IMPACT_COLORS[level.label] || '#6b7280'}` }]}>
                <Text style={styles.matrixCellLabel}>{key.replace('-', ' / ')}</Text>
                <Text style={styles.matrixCellValue}>{(data as any)[key]?.value || 0}</Text>
              </View>
            ))
          )}
        </View>
      </View>
      <View style={styles.blockFooter}>
        <Text style={styles.footerText}>Período: {timeframe} • Fuente: Alertas publicadas</Text>
      </View>
    </View>
  );
}

// Regulatory Pulse Block - uses demo data
function RegulatoryPulseBlockPDF({ timeframe }: { timeframe: string }) {
  const data = DEMO_REGULATORY_PULSE;

  return (
    <View style={styles.block}>
      <View style={styles.blockHeader}>
        <Text style={styles.blockTitle}>Pulso Regulatorio</Text>
        <Text style={styles.blockTakeaway}>
          {data.billsTotal + data.regulationsTotal} publicaciones ({data.billsTotal} PLs, {data.regulationsTotal} normas)
        </Text>
      </View>
      <View style={styles.blockContent}>
        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{data.billsTotal + data.regulationsTotal}</Text>
            <Text style={styles.kpiLabel}>Total</Text>
          </View>
          <View style={[styles.kpiCard, { borderTop: '3 solid #3b82f6' }]}>
            <Text style={styles.kpiValue}>{data.billsTotal}</Text>
            <Text style={styles.kpiLabel}>Proyectos de Ley</Text>
          </View>
          <View style={[styles.kpiCard, { borderTop: '3 solid #22c55e' }]}>
            <Text style={styles.kpiValue}>{data.regulationsTotal}</Text>
            <Text style={styles.kpiLabel}>Normas</Text>
          </View>
        </View>
      </View>
      <View style={styles.blockFooter}>
        <Text style={styles.footerText}>Período: {timeframe} • Tendencia: +{data.trendPercent}%</Text>
      </View>
    </View>
  );
}

// Alert Priority Block - uses demo data
function AlertPriorityBlockPDF({ timeframe }: { timeframe: string }) {
  const data = DEMO_ALERT_PRIORITY;
  const maxValue = Math.max(...data.chartData.map(d => d.value), 1);

  return (
    <View style={styles.block}>
      <View style={styles.blockHeader}>
        <Text style={styles.blockTitle}>Prioridad de Alertas</Text>
        <Text style={styles.blockTakeaway}>
          {data.highPriorityCount} alertas de alto impacto de {data.total} totales
        </Text>
      </View>
      <View style={styles.blockContent}>
        {data.chartData.map(item => (
          <View key={item.name} style={styles.barContainer}>
            <Text style={styles.barLabel}>{item.name}</Text>
            <View style={styles.barWrapper}>
              <View style={[styles.barFill, { width: `${Math.max((item.value / maxValue) * 150, 10)}`, backgroundColor: IMPACT_COLORS[item.name] || '#6b7280' }]} />
              <Text style={styles.barValue}>{item.value}</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={styles.blockFooter}>
        <Text style={styles.footerText}>Período: {timeframe} • Total: {data.total} alertas</Text>
      </View>
    </View>
  );
}

// Alert Distribution Block - uses demo data
function AlertDistributionBlockPDF({ timeframe }: { timeframe: string }) {
  const data = DEMO_ALERT_DISTRIBUTION;

  return (
    <View style={styles.block}>
      <View style={styles.blockHeader}>
        <Text style={styles.blockTitle}>Distribución por Área</Text>
        <Text style={styles.blockTakeaway}>Principales áreas afectadas en el período</Text>
      </View>
      <View style={styles.blockContent}>
        {data.areaData.slice(0, 5).map((area) => (
          <View key={area.name} style={styles.listItem}>
            <View style={styles.listBullet} />
            <Text style={styles.listText}>{area.name}</Text>
            <Text style={styles.listValue}>{area.value}</Text>
          </View>
        ))}
      </View>
      <View style={styles.blockFooter}>
        <Text style={styles.footerText}>Período: {timeframe} • Top áreas</Text>
      </View>
    </View>
  );
}

// Legislative Funnel Block - uses demo data
function LegislativeFunnelBlockPDF({ timeframe }: { timeframe: string }) {
  const data = DEMO_LEGISLATIVE_FUNNEL;
  const total = data.reduce((sum, s) => sum + s.count, 0);

  return (
    <View style={styles.block}>
      <View style={styles.blockHeader}>
        <Text style={styles.blockTitle}>Embudo Legislativo</Text>
        <Text style={styles.blockTakeaway}>{total} proyectos distribuidos por etapa</Text>
      </View>
      <View style={styles.blockContent}>
        {data.map(({ stage, count }) => (
          <View key={stage} style={[styles.funnelStage, { borderLeft: `3 solid ${STAGE_COLORS[stage] || '#6b7280'}` }]}>
            <Text style={styles.funnelLabel}>{stage}</Text>
            <Text style={styles.funnelValue}>{count}</Text>
          </View>
        ))}
      </View>
      <View style={styles.blockFooter}>
        <Text style={styles.footerText}>Período: {timeframe} • Solo proyectos de ley</Text>
      </View>
    </View>
  );
}

// Top Entities Block - uses demo data
function TopEntitiesBlockPDF({ timeframe }: { timeframe: string }) {
  const data = DEMO_TOP_ENTITIES.slice(0, 5);

  return (
    <View style={styles.block}>
      <View style={styles.blockHeader}>
        <Text style={styles.blockTitle}>Principales Entidades</Text>
        <Text style={styles.blockTakeaway}>Top emisores de legislación relevante</Text>
      </View>
      <View style={styles.blockContent}>
        {data.map((entity, index) => (
          <View key={entity.id} style={styles.listItem}>
            <View style={[styles.listBullet, { backgroundColor: index === 0 ? '#f59e0b' : '#3b82f6' }]} />
            <Text style={styles.listText}>{entity.label}</Text>
            <Text style={styles.listValue}>{entity.value}</Text>
          </View>
        ))}
      </View>
      <View style={styles.blockFooter}>
        <Text style={styles.footerText}>Período: {timeframe} • Top 5 entidades</Text>
      </View>
    </View>
  );
}

// Popular Topics Block - uses demo data
function PopularTopicsBlockPDF({ timeframe }: { timeframe: string }) {
  const data = DEMO_POPULAR_TOPICS.slice(0, 5);

  return (
    <View style={styles.block}>
      <View style={styles.blockHeader}>
        <Text style={styles.blockTitle}>Temas Populares</Text>
        <Text style={styles.blockTakeaway}>Áreas con mayor actividad regulatoria</Text>
      </View>
      <View style={styles.blockContent}>
        {data.map((topic) => (
          <View key={topic.id} style={styles.listItem}>
            <View style={[styles.listBullet, { backgroundColor: '#8b5cf6' }]} />
            <Text style={styles.listText}>{topic.label}</Text>
            <Text style={styles.listValue}>{topic.value}</Text>
          </View>
        ))}
      </View>
      <View style={styles.blockFooter}>
        <Text style={styles.footerText}>Período: {timeframe} • Top 5 temas</Text>
      </View>
    </View>
  );
}

// Service KPIs Block - uses demo data
function ServiceKPIsBlockPDF({ timeframe }: { timeframe: string }) {
  const data = DEMO_SERVICE_KPIS;

  return (
    <View style={styles.block}>
      <View style={styles.blockHeader}>
        <Text style={styles.blockTitle}>Indicadores de Servicio</Text>
        <Text style={styles.blockTakeaway}>Resumen de cobertura y valor entregado</Text>
      </View>
      <View style={styles.blockContent}>
        <View style={styles.kpiRow}>
          {data.map((kpi) => (
            <View key={kpi.label} style={styles.kpiCard}>
              <Text style={styles.kpiValue}>{String(kpi.value)}</Text>
              <Text style={styles.kpiLabel}>{kpi.label}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.blockFooter}>
        <Text style={styles.footerText}>Período: {timeframe} • Métricas de servicio</Text>
      </View>
    </View>
  );
}

// Key Movements Block - uses demo data
function KeyMovementsBlockPDF({ timeframe }: { timeframe: string }) {
  const data = DEMO_KEY_MOVEMENTS;
  const typeColors: Record<string, string> = {
    new: '#3b82f6',
    progress: '#22c55e',
    deadline: '#f59e0b',
  };
  const typeLabels: Record<string, string> = {
    new: 'Nuevo',
    progress: 'Avance',
    deadline: 'Plazo',
  };

  return (
    <View style={styles.block}>
      <View style={styles.blockHeader}>
        <Text style={styles.blockTitle}>Movimientos Clave</Text>
        <Text style={styles.blockTakeaway}>
          {data.newItems} nuevos, {data.stageChanges} avances, {data.upcomingDeadlines} plazos próximos
        </Text>
      </View>
      <View style={styles.blockContent}>
        {data.items.slice(0, 5).map((item) => (
          <View key={item.id} style={[styles.timelineItem, { borderLeft: `2 solid ${typeColors[item.type] || '#e2e8f0'}` }]}>
            <Text style={styles.timelineDate}>{item.date.slice(5)}</Text>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>[{typeLabels[item.type]}] {item.title}</Text>
              <Text style={styles.timelineDetail}>{item.detail}</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={styles.blockFooter}>
        <Text style={styles.footerText}>Período: {timeframe}</Text>
      </View>
    </View>
  );
}

// Emerging Topics Block - uses demo data
function EmergingTopicsBlockPDF({ timeframe }: { timeframe: string }) {
  const data = DEMO_EMERGING_TOPICS;

  return (
    <View style={styles.block}>
      <View style={styles.blockHeader}>
        <Text style={styles.blockTitle}>Temas Emergentes</Text>
        <Text style={styles.blockTakeaway}>
          {data.filter(t => t.change?.direction === 'up').length} temas en crecimiento
        </Text>
      </View>
      <View style={styles.blockContent}>
        {data.map((topic) => (
          <View key={topic.id} style={styles.listItem}>
            <View style={[styles.listBullet, { backgroundColor: topic.change?.direction === 'up' ? '#22c55e' : '#6b7280' }]} />
            <Text style={styles.listText}>{topic.label} ({topic.value} alertas)</Text>
            <Text style={[styles.listValue, { color: topic.change?.direction === 'up' ? '#22c55e' : '#6b7280' }]}>
              {topic.change?.direction === 'up' ? '+' : ''}{Math.round(topic.change?.change || 0)}%
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.blockFooter}>
        <Text style={styles.footerText}>Período: {timeframe} • vs período anterior</Text>
      </View>
    </View>
  );
}

// Exposure Block - uses demo data
function ExposureBlockPDF({ timeframe }: { timeframe: string }) {
  const data = DEMO_EXPOSURE;
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <View style={styles.block}>
      <View style={styles.blockHeader}>
        <Text style={styles.blockTitle}>Exposición por Área de Negocio</Text>
        <Text style={styles.blockTakeaway}>Áreas del negocio más impactadas por regulación</Text>
      </View>
      <View style={styles.blockContent}>
        {data.map(item => (
          <View key={item.id} style={styles.barContainer}>
            <Text style={styles.barLabel}>{item.label}</Text>
            <View style={styles.barWrapper}>
              <View style={[styles.barFill, { width: `${Math.max((item.value / maxValue) * 150, 10)}`, backgroundColor: '#6366f1' }]} />
              <Text style={styles.barValue}>{item.value}</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={styles.blockFooter}>
        <Text style={styles.footerText}>Período: {timeframe} • Alertas por área</Text>
      </View>
    </View>
  );
}

// Editorial Coverage Block - uses demo data
function EditorialCoverageBlockPDF({ timeframe }: { timeframe: string }) {
  const data = DEMO_EDITORIAL_COVERAGE;

  return (
    <View style={styles.block}>
      <View style={styles.blockHeader}>
        <Text style={styles.blockTitle}>Cobertura Editorial</Text>
        <Text style={styles.blockTakeaway}>
          {data.coverageRate}% de cobertura ({data.totalPublished}/{data.totalCaptured} alertas)
        </Text>
      </View>
      <View style={styles.blockContent}>
        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{data.totalCaptured}</Text>
            <Text style={styles.kpiLabel}>Capturadas</Text>
          </View>
          <View style={[styles.kpiCard, { borderTop: '3 solid #22c55e' }]}>
            <Text style={styles.kpiValue}>{data.totalPublished}</Text>
            <Text style={styles.kpiLabel}>Publicadas</Text>
          </View>
          <View style={[styles.kpiCard, { borderTop: '3 solid #3b82f6' }]}>
            <Text style={styles.kpiValue}>{data.coverageRate}%</Text>
            <Text style={styles.kpiLabel}>Cobertura</Text>
          </View>
        </View>
      </View>
      <View style={styles.blockFooter}>
        <Text style={styles.footerText}>Período: {timeframe} • Métrica interna</Text>
      </View>
    </View>
  );
}

// Editorial Response Time Block - uses demo data
function EditorialResponseTimeBlockPDF({ timeframe }: { timeframe: string }) {
  const data = DEMO_EDITORIAL_RESPONSE_TIME;

  return (
    <View style={styles.block}>
      <View style={styles.blockHeader}>
        <Text style={styles.blockTitle}>Tiempo de Respuesta Editorial</Text>
        <Text style={styles.blockTakeaway}>
          Promedio {data.avgHours}h, mediana {data.medianHours}h entre captura y publicación
        </Text>
      </View>
      <View style={styles.blockContent}>
        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{data.avgHours}h</Text>
            <Text style={styles.kpiLabel}>Promedio</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{data.medianHours}h</Text>
            <Text style={styles.kpiLabel}>Mediana</Text>
          </View>
        </View>
      </View>
      <View style={styles.blockFooter}>
        <Text style={styles.footerText}>Período: {timeframe} • Métrica interna</Text>
      </View>
    </View>
  );
}

// Operational Queue Block - uses demo data
function OperationalQueueBlockPDF({ timeframe }: { timeframe: string }) {
  const data = DEMO_OPERATIONAL_QUEUE;

  return (
    <View style={styles.block}>
      <View style={styles.blockHeader}>
        <Text style={styles.blockTitle}>Cola Operativa</Text>
        <Text style={styles.blockTakeaway}>
          {data.totalInQueue} items en cola ({data.pendingReview} por revisar, {data.pendingPublish} por publicar)
        </Text>
      </View>
      <View style={styles.blockContent}>
        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{data.totalInQueue}</Text>
            <Text style={styles.kpiLabel}>En Cola</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{data.pendingReview}</Text>
            <Text style={styles.kpiLabel}>Por Revisar</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{data.pendingPublish}</Text>
            <Text style={styles.kpiLabel}>Por Publicar</Text>
          </View>
        </View>
      </View>
      <View style={styles.blockFooter}>
        <Text style={styles.footerText}>Período: {timeframe} • Métrica interna</Text>
      </View>
    </View>
  );
}

// Aggregated Entity Monitoring Block - uses demo data
function AggregatedEntityMonitoringBlockPDF({ timeframe }: { timeframe: string }) {
  const data = DEMO_AGGREGATED_ENTITIES.slice(0, 7);

  return (
    <View style={styles.block}>
      <View style={styles.blockHeader}>
        <Text style={styles.blockTitle}>Monitoreo de Entidades Agregado</Text>
        <Text style={styles.blockTakeaway}>Entidades y partidos más activos</Text>
      </View>
      <View style={styles.blockContent}>
        {data.map((entity, index) => (
          <View key={entity.id} style={styles.listItem}>
            <View style={[styles.listBullet, { backgroundColor: index < 3 ? '#f59e0b' : '#3b82f6' }]} />
            <Text style={styles.listText}>{entity.label}</Text>
            <Text style={styles.listValue}>{entity.value}</Text>
          </View>
        ))}
      </View>
      <View style={styles.blockFooter}>
        <Text style={styles.footerText}>Período: {timeframe} • Top 7 entidades</Text>
      </View>
    </View>
  );
}

// Industry Benchmark Block - uses demo data
function IndustryBenchmarkBlockPDF({ timeframe }: { timeframe: string }) {
  const data = DEMO_INDUSTRY_BENCHMARK;

  return (
    <View style={styles.block}>
      <View style={styles.blockHeader}>
        <Text style={styles.blockTitle}>Promedio de la Industria</Text>
        <Text style={styles.blockTakeaway}>
          Cliente {data.clientAboveAverage ? 'por encima' : 'por debajo'} del promedio del sector
        </Text>
      </View>
      <View style={styles.blockContent}>
        {data.chartData.map((item) => (
          <View key={item.metric} style={{ marginBottom: 6 }}>
            <Text style={styles.barLabel}>{item.metric}</Text>
            <View style={{ flexDirection: 'row', gap: 4, marginTop: 2 }}>
              <View style={[styles.kpiCard, { borderTop: '2 solid #3b82f6', flex: 1 }]}>
                <Text style={[styles.kpiValue, { fontSize: 10 }]}>{item.client}</Text>
                <Text style={styles.kpiLabel}>Cliente</Text>
              </View>
              <View style={[styles.kpiCard, { borderTop: '2 solid #94a3b8', flex: 1 }]}>
                <Text style={[styles.kpiValue, { fontSize: 10 }]}>{item.cohort}</Text>
                <Text style={styles.kpiLabel}>Sector</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
      <View style={styles.blockFooter}>
        <Text style={styles.footerText}>Período: {timeframe} • Cohorte: {data.cohortSize} empresas (anonimizado)</Text>
      </View>
    </View>
  );
}

// Main component that renders the appropriate block
export function AnalyticsBlockPDF({ blockKey, title, takeaway, alerts, timeframe }: AnalyticsBlockPDFProps) {
  switch (blockKey) {
    case 'impact_matrix':
      return <ImpactMatrixBlockPDF timeframe={timeframe} />;
    case 'regulatory_pulse':
      return <RegulatoryPulseBlockPDF timeframe={timeframe} />;
    case 'alert_priority':
      return <AlertPriorityBlockPDF timeframe={timeframe} />;
    case 'alert_distribution':
      return <AlertDistributionBlockPDF timeframe={timeframe} />;
    case 'legislative_funnel':
      return <LegislativeFunnelBlockPDF timeframe={timeframe} />;
    case 'top_entities':
      return <TopEntitiesBlockPDF timeframe={timeframe} />;
    case 'popular_topics':
      return <PopularTopicsBlockPDF timeframe={timeframe} />;
    case 'service_kpis':
      return <ServiceKPIsBlockPDF timeframe={timeframe} />;
    case 'key_movements':
      return <KeyMovementsBlockPDF timeframe={timeframe} />;
    case 'emerging_topics':
      return <EmergingTopicsBlockPDF timeframe={timeframe} />;
    case 'exposure':
      return <ExposureBlockPDF timeframe={timeframe} />;
    case 'editorial_coverage':
      return <EditorialCoverageBlockPDF timeframe={timeframe} />;
    case 'editorial_response_time':
      return <EditorialResponseTimeBlockPDF timeframe={timeframe} />;
    case 'operational_queue':
      return <OperationalQueueBlockPDF timeframe={timeframe} />;
    case 'aggregated_entity_monitoring':
      return <AggregatedEntityMonitoringBlockPDF timeframe={timeframe} />;
    case 'industry_benchmark':
      return <IndustryBenchmarkBlockPDF timeframe={timeframe} />;
    default:
      return (
        <View style={styles.block}>
          <View style={styles.blockHeader}>
            <Text style={styles.blockTitle}>{title}</Text>
            <Text style={styles.blockTakeaway}>{takeaway}</Text>
          </View>
          <View style={styles.blockContent}>
            <Text style={{ fontSize: 9, color: '#64748b' }}>
              Bloque de analíticas: {blockKey}
            </Text>
          </View>
          <View style={styles.blockFooter}>
            <Text style={styles.footerText}>Período: {timeframe}</Text>
          </View>
        </View>
      );
  }
}
