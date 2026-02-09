import { View, Text, StyleSheet, Page } from "@react-pdf/renderer";
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
  headerCompact: {
    marginBottom: 16,
    paddingBottom: 8,
    borderBottom: '1 solid #e2e8f0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  titleCompact: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 2,
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

const FULL_WIDTH_BLOCKS = ['impact_matrix', 'regulatory_pulse'];
const BLOCKS_PER_PAGE = 4;

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export function AnalyticsPagePDF({ 
  alerts, 
  clientName, 
  timeframe, 
  generatedAt,
  analyticsBlocks,
}: AnalyticsPagePDFProps) {
  const blocksToUse = analyticsBlocks 
    ? analyticsBlocks.map(b => {
        const def = CLIENT_ANALYTICS_BLOCKS.find(d => d.key === b.key);
        return def ? { ...def, enabled: b.enabled, order: b.order } : null;
      }).filter(Boolean)
    : CLIENT_ANALYTICS_BLOCKS;
  
  const enabledBlocks = blocksToUse
    .filter(block => block && block.enabled && block.renderPDF)
    .sort((a, b) => (a?.order || 0) - (b?.order || 0))
    .slice(0, 16);

  if (enabledBlocks.length === 0) {
    return (
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Analíticas del Período</Text>
          <Text style={styles.subtitle}>{clientName} • {timeframe}</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            No hay analíticas configuradas para este reporte.
          </Text>
        </View>
      </Page>
    );
  }

  const chunks = chunkArray(enabledBlocks, BLOCKS_PER_PAGE);

  return (
    <>
      {chunks.map((chunk, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          {/* Header */}
          {pageIndex === 0 ? (
            <View style={styles.header}>
              <Text style={styles.title}>Analíticas del Período</Text>
              <Text style={styles.subtitle}>
                {clientName} • {timeframe} • {alerts.length} alertas publicadas
              </Text>
            </View>
          ) : (
            <View style={styles.headerCompact}>
              <Text style={styles.titleCompact}>Analíticas (cont.)</Text>
              <Text style={styles.subtitle}>{clientName} • {timeframe}</Text>
            </View>
          )}

          {/* Blocks Grid */}
          <View style={styles.grid}>
            {chunk.map((block) => {
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

          {/* Footer on last page */}
          {pageIndex === chunks.length - 1 && (
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Datos hasta: {generatedAt}
              </Text>
              <Text style={styles.footerText}>
                Fuente: Alertas publicadas al cliente
              </Text>
            </View>
          )}
        </Page>
      ))}
    </>
  );
}
