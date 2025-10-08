import { BillItem } from "@/types/legislation";

export const baseBills: BillItem[] = [
  {
    id: "bill-001",
    title: "Environment Protection and Biodiversity Conservation Amendment (Nature Positive) Bill 2024",
    portfolio: "Environment and Water",
    party: "Labor",
    mps: [
      {
        name: "Tanya Plibersek",
        role: "Minister for Environment and Water",
        email: "tanya.plibersek.mp@aph.gov.au",
        phone: "(02) 6277 7640",
        party: "Labor",
        votingPosition: "support",
        constituency: "Sydney"
      }
    ],
    chamber: "House",
    status: "Committee",
    stageLocation: "House — Environment Committee Review",
    lastActionDate: "2024-10-01",
    summary: "Introduces nature positive reforms to strengthen environmental protections and streamline assessment processes. Establishes new environmental standards and regional plans.",
    bullets: [
      "Creates new National Environmental Standards",
      "Establishes Environment Information Australia",
      "Introduces regional planning frameworks",
      "Strengthens compliance and enforcement powers"
    ],
    risk_level: "high",
    risk_score: 85,
    motherActLink: "https://www.legislation.gov.au/C2004A00485/latest",
    votingRecords: [
      {
        date: "2024-08-15",
        stage: "Second Reading",
        votesFor: 78,
        votesAgainst: 68,
        abstentions: 5,
        passed: true,
        mpVotes: [
          { mpName: "Tanya Plibersek", party: "Labor", vote: "for" },
          { mpName: "Sussan Ley", party: "Liberal", vote: "against" },
          { mpName: "Adam Bandt", party: "Greens", vote: "for" }
        ]
      },
      {
        date: "2024-09-20",
        stage: "Committee Stage",
        votesFor: 82,
        votesAgainst: 64,
        abstentions: 5,
        passed: true
      }
    ],
    stakeholders: [
      {
        name: "Australian Conservation Foundation",
        organization: "Environmental NGO",
        position: "support",
        statement: "This bill represents a significant step forward in protecting Australia's unique biodiversity."
      },
      {
        name: "Business Council of Australia",
        organization: "Industry Group",
        position: "oppose",
        statement: "Concerned about increased regulatory burden and delays in project approvals."
      },
      {
        name: "Farmers Federation",
        organization: "Agricultural Industry",
        position: "neutral",
        statement: "Seeking amendments to ensure practical implementation for rural landholders."
      }
    ]
  },
  {
    id: "bill-002",
    title: "Privacy and Personal Information Protection Amendment Bill 2024",
    portfolio: "Attorney-General",
    party: "Labor",
    mps: [
      {
        name: "Mark Dreyfus",
        role: "Attorney-General",
        email: "mark.dreyfus.mp@aph.gov.au",
        phone: "(02) 6277 7300",
        party: "Labor",
        votingPosition: "support",
        constituency: "Isaacs"
      },
      {
        name: "Michaelia Cash",
        role: "Shadow Attorney-General",
        email: "michaelia.cash.mp@aph.gov.au",
        phone: "(02) 6277 3800",
        party: "Liberal",
        votingPosition: "oppose",
        constituency: "Western Australia"
      }
    ],
    chamber: "Senate",
    status: "Second Reading",
    stageLocation: "Senate — Second Reading Debate",
    lastActionDate: "2024-09-28",
    summary: "Modernizes privacy laws to address digital economy challenges, strengthens individual rights, and increases penalties for serious breaches.",
    bullets: [
      "Increases maximum penalties to $50 million or 30% of turnover",
      "Introduces statutory tort for serious invasions of privacy",
      "Expands definition of personal information",
      "Requires privacy-by-design in systems development"
    ],
    risk_level: "high",
    risk_score: 90,
    motherActLink: "https://www.legislation.gov.au/C2004A03712/latest",
    votingRecords: [
      {
        date: "2024-09-10",
        stage: "First Reading",
        votesFor: 42,
        votesAgainst: 32,
        abstentions: 2,
        passed: true,
        mpVotes: [
          { mpName: "Mark Dreyfus", party: "Labor", vote: "for" },
          { mpName: "Michaelia Cash", party: "Liberal", vote: "against" },
          { mpName: "David Pocock", party: "Independent", vote: "for" }
        ]
      }
    ],
    stakeholders: [
      {
        name: "Tech Council of Australia",
        organization: "Technology Industry",
        position: "oppose",
        statement: "Penalties are disproportionate and will stifle innovation in the digital economy."
      },
      {
        name: "Consumer Policy Research Centre",
        organization: "Consumer Rights",
        position: "support",
        statement: "Long overdue reforms that will finally give Australians real privacy protections."
      },
      {
        name: "Australian Privacy Foundation",
        organization: "Privacy Advocacy",
        position: "support",
        statement: "Strong support for enhanced privacy rights, though some provisions need strengthening."
      },
      {
        name: "Banking Association",
        organization: "Financial Services",
        position: "neutral",
        statement: "Support privacy goals but seeking clarity on implementation timelines."
      }
    ]
  },
  {
    id: "bill-003",
    title: "Workplace Relations Amendment (Closing Loopholes) Bill 2024",
    portfolio: "Employment and Workplace Relations",
    party: "Labor",
    mps: [
      {
        name: "Tony Burke",
        role: "Minister for Employment and Workplace Relations",
        email: "tony.burke.mp@aph.gov.au",
        phone: "(02) 6277 7320"
      }
    ],
    chamber: "House",
    status: "Passed House",
    stageLocation: "Passed House — Awaiting Senate Introduction",
    lastActionDate: "2024-09-25",
    summary: "Closes workplace relations loopholes affecting gig economy workers, labour hire arrangements, and wage theft. Strengthens Fair Work Commission powers.",
    bullets: [
      "Criminalizes wage theft with jail terms up to 10 years",
      "Extends employee-like protections to platform workers",
      "Restricts labour hire to prevent wage undercutting",
      "Mandates consultation for gig worker minimum standards"
    ],
    risk_level: "high",
    risk_score: 88,
    motherActLink: "https://www.legislation.gov.au/C2009A00028/latest"
  },
  {
    id: "bill-004",
    title: "Financial Services and Credit Amendment (Anti-Scam) Bill 2024",
    portfolio: "Treasury",
    party: "Labor",
    mps: [
      {
        name: "Stephen Jones",
        role: "Assistant Treasurer",
        email: "stephen.jones.mp@aph.gov.au",
        phone: "(02) 6277 7360"
      }
    ],
    chamber: "Senate",
    status: "Introduced",
    stageLocation: "Senate — First Reading",
    lastActionDate: "2024-09-30",
    summary: "Introduces mandatory scam prevention obligations for banks, telecommunication providers, and digital platforms. Creates enforceable industry codes.",
    bullets: [
      "Requires real-time scam detection and prevention systems",
      "Mandates customer reimbursement for certain scam losses",
      "Establishes cross-industry information sharing framework",
      "Empowers ASIC with civil penalty provisions"
    ],
    risk_level: "medium",
    risk_score: 72,
    motherActLink: "https://www.legislation.gov.au/C2004A01234/latest"
  },
  {
    id: "bill-005",
    title: "Health Practitioner Regulation National Law Amendment Bill 2024",
    portfolio: "Health and Aged Care",
    party: "Labor",
    mps: [
      {
        name: "Mark Butler",
        role: "Minister for Health and Aged Care",
        email: "mark.butler.mp@aph.gov.au",
        phone: "(02) 6277 7220"
      }
    ],
    chamber: "House",
    status: "Second Reading",
    stageLocation: "House — Second Reading Debate",
    lastActionDate: "2024-09-27",
    summary: "Strengthens health practitioner regulation including mandatory reporting requirements and enhanced patient safety measures.",
    bullets: [
      "Expands mandatory reporting obligations for health practitioners",
      "Introduces real-time prescription monitoring integration",
      "Strengthens AHPRA investigation and enforcement powers",
      "Creates new continuing professional development requirements"
    ],
    risk_level: "high",
    risk_score: 82,
    motherActLink: "https://www.legislation.gov.au/C2010A00079/latest"
  },
  {
    id: "bill-006",
    title: "Aged Care Amendment (Enhanced Care Standards) Bill 2024",
    portfolio: "Health and Aged Care",
    party: "Labor",
    mps: [
      {
        name: "Anika Wells",
        role: "Minister for Aged Care",
        email: "anika.wells.mp@aph.gov.au",
        phone: "(02) 6277 7560"
      }
    ],
    chamber: "Senate",
    status: "Committee",
    stageLocation: "Senate — Community Affairs Committee",
    lastActionDate: "2024-09-22",
    summary: "Implements enhanced care standards and increased transparency measures for aged care providers following Royal Commission recommendations.",
    bullets: [
      "Mandates minimum care minutes per resident per day (200 minutes)",
      "Requires registered nurses 24/7 in residential facilities",
      "Introduces star rating system for all providers",
      "Strengthens quality and safety compliance framework"
    ],
    risk_level: "high",
    risk_score: 87,
    motherActLink: "https://www.legislation.gov.au/C2004A05206/latest"
  },
  {
    id: "bill-007",
    title: "Competition and Consumer Amendment (Fair Trading) Bill 2024",
    portfolio: "Treasury",
    party: "Labor",
    mps: [
      {
        name: "Andrew Leigh",
        role: "Assistant Minister for Competition",
        email: "andrew.leigh.mp@aph.gov.au",
        phone: "(02) 6277 4330"
      }
    ],
    chamber: "House",
    status: "Consideration in Detail",
    stageLocation: "House — Consideration in Detail",
    lastActionDate: "2024-09-20",
    summary: "Strengthens consumer protections and competition laws, particularly targeting unfair trading practices and market concentration.",
    bullets: [
      "Introduces prohibition on unfair trading practices",
      "Expands ACCC merger review powers",
      "Creates new penalties for price exploitation",
      "Mandates supply chain transparency for major retailers"
    ],
    risk_level: "medium",
    risk_score: 68,
    motherActLink: "https://www.legislation.gov.au/C2004A00109/latest"
  },
  {
    id: "bill-008",
    title: "Cybersecurity Amendment (Critical Infrastructure) Bill 2024",
    portfolio: "Home Affairs",
    party: "Labor",
    mps: [
      {
        name: "Clare O'Neil",
        role: "Minister for Cyber Security",
        email: "clare.oneil.mp@aph.gov.au",
        phone: "(02) 6277 7290"
      }
    ],
    chamber: "Senate",
    status: "Passed Senate",
    stageLocation: "Passed Senate — Awaiting House Consideration",
    lastActionDate: "2024-09-18",
    summary: "Expands critical infrastructure protection requirements and incident reporting obligations for essential services sectors.",
    bullets: [
      "Extends coverage to additional critical sectors",
      "Mandates ransomware incident reporting within 72 hours",
      "Introduces government assistance regime for cyber incidents",
      "Requires annual vulnerability assessments"
    ],
    risk_level: "medium",
    risk_score: 75,
    motherActLink: "https://www.legislation.gov.au/C2018A00043/latest"
  },
  {
    id: "bill-009",
    title: "Climate Change Amendment (Net Zero Transition) Bill 2024",
    portfolio: "Climate Change and Energy",
    party: "Greens",
    mps: [
      {
        name: "Adam Bandt",
        role: "Leader of the Australian Greens",
        email: "adam.bandt.mp@aph.gov.au",
        phone: "(02) 6277 4100"
      }
    ],
    chamber: "House",
    status: "Introduced",
    stageLocation: "House — First Reading",
    lastActionDate: "2024-09-15",
    summary: "Private member's bill proposing accelerated emissions reduction targets and phase-out timeline for fossil fuel projects.",
    bullets: [
      "Sets 2030 emissions reduction target at 75% below 2005 levels",
      "Prohibits new fossil fuel project approvals from 2025",
      "Establishes Just Transition Authority for affected workers",
      "Requires annual climate risk disclosure for large companies"
    ],
    risk_level: "high",
    risk_score: 92,
    motherActLink: "https://www.legislation.gov.au/C2011A00131/latest"
  },
  {
    id: "bill-010",
    title: "Telecommunications Amendment (Online Safety) Bill 2024",
    portfolio: "Communications",
    party: "Liberal",
    mps: [
      {
        name: "Paul Fletcher",
        role: "Shadow Minister for Communications",
        email: "paul.fletcher.mp@aph.gov.au",
        phone: "(02) 6277 4890"
      }
    ],
    chamber: "Senate",
    status: "Introduced",
    stageLocation: "Senate — First Reading",
    lastActionDate: "2024-09-12",
    summary: "Opposition bill proposing enhanced age verification for social media and expanded online safety commissioner powers.",
    bullets: [
      "Mandates age verification for social media platforms (minimum 16 years)",
      "Expands content removal powers for harmful material",
      "Introduces parental consent requirements for under-18 accounts",
      "Creates new offences for non-compliant platforms"
    ],
    risk_level: "medium",
    risk_score: 70,
    motherActLink: "https://www.legislation.gov.au/C2021A00076/latest"
  }
];

function daysAgoISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

const statusCycle: BillItem["status"][] = [
  "Introduced",
  "Second Reading",
  "Committee",
  "Consideration in Detail",
  "Passed House",
  "Passed Senate",
  "Royal Assent Pending",
];

const parties = ["Labor", "Liberal", "Greens", "Independent", "Nationals"];
const chambers: BillItem["chamber"][] = ["House", "Senate"];

const portfolioTopics: { portfolio: string; topics: string[] }[] = [
  { portfolio: "Health, Disability and Ageing", topics: [
    "Hospital Staffing Requirements", "Medical Devices Safety", "Aged Care Quality Standards", "Mental Health Services Expansion",
    "Infection Control and Notifiable Diseases", "Patient Safety and Accreditation", "Electronic Health Record Security",
    "Telehealth and Remote Care", "Pathology and Diagnostics Reporting", "Oncology and Cancer Care Standards"
  ]},
  { portfolio: "Attorney-General's", topics: [
    "Privacy and Data Protection", "Cybersecurity and Encryption", "Anti-Discrimination Reforms", "Corporate Governance and Compliance",
    "Intellectual Property and Patents", "Liability and Insurance Reform"
  ]},
  { portfolio: "Employment and Workplace Relations", topics: [
    "Safe Staffing and Rostering", "WHS Psychosocial Hazards", "Industrial Relations and Awards", "Fair Work Enforcement"
  ]},
  { portfolio: "Treasury", topics: [
    "GST and Taxation", "Medicare Levy Adjustments", "Anti-Money Laundering", "Procurement and Tender Rules"
  ]},
  { portfolio: "Home Affairs", topics: [
    "Migration and Skilled Visas", "Border and Biosecurity", "International Travel and Quarantine"
  ]},
  { portfolio: "Industry, Science and Resources", topics: [
    "Clinical Research and Trials", "Biotech and Medical Devices", "Artificial Intelligence in Health"
  ]},
  { portfolio: "Environment, Climate, Energy and Water", topics: [
    "Clinical Waste Management", "Water Safety and Quality", "Carbon Emissions and Energy Efficiency"
  ]},
  { portfolio: "Social Services", topics: [
    "NDIS Provider Obligations", "Disability Service Standards", "Aged Care Support Measures"
  ]},
  { portfolio: "Veterans’ Affairs", topics: [
    "Veterans' Health and Rehabilitation", "PTSD Support Services"
  ]},
  { portfolio: "Agriculture, Fisheries and Forestry", topics: [
    "Food Safety and Imported Food", "Veterinary Medicines and APVMA"
  ]},
  { portfolio: "Education", topics: [
    "Medical and Nursing Education", "Clinical Placement Accreditation"
  ]},
  { portfolio: "Infrastructure, Transport, Regional Development and Local Government", topics: [
    "Hospital Construction Standards", "Medical Supply Chain Logistics"
  ]},
  { portfolio: "Finance", topics: [
    "Commonwealth Grants Rules and Guidelines", "Public Hospital Funding Transparency"
  ]},
  { portfolio: "Foreign Affairs and Trade", topics: [
    "Free Trade Agreements and Medical Goods", "International Health Regulations"
  ]},
  { portfolio: "Communications", topics: [
    "Digital Health Interoperability", "Data Retention and Metadata"
  ]},
];

