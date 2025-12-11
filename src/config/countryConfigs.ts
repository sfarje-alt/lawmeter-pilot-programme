// Individual country configurations for GCC and other jurisdictions
import { JurisdictionConfig } from "./jurisdictionConfig";

// ========== UAE CONFIGURATION ==========
export const uaeConfig: JurisdictionConfig = {
  code: "UAE",
  name: "United Arab Emirates",
  region: "GCC",
  legalSystem: "islamic",
  
  instrumentTypes: [
    { id: "federal-law", label: "Federal Law", emoji: "⚖️", hierarchyLevel: "primary" },
    { id: "federal-decree", label: "Federal Decree-Law", emoji: "👑", hierarchyLevel: "primary" },
    { id: "cabinet-resolution", label: "Cabinet Resolution", emoji: "📋", hierarchyLevel: "secondary" },
    { id: "ministerial-decision", label: "Ministerial Decision", emoji: "📄", hierarchyLevel: "secondary" },
    { id: "circular", label: "Circular", emoji: "📢", hierarchyLevel: "tertiary" },
    { id: "technical-regulation", label: "Technical Regulation", emoji: "🔧", hierarchyLevel: "tertiary" },
    { id: "esma-standard", label: "ESMA Standard", emoji: "✅", hierarchyLevel: "tertiary" }
  ],
  
  statusMappings: [
    { localStatus: "Draft", genericStatus: "draft", label: "Draft" },
    { localStatus: "Under Review", genericStatus: "in-committee", label: "Under Review" },
    { localStatus: "Approved", genericStatus: "approved", label: "Approved" },
    { localStatus: "Published", genericStatus: "in-force", label: "Published" },
    { localStatus: "In Force", genericStatus: "in-force", label: "In Force" },
    { localStatus: "Superseded", genericStatus: "repealed", label: "Superseded" }
  ],
  
  pipelineStages: [
    { stages: ["Draft", "Ministry Review", "Cabinet Approval", "Presidential Approval", "Gazette Publication", "In Force"], instrumentType: "federal-law" }
  ],
  
  subnationalUnits: {
    label: "Emirate",
    units: [
      { code: "AUH", name: "Abu Dhabi" }, { code: "DXB", name: "Dubai" },
      { code: "SHJ", name: "Sharjah" }, { code: "AJM", name: "Ajman" },
      { code: "RAK", name: "Ras Al Khaimah" }, { code: "FUJ", name: "Fujairah" },
      { code: "UAQ", name: "Umm Al Quwain" }
    ]
  },
  
  authorityLabels: {
    cabinet: "UAE Cabinet",
    ministry: "Federal Ministry",
    esma: "Emirates Authority for Standardization",
    tdra: "TDRA",
    sca: "Securities & Commodities Authority"
  },
  
  hierarchyLabels: {
    constitutional: "Constitution",
    primary: "Federal Law/Decree",
    secondary: "Cabinet/Ministerial Resolution",
    tertiary: "Circular/Technical Regulation",
    "soft-law": "Guidance",
    "case-law": "Court Ruling"
  },
  
  filterLabels: {
    instrumentType: "Instrument Type",
    hierarchy: "Norm Level",
    status: "Status",
    subnational: "Emirate",
    authority: "Issuing Body"
  }
};

