import React from "react";
import { renderToFile, Document, Page, Text, View, StyleSheet, Link, Svg, Rect, G, Path, Circle } from "@react-pdf/renderer";

const COLORS = {
  ink: "#0f172a", inkMuted: "#475569", inkSubtle: "#64748b",
  border: "#e2e8f0", borderSoft: "#eef2f7", surface: "#ffffff", surfaceAlt: "#f8fafc",
  brand: "#1a365d", brandSoft: "#e6efff", brandLine: "#2b6cb0", accent: "#3182ce",
  iaInk: "#14532d", iaBg: "#f0fdf4", iaBorder: "#bbf7d0",
  expertInk: "#1e3a8a", expertBg: "#eff6ff", expertBorder: "#bfdbfe",
  // chart palette
  c1: "#1a365d", c2: "#2b6cb0", c3: "#3182ce", c4: "#63b3ed", c5: "#90cdf4",
  // risk
  graveBg: "#fee2e2", graveFg: "#7f1d1d",
  medBg: "#fef3c7", medFg: "#78350f",
  leveBg: "#fefce8", leveFg: "#713f12",
  posBg: "#dcfce7", posFg: "#14532d",
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
  subSectionHeader: { flexDirection: "row", alignItems: "center", marginTop: 4, marginBottom: 8 },
  subSectionTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", color: COLORS.brandLine, letterSpacing: 1.1 },
  subSectionCount: { marginLeft: "auto", fontSize: 7.5, color: COLORS.inkSubtle, fontFamily: "Helvetica-Bold", letterSpacing: 0.5 },
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
  cId: { width: "13%" }, cTitle: { width: "32%" }, cRisk: { width: "11%" },
  cStage: { width: "14%" }, cOwner: { width: "15%" }, cAction: { width: "15%" },
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
  // viz
  vizGrid: {},
  vizCell: { marginBottom: 10 },
  vizCard: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 6, padding: 12, backgroundColor: COLORS.surface },
  vizTitle: { fontSize: 9, fontFamily: "Helvetica-Bold", color: COLORS.brand, letterSpacing: 0.6, marginBottom: 6 },
  vizSub: { fontSize: 7.5, color: COLORS.inkSubtle, marginBottom: 8 },
  legendRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 6 },
  legendItem: { flexDirection: "row", alignItems: "center", marginRight: 10, marginBottom: 3 },
  legendSwatch: { width: 8, height: 8, marginRight: 4, borderRadius: 2 },
  legendText: { fontSize: 7.5, color: COLORS.inkMuted },
  // sessions
  sessionCard: { marginBottom: 12, padding: 12, borderWidth: 1, borderColor: COLORS.border, borderRadius: 6, borderLeftWidth: 3, borderLeftColor: COLORS.accent },
  sessionMeta: { fontSize: 8, color: COLORS.inkMuted, marginBottom: 4 },
  sessionTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", color: COLORS.ink, marginBottom: 4 },
  sessionItem: { fontSize: 9, color: COLORS.ink, lineHeight: 1.4, marginBottom: 2 },
});

// ============================================================================
// TYPES
// ============================================================================
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

interface Session {
  id: string;
  commission: string;
  date: string; // ISO
  title: string;
  video_url?: string;
  agenda_items: string[];
  expert_commentary?: string;
  related_alert_ids?: string[];
}

