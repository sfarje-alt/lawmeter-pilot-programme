// Tipos para el sistema jurídico de Costa Rica (Estado unitario)

// ========== NIVELES JURISDICCIONALES ==========
// Costa Rica NO es un Estado federal. Estos son los niveles normativos reales:
export type CostaRicaNivel = "nacional" | "municipal" | "institucional";

// ========== TIPO DE EMISOR ==========
// Diferencia crucial: quién dicta la norma vs quién la aplica/fiscaliza
export type CostaRicaTipoEmisor = 
  | "legislativo"      // Asamblea Legislativa
  | "ejecutivo"        // Presidente + Ministro(s)
  | "municipal"        // Municipalidades (Concejos Municipales)
  | "regulador"        // Entes reguladores: CONASSIF, SUGEF, SUGEVAL, SUPEN, ARESEP, INTECO
  | "autonomo";        // Instituciones autónomas: ICE, INS, CCSS, bancos estatales

// ========== TIPOS DE NORMA PARA COSTA RICA ==========
export type CostaRicaTipoNorma = 
  | "proyecto_ley"           // Proyecto de ley en trámite
  | "ley"                    // Ley vigente
  | "decreto_ejecutivo"      // Decreto del Poder Ejecutivo
  | "reglamento"             // Reglamento (de ley o autónomo)
  | "resolucion"             // Resolución/Directriz administrativa
  | "acuerdo"                // Acuerdo ministerial o de junta directiva
  | "ordenanza_municipal"    // Ordenanza de Concejo Municipal
  | "reglamento_municipal"   // Reglamento municipal
  | "normativa_regulatoria"  // Normativa de entes reguladores (CONASSIF, ARESEP, etc.)
  | "circular";              // Circular (soft-law)

// ========== ESTADOS PARA PROYECTOS DE LEY ==========
export type CostaRicaEstadoProyecto = 
  | "en_tramite"                // Estado genérico: en proceso legislativo
  | "presentado"                // Ingresado a Asamblea
  | "dictamen_comision"         // En comisión, con dictamen
  | "primer_debate"             // Aprobado en primer debate
  | "segundo_debate"            // Aprobado en segundo debate
  | "enviado_ejecutivo"         // Enviado al Poder Ejecutivo para sanción
  | "sancionado"                // Firmado por Presidente
  | "vetado"                    // Vetado por Poder Ejecutivo
  | "publicado_gaceta"          // Publicado en La Gaceta (entra en vigencia)
  | "archivado"                 // Archivado/Retirado
  | "consulta_publica";         // En consulta pública

// ========== ESTADOS PARA NORMAS VIGENTES ==========
export type CostaRicaEstadoNorma = 
  | "vigente"
  | "modificada"
  | "derogada"
  | "suspendida"
  | "en_consulta";

// ========== ETAPAS DEL PROCESO LEGISLATIVO ==========
export const ETAPAS_PROCESO_LEGISLATIVO_CR: string[] = [
  "Presentado",
  "En Comisión",
  "Dictaminado",
  "Primer Debate",
  "Segundo Debate",
  "Enviado al Ejecutivo",
  "Sancionado/Vetado",
  "Publicado (La Gaceta)"
];

// Ruta alternativa con veto
export const ETAPAS_CON_VETO_CR: string[] = [
  "Presentado",
  "En Comisión",
  "Dictaminado",
  "Primer Debate",
  "Segundo Debate",
  "Enviado al Ejecutivo",
  "Vetado",
  "Resellado o Archivado"
];

// ========== PROVINCIAS DE COSTA RICA ==========
// Las provincias NO son un nivel normativo autónomo
export const PROVINCIAS_CR = [
  { code: "SJ", name: "San José" },
  { code: "AL", name: "Alajuela" },
  { code: "CA", name: "Cartago" },
  { code: "HE", name: "Heredia" },
  { code: "GU", name: "Guanacaste" },
  { code: "PU", name: "Puntarenas" },
  { code: "LI", name: "Limón" }
] as const;

