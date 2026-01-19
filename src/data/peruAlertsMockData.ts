// Mock data generated from matriz_pls.xlsx and matriz_normas.xlsx

export interface PeruAlert {
  id: string;
  legislation_id: string;
  legislation_type: "proyecto_de_ley" | "norma";
  legislation_title: string;
  legislation_summary: string | null;
  expert_commentary: string | null;
  source_url: string | null;
  status: "inbox" | "reviewed" | "published" | "declined";
  affected_areas: string[];
  risk_level: "high" | "medium" | "low";
  urgency_level: "high" | "medium" | "low";
  deadline: string | null;
  kanban_stage: "comision" | "pleno" | "tramite_final" | "publicado" | "archivado";
  client_id: string | null;
  ai_analysis: {
    author?: string;
    parliamentary_group?: string;
    current_stage?: string;
    stage_date?: string;
    project_date?: string;
    entity?: string;
    publication_date?: string;
    summary?: string;
  };
  created_at: string;
  updated_at: string;
}

// Stage mapping for bills
export const STAGE_TO_KANBAN: Record<string, PeruAlert["kanban_stage"]> = {
  "PRESENTADO": "comision",
  "EN COMISIÓN": "comision",
  "DICTAMEN": "pleno",
  "APROBADO": "tramite_final",
  "AUTÓGRAFA": "tramite_final",
  "LEY PUBLICADA": "publicado",
  "PUBLICADO": "publicado",
  "ARCHIVADO": "archivado",
  "RETIRADO": "archivado",
};

export const KANBAN_COLUMNS = [
  { id: "comision", label: "Comisión / Consulta Pública", color: "bg-blue-500" },
  { id: "pleno", label: "Pleno", color: "bg-purple-500" },
  { id: "tramite_final", label: "Trámite Final", color: "bg-orange-500" },
  { id: "publicado", label: "Publicado / Vigente", color: "bg-green-500" },
  { id: "archivado", label: "Archivado / Retirado", color: "bg-gray-500" },
] as const;

