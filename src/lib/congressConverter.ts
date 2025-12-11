// Converter for Congress API bills to UnifiedLegislationItem format
import { CongressBill } from "@/types/congress";
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";

// Derive bill status from latest action
function deriveBillStatus(bill: CongressBill): { status: string; stageIndex: number; isInForce: boolean } {
  const action = bill.latestAction?.text?.toLowerCase() || "";
  const hasLaw = bill.laws && bill.laws.length > 0;
  
  if (hasLaw) {
    return { status: "Became Law", stageIndex: 5, isInForce: true };
  }
  
  if (action.includes("became public law") || action.includes("signed by president")) {
    return { status: "Became Law", stageIndex: 5, isInForce: true };
  }
  if (action.includes("presented to president") || action.includes("to president")) {
    return { status: "To President", stageIndex: 4, isInForce: false };
  }
  if (action.includes("passed senate") || action.includes("received in the senate")) {
    return { status: "Passed Senate", stageIndex: 3, isInForce: false };
  }
  if (action.includes("passed house") || action.includes("received in the house")) {
    return { status: "Passed House", stageIndex: 2, isInForce: false };
  }
  if (action.includes("referred to") || action.includes("committee")) {
    return { status: "In Committee", stageIndex: 1, isInForce: false };
  }
  
  return { status: "Introduced", stageIndex: 0, isInForce: false };
}

// Get bill type label
function getBillTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    hr: "H.R.",
    s: "S.",
    hjres: "H.J.Res.",
    sjres: "S.J.Res.",
    hconres: "H.Con.Res.",
    sconres: "S.Con.Res.",
    hres: "H.Res.",
    sres: "S.Res."
  };
  return labels[type.toLowerCase()] || type.toUpperCase();
}

// Calculate risk based on policy area and status
function calculateRisk(bill: CongressBill): { level: "high" | "medium" | "low"; score: number } {
  const policyArea = bill.policyArea?.name?.toLowerCase() || "";
  const status = deriveBillStatus(bill);
  
  // Higher risk for pipeline bills with recent activity
  let baseScore = 40;
  
  // Policy areas relevant to consumer electronics
  const highRiskAreas = ["commerce", "energy", "science", "technology", "communications", "consumer protection"];
  const mediumRiskAreas = ["taxation", "trade", "government", "finance"];
  
  if (highRiskAreas.some(area => policyArea.includes(area))) {
    baseScore += 30;
  } else if (mediumRiskAreas.some(area => policyArea.includes(area))) {
    baseScore += 15;
  }
  
  // Increase risk for bills further in the pipeline
  baseScore += status.stageIndex * 8;
  
  // Cap at 95
  const score = Math.min(95, baseScore);
  
  if (score >= 70) return { level: "high", score };
  if (score >= 45) return { level: "medium", score };
  return { level: "low", score };
}

// Categorize bill by regulatory category
function categorizeByRegulatory(bill: CongressBill): string {
  const title = bill.title?.toLowerCase() || "";
  const policyArea = bill.policyArea?.name?.toLowerCase() || "";
  const subjects = bill.subjects?.legislativeSubjects?.map(s => s.name.toLowerCase()) || [];
  const allText = `${title} ${policyArea} ${subjects.join(" ")}`;
  
  if (allText.includes("cyber") || allText.includes("digital") || allText.includes("data privacy") || allText.includes("information security")) {
    return "Cybersecurity";
  }
  if (allText.includes("radio") || allText.includes("spectrum") || allText.includes("wireless") || allText.includes("fcc") || allText.includes("telecommunications")) {
    return "Radio Regulations";
  }
  if (allText.includes("battery") || allText.includes("lithium") || allText.includes("energy storage")) {
    return "Battery Regulations";
  }
  if (allText.includes("food") || allText.includes("fda") || allText.includes("kitchen") || allText.includes("appliance")) {
    return "Food Contact Material";
  }
  if (allText.includes("safety") || allText.includes("consumer") || allText.includes("product")) {
    return "Product Safety";
  }
  
  return "Product Safety";
}

export function convertCongressBillToUnified(bill: CongressBill): UnifiedLegislationItem {
  const statusInfo = deriveBillStatus(bill);
  const risk = calculateRisk(bill);
  const billIdentifier = `${getBillTypeLabel(bill.type)} ${bill.number}`;
  
  return {
    id: `congress-${bill.congress}-${bill.type}-${bill.number}`,
    title: bill.title,
    identifier: billIdentifier,
    summary: bill.latestAction?.text || "",
    bullets: [],
    region: "NAM" as const,
    jurisdictionCode: "USA",
    jurisdictionLevel: "federal" as const,
    subnationalUnit: undefined,
    authority: "U.S. Congress",
    authorityLabel: bill.originChamber === "House" ? "U.S. House of Representatives" : "U.S. Senate",
    instrumentType: "bill",
    hierarchyLevel: "primary" as const,
    status: statusInfo.status,
    genericStatus: statusInfo.isInForce ? "in-force" as const : "proposal" as const,
    isInForce: statusInfo.isInForce,
    isPipeline: !statusInfo.isInForce,
    publishedDate: bill.introducedDate || bill.updateDate.slice(0, 10),
    effectiveDate: statusInfo.isInForce ? bill.latestAction?.actionDate : undefined,
    complianceDeadline: undefined,
    riskLevel: risk.level,
    riskScore: risk.score,
    policyArea: bill.policyArea?.name || "General",
    regulatoryCategory: categorizeByRegulatory(bill),
    impactAreas: bill.subjects?.legislativeSubjects?.map(s => s.name) || [],
    currentStageIndex: statusInfo.stageIndex,
    aiSummary: {
      whatChanges: bill.title,
      whoImpacted: bill.policyArea?.name 
        ? `Entities in ${bill.policyArea.name} sector` 
        : "Various stakeholders",
      keyDeadline: statusInfo.isInForce 
        ? `Enacted on ${bill.latestAction?.actionDate}` 
        : `Last action: ${bill.latestAction?.actionDate}`,
      riskExplanation: `This ${statusInfo.status.toLowerCase()} bill has a ${risk.level} risk score of ${risk.score}/100 based on policy area relevance and legislative progress.`,
      stakeholders: [
        bill.originChamber,
        bill.policyArea?.name || "General"
      ].filter(Boolean) as string[]
    },
    // Enriched content - populated when viewing details
    votingRecords: [],
    sponsors: bill.sponsors?.map(s => ({
      name: s.fullName,
      party: s.party,
      state: s.state,
      role: "Sponsor"
    })) || [],
    actions: [{
      date: bill.latestAction?.actionDate || bill.updateDate.slice(0, 10),
      description: bill.latestAction?.text || "Bill introduced",
      chamber: bill.originChamber
    }],
    summaries: [],
    fullText: undefined,
    sourceUrl: bill.url,
    originalData: bill
  };
}

export function convertCongressBillsToUnified(bills: CongressBill[]): UnifiedLegislationItem[] {
  return bills.map(convertCongressBillToUnified);
}
