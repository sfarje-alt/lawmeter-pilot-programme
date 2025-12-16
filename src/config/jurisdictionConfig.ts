import { RegionCode, regionThemes } from "@/components/regions/RegionConfig";

// ========== LEGAL SYSTEM TYPES ==========
export type LegalSystemType = "civil-law" | "common-law" | "mixed" | "supranational" | "islamic";

// ========== GENERIC HIERARCHY LEVELS ==========
export type HierarchyLevel = 
  | "constitutional"
  | "primary"
  | "secondary"
  | "tertiary"
  | "soft-law"
  | "case-law";

// ========== GENERIC STATUS MODEL ==========
export type GenericStatus = 
  | "draft"
  | "proposal"
  | "in-committee"
  | "approved"
  | "in-force"
  | "partially-in-force"
  | "repealed";

// ========== INSTRUMENT TYPE CONFIGURATION ==========
export interface InstrumentTypeConfig {
  id: string;
  label: string;
  emoji: string;
  hierarchyLevel: HierarchyLevel;
  // For case law in common law systems
  isCaseLaw?: boolean;
}

// ========== STATUS MAPPING ==========
export interface StatusMapping {
  localStatus: string;
  genericStatus: GenericStatus;
  label: string;
}

// ========== SUBNATIONAL UNIT CONFIG ==========
export interface SubnationalUnitConfig {
  label: string; // "State", "Province", "Land", "Prefecture", etc.
  units: Array<{ code: string; name: string }>;
}

// ========== PIPELINE STAGE CONFIG ==========
export interface PipelineStageConfig {
  stages: string[];
  instrumentType?: string; // Optional: different stages for different instruments
}

// ========== FILTER PRESET ==========
export interface FilterPreset {
  id: string;
  name: string;
  description: string;
  filters: {
    lifecycle?: "all" | "in-force" | "pipeline";
    jurisdictionLevel?: "all" | "federal" | "state" | "local";
    instrumentTypes?: string[];
    riskLevels?: ("high" | "medium" | "low")[];
    categories?: string[];
  };
}

// ========== JURISDICTION CONFIGURATION ==========
export interface JurisdictionLevelOption {
  id: "federal" | "state" | "local" | "supranational";
  label: string;
  enabled: boolean;
}

export interface JurisdictionConfig {
  code: string;
  name: string;
  region: RegionCode;
  legalSystem: LegalSystemType;
  
  // Instrument types available in this jurisdiction
  instrumentTypes: InstrumentTypeConfig[];
  
  // Status mappings from local terms to generic model
  statusMappings: StatusMapping[];
  
  // Pipeline stages for pending legislation
  pipelineStages: PipelineStageConfig[];
  
  // Subnational units (if applicable)
  subnationalUnits?: SubnationalUnitConfig;
  
  // Jurisdiction level options (customized per country)
  jurisdictionLevels?: JurisdictionLevelOption[];
  
  // Filter presets (country-specific)
  filterPresets?: FilterPreset[];
  
  // Authority/issuing body labels
  authorityLabels: Record<string, string>;
  
  // Hierarchy level labels
  hierarchyLabels: Record<HierarchyLevel, string>;
  
  // Filter labels customization
  filterLabels: {
    instrumentType: string;
    hierarchy: string;
    status: string;
    subnational: string;
    authority: string;
  };
  
  // Case law fields (for common law systems)
  caseLawFields?: {
    courtLabel: string;
    chamberLabel: string;
    citationLabel: string;
  };
}

