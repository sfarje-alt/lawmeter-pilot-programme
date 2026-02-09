// Static Demo Analytics Data for Nov 2025 - Jan 2026
// Pre-calculated datasets for demonstration purposes
// These do NOT modify the inbox or alert data

import type { TimeSeriesDataPoint, RankingItem, KPIMetric } from "@/types/analytics";

// Regulatory Pulse - Weekly volume series
export const DEMO_REGULATORY_PULSE = {
  chartData: [
    { date: "2025-11-03", total: 8, bills: 5, regulations: 3, ids: [] },
    { date: "2025-11-10", total: 12, bills: 7, regulations: 5, ids: [] },
    { date: "2025-11-17", total: 10, bills: 4, regulations: 6, ids: [] },
    { date: "2025-11-24", total: 15, bills: 9, regulations: 6, ids: [] },
    { date: "2025-12-01", total: 11, bills: 6, regulations: 5, ids: [] },
    { date: "2025-12-08", total: 14, bills: 8, regulations: 6, ids: [] },
    { date: "2025-12-15", total: 7, bills: 3, regulations: 4, ids: [] },
    { date: "2025-12-22", total: 5, bills: 2, regulations: 3, ids: [] },
    { date: "2025-12-29", total: 9, bills: 5, regulations: 4, ids: [] },
    { date: "2026-01-05", total: 13, bills: 8, regulations: 5, ids: [] },
    { date: "2026-01-12", total: 16, bills: 10, regulations: 6, ids: [] },
    { date: "2026-01-19", total: 11, bills: 6, regulations: 5, ids: [] },
  ],
  billsTotal: 73,
  regulationsTotal: 58,
  trendDirection: "up" as const,
  trendPercent: 18,
};

// Alert Priority - By impact level
export const DEMO_ALERT_PRIORITY = {
  chartData: [
    { name: "Grave", value: 12, color: "hsl(0, 65%, 50%)", key: "grave" },
    { name: "Medio", value: 28, color: "hsl(40, 75%, 50%)", key: "medio" },
    { name: "Leve", value: 35, color: "hsl(0, 0%, 55%)", key: "leve" },
    { name: "Positivo", value: 8, color: "hsl(140, 55%, 45%)", key: "positivo" },
  ],
  total: 83,
  highPriorityCount: 40,
};

// Alert Distribution - By type and area
export const DEMO_ALERT_DISTRIBUTION = {
  typeData: [
    { name: "Proyectos de Ley", value: 45, ids: [] },
    { name: "Normas", value: 55, ids: [] },
  ],
  areaData: [
    { name: "Salud Pública", value: 22, ids: [] },
    { name: "Regulación Farmacéutica", value: 18, ids: [] },
    { name: "Seguridad Social", value: 14, ids: [] },
    { name: "Dispositivos Médicos", value: 12, ids: [] },
    { name: "Propiedad Intelectual", value: 9, ids: [] },
    { name: "Comercio Internacional", value: 8, ids: [] },
  ],
};

// Impact Matrix - 3x3 values
export const DEMO_IMPACT_MATRIX = {
  "grave-alta": { value: 8, items: [] },
  "grave-media": { value: 3, items: [] },
  "grave-baja": { value: 1, items: [] },
  "medio-alta": { value: 7, items: [] },
  "medio-media": { value: 14, items: [] },
  "medio-baja": { value: 7, items: [] },
  "leve-alta": { value: 3, items: [] },
  "leve-media": { value: 12, items: [] },
  "leve-baja": { value: 20, items: [] },
};

// Legislative Funnel
export const DEMO_LEGISLATIVE_FUNNEL = [
  { stage: "EN COMISIÓN", count: 18, percentage: 40, items: [] },
  { stage: "DICTAMEN", count: 8, percentage: 18, items: [] },
  { stage: "EN AGENDA DEL PLENO", count: 5, percentage: 11, items: [] },
  { stage: "APROBADO", count: 3, percentage: 7, items: [] },
  { stage: "AUTÓGRAFA", count: 2, percentage: 4, items: [] },
  { stage: "PROMULGADA", count: 6, percentage: 13, items: [] },
  { stage: "AL ARCHIVO", count: 3, percentage: 7, items: [] },
];

