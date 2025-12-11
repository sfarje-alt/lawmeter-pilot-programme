// Document types for USA legislation tracking
export type USDocumentType = 
  | "bill"           // Congressional bills (HR, S, etc.)
  | "statute"        // Enacted federal law
  | "regulation"     // Federal agency regulations (CFR)
  | "treaty"         // International treaties
  | "ordinance";     // Local/municipal ordinances

export type LifecycleStatus = "all" | "in-force" | "pipeline";

export type Authority = 
  | "congress"       // Federal Congress
  | "federal-agency" // Federal agencies (FDA, FCC, EPA, etc.)
  | "state"          // State legislatures
  | "city";          // City/Municipal governments

// ========== NEW US-SPECIFIC TYPES ==========

// Government Branches
export type USBranch = "all" | "legislative" | "executive" | "judicial";

// US-specific Instrument Types (replacing generic document types for US view)
export type USInstrumentType = 
  | "congress-bill"       // Congress bills and resolutions
  | "public-law"          // Enacted statutes (Public Laws)
  | "agency-rulemaking"   // NPRMs, proposed rules, final rules
  | "guidance"            // Policy statements, FAQs, guidance docs
  | "executive-order";    // Presidential actions, EOs

// Congress Stage (for bills/resolutions)
export type CongressStage = 
  | "introduced" 
  | "in-committee" 
  | "on-calendar" 
  | "passed-chamber" 
  | "to-president" 
  | "enacted" 
  | "failed";

// Rulemaking Stage (for agency regulations)
export type RulemakingStage = 
  | "draft" 
  | "proposed" 
  | "comment-open" 
  | "comment-closed" 
  | "final" 
  | "effective";

// Deadline Presets for quick filtering
export type DeadlinePreset = "next-30" | "next-60" | "next-90" | "this-quarter" | "none";

// Sponsor Party for Congress items
export type SponsorParty = "D" | "R" | "bipartisan" | "other";

// Regulator Subtype for regulatory items
export type RegulatorSubtype = "prudential" | "markets" | "consumer" | "sector-specific";

export type JurisdictionLevel = "all" | "federal" | "state" | "local";
export type RiskLevel = "high" | "medium" | "low";

// Filter Preset Interface for saved US views
export interface USFilterPreset {
  id: string;
  name: string;
  description: string;
  filters: {
    lifecycle?: LifecycleStatus;
    level?: JurisdictionLevel;
    branch?: USBranch;
    instrumentTypes?: USInstrumentType[];
    stages?: (CongressStage | RulemakingStage)[];
    riskLevels?: RiskLevel[];
    deadlinePreset?: DeadlinePreset;
    states?: string[];
    categories?: string[];
  };
}

export interface AISummary {
  whatChanges: string;
  whoImpacted: string;
  keyDeadline: string;
  generatedAt: string;
  riskScore?: number;
  riskCategory?: string;
  comparedToPrevious?: string;
}

export interface USLegislationItem {
  id: string;
  title: string;
  summary: string;
  bullets: string[];
  documentType: USDocumentType;
  authority: Authority;
  jurisdiction: "USA";
  subJurisdiction?: string; // State code or city name
  agencyName?: string;      // For regulations
  riskLevel: "low" | "medium" | "high";
  riskScore: number;
  regulatoryCategory: "Radio" | "Product Safety" | "Cybersecurity" | "Battery" | "Food Contact Material";
  publishedDate: string;
  effectiveDate?: string;
  complianceDeadline?: string;
  isInForce: boolean;       // true if effective date <= today and not repealed
  isPipeline: boolean;      // true if pending/draft/future effective
  regulatoryBody: string;
  impactAreas: string[];
  status: string;
  localTerminology?: string;
  isRead?: boolean;         // For read/unread tracking
  aiSummary?: AISummary;    // Cached AI-generated summary
}

// Helper to determine lifecycle status
export function getLifecycleStatus(item: USLegislationItem): "in-force" | "pipeline" {
  return item.isInForce ? "in-force" : "pipeline";
}

// Document type labels
export const documentTypeLabels: Record<USDocumentType, string> = {
  bill: "Bills",
  statute: "Statutes",
  regulation: "Regulations",
  treaty: "Treaties",
  ordinance: "Local Ordinances"
};

// Authority labels
export const authorityLabels: Record<Authority, string> = {
  congress: "Congress",
  "federal-agency": "Federal Agencies",
  state: "States",
  city: "Cities"
};
