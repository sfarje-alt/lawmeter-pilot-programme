import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  pdf,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
  Image as PDFImage,
} from "@react-pdf/renderer";
import {
  captureAnalyticsSnapshots,
  type AnalyticsSnapshot,
} from "./captureAnalyticsSnapshots";
import { useAlerts } from "@/contexts/AlertsContext";
import { PeruAlert } from "@/data/peruAlertsMockData";
import { BEDSON_ORGANIZATION_NAME } from "@/data/bedsonClientProfile";
import { useAuth } from "@/contexts/AuthContext";
import { isEmptyDataOrg } from "@/lib/orgDataIsolation";
import { useSesionesWorkspace } from "@/hooks/useSesionesWorkspace";
import { useSesiones, type Sesion } from "@/hooks/useSesiones";
import type { PeruSession } from "@/types/peruSessions";
import {
  ANALYTICS_BLOCK_REGISTRY,
  type AnalyticsBlockConfigExtended,
} from "@/types/analytics";
import {
  FileDown,
  Building2,
  Calendar as CalendarIcon,
  FileText,
  Download,
  Loader2,
  Pin,
  Clock,
  BarChart3,
  Video,
  Layers,
  Trash2,
  Play,
  Pause,
  PlusCircle,
  History,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { format, subDays, parseISO, isBefore } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type SourceMode = "alertas" | "sesiones" | "mixto";
type InclusionMode = "todas" | "pineadas";
type Frequency = "daily" | "weekly" | "monthly";

interface ScheduledReport {
  id: string;
  name: string;
  source: SourceMode;
  inclusion: InclusionMode;
  daysBack: number;
  includeAnalytics: boolean;
  /** Si true, sesiones cuya fecha de sesión cae en el período entran al reporte. */
  matchSessionDate?: boolean;
  /** Si true, sesiones analizadas dentro del período entran al reporte (aunque la sesión sea anterior). */
  matchAnalysisDate?: boolean;
  frequency: Frequency;
  time: string;
  recipients: string;
  isActive: boolean;
  createdAt: string;
  nextRunAt: string;
}

interface GeneratedReport {
  id: string;
  title: string;
  source: SourceMode;
  inclusion: InclusionMode;
  daysBack: number;
  periodStart: string;
  periodEnd: string;
  includeAnalytics: boolean;
  alertCount: number;
  sessionCount: number;
  origin: "manual" | "scheduled";
  generatedAt: string;
}

const SCHEDULES_STORAGE_KEY = "lawmeter:report-schedules";
const GENERATED_STORAGE_KEY = "lawmeter:generated-reports";
const PROFILE_STORAGE_KEY = "lawmeter:company-profile";
const ANALYTICS_LAYOUT_KEY = "analytics-dashboard-layout-v2";

function readCompanyName(organizationId: string | null | undefined): string {
  // Para la organización piloto (Bedson), siempre devolvemos su nombre canónico,
  // aunque el localStorage tenga restos de configuraciones anteriores.
  if (isEmptyDataOrg(organizationId)) return BEDSON_ORGANIZATION_NAME;
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.legalName) return parsed.legalName;
    }
  } catch {
    /* ignore */
  }
  return BEDSON_ORGANIZATION_NAME;
}

/** Reads the analytics blocks the user currently has visible/enabled in Analíticas. */
function readVisibleAnalyticsBlocks(): AnalyticsBlockConfigExtended[] {
  try {
    const saved = localStorage.getItem(ANALYTICS_LAYOUT_KEY);
    if (saved) {
      const parsed: AnalyticsBlockConfigExtended[] = JSON.parse(saved);
      return parsed.filter((b) => b.enabled !== false);
    }
  } catch {
    /* ignore */
  }
  return ANALYTICS_BLOCK_REGISTRY
    .filter((b) => b.defaultEnabled)
    .map((b, i) => ({ ...b, order: i, enabled: true, renderPDF: true, renderDashboard: true }));
}

// ─────────────────────────────────────────────────────────────────────────────
// PDF — premium LawMeter visual identity
// Deep navy headers, clean dividers, refined typography hierarchy.
// ─────────────────────────────────────────────────────────────────────────────

