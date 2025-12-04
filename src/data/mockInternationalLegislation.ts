export interface InternationalLegislation {
  id: string;
  title: string;
  summary: string;
  bullets: string[];
  status: string;
  jurisdiction: string;
  subJurisdiction?: string;
  riskLevel: "low" | "medium" | "high";
  riskScore: number;
  category: string;
  publishedDate: string;
  effectiveDate?: string;
  regulatoryBody: string;
  impactAreas: string[];
}

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// US State Bills - Smart Kettle/Espresso Machine focused
export const usStateBills: InternationalLegislation[] = [
  {
    id: "ca-sb-2024-847",
    title: "California Energy Efficiency Standards for Small Appliances",
    summary: "Establishes new energy efficiency requirements for countertop appliances including electric kettles and espresso machines sold in California.",
    bullets: [
      "Mandates minimum energy efficiency ratings for electric kettles above 1000W",
      "Requires standby power consumption below 0.5W for all coffee appliances",
      "Certification deadline: January 2026"
    ],
    status: "In Committee",
    jurisdiction: "USA",
    subJurisdiction: "CA",
    riskLevel: "high",
    riskScore: 85,
    category: "Energy Efficiency",
    publishedDate: daysAgo(15),
    effectiveDate: daysFromNow(180),
    regulatoryBody: "California Energy Commission",
    impactAreas: ["Product Design", "Certification", "Labeling"]
  },
  {
    id: "ny-ab-2024-1023",
    title: "New York Consumer Product Safety Act - Heating Appliances",
    summary: "Strengthens safety requirements for electrical heating appliances including automatic shutoff features and thermal protection.",
    bullets: [
      "Requires dual thermal protection systems for appliances above 1500W",
      "Mandatory automatic shutoff within 30 minutes of inactivity",
      "New labeling requirements for water heating appliances"
    ],
    status: "Passed Assembly",
    jurisdiction: "USA",
    subJurisdiction: "NY",
    riskLevel: "high",
    riskScore: 78,
    category: "Product Safety",
    publishedDate: daysAgo(30),
    effectiveDate: daysFromNow(120),
    regulatoryBody: "NY Department of Consumer Protection",
    impactAreas: ["Product Safety", "Manufacturing", "Labeling"]
  },
  {
    id: "tx-hb-2024-445",
    title: "Texas Smart Appliance Data Privacy Act",
    summary: "Regulates collection and use of consumer data by IoT-enabled appliances including smart kettles and connected espresso machines.",
    bullets: [
      "Requires explicit consent for data collection from smart appliances",
      "Mandates data encryption for all transmitted usage information",
      "Provides consumers right to delete collected appliance data"
    ],
    status: "Second Reading",
    jurisdiction: "USA",
    subJurisdiction: "TX",
    riskLevel: "medium",
    riskScore: 65,
    category: "Data Privacy",
    publishedDate: daysAgo(45),
    regulatoryBody: "Texas Attorney General",
    impactAreas: ["Software", "Data Privacy", "User Consent"]
  },
  {
    id: "fl-sb-2024-221",
    title: "Florida Appliance Import Standards Update",
    summary: "Updates import certification requirements for small electrical appliances to align with federal standards.",
    bullets: [
      "Streamlines certification process for pre-certified appliances",
      "Reduces compliance burden for manufacturers with existing certifications",
      "Mutual recognition with UL and CSA certifications"
    ],
    status: "Enacted",
    jurisdiction: "USA",
    subJurisdiction: "FL",
    riskLevel: "low",
    riskScore: 35,
    category: "Import/Export",
    publishedDate: daysAgo(60),
    effectiveDate: daysAgo(10),
    regulatoryBody: "Florida DBPR",
    impactAreas: ["Certification", "Import Compliance"]
  },
  {
    id: "wa-sb-2024-156",
    title: "Washington State Right to Repair - Small Appliances",
    summary: "Extends right to repair requirements to include small kitchen appliances including coffee machines and electric kettles.",
    bullets: [
      "Requires manufacturers to provide repair manuals and diagnostic tools",
      "Mandates availability of replacement parts for 7 years after manufacture",
      "Prohibits software locks that prevent independent repair"
    ],
    status: "In Committee",
    jurisdiction: "USA",
    subJurisdiction: "WA",
    riskLevel: "high",
    riskScore: 82,
    category: "Right to Repair",
    publishedDate: daysAgo(20),
    regulatoryBody: "WA Attorney General",
    impactAreas: ["Spare Parts", "Documentation", "Software"]
  }
];

