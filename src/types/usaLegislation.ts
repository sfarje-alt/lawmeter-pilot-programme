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