// ========== USA CONFIGURATION ==========
export const usaConfig: JurisdictionConfig = {
  code: "USA",
  name: "United States",
  region: "NAM",
  legalSystem: "common-law",
  
  instrumentTypes: [
    { id: "bill", label: "Bill", emoji: "📜", hierarchyLevel: "primary" },
    { id: "statute", label: "Statute / Public Law", emoji: "⚖️", hierarchyLevel: "primary" },
    { id: "regulation", label: "Regulation (CFR)", emoji: "📋", hierarchyLevel: "secondary" },
    { id: "executive-order", label: "Executive Order", emoji: "🏛️", hierarchyLevel: "secondary" },
    { id: "guidance", label: "Guidance / Policy", emoji: "📄", hierarchyLevel: "soft-law" },
    { id: "treaty", label: "Treaty", emoji: "🤝", hierarchyLevel: "primary" },
    { id: "ordinance", label: "Local Ordinance", emoji: "🏘️", hierarchyLevel: "tertiary" },
    { id: "case", label: "Case Law", emoji: "⚖️", hierarchyLevel: "case-law", isCaseLaw: true }
  ],
  
  statusMappings: [
    { localStatus: "Introduced", genericStatus: "proposal", label: "Introduced" },
    { localStatus: "In Committee", genericStatus: "in-committee", label: "In Committee" },
    { localStatus: "Passed House", genericStatus: "approved", label: "Passed House" },
    { localStatus: "Passed Senate", genericStatus: "approved", label: "Passed Senate" },
    { localStatus: "To President", genericStatus: "approved", label: "To President" },
    { localStatus: "Enacted", genericStatus: "in-force", label: "Enacted" },
    { localStatus: "In Force", genericStatus: "in-force", label: "In Force" },
    { localStatus: "Draft", genericStatus: "draft", label: "Draft" },
    { localStatus: "Proposed Rule", genericStatus: "proposal", label: "Proposed Rule" },
    { localStatus: "Final Rule", genericStatus: "in-force", label: "Final Rule" },
    { localStatus: "Repealed", genericStatus: "repealed", label: "Repealed" }
  ],
  
  pipelineStages: [
    { stages: ["Introduced", "Committee", "Passed House", "Passed Senate", "To President", "Enacted"], instrumentType: "bill" },
    { stages: ["Draft", "Proposed", "Comment Period", "Final Rule", "Effective"], instrumentType: "regulation" }
  ],
  
  subnationalUnits: {
    label: "State",
    units: [
      { code: "AL", name: "Alabama" }, { code: "AK", name: "Alaska" }, { code: "AZ", name: "Arizona" },
      { code: "AR", name: "Arkansas" }, { code: "CA", name: "California" }, { code: "CO", name: "Colorado" },
      { code: "CT", name: "Connecticut" }, { code: "DE", name: "Delaware" }, { code: "FL", name: "Florida" },
      { code: "GA", name: "Georgia" }, { code: "HI", name: "Hawaii" }, { code: "ID", name: "Idaho" },
      { code: "IL", name: "Illinois" }, { code: "IN", name: "Indiana" }, { code: "IA", name: "Iowa" },
      { code: "KS", name: "Kansas" }, { code: "KY", name: "Kentucky" }, { code: "LA", name: "Louisiana" },
      { code: "ME", name: "Maine" }, { code: "MD", name: "Maryland" }, { code: "MA", name: "Massachusetts" },
      { code: "MI", name: "Michigan" }, { code: "MN", name: "Minnesota" }, { code: "MS", name: "Mississippi" },
      { code: "MO", name: "Missouri" }, { code: "MT", name: "Montana" }, { code: "NE", name: "Nebraska" },
      { code: "NV", name: "Nevada" }, { code: "NH", name: "New Hampshire" }, { code: "NJ", name: "New Jersey" },
      { code: "NM", name: "New Mexico" }, { code: "NY", name: "New York" }, { code: "NC", name: "North Carolina" },
      { code: "ND", name: "North Dakota" }, { code: "OH", name: "Ohio" }, { code: "OK", name: "Oklahoma" },
      { code: "OR", name: "Oregon" }, { code: "PA", name: "Pennsylvania" }, { code: "RI", name: "Rhode Island" },
      { code: "SC", name: "South Carolina" }, { code: "SD", name: "South Dakota" }, { code: "TN", name: "Tennessee" },
      { code: "TX", name: "Texas" }, { code: "UT", name: "Utah" }, { code: "VT", name: "Vermont" },
      { code: "VA", name: "Virginia" }, { code: "WA", name: "Washington" }, { code: "WV", name: "West Virginia" },
      { code: "WI", name: "Wisconsin" }, { code: "WY", name: "Wyoming" }, { code: "DC", name: "District of Columbia" }
    ]
  },
  
  jurisdictionLevels: [
    { id: "federal", label: "Federal", enabled: true },
    { id: "state", label: "State", enabled: true },
    { id: "local", label: "Local", enabled: true }
  ],
  authorityLabels: {
    congress: "U.S. Congress",
    "federal-agency": "Federal Agency",
    state: "State Legislature",
    city: "City/Municipal",
    court: "Federal Court"
  },
  
  hierarchyLabels: {
    constitutional: "Constitutional",
    primary: "Federal Statute",
    secondary: "Regulation",
    tertiary: "Ordinance",
    "soft-law": "Guidance",
    "case-law": "Case Law"
  },
  
  filterLabels: {
    instrumentType: "Document Type",
    hierarchy: "Norm Level",
    status: "Status",
    subnational: "State",
    authority: "Authority"
  },
  
  filterPresets: [
    {
      id: "high-risk-pipeline",
      name: "High Risk Pipeline",
      description: "High-risk bills currently in the legislative process",
      filters: { lifecycle: "pipeline", riskLevels: ["high"] }
    },
    {
      id: "tech-regulations",
      name: "Tech & Communications",
      description: "Technology and communications legislation",
      filters: { categories: ["Radio Regulations", "Cybersecurity"] }
    },
    {
      id: "product-safety",
      name: "Product Safety",
      description: "Consumer product safety and compliance",
      filters: { categories: ["Product Safety", "Battery Regulations"] }
    },
    {
      id: "federal-bills",
      name: "Federal Bills Only",
      description: "Only federal-level legislation",
      filters: { jurisdictionLevel: "federal", instrumentTypes: ["bill"] }
    },
    {
      id: "state-regulations",
      name: "State Regulations",
      description: "State-level rules and regulations",
      filters: { jurisdictionLevel: "state" }
    }
  ],
  
  caseLawFields: {
    courtLabel: "Court",
    chamberLabel: "Circuit/Division",
    citationLabel: "Citation"
  }
};