const COLORS = {
  ink:        "#0f172a",
  inkMuted:   "#475569",
  inkSubtle:  "#64748b",
  border:     "#e2e8f0",
  borderSoft: "#eef2f7",
  surface:    "#ffffff",
  surfaceAlt: "#f8fafc",
  brand:      "#1a365d",
  brandSoft:  "#e6efff",
  brandLine:  "#2b6cb0",
  accent:     "#3182ce",
  iaInk:      "#14532d",
  iaBg:       "#f0fdf4",
  iaBorder:   "#bbf7d0",
  expertInk:  "#1e3a8a",
  expertBg:   "#eff6ff",
  expertBorder: "#bfdbfe",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 44,
    paddingBottom: 56,
    paddingHorizontal: 44,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: COLORS.ink,
    backgroundColor: COLORS.surface,
  },

  header: { marginBottom: 22 },
  brand: { fontSize: 8, color: COLORS.brandLine, letterSpacing: 3, fontFamily: "Helvetica-Bold", marginBottom: 6 },
  title: { fontSize: 24, fontFamily: "Helvetica-Bold", color: COLORS.brand, marginBottom: 4 },
  subtitle: { fontSize: 10.5, color: COLORS.inkMuted, marginBottom: 1 },
  headerDivider: { marginTop: 14, height: 2, backgroundColor: COLORS.brand, width: 48 },

  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 12 },
  pill: {
    fontSize: 8, color: COLORS.brand, backgroundColor: COLORS.brandSoft,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10,
    fontFamily: "Helvetica-Bold", letterSpacing: 0.4,
  },

  summary: {
    backgroundColor: COLORS.surfaceAlt, padding: 16, marginBottom: 20, borderRadius: 6,
    borderLeftWidth: 3, borderLeftColor: COLORS.brand,
  },
  summaryTitle: { fontSize: 9, fontFamily: "Helvetica-Bold", letterSpacing: 1.2, marginBottom: 8, color: COLORS.brand },
  summaryItem: { fontSize: 10, marginBottom: 3, color: COLORS.ink },

  section: { marginBottom: 22 },
  sectionHeader: {
    flexDirection: "row", alignItems: "center", marginBottom: 14,
    paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  sectionAccent: { width: 3, height: 14, backgroundColor: COLORS.brand, marginRight: 8 },
  sectionTitle: { fontSize: 13, fontFamily: "Helvetica-Bold", color: COLORS.brand, letterSpacing: 0.5 },
  sectionCount: {
    marginLeft: "auto", fontSize: 8, color: COLORS.inkMuted,
    fontFamily: "Helvetica-Bold", letterSpacing: 0.6,
  },

  // Premium content card
  card: {
    marginBottom: 14, padding: 16, backgroundColor: COLORS.surface, borderRadius: 6,
    borderWidth: 1, borderColor: COLORS.border,
    borderLeftWidth: 3, borderLeftColor: COLORS.brand,
  },
  cardKicker: {
    fontSize: 7.5, color: COLORS.brandLine, fontFamily: "Helvetica-Bold",
    letterSpacing: 1.2, marginBottom: 4,
  },
  cardTitle: { fontSize: 11.5, fontFamily: "Helvetica-Bold", color: COLORS.ink, lineHeight: 1.35, marginBottom: 6 },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 4, marginBottom: 8 },
  metaChip: {
    fontSize: 7.5, color: COLORS.inkMuted, backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1, borderColor: COLORS.borderSoft,
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8,
  },
  cardDivider: { height: 1, backgroundColor: COLORS.borderSoft, marginVertical: 8 },
  bodyLabel: {
    fontSize: 7.5, fontFamily: "Helvetica-Bold", color: COLORS.inkSubtle,
    letterSpacing: 1.1, marginBottom: 3,
  },
  cardBody: { fontSize: 9.5, color: COLORS.ink, lineHeight: 1.45, marginBottom: 4 },

  ia: {
    marginTop: 8, padding: 8, backgroundColor: COLORS.iaBg, borderRadius: 4,
    borderWidth: 1, borderColor: COLORS.iaBorder,
  },
  iaLabel: { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: COLORS.iaInk, letterSpacing: 1.1, marginBottom: 3 },
  iaText: { fontSize: 9, color: COLORS.iaInk, lineHeight: 1.4 },

  commentary: {
    marginTop: 8, padding: 10, backgroundColor: COLORS.expertBg, borderRadius: 4,
    borderWidth: 1, borderColor: COLORS.expertBorder,
    borderLeftWidth: 3, borderLeftColor: COLORS.expertInk,
  },
  commentaryLabel: {
    fontSize: 7.5, fontFamily: "Helvetica-Bold", color: COLORS.expertInk,
    letterSpacing: 1.1, marginBottom: 3,
  },
  commentaryText: { fontSize: 9, color: COLORS.expertInk, lineHeight: 1.5, fontStyle: "italic" },

  link: {
    marginTop: 8, fontSize: 8, color: COLORS.brandLine, textDecoration: "underline",
    fontFamily: "Helvetica-Bold", letterSpacing: 0.4,
  },
  empty: { fontSize: 9.5, color: COLORS.inkSubtle, fontStyle: "italic", paddingVertical: 12, textAlign: "center" },

  footer: {
    position: "absolute", bottom: 24, left: 44, right: 44, textAlign: "center",
    fontSize: 7.5, color: COLORS.inkSubtle,
    borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 8, letterSpacing: 0.4,
  },

  // Analytics appendix (snapshot pages)
  analyticsCover: { paddingHorizontal: 44, paddingTop: 80, paddingBottom: 80 },
  analyticsKicker: {
    fontSize: 8, color: COLORS.brandLine, letterSpacing: 3,
    fontFamily: "Helvetica-Bold", marginBottom: 10,
  },
  analyticsTitle: { fontSize: 32, fontFamily: "Helvetica-Bold", color: COLORS.brand, marginBottom: 8 },
  analyticsLead: { fontSize: 11, color: COLORS.inkMuted, lineHeight: 1.55, maxWidth: 420 },
  analyticsImagePage: {
    paddingTop: 24,
    paddingBottom: 56,
    paddingHorizontal: 24,
    backgroundColor: COLORS.surface,
  },
  analyticsImageWrap: {
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    borderRadius: 6,
    padding: 0,
  },
  analyticsImageGap: {
    height: 10,
  },
});

const ANALYTICS_PAGE_WIDTH_PT = 595.28;
const ANALYTICS_PAGE_HEIGHT_PT = 841.89;
const ANALYTICS_PAGE_PADDING_X_PT = 24;
const ANALYTICS_PAGE_PADDING_TOP_PT = 24;
const ANALYTICS_PAGE_PADDING_BOTTOM_PT = 56;
const ANALYTICS_SECTION_GAP_PT = 10;
const ANALYTICS_CONTENT_WIDTH_PT = ANALYTICS_PAGE_WIDTH_PT - ANALYTICS_PAGE_PADDING_X_PT * 2;
const ANALYTICS_CONTENT_HEIGHT_PT = ANALYTICS_PAGE_HEIGHT_PT - ANALYTICS_PAGE_PADDING_TOP_PT - ANALYTICS_PAGE_PADDING_BOTTOM_PT;

function getAnalyticsImageHeightPt(image: AnalyticsSnapshot) {
  return ANALYTICS_CONTENT_WIDTH_PT * (image.height / image.width);
}

