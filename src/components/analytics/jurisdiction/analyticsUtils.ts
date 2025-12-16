// Jurisdiction Analytics Utility Functions
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";
import { subDays, differenceInDays, parseISO, isValid, startOfWeek, format } from "date-fns";

export type TimeWindow = "30d" | "90d" | "12m" | "custom";
export type NormalizeBy = "raw" | "per-week" | "percent";

// Convert time window to days
export function timeWindowToDays(window: TimeWindow): number {
  switch (window) {
    case "30d": return 30;
    case "90d": return 90;
    case "12m": return 365;
    default: return 90;
  }
}
export type SourceType = "gazette" | "parliament" | "regulator" | "court" | "executive";

// Infer source type from authority/instrument
export function inferSourceType(item: UnifiedLegislationItem): SourceType {
  const authority = (item.authority || "").toLowerCase();
  const instrument = (item.instrumentType || "").toLowerCase();
  
  if (authority.includes("congress") || authority.includes("parliament") || authority.includes("asamblea") || authority.includes("diet") || instrument.includes("bill")) {
    return "parliament";
  }
  if (authority.includes("court") || authority.includes("tribunal") || instrument.includes("ruling") || instrument.includes("case")) {
    return "court";
  }
  if (authority.includes("president") || authority.includes("executive") || instrument.includes("executive-order") || instrument.includes("decreto")) {
    return "executive";
  }
  if (authority.includes("agency") || authority.includes("commission") || authority.includes("ministry") || instrument.includes("regulation") || instrument.includes("guidance")) {
    return "regulator";
  }
  return "gazette";
}

// Get items within time window
export function filterByTimeWindow(
  items: UnifiedLegislationItem[],
  window: TimeWindow,
  customRange?: { start: Date; end: Date }
): UnifiedLegislationItem[] {
  const now = new Date();
  let cutoff: Date;
  
  if (window === "custom" && customRange) {
    return items.filter(item => {
      const date = parseItemDate(item.publishedDate);
      return date && date >= customRange.start && date <= customRange.end;
    });
  }
  
  const days = timeWindowToDays(window);
  cutoff = subDays(now, days);
  
  return items.filter(item => {
    const date = parseItemDate(item.publishedDate);
    return date && date >= cutoff;
  });
}

// Parse date string safely
export function parseItemDate(dateStr?: string): Date | null {
  if (!dateStr) return null;
  const date = parseISO(dateStr);
  return isValid(date) ? date : null;
}

// Calculate publications count with change
export function calculatePublicationsMetric(
  items: UnifiedLegislationItem[],
  currentDays: number = 30
): { count: number; change: number; previousCount: number } {
  const now = new Date();
  const currentCutoff = subDays(now, currentDays);
  const previousCutoff = subDays(now, currentDays * 2);
  
  const currentItems = items.filter(item => {
    const date = parseItemDate(item.publishedDate);
    return date && date >= currentCutoff;
  });
  
  const previousItems = items.filter(item => {
    const date = parseItemDate(item.publishedDate);
    return date && date >= previousCutoff && date < currentCutoff;
  });
  
  const count = currentItems.length;
  const previousCount = previousItems.length;
  const change = previousCount > 0 
    ? Math.round(((count - previousCount) / previousCount) * 100) 
    : count > 0 ? 100 : 0;
  
  return { count, change, previousCount };
}

// Calculate weekly velocity with sparkline data
export function calculateVelocity(
  items: UnifiedLegislationItem[],
  weeks: number = 12
): { average: number; sparklineData: number[] } {
  const now = new Date();
  const weeklyData: number[] = [];
  
  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = subDays(now, (i + 1) * 7);
    const weekEnd = subDays(now, i * 7);
    
    const weekItems = items.filter(item => {
      const date = parseItemDate(item.publishedDate);
      return date && date >= weekStart && date < weekEnd;
    });
    
    weeklyData.push(weekItems.length);
  }
  
  const average = weeklyData.length > 0 
    ? Math.round((weeklyData.reduce((a, b) => a + b, 0) / weeklyData.length) * 10) / 10
    : 0;
  
  return { average, sparklineData: weeklyData };
}

// Calculate median implementation runway
export function calculateRunwayMetric(
  items: UnifiedLegislationItem[]
): { median: number | null; sampleSize: number } {
  const runways: number[] = [];
  
  items.forEach(item => {
    const pubDate = parseItemDate(item.publishedDate);
    const effDate = parseItemDate(item.effectiveDate);
    
    if (pubDate && effDate) {
      const days = differenceInDays(effDate, pubDate);
      if (days >= 0) {
        runways.push(days);
      }
    }
  });
  
  if (runways.length === 0) {
    return { median: null, sampleSize: 0 };
  }
  
  runways.sort((a, b) => a - b);
  const mid = Math.floor(runways.length / 2);
  const median = runways.length % 2 === 0
    ? Math.round((runways[mid - 1] + runways[mid]) / 2)
    : runways[mid];
  
  return { median, sampleSize: runways.length };
}