// Canada Provincial Legislation
export const canadaLegislation: InternationalLegislation[] = [
  {
    id: "on-reg-2024-445",
    title: "Ontario Electrical Safety Code Amendment - Kitchen Appliances",
    summary: "Updates electrical safety requirements for household cooking and heating appliances sold in Ontario.",
    bullets: [
      "Aligns with CSA C22.2 No. 64 standards for household appliances",
      "New grounding requirements for high-wattage countertop appliances",
      "Enhanced cord protection standards for water-contact appliances"
    ],
    status: "In Force",
    jurisdiction: "Canada",
    subJurisdiction: "ON",
    riskLevel: "medium",
    riskScore: 58,
    category: "Electrical Safety",
    publishedDate: daysAgo(90),
    effectiveDate: daysAgo(30),
    regulatoryBody: "Electrical Safety Authority",
    impactAreas: ["Product Safety", "Certification"]
  },
  {
    id: "qc-bill-2024-78",
    title: "Quebec French Language Requirements - Product Labeling",
    summary: "Expands French language requirements for all product labeling, packaging, and user documentation.",
    bullets: [
      "All user manuals must be available in French with equal prominence to English",
      "Product labels must display French text at minimum equal size to other languages",
      "Digital interfaces must offer French language option"
    ],
    status: "Second Reading",
    jurisdiction: "Canada",
    subJurisdiction: "QC",
    riskLevel: "medium",
    riskScore: 62,
    category: "Labeling",
    publishedDate: daysAgo(25),
    effectiveDate: daysFromNow(90),
    regulatoryBody: "Office québécois de la langue française",
    impactAreas: ["Packaging", "Documentation", "Software UI"]
  },
  {
    id: "bc-reg-2024-112",
    title: "BC Extended Producer Responsibility - Small Appliances",
    summary: "Requires manufacturers to establish take-back programs for small electrical appliances at end of life.",
    bullets: [
      "Mandatory product stewardship plan registration",
      "Collection targets of 65% by 2027",
      "Eco-fees may be charged at point of sale"
    ],
    status: "Proposed",
    jurisdiction: "Canada",
    subJurisdiction: "BC",
    riskLevel: "high",
    riskScore: 75,
    category: "Environmental",
    publishedDate: daysAgo(10),
    effectiveDate: daysFromNow(365),
    regulatoryBody: "BC Ministry of Environment",
    impactAreas: ["Recycling", "Product Stewardship", "Costs"]
  },
  {
    id: "ab-bill-2024-34",
    title: "Alberta Consumer Protection Amendment - Appliance Warranties",
    summary: "Strengthens warranty requirements and disclosure for household appliances.",
    bullets: [
      "Minimum 2-year warranty required for appliances over $100",
      "Clear disclosure of warranty limitations at point of sale",
      "Prohibition on warranty voiding for third-party repairs"
    ],
    status: "Royal Assent",
    jurisdiction: "Canada",
    subJurisdiction: "AB",
    riskLevel: "medium",
    riskScore: 55,
    category: "Consumer Protection",
    publishedDate: daysAgo(45),
    effectiveDate: daysFromNow(60),
    regulatoryBody: "Service Alberta",
    impactAreas: ["Warranty", "Documentation", "Customer Service"]
  }
];

// Japan Legislation
export const japanLegislation: InternationalLegislation[] = [
  {
    id: "jp-meti-2024-089",
    title: "Energy Conservation Standards Revision - Electric Kettles",
    summary: "Ministry of Economy updates top-runner standards for electric kettles with stricter efficiency requirements.",
    bullets: [
      "Target energy consumption reduced by 15% from 2020 baseline",
      "New testing methodology for insulated kettles",
      "Mandatory energy label update by March 2026"
    ],
    status: "Final Draft",
    jurisdiction: "Japan",
    riskLevel: "high",
    riskScore: 88,
    category: "Energy Efficiency",
    publishedDate: daysAgo(20),
    effectiveDate: daysFromNow(450),
    regulatoryBody: "METI",
    impactAreas: ["Product Design", "Energy Labeling", "Testing"]
  },
  {
    id: "jp-denan-2024-12",
    title: "Electrical Appliance Safety Law Amendment - PSE Mark",
    summary: "Updates technical requirements for PSE certification of household heating appliances.",
    bullets: [
      "New EMC requirements for appliances with digital displays",
      "Updated thermal runaway protection standards",
      "Conformity assessment procedure changes"
    ],
    status: "Enacted",
    jurisdiction: "Japan",
    riskLevel: "medium",
    riskScore: 72,
    category: "Product Safety",
    publishedDate: daysAgo(60),
    effectiveDate: daysAgo(15),
    regulatoryBody: "METI - DENAN",
    impactAreas: ["Certification", "Testing", "Documentation"]
  },
  {
    id: "jp-caa-2024-56",
    title: "Consumer Product Labeling Standards - Coffee Machines",
    summary: "Consumer Affairs Agency updates labeling requirements for coffee preparation appliances.",
    bullets: [
      "Standardized capacity measurement display requirements",
      "Energy consumption disclosure format changes",
      "Safety warning label size and placement specifications"
    ],
    status: "Public Comment",
    jurisdiction: "Japan",
    riskLevel: "low",
    riskScore: 42,
    category: "Labeling",
    publishedDate: daysAgo(5),
    regulatoryBody: "Consumer Affairs Agency",
    impactAreas: ["Labeling", "Packaging"]
  }
];

