// Comprehensive mock data generator for map filter testing
// Ensures all jurisdictions have items for every filter combination

import { UnifiedLegislationItem } from "@/types/unifiedLegislation";
import { subDays, format } from "date-fns";

// Each jurisdiction has a risk profile that determines the distribution of risk levels
// This creates natural variation in colors across the map
const JURISDICTIONS = [
  { code: "USA", region: "NAM" as const, riskProfile: { high: 0.5, medium: 0.3, low: 0.2 } },
  { code: "Canada", region: "NAM" as const, riskProfile: { high: 0.2, medium: 0.5, low: 0.3 } },
  { code: "Japan", region: "APAC" as const, riskProfile: { high: 0.1, medium: 0.3, low: 0.6 } },
  { code: "Korea", region: "APAC" as const, riskProfile: { high: 0.3, medium: 0.4, low: 0.3 } },
  { code: "Taiwan", region: "APAC" as const, riskProfile: { high: 0.15, medium: 0.35, low: 0.5 } },
  { code: "EU", region: "EU" as const, riskProfile: { high: 0.4, medium: 0.4, low: 0.2 } },
  { code: "UAE", region: "GCC" as const, riskProfile: { high: 0.25, medium: 0.35, low: 0.4 } },
  { code: "Saudi Arabia", region: "GCC" as const, riskProfile: { high: 0.35, medium: 0.4, low: 0.25 } },
  { code: "Oman", region: "GCC" as const, riskProfile: { high: 0.1, medium: 0.25, low: 0.65 } },
  { code: "Kuwait", region: "GCC" as const, riskProfile: { high: 0.15, medium: 0.4, low: 0.45 } },
  { code: "Bahrain", region: "GCC" as const, riskProfile: { high: 0.2, medium: 0.3, low: 0.5 } },
  { code: "Qatar", region: "GCC" as const, riskProfile: { high: 0.3, medium: 0.35, low: 0.35 } },
  { code: "Peru", region: "LATAM" as const, riskProfile: { high: 0.2, medium: 0.45, low: 0.35 } },
  { code: "Costa Rica", region: "LATAM" as const, riskProfile: { high: 0.15, medium: 0.35, low: 0.5 } },
];

const RISK_LEVELS: ("high" | "medium" | "low")[] = ["high", "medium", "low"];

const CATEGORIES = [
  "Radio",
  "Product Safety",
  "Cybersecurity",
  "Battery",
  "Food Contact Material"
];

const LIFECYCLE_STATES = [
  { isInForce: true, isPipeline: false, genericStatus: "in-force" as const },
  { isInForce: false, isPipeline: true, genericStatus: "proposal" as const }
];

// Date ranges: 7d, 30d, 90d - varied per jurisdiction
const DATE_WINDOWS = [
  { days: 2, label: "7d" },    // Within 7 days
  { days: 5, label: "7d-2" },  // Within 7 days
  { days: 12, label: "30d" },  // Within 30 days
  { days: 25, label: "30d-2" }, // Within 30 days
  { days: 45, label: "90d" },  // Within 90 days
  { days: 75, label: "90d-2" } // Within 90 days
];

// Function to select risk level based on jurisdiction's risk profile
function selectRiskLevel(profile: { high: number; medium: number; low: number }, seed: number): "high" | "medium" | "low" {
  const rand = (seed % 100) / 100;
  if (rand < profile.high) return "high";
  if (rand < profile.high + profile.medium) return "medium";
  return "low";
}

function generateItemTitle(category: string, jurisdiction: string, isInForce: boolean): string {
  const action = isInForce ? "Regulation" : "Proposed Rule";
  const categoryTitles: Record<string, string> = {
    "Radio": `${action} on Radio Frequency Equipment Standards`,
    "Product Safety": `${action} for Consumer Product Safety Requirements`,
    "Cybersecurity": `${action} on Cybersecurity Standards for Connected Devices`,
    "Battery": `${action} for Battery Safety and Recycling`,
    "Food Contact Material": `${action} on Food Contact Materials Compliance`
  };
  return `${jurisdiction} ${categoryTitles[category] || action}`;
}

function generateSummary(category: string, riskLevel: string, isInForce: boolean): string {
  const riskText = riskLevel === "high" ? "significant" : riskLevel === "medium" ? "moderate" : "minimal";
  const status = isInForce ? "currently in force" : "under consideration";
  return `This ${category.toLowerCase()} regulation is ${status} and presents ${riskText} compliance implications for smart appliance manufacturers operating in this jurisdiction.`;
}

let itemCounter = 0;

