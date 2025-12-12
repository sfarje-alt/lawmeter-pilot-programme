// Enriched mock data with full content for all drawer tabs
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";
import { 
  usStateBills, 
  canadaLegislation, 
  japanLegislation, 
  koreaLegislation, 
  taiwanLegislation,
  euRegulations,
  euDirectives,
  uaeLegislation,
  saudiLegislation,
  omanLegislation,
  kuwaitLegislation,
  bahrainLegislation,
  qatarLegislation
} from "./mockInternationalLegislation";
import { InternationalLegislation } from "./mockInternationalLegislation";
import { peruLegislationData, convertPeruToUnified } from "./peruLegislationData";

// Helper to generate realistic mock data for drawer tabs
function generateFullContent(item: InternationalLegislation, jurisdiction: string): Partial<UnifiedLegislationItem> {
  const isEnacted = item.legislativeCategory === "enacted";
  
  // Generate voting records for enacted items
  const votingRecords = isEnacted ? [
    {
      chamber: jurisdiction === "USA" ? "House" : jurisdiction === "Canada" ? "House of Commons" : "Legislature",
      date: item.publishedDate,
      yea: Math.floor(Math.random() * 200) + 150,
      nay: Math.floor(Math.random() * 100) + 50,
      abstain: Math.floor(Math.random() * 20),
      passed: true
    },
    {
      chamber: jurisdiction === "USA" ? "Senate" : jurisdiction === "Canada" ? "Senate" : "Upper House",
      date: item.publishedDate,
      yea: Math.floor(Math.random() * 60) + 40,
      nay: Math.floor(Math.random() * 30) + 10,
      abstain: Math.floor(Math.random() * 5),
      passed: true
    }
  ] : undefined;

  // Generate sponsors
  const sponsors = [
    {
      name: generateSponsorName(jurisdiction),
      party: ["Republican", "Democrat", "Conservative", "Liberal", "Independent"][Math.floor(Math.random() * 5)],
      state: item.subJurisdiction || undefined,
      role: "Primary Sponsor"
    },
    {
      name: generateSponsorName(jurisdiction),
      party: ["Republican", "Democrat", "Conservative", "Liberal", "Independent"][Math.floor(Math.random() * 5)],
      state: item.subJurisdiction || undefined,
      role: "Cosponsor"
    },
    {
      name: generateSponsorName(jurisdiction),
      party: ["Republican", "Democrat", "Conservative", "Liberal", "Independent"][Math.floor(Math.random() * 5)],
      role: "Cosponsor"
    }
  ];

  // Generate action history
  const actions = generateActions(item, jurisdiction);

  // Generate summaries
  const summaries = [
    {
      versionName: "As Introduced",
      text: `This ${item.legislationType} addresses ${item.regulatoryCategory.toLowerCase()} requirements for consumer products. ${item.summary} The legislation aims to strengthen regulatory oversight and ensure consumer protection in the ${item.category} sector.`
    },
    {
      versionName: "Committee Report",
      text: `The committee reviewed the proposed legislation and recommends passage with amendments. Key provisions include: ${item.bullets.join("; ")}. The committee finds that these measures are necessary to address current gaps in the regulatory framework.`
    }
  ];

  // Generate full text excerpt
  const fullText = generateFullText(item, jurisdiction);

  return {
    votingRecords,
    sponsors,
    actions,
    summaries,
    fullText,
    sourceUrl: `https://example.gov/${jurisdiction.toLowerCase()}/legislation/${item.id}`
  };
}