// Korea Legislation
export const koreaLegislation: InternationalLegislation[] = [
  {
    id: "kr-kats-2024-234",
    title: "KC Mark Requirements Update - Heating Appliances",
    summary: "Korean Agency for Technology and Standards updates KC certification requirements for electric heating appliances.",
    bullets: [
      "New EMI/EMC test requirements effective January 2025",
      "Updated safety standards for programmable appliances",
      "Factory inspection requirements for overseas manufacturers"
    ],
    status: "In Force",
    jurisdiction: "Korea",
    riskLevel: "high",
    riskScore: 80,
    category: "Certification",
    publishedDate: daysAgo(45),
    effectiveDate: daysAgo(5),
    regulatoryBody: "KATS",
    impactAreas: ["Certification", "Manufacturing", "Testing"]
  },
  {
    id: "kr-kemco-2024-78",
    title: "Energy Efficiency Rating System - Kitchen Appliances",
    summary: "Korea Energy Management Corporation updates e-Standby program requirements for kitchen appliances.",
    bullets: [
      "Standby power must not exceed 0.3W for highest efficiency rating",
      "New test methodology for smart/connected appliances",
      "Mandatory efficiency label redesign"
    ],
    status: "Proposed",
    jurisdiction: "Korea",
    riskLevel: "medium",
    riskScore: 68,
    category: "Energy Efficiency",
    publishedDate: daysAgo(15),
    effectiveDate: daysFromNow(180),
    regulatoryBody: "KEMCO",
    impactAreas: ["Product Design", "Energy Labeling"]
  },
  {
    id: "kr-kca-2024-112",
    title: "Consumer Safety Special Act Amendment - Small Appliances",
    summary: "Korea Consumer Agency strengthens recall and reporting requirements for consumer appliances.",
    bullets: [
      "72-hour incident reporting requirement",
      "Expanded voluntary recall incentive program",
      "Increased penalties for non-compliance"
    ],
    status: "Second Reading",
    jurisdiction: "Korea",
    riskLevel: "medium",
    riskScore: 58,
    category: "Consumer Safety",
    publishedDate: daysAgo(30),
    regulatoryBody: "KCA",
    impactAreas: ["Compliance", "Reporting", "Recalls"]
  }
];

// Taiwan Legislation  
export const taiwanLegislation: InternationalLegislation[] = [
  {
    id: "tw-bsmi-2024-445",
    title: "BSMI Certification Update - Electric Water Heaters",
    summary: "Bureau of Standards updates certification requirements for electric water heating appliances including kettles.",
    bullets: [
      "New CNS standards adoption for kettles and water boilers",
      "Updated testing laboratory accreditation requirements",
      "RPC label format changes"
    ],
    status: "In Force",
    jurisdiction: "Taiwan",
    riskLevel: "medium",
    riskScore: 65,
    category: "Certification",
    publishedDate: daysAgo(30),
    effectiveDate: daysAgo(10),
    regulatoryBody: "BSMI",
    impactAreas: ["Certification", "Testing", "Labeling"]
  },
  {
    id: "tw-moea-2024-89",
    title: "Energy Efficiency Standards - Coffee Machines",
    summary: "Ministry of Economic Affairs proposes energy efficiency standards for espresso and coffee machines.",
    bullets: [
      "First-ever efficiency standards for espresso machines in Taiwan",
      "Standby power limits of 1W for programmable machines",
      "Three-year compliance transition period"
    ],
    status: "Draft",
    jurisdiction: "Taiwan",
    riskLevel: "medium",
    riskScore: 60,
    category: "Energy Efficiency",
    publishedDate: daysAgo(10),
    effectiveDate: daysFromNow(730),
    regulatoryBody: "MOEA Bureau of Energy",
    impactAreas: ["Product Design", "Testing"]
  },
  {
    id: "tw-tpca-2024-23",
    title: "Consumer Protection Act Amendment - Smart Appliances",
    summary: "Taiwan Consumer Protection Agency addresses IoT appliance data collection and privacy.",
    bullets: [
      "Mandatory privacy policy disclosure for connected appliances",
      "Data localization requirements under review",
      "Consumer consent mechanisms for data sharing"
    ],
    status: "Public Consultation",
    jurisdiction: "Taiwan",
    riskLevel: "low",
    riskScore: 48,
    category: "Data Privacy",
    publishedDate: daysAgo(5),
    regulatoryBody: "Consumer Protection Committee",
    impactAreas: ["Software", "Privacy", "Documentation"]
  }
];