function generateComprehensiveItem(
  jurisdiction: { code: string; region: "NAM" | "LATAM" | "EU" | "GCC" | "APAC" },
  riskLevel: "high" | "medium" | "low",
  category: string,
  lifecycle: { isInForce: boolean; isPipeline: boolean; genericStatus: "in-force" | "proposal" | "repealed" },
  dateWindow: { days: number; label: string }
): UnifiedLegislationItem {
  itemCounter++;
  const now = new Date();
  const publishedDate = format(subDays(now, dateWindow.days), "yyyy-MM-dd");
  const effectiveDate = lifecycle.isInForce ? format(subDays(now, dateWindow.days + 30), "yyyy-MM-dd") : undefined;
  const complianceDeadline = lifecycle.isPipeline ? format(subDays(now, -90), "yyyy-MM-dd") : undefined;
  
  const riskScores = { high: 85, medium: 55, low: 25 };
  
  return {
    id: `comp-${jurisdiction.code.toLowerCase().replace(/\s+/g, "-")}-${category.toLowerCase().replace(/\s+/g, "-")}-${riskLevel}-${lifecycle.genericStatus}-${dateWindow.label}-${itemCounter}`,
    title: generateItemTitle(category, jurisdiction.code, lifecycle.isInForce),
    identifier: `${jurisdiction.code.substring(0, 2).toUpperCase()}-${category.substring(0, 3).toUpperCase()}-${itemCounter.toString().padStart(4, "0")}`,
    summary: generateSummary(category, riskLevel, lifecycle.isInForce),
    bullets: [
      `Applies to ${category.toLowerCase()} products`,
      `Risk level: ${riskLevel}`,
      lifecycle.isInForce ? "Currently in force" : "Under legislative review",
      `Published ${publishedDate}`
    ],
    region: jurisdiction.region,
    jurisdictionCode: jurisdiction.code,
    jurisdictionLevel: "federal" as const,
    authority: `${jurisdiction.code} Regulatory Authority`,
    authorityLabel: `${jurisdiction.code} Regulatory Authority`,
    instrumentType: lifecycle.isInForce ? "regulation" : "bill",
    hierarchyLevel: "primary" as "primary" | "secondary" | "tertiary" | "soft-law",
    status: lifecycle.isInForce ? "enacted" : "pending",
    genericStatus: lifecycle.genericStatus,
    isInForce: lifecycle.isInForce,
    isPipeline: lifecycle.isPipeline,
    publishedDate,
    effectiveDate,
    complianceDeadline,
    riskLevel,
    riskScore: riskScores[riskLevel],
    policyArea: category,
    regulatoryCategory: category,
    impactAreas: [category, "Consumer Electronics"],
    aiSummary: {
      whatChanges: `${lifecycle.isInForce ? "Mandates" : "Would mandate"} new ${category.toLowerCase()} standards for connected appliances.`,
      whoImpacted: "Smart kettle and espresso machine manufacturers with products in this market.",
      keyDeadline: lifecycle.isInForce 
        ? `Effective since ${effectiveDate}` 
        : `Expected decision by Q2 2025`
    }
  };
}

// Generate comprehensive data with VARIED risk levels per jurisdiction
export function generateComprehensiveMockData(): UnifiedLegislationItem[] {
  const items: UnifiedLegislationItem[] = [];
  let seedCounter = 0;
  
  // For each jurisdiction, create items with risk levels based on their profile
  JURISDICTIONS.forEach((jurisdiction, jIdx) => {
    // Create items for each date window to ensure all time periods have data
    DATE_WINDOWS.forEach((dateWindow, dwIdx) => {
      CATEGORIES.forEach((category, cIdx) => {
        LIFECYCLE_STATES.forEach((lifecycle, lIdx) => {
          // Use jurisdiction's risk profile to determine risk level
          seedCounter++;
          const seed = (jIdx * 100 + dwIdx * 10 + cIdx + lIdx + seedCounter) % 100;
          const riskLevel = selectRiskLevel(jurisdiction.riskProfile, seed);
          
          items.push(generateComprehensiveItem(
            jurisdiction,
            riskLevel,
            category,
            lifecycle,
            dateWindow
          ));
        });
      });
    });
    
    // Add extra items for each jurisdiction to ensure visible presence
    // These use the jurisdiction's risk profile for natural variation
    for (let i = 0; i < 8; i++) {
      seedCounter++;
      const riskLevel = selectRiskLevel(jurisdiction.riskProfile, seedCounter);
      const category = CATEGORIES[i % CATEGORIES.length];
      const lifecycle = LIFECYCLE_STATES[i % LIFECYCLE_STATES.length];
      const dateWindow = DATE_WINDOWS[i % DATE_WINDOWS.length];
      
      items.push(generateComprehensiveItem(
        jurisdiction,
        riskLevel,
        category,
        lifecycle,
        dateWindow
      ));
    }
  });
  
  return items;
}

// Pre-generated comprehensive mock data
export const comprehensiveMockData = generateComprehensiveMockData();

// Utility to merge with existing enriched data - ensures all jurisdictions have sufficient data
export function mergeWithComprehensiveData(existingData: UnifiedLegislationItem[]): UnifiedLegislationItem[] {
  // Count items per jurisdiction in existing data
  const jurisdictionCounts = new Map<string, number>();
  existingData.forEach(item => {
    const count = jurisdictionCounts.get(item.jurisdictionCode || "") || 0;
    jurisdictionCounts.set(item.jurisdictionCode || "", count + 1);
  });
  
  // Add comprehensive items for jurisdictions with fewer than 5 items
  const additionalItems = comprehensiveMockData.filter(item => {
    const existingCount = jurisdictionCounts.get(item.jurisdictionCode) || 0;
    return existingCount < 5; // Add more data for under-represented jurisdictions
  });
  
  // Also ensure we always have some recent items (within last 30 days) for each jurisdiction
  const recentItems = comprehensiveMockData.filter(item => {
    const pubDate = new Date(item.publishedDate || "");
    const cutoff = subDays(new Date(), 30);
    return pubDate >= cutoff;
  });
  
  // Deduplicate by ID
  const allItems = [...existingData, ...additionalItems, ...recentItems];
  const uniqueItems = Array.from(new Map(allItems.map(item => [item.id, item])).values());
  
  return uniqueItems;
}
