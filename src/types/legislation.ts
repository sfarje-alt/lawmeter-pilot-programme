export interface AuthorizedBy {
  name: string;
  link: string;
}

export interface PortfolioMatch {
  portfolio: string;
  pattern: string;
}

export interface PGRPronouncement {
  consultation_number: string; // e.g., "C-213-2005"
  date: string;
  type: "Dictamen" | "Opinión Jurídica";
  issuer: string;
  issuer_position: string;
  conclusion_summary: string[];
  relevance_level: "low" | "medium" | "high";
  link: string;
  is_new?: boolean; // Marked as new when scraped
  scraped_date?: string; // Date when this pronouncement was scraped
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
  law_number?: string; // e.g., "Ley 7786"
  detail_link?: string;
  gaceta_link?: string; // Link a La Gaceta
  bill_project_link?: string; // Link al proyecto de ley original (PDF)
  title_id: string;
  publication_date: string; // Fecha de publicación
  effective_date: string; // "Rige a partir de"
  version?: string; // Versión de la norma
  norm_type: "Ley" | "Decreto Ejecutivo" | "Reglamento";
  link?: string;
  issuing_entity?: string; // Ente emisor
  has_pdf?: boolean;
  pdf_files?: string[];
  text?: string;
  scraped_at: string;
  source: "SINALEVI" | "PGR";
  search_source: string;
  csv_in_force: string;
  ministry?: string; // Ministerio responsable (reemplaza portfolio)
  affected_norms?: string[]; // Normativa afectada
  modifying_norms?: string[]; // Normativa que modificó esta norma
  concordances?: string[]; // Concordancias
  regulations?: string[]; // Reglamentaciones
  transitory_articles?: string; // Artículos transitorios con plazos
  pgr_consultation_number?: string; // e.g., "C-213-2005" for PGR pronouncements
  pgr_type?: "Dictamen" | "Opinión Jurídica";
  pgr_issuer?: string; // Persona que emitió el pronunciamiento
  pgr_position?: string; // Puesto del emisor
  is_relevant: boolean;
  ministry_matches?: PortfolioMatch[];
  AI_triage: AITriage;
  monitoring_use: string;
  pgr_pronouncements?: PGRPronouncement[];
}

export interface MP {
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  party?: string;
  votingPosition?: "support" | "oppose" | "abstain" | "unknown";
  constituency?: string;
}

export interface VotingRecord {
  date: string;
  stage: string;
  votesFor: number;
  votesAgainst: number;
  abstentions: number;
  passed: boolean;
  mpVotes?: Array<{
    mpName: string;
    party: string;
    vote: "for" | "against" | "abstain";
  }>;
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
  votingRecords?: VotingRecord[];
  stakeholders?: Array<{
    name: string;
    organization?: string;
    position: "support" | "oppose" | "neutral";
    statement?: string;
  }>;
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
  chambers: ("House" | "Senate")[];
  sortBy: "registered" | "effective" | "date" | "risk" | "relevance" | "deadline";
  sortOrder: "asc" | "desc";
}
