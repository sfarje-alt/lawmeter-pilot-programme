import React from "react";
import { renderToFile, Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer";

const COLORS = {
  ink: "#0f172a", inkMuted: "#475569", inkSubtle: "#64748b",
  border: "#e2e8f0", borderSoft: "#eef2f7", surface: "#ffffff", surfaceAlt: "#f8fafc",
  brand: "#1a365d", brandSoft: "#e6efff", brandLine: "#2b6cb0", accent: "#3182ce",
  iaInk: "#14532d", iaBg: "#f0fdf4", iaBorder: "#bbf7d0",
  expertInk: "#1e3a8a", expertBg: "#eff6ff", expertBorder: "#bfdbfe",
};

const styles = StyleSheet.create({
  page: { paddingTop: 44, paddingBottom: 56, paddingHorizontal: 44, fontFamily: "Helvetica", fontSize: 10, color: COLORS.ink, backgroundColor: COLORS.surface },
  header: { marginBottom: 18 },
  brand: { fontSize: 8, color: COLORS.brandLine, letterSpacing: 3, fontFamily: "Helvetica-Bold", marginBottom: 6 },
  title: { fontSize: 24, fontFamily: "Helvetica-Bold", color: COLORS.brand, marginBottom: 4 },
  subtitle: { fontSize: 10.5, color: COLORS.inkMuted, marginBottom: 1 },
  headerDivider: { marginTop: 14, height: 2, backgroundColor: COLORS.brand, width: 48 },
  controlBox: { marginTop: 14, borderWidth: 1, borderColor: COLORS.border, borderRadius: 6, padding: 10, backgroundColor: COLORS.surfaceAlt },
  controlRow: { flexDirection: "row", flexWrap: "wrap" },
  controlCell: { width: "50%", paddingVertical: 3, paddingRight: 8 },
  controlLabel: { fontSize: 7, color: COLORS.inkSubtle, fontFamily: "Helvetica-Bold", letterSpacing: 1.1, marginBottom: 2 },
  controlValue: { fontSize: 9.5, color: COLORS.ink },
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 12 },
  pill: { fontSize: 8, color: COLORS.brand, backgroundColor: COLORS.brandSoft, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, fontFamily: "Helvetica-Bold", letterSpacing: 0.4 },
  pillRed: { fontSize: 8, color: "#7f1d1d", backgroundColor: "#fee2e2", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, fontFamily: "Helvetica-Bold", letterSpacing: 0.4 },
  section: { marginBottom: 22 },
  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 14, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  sectionAccent: { width: 3, height: 14, backgroundColor: COLORS.brand, marginRight: 8 },
  sectionTitle: { fontSize: 13, fontFamily: "Helvetica-Bold", color: COLORS.brand, letterSpacing: 0.5 },
  sectionCount: { marginLeft: "auto", fontSize: 8, color: COLORS.inkMuted, fontFamily: "Helvetica-Bold", letterSpacing: 0.6 },
  snapshotBlock: { marginBottom: 8, borderWidth: 1, borderColor: COLORS.border, borderRadius: 6, padding: 8 },
  snapshotBlockAlert: { marginBottom: 8, borderWidth: 1, borderColor: "#fecaca", borderRadius: 6, padding: 8, backgroundColor: "#fef2f2" },
  snapshotKicker: { fontSize: 7, fontFamily: "Helvetica-Bold", color: COLORS.brandLine, letterSpacing: 1.2, marginBottom: 4 },
  snapshotKickerRed: { fontSize: 7, fontFamily: "Helvetica-Bold", color: "#991b1b", letterSpacing: 1.2, marginBottom: 4 },
  snapshotItem: { fontSize: 8.5, color: COLORS.ink, lineHeight: 1.35, marginBottom: 2 },
  table: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 4, marginBottom: 14 },
  tHeadRow: { flexDirection: "row", backgroundColor: COLORS.brand },
  tHead: { fontSize: 7.5, color: "#ffffff", fontFamily: "Helvetica-Bold", letterSpacing: 0.6, padding: 6 },
  tRow: { flexDirection: "row", borderTopWidth: 1, borderTopColor: COLORS.borderSoft },
  tCell: { fontSize: 8, padding: 6, color: COLORS.ink },
  cId: { width: "12%" }, cTitle: { width: "30%" }, cRisk: { width: "11%" },
  cStage: { width: "15%" }, cOwner: { width: "16%" }, cAction: { width: "16%" },
  riskTag: { fontSize: 7.5, fontFamily: "Helvetica-Bold", paddingHorizontal: 5, paddingVertical: 2, borderRadius: 8, alignSelf: "flex-start" },
  card: { marginBottom: 14, padding: 16, backgroundColor: COLORS.surface, borderRadius: 6, borderWidth: 1, borderColor: COLORS.border, borderLeftWidth: 3, borderLeftColor: COLORS.brand },
  cardKicker: { fontSize: 7.5, color: COLORS.brandLine, fontFamily: "Helvetica-Bold", letterSpacing: 1.2, marginBottom: 4 },
  cardTitle: { fontSize: 11.5, fontFamily: "Helvetica-Bold", color: COLORS.ink, lineHeight: 1.35, marginBottom: 6 },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 4, marginBottom: 8 },
  metaChip: { fontSize: 7.5, color: COLORS.inkMuted, backgroundColor: COLORS.surfaceAlt, borderWidth: 1, borderColor: COLORS.borderSoft, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  cardDivider: { height: 1, backgroundColor: COLORS.borderSoft, marginVertical: 8 },
  fieldGrid: { flexDirection: "row", flexWrap: "wrap", marginTop: 4 },
  fieldHalf: { width: "50%", paddingRight: 6, marginBottom: 8 },
  fieldFull: { width: "100%", marginBottom: 8 },
  bodyLabel: { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: COLORS.inkSubtle, letterSpacing: 1.1, marginBottom: 3 },
  fieldText: { fontSize: 9, color: COLORS.ink, lineHeight: 1.4 },
  ia: { marginTop: 8, padding: 8, backgroundColor: COLORS.iaBg, borderRadius: 4, borderWidth: 1, borderColor: COLORS.iaBorder },
  iaLabel: { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: COLORS.iaInk, letterSpacing: 1.1, marginBottom: 3 },
  iaText: { fontSize: 9, color: COLORS.iaInk, lineHeight: 1.4 },
  commentary: { marginTop: 8, padding: 10, backgroundColor: COLORS.expertBg, borderRadius: 4, borderWidth: 1, borderColor: COLORS.expertBorder, borderLeftWidth: 3, borderLeftColor: COLORS.expertInk },
  commentaryLabel: { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: COLORS.expertInk, letterSpacing: 1.1, marginBottom: 3 },
  commentaryText: { fontSize: 9, color: COLORS.expertInk, lineHeight: 1.5, fontStyle: "italic" },
  empty: { fontSize: 9.5, color: COLORS.inkSubtle, fontStyle: "italic", paddingVertical: 12, textAlign: "center" },
  sourceRow: { flexDirection: "row", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: COLORS.borderSoft },
  sourceIdx: { width: 22, fontSize: 8, color: COLORS.inkSubtle, fontFamily: "Helvetica-Bold" },
  sourceBody: { flex: 1 },
  sourceTitle: { fontSize: 9, color: COLORS.ink, marginBottom: 2 },
  sourceLink: { fontSize: 8, color: COLORS.brandLine, textDecoration: "underline" },
  footer: { position: "absolute", bottom: 24, left: 44, right: 44, textAlign: "center", fontSize: 7.5, color: COLORS.inkSubtle, borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 8, letterSpacing: 0.4 },
});