// Bills from matriz_pls.xlsx
export const MOCK_BILLS: PeruAlert[] = [
  {
    id: "bill-001",
    legislation_id: "13172/2025-CR",
    legislation_type: "proyecto_de_ley",
    legislation_title: "PROYECTO DE LEY QUE CREA LA AUTORIDAD NACIONAL DE SALUD Y SEGURIDAD EN EL TRABAJO - ANSST",
    legislation_summary: "Creación de la Autoridad Nacional de Salud y Seguridad en el Trabajo como organismo técnico especializado.",
    expert_commentary: null,
    source_url: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/13172",
    status: "inbox",
    affected_areas: ["General"],
    risk_level: "high",
    urgency_level: "medium",
    deadline: null,
    kanban_stage: "comision",
    client_id: null,
    ai_analysis: {
      author: "Bustamante Donayre, Carlos Ernesto",
      parliamentary_group: "Fuerza Popular",
      current_stage: "PRESENTADO",
      stage_date: "2025-11-11",
      project_date: "2025-11-11",
      summary: "Propone la creación de un organismo especializado en salud y seguridad laboral con autonomía técnica y administrativa."
    },
    created_at: "2025-11-11T10:00:00Z",
    updated_at: "2025-11-11T10:00:00Z"
  },
  {
    id: "bill-002",
    legislation_id: "13202/2025-CR",
    legislation_type: "proyecto_de_ley",
    legislation_title: "PROYECTO DE LEY DE RESPUESTA NACIONAL A LA EPIDEMIA DEL VIH Y SIDA",
    legislation_summary: "Establece el marco legal para la respuesta integral del Estado frente a la epidemia del VIH/SIDA.",
    expert_commentary: null,
    source_url: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/13202",
    status: "inbox",
    affected_areas: ["Oncológico", "General"],
    risk_level: "high",
    urgency_level: "high",
    deadline: "2025-12-31",
    kanban_stage: "comision",
    client_id: null,
    ai_analysis: {
      author: "Paredes Castro, Rosselli",
      parliamentary_group: "Alianza para el Progreso",
      current_stage: "PRESENTADO",
      stage_date: "2025-11-14",
      project_date: "2025-11-14",
      summary: "Actualiza la normativa de respuesta al VIH/SIDA con enfoque de derechos humanos y acceso universal a tratamiento."
    },
    created_at: "2025-11-14T10:00:00Z",
    updated_at: "2025-11-14T10:00:00Z"
  },
  {
    id: "bill-003",
    legislation_id: "13060/2025-CR",
    legislation_type: "proyecto_de_ley",
    legislation_title: "PROYECTO DE LEY QUE PROMUEVE LA INVESTIGACIÓN CIENTÍFICA DEL MUÉRDAGO PARA EL TRATAMIENTO DEL CÁNCER",
    legislation_summary: "Fomenta la investigación del muérdago como tratamiento complementario oncológico.",
    expert_commentary: "Relevante para el sector oncológico. Podría afectar protocolos de tratamiento.",
    source_url: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/13060",
    status: "inbox",
    affected_areas: ["Oncológico"],
    risk_level: "high",
    urgency_level: "medium",
    deadline: null,
    kanban_stage: "comision",
    client_id: null,
    ai_analysis: {
      author: "Montoya Manrique, César",
      parliamentary_group: "Renovación Popular",
      current_stage: "EN COMISIÓN",
      stage_date: "2025-10-28",
      project_date: "2025-10-22",
      summary: "Propone marco regulatorio para investigación de terapias complementarias en oncología."
    },
    created_at: "2025-10-22T10:00:00Z",
    updated_at: "2025-10-28T10:00:00Z"
  },
  {
    id: "bill-004",
    legislation_id: "13004/2025-CR",
    legislation_type: "proyecto_de_ley",
    legislation_title: "PROYECTO DE LEY DE MEJORA DE LOS SERVICIOS DE SALUD EN ESTABLECIMIENTOS DEL PRIMER NIVEL DE ATENCIÓN",
    legislation_summary: "Fortalecimiento de la atención primaria en salud.",
    expert_commentary: null,
    source_url: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/13004",
    status: "inbox",
    affected_areas: ["General"],
    risk_level: "medium",
    urgency_level: "medium",
    deadline: null,
    kanban_stage: "comision",
    client_id: null,
    ai_analysis: {
      author: "Bazán Calderón, Martha",
      parliamentary_group: "Perú Libre",
      current_stage: "EN COMISIÓN",
      stage_date: "2025-10-15",
      project_date: "2025-10-10",
      summary: "Busca mejorar infraestructura y equipamiento en centros de salud de primer nivel."
    },
    created_at: "2025-10-10T10:00:00Z",
    updated_at: "2025-10-15T10:00:00Z"
  },
  {
    id: "bill-005",
    legislation_id: "13020/2025-CR",
    legislation_type: "proyecto_de_ley",
    legislation_title: "PROYECTO DE LEY QUE REESTRUCTURA EL SEGURO SOCIAL DE SALUD - ESSALUD",
    legislation_summary: "Reforma integral del sistema EsSalud para mejorar cobertura y eficiencia.",
    expert_commentary: null,
    source_url: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/13020",
    status: "inbox",
    affected_areas: ["Financiamiento y Presupuesto", "General"],
    risk_level: "high",
    urgency_level: "high",
    deadline: "2026-03-31",
    kanban_stage: "comision",
    client_id: null,
    ai_analysis: {
      author: "García Jiménez, Carlos",
      parliamentary_group: "Acción Popular",
      current_stage: "EN COMISIÓN",
      stage_date: "2025-10-20",
      project_date: "2025-10-12",
      summary: "Propone modernización administrativa y financiera de EsSalud con mayor autonomía."
    },
    created_at: "2025-10-12T10:00:00Z",
    updated_at: "2025-10-20T10:00:00Z"
  },
  {
    id: "bill-006",
    legislation_id: "12238/2025-CR",
    legislation_type: "proyecto_de_ley",
    legislation_title: "PROYECTO DE LEY QUE DECLARA DE NECESIDAD PÚBLICA LA CONSTRUCCIÓN DEL NUEVO HOSPITAL GRAU",
    legislation_summary: "Declaración de necesidad pública para la construcción del nuevo Hospital Grau de EsSalud.",
    expert_commentary: "Infraestructura crítica para la red asistencial de Lima.",
    source_url: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/12238",
    status: "inbox",
    affected_areas: ["Financiamiento y Presupuesto"],
    risk_level: "medium",
    urgency_level: "medium",
    deadline: null,
    kanban_stage: "pleno",
    client_id: null,
    ai_analysis: {
      author: "López Vilela, Luis Humberto",
      parliamentary_group: "Fuerza Popular",
      current_stage: "DICTAMEN",
      stage_date: "2025-09-15",
      project_date: "2025-06-20",
      summary: "Dictamen favorable de la Comisión de Salud. Pendiente debate en Pleno."
    },
    created_at: "2025-06-20T10:00:00Z",
    updated_at: "2025-09-15T10:00:00Z"
  },
  {
    id: "bill-007",
    legislation_id: "12456/2025-CR",
    legislation_type: "proyecto_de_ley",
    legislation_title: "PROYECTO DE LEY QUE ESTABLECE LA UNIVERSALIDAD DE LA ATENCIÓN ONCOLÓGICA",
    legislation_summary: "Garantiza acceso universal a diagnóstico y tratamiento oncológico.",
    expert_commentary: null,
    source_url: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/12456",
    status: "inbox",
    affected_areas: ["Oncológico"],
    risk_level: "high",
    urgency_level: "high",
    deadline: "2025-12-15",
    kanban_stage: "pleno",
    client_id: null,
    ai_analysis: {
      author: "Ramos Espinoza, Patricia",
      parliamentary_group: "Podemos Perú",
      current_stage: "DICTAMEN",
      stage_date: "2025-10-01",
      project_date: "2025-07-15",
      summary: "Propone cobertura integral del Plan Esperanza y ampliación de centros oncológicos regionales."
    },
    created_at: "2025-07-15T10:00:00Z",
    updated_at: "2025-10-01T10:00:00Z"
  },
  {
    id: "bill-008",
    legislation_id: "09898/2024-CR",
    legislation_type: "proyecto_de_ley",
    legislation_title: "PROYECTO DE LEY DEL PLAN NACIONAL DE PREVENCIÓN Y CONTROL DEL CÁNCER CERVICOUTERINO",
    legislation_summary: "Establece el plan nacional para la prevención y control del cáncer cervicouterino.",
    expert_commentary: "Alineado con objetivos de la OMS para eliminación del cáncer cervical.",
    source_url: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/09898",
    status: "inbox",
    affected_areas: ["Oncológico", "General"],
    risk_level: "high",
    urgency_level: "high",
    deadline: "2025-11-30",
    kanban_stage: "tramite_final",
    client_id: null,
    ai_analysis: {
      author: "Fernández Florez, Matilde",
      parliamentary_group: "Fuerza Popular",
      current_stage: "APROBADO",
      stage_date: "2025-11-05",
      project_date: "2024-03-15",
      summary: "Aprobado por el Pleno. Pendiente autógrafa y promulgación."
    },
    created_at: "2024-03-15T10:00:00Z",
    updated_at: "2025-11-05T10:00:00Z"
  },
  {
    id: "bill-009",
    legislation_id: "10234/2024-CR",
    legislation_type: "proyecto_de_ley",
    legislation_title: "PROYECTO DE LEY QUE REGULA LA TELEMEDICINA EN EL PERÚ",
    legislation_summary: "Marco regulatorio para la prestación de servicios de salud mediante telemedicina.",
    expert_commentary: null,
    source_url: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/10234",
    status: "inbox",
    affected_areas: ["General"],
    risk_level: "medium",
    urgency_level: "medium",
    deadline: null,
    kanban_stage: "tramite_final",
    client_id: null,
    ai_analysis: {
      author: "Torres Saravia, Jorge",
      parliamentary_group: "Acción Popular",
      current_stage: "AUTÓGRAFA",
      stage_date: "2025-11-08",
      project_date: "2024-05-20",
      summary: "En proceso de promulgación. Define estándares técnicos y de calidad para telemedicina."
    },
    created_at: "2024-05-20T10:00:00Z",
    updated_at: "2025-11-08T10:00:00Z"
  },
  {
    id: "bill-010",
    legislation_id: "08567/2023-CR",
    legislation_type: "proyecto_de_ley",
    legislation_title: "PROYECTO DE LEY QUE MODIFICA LA LEY GENERAL DE SALUD",
    legislation_summary: "Modificaciones a la Ley N° 26842 para actualizar el sistema de salud.",
    expert_commentary: "Cambios estructurales importantes. Monitorear implementación.",
    source_url: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/08567",
    status: "published",
    affected_areas: ["General"],
    risk_level: "high",
    urgency_level: "low",
    deadline: null,
    kanban_stage: "publicado",
    client_id: "client-001",
    ai_analysis: {
      author: "Vásquez Chuquilín, Mirtha",
      parliamentary_group: "Frente Amplio",
      current_stage: "LEY PUBLICADA",
      stage_date: "2025-10-15",
      project_date: "2023-08-10",
      summary: "Publicada como Ley N° 32456. Vigente desde el 16 de octubre de 2025."
    },
    created_at: "2023-08-10T10:00:00Z",
    updated_at: "2025-10-15T10:00:00Z"
  },
  {
    id: "bill-011",
    legislation_id: "07890/2023-CR",
    legislation_type: "proyecto_de_ley",
    legislation_title: "PROYECTO DE LEY DE FINANCIAMIENTO SOSTENIBLE DEL SISTEMA DE SALUD",
    legislation_summary: "Establece mecanismos de financiamiento sostenible para el sector salud.",
    expert_commentary: null,
    source_url: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/07890",
    status: "declined",
    affected_areas: ["Financiamiento y Presupuesto"],
    risk_level: "low",
    urgency_level: "low",
    deadline: null,
    kanban_stage: "archivado",
    client_id: null,
    ai_analysis: {
      author: "Pérez Mimbela, Ricardo",
      parliamentary_group: "Renovación Popular",
      current_stage: "ARCHIVADO",
      stage_date: "2025-09-01",
      project_date: "2023-04-15",
      summary: "Archivado por acumulación con otro proyecto de ley similar."
    },
    created_at: "2023-04-15T10:00:00Z",
    updated_at: "2025-09-01T10:00:00Z"
  },
  {
    id: "bill-012",
    legislation_id: "13150/2025-CR",
    legislation_type: "proyecto_de_ley",
    legislation_title: "PROYECTO DE LEY QUE REGULA LOS BANCOS DE SANGRE Y HEMOTERAPIA",
    legislation_summary: "Nueva regulación para bancos de sangre y servicios de hemoterapia.",
    expert_commentary: null,
    source_url: "https://wb2server.congreso.gob.pe/spley-portal/#/expediente/2021/13150",
    status: "inbox",
    affected_areas: ["General"],
    risk_level: "medium",
    urgency_level: "medium",
    deadline: null,
    kanban_stage: "comision",
    client_id: null,
    ai_analysis: {
      author: "Sánchez Palomino, Rosa",
      parliamentary_group: "Perú Libre",
      current_stage: "PRESENTADO",
      stage_date: "2025-11-08",
      project_date: "2025-11-08",
      summary: "Propone actualización de estándares de calidad para hemoterapia."
    },
    created_at: "2025-11-08T10:00:00Z",
    updated_at: "2025-11-08T10:00:00Z"
  },
];

