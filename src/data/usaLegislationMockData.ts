import { USLegislationItem } from "@/types/usaLegislation";

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

// Comprehensive USA legislation mock data including all document types
export const usaLegislationData: USLegislationItem[] = [
  // ========== FEDERAL BILLS (Pipeline) ==========
  {
    id: "hr-2024-1234",
    title: "Smart Appliance Safety Act of 2024",
    summary: "Federal bill to establish nationwide safety standards for IoT-enabled kitchen appliances.",
    bullets: [
      "Mandatory cybersecurity standards for connected appliances",
      "Auto-shutoff requirements for heating devices",
      "Consumer notification requirements for firmware updates"
    ],
    documentType: "bill",
    authority: "congress",
    jurisdiction: "USA",
    riskLevel: "high",
    riskScore: 85,
    regulatoryCategory: "Product Safety",
    publishedDate: daysAgo(30),
    complianceDeadline: daysFromNow(365),
    isInForce: false,
    isPipeline: true,
    regulatoryBody: "U.S. Congress",
    impactAreas: ["Product Safety", "Cybersecurity", "Manufacturing"],
    status: "In Committee",
    localTerminology: "H.R. 1234"
  },
  {
    id: "s-2024-567",
    title: "Consumer IoT Cybersecurity Enhancement Act",
    summary: "Senate bill requiring minimum cybersecurity standards for all consumer IoT devices.",
    bullets: [
      "Unique passwords required - no default credentials",
      "Vulnerability disclosure program mandatory",
      "5-year security update support requirement"
    ],
    documentType: "bill",
    authority: "congress",
    jurisdiction: "USA",
    riskLevel: "high",
    riskScore: 88,
    regulatoryCategory: "Cybersecurity",
    publishedDate: daysAgo(20),
    complianceDeadline: daysFromNow(300),
    isInForce: false,
    isPipeline: true,
    regulatoryBody: "U.S. Senate",
    impactAreas: ["Software", "Security", "Firmware"],
    status: "Second Reading",
    localTerminology: "S. 567"
  },
  {
    id: "hr-2024-890",
    title: "Wireless Kitchen Appliance Standards Act",
    summary: "Bill to update FCC requirements for RF emissions from smart kitchen devices.",
    bullets: [
      "WiFi 6E frequency band testing requirements",
      "Bluetooth Low Energy interference standards",
      "EMC compliance updates for kitchen environments"
    ],
    documentType: "bill",
    authority: "congress",
    jurisdiction: "USA",
    riskLevel: "medium",
    riskScore: 72,
    regulatoryCategory: "Radio",
    publishedDate: daysAgo(15),
    complianceDeadline: daysFromNow(240),
    isInForce: false,
    isPipeline: true,
    regulatoryBody: "U.S. House of Representatives",
    impactAreas: ["Wireless", "Testing", "Certification"],
    status: "Introduced",
    localTerminology: "H.R. 890"
  },

  // ========== FEDERAL STATUTES (In Force) ==========
  {
    id: "pl-118-45",
    title: "Consumer Product Safety Improvement Act Amendment",
    summary: "Enacted law strengthening CPSC authority over electrical household appliances.",
    bullets: [
      "Enhanced mandatory recall authority",
      "Increased civil penalties for violations",
      "New testing laboratory accreditation requirements"
    ],
    documentType: "statute",
    authority: "congress",
    jurisdiction: "USA",
    riskLevel: "high",
    riskScore: 80,
    regulatoryCategory: "Product Safety",
    publishedDate: daysAgo(180),
    effectiveDate: daysAgo(60),
    isInForce: true,
    isPipeline: false,
    regulatoryBody: "U.S. Congress",
    impactAreas: ["Compliance", "Testing", "Manufacturing"],
    status: "In Force",
    localTerminology: "P.L. 118-45"
  },
  {
    id: "pl-118-67",
    title: "IoT Device Security Act of 2024",
    summary: "Federal law establishing baseline security requirements for connected devices.",
    bullets: [
      "NIST compliance framework adoption",
      "Security labeling requirements",
      "Procurement restrictions for non-compliant devices"
    ],
    documentType: "statute",
    authority: "congress",
    jurisdiction: "USA",
    riskLevel: "medium",
    riskScore: 75,
    regulatoryCategory: "Cybersecurity",
    publishedDate: daysAgo(120),
    effectiveDate: daysAgo(30),
    isInForce: true,
    isPipeline: false,
    regulatoryBody: "U.S. Congress",
    impactAreas: ["Security", "Labeling", "Government Sales"],
    status: "In Force",
    localTerminology: "P.L. 118-67"
  },

  // ========== FEDERAL REGULATIONS (In Force & Pipeline) ==========
  {
    id: "fcc-24-101",
    title: "FCC Part 15 Updates - Smart Home Devices",
    summary: "Updated radio frequency emission limits for IoT-enabled home appliances.",
    bullets: [
      "New emission limits for 5.925-7.125 GHz band",
      "Updated testing procedures for multi-radio devices",
      "Revised labeling requirements"
    ],
    documentType: "regulation",
    authority: "federal-agency",
    jurisdiction: "USA",
    agencyName: "Federal Communications Commission",
    riskLevel: "high",
    riskScore: 82,
    regulatoryCategory: "Radio",
    publishedDate: daysAgo(90),
    effectiveDate: daysAgo(10),
    isInForce: true,
    isPipeline: false,
    regulatoryBody: "FCC",
    impactAreas: ["Wireless", "Testing", "Labeling"],
    status: "In Force",
    localTerminology: "47 CFR Part 15"
  },
  {
    id: "fda-24-fcm-001",
    title: "FDA Food Contact Materials Update - Heating Appliances",
    summary: "Updated standards for materials in contact with food in heating appliances.",
    bullets: [
      "New migration testing requirements for hot beverages",
      "Updated PFAS restrictions",
      "Heavy metal limits for heating elements"
    ],
    documentType: "regulation",
    authority: "federal-agency",
    jurisdiction: "USA",
    agencyName: "Food and Drug Administration",
    riskLevel: "high",
    riskScore: 90,
    regulatoryCategory: "Food Contact Material",
    publishedDate: daysAgo(60),
    effectiveDate: daysAgo(15),
    isInForce: true,
    isPipeline: false,
    regulatoryBody: "FDA",
    impactAreas: ["Materials", "Testing", "Manufacturing"],
    status: "In Force",
    localTerminology: "21 CFR 177"
  },
  {
    id: "cpsc-24-draft-001",
    title: "CPSC Proposed Rule - Electric Kettle Safety Standards",
    summary: "Draft regulation for enhanced safety requirements for electric kettles.",
    bullets: [
      "Proposed thermal protection requirements",
      "Draft auto-shutoff timing standards",
      "Suggested child safety lock requirements"
    ],
    documentType: "regulation",
    authority: "federal-agency",
    jurisdiction: "USA",
    agencyName: "Consumer Product Safety Commission",
    riskLevel: "high",
    riskScore: 78,
    regulatoryCategory: "Product Safety",
    publishedDate: daysAgo(30),
    effectiveDate: daysFromNow(180),
    complianceDeadline: daysFromNow(150),
    isInForce: false,
    isPipeline: true,
    regulatoryBody: "CPSC",
    impactAreas: ["Product Safety", "Design", "Manufacturing"],
    status: "Proposed Rule",
    localTerminology: "NPRM"
  },
  {
    id: "epa-24-battery-001",
    title: "EPA Lithium Battery Disposal Requirements",
    summary: "Proposed EPA rule for safe disposal of lithium batteries in consumer products.",
    bullets: [
      "Producer responsibility requirements",
      "Recycling program mandates",
      "Labeling requirements for battery disposal"
    ],
    documentType: "regulation",
    authority: "federal-agency",
    jurisdiction: "USA",
    agencyName: "Environmental Protection Agency",
    riskLevel: "medium",
    riskScore: 68,
    regulatoryCategory: "Battery",
    publishedDate: daysAgo(45),
    effectiveDate: daysFromNow(365),
    complianceDeadline: daysFromNow(330),
    isInForce: false,
    isPipeline: true,
    regulatoryBody: "EPA",
    impactAreas: ["Battery", "Recycling", "Labeling"],
    status: "Proposed Rule",
    localTerminology: "NPRM"
  },

  // ========== TREATIES (In Force & Pipeline) ==========
  {
    id: "treaty-us-eu-2024",
    title: "US-EU Mutual Recognition Agreement - Appliance Standards",
    summary: "Treaty enabling mutual recognition of product safety certifications between US and EU.",
    bullets: [
      "UL/CE mutual recognition for certain categories",
      "Simplified import/export procedures",
      "Joint testing laboratory accreditation"
    ],
    documentType: "treaty",
    authority: "congress",
    jurisdiction: "USA",
    riskLevel: "low",
    riskScore: 45,
    regulatoryCategory: "Product Safety",
    publishedDate: daysAgo(200),
    effectiveDate: daysAgo(90),
    isInForce: true,
    isPipeline: false,
    regulatoryBody: "U.S. State Department",
    impactAreas: ["Certification", "Trade", "Testing"],
    status: "In Force",
    localTerminology: "Executive Agreement"
  },
  {
    id: "treaty-usmca-cyber-2024",
    title: "USMCA Cybersecurity Annex - Connected Devices",
    summary: "Proposed annex to USMCA addressing cybersecurity standards for IoT devices.",
    bullets: [
      "Harmonized security requirements across North America",
      "Cross-border data flow provisions",
      "Mutual vulnerability disclosure framework"
    ],
    documentType: "treaty",
    authority: "congress",
    jurisdiction: "USA",
    riskLevel: "medium",
    riskScore: 55,
    regulatoryCategory: "Cybersecurity",
    publishedDate: daysAgo(60),
    effectiveDate: daysFromNow(180),
    isInForce: false,
    isPipeline: true,
    regulatoryBody: "U.S. Trade Representative",
    impactAreas: ["Trade", "Security", "Data"],
    status: "Under Negotiation",
    localTerminology: "Trade Agreement Annex"
  },

  // ========== STATE BILLS & LAWS ==========
  {
    id: "ca-sb-2024-1001",
    title: "California Smart Appliance Consumer Protection Act",
    summary: "California bill requiring enhanced safety and cybersecurity for smart appliances.",
    bullets: [
      "State-level cybersecurity certification",
      "Privacy disclosure requirements",
      "Right to repair provisions"
    ],
    documentType: "bill",
    authority: "state",
    jurisdiction: "USA",
    subJurisdiction: "CA",
    riskLevel: "high",
    riskScore: 86,
    regulatoryCategory: "Cybersecurity",
    publishedDate: daysAgo(20),
    complianceDeadline: daysFromNow(270),
    isInForce: false,
    isPipeline: true,
    regulatoryBody: "California Legislature",
    impactAreas: ["Security", "Privacy", "Repair"],
    status: "In Committee",
    localTerminology: "SB 1001"
  },
  {
    id: "ca-prop-65-update",
    title: "California Prop 65 Update - Kitchen Appliances",
    summary: "Updated Prop 65 warning requirements for heating appliances.",
    bullets: [
      "New warning label format",
      "Updated chemical exposure limits",
      "Digital disclosure requirements"
    ],
    documentType: "statute",
    authority: "state",
    jurisdiction: "USA",
    subJurisdiction: "CA",
    riskLevel: "medium",
    riskScore: 70,
    regulatoryCategory: "Food Contact Material",
    publishedDate: daysAgo(150),
    effectiveDate: daysAgo(60),
    isInForce: true,
    isPipeline: false,
    regulatoryBody: "California OEHHA",
    impactAreas: ["Labeling", "Materials", "Compliance"],
    status: "In Force",
    localTerminology: "Proposition 65"
  },
  {
    id: "ny-ab-2024-5678",
    title: "New York Consumer Electronics Safety Act",
    summary: "Bill requiring enhanced safety standards for consumer electronics sold in NY.",
    bullets: [
      "UL certification requirement for all electrical appliances",
      "Enhanced ground fault protection",
      "State product registry"
    ],
    documentType: "bill",
    authority: "state",
    jurisdiction: "USA",
    subJurisdiction: "NY",
    riskLevel: "high",
    riskScore: 82,
    regulatoryCategory: "Product Safety",
    publishedDate: daysAgo(15),
    complianceDeadline: daysFromNow(300),
    isInForce: false,
    isPipeline: true,
    regulatoryBody: "New York Legislature",
    impactAreas: ["Certification", "Safety", "Registration"],
    status: "Second Reading",
    localTerminology: "A.B. 5678"
  },
  {
    id: "tx-sb-2024-234",
    title: "Texas RF Emissions Standards",
    summary: "State bill for wireless device emission standards in Texas.",
    bullets: [
      "State RF compliance documentation",
      "Consumer disclosure requirements",
      "Interference protection standards"
    ],
    documentType: "bill",
    authority: "state",
    jurisdiction: "USA",
    subJurisdiction: "TX",
    riskLevel: "medium",
    riskScore: 65,
    regulatoryCategory: "Radio",
    publishedDate: daysAgo(25),
    complianceDeadline: daysFromNow(240),
    isInForce: false,
    isPipeline: true,
    regulatoryBody: "Texas Legislature",
    impactAreas: ["Wireless", "Documentation", "Retail"],
    status: "First Reading",
    localTerminology: "S.B. 234"
  },

  // ========== LOCAL ORDINANCES ==========
  {
    id: "sf-ord-2024-101",
    title: "San Francisco Smart Device Privacy Ordinance",
    summary: "City ordinance requiring privacy disclosures for connected devices sold in SF.",
    bullets: [
      "Data collection disclosure at point of sale",
      "Opt-out requirements for data sharing",
      "Local privacy certification"
    ],
    documentType: "ordinance",
    authority: "city",
    jurisdiction: "USA",
    subJurisdiction: "San Francisco, CA",
    riskLevel: "medium",
    riskScore: 60,
    regulatoryCategory: "Cybersecurity",
    publishedDate: daysAgo(45),
    effectiveDate: daysAgo(15),
    isInForce: true,
    isPipeline: false,
    regulatoryBody: "San Francisco Board of Supervisors",
    impactAreas: ["Privacy", "Retail", "Labeling"],
    status: "In Force",
    localTerminology: "Ord. No. 101-24"
  },
  {
    id: "nyc-ord-2024-battery",
    title: "NYC Lithium Battery Safety Ordinance",
    summary: "New York City ordinance for lithium battery safety in consumer products.",
    bullets: [
      "Fire safety certification for battery devices",
      "Retail storage requirements",
      "Consumer safety education mandate"
    ],
    documentType: "ordinance",
    authority: "city",
    jurisdiction: "USA",
    subJurisdiction: "New York City, NY",
    riskLevel: "high",
    riskScore: 75,
    regulatoryCategory: "Battery",
    publishedDate: daysAgo(30),
    effectiveDate: daysFromNow(90),
    complianceDeadline: daysFromNow(60),
    isInForce: false,
    isPipeline: true,
    regulatoryBody: "NYC City Council",
    impactAreas: ["Battery Safety", "Retail", "Certification"],
    status: "Adopted - Future Effective",
    localTerminology: "Local Law 45"
  },
  {
    id: "la-ord-2024-energy",
    title: "Los Angeles Energy Efficiency Standards for Appliances",
    summary: "City ordinance requiring energy efficiency disclosure for electrical appliances.",
    bullets: [
      "Energy Star equivalent certification required",
      "Point of sale energy cost disclosure",
      "Efficiency rating display requirements"
    ],
    documentType: "ordinance",
    authority: "city",
    jurisdiction: "USA",
    subJurisdiction: "Los Angeles, CA",
    riskLevel: "low",
    riskScore: 48,
    regulatoryCategory: "Product Safety",
    publishedDate: daysAgo(180),
    effectiveDate: daysAgo(120),
    isInForce: true,
    isPipeline: false,
    regulatoryBody: "Los Angeles City Council",
    impactAreas: ["Energy", "Labeling", "Retail"],
    status: "In Force",
    localTerminology: "Ord. No. 187234"
  }
];