// ============================================================================
// BETSSON MOCK DATA — Perú, 29 abr — 6 may 2026
// ============================================================================
const ALERTS: Alert[] = [
  // ── Proyectos de Ley ─────────────────────────────────────────────────────
  {
    id: "bill-bts-001",
    legislation_id: "07412/2025-CR",
    legislation_type: "proyecto_de_ley",
    legislation_title: "PROYECTO DE LEY QUE INCORPORA EL IMPUESTO SELECTIVO AL CONSUMO (ISC) A LAS APUESTAS DEPORTIVAS A DISTANCIA Y JUEGOS A DISTANCIA",
    legislation_summary: "Propone gravar con ISC adicional la actividad de operadores autorizados de juegos a distancia y apuestas deportivas a distancia, modificando la Ley N° 31557 y el Decreto Legislativo N° 1644. Establece base imponible sobre el GGR (Gross Gaming Revenue) y nuevos formularios virtuales SUNAT.",
    expert_commentary: "Riesgo tributario crítico. Si avanza, eleva la presión fiscal efectiva sobre el sector entre 8 y 12 puntos. Coordinar postura con el resto de operadores y preparar memo técnico para la Comisión de Economía.",
    source_url: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/07412",
    author: "Cavero Alva, Alejandro Aurelio",
    current_stage: "EN COMISIÓN DE ECONOMÍA",
    impact_level: "Grave",
    urgency_level: "Alta",
    owners: ["Tributario", "Legal & Compliance", "Finanzas"],
    requires_decision: true,
    is_pinned_for_publication: true,
  },
  {
    id: "bill-bts-002",
    legislation_id: "07388/2025-CR",
    legislation_type: "proyecto_de_ley",
    legislation_title: "PROYECTO DE LEY QUE RESTRINGE LA PUBLICIDAD DE APUESTAS DEPORTIVAS Y JUEGOS A DISTANCIA EN MEDIOS MASIVOS Y EVENTOS DEPORTIVOS",
    legislation_summary: "Prohíbe la publicidad de operadores de apuestas deportivas en horario familiar, restringe el patrocinio de clubes y equipamiento deportivo, y exige advertencias sanitarias en toda comunicación comercial. Incluye régimen sancionatorio a cargo de INDECOPI.",
    expert_commentary: "Impacto directo en estrategia de marca y patrocinios deportivos (incluye contratos vigentes con clubes peruanos). Requiere evaluar plan de mitigación creativo y presupuesto media.",
    source_url: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/07388",
    author: "Paredes Piqué, Susel Ana María",
    current_stage: "EN COMISIÓN DE DEFENSA DEL CONSUMIDOR",
    impact_level: "Grave",
    urgency_level: "Alta",
    owners: ["Marketing", "Legal & Compliance", "Producto"],
    requires_decision: true,
    is_pinned_for_publication: true,
  },
  {
    id: "bill-bts-003",
    legislation_id: "07355/2025-CR",
    legislation_type: "proyecto_de_ley",
    legislation_title: "PROYECTO DE LEY QUE REFUERZA LAS OBLIGACIONES DE JUEGO RESPONSABLE, AUTOEXCLUSIÓN Y PROTECCIÓN DE JUGADORES VULNERABLES",
    legislation_summary: "Crea el Registro Nacional de Personas Autoexcluidas (RNPA) administrado por MINCETUR/DGJCMT, obliga a operadores a integración técnica al RNPA en 90 días y eleva sanciones por incumplimiento de límites de depósito.",
    expert_commentary: "Cambio operativo y técnico relevante: requiere desarrollo de integración API con RNPA y actualización de flujos de KYC/onboarding. Tiempo de adecuación corto.",
    source_url: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/07355",
    author: "Bazán Calderón, Ruth Luque",
    current_stage: "EN COMISIÓN DE COMERCIO EXTERIOR Y TURISMO",
    impact_level: "Medio",
    urgency_level: "Alta",
    owners: ["Producto", "Tecnología", "Legal & Compliance"],
    requires_decision: true,
    is_pinned_for_publication: true,
  },
  {
    id: "bill-bts-004",
    legislation_id: "07301/2025-CR",
    legislation_type: "proyecto_de_ley",
    legislation_title: "PROYECTO DE LEY QUE AMPLÍA LAS OBLIGACIONES DE PREVENCIÓN DE LAVADO DE ACTIVOS PARA OPERADORES DE JUEGOS A DISTANCIA",
    legislation_summary: "Modifica la Ley N° 27693 incorporando expresamente a operadores de juegos a distancia y apuestas deportivas como sujetos obligados reforzados ante UIF-Perú: debida diligencia mejorada, monitoreo transaccional, ROS y reportes periódicos.",
    expert_commentary: "Confirma criterio actualmente aplicado. Implica formalizar manual AML específico y revisar umbrales de monitoreo. Coordinación con oficial de cumplimiento.",
    source_url: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/07301",
    author: "Cueto Aservi, José Ernesto",
    current_stage: "EN COMISIÓN DE ECONOMÍA",
    impact_level: "Medio",
    urgency_level: "Media",
    owners: ["AML", "Legal & Compliance"],
    requires_decision: false,
    is_pinned_for_publication: true,
  },
  {
    id: "bill-bts-005",
    legislation_id: "07268/2025-CR",
    legislation_type: "proyecto_de_ley",
    legislation_title: "PROYECTO DE LEY QUE REGULA LOS PROGRAMAS DE FIDELIZACIÓN, BONOS Y PROMOCIONES EN JUEGOS A DISTANCIA",
    legislation_summary: "Establece límites a montos y plazos de bonos de bienvenida, prohibe promociones dirigidas a usuarios autoexcluidos y exige aprobación previa de campañas por DGJCMT.",
    expert_commentary: "Bajo impacto inmediato; mayor fricción operativa para lanzar promos. Útil para benchmarking competitivo.",
    source_url: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/07268",
    author: "Echaiz de Núñez Izaga, Gladys",
    current_stage: "PRESENTADO",
    impact_level: "Leve",
    urgency_level: "Baja",
    owners: ["Marketing", "Producto"],
    requires_decision: false,
  },

  // ── Normas ───────────────────────────────────────────────────────────────
  {
    id: "norm-bts-001",
    legislation_id: "RD N° 0418-2026-MINCETUR/VMT/DGJCMT",
    legislation_type: "norma",
    legislation_title: "RESOLUCIÓN DIRECTORAL QUE APRUEBA NUEVOS REQUISITOS TÉCNICOS DE HOMOLOGACIÓN DE PLATAFORMAS TECNOLÓGICAS DE JUEGOS A DISTANCIA",
    legislation_summary: "Actualiza los requisitos técnicos de la plataforma (PAM, RGS, RNG certificado), establece informe técnico semestral firmado por laboratorio acreditado y nuevos plazos de notificación de cambios sustanciales.",
    expert_commentary: "Adecuación técnica obligatoria. Coordinar con proveedores de plataforma (PAM/RGS) y planificar auditoría de laboratorio acreditado antes del próximo trimestre.",
    source_url: "https://busquedas.elperuano.pe/normaslegales/rd-0418-2026-mincetur-vmt-dgjcmt",
    entity: "MINCETUR / DGJCMT",
    publication_date: "2026-05-02",
    current_stage: "VIGENTE",
    impact_level: "Grave",
    urgency_level: "Alta",
    owners: ["Tecnología", "Legal & Compliance", "Operaciones"],
    requires_decision: true,
    is_pinned_for_publication: true,
  },
  {
    id: "norm-bts-002",
    legislation_id: "RM N° 097-2026-MINCETUR",
    legislation_type: "norma",
    legislation_title: "RESOLUCIÓN MINISTERIAL QUE APRUEBA LA DIRECTIVA DE VERIFICACIÓN REFORZADA DE IDENTIDAD Y MAYORÍA DE EDAD (KYC) PARA OPERADORES DE JUEGOS A DISTANCIA",
    legislation_summary: "Establece estándares mínimos de KYC: validación biométrica obligatoria, cruce con RENIEC, prueba de vida y conservación de evidencia digital por 5 años. Plazo de adecuación: 60 días calendario.",
    expert_commentary: "Plazo corto. Validar capacidad del proveedor KYC actual y costos asociados. Posible reapertura de RFP si no cumple biometría + prueba de vida.",
    source_url: "https://busquedas.elperuano.pe/normaslegales/rm-097-2026-mincetur",
    entity: "MINCETUR",
    publication_date: "2026-04-30",
    current_stage: "VIGENTE",
    impact_level: "Grave",
    urgency_level: "Alta",
    owners: ["Producto", "Tecnología", "AML"],
    requires_decision: true,
    is_pinned_for_publication: true,
  },
  {
    id: "norm-bts-003",
    legislation_id: "Res. SBS N° 01554-2026",
    legislation_type: "norma",
    legislation_title: "RESOLUCIÓN SBS QUE INCORPORA A OPERADORES DE JUEGOS A DISTANCIA EN EL RÉGIMEN DE DEBIDA DILIGENCIA REFORZADA ANTE UIF-PERÚ",
    legislation_summary: "Define umbrales de debida diligencia reforzada, perfil transaccional esperado, criterios de PEP aplicables al sector y obligaciones de reporte periódico de operaciones inusuales.",
    expert_commentary: "Convergente con el PL 07301. Conviene anticipar implementación para no esperar la ley marco. Revisar manual AML y reglas de monitoreo.",
    source_url: "https://busquedas.elperuano.pe/normaslegales/sbs-01554-2026",
    entity: "SBS / UIF-Perú",
    publication_date: "2026-04-29",
    current_stage: "VIGENTE",
    impact_level: "Medio",
    urgency_level: "Media",
    owners: ["AML", "Legal & Compliance"],
    requires_decision: false,
    is_pinned_for_publication: true,
  },
  {
    id: "norm-bts-004",
    legislation_id: "RS N° 000088-2026/SUNAT",
    legislation_type: "norma",
    legislation_title: "RESOLUCIÓN DE SUPERINTENDENCIA QUE APRUEBA EL FORMULARIO VIRTUAL N° 1656 PARA LA DECLARACIÓN MENSUAL DEL IMPUESTO A LOS JUEGOS A DISTANCIA Y APUESTAS DEPORTIVAS A DISTANCIA",
    legislation_summary: "Aprueba estructura del formulario virtual con detalle de premios entregados, devoluciones efectuadas y gastos de mantenimiento de la plataforma. Vigente para período mayo 2026.",
    expert_commentary: "Trámite operativo positivo: estandariza la declaración. Coordinar con Tributario y Tecnología para automatizar la extracción de cifras de la PAM.",
    source_url: "https://www.sunat.gob.pe/legislacion/superintendencia/2026/000088-2026.htm",
    entity: "SUNAT",
    publication_date: "2026-05-04",
    current_stage: "VIGENTE",
    impact_level: "Positivo",
    urgency_level: "Media",
    owners: ["Tributario", "Tecnología"],
    requires_decision: false,
  },
];

