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

// Convert international legislation to unified format with enriched data
export function convertToEnrichedUnified(
  items: InternationalLegislation[],
  jurisdiction: string,
  region: "NAM" | "LATAM" | "EU" | "GCC" | "APAC" | "JP"
): UnifiedLegislationItem[] {
  return items.map(item => {
    const enrichedContent = generateFullContent(item, jurisdiction);
    const isEnacted = item.legislativeCategory === "enacted";
    
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
      aiSummary: {
        whatChanges: item.bullets[0] || item.summary.slice(0, 100),
        whoImpacted: `Manufacturers and importers of ${item.impactAreas.join(", ")} products`,
        keyDeadline: item.complianceDeadline 
          ? `Compliance required by ${item.complianceDeadline}`
          : item.effectiveDate 
            ? `Effective ${item.effectiveDate}`
            : "Immediate effect upon publication",
        riskExplanation: `This ${item.legislationType} presents ${item.riskLevel} risk (score: ${item.riskScore}/100) due to its requirements for ${item.regulatoryCategory.toLowerCase()}.`,
        stakeholders: item.impactAreas
      },
      ...enrichedContent
    } as UnifiedLegislationItem;
  });
}

// Pre-converted enriched datasets
export const enrichedUSAData = convertToEnrichedUnified(usStateBills, "USA", "NAM");
export const enrichedCanadaData = convertToEnrichedUnified(canadaLegislation, "Canada", "NAM");
export const enrichedJapanData = convertToEnrichedUnified(japanLegislation, "Japan", "JP");
export const enrichedKoreaData = convertToEnrichedUnified(koreaLegislation, "Korea", "APAC");
export const enrichedTaiwanData = convertToEnrichedUnified(taiwanLegislation, "Taiwan", "APAC");
export const enrichedEUData = convertToEnrichedUnified([...euRegulations, ...euDirectives], "EU", "EU");

// GCC Countries - Individual datasets
export const enrichedUAEData = convertToEnrichedUnified(uaeLegislation, "UAE", "GCC");
export const enrichedSaudiData = convertToEnrichedUnified(saudiLegislation, "Saudi Arabia", "GCC");
export const enrichedOmanData = convertToEnrichedUnified(omanLegislation, "Oman", "GCC");
export const enrichedKuwaitData = convertToEnrichedUnified(kuwaitLegislation, "Kuwait", "GCC");
export const enrichedBahrainData = convertToEnrichedUnified(bahrainLegislation, "Bahrain", "GCC");
export const enrichedQatarData = convertToEnrichedUnified(qatarLegislation, "Qatar", "GCC");

// Combined GCC data
export const enrichedGCCData = [
  ...enrichedUAEData,
  ...enrichedSaudiData,
  ...enrichedOmanData,
  ...enrichedKuwaitData,
  ...enrichedBahrainData,
  ...enrichedQatarData
];

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
    filters: { riskLevels: ["high"] as ("high" | "medium" | "low")[] }
  },
  {
    id: "upcoming-deadlines",
    name: "Upcoming Deadlines",
    filters: { deadlinePreset: "next-30" as const }
  },
  {
    id: "pipeline-only",
    name: "Pipeline Only",
    filters: { lifecycle: "pipeline" as const }
  },
  {
    id: "in-force",
    name: "In Force",
    filters: { lifecycle: "in-force" as const }
  }
];