// ========== EU CONFIGURATION ==========
export const euConfig: JurisdictionConfig = {
  code: "EU",
  name: "European Union",
  region: "EU",
  legalSystem: "supranational",
  
  instrumentTypes: [
    { id: "regulation", label: "Regulation", emoji: "📋", hierarchyLevel: "primary" },
    { id: "directive", label: "Directive", emoji: "📜", hierarchyLevel: "primary" },
    { id: "decision", label: "Decision", emoji: "⚖️", hierarchyLevel: "secondary" },
    { id: "delegated-act", label: "Delegated Act", emoji: "📄", hierarchyLevel: "secondary" },
    { id: "implementing-act", label: "Implementing Act", emoji: "📋", hierarchyLevel: "tertiary" },
    { id: "recommendation", label: "Recommendation", emoji: "💡", hierarchyLevel: "soft-law" },
    { id: "opinion", label: "Opinion", emoji: "💬", hierarchyLevel: "soft-law" },
    { id: "cjeu-ruling", label: "CJEU Ruling", emoji: "⚖️", hierarchyLevel: "case-law", isCaseLaw: true }
  ],
  
  statusMappings: [
    { localStatus: "Proposal", genericStatus: "proposal", label: "Commission Proposal" },
    { localStatus: "First Reading", genericStatus: "in-committee", label: "First Reading" },
    { localStatus: "Second Reading", genericStatus: "in-committee", label: "Second Reading" },
    { localStatus: "Conciliation", genericStatus: "in-committee", label: "Conciliation" },
    { localStatus: "Adopted", genericStatus: "approved", label: "Adopted" },
    { localStatus: "Published OJ", genericStatus: "in-force", label: "Published in OJ" },
    { localStatus: "In Force", genericStatus: "in-force", label: "In Force" },
    { localStatus: "Transposition Period", genericStatus: "partially-in-force", label: "Transposition Period" },
    { localStatus: "Repealed", genericStatus: "repealed", label: "Repealed" }
  ],
  
  pipelineStages: [
    { stages: ["Proposal", "Parliament 1st", "Council", "Parliament 2nd", "Adopted", "In Force"], instrumentType: "directive" },
    { stages: ["Proposal", "Parliament", "Council", "Adopted", "In Force"], instrumentType: "regulation" }
  ],
  
  subnationalUnits: {
    label: "Member State",
    units: [
      { code: "AT", name: "Austria" }, { code: "BE", name: "Belgium" }, { code: "BG", name: "Bulgaria" },
      { code: "HR", name: "Croatia" }, { code: "CY", name: "Cyprus" }, { code: "CZ", name: "Czechia" },
      { code: "DK", name: "Denmark" }, { code: "EE", name: "Estonia" }, { code: "FI", name: "Finland" },
      { code: "FR", name: "France" }, { code: "DE", name: "Germany" }, { code: "GR", name: "Greece" },
      { code: "HU", name: "Hungary" }, { code: "IE", name: "Ireland" }, { code: "IT", name: "Italy" },
      { code: "LV", name: "Latvia" }, { code: "LT", name: "Lithuania" }, { code: "LU", name: "Luxembourg" },
      { code: "MT", name: "Malta" }, { code: "NL", name: "Netherlands" }, { code: "PL", name: "Poland" },
      { code: "PT", name: "Portugal" }, { code: "RO", name: "Romania" }, { code: "SK", name: "Slovakia" },
      { code: "SI", name: "Slovenia" }, { code: "ES", name: "Spain" }, { code: "SE", name: "Sweden" }
    ]
  },
  
  authorityLabels: {
    commission: "European Commission",
    parliament: "European Parliament",
    council: "Council of the EU",
    cjeu: "Court of Justice of the EU"
  },
  
  hierarchyLabels: {
    constitutional: "Treaty",
    primary: "Regulation/Directive",
    secondary: "Delegated Act",
    tertiary: "Implementing Act",
    "soft-law": "Recommendation/Opinion",
    "case-law": "CJEU Ruling"
  },
  
  filterLabels: {
    instrumentType: "Instrument Type",
    hierarchy: "Norm Level",
    status: "Status",
    subnational: "Member State",
    authority: "Institution"
  },
  
  filterPresets: [
    {
      id: "high-risk-directives",
      name: "High Risk Directives",
      description: "High-risk EU directives requiring member state transposition",
      filters: { lifecycle: "pipeline", riskLevels: ["high"], instrumentTypes: ["directive"] }
    },
    {
      id: "product-regulations",
      name: "Product Regulations",
      description: "Product safety and CE marking regulations",
      filters: { categories: ["Product Safety", "Radio Regulations"] }
    },
    {
      id: "cybersecurity",
      name: "Cybersecurity & Data",
      description: "Cybersecurity and data protection legislation",
      filters: { categories: ["Cybersecurity"] }
    },
    {
      id: "energy-battery",
      name: "Energy & Battery",
      description: "Battery and eco-design regulations",
      filters: { categories: ["Battery Regulations"] }
    }
  ],
  
  caseLawFields: {
    courtLabel: "Court",
    chamberLabel: "Chamber",
    citationLabel: "Case Number"
  }
};

