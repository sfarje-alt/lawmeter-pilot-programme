// Temporal - helper para actualizar baseBills
import { BillItem, VotingRecord, RegistroVotacion } from "@/types/legislation";

// Helper function to convert VotingRecord to RegistroVotacion
function toRegistroVotacion(vr: VotingRecord): RegistroVotacion {
  return {
    fecha: vr.date,
    etapa: vr.stage,
    votosAFavor: vr.votesFor,
    votosEnContra: vr.votesAgainst,
    abstenciones: vr.abstentions,
    aprobado: vr.passed,
    votosDetallados: vr.mpVotes?.map(v => ({
      nombreDiputado: v.mpName,
      partido: v.party,
      voto: v.vote === "for" ? "a_favor" as const : v.vote === "against" ? "en_contra" as const : "abstencion" as const
    }))
  };
}

// Helper to create a compatible bill
function createBill(data: any): BillItem {
  return {
    ...data,
    titulo: data.title,
    estado: data.status,
    fechaPresentacion: data.presentationDate,
    fechaUltimaAccion: data.lastActionDate,
    resumen: data.summary,
    puntosImportantes: data.bullets,
    nivelRiesgo: data.risk_level === "high" ? "alto" : data.risk_level === "medium" ? "medio" : "bajo",
    puntajeRiesgo: data.risk_score,
    cartera: data.portfolio,
    registrosVotacion: data.votingRecords?.map(toRegistroVotacion),
    interesados: data.stakeholders?.map((s: any) => ({
      nombre: s.name,
      organizacion: s.organization,
      posicion: s.position === "support" ? "apoyo" as const : s.position === "oppose" ? "oposicion" as const : "neutral" as const,
      declaracion: s.statement
    })),
    urlLeyMadre: data.motherActLink,
    urlLeyModificatoria: data.amendmentActLink,
    urlProyecto: data.projectUrl,
    comisionAsignada: data.assignedCommission,
    urlComision: data.commissionUrl,
    firmantePrincipal: data.principalSigner,
    coProponentes: data.coSigners,
    categorias: data.categories,
    textosProyecto: data.projectTexts?.map((pt: any) => ({
      fecha: pt.date,
      tipoTexto: pt.textType,
      urlPDF: pt.pdfUrl
    }))
  };
}

export { createBill, toRegistroVotacion };
