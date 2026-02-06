import { useMemo } from "react";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportConfig, DATE_MODE_OPTIONS } from "./types";
import { ALL_MOCK_ALERTS, MOCK_CLIENTS, PeruAlert } from "@/data/peruAlertsMockData";
import { CLIENT_ANALYTICS_BLOCKS } from "@/types/analytics";
import { AnalyticsPagePDF } from "./pdf/AnalyticsPagePDF";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ReportPDFGeneratorProps {
  config: ReportConfig;
  onBack: () => void;
}

// PDF Styles
const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10 },
  header: { marginBottom: 30, borderBottom: '2 solid #1a365d', paddingBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1a365d', marginBottom: 5 },
  subtitle: { fontSize: 12, color: '#4a5568', marginBottom: 3 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#1a365d', marginBottom: 10, backgroundColor: '#edf2f7', padding: 8 },
  stageHeader: { fontSize: 11, fontWeight: 'bold', color: '#2d3748', marginBottom: 8, marginTop: 12, borderLeft: '3 solid #3182ce', paddingLeft: 8 },
  alertCard: { marginBottom: 12, padding: 10, backgroundColor: '#f7fafc', borderRadius: 4 },
  alertTitle: { fontSize: 10, fontWeight: 'bold', color: '#2d3748', marginBottom: 4 },
  alertMeta: { fontSize: 8, color: '#718096', marginBottom: 6 },
  commentary: { fontSize: 9, color: '#4a5568', marginTop: 6, padding: 8, backgroundColor: '#ebf8ff', borderRadius: 3 },
  commentaryLabel: { fontSize: 8, fontWeight: 'bold', color: '#2b6cb0', marginBottom: 3 },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', fontSize: 8, color: '#a0aec0' },
  summary: { backgroundColor: '#edf2f7', padding: 15, marginBottom: 20, borderRadius: 4 },
  summaryItem: { fontSize: 10, marginBottom: 5 },
  sourceLink: { fontSize: 8, color: '#2b6cb0', textDecoration: 'underline', marginTop: 4 },
});

