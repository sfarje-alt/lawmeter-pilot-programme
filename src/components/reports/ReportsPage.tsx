import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer";
import { useAlerts } from "@/contexts/AlertsContext";
import { PeruAlert } from "@/data/peruAlertsMockData";
import { MOCK_CLIENT_PROFILES } from "@/data/mockClientProfiles";
import { useSesionesWorkspace } from "@/hooks/useSesionesWorkspace";
import type { PeruSession } from "@/types/peruSessions";
import {
  FileDown,
  Building2,
  Calendar as CalendarIcon,
  FileText,
  Scale,
  Download,
  Loader2,
  Pin,
  Filter,
  Clock,
  BarChart3,
  Video,
} from "lucide-react";
import { format, subDays, parseISO, isAfter, isBefore } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

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

const ReportPDF = ({
  alerts,
  profileName,
  dateLabel,
  includeAnalytics,
  sessions,
}: {
  alerts: PeruAlert[];
  profileName: string;
  dateLabel: string;
  includeAnalytics: boolean;
  sessions: PeruSession[];
}) => {
  const bills = alerts.filter(a => a.legislation_type === 'proyecto_de_ley');
  const norms = alerts.filter(a => a.legislation_type === 'norma');

  const billsByStage = bills.reduce((acc, bill) => {
    const stage = bill.current_stage || 'SIN ESTADO';
    if (!acc[stage]) acc[stage] = [];
    acc[stage].push(bill);
    return acc;
  }, {} as Record<string, PeruAlert[]>);

  // Analytics aggregations (simple, derived from filtered alerts)
  const totalAlerts = alerts.length;
  const withCommentary = alerts.filter(a => a.expert_commentary && a.expert_commentary.trim().length > 0).length;
  const pinned = alerts.filter(a => a.is_pinned_for_publication).length;
  const impactCount = alerts.reduce((acc, a) => {
    const k = (a as any).impact_level || 'sin_clasificar';
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const urgencyCount = alerts.reduce((acc, a) => {
    const k = (a as any).urgency_level || 'sin_clasificar';
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const stagesCount = bills.reduce((acc, b) => {
    const k = b.current_stage || 'SIN ESTADO';
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>REPORTE REGULATORIO</Text>
          <Text style={styles.subtitle}>{profileName}</Text>
          <Text style={styles.subtitle}>{format(new Date(), "d 'de' MMMM yyyy", { locale: es })}</Text>
          <Text style={styles.subtitle}>Alcance: {dateLabel}</Text>
        </View>

        <View style={styles.summary}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 8 }}>RESUMEN EJECUTIVO</Text>
          <Text style={styles.summaryItem}>• {bills.length} Proyectos de Ley</Text>
          <Text style={styles.summaryItem}>• {norms.length} Normas publicadas</Text>
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
                    <Text style={styles.alertMeta}>Autor: {bill.author || 'N/A'}</Text>
                    {bill.source_url && <Link src={bill.source_url} style={styles.sourceLink}>Fuente Oficial</Link>}
                    {bill.expert_commentary && (
                      <View style={styles.commentary}>
                        <Text style={styles.commentaryLabel}>COMENTARIO:</Text>
                        <Text>{bill.expert_commentary.replace(/<[^>]+>/g, '')}</Text>
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
            {norms.map(norm => (
              <View key={norm.id} style={styles.alertCard}>
                <Text style={styles.alertTitle}>{norm.legislation_title}</Text>
                <Text style={styles.alertMeta}>Entidad: {norm.entity || 'N/A'} · Publicación: {norm.publication_date || 'N/A'}</Text>
                {norm.source_url && <Link src={norm.source_url} style={styles.sourceLink}>Fuente Oficial</Link>}
              </View>
            ))}
          </View>
        )}

        {sessions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ALERTAS DE SESIONES</Text>
            {sessions.map(s => {
              const tag =
                s.is_pinned && s.is_follow_up
                  ? 'Pineada · Seguimiento'
                  : s.is_pinned
                    ? 'Pineada'
                    : s.is_follow_up
                      ? 'En seguimiento'
                      : 'Sesión';
              const item = s.agenda_item;
              const title = item ? `Ítem ${item.item_number} · ${item.title}` : (s.session_title ?? s.commission_name);
              const bills = item?.bill_numbers?.length ? `Proyectos: ${item.bill_numbers.join(', ')}` : null;
              const when = s.scheduled_date_text ?? (s.scheduled_at ? format(parseISO(s.scheduled_at), "dd/MM/yyyy HH:mm") : '');
              return (
                <View key={s.id} style={styles.alertCard}>
                  <Text style={styles.alertTitle}>[{tag}] {title}</Text>
                  <Text style={styles.alertMeta}>
                    Comisión: {s.commission_name} · {when}
                    {s.etiqueta_ia ? ` · Etiqueta: ${s.etiqueta_ia}` : ''}
                    {s.impact_level ? ` · Impacto: ${s.impact_level}` : ''}
                    {s.risk_level ? ` · Riesgo: ${s.risk_level}` : ''}
                  </Text>
                  {bills && <Text style={styles.alertMeta}>{bills}</Text>}
                  {s.executive_summary && (
                    <Text style={{ fontSize: 9, marginTop: 4 }}>{s.executive_summary}</Text>
                  )}
                  {s.recording?.video_url && (
                    <Link src={s.recording.video_url} style={styles.sourceLink}>Grabación oficial (YouTube)</Link>
                  )}
                  {s.legal_review?.comentario_experto && (
                    <View style={styles.commentary}>
                      <Text style={styles.commentaryLabel}>COMENTARIO LEGAL:</Text>
                      <Text>{s.legal_review.comentario_experto}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        <Text style={styles.footer}>
          Generado por LawMeter • {format(new Date(), "dd/MM/yyyy HH:mm")} • Confidencial
        </Text>
      </Page>

      {includeAnalytics && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>ANALÍTICAS</Text>
            <Text style={styles.subtitle}>Métricas del rango: {dateLabel}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>INDICADORES GENERALES</Text>
            <View style={styles.summary}>
              <Text style={styles.summaryItem}>• Total de alertas: {totalAlerts}</Text>
              <Text style={styles.summaryItem}>• Proyectos de Ley: {bills.length}</Text>
              <Text style={styles.summaryItem}>• Normas: {norms.length}</Text>
              <Text style={styles.summaryItem}>• Con comentario experto: {withCommentary} ({totalAlerts > 0 ? Math.round((withCommentary / totalAlerts) * 100) : 0}%)</Text>
              <Text style={styles.summaryItem}>• Fijadas para publicación: {pinned}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>DISTRIBUCIÓN POR IMPACTO</Text>
            {Object.entries(impactCount).length === 0 ? (
              <Text style={{ fontSize: 9, color: '#718096' }}>Sin datos clasificados.</Text>
            ) : (
              Object.entries(impactCount).map(([level, count]) => (
                <Text key={level} style={styles.summaryItem}>• {level}: {count}</Text>
              ))
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>DISTRIBUCIÓN POR URGENCIA</Text>
            {Object.entries(urgencyCount).length === 0 ? (
              <Text style={{ fontSize: 9, color: '#718096' }}>Sin datos clasificados.</Text>
            ) : (
              Object.entries(urgencyCount).map(([level, count]) => (
                <Text key={level} style={styles.summaryItem}>• {level}: {count}</Text>
              ))
            )}
          </View>

          {Object.keys(stagesCount).length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>PROYECTOS DE LEY POR ETAPA</Text>
              {Object.entries(stagesCount).map(([stage, count]) => (
                <Text key={stage} style={styles.summaryItem}>• {stage}: {count}</Text>
              ))}
            </View>
          )}

          <Text style={styles.footer}>
            Generado por LawMeter • {format(new Date(), "dd/MM/yyyy HH:mm")} • Confidencial
          </Text>
        </Page>
      )}
    </Document>
  );
};

type ScopeMode = "all_active" | "pinned" | "date_range";

interface ScheduledReport {
  id: string;
  name: string;
  scope: ScopeMode;
  frequency: "daily" | "weekly" | "monthly";
  time: string;
  recipients: string;
  createdAt: string;
}

const PROFILE_STORAGE_KEY = "lawmeter:company-profile";

function readCompanyName(): string {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.legalName) return parsed.legalName;
    }
  } catch {
    // ignore
  }
  return MOCK_CLIENT_PROFILES[0]?.legalName || "Mi Organización";
}

export function ReportsPage() {
  const { alerts } = useAlerts();
  const { sessions: allSessions } = useSesionesWorkspace();
  const profileName = useMemo(() => readCompanyName(), []);

  const [scope, setScope] = useState<ScopeMode>("all_active");
  const [daysBack, setDaysBack] = useState(7);
  const [includeBills, setIncludeBills] = useState(true);
  const [includeNorms, setIncludeNorms] = useState(true);
  const [includeAnalytics, setIncludeAnalytics] = useState(true);
  const [includeSesionesPinned, setIncludeSesionesPinned] = useState(true);
  const [includeSesionesFollowUp, setIncludeSesionesFollowUp] = useState(false);

  // Schedules (in-memory)
  const [schedules, setSchedules] = useState<ScheduledReport[]>([]);
  const [scheduleName, setScheduleName] = useState("");
  const [scheduleFrequency, setScheduleFrequency] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [scheduleTime, setScheduleTime] = useState("08:00");
  const [scheduleRecipients, setScheduleRecipients] = useState("");

  const filteredAlerts = useMemo(() => {
    const cutoff = subDays(new Date(), daysBack);
    return alerts.filter(a => {
      // Always exclude archived
      if (a.archived_at) return false;
      // Type filter
      if (!includeBills && a.legislation_type === 'proyecto_de_ley') return false;
      if (!includeNorms && a.legislation_type === 'norma') return false;
      // Scope
      if (scope === "pinned" && !a.is_pinned_for_publication) return false;
      if (scope === "date_range") {
        try {
          const updated = parseISO(a.updated_at);
          if (isBefore(updated, cutoff)) return false;
        } catch {
          return false;
        }
      }
      return true;
    });
  }, [alerts, scope, daysBack, includeBills, includeNorms]);

  // Sesiones a incluir según los toggles (excluye archivadas)
  const filteredSessions = useMemo<PeruSession[]>(() => {
    if (!includeSesionesPinned && !includeSesionesFollowUp) return [];
    return allSessions.filter((s) => {
      if (s.is_archived) return false;
      const byPin = includeSesionesPinned && s.is_pinned;
      const byFollow = includeSesionesFollowUp && s.is_follow_up;
      return byPin || byFollow;
    });
  }, [allSessions, includeSesionesPinned, includeSesionesFollowUp]);

  const bills = filteredAlerts.filter(a => a.legislation_type === 'proyecto_de_ley');
  const norms = filteredAlerts.filter(a => a.legislation_type === 'norma');

  const dateLabel = scope === "all_active"
    ? "Todas las alertas activas"
    : scope === "pinned"
      ? "Alertas fijadas"
      : `Últimos ${daysBack} días`;

  const canGenerate =
    ((includeBills || includeNorms) && filteredAlerts.length > 0) || filteredSessions.length > 0;

  const handleSaveSchedule = () => {
    if (!scheduleName.trim()) {
      toast.error("Asigna un nombre al reporte programado.");
      return;
    }
    const next: ScheduledReport = {
      id: crypto.randomUUID(),
      name: scheduleName.trim(),
      scope,
      frequency: scheduleFrequency,
      time: scheduleTime,
      recipients: scheduleRecipients,
      createdAt: new Date().toISOString(),
    };
    setSchedules(prev => [next, ...prev]);
    setScheduleName("");
    setScheduleRecipients("");
    toast.success(`Reporte "${next.name}" programado`);
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
    toast.success("Programación eliminada");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reportes</h1>
        <p className="text-muted-foreground">
          Genera reportes manuales o prográmalos para el perfil de tu organización.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* CONFIGURATION COLUMN */}
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileDown className="h-5 w-5" />
              Configuración del Reporte
            </CardTitle>
            <CardDescription>
              Define alcance y contenido. Aplica tanto a descarga manual como a programación.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Organization label */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border/50">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Organización</p>
                <p className="text-sm font-medium truncate">{profileName}</p>
              </div>
            </div>

            {/* Scope */}
            <div className="space-y-3">
              <Label className="font-medium flex items-center gap-2">
                <Filter className="h-4 w-4" /> Alcance de Alertas
              </Label>
              <div className="grid sm:grid-cols-3 gap-2">
                {[
                  { value: "all_active" as const, label: "Todas activas", icon: FileText, desc: "Excluye archivadas" },
                  { value: "pinned" as const, label: "Solo fijadas", icon: Pin, desc: "Marcadas con 📌" },
                  { value: "date_range" as const, label: "Rango de tiempo", icon: CalendarIcon, desc: "Últimos N días" },
                ].map(opt => {
                  const Icon = opt.icon;
                  const active = scope === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setScope(opt.value)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        active ? "border-primary bg-primary/10" : "border-border/50 hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                        <span className="text-sm font-medium">{opt.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>
              {scope === "date_range" && (
                <div className="flex items-center gap-2">
                  <Label htmlFor="days" className="text-sm">Últimos</Label>
                  <Input
                    id="days"
                    type="number"
                    min={1}
                    max={365}
                    value={daysBack}
                    onChange={e => setDaysBack(parseInt(e.target.value) || 7)}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">días</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="space-y-3">
              <Label className="font-medium">Contenido</Label>
              <div className="flex flex-wrap gap-4">
                <Label className="flex items-center gap-2 cursor-pointer">
                  <Switch checked={includeBills} onCheckedChange={setIncludeBills} />
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Proyectos de Ley</span>
                </Label>
                <Label className="flex items-center gap-2 cursor-pointer">
                  <Switch checked={includeNorms} onCheckedChange={setIncludeNorms} />
                  <Scale className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Normas</span>
                </Label>
                <Label className="flex items-center gap-2 cursor-pointer">
                  <Switch checked={includeAnalytics} onCheckedChange={setIncludeAnalytics} />
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Incluir Analíticas</span>
                </Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Si activas “Incluir Analíticas”, el PDF añade una página final con indicadores agregados (impacto, urgencia, etapas y cobertura editorial) del rango seleccionado.
              </p>
            </div>

            {/* Sesiones — bulk include */}
            <div className="space-y-3 p-4 rounded-lg border border-primary/20 bg-primary/5">
              <Label className="font-medium flex items-center gap-2">
                <Pin className="h-4 w-4 text-primary" /> Alertas de Sesiones
              </Label>
              <p className="text-xs text-muted-foreground">
                Incluye en bloque las alertas de Sesiones según su estado editorial. Las marcas se hacen desde la sección Sesiones.
              </p>
              <div className="flex flex-wrap gap-4">
                <Label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={includeSesionesPinned} onCheckedChange={(v) => setIncludeSesionesPinned(!!v)} />
                  <span className="text-sm">Incluir sesiones pineadas</span>
                </Label>
                <Label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={includeSesionesFollowUp} onCheckedChange={(v) => setIncludeSesionesFollowUp(!!v)} />
                  <span className="text-sm">Incluir sesiones en seguimiento</span>
                </Label>
              </div>
            </div>

            {/* Preview */}
            <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-muted/50">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{bills.length}</div>
                <div className="text-xs text-muted-foreground">Proyectos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{norms.length}</div>
                <div className="text-xs text-muted-foreground">Normas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{filteredAlerts.length}</div>
                <div className="text-xs text-muted-foreground">Total alertas</div>
              </div>
            </div>

            {/* Manual Download */}
            {canGenerate ? (
              <PDFDownloadLink
                document={<ReportPDF alerts={filteredAlerts} sessions={filteredSessions} profileName={profileName} dateLabel={dateLabel} includeAnalytics={includeAnalytics} />}
                fileName={`reporte-${format(new Date(), 'yyyy-MM-dd')}.pdf`}
              >
                {({ loading }) => (
                  <Button size="lg" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                    {loading ? 'Generando PDF...' : 'Descargar Reporte Ahora'}
                  </Button>
                )}
              </PDFDownloadLink>
            ) : (
              <Button size="lg" className="w-full" disabled>
                <Download className="h-4 w-4 mr-2" />
                Selecciona contenido y al menos una alerta
              </Button>
            )}
          </CardContent>
        </Card>

        {/* SCHEDULE COLUMN */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Programar Envío
            </CardTitle>
            <CardDescription>
              Reutiliza la configuración de la izquierda para envíos automáticos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sname" className="text-xs">Nombre del reporte</Label>
              <Input
                id="sname"
                value={scheduleName}
                onChange={e => setScheduleName(e.target.value)}
                placeholder="Ej., Reporte semanal regulatorio"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label className="text-xs">Frecuencia</Label>
                <Select value={scheduleFrequency} onValueChange={v => setScheduleFrequency(v as typeof scheduleFrequency)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diario</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Hora</Label>
                <Input type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Destinatarios (emails separados por coma)</Label>
              <Input
                value={scheduleRecipients}
                onChange={e => setScheduleRecipients(e.target.value)}
                placeholder="legal@empresa.com, ceo@empresa.com"
              />
            </div>
            <Button onClick={handleSaveSchedule} className="w-full" variant="secondary">
              <Clock className="h-4 w-4 mr-2" />
              Programar
            </Button>

            {/* Schedule list */}
            {schedules.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-border/50">
                <Label className="text-xs text-muted-foreground">Reportes programados</Label>
                {schedules.map(s => (
                  <div key={s.id} className="p-3 rounded-lg bg-muted/30 border border-border/50 text-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{s.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {s.frequency === "daily" ? "Diario" : s.frequency === "weekly" ? "Semanal" : "Mensual"} · {s.time}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {s.scope === "all_active" ? "Activas" : s.scope === "pinned" ? "Fijadas" : "Por fecha"}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteSchedule(s.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