interface Alert {
  id: string;
  legislation_id?: string;
  legislation_type: "proyecto_de_ley" | "norma";
  legislation_title: string;
  legislation_summary?: string;
  expert_commentary?: string;
  source_url?: string;
  author?: string;
  entity?: string;
  publication_date?: string;
  current_stage?: string;
  impact_level?: string;
  urgency_level?: string;
  owners?: string[];
  requires_decision?: boolean;
  is_pinned_for_publication?: boolean;
}

const ALERTS: Alert[] = [
  {
    id: "bill-001",
    legislation_id: "13172/2025-CR",
    legislation_type: "proyecto_de_ley",
    legislation_title: "PROYECTO DE LEY QUE CREA LA AUTORIDAD NACIONAL DE SALUD Y SEGURIDAD DE PRODUCTOS FARMACÉUTICOS, BIOLÓGICOS Y DISPOSITIVOS MÉDICOS (ANSSP)",
    legislation_summary: "Crea una autoridad autónoma que asume las competencias de DIGEMID en registro sanitario, control y vigilancia de productos farmacéuticos, dispositivos médicos y productos sanitarios. Modifica la Ley N° 29459 y atribuye nuevas funciones de fiscalización, sanción y trazabilidad.",
    expert_commentary: "Cambio estructural de la autoridad regulatoria. Impacta tiempos de registro, costos de cumplimiento y exigencias de farmacovigilancia. Requiere revisión interna del pipeline regulatorio.",
    source_url: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/13172",
    author: "Bustamante Donayre, Carlos Ernesto",
    current_stage: "EN COMISIÓN DE SALUD",
    impact_level: "Grave",
    urgency_level: "Alta",
    owners: ["Legal", "Asuntos Públicos"],
    requires_decision: true,
    is_pinned_for_publication: true,
  },
  {
    id: "bill-005",
    legislation_id: "13108/2025-CR",
    legislation_type: "proyecto_de_ley",
    legislation_title: "PROYECTO DE LEY QUE FACILITA LOS PROCEDIMIENTOS DE ADQUISICIÓN DE EQUIPAMIENTO MÉDICO EN ESSALUD",
    legislation_summary: "Faculta a EsSalud a realizar contrataciones directas de equipamiento médico con opinión previa favorable de la Contraloría, modificando el artículo 55.1 de la Ley General de Contrataciones Públicas.",
    expert_commentary: "Abre ventana relevante de contratación directa para proveedores ya homologados. Podría acelerar adjudicaciones del Q1 2026.",
    source_url: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/13108",
    author: "Ugarte Mamani, Jhakeline Katy",
    current_stage: "EN COMISIÓN",
    impact_level: "Medio",
    urgency_level: "Media",
    owners: ["Compliance", "Operaciones"],
    requires_decision: true,
    is_pinned_for_publication: true,
  },
  {
    id: "bill-002",
    legislation_id: "13202/2025-CR",
    legislation_type: "proyecto_de_ley",
    legislation_title: "PROYECTO DE LEY DE RESPUESTA NACIONAL FRENTE A VIH, ITS Y HEPATITIS VIRALES",
    legislation_summary: "Establece marco integral para fortalecer la respuesta nacional frente al VIH, ITS y hepatitis virales: derechos de pacientes, atención gratuita y continua, presupuesto protegido y mecanismos de monitoreo.",
    expert_commentary: "Impacta cobertura asistencial y compras públicas de antirretrovirales. Vigilar implicancias presupuestales 2026.",
    source_url: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/13202",
    author: "Paredes Piqué, Susel Ana María",
    current_stage: "PRESENTADO",
    impact_level: "Medio",
    urgency_level: "Media",
    owners: ["Legal"],
    requires_decision: false,
    is_pinned_for_publication: true,
  },
  {
    id: "bill-004",
    legislation_id: "13103/2025-CR",
    legislation_type: "proyecto_de_ley",
    legislation_title: "PROYECTO DE LEY QUE OBLIGA LA CREACIÓN DEL DEPARTAMENTO Y JEFATURA DE SERVICIOS DE ENFERMERÍA EN ESTABLECIMIENTOS PÚBLICOS DE SALUD",
    legislation_summary: "Obligatoriedad para MINSA y EsSalud de implementar Departamentos de Enfermería con funciones de gestión, monitoreo e indicadores de calidad.",
    expert_commentary: "Riesgo presupuestal moderado para EsSalud. Sin impacto directo sobre proveedores privados.",
    source_url: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/13103",
    author: "Medina Hermosilla, Elizabeth Sara",
    current_stage: "PRESENTADO",
    impact_level: "Leve",
    urgency_level: "Baja",
    owners: ["Compliance"],
    requires_decision: false,
    is_pinned_for_publication: true,
  },
  {
    id: "bill-003",
    legislation_id: "13060/2025-CR",
    legislation_type: "proyecto_de_ley",
    legislation_title: "PROYECTO DE LEY PARA PROMOVER LA INVESTIGACIÓN CIENTÍFICA DEL MUÉRDAGO COMO TRATAMIENTO COMPLEMENTARIO EN PACIENTES CON CÁNCER",
    legislation_summary: "Promueve y financia investigación clínica del muérdago (Viscum album) como tratamiento complementario oncológico. Prohíbe su promoción como sustituto del tratamiento estándar.",
    expert_commentary: "Bajo impacto inmediato. Útil para mapeo de stakeholders en oncología complementaria.",
    source_url: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/13060",
    author: "Ugarte Mamani, Jhakeline Katy",
    current_stage: "PRESENTADO",
    impact_level: "Leve",
    urgency_level: "Baja",
    owners: ["Asuntos Públicos"],
    requires_decision: false,
  },
  {
    id: "norm-001",
    legislation_id: "DS N° 014-2025-SA",
    legislation_type: "norma",
    legislation_title: "DECRETO SUPREMO QUE APRUEBA EL REGLAMENTO DE BUENAS PRÁCTICAS DE FARMACOVIGILANCIA Y TECNOVIGILANCIA",
    legislation_summary: "Actualiza obligaciones de titulares de registros sanitarios y establecimientos de salud en notificación de eventos adversos, gestión de señales de seguridad y planes de gestión de riesgos.",
    expert_commentary: "Eleva sustancialmente exigencias operativas de farmacovigilancia. Requiere actualización de SOPs y plantillas regulatorias antes de la entrada en vigor.",
    source_url: "https://busquedas.elperuano.pe/normaslegales/decreto-supremo-014-2025-sa",
    entity: "MINSA",
    publication_date: "2025-11-15",
    current_stage: "VIGENTE",
    impact_level: "Grave",
    urgency_level: "Alta",
    owners: ["Legal", "Compliance", "Operaciones"],
    requires_decision: true,
    is_pinned_for_publication: true,
  },
  {
    id: "norm-002",
    legislation_id: "RM N° 902-2025-MINSA",
    legislation_type: "norma",
    legislation_title: "RESOLUCIÓN MINISTERIAL QUE APRUEBA LA NTS DE GESTIÓN DE DISPOSITIVOS MÉDICOS DE ALTO RIESGO",
    legislation_summary: "Aprueba norma técnica para clasificación, adquisición, mantenimiento y trazabilidad de dispositivos médicos de alto riesgo en establecimientos de salud públicos y privados.",
    expert_commentary: "Sin impacto directo sobre el portfolio actual; relevante para futura introducción de líneas Clase III.",
    source_url: "https://busquedas.elperuano.pe/normaslegales/rm-902-2025-minsa",
    entity: "MINSA",
    publication_date: "2025-11-12",
    current_stage: "VIGENTE",
    impact_level: "Medio",
    urgency_level: "Media",
    owners: ["Operaciones"],
    requires_decision: false,
  },
  {
    id: "norm-003",
    legislation_id: "Res. N° 0231-2025-DIGEMID",
    legislation_type: "norma",
    legislation_title: "RESOLUCIÓN DIRECTORAL QUE ESTABLECE LINEAMIENTOS PARA LA RENOVACIÓN AUTOMÁTICA DE REGISTROS SANITARIOS DE PRODUCTOS FARMACÉUTICOS",
    legislation_summary: "Define criterios y plazos para renovación automática condicionada al cumplimiento de farmacovigilancia y reportes periódicos de seguridad.",
    expert_commentary: "Reduce carga administrativa para titulares con buen historial. Oportunidad de automatizar tramitología interna.",
    source_url: "https://www.digemid.minsa.gob.pe/resoluciones/0231-2025",
    entity: "DIGEMID",
    publication_date: "2025-11-08",
    current_stage: "VIGENTE",
    impact_level: "Positivo",
    urgency_level: "Baja",
    owners: ["Legal"],
    requires_decision: false,
  },
];