// Calculate amendment intensity
export function calculateAmendmentIntensity(
  items: UnifiedLegislationItem[],
  days: number = 90
): { percentage: number | null; amendingCount: number; originalCount: number } {
  const cutoff = subDays(new Date(), days);
  const filtered = items.filter(item => {
    const date = parseItemDate(item.publishedDate);
    return date && date >= cutoff;
  });
  
  // Check if any items have amendment data
  const itemsWithAmendment = filtered.filter(item => 
    item.aiSummary?.relatedLegislation?.some(rel => rel.relationship === "amends")
  );
  
  if (filtered.length === 0) {
    return { percentage: null, amendingCount: 0, originalCount: 0 };
  }
  
  // Approximate: items that reference amending another document
  const amendingCount = itemsWithAmendment.length;
  const originalCount = filtered.length - amendingCount;
  const percentage = Math.round((amendingCount / filtered.length) * 100);
  
  return { percentage, amendingCount, originalCount };
}

// Calculate top authority share
export function calculateTopAuthorityShare(
  items: UnifiedLegislationItem[],
  days: number = 30
): { topAuthority: string; share: number; count: number } {
  const cutoff = subDays(new Date(), days);
  const filtered = items.filter(item => {
    const date = parseItemDate(item.publishedDate);
    return date && date >= cutoff;
  });
  
  if (filtered.length === 0) {
    return { topAuthority: "N/A", share: 0, count: 0 };
  }
  
  const authorityCounts: Record<string, number> = {};
  filtered.forEach(item => {
    const auth = item.authority || "Unknown";
    authorityCounts[auth] = (authorityCounts[auth] || 0) + 1;
  });
  
  const entries = Object.entries(authorityCounts);
  entries.sort((a, b) => b[1] - a[1]);
  
  const [topAuthority, count] = entries[0];
  const share = Math.round((count / filtered.length) * 100);
  
  return { topAuthority, share, count };
}

// Calculate authority concentration (HHI)
export function calculateConcentrationIndex(
  items: UnifiedLegislationItem[],
  days: number = 90
): { index: number; level: "Low" | "Medium" | "High" } {
  const cutoff = subDays(new Date(), days);
  const filtered = items.filter(item => {
    const date = parseItemDate(item.publishedDate);
    return date && date >= cutoff;
  });
  
  if (filtered.length === 0) {
    return { index: 0, level: "Low" };
  }
  
  const authorityCounts: Record<string, number> = {};
  filtered.forEach(item => {
    const auth = item.authority || "Unknown";
    authorityCounts[auth] = (authorityCounts[auth] || 0) + 1;
  });
  
  const total = filtered.length;
  const shares = Object.values(authorityCounts).map(c => c / total);
  
  // HHI = sum of squared market shares
  const hhi = shares.reduce((sum, share) => sum + Math.pow(share, 2), 0);
  const normalizedHHI = Math.round(hhi * 10000); // Scale to 0-10000
  
  let level: "Low" | "Medium" | "High";
  if (normalizedHHI < 1500) level = "Low";
  else if (normalizedHHI < 2500) level = "Medium";
  else level = "High";
  
  return { index: normalizedHHI, level };
}

// Calculate consultations open
export function calculateOpenConsultations(
  items: UnifiedLegislationItem[]
): number {
  return items.filter(item => 
    item.status?.toLowerCase().includes("consulta") ||
    item.status?.toLowerCase().includes("consultation") ||
    item.status?.toLowerCase().includes("comment")
  ).length;
}

// Calculate data freshness
export function calculateDataFreshness(
  items: UnifiedLegislationItem[]
): { last24h: number; last7d: number } {
  const now = new Date();
  const day = subDays(now, 1);
  const week = subDays(now, 7);
  
  const updatedLast24h = items.filter(item => {
    const date = parseItemDate(item.lastUpdated || item.publishedDate);
    return date && date >= day;
  }).length;
  
  const updatedLast7d = items.filter(item => {
    const date = parseItemDate(item.lastUpdated || item.publishedDate);
    return date && date >= week;
  }).length;
  
  const total = items.length || 1;
  
  return {
    last24h: Math.round((updatedLast24h / total) * 100),
    last7d: Math.round((updatedLast7d / total) * 100)
  };
}