function paginateAnalyticsSnapshots(images: AnalyticsSnapshot[]): AnalyticsSnapshot[][] {
  const pages: AnalyticsSnapshot[][] = [];
  let current: AnalyticsSnapshot[] = [];
  let usedHeight = 0;

  images.forEach((image) => {
    const imageHeight = getAnalyticsImageHeightPt(image);
    const nextHeight = current.length === 0
      ? imageHeight
      : usedHeight + ANALYTICS_SECTION_GAP_PT + imageHeight;

    if (current.length > 0 && nextHeight > ANALYTICS_CONTENT_HEIGHT_PT) {
      pages.push(current);
      current = [image];
      usedHeight = imageHeight;
      return;
    }

    current.push(image);
    usedHeight = nextHeight;
  });

  if (current.length > 0) pages.push(current);
  return pages;
}

interface PDFProps {
  alerts: PeruAlert[];
  sessions: PeruSession[];
  /** HD analytics snapshots with explicit dimensions for PDF pagination. */
  analyticsImages: AnalyticsSnapshot[];
  source: SourceMode;
  inclusion: InclusionMode;
  includeAnalytics: boolean;
  profileName: string;
  periodLabel: string;
}

const ReportPDF = ({
  alerts,
  sessions,
  analyticsImages,
  source,
  inclusion,
  includeAnalytics,
  profileName,
  periodLabel,
}: PDFProps) => {
  const showAlerts = source === "alertas" || source === "mixto";
  const showSessions = source === "sesiones" || source === "mixto";

  const sourceLabel =
    source === "alertas" ? "Alertas regulatorias" : source === "sesiones" ? "Sesiones" : "Alertas + Sesiones";
  const inclusionLabel = inclusion === "todas" ? "Todas dentro del período" : "Solo pineadas";
  const hasAnalyticsAppendix = includeAnalytics && analyticsImages.length > 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ── Cover header */}
        <View style={styles.header}>
          <Text style={styles.brand}>LAWMETER</Text>
          <Text style={styles.title}>Reporte Regulatorio</Text>
          <Text style={styles.subtitle}>{profileName}</Text>
          <Text style={styles.subtitle}>{format(new Date(), "d 'de' MMMM yyyy", { locale: es })}</Text>
          <View style={styles.headerDivider} />
          <View style={styles.pillRow}>
            <Text style={styles.pill}>{sourceLabel.toUpperCase()}</Text>
            <Text style={styles.pill}>{inclusionLabel.toUpperCase()}</Text>
            <Text style={styles.pill}>{periodLabel.toUpperCase()}</Text>
            {hasAnalyticsAppendix && <Text style={styles.pill}>+ ANALÍTICAS</Text>}
          </View>
        </View>

        {/* ── Executive summary */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>RESUMEN EJECUTIVO</Text>
          {showAlerts && <Text style={styles.summaryItem}>• {alerts.length} alertas regulatorias</Text>}
          {showSessions && <Text style={styles.summaryItem}>• {sessions.length} alertas de sesiones</Text>}
          {hasAnalyticsAppendix && (
            <Text style={styles.summaryItem}>• Anexo de analíticas ({analyticsImages.length} pág.)</Text>
          )}
        </View>

        {/* ── Alertas regulatorias */}
        {showAlerts && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionTitle}>ALERTAS REGULATORIAS</Text>
              <Text style={styles.sectionCount}>{alerts.length} ÍTEM{alerts.length === 1 ? "" : "S"}</Text>
            </View>

            {alerts.length === 0 ? (
              <Text style={styles.empty}>Sin alertas en el período seleccionado.</Text>
            ) : (
              alerts.map((a) => {
                const kicker =
                  a.legislation_type === "norma" ? "NORMA" : "PROYECTO DE LEY";

                const meta: string[] = [];
                if (a.legislation_id) meta.push(a.legislation_id);
                if (a.legislation_type === "proyecto_de_ley" && a.author) meta.push(`Autor: ${a.author}`);
                if (a.legislation_type === "norma" && a.entity) meta.push(`Entidad: ${a.entity}`);
                if (a.legislation_type === "norma" && a.publication_date) meta.push(`Publicado: ${a.publication_date}`);

                const iaParts: string[] = [];
                if ((a as any).impact_level) iaParts.push(`Impacto: ${(a as any).impact_level}`);
                if ((a as any).urgency_level) iaParts.push(`Urgencia: ${(a as any).urgency_level}`);
                if (a.current_stage) iaParts.push(`Etapa: ${a.current_stage}`);
                const iaLine = iaParts.join("   ·   ");

                const commentary = a.expert_commentary?.replace(/<[^>]+>/g, "").trim();

                return (
                  <View key={a.id} style={styles.card} wrap={false}>
                    <Text style={styles.cardKicker}>{kicker}</Text>
                    <Text style={styles.cardTitle}>{a.legislation_title}</Text>

                    {meta.length > 0 && (
                      <View style={styles.metaRow}>
                        {meta.map((m, i) => (
                          <Text key={i} style={styles.metaChip}>{m}</Text>
                        ))}
                      </View>
                    )}

                    {a.legislation_summary && (
                      <>
                        <View style={styles.cardDivider} />
                        <Text style={styles.bodyLabel}>RESUMEN</Text>
                        <Text style={styles.cardBody}>{a.legislation_summary.slice(0, 360)}</Text>
                      </>
                    )}

                    {iaLine && (
                      <View style={styles.ia}>
                        <Text style={styles.iaLabel}>CLASIFICACIÓN IA</Text>
                        <Text style={styles.iaText}>{iaLine}</Text>
                      </View>
                    )}

                    {commentary && (
                      <View style={styles.commentary}>
                        <Text style={styles.commentaryLabel}>COMENTARIO EXPERTO</Text>
                        <Text style={styles.commentaryText}>{commentary}</Text>
                      </View>
                    )}

                    {a.source_url && (
                      <Link src={a.source_url} style={styles.link}>
                        FUENTE OFICIAL →
                      </Link>
                    )}
                  </View>
                );
              })
            )}
          </View>
        )}

        {/* ── Sesiones */}
        {showSessions && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionTitle}>SESIONES DEL CONGRESO</Text>
              <Text style={styles.sectionCount}>{sessions.length} ÍTEM{sessions.length === 1 ? "" : "S"}</Text>
            </View>

            {sessions.length === 0 ? (
              <Text style={styles.empty}>Sin sesiones en el período seleccionado.</Text>
            ) : (
              sessions.map((s) => {
                const item = s.agenda_item;
                const title = item ? `Ítem ${item.item_number} · ${item.title}` : (s.session_title ?? s.commission_name);
                const when = s.scheduled_date_text ?? (s.scheduled_at ? format(parseISO(s.scheduled_at), "dd/MM/yyyy HH:mm") : "");

                const meta: string[] = [];
                meta.push(`Comisión: ${s.commission_name}`);
                if (when) meta.push(when);

                const iaParts: string[] = [];
                if (s.impact_level) iaParts.push(`Impacto: ${s.impact_level}`);
                if (s.urgency_level) iaParts.push(`Urgencia: ${s.urgency_level}`);
                if (s.etiqueta_ia) iaParts.push(`Etiqueta: ${s.etiqueta_ia}`);
                const iaLine = iaParts.join("   ·   ");

                const summary = (s.executive_summary || s.chatbot_summary || "").trim();

                return (
                  <View key={s.id} style={styles.card} wrap={false}>
                    <Text style={styles.cardKicker}>SESIÓN</Text>
                    <Text style={styles.cardTitle}>{title}</Text>

                    <View style={styles.metaRow}>
                      {meta.map((m, i) => (
                        <Text key={i} style={styles.metaChip}>{m}</Text>
                      ))}
                    </View>

                    {summary && (
                      <>
                        <View style={styles.cardDivider} />
                        <Text style={styles.bodyLabel}>RESUMEN DE LA SESIÓN</Text>
                        <Text style={styles.cardBody}>{summary.slice(0, 460)}</Text>
                      </>
                    )}

                    {iaLine && (
                      <View style={styles.ia}>
                        <Text style={styles.iaLabel}>CLASIFICACIÓN IA</Text>
                        <Text style={styles.iaText}>{iaLine}</Text>
                      </View>
                    )}

                    {s.recording?.video_url && (
                      <Link src={s.recording.video_url} style={styles.link}>
                        GRABACIÓN OFICIAL →
                      </Link>
                    )}
                  </View>
                );
              })
            )}
          </View>
        )}

        <Text style={styles.footer}>
          Generado por LawMeter • {format(new Date(), "dd/MM/yyyy HH:mm")} • Confidencial
        </Text>
      </Page>

      {/* ── ANEXO: Analíticas — cover + HD snapshots of the live dashboard */}
      {hasAnalyticsAppendix && (
        <>
          <Page size="A4" style={styles.page}>
            <View style={styles.analyticsCover}>
              <Text style={styles.analyticsKicker}>LAWMETER · ANEXO</Text>
              <Text style={styles.analyticsTitle}>Analíticas</Text>
              <View style={[styles.headerDivider, { marginBottom: 18 }]} />
              <Text style={styles.analyticsLead}>
                Vista exacta de tu sección de Analíticas al momento de generar el reporte.
                Se incluye como apéndice visual de alta resolución, sin reinterpretar el contenido.
              </Text>
              <Text style={[styles.analyticsLead, { marginTop: 12 }]}>{periodLabel}</Text>
            </View>
            <Text style={styles.footer}>
              Generado por LawMeter • {format(new Date(), "dd/MM/yyyy HH:mm")} • Confidencial
            </Text>
          </Page>

          {paginateAnalyticsSnapshots(analyticsImages).map((pageImages, pageIndex) => (
            <Page key={pageIndex} size="A4" style={styles.analyticsImagePage}>
              {pageImages.map((image, imageIndex) => (
                <View key={`${pageIndex}-${imageIndex}`}>
                  <View style={styles.analyticsImageWrap}>
                    <PDFImage
                      src={image.src}
                      style={{
                        width: ANALYTICS_CONTENT_WIDTH_PT,
                        height: getAnalyticsImageHeightPt(image),
                      }}
                    />
                  </View>
                  {imageIndex < pageImages.length - 1 && <View style={styles.analyticsImageGap} />}
                </View>
              ))}
              <Text style={styles.footer}>
                Generado por LawMeter • {format(new Date(), "dd/MM/yyyy HH:mm")} • Confidencial
              </Text>
            </Page>
          ))}
        </>
      )}
    </Document>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function buildPeriodLabel(daysBack: number) {
  const end = new Date();
  const start = subDays(end, daysBack);
  return `${format(start, "dd MMM", { locale: es })} – ${format(end, "dd MMM yyyy", { locale: es })} (${daysBack} días)`;
}