const PROFILE_NAME = "Bedson Perú";
const PERIOD_LABEL = "Últimos 7 días (29 abr — 6 may 2026)";
const AUTHOR = "Sergio Pérez · Regulatory Affairs";
const REPORT_VERSION = "v20260506-0930";

function impactRank(level?: string): number {
  switch ((level || "").toLowerCase()) {
    case "grave": case "alto": return 4;
    case "medio": return 3;
    case "leve": return 2;
    case "positivo": return 1;
    default: return 0;
  }
}
function riskColor(level?: string) {
  const l = (level || "").toLowerCase();
  if (["grave", "alto"].includes(l)) return { bg: "#fee2e2", fg: "#7f1d1d", label: level || "—" };
  if (["medio"].includes(l)) return { bg: "#fef3c7", fg: "#78350f", label: level || "—" };
  if (["leve"].includes(l)) return { bg: "#fefce8", fg: "#713f12", label: level || "—" };
  if (l === "positivo") return { bg: "#dcfce7", fg: "#14532d", label: level || "—" };
  return { bg: COLORS.surfaceAlt, fg: COLORS.inkMuted, label: level || "—" };
}
function truncate(s: string | undefined | null, n: number) {
  if (!s) return "";
  return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;
}

const sortedByImpact = [...ALERTS].sort((a, b) => impactRank(b.impact_level) - impactRank(a.impact_level));
const topDevelopments = sortedByImpact.slice(0, 3);
const watchlist = sortedByImpact.slice(3, 7);
const decisionsNeeded = ALERTS.filter((a) => a.requires_decision);
const pinned = ALERTS.filter((a) => a.is_pinned_for_publication);
const heatmap = (pinned.length > 0 ? pinned : sortedByImpact).slice(0, 12);

