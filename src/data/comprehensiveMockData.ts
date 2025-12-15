// Comprehensive mock data generator for map filter testing
// Ensures all jurisdictions have items for every filter combination

import { UnifiedLegislationItem } from "@/types/unifiedLegislation";
import { subDays, format } from "date-fns";

const JURISDICTIONS = [
  { code: "USA", region: "NAM" as const },
  { code: "Canada", region: "NAM" as const },
  { code: "Japan", region: "APAC" as const },
  { code: "Korea", region: "APAC" as const },
  { code: "Taiwan", region: "APAC" as const },
  { code: "EU", region: "EU" as const },
  { code: "UAE", region: "GCC" as const },
  { code: "Saudi Arabia", region: "GCC" as const },
  { code: "Oman", region: "GCC" as const },
  { code: "Kuwait", region: "GCC" as const },
  { code: "Bahrain", region: "GCC" as const },
  { code: "Qatar", region: "GCC" as const },
  { code: "Peru", region: "LATAM" as const },
  { code: "Costa Rica", region: "LATAM" as const },
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

// Date ranges: 7d, 30d, 90d
const DATE_WINDOWS = [
  { days: 3, label: "recent" },   // Within 7 days
  { days: 15, label: "monthly" }, // Within 30 days
  { days: 60, label: "quarterly" } // Within 90 days
];

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

// Generate comprehensive data ensuring all filter combinations are covered
export function generateComprehensiveMockData(): UnifiedLegislationItem[] {
  const items: UnifiedLegislationItem[] = [];
  
  // For each jurisdiction, create items covering all filter dimensions
  JURISDICTIONS.forEach(jurisdiction => {
    // Ensure at least one item per risk level
    RISK_LEVELS.forEach(riskLevel => {
      // At least one category per risk level
      const categoryIndex = RISK_LEVELS.indexOf(riskLevel);
      const category = CATEGORIES[categoryIndex % CATEGORIES.length];
      
      // Both lifecycle states
      LIFECYCLE_STATES.forEach(lifecycle => {
        // Distribute across date windows
        const dateWindow = DATE_WINDOWS[Math.floor(Math.random() * DATE_WINDOWS.length)];
        
        items.push(generateComprehensiveItem(
          jurisdiction,
          riskLevel,
          category,
          lifecycle,
          dateWindow
        ));
      });
    });
    
    // Add additional items for each category to ensure full category coverage
    CATEGORIES.forEach((category, idx) => {
      const riskLevel = RISK_LEVELS[idx % RISK_LEVELS.length];
      const lifecycle = LIFECYCLE_STATES[idx % LIFECYCLE_STATES.length];
      const dateWindow = DATE_WINDOWS[idx % DATE_WINDOWS.length];
      
      items.push(generateComprehensiveItem(
        jurisdiction,
        riskLevel,
        category,
        lifecycle,
        dateWindow
      ));
    });
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
