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

// Extended mock data with rich content similar to real Congress bills
export interface ExtendedUSLegislationItem extends USLegislationItem {
  overview?: string;
  fullText?: string;
  sponsors?: Array<{ name: string; party: string; state: string }>;
  cosponsors?: Array<{ name: string; party: string; state: string }>;
  committees?: string[];
  actions?: Array<{ date: string; text: string; type: string }>;
  subjects?: string[];
  relatedBills?: Array<{ id: string; title: string; relationship: string }>;
  costEstimate?: { amount: string; source: string };
}

// Comprehensive USA legislation mock data including all document types
export const usaLegislationData: ExtendedUSLegislationItem[] = [
  // ========== FEDERAL BILLS (Pipeline) ==========
  {
    id: "hr-2024-1234",
    title: "Smart Appliance Safety Act of 2024",
    summary: "Federal bill to establish nationwide safety standards for IoT-enabled kitchen appliances including smart kettles, espresso machines, and connected cooking devices.",
    overview: "This legislation aims to address the growing safety concerns surrounding internet-connected kitchen appliances. As smart home technology becomes increasingly prevalent in American households, the need for comprehensive federal safety standards has become critical. The bill establishes mandatory cybersecurity requirements, auto-shutoff mechanisms, and consumer notification protocols for all IoT-enabled kitchen appliances sold in the United States.",
    bullets: [
      "Mandatory cybersecurity standards for connected appliances",
      "Auto-shutoff requirements for heating devices",
      "Consumer notification requirements for firmware updates",
      "Incident reporting database for safety issues"
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
    regulatoryBody: "U.S. House of Representatives",
    impactAreas: ["Product Safety", "Cybersecurity", "Manufacturing"],
    status: "In Committee",
    localTerminology: "H.R. 1234",
    sponsors: [
      { name: "Rep. Jane Smith", party: "D", state: "CA" }
    ],
    cosponsors: [
      { name: "Rep. John Davis", party: "R", state: "TX" },
      { name: "Rep. Maria Garcia", party: "D", state: "FL" },
      { name: "Rep. Robert Chen", party: "D", state: "NY" }
    ],
    committees: ["House Energy and Commerce Committee", "Subcommittee on Consumer Protection"],
    actions: [
      { date: daysAgo(30), text: "Introduced in House", type: "introduced" },
      { date: daysAgo(25), text: "Referred to the House Committee on Energy and Commerce", type: "referral" },
      { date: daysAgo(15), text: "Referred to the Subcommittee on Consumer Protection and Commerce", type: "referral" }
    ],
    subjects: ["Consumer protection", "Product safety", "Cybersecurity", "Internet of Things", "Kitchen appliances"],
    costEstimate: { amount: "$45 million over 5 years", source: "Congressional Budget Office" }
  },
  {
    id: "s-2024-567",
    title: "Consumer IoT Cybersecurity Enhancement Act",
    summary: "Senate bill requiring minimum cybersecurity standards for all consumer IoT devices including smart kitchen appliances.",
    overview: "This comprehensive legislation addresses the critical need for baseline cybersecurity requirements in consumer Internet of Things devices. With millions of vulnerable IoT devices in American homes, this bill establishes a framework for secure-by-design principles, mandatory security updates, and vulnerability disclosure programs.",
    bullets: [
      "Unique passwords required - no default credentials",
      "Vulnerability disclosure program mandatory",
      "5-year security update support requirement",
      "Third-party security audit requirements"
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
    localTerminology: "S. 567",
    sponsors: [
      { name: "Sen. Michael Johnson", party: "R", state: "WI" }
    ],
    cosponsors: [
      { name: "Sen. Elizabeth Warren", party: "D", state: "MA" },
      { name: "Sen. Ted Cruz", party: "R", state: "TX" }
    ],
    committees: ["Senate Commerce, Science, and Transportation Committee"],
    actions: [
      { date: daysAgo(20), text: "Introduced in Senate", type: "introduced" },
      { date: daysAgo(15), text: "Read twice and referred to the Committee on Commerce, Science, and Transportation", type: "referral" },
      { date: daysAgo(5), text: "Committee on Commerce, Science, and Transportation. Hearings held", type: "hearing" }
    ],
    subjects: ["Cybersecurity", "Consumer electronics", "Data protection", "Software security"]
  },
  {
    id: "hr-2024-890",
    title: "Wireless Kitchen Appliance Standards Act",
    summary: "Bill to update FCC requirements for RF emissions from smart kitchen devices including WiFi-enabled kettles and espresso machines.",
    overview: "This legislation modernizes FCC regulations to address the proliferation of wireless-enabled kitchen appliances operating in the 2.4 GHz, 5 GHz, and new 6 GHz frequency bands. The bill ensures that smart kitchen devices meet updated electromagnetic compatibility requirements while minimizing interference with other household electronics.",
    bullets: [
      "WiFi 6E frequency band testing requirements",
      "Bluetooth Low Energy interference standards",
      "EMC compliance updates for kitchen environments",
      "Updated labeling requirements for wireless devices"
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
    localTerminology: "H.R. 890",
    sponsors: [
      { name: "Rep. Anna Eshoo", party: "D", state: "CA" }
    ],
    committees: ["House Energy and Commerce Committee"],
    actions: [
      { date: daysAgo(15), text: "Introduced in House", type: "introduced" },
      { date: daysAgo(10), text: "Referred to the Committee on Energy and Commerce", type: "referral" }
    ],
    subjects: ["Wireless communications", "Radio frequency", "FCC regulations", "Kitchen appliances"]
  },

  // ========== FEDERAL STATUTES (In Force) ==========
  {
    id: "pl-118-45",
    title: "Consumer Product Safety Improvement Act Amendment",
    summary: "Enacted law strengthening CPSC authority over electrical household appliances including smart kettles and espresso machines.",
    overview: "This amendment to the Consumer Product Safety Act significantly expands the Consumer Product Safety Commission's authority over electrical household appliances. It establishes new mandatory safety standards, enhances recall procedures, and increases civil penalties for violations. The law specifically addresses risks associated with heating appliances and connected kitchen devices.",
    bullets: [
      "Enhanced mandatory recall authority",
      "Increased civil penalties for violations up to $100,000 per violation",
      "New testing laboratory accreditation requirements",
      "Mandatory incident reporting within 24 hours"
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
    localTerminology: "P.L. 118-45",
    actions: [
      { date: daysAgo(180), text: "Signed by President", type: "enacted" },
      { date: daysAgo(60), text: "Effective date", type: "effective" }
    ],
    subjects: ["Consumer protection", "Product safety", "CPSC", "Electrical appliances"]
  },
  {
    id: "pl-118-67",
    title: "IoT Device Security Act of 2024",
    summary: "Federal law establishing baseline security requirements for connected devices sold in the United States.",
    overview: "This landmark legislation establishes the first comprehensive federal framework for IoT device security. Building on the NIST Cybersecurity Framework, the law requires manufacturers to implement baseline security features, provide security update support, and participate in vulnerability coordination programs. The law has significant implications for smart home appliance manufacturers.",
    bullets: [
      "NIST compliance framework adoption mandatory",
      "Security labeling requirements similar to Energy Star",
      "Procurement restrictions for non-compliant devices in federal contracts",
      "Minimum 3-year security support requirement"
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
    localTerminology: "P.L. 118-67",
    actions: [
      { date: daysAgo(120), text: "Signed by President", type: "enacted" },
      { date: daysAgo(30), text: "Effective date", type: "effective" }
    ],
    subjects: ["Cybersecurity", "IoT", "Federal procurement", "Security standards"]
  },

  // ========== FEDERAL REGULATIONS (In Force & Pipeline) ==========
  {
    id: "fcc-24-101",
    title: "FCC Part 15 Updates - Smart Home Devices",
    summary: "Updated radio frequency emission limits for IoT-enabled home appliances including smart kettles operating on WiFi 6E.",
    overview: "The Federal Communications Commission has updated Part 15 of its rules to address the growing number of smart home devices operating in the 6 GHz band. These updates establish new emission limits, testing procedures, and labeling requirements specifically for kitchen appliances with wireless connectivity. Manufacturers must ensure compliance before the effective date.",
    bullets: [
      "New emission limits for 5.925-7.125 GHz band (WiFi 6E)",
      "Updated testing procedures for multi-radio devices",
      "Revised labeling requirements with QR codes",
      "Coexistence requirements with incumbent services"
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
    localTerminology: "47 CFR Part 15",
    actions: [
      { date: daysAgo(180), text: "Notice of Proposed Rulemaking issued", type: "nprm" },
      { date: daysAgo(120), text: "Comment period closed", type: "comment" },
      { date: daysAgo(90), text: "Final Rule published", type: "final" },
      { date: daysAgo(10), text: "Effective date", type: "effective" }
    ]
  },
  {
    id: "fda-24-fcm-001",
    title: "FDA Food Contact Materials Update - Heating Appliances",
    summary: "Updated standards for materials in contact with food in heating appliances such as electric kettles and espresso machines.",
    overview: "The Food and Drug Administration has revised its food contact material regulations to address new concerns about chemical migration from heating appliances. The update includes new testing protocols for hot beverage applications, updated restrictions on PFAS compounds, and stricter limits on heavy metals in heating elements. These requirements are particularly relevant for smart kettle and espresso machine manufacturers.",
    bullets: [
      "New migration testing requirements for hot beverages (>90°C)",
      "Updated PFAS restrictions - complete phase-out by 2026",
      "Heavy metal limits for heating elements reduced by 50%",
      "Required testing by FDA-recognized laboratories"
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
    localTerminology: "21 CFR 177",
    actions: [
      { date: daysAgo(120), text: "Proposed Rule published", type: "nprm" },
      { date: daysAgo(90), text: "Public comment period", type: "comment" },
      { date: daysAgo(60), text: "Final Rule published", type: "final" },
      { date: daysAgo(15), text: "Effective date", type: "effective" }
    ]
  },
  {
    id: "cpsc-24-draft-001",
    title: "CPSC Proposed Rule - Electric Kettle Safety Standards",
    summary: "Draft regulation for enhanced safety requirements for electric kettles sold in the United States.",
    overview: "The Consumer Product Safety Commission is proposing comprehensive safety standards specifically for electric kettles. Following a series of incidents involving overheating and thermal burns, the proposed rule establishes mandatory auto-shutoff timing, thermal protection requirements, and child safety features. This regulation would significantly impact smart kettle manufacturers.",
    bullets: [
      "Proposed thermal protection requirements (max 100°C external surface)",
      "Draft auto-shutoff timing standards (5 minutes after boiling)",
      "Suggested child safety lock requirements",
      "Cord length and strain relief specifications"
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
    localTerminology: "NPRM",
    actions: [
      { date: daysAgo(30), text: "Notice of Proposed Rulemaking published", type: "nprm" },
      { date: daysFromNow(30), text: "Comment period closes", type: "comment" }
    ]
  },
  {
    id: "epa-24-battery-001",
    title: "EPA Lithium Battery Disposal Requirements",
    summary: "Proposed EPA rule for safe disposal of lithium batteries in consumer products including smart kitchen appliances.",
    overview: "The Environmental Protection Agency is proposing new regulations for the disposal and recycling of lithium batteries used in consumer products. Smart kitchen appliances with integrated batteries, including wireless kettles and portable espresso machines, would be subject to these requirements. The rule establishes producer responsibility programs and consumer education mandates.",
    bullets: [
      "Producer responsibility requirements for battery take-back",
      "Recycling program mandates with 50% recovery targets",
      "Labeling requirements for battery disposal instructions",
      "Retailer collection point requirements"
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
    localTerminology: "NPRM",
    actions: [
      { date: daysAgo(45), text: "Notice of Proposed Rulemaking published", type: "nprm" },
      { date: daysFromNow(15), text: "Public hearing scheduled", type: "hearing" }
    ]
  },

  // ========== TREATIES (In Force & Pipeline) ==========
  {
    id: "treaty-us-eu-2024",
    title: "US-EU Mutual Recognition Agreement - Appliance Standards",
    summary: "Treaty enabling mutual recognition of product safety certifications between US and EU for household appliances.",
    overview: "This executive agreement between the United States and European Union establishes mutual recognition of certain product safety certifications for household appliances. Under this agreement, products certified to UL standards may be recognized for CE marking purposes and vice versa for specified categories of kitchen appliances. This significantly streamlines market access for smart kettle and espresso machine manufacturers.",
    bullets: [
      "UL/CE mutual recognition for certain categories",
      "Simplified import/export procedures",
      "Joint testing laboratory accreditation",
      "Harmonized conformity assessment procedures"
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
    summary: "Proposed annex to USMCA addressing cybersecurity standards for IoT devices across North America.",
    overview: "This proposed annex to the United States-Mexico-Canada Agreement would establish harmonized cybersecurity requirements for connected devices sold across North America. The annex aims to create a unified framework for IoT security, facilitating cross-border trade while maintaining high security standards for consumer devices including smart kitchen appliances.",
    bullets: [
      "Harmonized security requirements across North America",
      "Cross-border data flow provisions for device telemetry",
      "Mutual vulnerability disclosure framework",
      "Unified security labeling program"
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
    summary: "California bill requiring enhanced safety and cybersecurity for smart appliances sold in the state.",
    overview: "This California state bill establishes the nation's most comprehensive requirements for smart home appliances. Building on California's tradition of consumer protection leadership, the bill requires state-level cybersecurity certification, privacy disclosures, and right-to-repair provisions for all internet-connected kitchen appliances sold in California.",
    bullets: [
      "State-level cybersecurity certification requirement",
      "Privacy disclosure requirements at point of sale",
      "Right to repair provisions - parts availability for 7 years",
      "Data minimization requirements"
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
    localTerminology: "SB 1001",
    sponsors: [
      { name: "Sen. Scott Wiener", party: "D", state: "CA" }
    ],
    committees: ["Senate Judiciary Committee", "Senate Appropriations Committee"]
  },
  {
    id: "ca-prop-65-update",
    title: "California Prop 65 Update - Kitchen Appliances",
    summary: "Updated Prop 65 warning requirements for heating appliances including electric kettles and espresso machines.",
    overview: "California's Office of Environmental Health Hazard Assessment has updated Proposition 65 requirements specifically for kitchen heating appliances. The update includes new warning label formats, updated chemical exposure limits based on recent scientific data, and requirements for digital disclosure via QR codes on product packaging.",
    bullets: [
      "New warning label format with standardized iconography",
      "Updated chemical exposure limits for lead and cadmium",
      "Digital disclosure requirements via QR codes",
      "Short-form warning options for small products"
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
    summary: "Bill requiring enhanced safety standards for consumer electronics including smart kitchen appliances sold in NY.",
    overview: "This New York State Assembly bill would establish comprehensive safety requirements for consumer electronics sold in New York. The bill mandates UL certification for all electrical appliances, enhanced ground fault protection, and creation of a state product registry. Smart kettles and espresso machines would be specifically covered.",
    bullets: [
      "UL certification requirement for all electrical appliances",
      "Enhanced ground fault protection standards",
      "State product registry with annual renewal",
      "Mandatory safety testing by NY-accredited labs"
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
    localTerminology: "A.B. 5678",
    sponsors: [
      { name: "Asm. Jessica González-Rojas", party: "D", state: "NY" }
    ]
  },
  {
    id: "tx-sb-2024-234",
    title: "Texas RF Emissions Standards",
    summary: "State bill for wireless device emission standards in Texas affecting smart kitchen appliances.",
    overview: "This Texas Senate bill addresses concerns about radio frequency emissions from consumer electronics. While the FCC maintains primary jurisdiction over RF emissions, this bill establishes additional state-level documentation and disclosure requirements for wireless devices sold in Texas, including smart kitchen appliances.",
    bullets: [
      "State RF compliance documentation requirements",
      "Consumer disclosure requirements at point of sale",
      "Interference protection standards for medical devices",
      "Annual compliance reporting to state authority"
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
    localTerminology: "S.B. 234",
    sponsors: [
      { name: "Sen. Bryan Hughes", party: "R", state: "TX" }
    ]
  },

  // ========== LOCAL ORDINANCES ==========
  {
    id: "sf-ord-2024-101",
    title: "San Francisco Smart Device Privacy Ordinance",
    summary: "City ordinance requiring privacy disclosures for connected devices sold in San Francisco.",
    overview: "The San Francisco Board of Supervisors has enacted an ordinance requiring comprehensive privacy disclosures for all internet-connected devices sold within city limits. The ordinance mandates disclosure of data collection practices at point of sale, opt-out requirements for data sharing, and a local privacy certification program for smart home devices including kitchen appliances.",
    bullets: [
      "Data collection disclosure at point of sale (signage required)",
      "Opt-out requirements for data sharing with third parties",
      "Local privacy certification program",
      "Annual reporting to city authority"
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
    summary: "New York City ordinance for lithium battery safety in consumer products including cordless kitchen appliances.",
    overview: "Following a series of lithium battery fires in New York City, the City Council has enacted comprehensive safety requirements for products containing lithium batteries. The ordinance establishes fire safety certification requirements, retail storage standards, and consumer education mandates. Cordless smart kitchen appliances are specifically covered.",
    bullets: [
      "Fire safety certification for battery devices (UL 2054)",
      "Retail storage requirements (fireproof cabinets for inventory)",
      "Consumer safety education mandate (in-store signage)",
      "Incident reporting to FDNY within 24 hours"
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
    summary: "City ordinance requiring energy efficiency disclosure for electrical appliances including smart kettles.",
    overview: "The Los Angeles City Council has enacted an ordinance requiring energy efficiency disclosures for electrical appliances sold in the city. The ordinance mandates Energy Star equivalent certification, point of sale energy cost disclosure, and efficiency rating display requirements. Smart kettles and espresso machines are included in the covered product categories.",
    bullets: [
      "Energy Star equivalent certification required",
      "Point of sale energy cost disclosure (lifetime cost estimate)",
      "Efficiency rating display requirements (A-G scale)",
      "Annual compliance audit by LA DWP"
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