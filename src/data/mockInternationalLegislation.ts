// Legislation types by jurisdiction:
// USA: Laws (enacted), Bills (pending) - H.R. (House), S. (Senate)
// Canada: Acts (enacted), Bills (pending) - C- (Commons), S- (Senate)
// Japan: 法律/Laws (enacted), 法案/Bills (pending)
// Korea: 법률/Laws (enacted), 법안/Bills (pending)
// Taiwan: 法律/Laws (enacted), 法案/Bills (pending)
// EU: Regulations/Directives (enacted), Proposals (pending)
// GCC: Laws/Decrees (enacted), Draft Laws (pending)

export type LegislationType = 
  | "law"           // Enacted legislation
  | "regulation"    // Enacted regulatory rules
  | "bill"          // Pending bill/proposal
  | "decree"        // Executive/Royal decree
  | "directive"     // EU directive
  | "proposal";     // EU/regulatory proposal

export type LegislativeCategory = "enacted" | "pending";

export type RegulatoryCategory = 
  | "Radio"
  | "Product Safety"
  | "Cybersecurity"
  | "Battery"
  | "Food Contact Material"
  // Spanish equivalents for LATAM jurisdictions
  | "Regulaciones de Radio"
  | "Seguridad del Producto"
  | "Ciberseguridad"
  | "Baterías"
  | "Materiales en Contacto con Alimentos"
  | "Regulaciones de Baterías";

export interface TimelineStage {
  name: string;
  completed: boolean;
  date?: string;
}

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
  regulatoryCategory: RegulatoryCategory;
  publishedDate: string;
  effectiveDate?: string;
  complianceDeadline?: string;
  regulatoryBody: string;
  impactAreas: string[];
  legislationType: LegislationType;
  legislativeCategory: LegislativeCategory;
  localTerminology?: string;
  timeline?: TimelineStage[];
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

// Timeline templates by jurisdiction
const getUSBillTimeline = (currentStage: number): TimelineStage[] => [
  { name: "Introduced", completed: currentStage >= 0, date: currentStage >= 0 ? daysAgo(30) : undefined },
  { name: "Committee", completed: currentStage >= 1, date: currentStage >= 1 ? daysAgo(20) : undefined },
  { name: "Passed Chamber", completed: currentStage >= 2, date: currentStage >= 2 ? daysAgo(10) : undefined },
  { name: "Other Chamber", completed: currentStage >= 3 },
  { name: "Signed into Law", completed: currentStage >= 4 },
];

const getCanadaBillTimeline = (currentStage: number): TimelineStage[] => [
  { name: "First Reading", completed: currentStage >= 0, date: currentStage >= 0 ? daysAgo(45) : undefined },
  { name: "Second Reading", completed: currentStage >= 1, date: currentStage >= 1 ? daysAgo(30) : undefined },
  { name: "Committee", completed: currentStage >= 2, date: currentStage >= 2 ? daysAgo(15) : undefined },
  { name: "Third Reading", completed: currentStage >= 3 },
  { name: "Royal Assent", completed: currentStage >= 4 },
];

const getJapanBillTimeline = (currentStage: number): TimelineStage[] => [
  { name: "Submitted", completed: currentStage >= 0, date: currentStage >= 0 ? daysAgo(40) : undefined },
  { name: "Committee Review", completed: currentStage >= 1, date: currentStage >= 1 ? daysAgo(25) : undefined },
  { name: "House Vote", completed: currentStage >= 2, date: currentStage >= 2 ? daysAgo(10) : undefined },
  { name: "Council Vote", completed: currentStage >= 3 },
  { name: "Promulgated", completed: currentStage >= 4 },
];

const getKoreaBillTimeline = (currentStage: number): TimelineStage[] => [
  { name: "Proposed", completed: currentStage >= 0, date: currentStage >= 0 ? daysAgo(35) : undefined },
  { name: "Committee Review", completed: currentStage >= 1, date: currentStage >= 1 ? daysAgo(20) : undefined },
  { name: "Plenary Session", completed: currentStage >= 2, date: currentStage >= 2 ? daysAgo(5) : undefined },
  { name: "Promulgation", completed: currentStage >= 3 },
];

const getTaiwanBillTimeline = (currentStage: number): TimelineStage[] => [
  { name: "Proposed", completed: currentStage >= 0, date: currentStage >= 0 ? daysAgo(30) : undefined },
  { name: "Committee Review", completed: currentStage >= 1, date: currentStage >= 1 ? daysAgo(15) : undefined },
  { name: "Second/Third Reading", completed: currentStage >= 2 },
  { name: "Presidential Promulgation", completed: currentStage >= 3 },
];

const getEUProposalTimeline = (currentStage: number): TimelineStage[] => [
  { name: "Commission Proposal", completed: currentStage >= 0, date: currentStage >= 0 ? daysAgo(60) : undefined },
  { name: "Parliament 1st Reading", completed: currentStage >= 1, date: currentStage >= 1 ? daysAgo(30) : undefined },
  { name: "Council Position", completed: currentStage >= 2 },
  { name: "Parliament 2nd Reading", completed: currentStage >= 3 },
  { name: "Adopted", completed: currentStage >= 4 },
];

const getGCCBillTimeline = (currentStage: number): TimelineStage[] => [
  { name: "Draft", completed: currentStage >= 0, date: currentStage >= 0 ? daysAgo(45) : undefined },
  { name: "Council Review", completed: currentStage >= 1, date: currentStage >= 1 ? daysAgo(20) : undefined },
  { name: "Royal/Emiri Decree", completed: currentStage >= 2 },
  { name: "Published", completed: currentStage >= 3 },
];

// US State Bills - Smart Kettle/Espresso Machine focused
export const usStateBills: InternationalLegislation[] = [
  // RADIO REGULATIONS
  {
    id: "ca-fcc-2024-rf-01",
    title: "California RF Emission Standards for Smart Appliances",
    summary: "Updates radio frequency emission limits for IoT-enabled kitchen appliances including smart kettles with WiFi/Bluetooth connectivity.",
    bullets: [
      "New RF emission limits aligned with FCC Part 15 updates",
      "Mandatory testing for WiFi 6E frequency bands",
      "Certification required for all wireless-enabled appliances"
    ],
    status: "In Committee",
    jurisdiction: "USA",
    subJurisdiction: "CA",
    riskLevel: "high",
    riskScore: 82,
    category: "Radio Regulations",
    regulatoryCategory: "Radio",
    publishedDate: daysAgo(15),
    effectiveDate: daysFromNow(180),
    complianceDeadline: daysFromNow(150),
    regulatoryBody: "California PUC",
    impactAreas: ["Wireless", "Certification", "Testing"],
    legislationType: "bill",
    legislativeCategory: "pending",
    localTerminology: "Senate Bill",
    timeline: getUSBillTimeline(1)
  },
  {
    id: "tx-rf-2024-001",
    title: "Texas Wireless Device Standards Act",
    summary: "Establishes state-level RF compliance requirements for connected appliances sold in Texas.",
    bullets: [
      "Requires FCC compliance documentation at point of sale",
      "Mandates RF interference testing for smart home devices",
      "Consumer disclosure requirements for wireless capabilities"
    ],
    status: "Second Reading",
    jurisdiction: "USA",
    subJurisdiction: "TX",
    riskLevel: "medium",
    riskScore: 65,
    category: "Radio Regulations",
    regulatoryCategory: "Radio",
    publishedDate: daysAgo(30),
    complianceDeadline: daysFromNow(240),
    regulatoryBody: "Texas PUC",
    impactAreas: ["Wireless", "Documentation", "Retail"],
    legislationType: "bill",
    legislativeCategory: "pending",
    localTerminology: "House Bill",
    timeline: getUSBillTimeline(1)
  },
  // PRODUCT SAFETY
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
    riskScore: 85,
    category: "Product Safety",
    regulatoryCategory: "Product Safety",
    publishedDate: daysAgo(20),
    effectiveDate: daysFromNow(120),
    complianceDeadline: daysFromNow(90),
    regulatoryBody: "NY Department of Consumer Protection",
    impactAreas: ["Product Safety", "Manufacturing", "Labeling"],
    legislationType: "bill",
    legislativeCategory: "pending",
    localTerminology: "Assembly Bill",
    timeline: getUSBillTimeline(2)
  },
  {
    id: "ca-cpsc-2024-safety",
    title: "California Enhanced Appliance Safety Standards",
    summary: "Mandatory safety certification for all countertop heating appliances sold in California.",
    bullets: [
      "UL/ETL certification mandatory for all heating appliances",
      "Enhanced ground fault protection requirements",
      "Child safety lock requirements for high-temperature appliances"
    ],
    status: "Enacted",
    jurisdiction: "USA",
    subJurisdiction: "CA",
    riskLevel: "high",
    riskScore: 78,
    category: "Product Safety",
    regulatoryCategory: "Product Safety",
    publishedDate: daysAgo(60),
    effectiveDate: daysAgo(10),
    regulatoryBody: "CA CPSC",
    impactAreas: ["Certification", "Safety Testing", "Design"],
    legislationType: "law",
    legislativeCategory: "enacted",
    localTerminology: "Public Law"
  },
  // CYBERSECURITY
  {
    id: "ca-iot-cyber-2024",
    title: "California IoT Cybersecurity Standards Act",
    summary: "Mandates cybersecurity requirements for all connected devices including smart kitchen appliances.",
    bullets: [
      "Unique passwords required for each device - no default passwords",
      "Security update support required for minimum 5 years",
      "Vulnerability disclosure program mandatory"
    ],
    status: "In Committee",
    jurisdiction: "USA",
    subJurisdiction: "CA",
    riskLevel: "high",
    riskScore: 88,
    category: "Cybersecurity",
    regulatoryCategory: "Cybersecurity",
    publishedDate: daysAgo(10),
    complianceDeadline: daysFromNow(365),
    regulatoryBody: "California Attorney General",
    impactAreas: ["Software", "Security", "Firmware"],
    legislationType: "bill",
    legislativeCategory: "pending",
    localTerminology: "Senate Bill",
    timeline: getUSBillTimeline(1)
  },
  {
    id: "ny-cyber-2024-iot",
    title: "New York Smart Device Security Requirements",
    summary: "Establishes minimum cybersecurity standards for IoT devices sold in New York State.",
    bullets: [
      "Encryption requirements for data transmission",
      "Secure boot requirements for firmware",
      "Annual security audit requirements for manufacturers"
    ],
    status: "Second Reading",
    jurisdiction: "USA",
    subJurisdiction: "NY",
    riskLevel: "medium",
    riskScore: 72,
    category: "Cybersecurity",
    regulatoryCategory: "Cybersecurity",
    publishedDate: daysAgo(25),
    complianceDeadline: daysFromNow(300),
    regulatoryBody: "NY Cybersecurity Division",
    impactAreas: ["Software", "Data Security", "Compliance"],
    legislationType: "bill",
    legislativeCategory: "pending",
    localTerminology: "Assembly Bill",
    timeline: getUSBillTimeline(1)
  },
  // BATTERY REGULATIONS
  {
    id: "ca-battery-2024-001",
    title: "California Lithium Battery Safety Act",
    summary: "New safety requirements for products containing lithium-ion batteries, including cordless kettles.",
    bullets: [
      "UL 2054 or equivalent certification mandatory",
      "Battery management system requirements",
      "Safe disposal instructions mandatory on packaging"
    ],
    status: "Passed Assembly",
    jurisdiction: "USA",
    subJurisdiction: "CA",
    riskLevel: "high",
    riskScore: 80,
    category: "Battery Regulations",
    regulatoryCategory: "Battery",
    publishedDate: daysAgo(20),
    effectiveDate: daysFromNow(180),
    complianceDeadline: daysFromNow(150),
    regulatoryBody: "CalEPA",
    impactAreas: ["Battery Safety", "Certification", "Labeling"],
    legislationType: "bill",
    legislativeCategory: "pending",
    localTerminology: "Assembly Bill",
    timeline: getUSBillTimeline(2)
  },
  {
    id: "wa-battery-recycle-2024",
    title: "Washington Battery Recycling Requirements",
    summary: "Mandates take-back programs for products with rechargeable batteries.",
    bullets: [
      "Producer responsibility for battery recycling",
      "Collection point requirements for retailers",
      "Recycling fee disclosure at point of sale"
    ],
    status: "Enacted",
    jurisdiction: "USA",
    subJurisdiction: "WA",
    riskLevel: "medium",
    riskScore: 58,
    category: "Battery Regulations",
    regulatoryCategory: "Battery",
    publishedDate: daysAgo(90),
    effectiveDate: daysAgo(30),
    regulatoryBody: "WA Ecology",
    impactAreas: ["Recycling", "Retail", "Costs"],
    legislationType: "law",
    legislativeCategory: "enacted",
    localTerminology: "Public Law"
  },
  // FOOD CONTACT MATERIAL
  {
    id: "ca-fcm-2024-001",
    title: "California Safe Food Contact Materials Act",
    summary: "Restricts hazardous chemicals in food contact materials for kitchen appliances including kettles and coffee machines.",
    bullets: [
      "PFAS banned in all food contact surfaces",
      "BPA-free certification required",
      "Heavy metal limits for heating element coatings"
    ],
    status: "In Committee",
    jurisdiction: "USA",
    subJurisdiction: "CA",
    riskLevel: "high",
    riskScore: 90,
    category: "Food Contact Material",
    regulatoryCategory: "Food Contact Material",
    publishedDate: daysAgo(15),
    complianceDeadline: daysFromNow(365),
    regulatoryBody: "CA OEHHA",
    impactAreas: ["Materials", "Testing", "Certification"],
    legislationType: "bill",
    legislativeCategory: "pending",
    localTerminology: "Senate Bill",
    timeline: getUSBillTimeline(1)
  },
  {
    id: "ny-fcm-safety-2024",
    title: "New York Food Contact Safety Standards",
    summary: "Updates food contact material standards for beverage preparation appliances.",
    bullets: [
      "FDA-compliant materials mandatory",
      "Migration testing requirements for hot beverages",
      "Prop 65 equivalent warning requirements"
    ],
    status: "Enacted",
    jurisdiction: "USA",
    subJurisdiction: "NY",
    riskLevel: "medium",
    riskScore: 68,
    category: "Food Contact Material",
    regulatoryCategory: "Food Contact Material",
    publishedDate: daysAgo(120),
    effectiveDate: daysAgo(60),
    regulatoryBody: "NY DOH",
    impactAreas: ["Materials", "Labeling", "Compliance"],
    legislationType: "law",
    legislativeCategory: "enacted",
    localTerminology: "Public Law"
  }
];