const sourceList = ALERTS.filter(a => a.source_url).map(a => ({ title: a.legislation_title, url: a.source_url! }));

const NOW = "06/05/2026 09:30";

const Doc = (
  <Document>
    {/* Page 1: Cover + Control + Executive Snapshot */}
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.brand}>LAWMETER · REGULATORY AFFAIRS BRIEF</Text>
        <Text style={styles.title}>Reporte Regulatorio</Text>
        <Text style={styles.subtitle}>{PROFILE_NAME}</Text>
        <Text style={styles.subtitle}>6 de mayo 2026</Text>
        <View style={styles.headerDivider} />
        <View style={styles.pillRow}>
          <Text style={styles.pill}>ALERTAS + SESIONES</Text>
          <Text style={styles.pill}>SOLO PINEADAS</Text>
          <Text style={styles.pill}>{PERIOD_LABEL.toUpperCase()}</Text>
          <Text style={styles.pillRed}>{decisionsNeeded.length} REQUIEREN DECISIÓN</Text>
        </View>
        <View style={styles.controlBox}>
          <View style={styles.controlRow}>
            <View style={styles.controlCell}><Text style={styles.controlLabel}>PERÍODO</Text><Text style={styles.controlValue}>{PERIOD_LABEL}</Text></View>
            <View style={styles.controlCell}><Text style={styles.controlLabel}>JURISDICCIÓN</Text><Text style={styles.controlValue}>Perú</Text></View>
            <View style={styles.controlCell}><Text style={styles.controlLabel}>AUTOR / EQUIPO</Text><Text style={styles.controlValue}>{AUTHOR}</Text></View>
            <View style={styles.controlCell}><Text style={styles.controlLabel}>VERSIÓN</Text><Text style={styles.controlValue}>{REPORT_VERSION}</Text></View>
            <View style={styles.controlCell}><Text style={styles.controlLabel}>DISTRIBUCIÓN</Text><Text style={styles.controlValue}>{PROFILE_NAME} (confidencial)</Text></View>
            <View style={styles.controlCell}><Text style={styles.controlLabel}>COBERTURA</Text><Text style={styles.controlValue}>{ALERTS.length} alertas</Text></View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionAccent} />
          <Text style={styles.sectionTitle}>EXECUTIVE SNAPSHOT</Text>
        </View>
        <View style={styles.snapshotBlock}>
          <Text style={styles.snapshotKicker}>TOP DEVELOPMENTS</Text>
          {topDevelopments.map((a) => (
            <Text key={a.id} style={styles.snapshotItem}>
              • {a.legislation_id ? `[${a.legislation_id}] ` : ""}{truncate(a.legislation_title, 140)}
              {a.impact_level ? `  —  Impacto: ${a.impact_level}` : ""}
            </Text>
          ))}
        </View>
        <View style={styles.snapshotBlock}>
          <Text style={styles.snapshotKicker}>WATCHLIST</Text>
          {watchlist.map((a) => (
            <Text key={a.id} style={styles.snapshotItem}>
              • {truncate(a.legislation_title, 130)}{a.current_stage ? `  ·  ${a.current_stage}` : ""}
            </Text>
          ))}
        </View>
        <View style={styles.snapshotBlockAlert}>
          <Text style={styles.snapshotKickerRed}>DECISIONES / SOPORTE REQUERIDO</Text>
          {decisionsNeeded.length === 0 ? (
            <Text style={styles.empty}>Ninguna decisión pendiente.</Text>
          ) : decisionsNeeded.map((a) => (
            <Text key={a.id} style={styles.snapshotItem}>
              • {truncate(a.legislation_title, 130)}{a.owners?.length ? `  —  Owner: ${a.owners.join(", ")}` : ""}
            </Text>
          ))}
        </View>
      </View>
      <Text style={styles.footer}>Generado por LawMeter • {NOW} • Confidencial</Text>
    </Page>

    {/* Page 2: Heatmap */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionAccent} />
          <Text style={styles.sectionTitle}>HEATMAP REGULATORIO</Text>
          <Text style={styles.sectionCount}>{heatmap.length} ALERTAS PINEADAS</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tHeadRow} fixed>
            <Text style={[styles.tHead, styles.cId]}>ID / TIPO</Text>
            <Text style={[styles.tHead, styles.cTitle]}>TEMA</Text>
            <Text style={[styles.tHead, styles.cRisk]}>IMPACTO</Text>
            <Text style={[styles.tHead, styles.cStage]}>ESTADO</Text>
            <Text style={[styles.tHead, styles.cOwner]}>OWNER</Text>
            <Text style={[styles.tHead, styles.cAction]}>PRÓX. ACCIÓN</Text>
          </View>
          {heatmap.map((a) => {
            const r = riskColor(a.impact_level);
            const owners = a.owners?.join(", ") || "—";
            const action = a.requires_decision ? "Decisión requerida" : a.current_stage ? `Seguir: ${a.current_stage}` : "Monitoreo";
            return (
              <View key={a.id} style={styles.tRow} wrap={false}>
                <Text style={[styles.tCell, styles.cId]}>{a.legislation_id || (a.legislation_type === "norma" ? "Norma" : "PL")}</Text>
                <Text style={[styles.tCell, styles.cTitle]}>{truncate(a.legislation_title, 110)}</Text>
                <View style={[styles.cRisk, { padding: 6 }]}>
                  <Text style={[styles.riskTag, { backgroundColor: r.bg, color: r.fg }]}>{r.label}</Text>
                </View>
                <Text style={[styles.tCell, styles.cStage]}>{a.current_stage || "—"}</Text>
                <Text style={[styles.tCell, styles.cOwner]}>{owners}</Text>
                <Text style={[styles.tCell, styles.cAction]}>{action}</Text>
              </View>
            );
          })}
        </View>
      </View>
      <Text style={styles.footer}>Generado por LawMeter • {NOW} • Confidencial</Text>
    </Page>

    {/* Page 3+: Fichas */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionAccent} />
          <Text style={styles.sectionTitle}>FICHAS DE ALERTA</Text>
          <Text style={styles.sectionCount}>{ALERTS.length} ÍTEMS</Text>
        </View>
        {ALERTS.map((a) => {
          const kicker = a.legislation_type === "norma" ? "NORMA" : "PROYECTO DE LEY";
          const meta: string[] = [];
          if (a.legislation_id) meta.push(a.legislation_id);
          if (a.legislation_type === "proyecto_de_ley" && a.author) meta.push(`Autor: ${a.author}`);
          if (a.legislation_type === "norma" && a.entity) meta.push(`Entidad: ${a.entity}`);
          if (a.legislation_type === "norma" && a.publication_date) meta.push(`Publicado: ${a.publication_date}`);
          const owners = a.owners || [];
          const sourceAuth = a.legislation_type === "norma"
            ? (a.entity || "Diario Oficial El Peruano")
            : "Congreso de la República del Perú";
          return (
            <View key={a.id} style={styles.card} wrap={false}>
              <Text style={styles.cardKicker}>{kicker}</Text>
              <Text style={styles.cardTitle}>{a.legislation_title}</Text>
              <View style={styles.metaRow}>
                {meta.map((m, i) => <Text key={i} style={styles.metaChip}>{m}</Text>)}
                {a.requires_decision && <Text style={styles.pillRed}>DECISIÓN REQUERIDA</Text>}
              </View>
              <View style={styles.cardDivider} />
              <View style={styles.fieldGrid}>
                <View style={styles.fieldFull}>
                  <Text style={styles.bodyLabel}>QUÉ CAMBIÓ</Text>
                  <Text style={styles.fieldText}>{truncate(a.legislation_summary, 480) || "Sin resumen disponible."}</Text>
                </View>
                <View style={styles.fieldHalf}>
                  <Text style={styles.bodyLabel}>FUENTE / AUTORIDAD</Text>
                  <Text style={styles.fieldText}>{sourceAuth}</Text>
                </View>
                <View style={styles.fieldHalf}>
                  <Text style={styles.bodyLabel}>PRÓXIMO HITO</Text>
                  <Text style={styles.fieldText}>{a.current_stage || "Por confirmar"}</Text>
                </View>
                <View style={styles.fieldHalf}>
                  <Text style={styles.bodyLabel}>OWNER / ETA</Text>
                  <Text style={styles.fieldText}>{owners.length ? owners.join(", ") : "Sin asignar"}</Text>
                </View>
                <View style={styles.fieldHalf}>
                  <Text style={styles.bodyLabel}>PRÓXIMOS PASOS</Text>
                  <Text style={styles.fieldText}>{a.requires_decision ? "Decisión interna pendiente. Definir postura." : "Monitoreo continuo del avance legislativo."}</Text>
                </View>
              </View>
              {a.expert_commentary && (
                <View style={styles.commentary}>
                  <Text style={styles.commentaryLabel}>POSICIÓN / COMENTARIO EXPERTO</Text>
                  <Text style={styles.commentaryText}>{a.expert_commentary}</Text>
                </View>
              )}
              {(a.impact_level || a.urgency_level) && (
                <View style={styles.ia}>
                  <Text style={styles.iaLabel}>CLASIFICACIÓN IA</Text>
                  <Text style={styles.iaText}>
                    {a.impact_level ? `Impacto: ${a.impact_level}` : ""}
                    {a.impact_level && a.urgency_level ? "   ·   " : ""}
                    {a.urgency_level ? `Urgencia: ${a.urgency_level}` : ""}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
      <Text style={styles.footer}>Generado por LawMeter • {NOW} • Confidencial</Text>
    </Page>

    {/* Sources */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionAccent} />
          <Text style={styles.sectionTitle}>FUENTES OFICIALES</Text>
          <Text style={styles.sectionCount}>{sourceList.length} REFERENCIAS</Text>
        </View>
        {sourceList.map((s, i) => (
          <View key={i} style={styles.sourceRow} wrap={false}>
            <Text style={styles.sourceIdx}>{String(i + 1).padStart(2, "0")}</Text>
            <View style={styles.sourceBody}>
              <Text style={styles.sourceTitle}>{truncate(s.title, 140)}</Text>
              <Link src={s.url} style={styles.sourceLink}>{s.url}</Link>
            </View>
          </View>
        ))}
      </View>
      <Text style={styles.footer}>Generado por LawMeter • {NOW} • Confidencial</Text>
    </Page>
  </Document>
);

const out = process.argv[2] || "/mnt/documents/reporte-bedson-2026-05-06.pdf";
await renderToFile(Doc, out);
console.log("WROTE", out);