function riskLevelFromScore(score: number): BillItem["risk_level"] {
  if (score >= 80) return "high";
  if (score >= 60) return "medium";
  return "low";
}

function makeStageLocation(chamber: BillItem["chamber"], status: BillItem["status"]): string {
  switch (status) {
    case "Introduced":
      return `${chamber} — First Reading`;
    case "Second Reading":
      return `${chamber} — Second Reading Debate`;
    case "Committee":
      return `${chamber} — Committee Stage`;
    case "Consideration in Detail":
      return `${chamber} — Consideration in Detail`;
    case "Passed House":
      return `Passed House — Awaiting Senate Introduction`;
    case "Passed Senate":
      return `Passed Senate — Awaiting House Consideration`;
    case "Royal Assent Pending":
      return `Both Houses — Royal Assent Pending`;
  }
}

function generateBill(index: number): BillItem {
  const p = portfolioTopics[index % portfolioTopics.length];
  const topic = p.topics[index % p.topics.length];
  const chamber = chambers[index % chambers.length];
  const status = statusCycle[index % statusCycle.length];
  const daysAgo = ((index * 3) % 180) + 1; // 1 to 180 days ago
  const score = 55 + ((index * 7) % 41); // 55-95
  const level = riskLevelFromScore(score);
  const party = parties[index % parties.length];
  const year = new Date().getFullYear();

  return {
    id: `bill-${(index + 10).toString().padStart(3, "0")}`,
    title: `${topic} Bill ${year}`,
    portfolio: p.portfolio,
    party,
    mps: [
      { name: party === "Labor" ? "Government MP" : party === "Liberal" ? "Opposition MP" : "Crossbench MP", role: chamber === "House" ? "Member of the House" : "Senator" }
    ],
    chamber,
    status,
    stageLocation: makeStageLocation(chamber, status),
    lastActionDate: daysAgoISO(daysAgo),
    summary: `Proposes reforms relating to ${topic.toLowerCase()} impacting providers such as hospitals, clinics, and disability services. Includes compliance, reporting, and accreditation changes relevant to Macquarie Hospital Group in Sydney.`,
    bullets: [
      `Introduces new requirements for ${topic.toLowerCase()}`,
      `Enhances compliance and audit obligations for ${p.portfolio.toLowerCase()}`,
      `Aligns with national standards and regulator expectations`
    ],
    risk_level: level,
    risk_score: score,
  };
}

const generatedBills: BillItem[] = Array.from({ length: 60 }, (_, i) => generateBill(i + 1));

export const mockBills: BillItem[] = [
  ...baseBills,
  ...generatedBills,
];
