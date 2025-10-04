import { BillItem } from "@/types/legislation";

export const mockBills: BillItem[] = [
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
        phone: "(02) 6277 7640"
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
    motherActLink: "https://www.legislation.gov.au/C2004A00485/latest"
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
        phone: "(02) 6277 7300"
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
    motherActLink: "https://www.legislation.gov.au/C2004A03712/latest"
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
