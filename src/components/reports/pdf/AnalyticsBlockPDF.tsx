import { View, Text, StyleSheet } from "@react-pdf/renderer";
import type { PeruAlert } from "@/data/peruAlertsMockData";

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
  // Impact Matrix specific
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
  // Bar chart simulation
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
  // Funnel simulation
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
  // KPI cards
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
  // List items
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
  // Footer
  blockFooter: {
    marginTop: 8,
    paddingTop: 6,
    borderTop: '1 solid #e2e8f0',
  },
  footerText: {
    fontSize: 7,
    color: '#94a3b8',
  },
});

// Color map for impact levels
const IMPACT_COLORS: Record<string, string> = {
  'Grave': '#dc2626',
  'Medio': '#f59e0b',
  'Leve': '#6b7280',
  'Positivo': '#22c55e',
};

// Color map for stages
const STAGE_COLORS: Record<string, string> = {
  'COMISIÓN': '#3b82f6',
  'PLENO': '#8b5cf6',
  'TRÁMITE FINAL': '#f59e0b',
  'PUBLICADO': '#22c55e',
  'ARCHIVADO': '#6b7280',
};

interface AnalyticsBlockPDFProps {
  blockKey: string;
  title: string;
  takeaway: string;
  alerts: PeruAlert[];
  timeframe: string;
}

