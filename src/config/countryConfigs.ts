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
  },
  
  filterPresets: [
    {
      id: "high-risk-pipeline",
      name: "High Risk Pipeline",
      description: "High-risk legislation in progress",
      filters: { lifecycle: "pipeline", riskLevels: ["high"] }
    },
    {
      id: "product-safety",
      name: "Product Safety",
      description: "Product safety and ESMA standards",
      filters: { categories: ["Product Safety", "Radio Regulations"] }
    },
    {
      id: "federal-laws",
      name: "Federal Laws",
      description: "Federal-level laws and decrees",
      filters: { jurisdictionLevel: "federal", instrumentTypes: ["federal-law", "federal-decree"] }
    }
  ],
  
  jurisdictionLevels: [
    { id: "federal", label: "Federal", enabled: true },
    { id: "state", label: "Emirate", enabled: true },
    { id: "local", label: "Free Zone", enabled: false }
  ]
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
  },
  
  // Saudi Arabia is largely centralized
  jurisdictionLevels: [
    { id: "federal", label: "National", enabled: true },
    { id: "state", label: "Region", enabled: false },
    { id: "local", label: "Municipal", enabled: false }
  ]
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
  },
  
  jurisdictionLevels: [
    { id: "federal", label: "National", enabled: true },
    { id: "state", label: "Governorate", enabled: false },
    { id: "local", label: "Local", enabled: false }
  ]
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
  },
  
  jurisdictionLevels: [
    { id: "federal", label: "National", enabled: true },
    { id: "state", label: "Governorate", enabled: false },
    { id: "local", label: "Local", enabled: false }
  ]
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
  },
  
  jurisdictionLevels: [
    { id: "federal", label: "National", enabled: true },
    { id: "state", label: "Governorate", enabled: false },
    { id: "local", label: "Local", enabled: false }
  ]
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
  },
  
  jurisdictionLevels: [
    { id: "federal", label: "National", enabled: true },
    { id: "state", label: "Municipality", enabled: false },
    { id: "local", label: "Local", enabled: false }
  ]
};

