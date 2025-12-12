// ========== PERU LEGISLATION TYPES ==========
// Sistema jurídico peruano: Estado unitario, tradición civilista

import { RegionCode } from "@/components/regions/RegionConfig";

// Nivel territorial peruano (NO federal - Perú es Estado unitario)
export type PeruNivelTerritorial = "nacional" | "regional" | "municipal";

// Tipos de norma válidos para Perú
export type PeruTipoNorma = 
  | "ley"                    // Ley del Congreso
  | "decreto-legislativo"    // Decreto Legislativo (delegación legislativa)
  | "decreto-supremo"        // Decreto Supremo (Poder Ejecutivo)
  | "resolucion-ministerial" // Resolución Ministerial
  | "resolucion-directoral"  // Resolución Directoral
  | "ordenanza-regional"     // Ordenanza Regional (Gobiernos Regionales)
  | "ordenanza-municipal"    // Ordenanza Municipal (Municipalidades)
  | "ntp";                   // Norma Técnica Peruana (INACAL - voluntaria)

// Estados para instrumentos vinculantes
export type PeruEstadoVinculante = 
  | "en-tramite"       // Pipeline: proyecto en el Congreso
  | "en-comision"      // Pipeline: en comisión dictaminadora
  | "primera-votacion" // Pipeline: aprobado en primera votación
  | "segunda-votacion" // Pipeline: aprobado en segunda votación
  | "autografa"        // Pipeline: autógrafa enviada al Ejecutivo
  | "promulgada"       // En vigor: promulgada pero no vigente aún
  | "vigente"          // En vigor: actualmente vigente
  | "derogada";        // Histórico: derogada/sin efecto

// Estados para NTP (estándares voluntarios)
export type PeruEstadoNTP = 
  | "publicada"    // NTP publicada por INACAL
  | "vigente"      // NTP actualmente aplicable (voluntaria)
  | "revisada"     // NTP actualizada/revisada
  | "retirada";    // NTP retirada/obsoleta

// Departamentos de Perú
export const PERU_DEPARTAMENTOS = [
  { code: "AMA", name: "Amazonas" },
  { code: "ANC", name: "Áncash" },
  { code: "APU", name: "Apurímac" },
  { code: "ARE", name: "Arequipa" },
  { code: "AYA", name: "Ayacucho" },
  { code: "CAJ", name: "Cajamarca" },
  { code: "CAL", name: "Callao" },
  { code: "CUS", name: "Cusco" },
  { code: "HUV", name: "Huancavelica" },
  { code: "HUA", name: "Huánuco" },
  { code: "ICA", name: "Ica" },
  { code: "JUN", name: "Junín" },
  { code: "LAL", name: "La Libertad" },
  { code: "LAM", name: "Lambayeque" },
  { code: "LIM", name: "Lima" },
  { code: "LOR", name: "Loreto" },
  { code: "MDD", name: "Madre de Dios" },
  { code: "MOQ", name: "Moquegua" },
  { code: "PAS", name: "Pasco" },
  { code: "PIU", name: "Piura" },
  { code: "PUN", name: "Puno" },
  { code: "SAM", name: "San Martín" },
  { code: "TAC", name: "Tacna" },
  { code: "TUM", name: "Tumbes" },
  { code: "UCA", name: "Ucayali" }
] as const;

export type PeruDepartamentoCode = typeof PERU_DEPARTAMENTOS[number]["code"];

// Categorías regulatorias en español
export const PERU_CATEGORIAS_REGULATORIAS = [
  "Medio Ambiente",
  "Seguridad de Producto",
  "Telecomunicaciones",
  "Energía",
  "Protección al Consumidor",
  "Salud y Seguridad Laboral",
  "Alimentos y Bebidas",
  "Materiales en Contacto con Alimentos"
] as const;

export type PeruCategoriaRegulatoria = typeof PERU_CATEGORIAS_REGULATORIAS[number];

// Autoridades peruanas principales
export const PERU_AUTORIDADES = {
  // Emisoras
  congreso: "Congreso de la República",
  ejecutivo: "Poder Ejecutivo",
  pcm: "Presidencia del Consejo de Ministros",
  minem: "Ministerio de Energía y Minas",
  minam: "Ministerio del Ambiente",
  minsa: "Ministerio de Salud",
  mtc: "Ministerio de Transportes y Comunicaciones",
  produce: "Ministerio de la Producción",
  mtpe: "Ministerio de Trabajo y Promoción del Empleo",
  inacal: "INACAL - Instituto Nacional de Calidad",
  indecopi: "INDECOPI",
  
  // Fiscalizadoras/Supervisoras
  oefa: "OEFA - Organismo de Evaluación y Fiscalización Ambiental",
  osinergmin: "OSINERGMIN - Organismo Supervisor de la Inversión en Energía y Minería",
  osiptel: "OSIPTEL - Organismo Supervisor de Inversión Privada en Telecomunicaciones",
  sunafil: "SUNAFIL - Superintendencia Nacional de Fiscalización Laboral",
  digesa: "DIGESA - Dirección General de Salud Ambiental",
  sanipes: "SANIPES - Organismo Nacional de Sanidad Pesquera"
} as const;