// Impact Matrix Block
function ImpactMatrixBlockPDF({ alerts, timeframe }: { alerts: PeruAlert[]; timeframe: string }) {
  const impactCounts = alerts.reduce((acc, alert) => {
    const impact = alert.impact_level || 'leve';
    const label = impact.charAt(0).toUpperCase() + impact.slice(1);
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = alerts.length;

  return (
    <View style={styles.block}>
      <View style={styles.blockHeader}>
        <Text style={styles.blockTitle}>Matriz de Impacto</Text>
        <Text style={styles.blockTakeaway}>
          Distribución de {total} alertas por nivel de impacto
        </Text>
      </View>
      <View style={styles.blockContent}>
        <View style={styles.matrixGrid}>
          {['Grave', 'Medio', 'Leve', 'Positivo'].map(level => (
            <View key={level} style={[styles.matrixCell, { borderLeft: `3 solid ${IMPACT_COLORS[level]}` }]}>
              <Text style={styles.matrixCellLabel}>{level}</Text>
              <Text style={styles.matrixCellValue}>{impactCounts[level] || 0}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.blockFooter}>
        <Text style={styles.footerText}>Período: {timeframe} • Fuente: Alertas publicadas</Text>
      </View>
    </View>
  );
}

// Regulatory Pulse Block
function RegulatoryPulseBlockPDF({ alerts, timeframe }: { alerts: PeruAlert[]; timeframe: string }) {
  const bills = alerts.filter(a => a.legislation_type === 'proyecto_de_ley').length;
  const norms = alerts.filter(a => a.legislation_type === 'norma').length;
  const total = alerts.length;

  return (
    <View style={styles.block}>
      <View style={styles.blockHeader}>
        <Text style={styles.blockTitle}>Pulso Regulatorio</Text>
        <Text style={styles.blockTakeaway}>
          {total} publicaciones en el período ({bills} PLs, {norms} normas)
        </Text>
      </View>
      <View style={styles.blockContent}>
        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{total}</Text>
            <Text style={styles.kpiLabel}>Total</Text>
          </View>
          <View style={[styles.kpiCard, { borderTop: '3 solid #3b82f6' }]}>
            <Text style={styles.kpiValue}>{bills}</Text>
            <Text style={styles.kpiLabel}>Proyectos de Ley</Text>
          </View>
          <View style={[styles.kpiCard, { borderTop: '3 solid #22c55e' }]}>
            <Text style={styles.kpiValue}>{norms}</Text>
            <Text style={styles.kpiLabel}>Normas</Text>
          </View>
        </View>
      </View>
      <View style={styles.blockFooter}>
        <Text style={styles.footerText}>Período: {timeframe} • Fuente: Alertas publicadas</Text>
      </View>
    </View>
  );
}

// Alert Priority Block
function AlertPriorityBlockPDF({ alerts, timeframe }: { alerts: PeruAlert[]; timeframe: string }) {
  const priorityCounts = alerts.reduce((acc, alert) => {
    const impact = alert.impact_level || 'leve';
    const label = impact.charAt(0).toUpperCase() + impact.slice(1);
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = alerts.length;
  const sortedPriorities = Object.entries(priorityCounts)
    .sort((a, b) => b[1] - a[1]);

  const maxValue = Math.max(...Object.values(priorityCounts), 1);

  return (
    <View style={styles.block}>
      <View style={styles.blockHeader}>
        <Text style={styles.blockTitle}>Prioridad de Alertas</Text>
        <Text style={styles.blockTakeaway}>
          {priorityCounts['Grave'] || 0} alertas de alto impacto requieren atención
        </Text>
      </View>
      <View style={styles.blockContent}>
        {sortedPriorities.map(([priority, count]) => (
          <View key={priority} style={styles.barContainer}>
            <Text style={styles.barLabel}>{priority}</Text>
            <View style={styles.barWrapper}>
              <View style={[
                styles.barFill, 
                { 
                  width: `${Math.max((count / maxValue) * 150, 10)}`, 
                  backgroundColor: IMPACT_COLORS[priority] || '#6b7280' 
                }
              ]} />
              <Text style={styles.barValue}>{count}</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={styles.blockFooter}>
        <Text style={styles.footerText}>Período: {timeframe} • Total: {total} alertas</Text>
      </View>
    </View>
  );
}

// Alert Distribution Block
function AlertDistributionBlockPDF({ alerts, timeframe }: { alerts: PeruAlert[]; timeframe: string }) {
  const areaCounts = alerts.reduce((acc, alert) => {
    (alert.affected_areas || []).forEach(area => {
      acc[area] = (acc[area] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const sortedAreas = Object.entries(areaCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <View style={styles.block}>
      <View style={styles.blockHeader}>
        <Text style={styles.blockTitle}>Distribución por Área</Text>
        <Text style={styles.blockTakeaway}>
          Principales áreas afectadas en el período
        </Text>
      </View>
      <View style={styles.blockContent}>
        {sortedAreas.map(([area, count], index) => (
          <View key={area} style={styles.listItem}>
            <Text style={styles.listBullet}></Text>
            <Text style={styles.listText}>{area}</Text>
            <Text style={styles.listValue}>{count}</Text>
          </View>
        ))}
      </View>
      <View style={styles.blockFooter}>
        <Text style={styles.footerText}>Período: {timeframe} • Top 5 áreas</Text>
      </View>
    </View>
  );
}

// Legislative Funnel Block
function LegislativeFunnelBlockPDF({ alerts, timeframe }: { alerts: PeruAlert[]; timeframe: string }) {
  const bills = alerts.filter(a => a.legislation_type === 'proyecto_de_ley');
  
  const stageCounts = bills.reduce((acc, bill) => {
    const stage = bill.current_stage || 'SIN ESTADO';
    acc[stage] = (acc[stage] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stageOrder = ['COMISIÓN', 'PLENO', 'TRÁMITE FINAL', 'PUBLICADO', 'ARCHIVADO'];
  const sortedStages = stageOrder
    .filter(s => stageCounts[s])
    .map(s => ({ stage: s, count: stageCounts[s] }));

  return (
    <View style={styles.block}>
      <View style={styles.blockHeader}>
        <Text style={styles.blockTitle}>Embudo Legislativo</Text>
        <Text style={styles.blockTakeaway}>
          {bills.length} proyectos distribuidos por etapa
        </Text>
      </View>
      <View style={styles.blockContent}>
        {sortedStages.map(({ stage, count }) => (
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

// Top Entities Block
function TopEntitiesBlockPDF({ alerts, timeframe }: { alerts: PeruAlert[]; timeframe: string }) {
  const entityCounts = alerts.reduce((acc, alert) => {
    const entity = alert.entity || alert.parliamentary_group || 'Otros';
    acc[entity] = (acc[entity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedEntities = Object.entries(entityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <View style={styles.block}>
      <View style={styles.blockHeader}>
        <Text style={styles.blockTitle}>Principales Entidades</Text>
        <Text style={styles.blockTakeaway}>
          Top emisores de legislación relevante
        </Text>
      </View>
      <View style={styles.blockContent}>
        {sortedEntities.map(([entity, count], index) => (
          <View key={entity} style={styles.listItem}>
            <Text style={[styles.listBullet, { backgroundColor: index === 0 ? '#f59e0b' : '#3b82f6' }]}></Text>
            <Text style={styles.listText}>{entity}</Text>
            <Text style={styles.listValue}>{count}</Text>
          </View>
        ))}
      </View>
      <View style={styles.blockFooter}>
        <Text style={styles.footerText}>Período: {timeframe} • Top 5 entidades</Text>
      </View>
    </View>
  );
}

// Popular Topics Block
function PopularTopicsBlockPDF({ alerts, timeframe }: { alerts: PeruAlert[]; timeframe: string }) {
  const topicCounts = alerts.reduce((acc, alert) => {
    (alert.affected_areas || []).forEach(area => {
      acc[area] = (acc[area] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const sortedTopics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <View style={styles.block}>
      <View style={styles.blockHeader}>
        <Text style={styles.blockTitle}>Temas Populares</Text>
        <Text style={styles.blockTakeaway}>
          Áreas con mayor actividad regulatoria
        </Text>
      </View>
      <View style={styles.blockContent}>
        {sortedTopics.map(([topic, count], index) => (
          <View key={topic} style={styles.listItem}>
            <Text style={[styles.listBullet, { backgroundColor: '#8b5cf6' }]}></Text>
            <Text style={styles.listText}>{topic}</Text>
            <Text style={styles.listValue}>{count}</Text>
          </View>
        ))}
      </View>
      <View style={styles.blockFooter}>
        <Text style={styles.footerText}>Período: {timeframe} • Top 5 temas</Text>
      </View>
    </View>
  );
}

// Service KPIs Block
function ServiceKPIsBlockPDF({ alerts, timeframe }: { alerts: PeruAlert[]; timeframe: string }) {
  const total = alerts.length;
  const withCommentary = alerts.filter(a => a.expert_commentary).length;
  const highImpact = alerts.filter(a => a.impact_level === 'grave' || a.impact_level === 'medio').length;

  return (
    <View style={styles.block}>
      <View style={styles.blockHeader}>
        <Text style={styles.blockTitle}>Indicadores de Servicio</Text>
        <Text style={styles.blockTakeaway}>
          Resumen de cobertura y valor entregado
        </Text>
      </View>
      <View style={styles.blockContent}>
        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{total}</Text>
            <Text style={styles.kpiLabel}>Alertas Publicadas</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{withCommentary}</Text>
            <Text style={styles.kpiLabel}>Con Comentario</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{highImpact}</Text>
            <Text style={styles.kpiLabel}>Alto Impacto</Text>
          </View>
        </View>
      </View>
      <View style={styles.blockFooter}>
        <Text style={styles.footerText}>Período: {timeframe} • Métricas de servicio</Text>
      </View>
    </View>
  );
}

// Main component that renders the appropriate block
export function AnalyticsBlockPDF({ blockKey, title, takeaway, alerts, timeframe }: AnalyticsBlockPDFProps) {
  switch (blockKey) {
    case 'impact_matrix':
      return <ImpactMatrixBlockPDF alerts={alerts} timeframe={timeframe} />;
    case 'regulatory_pulse':
      return <RegulatoryPulseBlockPDF alerts={alerts} timeframe={timeframe} />;
    case 'alert_priority':
      return <AlertPriorityBlockPDF alerts={alerts} timeframe={timeframe} />;
    case 'alert_distribution':
      return <AlertDistributionBlockPDF alerts={alerts} timeframe={timeframe} />;
    case 'legislative_funnel':
      return <LegislativeFunnelBlockPDF alerts={alerts} timeframe={timeframe} />;
    case 'top_entities':
      return <TopEntitiesBlockPDF alerts={alerts} timeframe={timeframe} />;
    case 'popular_topics':
      return <PopularTopicsBlockPDF alerts={alerts} timeframe={timeframe} />;
    case 'service_kpis':
      return <ServiceKPIsBlockPDF alerts={alerts} timeframe={timeframe} />;
    default:
      // Generic fallback block
      return (
        <View style={styles.block}>
          <View style={styles.blockHeader}>
            <Text style={styles.blockTitle}>{title}</Text>
            <Text style={styles.blockTakeaway}>{takeaway}</Text>
          </View>
          <View style={styles.blockContent}>
            <Text style={{ fontSize: 9, color: '#64748b' }}>
              {alerts.length} alertas en el período
            </Text>
          </View>
          <View style={styles.blockFooter}>
            <Text style={styles.footerText}>Período: {timeframe}</Text>
          </View>
        </View>
      );
  }
}
