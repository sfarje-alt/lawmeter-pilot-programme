// Costa Rica enriched data converter for unified legislation system
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";
import { costaRicaBills } from "./costaRicaBills";
import { BillItem } from "@/types/legislation";

// Convert Costa Rica bills to unified format
export function convertCostaRicaBillsToUnified(bills: BillItem[]): UnifiedLegislationItem[] {
  return bills.map((bill, index) => ({
    id: `cr-bill-${bill.id}`,
    title: bill.title || bill.titulo || "",
    identifier: `Proyecto ${bill.id}`,
    summary: bill.summary || bill.resumen || "",
    bullets: bill.bullets || bill.puntosImportantes || [],
    region: "LATAM" as const,
    jurisdictionCode: "CR",
    jurisdictionLevel: "federal" as const,
    subnationalUnit: bill.firmantePrincipal?.provincia,
    authority: bill.assignedCommission || bill.comisionAsignada || "Asamblea Legislativa",
    authorityLabel: bill.assignedCommission || bill.comisionAsignada || "Asamblea Legislativa",
    instrumentType: "bill",
    hierarchyLevel: "primary" as const,
    status: bill.status || bill.estado || "",
    genericStatus: "proposal" as const,
    isInForce: false,
    isPipeline: true,
    publishedDate: parseCostaRicaDate(bill.presentationDate || bill.fechaPresentacion),
    effectiveDate: undefined,
    complianceDeadline: undefined,
    riskLevel: (bill.risk_level || bill.nivelRiesgo === "alto" ? "high" : bill.nivelRiesgo === "medio" ? "medium" : "low") as "high" | "medium" | "low",
    riskScore: bill.risk_score || bill.puntajeRiesgo || 50,
    policyArea: bill.portfolio || bill.cartera || "",
    regulatoryCategory: categorizeCostaRicaBill(bill),
    impactAreas: bill.categories || bill.categorias || [],
    currentStageIndex: getCostaRicaStageIndex(bill.status || bill.estado || ""),
    aiSummary: {
      whatChanges: bill.bullets?.[0] || bill.puntosImportantes?.[0] || bill.summary || "",
      whoImpacted: `Entidades reguladas en ${(bill.categories || bill.categorias || []).join(", ")}`,
      keyDeadline: `Presentado ${bill.presentationDate || bill.fechaPresentacion}`,
      riskExplanation: `Este proyecto presenta riesgo ${bill.nivelRiesgo || bill.risk_level} (puntuación: ${bill.puntajeRiesgo || bill.risk_score}/100).`,
      stakeholders: bill.stakeholders?.map(s => s.organization) || []
    },
    // Enriched content
    votingRecords: bill.votingRecords?.map(vr => ({
      chamber: vr.stage,
      date: vr.date,
      yea: vr.votesFor,
      nay: vr.votesAgainst,
      abstain: vr.abstentions,
      passed: vr.passed
    })),
    sponsors: [
      ...(bill.firmantePrincipal ? [{
        name: bill.firmantePrincipal.nombre,
        party: bill.firmantePrincipal.partidoPolitico,
        state: bill.firmantePrincipal.provincia,
        role: "Firmante Principal"
      }] : []),
      ...(bill.coProponentes?.map(cp => ({
        name: cp.nombre,
        party: cp.partidoPolitico,
        state: cp.provincia,
        role: "Co-proponente"
      })) || [])
    ],
    actions: [
      {
        date: parseCostaRicaDate(bill.presentationDate || bill.fechaPresentacion),
        description: "Proyecto presentado a la Asamblea Legislativa",
        chamber: "Asamblea Legislativa"
      },
      ...(bill.lastActionDate !== bill.presentationDate ? [{
        date: parseCostaRicaDate(bill.lastActionDate || bill.fechaUltimaAccion),
        description: `Estado actual: ${bill.status || bill.estado}`,
        chamber: bill.stageLocation || "Asamblea Legislativa"
      }] : [])
    ],
    summaries: [
      {
        versionName: "Resumen Oficial",
        text: bill.proposito || bill.summary || bill.resumen || ""
      }
    ],
    fullText: generateCostaRicaFullText(bill),
    sourceUrl: `https://www.asamblea.go.cr/proyectos/${bill.id}`
  }));
}

function parseCostaRicaDate(dateStr: string | undefined): string {
  if (!dateStr) return new Date().toISOString().slice(0, 10);
  
  // Parse "15 ENE, 2025" format
  const months: Record<string, string> = {
    'ENE': '01', 'FEB': '02', 'MAR': '03', 'ABR': '04',
    'MAY': '05', 'JUN': '06', 'JUL': '07', 'AGO': '08',
    'SEP': '09', 'OCT': '10', 'NOV': '11', 'DIC': '12'
  };
  
  const match = dateStr.match(/(\d{1,2})\s+(\w{3}),?\s+(\d{4})/);
  if (match) {
    const [, day, monthStr, year] = match;
    const month = months[monthStr.toUpperCase()] || '01';
    return `${year}-${month}-${day.padStart(2, '0')}`;
  }
  
  return new Date().toISOString().slice(0, 10);
}

function categorizeCostaRicaBill(bill: BillItem): string {
  const categories = bill.categories || bill.categorias || [];
  const title = (bill.title || bill.titulo || "").toLowerCase();
  
  if (categories.some(c => c.toLowerCase().includes("ciberseguridad")) || title.includes("ciberseguridad")) {
    return "Cybersecurity";
  }
  if (categories.some(c => c.toLowerCase().includes("banca") || c.toLowerCase().includes("financier"))) {
    return "Product Safety";
  }
  if (categories.some(c => c.toLowerCase().includes("consumidor"))) {
    return "Product Safety";
  }
  return "Product Safety";
}

function getCostaRicaStageIndex(status: string): number {
  const stages = [
    "Presentado",
    "En comisión",
    "Aprobado en Primer Debate",
    "Aprobado en Segundo Debate",
    "Sancionado"
  ];
  
  const idx = stages.findIndex(s => status.toLowerCase().includes(s.toLowerCase()));
  return idx >= 0 ? idx : 0;
}

function generateCostaRicaFullText(bill: BillItem): string {
  return `
${(bill.title || bill.titulo || "").toUpperCase()}

REPÚBLICA DE COSTA RICA - ASAMBLEA LEGISLATIVA
PROYECTO DE LEY N° ${bill.id}

SECCIÓN 1. TÍTULO
Este proyecto de ley puede citarse como "${bill.title || bill.titulo}".

SECCIÓN 2. PROPÓSITO
${bill.proposito || bill.summary || bill.resumen || ""}

SECCIÓN 3. PUNTOS PRINCIPALES
${(bill.bullets || bill.puntosImportantes || []).map((b, i) => `(${i + 1}) ${b}`).join("\n")}

SECCIÓN 4. COMISIÓN ASIGNADA
${bill.assignedCommission || bill.comisionAsignada || "Pendiente de asignación"}

SECCIÓN 5. FIRMANTE PRINCIPAL
${bill.firmantePrincipal?.nombre || "N/A"} - ${bill.firmantePrincipal?.partidoPolitico || ""}
Provincia: ${bill.firmantePrincipal?.provincia || "N/A"}

---
Fecha de presentación: ${bill.presentationDate || bill.fechaPresentacion}
Última acción: ${bill.lastActionDate || bill.fechaUltimaAccion}
Estado: ${bill.status || bill.estado}
`.trim();
}

// Pre-converted Costa Rica data
export const enrichedCostaRicaData = convertCostaRicaBillsToUnified(costaRicaBills);
