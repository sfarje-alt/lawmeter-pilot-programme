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
import { costaRicaLegislationData, convertCostaRicaToUnified } from "./costaRicaLegislationData";
import { generateJurisdictionSpecificContent } from "./jurisdictionEnrichedContent";

// Convert international legislation to unified format with jurisdiction-specific enriched data
export function convertToEnrichedUnified(
  items: InternationalLegislation[],
  jurisdiction: string,
  region: "NAM" | "LATAM" | "EU" | "GCC" | "APAC"
): UnifiedLegislationItem[] {
  return items.map(item => {
    // Use new jurisdiction-specific content generator
    const enrichedContent = generateJurisdictionSpecificContent(item, jurisdiction);
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

// Costa Rica data - usando el sistema jurídico correcto (Estado unitario)
export const enrichedCostaRicaData = convertCostaRicaToUnified(costaRicaLegislationData);

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