// Get throughput data by week
export function getThroughputByWeek(
  items: UnifiedLegislationItem[],
  weeks: number = 12,
  groupBy: "instrumentType" | "sourceType" = "instrumentType"
): Array<{ week: string; weekStart: Date; data: Record<string, number>; total: number }> {
  const now = new Date();
  const result: Array<{ week: string; weekStart: Date; data: Record<string, number>; total: number }> = [];
  
  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = startOfWeek(subDays(now, i * 7));
    const weekEnd = subDays(now, Math.max(0, i - 1) * 7);
    
    const weekItems = items.filter(item => {
      const date = parseItemDate(item.publishedDate);
      return date && date >= weekStart && date < weekEnd;
    });
    
    const data: Record<string, number> = {};
    weekItems.forEach(item => {
      const key = groupBy === "sourceType" 
        ? inferSourceType(item) 
        : item.instrumentType || "unknown";
      data[key] = (data[key] || 0) + 1;
    });
    
    result.push({
      week: format(weekStart, "MMM d"),
      weekStart,
      data,
      total: weekItems.length
    });
  }
  
  return result;
}

// Get stage distribution for bills/proposals
export function getStageDistribution(
  items: UnifiedLegislationItem[]
): Array<{ stage: string; count: number; items: UnifiedLegislationItem[] }> {
  const stages: Record<string, UnifiedLegislationItem[]> = {};
  
  items.filter(item => item.isPipeline).forEach(item => {
    const stage = item.status || "Unknown";
    if (!stages[stage]) stages[stage] = [];
    stages[stage].push(item);
  });
  
  return Object.entries(stages)
    .map(([stage, items]) => ({ stage, count: items.length, items }))
    .sort((a, b) => b.count - a.count);
}

// Get runway distribution buckets
export function getRunwayDistribution(
  items: UnifiedLegislationItem[]
): Array<{ bucket: string; range: [number, number]; count: number; items: UnifiedLegislationItem[] }> {
  const buckets = [
    { bucket: "0-7 days", range: [0, 7] as [number, number] },
    { bucket: "8-30 days", range: [8, 30] as [number, number] },
    { bucket: "31-90 days", range: [31, 90] as [number, number] },
    { bucket: "91-180 days", range: [91, 180] as [number, number] },
    { bucket: "181+ days", range: [181, Infinity] as [number, number] }
  ];
  
  return buckets.map(({ bucket, range }) => {
    const matchingItems = items.filter(item => {
      const pubDate = parseItemDate(item.publishedDate);
      const effDate = parseItemDate(item.effectiveDate);
      
      if (!pubDate || !effDate) return false;
      
      const days = differenceInDays(effDate, pubDate);
      return days >= range[0] && days <= range[1];
    });
    
    return { bucket, range, count: matchingItems.length, items: matchingItems };
  });
}

// Calculate short runway share
export function calculateShortRunwayShare(
  items: UnifiedLegislationItem[]
): number {
  const distribution = getRunwayDistribution(items);
  const total = distribution.reduce((sum, b) => sum + b.count, 0);
  
  if (total === 0) return 0;
  
  const shortRunway = distribution
    .filter(b => b.range[1] <= 30)
    .reduce((sum, b) => sum + b.count, 0);
  
  return Math.round((shortRunway / total) * 100);
}

// Get unique instrument types from data
export function getUniqueInstrumentTypes(items: UnifiedLegislationItem[]): string[] {
  const types = new Set<string>();
  items.forEach(item => {
    if (item.instrumentType) types.add(item.instrumentType);
  });
  return Array.from(types).sort();
}

// Get unique source types from data
export function getUniqueSourceTypes(items: UnifiedLegislationItem[]): SourceType[] {
  const types = new Set<SourceType>();
  items.forEach(item => types.add(inferSourceType(item)));
  return Array.from(types).sort();
}

// Map normalized instrument type to local label
export function getInstrumentLocalLabel(
  instrumentType: string,
  jurisdictionCode: string
): string {
  const localLabels: Record<string, Record<string, string>> = {
    "CR": {
      "bill": "Proyecto de Ley",
      "law": "Ley",
      "regulation": "Decreto Ejecutivo",
      "ordinance": "Ordenanza Municipal"
    },
    "Peru": {
      "bill": "Proyecto de Ley",
      "law": "Ley",
      "regulation": "Decreto Supremo",
      "resolution": "Resolución Ministerial"
    },
    "EU": {
      "regulation": "Regulation",
      "directive": "Directive",
      "decision": "Decision"
    },
    "Japan": {
      "law": "法律 (Hōritsu)",
      "bill": "法案 (Hōan)",
      "ordinance": "政令 (Seirei)"
    },
    "Korea": {
      "law": "법률 (Beopryul)",
      "bill": "법안 (Beopan)"
    }
  };
  
  return localLabels[jurisdictionCode]?.[instrumentType] || instrumentType;
}

// Chart color palette
export const chartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(210, 70%, 50%)",
  "hsl(280, 60%, 50%)",
  "hsl(340, 60%, 50%)",
];