// ========== PERU CONFIGURATION ==========
export const peruConfig: JurisdictionConfig = {
  code: "PE",
  name: "Perú",
  region: "LATAM",
  legalSystem: "civil-law",
  
  instrumentTypes: [
    { id: "ley", label: "Ley", emoji: "⚖️", hierarchyLevel: "primary" },
    { id: "decreto-supremo", label: "Decreto Supremo", emoji: "📜", hierarchyLevel: "secondary" },
    { id: "decreto-legislativo", label: "Decreto Legislativo", emoji: "📋", hierarchyLevel: "primary" },
    { id: "resolucion", label: "Resolución Ministerial", emoji: "📄", hierarchyLevel: "tertiary" },
    { id: "proyecto", label: "Proyecto de Ley", emoji: "📝", hierarchyLevel: "primary" },
    { id: "directiva", label: "Directiva", emoji: "💡", hierarchyLevel: "soft-law" },
    { id: "norma-tecnica", label: "Norma Técnica Peruana", emoji: "🔧", hierarchyLevel: "tertiary" }
  ],
  
  statusMappings: [
    { localStatus: "Presentado", genericStatus: "proposal", label: "Presentado" },
    { localStatus: "En Comisión", genericStatus: "in-committee", label: "En Comisión" },
    { localStatus: "Primera Votación", genericStatus: "in-committee", label: "Primera Votación" },
    { localStatus: "Segunda Votación", genericStatus: "approved", label: "Segunda Votación" },
    { localStatus: "Autógrafa", genericStatus: "approved", label: "Autógrafa" },
    { localStatus: "Promulgada", genericStatus: "in-force", label: "Promulgada" },
    { localStatus: "Vigente", genericStatus: "in-force", label: "Vigente" },
    { localStatus: "Publicada", genericStatus: "in-force", label: "Publicada en El Peruano" },
    { localStatus: "Derogada", genericStatus: "repealed", label: "Derogada" }
  ],
  
  pipelineStages: [
    { stages: ["Presentación", "Comisión", "Primera Votación", "Segunda Votación", "Autógrafa", "Promulgación"], instrumentType: "proyecto" }
  ],
  
  subnationalUnits: {
    label: "Departamento",
    units: [
      { code: "LIM", name: "Lima" }, { code: "ARE", name: "Arequipa" },
      { code: "CUS", name: "Cusco" }, { code: "PIU", name: "Piura" },
      { code: "LAL", name: "La Libertad" }, { code: "CAL", name: "Callao" },
      { code: "JUN", name: "Junín" }, { code: "LAM", name: "Lambayeque" }
    ]
  },
  
  authorityLabels: {
    congreso: "Congreso de la República",
    ejecutivo: "Poder Ejecutivo",
    ministerio: "Ministerio",
    indecopi: "INDECOPI",
    inacal: "INACAL",
    mtc: "MTC",
    osiptel: "OSIPTEL",
    digesa: "DIGESA",
    minam: "MINAM"
  },
  
  hierarchyLabels: {
    constitutional: "Constitución",
    primary: "Ley/Decreto Legislativo",
    secondary: "Decreto Supremo/Reglamento",
    tertiary: "Resolución/Norma Técnica",
    "soft-law": "Directiva/Circular",
    "case-law": "Jurisprudencia"
  },
  
  filterLabels: {
    instrumentType: "Tipo de Norma",
    hierarchy: "Jerarquía Normativa",
    status: "Estado",
    subnational: "Departamento",
    authority: "Entidad Emisora"
  },
  
  filterPresets: [
    {
      id: "high-risk-proyectos",
      name: "Proyectos Alto Riesgo",
      description: "Proyectos de ley con alto riesgo regulatorio",
      filters: { lifecycle: "pipeline", riskLevels: ["high"] }
    },
    {
      id: "seguridad-producto",
      name: "Seguridad de Producto",
      description: "Regulaciones de seguridad de productos",
      filters: { categories: ["Product Safety", "Battery Regulations"] }
    },
    {
      id: "telecomunicaciones",
      name: "Telecomunicaciones",
      description: "Regulaciones de radio y conectividad",
      filters: { categories: ["Radio Regulations", "Cybersecurity"] }
    },
    {
      id: "vigente",
      name: "Normativa Vigente",
      description: "Legislación actualmente en vigor",
      filters: { lifecycle: "in-force" }
    }
  ],
  
  jurisdictionLevels: [
    { id: "federal", label: "Nacional", enabled: true },
    { id: "state", label: "Regional", enabled: false },
    { id: "local", label: "Local", enabled: false }
  ]
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
  },
  
  filterPresets: [
    {
      id: "high-risk-proyectos",
      name: "Proyectos Alto Riesgo",
      description: "Proyectos de ley con alto riesgo regulatorio",
      filters: { lifecycle: "pipeline", riskLevels: ["high"] }
    },
    {
      id: "producto-seguridad",
      name: "Seguridad de Productos",
      description: "Legislación de protección al consumidor",
      filters: { categories: ["Product Safety"] }
    },
    {
      id: "ciberseguridad",
      name: "Ciberseguridad",
      description: "Legislación de ciberseguridad y datos",
      filters: { categories: ["Cybersecurity"] }
    },
    {
      id: "en-comision",
      name: "En Comisión",
      description: "Proyectos actualmente en comisión",
      filters: { lifecycle: "pipeline" }
    }
  ],
  
  // Costa Rica is unitary - mostly national legislation
  jurisdictionLevels: [
    { id: "federal", label: "Nacional", enabled: true },
    { id: "state", label: "Provincial", enabled: false },
    { id: "local", label: "Cantonal", enabled: true }
  ]
};