// EU Legislation
export const euRegulations: InternationalLegislation[] = [
  {
    id: "eu-ecodesign-2024-1234",
    title: "Ecodesign Regulation for Domestic Cooking Appliances",
    summary: "New ecodesign requirements for household cooking appliances including espresso machines under Sustainable Products Regulation.",
    bullets: [
      "Minimum energy efficiency requirements for coffee machines",
      "Mandatory repairability index scoring",
      "Component availability requirements for 10 years"
    ],
    status: "Adopted",
    jurisdiction: "EU",
    riskLevel: "high",
    riskScore: 92,
    category: "Ecodesign",
    publishedDate: daysAgo(45),
    effectiveDate: daysFromNow(365),
    regulatoryBody: "European Commission",
    impactAreas: ["Product Design", "Spare Parts", "Documentation"]
  },
  {
    id: "eu-weee-2024-amend",
    title: "WEEE Directive Amendment - Small Appliances",
    summary: "Updates to collection and recycling targets for small electrical equipment category.",
    bullets: [
      "Collection target increased to 75% by 2027",
      "New recycled content requirements for plastic components",
      "Enhanced producer responsibility fee structure"
    ],
    status: "Trilogue",
    jurisdiction: "EU",
    riskLevel: "medium",
    riskScore: 70,
    category: "Environmental",
    publishedDate: daysAgo(30),
    regulatoryBody: "European Parliament",
    impactAreas: ["Recycling", "Materials", "Costs"]
  }
];

export const euDirectives: InternationalLegislation[] = [
  {
    id: "eu-lvd-2024-update",
    title: "Low Voltage Directive Technical Update - Heating Appliances",
    summary: "Updated harmonized standards under LVD for electrical heating appliances.",
    bullets: [
      "New EN 60335-2-15 standard adoption for kettles",
      "Enhanced protection requirements for appliances near water",
      "Updated documentation requirements for market surveillance"
    ],
    status: "In Force",
    jurisdiction: "EU",
    riskLevel: "high",
    riskScore: 78,
    category: "Product Safety",
    publishedDate: daysAgo(60),
    effectiveDate: daysAgo(20),
    regulatoryBody: "European Commission",
    impactAreas: ["Certification", "Testing", "Documentation"]
  },
  {
    id: "eu-emc-2024-89",
    title: "EMC Directive - Smart Appliance Guidelines",
    summary: "New guidance document for EMC compliance of IoT-enabled household appliances.",
    bullets: [
      "Clarifies EMC testing for WiFi/Bluetooth enabled appliances",
      "New immunity requirements for smart control systems",
      "Updated technical file requirements"
    ],
    status: "Published",
    jurisdiction: "EU",
    riskLevel: "medium",
    riskScore: 55,
    category: "EMC",
    publishedDate: daysAgo(15),
    regulatoryBody: "European Commission",
    impactAreas: ["Testing", "Documentation"]
  }
];

