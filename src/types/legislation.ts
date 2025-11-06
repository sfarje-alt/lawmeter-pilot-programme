export interface AuthorizedBy {
  name: string;
  link: string;
}

export interface PortfolioMatch {
  portfolio: string;
  pattern: string;
}

export interface PGRPronouncement {
  consultation_number: string; // e.g., "C-213-2005"
  date: string;
  type: "Dictamen" | "Opinión Jurídica";
  issuer: string;
  issuer_position: string;
  conclusion_summary: string[];
  relevance_level: "low" | "medium" | "high";
  link: string;
  is_new?: boolean; // Marked as new when scraped
  scraped_date?: string; // Date when this pronouncement was scraped
}

export interface AITriage {
  processed: boolean;
  skipped: string | null;
  decision: "RELEVANT" | "MAYBE" | "IRRELEVANT";
  score: number;
  confidence: number;
  reasons: string[];
  is_relevant_for_client: boolean;
  client_relevance_level: "low" | "medium" | "high";
  client_relevance_reasons: string[];
  affected_units: string[];
  portfolio_priority: "low" | "medium" | "high";
  legal_stage: "enacted" | "proposal" | "draft" | "guidance" | "ruling" | "other" | null;
  change_type: string[];
  summary: string | null;
  alert_title: string | null;
  alert_bullets: string[];
  risk_level: "low" | "medium" | "high";
  risk_score_hint: number;
  deadline_detected: string | null;
  recommended_action: "ALERT_NOW" | "QUEUE_SUMMARY" | "IGNORE";
}

export interface Alert {
  title?: string;
  law_number?: string; // e.g., "Ley 7786"
  detail_link?: string;
  gaceta_link?: string; // Link a La Gaceta
  bill_project_link?: string; // Link al proyecto de ley original (PDF)
  title_id: string;
  publication_date: string; // Fecha de publicación
  effective_date: string; // "Rige a partir de"
  version?: string; // Versión de la norma
  norm_type: "Ley" | "Decreto Ejecutivo" | "Acuerdo" | "Reglamento";
  link?: string;
  issuing_entity?: string; // Ente emisor
  has_pdf?: boolean;
  pdf_files?: string[];
  text?: string;
  scraped_at: string;
  source: "SINALEVI" | "PGR";
  search_source: string;
  csv_in_force: string;
  ministry?: string; // Ministerio responsable (reemplaza portfolio)
  affected_norms?: string[]; // Normativa afectada
  modifying_norms?: string[]; // Normativa que modificó esta norma
  concordances?: string[]; // Concordancias
  regulations?: string[]; // Reglamentaciones
  transitory_articles?: string; // Artículos transitorios con plazos
  pgr_consultation_number?: string; // e.g., "C-213-2005" for PGR pronouncements
  pgr_type?: "Dictamen" | "Opinión Jurídica";
  pgr_issuer?: string; // Persona que emitió el pronunciamiento
  pgr_position?: string; // Puesto del emisor
  is_relevant: boolean;
  ministry_matches?: PortfolioMatch[];
  AI_triage: AITriage;
  monitoring_use: string;
  pgr_pronouncements?: PGRPronouncement[];
}

// ============= DIPUTADOS =============
export interface Diputado {
  numeroDeputado?: string; // Número de identificación del diputado
  numero?: string; // Alias para numeroDeputado (para display)
  nombre: string;
  partidoPolitico: string;
  logoPartido?: string; // URL del logo del partido
  rol?: string; // Ej: "Subjefe de fracción", "Firmante principal"
  fraccion?: string; // Fracción política del diputado
  provincia: string;
  foto?: string; // URL de la foto del diputado
  urlPerfil?: string; // URL del perfil en Delfino
  email?: string;
  telefono?: string;
  posicionVotacion?: "apoyo" | "oposicion" | "abstencion" | "desconocido";
}

// Para compatibilidad con código existente
export interface MP {
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  party?: string;
  votingPosition?: "support" | "oppose" | "abstain" | "unknown";
  constituency?: string;
}

// Para compatibilidad - deprecated, usar Diputado
export interface Deputy {
  id: string;
  name: string;
  party: string;
  role: "Firmante principal" | "Cofirmante";
  province: string;
  profileUrl?: string;
}

// ============= TEXTOS DEL PROYECTO =============
export interface TextoProyecto {
  fecha: string; // Fecha de la versión
  tipoTexto: string; // Ej: "Texto base", "Texto sustitutivo"
  urlPDF: string; // URL del documento PDF
}

// Para compatibilidad - deprecated, usar TextoProyecto
export interface ProjectText {
  date: string;
  textType: string;
  pdfUrl: string;
}

// ============= VOTACIONES =============
export interface VotoDetallado {
  nombreDiputado: string;
  partido: string;
  voto: "a_favor" | "en_contra" | "abstencion";
}

export interface RegistroVotacion {
  fecha: string;
  etapa: string; // Ej: "Primer Debate", "Segundo Debate"
  votosAFavor: number;
  votosEnContra: number;
  abstenciones: number;
  aprobado: boolean;
  votosDetallados?: VotoDetallado[];
}

// Para compatibilidad - deprecated, usar RegistroVotacion
export interface VotingRecord {
  date: string;
  stage: string;
  votesFor: number;
  votesAgainst: number;
  abstentions: number;
  passed: boolean;
  mpVotes?: Array<{
    mpName: string;
    party: string;
    vote: "for" | "against" | "abstain";
  }>;
}

// ============= INTERESADOS (STAKEHOLDERS) =============
export interface Interesado {
  nombre: string;
  organizacion?: string;
  posicion: "apoyo" | "oposicion" | "neutral";
  declaracion?: string;
}