function generateSponsorName(jurisdiction: string): string {
  const firstNames = ["John", "Maria", "James", "Sarah", "Robert", "Jennifer", "Michael", "Elizabeth", "David", "Patricia"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
  
  if (jurisdiction === "Japan") {
    const jpFirstNames = ["Taro", "Hanako", "Ichiro", "Yuki", "Kenji", "Sakura"];
    const jpLastNames = ["Tanaka", "Suzuki", "Sato", "Yamamoto", "Watanabe", "Kobayashi"];
    return `${jpLastNames[Math.floor(Math.random() * jpLastNames.length)]} ${jpFirstNames[Math.floor(Math.random() * jpFirstNames.length)]}`;
  }
  
  if (jurisdiction === "Korea") {
    const krFirstNames = ["Min-jun", "Seo-yeon", "Ji-hoon", "Ha-eun", "Jae-won", "Yun-ah"];
    const krLastNames = ["Kim", "Lee", "Park", "Choi", "Jung", "Kang"];
    return `${krLastNames[Math.floor(Math.random() * krLastNames.length)]} ${krFirstNames[Math.floor(Math.random() * krFirstNames.length)]}`;
  }
  
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
}

function generateActions(item: InternationalLegislation, jurisdiction: string): Array<{ date: string; description: string; chamber?: string }> {
  const baseDate = new Date(item.publishedDate);
  const actions = [];
  
  if (item.legislativeCategory === "pending" && item.timeline) {
    item.timeline.forEach((stage, idx) => {
      if (stage.completed && stage.date) {
        actions.push({
          date: stage.date,
          description: `${stage.name} - Legislative process advanced`,
          chamber: idx % 2 === 0 ? "Lower Chamber" : "Committee"
        });
      }
    });
  } else {
    // Generate enacted legislation actions
    actions.push(
      { date: new Date(baseDate.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), description: "Legislation introduced", chamber: "Lower Chamber" },
      { date: new Date(baseDate.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), description: "Referred to committee for review", chamber: "Committee" },
      { date: new Date(baseDate.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), description: "Committee hearings held", chamber: "Committee" },
      { date: new Date(baseDate.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), description: "Passed by lower chamber", chamber: "Lower Chamber" },
      { date: new Date(baseDate.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), description: "Passed by upper chamber", chamber: "Upper Chamber" },
      { date: item.publishedDate, description: "Signed into law / Published in official gazette", chamber: "Executive" }
    );
  }
  
  return actions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function generateFullText(item: InternationalLegislation, jurisdiction: string): string {
  return `
${item.title.toUpperCase()}

${jurisdiction} - ${item.regulatoryBody}
${item.legislationType.toUpperCase()} - ${item.status}

SECTION 1. SHORT TITLE
This ${item.legislationType} may be cited as the "${item.title}".

SECTION 2. PURPOSE
The purpose of this legislation is to establish comprehensive requirements for ${item.regulatoryCategory.toLowerCase()} in consumer products, with particular focus on the ${item.category} sector.

${item.summary}

SECTION 3. DEFINITIONS
For the purposes of this ${item.legislationType}:
(a) "Covered product" means any consumer device that ${item.impactAreas.map(a => a.toLowerCase()).join(", ")}.
(b) "Manufacturer" means any person or entity that designs, manufactures, or imports covered products.
(c) "Regulatory authority" means ${item.regulatoryBody}.

SECTION 4. REQUIREMENTS
${item.bullets.map((bullet, idx) => `(${idx + 1}) ${bullet}`).join("\n")}

SECTION 5. COMPLIANCE
(a) All manufacturers of covered products shall comply with the requirements of this ${item.legislationType} within the timeframes specified.
(b) The regulatory authority shall establish procedures for demonstrating compliance.
(c) Non-compliance may result in penalties as specified in Section 7.

SECTION 6. IMPLEMENTATION
(a) This ${item.legislationType} shall take effect ${item.effectiveDate ? `on ${item.effectiveDate}` : "upon publication"}.
(b) The regulatory authority shall issue implementing regulations within 180 days.

SECTION 7. PENALTIES
Violations of this ${item.legislationType} may result in:
(a) Civil penalties up to $100,000 per violation
(b) Product recalls and market removal
(c) Criminal penalties for willful violations

SECTION 8. SEVERABILITY
If any provision of this ${item.legislationType} is held invalid, the remaining provisions shall continue in effect.

---
Published: ${item.publishedDate}
${item.effectiveDate ? `Effective: ${item.effectiveDate}` : ""}
${item.complianceDeadline ? `Compliance Deadline: ${item.complianceDeadline}` : ""}
`.trim();
}

// Generate realistic AI summary based on legislation content
function generateRealisticAISummary(item: InternationalLegislation): {
  whatChanges: string;
  whoImpacted: string;
  keyDeadline: string;
  riskExplanation: string;
  stakeholders: string[];
} {
  const isEnacted = item.legislativeCategory === "enacted";
  
  // Generate specific "what changes" based on regulatory category and bullets
  const whatChangesMap: Record<string, string[]> = {
    "Radio": [
      `Mandates RF emission testing to ${item.bullets[0]?.includes("6 GHz") ? "6 GHz WiFi 6E" : "updated FCC Part 15"} standards for wireless appliances`,
      `Requires re-certification of all WiFi/Bluetooth modules under new ${item.regulatoryBody} protocols`,
      `Imposes mandatory RF interference testing with 30-day pre-market notification`,
    ],
    "Product Safety": [
      `Requires dual thermal cutoff protection and ${item.bullets[0]?.includes("shutoff") ? "30-min auto-shutoff" : "enhanced ground fault protection"}`,
      `Mandates UL/ETL third-party safety certification with annual factory audits`,
      `New 1500W threshold triggers additional fire safety requirements for heating elements`,
    ],
    "Cybersecurity": [
      `Bans default passwords; each device must ship with unique credentials and secure boot`,
      `Requires 5-year minimum security patch support with mandatory vulnerability disclosure`,
      `Mandates AES-256 encryption for all data transmission and local storage`,
    ],
    "Battery": [
      `Requires UL 2054 certification for lithium-ion batteries with BMS monitoring`,
      `Mandates producer take-back programs with retail collection point requirements`,
      `New thermal runaway protection standards require 3-layer battery enclosure`,
    ],
    "Food Contact Material": [
      `Bans PFAS and BPA in all food-contact surfaces; heavy metal limits for heating coatings`,
      `Requires FDA-grade material certification with hot-liquid migration testing`,
      `Mandates third-party lab verification of material composition every 12 months`,
    ],
  };

  const categoryOptions = whatChangesMap[item.regulatoryCategory] || [item.bullets[0] || item.summary.slice(0, 80)];
  const whatChanges = categoryOptions[Math.floor(item.riskScore % categoryOptions.length)];

  // Generate specific "who impacted" based on impact areas
  const impactDetails: Record<string, string> = {
    "Wireless": "RF engineers, wireless module suppliers, testing labs",
    "Certification": "product certification teams, QA departments, notified bodies",
    "Testing": "third-party test facilities, in-house compliance teams",
    "Product Safety": "design engineers, manufacturing QC, insurance providers",
    "Manufacturing": "production lines, supply chain managers, component vendors",
    "Labeling": "packaging teams, marketing, retail partners",
    "Software": "firmware developers, IoT platform teams, OTA update systems",
    "Security": "cybersecurity teams, cloud service providers, customer support",
    "Firmware": "embedded systems engineers, bootloader developers",
    "Battery Safety": "battery suppliers, BMS engineers, transportation logistics",
    "Recycling": "reverse logistics, retail stores, waste management partners",
    "Costs": "finance teams, pricing strategy, margin planning",
    "Materials": "material sourcing, supplier qualification, R&D",
    "Data Security": "privacy officers, customer data teams, legal compliance",
    "Documentation": "technical writers, regulatory affairs, import/export",
    "Registration": "market access teams, local distributors",
    "Compliance": "regulatory affairs, legal, executive leadership",
    "Reporting": "quality assurance, incident response teams",
    "Import": "customs brokers, import compliance, supply chain",
    "Design": "industrial designers, mechanical engineers, tooling",
    "Retail": "sales channels, e-commerce platforms, brick-and-mortar",
  };

  const affectedTeams = item.impactAreas
    .slice(0, 3)
    .map(area => impactDetails[area] || area.toLowerCase())
    .join("; ");
  
  const whoImpacted = `Directly affects ${affectedTeams}. Estimated compliance cost: $${(item.riskScore * 1000 + 15000).toLocaleString()}-${(item.riskScore * 2500 + 50000).toLocaleString()} per SKU.`;

  // Generate specific timeline with real dates
  let keyDeadline: string;
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (isEnacted && item.effectiveDate) {
    const effDate = new Date(item.effectiveDate);
    const now = new Date();
    if (effDate <= now) {
      keyDeadline = `In force since ${formatDate(item.effectiveDate)}. Immediate compliance required for new market entries.`;
    } else {
      keyDeadline = `Effective ${formatDate(item.effectiveDate)}. ${Math.ceil((effDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))} days to achieve full compliance.`;
    }
  } else if (item.complianceDeadline) {
    const deadline = new Date(item.complianceDeadline);
    const now = new Date();
    const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    keyDeadline = `Compliance deadline: ${formatDate(item.complianceDeadline)}. ${daysRemaining} days remaining to implement required changes.`;
  } else if (!isEnacted) {
    keyDeadline = `Currently in ${item.status}. Expected passage Q${Math.ceil((new Date().getMonth() + 3) / 3)} ${new Date().getFullYear()}. Plan 6-month implementation runway.`;
  } else {
    keyDeadline = `Published ${formatDate(item.publishedDate)}. Immediate effect upon publication. Enforcement begins 90 days post-publication.`;
  }

  const riskExplanation = `${item.riskLevel.charAt(0).toUpperCase() + item.riskLevel.slice(1)} risk (${item.riskScore}/100): ${
    item.riskScore >= 80 ? "Major product redesign or re-certification likely required. Budget 4-6 months lead time." :
    item.riskScore >= 60 ? "Significant compliance investment needed. Documentation and testing updates required." :
    item.riskScore >= 40 ? "Moderate changes to existing compliance framework. Process updates recommended." :
    "Minor documentation updates. Existing products likely compliant with minimal changes."
  }`;

  return {
    whatChanges,
    whoImpacted,
    keyDeadline,
    riskExplanation,
    stakeholders: item.impactAreas
  };
}

// Convert international legislation to unified format with enriched data
export function convertToEnrichedUnified(
  items: InternationalLegislation[],
  jurisdiction: string,
  region: "NAM" | "LATAM" | "EU" | "GCC" | "APAC"
): UnifiedLegislationItem[] {
  return items.map(item => {
    const enrichedContent = generateFullContent(item, jurisdiction);
    const isEnacted = item.legislativeCategory === "enacted";
    const aiSummary = generateRealisticAISummary(item);
    
    return {
      id: item.id,
      title: item.title,
      identifier: item.id.toUpperCase().replace(/-/g, " "),
      summary: item.summary,
      bullets: item.bullets,
      region,
      jurisdictionCode: jurisdiction === "USA" && item.subJurisdiction ? item.subJurisdiction : jurisdiction,
      jurisdictionLevel: item.subJurisdiction ? "state" as const : "federal" as const,
      subnationalUnit: item.subJurisdiction,
      authority: item.regulatoryBody,
      authorityLabel: item.regulatoryBody,
      instrumentType: item.legislationType,
      hierarchyLevel: (item.legislationType === "law" || item.legislationType === "bill" ? "primary" : "secondary") as any,
      status: item.status,
      genericStatus: isEnacted ? "in-force" as const : "proposal" as const,
      isInForce: isEnacted,
      isPipeline: !isEnacted,
      publishedDate: item.publishedDate,
      effectiveDate: item.effectiveDate,
      complianceDeadline: item.complianceDeadline,
      riskLevel: item.riskLevel,
      riskScore: item.riskScore,
      policyArea: item.category,
      regulatoryCategory: item.regulatoryCategory,
      impactAreas: item.impactAreas,
      currentStageIndex: item.timeline?.findIndex(s => !s.completed) ?? undefined,
      aiSummary,
      ...enrichedContent
    } as UnifiedLegislationItem;
  });
}

// Pre-converted enriched datasets
export const enrichedUSAData = convertToEnrichedUnified(usStateBills, "USA", "NAM");
export const enrichedCanadaData = convertToEnrichedUnified(canadaLegislation, "Canada", "NAM");
export const enrichedJapanData = convertToEnrichedUnified(japanLegislation, "Japan", "APAC");
export const enrichedKoreaData = convertToEnrichedUnified(koreaLegislation, "Korea", "APAC");
export const enrichedTaiwanData = convertToEnrichedUnified(taiwanLegislation, "Taiwan", "APAC");
export const enrichedEUData = convertToEnrichedUnified([...euRegulations, ...euDirectives], "EU", "EU");

// GCC Countries - Individual datasets with unique IDs
export const enrichedUAEData = convertToEnrichedUnified(uaeLegislation, "UAE", "GCC");
export const enrichedSaudiData = convertToEnrichedUnified(saudiLegislation, "Saudi Arabia", "GCC");
export const enrichedOmanData = convertToEnrichedUnified(omanLegislation, "Oman", "GCC");
export const enrichedKuwaitData = convertToEnrichedUnified(kuwaitLegislation, "Kuwait", "GCC");
export const enrichedBahrainData = convertToEnrichedUnified(bahrainLegislation, "Bahrain", "GCC");
export const enrichedQatarData = convertToEnrichedUnified(qatarLegislation, "Qatar", "GCC");

// Combined GCC data - ensure unique IDs by prefixing
export const enrichedGCCData = [
  ...enrichedUAEData.map(item => ({ ...item, id: `uae-${item.id}` })),
  ...enrichedSaudiData.map(item => ({ ...item, id: `sa-${item.id}` })),
  ...enrichedOmanData.map(item => ({ ...item, id: `om-${item.id}` })),
  ...enrichedKuwaitData.map(item => ({ ...item, id: `kw-${item.id}` })),
  ...enrichedBahrainData.map(item => ({ ...item, id: `bh-${item.id}` })),
  ...enrichedQatarData.map(item => ({ ...item, id: `qa-${item.id}` }))
];

// Peru data - usando el nuevo sistema jurídico correcto
export const enrichedPeruData = convertPeruToUnified(peruLegislationData);

// Regulatory categories
export const regulatoryCategories = [
  "Radio",
  "Product Safety", 
  "Cybersecurity",
  "Battery",
  "Food Contact Material"
];

// Default filter presets
export const defaultPresets = [
  {
    id: "high-risk",
    name: "High Risk",
    description: "Show high-risk legislation",
    filters: { riskLevels: ["high"] as ("high" | "medium" | "low")[] }
  },
  {
    id: "upcoming-deadlines",
    name: "Upcoming Deadlines",
    description: "Items with deadlines in next 30 days",
    filters: { deadlinePreset: "next-30" as const }
  },
  {
    id: "pipeline-only",
    name: "Pipeline Only",
    description: "Show only pending legislation",
    filters: { lifecycle: "pipeline" as const }
  },
  {
    id: "in-force",
    name: "In Force",
    description: "Show enacted legislation",
    filters: { lifecycle: "in-force" as const }
  }
];