// ========== CANTONES PRINCIPALES ==========
// La competencia normativa municipal se ejerce por cantón
export const CANTONES_CR: Record<string, string[]> = {
  "SJ": ["San José Central", "Escazú", "Desamparados", "Puriscal", "Tarrazú", "Aserrí", "Mora", "Goicoechea", "Santa Ana", "Alajuelita", "Vázquez de Coronado", "Acosta", "Tibás", "Moravia", "Montes de Oca", "Turrubares", "Dota", "Curridabat", "Pérez Zeledón", "León Cortés"],
  "AL": ["Alajuela Central", "San Ramón", "Grecia", "San Mateo", "Atenas", "Naranjo", "Palmares", "Poás", "Orotina", "San Carlos", "Zarcero", "Sarchí", "Upala", "Los Chiles", "Guatuso", "Río Cuarto"],
  "CA": ["Cartago Central", "Paraíso", "La Unión", "Jiménez", "Turrialba", "Alvarado", "Oreamuno", "El Guarco"],
  "HE": ["Heredia Central", "Barva", "Santo Domingo", "Santa Bárbara", "San Rafael", "San Isidro", "Belén", "Flores", "San Pablo", "Sarapiquí"],
  "GU": ["Liberia", "Nicoya", "Santa Cruz", "Bagaces", "Carrillo", "Cañas", "Abangares", "Tilarán", "Nandayure", "La Cruz", "Hojancha"],
  "PU": ["Puntarenas Central", "Esparza", "Buenos Aires", "Montes de Oro", "Osa", "Quepos", "Golfito", "Coto Brus", "Parrita", "Corredores", "Garabito"],
  "LI": ["Limón Central", "Pococí", "Siquirres", "Talamanca", "Matina", "Guácimo"]
};

// ========== ÓRGANOS EMISORES ==========
export const ORGANOS_EMISORES_CR = {
  // Legislativo
  "asamblea_legislativa": "Asamblea Legislativa",
  
  // Ejecutivo
  "poder_ejecutivo": "Poder Ejecutivo (Presidente + Ministros)",
  "presidencia": "Presidencia de la República",
  "micit": "Ministerio de Ciencia, Innovación, Tecnología y Telecomunicaciones",
  "meic": "Ministerio de Economía, Industria y Comercio",
  "hacienda": "Ministerio de Hacienda",
  "salud": "Ministerio de Salud",
  "ambiente": "Ministerio de Ambiente y Energía",
  "trabajo": "Ministerio de Trabajo y Seguridad Social",
  
  // Reguladores
  "conassif": "CONASSIF (Consejo Nacional de Supervisión del Sistema Financiero)",
  "sugef": "SUGEF (Superintendencia General de Entidades Financieras)",
  "sugeval": "SUGEVAL (Superintendencia General de Valores)",
  "supen": "SUPEN (Superintendencia de Pensiones)",
  "sugese": "SUGESE (Superintendencia General de Seguros)",
  "aresep": "ARESEP (Autoridad Reguladora de los Servicios Públicos)",
  "sutel": "SUTEL (Superintendencia de Telecomunicaciones)",
  "inteco": "INTECO (Instituto de Normas Técnicas de Costa Rica)",
  
  // Autónomos
  "bccr": "Banco Central de Costa Rica",
  "ccss": "CCSS (Caja Costarricense de Seguro Social)",
  "ice": "ICE (Instituto Costarricense de Electricidad)",
  "ins": "INS (Instituto Nacional de Seguros)"
} as const;

// ========== COMISIONES LEGISLATIVAS ==========
export const COMISIONES_LEGISLATIVAS_CR = [
  "Comisión de Asuntos Hacendarios",
  "Comisión de Asuntos Económicos",
  "Comisión de Asuntos Jurídicos",
  "Comisión de Asuntos Sociales",
  "Comisión de Ambiente",
  "Comisión de Ciencia y Tecnología",
  "Comisión de Gobierno y Administración",
  "Comisión de Asuntos Municipales",
  "Comisión de Asuntos Internacionales",
  "Comisión de Asuntos Agropecuarios",
  "Comisión de Infraestructura",
  "Comisión de Turismo"
] as const;

// ========== INTERFACE PRINCIPAL ==========
export interface CostaRicaLegislationItem {
  id: string;
  
  // Identificación
  identificador: string;               // Expediente N.º XXXX o Ley N.º YYYY
  titulo: string;
  resumen: string;
  puntosImportantes: string[];
  
  // Clasificación jurídica
  tipoNorma: CostaRicaTipoNorma;
  tipoEmisor: CostaRicaTipoEmisor;
  nivel: CostaRicaNivel;
  
  // Órganos (separación crucial)
  organoEmisor: string;               // Quién dicta la norma
  organoCompetente?: string;          // Quién aplica/fiscaliza/implementa
  comisionLegislativa?: string;       // Solo para proyectos de ley
  