// ============= PROYECTO DE LEY =============
export interface BillItem {
  // ========== INFORMACIÓN BÁSICA DEL PROYECTO ==========
  id: string; // Expediente (número de identificación) - Ej: "25285"
  titulo?: string; // Título del proyecto
  proposito?: string; // Propósito del proyecto - descripción detallada
  tipoProyecto?: string; // Tipo - Ej: "Proyecto de Ley"
  
  // ========== ESTADO Y FECHAS ==========
  estado?:
    | "Presentado"
    | "En comisión"
    | "Aprobado en Primer Debate"
    | "Aprobado en Segundo Debate"
    | "Retirado"
    | "Rechazado"
    | "Archivado"
    | "Aprobado en Primer Debate (Segunda Legislatura)"
    | "Aprobado en Segundo Debate (Segunda Legislatura)"
    | "Aprobado en Tercer Debate (Segunda Legislatura)"
    | "Dictaminado"
    | "Aprobado en Primer Debate (Primera Legislatura)"
    | "Aprobado en Segundo Debate (Primera Legislatura)"
    | "Aprobado"
    | "Vetado"
    | "Resellado"
    | "Admisibilidad de Reforma Constitucional";
  fechaPresentacion?: string; // Fecha de presentación - Ej: "5 NOV, 2025"
  fechaUltimaAccion?: string; // Fecha de última acción/modificación
  fechaEstimadaVotacion?: string; // Fecha estimada de votación (si existe)
  
  // ========== COMISIÓN ==========
  comisionAsignada?: string; // Ej: "Pendiente" o nombre específico
  urlComision?: string; // Link a la página de la comisión
  dictamenComision?: string; // Dictamen de comisión (si existe)
  
  // ========== DIPUTADOS INVOLUCRADOS ==========
  firmantePrincipal?: Diputado; // Diputado autor principal
  coProponentes?: Diputado[]; // Lista de diputados co-proponentes
  
  // ========== CATEGORÍAS Y CLASIFICACIÓN ==========
  categorias?: string[]; // Áreas temáticas - Ej: ["Educación"]
  cartera?: string; // Cartera/Ministerio relacionado
  
  // ========== HISTÓRICO DE TEXTOS ==========
  textosProyecto?: TextoProyecto[]; // Versiones del documento
  
  // ========== HISTÓRICO DE VOTACIONES ==========
  registrosVotacion?: RegistroVotacion[]; // Lista de votaciones realizadas
  
  // ========== RESUMEN Y ANÁLISIS ==========
  resumen?: string; // Resumen del proyecto
  puntosImportantes?: string[]; // Bullets con puntos clave
  nivelRiesgo?: "bajo" | "medio" | "alto" | "low" | "medium" | "high"; // Nivel de riesgo/impacto (soporta español e inglés)
  puntajeRiesgo?: number; // Puntaje numérico de riesgo
  
  // ========== ENLACES ==========
  urlProyecto?: string; // URL en Delfino - Ej: "https://delfino.cr/asamblea/proyecto/25285"
  urlLeyMadre?: string; // Link a la ley que se está modificando
  urlLeyModificatoria?: string; // Link a ley que modifica esta
  
  // ========== INTERESADOS ==========
  interesados?: Interesado[]; // Stakeholders y sus posiciones
  
  // ========== CAMPOS ADICIONALES ==========
  observaciones?: string; // Observaciones o notas
  proyectosRelacionados?: string[]; // IDs de proyectos relacionados
  numeroConsultas?: number; // Número de consultas realizadas
  
  // ========== CAMPOS DEPRECATED (mantener para compatibilidad) ==========
  title?: string; // usar titulo
  status?: BillItem["estado"]; // usar estado
  presentationDate?: string; // usar fechaPresentacion
  lastActionDate?: string; // usar fechaUltimaAccion
  assignedCommission?: string; // usar comisionAsignada
  commissionUrl?: string; // usar urlComision
  principalSigner?: Deputy; // usar firmantePrincipal
  coSigners?: Deputy[]; // usar coProponentes
  categories?: string[]; // usar categorias
  portfolio?: string; // usar cartera
  projectTexts?: ProjectText[]; // usar textosProyecto
  votingRecords?: VotingRecord[]; // usar registrosVotacion
  summary: string; // usar resumen
  bullets: string[]; // usar puntosImportantes
  risk_level: "low" | "medium" | "high"; // usar nivelRiesgo
  risk_score: number; // usar puntajeRiesgo
  motherActLink?: string; // usar urlLeyMadre
  amendmentActLink?: string; // usar urlLeyModificatoria
  projectUrl?: string; // usar urlProyecto
  stakeholders?: Array<{
    name: string;
    organization?: string;
    position: "support" | "oppose" | "neutral";
    statement?: string;
  }>; // usar interesados
  party?: string;
  mps?: MP[];
  chamber?: "House" | "Senate";
  stageLocation?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  visibility: "TEAM" | "PRIVATE";
  body: string;
  createdAt: string;
}

export interface StarredAlert {
  scope: "ACTS" | "BILLS";
  alertKey: string;
  comments: Comment[];
}

export interface FilterState {
  timeWindow: "1w" | "2w" | "4w" | "8w" | "12w" | "6m" | "1y" | "all";
  portfolios: string[];
  regulators: string[];
  types: string[];
  riskScoreRange: [number, number];
  parties: string[];
  mpSearch: string;
  searchText: string;
  riskLevels: ("low" | "medium" | "high")[];
  urgencyLevels: ("low" | "medium" | "high")[];
  hasDeadline: boolean | null;
  chambers: ("House" | "Senate")[];
  sortBy: "registered" | "effective" | "date" | "risk" | "relevance" | "deadline";
  sortOrder: "asc" | "desc";
}
