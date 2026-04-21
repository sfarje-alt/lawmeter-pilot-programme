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
import { captureAnalyticsSnapshots } from "./captureAnalyticsSnapshots";
import { useAlerts } from "@/contexts/AlertsContext";
import { PeruAlert } from "@/data/peruAlertsMockData";
import { MOCK_CLIENT_PROFILES } from "@/data/mockClientProfiles";
import { useSesionesWorkspace } from "@/hooks/useSesionesWorkspace";
import type { PeruSession } from "@/types/peruSessions";
import {
  ANALYTICS_BLOCK_REGISTRY,
  type AnalyticsBlockConfigExtended,
  type AnalyticsBlockDefinition,
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

function readCompanyName(): string {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.legalName) return parsed.legalName;
    }
  } catch {
    /* ignore */
  }
  return MOCK_CLIENT_PROFILES[0]?.legalName || "Mi Organización";
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
  analyticsImagePage: { padding: 0, backgroundColor: COLORS.surface },
  analyticsImage: { width: "100%", height: "auto" },
});

// ─────────────────────────────────────────────────────────────────────────────
// MiniChart — vector-sharp SVG primitives reused by analytics blocks
// ─────────────────────────────────────────────────────────────────────────────
const CHART_WIDTH = 460;
const CHART_HEIGHT = 130;
const CHART_PADDING = { top: 10, right: 110, bottom: 26, left: 32 };
const AXIS_COLOR = "#cbd5e0";
const GRID_COLOR = "#edf2f7";
const LABEL_COLOR = "#718096";

const BLOCK_PALETTES: Record<string, string[]> = {
  editorial_response_time: ["#1a365d", "#2b6cb0", "#3182ce", "#63b3ed"],
  pin_archive:             ["#0f766e", "#14b8a6", "#5eead4", "#99f6e4"],
  reviewed_alerts:         ["#7c2d12", "#ea580c", "#fb923c", "#fdba74"],
  detection_to_action_time:["#365314", "#65a30d", "#a3e635", "#d9f99d"],
  ai_usage:                ["#581c87", "#9333ea", "#c084fc", "#e9d5ff"],
  reports_generated:       ["#1e3a8a", "#3b82f6", "#93c5fd", "#dbeafe"],
  impact_matrix:           ["#7f1d1d", "#dc2626", "#f97316", "#facc15", "#22c55e", "#16a34a"],
  regulatory_pulse:        ["#155e75", "#0891b2", "#22d3ee", "#a5f3fc"],
  alert_priority:          ["#991b1b", "#dc2626", "#f59e0b", "#10b981"],
  alert_distribution:      ["#1d4ed8", "#0d9488", "#f59e0b", "#db2777", "#7c3aed", "#0ea5e9"],
  top_entities:            ["#1e40af", "#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"],
  legislative_funnel:      ["#1e3a8a", "#1d4ed8", "#3b82f6", "#60a5fa", "#93c5fd"],
  key_movements:           ["#831843", "#be185d", "#ec4899", "#f9a8d4", "#fbcfe8"],
  popular_topics:          ["#134e4a", "#0f766e", "#14b8a6", "#5eead4", "#99f6e4", "#ccfbf1"],
  emerging_topics:         ["#713f12", "#a16207", "#eab308", "#fde047", "#fef08a"],
  exposure:                ["#312e81", "#4f46e5", "#818cf8", "#a5b4fc", "#c7d2fe"],
  service_kpis:            ["#0c4a6e", "#0369a1", "#0ea5e9", "#7dd3fc"],
};
const DEFAULT_PALETTE = ["#1a365d", "#2b6cb0", "#3182ce", "#63b3ed", "#90cdf4", "#bee3f8"];

function getPalette(blockKey?: string): string[] {
  return (blockKey && BLOCK_PALETTES[blockKey]) || DEFAULT_PALETTE;
}

interface SeriesPoint { label: string; value: number; }

function computeYTicks(maxValue: number, desired = 4): number[] {
  if (maxValue <= 0) return [0, 1];
  const rawStep = maxValue / desired;
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const norm = rawStep / mag;
  const niceNorm = norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10;
  const step = niceNorm * mag;
  const niceMax = Math.ceil(maxValue / step) * step;
  const ticks: number[] = [];
  for (let v = 0; v <= niceMax + 1e-9; v += step) ticks.push(Math.round(v * 100) / 100);
  return ticks;
}

