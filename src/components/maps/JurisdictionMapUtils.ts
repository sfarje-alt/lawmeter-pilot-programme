import { InternationalLegislation } from "@/data/mockInternationalLegislation";

export interface JurisdictionStats {
  code: string;
  name: string;
  total: number;
  high: number;
  medium: number;
  low: number;
}

export function getAlertColor(high: number, medium: number, low: number): string {
  if (high > 0) return "hsl(var(--risk-high))";
  if (medium > 0) return "hsl(var(--risk-medium))";
  if (low > 0) return "hsl(var(--risk-low))";
  return "hsl(var(--muted))";
}

export function getAlertColorClass(high: number, medium: number, low: number): string {
  if (high > 0) return "fill-risk-high";
  if (medium > 0) return "fill-risk-medium";
  if (low > 0) return "fill-risk-low";
  return "fill-muted";
}

export function aggregateByJurisdiction(
  legislation: InternationalLegislation[],
  jurisdictionFilter?: string
): Map<string, JurisdictionStats> {
  const stats = new Map<string, JurisdictionStats>();
  
  legislation.forEach(item => {
    if (jurisdictionFilter && item.jurisdiction !== jurisdictionFilter) return;
    
    const key = item.subJurisdiction || item.jurisdiction;
    const existing = stats.get(key) || {
      code: key,
      name: key,
      total: 0,
      high: 0,
      medium: 0,
      low: 0
    };
    
    existing.total++;
    if (item.riskLevel === "high") existing.high++;
    else if (item.riskLevel === "medium") existing.medium++;
    else existing.low++;
    
    stats.set(key, existing);
  });
  
  return stats;
}