const SESSIONS: Session[] = [
  {
    id: "sess-bts-001",
    commission: "Comisión de Economía, Banca, Finanzas e Inteligencia Financiera",
    date: "2026-05-05",
    title: "Sesión Ordinaria — Debate del PL 07412 (ISC a juegos a distancia)",
    video_url: "https://www.youtube.com/@congresoperu",
    agenda_items: [
      "Predictamen del PL 07412/2025-CR (ISC sobre GGR de operadores autorizados).",
      "Exposición de SUNAT y MEF sobre proyección de recaudación.",
      "Intervención de gremio sectorial (APADELA) y operadores invitados.",
    ],
    expert_commentary: "Sesión clave para Betsson. La votación quedó pendiente para próxima sesión (12 may). Hay margen para incidir vía memos técnicos antes del predictamen final.",
    related_alert_ids: ["bill-bts-001"],
  },
  {
    id: "sess-bts-002",
    commission: "Comisión de Comercio Exterior y Turismo",
    date: "2026-05-04",
    title: "Sesión Ordinaria — Reglamento técnico de juegos a distancia y RNPA",
    video_url: "https://www.youtube.com/@congresoperu",
    agenda_items: [
      "Informe de DGJCMT sobre la RD 0418-2026 (homologación de plataformas).",
      "Predictamen del PL 07355 (Registro Nacional de Personas Autoexcluidas).",
      "Cuestiones previas: avance del cronograma de fiscalización 2026.",
    ],
    expert_commentary: "Doble relevancia: fija el calendario operativo (homologación) y deja entrever que el RNPA tendrá plazo de 90 días desde publicación.",
    related_alert_ids: ["norm-bts-001", "bill-bts-003"],
  },
  {
    id: "sess-bts-003",
    commission: "Comisión de Defensa del Consumidor y Organismos Reguladores",
    date: "2026-04-30",
    title: "Sesión Ordinaria — Publicidad de apuestas deportivas y patrocinios",
    video_url: "https://www.youtube.com/@congresoperu",
    agenda_items: [
      "Debate del PL 07388 (restricción de publicidad y patrocinios deportivos).",
      "Intervención de INDECOPI y de la Asociación Nacional de Anunciantes.",
      "Aporte de organizaciones de protección al menor.",
    ],
    expert_commentary: "El predictamen avanzaría con cambios menores. Probable inclusión de obligaciones de advertencia sanitaria. Riesgo alto para campañas Q3 2026.",
    related_alert_ids: ["bill-bts-002"],
  },
];