const fmtNum = (n: number) => (Number.isInteger(n) ? n.toString() : n.toFixed(1));

function computeBlockSeries(
  block: AnalyticsBlockConfigExtended,
  alerts: PeruAlert[],
  sessions: PeruSession[],
): SeriesPoint[] {
  const fallback: SeriesPoint[] = [
    { label: "S1", value: 4 },
    { label: "S2", value: 6 },
    { label: "S3", value: 5 },
    { label: "S4", value: 8 },
    { label: "S5", value: 7 },
    { label: "S6", value: 9 },
  ];

  const countBy = <T,>(items: T[], pick: (i: T) => string | undefined | null) => {
    const map = new Map<string, number>();
    for (const it of items) {
      const k = (pick(it) || "—").toString().trim();
      if (!k) continue;
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([label, value]) => ({ label, value }));
  };

  switch (block.key) {
    case "impact_matrix":
    case "alert_priority": {
      const data = countBy(alerts, (a: any) => a.impact_level);
      return data.length ? data.slice(0, 4) : [
        { label: "Grave", value: 3 }, { label: "Medio", value: 6 },
        { label: "Leve", value: 9 }, { label: "Positivo", value: 4 },
      ];
    }
    case "alert_distribution": {
      const data = countBy(alerts, (a) => a.legislation_type === "norma" ? "Normas" : "Proyectos");
      return data.length ? data : [{ label: "Proyectos", value: 7 }, { label: "Normas", value: 5 }];
    }
    case "top_entities":
    case "popular_topics":
    case "exposure": {
      const data = countBy(alerts, (a: any) => a.entity || a.author || (a.affected_areas?.[0]));
      const maxItems = (block as any).maxItems ?? 6;
      return (data.length ? data : fallback).slice(0, maxItems);
    }
    case "legislative_funnel": {
      const data = countBy(alerts, (a) => a.current_stage);
      return data.length ? data.slice(0, 5) : [
        { label: "Comisión", value: 12 }, { label: "Pleno", value: 7 },
        { label: "Trámite", value: 4 }, { label: "Promulgado", value: 2 },
      ];
    }
    case "regulatory_pulse":
    case "reviewed_alerts":
    case "editorial_response_time":
    case "reports_generated": {
      const buckets = new Map<string, number>();
      const items: { date: string }[] = [
        ...alerts.map((a) => ({ date: a.updated_at })),
        ...sessions.map((s) => ({ date: s.scheduled_at ?? s.created_at ?? new Date().toISOString() })),
      ];
      for (const it of items) {
        try {
          const d = parseISO(it.date);
          const k = format(d, "dd MMM", { locale: es });
          buckets.set(k, (buckets.get(k) ?? 0) + 1);
        } catch { /* skip */ }
      }
      const arr = Array.from(buckets.entries())
        .map(([label, value]) => ({ label, value }))
        .slice(-8);
      return arr.length ? arr : fallback;
    }
    case "key_movements":
    case "emerging_topics": {
      const data = countBy(alerts, (a: any) => a.affected_areas?.[0] || a.law_branch);
      return data.length ? data.slice(0, 5) : fallback.slice(0, 5);
    }
    case "service_kpis":
    case "pin_archive":
    case "ai_usage":
    case "detection_to_action_time": {
      const pinned = alerts.filter((a: any) => a.is_pinned_for_publication).length;
      const archived = alerts.filter((a: any) => a.archived_at).length;
      const total = Math.max(alerts.length, 1);
      return [
        { label: "Pinneadas", value: pinned },
        { label: "Archivadas", value: archived },
        { label: "Activas", value: total - pinned - archived },
      ];
    }
    default:
      return fallback;
  }
}

interface MiniChartProps {
  type: AnalyticsBlockDefinition["chartType"];
  data: SeriesPoint[];
  blockKey?: string;
}