/**
 * Determina si una sesión debe entrar al reporte según las opciones de fecha
 * elegidas por el usuario. Acepta dos criterios independientes (fecha de
 * sesión y/o fecha de análisis IA) y los combina con OR. Si ambos están
 * desactivados, no entra ninguna sesión (defensivo).
 */
function sessionMatchesPeriod(
  s: PeruSession,
  cutoff: Date,
  opts: { bySessionDate: boolean; byAnalysisDate: boolean; inclusion: InclusionMode }
): boolean {
  if (s.is_archived) return false;
  if (opts.inclusion === "pineadas" && !s.is_pinned) return false;
  if (!opts.bySessionDate && !opts.byAnalysisDate) return false;

  const inRange = (iso: string | null | undefined) => {
    if (!iso) return false;
    try {
      return !isBefore(parseISO(iso), cutoff);
    } catch {
      return false;
    }
  };

  if (opts.bySessionDate && inRange(s.scheduled_at)) return true;
  if (opts.byAnalysisDate && inRange((s as any).analysis_completed_at)) return true;
  return false;
}

function nextRunDate(frequency: Frequency, time: string): string {
  const [hh, mm] = time.split(":").map(Number);
  const d = new Date();
  d.setHours(hh || 8, mm || 0, 0, 0);
  if (d.getTime() <= Date.now()) {
    if (frequency === "daily") d.setDate(d.getDate() + 1);
    if (frequency === "weekly") d.setDate(d.getDate() + 7);
    if (frequency === "monthly") d.setMonth(d.getMonth() + 1);
  }
  return d.toISOString();
}

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    /* ignore */
  }
  return fallback;
}