// ========== SAUDI ARABIA CONFIGURATION ==========
export const saudiConfig: JurisdictionConfig = {
  code: "KSA",
  name: "Saudi Arabia",
  region: "GCC",
  legalSystem: "islamic",
  
  instrumentTypes: [
    { id: "royal-decree", label: "Royal Decree", emoji: "👑", hierarchyLevel: "primary" },
    { id: "royal-order", label: "Royal Order", emoji: "📜", hierarchyLevel: "primary" },
    { id: "council-resolution", label: "Council of Ministers Resolution", emoji: "⚖️", hierarchyLevel: "secondary" },
    { id: "ministerial-decision", label: "Ministerial Decision", emoji: "📋", hierarchyLevel: "secondary" },
    { id: "saso-standard", label: "SASO Standard", emoji: "✅", hierarchyLevel: "tertiary" },
    { id: "circular", label: "Circular", emoji: "📢", hierarchyLevel: "tertiary" }
  ],
  
  statusMappings: [
    { localStatus: "Draft", genericStatus: "draft", label: "Draft" },
    { localStatus: "Shura Council Review", genericStatus: "in-committee", label: "Shura Council Review" },
    { localStatus: "Cabinet Approval", genericStatus: "approved", label: "Cabinet Approved" },
    { localStatus: "Royal Approval", genericStatus: "approved", label: "Royal Approval" },
    { localStatus: "Published", genericStatus: "in-force", label: "Published in Umm Al-Qura" },
    { localStatus: "In Force", genericStatus: "in-force", label: "In Force" },
    { localStatus: "Repealed", genericStatus: "repealed", label: "Repealed" }
  ],
  
  pipelineStages: [
    { stages: ["Draft", "Shura Council", "Cabinet", "Royal Approval", "Gazette", "In Force"], instrumentType: "royal-decree" }
  ],
  
  authorityLabels: {
    "royal-court": "Royal Court",
    shura: "Shura Council",
    cabinet: "Council of Ministers",
    saso: "SASO",
    citc: "CITC",
    sfda: "SFDA"
  },
  
  hierarchyLabels: {
    constitutional: "Basic Law",
    primary: "Royal Decree/Order",
    secondary: "Council Resolution",
    tertiary: "Ministerial Decision/Standard",
    "soft-law": "Circular/Guidance",
    "case-law": "Court Ruling"
  },
  
  filterLabels: {
    instrumentType: "Instrument Type",
    hierarchy: "Norm Level",
    status: "Status",
    subnational: "Region",
    authority: "Issuing Body"
  }
};

// ========== OMAN CONFIGURATION ==========
export const omanConfig: JurisdictionConfig = {
  code: "OM",
  name: "Oman",
  region: "GCC",
  legalSystem: "islamic",
  
  instrumentTypes: [
    { id: "royal-decree", label: "Royal Decree", emoji: "👑", hierarchyLevel: "primary" },
    { id: "sultani-decree", label: "Sultani Decree", emoji: "📜", hierarchyLevel: "primary" },
    { id: "ministerial-decision", label: "Ministerial Decision", emoji: "📋", hierarchyLevel: "secondary" },
    { id: "osos-standard", label: "OSOS Standard", emoji: "✅", hierarchyLevel: "tertiary" },
    { id: "circular", label: "Circular", emoji: "📢", hierarchyLevel: "tertiary" }
  ],
  
  statusMappings: [
    { localStatus: "Draft", genericStatus: "draft", label: "Draft" },
    { localStatus: "Under Review", genericStatus: "in-committee", label: "Under Review" },
    { localStatus: "Approved", genericStatus: "approved", label: "Approved" },
    { localStatus: "Published", genericStatus: "in-force", label: "Published in Official Gazette" },
    { localStatus: "In Force", genericStatus: "in-force", label: "In Force" },
    { localStatus: "Repealed", genericStatus: "repealed", label: "Repealed" }
  ],
  
  pipelineStages: [
    { stages: ["Draft", "Shura Review", "State Council", "Royal Approval", "Gazette", "In Force"], instrumentType: "royal-decree" }
  ],
  
  authorityLabels: {
    sultan: "Royal Court",
    shura: "Majlis A'Shura",
    cabinet: "Cabinet",
    osos: "OSOS",
    tra: "TRA"
  },
  
  hierarchyLabels: {
    constitutional: "Basic Law",
    primary: "Royal/Sultani Decree",
    secondary: "Ministerial Decision",
    tertiary: "Standard/Circular",
    "soft-law": "Guidance",
    "case-law": "Court Ruling"
  },
  
  filterLabels: {
    instrumentType: "Instrument Type",
    hierarchy: "Norm Level",
    status: "Status",
    subnational: "Governorate",
    authority: "Issuing Body"
  }
};