// Canada Provincial Legislation
export const canadaLegislation: InternationalLegislation[] = [
  // RADIO REGULATIONS
  {
    id: "ca-ised-rf-2024",
    title: "ISED Radio Standards Update - Smart Appliances",
    summary: "Innovation, Science and Economic Development Canada updates RF certification requirements for connected appliances.",
    bullets: [
      "RSS-247 compliance for WiFi/Bluetooth devices",
      "New testing requirements for 6 GHz band",
      "Mandatory IC certification mark updates"
    ],
    status: "In Force",
    jurisdiction: "Canada",
    subJurisdiction: "Federal",
    riskLevel: "high",
    riskScore: 78,
    category: "Radio Regulations",
    regulatoryCategory: "Radio",
    publishedDate: daysAgo(30),
    effectiveDate: daysAgo(5),
    regulatoryBody: "ISED Canada",
    impactAreas: ["Wireless", "Certification", "Testing"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "RSS Standard"
  },
  {
    id: "qc-rf-2024-001",
    title: "Quebec Wireless Device Registration Requirements",
    summary: "Provincial registration requirements for wireless-enabled appliances sold in Quebec.",
    bullets: [
      "Provincial database registration for connected devices",
      "French language documentation for RF specifications",
      "Consumer information requirements"
    ],
    status: "Second Reading",
    jurisdiction: "Canada",
    subJurisdiction: "QC",
    riskLevel: "medium",
    riskScore: 55,
    category: "Radio Regulations",
    regulatoryCategory: "Radio",
    publishedDate: daysAgo(20),
    complianceDeadline: daysFromNow(180),
    regulatoryBody: "Quebec Consumer Office",
    impactAreas: ["Documentation", "Registration", "Labeling"],
    legislationType: "bill",
    legislativeCategory: "pending",
    localTerminology: "Projet de loi",
    timeline: getCanadaBillTimeline(1)
  },
  // PRODUCT SAFETY
  {
    id: "ca-fed-c45-2024",
    title: "Canada Consumer Product Safety Act Amendment",
    summary: "Federal bill to strengthen safety requirements for electrical household appliances.",
    bullets: [
      "Enhanced recall powers for Health Canada",
      "Mandatory incident reporting within 48 hours",
      "New penalties for non-compliant importers"
    ],
    status: "Second Reading",
    jurisdiction: "Canada",
    subJurisdiction: "Federal",
    riskLevel: "high",
    riskScore: 82,
    category: "Product Safety",
    regulatoryCategory: "Product Safety",
    publishedDate: daysAgo(25),
    complianceDeadline: daysFromNow(180),
    regulatoryBody: "Health Canada",
    impactAreas: ["Compliance", "Reporting", "Import"],
    legislationType: "bill",
    legislativeCategory: "pending",
    localTerminology: "Bill C-45",
    timeline: getCanadaBillTimeline(1)
  },
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
    riskScore: 65,
    category: "Product Safety",
    regulatoryCategory: "Product Safety",
    publishedDate: daysAgo(90),
    effectiveDate: daysAgo(30),
    regulatoryBody: "Electrical Safety Authority",
    impactAreas: ["Product Safety", "Certification"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "O. Reg."
  },
  // CYBERSECURITY
  {
    id: "ca-fed-cyber-2024",
    title: "Federal IoT Security Standards Act",
    summary: "National cybersecurity requirements for connected consumer devices.",
    bullets: [
      "Mandatory security labeling for IoT products",
      "Encryption requirements for data transmission",
      "Vulnerability reporting requirements"
    ],
    status: "Committee Review",
    jurisdiction: "Canada",
    subJurisdiction: "Federal",
    riskLevel: "high",
    riskScore: 85,
    category: "Cybersecurity",
    regulatoryCategory: "Cybersecurity",
    publishedDate: daysAgo(15),
    complianceDeadline: daysFromNow(365),
    regulatoryBody: "CSE/CCCS",
    impactAreas: ["Software", "Security", "Labeling"],
    legislationType: "bill",
    legislativeCategory: "pending",
    localTerminology: "Bill C-52",
    timeline: getCanadaBillTimeline(1)
  },
  {
    id: "bc-privacy-iot-2024",
    title: "BC IoT Privacy and Security Requirements",
    summary: "Provincial requirements for IoT device data protection and security.",
    bullets: [
      "PIPA compliance for connected devices",
      "Data localization requirements",
      "Consumer consent for data collection"
    ],
    status: "First Reading",
    jurisdiction: "Canada",
    subJurisdiction: "BC",
    riskLevel: "medium",
    riskScore: 62,
    category: "Cybersecurity",
    regulatoryCategory: "Cybersecurity",
    publishedDate: daysAgo(10),
    complianceDeadline: daysFromNow(300),
    regulatoryBody: "BC OIPC",
    impactAreas: ["Privacy", "Data Security", "Software"],
    legislationType: "bill",
    legislativeCategory: "pending",
    localTerminology: "Bill",
    timeline: getCanadaBillTimeline(0)
  },
  // BATTERY REGULATIONS
  {
    id: "ca-fed-battery-2024",
    title: "Canadian Battery Safety Regulations",
    summary: "Federal requirements for lithium-ion batteries in consumer products.",
    bullets: [
      "UN 38.3 testing mandatory for lithium batteries",
      "Transport Canada compliance for battery shipping",
      "Safety labeling requirements"
    ],
    status: "In Force",
    jurisdiction: "Canada",
    subJurisdiction: "Federal",
    riskLevel: "high",
    riskScore: 75,
    category: "Battery Regulations",
    regulatoryCategory: "Battery",
    publishedDate: daysAgo(60),
    effectiveDate: daysAgo(15),
    regulatoryBody: "Transport Canada",
    impactAreas: ["Battery Safety", "Shipping", "Labeling"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "SOR"
  },
  {
    id: "bc-epr-battery-2024",
    title: "BC Extended Producer Responsibility - Batteries",
    summary: "Requires manufacturers to establish take-back programs for products with batteries.",
    bullets: [
      "Mandatory product stewardship plan registration",
      "Collection targets of 65% by 2027",
      "Eco-fees may be charged at point of sale"
    ],
    status: "Proposed",
    jurisdiction: "Canada",
    subJurisdiction: "BC",
    riskLevel: "medium",
    riskScore: 68,
    category: "Battery Regulations",
    regulatoryCategory: "Battery",
    publishedDate: daysAgo(10),
    effectiveDate: daysFromNow(365),
    complianceDeadline: daysFromNow(330),
    regulatoryBody: "BC Ministry of Environment",
    impactAreas: ["Recycling", "Product Stewardship", "Costs"],
    legislationType: "bill",
    legislativeCategory: "pending",
    localTerminology: "Bill",
    timeline: getCanadaBillTimeline(0)
  },
  // FOOD CONTACT MATERIAL
  {
    id: "ca-fed-fcm-2024",
    title: "Health Canada Food Contact Material Standards Update",
    summary: "Updates requirements for materials in contact with food in kitchen appliances.",
    bullets: [
      "New migration limits for heating appliances",
      "PFAS restrictions for food contact surfaces",
      "Testing requirements for high-temperature applications"
    ],
    status: "In Force",
    jurisdiction: "Canada",
    subJurisdiction: "Federal",
    riskLevel: "high",
    riskScore: 80,
    category: "Food Contact Material",
    regulatoryCategory: "Food Contact Material",
    publishedDate: daysAgo(45),
    effectiveDate: daysAgo(10),
    regulatoryBody: "Health Canada",
    impactAreas: ["Materials", "Testing", "Compliance"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "Regulation"
  },
  {
    id: "qc-fcm-2024-001",
    title: "Quebec Food Safety Material Requirements",
    summary: "Provincial requirements for food contact materials with French labeling.",
    bullets: [
      "Bilingual labeling for food contact compliance",
      "Provincial registry for food contact materials",
      "Additional testing for French market"
    ],
    status: "Committee Review",
    jurisdiction: "Canada",
    subJurisdiction: "QC",
    riskLevel: "medium",
    riskScore: 55,
    category: "Food Contact Material",
    regulatoryCategory: "Food Contact Material",
    publishedDate: daysAgo(20),
    complianceDeadline: daysFromNow(240),
    regulatoryBody: "MAPAQ",
    impactAreas: ["Labeling", "Documentation", "Compliance"],
    legislationType: "bill",
    legislativeCategory: "pending",
    localTerminology: "Projet de loi",
    timeline: getCanadaBillTimeline(1)
  }
];

// Japan Legislation
export const japanLegislation: InternationalLegislation[] = [
  // RADIO REGULATIONS
  {
    id: "jp-mic-rf-2024",
    title: "Radio Law Amendment - Smart Home Devices",
    summary: "Ministry of Internal Affairs updates technical standards for wireless-enabled appliances.",
    bullets: [
      "New technical standards for WiFi 6E devices",
      "TELEC certification updates",
      "Giteki mark requirements for connected appliances"
    ],
    status: "In Force",
    jurisdiction: "Japan",
    riskLevel: "high",
    riskScore: 82,
    category: "Radio Regulations",
    regulatoryCategory: "Radio",
    publishedDate: daysAgo(30),
    effectiveDate: daysAgo(5),
    regulatoryBody: "MIC",
    impactAreas: ["Wireless", "Certification", "Testing"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "省令 (Shōrei)"
  },
  {
    id: "jp-mic-rf-bill-2024",
    title: "Radio Equipment Technical Standards Update",
    summary: "Proposed updates to technical standards for IoT devices operating in shared spectrum.",
    bullets: [
      "New interference mitigation requirements",
      "Duty cycle limitations for connected devices",
      "Spectrum efficiency requirements"
    ],
    status: "Public Comment",
    jurisdiction: "Japan",
    riskLevel: "medium",
    riskScore: 65,
    category: "Radio Regulations",
    regulatoryCategory: "Radio",
    publishedDate: daysAgo(10),
    complianceDeadline: daysFromNow(270),
    regulatoryBody: "MIC",
    impactAreas: ["Wireless", "Design", "Testing"],
    legislationType: "proposal",
    legislativeCategory: "pending",
    localTerminology: "告示案 (Draft Notice)",
    timeline: getJapanBillTimeline(0)
  },
  // PRODUCT SAFETY
  {
    id: "jp-denan-2024-12",
    title: "Electrical Appliance Safety Law Amendment - PSE Mark",
    summary: "Updates technical requirements for PSE certification of household heating appliances.",
    bullets: [
      "New EMC requirements for appliances with digital displays",
      "Updated thermal runaway protection standards",
      "Conformity assessment procedure changes"
    ],
    status: "In Force",
    jurisdiction: "Japan",
    riskLevel: "high",
    riskScore: 85,
    category: "Product Safety",
    regulatoryCategory: "Product Safety",
    publishedDate: daysAgo(60),
    effectiveDate: daysAgo(15),
    regulatoryBody: "METI - DENAN",
    impactAreas: ["Certification", "Testing", "Documentation"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "法律 (Hōritsu)"
  },
  {
    id: "jp-diet-safety-2024",
    title: "Consumer Product Safety Enhancement Bill",
    summary: "Diet bill to strengthen safety requirements and recall procedures for household appliances.",
    bullets: [
      "Expanded definition of serious product incidents",
      "Enhanced penalties for safety violations",
      "New mandatory certification categories"
    ],
    status: "Committee Review",
    jurisdiction: "Japan",
    riskLevel: "high",
    riskScore: 78,
    category: "Product Safety",
    regulatoryCategory: "Product Safety",
    publishedDate: daysAgo(35),
    complianceDeadline: daysFromNow(300),
    regulatoryBody: "National Diet",
    impactAreas: ["Certification", "Compliance", "Recalls"],
    legislationType: "bill",
    legislativeCategory: "pending",
    localTerminology: "法案 (Hōan)",
    timeline: getJapanBillTimeline(1)
  },
  // CYBERSECURITY
  {
    id: "jp-meti-cyber-2024",
    title: "IoT Security Guidelines - Connected Appliances",
    summary: "METI mandatory cybersecurity guidelines for IoT consumer products.",
    bullets: [
      "Secure boot requirements",
      "Firmware update mechanism mandatory",
      "Password policy requirements"
    ],
    status: "In Force",
    jurisdiction: "Japan",
    riskLevel: "high",
    riskScore: 80,
    category: "Cybersecurity",
    regulatoryCategory: "Cybersecurity",
    publishedDate: daysAgo(45),
    effectiveDate: daysAgo(10),
    regulatoryBody: "METI",
    impactAreas: ["Software", "Security", "Firmware"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "ガイドライン (Guideline)"
  },
  {
    id: "jp-nisc-cyber-2024",
    title: "Critical Infrastructure IoT Security Act",
    summary: "Extends cybersecurity requirements to consumer IoT devices.",
    bullets: [
      "Security certification scheme for connected devices",
      "Vulnerability disclosure requirements",
      "Security labeling program"
    ],
    status: "First Reading",
    jurisdiction: "Japan",
    riskLevel: "medium",
    riskScore: 68,
    category: "Cybersecurity",
    regulatoryCategory: "Cybersecurity",
    publishedDate: daysAgo(15),
    complianceDeadline: daysFromNow(365),
    regulatoryBody: "NISC",
    impactAreas: ["Security", "Certification", "Labeling"],
    legislationType: "bill",
    legislativeCategory: "pending",
    localTerminology: "法案 (Hōan)",
    timeline: getJapanBillTimeline(0)
  },
  // BATTERY REGULATIONS
  {
    id: "jp-meti-battery-2024",
    title: "Portable Rechargeable Battery Safety Standards",
    summary: "New safety requirements for lithium-ion batteries in portable appliances.",
    bullets: [
      "JIS C 8712 compliance mandatory",
      "Battery management system requirements",
      "Safety testing by accredited labs"
    ],
    status: "In Force",
    jurisdiction: "Japan",
    riskLevel: "high",
    riskScore: 78,
    category: "Battery Regulations",
    regulatoryCategory: "Battery",
    publishedDate: daysAgo(60),
    effectiveDate: daysAgo(20),
    regulatoryBody: "METI",
    impactAreas: ["Battery Safety", "Testing", "Certification"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "JIS規格 (JIS Standard)"
  },
  {
    id: "jp-moe-battery-recycle-2024",
    title: "Small Rechargeable Battery Recycling Act Amendment",
    summary: "Extends recycling requirements to small appliance batteries.",
    bullets: [
      "Collection point requirements for retailers",
      "Manufacturer responsibility for recycling",
      "Recycling rate targets"
    ],
    status: "Committee Review",
    jurisdiction: "Japan",
    riskLevel: "medium",
    riskScore: 60,
    category: "Battery Regulations",
    regulatoryCategory: "Battery",
    publishedDate: daysAgo(25),
    complianceDeadline: daysFromNow(365),
    regulatoryBody: "MOE",
    impactAreas: ["Recycling", "Retail", "Costs"],
    legislationType: "bill",
    legislativeCategory: "pending",
    localTerminology: "法案 (Hōan)",
    timeline: getJapanBillTimeline(1)
  },
  // FOOD CONTACT MATERIAL
  {
    id: "jp-mhlw-fcm-2024",
    title: "Food Sanitation Act - Appliance Materials Update",
    summary: "Updates food contact material requirements for kitchen appliances.",
    bullets: [
      "New positive list for food contact plastics",
      "Migration testing requirements for hot beverages",
      "Heavy metal limits for heating elements"
    ],
    status: "In Force",
    jurisdiction: "Japan",
    riskLevel: "high",
    riskScore: 82,
    category: "Food Contact Material",
    regulatoryCategory: "Food Contact Material",
    publishedDate: daysAgo(90),
    effectiveDate: daysAgo(30),
    regulatoryBody: "MHLW",
    impactAreas: ["Materials", "Testing", "Compliance"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "省令 (Shōrei)"
  },
  {
    id: "jp-mhlw-fcm-bill-2024",
    title: "Food Contact Material Harmonization Bill",
    summary: "Aligns Japan's FCM requirements with international standards.",
    bullets: [
      "Codex Alimentarius alignment",
      "International testing method recognition",
      "Streamlined approval process"
    ],
    status: "Committee Review",
    jurisdiction: "Japan",
    riskLevel: "low",
    riskScore: 45,
    category: "Food Contact Material",
    regulatoryCategory: "Food Contact Material",
    publishedDate: daysAgo(20),
    complianceDeadline: daysFromNow(540),
    regulatoryBody: "MHLW",
    impactAreas: ["Certification", "Testing", "Market Access"],
    legislationType: "bill",
    legislativeCategory: "pending",
    localTerminology: "法案 (Hōan)",
    timeline: getJapanBillTimeline(1)
  }
];

// Korea Legislation
export const koreaLegislation: InternationalLegislation[] = [
  // RADIO REGULATIONS
  {
    id: "kr-rra-rf-2024",
    title: "Radio Waves Act Amendment - Smart Devices",
    summary: "Radio Research Agency updates certification requirements for connected appliances.",
    bullets: [
      "KC mark requirements for wireless modules",
      "EMC testing updates for WiFi 6E",
      "Type approval process changes"
    ],
    status: "In Force",
    jurisdiction: "Korea",
    riskLevel: "high",
    riskScore: 80,
    category: "Radio Regulations",
    regulatoryCategory: "Radio",
    publishedDate: daysAgo(40),
    effectiveDate: daysAgo(10),
    regulatoryBody: "RRA",
    impactAreas: ["Wireless", "Certification", "Testing"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "고시 (Gosi/Notice)"
  },
  {
    id: "kr-na-rf-2024",
    title: "Spectrum Management Act Amendment",
    summary: "National Assembly bill to update spectrum allocation for IoT devices.",
    bullets: [
      "New frequency allocations for smart home devices",
      "Interference protection requirements",
      "Registration requirements for IoT spectrum use"
    ],
    status: "Committee Review",
    jurisdiction: "Korea",
    riskLevel: "medium",
    riskScore: 62,
    category: "Radio Regulations",
    regulatoryCategory: "Radio",
    publishedDate: daysAgo(20),
    complianceDeadline: daysFromNow(300),
    regulatoryBody: "National Assembly",
    impactAreas: ["Wireless", "Spectrum", "Compliance"],
    legislationType: "bill",
    legislativeCategory: "pending",
    localTerminology: "법안 (Beop'an)",
    timeline: getKoreaBillTimeline(1)
  },
  // PRODUCT SAFETY
  {
    id: "kr-na-bill-2024-1892",
    title: "Electrical Appliance Safety Control Act Amendment",
    summary: "National Assembly bill to strengthen safety certification and market surveillance for electrical appliances.",
    bullets: [
      "Expanded scope of mandatory KC certification",
      "New online marketplace compliance requirements",
      "Enhanced penalties for non-certified products"
    ],
    status: "Committee Review",
    jurisdiction: "Korea",
    riskLevel: "high",
    riskScore: 85,
    category: "Product Safety",
    regulatoryCategory: "Product Safety",
    publishedDate: daysAgo(20),
    complianceDeadline: daysFromNow(270),
    regulatoryBody: "National Assembly",
    impactAreas: ["Certification", "E-commerce", "Compliance"],
    legislationType: "bill",
    legislativeCategory: "pending",
    localTerminology: "법안 (Beop'an)",
    timeline: getKoreaBillTimeline(1)
  },
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
    category: "Product Safety",
    regulatoryCategory: "Product Safety",
    publishedDate: daysAgo(45),
    effectiveDate: daysAgo(5),
    regulatoryBody: "KATS",
    impactAreas: ["Certification", "Manufacturing", "Testing"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "고시 (Gosi/Notice)"
  },
  // CYBERSECURITY
  {
    id: "kr-kisa-cyber-2024",
    title: "IoT Security Certification Program",
    summary: "KISA mandatory security certification for connected consumer devices.",
    bullets: [
      "Security testing requirements",
      "Vulnerability management requirements",
      "Security label for certified products"
    ],
    status: "In Force",
    jurisdiction: "Korea",
    riskLevel: "high",
    riskScore: 78,
    category: "Cybersecurity",
    regulatoryCategory: "Cybersecurity",
    publishedDate: daysAgo(60),
    effectiveDate: daysAgo(15),
    regulatoryBody: "KISA",
    impactAreas: ["Security", "Certification", "Labeling"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "고시 (Gosi/Notice)"
  },
  {
    id: "kr-na-cyber-2024",
    title: "Smart Device Security Act",
    summary: "National Assembly bill to mandate cybersecurity for IoT products.",
    bullets: [
      "Encryption requirements for data transmission",
      "Secure update mechanism mandatory",
      "Privacy protection requirements"
    ],
    status: "First Reading",
    jurisdiction: "Korea",
    riskLevel: "medium",
    riskScore: 65,
    category: "Cybersecurity",
    regulatoryCategory: "Cybersecurity",
    publishedDate: daysAgo(15),
    complianceDeadline: daysFromNow(365),
    regulatoryBody: "National Assembly",
    impactAreas: ["Software", "Security", "Privacy"],
    legislationType: "bill",
    legislativeCategory: "pending",
    localTerminology: "법안 (Beop'an)",
    timeline: getKoreaBillTimeline(0)
  },
  // BATTERY REGULATIONS
  {
    id: "kr-kats-battery-2024",
    title: "Lithium Battery Safety Standards",
    summary: "KATS updates safety requirements for lithium batteries in consumer products.",
    bullets: [
      "KC 62133 compliance mandatory",
      "Battery cell certification requirements",
      "Safety testing by accredited labs"
    ],
    status: "In Force",
    jurisdiction: "Korea",
    riskLevel: "high",
    riskScore: 75,
    category: "Battery Regulations",
    regulatoryCategory: "Battery",
    publishedDate: daysAgo(50),
    effectiveDate: daysAgo(10),
    regulatoryBody: "KATS",
    impactAreas: ["Battery Safety", "Certification", "Testing"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "고시 (Gosi/Notice)"
  },
  {
    id: "kr-moe-battery-2024",
    title: "Battery Recycling Responsibility Act Amendment",
    summary: "Extended producer responsibility for rechargeable batteries.",
    bullets: [
      "Collection and recycling targets",
      "Eco-fee requirements",
      "Retailer collection obligations"
    ],
    status: "Committee Review",
    jurisdiction: "Korea",
    riskLevel: "medium",
    riskScore: 58,
    category: "Battery Regulations",
    regulatoryCategory: "Battery",
    publishedDate: daysAgo(30),
    complianceDeadline: daysFromNow(365),
    regulatoryBody: "MOE",
    impactAreas: ["Recycling", "Costs", "Retail"],
    legislationType: "bill",
    legislativeCategory: "pending",
    localTerminology: "법안 (Beop'an)",
    timeline: getKoreaBillTimeline(1)
  },
  // FOOD CONTACT MATERIAL
  {
    id: "kr-mfds-fcm-2024",
    title: "Food Contact Material Standards Update",
    summary: "MFDS updates requirements for materials in contact with food.",
    bullets: [
      "New migration limits for hot beverage appliances",
      "PFAS restrictions",
      "Heavy metal limits"
    ],
    status: "In Force",
    jurisdiction: "Korea",
    riskLevel: "high",
    riskScore: 78,
    category: "Food Contact Material",
    regulatoryCategory: "Food Contact Material",
    publishedDate: daysAgo(75),
    effectiveDate: daysAgo(20),
    regulatoryBody: "MFDS",
    impactAreas: ["Materials", "Testing", "Compliance"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "고시 (Gosi/Notice)"
  },
  {
    id: "kr-na-fcm-2024",
    title: "Food Safety Act Amendment - Kitchen Appliances",
    summary: "National Assembly bill to strengthen food contact material requirements.",
    bullets: [
      "Expanded testing requirements",
      "Consumer labeling requirements",
      "Import inspection requirements"
    ],
    status: "Second Reading",
    jurisdiction: "Korea",
    riskLevel: "medium",
    riskScore: 62,
    category: "Food Contact Material",
    regulatoryCategory: "Food Contact Material",
    publishedDate: daysAgo(25),
    complianceDeadline: daysFromNow(300),
    regulatoryBody: "National Assembly",
    impactAreas: ["Labeling", "Testing", "Import"],
    legislationType: "bill",
    legislativeCategory: "pending",
    localTerminology: "법안 (Beop'an)",
    timeline: getKoreaBillTimeline(2)
  }
];

// Taiwan Legislation  
export const taiwanLegislation: InternationalLegislation[] = [
  // RADIO REGULATIONS
  {
    id: "tw-ncc-rf-2024",
    title: "NCC Radio Frequency Device Regulations Update",
    summary: "National Communications Commission updates certification for wireless devices.",
    bullets: [
      "NCC mark requirements for WiFi/Bluetooth devices",
      "Type approval process updates",
      "EMC testing requirements"
    ],
    status: "In Force",
    jurisdiction: "Taiwan",
    riskLevel: "high",
    riskScore: 78,
    category: "Radio Regulations",
    regulatoryCategory: "Radio",
    publishedDate: daysAgo(35),
    effectiveDate: daysAgo(5),
    regulatoryBody: "NCC",
    impactAreas: ["Wireless", "Certification", "Testing"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "法規 (Fǎguī)"
  },
  {
    id: "tw-ncc-rf-bill-2024",
    title: "Telecommunications Management Act Amendment",
    summary: "Legislative Yuan bill to update spectrum management for IoT devices.",
    bullets: [
      "New frequency allocations for smart home",
      "Interference mitigation requirements",
      "Simplified certification for low-power devices"
    ],
    status: "Committee Review",
    jurisdiction: "Taiwan",
    riskLevel: "medium",
    riskScore: 60,
    category: "Radio Regulations",
    regulatoryCategory: "Radio",
    publishedDate: daysAgo(20),
    complianceDeadline: daysFromNow(300),
    regulatoryBody: "Legislative Yuan",
    impactAreas: ["Wireless", "Spectrum", "Certification"],
    legislationType: "bill",
    legislativeCategory: "pending",
    localTerminology: "法案 (Fǎ'àn)",
    timeline: getTaiwanBillTimeline(1)
  },
  // PRODUCT SAFETY
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
    riskLevel: "high",
    riskScore: 75,
    category: "Product Safety",
    regulatoryCategory: "Product Safety",
    publishedDate: daysAgo(30),
    effectiveDate: daysAgo(10),
    regulatoryBody: "BSMI",
    impactAreas: ["Certification", "Testing", "Labeling"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "標準 (Biāozhǔn)"
  },
  {
    id: "tw-ly-safety-2024",
    title: "Consumer Protection Act Amendment - Appliance Safety",
    summary: "Legislative Yuan bill to enhance consumer protection for household electrical appliances.",
    bullets: [
      "Extended warranty period requirements",
      "Strengthened recall notification procedures",
      "New penalties for safety standard violations"
    ],
    status: "First Reading",
    jurisdiction: "Taiwan",
    riskLevel: "high",
    riskScore: 72,
    category: "Product Safety",
    regulatoryCategory: "Product Safety",
    publishedDate: daysAgo(15),
    complianceDeadline: daysFromNow(300),
    regulatoryBody: "Legislative Yuan",
    impactAreas: ["Warranty", "Compliance", "Recalls"],
    legislationType: "bill",
    legislativeCategory: "pending",
    localTerminology: "法案 (Fǎ'àn)",
    timeline: getTaiwanBillTimeline(0)
  },
  // CYBERSECURITY
  {
    id: "tw-moda-cyber-2024",
    title: "IoT Security Standards",
    summary: "Ministry of Digital Affairs security requirements for connected devices.",
    bullets: [
      "Security certification requirements",
      "Encryption standards",
      "Vulnerability management"
    ],
    status: "In Force",
    jurisdiction: "Taiwan",
    riskLevel: "high",
    riskScore: 78,
    category: "Cybersecurity",
    regulatoryCategory: "Cybersecurity",
    publishedDate: daysAgo(60),
    effectiveDate: daysAgo(15),
    regulatoryBody: "MODA",
    impactAreas: ["Security", "Certification", "Software"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "法規 (Fǎguī)"
  },
  {
    id: "tw-ly-cyber-2024",
    title: "Cybersecurity Management Act Amendment",
    summary: "Legislative Yuan bill extending cybersecurity requirements to consumer IoT.",
    bullets: [
      "Security by design requirements",
      "Incident reporting requirements",
      "Consumer notification obligations"
    ],
    status: "Committee Review",
    jurisdiction: "Taiwan",
    riskLevel: "medium",
    riskScore: 65,
    category: "Cybersecurity",
    regulatoryCategory: "Cybersecurity",
    publishedDate: daysAgo(25),
    complianceDeadline: daysFromNow(365),
    regulatoryBody: "Legislative Yuan",
    impactAreas: ["Software", "Security", "Compliance"],
    legislationType: "bill",
    legislativeCategory: "pending",
    localTerminology: "法案 (Fǎ'àn)",
    timeline: getTaiwanBillTimeline(1)
  },
  // BATTERY REGULATIONS
  {
    id: "tw-bsmi-battery-2024",
    title: "CNS Battery Safety Standards",
    summary: "BSMI updates safety requirements for lithium batteries in consumer products.",
    bullets: [
      "CNS 15364 compliance mandatory",
      "Safety testing requirements",
      "Labeling requirements"
    ],
    status: "In Force",
    jurisdiction: "Taiwan",
    riskLevel: "high",
    riskScore: 75,
    category: "Battery Regulations",
    regulatoryCategory: "Battery",
    publishedDate: daysAgo(45),
    effectiveDate: daysAgo(10),
    regulatoryBody: "BSMI",
    impactAreas: ["Battery Safety", "Certification", "Testing"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "CNS標準 (CNS Standard)"
  },
  {
    id: "tw-epa-battery-2024",
    title: "Battery Recycling Act Amendment",
    summary: "EPA extends recycling requirements to small appliance batteries.",
    bullets: [
      "Producer responsibility requirements",
      "Collection network requirements",
      "Recycling targets"
    ],
    status: "Second Reading",
    jurisdiction: "Taiwan",
    riskLevel: "medium",
    riskScore: 58,
    category: "Battery Regulations",
    regulatoryCategory: "Battery",
    publishedDate: daysAgo(20),
    complianceDeadline: daysFromNow(365),
    regulatoryBody: "EPA",
    impactAreas: ["Recycling", "Costs", "Retail"],
    legislationType: "bill",
    legislativeCategory: "pending",
    localTerminology: "法案 (Fǎ'àn)",
    timeline: getTaiwanBillTimeline(2)
  },
  // FOOD CONTACT MATERIAL
  {
    id: "tw-fda-fcm-2024",
    title: "Food Contact Material Standards",
    summary: "FDA updates requirements for materials in contact with food.",
    bullets: [
      "Migration limits for heating appliances",
      "Positive list updates",
      "Testing requirements"
    ],
    status: "In Force",
    jurisdiction: "Taiwan",
    riskLevel: "high",
    riskScore: 78,
    category: "Food Contact Material",
    regulatoryCategory: "Food Contact Material",
    publishedDate: daysAgo(60),
    effectiveDate: daysAgo(20),
    regulatoryBody: "TFDA",
    impactAreas: ["Materials", "Testing", "Compliance"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "法規 (Fǎguī)"
  },
  {
    id: "tw-ly-fcm-2024",
    title: "Food Safety Act Amendment - Appliance Materials",
    summary: "Legislative Yuan bill to strengthen food contact material requirements.",
    bullets: [
      "PFAS restrictions",
      "Enhanced testing requirements",
      "Consumer labeling"
    ],
    status: "First Reading",
    jurisdiction: "Taiwan",
    riskLevel: "medium",
    riskScore: 62,
    category: "Food Contact Material",
    regulatoryCategory: "Food Contact Material",
    publishedDate: daysAgo(15),
    complianceDeadline: daysFromNow(365),
    regulatoryBody: "Legislative Yuan",
    impactAreas: ["Materials", "Labeling", "Testing"],
    legislationType: "bill",
    legislativeCategory: "pending",
    localTerminology: "法案 (Fǎ'àn)",
    timeline: getTaiwanBillTimeline(0)
  }
];

// EU Legislation
export const euRegulations: InternationalLegislation[] = [
  // RADIO REGULATIONS
  {
    id: "eu-red-2024-update",
    title: "Radio Equipment Directive (RED) Delegated Act Update",
    summary: "Updates to radio equipment technical requirements for connected devices.",
    bullets: [
      "New essential requirements for IoT devices",
      "Cybersecurity requirements under Article 3.3",
      "Conformity assessment updates"
    ],
    status: "In Force",
    jurisdiction: "EU",
    riskLevel: "high",
    riskScore: 88,
    category: "Radio Regulations",
    regulatoryCategory: "Radio",
    publishedDate: daysAgo(30),
    effectiveDate: daysAgo(5),
    regulatoryBody: "European Commission",
    impactAreas: ["Wireless", "Certification", "Security"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "Delegated Regulation (EU)"
  },
  {
    id: "eu-red-proposal-2024",
    title: "RED Implementing Regulation - Smart Home Devices",
    summary: "Proposed implementing regulation for smart home device requirements.",
    bullets: [
      "Harmonized standards for smart appliances",
      "Interoperability requirements",
      "Market surveillance improvements"
    ],
    status: "Council Review",
    jurisdiction: "EU",
    riskLevel: "medium",
    riskScore: 68,
    category: "Radio Regulations",
    regulatoryCategory: "Radio",
    publishedDate: daysAgo(15),
    complianceDeadline: daysFromNow(365),
    regulatoryBody: "European Commission",
    impactAreas: ["Wireless", "Standards", "Compliance"],
    legislationType: "proposal",
    legislativeCategory: "pending",
    localTerminology: "Implementing Regulation (EU)",
    timeline: getEUProposalTimeline(2)
  },
  // PRODUCT SAFETY
  {
    id: "eu-gpsr-2024",
    title: "General Product Safety Regulation (GPSR)",
    summary: "New general product safety requirements replacing the GPSD.",
    bullets: [
      "Online marketplace obligations",
      "Enhanced traceability requirements",
      "Safety assessment documentation"
    ],
    status: "In Force",
    jurisdiction: "EU",
    riskLevel: "high",
    riskScore: 90,
    category: "Product Safety",
    regulatoryCategory: "Product Safety",
    publishedDate: daysAgo(180),
    effectiveDate: daysFromNow(30),
    regulatoryBody: "European Commission",
    impactAreas: ["Safety", "Documentation", "E-commerce"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "Regulation (EU)"
  },
  {
    id: "eu-lvd-amendment-2024",
    title: "Low Voltage Directive Amendment Proposal",
    summary: "Proposed updates to LVD technical requirements for household appliances.",
    bullets: [
      "Updated safety objectives",
      "Conformity assessment changes",
      "Digital product passport integration"
    ],
    status: "Parliament Review",
    jurisdiction: "EU",
    riskLevel: "high",
    riskScore: 82,
    category: "Product Safety",
    regulatoryCategory: "Product Safety",
    publishedDate: daysAgo(40),
    complianceDeadline: daysFromNow(540),
    regulatoryBody: "European Commission",
    impactAreas: ["Safety", "Certification", "Documentation"],
    legislationType: "proposal",
    legislativeCategory: "pending",
    localTerminology: "Directive (EU)",
    timeline: getEUProposalTimeline(1)
  },
  // CYBERSECURITY
  {
    id: "eu-cra-2024",
    title: "Cyber Resilience Act (CRA)",
    summary: "Mandatory cybersecurity requirements for products with digital elements.",
    bullets: [
      "Security by design requirements",
      "Vulnerability handling obligations",
      "Software update requirements for product lifetime"
    ],
    status: "Adopted",
    jurisdiction: "EU",
    riskLevel: "high",
    riskScore: 92,
    category: "Cybersecurity",
    regulatoryCategory: "Cybersecurity",
    publishedDate: daysAgo(60),
    effectiveDate: daysFromNow(730),
    complianceDeadline: daysFromNow(700),
    regulatoryBody: "European Commission",
    impactAreas: ["Software", "Security", "Firmware"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "Regulation (EU)"
  },
  {
    id: "eu-cra-delegated-2024",
    title: "CRA Delegated Act - Product Categories",
    summary: "Defines critical product categories under the Cyber Resilience Act.",
    bullets: [
      "Class I and Class II product definitions",
      "Conformity assessment requirements by category",
      "Third-party assessment criteria"
    ],
    status: "Public Consultation",
    jurisdiction: "EU",
    riskLevel: "medium",
    riskScore: 75,
    category: "Cybersecurity",
    regulatoryCategory: "Cybersecurity",
    publishedDate: daysAgo(10),
    complianceDeadline: daysFromNow(365),
    regulatoryBody: "European Commission",
    impactAreas: ["Classification", "Certification", "Compliance"],
    legislationType: "proposal",
    legislativeCategory: "pending",
    localTerminology: "Delegated Regulation (EU)",
    timeline: getEUProposalTimeline(0)
  },
  // BATTERY REGULATIONS
  {
    id: "eu-battery-reg-2024",
    title: "EU Battery Regulation",
    summary: "Comprehensive requirements for batteries and waste batteries.",
    bullets: [
      "Carbon footprint declaration requirements",
      "Due diligence requirements",
      "Digital battery passport"
    ],
    status: "In Force",
    jurisdiction: "EU",
    riskLevel: "high",
    riskScore: 88,
    category: "Battery Regulations",
    regulatoryCategory: "Battery",
    publishedDate: daysAgo(180),
    effectiveDate: daysAgo(30),
    regulatoryBody: "European Commission",
    impactAreas: ["Battery", "Documentation", "Sustainability"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "Regulation (EU)"
  },
  {
    id: "eu-battery-delegated-2024",
    title: "Battery Regulation Delegated Acts Package",
    summary: "Implementing measures for battery regulation requirements.",
    bullets: [
      "Carbon footprint calculation methodology",
      "Performance and durability requirements",
      "Battery passport data requirements"
    ],
    status: "Council Review",
    jurisdiction: "EU",
    riskLevel: "high",
    riskScore: 80,
    category: "Battery Regulations",
    regulatoryCategory: "Battery",
    publishedDate: daysAgo(20),
    complianceDeadline: daysFromNow(365),
    regulatoryBody: "European Commission",
    impactAreas: ["Battery", "Sustainability", "Documentation"],
    legislationType: "proposal",
    legislativeCategory: "pending",
    localTerminology: "Delegated Regulation (EU)",
    timeline: getEUProposalTimeline(2)
  },
  // FOOD CONTACT MATERIAL
  {
    id: "eu-fcm-2024",
    title: "Food Contact Materials Regulation Revision",
    summary: "Comprehensive revision of EU food contact materials framework.",
    bullets: [
      "New migration limits",
      "PFAS restrictions",
      "Positive list updates"
    ],
    status: "Adopted",
    jurisdiction: "EU",
    riskLevel: "high",
    riskScore: 85,
    category: "Food Contact Material",
    regulatoryCategory: "Food Contact Material",
    publishedDate: daysAgo(90),
    effectiveDate: daysFromNow(180),
    complianceDeadline: daysFromNow(150),
    regulatoryBody: "European Commission",
    impactAreas: ["Materials", "Testing", "Compliance"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "Regulation (EU)"
  },
  {
    id: "eu-fcm-plastics-2024",
    title: "FCM Plastics Implementing Regulation",
    summary: "Updates to plastic materials in food contact applications.",
    bullets: [
      "Recycled content requirements",
      "Decontamination requirements",
      "Testing methodology updates"
    ],
    status: "Parliament Review",
    jurisdiction: "EU",
    riskLevel: "medium",
    riskScore: 72,
    category: "Food Contact Material",
    regulatoryCategory: "Food Contact Material",
    publishedDate: daysAgo(30),
    complianceDeadline: daysFromNow(365),
    regulatoryBody: "European Commission",
    impactAreas: ["Materials", "Recycling", "Testing"],
    legislationType: "proposal",
    legislativeCategory: "pending",
    localTerminology: "Implementing Regulation (EU)",
    timeline: getEUProposalTimeline(1)
  }
];

// GCC Legislation - UAE, Saudi Arabia, Kuwait, Bahrain, Qatar, Oman
export const gccLegislation: InternationalLegislation[] = [
  // RADIO REGULATIONS
  {
    id: "uae-tra-rf-2024",
    title: "TRA Radio Equipment Technical Regulations Update",
    summary: "UAE Telecommunications Regulatory Authority updates type approval requirements.",
    bullets: [
      "New type approval requirements for WiFi devices",
      "EMC testing requirements",
      "TRA mark requirements"
    ],
    status: "In Force",
    jurisdiction: "UAE",
    riskLevel: "high",
    riskScore: 80,
    category: "Radio Regulations",
    regulatoryCategory: "Radio",
    publishedDate: daysAgo(30),
    effectiveDate: daysAgo(5),
    regulatoryBody: "TRA",
    impactAreas: ["Wireless", "Certification", "Testing"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "Technical Regulation"
  },
  {
    id: "sa-citc-rf-2024",
    title: "CITC Radio Equipment Regulations",
    summary: "Saudi Communications and Information Technology Commission updates wireless requirements.",
    bullets: [
      "CITC type approval updates",
      "Frequency allocation changes",
      "Conformity marking requirements"
    ],
    status: "Draft",
    jurisdiction: "Saudi Arabia",
    riskLevel: "medium",
    riskScore: 68,
    category: "Radio Regulations",
    regulatoryCategory: "Radio",
    publishedDate: daysAgo(15),
    complianceDeadline: daysFromNow(270),
    regulatoryBody: "CITC",
    impactAreas: ["Wireless", "Certification", "Spectrum"],
    legislationType: "proposal",
    legislativeCategory: "pending",
    localTerminology: "Draft Regulation",
    timeline: getGCCBillTimeline(0)
  },
  // PRODUCT SAFETY
  {
    id: "gcc-gso-safety-2024",
    title: "GSO Technical Regulation - Household Appliances",
    summary: "Gulf Standardization Organization updates safety requirements for household appliances.",
    bullets: [
      "Updated GSO safety standards alignment with IEC",
      "Conformity assessment requirements",
      "G-Mark requirements"
    ],
    status: "In Force",
    jurisdiction: "UAE",
    riskLevel: "high",
    riskScore: 85,
    category: "Product Safety",
    regulatoryCategory: "Product Safety",
    publishedDate: daysAgo(60),
    effectiveDate: daysAgo(15),
    regulatoryBody: "GSO/ESMA",
    impactAreas: ["Safety", "Certification", "Testing"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "GSO Technical Regulation"
  },
  {
    id: "sa-saso-safety-2024",
    title: "SASO Product Safety Requirements Update",
    summary: "Saudi Standards Authority updates product safety requirements for electrical appliances.",
    bullets: [
      "SASO marking requirements",
      "Safety certification requirements",
      "Market surveillance enhancements"
    ],
    status: "In Force",
    jurisdiction: "Saudi Arabia",
    riskLevel: "high",
    riskScore: 82,
    category: "Product Safety",
    regulatoryCategory: "Product Safety",
    publishedDate: daysAgo(45),
    effectiveDate: daysAgo(10),
    regulatoryBody: "SASO",
    impactAreas: ["Safety", "Certification", "Compliance"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "SASO Standard"
  },
  // CYBERSECURITY
  {
    id: "uae-tdra-cyber-2024",
    title: "UAE IoT Security Standards",
    summary: "TDRA mandatory cybersecurity requirements for IoT devices.",
    bullets: [
      "Security certification requirements",
      "Encryption requirements",
      "Vulnerability management"
    ],
    status: "In Force",
    jurisdiction: "UAE",
    riskLevel: "high",
    riskScore: 82,
    category: "Cybersecurity",
    regulatoryCategory: "Cybersecurity",
    publishedDate: daysAgo(45),
    effectiveDate: daysAgo(10),
    regulatoryBody: "TDRA",
    impactAreas: ["Security", "Certification", "Software"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "Technical Regulation"
  },
  {
    id: "sa-nca-cyber-2024",
    title: "NCA IoT Security Framework",
    summary: "Saudi National Cybersecurity Authority security requirements for connected devices.",
    bullets: [
      "Security by design requirements",
      "Incident reporting requirements",
      "Security testing requirements"
    ],
    status: "Draft",
    jurisdiction: "Saudi Arabia",
    riskLevel: "high",
    riskScore: 78,
    category: "Cybersecurity",
    regulatoryCategory: "Cybersecurity",
    publishedDate: daysAgo(20),
    complianceDeadline: daysFromNow(365),
    regulatoryBody: "NCA",
    impactAreas: ["Security", "Compliance", "Testing"],
    legislationType: "proposal",
    legislativeCategory: "pending",
    localTerminology: "Draft Framework",
    timeline: getGCCBillTimeline(0)
  },
  // BATTERY REGULATIONS
  {
    id: "uae-moei-battery-2024",
    title: "UAE Battery Safety and Recycling Regulations",
    summary: "Ministry of Energy and Infrastructure battery requirements.",
    bullets: [
      "Safety certification requirements",
      "Recycling program requirements",
      "Labeling requirements"
    ],
    status: "In Force",
    jurisdiction: "UAE",
    riskLevel: "medium",
    riskScore: 68,
    category: "Battery Regulations",
    regulatoryCategory: "Battery",
    publishedDate: daysAgo(60),
    effectiveDate: daysAgo(15),
    regulatoryBody: "MOEI",
    impactAreas: ["Battery Safety", "Recycling", "Labeling"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "Ministerial Decision"
  },
  {
    id: "sa-battery-reg-2024",
    title: "Saudi Battery Technical Regulation",
    summary: "SASO requirements for lithium batteries in consumer products.",
    bullets: [
      "IEC 62133 compliance",
      "Safety testing requirements",
      "Import certification"
    ],
    status: "Draft",
    jurisdiction: "Saudi Arabia",
    riskLevel: "medium",
    riskScore: 65,
    category: "Battery Regulations",
    regulatoryCategory: "Battery",
    publishedDate: daysAgo(25),
    complianceDeadline: daysFromNow(300),
    regulatoryBody: "SASO",
    impactAreas: ["Battery Safety", "Certification", "Import"],
    legislationType: "proposal",
    legislativeCategory: "pending",
    localTerminology: "Draft Technical Regulation",
    timeline: getGCCBillTimeline(1)
  },
  // FOOD CONTACT MATERIAL
  {
    id: "gcc-gso-fcm-2024",
    title: "GSO Food Contact Material Requirements",
    summary: "Gulf-wide food contact material requirements for kitchen appliances.",
    bullets: [
      "Migration limits alignment with Codex",
      "Testing requirements",
      "Labeling requirements"
    ],
    status: "In Force",
    jurisdiction: "UAE",
    riskLevel: "high",
    riskScore: 78,
    category: "Food Contact Material",
    regulatoryCategory: "Food Contact Material",
    publishedDate: daysAgo(90),
    effectiveDate: daysAgo(30),
    regulatoryBody: "GSO",
    impactAreas: ["Materials", "Testing", "Compliance"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "GSO Standard"
  },
  {
    id: "sa-sfda-fcm-2024",
    title: "SFDA Food Contact Material Update",
    summary: "Saudi Food and Drug Authority updates FCM requirements.",
    bullets: [
      "Enhanced testing requirements",
      "Heavy metal limits",
      "Documentation requirements"
    ],
    status: "Council Review",
    jurisdiction: "Saudi Arabia",
    riskLevel: "medium",
    riskScore: 65,
    category: "Food Contact Material",
    regulatoryCategory: "Food Contact Material",
    publishedDate: daysAgo(30),
    complianceDeadline: daysFromNow(270),
    regulatoryBody: "SFDA",
    impactAreas: ["Materials", "Testing", "Documentation"],
    legislationType: "proposal",
    legislativeCategory: "pending",
    localTerminology: "Draft Regulation",
    timeline: getGCCBillTimeline(1)
  }
];

// Additional GCC legislation for Oman, Kuwait, Bahrain, Qatar
export const omanLegislationData: InternationalLegislation[] = [
  {
    id: "om-tra-rf-2024",
    title: "TRA Oman Radio Equipment Requirements",
    summary: "Telecommunications Regulatory Authority of Oman updates type approval requirements.",
    bullets: ["Type approval requirements for wireless devices", "EMC testing requirements", "TRA Oman mark requirements"],
    status: "In Force",
    jurisdiction: "Oman",
    riskLevel: "high",
    riskScore: 76,
    category: "Radio Regulations",
    regulatoryCategory: "Radio",
    publishedDate: daysAgo(45),
    effectiveDate: daysAgo(10),
    regulatoryBody: "TRA Oman",
    impactAreas: ["Wireless", "Certification", "Testing"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "Royal Decree"
  },
  {
    id: "om-safety-2024",
    title: "Oman Product Safety Standards Update",
    summary: "Ministry of Commerce updates product safety requirements.",
    bullets: ["Safety certification requirements", "Testing requirements alignment with GCC", "Market surveillance"],
    status: "In Force",
    jurisdiction: "Oman",
    riskLevel: "medium",
    riskScore: 68,
    category: "Product Safety",
    regulatoryCategory: "Product Safety",
    publishedDate: daysAgo(60),
    effectiveDate: daysAgo(20),
    regulatoryBody: "Ministry of Commerce",
    impactAreas: ["Safety", "Certification", "Compliance"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "Ministerial Decision"
  }
];

export const kuwaitLegislationData: InternationalLegislation[] = [
  {
    id: "kw-citra-rf-2024",
    title: "CITRA Kuwait Wireless Equipment Standards",
    summary: "Communication and Information Technology Regulatory Authority updates requirements.",
    bullets: ["Type approval for wireless devices", "Frequency allocation requirements", "Certification marking"],
    status: "In Force",
    jurisdiction: "Kuwait",
    riskLevel: "high",
    riskScore: 74,
    category: "Radio Regulations",
    regulatoryCategory: "Radio",
    publishedDate: daysAgo(35),
    effectiveDate: daysAgo(5),
    regulatoryBody: "CITRA",
    impactAreas: ["Wireless", "Certification", "Testing"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "Amiri Decree"
  },
  {
    id: "kw-paa-safety-2024",
    title: "Kuwait PAA Product Safety Requirements",
    summary: "Public Authority for Industry updates appliance safety standards.",
    bullets: ["GSO alignment requirements", "Safety testing", "Conformity marking"],
    status: "Draft",
    jurisdiction: "Kuwait",
    riskLevel: "medium",
    riskScore: 65,
    category: "Product Safety",
    regulatoryCategory: "Product Safety",
    publishedDate: daysAgo(20),
    complianceDeadline: daysFromNow(180),
    regulatoryBody: "PAA",
    impactAreas: ["Safety", "Certification", "Compliance"],
    legislationType: "proposal",
    legislativeCategory: "pending",
    localTerminology: "Draft Regulation",
    timeline: getGCCBillTimeline(0)
  }
];

export const bahrainLegislationData: InternationalLegislation[] = [
  {
    id: "bh-tra-rf-2024",
    title: "TRA Bahrain Radio Equipment Regulations",
    summary: "Telecommunications Regulatory Authority of Bahrain updates wireless requirements.",
    bullets: ["Type approval requirements", "EMC compliance", "TRA certification"],
    status: "In Force",
    jurisdiction: "Bahrain",
    riskLevel: "high",
    riskScore: 72,
    category: "Radio Regulations",
    regulatoryCategory: "Radio",
    publishedDate: daysAgo(40),
    effectiveDate: daysAgo(8),
    regulatoryBody: "TRA Bahrain",
    impactAreas: ["Wireless", "Certification", "Testing"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "Royal Decree"
  },
  {
    id: "bh-moic-safety-2024",
    title: "Bahrain Product Safety Standards",
    summary: "Ministry of Industry and Commerce updates consumer product safety.",
    bullets: ["Safety certification requirements", "GSO standards alignment", "Market access requirements"],
    status: "In Force",
    jurisdiction: "Bahrain",
    riskLevel: "medium",
    riskScore: 66,
    category: "Product Safety",
    regulatoryCategory: "Product Safety",
    publishedDate: daysAgo(55),
    effectiveDate: daysAgo(15),
    regulatoryBody: "MOIC",
    impactAreas: ["Safety", "Certification", "Compliance"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "Ministerial Order"
  }
];

export const qatarLegislationData: InternationalLegislation[] = [
  {
    id: "qa-cra-rf-2024",
    title: "CRA Qatar Radio Equipment Requirements",
    summary: "Communications Regulatory Authority of Qatar updates type approval requirements.",
    bullets: ["Type approval for wireless devices", "Frequency management", "CRA certification mark"],
    status: "In Force",
    jurisdiction: "Qatar",
    riskLevel: "high",
    riskScore: 78,
    category: "Radio Regulations",
    regulatoryCategory: "Radio",
    publishedDate: daysAgo(30),
    effectiveDate: daysAgo(5),
    regulatoryBody: "CRA Qatar",
    impactAreas: ["Wireless", "Certification", "Testing"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "Emiri Decision"
  },
  {
    id: "qa-moci-safety-2024",
    title: "Qatar Product Safety Technical Regulation",
    summary: "Ministry of Commerce and Industry updates appliance safety requirements.",
    bullets: ["GSO conformity requirements", "Safety testing", "Qatar Quality Mark"],
    status: "Draft",
    jurisdiction: "Qatar",
    riskLevel: "medium",
    riskScore: 70,
    category: "Product Safety",
    regulatoryCategory: "Product Safety",
    publishedDate: daysAgo(25),
    complianceDeadline: daysFromNow(240),
    regulatoryBody: "MOCI",
    impactAreas: ["Safety", "Certification", "Compliance"],
    legislationType: "proposal",
    legislativeCategory: "pending",
    localTerminology: "Draft Regulation",
    timeline: getGCCBillTimeline(1)
  }
];

// Peru Legislative Timeline
const getPeruBillTimeline = (currentStage: number): TimelineStage[] => [
  { name: "Presentación", completed: currentStage >= 0, date: currentStage >= 0 ? daysAgo(45) : undefined },
  { name: "Comisión", completed: currentStage >= 1, date: currentStage >= 1 ? daysAgo(30) : undefined },
  { name: "Primera Votación", completed: currentStage >= 2, date: currentStage >= 2 ? daysAgo(15) : undefined },
  { name: "Segunda Votación", completed: currentStage >= 3 },
  { name: "Promulgación", completed: currentStage >= 4 },
];

// Peru Legislation - Smart Kettle/Espresso Machine focused
export const peruLegislation: InternationalLegislation[] = [
  // RADIO REGULATIONS
  {
    id: "pe-mtc-rf-2024-001",
    title: "Reglamento de Homologación de Equipos de Telecomunicaciones con Conectividad Inalámbrica",
    summary: "Actualización de requisitos de homologación del MTC para dispositivos con WiFi y Bluetooth, incluyendo electrodomésticos inteligentes.",
    bullets: [
      "Certificación obligatoria ante el MTC para dispositivos con módulos WiFi/Bluetooth",
      "Nuevos límites de emisión RF alineados con estándares internacionales",
      "Requisito de etiquetado de frecuencia operativa en español"
    ],
    status: "En Comisión",
    jurisdiction: "Peru",
    riskLevel: "high",
    riskScore: 78,
    category: "Regulaciones de Radio",
    regulatoryCategory: "Regulaciones de Radio",
    publishedDate: daysAgo(20),
    complianceDeadline: daysFromNow(180),
    regulatoryBody: "MTC - Ministerio de Transportes y Comunicaciones",
    impactAreas: ["Inalámbrico", "Certificación", "Etiquetado"],
    legislationType: "bill",
    legislativeCategory: "pending",
    localTerminology: "Proyecto de Ley",
    timeline: getPeruBillTimeline(1)
  },
  {
    id: "pe-osiptel-2024-001",
    title: "Norma Técnica OSIPTEL para Dispositivos IoT Conectados",
    summary: "OSIPTEL establece requisitos técnicos para dispositivos del Internet de las Cosas comercializados en Perú.",
    bullets: [
      "Registro obligatorio de dispositivos IoT en base de datos OSIPTEL",
      "Requisitos de interoperabilidad con redes peruanas",
      "Estándares de seguridad para comunicaciones inalámbricas"
    ],
    status: "Vigente",
    jurisdiction: "Peru",
    riskLevel: "medium",
    riskScore: 65,
    category: "Regulaciones de Radio",
    regulatoryCategory: "Regulaciones de Radio",
    publishedDate: daysAgo(60),
    effectiveDate: daysAgo(15),
    regulatoryBody: "OSIPTEL",
    impactAreas: ["IoT", "Registro", "Conectividad"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "Resolución de Consejo Directivo"
  },
  // PRODUCT SAFETY
  {
    id: "pe-indecopi-safety-2024",
    title: "Reglamento Técnico de Seguridad para Electrodomésticos de Calentamiento",
    summary: "INDECOPI actualiza normas de seguridad para aparatos eléctricos de calentamiento incluyendo hervidores y cafeteras.",
    bullets: [
      "Requisitos de protección térmica dual para aparatos sobre 1000W",
      "Apagado automático obligatorio por inactividad",
      "Certificación NTP obligatoria antes de comercialización"
    ],
    status: "Primera Votación",
    jurisdiction: "Peru",
    riskLevel: "high",
    riskScore: 85,
    category: "Seguridad del Producto",
    regulatoryCategory: "Seguridad del Producto",
    publishedDate: daysAgo(15),
    complianceDeadline: daysFromNow(120),
    regulatoryBody: "INDECOPI",
    impactAreas: ["Seguridad del Producto", "Certificación", "Manufactura"],
    legislationType: "bill",
    legislativeCategory: "pending",
    localTerminology: "Proyecto de Ley",
    timeline: getPeruBillTimeline(2)
  },
  {
    id: "pe-inacal-electric-2024",
    title: "Norma Técnica Peruana NTP-IEC 60335-2-15 Hervidores Eléctricos",
    summary: "INACAL adopta estándar internacional IEC para requisitos de seguridad específicos de hervidores eléctricos.",
    bullets: [
      "Adopción de IEC 60335-2-15 con modificaciones nacionales",
      "Requisitos de estabilidad y protección contra derrames",
      "Ensayos de durabilidad térmica obligatorios"
    ],
    status: "Vigente",
    jurisdiction: "Peru",
    riskLevel: "medium",
    riskScore: 70,
    category: "Seguridad del Producto",
    regulatoryCategory: "Seguridad del Producto",
    publishedDate: daysAgo(90),
    effectiveDate: daysAgo(30),
    regulatoryBody: "INACAL",
    impactAreas: ["Estándares", "Ensayos", "Cumplimiento"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "Norma Técnica Peruana"
  },
  // CYBERSECURITY
  {
    id: "pe-pcm-cyber-2024",
    title: "Ley de Ciberseguridad para Dispositivos Conectados del Consumidor",
    summary: "PCM propone requisitos mínimos de ciberseguridad para dispositivos IoT comercializados en Perú.",
    bullets: [
      "Prohibición de contraseñas por defecto - credenciales únicas obligatorias",
      "Soporte de actualizaciones de seguridad mínimo 3 años",
      "Programa de divulgación de vulnerabilidades requerido"
    ],
    status: "En Comisión",
    jurisdiction: "Peru",
    riskLevel: "high",
    riskScore: 82,
    category: "Ciberseguridad",
    regulatoryCategory: "Ciberseguridad",
    publishedDate: daysAgo(25),
    complianceDeadline: daysFromNow(270),
    regulatoryBody: "PCM - Presidencia del Consejo de Ministros",
    impactAreas: ["Software", "Seguridad", "Firmware"],
    legislationType: "bill",
    legislativeCategory: "pending",
    localTerminology: "Proyecto de Ley",
    timeline: getPeruBillTimeline(1)
  },
  {
    id: "pe-segdi-iot-2024",
    title: "Directiva de Seguridad Digital para Electrodomésticos Inteligentes",
    summary: "SEGDI establece lineamientos de seguridad digital para dispositivos inteligentes del hogar.",
    bullets: [
      "Cifrado obligatorio para transmisión de datos",
      "Requisitos de autenticación segura",
      "Auditorías de seguridad periódicas recomendadas"
    ],
    status: "Vigente",
    jurisdiction: "Peru",
    riskLevel: "medium",
    riskScore: 58,
    category: "Ciberseguridad",
    regulatoryCategory: "Ciberseguridad",
    publishedDate: daysAgo(45),
    effectiveDate: daysAgo(10),
    regulatoryBody: "SEGDI - Secretaría de Gobierno Digital",
    impactAreas: ["Seguridad de Datos", "Cifrado", "Autenticación"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "Directiva"
  },
  // BATTERY REGULATIONS
  {
    id: "pe-minam-battery-2024",
    title: "Reglamento de Gestión de Baterías de Litio en Productos Electrónicos",
    summary: "MINAM establece requisitos para baterías de litio en electrodomésticos portátiles incluyendo hervidores inalámbricos.",
    bullets: [
      "Certificación de seguridad obligatoria para baterías de litio",
      "Sistema de gestión de baterías (BMS) requerido",
      "Etiquetado de capacidad y advertencias de seguridad"
    ],
    status: "Segunda Votación",
    jurisdiction: "Peru",
    riskLevel: "high",
    riskScore: 76,
    category: "Regulaciones de Baterías",
    regulatoryCategory: "Baterías",
    publishedDate: daysAgo(30),
    complianceDeadline: daysFromNow(200),
    regulatoryBody: "MINAM - Ministerio del Ambiente",
    impactAreas: ["Seguridad de Baterías", "Certificación", "Etiquetado"],
    legislationType: "bill",
    legislativeCategory: "pending",
    localTerminology: "Proyecto de Ley",
    timeline: getPeruBillTimeline(3)
  },
  {
    id: "pe-oefa-recycle-2024",
    title: "Norma de Responsabilidad Extendida del Productor para Baterías",
    summary: "OEFA implementa programa de reciclaje obligatorio para productos con baterías recargables.",
    bullets: [
      "Programa de retorno obligatorio para fabricantes",
      "Puntos de recolección en puntos de venta",
      "Reportes anuales de reciclaje al OEFA"
    ],
    status: "Vigente",
    jurisdiction: "Peru",
    riskLevel: "medium",
    riskScore: 55,
    category: "Regulaciones de Baterías",
    regulatoryCategory: "Baterías",
    publishedDate: daysAgo(120),
    effectiveDate: daysAgo(60),
    regulatoryBody: "OEFA - Organismo de Evaluación y Fiscalización Ambiental",
    impactAreas: ["Reciclaje", "Responsabilidad del Productor", "Reportes"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "Resolución de Consejo Directivo"
  },
  // FOOD CONTACT MATERIAL
  {
    id: "pe-digesa-fcm-2024",
    title: "Reglamento Sanitario de Materiales en Contacto con Alimentos",
    summary: "DIGESA actualiza requisitos para materiales que entran en contacto con alimentos y bebidas en electrodomésticos.",
    bullets: [
      "Prohibición de PFAS en superficies de contacto con alimentos",
      "Límites de migración para metales pesados en elementos calefactores",
      "Certificación sanitaria obligatoria para nuevos productos"
    ],
    status: "En Comisión",
    jurisdiction: "Peru",
    riskLevel: "high",
    riskScore: 88,
    category: "Materiales en Contacto con Alimentos",
    regulatoryCategory: "Materiales en Contacto con Alimentos",
    publishedDate: daysAgo(10),
    complianceDeadline: daysFromNow(300),
    regulatoryBody: "DIGESA - Dirección General de Salud Ambiental",
    impactAreas: ["Materiales", "Ensayos", "Certificación"],
    legislationType: "bill",
    legislativeCategory: "pending",
    localTerminology: "Proyecto de Ley",
    timeline: getPeruBillTimeline(1)
  },
  {
    id: "pe-sanipes-beverage-2024",
    title: "Norma Técnica para Equipos de Preparación de Bebidas Calientes",
    summary: "SANIPES establece requisitos específicos para materiales en cafeteras y hervidores.",
    bullets: [
      "Ensayos de migración con agua a 100°C obligatorios",
      "Materiales aprobados para contacto con café y té",
      "Requisitos de limpieza y mantenimiento en manual de usuario"
    ],
    status: "Vigente",
    jurisdiction: "Peru",
    riskLevel: "medium",
    riskScore: 62,
    category: "Materiales en Contacto con Alimentos",
    regulatoryCategory: "Materiales en Contacto con Alimentos",
    publishedDate: daysAgo(75),
    effectiveDate: daysAgo(20),
    regulatoryBody: "SANIPES - Organismo Nacional de Sanidad Pesquera",
    impactAreas: ["Materiales", "Documentación", "Cumplimiento"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "Norma Técnica"
  }
];

// Costa Rica Legislation (in InternationalLegislation format for WorldMap)
export const costaRicaLegislation: InternationalLegislation[] = [
  {
    id: "cr-cib-2024-001",
    title: "Proyecto de Ley de Ciberseguridad Nacional",
    summary: "Marco jurídico para protección de infraestructura crítica digital y coordinación ante incidentes cibernéticos.",
    bullets: [
      "Creación de la Agencia Nacional de Ciberseguridad",
      "Reporte obligatorio de incidentes en 72 horas",
      "Certificación obligatoria para proveedores críticos"
    ],
    status: "En Comisión",
    jurisdiction: "Costa Rica",
    riskLevel: "high",
    riskScore: 88,
    category: "Ciberseguridad",
    regulatoryCategory: "Ciberseguridad",
    publishedDate: daysAgo(90),
    complianceDeadline: daysFromNow(365),
    regulatoryBody: "MICIT",
    impactAreas: ["Software", "Seguridad", "Certificación"],
    legislationType: "bill",
    legislativeCategory: "pending",
    localTerminology: "Proyecto de Ley"
  },
  {
    id: "cr-sutel-rf-2024",
    title: "Reglamento de Equipos de Radiofrecuencia para Dispositivos IoT",
    summary: "SUTEL actualiza requisitos de homologación para dispositivos inalámbricos conectados.",
    bullets: [
      "Homologación obligatoria para WiFi 6E y 6 GHz",
      "Límites de emisión actualizados según ITU-R",
      "Etiquetado obligatorio con número de homologación"
    ],
    status: "Vigente",
    jurisdiction: "Costa Rica",
    riskLevel: "high",
    riskScore: 82,
    category: "Regulaciones de Radio",
    regulatoryCategory: "Regulaciones de Radio",
    publishedDate: daysAgo(30),
    effectiveDate: daysAgo(5),
    regulatoryBody: "SUTEL",
    impactAreas: ["Inalámbrico", "Certificación", "Etiquetado"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "Reglamento"
  },
  {
    id: "cr-meic-safety-2024",
    title: "Reglamento Técnico de Seguridad para Electrodomésticos",
    summary: "MEIC establece requisitos de seguridad para aparatos eléctricos de uso doméstico.",
    bullets: [
      "Certificación obligatoria antes de comercialización",
      "Requisitos de protección térmica y eléctrica",
      "Apagado automático para aparatos de calentamiento"
    ],
    status: "En Consulta",
    jurisdiction: "Costa Rica",
    riskLevel: "high",
    riskScore: 85,
    category: "Seguridad del Producto",
    regulatoryCategory: "Seguridad del Producto",
    publishedDate: daysAgo(20),
    complianceDeadline: daysFromNow(180),
    regulatoryBody: "MEIC",
    impactAreas: ["Seguridad del Producto", "Certificación", "Manufactura"],
    legislationType: "bill",
    legislativeCategory: "pending",
    localTerminology: "Proyecto de Reglamento"
  },
  {
    id: "cr-minsa-fcm-2024",
    title: "Norma Sanitaria para Materiales en Contacto con Alimentos",
    summary: "MINSA actualiza requisitos para materiales que entran en contacto con alimentos y bebidas.",
    bullets: [
      "Prohibición de PFAS en superficies de contacto alimentario",
      "Límites de migración para metales pesados",
      "Registro sanitario obligatorio para productos importados"
    ],
    status: "Vigente",
    jurisdiction: "Costa Rica",
    riskLevel: "medium",
    riskScore: 72,
    category: "Materiales en Contacto con Alimentos",
    regulatoryCategory: "Materiales en Contacto con Alimentos",
    publishedDate: daysAgo(60),
    effectiveDate: daysAgo(15),
    regulatoryBody: "MINSA",
    impactAreas: ["Materiales", "Ensayos", "Registro"],
    legislationType: "regulation",
    legislativeCategory: "enacted",
    localTerminology: "Norma Técnica"
  },
  {
    id: "cr-minaet-battery-2024",
    title: "Ley de Gestión Integral de Residuos de Baterías",
    summary: "Regulación para manejo y reciclaje de baterías en productos electrónicos de consumo.",
    bullets: [
      "Responsabilidad extendida del productor",
      "Programa de recolección obligatorio para importadores",
      "Metas de reciclaje anuales"
    ],
    status: "Primer Debate",
    jurisdiction: "Costa Rica",
    riskLevel: "medium",
    riskScore: 68,
    category: "Regulaciones de Baterías",
    regulatoryCategory: "Baterías",
    publishedDate: daysAgo(45),
    complianceDeadline: daysFromNow(270),
    regulatoryBody: "MINAE",
    impactAreas: ["Reciclaje", "Responsabilidad del Productor", "Cumplimiento"],
    legislationType: "bill",
    legislativeCategory: "pending",
    localTerminology: "Proyecto de Ley"
  }
];

// Split GCC by country for dashboard - with unique IDs
export const uaeLegislation = gccLegislation.filter(l => l.jurisdiction === "UAE");
export const saudiLegislation = gccLegislation.filter(l => l.jurisdiction === "Saudi Arabia");
export const omanLegislation = omanLegislationData;
export const kuwaitLegislation = kuwaitLegislationData;
export const bahrainLegislation = bahrainLegislationData;
export const qatarLegislation = qatarLegislationData;

// Split EU for dashboard tabs
export const euDirectives = euRegulations.filter(l => l.legislationType === "directive" || l.title.toLowerCase().includes("directive"));
export const euParliament = euRegulations.filter(l => l.status.includes("Parliament"));
export const euCouncil = euRegulations.filter(l => l.status.includes("Council"));

// Combine all international legislation
export const allInternationalLegislation: InternationalLegislation[] = [
  ...usStateBills,
  ...canadaLegislation,
  ...japanLegislation,
  ...koreaLegislation,
  ...taiwanLegislation,
  ...euRegulations,
  ...gccLegislation,
  ...peruLegislation,
  ...costaRicaLegislation
];

// Export filter helper
export function filterByLegislativeCategory(
  legislation: InternationalLegislation[],
  category: LegislativeCategory | "all"
): InternationalLegislation[] {
  if (category === "all") return legislation;
  return legislation.filter(l => l.legislativeCategory === category);
}

// Export regulatory categories for filtering
export const REGULATORY_CATEGORIES: RegulatoryCategory[] = [
  "Radio",
  "Product Safety",
  "Cybersecurity",
  "Battery",
  "Food Contact Material"
];

// Spanish regulatory categories for LATAM jurisdictions
export const REGULATORY_CATEGORIES_ES: Record<string, string> = {
  "Radio": "Regulaciones de Radio",
  "Radio Regulations": "Regulaciones de Radio",
  "Product Safety": "Seguridad del Producto",
  "Cybersecurity": "Ciberseguridad",
  "Battery": "Baterías",
  "Battery Regulations": "Regulaciones de Baterías",
  "Food Contact Material": "Materiales en Contacto con Alimentos"
};

// Spanish risk levels for LATAM jurisdictions
export const RISK_LEVELS_ES: Record<string, string> = {
  "high": "Alto",
  "medium": "Medio",
  "low": "Bajo"
};

// Spanish impact areas for LATAM jurisdictions
export const IMPACT_AREAS_ES: Record<string, string> = {
  "Wireless": "Inalámbrico",
  "Certification": "Certificación",
  "Labeling": "Etiquetado",
  "IoT": "IoT",
  "Registration": "Registro",
  "Connectivity": "Conectividad",
  "Product Safety": "Seguridad del Producto",
  "Manufacturing": "Manufactura",
  "Standards": "Estándares",
  "Testing": "Ensayos",
  "Compliance": "Cumplimiento",
  "Software": "Software",
  "Security": "Seguridad",
  "Firmware": "Firmware",
  "Data Security": "Seguridad de Datos",
  "Encryption": "Cifrado",
  "Authentication": "Autenticación",
  "Battery Safety": "Seguridad de Baterías",
  "Recycling": "Reciclaje",
  "Producer Responsibility": "Responsabilidad del Productor",
  "Reporting": "Reportes",
  "Materials": "Materiales",
  "Documentation": "Documentación"
};