export const euParliament: InternationalLegislation[] = [
  {
    id: "eu-parl-2024-right-repair",
    title: "Right to Repair Directive - Small Appliances Extension",
    summary: "European Parliament votes to extend right to repair requirements to small household appliances.",
    bullets: [
      "Mandatory spare parts availability for 8 years",
      "Repair information access for independent repairers",
      "Prohibition on software that limits repair"
    ],
    status: "First Reading",
    jurisdiction: "EU",
    riskLevel: "high",
    riskScore: 85,
    category: "Right to Repair",
    publishedDate: daysAgo(10),
    regulatoryBody: "European Parliament",
    impactAreas: ["Spare Parts", "Documentation", "Software"]
  },
  {
    id: "eu-parl-2024-green-claims",
    title: "Green Claims Directive - Appliance Marketing",
    summary: "Restricts environmental marketing claims for consumer products including appliances.",
    bullets: [
      "Substantiation requirements for eco-friendly claims",
      "Ban on generic environmental claims without proof",
      "Third-party verification for carbon neutral claims"
    ],
    status: "Committee Review",
    jurisdiction: "EU",
    riskLevel: "medium",
    riskScore: 62,
    category: "Marketing",
    publishedDate: daysAgo(20),
    regulatoryBody: "European Parliament ENVI Committee",
    impactAreas: ["Marketing", "Documentation", "Claims"]
  }
];

export const euCouncil: InternationalLegislation[] = [
  {
    id: "eu-council-2024-cyber",
    title: "Cyber Resilience Act - IoT Appliances",
    summary: "Council position on cybersecurity requirements for connected consumer products.",
    bullets: [
      "Mandatory security updates for 5 years minimum",
      "Vulnerability disclosure requirements",
      "CE marking requires cybersecurity assessment"
    ],
    status: "Council Position",
    jurisdiction: "EU",
    riskLevel: "high",
    riskScore: 88,
    category: "Cybersecurity",
    publishedDate: daysAgo(25),
    effectiveDate: daysFromNow(540),
    regulatoryBody: "Council of the EU",
    impactAreas: ["Software", "Security", "Updates"]
  }
];

// GCC Countries
export const uaeLegislation: InternationalLegislation[] = [
  {
    id: "uae-esma-2024-178",
    title: "ESMA Technical Regulation - Electric Kettles",
    summary: "Emirates Authority for Standardization updates conformity requirements for electric water heating appliances.",
    bullets: [
      "Mandatory ECAS certificate for market access",
      "New Arabic labeling requirements",
      "Updated voltage compatibility standards (220V/50Hz)"
    ],
    status: "In Force",
    jurisdiction: "GCC",
    subJurisdiction: "UAE",
    riskLevel: "medium",
    riskScore: 65,
    category: "Certification",
    publishedDate: daysAgo(40),
    effectiveDate: daysAgo(10),
    regulatoryBody: "ESMA",
    impactAreas: ["Certification", "Labeling"]
  },
  {
    id: "uae-dewa-2024-56",
    title: "Dubai Energy Efficiency Program - Appliances",
    summary: "Dubai Electricity and Water Authority expands energy efficiency requirements to small appliances.",
    bullets: [
      "Voluntary energy rating scheme for kettles and coffee machines",
      "Incentives for high-efficiency appliance imports",
      "Future mandatory standards under consideration"
    ],
    status: "Voluntary",
    jurisdiction: "GCC",
    subJurisdiction: "UAE",
    riskLevel: "low",
    riskScore: 35,
    category: "Energy Efficiency",
    publishedDate: daysAgo(20),
    regulatoryBody: "DEWA",
    impactAreas: ["Energy Labeling"]
  }
];

export const saudiLegislation: InternationalLegislation[] = [
  {
    id: "sa-saso-2024-234",
    title: "SASO Technical Regulation Update - Household Appliances",
    summary: "Saudi Standards Organization updates SASO mark requirements for household electrical appliances.",
    bullets: [
      "New product registration system effective July 2025",
      "In-country testing requirements for certain categories",
      "Enhanced documentation for customs clearance"
    ],
    status: "Adopted",
    jurisdiction: "GCC",
    subJurisdiction: "Saudi Arabia",
    riskLevel: "high",
    riskScore: 82,
    category: "Certification",
    publishedDate: daysAgo(30),
    effectiveDate: daysFromNow(210),
    regulatoryBody: "SASO",
    impactAreas: ["Certification", "Testing", "Import"]
  },
  {
    id: "sa-seec-2024-89",
    title: "Saudi Energy Efficiency Center - Kitchen Appliances",
    summary: "SEEC expands minimum energy performance standards to include coffee machines.",
    bullets: [
      "First MEPS for espresso machines in Saudi Arabia",
      "Energy label required for all covered products",
      "Phased implementation starting 2026"
    ],
    status: "Draft",
    jurisdiction: "GCC",
    subJurisdiction: "Saudi Arabia",
    riskLevel: "medium",
    riskScore: 68,
    category: "Energy Efficiency",
    publishedDate: daysAgo(15),
    regulatoryBody: "SEEC",
    impactAreas: ["Product Design", "Labeling", "Testing"]
  }
];

