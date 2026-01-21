// Mock data generated from matriz_pls.xlsx and matriz_normas.xlsx
// Complete dataset with real data from XLSX files

// Client-specific commentary for multi-client publishing
export interface ClientCommentary {
  clientId: string;
  commentary: string;
}

// Impact levels for legislation
export type ImpactLevel = "positivo" | "leve" | "medio" | "grave";

export const IMPACT_LEVELS: { value: ImpactLevel; label: string; color: string }[] = [
  { value: "positivo", label: "Positivo", color: "bg-green-500/20 text-green-500 border-green-500/30" },
  { value: "leve", label: "Leve", color: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
  { value: "medio", label: "Medio", color: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30" },
  { value: "grave", label: "Grave", color: "bg-red-500/20 text-red-500 border-red-500/30" },
];

// Sectors for filtering
export const SECTORS = [
  "Salud Pública",
  "Farmacéutico",
  "Dispositivos Médicos",
  "Oncología",
  "Investigación",
  "Tecnología Médica",
  "Financiamiento",
  "Seguros",
];

// Complete list of legislative stages from source data
export const ALL_LEGISLATIVE_STAGES = [
  "ACLARACIÓN",
  "AL ARCHIVO",
  "APROBADO",
  "APROBADO 1ERA. VOTACIÓN",
  "AUTÓGRAFA",
  "DECRETO DE ARCHIVO",
  "DICTAMEN",
  "EN AGENDA DEL PLENO",
  "EN COMISIÓN",
  "EN CUARTO INTERMEDIO",
  "EN RECONSIDERACIÓN",
  "ORDEN DEL DÍA",
  "PENDIENTE 2DA. VOTACIÓN",
  "PRESENTADO",
  "PUBLICADA EN EL DIARIO OFICIAL EL PERUANO",
  "RETIRADO POR SU AUTOR",
  "RETORNA A COMISIÓN",
];

// Base interface for alerts (without runtime-added fields)
interface BasePeruAlert {
  id: string;
  legislation_type: "proyecto_de_ley" | "norma";
  legislation_title: string;        // "Título" (PLs) or "Norma" (Normas)
  affected_areas: string[];         // "Área de Interés"
  source_url: string | null;        // "Enlace"
  
  // Management fields (internal)
  status: "inbox" | "reviewed" | "published" | "declined";
  kanban_stage: "comision" | "pleno" | "tramite_final" | "publicado" | "archivado";
  client_id: string | null;
  created_at: string;
  updated_at: string;
  
  // Bill-specific fields (from matriz_pls.xlsx)
  legislation_id?: string;           // "Proyecto de Ley" - e.g., "13172/2025-CR"
  expert_commentary?: string | null; // "Comentario Experto"
  parliamentary_group?: string;      // "Grupo Parlamentario"
  author?: string;                   // "Autor"
  current_stage?: string;            // "Último Estado"
  stage_date?: string;               // "Fecha de Cambio de Estado"
  project_date?: string;             // "Fecha del Proyecto"
  sector?: string;                   // Sector for filtering
  impact_level?: ImpactLevel;        // Impact level
  
  // Regulation-specific fields (from matriz_normas.xlsx)
  entity?: string;                   // "Institución"
  publication_date?: string;         // "Fecha"
  legislation_summary?: string | null; // "Resumen/Comentario"
}

// Full interface with publication workflow fields
export interface PeruAlert extends BasePeruAlert {
  is_pinned_for_publication: boolean;  // Whether this alert is marked for publication
  client_commentaries: ClientCommentary[];  // Commentaries per client
}

// Mock clients for matching
export interface AffectedClient {
  id: string;
  name: string;
  sector: string;
  areas: string[];
  matchScore: number;
}

export const MOCK_CLIENTS: AffectedClient[] = [
  { id: "client-001", name: "Clínica Ricardo Palma", sector: "Salud Privada", areas: ["General", "Oncológico"], matchScore: 85 },
  { id: "client-002", name: "Laboratorios Bagó", sector: "Farmacéutico", areas: ["General", "Dispositivos Médicos"], matchScore: 70 },
  { id: "client-003", name: "Oncosalud", sector: "Salud Privada", areas: ["Oncológico", "Raras y huérfanas"], matchScore: 95 },
  { id: "client-004", name: "EsSalud", sector: "Salud Pública", areas: ["General", "Financiamiento y Presupuesto"], matchScore: 60 },
  { id: "client-005", name: "INEN", sector: "Salud Pública", areas: ["Oncológico"], matchScore: 90 },
];

// Entities for filtering
export const ENTITIES = [
  "MINSA",
  "ESSALUD",
  "IETSI",
  "INS",
  "SIS",
  "SUSALUD",
  "INEN",
  "RENETSA",
  "FISSAL",
];

// Stage mapping for bills
export const STAGE_TO_KANBAN: Record<string, PeruAlert["kanban_stage"]> = {
  "PRESENTADO": "comision",
  "EN COMISIÓN": "comision",
  "DICTAMEN": "pleno",
  "EN AGENDA DEL PLENO": "pleno",
  "APROBADO": "tramite_final",
  "AUTÓGRAFA": "tramite_final",
  "LEY PUBLICADA": "publicado",
  "PUBLICADO": "publicado",
  "ARCHIVADO": "archivado",
  "RETIRADO": "archivado",
};

// Original columns (keep for backwards compatibility)
export const KANBAN_COLUMNS = [
  { id: "comision", label: "Comisión / Consulta Pública", color: "bg-blue-500" },
  { id: "pleno", label: "Pleno", color: "bg-purple-500" },
  { id: "tramite_final", label: "Trámite Final", color: "bg-orange-500" },
  { id: "publicado", label: "Publicado / Vigente", color: "bg-green-500" },
  { id: "archivado", label: "Archivado / Retirado", color: "bg-gray-500" },
];

// Columns for Bills Inbox (legislative process only - no archivado)
export const BILLS_KANBAN_COLUMNS = [
  { id: "comision", label: "Comisión", color: "bg-blue-500" },
  { id: "pleno", label: "Pleno", color: "bg-purple-500" },
  { id: "tramite_final", label: "Trámite Final", color: "bg-orange-500" },
];

// Columns for Regulations Inbox (single column - just pending review)
export const REGULATIONS_KANBAN_COLUMNS = [
  { id: "pendiente", label: "Pendiente Revisión", color: "bg-yellow-500" },
];

// Stage values for filtering bills
export const BILL_STAGES = [
  "PRESENTADO",
  "EN COMISIÓN",
  "EN COMISIÓN PRIMARIA",
  "EN COMISIÓN DICTAMINADORA",
  "DICTAMEN",
  "EN AGENDA DEL PLENO",
  "EN PLENO",
  "EN SEGUNDA VOTACIÓN",
  "APROBADO",
  "AUTÓGRAFA",
  "OBSERVADO",
  "ARCHIVADO",
  "RETIRADO",
];

// Helper functions for display
export function getTypeLabel(type: PeruAlert["legislation_type"]): string {
  return type === "proyecto_de_ley" ? "Proyecto de Ley" : "Norma";
}

export function getTypeColor(type: PeruAlert["legislation_type"]): string {
  return type === "proyecto_de_ley" 
    ? "bg-blue-500/20 text-blue-400 border-blue-500/30" 
    : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
}

// Helper to get kanban stage from current_stage
function getKanbanStage(stage: string): PeruAlert["kanban_stage"] {
  return STAGE_TO_KANBAN[stage] || "comision";
}

// Complete Bills data from matriz_pls.xlsx (real data)
const MOCK_BILLS_RAW: BasePeruAlert[] = [
  {
    id: "bill-001",
    legislation_id: "13172/2025-CR",
    legislation_type: "proyecto_de_ley",
    legislation_title: "PROYECTO DE LEY QUE CREA LA AUTORIDAD NACIONAL DE SALUD Y SEGURIDAD DE PRODUCTOS FARMACÉUTICOS, BIOLÓGICOS Y DISPOSITIVOS MÉDICOS (ANSSP)",
    expert_commentary: "Se modifican los principios de la Ley N° 31814, añadiendo la no discriminación e inclusión, la transparencia (exigiendo información sobre procesos, decisiones y algoritmos), el debido procedimiento para personas afectadas por decisiones automatizadas, y ampliando el principio de responsabilidad para incluir explícitamente a las empresas privadas desarrolladoras, proveedoras, integradoras e implementadoras de IA.",
    source_url: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/13172",
    status: "inbox",
    affected_areas: ["General"],
    kanban_stage: "comision",
    client_id: null,
    parliamentary_group: "Fuerza Popular",
    author: "Bustamante Donayre, Carlos Ernesto",
    current_stage: "PRESENTADO",
    stage_date: "2025-11-11",
    project_date: "2025-11-11",
    created_at: "2025-11-11T00:00:00Z",
    updated_at: "2025-11-11T00:00:00Z",
  },
  {
    id: "bill-002",
    legislation_id: "13202/2025-CR",
    legislation_type: "proyecto_de_ley",
    legislation_title: "PROYECTO DE LEY DE RESPUESTA NACIONAL FRENTE A LA PANDEMIA DEL VIRUS DE INMUNODEFICIENCIA HUMANA (VIH), ENFERMEDAD AVANZADA POR VIH, LAS INFECCIONES DE TRANSMISIÓN SEXUAL Y HEPATITIS VIRALES",
    expert_commentary: "El proyecto de ley tiene como objetivo establecer un marco normativo amplio, integral y actualizado para fortalecer la respuesta nacional frente al VIH, la enfermedad avanzada por VIH, las ITS y las hepatitis virales. Detalla los derechos de las personas con VIH, incluyendo acceso a información completa, atención integral, continua y gratuita.",
    source_url: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/13202",
    status: "inbox",
    affected_areas: ["General"],
    kanban_stage: "comision",
    client_id: null,
    parliamentary_group: "Bloque Democrático Popular",
    author: "Paredes Piqué, Susel Ana María",
    current_stage: "PRESENTADO",
    stage_date: "2025-11-14",
    project_date: "2025-11-14",
    created_at: "2025-11-14T00:00:00Z",
    updated_at: "2025-11-14T00:00:00Z",
  },
  {
    id: "bill-003",
    legislation_id: "13060/2025-CR",
    legislation_type: "proyecto_de_ley",
    legislation_title: "PROYECTO DE LEY PARA PROMOVER LA INVESTIGACIÓN CIENTÍFICA DEL MUÉRDAGO COMO TRATAMIENTO COMPLEMENTARIO EN PACIENTES CON CÁNCER",
    expert_commentary: "El proyecto de ley tiene como objetivo principal fomentar, financiar y regular la investigación científica, clínica y epidemiológica del muérdago (Viscum album) como tratamiento complementario en pacientes con cáncer. Prohíbe explícitamente la promoción del muérdago como sustituto del tratamiento oncológico estándar.",
    source_url: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/13060",
    status: "inbox",
    affected_areas: ["Oncológico"],
    kanban_stage: "comision",
    client_id: null,
    parliamentary_group: "Juntos por el Perú - Voces del Pueblo - Bloque Magisterial",
    author: "Ugarte Mamani, Jhakeline Katy",
    current_stage: "PRESENTADO",
    stage_date: "2025-11-03",
    project_date: "2025-11-03",
    created_at: "2025-11-03T00:00:00Z",
    updated_at: "2025-11-03T00:00:00Z",
  },
  {
    id: "bill-004",
    legislation_id: "13103/2025-CR",
    legislation_type: "proyecto_de_ley",
    legislation_title: "PROYECTO DE LEY QUE ESTABLECE LA OBLIGATORIEDAD DE CREACIÓN E IMPLEMENTACIÓN DEL DEPARTAMENTO Y JEFATURA DE LOS SERVICIOS DE ENFERMERÍA EN LOS ESTABLECIMIENTOS PÚBLICOS DE SALUD",
    expert_commentary: "El proyecto establece la obligatoriedad de crear e implementar el Departamento y la Jefatura de los Servicios de Enfermería en todos los establecimientos públicos de salud dependientes del MINSA y EsSalud. El Departamento de Enfermería tendrá funciones de gestión, monitoreo de actividades y evaluación de indicadores de calidad.",
    source_url: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/13103",
    status: "inbox",
    affected_areas: ["Financiamiento y Presupuesto"],
    kanban_stage: "comision",
    client_id: null,
    parliamentary_group: "Somos Perú",
    author: "Medina Hermosilla, Elizabeth Sara",
    current_stage: "PRESENTADO",
    stage_date: "2025-11-06",
    project_date: "2025-11-06",
    created_at: "2025-11-06T00:00:00Z",
    updated_at: "2025-11-06T00:00:00Z",
  },
  {
    id: "bill-005",
    legislation_id: "13108/2025-CR",
    legislation_type: "proyecto_de_ley",
    legislation_title: "PROYECTO DE LEY QUE FACILITA LOS PROCEDIMIENTOS DE ADQUISICIÓN DE EQUIPAMIENTO MÉDICO EN EL SEGURO SOCIAL DE SALUD (ESSALUD)",
    expert_commentary: "El proyecto establece medidas especiales para agilizar, simplificar y optimizar los procedimientos de adquisición de equipamiento médico y tecnológico en EsSalud. Propone incorporar un literal al artículo 55.1 de la Ley General de Contrataciones Públicas, facultando contrataciones directas con opinión previa favorable de la Contraloría.",
    source_url: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/13108",
    status: "inbox",
    affected_areas: ["Contrataciones Públicas"],
    kanban_stage: "comision",
    client_id: null,
    parliamentary_group: "Juntos por el Perú - Voces del Pueblo - Bloque Magisterial",
    author: "Ugarte Mamani, Jhakeline Katy",
    current_stage: "PRESENTADO",
    stage_date: "2025-11-06",
    project_date: "2025-11-06",
    created_at: "2025-11-06T00:00:00Z",
    updated_at: "2025-11-06T00:00:00Z",
  },
  {
    id: "bill-006",
    legislation_id: "13098/2025-CR",
    legislation_type: "proyecto_de_ley",
    legislation_title: "PROYECTO DE LEY QUE DECLARA DE NECESIDAD PÚBLICA E INTERÉS NACIONAL LA CONSTRUCCIÓN DEL HOSPITAL II-1 EN EL DISTRITO DE PUEBLO NUEVO DE LA PROVINCIA DE CHINCHA",
    expert_commentary: "El proyecto declara de necesidad pública e interés nacional la construcción del Hospital II-1 en el distrito de Pueblo Nuevo, provincia de Chincha, departamento de Ica. El objetivo es fortalecer la atención médica y garantizar el acceso a servicios de salud de calidad para la población de la zona.",
    source_url: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/13098",
    status: "inbox",
    affected_areas: ["Financiamiento y Presupuesto"],
    kanban_stage: "comision",
    client_id: null,
    parliamentary_group: "Alianza Para el Progreso",
    author: "Marticorena Mendoza, Jorge Alfonso",
    current_stage: "PRESENTADO",
    stage_date: "2025-11-06",
    project_date: "2025-11-06",
    created_at: "2025-11-06T00:00:00Z",
    updated_at: "2025-11-06T00:00:00Z",
  },
  {
    id: "bill-007",
    legislation_id: "13004/2025-CR",
    legislation_type: "proyecto_de_ley",
    legislation_title: "PROYECTO DE LEY QUE DISPONE EL MEJORAMIENTO, IMPLEMENTACIÓN Y AMPLIACIÓN DE LOS SERVICIOS DE SALUD DEL C.S. VILLA PERENÉ, C.S. SAN RAMÓN, C.S. SAN LUIS DE SHUARO, UBICADOS EN LA PROVINCIA DE CHANCHAMAYO, DEPARTAMENTO DE JUNÍN",
    expert_commentary: "El proyecto dispone el mejoramiento, implementación y ampliación de los servicios de salud en tres centros de la provincia de Chanchamayo, Junín. La ejecución recae en el Poder Ejecutivo a través del MINSA, en coordinación con el Gobierno Regional de Junín y los gobiernos locales.",
    source_url: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/13004",
    status: "inbox",
    affected_areas: ["Financiamiento y Presupuesto"],
    kanban_stage: "comision",
    client_id: null,
    parliamentary_group: "Bancada Socialista",
    author: "Robles Araujo, Silvana Emperatriz",
    current_stage: "EN COMISIÓN",
    stage_date: "2025-10-28",
    project_date: "2025-10-27",
    created_at: "2025-10-27T00:00:00Z",
    updated_at: "2025-10-28T00:00:00Z",
  },
  {
    id: "bill-008",
    legislation_id: "13016/2025-CR",
    legislation_type: "proyecto_de_ley",
    legislation_title: "PROYECTO DE LEY QUE DISPONE LA CONSTRUCCIÓN E IMPLEMENTACIÓN DEL HOSPITAL REGIONAL DE GERIATRÍA EN EL DEPARTAMENTO DE TACNA",
    expert_commentary: "El proyecto dispone la construcción e implementación de un Hospital Regional de Geriatría en el Departamento de Tacna. Este hospital busca garantizar la atención integral, especializada y humanizada de las personas adultas mayores de la Macrorregión del Sur del País.",
    source_url: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/13016",
    status: "inbox",
    affected_areas: ["Financiamiento y Presupuesto"],
    kanban_stage: "comision",
    client_id: null,
    parliamentary_group: "Perú Libre",
    author: "Mita Alanoca, Isaac",
    current_stage: "EN COMISIÓN",
    stage_date: "2025-10-28",
    project_date: "2025-10-27",
    created_at: "2025-10-27T00:00:00Z",
    updated_at: "2025-10-28T00:00:00Z",
  },
  {
    id: "bill-009",
    legislation_id: "13020/2025-CR",
    legislation_type: "proyecto_de_ley",
    legislation_title: "PROYECTO DE LEY QUE DECLARA LA REESTRUCTURACIÓN INTEGRAL DEL SEGURO SOCIAL DE SALUD (ESSALUD) Y DICTA MEDIDAS PARA SU FORTALECIMIENTO",
    expert_commentary: "El Proyecto declara de Interés Nacional la Reestructuración Integral de EsSalud, abarcando reformas orgánicas, administrativas, financieras y tecnológicas. Incluye optimización de la estructura interna, implementación de gobernanza basada en meritocracia y separación funcional entre IAFA e IPRESS.",
    source_url: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/13020",
    status: "inbox",
    affected_areas: ["Financiamiento y Presupuesto"],
    kanban_stage: "comision",
    client_id: null,
    parliamentary_group: "Juntos por el Perú - Voces del Pueblo - Bloque Magisterial",
    author: "Varas Meléndez, Elías Marcial",
    current_stage: "EN COMISIÓN",
    stage_date: "2025-10-28",
    project_date: "2025-10-27",
    created_at: "2025-10-27T00:00:00Z",
    updated_at: "2025-10-28T00:00:00Z",
  },
  {
    id: "bill-010",
    legislation_id: "13036/2025-CR",
    legislation_type: "proyecto_de_ley",
    legislation_title: "PROYECTO DE LEY QUE FORTALECE LA COBERTURA DE TRATAMIENTOS CONTRA EL CÁNCER",
    expert_commentary: "El proyecto fortalece la cobertura de tratamientos contra el cáncer ofrecidos por las IAFAS e IPRESS privadas. Incorpora la responsabilidad solidaria de las IAFAS con las IPRESS y asegura que la cobertura oncológica integral aplique a cualquier denominación de sus productos, incluyendo tratamientos de guías de prácticas clínicas internacionales.",
    source_url: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/13036",
    status: "inbox",
    affected_areas: ["Oncológico"],
    kanban_stage: "comision",
    client_id: null,
    parliamentary_group: "Bloque Democrático Popular",
    author: "Bazán Narro, Sigrid Tesoro",
    current_stage: "EN COMISIÓN",
    stage_date: "2025-10-30",
    project_date: "2025-10-30",
    created_at: "2025-10-30T00:00:00Z",
    updated_at: "2025-10-30T00:00:00Z",
  },
  {
    id: "bill-011",
    legislation_id: "13041/2025-CR",
    legislation_type: "proyecto_de_ley",
    legislation_title: "PROYECTO DE LEY QUE CREA EL HOSPITAL ONCOLÓGICO EN EL DEPARTAMENTO DE TACNA",
    expert_commentary: "El proyecto crea el Hospital Oncológico en el Departamento de Tacna. Su finalidad es prestar servicios especializados e integrales a pacientes oncológicos, así como desarrollar programas de docencia e investigación. El hospital será de alta complejidad, bajo la rectoría del MINSA y en coordinación con el INEN.",
    source_url: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/13041",
    status: "inbox",
    affected_areas: ["Financiamiento y Presupuesto"],
    kanban_stage: "comision",
    client_id: null,
    parliamentary_group: "Perú Libre",
    author: "Mita Alanoca, Isaac",
    current_stage: "EN COMISIÓN",
    stage_date: "2025-10-31",
    project_date: "2025-10-31",
    created_at: "2025-10-31T00:00:00Z",
    updated_at: "2025-10-31T00:00:00Z",
  },
  {
    id: "bill-012",
    legislation_id: "12918/2025-CR",
    legislation_type: "proyecto_de_ley",
    legislation_title: "PROYECTO DE LEY QUE INCORPORA EL ARTÍCULO 10-A A LA LEY 31336, LEY NACIONAL DEL CÁNCER, PARA LA CREACIÓN DEL REGISTRO NACIONAL DE TAMIZAJE ONCOLÓGICO",
    expert_commentary: "El proyecto propone incorporar el Artículo 10-A a la Ley Nacional del Cáncer para crear el Registro Nacional de Tamizaje Oncológico (RENTO). Este registro integrará la información de las pruebas de tamizaje para la detección temprana del cáncer, priorizando las neoplasias de mayor incidencia y mortalidad.",
    source_url: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/12918",
    status: "inbox",
    affected_areas: ["Oncológico"],
    kanban_stage: "comision",
    client_id: null,
    parliamentary_group: "Acción Popular",
    author: "López Ureña, Ilich Fredy",
    current_stage: "EN COMISIÓN",
    stage_date: "2025-10-24",
    project_date: "2025-10-21",
    created_at: "2025-10-21T00:00:00Z",
    updated_at: "2025-10-24T00:00:00Z",
  },
  {
    id: "bill-013",
    legislation_id: "12951/2025-CR",
    legislation_type: "proyecto_de_ley",
    legislation_title: "PROYECTO DE LEY QUE DECLARA DE INTERÉS NACIONAL Y NECESIDAD PÚBLICA LA CREACIÓN DEL ORGANISMO NACIONAL PARA LA SEGURIDAD SANITARIA AMBIENTAL Y ALIMENTARIA – ONSA",
    expert_commentary: "El proyecto declara de interés nacional y necesidad pública la creación del Organismo Nacional para la Seguridad Sanitaria, Ambiental y Alimentaria (ONSA). El propósito es fortalecer el sistema de vigilancia, fiscalización y sanción sanitaria en los ámbitos de la salud ambiental y la inocuidad alimentaria.",
    source_url: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/12951",
    status: "inbox",
    affected_areas: ["General"],
    kanban_stage: "comision",
    client_id: null,
    parliamentary_group: "Perú Libre",
    author: "Gonza Castillo, Américo",
    current_stage: "EN COMISIÓN",
    stage_date: "2025-10-24",
    project_date: "2025-10-23",
    created_at: "2025-10-23T00:00:00Z",
    updated_at: "2025-10-24T00:00:00Z",
  },
  {
    id: "bill-014",
    legislation_id: "12965/2025-CR",
    legislation_type: "proyecto_de_ley",
    legislation_title: "PROYECTO DE LEY QUE DECLARA DE INTERÉS NACIONAL LA CREACIÓN Y CONSTRUCCIÓN DEL HOSPITAL ONCOLÓGICO REGIONAL DE AYACUCHO",
    expert_commentary: "El proyecto declara de interés nacional la creación y construcción del Hospital Oncológico Regional de Ayacucho. Su finalidad es garantizar el acceso universal, oportuno y de calidad a los servicios de salud oncológica, reduciendo las brechas existentes para la población de Ayacucho y del sur del país.",
    source_url: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/12965",
    status: "inbox",
    affected_areas: ["Oncológico"],
    kanban_stage: "comision",
    client_id: null,
    parliamentary_group: "No Agrupados",
    author: "Palacios Huamán, Margot",
    current_stage: "EN COMISIÓN",
    stage_date: "2025-10-24",
    project_date: "2025-10-23",
    created_at: "2025-10-23T00:00:00Z",
    updated_at: "2025-10-24T00:00:00Z",
  },
  {
    id: "bill-015",
    legislation_id: "12238/2025-CR",
    legislation_type: "proyecto_de_ley",
    legislation_title: "PROYECTO DE LEY QUE DECLARA DE NECESIDAD PÚBLICA E INTERÉS NACIONAL LA CONSTRUCCIÓN DE UN NUEVO HOSPITAL III DE EMERGENCIAS GRAU",
    expert_commentary: "Se propone declarar de necesidad pública e interés nacional la construcción de un nuevo Hospital III de Emergencias Grau de ESSALUD en el Cercado de Lima. El actual hospital presenta infraestructura obsoleta, vulnerabilidad sísmica y ha sido recategorizado como de alto riesgo.",
    source_url: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/12238",
    status: "inbox",
    affected_areas: ["Financiamiento y Presupuesto"],
    kanban_stage: "pleno",
    client_id: null,
    parliamentary_group: "Bancada Socialista",
    author: "Dávila Atanacio, Pasión Neomías",
    current_stage: "DICTAMEN",
    stage_date: "2025-10-24",
    project_date: "2025-08-28",
    created_at: "2025-08-28T00:00:00Z",
    updated_at: "2025-10-24T00:00:00Z",
  },
  {
    id: "bill-016",
    legislation_id: "09898/2024-CR",
    legislation_type: "proyecto_de_ley",
    legislation_title: "LEY QUE DECLARA DE NECESIDAD PÚBLICA E INTERÉS NACIONAL LA ELABORACIÓN E IMPLEMENTACIÓN DEL PLAN NACIONAL PARA LA PREVENCIÓN, DETECCIÓN Y TRATAMIENTO DEL CANCER DE CUELLO UTERINO",
    expert_commentary: "Propone declarar de necesidad pública e interés nacional diseñar un marco normativo e implementar una política pública con acciones de prevención, detección y tratamiento del cáncer de cuello uterino a favor de la población.",
    source_url: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/09898",
    status: "inbox",
    affected_areas: ["Oncológico"],
    kanban_stage: "tramite_final",
    client_id: null,
    parliamentary_group: "Bloque Democrático Popular",
    author: "Reymundo Mercado, Edgard Cornelio",
    current_stage: "APROBADO",
    stage_date: "2025-10-23",
    project_date: "2025-01-13",
    created_at: "2025-01-13T00:00:00Z",
    updated_at: "2025-10-23T00:00:00Z",
  },
];

// Complete Regulations data from matriz_normas.xlsx (real data)
const MOCK_REGULATIONS_RAW: BasePeruAlert[] = [
  {
    id: "reg-001",
    legislation_type: "norma",
    legislation_title: "Guía de práctica clínica para el diagnóstico y tratamiento de Neumonía Adquirida en la Comunidad en población pediátrica",
    entity: "IETSI",
    publication_date: "2025-10-30",
    affected_areas: ["General"],
    legislation_summary: "Esta guía aborda el manejo de neumonía adquirida en la comunidad en pacientes de 1 mes a menores de 18 años, previamente sanos e inmunocompetentes. En el manejo hospitalario, los menores de 2 meses reciben ampicilina combinada con aminoglucósidos. Los niños de 2 meses a menores de 18 años se tratan con ampicilina o penicilina G sódica endovenosa.",
    source_url: "https://ietsi.essalud.gob.pe/wp-content/uploads/2025/10/GPC-NAC-en-poblacion-pediatrica-Version-corta.pdf",
    status: "inbox",
    kanban_stage: "publicado",
    client_id: null,
    created_at: "2025-10-30T00:00:00Z",
    updated_at: "2025-10-30T00:00:00Z",
  },
  {
    id: "reg-002",
    legislation_type: "norma",
    legislation_title: "Resolución de Presidencia Ejecutiva N.° 1043-PE-ESSALUD-2025",
    entity: "ESSALUD",
    publication_date: "2025-10-03",
    affected_areas: ["Financiamiento y Presupuesto"],
    legislation_summary: "Se incorpora la inversión IOARR denominada 'Adquisición de Ecocardiógrafos en el INCOR, Jesús María, Lima', con un costo total actualizado de S/ 7,846,800.00 y una programación para 2025 de S/ 780,000.00. La inversión busca reducir la brecha de capacidad instalada inadecuada en institutos de salud especializados.",
    source_url: "https://cdn.www.gob.pe/uploads/document/file/8970550/7381961-resolucion-de-presidencia-ejecutiva-n-1043-pe-essalud-2025.pdf",
    status: "inbox",
    kanban_stage: "publicado",
    client_id: null,
    created_at: "2025-10-03T00:00:00Z",
    updated_at: "2025-10-03T00:00:00Z",
  },
  {
    id: "reg-003",
    legislation_type: "norma",
    legislation_title: "Resolución Ministerial N.° 765-2025-MINSA",
    entity: "MINSA",
    publication_date: "2025-11-09",
    affected_areas: ["General"],
    legislation_summary: "Se da por concluida la designación del señor Jorge Grimaldo Ramírez Castillo como Director General de la Dirección de Redes Integradas de Salud Lima Este del Ministerio de Salud, agradeciéndole los servicios prestados.",
    source_url: "https://cdn.www.gob.pe/uploads/document/file/8967801/7380140-resolucion-ministerial-n-765-2025-minsa.pdf",
    status: "inbox",
    kanban_stage: "publicado",
    client_id: null,
    created_at: "2025-11-09T00:00:00Z",
    updated_at: "2025-11-09T00:00:00Z",
  },
  {
    id: "reg-004",
    legislation_type: "norma",
    legislation_title: "Resolución Secretarial N.° 365-2025-SG-MINSA",
    entity: "MINSA",
    publication_date: "2025-11-10",
    affected_areas: ["Financiamiento y Presupuesto"],
    legislation_summary: "Se aprueban reasignaciones presupuestarias entre diferentes programas, productos y actividades dentro del presupuesto institucional vigente, sin modificar el monto total asignado. Estas modificaciones se realizan a nivel funcional programático por un total de S/ 265,259,843.",
    source_url: "https://cdn.www.gob.pe/uploads/document/file/8975099/7385049-resolucion-secretarial-n-365-2025-sg-minsa.pdf",
    status: "inbox",
    kanban_stage: "publicado",
    client_id: null,
    created_at: "2025-11-10T00:00:00Z",
    updated_at: "2025-11-10T00:00:00Z",
  },
  {
    id: "reg-005",
    legislation_type: "norma",
    legislation_title: "Resolución Secretarial N.° 364-2025-SG-MINSA",
    entity: "MINSA",
    publication_date: "2025-11-10",
    affected_areas: ["Financiamiento y Presupuesto"],
    legislation_summary: "Se autoriza una modificación presupuestaria en el Ministerio de Salud por un monto de S/ 34,896,944.00, con cargo a recursos ordinarios. Los fondos se transferirán a diversas unidades ejecutoras para cubrir gastos de gestión y operatividad.",
    source_url: "https://cdn.www.gob.pe/uploads/document/file/8968987/7380908-resolucion-secretarial-n-364-2025-minsa.pdf",
    status: "inbox",
    kanban_stage: "publicado",
    client_id: null,
    created_at: "2025-11-10T00:00:00Z",
    updated_at: "2025-11-10T00:00:00Z",
  },
  {
    id: "reg-006",
    legislation_type: "norma",
    legislation_title: "Resolución de Gerencia General N.° 429-2025-GG/INEN",
    entity: "INEN",
    publication_date: "2025-11-10",
    affected_areas: ["Financiamiento y Presupuesto"],
    legislation_summary: "Se formalizan las modificaciones presupuestarias realizadas en octubre de 2025 dentro de la Unidad Ejecutora 001-1235 del Instituto Nacional de Enfermedades Neoplásicas (INEN), conforme a la Ley General del Sistema Nacional de Presupuesto.",
    source_url: "https://cdn.www.gob.pe/uploads/document/file/8978300/7387322-resolucion-de-gerencia-general-000429-2025-gg.pdf",
    status: "inbox",
    kanban_stage: "publicado",
    client_id: null,
    created_at: "2025-11-10T00:00:00Z",
    updated_at: "2025-11-10T00:00:00Z",
  },
  {
    id: "reg-007",
    legislation_type: "norma",
    legislation_title: "RESOLUCION JEFATURAL N° 000150-2025-SIS/J",
    entity: "SIS",
    publication_date: "2025-11-12",
    affected_areas: ["Financiamiento y Presupuesto"],
    legislation_summary: "Se aprueba la transferencia financiera del Seguro Integral de Salud (SIS) por S/ 1,903,837.00 a favor del Ministerio de Defensa – Fuerza Aérea del Perú, para cubrir prestaciones administrativas brindadas a asegurados del SIS.",
    source_url: "https://busquedas.elperuano.pe/dispositivo/NL/2457229-1",
    status: "inbox",
    kanban_stage: "publicado",
    client_id: null,
    created_at: "2025-11-12T00:00:00Z",
    updated_at: "2025-11-12T00:00:00Z",
  },
  {
    id: "reg-008",
    legislation_type: "norma",
    legislation_title: "Resolución de la Oficina de Administración N.° 136-2025-INS/OA",
    entity: "INS",
    publication_date: "2025-11-10",
    affected_areas: ["Contrataciones Públicas"],
    legislation_summary: "Se declaró la nulidad del Concurso Público Abreviado N.º 04-2025-INS-1, destinado a contratar el servicio de mantenimiento preventivo de un cromatógrafo líquido UHPL ACQUITY HCLASS, por haber incumplido el plazo mínimo legal de dos días hábiles para consultas y observaciones.",
    source_url: "https://cdn.www.gob.pe/uploads/document/file/8978595/7387547-resolucion-de-oficina-de-administracion-000136-2025-oa.pdf",
    status: "inbox",
    kanban_stage: "publicado",
    client_id: null,
    created_at: "2025-11-10T00:00:00Z",
    updated_at: "2025-11-10T00:00:00Z",
  },
  {
    id: "reg-009",
    legislation_type: "norma",
    legislation_title: "Resolución de Presidencia Ejecutiva N.° 135-2025-INS/OA",
    entity: "INS",
    publication_date: "2025-11-10",
    affected_areas: ["Contrataciones Públicas"],
    legislation_summary: "Se declaró la nulidad del procedimiento de Licitación Pública Abreviada N.º 07-2025-INS-1, destinado a la adquisición de medio de cultivo Lowenstein Jensen en tubo, por haberse convocado con un plazo insuficiente para consultas y observaciones.",
    source_url: "https://cdn.www.gob.pe/uploads/document/file/8978561/7387526-resolucion-de-oficina-de-administracion-000135-2025-oa.pdf",
    status: "inbox",
    kanban_stage: "publicado",
    client_id: null,
    created_at: "2025-11-10T00:00:00Z",
    updated_at: "2025-11-10T00:00:00Z",
  },
  {
    id: "reg-010",
    legislation_type: "norma",
    legislation_title: "Resolución Ministerial N.° 798-2025-MINSA",
    entity: "MINSA",
    publication_date: "2025-11-13",
    affected_areas: ["General"],
    legislation_summary: "Se designa al señor Raúl Menacho Marcelo como Director General de la Oficina General de Administración del Ministerio de Salud, cargo CAP-P N° 267, Nivel F-5.",
    source_url: "https://cdn.www.gob.pe/uploads/document/file/8990196/7395314-resolucion-ministerial-n-798-2025-minsa.pdf",
    status: "inbox",
    kanban_stage: "publicado",
    client_id: null,
    created_at: "2025-11-13T00:00:00Z",
    updated_at: "2025-11-13T00:00:00Z",
  },
  {
    id: "reg-011",
    legislation_type: "norma",
    legislation_title: "RESOLUCIÓN N° 310-IETSI-ESSALUD-2025",
    entity: "IETSI",
    publication_date: "2025-11-13",
    affected_areas: ["General"],
    legislation_summary: "Se incorpora al Petitorio Farmacológico de EsSalud el producto Epoetina alfa o Eritropoyetina humana 4000 UI/mL x 1 mL – AM y se excluye la versión FR del mismo medicamento.",
    source_url: "https://ietsi.essalud.gob.pe/wp-content/uploads/2021/10/RESOLUCION-000310-2025-IETSI.pdf",
    status: "inbox",
    kanban_stage: "publicado",
    client_id: null,
    created_at: "2025-11-13T00:00:00Z",
    updated_at: "2025-11-13T00:00:00Z",
  },
  {
    id: "reg-012",
    legislation_type: "norma",
    legislation_title: "RESOLUCION N° 000188 -2025-INS-PE",
    entity: "INS",
    publication_date: "2025-11-13",
    affected_areas: ["General"],
    legislation_summary: "Se modifican diversos apartados de la Directiva Sanitaria sobre la evaluación de tecnologías sanitarias de alto costo. Las reformas precisan la validación de la pregunta clínica en formato PICO con al menos dos especialistas.",
    source_url: "https://busquedas.elperuano.pe/dispositivo/NL/2458091-1",
    status: "inbox",
    kanban_stage: "publicado",
    client_id: null,
    created_at: "2025-11-13T00:00:00Z",
    updated_at: "2025-11-13T00:00:00Z",
  },
  {
    id: "reg-013",
    legislation_type: "norma",
    legislation_title: "Resolución de Presidencia Ejecutiva N.° 188-2025-INS/PE",
    entity: "INS",
    publication_date: "2025-11-12",
    affected_areas: ["Raras y huérfanas"],
    legislation_summary: "Se modifica la Directiva Sanitaria sobre la evaluación multicriterio de tecnologías sanitarias de alto costo para enfermedades raras. Se actualiza el procedimiento de validación de la pregunta clínica en formato PICO.",
    source_url: "https://cdn.www.gob.pe/uploads/document/file/8992270/7396714-resolucion-de-presidencia-ejecutiva-000188-2025-pe.pdf",
    status: "inbox",
    kanban_stage: "publicado",
    client_id: null,
    created_at: "2025-11-12T00:00:00Z",
    updated_at: "2025-11-12T00:00:00Z",
  },
  {
    id: "reg-014",
    legislation_type: "norma",
    legislation_title: "Resolución Ministerial N.° 794-2025-MINSA",
    entity: "MINSA",
    publication_date: "2025-11-14",
    affected_areas: ["Raras y huérfanas"],
    legislation_summary: "Se crea un Grupo de Trabajo Multisectorial para elaborar la propuesta del Plan Nacional de Prevención, Diagnóstico, Atención Integral de Salud, Tratamiento, Rehabilitación, Investigación y Monitoreo de las Enfermedades Raras o Huérfanas (PLANERH).",
    source_url: "https://cdn.www.gob.pe/uploads/document/file/8997315/7399985-resolucion-ministerial-n-794-2025-minsa.pdf",
    status: "inbox",
    kanban_stage: "publicado",
    client_id: null,
    created_at: "2025-11-14T00:00:00Z",
    updated_at: "2025-11-14T00:00:00Z",
  },
  {
    id: "reg-015",
    legislation_type: "norma",
    legislation_title: "Resolución de Presidencia Ejecutiva N.° 1183-PE-ESSALUD-2025",
    entity: "ESSALUD",
    publication_date: "2025-11-12",
    affected_areas: ["General"],
    legislation_summary: "Se modifican 20 artículos del ROF que afectan principalmente a las Gerencias Centrales de Planeamiento y Presupuesto, Logística, Tecnologías de Información, Proyectos de Inversión, y Promoción de la Inversión Privada.",
    source_url: "https://cdn.www.gob.pe/uploads/document/file/8994869/7398483-resolucion-n-1183-pe-essalud-2025.pdf",
    status: "inbox",
    kanban_stage: "publicado",
    client_id: null,
    created_at: "2025-11-12T00:00:00Z",
    updated_at: "2025-11-12T00:00:00Z",
  },
  {
    id: "reg-016",
    legislation_type: "norma",
    legislation_title: "Resolución N.° 308-IETSI-ESSALUD-2025",
    entity: "ESSALUD",
    publication_date: "2025-11-10",
    affected_areas: ["General"],
    legislation_summary: "Se aprueba el 'Plan de determinación de las prioridades de investigación en salud ESSALUD 2026-2028'. El Plan busca establecer un proceso sistemático, participativo y basado en evidencia para definir los Temas, Subtemas, Problemas e Ideas de investigación.",
    source_url: "https://cdn.www.gob.pe/uploads/document/file/8993778/7397733-resolucion-308-2025-ietsi.pdf",
    status: "inbox",
    kanban_stage: "publicado",
    client_id: null,
    created_at: "2025-11-10T00:00:00Z",
    updated_at: "2025-11-10T00:00:00Z",
  },
  {
    id: "reg-017",
    legislation_type: "norma",
    legislation_title: "Resolución Ministerial N.° 800-2025-MINSA",
    entity: "MINSA",
    publication_date: "2025-11-12",
    affected_areas: ["Financiamiento y Presupuesto"],
    legislation_summary: "Se autoriza la incorporación de mayores ingresos públicos al Presupuesto Institucional del Pliego 011: Ministerio de Salud para el Año Fiscal 2025. El monto total autorizado asciende a S/ 8,279,922.00.",
    source_url: "https://cdn.www.gob.pe/uploads/document/file/8991417/7396216-resolucion-ministerial-n-800-2025-minsa.pdf",
    status: "inbox",
    kanban_stage: "publicado",
    client_id: null,
    created_at: "2025-11-12T00:00:00Z",
    updated_at: "2025-11-12T00:00:00Z",
  },
  {
    id: "reg-018",
    legislation_type: "norma",
    legislation_title: "Resolución Ministerial N.° 793-2025-MINSA",
    entity: "MINSA",
    publication_date: "2025-11-14",
    affected_areas: ["Registro Sanitario y Autorizaciones"],
    legislation_summary: "Se dispone la publicación del proyecto de Reglamento que establece las condiciones para presentar los resultados de control de calidad del primer lote y de los lotes subsiguientes de productos farmacéuticos antes de su comercialización.",
    source_url: "https://cdn.www.gob.pe/uploads/document/file/8997113/7399887-resolucion-ministerial-n-793-2025-minsa.pdf",
    status: "inbox",
    kanban_stage: "publicado",
    client_id: null,
    created_at: "2025-11-14T00:00:00Z",
    updated_at: "2025-11-14T00:00:00Z",
  },
  {
    id: "reg-019",
    legislation_type: "norma",
    legislation_title: "Resolución de Administración N.° 031-2025-SIS-FISSAL/OA",
    entity: "FISSAL",
    publication_date: "2025-11-13",
    affected_areas: ["Contrataciones Públicas"],
    legislation_summary: "Se aprueba la quinta modificación del Plan Anual de Contrataciones del FISSAL para el año fiscal 2025. Esta modificación incorpora una nueva contratación referida a un servicio de atención ambulatoria en hemodiálisis para asegurados del SIS.",
    source_url: "https://cdn.www.gob.pe/uploads/document/file/9000418/7402226-resolucion-de-administracion-n-031-2025-sis-fissal-oa.pdf",
    status: "inbox",
    kanban_stage: "publicado",
    client_id: null,
    created_at: "2025-11-13T00:00:00Z",
    updated_at: "2025-11-13T00:00:00Z",
  },
  {
    id: "reg-020",
    legislation_type: "norma",
    legislation_title: "Resolución de Gerencia General N.° 434-2025-GG/INEN",
    entity: "INEN",
    publication_date: "2025-11-11",
    affected_areas: ["Contrataciones Públicas"],
    legislation_summary: "Se designa a los integrantes del comité encargado de organizar, conducir y ejecutar el proceso de selección de la Licitación Pública Abreviada N.° 034-2025-INEN, destinado a la adquisición de un hemostático tópico absorbible.",
    source_url: "https://cdn.www.gob.pe/uploads/document/file/9001500/7402862-resolucion-de-gerencia-general-000434-2025-gg.pdf",
    status: "inbox",
    kanban_stage: "publicado",
    client_id: null,
    created_at: "2025-11-11T00:00:00Z",
    updated_at: "2025-11-11T00:00:00Z",
  },
];

// Helper to assign random impact level
function getRandomImpactLevel(): ImpactLevel {
  const levels: ImpactLevel[] = ["positivo", "leve", "medio", "grave"];
  return levels[Math.floor(Math.random() * levels.length)];
}

// Helper to assign random sector
function getRandomSector(): string {
  return SECTORS[Math.floor(Math.random() * SECTORS.length)];
}

// Seeded random for consistent values
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Helper to add default values to alerts with deterministic random values
function addAlertDefaults(alert: BasePeruAlert, index: number): PeruAlert {
  const impactLevels: ImpactLevel[] = ["positivo", "leve", "medio", "grave"];
  const impactIndex = Math.floor(seededRandom(index * 13) * 4);
  const sectorIndex = Math.floor(seededRandom(index * 17) * SECTORS.length);
  
  return {
    ...alert,
    is_pinned_for_publication: false,
    client_commentaries: [],
    impact_level: alert.impact_level || impactLevels[impactIndex],
    sector: alert.sector || SECTORS[sectorIndex],
  };
}

// Export processed arrays with defaults
export const MOCK_BILLS: PeruAlert[] = MOCK_BILLS_RAW.map((bill, i) => addAlertDefaults(bill, i));
export const MOCK_REGULATIONS: PeruAlert[] = MOCK_REGULATIONS_RAW.map((reg, i) => addAlertDefaults(reg, i + 100));

// All alerts combined with defaults
export const ALL_MOCK_ALERTS: PeruAlert[] = [
  ...MOCK_BILLS,
  ...MOCK_REGULATIONS,
];

// Helper functions for filtering and display
export function getAlertsByKanbanStage(stage: PeruAlert["kanban_stage"]): PeruAlert[] {
  return ALL_MOCK_ALERTS.filter((alert) => alert.kanban_stage === stage);
}

export function getAlertCountByKanbanStage(): Record<PeruAlert["kanban_stage"], number> {
  return {
    comision: getAlertsByKanbanStage("comision").length,
    pleno: getAlertsByKanbanStage("pleno").length,
    tramite_final: getAlertsByKanbanStage("tramite_final").length,
    publicado: getAlertsByKanbanStage("publicado").length,
    archivado: getAlertsByKanbanStage("archivado").length,
  };
}

// Get impact level display info
export function getImpactLevelInfo(level: ImpactLevel | undefined) {
  if (!level) return null;
  return IMPACT_LEVELS.find(l => l.value === level) || null;
}