const MiniChart = ({ type, data, blockKey }: MiniChartProps) => {
  const palette = getPalette(blockKey);
  const W = CHART_WIDTH;
  const H = CHART_HEIGHT;
  const needsLegend = type === "pie" || type === "bar" || type === "stacked_bar" || type === "funnel" || type === "matrix" || type === "cards" || type === "kpi";
  const padding = needsLegend ? CHART_PADDING : { ...CHART_PADDING, right: 14 };
  const { top, right, bottom, left } = padding;
  const innerW = W - left - right;
  const innerH = H - top - bottom;
  const max = Math.max(1, ...data.map((d) => d.value));
  const ticks = computeYTicks(max, 4);
  const yMax = ticks[ticks.length - 1] || max;
  const valToY = (v: number) => top + innerH - (v / yMax) * innerH;

  const yAxis = (
    <G>
      {ticks.map((t, i) => (
        <G key={i}>
          <SvgLine
            x1={left}
            y1={valToY(t)}
            x2={left + innerW}
            y2={valToY(t)}
            stroke={t === 0 ? AXIS_COLOR : GRID_COLOR}
            strokeWidth={0.5}
          />
          <Text x={left - 4} y={valToY(t) + 2} style={{ fontSize: 6, color: LABEL_COLOR, textAlign: "right" }}>
            {fmtNum(t)}
          </Text>
        </G>
      ))}
      <SvgLine x1={left} y1={top} x2={left} y2={top + innerH} stroke={AXIS_COLOR} strokeWidth={0.5} />
    </G>
  );

  const legend = (slice: SeriesPoint[]) => (
    <G>
      {slice.map((d, i) => (
        <G key={`lg-${i}`}>
          <Rect x={W - right + 6} y={top + 2 + i * 11} width={6} height={6} fill={palette[i % palette.length]} />
          <Text x={W - right + 16} y={top + 8 + i * 11} style={{ fontSize: 6.5, color: "#2d3748" }}>
            {d.label.length > 16 ? d.label.slice(0, 16) + "…" : d.label}: {fmtNum(d.value)}
          </Text>
        </G>
      ))}
    </G>
  );

  if (type === "line" || type === "timeline") {
    const stepX = data.length > 1 ? innerW / (data.length - 1) : innerW;
    const points = data.map((d, i) => `${left + i * stepX},${valToY(d.value)}`).join(" ");
    return (
      <Svg width={W} height={H}>
        {yAxis}
        <Polyline points={points} fill="none" stroke={palette[1] ?? palette[0]} strokeWidth={1.5} />
        {data.map((d, i) => (
          <G key={i}>
            <Circle cx={left + i * stepX} cy={valToY(d.value)} r={2} fill={palette[0]} />
            <Text x={left + i * stepX} y={H - 6} style={{ fontSize: 6, color: LABEL_COLOR, textAlign: "center" }}>
              {d.label}
            </Text>
          </G>
        ))}
      </Svg>
    );
  }

  if (type === "pie") {
    const total = data.reduce((s, d) => s + d.value, 0) || 1;
    const cx = left + innerW / 2;
    const cy = top + innerH / 2;
    const r = Math.min(innerH, innerW) / 2 - 4;
    let startAngle = -Math.PI / 2;
    const arcs = data.map((d, i) => {
      const angle = (d.value / total) * Math.PI * 2;
      const endAngle = startAngle + angle;
      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cy + r * Math.sin(endAngle);
      const large = angle > Math.PI ? 1 : 0;
      const path = `M ${cx},${cy} L ${x1},${y1} A ${r},${r} 0 ${large} 1 ${x2},${y2} Z`;
      const node = <Path key={i} d={path} fill={palette[i % palette.length]} />;
      startAngle = endAngle;
      return node;
    });
    return (
      <Svg width={W} height={H}>
        {arcs}
        {legend(data)}
      </Svg>
    );
  }

  if (type === "funnel") {
    const rowH = innerH / Math.max(data.length, 1);
    return (
      <Svg width={W} height={H}>
        {data.map((d, i) => {
          const w = (d.value / yMax) * innerW;
          const x = left + (innerW - w) / 2;
          const y = top + i * rowH + 2;
          return (
            <G key={i}>
              <Rect x={x} y={y} width={w} height={rowH - 4} fill={palette[i % palette.length]} />
              <Text x={left + innerW / 2} y={y + rowH / 2 + 2} style={{ fontSize: 6.5, color: "#ffffff", textAlign: "center" }}>
                {d.label} · {d.value}
              </Text>
            </G>
          );
        })}
        {legend(data)}
      </Svg>
    );
  }

  if (type === "matrix") {
    const cols = Math.max(1, Math.ceil(data.length / 2));
    const rows = data.length > cols ? 2 : 1;
    const cellW = innerW / cols;
    const cellH = innerH / rows;
    return (
      <Svg width={W} height={H}>
        {data.map((d, i) => {
          const r = Math.floor(i / cols);
          const c = i % cols;
          const intensity = d.value / yMax;
          const fill = palette[Math.min(palette.length - 1, Math.floor(intensity * (palette.length - 1)))];
          return (
            <G key={i}>
              <Rect x={left + c * cellW + 1} y={top + r * cellH + 1} width={cellW - 2} height={cellH - 2} fill={fill} />
              <Text x={left + c * cellW + cellW / 2} y={top + r * cellH + cellH / 2 + 2} style={{ fontSize: 7, color: "#ffffff", textAlign: "center" }}>
                {d.label}: {d.value}
              </Text>
            </G>
          );
        })}
        {legend(data)}
      </Svg>
    );
  }

  if (type === "kpi" || type === "cards") {
    const visible = data.slice(0, 4);
    const cols = Math.max(visible.length, 1);
    const tileW = innerW / cols;
    return (
      <Svg width={W} height={H}>
        {visible.map((d, i) => {
          const fill = palette[i % palette.length];
          return (
            <G key={i}>
              <Rect x={left + i * tileW + 4} y={top + 4} width={tileW - 8} height={innerH - 8} fill={fill} />
              <Text x={left + i * tileW + tileW / 2} y={top + innerH / 2} style={{ fontSize: 16, color: "#ffffff", textAlign: "center" }}>
                {fmtNum(d.value)}
              </Text>
              <Text x={left + i * tileW + tileW / 2} y={top + innerH / 2 + 14} style={{ fontSize: 7, color: "#ffffff", textAlign: "center" }}>
                {d.label}
              </Text>
            </G>
          );
        })}
        {legend(visible)}
      </Svg>
    );
  }

  // default: vertical bars (bar / stacked_bar) — multicolor + Y axis + legend
  const barW = innerW / Math.max(data.length, 1);
  return (
    <Svg width={W} height={H}>
      {yAxis}
      {data.map((d, i) => {
        const h = (d.value / yMax) * innerH;
        const x = left + i * barW + barW * 0.18;
        const y = top + innerH - h;
        const w = barW * 0.64;
        return (
          <G key={i}>
            <Rect x={x} y={y} width={w} height={h} fill={palette[i % palette.length]} />
            <Text x={x + w / 2} y={y - 2} style={{ fontSize: 6, color: "#1a365d", textAlign: "center" }}>
              {fmtNum(d.value)}
            </Text>
            <Text x={x + w / 2} y={H - 6} style={{ fontSize: 6, color: LABEL_COLOR, textAlign: "center" }}>
              {d.label.length > 10 ? d.label.slice(0, 10) + "…" : d.label}
            </Text>
          </G>
        );
      })}
      {legend(data)}
    </Svg>
  );
};