export const omanLegislation: InternationalLegislation[] = [
  {
    id: "om-dgsm-2024-112",
    title: "Oman Quality Mark - Electrical Appliances Update",
    summary: "Directorate General of Standards updates conformity assessment procedures for electrical appliances.",
    bullets: [
      "Alignment with GSO standards for household appliances",
      "Simplified registration for GCC-certified products",
      "New testing laboratory recognition agreements"
    ],
    status: "In Force",
    jurisdiction: "GCC",
    subJurisdiction: "Oman",
    riskLevel: "low",
    riskScore: 45,
    category: "Certification",
    publishedDate: daysAgo(50),
    effectiveDate: daysAgo(20),
    regulatoryBody: "DGSM",
    impactAreas: ["Certification"]
  }
];

export const kuwaitLegislation: InternationalLegislation[] = [
  {
    id: "kw-paaet-2024-67",
    title: "Kuwait Technical Regulation - Small Appliances",
    summary: "Public Authority for Applied Education updates import requirements for small electrical appliances.",
    bullets: [
      "Certificate of conformity required for customs clearance",
      "Arabic user manual mandatory",
      "Product liability insurance requirements"
    ],
    status: "Proposed",
    jurisdiction: "GCC",
    subJurisdiction: "Kuwait",
    riskLevel: "medium",
    riskScore: 58,
    category: "Import",
    publishedDate: daysAgo(25),
    regulatoryBody: "PAI",
    impactAreas: ["Import", "Documentation"]
  }
];

export const bahrainLegislation: InternationalLegislation[] = [
  {
    id: "bh-moic-2024-34",
    title: "Bahrain Consumer Protection - Appliance Warranties",
    summary: "Ministry of Industry and Commerce updates warranty requirements for consumer electronics and appliances.",
    bullets: [
      "Minimum 1-year warranty for electrical appliances",
      "Clear warranty terms disclosure in Arabic",
      "Authorized service center requirements"
    ],
    status: "Enacted",
    jurisdiction: "GCC",
    subJurisdiction: "Bahrain",
    riskLevel: "low",
    riskScore: 42,
    category: "Consumer Protection",
    publishedDate: daysAgo(60),
    effectiveDate: daysAgo(30),
    regulatoryBody: "MOIC",
    impactAreas: ["Warranty", "Customer Service"]
  }
];

export const qatarLegislation: InternationalLegislation[] = [
  {
    id: "qa-qsqc-2024-89",
    title: "Qatar Quality Mark - Kitchen Appliances",
    summary: "Qatar General Organization for Standardization updates certification requirements for kitchen appliances.",
    bullets: [
      "Q-Mark certification mandatory for retail sale",
      "Factory inspection requirements for first-time applicants",
      "Surveillance audit program for certified products"
    ],
    status: "In Force",
    jurisdiction: "GCC",
    subJurisdiction: "Qatar",
    riskLevel: "medium",
    riskScore: 62,
    category: "Certification",
    publishedDate: daysAgo(35),
    effectiveDate: daysAgo(5),
    regulatoryBody: "QS",
    impactAreas: ["Certification", "Manufacturing"]
  }
];

// Helper function to get legislation by jurisdiction
export function getLegislationByJurisdiction(jurisdiction: string, subJurisdiction?: string): InternationalLegislation[] {
  switch (jurisdiction) {
    case "usa-state":
      return subJurisdiction 
        ? usStateBills.filter(l => l.subJurisdiction === subJurisdiction)
        : usStateBills;
    case "canada":
      return subJurisdiction
        ? canadaLegislation.filter(l => l.subJurisdiction === subJurisdiction)
        : canadaLegislation;
    case "japan":
      return japanLegislation;
    case "korea":
      return koreaLegislation;
    case "taiwan":
      return taiwanLegislation;
    case "eu-regulations":
      return euRegulations;
    case "eu-directives":
      return euDirectives;
    case "eu-parliament":
      return euParliament;
    case "eu-council":
      return euCouncil;
    case "gcc-uae":
      return uaeLegislation;
    case "gcc-saudi":
      return saudiLegislation;
    case "gcc-oman":
      return omanLegislation;
    case "gcc-kuwait":
      return kuwaitLegislation;
    case "gcc-bahrain":
      return bahrainLegislation;
    case "gcc-qatar":
      return qatarLegislation;
    default:
      return [];
  }
}