// ========== COSTA RICA CONFIGURATION (Estado unitario - NO Federal) ==========
export const costaRicaConfig: JurisdictionConfig = {
  code: "CR",
  name: "Costa Rica",
  region: "LATAM",
  legalSystem: "civil-law",
  
  instrumentTypes: [
    { id: "proyecto", label: "Proyecto de Ley", emoji: "📝", hierarchyLevel: "primary" },
    { id: "ley", label: "Ley", emoji: "⚖️", hierarchyLevel: "primary" },
    { id: "decreto", label: "Decreto Ejecutivo", emoji: "📜", hierarchyLevel: "secondary" },
    { id: "reglamento", label: "Reglamento", emoji: "📋", hierarchyLevel: "secondary" },
    { id: "resolucion", label: "Resolución/Directriz", emoji: "📄", hierarchyLevel: "tertiary" },
    { id: "acuerdo", label: "Acuerdo", emoji: "🤝", hierarchyLevel: "tertiary" },
    { id: "ordenanza-municipal", label: "Ordenanza Municipal", emoji: "🏘️", hierarchyLevel: "tertiary" },
    { id: "reglamento-municipal", label: "Reglamento Municipal", emoji: "🏘️", hierarchyLevel: "tertiary" },
    { id: "normativa-regulatoria", label: "Normativa Regulatoria", emoji: "🏛️", hierarchyLevel: "secondary" },
    { id: "circular", label: "Circular", emoji: "📢", hierarchyLevel: "soft-law" }
  ],
  
  statusMappings: [
    // Proyectos de ley
    { localStatus: "presentado", genericStatus: "proposal", label: "Presentado" },
    { localStatus: "en_tramite", genericStatus: "proposal", label: "En Trámite" },
    { localStatus: "dictamen_comision", genericStatus: "in-committee", label: "Dictaminado" },
    { localStatus: "primer_debate", genericStatus: "in-committee", label: "Primer Debate" },
    { localStatus: "segundo_debate", genericStatus: "approved", label: "Segundo Debate" },
    { localStatus: "enviado_ejecutivo", genericStatus: "approved", label: "Enviado al Ejecutivo" },
    { localStatus: "sancionado", genericStatus: "approved", label: "Sancionado" },
    { localStatus: "vetado", genericStatus: "in-committee", label: "Vetado" },
    { localStatus: "publicado_gaceta", genericStatus: "in-force", label: "Publicado (La Gaceta)" },
    { localStatus: "archivado", genericStatus: "repealed", label: "Archivado" },
    // Normas vigentes
    { localStatus: "vigente", genericStatus: "in-force", label: "Vigente" },
    { localStatus: "modificada", genericStatus: "in-force", label: "Modificada" },
    { localStatus: "derogada", genericStatus: "repealed", label: "Derogada" },
    { localStatus: "suspendida", genericStatus: "partially-in-force", label: "Suspendida" },
    { localStatus: "en_consulta", genericStatus: "proposal", label: "En Consulta Pública" }
  ],
  
  pipelineStages: [
    { 
      stages: ["Presentado", "En Comisión", "Dictaminado", "Primer Debate", "Segundo Debate", "Enviado al Ejecutivo", "Sancionado/Vetado", "Publicado (La Gaceta)"], 
      instrumentType: "proyecto" 
    }
  ],
  
  // Niveles jurisdiccionales para Costa Rica (Estado unitario - NO "Federal")
  jurisdictionLevels: [
    { id: "federal", label: "Nacional", enabled: true },
    { id: "local", label: "Municipal", enabled: true }
  ],
  
  // Provincias (solo relevantes para filtrar por ubicación geográfica de impacto, NO nivel normativo)
  subnationalUnits: {
    label: "Cantón",
    units: [
      { code: "SJ", name: "San José" }, { code: "AL", name: "Alajuela" }, { code: "CA", name: "Cartago" },
      { code: "HE", name: "Heredia" }, { code: "GU", name: "Guanacaste" }, { code: "PU", name: "Puntarenas" },
      { code: "LI", name: "Limón" }
    ]
  },
  
  authorityLabels: {
    asamblea: "Asamblea Legislativa",
    ejecutivo: "Poder Ejecutivo",
    micit: "MICIT",
    meic: "MEIC",
    hacienda: "Ministerio de Hacienda",
    salud: "Ministerio de Salud",
    ambiente: "MINAE",
    conassif: "CONASSIF",
    sugef: "SUGEF",
    sugeval: "SUGEVAL",
    supen: "SUPEN",
    sugese: "SUGESE",
    aresep: "ARESEP",
    sutel: "SUTEL",
    inteco: "INTECO",
    bccr: "Banco Central",
    municipalidad: "Municipalidad"
  },
  
  hierarchyLabels: {
    constitutional: "Constitución Política",
    primary: "Ley",
    secondary: "Decreto/Reglamento",
    tertiary: "Resolución/Ordenanza",
    "soft-law": "Circular/Directriz",
    "case-law": "Jurisprudencia"
  },
  
  filterLabels: {
    instrumentType: "Tipo de Norma",
    hierarchy: "Jerarquía",
    status: "Estado",
    subnational: "Cantón",
    authority: "Órgano Emisor"
  },
  
  filterPresets: [
    {
      id: "proyectos-alto-riesgo",
      name: "Proyectos Alto Riesgo",
      description: "Proyectos de ley con alto riesgo regulatorio",
      filters: { lifecycle: "pipeline", riskLevels: ["high"], instrumentTypes: ["proyecto"] }
    },
    {
      id: "vigentes-electrodomesticos",
      name: "Vigentes Electrodomésticos",
      description: "Normativa vigente aplicable a electrodomésticos",
      filters: { lifecycle: "in-force", categories: ["Product Safety", "Battery Regulations"] }
    },
    {
      id: "reguladores",
      name: "Normativa Reguladores",
      description: "Normativa de entes reguladores (SUGEF, ARESEP, etc.)",
      filters: { instrumentTypes: ["normativa-regulatoria"] }
    },
    {
      id: "municipal",
      name: "Ordenanzas Municipales",
      description: "Normativa municipal",
      filters: { jurisdictionLevel: "local" }
    }
  ]
};

