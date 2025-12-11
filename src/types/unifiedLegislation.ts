import { RegionCode } from "@/components/regions/RegionConfig";
import { HierarchyLevel, GenericStatus, JurisdictionConfig } from "@/config/jurisdictionConfig";

// ========== UNIFIED LEGISLATION ITEM ==========
export interface UnifiedLegislationItem {
  id: string;
  
  // Core identification
  identifier: string;        // Bill number, law reference, case citation
  title: string;
  summary?: string;
  bullets?: string[];
  
  // Jurisdiction info
  region: RegionCode;
  jurisdictionCode: string;  // "USA", "EU", "JP", etc.
  jurisdictionLevel: "federal" | "state" | "local" | "supranational";
  subnationalUnit?: string;  // State code, province, member state
  
  // Instrument classification
  instrumentType: string;    // Maps to JurisdictionConfig.instrumentTypes
  hierarchyLevel: HierarchyLevel;
  
  // Status and lifecycle
  status: string;            // Local status term
  genericStatus: GenericStatus;
  isInForce: boolean;
  isPipeline: boolean;
  currentStageIndex?: number;
  
  // Authority/source
  authority: string;         // Issuing body
  authorityLabel?: string;   // Display label
  
  // Case law specific (common law systems)
  caseLawData?: {
    court: string;
    chamber?: string;
    citation: string;
    judges?: string[];
  };
  
  // Dates
  publishedDate?: string;
  effectiveDate?: string;
  complianceDeadline?: string;
  lastUpdated?: string;
  
  // Risk assessment
  riskLevel: "high" | "medium" | "low";
  riskScore: number;
  
  // Categorization
  policyArea?: string;       // Topic/sector
  regulatoryCategory?: string;
  impactAreas?: string[];
  tags?: string[];
  
  // Read/tracking status
  isRead?: boolean;
  isStarred?: boolean;
  
  // AI summary (cached)
  aiSummary?: {
    whatChanges: string;
    whoImpacted: string;
    keyDeadline: string;
    generatedAt?: string;
    riskScore?: number;
    riskCategory?: string;
    riskExplanation?: string;
    stakeholders?: string[];
  };
  
  // Source URLs
  sourceUrl?: string;
  textUrl?: string;
  
  // Enriched content for drawer
  votingRecords?: Array<{
    chamber: string;
    date: string;
    yea: number;
    nay: number;
    abstain: number;
    passed: boolean;
  }>;
  sponsors?: Array<{
    name: string;
    party?: string;
    state?: string;
    role?: string;
  }>;
  actions?: Array<{
    date: string;
    description: string;
    chamber?: string;
  }>;
  summaries?: Array<{
    versionName?: string;
    text: string;
  }>;
  fullText?: string;
}

// ========== UNIFIED FILTER STATE ==========
export interface UnifiedFilterState {
  // Lifecycle
  lifecycle: "all" | "in-force" | "pipeline";
  
  // Jurisdiction level
  jurisdictionLevel: "all" | "federal" | "state" | "local";
  
  // Instrument types (from config)
  instrumentTypes: string[];
  
  // Hierarchy levels
  hierarchyLevels: HierarchyLevel[];
  
  // Status (generic)
  statuses: GenericStatus[];
  
  // Subnational units
  subnationalUnits: string[];
  
  // Risk levels
  riskLevels: ("high" | "medium" | "low")[];
  
  // Categories/topics
  categories: string[];
  
  // Authority/issuing body
  authorities: string[];
  
  // Search
  searchQuery: string;
  
  // Deadline filter
  deadlinePreset: "none" | "next-30" | "next-60" | "next-90" | "this-quarter";
  
  // Sorting
  sortBy: "date" | "risk" | "deadline" | "relevance";
  sortOrder: "asc" | "desc";
}

export const defaultFilterState: UnifiedFilterState = {
  lifecycle: "all",
  jurisdictionLevel: "all",
  instrumentTypes: [],
  hierarchyLevels: [],
  statuses: [],
  subnationalUnits: [],
  riskLevels: [],
  categories: [],
  authorities: [],
  searchQuery: "",
  deadlinePreset: "none",
  sortBy: "date",
  sortOrder: "desc"
};

// ========== FILTER PRESET ==========
export interface UnifiedFilterPreset {
  id: string;
  name: string;
  description: string;
  filters: Partial<UnifiedFilterState>;
  region?: RegionCode; // Optional: region-specific preset
}

// ========== HELPERS ==========

// Convert any legacy item to unified format
export function normalizeToUnified(
  item: any,
  config: JurisdictionConfig
): UnifiedLegislationItem {
  const instrumentType = config.instrumentTypes.find(t => t.id === item.instrumentType || t.id === item.documentType);
  
  return {
    id: item.id,
    identifier: item.identifier || item.localTerminology || item.id,
    title: item.title,
    summary: item.summary,
    bullets: item.bullets,
    region: config.region,
    jurisdictionCode: config.code,
    jurisdictionLevel: item.jurisdictionLevel || "federal",
    subnationalUnit: item.subJurisdiction || item.subnationalUnit,
    instrumentType: instrumentType?.id || item.documentType || "unknown",
    hierarchyLevel: instrumentType?.hierarchyLevel || "primary",
    status: item.status,
    genericStatus: item.genericStatus || "draft",
    isInForce: item.isInForce ?? false,
    isPipeline: item.isPipeline ?? !item.isInForce,
    authority: item.authority || item.regulatoryBody || "",
    publishedDate: item.publishedDate,
    effectiveDate: item.effectiveDate,
    complianceDeadline: item.complianceDeadline,
    riskLevel: item.riskLevel || "medium",
    riskScore: item.riskScore || 50,
    policyArea: item.policyArea || item.regulatoryCategory,
    regulatoryCategory: item.regulatoryCategory || item.category,
    impactAreas: item.impactAreas || [],
    isRead: item.isRead,
    aiSummary: item.aiSummary
  };
}

// Get status badge color based on generic status
export function getStatusBadgeClass(status: GenericStatus): string {
  switch (status) {
    case "in-force":
      return "bg-success/10 text-success border-success/30";
    case "partially-in-force":
      return "bg-success/10 text-success border-success/30";
    case "approved":
      return "bg-info/10 text-info border-info/30";
    case "in-committee":
      return "bg-warning/10 text-warning border-warning/30";
    case "proposal":
    case "draft":
      return "bg-muted text-muted-foreground border-muted";
    case "repealed":
      return "bg-destructive/10 text-destructive border-destructive/30";
    default:
      return "bg-muted text-muted-foreground border-muted";
  }
}

// Get risk badge styling
export function getRiskBadgeClass(level: "high" | "medium" | "low"): string {
  switch (level) {
    case "high": return "bg-risk-high text-risk-high-foreground";
    case "medium": return "bg-risk-medium text-risk-medium-foreground";
    case "low": return "bg-risk-low text-risk-low-foreground";
    default: return "bg-muted text-muted-foreground";
  }
}

// Format date consistently
export function formatLegislationDate(dateString?: string): string {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
