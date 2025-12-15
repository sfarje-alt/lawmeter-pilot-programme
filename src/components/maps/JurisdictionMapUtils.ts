import { InternationalLegislation } from "@/data/mockInternationalLegislation";

export interface JurisdictionStats {
  code: string;
  name: string;
  total: number;
  high: number;
  medium: number;
  low: number;
  activityScore?: number;
}

// Calculate weighted activity score
export function calculateActivityScore(high: number, medium: number, low: number): number {
  return (high * 3) + (medium * 2) + (low * 1);
}

// Get gradient color based on activity intensity (0 to 1)
// Green (low activity) → Yellow (moderate) → Red (high activity)
export function getActivityGradientColor(intensity: number): string {
  // Clamp intensity between 0 and 1
  const t = Math.max(0, Math.min(1, intensity));
  
  if (t === 0) return "hsl(215, 14%, 34%)"; // No activity - muted gray
  
  if (t <= 0.5) {
    // Green to Yellow (hue: 120 → 60)
    const hue = 120 - (t * 2 * 60);
    return `hsl(${hue}, 70%, 45%)`;
  } else {
    // Yellow to Red (hue: 60 → 0)
    const hue = 60 - ((t - 0.5) * 2 * 60);
    return `hsl(${hue}, 75%, 50%)`;
  }
}

// Calculate color for a jurisdiction based on its stats and max score
export function getJurisdictionGradientColor(
  high: number, 
  medium: number, 
  low: number, 
  maxScore: number
): string {
  const score = calculateActivityScore(high, medium, low);
  if (score === 0) return "hsl(215, 14%, 34%)"; // No alerts - muted gray
  const intensity = maxScore > 0 ? score / maxScore : 0;
  return getActivityGradientColor(intensity);
}

// Legacy function for backward compatibility
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
