export interface AuthorizedBy {
  name: string;
  link: string;
}

export interface PortfolioMatch {
  portfolio: string;
  pattern: string;
}

export interface AITriage {
  processed: boolean;
  skipped: string | null;
  decision: "RELEVANT" | "MAYBE" | "IRRELEVANT";
  score: number;
  confidence: number;
  reasons: string[];
  is_relevant_for_client: boolean;
  client_relevance_level: "low" | "medium" | "high";
  client_relevance_reasons: string[];
  affected_units: string[];
  portfolio_priority: "low" | "medium" | "high";
  legal_stage: "enacted" | "proposal" | "draft" | "guidance" | "ruling" | "other" | null;
  change_type: string[];
  summary: string | null;
  alert_title: string | null;
  alert_bullets: string[];
  risk_level: "low" | "medium" | "high";
  risk_score_hint: number;
  deadline_detected: string | null;
  recommended_action: "ALERT_NOW" | "QUEUE_SUMMARY" | "IGNORE";
}

export interface Alert {
  title?: string;
  detail_link?: string;
  title_id: string;
  registered_date: string;
  effective_date: string;
  collection_code: string;
  link?: string;
  authorised_by?: AuthorizedBy;
  has_pdf?: boolean;
  pdf_files?: string[];
  text?: string;
  scraped_at: string;
  source: string;
  search_source: string;
  csv_name?: string;
  csv_title_id?: string;
  csv_in_force: string;
  csv_portfolio: string;
  csv_effective_start?: string;
  csv_effective_end?: string;
  csv_collection: string;
  csv_series?: string | null;
  is_relevant: boolean;
  portfolio_matches: PortfolioMatch[];
  AI_triage: AITriage;
  doc_view: "Compilation/Principal" | "Amending/As Made" | null;
  monitoring_use: string;
}

export interface MP {
  name: string;
  role?: string;
  email?: string;
  phone?: string;
}

export interface BillItem {
  id: string;
  title: string;
  portfolio?: string;
  party?: string;
  mps?: MP[];
  chamber: "House" | "Senate";
  status:
    | "Introduced"
    | "Second Reading"
    | "Committee"
    | "Consideration in Detail"
    | "Passed House"
    | "Passed Senate"
    | "Royal Assent Pending";
  stageLocation: string;
  lastActionDate: string;
  summary: string;
  bullets: string[];
  risk_level: "low" | "medium" | "high";
  risk_score: number;
  motherActLink?: string;
  amendmentActLink?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  visibility: "TEAM" | "PRIVATE";
  body: string;
  createdAt: string;
}

export interface StarredAlert {
  scope: "ACTS" | "BILLS";
  alertKey: string;
  comments: Comment[];
}

export interface FilterState {
  timeWindow: "1w" | "2w" | "4w" | "8w" | "12w" | "6m" | "1y" | "all";
  portfolios: string[];
  regulators: string[];
  types: string[];
  riskScoreRange: [number, number];
  parties: string[];
  mpSearch: string;
  searchText: string;
  riskLevels: ("low" | "medium" | "high")[];
  urgencyLevels: ("low" | "medium" | "high")[];
  hasDeadline: boolean | null;
  sortBy: "date" | "risk" | "relevance" | "deadline";
  sortOrder: "asc" | "desc";
}