// ========== LATAM CONFIGURATION (Generic for other LATAM countries) ==========
export const latamConfig: JurisdictionConfig = {
  code: "LATAM",
  name: "Latin America",
  region: "LATAM",
  legalSystem: "civil-law",
  
  instrumentTypes: [
    { id: "ley", label: "Ley", emoji: "⚖️", hierarchyLevel: "primary" },
    { id: "decreto", label: "Decreto", emoji: "📜", hierarchyLevel: "secondary" },
    { id: "reglamento", label: "Reglamento", emoji: "📋", hierarchyLevel: "secondary" },
    { id: "resolucion", label: "Resolución", emoji: "📄", hierarchyLevel: "tertiary" },
    { id: "proyecto", label: "Proyecto de Ley", emoji: "📝", hierarchyLevel: "primary" },
    { id: "circular", label: "Circular", emoji: "📢", hierarchyLevel: "soft-law" },
    { id: "norma-tecnica", label: "Norma Técnica", emoji: "🔧", hierarchyLevel: "tertiary" }
  ],
  
  statusMappings: [
    { localStatus: "Presentado", genericStatus: "proposal", label: "Presentado" },
    { localStatus: "En Comisión", genericStatus: "in-committee", label: "En Comisión" },
    { localStatus: "Primer Debate", genericStatus: "in-committee", label: "Primer Debate" },
    { localStatus: "Segundo Debate", genericStatus: "approved", label: "Segundo Debate" },
    { localStatus: "Sancionada", genericStatus: "approved", label: "Sancionada" },
    { localStatus: "Promulgada", genericStatus: "in-force", label: "Promulgada" },
    { localStatus: "Vigente", genericStatus: "in-force", label: "Vigente" },
    { localStatus: "Publicada", genericStatus: "in-force", label: "Publicada en Gaceta" },
    { localStatus: "Derogada", genericStatus: "repealed", label: "Derogada" }
  ],
  
  pipelineStages: [
    { stages: ["Presentado", "Comisión", "Primer Debate", "Segundo Debate", "Sanción", "Promulgación"], instrumentType: "proyecto" }
  ],
  
  subnationalUnits: {
    label: "Province",
    units: [
      { code: "SJ", name: "San José" }, { code: "AL", name: "Alajuela" }, { code: "CA", name: "Cartago" },
      { code: "HE", name: "Heredia" }, { code: "GU", name: "Guanacaste" }, { code: "PU", name: "Puntarenas" },
      { code: "LI", name: "Limón" }
    ]
  },
  
  authorityLabels: {
    asamblea: "Asamblea Legislativa",
    ejecutivo: "Poder Ejecutivo",
    ministerio: "Ministerio",
    municipalidad: "Municipalidad"
  },
  
  hierarchyLabels: {
    constitutional: "Constitución",
    primary: "Ley",
    secondary: "Decreto/Reglamento",
    tertiary: "Resolución",
    "soft-law": "Circular/Directriz",
    "case-law": "Jurisprudencia"
  },
  
  filterLabels: {
    instrumentType: "Tipo de Norma",
    hierarchy: "Jerarquía",
    status: "Estado",
    subnational: "Provincia",
    authority: "Ente Emisor"
  }
};