// ============================================================================
// HELPERS
// ============================================================================
const PROFILE_NAME = "Betsson Group";
const PROFILE_BRANDS = "Betsson · Betsafe · Inkabet";
const PERIOD_LABEL = "29 abr — 6 may 2026";
const PERIOD_PILL = "ÚLTIMOS 7 DÍAS";
const AUTHOR = "Sergio Pérez · Regulatory Affairs";
const REPORT_VERSION = "v20260506-0930";
const NOW = "06/05/2026 09:30";

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
  if (["grave", "alto"].includes(l)) return { bg: COLORS.graveBg, fg: COLORS.graveFg, label: level || "—" };
  if (l === "medio") return { bg: COLORS.medBg, fg: COLORS.medFg, label: level || "—" };
  if (l === "leve") return { bg: COLORS.leveBg, fg: COLORS.leveFg, label: level || "—" };
  if (l === "positivo") return { bg: COLORS.posBg, fg: COLORS.posFg, label: level || "—" };
  return { bg: COLORS.surfaceAlt, fg: COLORS.inkMuted, label: level || "—" };
}
function impactSolid(level?: string): string {
  const l = (level || "").toLowerCase();
  if (["grave", "alto"].includes(l)) return "#dc2626";
  if (l === "medio") return "#d97706";
  if (l === "leve") return "#ca8a04";
  if (l === "positivo") return "#16a34a";
  return COLORS.inkSubtle;
}
function truncate(s: string | undefined | null, n: number) {
  if (!s) return "";
  return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;
}
function formatDateEs(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("es-PE", { day: "2-digit", month: "long", year: "numeric" });
}