// ========== KOREA CONFIGURATION ==========
export const koreaConfig: JurisdictionConfig = {
  code: "KR",
  name: "South Korea",
  region: "APAC",
  legalSystem: "civil-law",
  
  instrumentTypes: [
    { id: "law", label: "법률 (Law)", emoji: "⚖️", hierarchyLevel: "primary" },
    { id: "bill", label: "법안 (Bill)", emoji: "📜", hierarchyLevel: "primary" },
    { id: "presidential-decree", label: "대통령령 (Presidential Decree)", emoji: "📋", hierarchyLevel: "secondary" },
    { id: "ministerial-ordinance", label: "부령 (Ministerial Ordinance)", emoji: "📄", hierarchyLevel: "secondary" },
    { id: "kats-standard", label: "KS 표준 (KS Standard)", emoji: "✅", hierarchyLevel: "tertiary" },
    { id: "notice", label: "고시 (Notice)", emoji: "📢", hierarchyLevel: "tertiary" },
    { id: "guideline", label: "지침 (Guideline)", emoji: "💡", hierarchyLevel: "soft-law" }
  ],
  
  statusMappings: [
    { localStatus: "Proposed", genericStatus: "proposal", label: "발의 (Proposed)" },
    { localStatus: "Committee Review", genericStatus: "in-committee", label: "위원회 심사 (Committee Review)" },
    { localStatus: "Plenary Session", genericStatus: "approved", label: "본회의 (Plenary Session)" },
    { localStatus: "Promulgated", genericStatus: "in-force", label: "공포 (Promulgated)" },
    { localStatus: "In Force", genericStatus: "in-force", label: "시행 (In Force)" },
    { localStatus: "Draft", genericStatus: "draft", label: "초안 (Draft)" },
    { localStatus: "Abolished", genericStatus: "repealed", label: "폐지 (Abolished)" }
  ],
  
  pipelineStages: [
    { stages: ["발의 (Proposed)", "위원회 (Committee)", "법사위 (Judiciary)", "본회의 (Plenary)", "공포 (Promulgated)", "시행 (In Force)"], instrumentType: "bill" }
  ],
  
  // Korea is a unitary state - no true subnational legislation
  // But has metropolitan cities and provinces for local ordinances
  subnationalUnits: {
    label: "Metropolitan City/Province",
    units: [
      { code: "SEL", name: "Seoul (서울)" }, { code: "BSN", name: "Busan (부산)" },
      { code: "DGU", name: "Daegu (대구)" }, { code: "ICN", name: "Incheon (인천)" },
      { code: "GJU", name: "Gwangju (광주)" }, { code: "DJN", name: "Daejeon (대전)" },
      { code: "ULS", name: "Ulsan (울산)" }, { code: "SJN", name: "Sejong (세종)" },
      { code: "GGI", name: "Gyeonggi (경기)" }, { code: "GWD", name: "Gangwon (강원)" }
    ]
  },
  
  authorityLabels: {
    assembly: "국회 (National Assembly)",
    president: "대통령실 (Presidential Office)",
    ministry: "부처 (Ministry)",
    kats: "국가기술표준원 (KATS)",
    msit: "과학기술정보통신부 (MSIT)",
    mfds: "식품의약품안전처 (MFDS)"
  },
  
  hierarchyLabels: {
    constitutional: "헌법 (Constitution)",
    primary: "법률 (Law)",
    secondary: "대통령령/부령 (Decree/Ordinance)",
    tertiary: "고시/표준 (Notice/Standard)",
    "soft-law": "지침 (Guideline)",
    "case-law": "판례 (Case Law)"
  },
  
  filterLabels: {
    instrumentType: "문서 유형 (Document Type)",
    hierarchy: "규범 수준 (Norm Level)",
    status: "상태 (Status)",
    subnational: "시/도 (Region)",
    authority: "발행 기관 (Authority)"
  },
  
  filterPresets: [
    {
      id: "high-risk-pipeline",
      name: "고위험 법안 (High Risk Bills)",
      description: "High-risk bills in the legislative process",
      filters: { lifecycle: "pipeline", riskLevels: ["high"] }
    },
    {
      id: "product-regulations",
      name: "제품 규정 (Product Regulations)",
      description: "KC marking and product safety",
      filters: { categories: ["Product Safety", "Radio Regulations"] }
    },
    {
      id: "cybersecurity",
      name: "사이버 보안 (Cybersecurity)",
      description: "Cybersecurity and data protection",
      filters: { categories: ["Cybersecurity"] }
    }
  ],
  
  // Korea is unitary - national legislation is primary
  jurisdictionLevels: [
    { id: "federal", label: "국가 (National)", enabled: true },
    { id: "state", label: "시/도 (Metro/Province)", enabled: true },
    { id: "local", label: "시/군/구 (Municipal)", enabled: true }
  ]
};