// Top Entities ranking
export const DEMO_TOP_ENTITIES: RankingItem[] = [
  { id: "e1", label: "MINSA", value: 18 },
  { id: "e2", label: "ESSALUD", value: 14 },
  { id: "e3", label: "SUSALUD", value: 11 },
  { id: "e4", label: "DIGEMID", value: 9 },
  { id: "e5", label: "Congreso - Comisión de Salud", value: 8 },
  { id: "e6", label: "MEF", value: 6 },
  { id: "e7", label: "PCM", value: 5 },
  { id: "e8", label: "INDECOPI", value: 4 },
  { id: "e9", label: "SUNAT", value: 3 },
  { id: "e10", label: "OSCE", value: 2 },
];

// Popular Topics ranking
export const DEMO_POPULAR_TOPICS: RankingItem[] = [
  { id: "t1", label: "Salud Pública", value: 22 },
  { id: "t2", label: "Regulación Farmacéutica", value: 18 },
  { id: "t3", label: "Seguridad Social", value: 14 },
  { id: "t4", label: "Dispositivos Médicos", value: 12 },
  { id: "t5", label: "Propiedad Intelectual", value: 9 },
  { id: "t6", label: "Comercio Internacional", value: 8 },
  { id: "t7", label: "Medio Ambiente", value: 5 },
];

// Emerging Topics
export const DEMO_EMERGING_TOPICS: RankingItem[] = [
  { id: "et1", label: "Telemedicina", value: 7, change: { current: 7, previous: 2, change: 250, direction: "up" } },
  { id: "et2", label: "Regulación de IA en Salud", value: 5, change: { current: 5, previous: 1, change: 400, direction: "up" } },
  { id: "et3", label: "Cannabis Medicinal", value: 4, change: { current: 4, previous: 2, change: 100, direction: "up" } },
  { id: "et4", label: "Bioequivalencia", value: 3, change: { current: 3, previous: 3, change: 0, direction: "stable" } },
];

// Key Movements
export const DEMO_KEY_MOVEMENTS = {
  newItems: 8,
  stageChanges: 5,
  upcomingDeadlines: 3,
  items: [
    { id: "km1", type: "new" as const, title: "PL 7892 - Ley de Telemedicina", date: "2026-01-18", detail: "Presentado en Comisión de Salud" },
    { id: "km2", type: "progress" as const, title: "PL 6543 - Regulación de Dispositivos Médicos", date: "2026-01-15", detail: "Avanzó a Agenda del Pleno" },
    { id: "km3", type: "deadline" as const, title: "DS 024-2025 - Registro Sanitario", date: "2026-01-25", detail: "Plazo de adecuación vence en 7 días" },
    { id: "km4", type: "progress" as const, title: "PL 7234 - Precios de Medicamentos", date: "2026-01-12", detail: "Dictamen aprobado por unanimidad" },
    { id: "km5", type: "new" as const, title: "RM 045-2026 - Buenas Prácticas de Manufactura", date: "2026-01-10", detail: "Nueva resolución ministerial publicada" },
    { id: "km6", type: "deadline" as const, title: "DL 1504 - Etiquetado de Alimentos", date: "2026-02-01", detail: "Entrada en vigencia en 14 días" },
  ],
};

// Exposure by business area
export const DEMO_EXPOSURE: RankingItem[] = [
  { id: "ex1", label: "Operaciones", value: 28 },
  { id: "ex2", label: "Asuntos Regulatorios", value: 24 },
  { id: "ex3", label: "Compliance", value: 18 },
  { id: "ex4", label: "Comercial", value: 12 },
  { id: "ex5", label: "Propiedad Intelectual", value: 6 },
];