const bills = ALERTS.filter((a) => a.legislation_type === "proyecto_de_ley");
const norms = ALERTS.filter((a) => a.legislation_type === "norma");
const sortedByImpact = [...ALERTS].sort((a, b) => impactRank(b.impact_level) - impactRank(a.impact_level));
const topDevelopments = sortedByImpact.slice(0, 3);
const watchlist = sortedByImpact.slice(3, 7);
const decisionsNeeded = ALERTS.filter((a) => a.requires_decision);
const pinnedBills = bills.filter((a) => a.is_pinned_for_publication);
const pinnedNorms = norms.filter((a) => a.is_pinned_for_publication);
const sourceList = [...ALERTS, ...SESSIONS]
  .map((a: any) => ({ title: a.legislation_title || a.title, url: a.source_url || a.video_url }))
  .filter((s) => !!s.url) as { title: string; url: string }[];

// ============================================================================
// CHART HELPERS
// ============================================================================
function countBy(items: Alert[], key: (a: Alert) => string | undefined): { label: string; value: number }[] {
  const m = new Map<string, number>();
  items.forEach((it) => {
    const k = key(it);
    if (!k) return;
    m.set(k, (m.get(k) || 0) + 1);
  });
  return Array.from(m.entries()).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
}
function countOwners(items: Alert[]): { label: string; value: number }[] {
  const m = new Map<string, number>();
  items.forEach((it) => (it.owners || []).forEach((o) => m.set(o, (m.get(o) || 0) + 1)));
  return Array.from(m.entries()).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
}

const IMPACT_ORDER = ["Grave", "Medio", "Leve", "Positivo"];
const impactDist = IMPACT_ORDER.map((lvl) => ({
  label: lvl,
  value: ALERTS.filter((a) => (a.impact_level || "").toLowerCase() === lvl.toLowerCase()).length,
  color: impactSolid(lvl),
}));
const typeDist = [
  { label: "Proyectos de Ley", value: bills.length, color: COLORS.c2 },
  { label: "Normas", value: norms.length, color: COLORS.c4 },
];
const ownerDist = countOwners(ALERTS).slice(0, 7);
const sourceDist = countBy(ALERTS, (a) =>
  a.legislation_type === "norma" ? (a.entity || "Otro") : "Congreso de la República"
);

// View-based bar charts (avoid SVG layout flakiness inside flex grids).
function VBarChart({ data, height = 100 }: { data: { label: string; value: number; color?: string }[]; height?: number }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <View>
      <View style={{ flexDirection: "row", height, alignItems: "flex-end", borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingHorizontal: 4 }}>
        {data.map((d, i) => {
          const h = Math.max(2, (d.value / max) * (height - 14));
          return (
            <View key={i} style={{ flex: 1, alignItems: "center", marginHorizontal: 4 }}>
              <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold", color: COLORS.ink, marginBottom: 2 }}>{d.value}</Text>
              <View style={{ width: "70%", height: h, backgroundColor: d.color || COLORS.c2, borderTopLeftRadius: 2, borderTopRightRadius: 2 }} />
            </View>
          );
        })}
      </View>
      <View style={{ flexDirection: "row", paddingHorizontal: 4, marginTop: 4 }}>
        {data.map((d, i) => (
          <Text key={i} style={{ flex: 1, fontSize: 7, color: COLORS.inkMuted, textAlign: "center" }}>{d.label}</Text>
        ))}
      </View>
    </View>
  );
}