// ========== KUWAIT CONFIGURATION ==========
export const kuwaitConfig: JurisdictionConfig = {
  code: "KW",
  name: "Kuwait",
  region: "GCC",
  legalSystem: "islamic",
  
  instrumentTypes: [
    { id: "law", label: "Law", emoji: "⚖️", hierarchyLevel: "primary" },
    { id: "emiri-decree", label: "Emiri Decree", emoji: "👑", hierarchyLevel: "primary" },
    { id: "ministerial-resolution", label: "Ministerial Resolution", emoji: "📋", hierarchyLevel: "secondary" },
    { id: "kucas-standard", label: "KUCAS Standard", emoji: "✅", hierarchyLevel: "tertiary" },
    { id: "circular", label: "Circular", emoji: "📢", hierarchyLevel: "tertiary" }
  ],
  
  statusMappings: [
    { localStatus: "Draft", genericStatus: "draft", label: "Draft" },
    { localStatus: "Assembly Review", genericStatus: "in-committee", label: "National Assembly Review" },
    { localStatus: "Approved", genericStatus: "approved", label: "Approved" },
    { localStatus: "Published", genericStatus: "in-force", label: "Published in Kuwait Al-Youm" },
    { localStatus: "In Force", genericStatus: "in-force", label: "In Force" }
  ],
  
  pipelineStages: [
    { stages: ["Draft", "Assembly", "Committee", "Vote", "Emiri Approval", "Gazette", "In Force"], instrumentType: "law" }
  ],
  
  authorityLabels: {
    emir: "Emiri Diwan",
    assembly: "National Assembly",
    cabinet: "Cabinet",
    kucas: "KUCAS",
    citra: "CITRA"
  },
  
  hierarchyLabels: {
    constitutional: "Constitution",
    primary: "Law/Emiri Decree",
    secondary: "Ministerial Resolution",
    tertiary: "Standard/Circular",
    "soft-law": "Guidance",
    "case-law": "Court Ruling"
  },
  
  filterLabels: {
    instrumentType: "Instrument Type",
    hierarchy: "Norm Level",
    status: "Status",
    subnational: "Governorate",
    authority: "Issuing Body"
  }
};

// ========== BAHRAIN CONFIGURATION ==========
export const bahrainConfig: JurisdictionConfig = {
  code: "BH",
  name: "Bahrain",
  region: "GCC",
  legalSystem: "islamic",
  
  instrumentTypes: [
    { id: "law", label: "Law", emoji: "⚖️", hierarchyLevel: "primary" },
    { id: "royal-decree", label: "Royal Decree", emoji: "👑", hierarchyLevel: "primary" },
    { id: "ministerial-order", label: "Ministerial Order", emoji: "📋", hierarchyLevel: "secondary" },
    { id: "bsmd-standard", label: "BSMD Standard", emoji: "✅", hierarchyLevel: "tertiary" },
    { id: "circular", label: "Circular", emoji: "📢", hierarchyLevel: "tertiary" }
  ],
  
  statusMappings: [
    { localStatus: "Draft", genericStatus: "draft", label: "Draft" },
    { localStatus: "Parliament Review", genericStatus: "in-committee", label: "Parliament Review" },
    { localStatus: "Shura Review", genericStatus: "in-committee", label: "Shura Council Review" },
    { localStatus: "Royal Approval", genericStatus: "approved", label: "Royal Approval" },
    { localStatus: "Published", genericStatus: "in-force", label: "Published in Official Gazette" },
    { localStatus: "In Force", genericStatus: "in-force", label: "In Force" }
  ],
  
  pipelineStages: [
    { stages: ["Draft", "Parliament", "Shura Council", "Joint Session", "Royal Approval", "Gazette", "In Force"], instrumentType: "law" }
  ],
  
  authorityLabels: {
    king: "Royal Court",
    parliament: "Council of Representatives",
    shura: "Shura Council",
    cabinet: "Cabinet",
    bsmd: "BSMD",
    tra: "TRA"
  },
  
  hierarchyLabels: {
    constitutional: "Constitution",
    primary: "Law/Royal Decree",
    secondary: "Ministerial Order",
    tertiary: "Standard/Circular",
    "soft-law": "Guidance",
    "case-law": "Court Ruling"
  },
  
  filterLabels: {
    instrumentType: "Instrument Type",
    hierarchy: "Norm Level",
    status: "Status",
    subnational: "Governorate",
    authority: "Issuing Body"
  }
};