// Interfaz principal para alertas de legislación peruana
export interface PeruLegislationItem {
  id: string;
  
  // === Identificación ===
  identificador: string;           // Número/código de la norma (ej: "Ley N° 31234")
  titulo: string;
  resumen: string;
  puntosClave?: string[];          // Bullets de cambios principales
  
  // === Jurisdicción (Estado unitario) ===
  pais: "PE";
  nivel: PeruNivelTerritorial;     // nacional | regional | municipal
  departamento?: PeruDepartamentoCode; // Solo si nivel = regional o municipal
  municipio?: string;              // Solo si nivel = municipal
  
  // === Clasificación del instrumento ===
  tipoNorma: PeruTipoNorma;
  esVinculante: boolean;           // true para leyes/decretos/resoluciones; false para NTP
  
  // === Autoridades (separación emisor/fiscalizador) ===
  autoridadEmisora: string;        // Quien dicta la norma
  autoridadFiscalizadora?: string; // Quien supervisa/fiscaliza/sanciona (si aplica)
  autoridadesCompetentes?: string[]; // Array de autoridades involucradas
  
  // === Estado/Lifecycle ===
  estado: PeruEstadoVinculante | PeruEstadoNTP;
  estadoGenerico: "pipeline" | "vigente" | "historico";
  indiceEtapaActual?: number;      // Para proyectos en trámite
  
  // === Fechas ===
  fechaPublicacion: string;        // Fecha de publicación
  fuentePublicacion: string;       // "El Peruano", "Diario Oficial", etc.
  fechaEntradaVigencia?: string;   // Puede diferir de publicación
  fechaLimiteCumplimiento?: string; // Deadline de cumplimiento
  regimenTransitorio?: string;     // Descripción del régimen transitorio
  
  // === Evaluación de riesgo ===
  nivelRiesgo: "alto" | "medio" | "bajo";
  puntajeRiesgo: number;           // 0-100
  
  // === Categorización ===
  categoria: PeruCategoriaRegulatoria;
  sector?: string;
  obligacionesAfectadas?: string[];
  areasImpacto?: string[];
  
  // === Contenido enriquecido ===
  textoCompleto?: string;
  resumenIA?: {
    queCambia: string;
    afectados: string;
    fechaClave: string;
    calificadorVoluntariedad?: string; // Solo para NTP
    explicacionRiesgo?: string;
    actoresClave?: string[];
    
    // === Análisis Profundo ===
    resumenEjecutivo?: string;
    
    // Estadísticas de impacto
    estadisticas?: {
      empresasAfectadasEstimadas?: number;
      costoEstimadoCumplimiento?: { min: number; max: number; moneda: string };
      impactoMercado?: string;
      tiempoImplementacionMeses?: number;
      rangoSanciones?: { min: number; max: number; moneda: string; unidad?: string }; // UIT para Perú
      puntajeComplejidad?: number; // 1-10
    };
    
    // Evaluación de riesgo detallada
    analisisRiesgo?: {
      puntajeRiesgoGeneral: number;
      desglosePorCategoria: Array<{
        categoria: string;
        puntaje: number;
        descripcion: string;
        estrategiaMitigacion?: string;
      }>;
      probabilidadFiscalizacion?: "alta" | "media" | "baja";
      responsabilidadesPotenciales?: string[];
      evaluacionRiesgoCompetitivo?: string;
    };
    
    // Análisis de actores clave
    analisisActores?: Array<{
      actor: string;
      tipo: "interno" | "externo" | "regulador" | "industria";
      nivelImpacto: "alto" | "medio" | "bajo";
      descripcionImpacto: string;
      accionesRequeridas?: string[];
      cronograma?: string;
    }>;
    
    // Requisitos de cumplimiento
    requisitosCumplimiento?: Array<{
      requisito: string;
      prioridad: "critica" | "alta" | "media" | "baja";
      fechaLimite?: string;
      esfuerzoEstimado?: string;
      areaResponsable?: string;
    }>;
    
    // Recomendaciones estratégicas
    recomendacionesEstrategicas?: Array<{
      titulo: string;
      descripcion: string;
      prioridad: "inmediata" | "corto-plazo" | "mediano-plazo" | "largo-plazo";
      recursosNecesarios?: string;
    }>;
    
    // Legislación relacionada
    legislacionRelacionada?: Array<{
      identificador: string;
      titulo: string;
      relacion: "modifica" | "deroga" | "implementa" | "relacionada" | "conflicto";
      relevancia: string;
    }>;
    
    // Benchmarks de la industria
    benchmarksIndustria?: {
      tiempoPromedioCumplimiento?: string;
      nivelPreparacionIndustria?: string;
      tasaAdopcionCompetidores?: string;
      mejoresPracticas?: string[];
    };
  };
  