function HBarChart({ data }: { data: { label: string; value: number; color?: string }[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <View>
      {data.map((d, i) => {
        const pct = (d.value / max) * 100;
        return (
          <View key={i} style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
            <Text style={{ width: 90, fontSize: 7, color: COLORS.inkMuted }}>{truncate(d.label, 22)}</Text>
            <View style={{ flex: 1, height: 10, backgroundColor: COLORS.borderSoft, borderRadius: 2 }}>
              <View style={{ width: `${pct}%`, height: 10, backgroundColor: d.color || COLORS.c2, borderRadius: 2 }} />
            </View>
            <Text style={{ width: 18, fontSize: 7, fontFamily: "Helvetica-Bold", color: COLORS.ink, textAlign: "right" }}>{d.value}</Text>
          </View>
        );
      })}
    </View>
  );
}

// Stacked horizontal bar (single bar with multiple segments) — replaces donut.
function StackedBar({ data, total }: { data: { label: string; value: number; color: string }[]; total: number }) {
  const safeTotal = Math.max(1, total);
  return (
    <View>
      <View style={{ flexDirection: "row", height: 22, borderRadius: 4, overflow: "hidden", borderWidth: 1, borderColor: COLORS.border }}>
        {data.map((d, i) => (
          <View key={i} style={{ width: `${(d.value / safeTotal) * 100}%`, backgroundColor: d.color, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: "#fff" }}>{d.value}</Text>
          </View>
        ))}
      </View>
      <View style={{ marginTop: 6 }}>
        {data.map((d, i) => (
          <View key={i} style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}>
            <View style={{ width: 8, height: 8, backgroundColor: d.color, borderRadius: 2, marginRight: 6 }} />
            <Text style={{ fontSize: 8, color: COLORS.inkMuted }}>{d.label} · {d.value} ({Math.round((d.value / safeTotal) * 100)}%)</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function Legend({ items }: { items: { label: string; color: string; value?: number }[] }) {
  return (
    <View style={styles.legendRow}>
      {items.map((it, i) => (
        <View key={i} style={styles.legendItem}>
          <View style={[styles.legendSwatch, { backgroundColor: it.color }]} />
          <Text style={styles.legendText}>{it.label}{typeof it.value === "number" ? ` · ${it.value}` : ""}</Text>
        </View>
      ))}
    </View>
  );
}

// ============================================================================
// REUSABLE BLOCKS
// ============================================================================
function HeatmapTable({ items }: { items: Alert[] }) {
  return (
    <View style={styles.table}>
      <View style={styles.tHeadRow} fixed>
        <Text style={[styles.tHead, styles.cId]}>ID</Text>
        <Text style={[styles.tHead, styles.cTitle]}>TEMA</Text>
        <Text style={[styles.tHead, styles.cRisk]}>IMPACTO</Text>
        <Text style={[styles.tHead, styles.cStage]}>ESTADO</Text>
        <Text style={[styles.tHead, styles.cOwner]}>OWNER</Text>
        <Text style={[styles.tHead, styles.cAction]}>PRÓX. ACCIÓN</Text>
      </View>
      {items.map((a) => {
        const r = riskColor(a.impact_level);
        const owners = a.owners?.join(", ") || "—";
        const action = a.requires_decision ? "Decisión requerida" : a.current_stage ? `Seguir: ${truncate(a.current_stage, 22)}` : "Monitoreo";
        return (
          <View key={a.id} style={styles.tRow} wrap={false}>
            <Text style={[styles.tCell, styles.cId]}>{a.legislation_id || "—"}</Text>
            <Text style={[styles.tCell, styles.cTitle]}>{truncate(a.legislation_title, 110)}</Text>
            <View style={[styles.cRisk, { padding: 6 }]}>
              <Text style={[styles.riskTag, { backgroundColor: r.bg, color: r.fg }]}>{r.label}</Text>
            </View>
            <Text style={[styles.tCell, styles.cStage]}>{truncate(a.current_stage, 26) || "—"}</Text>
            <Text style={[styles.tCell, styles.cOwner]}>{truncate(owners, 28)}</Text>
            <Text style={[styles.tCell, styles.cAction]}>{action}</Text>
          </View>
        );
      })}
    </View>
  );
}

function AlertCard({ a }: { a: Alert }) {
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
    <View style={styles.card} wrap={false}>
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
          <Text style={styles.fieldText}>{a.requires_decision ? "Decisión interna pendiente. Definir postura y comunicar a owners." : "Monitoreo continuo del avance."}</Text>
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
}

// ============================================================================
// DOCUMENT
// ============================================================================
const Doc = (
  <Document>
    {/* PAGE 1 — Cover + Snapshot */}
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.brand}>LAWMETER · REGULATORY AFFAIRS BRIEF</Text>
        <Text style={styles.title}>Reporte Regulatorio</Text>
        <Text style={styles.subtitle}>{PROFILE_NAME} — {PROFILE_BRANDS}</Text>
        <Text style={styles.subtitle}>Período: {PERIOD_LABEL}</Text>
        <View style={styles.headerDivider} />
        <View style={styles.pillRow}>
          <Text style={styles.pill}>ALERTAS + SESIONES</Text>
          <Text style={styles.pill}>SOLO PINEADAS</Text>
          <Text style={styles.pill}>{PERIOD_PILL}</Text>
          <Text style={styles.pillRed}>{decisionsNeeded.length} REQUIEREN DECISIÓN</Text>
        </View>
        <View style={styles.controlBox}>
          <View style={styles.controlRow}>
            <View style={styles.controlCell}><Text style={styles.controlLabel}>PERÍODO</Text><Text style={styles.controlValue}>{PERIOD_LABEL}</Text></View>
            <View style={styles.controlCell}><Text style={styles.controlLabel}>JURISDICCIÓN</Text><Text style={styles.controlValue}>Perú</Text></View>
            <View style={styles.controlCell}><Text style={styles.controlLabel}>AUTOR / EQUIPO</Text><Text style={styles.controlValue}>{AUTHOR}</Text></View>
            <View style={styles.controlCell}><Text style={styles.controlLabel}>VERSIÓN</Text><Text style={styles.controlValue}>{REPORT_VERSION}</Text></View>
            <View style={styles.controlCell}><Text style={styles.controlLabel}>DISTRIBUCIÓN</Text><Text style={styles.controlValue}>{PROFILE_NAME} (confidencial)</Text></View>
            <View style={styles.controlCell}><Text style={styles.controlLabel}>COBERTURA</Text><Text style={styles.controlValue}>{bills.length} PL · {norms.length} normas · {SESSIONS.length} sesiones</Text></View>
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
              • {a.legislation_id ? `[${a.legislation_id}] ` : ""}{truncate(a.legislation_title, 130)}
              {a.impact_level ? `  —  Impacto: ${a.impact_level}` : ""}
            </Text>
          ))}
        </View>
        <View style={styles.snapshotBlock}>
          <Text style={styles.snapshotKicker}>WATCHLIST</Text>
          {watchlist.map((a) => (
            <Text key={a.id} style={styles.snapshotItem}>
              • {truncate(a.legislation_title, 120)}{a.current_stage ? `  ·  ${a.current_stage}` : ""}
            </Text>
          ))}
        </View>
        <View style={styles.snapshotBlockAlert}>
          <Text style={styles.snapshotKickerRed}>DECISIONES / SOPORTE REQUERIDO</Text>
          {decisionsNeeded.length === 0 ? (
            <Text style={styles.empty}>Ninguna decisión pendiente.</Text>
          ) : decisionsNeeded.map((a) => (
            <Text key={a.id} style={styles.snapshotItem}>
              • {truncate(a.legislation_title, 120)}{a.owners?.length ? `  —  Owner: ${a.owners.join(", ")}` : ""}
            </Text>
          ))}
        </View>
      </View>
      <Text style={styles.footer}>Generado por LawMeter • {NOW} • Confidencial</Text>
    </Page>

    {/* PAGE 2 — Visualizaciones */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionAccent} />
          <Text style={styles.sectionTitle}>VISUALIZACIONES</Text>
          <Text style={styles.sectionCount}>{ALERTS.length} ALERTAS · PERÍODO {PERIOD_LABEL.toUpperCase()}</Text>
        </View>
        <View style={styles.vizGrid}>
          <View style={styles.vizCell}>
            <View style={styles.vizCard}>
              <Text style={styles.vizTitle}>DISTRIBUCIÓN POR IMPACTO</Text>
              <Text style={styles.vizSub}>Clasificación IA por nivel</Text>
              <VBarChart data={impactDist} height={110} />
            </View>
          </View>
          <View style={styles.vizCell}>
            <View style={styles.vizCard}>
              <Text style={styles.vizTitle}>PROYECTOS DE LEY vs NORMAS</Text>
              <Text style={styles.vizSub}>Composición del período</Text>
              <StackedBar data={typeDist} total={typeDist.reduce((s, d) => s + d.value, 0)} />
            </View>
          </View>
          <View style={styles.vizCell}>
            <View style={styles.vizCard}>
              <Text style={styles.vizTitle}>OWNERS / ÁREAS INTERNAS</Text>
              <Text style={styles.vizSub}>Cantidad de alertas asignadas</Text>
              <HBarChart data={ownerDist.map((d) => ({ ...d, color: COLORS.c2 }))} />
            </View>
          </View>
          <View style={styles.vizCell}>
            <View style={styles.vizCard}>
              <Text style={styles.vizTitle}>FUENTE / AUTORIDAD</Text>
              <Text style={styles.vizSub}>Origen institucional de la alerta</Text>
              <HBarChart data={sourceDist.map((d) => ({ ...d, color: COLORS.c3 }))} />
            </View>
          </View>
        </View>
      </View>
      <Text style={styles.footer}>Generado por LawMeter • {NOW} • Confidencial</Text>
    </Page>

    {/* PAGE 3 — Heatmap PL */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionAccent} />
          <Text style={styles.sectionTitle}>HEATMAP REGULATORIO</Text>
          <Text style={styles.sectionCount}>PL: {pinnedBills.length} · NORMAS: {pinnedNorms.length}</Text>
        </View>

        <View style={styles.subSectionHeader}>
          <Text style={styles.subSectionTitle}>PROYECTOS DE LEY</Text>
          <Text style={styles.subSectionCount}>{pinnedBills.length} PINEADOS</Text>
        </View>
        {pinnedBills.length === 0
          ? <Text style={styles.empty}>Sin proyectos de ley pineados.</Text>
          : <HeatmapTable items={pinnedBills} />}

        <View style={styles.subSectionHeader}>
          <Text style={styles.subSectionTitle}>NORMAS</Text>
          <Text style={styles.subSectionCount}>{pinnedNorms.length} PINEADAS</Text>
        </View>
        {pinnedNorms.length === 0
          ? <Text style={styles.empty}>Sin normas pineadas.</Text>
          : <HeatmapTable items={pinnedNorms} />}
      </View>
      <Text style={styles.footer}>Generado por LawMeter • {NOW} • Confidencial</Text>
    </Page>

    {/* PAGE 4+ — Fichas PL */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionAccent} />
          <Text style={styles.sectionTitle}>FICHAS — PROYECTOS DE LEY</Text>
          <Text style={styles.sectionCount}>{bills.length} ÍTEMS</Text>
        </View>
        {bills.map((a) => <AlertCard key={a.id} a={a} />)}
      </View>
      <Text style={styles.footer}>Generado por LawMeter • {NOW} • Confidencial</Text>
    </Page>

    {/* PAGE N — Fichas Normas */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionAccent} />
          <Text style={styles.sectionTitle}>FICHAS — NORMAS</Text>
          <Text style={styles.sectionCount}>{norms.length} ÍTEMS</Text>
        </View>
        {norms.map((a) => <AlertCard key={a.id} a={a} />)}
      </View>
      <Text style={styles.footer}>Generado por LawMeter • {NOW} • Confidencial</Text>
    </Page>

    {/* PAGE N+1 — Sesiones */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionAccent} />
          <Text style={styles.sectionTitle}>SESIONES DE COMISIONES</Text>
          <Text style={styles.sectionCount}>{SESSIONS.length} EN EL PERÍODO</Text>
        </View>
        {SESSIONS.length === 0 ? (
          <Text style={styles.empty}>Sin sesiones registradas en el período seleccionado.</Text>
        ) : SESSIONS.map((s) => (
          <View key={s.id} style={styles.sessionCard} wrap={false}>
            <Text style={styles.sessionMeta}>{s.commission} · {formatDateEs(s.date)}</Text>
            <Text style={styles.sessionTitle}>{s.title}</Text>
            <View style={styles.cardDivider} />
            <Text style={styles.bodyLabel}>AGENDA RELEVANTE</Text>
            {s.agenda_items.map((it, i) => (
              <Text key={i} style={styles.sessionItem}>• {it}</Text>
            ))}
            {s.expert_commentary && (
              <View style={styles.commentary}>
                <Text style={styles.commentaryLabel}>COMENTARIO EXPERTO</Text>
                <Text style={styles.commentaryText}>{s.expert_commentary}</Text>
              </View>
            )}
            {s.video_url && (
              <View style={{ marginTop: 8 }}>
                <Text style={styles.bodyLabel}>VIDEO OFICIAL</Text>
                <Link src={s.video_url} style={styles.sourceLink}>{s.video_url}</Link>
              </View>
            )}
          </View>
        ))}
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

const out = process.argv[2] || "/mnt/documents/reporte-betsson-2026-05-06.pdf";
await renderToFile(Doc, out);
console.log("WROTE", out);
