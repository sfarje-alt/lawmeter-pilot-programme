import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer";
import { ALL_MOCK_ALERTS, MOCK_CLIENTS, PeruAlert } from "@/data/peruAlertsMockData";
import { CLIENT_ANALYTICS_BLOCKS } from "@/types/analytics";
import { AnalyticsPagePDF } from "./pdf/AnalyticsPagePDF";
import { DATE_MODE_OPTIONS } from "./types";
import { 
  FileDown, 
  Building2, 
  Calendar,
  FileText,
  Scale,
  Download,
  Loader2,
  BarChart3,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// PDF Styles (same as ReportPDFGenerator)
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
const ManualReportPDF = ({ alerts, clientName, dateLabel, includeAnalytics }: { alerts: PeruAlert[]; clientName: string; dateLabel: string; includeAnalytics: boolean }) => {
  const bills = alerts.filter(a => a.legislation_type === 'proyecto_de_ley');
  const norms = alerts.filter(a => a.legislation_type === 'norma');
  
  const billsByStage = bills.reduce((acc, bill) => {
    const stage = bill.current_stage || 'SIN ESTADO';
    if (!acc[stage]) acc[stage] = [];
    acc[stage].push(bill);
    return acc;
  }, {} as Record<string, PeruAlert[]>);

  const normsByEntity = norms.reduce((acc, norm) => {
    const entity = norm.entity || 'OTROS';
    if (!acc[entity]) acc[entity] = [];
    acc[entity].push(norm);
    return acc;
  }, {} as Record<string, PeruAlert[]>);

  const generatedAt = format(new Date(), "d 'de' MMMM yyyy, HH:mm", { locale: es });
  const analyticsBlocks = CLIENT_ANALYTICS_BLOCKS.map((block, index) => ({
    key: block.key,
    enabled: block.renderPDF,
    order: index,
  }));

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>REPORTE LEGISLATIVO</Text>
          <Text style={styles.subtitle}>{clientName}</Text>
          <Text style={styles.subtitle}>{format(new Date(), "d 'de' MMMM yyyy", { locale: es })}</Text>
          <Text style={styles.subtitle}>Período: {dateLabel}</Text>
        </View>

        <View style={styles.summary}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 8 }}>RESUMEN EJECUTIVO</Text>
          <Text style={styles.summaryItem}>• {bills.length} Proyectos de Ley relevantes</Text>
          <Text style={styles.summaryItem}>• {norms.length} Normas publicadas</Text>
          {includeAnalytics && (
            <Text style={styles.summaryItem}>• Incluye página de analíticas</Text>
          )}
        </View>

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
                      Autor: {bill.author || 'N/A'} | Grupo: {bill.parliamentary_group || 'N/A'}
                    </Text>
                    {bill.source_url && (
                      <Link src={bill.source_url} style={styles.sourceLink}>
                        Fuente Oficial
                      </Link>
                    )}
                    {bill.expert_commentary && (
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

        {norms.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>NORMAS PUBLICADAS</Text>
            {Object.entries(normsByEntity).map(([entity, entityNorms]) => (
              <View key={entity}>
                <Text style={styles.stageHeader}>{entity} ({entityNorms.length})</Text>
                {entityNorms.map(norm => (
                  <View key={norm.id} style={styles.alertCard}>
                    <Text style={styles.alertTitle}>{norm.legislation_title}</Text>
                    <Text style={styles.alertMeta}>Publicación: {norm.publication_date || 'N/A'}</Text>
                    {norm.source_url && (
                      <Link src={norm.source_url} style={styles.sourceLink}>
                        Fuente Oficial
                      </Link>
                    )}
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        <Text style={styles.footer}>
          Generado por LawMeter • {format(new Date(), "dd/MM/yyyy HH:mm")} • Confidencial
        </Text>
      </Page>

      {/* Analytics Pages (self-paginating) */}
      {includeAnalytics && (
        <AnalyticsPagePDF
          alerts={alerts}
          clientName={clientName}
          timeframe={dateLabel}
          generatedAt={generatedAt}
          analyticsBlocks={analyticsBlocks}
        />
      )}
    </Document>
  );
};

export function ReportManualGeneration() {
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
  const [dateMode, setDateMode] = useState('last_7');
  const [includeBills, setIncludeBills] = useState(true);
  const [includeNorms, setIncludeNorms] = useState(true);
  const [includeAnalytics, setIncludeAnalytics] = useState(true);

  const toggleClient = (clientId: string) => {
    setSelectedClientIds(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const filteredAlerts = useMemo(() => {
    return ALL_MOCK_ALERTS.filter(alert => {
      if (!includeBills && alert.legislation_type === 'proyecto_de_ley') return false;
      if (!includeNorms && alert.legislation_type === 'norma') return false;
      return true;
    });
  }, [includeBills, includeNorms]);

  const bills = filteredAlerts.filter(a => a.legislation_type === 'proyecto_de_ley');
  const norms = filteredAlerts.filter(a => a.legislation_type === 'norma');
  const dateLabel = DATE_MODE_OPTIONS.find(d => d.value === dateMode)?.label || dateMode;
  const clientNames = selectedClientIds.map(id => MOCK_CLIENTS.find(c => c.id === id)?.name || '').join(', ');

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5" />
            Generar Reporte Manual
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Client Selection */}
          <div className="space-y-3">
            <Label className="font-medium">Seleccionar Clientes</Label>
            <div className="grid grid-cols-2 gap-3">
              {MOCK_CLIENTS.map(client => (
                <Label
                  key={client.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border/50 cursor-pointer hover:bg-muted/50"
                >
                  <Checkbox
                    checked={selectedClientIds.includes(client.id)}
                    onCheckedChange={() => toggleClient(client.id)}
                  />
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{client.name}</span>
                </Label>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-3">
            <Label className="font-medium">Período</Label>
            <Select value={dateMode} onValueChange={setDateMode}>
              <SelectTrigger className="w-[250px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DATE_MODE_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content Options */}
          <div className="space-y-3">
            <Label className="font-medium">Contenido a Incluir</Label>
            <div className="flex flex-wrap gap-4">
              <Label className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={includeBills} onCheckedChange={(c) => setIncludeBills(!!c)} />
                <FileText className="h-4 w-4 text-muted-foreground" />
                Proyectos de Ley
              </Label>
              <Label className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={includeNorms} onCheckedChange={(c) => setIncludeNorms(!!c)} />
                <Scale className="h-4 w-4 text-muted-foreground" />
                Normas
              </Label>
              <Label className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={includeAnalytics} onCheckedChange={(c) => setIncludeAnalytics(!!c)} />
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                Analíticas
              </Label>
            </div>
          </div>

          {/* Preview Stats */}
          <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-muted/50">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{bills.length}</div>
              <div className="text-sm text-muted-foreground">Proyectos de Ley</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{norms.length}</div>
              <div className="text-sm text-muted-foreground">Normas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{selectedClientIds.length}</div>
              <div className="text-sm text-muted-foreground">Clientes</div>
            </div>
          </div>

          {/* Generate Button */}
          {selectedClientIds.length > 0 && (includeBills || includeNorms) ? (
            <PDFDownloadLink
              document={
                <ManualReportPDF 
                  alerts={filteredAlerts} 
                  clientName={clientNames} 
                  dateLabel={dateLabel}
                  includeAnalytics={includeAnalytics}
                />
              }
              fileName={`reporte-legislativo-manual-${format(new Date(), 'yyyy-MM-dd')}.pdf`}
            >
              {({ loading }) => (
                <Button size="lg" className="w-full" disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  {loading ? 'Generando PDF...' : 'Descargar Reporte PDF'}
                </Button>
              )}
            </PDFDownloadLink>
          ) : (
            <Button size="lg" className="w-full" disabled>
              <Download className="h-4 w-4 mr-2" />
              Seleccione al menos un cliente y tipo de contenido
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