  // === Fuentes ===
  linkFuente?: string;             // URL a la norma
  urlTexto?: string;
  
  // === Historial ===
  acciones?: Array<{
    fecha: string;
    descripcion: string;
    organo?: string;
  }>;
  votaciones?: Array<{
    camara: string;
    fecha: string;
    aFavor: number;
    enContra: number;
    abstenciones: number;
    aprobado: boolean;
  }>;
  
  // === Estado de lectura ===
  leido?: boolean;
  destacado?: boolean;
}

// Etiquetas de UI en español para Perú
export const PERU_UI_LABELS = {
  // Niveles (NO usar "Federal")
  niveles: {
    nacional: "Nacional",
    regional: "Regional",
    municipal: "Municipal/Local"
  },
  
  // Tipos de norma
  tiposNorma: {
    "ley": "Ley",
    "decreto-legislativo": "Decreto Legislativo",
    "decreto-supremo": "Decreto Supremo",
    "resolucion-ministerial": "Resolución Ministerial",
    "resolucion-directoral": "Resolución Directoral",
    "ordenanza-regional": "Ordenanza Regional",
    "ordenanza-municipal": "Ordenanza Municipal",
    "ntp": "Norma Técnica Peruana (NTP)"
  },
  
  // Estados para vinculantes
  estadosVinculantes: {
    "en-tramite": "En Trámite",
    "en-comision": "En Comisión",
    "primera-votacion": "Primera Votación",
    "segunda-votacion": "Segunda Votación",
    "autografa": "Autógrafa",
    "promulgada": "Promulgada",
    "vigente": "Vigente",
    "derogada": "Derogada"
  },
  
  // Estados para NTP
  estadosNTP: {
    "publicada": "NTP: Publicada",
    "vigente": "NTP: Vigente",
    "revisada": "NTP: Revisada/Actualizada",
    "retirada": "NTP: Retirada"
  },
  
  // Etiquetas de filtros
  filtros: {
    nivel: "Nivel",
    departamento: "Departamento",
    tipoNorma: "Tipo de Norma",
    estado: "Estado",
    categoria: "Categoría",
    autoridadEmisora: "Autoridad Emisora",
    autoridadFiscalizadora: "Ente Fiscalizador",
    nivelRiesgo: "Nivel de Riesgo"
  },
  
  // Etiquetas de tarjeta
  tarjeta: {
    vigente: "Vigente",
    enTramite: "En Trámite",
    publicado: "Publicado",
    vence: "Vence",
    resumenIA: "Resumen IA",
    detalles: "Detalles",
    fiscalizacion: "Fiscalización/Supervisión",
    voluntario: "Voluntario",
    obligatorio: "Obligatorio"
  },
  
  // Calificador NTP
  calificadorNTP: "De aplicación voluntaria salvo referencia en un reglamento técnico u otra disposición obligatoria, contratación pública o norma sectorial."
};

// Helper para determinar si mostrar departamento
export function mostrarDepartamento(nivel: PeruNivelTerritorial): boolean {
  return nivel === "regional" || nivel === "municipal";
}

// Helper para obtener etiqueta de estado según tipo
export function obtenerEtiquetaEstado(
  estado: PeruEstadoVinculante | PeruEstadoNTP, 
  esVinculante: boolean
): string {
  if (esVinculante) {
    return PERU_UI_LABELS.estadosVinculantes[estado as PeruEstadoVinculante] || estado;
  }
  return PERU_UI_LABELS.estadosNTP[estado as PeruEstadoNTP] || estado;
}

// Helper para generar resumen IA apropiado para NTP
export function generarResumenNTP(titulo: string, cambios: string): {
  queCambia: string;
  afectados: string;
  fechaClave: string;
  calificadorVoluntariedad: string;
} {
  return {
    queCambia: `Actualiza/adopta requisitos técnicos: ${cambios}`,
    afectados: "Fabricantes, importadores y certificadoras de productos sujetos a evaluación de la conformidad",
    fechaClave: "Aplicable desde su publicación por INACAL",
    calificadorVoluntariedad: PERU_UI_LABELS.calificadorNTP
  };
}
