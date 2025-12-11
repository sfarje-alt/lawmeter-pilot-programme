import { UnifiedLegislationItem } from "@/types/unifiedLegislation";
import { 
  JurisdictionConfig,
  usaConfig, 
  euConfig, 
  latamConfig, 
  gccConfig, 
  japanConfig, 
  apacConfig, 
  canadaConfig,
  mapStatusToGeneric,
  getInstrumentType
} from "@/config/jurisdictionConfig";
import { RegionCode } from "@/components/regions/RegionConfig";
import { InternationalLegislation } from "./mockInternationalLegislation";
import { USLegislationItem } from "@/types/usaLegislation";
import { usaLegislationData, ExtendedUSLegislationItem } from "./usaLegislationMockData";

// Convert International Legislation to Unified format
export function convertInternationalToUnified(
  items: InternationalLegislation[],
  config: JurisdictionConfig
): UnifiedLegislationItem[] {
  return items.map(item => {
    const instrumentType = config.instrumentTypes.find(t => 
      t.label.toLowerCase().includes(item.legislationType.toLowerCase()) ||
      item.legislationType.toLowerCase().includes(t.id.toLowerCase())
    ) || config.instrumentTypes[0];

    return {
      id: item.id,
      identifier: item.localTerminology || item.id,
      title: item.title,
      summary: item.summary,
      bullets: item.bullets,
      region: config.region,
      jurisdictionCode: config.code,
      jurisdictionLevel: item.subJurisdiction === "Federal" ? "federal" : item.subJurisdiction ? "state" : "federal",
      subnationalUnit: item.subJurisdiction && item.subJurisdiction !== "Federal" ? item.subJurisdiction : undefined,
      instrumentType: instrumentType.id,
      hierarchyLevel: instrumentType.hierarchyLevel,
      status: item.status,
      genericStatus: mapStatusToGeneric(config, item.status),
      isInForce: item.legislativeCategory === "enacted",
      isPipeline: item.legislativeCategory === "pending",
      authority: item.regulatoryBody,
      authorityLabel: item.regulatoryBody,
      publishedDate: item.publishedDate,
      effectiveDate: item.effectiveDate,
      complianceDeadline: item.complianceDeadline,
      riskLevel: item.riskLevel,
      riskScore: item.riskScore,
      policyArea: item.regulatoryCategory,
      regulatoryCategory: item.regulatoryCategory,
      impactAreas: item.impactAreas,
      currentStageIndex: item.timeline 
        ? item.timeline.filter(s => s.completed).length - 1 
        : undefined,
      aiSummary: {
        whatChanges: item.bullets[0] || item.summary.slice(0, 100),
        whoImpacted: `Impacts ${item.impactAreas.slice(0, 2).join(", ")} sectors`,
        keyDeadline: item.complianceDeadline 
          ? `Compliance by ${new Date(item.complianceDeadline).toLocaleDateString()}`
          : item.effectiveDate 
            ? `Effective since ${new Date(item.effectiveDate).toLocaleDateString()}`
            : "Timeline pending",
        generatedAt: new Date().toISOString(),
        riskScore: item.riskScore,
        riskCategory: item.riskLevel
      }
    };
  });
}

// Convert USA Legislation to Unified format
export function convertUSAToUnified(
  items: ExtendedUSLegislationItem[]
): UnifiedLegislationItem[] {
  return items.map(item => {
    const instrumentType = usaConfig.instrumentTypes.find(t => 
      t.id === item.documentType
    ) || usaConfig.instrumentTypes[0];

    return {
      id: item.id,
      identifier: item.localTerminology || item.id,
      title: item.title,
      summary: item.summary,
      bullets: item.bullets,
      region: "NAM" as RegionCode,
      jurisdictionCode: "USA",
      jurisdictionLevel: item.authority === "congress" ? "federal" : 
        item.authority === "federal-agency" ? "federal" : "state",
      subnationalUnit: item.subJurisdiction,
      instrumentType: instrumentType.id,
      hierarchyLevel: instrumentType.hierarchyLevel,
      status: item.status,
      genericStatus: mapStatusToGeneric(usaConfig, item.status),
      isInForce: item.isInForce,
      isPipeline: item.isPipeline,
      authority: item.authority,
      authorityLabel: item.regulatoryBody,
      publishedDate: item.publishedDate,
      effectiveDate: item.effectiveDate,
      complianceDeadline: item.complianceDeadline,
      riskLevel: item.riskLevel,
      riskScore: item.riskScore,
      policyArea: item.regulatoryCategory,
      regulatoryCategory: item.regulatoryCategory,
      impactAreas: item.impactAreas,
      aiSummary: {
        whatChanges: item.bullets[0] || item.summary.slice(0, 100),
        whoImpacted: `Impacts ${item.impactAreas?.slice(0, 2).join(", ") || "various"} sectors`,
        keyDeadline: item.complianceDeadline 
          ? `Compliance by ${new Date(item.complianceDeadline).toLocaleDateString()}`
          : item.effectiveDate 
            ? `Effective since ${new Date(item.effectiveDate).toLocaleDateString()}`
            : "Timeline pending",
        generatedAt: new Date().toISOString(),
        riskScore: item.riskScore,
        riskCategory: item.riskLevel
      }
    };
  });
}

// Pre-converted datasets
export const unifiedUSAData = convertUSAToUnified(usaLegislationData);

// Import and convert all international data
import {
  usStateBills,
  canadaLegislation,
  japanLegislation,
  koreaLegislation,
  taiwanLegislation,
  euRegulations,
  euDirectives,
  euParliament,
  euCouncil,
  uaeLegislation,
  saudiLegislation,
  omanLegislation,
  kuwaitLegislation,
  bahrainLegislation,
  qatarLegislation
} from "./mockInternationalLegislation";

// Convert all datasets
export const unifiedUSStateData = convertInternationalToUnified(usStateBills, usaConfig);
export const unifiedCanadaData = convertInternationalToUnified(canadaLegislation, canadaConfig);
export const unifiedJapanData = convertInternationalToUnified(japanLegislation, japanConfig);
export const unifiedKoreaData = convertInternationalToUnified(koreaLegislation, apacConfig);
export const unifiedTaiwanData = convertInternationalToUnified(taiwanLegislation, apacConfig);
export const unifiedEUData = convertInternationalToUnified([
  ...euRegulations, 
  ...euDirectives, 
  ...euParliament, 
  ...euCouncil
], euConfig);
export const unifiedGCCData = convertInternationalToUnified([
  ...uaeLegislation,
  ...saudiLegislation,
  ...omanLegislation,
  ...kuwaitLegislation,
  ...bahrainLegislation,
  ...qatarLegislation
], gccConfig);

// Combined USA data (federal + state)
export const unifiedUSACombinedData = [...unifiedUSAData, ...unifiedUSStateData];

// Regulatory categories for filters
export const regulatoryCategories = [
  "Radio",
  "Product Safety", 
  "Cybersecurity",
  "Battery",
  "Food Contact Material"
];

// Default presets
export const defaultPresets = [
  {
    id: "high-risk",
    name: "High Risk",
    description: "Show only high risk items",
    filters: { riskLevels: ["high" as const] }
  },
  {
    id: "upcoming-deadlines",
    name: "Upcoming Deadlines",
    description: "Items with deadlines in next 90 days",
    filters: { deadlinePreset: "next-90" as const }
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
    description: "Show only enacted legislation",
    filters: { lifecycle: "in-force" as const }
  }
];