// ========== TAIWAN CONFIGURATION ==========
export const taiwanConfig: JurisdictionConfig = {
  code: "TW",
  name: "Taiwan",
  region: "APAC",
  legalSystem: "civil-law",
  
  instrumentTypes: [
    { id: "law", label: "法律 (Law)", emoji: "⚖️", hierarchyLevel: "primary" },
    { id: "bill", label: "法案 (Bill)", emoji: "📜", hierarchyLevel: "primary" },
    { id: "decree", label: "命令 (Decree/Order)", emoji: "📋", hierarchyLevel: "secondary" },
    { id: "regulation", label: "規則 (Regulation)", emoji: "📄", hierarchyLevel: "secondary" },
    { id: "cns-standard", label: "CNS 標準 (CNS Standard)", emoji: "✅", hierarchyLevel: "tertiary" },
    { id: "notice", label: "公告 (Notice)", emoji: "📢", hierarchyLevel: "tertiary" },
    { id: "guideline", label: "指引 (Guideline)", emoji: "💡", hierarchyLevel: "soft-law" }
  ],
  
  statusMappings: [
    { localStatus: "Proposed", genericStatus: "proposal", label: "提案 (Proposed)" },
    { localStatus: "Committee Review", genericStatus: "in-committee", label: "委員會審查 (Committee Review)" },
    { localStatus: "Second Reading", genericStatus: "in-committee", label: "二讀 (Second Reading)" },
    { localStatus: "Third Reading", genericStatus: "approved", label: "三讀 (Third Reading)" },
    { localStatus: "Promulgated", genericStatus: "in-force", label: "公布 (Promulgated)" },
    { localStatus: "In Force", genericStatus: "in-force", label: "施行 (In Force)" },
    { localStatus: "Draft", genericStatus: "draft", label: "草案 (Draft)" },
    { localStatus: "Abolished", genericStatus: "repealed", label: "廢止 (Abolished)" }
  ],
  
  pipelineStages: [
    { stages: ["提案 (Proposed)", "一讀 (1st Reading)", "委員會 (Committee)", "二讀 (2nd Reading)", "三讀 (3rd Reading)", "公布 (Promulgated)"], instrumentType: "bill" }
  ],
  
  // Taiwan is unitary - counties/cities for local matters only
  subnationalUnits: {
    label: "County/City",
    units: [
      { code: "TPE", name: "Taipei (臺北)" }, { code: "NWT", name: "New Taipei (新北)" },
      { code: "TYN", name: "Taoyuan (桃園)" }, { code: "TXG", name: "Taichung (臺中)" },
      { code: "TNN", name: "Tainan (臺南)" }, { code: "KHH", name: "Kaohsiung (高雄)" },
      { code: "HSZ", name: "Hsinchu (新竹)" }, { code: "KEL", name: "Keelung (基隆)" }
    ]
  },
  
  authorityLabels: {
    yuan: "立法院 (Legislative Yuan)",
    executive: "行政院 (Executive Yuan)",
    ministry: "部會 (Ministry)",
    bsmi: "標準檢驗局 (BSMI)",
    ncc: "通傳會 (NCC)",
    tfda: "食藥署 (TFDA)"
  },
  
  hierarchyLabels: {
    constitutional: "憲法 (Constitution)",
    primary: "法律 (Law)",
    secondary: "命令/規則 (Decree/Regulation)",
    tertiary: "公告/標準 (Notice/Standard)",
    "soft-law": "指引 (Guideline)",
    "case-law": "判例 (Case Law)"
  },
  
  filterLabels: {
    instrumentType: "文件類型 (Document Type)",
    hierarchy: "規範層級 (Norm Level)",
    status: "狀態 (Status)",
    subnational: "縣市 (County/City)",
    authority: "發布機關 (Authority)"
  },
  
  filterPresets: [
    {
      id: "high-risk-pipeline",
      name: "高風險法案 (High Risk Bills)",
      description: "High-risk bills requiring attention",
      filters: { lifecycle: "pipeline", riskLevels: ["high"] }
    },
    {
      id: "product-regulations",
      name: "產品法規 (Product Regulations)",
      description: "BSMI certification and product safety",
      filters: { categories: ["Product Safety", "Radio Regulations"] }
    },
    {
      id: "food-contact",
      name: "食品接觸 (Food Contact)",
      description: "Food contact material regulations",
      filters: { categories: ["Food Contact Material"] }
    }
  ],
  
  // Taiwan is unitary
  jurisdictionLevels: [
    { id: "federal", label: "中央 (Central)", enabled: true },
    { id: "state", label: "直轄市/縣市 (Municipality/County)", enabled: true },
    { id: "local", label: "鄉鎮市區 (Township)", enabled: false }
  ]
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

export const apacCountryConfigs = {
  korea: koreaConfig,
  taiwan: taiwanConfig
};

export type GCCCountryCode = keyof typeof gccCountryConfigs;
export type APACCountryCode = keyof typeof apacCountryConfigs;
