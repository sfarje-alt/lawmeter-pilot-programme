import { View, Text, StyleSheet } from "@react-pdf/renderer";
import type { PeruAlert } from "@/data/peruAlertsMockData";
import type { AnalyticsBlockConfig } from "@/types/analytics";
import { CLIENT_ANALYTICS_BLOCKS } from "@/types/analytics";
import { AnalyticsBlockPDF } from "./AnalyticsBlockPDF";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    marginBottom: 20,
    paddingBottom: 12,
    borderBottom: '1 solid #e2e8f0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: '#64748b',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  blockWrapper: {
    width: '48%',
    marginBottom: 8,
  },
  blockWrapperFull: {
    width: '100%',
    marginBottom: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTop: '1 solid #e2e8f0',
    paddingTop: 8,
  },
  footerText: {
    fontSize: 7,
    color: '#94a3b8',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 4,
  },
  emptyText: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
  },
});

interface AnalyticsPagePDFProps {
  alerts: PeruAlert[];
  clientName: string;
  timeframe: string;
  generatedAt: string;
  analyticsBlocks?: AnalyticsBlockConfig[];
}

// Blocks that should span full width
const FULL_WIDTH_BLOCKS = ['impact_matrix', 'regulatory_pulse'];

export function AnalyticsPagePDF({ 
  alerts, 
  clientName, 
  timeframe, 
  generatedAt,
  analyticsBlocks,
}: AnalyticsPagePDFProps) {
  // Get enabled blocks, sorted by order
  // Use full definitions from CLIENT_ANALYTICS_BLOCKS if available
  const blocksToUse = analyticsBlocks 
    ? analyticsBlocks.map(b => {
        const def = CLIENT_ANALYTICS_BLOCKS.find(d => d.key === b.key);
        return def ? { ...def, enabled: b.enabled, order: b.order } : null;
      }).filter(Boolean)
    : CLIENT_ANALYTICS_BLOCKS;
  
  const enabledBlocks = blocksToUse
    .filter(block => block && block.enabled && block.renderPDF)
    .sort((a, b) => (a?.order || 0) - (b?.order || 0))
    .slice(0, 5); // Max 5 blocks per page

  // If no blocks enabled, show empty state
  if (enabledBlocks.length === 0) {
    return (
      <View style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Analíticas del Período</Text>
          <Text style={styles.subtitle}>{clientName} • {timeframe}</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            No hay analíticas configuradas para este reporte.
          </Text>
        </View>
      </View>
    );
  }

  // Analytics now use demo data, so we render regardless of alerts count

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Analíticas del Período</Text>
        <Text style={styles.subtitle}>
          {clientName} • {timeframe} • {alerts.length} alertas publicadas
        </Text>
      </View>

      {/* Analytics Grid */}
      <View style={styles.grid}>
        {enabledBlocks.map((block) => {
          // Get full block definition
          const blockDef = CLIENT_ANALYTICS_BLOCKS.find(b => b.key === block.key);
          const isFullWidth = FULL_WIDTH_BLOCKS.includes(block.key);
          
          return (
            <View 
              key={block.key} 
              style={isFullWidth ? styles.blockWrapperFull : styles.blockWrapper}
            >
              <AnalyticsBlockPDF
                blockKey={block.key}
                title={blockDef?.title || block.key}
                takeaway={blockDef?.takeaway || ''}
                alerts={alerts}
                timeframe={timeframe}
              />
            </View>
          );
        })}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Datos hasta: {generatedAt}
        </Text>
        <Text style={styles.footerText}>
          Fuente: Alertas publicadas al cliente
        </Text>
      </View>
    </View>
  );
}
