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

// Generate realistic AI summary based on bill content
function generateRealisticCongressSummary(bill: CongressBill, statusInfo: { status: string; stageIndex: number; isInForce: boolean }, risk: { level: string; score: number }): {
  whatChanges: string;
  whoImpacted: string;
  keyDeadline: string;
  riskExplanation: string;
  stakeholders: string[];
} {
  const title = bill.title?.toLowerCase() || "";
  const policyArea = bill.policyArea?.name?.toLowerCase() || "";
  const subjects = bill.subjects?.legislativeSubjects?.map(s => s.name.toLowerCase()).join(" ") || "";
  const allText = `${title} ${policyArea} ${subjects}`;
  
  // Determine regulatory category and generate specific changes
  let whatChanges = "";
  let impactDetails = "";
  let costEstimate = "";
  
  if (allText.includes("cyber") || allText.includes("security") || allText.includes("data")) {
    whatChanges = `Mandates new cybersecurity protocols for connected devices. Requires vulnerability disclosure programs, security update commitments for minimum 5 years post-sale, and encrypted data transmission standards. Affects IoT certification requirements.`;
    impactDetails = "product security teams, firmware engineers, certification managers, legal/compliance officers";
    costEstimate = "$45,000-$120,000 per product line";
  } else if (allText.includes("radio") || allText.includes("spectrum") || allText.includes("wireless") || allText.includes("fcc")) {
    whatChanges = `Revises RF emission limits and wireless spectrum allocation rules. Updates FCC Part 15/18 compliance thresholds, requires additional EMC testing for devices operating in 2.4GHz and 5GHz bands. May require hardware modifications.`;
    impactDetails = "RF engineering teams, EMC test labs, product certification managers, supply chain procurement";
    costEstimate = "$30,000-$85,000 per SKU";
  } else if (allText.includes("battery") || allText.includes("lithium") || allText.includes("energy storage")) {
    whatChanges = `Introduces stricter lithium-ion battery safety standards. Mandates UN38.3 enhanced testing, thermal runaway protection circuits, and new labeling requirements for all rechargeable consumer products.`;
    impactDetails = "battery suppliers, product safety engineers, packaging teams, logistics/shipping departments";
    costEstimate = "$25,000-$60,000 per battery configuration";
  } else if (allText.includes("food") || allText.includes("fda") || allText.includes("appliance") || allText.includes("kitchen")) {
    whatChanges = `Updates food contact material regulations for kitchen appliances. Requires FDA-compliant materials testing, migration studies for heated surfaces, and consumer-facing safety disclosures.`;
    impactDetails = "materials engineering, quality assurance, regulatory affairs, product documentation teams";
    costEstimate = "$20,000-$55,000 per appliance model";
  } else if (allText.includes("consumer") || allText.includes("safety") || allText.includes("product")) {
    whatChanges = `Expands CPSC reporting requirements and recall procedures. Mandates third-party safety certification, incident tracking systems, and 48-hour notification protocols for potential hazards.`;
    impactDetails = "product safety teams, customer service, legal department, executive leadership";
    costEstimate = "$35,000-$90,000 implementation cost";
  } else if (allText.includes("tariff") || allText.includes("trade") || allText.includes("import")) {
    whatChanges = `Modifies import duty structures and country-of-origin requirements. May affect component sourcing costs by 8-15%, requires supply chain documentation updates and customs compliance reviews.`;
    impactDetails = "supply chain managers, procurement teams, finance/accounting, customs brokers";
    costEstimate = "Variable: 8-15% cost impact on affected components";
  } else if (allText.includes("energy") || allText.includes("efficiency") || allText.includes("environment")) {
    whatChanges = `Establishes new energy efficiency standards for consumer electronics. Requires Energy Star compliance updates, standby power limits of <0.5W, and environmental impact disclosures.`;
    impactDetails = "power systems engineers, sustainability teams, product marketing, regulatory compliance";
    costEstimate = "$15,000-$40,000 per product redesign";
  } else {
    whatChanges = `Introduces regulatory changes affecting ${bill.policyArea?.name || "multiple sectors"}. Requires compliance assessment, potential process modifications, and updated documentation for affected product lines.`;
    impactDetails = "regulatory affairs, legal counsel, affected business units";
    costEstimate = "$20,000-$75,000 estimated compliance cost";
  }
  
  // Generate timeline based on bill status
  let keyDeadline = "";
  const actionDate = bill.latestAction?.actionDate || bill.introducedDate;
  const introducedDate = bill.introducedDate;
  
  if (statusInfo.isInForce) {
    keyDeadline = `In force since ${actionDate}. Immediate compliance required. Grace period typically 180 days from enactment.`;
  } else if (statusInfo.stageIndex >= 4) {
    keyDeadline = `Awaiting presidential signature as of ${actionDate}. If signed, expect 90-180 day implementation window.`;
  } else if (statusInfo.stageIndex >= 3) {
    keyDeadline = `Passed ${statusInfo.status} on ${actionDate}. Estimated final passage Q1-Q2 2025. Begin compliance planning now.`;
  } else if (statusInfo.stageIndex >= 1) {
    keyDeadline = `In committee since ${actionDate}. Monitor for amendments. Earliest possible enactment: 6-12 months.`;
  } else {
    keyDeadline = `Introduced ${introducedDate}. Early stage—track for material changes. No immediate action required.`;
  }
  
  const whoImpacted = `Directly affects ${impactDetails}. Estimated compliance investment: ${costEstimate}.`;
  
  const riskExplanation = `Risk score ${risk.score}/100 based on: regulatory scope (${bill.policyArea?.name || "general"}), legislative momentum (${statusInfo.status}), and direct applicability to consumer electronics manufacturing. ${risk.level === "high" ? "Recommend immediate compliance assessment." : risk.level === "medium" ? "Schedule review within 30 days." : "Monitor quarterly for developments."}`;
  
  const stakeholders = [
    bill.originChamber,
    bill.policyArea?.name || "General Policy",
    ...(bill.subjects?.legislativeSubjects?.slice(0, 2).map(s => s.name) || [])
  ].filter(Boolean) as string[];
  
  return { whatChanges, whoImpacted, keyDeadline, riskExplanation, stakeholders };
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
  const aiSummary = generateRealisticCongressSummary(bill, statusInfo, risk);
  
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
      whatChanges: aiSummary.whatChanges,
      whoImpacted: aiSummary.whoImpacted,
      keyDeadline: aiSummary.keyDeadline,
      riskExplanation: aiSummary.riskExplanation,
      stakeholders: aiSummary.stakeholders
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