interface PDFProps {
  alerts: PeruAlert[];
  sessions: PeruSession[];
  analyticsBlocks: AnalyticsBlockConfigExtended[];
  source: SourceMode;
  inclusion: InclusionMode;
  includeAnalytics: boolean;
  profileName: string;
  periodLabel: string;
}

const ReportPDF = ({
  alerts,
  sessions,
  analyticsBlocks,
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>LAWMETER</Text>
          <Text style={styles.title}>Reporte Regulatorio</Text>
          <Text style={styles.subtitle}>{profileName}</Text>
          <Text style={styles.subtitle}>{format(new Date(), "d 'de' MMMM yyyy", { locale: es })}</Text>
          <View style={styles.pillRow}>
            <Text style={styles.pill}>{sourceLabel}</Text>
            <Text style={styles.pill}>{inclusionLabel}</Text>
            <Text style={styles.pill}>{periodLabel}</Text>
            {includeAnalytics && <Text style={styles.pill}>+ Analíticas</Text>}
          </View>
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>RESUMEN EJECUTIVO</Text>
          {showAlerts && <Text style={styles.summaryItem}>• {alerts.length} alertas regulatorias</Text>}
          {showSessions && <Text style={styles.summaryItem}>• {sessions.length} alertas de sesiones</Text>}
          {includeAnalytics && (
            <Text style={styles.summaryItem}>• {analyticsBlocks.length} bloques de analíticas</Text>
          )}
        </View>

        {/* SECCIÓN: Alertas regulatorias */}
        {showAlerts && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ALERTAS REGULATORIAS</Text>
            {alerts.length === 0 ? (
              <Text style={styles.empty}>Sin alertas en el período seleccionado.</Text>
            ) : (
              alerts.map((a) => {
                const iaParts: string[] = [];
                if ((a as any).impact_level) iaParts.push(`Impacto: ${(a as any).impact_level}`);
                if ((a as any).urgency_level) iaParts.push(`Urgencia: ${(a as any).urgency_level}`);
                if (a.current_stage) iaParts.push(`Etapa: ${a.current_stage}`);
                const iaLine = iaParts.join(" · ");
                const commentary = a.expert_commentary?.replace(/<[^>]+>/g, "").trim();
                const meta: string[] = [];
                if (a.legislation_id) meta.push(a.legislation_id);
                if (a.legislation_type === "proyecto_de_ley" && a.author) meta.push(`Autor: ${a.author}`);
                if (a.legislation_type === "norma" && a.entity) meta.push(`Entidad: ${a.entity}`);
                if (a.legislation_type === "norma" && a.publication_date) meta.push(`Publicado: ${a.publication_date}`);

                return (
                  <View key={a.id} style={styles.card} wrap={false}>
                    <Text style={styles.cardTitle}>{a.legislation_title}</Text>
                    {meta.length > 0 && <Text style={styles.cardMeta}>{meta.join(" · ")}</Text>}
                    {a.legislation_summary && (
                      <Text style={styles.cardBody}>{a.legislation_summary.slice(0, 320)}</Text>
                    )}
                    {iaLine && (
                      <View style={styles.ia}>
                        <Text style={styles.iaLabel}>CLASIFICACIÓN IA</Text>
                        <Text>{iaLine}</Text>
                      </View>
                    )}
                    {commentary && (
                      <View style={styles.commentary}>
                        <Text style={styles.commentaryLabel}>COMENTARIO EXPERTO</Text>
                        <Text>{commentary}</Text>
                      </View>
                    )}
                    {a.source_url && <Link src={a.source_url} style={styles.link}>Fuente oficial</Link>}
                  </View>
                );
              })
            )}
          </View>
        )}

        {/* SECCIÓN: Sesiones */}
        {showSessions && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SESIONES DEL CONGRESO</Text>
            {sessions.length === 0 ? (
              <Text style={styles.empty}>Sin sesiones en el período seleccionado.</Text>
            ) : (
              sessions.map((s) => {
                const item = s.agenda_item;
                const title = item ? `Ítem ${item.item_number} · ${item.title}` : (s.session_title ?? s.commission_name);
                const when = s.scheduled_date_text ?? (s.scheduled_at ? format(parseISO(s.scheduled_at), "dd/MM/yyyy HH:mm") : "");

                const iaParts: string[] = [];
                if (s.impact_level) iaParts.push(`Impacto: ${s.impact_level}`);
                if (s.urgency_level) iaParts.push(`Urgencia: ${s.urgency_level}`);
                if (s.etiqueta_ia) iaParts.push(`Etiqueta: ${s.etiqueta_ia}`);
                const iaLine = iaParts.join(" · ");

                const summary = (s.executive_summary || s.chatbot_summary || "").trim();

                return (
                  <View key={s.id} style={styles.card} wrap={false}>
                    <Text style={styles.cardTitle}>{title}</Text>
                    <Text style={styles.cardMeta}>
                      Comisión: {s.commission_name}{when ? ` · ${when}` : ""}
                    </Text>
                    {summary && (
                      <Text style={styles.cardBody}>{summary.slice(0, 400)}</Text>
                    )}
                    {iaLine && (
                      <View style={styles.ia}>
                        <Text style={styles.iaLabel}>CLASIFICACIÓN IA</Text>
                        <Text>{iaLine}</Text>
                      </View>
                    )}
                    {s.recording?.video_url && (
                      <Link src={s.recording.video_url} style={styles.link}>Grabación oficial</Link>
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

      {/* SECCIÓN: Analíticas (página separada, refleja bloques visibles en Analíticas) */}
      {includeAnalytics && analyticsBlocks.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.brand}>LAWMETER</Text>
            <Text style={styles.title}>Analíticas</Text>
            <Text style={styles.subtitle}>{periodLabel}</Text>
            <Text style={styles.subtitle}>
              Refleja los bloques visibles en la sección Analíticas al momento de la generación.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>BLOQUES VISUALIZADOS</Text>
            {analyticsBlocks.map((b) => {
              const def = ANALYTICS_BLOCK_REGISTRY.find((r) => r.key === b.key);
              const chartType = def?.chartType ?? "bar";
              const series = computeBlockSeries(b, alerts, sessions);
              return (
                <View key={b.key} style={styles.analyticsBlock} wrap={false}>
                  <Text style={styles.analyticsBlockTitle}>{b.title}</Text>
                  <Text style={styles.analyticsBlockMeta}>
                    {b.visibility === "internal" ? "Operación interna" : "Cliente / Equipo Legal"} · {periodLabel}
                  </Text>
                  <View style={{ marginVertical: 6 }}>
                    <MiniChart type={chartType} data={series} blockKey={b.key} />
                  </View>
                  <Text style={styles.analyticsBlockBody}>{b.takeaway}</Text>
                </View>
              );
            })}
          </View>

          <Text style={styles.footer}>
            Generado por LawMeter • {format(new Date(), "dd/MM/yyyy HH:mm")} • Confidencial
          </Text>
        </Page>
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
  const { alerts } = useAlerts();
  const { sessions: allSessions } = useSesionesWorkspace();
  const profileName = useMemo(() => readCompanyName(), []);

  // Tab
  const [tab, setTab] = useState<"create" | "scheduled" | "generated">("create");

  // Builder state
  const [source, setSource] = useState<SourceMode>("mixto");
  const [inclusion, setInclusion] = useState<InclusionMode>("todas");
  const [daysBack, setDaysBack] = useState<number>(7);
  const [includeAnalytics, setIncludeAnalytics] = useState<boolean>(true);

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
    return allSessions.filter((s) => {
      if (s.is_archived) return false;
      // period (use scheduled_at if present)
      try {
        const ref = s.scheduled_at ? parseISO(s.scheduled_at) : null;
        if (ref && isBefore(ref, periodCutoff)) return false;
      } catch {
        /* keep */
      }
      // inclusion
      if (inclusion === "pineadas" && !s.is_pinned) return false;
      return true;
    });
  }, [allSessions, source, inclusion, periodCutoff]);

  const periodLabel = buildPeriodLabel(daysBack);
  const visibleAnalytics = useMemo(() => readVisibleAnalyticsBlocks(), [tab]); // refresh when tab changes

  const totalItems = filteredAlerts.length + filteredSessions.length;
  const canGenerate = totalItems > 0;

  const sourceBadge = (s: SourceMode) =>
    s === "alertas" ? "Alertas" : s === "sesiones" ? "Sesiones" : "Mixto";

  // ── Actions
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
      : allSessions.filter((sess) => {
          if (sess.is_archived) return false;
          try {
            const ref = sess.scheduled_at ? parseISO(sess.scheduled_at) : null;
            if (ref && isBefore(ref, cutoff)) return false;
          } catch {
            /* keep */
          }
          if (s.inclusion === "pineadas" && !sess.is_pinned) return false;
          return true;
        });

    const blob = await pdf(
      <ReportPDF
        alerts={a}
        sessions={ss}
        analyticsBlocks={visibleAnalytics}
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
            <Badge variant="secondary">{schedules.length}</Badge>
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
                {canGenerate ? (
                  <PDFDownloadLink
                    document={
                      <ReportPDF
                        alerts={filteredAlerts}
                        sessions={filteredSessions}
                        analyticsBlocks={visibleAnalytics}
                        source={source}
                        inclusion={inclusion}
                        includeAnalytics={includeAnalytics}
                        profileName={profileName}
                        periodLabel={periodLabel}
                      />
                    }
                    fileName={`reporte-${source}-${format(new Date(), "yyyy-MM-dd")}.pdf`}
                  >
                    {({ loading }) => (
                      <Button size="lg" className="w-full" disabled={loading} onClick={() => !loading && recordGenerated("manual")}>
                        {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                        {loading ? "Generando PDF..." : "Generar y descargar"}
                      </Button>
                    )}
                  </PDFDownloadLink>
                ) : (
                  <Button size="lg" className="w-full" disabled>
                    <Download className="h-4 w-4 mr-2" />
                    Sin contenido para el período
                  </Button>
                )}
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