  // Ubicación geográfica (solo si nivel = municipal)
  provincia?: string;                 // Solo relevante para municipal
  canton?: string;                    // Municipalidad específica
  
  // Estado/Ciclo de vida
  estado: CostaRicaEstadoProyecto | CostaRicaEstadoNorma;
  estadoGenerico: "vigente" | "en_tramite";
  indiceEtapaActual: number;
  
  // Fechas del proceso
  fechaPresentacion?: string;         // Para proyectos
  fechaDictamenComision?: string;
  fechaPrimerDebate?: string;
  fechaSegundoDebate?: string;
  fechaEnvioEjecutivo?: string;
  fechaSancionOVeto?: string;
  fechaPublicacionGaceta?: string;    // Publicación en La Gaceta
  fechaEntradaVigencia?: string;      // Puede diferir de publicación
  
  // Clasificación temática
  categoria: string;
  sector: string;
  obligacionesAfectadas?: string[];
  plazosTransitorios?: string;
  
  // Riesgo
  nivelRiesgo: "alto" | "medio" | "bajo";
  puntajeRiesgo: number;
  
  // Resumen IA (adaptado para CR)
  resumenIA: {
    cambiosPropuestos: string;        // Para proyectos: "Si se aprueba..."
    impactosPotenciales: string;      // Quién se vería afectado y cómo
    fechaClave: string;               // Fecha relevante con contexto
    calificadorEstado: string;        // "En trámite - no aplicable hasta..." 
    analisisRiesgo?: string;
  };
  
  // Análisis profundo
  analisisIA?: {
    resumenEjecutivo: string;
    estadisticas?: {
      empresasAfectadas?: number;
      complejidadCumplimiento?: number;
      rangoSanciones?: { min: number; max: number; moneda: string };
    };
    analisisRiesgo?: {
      puntuacionGeneral: number;
      desglose: Array<{ categoria: string; nivel: string; porcentaje: number }>;
      probabilidadFiscalizacion?: string;
    };
    stakeholders?: Array<{
      nombre: string;
      tipo: string;
      impacto: string;
      posicion?: "a_favor" | "en_contra" | "neutral";
    }>;
    requisitosCumplimiento?: Array<{
      requisito: string;
      plazo?: string;
      criticidad: "alta" | "media" | "baja";
    }>;
    recomendaciones?: string[];
    legislacionRelacionada?: Array<{ titulo: string; relacion: string }>;
  };
  
  // Historial de acciones
  acciones: Array<{
    fecha: string;
    descripcion: string;
    actor: string;
  }>;
  
  // Registros de votación (si aplica)
  registrosVotacion?: Array<{
    fecha: string;
    etapa: string;
    aFavor: number;
    enContra: number;
    abstenciones: number;
    aprobado: boolean;
    votos?: Array<{ nombre: string; partido: string; voto: "a_favor" | "en_contra" | "abstencion" }>;
  }>;
  
  // Proponentes (proyectos de ley)
  proponentes?: Array<{
    nombre: string;
    partido: string;
    provincia: string;
    rol: "firmante_principal" | "coproponente";
  }>;
  
  // Stakeholders
  stakeholders?: Array<{
    nombre: string;
    organizacion: string;
    posicion: "a_favor" | "en_contra" | "neutral";
    declaracion?: string;
  }>;
  
  // Texto y fuentes
  textoCompleto?: string;
  fuenteUrl?: string;
  numeroGaceta?: string;
}

// ========== FUNCIÓN PARA GENERAR CALIFICADOR AUTOMÁTICO ==========
export function generarCalificadorEstado(item: CostaRicaLegislationItem): string {
  if (item.tipoNorma === "proyecto_ley" || item.estadoGenerico === "en_tramite") {
    return "Instrumento en trámite; no aplicable hasta eventual aprobación, sanción y publicación en La Gaceta.";
  }
  
  if (item.estado === "vigente" || item.estadoGenerico === "vigente") {
    return `Norma vigente desde ${item.fechaEntradaVigencia || item.fechaPublicacionGaceta || "fecha no especificada"}.`;
  }
  
  if (item.estado === "vetado") {
    return "Vetado por el Poder Ejecutivo. Pendiente de decisión de la Asamblea Legislativa (resello o archivo).";
  }
  
  return "Estado en proceso de determinación.";
}