// ========== GCC CONFIGURATION ==========
export const gccConfig: JurisdictionConfig = {
  code: "GCC",
  name: "Gulf Cooperation Council",
  region: "GCC",
  legalSystem: "islamic",
  
  instrumentTypes: [
    { id: "royal-decree", label: "Royal Decree", emoji: "👑", hierarchyLevel: "primary" },
    { id: "federal-law", label: "Federal Law", emoji: "⚖️", hierarchyLevel: "primary" },
    { id: "ministerial-decision", label: "Ministerial Decision", emoji: "📋", hierarchyLevel: "secondary" },
    { id: "resolution", label: "Resolution", emoji: "📄", hierarchyLevel: "secondary" },
    { id: "circular", label: "Circular", emoji: "📢", hierarchyLevel: "tertiary" },
    { id: "technical-standard", label: "Technical Standard", emoji: "🔧", hierarchyLevel: "tertiary" },
    { id: "guidance", label: "Guidance", emoji: "💡", hierarchyLevel: "soft-law" }
  ],
  
  statusMappings: [
    { localStatus: "Draft", genericStatus: "draft", label: "Draft" },
    { localStatus: "Under Review", genericStatus: "in-committee", label: "Under Review" },
    { localStatus: "Approved", genericStatus: "approved", label: "Approved" },
    { localStatus: "Published", genericStatus: "in-force", label: "Published" },
    { localStatus: "In Force", genericStatus: "in-force", label: "In Force" },
    { localStatus: "Effective", genericStatus: "in-force", label: "Effective" },
    { localStatus: "Superseded", genericStatus: "repealed", label: "Superseded" }
  ],
  
  pipelineStages: [
    { stages: ["Draft", "Review", "Consultation", "Approval", "Publication", "In Force"], instrumentType: "federal-law" }
  ],
  
  subnationalUnits: {
    label: "Country",
    units: [
      { code: "UAE", name: "United Arab Emirates" }, { code: "KSA", name: "Saudi Arabia" },
      { code: "KW", name: "Kuwait" }, { code: "QA", name: "Qatar" },
      { code: "BH", name: "Bahrain" }, { code: "OM", name: "Oman" }
    ]
  },
  
  authorityLabels: {
    "royal-court": "Royal Court",
    cabinet: "Cabinet",
    ministry: "Ministry",
    authority: "Regulatory Authority"
  },
  
  hierarchyLabels: {
    constitutional: "Basic Law/Constitution",
    primary: "Royal Decree/Federal Law",
    secondary: "Ministerial Decision",
    tertiary: "Resolution/Standard",
    "soft-law": "Guidance/Circular",
    "case-law": "Court Ruling"
  },
  
  filterLabels: {
    instrumentType: "Instrument Type",
    hierarchy: "Norm Level",
    status: "Status",
    subnational: "Country",
    authority: "Issuing Body"
  }
};