// ========== QATAR CONFIGURATION ==========
export const qatarConfig: JurisdictionConfig = {
  code: "QA",
  name: "Qatar",
  region: "GCC",
  legalSystem: "islamic",
  
  instrumentTypes: [
    { id: "law", label: "Law", emoji: "⚖️", hierarchyLevel: "primary" },
    { id: "emiri-decree", label: "Emiri Decree", emoji: "👑", hierarchyLevel: "primary" },
    { id: "cabinet-decision", label: "Cabinet Decision", emoji: "📋", hierarchyLevel: "secondary" },
    { id: "ministerial-decision", label: "Ministerial Decision", emoji: "📄", hierarchyLevel: "secondary" },
    { id: "qsm-standard", label: "QSM Standard", emoji: "✅", hierarchyLevel: "tertiary" },
    { id: "circular", label: "Circular", emoji: "📢", hierarchyLevel: "tertiary" }
  ],
  
  statusMappings: [
    { localStatus: "Draft", genericStatus: "draft", label: "Draft" },
    { localStatus: "Shura Review", genericStatus: "in-committee", label: "Shura Council Review" },
    { localStatus: "Cabinet Approval", genericStatus: "approved", label: "Cabinet Approved" },
    { localStatus: "Emiri Approval", genericStatus: "approved", label: "Emiri Approval" },
    { localStatus: "Published", genericStatus: "in-force", label: "Published in Official Gazette" },
    { localStatus: "In Force", genericStatus: "in-force", label: "In Force" }
  ],
  
  pipelineStages: [
    { stages: ["Draft", "Shura Council", "Cabinet", "Emiri Approval", "Gazette", "In Force"], instrumentType: "law" }
  ],
  
  authorityLabels: {
    emir: "Emiri Diwan",
    shura: "Shura Council",
    cabinet: "Cabinet",
    qsm: "Qatar Standards",
    cra: "CRA"
  },
  
  hierarchyLabels: {
    constitutional: "Constitution",
    primary: "Law/Emiri Decree",
    secondary: "Cabinet/Ministerial Decision",
    tertiary: "Standard/Circular",
    "soft-law": "Guidance",
    "case-law": "Court Ruling"
  },
  
  filterLabels: {
    instrumentType: "Instrument Type",
    hierarchy: "Norm Level",
    status: "Status",
    subnational: "Municipality",
    authority: "Issuing Body"
  }
};

// ========== COSTA RICA CONFIGURATION ==========
export const costaRicaConfig: JurisdictionConfig = {
  code: "CR",
  name: "Costa Rica",
  region: "LATAM",
  legalSystem: "civil-law",
  
  instrumentTypes: [
    { id: "ley", label: "Ley", emoji: "⚖️", hierarchyLevel: "primary" },
    { id: "decreto", label: "Decreto Ejecutivo", emoji: "📜", hierarchyLevel: "secondary" },
    { id: "reglamento", label: "Reglamento", emoji: "📋", hierarchyLevel: "secondary" },
    { id: "resolucion", label: "Resolución", emoji: "📄", hierarchyLevel: "tertiary" },
    { id: "proyecto", label: "Proyecto de Ley", emoji: "📝", hierarchyLevel: "primary" },
    { id: "directriz", label: "Directriz", emoji: "💡", hierarchyLevel: "soft-law" },
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
    { localStatus: "Publicada", genericStatus: "in-force", label: "Publicada en La Gaceta" },
    { localStatus: "Derogada", genericStatus: "repealed", label: "Derogada" }
  ],
  
  pipelineStages: [
    { stages: ["Presentado", "Comisión", "Primer Debate", "Segundo Debate", "Sanción Ejecutiva", "La Gaceta"], instrumentType: "proyecto" }
  ],
  
  subnationalUnits: {
    label: "Provincia",
    units: [
      { code: "SJ", name: "San José" }, { code: "AL", name: "Alajuela" },
      { code: "CA", name: "Cartago" }, { code: "HE", name: "Heredia" },
      { code: "GU", name: "Guanacaste" }, { code: "PU", name: "Puntarenas" },
      { code: "LI", name: "Limón" }
    ]
  },
  
  authorityLabels: {
    asamblea: "Asamblea Legislativa",
    ejecutivo: "Poder Ejecutivo",
    ministerio: "Ministerio",
    meic: "MEIC",
    sutel: "SUTEL",
    senasa: "SENASA"
  },
  
  hierarchyLabels: {
    constitutional: "Constitución",
    primary: "Ley",
    secondary: "Decreto/Reglamento",
    tertiary: "Resolución/Norma Técnica",
    "soft-law": "Directriz/Circular",
    "case-law": "Jurisprudencia"
  },
  
  filterLabels: {
    instrumentType: "Tipo de Norma",
    hierarchy: "Jerarquía Normativa",
    status: "Estado",
    subnational: "Provincia",
    authority: "Ente Emisor"
  }
};

// Export all configs as a map
export const gccCountryConfigs = {
  uae: uaeConfig,
  saudi: saudiConfig,
  oman: omanConfig,
  kuwait: kuwaitConfig,
  bahrain: bahrainConfig,
  qatar: qatarConfig
};

export type GCCCountryCode = keyof typeof gccCountryConfigs;