// Editorial Coverage (Internal)
export const DEMO_EDITORIAL_COVERAGE = {
  totalCaptured: 83,
  totalPublished: 52,
  coverageRate: 62.7,
  coverageTrend: [
    { date: "2025-11-03", value: 55 },
    { date: "2025-11-10", value: 60 },
    { date: "2025-11-17", value: 58 },
    { date: "2025-11-24", value: 65 },
    { date: "2025-12-01", value: 63 },
    { date: "2025-12-08", value: 70 },
    { date: "2025-12-15", value: 68 },
    { date: "2025-12-22", value: 72 },
    { date: "2025-12-29", value: 60 },
    { date: "2026-01-05", value: 62 },
    { date: "2026-01-12", value: 65 },
    { date: "2026-01-19", value: 63 },
  ] as TimeSeriesDataPoint[],
};

// Editorial Response Time (Internal)
export const DEMO_EDITORIAL_RESPONSE_TIME = {
  avgHours: 18,
  medianHours: 14,
  weeklyTrend: [
    { date: "2025-11-03", value: 22, label: "22h" },
    { date: "2025-11-10", value: 19, label: "19h" },
    { date: "2025-11-17", value: 24, label: "24h" },
    { date: "2025-11-24", value: 16, label: "16h" },
    { date: "2025-12-01", value: 18, label: "18h" },
    { date: "2025-12-08", value: 15, label: "15h" },
    { date: "2025-12-15", value: 20, label: "20h" },
    { date: "2025-12-22", value: 12, label: "12h" },
    { date: "2025-12-29", value: 14, label: "14h" },
    { date: "2026-01-05", value: 17, label: "17h" },
    { date: "2026-01-12", value: 16, label: "16h" },
    { date: "2026-01-19", value: 18, label: "18h" },
  ] as TimeSeriesDataPoint[],
};

// Operational Queue (Internal)
export const DEMO_OPERATIONAL_QUEUE = {
  byStage: [
    { stage: "EN COMISIÓN", count: 8, avgDaysInStage: 5 },
    { stage: "DICTAMEN", count: 4, avgDaysInStage: 3 },
    { stage: "Sin Estado", count: 3, avgDaysInStage: 7 },
  ],
  byPriority: [
    { priority: "Alta", count: 6 },
    { priority: "Media", count: 11 },
    { priority: "Baja", count: 6 },
  ],
  pendingReview: 15,
  pendingPublish: 8,
  totalInQueue: 23,
};

// Aggregated Entity Monitoring (Internal)
export const DEMO_AGGREGATED_ENTITIES: RankingItem[] = [
  { id: "ae1", label: "MINSA", value: 32 },
  { id: "ae2", label: "Congreso - Comisión de Salud", value: 24 },
  { id: "ae3", label: "ESSALUD", value: 18 },
  { id: "ae4", label: "SUSALUD", value: 15 },
  { id: "ae5", label: "DIGEMID", value: 12 },
  { id: "ae6", label: "MEF", value: 10 },
  { id: "ae7", label: "PCM", value: 8 },
  { id: "ae8", label: "Fuerza Popular", value: 7 },
  { id: "ae9", label: "Perú Libre", value: 6 },
  { id: "ae10", label: "Acción Popular", value: 5 },
];

// Service KPIs
export const DEMO_SERVICE_KPIS: KPIMetric[] = [
  { label: "Alertas Publicadas", value: 52, icon: "file-text" },
  { label: "Tiempo Típico", value: "< 24h", icon: "clock" },
  { label: "Con Comentario", value: 48, icon: "check-circle" },
];

// Industry Benchmark
export const DEMO_INDUSTRY_BENCHMARK = {
  chartData: [
    { metric: "Volumen de Alertas", client: 52, cohort: 38 },
    { metric: "Tasa Alto Impacto (%)", client: 48, cohort: 35 },
    { metric: "Diversidad de Temas", client: 7, cohort: 5 },
  ],
  cohortSize: 12,
  clientAboveAverage: true,
};

// Data freshness for demo
export const DEMO_DATA_FRESHNESS = {
  lastUpdate: "2026-01-20T09:00:00Z",
  dataThrough: "2026-01-19",
};