function saveJSON<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export function ReportsPage() {
  const { profile } = useAuth();
  const { alerts } = useAlerts();
  const { sessions: workspaceSessions } = useSesionesWorkspace();
  // También leemos la tabla `sesiones` (donde viven los análisis IA) para que
  // las sesiones analizadas por el usuario aparezcan en el reporte aunque no
  // estén en la fuente `peru_sessions` que alimenta el workspace editorial.
  const { sesiones: analyzedSesiones } = useSesiones({ onlyDeInteres: false });

  const allSessions = useMemo<PeruSession[]>(() => {
    const byExternalId = new Map<string, PeruSession>();
    for (const s of workspaceSessions) {
      const key = (s as any).external_id ?? s.id;
      byExternalId.set(String(key), s);
    }
    // Merge analizadas: si ya existe (mismo external_id) enriquecemos con
    // analysis_completed_at/scheduled_at; si no, la añadimos como nueva.
    for (const a of analyzedSesiones) {
      const key = a.external_id ?? a.id;
      const existing = byExternalId.get(key);
      const merged: PeruSession = {
        ...(existing ?? ({} as PeruSession)),
        id: existing?.id ?? a.id,
        external_id: a.external_id,
        commission_name: a.commission_name ?? existing?.commission_name ?? "",
        session_title: a.session_title ?? existing?.session_title ?? null,
        scheduled_at: a.scheduled_at ?? existing?.scheduled_at ?? null,
        scheduled_date_text: a.scheduled_date_text ?? existing?.scheduled_date_text ?? null,
        is_archived: existing?.is_archived ?? false,
        is_pinned: existing?.is_pinned ?? false,
        is_pinned_for_publication: existing?.is_pinned_for_publication ?? false,
        analysis_completed_at: a.analysis_completed_at ?? (existing as any)?.analysis_completed_at ?? null,
        executive_summary:
          a.resumen_ejecutivo ?? (existing as any)?.executive_summary ?? undefined,
        impact_level: ((a.impacto_categoria ?? (existing as any)?.impact_level) as any) ?? undefined,
        urgency_level: ((a.urgencia_categoria ?? (existing as any)?.urgency_level) as any) ?? undefined,
      } as unknown as PeruSession;
      byExternalId.set(key, merged);
    }
    return Array.from(byExternalId.values());
  }, [workspaceSessions, analyzedSesiones]);
  const profileName = useMemo(
    () => readCompanyName(profile?.organization_id),
    [profile?.organization_id]
  );

  // UI-only restricted state for specific organizations.
  // Backend, scheduling logic and report generation are untouched.
  const restricted = isEmptyDataOrg(profile?.organization_id);

  // Preconfigured (display-only) schedules shown when restricted.
  // These are NOT persisted and do NOT trigger any backend job.
  const restrictedPreconfiguredSchedules = useMemo(
    () => [
      {
        id: "preconfigured-2026-05-06",
        name: "Reporte regulatorio automático",
        scheduledDateLabel: "6 de mayo de 2026",
      },
      {
        id: "preconfigured-2026-05-20",
        name: "Reporte regulatorio automático",
        scheduledDateLabel: "20 de mayo de 2026",
      },
    ],
    []
  );

  // Tab
  const [tab, setTab] = useState<"create" | "scheduled" | "generated">("create");

  // Builder state
  const [source, setSource] = useState<SourceMode>("mixto");
  const [inclusion, setInclusion] = useState<InclusionMode>("todas");
  const [daysBack, setDaysBack] = useState<number>(7);
  const [includeAnalytics, setIncludeAnalytics] = useState<boolean>(true);

  // Sessions: which date(s) to use to decide if a session enters the report.
  // Ambos pueden estar activos a la vez (OR lógico).
  const [matchSessionDate, setMatchSessionDate] = useState<boolean>(true);
  const [matchAnalysisDate, setMatchAnalysisDate] = useState<boolean>(false);

  // Persisted lists
  const [schedules, setSchedules] = useState<ScheduledReport[]>(() =>
    loadJSON<ScheduledReport[]>(SCHEDULES_STORAGE_KEY, [])
  );
  const [generated, setGenerated] = useState<GeneratedReport[]>(() =>
    loadJSON<GeneratedReport[]>(GENERATED_STORAGE_KEY, [])
  );

  useEffect(() => saveJSON(SCHEDULES_STORAGE_KEY, schedules), [schedules]);
  useEffect(() => saveJSON(GENERATED_STORAGE_KEY, generated), [generated]);

  // Schedule form
  const [scheduleName, setScheduleName] = useState("");
  const [scheduleFrequency, setScheduleFrequency] = useState<Frequency>("weekly");
  const [scheduleTime, setScheduleTime] = useState("08:00");
  const [scheduleRecipients, setScheduleRecipients] = useState("");

  // ── Data slicing per simplified rules
  const periodCutoff = useMemo(() => subDays(new Date(), daysBack), [daysBack]);

  const filteredAlerts = useMemo<PeruAlert[]>(() => {
    if (source === "sesiones") return [];
    return alerts.filter((a) => {
      if (a.archived_at) return false;
      // period
      try {
        const updated = parseISO(a.updated_at);
        if (isBefore(updated, periodCutoff)) return false;
      } catch {
        return false;
      }
      // inclusion
      if (inclusion === "pineadas" && !a.is_pinned_for_publication) return false;
      return true;
    });
  }, [alerts, source, inclusion, periodCutoff]);

  const filteredSessions = useMemo<PeruSession[]>(() => {
    if (source === "alertas") return [];
    return allSessions.filter((s) =>
      sessionMatchesPeriod(s, periodCutoff, {
        bySessionDate: matchSessionDate,
        byAnalysisDate: matchAnalysisDate,
        inclusion,
      })
    );
  }, [allSessions, source, inclusion, periodCutoff, matchSessionDate, matchAnalysisDate]);

  const periodLabel = buildPeriodLabel(daysBack);
  const visibleAnalytics = useMemo(() => readVisibleAnalyticsBlocks(), [tab]); // refresh when tab changes

  const totalItems = filteredAlerts.length + filteredSessions.length;
  const canGenerate = totalItems > 0;

  const sourceBadge = (s: SourceMode) =>
    s === "alertas" ? "Alertas" : s === "sesiones" ? "Sesiones" : "Mixto";

  // ── Generation state
  const [isGenerating, setIsGenerating] = useState(false);

  const recordGenerated = (origin: "manual" | "scheduled") => {
    const end = new Date();
    const start = subDays(end, daysBack);
    const entry: GeneratedReport = {
      id: crypto.randomUUID(),
      title: `Reporte ${sourceBadge(source)} · ${format(end, "dd MMM yyyy", { locale: es })}`,
      source,
      inclusion,
      daysBack,
      periodStart: start.toISOString(),
      periodEnd: end.toISOString(),
      includeAnalytics,
      alertCount: filteredAlerts.length,
      sessionCount: filteredSessions.length,
      origin,
      generatedAt: end.toISOString(),
    };
    setGenerated((prev) => [entry, ...prev].slice(0, 100));
  };

  const handleManualGenerate = async () => {
    if (!canGenerate || isGenerating) return;
    setIsGenerating(true);
    try {
      let analyticsImages: AnalyticsSnapshot[] = [];
      if (includeAnalytics) {
        toast.loading("Capturando analíticas en alta resolución…", { id: "gen-report" });
        try {
          analyticsImages = await captureAnalyticsSnapshots();
        } catch (err) {
          console.error("Snapshot failed", err);
          toast.error("No se pudieron capturar las analíticas. Se generará el reporte sin el anexo.", { id: "gen-report" });
        }
      }
      toast.loading("Construyendo PDF…", { id: "gen-report" });

      const blob = await pdf(
        <ReportPDF
          alerts={filteredAlerts}
          sessions={filteredSessions}
          analyticsImages={analyticsImages}
          source={source}
          inclusion={inclusion}
          includeAnalytics={includeAnalytics}
          profileName={profileName}
          periodLabel={periodLabel}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `reporte-${source}-${format(new Date(), "yyyy-MM-dd")}.pdf`;
      link.click();
      URL.revokeObjectURL(url);

      recordGenerated("manual");
      toast.success("Reporte generado y descargado", { id: "gen-report" });
    } catch (err) {
      console.error(err);
      toast.error("No se pudo generar el reporte", { id: "gen-report" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveSchedule = () => {
    if (!scheduleName.trim()) {
      toast.error("Asigna un nombre al reporte programado.");
      return;
    }
    const next: ScheduledReport = {
      id: crypto.randomUUID(),
      name: scheduleName.trim(),
      source,
      inclusion,
      daysBack,
      includeAnalytics,
      matchSessionDate,
      matchAnalysisDate,
      frequency: scheduleFrequency,
      time: scheduleTime,
      recipients: scheduleRecipients,
      isActive: true,
      createdAt: new Date().toISOString(),
      nextRunAt: nextRunDate(scheduleFrequency, scheduleTime),
    };
    setSchedules((prev) => [next, ...prev]);
    setScheduleName("");
    setScheduleRecipients("");
    toast.success(`Programación "${next.name}" creada`);
    setTab("scheduled");
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    toast.success("Programación eliminada");
  };

  const handleToggleSchedule = (id: string) => {
    setSchedules((prev) => prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s)));
  };

  const handleRunScheduledNow = async (s: ScheduledReport) => {
    // Snapshot current data using the schedule's config
    const cutoff = subDays(new Date(), s.daysBack);
    const a = s.source === "sesiones"
      ? []
      : alerts.filter((al) => {
          if (al.archived_at) return false;
          try {
            if (isBefore(parseISO(al.updated_at), cutoff)) return false;
          } catch {
            return false;
          }
          if (s.inclusion === "pineadas" && !al.is_pinned_for_publication) return false;
          return true;
        });
    const ss = s.source === "alertas"
      ? []
      : allSessions.filter((sess) =>
          sessionMatchesPeriod(sess, cutoff, {
            bySessionDate: s.matchSessionDate ?? true,
            byAnalysisDate: s.matchAnalysisDate ?? false,
            inclusion: s.inclusion,
          })
        );

    let analyticsImages: AnalyticsSnapshot[] = [];
    if (s.includeAnalytics) {
      try {
        analyticsImages = await captureAnalyticsSnapshots();
      } catch (err) {
        console.error("Snapshot failed (scheduled)", err);
      }
    }

    const blob = await pdf(
      <ReportPDF
        alerts={a}
        sessions={ss}
        analyticsImages={analyticsImages}
        source={s.source}
        inclusion={s.inclusion}
        includeAnalytics={s.includeAnalytics}
        profileName={profileName}
        periodLabel={buildPeriodLabel(s.daysBack)}
      />
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${s.name.replace(/\s+/g, "-").toLowerCase()}-${format(new Date(), "yyyy-MM-dd")}.pdf`;
    link.click();
    URL.revokeObjectURL(url);

    const end = new Date();
    const start = subDays(end, s.daysBack);
    const entry: GeneratedReport = {
      id: crypto.randomUUID(),
      title: `${s.name} · ${format(end, "dd MMM yyyy", { locale: es })}`,
      source: s.source,
      inclusion: s.inclusion,
      daysBack: s.daysBack,
      periodStart: start.toISOString(),
      periodEnd: end.toISOString(),
      includeAnalytics: s.includeAnalytics,
      alertCount: a.length,
      sessionCount: ss.length,
      origin: "scheduled",
      generatedAt: end.toISOString(),
    };
    setGenerated((prev) => [entry, ...prev].slice(0, 100));

    setSchedules((prev) =>
      prev.map((it) => (it.id === s.id ? { ...it, nextRunAt: nextRunDate(s.frequency, s.time) } : it))
    );
    toast.success(`Reporte "${s.name}" generado`);
  };

  // ───────────────────────────────────────────────────────────────────────────
  // Shared "Choices" panel — same simple logic for Crear & Programados
  // ───────────────────────────────────────────────────────────────────────────
  const ChoicesPanel = (
    <div className="space-y-5">
      {/* Source */}
      <div className="space-y-2">
        <Label className="font-medium flex items-center gap-2">
          <Layers className="h-4 w-4" /> Contenido del reporte
        </Label>
        <div className="grid sm:grid-cols-3 gap-2">
          {([
            { value: "alertas", label: "Alertas regulatorias", icon: FileText, desc: "Solo alertas" },
            { value: "sesiones", label: "Sesiones", icon: Video, desc: "Solo sesiones" },
            { value: "mixto", label: "Alertas + Sesiones", icon: Sparkles, desc: "Ambos" },
          ] as const).map((opt) => {
            const Icon = opt.icon;
            const active = source === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSource(opt.value)}
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
      </div>

      {/* Inclusion mode */}
      <div className="space-y-2">
        <Label className="font-medium">Modo de inclusión</Label>
        <div className="grid sm:grid-cols-2 gap-2">
          {([
            { value: "todas", label: "Todas dentro del período", icon: FileText, desc: "Incluye todos los ítems del período" },
            { value: "pineadas", label: "Solo pineadas", icon: Pin, desc: "Solo ítems marcados con 📌" },
          ] as const).map((opt) => {
            const Icon = opt.icon;
            const active = inclusion === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setInclusion(opt.value)}
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
      </div>

      {/* Period */}
      <div className="space-y-2">
        <Label className="font-medium flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" /> Período
        </Label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Últimos</span>
          <Input
            type="number"
            min={1}
            max={365}
            value={daysBack}
            onChange={(e) => setDaysBack(Math.max(1, parseInt(e.target.value) || 7))}
            className="w-24"
          />
          <span className="text-sm text-muted-foreground">días · {periodLabel}</span>
        </div>
      </div>

      {/* Sessions date matching — visible when sessions están en el alcance */}
      {(source === "sesiones" || source === "mixto") && (
        <div className="space-y-2 p-3 rounded-lg bg-muted/40 border border-border/50">
          <Label className="font-medium flex items-center gap-2">
            <Video className="h-4 w-4" /> ¿Qué fecha define si una sesión entra al reporte?
          </Label>
          <div className="space-y-2 pl-1">
            <label className="flex items-start gap-3 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={matchSessionDate}
                onChange={(e) => setMatchSessionDate(e.target.checked)}
                className="mt-1 h-4 w-4 accent-primary"
              />
              <span>
                <span className="font-medium">Por fecha de la sesión</span>
                <span className="block text-xs text-muted-foreground">
                  La sesión ocurrió dentro del período seleccionado.
                </span>
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={matchAnalysisDate}
                onChange={(e) => setMatchAnalysisDate(e.target.checked)}
                className="mt-1 h-4 w-4 accent-primary"
              />
              <span>
                <span className="font-medium">Por fecha del análisis IA</span>
                <span className="block text-xs text-muted-foreground">
                  La sesión fue analizada por IA dentro del período (aunque haya ocurrido antes).
                </span>
              </span>
            </label>
          </div>
          {!matchSessionDate && !matchAnalysisDate && (
            <p className="text-xs text-destructive pl-1">
              Selecciona al menos una opción o no se incluirán sesiones.
            </p>
          )}
        </div>
      )}

      {/* Analytics */}
      <div className="space-y-2 p-3 rounded-lg bg-muted/40 border border-border/50">
        <Label className="flex items-center gap-3 cursor-pointer">
          <Switch checked={includeAnalytics} onCheckedChange={setIncludeAnalytics} />
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Incluir analíticas visualizadas</span>
        </Label>
        <p className="text-xs text-muted-foreground pl-12">
          Adjunta los bloques que tienes activos hoy en la sección Analíticas
          ({visibleAnalytics.length} bloque{visibleAnalytics.length === 1 ? "" : "s"} visible{visibleAnalytics.length === 1 ? "" : "s"}).
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reportes</h1>
          <p className="text-muted-foreground">
            Genera, programa y consulta reportes basados en Alertas, Sesiones y Analíticas.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/40 border border-border/50">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Organización</p>
            <p className="text-sm font-medium">{profileName}</p>
          </div>
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList>
          <TabsTrigger value="create" className="gap-2">
            <PlusCircle className="h-4 w-4" /> Crear reporte
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="gap-2">
            <Clock className="h-4 w-4" /> Reportes programados
            <Badge variant="secondary">
              {restricted ? restrictedPreconfiguredSchedules.length : schedules.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="generated" className="gap-2">
            <History className="h-4 w-4" /> Reportes generados
            <Badge variant="secondary">{generated.length}</Badge>
          </TabsTrigger>
        </TabsList>

        {/* ─────────────────── CREAR ─────────────────── */}
        <TabsContent value="create" className="mt-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileDown className="h-5 w-5" /> Configuración del reporte
              </CardTitle>
              <CardDescription>
                Elige contenido, modo de inclusión y período. Opcionalmente añade tus analíticas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {ChoicesPanel}

              {/* Preview */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-lg bg-muted/40 border border-border/50">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{filteredAlerts.length}</div>
                  <div className="text-xs text-muted-foreground">Alertas regulatorias</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{filteredSessions.length}</div>
                  <div className="text-xs text-muted-foreground">Sesiones</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {includeAnalytics ? visibleAnalytics.length : 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Bloques de analíticas</div>
                </div>
              </div>

              {/* Actions */}
              <div className="grid sm:grid-cols-2 gap-3">
                <Button
                  size="lg"
                  className="w-full"
                  disabled={!canGenerate || isGenerating}
                  onClick={handleManualGenerate}
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  {isGenerating
                    ? "Generando PDF…"
                    : canGenerate
                      ? "Generar y descargar"
                      : "Sin contenido para el período"}
                </Button>
                <Button size="lg" variant="outline" onClick={() => setTab("scheduled")}>
                  <Clock className="h-4 w-4 mr-2" />
                  Programar este reporte
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─────────────────── PROGRAMADOS ─────────────────── */}
        <TabsContent value="scheduled" className="mt-6 space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" /> Nueva programación
              </CardTitle>
              <CardDescription>
                Reutiliza la misma lógica simple: contenido, modo, período y analíticas opcionales.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {ChoicesPanel}
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs">Nombre</Label>
                  <Input
                    value={scheduleName}
                    onChange={(e) => setScheduleName(e.target.value)}
                    placeholder="Ej., Reporte semanal regulatorio"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Destinatarios</Label>
                  <Input
                    value={scheduleRecipients}
                    onChange={(e) => setScheduleRecipients(e.target.value)}
                    placeholder="legal@empresa.com, ceo@empresa.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Frecuencia</Label>
                  <Select value={scheduleFrequency} onValueChange={(v) => setScheduleFrequency(v as Frequency)}>
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
                  <Input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} />
                </div>
              </div>
              <Button onClick={handleSaveSchedule} className="w-full sm:w-auto">
                <PlusCircle className="h-4 w-4 mr-2" /> Crear programación
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Programaciones activas</CardTitle>
              <CardDescription>
                Cada programación corre con la misma lógica de contenido / inclusión / período.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {schedules.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  Aún no tienes reportes programados.
                </p>
              ) : (
                <div className="space-y-3">
                  {schedules.map((s) => (
                    <div key={s.id} className="p-4 rounded-lg border border-border/50 bg-card/40">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-2 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium text-foreground">{s.name}</span>
                            {s.isActive ? (
                              <Badge className="bg-green-500/15 text-green-600 border-green-500/30">Activo</Badge>
                            ) : (
                              <Badge variant="secondary">Pausado</Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">{sourceBadge(s.source)}</Badge>
                            <Badge variant="outline">{s.inclusion === "todas" ? "Todas" : "Pineadas"}</Badge>
                            <Badge variant="outline">Últimos {s.daysBack} días</Badge>
                            <Badge variant="outline">
                              {s.frequency === "daily" ? "Diario" : s.frequency === "weekly" ? "Semanal" : "Mensual"} · {s.time}
                            </Badge>
                            {s.includeAnalytics && <Badge variant="outline">+ Analíticas</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Próxima ejecución: {format(parseISO(s.nextRunAt), "EEEE dd MMM, HH:mm", { locale: es })}
                            {s.recipients ? ` · ${s.recipients}` : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost" onClick={() => handleRunScheduledNow(s)} title="Ejecutar ahora">
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleToggleSchedule(s.id)} title={s.isActive ? "Pausar" : "Reanudar"}>
                            {s.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteSchedule(s.id)}
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─────────────────── GENERADOS ─────────────────── */}
        <TabsContent value="generated" className="mt-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" /> Repositorio de reportes
              </CardTitle>
              <CardDescription>
                Historial de reportes generados manualmente o por programación.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generated.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  Aún no se han generado reportes. Genera uno desde "Crear reporte".
                </p>
              ) : (
                <div className="space-y-3">
                  {generated.map((r) => (
                    <div key={r.id} className="p-4 rounded-lg border border-border/50 bg-card/40">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-2 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <span className="font-medium text-foreground">{r.title}</span>
                            <Badge className="bg-green-500/15 text-green-600 border-green-500/30">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              {r.origin === "manual" ? "Manual" : "Programado"}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">{sourceBadge(r.source)}</Badge>
                            <Badge variant="outline">{r.inclusion === "todas" ? "Todas" : "Pineadas"}</Badge>
                            <Badge variant="outline">
                              {format(parseISO(r.periodStart), "dd MMM", { locale: es })} – {format(parseISO(r.periodEnd), "dd MMM yyyy", { locale: es })}
                            </Badge>
                            {r.includeAnalytics && <Badge variant="outline">+ Analíticas</Badge>}
                          </div>
                          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                            <span>{r.alertCount} alertas</span>
                            <span>·</span>
                            <span>{r.sessionCount} sesiones</span>
                            <span>·</span>
                            <span>Generado: {format(parseISO(r.generatedAt), "dd MMM yyyy, HH:mm", { locale: es })}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                          onClick={() => {
                            if (confirm(`¿Borrar el reporte "${r.title}"? Esta acción no se puede deshacer.`)) {
                              setGenerated((prev) => prev.filter((g) => g.id !== r.id));
                              toast.success("Reporte borrado");
                            }
                          }}
                          aria-label="Borrar reporte"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