// PDF Document Component
const ReportPDF = ({ config, alerts, clientName }: { config: ReportConfig; alerts: PeruAlert[]; clientName: string }) => {
  const bills = alerts.filter(a => a.legislation_type === 'proyecto_de_ley');
  const norms = alerts.filter(a => a.legislation_type === 'norma');
  
  // Group bills by stage
  const billsByStage = bills.reduce((acc, bill) => {
    const stage = bill.current_stage || 'SIN ESTADO';
    if (!acc[stage]) acc[stage] = [];
    acc[stage].push(bill);
    return acc;
  }, {} as Record<string, PeruAlert[]>);

  // Group norms by entity
  const normsByEntity = norms.reduce((acc, norm) => {
    const entity = norm.entity || 'OTROS';
    if (!acc[entity]) acc[entity] = [];
    acc[entity].push(norm);
    return acc;
  }, {} as Record<string, PeruAlert[]>);

  const dateLabel = DATE_MODE_OPTIONS.find(d => d.value === config.dateMode)?.label || config.dateMode;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>REPORTE LEGISLATIVO</Text>
          <Text style={styles.subtitle}>{clientName}</Text>
          <Text style={styles.subtitle}>{format(new Date(), "d 'de' MMMM yyyy", { locale: es })}</Text>
          <Text style={styles.subtitle}>Período: {dateLabel}</Text>
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 8 }}>RESUMEN EJECUTIVO</Text>
          <Text style={styles.summaryItem}>• {bills.length} Proyectos de Ley relevantes</Text>
          <Text style={styles.summaryItem}>• {norms.length} Normas publicadas</Text>
          <Text style={styles.summaryItem}>• {Object.keys(billsByStage).length} estados procesales distintos</Text>
        </View>

        {/* Bills Section */}
        {bills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROYECTOS DE LEY</Text>
            {Object.entries(billsByStage).map(([stage, stageBills]) => (
              <View key={stage}>
                <Text style={styles.stageHeader}>{stage} ({stageBills.length})</Text>
                {stageBills.map(bill => (
                  <View key={bill.id} style={styles.alertCard}>
                    <Text style={styles.alertTitle}>{bill.legislation_id}</Text>
                    <Text style={{ fontSize: 9, marginBottom: 4 }}>{bill.legislation_title}</Text>
                    <Text style={styles.alertMeta}>
                      Autor: {bill.author || 'N/A'} | Grupo: {bill.parliamentary_group || 'N/A'} | Fecha: {bill.stage_date || bill.project_date || 'N/A'}
                    </Text>
                    {bill.source_url && (
                      <Link src={bill.source_url} style={styles.sourceLink}>
                        Fuente Oficial
                      </Link>
                    )}
                    {config.includeExpertCommentary && bill.expert_commentary && (
                      <View style={styles.commentary}>
                        <Text style={styles.commentaryLabel}>COMENTARIO EXPERTO:</Text>
                        <Text>{bill.expert_commentary}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Norms Section */}
        {norms.length > 0 && (
          <View style={styles.section} break={bills.length > 3}>
            <Text style={styles.sectionTitle}>NORMAS PUBLICADAS</Text>
            {Object.entries(normsByEntity).map(([entity, entityNorms]) => (
              <View key={entity}>
                <Text style={styles.stageHeader}>{entity} ({entityNorms.length})</Text>
                {entityNorms.map(norm => (
                  <View key={norm.id} style={styles.alertCard}>
                    <Text style={styles.alertTitle}>{norm.legislation_title}</Text>
                    <Text style={styles.alertMeta}>
                      Publicación: {norm.publication_date || 'N/A'}
                    </Text>
                    {norm.legislation_summary && (
                      <Text style={{ fontSize: 9, marginTop: 4 }}>{norm.legislation_summary}</Text>
                    )}
                    {norm.source_url && (
                      <Link src={norm.source_url} style={styles.sourceLink}>
                        Fuente Oficial
                      </Link>
                    )}
                    {config.includeExpertCommentary && norm.expert_commentary && (
                      <View style={styles.commentary}>
                        <Text style={styles.commentaryLabel}>COMENTARIO EXPERTO:</Text>
                        <Text>{norm.expert_commentary}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          Generado por LawMeter • {format(new Date(), "dd/MM/yyyy HH:mm")} • Confidencial
        </Text>
      </Page>
    </Document>
  );
};

export function ReportPDFGenerator({ config, onBack }: ReportPDFGeneratorProps) {
  const filteredAlerts = useMemo(() => {
    return ALL_MOCK_ALERTS.filter(alert => {
      if (config.legislationStage === 'only_bills' && alert.legislation_type !== 'proyecto_de_ley') return false;
      if (config.legislationStage === 'only_enacted' && alert.legislation_type !== 'norma') return false;
      if (alert.legislation_type === 'proyecto_de_ley' && config.billsStatuses.length > 0) {
        if (!config.billsStatuses.includes(alert.current_stage || '')) return false;
      }
      return true;
    });
  }, [config]);

  const clientNames = config.clientIds.map(id => MOCK_CLIENTS.find(c => c.id === id)?.name || 'Cliente').join(', ');
  const bills = filteredAlerts.filter(a => a.legislation_type === 'proyecto_de_ley');
  const norms = filteredAlerts.filter(a => a.legislation_type === 'norma');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reporte Generado</h1>
          <p className="text-muted-foreground">Descargue o envíe el reporte</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-foreground">{bills.length}</div>
            <div className="text-sm text-muted-foreground">Proyectos de Ley</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-foreground">{norms.length}</div>
            <div className="text-sm text-muted-foreground">Normas</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-foreground">{config.clientIds.length}</div>
            <div className="text-sm text-muted-foreground">Clientes</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Descargar Reporte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PDFDownloadLink
            document={<ReportPDF config={config} alerts={filteredAlerts} clientName={clientNames} />}
            fileName={`reporte-legislativo-${format(new Date(), 'yyyy-MM-dd')}.pdf`}
          >
            {({ loading }) => (
              <Button size="lg" disabled={loading} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                {loading ? 'Generando PDF...' : 'Descargar PDF'}
              </Button>
            )}
          </PDFDownloadLink>
        </CardContent>
      </Card>
    </div>
  );
}
