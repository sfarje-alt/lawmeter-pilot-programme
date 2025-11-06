import { BillItem } from "@/types/legislation";
import { costaRicaBills } from "./costaRicaBills";

export const baseBills: BillItem[] = costaRicaBills;

function daysAgoISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

const statusCycle: BillItem["status"][] = [
  "Presentado",
  "En comisión",
  "Aprobado en Primer Debate",
  "Aprobado en Segundo Debate",
  "Aprobado en Primer Debate (Primera Legislatura)",
  "Aprobado en Segundo Debate (Primera Legislatura)",
  "Aprobado",
];

const parties = ["Labor", "Liberal", "Greens", "Independent", "Nationals"];

const mpNamesByParty = {
  Labor: [
    { name: "Anthony Albanese", constituency: "Grayndler" },
    { name: "Richard Marles", constituency: "Corio" },
    { name: "Penny Wong", constituency: "South Australia" },
    { name: "Jim Chalmers", constituency: "Rankin" },
    { name: "Katy Gallagher", constituency: "ACT" },
    { name: "Clare O'Neil", constituency: "Hotham" },
    { name: "Tanya Plibersek", constituency: "Sydney" },
    { name: "Mark Dreyfus", constituency: "Isaacs" },
    { name: "Tony Burke", constituency: "Watson" },
    { name: "Mark Butler", constituency: "Hindmarsh" },
  ],
  Liberal: [
    { name: "Peter Dutton", constituency: "Dickson" },
    { name: "Sussan Ley", constituency: "Farrer" },
    { name: "Michaelia Cash", constituency: "Western Australia" },
    { name: "Paul Fletcher", constituency: "Bradfield" },
    { name: "Simon Birmingham", constituency: "South Australia" },
    { name: "Jane Hume", constituency: "Victoria" },
    { name: "Angus Taylor", constituency: "Hume" },
    { name: "Dan Tehan", constituency: "Wannon" },
  ],
  Greens: [
    { name: "Adam Bandt", constituency: "Melbourne" },
    { name: "Sarah Hanson-Young", constituency: "South Australia" },
    { name: "Larissa Waters", constituency: "Queensland" },
    { name: "Mehreen Faruqi", constituency: "New South Wales" },
    { name: "Nick McKim", constituency: "Tasmania" },
  ],
  Independent: [
    { name: "David Pocock", constituency: "ACT" },
    { name: "Jacqui Lambie", constituency: "Tasmania" },
    { name: "Zali Steggall", constituency: "Warringah" },
    { name: "Allegra Spender", constituency: "Wentworth" },
    { name: "Kylea Tink", constituency: "North Sydney" },
  ],
  Nationals: [
    { name: "David Littleproud", constituency: "Maranoa" },
    { name: "Bridget McKenzie", constituency: "Victoria" },
    { name: "Perin Davey", constituency: "New South Wales" },
    { name: "Matt Canavan", constituency: "Queensland" },
  ]
};

const stakeholderOrgs = [
  { name: "Australian Medical Association", type: "Professional Body", positions: ["support", "oppose", "neutral"] },
  { name: "Business Council of Australia", type: "Industry Group", positions: ["oppose", "neutral"] },
  { name: "Australian Council of Trade Unions", type: "Union", positions: ["support", "neutral"] },
  { name: "Australian Conservation Foundation", type: "Environmental NGO", positions: ["support", "neutral"] },
  { name: "Tech Council of Australia", type: "Technology Industry", positions: ["oppose", "neutral"] },
  { name: "Consumer Policy Research Centre", type: "Consumer Rights", positions: ["support"] },
  { name: "Australian Privacy Foundation", type: "Privacy Advocacy", positions: ["support", "oppose"] },
  { name: "Banking Association", type: "Financial Services", positions: ["neutral", "oppose"] },
  { name: "Australian Chamber of Commerce", type: "Business", positions: ["oppose", "neutral"] },
  { name: "Australian Healthcare Association", type: "Healthcare", positions: ["support", "neutral"] },
];

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