// ========== JAPAN CONFIGURATION ==========
export const japanConfig: JurisdictionConfig = {
  code: "JP",
  name: "Japan",
  region: "APAC",
  legalSystem: "civil-law",
  
  instrumentTypes: [
    { id: "act", label: "Act (法律)", emoji: "⚖️", hierarchyLevel: "primary" },
    { id: "cabinet-order", label: "Cabinet Order (政令)", emoji: "📜", hierarchyLevel: "secondary" },
    { id: "ministerial-ordinance", label: "Ministerial Ordinance (省令)", emoji: "📋", hierarchyLevel: "secondary" },
    { id: "notification", label: "Notification (告示)", emoji: "📢", hierarchyLevel: "tertiary" },
    { id: "guideline", label: "Guideline (ガイドライン)", emoji: "💡", hierarchyLevel: "soft-law" },
    { id: "administrative-notice", label: "Administrative Notice (通達)", emoji: "📄", hierarchyLevel: "soft-law" }
  ],
  
  statusMappings: [
    { localStatus: "Bill Submitted", genericStatus: "proposal", label: "Bill Submitted" },
    { localStatus: "Diet Deliberation", genericStatus: "in-committee", label: "Diet Deliberation" },
    { localStatus: "Passed", genericStatus: "approved", label: "Passed" },
    { localStatus: "Promulgated", genericStatus: "in-force", label: "Promulgated" },
    { localStatus: "In Force", genericStatus: "in-force", label: "In Force" },
    { localStatus: "Draft", genericStatus: "draft", label: "Draft" },
    { localStatus: "Public Comment", genericStatus: "in-committee", label: "Public Comment" },
    { localStatus: "Abolished", genericStatus: "repealed", label: "Abolished" }
  ],
  
  pipelineStages: [
    { stages: ["Submitted", "Committee", "Plenary (H)", "Plenary (S)", "Promulgated", "In Force"], instrumentType: "act" },
    { stages: ["Draft", "Public Comment", "Issued", "In Force"], instrumentType: "cabinet-order" }
  ],
  
  subnationalUnits: {
    label: "Prefecture",
    units: [
      { code: "TK", name: "Tokyo" }, { code: "OS", name: "Osaka" }, { code: "KC", name: "Kanagawa" },
      { code: "AI", name: "Aichi" }, { code: "FK", name: "Fukuoka" }, { code: "HK", name: "Hokkaido" },
      { code: "HG", name: "Hyogo" }, { code: "ST", name: "Saitama" }, { code: "CB", name: "Chiba" },
      { code: "KT", name: "Kyoto" }
    ]
  },
  
  authorityLabels: {
    diet: "National Diet",
    cabinet: "Cabinet",
    ministry: "Ministry",
    agency: "Agency"
  },
  
  hierarchyLabels: {
    constitutional: "Constitution",
    primary: "Act (法律)",
    secondary: "Order/Ordinance",
    tertiary: "Notification",
    "soft-law": "Guideline/Notice",
    "case-law": "Supreme Court Ruling"
  },
  
  filterLabels: {
    instrumentType: "Instrument Type",
    hierarchy: "Norm Level",
    status: "Status",
    subnational: "Prefecture",
    authority: "Issuing Body"
  },
  
  jurisdictionLevels: [
    { id: "federal", label: "国 (National)", enabled: true },
    { id: "state", label: "都道府県 (Prefecture)", enabled: true },
    { id: "local", label: "市区町村 (Municipal)", enabled: true }
  ]
};

// ========== APAC CONFIGURATION (Korea/Taiwan) ==========
export const apacConfig: JurisdictionConfig = {
  code: "APAC",
  name: "Asia-Pacific",
  region: "APAC",
  legalSystem: "civil-law",
  
  instrumentTypes: [
    { id: "act", label: "Act", emoji: "⚖️", hierarchyLevel: "primary" },
    { id: "presidential-decree", label: "Presidential Decree", emoji: "📜", hierarchyLevel: "secondary" },
    { id: "ministerial-ordinance", label: "Ministerial Ordinance", emoji: "📋", hierarchyLevel: "secondary" },
    { id: "notice", label: "Notice / Announcement", emoji: "📢", hierarchyLevel: "tertiary" },
    { id: "guideline", label: "Guideline", emoji: "💡", hierarchyLevel: "soft-law" },
    { id: "standard", label: "Technical Standard", emoji: "🔧", hierarchyLevel: "tertiary" }
  ],
  
  statusMappings: [
    { localStatus: "Proposed", genericStatus: "proposal", label: "Proposed" },
    { localStatus: "Committee Review", genericStatus: "in-committee", label: "Committee Review" },
    { localStatus: "Plenary Vote", genericStatus: "approved", label: "Plenary Vote" },
    { localStatus: "Promulgated", genericStatus: "in-force", label: "Promulgated" },
    { localStatus: "In Force", genericStatus: "in-force", label: "In Force" },
    { localStatus: "Draft", genericStatus: "draft", label: "Draft" },
    { localStatus: "Abolished", genericStatus: "repealed", label: "Abolished" }
  ],
  
  pipelineStages: [
    { stages: ["Proposed", "Committee", "Plenary", "Promulgated", "In Force"], instrumentType: "act" }
  ],
  
  subnationalUnits: {
    label: "Country/Region",
    units: [
      { code: "KR", name: "South Korea" }, { code: "TW", name: "Taiwan" },
      { code: "AU", name: "Australia" }, { code: "NZ", name: "New Zealand" },
      { code: "SG", name: "Singapore" }, { code: "MY", name: "Malaysia" },
      { code: "TH", name: "Thailand" }, { code: "VN", name: "Vietnam" },
      { code: "ID", name: "Indonesia" }, { code: "PH", name: "Philippines" }
    ]
  },
  
  authorityLabels: {
    legislature: "National Assembly/Legislature",
    executive: "Executive Branch",
    ministry: "Ministry",
    agency: "Agency"
  },
  
  hierarchyLabels: {
    constitutional: "Constitution",
    primary: "Act",
    secondary: "Decree/Ordinance",
    tertiary: "Notice/Standard",
    "soft-law": "Guideline",
    "case-law": "Court Ruling"
  },
  
  filterLabels: {
    instrumentType: "Instrument Type",
    hierarchy: "Norm Level",
    status: "Status",
    subnational: "Country/Region",
    authority: "Issuing Body"
  }
};