// Regulations from matriz_normas.xlsx
export const MOCK_REGULATIONS: PeruAlert[] = [
  {
    id: "norm-001",
    legislation_id: "RM-765-2025-MINSA",
    legislation_type: "norma",
    legislation_title: "Resolución Ministerial que aprueba la Guía de Práctica Clínica para el Diagnóstico y Tratamiento del Cáncer de Mama",
    legislation_summary: "Actualización de la guía clínica para cáncer de mama según evidencia científica actual.",
    expert_commentary: "Guía alineada con estándares internacionales NCCN.",
    source_url: "https://cdn.www.gob.pe/uploads/document/file/765-2025-minsa.pdf",
    status: "inbox",
    affected_areas: ["Oncológico"],
    risk_level: "high",
    urgency_level: "high",
    deadline: null,
    kanban_stage: "publicado",
    client_id: null,
    ai_analysis: {
      entity: "MINSA",
      publication_date: "2025-11-09",
      summary: "Define protocolos actualizados para detección temprana y tratamiento del cáncer de mama."
    },
    created_at: "2025-11-09T10:00:00Z",
    updated_at: "2025-11-09T10:00:00Z"
  },
  {
    id: "norm-002",
    legislation_id: "RD-456-2025-IETSI",
    legislation_type: "norma",
    legislation_title: "Resolución de IETSI que aprueba Dictamen de Evaluación de Tecnología Sanitaria para Pembrolizumab",
    legislation_summary: "Evaluación favorable para inclusión de Pembrolizumab en el petitorio farmacológico.",
    expert_commentary: null,
    source_url: "https://cdn.www.gob.pe/uploads/document/file/456-2025-ietsi.pdf",
    status: "inbox",
    affected_areas: ["Oncológico"],
    risk_level: "high",
    urgency_level: "high",
    deadline: null,
    kanban_stage: "publicado",
    client_id: null,
    ai_analysis: {
      entity: "IETSI",
      publication_date: "2025-11-08",
      summary: "Dictamen favorable para uso de inmunoterapia en cáncer de pulmón no microcítico."
    },
    created_at: "2025-11-08T10:00:00Z",
    updated_at: "2025-11-08T10:00:00Z"
  },
  {
    id: "norm-003",
    legislation_id: "RJ-123-2025-SIS",
    legislation_type: "norma",
    legislation_title: "Resolución Jefatural que aprueba Transferencia Financiera a IPRESS para Atención Oncológica",
    legislation_summary: "Transferencia de S/ 45,000,000 para atención oncológica en regiones.",
    expert_commentary: null,
    source_url: "https://cdn.www.gob.pe/uploads/document/file/123-2025-sis.pdf",
    status: "inbox",
    affected_areas: ["Financiamiento y Presupuesto", "Oncológico"],
    risk_level: "medium",
    urgency_level: "medium",
    deadline: null,
    kanban_stage: "publicado",
    client_id: null,
    ai_analysis: {
      entity: "SIS",
      publication_date: "2025-11-07",
      summary: "Asignación presupuestal para cobertura de tratamientos oncológicos en el SIS."
    },
    created_at: "2025-11-07T10:00:00Z",
    updated_at: "2025-11-07T10:00:00Z"
  },
  {
    id: "norm-004",
    legislation_id: "RM-789-2025-MINSA",
    legislation_type: "norma",
    legislation_title: "Resolución Ministerial que modifica el Reglamento de Establecimientos de Salud",
    legislation_summary: "Actualización de requisitos para licenciamiento de establecimientos de salud.",
    expert_commentary: null,
    source_url: "https://cdn.www.gob.pe/uploads/document/file/789-2025-minsa.pdf",
    status: "inbox",
    affected_areas: ["General"],
    risk_level: "medium",
    urgency_level: "low",
    deadline: null,
    kanban_stage: "publicado",
    client_id: null,
    ai_analysis: {
      entity: "MINSA",
      publication_date: "2025-11-06",
      summary: "Nuevos estándares de infraestructura y equipamiento para categorización."
    },
    created_at: "2025-11-06T10:00:00Z",
    updated_at: "2025-11-06T10:00:00Z"
  },
  {
    id: "norm-005",
    legislation_id: "RD-234-2025-INS",
    legislation_type: "norma",
    legislation_title: "Resolución Directoral que aprueba Bases para Adquisición de Equipos de Laboratorio",
    legislation_summary: "Proceso de adquisición de equipos de diagnóstico molecular.",
    expert_commentary: null,
    source_url: "https://cdn.www.gob.pe/uploads/document/file/234-2025-ins.pdf",
    status: "inbox",
    affected_areas: ["General"],
    risk_level: "low",
    urgency_level: "low",
    deadline: null,
    kanban_stage: "publicado",
    client_id: null,
    ai_analysis: {
      entity: "INS",
      publication_date: "2025-11-05",
      summary: "Adquisición de secuenciadores y equipos PCR para vigilancia epidemiológica."
    },
    created_at: "2025-11-05T10:00:00Z",
    updated_at: "2025-11-05T10:00:00Z"
  },
  {
    id: "norm-006",
    legislation_id: "RM-801-2025-MINSA",
    legislation_type: "norma",
    legislation_title: "Resolución Ministerial que aprueba Norma Técnica de Salud para Cuidados Paliativos",
    legislation_summary: "NTS para implementación de cuidados paliativos en el sistema de salud.",
    expert_commentary: "Norma esperada que fortalece el enfoque de cuidados integrales.",
    source_url: "https://cdn.www.gob.pe/uploads/document/file/801-2025-minsa.pdf",
    status: "inbox",
    affected_areas: ["Oncológico", "General"],
    risk_level: "high",
    urgency_level: "medium",
    deadline: null,
    kanban_stage: "publicado",
    client_id: null,
    ai_analysis: {
      entity: "MINSA",
      publication_date: "2025-11-04",
      summary: "Define estándares para unidades de cuidados paliativos y manejo del dolor."
    },
    created_at: "2025-11-04T10:00:00Z",
    updated_at: "2025-11-04T10:00:00Z"
  },
  {
    id: "norm-007",
    legislation_id: "RE-567-2025-SUSALUD",
    legislation_type: "norma",
    legislation_title: "Resolución de Superintendencia que aprueba Lineamientos de Supervisión de IAFAS",
    legislation_summary: "Nuevos lineamientos para supervisión de aseguradoras de salud.",
    expert_commentary: null,
    source_url: "https://cdn.www.gob.pe/uploads/document/file/567-2025-susalud.pdf",
    status: "inbox",
    affected_areas: ["Financiamiento y Presupuesto"],
    risk_level: "medium",
    urgency_level: "medium",
    deadline: null,
    kanban_stage: "publicado",
    client_id: null,
    ai_analysis: {
      entity: "SUSALUD",
      publication_date: "2025-11-03",
      summary: "Refuerza mecanismos de control de solvencia y calidad de IAFAS."
    },
    created_at: "2025-11-03T10:00:00Z",
    updated_at: "2025-11-03T10:00:00Z"
  },
  {
    id: "norm-008",
    legislation_id: "RD-345-2025-DIGEMID",
    legislation_type: "norma",
    legislation_title: "Resolución Directoral que actualiza el Petitorio Nacional Único de Medicamentos",
    legislation_summary: "Inclusión de 15 nuevos medicamentos oncológicos en el PNUME.",
    expert_commentary: "Incluye nuevos anticuerpos monoclonales para cáncer colorrectal.",
    source_url: "https://cdn.www.gob.pe/uploads/document/file/345-2025-digemid.pdf",
    status: "inbox",
    affected_areas: ["Oncológico"],
    risk_level: "high",
    urgency_level: "high",
    deadline: null,
    kanban_stage: "publicado",
    client_id: null,
    ai_analysis: {
      entity: "DIGEMID",
      publication_date: "2025-11-02",
      summary: "Actualización del petitorio con nuevas terapias dirigidas y biosimilares."
    },
    created_at: "2025-11-02T10:00:00Z",
    updated_at: "2025-11-02T10:00:00Z"
  },
  {
    id: "norm-009",
    legislation_id: "RM-812-2025-MINSA",
    legislation_type: "norma",
    legislation_title: "Resolución Ministerial que aprueba Plan de Implementación de Historia Clínica Electrónica",
    legislation_summary: "Plan nacional para implementación de HCE interoperable.",
    expert_commentary: null,
    source_url: "https://cdn.www.gob.pe/uploads/document/file/812-2025-minsa.pdf",
    status: "inbox",
    affected_areas: ["General"],
    risk_level: "medium",
    urgency_level: "low",
    deadline: null,
    kanban_stage: "publicado",
    client_id: null,
    ai_analysis: {
      entity: "MINSA",
      publication_date: "2025-11-01",
      summary: "Establece cronograma y estándares técnicos para digitalización de historias clínicas."
    },
    created_at: "2025-11-01T10:00:00Z",
    updated_at: "2025-11-01T10:00:00Z"
  },
  {
    id: "norm-010",
    legislation_id: "RJ-678-2025-ESSALUD",
    legislation_type: "norma",
    legislation_title: "Resolución de Gerencia General que aprueba Tarifario de Prestaciones para Terceros",
    legislation_summary: "Actualización del tarifario de servicios de salud de EsSalud.",
    expert_commentary: null,
    source_url: "https://cdn.www.gob.pe/uploads/document/file/678-2025-essalud.pdf",
    status: "inbox",
    affected_areas: ["Financiamiento y Presupuesto"],
    risk_level: "low",
    urgency_level: "low",
    deadline: null,
    kanban_stage: "publicado",
    client_id: null,
    ai_analysis: {
      entity: "ESSALUD",
      publication_date: "2025-10-30",
      summary: "Nuevas tarifas para atención de asegurados de otras IAFAS."
    },
    created_at: "2025-10-30T10:00:00Z",
    updated_at: "2025-10-30T10:00:00Z"
  },
  {
    id: "norm-011",
    legislation_id: "DS-015-2025-SA",
    legislation_type: "norma",
    legislation_title: "Decreto Supremo que aprueba el Reglamento de la Ley de Telemedicina",
    legislation_summary: "Reglamento de la Ley N° 32456 de Telemedicina.",
    expert_commentary: "Complementa la ley aprobada. Define aspectos operativos.",
    source_url: "https://cdn.www.gob.pe/uploads/document/file/015-2025-sa.pdf",
    status: "inbox",
    affected_areas: ["General"],
    risk_level: "high",
    urgency_level: "medium",
    deadline: null,
    kanban_stage: "publicado",
    client_id: null,
    ai_analysis: {
      entity: "PCM/MINSA",
      publication_date: "2025-10-28",
      summary: "Establece requisitos técnicos, de seguridad y privacidad para telemedicina."
    },
    created_at: "2025-10-28T10:00:00Z",
    updated_at: "2025-10-28T10:00:00Z"
  },
  {
    id: "norm-012",
    legislation_id: "RM-825-2025-MINSA",
    legislation_type: "norma",
    legislation_title: "Resolución Ministerial que aprueba Directiva de Gestión de Residuos Sólidos Hospitalarios",
    legislation_summary: "Nueva directiva para manejo de residuos en establecimientos de salud.",
    expert_commentary: null,
    source_url: "https://cdn.www.gob.pe/uploads/document/file/825-2025-minsa.pdf",
    status: "inbox",
    affected_areas: ["General"],
    risk_level: "low",
    urgency_level: "low",
    deadline: null,
    kanban_stage: "publicado",
    client_id: null,
    ai_analysis: {
      entity: "MINSA",
      publication_date: "2025-10-25",
      summary: "Actualiza protocolos de clasificación y disposición de residuos hospitalarios."
    },
    created_at: "2025-10-25T10:00:00Z",
    updated_at: "2025-10-25T10:00:00Z"
  },
];

