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
  // ========== RECENT (1-7 days ago) ==========
  {
    id: "hr-2024-7801",
    title: "Smart Kitchen Appliance Modernization Act",
    summary: "Federal bill to update safety certification requirements for modern smart kitchen appliances with integrated AI features.",
    overview: "This legislation modernizes the regulatory framework for AI-enabled kitchen appliances, addressing emerging safety concerns.",
    bullets: [
      "AI transparency requirements for appliance firmware",
      "Updated EMC testing for smart features",
      "Consumer notification protocols for software updates"
    ],
    documentType: "bill",
    authority: "congress",
    jurisdiction: "USA",
    riskLevel: "high",
    riskScore: 84,
    regulatoryCategory: "Product Safety",
    publishedDate: daysAgo(2),
    complianceDeadline: daysFromNow(365),
    isInForce: false,
    isPipeline: true,
    regulatoryBody: "U.S. House of Representatives",
    impactAreas: ["Product Safety", "AI", "Manufacturing"],
    status: "Introduced",
    localTerminology: "H.R. 7801",
    sponsors: [{ name: "Rep. Nancy Chen", party: "D", state: "CA" }],
    committees: ["House Energy and Commerce Committee"],
    actions: [
      { date: daysAgo(2), text: "Introduced in House", type: "introduced" }
    ],
    subjects: ["Consumer protection", "Artificial Intelligence", "Kitchen appliances"]
  },
  {
    id: "fcc-24-189",
    title: "FCC WiFi 7 Certification Framework Update",
    summary: "New certification requirements for WiFi 7 enabled consumer appliances.",
    overview: "The FCC establishes technical requirements for the next generation WiFi standard in consumer devices.",
    bullets: [
      "WiFi 7 (802.11be) testing protocols",
      "Multi-link operation compliance",
      "6 GHz band utilization requirements"
    ],
    documentType: "regulation",
    authority: "federal-agency",
    jurisdiction: "USA",
    agencyName: "Federal Communications Commission",
    riskLevel: "high",
    riskScore: 79,
    regulatoryCategory: "Radio",
    publishedDate: daysAgo(3),
    effectiveDate: daysFromNow(90),
    isInForce: false,
    isPipeline: true,
    regulatoryBody: "FCC",
    impactAreas: ["Wireless", "Testing", "Certification"],
    status: "Proposed Rule",
    localTerminology: "FCC 24-189",
    actions: [
      { date: daysAgo(3), text: "Notice of Proposed Rulemaking issued", type: "nprm" }
    ]
  },
  {
    id: "cpsc-24-alert-kettle",
    title: "CPSC Safety Alert - Smart Kettle Thermal Sensors",
    summary: "Mandatory reporting requirement for thermal sensor failures in smart kettles.",
    overview: "CPSC issues mandatory reporting requirements following thermal sensor incidents.",
    bullets: [
      "Mandatory incident reporting within 24 hours",
      "Thermal sensor calibration requirements",
      "Consumer notification protocols"
    ],
    documentType: "regulation",
    authority: "federal-agency",
    jurisdiction: "USA",
    agencyName: "Consumer Product Safety Commission",
    riskLevel: "high",
    riskScore: 88,
    regulatoryCategory: "Product Safety",
    publishedDate: daysAgo(4),
    effectiveDate: daysAgo(4),
    isInForce: true,
    isPipeline: false,
    regulatoryBody: "CPSC",
    impactAreas: ["Product Safety", "Reporting", "Manufacturing"],
    status: "In Force",
    localTerminology: "CPSC Alert",
    actions: [
      { date: daysAgo(4), text: "Safety Alert issued", type: "effective" }
    ]
  },
  {
    id: "s-2024-4521",
    title: "Consumer IoT Privacy Enhancement Act",
    summary: "Senate bill to strengthen privacy protections for IoT device users.",
    overview: "Comprehensive privacy framework for connected home devices.",
    bullets: [
      "Data minimization requirements",
      "Opt-out rights for data collection",
      "Privacy labeling requirements"
    ],
    documentType: "bill",
    authority: "congress",
    jurisdiction: "USA",
    riskLevel: "medium",
    riskScore: 72,
    regulatoryCategory: "Cybersecurity",
    publishedDate: daysAgo(5),
    complianceDeadline: daysFromNow(540),
    isInForce: false,
    isPipeline: true,
    regulatoryBody: "U.S. Senate",
    impactAreas: ["Privacy", "Data Protection", "Labeling"],
    status: "Introduced",
    localTerminology: "S. 4521",
    sponsors: [{ name: "Sen. Maria Lopez", party: "D", state: "NM" }],
    committees: ["Senate Commerce, Science, and Transportation Committee"],
    actions: [
      { date: daysAgo(5), text: "Introduced in Senate", type: "introduced" }
    ],
    subjects: ["Privacy", "IoT", "Consumer protection"]
  },
  {
    id: "fda-24-fcm-hotbev",
    title: "FDA Hot Beverage Appliance Material Standards",
    summary: "Updated migration testing requirements for hot beverage appliances.",
    overview: "FDA revises material safety requirements for appliances used in hot beverage preparation.",
    bullets: [
      "New migration limits at 100°C",
      "PFAS-free requirements for seals",
      "Heavy metal limits for heating coils"
    ],
    documentType: "regulation",
    authority: "federal-agency",
    jurisdiction: "USA",
    agencyName: "Food and Drug Administration",
    riskLevel: "high",
    riskScore: 86,
    regulatoryCategory: "Food Contact Material",
    publishedDate: daysAgo(6),
    effectiveDate: daysFromNow(180),
    isInForce: false,
    isPipeline: true,
    regulatoryBody: "FDA",
    impactAreas: ["Materials", "Testing", "Manufacturing"],
    status: "Proposed Rule",
    localTerminology: "21 CFR 177 Amendment",
    actions: [
      { date: daysAgo(6), text: "Proposed Rule published", type: "nprm" }
    ]
  },
  {
    id: "epa-24-battery-transport",
    title: "EPA Lithium Battery Transportation Safety Update",
    summary: "Updated requirements for transportation of lithium batteries in consumer products.",
    overview: "EPA aligns battery transportation requirements with international standards.",
    bullets: [
      "UN 38.3 testing requirements",
      "Packaging requirements update",
      "Documentation standards"
    ],
    documentType: "regulation",
    authority: "federal-agency",
    jurisdiction: "USA",
    agencyName: "Environmental Protection Agency",
    riskLevel: "medium",
    riskScore: 68,
    regulatoryCategory: "Battery",
    publishedDate: daysAgo(7),
    effectiveDate: daysAgo(7),
    isInForce: true,
    isPipeline: false,
    regulatoryBody: "EPA",
    impactAreas: ["Battery", "Transportation", "Documentation"],
    status: "In Force",
    localTerminology: "EPA Rule",
    actions: [
      { date: daysAgo(7), text: "Final Rule effective", type: "effective" }
    ]
  },

  // ========== RECENT (8-14 days ago) ==========
  {
    id: "hr-2024-7456",
    title: "Appliance Cybersecurity Certification Act",
    summary: "Requires third-party cybersecurity certification for connected kitchen appliances.",
    overview: "Establishes mandatory third-party security assessment requirements.",
    bullets: [
      "Third-party security audit requirements",
      "Vulnerability disclosure timelines",
      "Security update support periods"
    ],
    documentType: "bill",
    authority: "congress",
    jurisdiction: "USA",
    riskLevel: "high",
    riskScore: 82,
    regulatoryCategory: "Cybersecurity",
    publishedDate: daysAgo(8),
    complianceDeadline: daysFromNow(365),
    isInForce: false,
    isPipeline: true,
    regulatoryBody: "U.S. House of Representatives",
    impactAreas: ["Security", "Certification", "Software"],
    status: "In Committee",
    localTerminology: "H.R. 7456",
    sponsors: [{ name: "Rep. James Park", party: "R", state: "TX" }],
    committees: ["House Energy and Commerce Committee"],
    actions: [
      { date: daysAgo(8), text: "Introduced in House", type: "introduced" },
      { date: daysAgo(5), text: "Referred to Committee", type: "referral" }
    ],
    subjects: ["Cybersecurity", "Consumer electronics", "Certification"]
  },
  {
    id: "fcc-24-ble-update",
    title: "FCC Bluetooth Low Energy Standards Update",
    summary: "Updated technical requirements for BLE-enabled consumer devices.",
    overview: "Modernizes BLE certification requirements for smart home devices.",
    bullets: [
      "BLE 5.3 compliance requirements",
      "Coexistence testing updates",
      "Power output limits"
    ],
    documentType: "regulation",
    authority: "federal-agency",
    jurisdiction: "USA",
    agencyName: "Federal Communications Commission",
    riskLevel: "medium",
    riskScore: 65,
    regulatoryCategory: "Radio",
    publishedDate: daysAgo(10),
    effectiveDate: daysAgo(10),
    isInForce: true,
    isPipeline: false,
    regulatoryBody: "FCC",
    impactAreas: ["Wireless", "Testing", "Certification"],
    status: "In Force",
    localTerminology: "47 CFR Part 15 Amendment",
    actions: [
      { date: daysAgo(10), text: "Final Rule effective", type: "effective" }
    ]
  },
  {
    id: "s-2024-4234",
    title: "Smart Home Device Interoperability Act",
    summary: "Requires smart home devices to support Matter protocol for interoperability.",
    overview: "Promotes device interoperability through standardized protocols.",
    bullets: [
      "Matter protocol support requirements",
      "Interoperability testing standards",
      "Consumer disclosure requirements"
    ],
    documentType: "bill",
    authority: "congress",
    jurisdiction: "USA",
    riskLevel: "medium",
    riskScore: 58,
    regulatoryCategory: "Product Safety",
    publishedDate: daysAgo(11),
    complianceDeadline: daysFromNow(730),
    isInForce: false,
    isPipeline: true,
    regulatoryBody: "U.S. Senate",
    impactAreas: ["Interoperability", "Standards", "Consumer"],
    status: "Introduced",
    localTerminology: "S. 4234",
    sponsors: [{ name: "Sen. Robert Kim", party: "D", state: "WA" }],
    committees: ["Senate Commerce Committee"],
    actions: [
      { date: daysAgo(11), text: "Introduced in Senate", type: "introduced" }
    ],
    subjects: ["Smart home", "Interoperability", "Standards"]
  },
  {
    id: "cpsc-24-espresso-safety",
    title: "CPSC Espresso Machine Pressure Safety Standards",
    summary: "Updated pressure vessel safety requirements for home espresso machines.",
    overview: "New safety standards address pressure-related hazards in espresso machines.",
    bullets: [
      "Pressure relief valve requirements",
      "Boiler testing standards",
      "Warning label requirements"
    ],
    documentType: "regulation",
    authority: "federal-agency",
    jurisdiction: "USA",
    agencyName: "Consumer Product Safety Commission",
    riskLevel: "high",
    riskScore: 85,
    regulatoryCategory: "Product Safety",
    publishedDate: daysAgo(12),
    effectiveDate: daysFromNow(180),
    complianceDeadline: daysFromNow(150),
    isInForce: false,
    isPipeline: true,
    regulatoryBody: "CPSC",
    impactAreas: ["Product Safety", "Testing", "Labeling"],
    status: "Proposed Rule",
    localTerminology: "NPRM",
    actions: [
      { date: daysAgo(12), text: "Notice of Proposed Rulemaking published", type: "nprm" }
    ]
  },
  {
    id: "doe-24-energy-kettle",
    title: "DOE Energy Efficiency Standards - Electric Kettles",
    summary: "First federal energy efficiency standards for electric kettles.",
    overview: "DOE establishes minimum energy efficiency requirements for electric kettles.",
    bullets: [
      "Minimum energy efficiency ratios",
      "Standby power limits",
      "Energy labeling requirements"
    ],
    documentType: "regulation",
    authority: "federal-agency",
    jurisdiction: "USA",
    agencyName: "Department of Energy",
    riskLevel: "medium",
    riskScore: 62,
    regulatoryCategory: "Product Safety",
    publishedDate: daysAgo(14),
    effectiveDate: daysFromNow(365),
    isInForce: false,
    isPipeline: true,
    regulatoryBody: "DOE",
    impactAreas: ["Energy", "Labeling", "Design"],
    status: "Proposed Rule",
    localTerminology: "10 CFR 430",
    actions: [
      { date: daysAgo(14), text: "Proposed Rule published", type: "nprm" }
    ]
  },

  // ========== MID-RANGE (15-30 days ago) ==========
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
  {
    id: "hr-2024-6234",
    title: "Kitchen Appliance Recall Transparency Act",
    summary: "Requires manufacturers to notify consumers directly of product recalls.",
    overview: "Strengthens consumer notification requirements for appliance recalls.",
    bullets: [
      "Direct consumer notification requirements",
      "Recall database registration",
      "Penalty enhancements for non-compliance"
    ],
    documentType: "bill",
    authority: "congress",
    jurisdiction: "USA",
    riskLevel: "medium",
    riskScore: 65,
    regulatoryCategory: "Product Safety",
    publishedDate: daysAgo(18),
    complianceDeadline: daysFromNow(365),
    isInForce: false,
    isPipeline: true,
    regulatoryBody: "U.S. House of Representatives",
    impactAreas: ["Recalls", "Consumer Protection", "Compliance"],
    status: "Introduced",
    localTerminology: "H.R. 6234",
    sponsors: [{ name: "Rep. Sarah Johnson", party: "D", state: "MI" }],
    committees: ["House Energy and Commerce Committee"],
    actions: [
      { date: daysAgo(18), text: "Introduced in House", type: "introduced" }
    ],
    subjects: ["Consumer protection", "Product recalls", "Notification"]
  },
  {
    id: "fda-24-bpa-update",
    title: "FDA BPA-Free Certification Standards",
    summary: "Updated certification standards for BPA-free claims in food contact materials.",
    overview: "FDA updates verification requirements for BPA-free marketing claims.",
    bullets: [
      "Testing methodology standards",
      "Certification requirements",
      "Labeling guidelines"
    ],
    documentType: "regulation",
    authority: "federal-agency",
    jurisdiction: "USA",
    agencyName: "Food and Drug Administration",
    riskLevel: "medium",
    riskScore: 70,
    regulatoryCategory: "Food Contact Material",
    publishedDate: daysAgo(22),
    effectiveDate: daysAgo(22),
    isInForce: true,
    isPipeline: false,
    regulatoryBody: "FDA",
    impactAreas: ["Materials", "Labeling", "Marketing"],
    status: "In Force",
    localTerminology: "FDA Guidance",
    actions: [
      { date: daysAgo(22), text: "Guidance document issued", type: "effective" }
    ]
  },
  {
    id: "s-2024-3890",
    title: "Smart Device Right to Repair Act",
    summary: "Requires manufacturers to provide repair information and parts for smart appliances.",
    overview: "Establishes consumer and independent repair shop access to repair resources.",
    bullets: [
      "Repair manual availability requirements",
      "Parts availability requirements",
      "Diagnostic software access"
    ],
    documentType: "bill",
    authority: "congress",
    jurisdiction: "USA",
    riskLevel: "medium",
    riskScore: 55,
    regulatoryCategory: "Product Safety",
    publishedDate: daysAgo(25),
    complianceDeadline: daysFromNow(730),
    isInForce: false,
    isPipeline: true,
    regulatoryBody: "U.S. Senate",
    impactAreas: ["Repair", "Consumer Rights", "Documentation"],
    status: "In Committee",
    localTerminology: "S. 3890",
    sponsors: [{ name: "Sen. Amy Klobuchar", party: "D", state: "MN" }],
    committees: ["Senate Commerce Committee"],
    actions: [
      { date: daysAgo(25), text: "Introduced in Senate", type: "introduced" },
      { date: daysAgo(20), text: "Referred to Committee", type: "referral" }
    ],
    subjects: ["Right to repair", "Consumer rights", "Manufacturing"]
  },
  {
    id: "fcc-24-150",
    title: "FCC Smart Home Device Interference Mitigation",
    summary: "New requirements to prevent RF interference from smart home devices.",
    overview: "Addresses growing interference issues from proliferating smart home devices.",
    bullets: [
      "Interference testing requirements",
      "Coexistence standards",
      "Complaint resolution procedures"
    ],
    documentType: "regulation",
    authority: "federal-agency",
    jurisdiction: "USA",
    agencyName: "Federal Communications Commission",
    riskLevel: "medium",
    riskScore: 62,
    regulatoryCategory: "Radio",
    publishedDate: daysAgo(28),
    effectiveDate: daysFromNow(120),
    isInForce: false,
    isPipeline: true,
    regulatoryBody: "FCC",
    impactAreas: ["Wireless", "Testing", "Compliance"],
    status: "Proposed Rule",
    localTerminology: "FCC 24-150",
    actions: [
      { date: daysAgo(28), text: "Notice of Proposed Rulemaking published", type: "nprm" }
    ]
  },

  // ========== OLDER (31-60 days ago) ==========
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
    id: "hr-2024-5678",
    title: "Connected Appliance Data Privacy Act",
    summary: "Requires data privacy disclosures for connected kitchen appliances.",
    overview: "Establishes consumer data privacy protections for smart home appliances.",
    bullets: [
      "Data collection disclosure requirements",
      "Opt-out mechanisms for data sharing",
      "Data retention limits"
    ],
    documentType: "bill",
    authority: "congress",
    jurisdiction: "USA",
    riskLevel: "medium",
    riskScore: 68,
    regulatoryCategory: "Cybersecurity",
    publishedDate: daysAgo(35),
    complianceDeadline: daysFromNow(540),
    isInForce: false,
    isPipeline: true,
    regulatoryBody: "U.S. House of Representatives",
    impactAreas: ["Privacy", "Data", "Compliance"],
    status: "In Committee",
    localTerminology: "H.R. 5678",
    sponsors: [{ name: "Rep. David Wilson", party: "R", state: "OH" }],
    committees: ["House Energy and Commerce Committee"],
    actions: [
      { date: daysAgo(35), text: "Introduced in House", type: "introduced" },
      { date: daysAgo(30), text: "Referred to Committee", type: "referral" }
    ],
    subjects: ["Privacy", "Data protection", "Consumer electronics"]
  },
  {
    id: "cpsc-24-thermal-002",
    title: "CPSC Thermal Runaway Prevention Standards",
    summary: "New thermal management requirements for battery-powered appliances.",
    overview: "Addresses thermal runaway risks in lithium battery powered devices.",
    bullets: [
      "Thermal monitoring requirements",
      "Battery management system standards",
      "Emergency shutdown protocols"
    ],
    documentType: "regulation",
    authority: "federal-agency",
    jurisdiction: "USA",
    agencyName: "Consumer Product Safety Commission",
    riskLevel: "high",
    riskScore: 88,
    regulatoryCategory: "Battery",
    publishedDate: daysAgo(40),
    effectiveDate: daysFromNow(180),
    isInForce: false,
    isPipeline: true,
    regulatoryBody: "CPSC",
    impactAreas: ["Battery Safety", "Design", "Testing"],
    status: "Proposed Rule",
    localTerminology: "NPRM",
    actions: [
      { date: daysAgo(40), text: "Notice of Proposed Rulemaking published", type: "nprm" }
    ]
  },
  {
    id: "s-2024-2890",
    title: "Smart Appliance Accessibility Act",
    summary: "Requires accessibility features in smart home appliances.",
    overview: "Ensures smart appliances are accessible to users with disabilities.",
    bullets: [
      "Voice control requirements",
      "Visual feedback standards",
      "Tactile interface requirements"
    ],
    documentType: "bill",
    authority: "congress",
    jurisdiction: "USA",
    riskLevel: "low",
    riskScore: 45,
    regulatoryCategory: "Product Safety",
    publishedDate: daysAgo(42),
    complianceDeadline: daysFromNow(730),
    isInForce: false,
    isPipeline: true,
    regulatoryBody: "U.S. Senate",
    impactAreas: ["Accessibility", "Design", "User Interface"],
    status: "Introduced",
    localTerminology: "S. 2890",
    sponsors: [{ name: "Sen. Tammy Duckworth", party: "D", state: "IL" }],
    committees: ["Senate Commerce Committee"],
    actions: [
      { date: daysAgo(42), text: "Introduced in Senate", type: "introduced" }
    ],
    subjects: ["Accessibility", "Disability", "Smart home"]
  },
  {
    id: "fda-24-silicone-guidance",
    title: "FDA Silicone Materials Guidance Update",
    summary: "Updated guidance on silicone materials in food contact applications.",
    overview: "Provides updated guidance on silicone material testing and compliance.",
    bullets: [
      "Migration testing updates",
      "Approved silicone formulations",
      "Documentation requirements"
    ],
    documentType: "regulation",
    authority: "federal-agency",
    jurisdiction: "USA",
    agencyName: "Food and Drug Administration",
    riskLevel: "medium",
    riskScore: 58,
    regulatoryCategory: "Food Contact Material",
    publishedDate: daysAgo(48),
    effectiveDate: daysAgo(48),
    isInForce: true,
    isPipeline: false,
    regulatoryBody: "FDA",
    impactAreas: ["Materials", "Testing", "Documentation"],
    status: "In Force",
    localTerminology: "FDA Guidance",
    actions: [
      { date: daysAgo(48), text: "Guidance document issued", type: "effective" }
    ]
  },
  {
    id: "fcc-24-120",
    title: "FCC Matter Protocol Certification Framework",
    summary: "Certification framework for Matter-enabled smart home devices.",
    overview: "Establishes FCC certification pathway for Matter protocol devices.",
    bullets: [
      "Matter certification requirements",
      "Thread radio compliance",
      "Multi-protocol testing"
    ],
    documentType: "regulation",
    authority: "federal-agency",
    jurisdiction: "USA",
    agencyName: "Federal Communications Commission",
    riskLevel: "medium",
    riskScore: 60,
    regulatoryCategory: "Radio",
    publishedDate: daysAgo(52),
    effectiveDate: daysAgo(52),
    isInForce: true,
    isPipeline: false,
    regulatoryBody: "FCC",
    impactAreas: ["Wireless", "Certification", "Interoperability"],
    status: "In Force",
    localTerminology: "FCC 24-120",
    actions: [
      { date: daysAgo(52), text: "Final Rule effective", type: "effective" }
    ]
  },
  {
    id: "hr-2024-4567",
    title: "Appliance Energy Transparency Act",
    summary: "Enhanced energy labeling requirements for kitchen appliances.",
    overview: "Updates energy disclosure requirements for consumer appliances.",
    bullets: [
      "QR code energy labels",
      "Real-time energy monitoring disclosure",
      "Standby power disclosure"
    ],
    documentType: "bill",
    authority: "congress",
    jurisdiction: "USA",
    riskLevel: "low",
    riskScore: 48,
    regulatoryCategory: "Product Safety",
    publishedDate: daysAgo(55),
    complianceDeadline: daysFromNow(540),
    isInForce: false,
    isPipeline: true,
    regulatoryBody: "U.S. House of Representatives",
    impactAreas: ["Energy", "Labeling", "Consumer Information"],
    status: "In Committee",
    localTerminology: "H.R. 4567",
    sponsors: [{ name: "Rep. Lisa Thompson", party: "D", state: "CO" }],
    committees: ["House Energy and Commerce Committee"],
    actions: [
      { date: daysAgo(55), text: "Introduced in House", type: "introduced" },
      { date: daysAgo(50), text: "Referred to Committee", type: "referral" }
    ],
    subjects: ["Energy efficiency", "Labeling", "Consumer information"]
  },

  // ========== OLDEST (61-90 days ago) ==========
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
    riskScore: 35,
    regulatoryCategory: "Product Safety",
    publishedDate: daysAgo(90),
    effectiveDate: daysAgo(60),
    isInForce: true,
    isPipeline: false,
    regulatoryBody: "U.S. State Department",
    impactAreas: ["Certification", "Trade", "Market Access"],
    status: "In Force",
    localTerminology: "Executive Agreement",
    actions: [
      { date: daysAgo(120), text: "Agreement signed", type: "enacted" },
      { date: daysAgo(90), text: "Published in Federal Register", type: "final" },
      { date: daysAgo(60), text: "Entry into force", type: "effective" }
    ]
  },
  {
    id: "cpsc-24-grounding-001",
    title: "CPSC Grounding Standards for Countertop Appliances",
    summary: "Updated grounding requirements for countertop electrical appliances.",
    overview: "New grounding standards to prevent electrical hazards in wet environments.",
    bullets: [
      "Enhanced grounding requirements",
      "GFCI compatibility standards",
      "Wet environment testing"
    ],
    documentType: "regulation",
    authority: "federal-agency",
    jurisdiction: "USA",
    agencyName: "Consumer Product Safety Commission",
    riskLevel: "high",
    riskScore: 82,
    regulatoryCategory: "Product Safety",
    publishedDate: daysAgo(65),
    effectiveDate: daysAgo(30),
    isInForce: true,
    isPipeline: false,
    regulatoryBody: "CPSC",
    impactAreas: ["Product Safety", "Electrical", "Testing"],
    status: "In Force",
    localTerminology: "16 CFR 1500",
    actions: [
      { date: daysAgo(120), text: "Proposed Rule published", type: "nprm" },
      { date: daysAgo(65), text: "Final Rule published", type: "final" },
      { date: daysAgo(30), text: "Effective date", type: "effective" }
    ]
  },
  {
    id: "epa-24-packaging-001",
    title: "EPA Sustainable Packaging Requirements",
    summary: "New sustainable packaging requirements for consumer electronics.",
    overview: "EPA establishes recyclability and sustainability requirements for product packaging.",
    bullets: [
      "Recyclable packaging requirements",
      "Plastic reduction targets",
      "Labeling requirements"
    ],
    documentType: "regulation",
    authority: "federal-agency",
    jurisdiction: "USA",
    agencyName: "Environmental Protection Agency",
    riskLevel: "medium",
    riskScore: 55,
    regulatoryCategory: "Product Safety",
    publishedDate: daysAgo(70),
    effectiveDate: daysFromNow(365),
    isInForce: false,
    isPipeline: true,
    regulatoryBody: "EPA",
    impactAreas: ["Packaging", "Sustainability", "Labeling"],
    status: "Proposed Rule",
    localTerminology: "EPA Rule",
    actions: [
      { date: daysAgo(70), text: "Notice of Proposed Rulemaking published", type: "nprm" }
    ]
  },
  {
    id: "s-2024-1890",
    title: "Federal Smart Device Standards Harmonization Act",
    summary: "Harmonizes state-level smart device regulations at the federal level.",
    overview: "Creates uniform federal standards preempting varying state requirements.",
    bullets: [
      "Federal preemption of state IoT laws",
      "Uniform security requirements",
      "Single certification pathway"
    ],
    documentType: "bill",
    authority: "congress",
    jurisdiction: "USA",
    riskLevel: "medium",
    riskScore: 62,
    regulatoryCategory: "Cybersecurity",
    publishedDate: daysAgo(75),
    complianceDeadline: daysFromNow(730),
    isInForce: false,
    isPipeline: true,
    regulatoryBody: "U.S. Senate",
    impactAreas: ["Standards", "Compliance", "Harmonization"],
    status: "In Committee",
    localTerminology: "S. 1890",
    sponsors: [{ name: "Sen. Mark Warner", party: "D", state: "VA" }],
    committees: ["Senate Commerce Committee"],
    actions: [
      { date: daysAgo(75), text: "Introduced in Senate", type: "introduced" },
      { date: daysAgo(70), text: "Referred to Committee", type: "referral" }
    ],
    subjects: ["Standards", "Federal preemption", "IoT"]
  },
  {
    id: "fda-24-stainless-001",
    title: "FDA Stainless Steel Food Contact Guidance",
    summary: "Updated guidance on stainless steel grades for food contact surfaces.",
    overview: "Clarifies acceptable stainless steel compositions for food contact.",
    bullets: [
      "Acceptable steel grades",
      "Chromium content requirements",
      "Surface finish standards"
    ],
    documentType: "regulation",
    authority: "federal-agency",
    jurisdiction: "USA",
    agencyName: "Food and Drug Administration",
    riskLevel: "medium",
    riskScore: 58,
    regulatoryCategory: "Food Contact Material",
    publishedDate: daysAgo(78),
    effectiveDate: daysAgo(78),
    isInForce: true,
    isPipeline: false,
    regulatoryBody: "FDA",
    impactAreas: ["Materials", "Manufacturing", "Compliance"],
    status: "In Force",
    localTerminology: "FDA Guidance",
    actions: [
      { date: daysAgo(78), text: "Guidance document issued", type: "effective" }
    ]
  },
  {
    id: "hr-2024-3456",
    title: "Kitchen Appliance Import Safety Act",
    summary: "Strengthens safety requirements for imported kitchen appliances.",
    overview: "Enhanced customs and border protection requirements for appliance imports.",
    bullets: [
      "Pre-certification requirements",
      "Enhanced inspection protocols",
      "Importer liability provisions"
    ],
    documentType: "bill",
    authority: "congress",
    jurisdiction: "USA",
    riskLevel: "high",
    riskScore: 75,
    regulatoryCategory: "Product Safety",
    publishedDate: daysAgo(82),
    complianceDeadline: daysFromNow(365),
    isInForce: false,
    isPipeline: true,
    regulatoryBody: "U.S. House of Representatives",
    impactAreas: ["Import", "Certification", "Compliance"],
    status: "Second Reading",
    localTerminology: "H.R. 3456",
    sponsors: [{ name: "Rep. Kevin McCarthy", party: "R", state: "CA" }],
    committees: ["House Ways and Means Committee", "House Energy and Commerce Committee"],
    actions: [
      { date: daysAgo(82), text: "Introduced in House", type: "introduced" },
      { date: daysAgo(75), text: "Referred to Committees", type: "referral" },
      { date: daysAgo(60), text: "Committee hearings held", type: "hearing" }
    ],
    subjects: ["Imports", "Product safety", "Customs"]
  },
  {
    id: "fcc-24-spectrum-001",
    title: "FCC Spectrum Allocation for IoT Devices",
    summary: "New spectrum allocation for low-power IoT devices.",
    overview: "Allocates additional spectrum for unlicensed IoT device use.",
    bullets: [
      "New frequency bands for IoT",
      "Power limits for unlicensed use",
      "Interference protection rules"
    ],
    documentType: "regulation",
    authority: "federal-agency",
    jurisdiction: "USA",
    agencyName: "Federal Communications Commission",
    riskLevel: "medium",
    riskScore: 52,
    regulatoryCategory: "Radio",
    publishedDate: daysAgo(85),
    effectiveDate: daysAgo(45),
    isInForce: true,
    isPipeline: false,
    regulatoryBody: "FCC",
    impactAreas: ["Spectrum", "Wireless", "Design"],
    status: "In Force",
    localTerminology: "FCC Order",
    actions: [
      { date: daysAgo(150), text: "Notice of Proposed Rulemaking", type: "nprm" },
      { date: daysAgo(85), text: "Report and Order adopted", type: "final" },
      { date: daysAgo(45), text: "Effective date", type: "effective" }
    ]
  },
  {
    id: "cpsc-24-recall-database",
    title: "CPSC Enhanced Recall Database Requirements",
    summary: "Requirements for manufacturer participation in recall database.",
    overview: "Mandates manufacturer data submission to CPSC recall database.",
    bullets: [
      "Mandatory database registration",
      "Real-time recall reporting",
      "Consumer notification integration"
    ],
    documentType: "regulation",
    authority: "federal-agency",
    jurisdiction: "USA",
    agencyName: "Consumer Product Safety Commission",
    riskLevel: "medium",
    riskScore: 65,
    regulatoryCategory: "Product Safety",
    publishedDate: daysAgo(88),
    effectiveDate: daysAgo(30),
    isInForce: true,
    isPipeline: false,
    regulatoryBody: "CPSC",
    impactAreas: ["Recalls", "Compliance", "Reporting"],
    status: "In Force",
    localTerminology: "16 CFR 1115",
    actions: [
      { date: daysAgo(120), text: "Proposed Rule published", type: "nprm" },
      { date: daysAgo(88), text: "Final Rule published", type: "final" },
      { date: daysAgo(30), text: "Effective date", type: "effective" }
    ]
  }
];

// Export for compatibility with existing code
export default usaLegislationData;