function riskLevelFromScore(score: number): BillItem["nivelRiesgo"] {
  if (score >= 80) return "alto";
  if (score >= 60) return "medio";
  return "bajo";
}

function makeStageLocation(chamber: BillItem["chamber"], estado: BillItem["estado"]): string {
  switch (estado) {
    case "Presentado":
      return `${chamber} — First Reading`;
    case "Aprobado en Primer Debate":
      return `${chamber} — Second Reading Debate`;
    case "En comisión":
      return `${chamber} — Committee Stage`;
    case "Aprobado en Segundo Debate":
      return `${chamber} — Consideration in Detail`;
    case "Aprobado en Primer Debate (Primera Legislatura)":
      return `Passed House — Awaiting Senate Introduction`;
    case "Aprobado en Segundo Debate (Primera Legislatura)":
      return `Passed Senate — Awaiting House Consideration`;
    case "Aprobado":
      return `Both Houses — Royal Assent Pending`;
    default:
      return `${chamber} — ${estado}`;
  }
}

function generateBill(index: number): BillItem {
  const p = portfolioTopics[index % portfolioTopics.length];
  const topic = p.topics[index % p.topics.length];
  
  // Create a better distribution across all quadrants
  let estado: BillItem["estado"];
  let score: number;
  
  // Distribute across urgency levels (based on status)
  const urgencyGroup = index % 3;
  if (urgencyGroup === 0) {
    // High urgency - late stage bills
    estado = index % 2 === 0 ? "Aprobado" : "Aprobado en Segundo Debate (Primera Legislatura)";
  } else if (urgencyGroup === 1) {
    // Medium urgency - middle stage bills
    estado = index % 2 === 0 ? "Aprobado en Primer Debate" : "En comisión";
  } else {
    // Low urgency - early stage bills
    estado = index % 2 === 0 ? "Presentado" : "Aprobado en Segundo Debate";
  }
  
  // Distribute across risk levels (impact)
  const impactGroup = index % 3;
  if (impactGroup === 0) {
    score = 80 + (index % 16); // High risk: 80-95
  } else if (impactGroup === 1) {
    score = 60 + (index % 20); // Medium risk: 60-79
  } else {
    score = 40 + (index % 20); // Low risk: 40-59
  }
  
  const daysAgo = ((index * 3) % 180) + 1;
  const level = riskLevelFromScore(score);
  const party = parties[index % parties.length];
  const year = new Date().getFullYear();

  // Determine if this is an amendment bill
  const isAmendment = index % 2 === 0;
  const billTitle = isAmendment 
    ? `${topic} Amendment Bill ${year}`
    : `${topic} Bill ${year}`;

  // Select MP from party
  const partyMPs = mpNamesByParty[party as keyof typeof mpNamesByParty];
  const selectedMP = partyMPs[index % partyMPs.length];
  
  // Generate voting records
  const votingRecords: BillItem["votingRecords"] = [
    {
      date: daysAgoISO(daysAgo + 30),
      stage: "Second Reading",
      votesFor: 70 + (index % 20),
      votesAgainst: 60 + (index % 15),
      abstentions: index % 5,
      passed: true,
      mpVotes: [
        { mpName: selectedMP.name, party, vote: "for" },
        { mpName: mpNamesByParty.Liberal[index % mpNamesByParty.Liberal.length].name, party: "Liberal", vote: party === "Liberal" ? "for" : "against" },
        { mpName: mpNamesByParty.Greens[index % mpNamesByParty.Greens.length].name, party: "Greens", vote: index % 2 === 0 ? "for" : "against" },
      ]
    }
  ];

  // Add committee stage voting if applicable
  const status = estado;
  if (["Committee", "Consideration in Detail", "Aprobado en Primer Debate", "Aprobado en Segundo Debate"].includes(status)) {
    votingRecords.push({
      date: daysAgoISO(daysAgo + 10),
      stage: "Committee Stage",
      votesFor: 75 + (index % 15),
      votesAgainst: 55 + (index % 20),
      abstentions: index % 4,
      passed: true,
    });
  }

  // Generate stakeholders
  const numStakeholders = 3 + (index % 2);
  const stakeholders: BillItem["stakeholders"] = [];
  
  for (let i = 0; i < numStakeholders; i++) {
    const org = stakeholderOrgs[(index + i) % stakeholderOrgs.length];
    const position = org.positions[(index + i) % org.positions.length] as "support" | "oppose" | "neutral";
    
    const statements = {
      support: [
        `This bill represents significant progress in ${topic.toLowerCase()} reform.`,
        `We strongly support these measures and their positive impact on the sector.`,
        `Long overdue reforms that will benefit all stakeholders.`,
      ],
      oppose: [
        `These changes impose unnecessary regulatory burden on ${p.portfolio.toLowerCase()}.`,
        `Concerned about implementation costs and practical challenges.`,
        `The bill requires significant amendments before we can support it.`,
      ],
      neutral: [
        `Seeking clarification on implementation timelines and compliance requirements.`,
        `Support the intent but concerned about specific provisions.`,
        `We're engaging constructively to ensure practical outcomes.`,
      ]
    };
    
    stakeholders.push({
      name: org.name,
      organization: org.type,
      position,
      statement: statements[position][(index + i) % statements[position].length]
    });
  }

  return {
    id: `bill-${(index + 10).toString().padStart(3, "0")}`,
    titulo: billTitle,
    title: billTitle,
    cartera: p.portfolio,
    portfolio: p.portfolio,
    party,
    mps: [
      { 
        name: selectedMP.name, 
        role: "Diputado",
        email: `${selectedMP.name.toLowerCase().replace(/\s+/g, '.')}.mp@aph.gov.au`,
        phone: `(02) ${6277 + (index % 10)} ${7000 + (index % 1000)}`,
        party,
        constituency: selectedMP.constituency,
      }
    ],
    estado,
    status: estado,
    stageLocation: makeStageLocation("House", estado),
    fechaPresentacion: daysAgoISO(daysAgo + 30),
    presentationDate: daysAgoISO(daysAgo + 30),
    fechaUltimaAccion: daysAgoISO(daysAgo),
    lastActionDate: daysAgoISO(daysAgo),
    resumen: `Proposes ${isAmendment ? 'amendments' : 'reforms'} relating to ${topic.toLowerCase()} impacting organizations across multiple sectors. Includes compliance, reporting, and operational changes.`,
    summary: `Proposes ${isAmendment ? 'amendments' : 'reforms'} relating to ${topic.toLowerCase()} impacting organizations across multiple sectors. Includes compliance, reporting, and operational changes.`,
    puntosImportantes: [
      `${isAmendment ? 'Amends existing legislation' : 'Introduces new requirements'} for ${topic.toLowerCase()}`,
      `Enhances compliance and audit obligations for ${p.portfolio.toLowerCase()}`,
      `Aligns with national standards and regulator expectations`
    ],
    bullets: [
      `${isAmendment ? 'Amends existing legislation' : 'Introduces new requirements'} for ${topic.toLowerCase()}`,
      `Enhances compliance and audit obligations for ${p.portfolio.toLowerCase()}`,
      `Aligns with national standards and regulator expectations`
    ],
    nivelRiesgo: level,
    risk_level: level === "alto" ? "high" : level === "medio" ? "medium" : "low",
    puntajeRiesgo: score,
    risk_score: score,
    votingRecords,
    stakeholders,
    ...(isAmendment && { 
      urlLeyMadre: `https://www.legislation.gov.au/C${year - 10}A${String(index).padStart(5, '0')}/latest`,
      motherActLink: `https://www.legislation.gov.au/C${year - 10}A${String(index).padStart(5, '0')}/latest`
    }),
  };
}

// Solo exportar los proyectos de Costa Rica relevantes para BAC
export const mockBills: BillItem[] = baseBills;