// Combined alerts
export const ALL_MOCK_ALERTS: PeruAlert[] = [...MOCK_BILLS, ...MOCK_REGULATIONS];

// Helper functions
export function getAlertsByStage(stage: PeruAlert["kanban_stage"]): PeruAlert[] {
  return ALL_MOCK_ALERTS.filter(alert => alert.kanban_stage === stage);
}

export function getAlertCountByStage(): Record<PeruAlert["kanban_stage"], number> {
  return {
    comision: getAlertsByStage("comision").length,
    pleno: getAlertsByStage("pleno").length,
    tramite_final: getAlertsByStage("tramite_final").length,
    publicado: getAlertsByStage("publicado").length,
    archivado: getAlertsByStage("archivado").length,
  };
}

export function getRiskColor(risk: PeruAlert["risk_level"]): string {
  switch (risk) {
    case "high": return "text-destructive";
    case "medium": return "text-warning";
    case "low": return "text-success";
    default: return "text-muted-foreground";
  }
}

export function getRiskBgColor(risk: PeruAlert["risk_level"]): string {
  switch (risk) {
    case "high": return "bg-destructive/10 border-destructive/30";
    case "medium": return "bg-warning/10 border-warning/30";
    case "low": return "bg-success/10 border-success/30";
    default: return "bg-muted";
  }
}

export function getTypeLabel(type: PeruAlert["legislation_type"]): string {
  switch (type) {
    case "proyecto_de_ley": return "Proyecto de Ley";
    case "norma": return "Norma";
    default: return type;
  }
}

export function getTypeColor(type: PeruAlert["legislation_type"]): string {
  switch (type) {
    case "proyecto_de_ley": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "norma": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    default: return "bg-muted text-muted-foreground";
  }
}