// ========== CANADA CONFIGURATION ==========
export const canadaConfig: JurisdictionConfig = {
  code: "CA",
  name: "Canada",
  region: "NAM",
  legalSystem: "mixed", // Common law + Civil law (Quebec)
  
  instrumentTypes: [
    { id: "act", label: "Act", emoji: "⚖️", hierarchyLevel: "primary" },
    { id: "bill", label: "Bill", emoji: "📜", hierarchyLevel: "primary" },
    { id: "regulation", label: "Regulation (SOR)", emoji: "📋", hierarchyLevel: "secondary" },
    { id: "order-in-council", label: "Order in Council", emoji: "🏛️", hierarchyLevel: "secondary" },
    { id: "policy", label: "Policy/Guideline", emoji: "💡", hierarchyLevel: "soft-law" },
    { id: "case", label: "Case Law", emoji: "⚖️", hierarchyLevel: "case-law", isCaseLaw: true }
  ],
  
  statusMappings: [
    { localStatus: "First Reading", genericStatus: "proposal", label: "First Reading" },
    { localStatus: "Second Reading", genericStatus: "in-committee", label: "Second Reading" },
    { localStatus: "Committee Stage", genericStatus: "in-committee", label: "Committee Stage" },
    { localStatus: "Report Stage", genericStatus: "approved", label: "Report Stage" },
    { localStatus: "Third Reading", genericStatus: "approved", label: "Third Reading" },
    { localStatus: "Royal Assent", genericStatus: "in-force", label: "Royal Assent" },
    { localStatus: "In Force", genericStatus: "in-force", label: "In Force" },
    { localStatus: "Repealed", genericStatus: "repealed", label: "Repealed" }
  ],
  
  pipelineStages: [
    { stages: ["1st Reading", "2nd Reading", "Committee", "Report", "3rd Reading", "Royal Assent"], instrumentType: "bill" }
  ],
  
  subnationalUnits: {
    label: "Province/Territory",
    units: [
      { code: "ON", name: "Ontario" }, { code: "QC", name: "Quebec" }, { code: "BC", name: "British Columbia" },
      { code: "AB", name: "Alberta" }, { code: "MB", name: "Manitoba" }, { code: "SK", name: "Saskatchewan" },
      { code: "NS", name: "Nova Scotia" }, { code: "NB", name: "New Brunswick" }, { code: "NL", name: "Newfoundland and Labrador" },
      { code: "PE", name: "Prince Edward Island" }, { code: "NT", name: "Northwest Territories" },
      { code: "YT", name: "Yukon" }, { code: "NU", name: "Nunavut" }
    ]
  },
  
  authorityLabels: {
    parliament: "Parliament of Canada",
    cabinet: "Governor in Council",
    ministry: "Federal Ministry",
    province: "Provincial Legislature"
  },
  
  hierarchyLabels: {
    constitutional: "Constitution",
    primary: "Act of Parliament",
    secondary: "Regulation",
    tertiary: "Order/Directive",
    "soft-law": "Policy/Guideline",
    "case-law": "Case Law"
  },
  
  filterLabels: {
    instrumentType: "Document Type",
    hierarchy: "Norm Level",
    status: "Status",
    subnational: "Province/Territory",
    authority: "Authority"
  },
  
  caseLawFields: {
    courtLabel: "Court",
    chamberLabel: "Division",
    citationLabel: "Citation"
  }
};

// ========== ALL CONFIGURATIONS EXPORT ==========
export const jurisdictionConfigs: Record<string, JurisdictionConfig> = {
  USA: usaConfig,
  EU: euConfig,
  LATAM: latamConfig,
  CR: costaRicaConfig,  // Costa Rica specific config
  GCC: gccConfig,
  JP: japanConfig,
  APAC: apacConfig,
  CA: canadaConfig
};

// Helper to get config by region
export function getConfigByRegion(region: RegionCode): JurisdictionConfig | null {
  const regionToConfig: Record<RegionCode, string> = {
    NAM: "USA",
    LATAM: "LATAM",
    EU: "EU",
    GCC: "GCC",
    APAC: "APAC"
  };
  return jurisdictionConfigs[regionToConfig[region]] || null;
}

// Helper to get instrument type by ID
export function getInstrumentType(config: JurisdictionConfig, id: string): InstrumentTypeConfig | undefined {
  return config.instrumentTypes.find(t => t.id === id);
}

// Helper to map local status to generic
export function mapStatusToGeneric(config: JurisdictionConfig, localStatus: string): GenericStatus {
  const mapping = config.statusMappings.find(m => 
    m.localStatus.toLowerCase() === localStatus.toLowerCase()
  );
  return mapping?.genericStatus || "draft";
}

// Helper to get pipeline stages for instrument type
export function getPipelineStages(config: JurisdictionConfig, instrumentType?: string): string[] {
  if (instrumentType) {
    const specific = config.pipelineStages.find(p => p.instrumentType === instrumentType);
    if (specific) return specific.stages;
  }
  return config.pipelineStages[0]?.stages || [];
}
